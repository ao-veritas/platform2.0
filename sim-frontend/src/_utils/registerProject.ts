import { createDataItemSigner, message, result } from "@permaweb/aoconnect";

type ProjectDetails = {
    projectID: string;
    projectTokenID: string;
  };

const platformID = import.meta.env.VITE_PLATFORM_ID;

const registerProject = async(project:ProjectDetails) => {
  const msgID = await message({
    process:platformID,
    signer: createDataItemSigner(window.arweaveWallet),
    tags: [
      { name: "Action", value: "Register-Project" },
      { name: "projectID", value: project.projectID },
      { name: "projectTokenID", value: project.projectTokenID },
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
    console.log("REGISTER WORKS")
    return true
  }
  return false
}

export default registerProject


