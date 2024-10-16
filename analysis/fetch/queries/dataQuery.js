export const queryActions = [];

export const dataQuery = (actionTag, cursor, projectId) => {
  if (!queryActions.includes(actionTag.values)) {
    throw new Error(`Invalid Action Tag: ${actionTag.values}`);
  }
  const query = {
    query: `
        transactions(
            ${cursor ? `after: "${cursor}",` : ""}
            sort: HEIGHT_ASC,
            recipients:[${projectId}]
            first: 200,
            tags: [
                {
                    name: "${actionTag.name}",
                    values: ["${actionTag.values}"]
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
