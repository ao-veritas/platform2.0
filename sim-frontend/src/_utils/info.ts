import { connect, createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect";
const platformID = import.meta.env.VITE_PLATFORM_ID;

type UserStakes = {
    UserID: string;
    TokenID: string;
    TotalStaked: string;
    ProjectID: string;
  };

const userStakes = async() => {
    const userAddress = await window.arweaveWallet.getActiveAddress();
    let { Error, Messages } = await dryrun({
        process: platformID,
        tags: [
          { name: "Action", value: "Info-UserStakes" },
        ],
      });
      const tempTable = JSON.parse(Messages[0].Data)
      const userData:UserStakes[] = []
      tempTable.map((user:UserStakes) => {
        if(user.UserID == userAddress){
            userData.push(user)
        }
      })
      console.log("other:", userData)
      return userData;
}

export default userStakes;