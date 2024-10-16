

export const OrbitActions = ["Get-Real-Data", "Post-Real-Data"];
export const OrbitToken = "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"
export const OrbitProjectId = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ"

function OrbitDataQuery(actionTag, cursor) {
    if (!OrbitActions.includes(actionTag)) {
        throw new Error(`Invalid 0rbit action tag: ${actionTag}`);
    }
    const query = {
        query: `
        {
    transactions(
        ${cursor ? `after: "${cursor}",` : ''}
        sort: HEIGHT_ASC,
        recipients:["${OrbitProjectId}"]
        first: 200,
        tags: [
            {
                name: "X-Action",
                values: ["${actionTag}"]
            },
            # {
            #     name: "From-Process",
            #     values: ["BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"]
            # }
        ]
        ) {
        pageInfo {
            hasNextPage 
            
        }
        edges {
            cursor
            node {
                id
                block {
                    height
                    timestamp
                }
                recipient 
                owner {
                    address
                }
                tags {
                    name
                    value
                }                
            }
        }
    }
}`
    }
    return query;
}