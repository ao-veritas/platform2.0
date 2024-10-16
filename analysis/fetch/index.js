import axios from 'axios';
// import schedule from 'node-schedule';

const recipients = [
    "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
    "WSXUI2JjYUldJ7CKq9wE1MGwXs-ldzlUlHOQszwQe0s"
];

const tags = [
    { name: "X-Action", values: "Get-Real-Data" },
    // { name: "Action", values: "Get-Real-Data" },
    { name: "X-Action", values: "Post-Real-Data" },
    // { name: "Action", values: "Post-Real-Data" }
];

async function fetchData() {
    let totalCount = 0;

    for (const recipient of recipients) {
        for (const tag of tags) {
            const query = {
                query: `
                {
                    transactions(
                      recipients: "${recipient}",

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
                // console.log(data)
                // console.log(data)
                // console.log(data)
                if (data.data && data.data.transactions && data.data.transactions.count) {
                    totalCount += data.data.transactions.count;
                }
            } catch (error) {
                console.error(`Error fetching data for recipient ${recipient} and tag ${tag.name}=${tag.values}:`, error);
            }
        }
    }

    console.log(`Total transactions count: ${totalCount}`);
}

// Schedule the task to run every week
// schedule.scheduleJob('0 0 * * 0', () => {
//     console.log('Fetching data...');
//     fetchData();
// });

// Fetch data immediately on script run
fetchData();