import { OrbitDataQuery } from "../fetch/queries/0rbit.js";
import { dataQuery } from "./queries/dataQuery.js";
import {parseGraphqlResponse} from "../fetch/utils/parseGraphqlResponse.js"
import fs from "fs";
import axios from 'axios';
import { dryrun } from "@permaweb/aoconnect/node";

// const tagActionKey = "X-Action";
// const actions = ["Post-Real-Data", "Get-Real-Data"];
// const userIdKey = "Sender";
// const projectID = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ";
// const tokenId = "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"

export async function getData(projectId, actionTag) {
    let allData = [];
    const fileName = "postOrbit.json";
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        allData = JSON.parse(fileContent);
        console.log(`Loaded ${allData.length} records from ${fileName}`);
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error.message);
        console.log('Starting with an empty array');
    }
    let cursor = null
    while (true) {
        const query = dataQuery(actionTag, cursor, projectId);
        const response =  await axios.post('https://arweave-search.goldsky.com/graphql', query, {
            headers: { 'Content-Type': 'application/json' }
        });
        // sleep for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        const parsedData = parseGraphqlResponse(response.data)
        console.log('go', parsedData.data.length, 'records. Cursor:', cursor)
        allData.push(...parsedData.data);
        fs.writeFileSync(fileName, JSON.stringify(allData, null, 2));

        cursor = parsedData.nextPageCursor;
        if (!cursor || parsedData.data.length == 0) {
            break;
        }
    }
    
}

export function combineData() {
    const postData = JSON.parse(fs.readFileSync('postOrbit.json', 'utf8'));
    const getData = JSON.parse(fs.readFileSync('getOrbit.json', 'utf8'));

    const combinedData = postData.concat(getData);

    // sort by timestamp ascending
    combinedData.sort((a, b) => a.timestamp - b.timestamp);
    fs.writeFileSync('fullOrbit.json', JSON.stringify(combinedData, null, 2));
}



// Total Message activity - y axis is the number of messages. X axis is time. Line graph for messages sent each day
export function totalMessageActivity({tagActionKey, actions}) {
    
    const data = JSON.parse(fs.readFileSync('fullOrbit.json', 'utf8'));
    
    const messageActivity = {};

    data.forEach(item => {
        const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
        const action = item.tags[tagActionKey];
        
        if (actions.includes(action)) {
            if (!messageActivity[date]) {
                messageActivity[date] = { total: 0 };
                actions.forEach(a => messageActivity[date][a] = 0);
            }
            messageActivity[date][action]++;
            messageActivity[date].total++;
        }
    });

    // Convert messageActivity object to an array of { date, total, "Post-Real-Data", "Get-Real-Data" }
    const result = Object.entries(messageActivity).map(([date, counts]) => ({
        date,
        ...counts
    }));

    // Sort the result array by date in ascending order
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // calculate the Message Distribution
    const totalMessages = result.reduce((sum, item) => sum + item.total, 0);
    result.forEach(item => {
        item.distribution = {};
        actions.forEach(action => {
            item.distribution[action] = item[action] / totalMessages;
        });
    });

    // write to file
    fs.writeFileSync('totalMessageActivity.json', JSON.stringify(result, null, 2));

    // Calculate the total message distribution for each action
    const totalCounts = actions.reduce((acc, action) => {
        acc.push({
            name: action,
            count: result.reduce((sum, item) => sum + item[action], 0)
        });
        return acc;
    }, []);

    // write to file
    fs.writeFileSync('totalMessageDistribution.json', JSON.stringify(totalCounts, null, 2));
    
    return result;
    
}

// Total users - how many unique users sent a message each day. Y axis addresses that sent a message. X axis is time
export function totalUserActivity({actions, userIdKey}) {
    const data = JSON.parse(fs.readFileSync('fullOrbit.json', 'utf8'));
    const userActivity = {};

    data.forEach(item => {
        const user = item.tags[userIdKey];
        const action = item.tags[tagActionKey];
        const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];

        if (!userActivity[date]) {
            userActivity[date] = { total: new Set(), [action]: new Set(), addresses: new Set() };
        } else if (!userActivity[date][action]) {
            userActivity[date][action] = new Set();
        }

        userActivity[date][action].add(user);
        userActivity[date].total.add(user);
        userActivity[date].addresses.add(user);
    });

    // write to file
    // fs.writeFileSync('temptotalUserActivity.json', JSON.stringify(userActivity, null, 2));


    // Convert userActivity object to an array of { date, total, "Post-Real-Data", "Get-Real-Data", addresses }
    const result = Object.entries(userActivity).map(([date, counts]) => {
        const entry = { date, total: counts.total.size, addresses: Array.from(counts.addresses) };
        actions.forEach(action => {
            entry[action] = counts[action]?.size || 0;
        });
        return entry;
    });

    // Sort the result array by date in ascending order
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    // write to file
    fs.writeFileSync('totalUserActivity.json', JSON.stringify(result, null, 2));

     // Calculate DAU, WAU, and MAU
     const calculateActiveUsers = (data, windowSize) => {
        return data.map((entry, index) => {
            const window = data.slice(Math.max(0, index - windowSize + 1), index + 1);
            const uniqueUsers = new Set(window.flatMap(item => item.addresses));
            return {
                date: entry.date,
                activeUsers: uniqueUsers.size
            };
        });
    };

    const dau = result.map(entry => ({ date: entry.date, activeUsers: entry.total }));
    const wau = calculateActiveUsers(result, 7);
    const mau = calculateActiveUsers(result, 30);

    // Combine DAU, WAU, and MAU into a single array
    const combinedMetrics = result.map((entry, index) => ({
        date: entry.date,
        dau: dau[index].activeUsers,
        wau: wau[index].activeUsers,
        mau: mau[index].activeUsers
    }));

    // Write combined metrics to file
    fs.writeFileSync('userActivityMetrics.json', JSON.stringify(combinedMetrics, null, 2));


    // Unique users - cumulative count of unique addresses sending messages over time
    const allUsers = new Set();
    const uniqueUsers = data.reduce((acc, item) => {
        const user = item.tags[userIdKey];
        const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
        allUsers.add(user);
        acc[date] = allUsers.size;
        return acc;
    }, {});

    // Convert to array of objects and sort by date
    const uniqueUsersArray = Object.entries(uniqueUsers).map(([date, count]) => ({ date, count }));
    uniqueUsersArray.sort((a, b) => new Date(a.date) - new Date(b.date));


    // write to file
    fs.writeFileSync('uniqueUsers.json', JSON.stringify(uniqueUsersArray, null, 2));

    return result;
    
}

export async function tokenBalances(tokenId) {
    // call dry run on process
    const result = await dryrun({
        process: tokenId,
        tags: [
          { name: "Action", value: "Balances" },
        ],
      });
    const balances = result.Messages[0].Data
    // object of balances 
    const balancesObj = JSON.parse(balances); // key is the address, value is the string balance
    // convert the string balance to a number and sort by balance descending
    const balancesNum = Object.fromEntries(Object.entries(balancesObj)
    .filter(([address, balance]) => balance !== "0")
    .map(([address, balance]) => [address, parseInt(balance)]));
    // sort by balance descending
    const sortedBalances = Object.fromEntries(Object.entries(balancesNum).sort((a, b) => b[1] - a[1]));

    // make into an array of objects with address and quantity
    const balancesArray = Object.entries(sortedBalances).map(([address, quantity]) => ({ address, quantity }));
    // write to file
    fs.writeFileSync('tokenBalances.json', JSON.stringify(balancesArray, null, 2));

}

totalUserActivity()
// totalMessageActivity();
// tokenBalances();
