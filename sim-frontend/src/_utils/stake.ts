import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

const platformID = import.meta.env.VITE_PLATFORM_ID;
const taoethID = import.meta.env.VITE_TAOETH_ID;
const saturnID = import.meta.env.VITE_SATURN_ID;

const stake = async (amount:number) => {
    const msgID = await message({
        process:taoethID,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [
          { name: "Action", value: "Transfer" },
          { name: "Quantity", value: amount.toString() },
          { name: "Recipient", value: platformID },
          { name: "X-Action", value: "Staked"},
          { name: "X-ProjectID", value: saturnID },
        ],
      });
      let { Messages, Error } = await result({
        message: msgID,
        process: platformID,
      });
      if(Error){
        console.error(Error)
        return false
      } else {
        console.log(Messages)
        console.log("STAKE WORKS")
        return true
      }
      return false
}

export default stake;