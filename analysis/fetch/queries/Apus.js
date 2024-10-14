

export const ApusActions = ["Create-Dataset"];

// Each compettion pool has its own process. Latest (3rd) pool: ZuZZeU2-JeNRdpBWBWU8p6IcjNXyZ0BFZ4M2Pwoj9vM
// Users can send "Chat-Question" Messages to chat with different datasets

export function ApusDataQuery(actionTag, cursor) {
    if (!ApusActions.includes(actionTag)) {
        throw new Error(`Invalid Apus action tag: ${actionTag}`);
    }
    const query = {
        query: `
        {
    transactions(
        ${cursor ? `after: "${cursor}",` : ''}
        sort: HEIGHT_ASC,
        recipients:["vp4pxoOsilVxdsRqTmLjP86CwwUwtj1RoKeGrFVxIVk"]
        first: 200,
        tags: [
            {
                name: "Action",
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