import { dataQuery } from "./queries/dataQuery.js";
import { OrbitProjectId, OrbitToken, OrbitActions } from "./queries/0rbit.js";
import { ApusProjectProcessId, ApusToken, ApusActions } from "./queries/Apus.js";
import { OutcomeProjectProcessId, OutcomeToken, OutcomeActions } from "./queries/Outcome.js";
import {parseGraphqlResponse} from "../fetch/utils/parseGraphqlResponse.js"
import fs from "fs";
import axios from 'axios';
import { dryrun } from "@permaweb/aoconnect/node";

// const tagActionKey = "X-Action";
// const actions = ["Post-Real-Data", "Get-Real-Data"];
// const userIdKey = "tags.Sender";
// const projectID = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ";
// const tokenId = "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"

// Orbit
// const tagActionKey = "X-Action";
// const actions = ["Post-Real-Data", "Get-Real-Data"];
// const userIdKey = "tags.Sender";
// const projectId = OrbitProjectId
// const tokenId = OrbitToken

// Apus
const tagActionKey = "Action";
const actions = ApusActions;
const userIdKey = "owner";
const projectId = ApusProjectProcessId
const tokenId = ApusToken

// Outcome
// const tagActionKey = "Action";
// const actions = ["Claim", "Buy"];
// const cursors = {
//     "Buy": "eyJzZWFyY2hfYWZ0ZXIiOlsxNDQyNTU3LCItQmZJUEtkTVZ2U2RrZl9ldmtRSVNQVHJGWTdPaFlZUEVRVl83QnczQjM0Il0sImluZGV4IjoxNDA5OX0=",
//     "Claim": "eyJzZWFyY2hfYWZ0ZXIiOlsxNDYzMjI2LCJRTFYxdnZJS0hLMk1aSi1PODE1RWw2RWNqZmJBUDFYajJOZ3NQN2U2ckZBIl0sImluZGV4IjoxNTY5OX0="
// }
// const userIdKey = "owner";
// const projectId = OutcomeProjectProcessId
// const tokenId = OutcomeToken
// const startingDate = "2024-06-01"

const dataDir = `data_files/${projectId}`
const rawDataDir = `data_files/raw_data/${projectId}`;
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(rawDataDir)) {
    fs.mkdirSync(rawDataDir, { recursive: true });
}

// Get all the Raw Data
async function getRawData() {
for (const action of actions) {
        await getData(projectId, {name: tagActionKey, value: action}, cursors[action])
    }
}
// await getRawData()

function getNestedValue(obj, path) {
    if (typeof path === 'string') {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    } else if (Array.isArray(path)) {
        return path.reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    } else {
        return obj[path];
    }
}

export async function getData(projectId, actionTag, startingOptionalCursor) {
    let allData = {}; // id: value to easily avoid duplicates
    const dir = `data_files/raw_data/${projectId}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const fileName = `${dir}/${actionTag.value}.json`;
    try {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        allData = JSON.parse(fileContent);
        console.log(`Loaded ${Object.keys(allData).length} records from ${fileName}`);
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error.message);
        console.log('Starting with an empty array');
    }

    let cursor = startingOptionalCursor || null

    while (true) {
        const query = dataQuery(actionTag, cursor, projectId);
        try {
            const response =  await axios.post('https://arweave-search.goldsky.com/graphql', query, {
                headers: { 'Content-Type': 'application/json' }
            });
             // sleep for 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));
            const parsedData = parseGraphqlResponse(response.data)
            cursor = parsedData.nextPageCursor;
            console.log('got', parsedData.data.length, 'records. Cursor:', cursor ? cursor : 'null')
            const lastDate = new Date(parsedData.data[parsedData.data.length-1].timestamp*1000).toISOString().split('T')[0]
            console.log("got data till", lastDate)
            parsedData.data.forEach(item => {
                const itemDate = new Date(item.timestamp*1000).toISOString().split('T')[0]
                if (itemDate < startingDate) {
                    return;
                }
                allData[item.id] = item;
            });
            if (lastDate < startingDate) {
                break;
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            console.log('Retrying...');
            console.log("query", query.query)
            console.log(error.response?.data)
            throw new Error('Error fetching data');
        }
       
        fs.writeFileSync(fileName, JSON.stringify(allData, null, 2));
        if (!cursor) {
            break;
        }
    }
    
}




export function combineData() {
    // combine all files in the directory
    const files = fs.readdirSync(rawDataDir);
    const combinedData = [];
    files.forEach(file => {
        const data = JSON.parse(fs.readFileSync(`${rawDataDir}/${file}`, 'utf8'));
        const dataValues = Object.values(data);
        combinedData.push(...dataValues);
    });
    // const postData = JSON.parse(fs.readFileSync(`${dir}/Post-Real-Data.json`, 'utf8'));
    // const getData = JSON.parse(fs.readFileSync(`${dir}/Get-Real-Data.json`, 'utf8'));

    // const combinedData = postData.concat(getData);

    // sort by timestamp ascending
    combinedData.sort((a, b) => a.timestamp - b.timestamp);
   
    fs.writeFileSync(dataDir+'/fullData.json', JSON.stringify(combinedData, null, 2));
    return combinedData
}




// Total Message activity - y axis is the number of messages. X axis is time. Line graph for messages sent each day
export function getMessageActivityData(fullData) {
    
    // const fullData = JSON.parse(fs.readFileSync('fullOrbit.json', 'utf8'));
    
    const messageActivity = {};

    fullData.forEach(item => {
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
    fs.writeFileSync(dataDir+'/totalMessageActivity.json', JSON.stringify(result, null, 2));

    // Calculate the total message distribution for each action
    const totalCounts = actions.reduce((acc, action) => {
        acc.push({
            name: action,
            count: result.reduce((sum, item) => sum + item[action], 0)
        });
        return acc;
    }, []);

    // write to file
    fs.writeFileSync(dataDir+'/totalMessageDistribution.json', JSON.stringify(totalCounts, null, 2));
    
    return {totalMessageActivity: result, totalMessageDistribution: totalCounts};
    
}

// Total users - how many unique users sent a message each day. Y axis addresses that sent a message. X axis is time
export function getUserActivityData(fullData) {
    // const fullData = JSON.parse(fs.readFileSync('fullOrbit.json', 'utf8'));
    const userActivity = {};

    fullData.forEach(item => {
        // userId key can be nested like this - tags.Sender
        const user = getNestedValue(item, userIdKey);
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
    fs.writeFileSync(dataDir+'/totalUserActivity.json', JSON.stringify(result, null, 2));

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
    fs.writeFileSync(dataDir+'/userActivityMetrics.json', JSON.stringify(combinedMetrics, null, 2));


    // Unique users - cumulative count of unique addresses sending messages over time
    const allUsers = new Set();
    const uniqueUsers = fullData.reduce((acc, item) => {
        const user = getNestedValue(item, userIdKey);
        const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
        allUsers.add(user);
        acc[date] = allUsers.size;
        return acc;
    }, {});

    // Convert to array of objects and sort by date
    const uniqueUsersArray = Object.entries(uniqueUsers).map(([date, count]) => ({ date, count }));
    uniqueUsersArray.sort((a, b) => new Date(a.date) - new Date(b.date));


    // write to file
    fs.writeFileSync(dataDir+'/uniqueUsers.json', JSON.stringify(uniqueUsersArray, null, 2));

    return {totalUserActivity: result, userActivityMetrics: combinedMetrics, uniqueUsers: uniqueUsersArray};
    
}

export async function getTokenBalances(tokenId) {
    // call dry run on process
    console.log("fetching token balances:", tokenId)
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
    fs.writeFileSync(dataDir+'/tokenBalances.json', JSON.stringify(balancesArray, null, 2));

    return {tokenBalances: balancesArray};
}




// getData(OrbitProjectId, {name: "X-Action", value: "Post-Real-Data"})
// getData(OrbitProjectId, {name: "X-Action", value: "Get-Real-Data"})


const fullData = combineData()
const {totalUserActivity, userActivityMetrics, uniqueUsers} = getUserActivityData(fullData)
const {totalMessageActivity, totalMessageDistribution} = getMessageActivityData(fullData);
const {tokenBalances} = await getTokenBalances(tokenId);

// write to a ts file
fs.writeFileSync(dataDir+'/data.ts', `export const messageDistribution = ${JSON.stringify(totalMessageDistribution, null, 2)};\nexport const messageActivity = ${JSON.stringify(totalMessageActivity, null, 2)};\nexport const uniqueUsersData = ${JSON.stringify(uniqueUsers, null, 2)};\nexport const userMetrics = ${JSON.stringify(userActivityMetrics, null, 2)};\nexport const tokenBalances = ${JSON.stringify(tokenBalances, null, 2)};\n`);
