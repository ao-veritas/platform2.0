import { OrbitDataQuery } from "../fetch/queries/0rbit.js";
import {parseGraphqlResponse} from "../fetch/utils/parseGraphqlResponse.js"
import fs from "fs";
import axios from 'axios';

async function getData() {
    const allData = [];
    let cursor = null;
    while (true) {
        const query = OrbitDataQuery("Get-Real-Data", cursor);
        const response =  await axios.post('https://arweave-search.goldsky.com/graphql', query, {
            headers: { 'Content-Type': 'application/json' }
        });
        // sleep for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        const parsedData = parseGraphqlResponse(response.data)
        console.log('got', parsedData.data.length, 'records. Cursor:', cursor)
        allData.push(...parsedData.data);
        fs.writeFileSync('data.json', JSON.stringify(allData, null, 2));

        cursor = parsedData.nextPageCursor;
        if (!cursor || parsedData.data.length == 0) {
            break;
        }
    }
    
}

getData();