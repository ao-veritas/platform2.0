const axios = require('axios');
// import schedule from 'node-schedule';

const projects = [
    "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
    "WSXUI2JjYUldJ7CKq9wE1MGwXs-ldzlUlHOQszwQe0s"
];

async function fetchCount() {
    let totalCount = 0;

    // CALCULATE 24 HOUR AGO BLOCK

    for (const project of projects) {

            const query = {
                query: `
                {
                    transactions(
                        recipients: "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ"
                        block:{
                            min: 1480000
                        }
                    ) {
                        count
                    }
                }`
            };

            try {
                const response = await axios.post('https://arweave-search.goldsky.com/graphql', query, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = response.data;
                console.log(`${project}, Count: ${data}`)
                // if (data.data && data.data.transactions && data.data.transactions.count) {
                //     totalCount += data.data.transactions.count;
                // }
            } catch (error) {
                console.error(`Error fetching data for recipient ${project}:`, error);
            }

    }

    // console.log(`Total transactions count: ${totalCount}`);
}
fetchCount();

// export default fetchCount;

