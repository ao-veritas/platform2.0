import { connect, createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect";
const platformID = import.meta.env.VITE_PLATFORM_ID;

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
  userStakesData.map((user) => {
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
  projectsTable.map((project:ProjectData) => {
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
  const tempTable = JSON.parse(Messages[0].Data)
  const transactions:Transaction[] = []
  tempTable.map((transaction:Transaction) => {
        transactions.push(transaction)
  })
  console.log("other:", transactions)
  return transactions; 
}