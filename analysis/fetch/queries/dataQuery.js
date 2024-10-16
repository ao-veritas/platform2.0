export const queryActions = [];

export const dataQuery = (actionTag, cursor, projectId) => {
//   if (!queryActions.includes(actionTag.values)) {
//     throw new Error(`Invalid Action Tag: ${actionTag.values}`);
//   }
    // query height desc to get latest first, so we can stop at the first duplicate when deployed on AO
  const query = {
    query: `
    {
        transactions(
            ${cursor ? `after: "${cursor}",` : ""}
            sort: HEIGHT_DESC,
            recipients:["${projectId}"]
            first: 200,
            tags: [
                {
                    name: "${actionTag.name}",
                    values: ["${actionTag.value}"]
                }
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
    }`,
  };
  return query;
};
