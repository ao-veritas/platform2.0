

export const ApusActions = ["Create-Dataset"];

export const ApusToken = "al1xXXnWnfJD8qyZJvttVGq60z1VPGn4M5y6uCcMBUM"

export const ApusProjectProcessId = "vp4pxoOsilVxdsRqTmLjP86CwwUwtj1RoKeGrFVxIVk"
// Each compettion pool has its own process. Latest (3rd) pool: ZuZZeU2-JeNRdpBWBWU8p6IcjNXyZ0BFZ4M2Pwoj9vM
// Users can send "Chat-Question" Messages to chat with different datasets

function ApusDataQuery(actionTag, cursor) {
    if (!ApusActions.includes(actionTag)) {
        throw new Error(`Invalid Apus action tag: ${actionTag}`);
    }
    const query = {
        query: `
        {
    transactions(
        ${cursor ? `after: "${cursor}",` : ''}
        sort: HEIGHT_ASC,
        recipients:["${ApusProjectProcessId}"]
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