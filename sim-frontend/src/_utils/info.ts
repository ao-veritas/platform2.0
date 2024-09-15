import {dryrun} from "@permaweb/aoconnect";
import { useActiveAddress } from "arweave-wallet-kit";
const platformID = import.meta.env.VITE_PLATFORM_ID;
const saturnTokenID = import.meta.env.VITE_SATURN_TOKEN_ID;

type UserStakes = {
    UserID: string;
    TokenID: string;
    TotalStaked: string;
    ProjectID: string;
  };

  type ProjectData = {
    TaoEthStaked: number;
    ProjectTokenID: string;
    ProjectID: string;
  }

  type Transaction = {
    Timestamp: string;
    Type: string;
    Status: string;
    ProjectID: string;
    UserID: string;
    TokenID: string;
    TransID: string;
    Quantity: string;
  };

export const userStakes = async() => {
    const userAddress = await window.arweaveWallet.getActiveAddress();
    let { Error, Messages } = await dryrun({
        process: platformID,
        tags: [
          { name: "Action", value: "Info-UserStakes" },
        ],
      });
      if (Error || !Messages[0].Data){
        return ;
      }
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

export const getTaoEthStake = async() => {
  const userStakesData = await userStakes();
  let taoEthStaked = 0;
  userStakesData?.map((user) => {
    taoEthStaked = taoEthStaked+ Number(user.TotalStaked)
    console.log(user)
    console.log(taoEthStaked)
  })
  return taoEthStaked
}

export const projectDetails = async() => {
  let { Error, Messages } = await dryrun({
    process: platformID,
    tags: [
      { name: "Action", value: "Info-Projects" },
    ],
  });
  if (Error || !Messages[0].Data){
    return ;
  }
  const tempTable = JSON.parse(Messages[0].Data)
  const projectData:ProjectData[] = []
  tempTable.map((project:ProjectData) => {
        projectData.push(project)
  })
  console.log("other:", projectData)
  return projectData; 
}

export const getProjectStake = async(projectID:String) =>{
  console.log("came in id:", projectID)
  const projectsTable = await projectDetails();
  let amount = "0";
  projectsTable?.map((project:ProjectData) => {
    if(project.ProjectID == projectID){
      console.log("found project id")
      console.log(project.TaoEthStaked)
      amount = project.TaoEthStaked.toString();
    }
  })
  return amount
}




export const getAllTransactions = async() => {
  let { Error, Messages } = await dryrun({
    process: platformID,
    tags: [
      { name: "Action", value: "Info-Transactions" },
    ],
  });
  if (Error || !Messages[0].Data){
    return ;
  }
  const tempTable = JSON.parse(Messages[0].Data)
  const transactions:Transaction[] = []
  tempTable.map((transaction:Transaction) => {
        transactions.push(transaction)
  })
  console.log("trans:", transactions)
  return transactions; 
}

export const pTokenRecieved = async(projectTokenId:String) => {
  const userAddress = await window.arweaveWallet.getActiveAddress();
  const transactionTable = await getAllTransactions();
  let totalPToken = 0;
  transactionTable?.map((transaction) => {
    console.log("tran:", transaction)
    console.log(userAddress, " ", projectTokenId )
    if(transaction.UserID==userAddress && transaction.TokenID==saturnTokenID && transaction.Type == "ftu"){
      totalPToken = totalPToken+Number(transaction.Quantity)
    }
  })
  console.log("agg of ptokens recieved:", totalPToken);
  return totalPToken;
}