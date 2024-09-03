import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
const dummyFrontEnd = async({quantity, bridgedTokenID, projectID}) => {
    const msgId = await message({
        process: bridgedTokenID,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [
            { name: "Action", value: "Transfer" },
            { name: "Recipient", value: PLATFORMID },
            { name: "Quantity", value: quantity.toString()},
            { name: "X-ProjectID", value: projectID },            
            { name: "X-Action", value: "Staked" },            
        ],
    })
    
}