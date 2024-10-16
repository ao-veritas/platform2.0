

export const Actions = ["Buy", "Claim"];

export const OutcomeToken = "Dgs1OEsExsPRVcbe_3buCGf0suVKUFwMJFddqMhywbY"

export function ApusDataQuery(actionTag, cursor) {
    if (!Actions.includes(actionTag)) {
        throw new Error(`Invalid Apus action tag: ${actionTag}`);
    }
    const query = {
        query: `
        {
    transactions(
        ${cursor ? `after: "${cursor}",` : ''}
        sort: HEIGHT_ASC,
        recipients:["Dgs1OEsExsPRVcbe_3buCGf0suVKUFwMJFddqMhywbY"]
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