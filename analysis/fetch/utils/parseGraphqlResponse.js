
/*
  "node": {
        "id": "yhOgEaHftfZDQDcI14_IGiAzCV6kuPwMqI-ofq6PhdA",
        "block": {
            "height": 1507559,
            "timestamp": 1726450752
        },
        "recipient": "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
        "owner": {
            "address": "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY"
        },
        "tags": [
            {
                "name": "Ref_",
                "value": "8450429"
            },
            {
                "name": "Quantity",
                "value": "1000000000000"
            },
            {
                "name": "Action",
                "value": "Credit-Notice"
            },
            {
                "name": "Sender",
                "value": "GhzqFey5suK6apvvWKzDYgmB69Jol62BRfC1ayEraeQ"
            },
            {
                "name": "X-Url",
                "value": "https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd"
            },
            {
                "name": "X-Action",
                "value": "Get-Real-Data"
            },
            {
                "name": "Data-Protocol",
                "value": "ao"
            },
            {
                "name": "Type",
                "value": "Message"
            },
            {
                "name": "Variant",
                "value": "ao.TN.1"
            },
            {
                "name": "From-Process",
                "value": "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"
            },
            {
                "name": "From-Module",
                "value": "9afQ1PLf2mrshqCTZEzzJTR2gWaC9zNPnYgYEqg1Pt4"
            }
        ]
    }
*/
export function parseGraphqlResponse(responseData) {
    const transactions = responseData.data.transactions

    // filter out nodes where block is null
    const transactionsWithBlock = transactions.edges.filter(edge => edge.node.block !== null);

    const nodeData = transactionsWithBlock.map(edge => {
        const node = edge.node;
        const tags = node.tags.reduce((acc, tag) => {
            acc[tag.name] = tag.value;
            return acc;
        }, {});

        // remove ao tags
        const removeTags = ['Ref_', 'Data-Protocol', 'Type', 'Variant', 'From-Module', 'Pushed-For'];
        removeTags.forEach(tag => {
            delete tags[tag];
        })

        return {
            id: node.id,
            height: node.block.height,
            timestamp: node.block.timestamp,
            recipient: node.recipient,
            owner: node.owner.address,
            tags,
        };
    });

    const lastCursor = transactionsWithBlock[transactionsWithBlock.length - 1].cursor;

    if (transactionsWithBlock.length != transactions.edges.length) {
        console.log("last cursor", lastCursor, "transactionsWithBlock.length", transactionsWithBlock.length, "transactions.edges.length", transactions.edges.length)
    }


  return {data: nodeData, nextPageCursor: transactionsWithBlock.length == transactions.edges.length ? lastCursor : null };
}