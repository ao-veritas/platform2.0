import { useEffect, useRef, useState } from "react";
import { brandDarkBg, brandDarkBorder, brandSecondaryBg, brandSecondaryText } from "../_utils/colors"
import { Footer, Navbar, ProjectStakes } from "../components"
import { useActiveAddress } from "arweave-wallet-kit";
import { useUserAoETH } from "../_utils/useAoEth";
import { humanizeDuration } from "../_utils/helpers";
import stake from "../_utils/stake";
import Loader from "../components/Loader";
import { getAllTransactions } from "../_utils/info";



const Saturn = () => {
    const address = useActiveAddress();
    const projectID:string = import.meta.env.VITE_SATURN_ID;
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stakeLoading, setStakeLoading] = useState(false);
    const [currentTransTimestamp, setCurrentTransTimestamp] = useState<number>(1826424517808);

    const [recievedAoETH, setRecievedAoETH] = useState(false)
    const recievedAoETHRef = useRef(recievedAoETH);
    const [projectConfirmedStake, setProjectConfirmedStake] = useState(false)
    const projectConfirmedStakeRef = useRef(projectConfirmedStake);
    const [rewardsSent, setRewardsSent] = useState(false)
    const rewardsSentRef = useRef(rewardsSent);
    
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState("0");
    const availableAOEth = useUserAoETH(address).aoeth ?? 0;
    const openModalHandler = () => {
        setIsModalOpen(true)
        setStep("1")
        setCurrentTransTimestamp(0)
        // setRecievedAoETH(false) 
        // setProjectConfirmedStake(false)
    }
    const closeModalHandler = () => {
        setIsModalOpen(false)
        setStep("0")
        setCurrentTransTimestamp(0)
    }
    const amountChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === "" || Number(newValue) < 0) {
            setAmount("");
            return;
        }
        if (Number(newValue) > availableAOEth) {
            setAmount(availableAOEth.toString());
            return;
        }
        setAmount(e.target.value);
    }
    const maxClickHandler = () => {
        setAmount(availableAOEth.toString());
    }
    useEffect(() => {
        recievedAoETHRef.current = recievedAoETH; // Keep the ref updated with the latest state
      }, [recievedAoETH]);
    useEffect(() => {
        projectConfirmedStakeRef.current = projectConfirmedStake; // Keep the ref updated with the latest state
    }, [projectConfirmedStake]);
    useEffect(() => {
        rewardsSentRef.current = rewardsSent; // Keep the ref updated with the latest state
    }, [rewardsSent]);
    useEffect(() => {
        const check = async() => {
                while(recievedAoETHRef.current === false && step=="2"){
                    const check = await checkRecievedAoETH();
                    console.log("check:", check)
                    setRecievedAoETH(check);
                    console.log("step", step)
                    console.log("rec:", recievedAoETH)
                }
                while(projectConfirmedStakeRef.current === false && step=="2"){
                    const check = await checkProjectConfirmedStake();
                    console.log("check:", check)
                    setProjectConfirmedStake(check);
                    console.log("step", step)
                    console.log("rec:", projectConfirmedStake)
                } 
                while(rewardsSentRef.current === false && step=="2"){
                    const check = await checkRewardsSent();
                    console.log("check:", check)
                    setRewardsSent(check);
                    console.log("step", rewardsSent)
                } 
                console.log("OUTTTTTTTTT")
        }
        check();
    }, [step])
    
    const checkRecievedAoETH = async() =>{
        const transactionTable = await getAllTransactions();
        if(!transactionTable){
          alert("Error! Please contact admins")
          return false
        }
        console.log("for rec current:", currentTransTimestamp)
        let flag = false
        transactionTable?.map((transaction)=>{
        //    console.log("in check trans: ", Number(transaction.Timestamp))
            if(Number(transaction.Timestamp)>currentTransTimestamp && transaction.Type =="btf"){
                flag = true
            }
        })
        console.log("this it", flag)
        return flag
    }
    const checkProjectConfirmedStake = async() =>{
        const transactionTable = await getAllTransactions();
        if(!transactionTable){
          alert("Error! Please contact admins")
          return false
        }
        console.log("for rec current:", currentTransTimestamp)
        let flag = false
        transactionTable?.map((transaction)=>{
        //    console.log("in check trans: ", Number(transaction.Timestamp))
            if(Number(transaction.Timestamp)>currentTransTimestamp && transaction.Type =="ptf"){
                flag = true
            }
        })
        console.log("this it", flag)
        return flag
    }
    const checkRewardsSent = async() =>{
        const transactionTable = await getAllTransactions();
        if(!transactionTable){
          alert("Error! Please contact admins")
          return false
        }
        console.log("for rec current:", currentTransTimestamp)
        let flag = false
        transactionTable?.map((transaction)=>{
        //    console.log("in check trans: ", Number(transaction.Timestamp))
            if(Number(transaction.Timestamp)>currentTransTimestamp && transaction.Type =="ftu"){
                flag = true
            }
        })
        console.log("this it", flag)
        return flag
    }
  return (
    <>
        <Navbar/>
        <main className={`${brandDarkBg} w-[100vw] px-20 pt-[120px] text-[#FCFCFC] font-raleway`}>
            <section className="">
                <img src={project.bannerLink} alt="" className="rounded-[9px] max-h-[300px]"/>
                <div className={`mt-[-45px] border-[3px] border-solid ${brandDarkBorder} rounded-[9px] w-fit`}>
                    <img src={project.logoImageLink} alt="" className="w-[90px] h-[90px]"/>
                </div>
            </section>
            <section className="flex flex-row justify-between items-center mb-[24px]">
                <div className="flex flex-col gap-[0px]">
                    <h1 className="text-[30px] leading-[33px]">{project.name}</h1>
                    <div className="flex flex-row gap-[3px] items-center">
                        <h4 className="text-[18px] font-thin">Process ID: {project.processID} |</h4> 
                        <img src="/icons/share.svg" alt="" className="w-[24px] h-[24px] hover:opacity-60 cursor-pointer"/>
                    </div>
                </div>
                <button
                onClick={openModalHandler}
                className={`${brandSecondaryBg} hover:opacity-60 cursor-pointer rounded-[9px] px-[24px] py-[6px] text-[18px] font-medium`}>
                    Stake Now
                </button>
            </section>
            <section className="flex flex-row gap-3 w-full mb-[12px]">
                <section className="w-full flex flex-col gap-6 rounded-[9px] bg-[#1F1E1E] px-[24px] py-[12px]">
                    <div className="flex flex-col gap-[3px]">
                    <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium`}>Project Info</h3>
                    <p>{project.description}</p>
                    </div>
                    <div>
                        <div>
                            <h5>Project Type</h5>
                            <h5>Utility</h5>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px] items-center justify-start">
                        {project.links.website? <a href={project.links.website} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/website.png" className="w-[36px] h-[36px] " alt="" /></a>:""}
                        {project.links.docs? <a href={project.links.docs} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/docs.svg" className="w-[36px] h-[36px] " alt="" /></a>:""}
                        {project.links.github? <a href={project.links.github} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/github.svg" className="w-[36px] h-[36px] " alt="" /></a>:""}
                        {project.links.discord? <a href={project.links.discord} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/discord.svg" className="w-[36px] h-[36px] " alt="" /></a>:""}
                        {project.links.telegram? <a href={project.links.telegram} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/telegram.svg" className="w-[36px] h-[36px] " alt="" /></a>:""}
                        {project.links.twitter? <a href={project.links.twitter} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/twitter.svg" className="w-[36px] h-[36px] " alt="" /></a>:""}
                    </div>
                </section>
                <section className="flex flex-col gap-3">
                    <ProjectStakes projectID={projectID}/>
                    <div className="rounded-[9px] bg-[#1F1E1E] px-[24px] py-[12px]">
                        <div className="flex flex-row items-center justify-between">
                        <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium `}><span className="uppercase">${project.token.name}</span> Token</h3>
                        <h4 className="bg-[#393939] rounded-[6px] px-[6px] py-[2px] text-[12px]">${project.token.ticker}</h4>
                        </div>
                        <div>
                            <h6>Total Supply:{project.token.totalSupply}</h6>
                            <h6>Process Id: {project.token.processId}</h6>
                            <h6>Denomination: {project.token.denomination}</h6>
                            {project.token.tokenomics? <h6>Tokenomics Link: {project.token.tokenomics.linkToBlogorPaper}</h6>:""}
                        </div>
                    </div>
                </section>
            </section>
            <section className="rounded-[9px] bg-[#1F1E1E] px-[30px] py-[15px] mb-[12px]">
                <h2 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Team</h2>
                <div className="flex flex-row items-center justify-between">
                {project.team.map((member) => {
                    return <div className="flex flex-row gap-3">
                    <img src={member.imgLink} alt="" className="rounded-full max-w-[90px] max-h-[90px]"/>
                    <div>
                        <h6>{member.officialName} {member.pseudoName?<span>{"("}{member.pseudoName}{")"}</span>:""}</h6>
                        <h6>{member.role}</h6>
                        <div className="flex flex-row gap-[6px]">
                            {member.links.github?<a href={member.links.github} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/github.svg"  className="w-[27px] h-[27px]" alt="" /></a>:""}
                            {member.links.twitter?<a href={member.links.twitter} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/twitter.svg" className="w-[27px] h-[27px]"  alt="" /></a>:""}
                            {member.links.dribble?<a href={member.links.dribble} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/dribble.svg" className="w-[27px] h-[27px]"  alt="" /></a>:""}
                        </div>
                    </div>
                </div>
                })}
                </div>
            </section>
            <section className="rounded-[9px] bg-[#1F1E1E] px-[30px] py-[15px] flex flex-col gap-6">
                <div>
                <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Getting Started with {project.name}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus iste nulla aut! Minus non tenetur illo, delectus eius porro officiis illum culpa numquam quo dolore ipsa eveniet facilis tempore quasi.</p>
                </div>
                <div>
                    <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Use Cases</h3>
                    {project.useCases? project.useCases.map((usecase)=>{
                        return <div>
                            <h4>{usecase.name}</h4>
                            <div>
                            <p>{usecase.info}</p>
                            <a href={usecase.liveLink}>Try It!</a>
                            </div>
                        </div>
                    }):""}
                </div>
            </section>
        </main>
        <Footer/>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-[#626262] bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-fit max-w-[450px] bg-[#111111] p-8 rounded-[9px] ">
            <button onClick={closeModalHandler} className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-600">
                &times;
              </button>
            
            {step == "1" && (
                <>
                  <h2 className="text-[30px] font-semibold text-[#f1f1f1]">
                    <span className="text-[#40959D]">Stake </span>$tAoEth, <span className="text-[#40959D]"> Get </span>${project.token.ticker}{" "}
                    {/* <span className="text-[#40959D]">in return</span> */}
                  </h2>
                  <div className="mb-6">
                    <div className="text-[#40959D]">
                      Available $tAoEth: <span className="font-semibold text-[#f1f1f1] lining-figures">{availableAOEth}</span>
                    </div>
                    <h4 className="text-[#8D8D8D] font-[Rale-SemiBold] text-[13.5px]">Enter quantity of $tAoEth to be staked</h4>
                    <div
                      className="flex items-center justify-between rounded bg-[#1A1A1A] text-[#f1f1f1]
                pl-2"
                    >
                      <input
                        disabled={stakeLoading}
                        type="number"
                        value={amount}
                        onChange={amountChangeHandler}
                        title="$tAoEth to be staked"
                        className="bg-[#00000000] p-2 w-full h-full"
                      />
                      <div className="h-full min-w-fit">
                        <button onClick={maxClickHandler} className="bg-[#111111] border-[2px] border-[#121212] text-white px-3 py-2 rounded min-w-fit m-2">
                          GO MAX
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded mb-6 max-w-[100%]">
                    <p className="text-[#8D8D8D] text-[12px]">{`On staking $tAoEth you will receive ${amount ? parseFloat(amount) * project.exchangeInfo.aoethRewardRate : "-"} of $${
                      project.token.ticker
                    }. There is a cool down period of ${humanizeDuration(project.exchangeInfo.cooldownPeriod)} for unstaking your $tAoEth.`}</p>
                  </div>
                  <button
                    onClick={async () => {
                      setStakeLoading(true);
                      setCurrentTransTimestamp(new Date().getTime());
                      console.log("time:",currentTransTimestamp)
                      console.log("passing amount", parseFloat(amount)*Math.pow(10, 12))
                      await stake(parseFloat(amount)*Math.pow(10, 12));
                    //   start(startDate);
                    setRecievedAoETH(false)
                      setStep("2");
                      setStakeLoading(false);
                    }}
                    disabled={amount === "" || parseFloat(amount) <= 0 || parseFloat(amount) > availableAOEth || stakeLoading}
                    className={`flex gap-4 w-fit ${stakeLoading ? "bg-gray-400" : "bg-[#205156]"} text-[#f1f1f1] py-[6px] px-[18px] rounded`}
                  >
                    {stakeLoading ? <Loader /> : ""}
                    Stake $tAoEth
                  </button>
                </>
              )}
             {step == "2" && (
                <div className="relative">
                  <div className="absolute h-0 inset-0 flex mt-2 ml-2">
                    <div className="w-1 h-[100px] bg-teal-300"></div>
                  </div>
                  <div className="relative z-10 flex flex-col space-y-6">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${recievedAoETH ? "bg-teal-600" : "bg-gray-800"}  text-white`}>✓</div>
                      <div className={`ml-4 ${recievedAoETH ? "text-teal-300" : "text-white"} text-lg`}>
                        {amount} $tAoEth staked on {project.name}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${projectConfirmedStake ? "bg-teal-600" : "bg-gray-800"} text-white`}>
                        ✓
                      </div>
                      <div className={`ml-4 ${projectConfirmedStake ? "text-teal-300" : "text-white"} text-lg`}>{project.name} confirmed deposit</div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${rewardsSent ? "bg-teal-600" : "bg-gray-800"} text-white`}>✓</div>

                      <div className={`ml-4 ${rewardsSent ? "text-teal-300" : "text-white"} text-lg`}>${project.token.ticker} reward sent to your wallet</div>
                    </div>
                  </div>
                  <button
                    disabled={!rewardsSent}
                    onClick={() => (window.location.href = "/user")}
                    className={`${!rewardsSent ? "bg-gray-400" : "bg-[#205156]"} text-[#f1f1f1] py-[6px] px-[18px] rounded m-4`}
                  >
                    {rewardsSent ? (
                      "See Your Profile"
                    ) : (
                      <div className="flex gap-4">
                        <Loader />
                        Confirming Transaction
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
        </div>)}
    </>
  )
}

export default Saturn

// const project = {
//     name: "0rbit",
//     processID:"BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
//     logoImageLink:"https://www.0rbit.co/logos/sqLightFill.svg",
//     bannerLink:"https://www.0rbit.co/logos/ogBanner.jpeg",
//     links: {
//         website: "https://0rbit.co/",
//         docs:"https://docs.0rbit.co/",
//         discord: "https://discord.gg/JVSjqaKJgV",
//         twitter: "https://twitter.com/0rbitco",
//         github: "https://github.com/0rbit-co",
//         telegram: "",
//         other: ["https://www.playground.0rbit.co/","https://mirror.xyz/0x26B11B188E9E69b2426FD6111302E721F423020E"]
//     },
//     team: [{
//         officialName:"Yash Garg",
//         pseudoName:"megabyte",
//         role:"Co-Founder",
//         imgLink:"https://0rbit.co/team/megabyte.png",
//         links:{
//             github:"https://github.com/megabyte0x",
//             twitter:"https://x.com/megabyte0x?t=WZYKcJAvN-CM7a6yU4lPNQ&s=09",
//             dribble:"",
//             other:["",""],
//         },
//     },
//     {
//         officialName:"Ayush Agrawal",
//         pseudoName:"lucifer0x17",
//         role:"Co-Founder",
//         imgLink:"https://0rbit.co/team/lucifer.png",
//         links:{
//             github:"https://github.com/Lucifer0x17",
//             twitter:"https://x.com/Lucifer0x17?t=fH5LRms3xy2hSPLJbNubaA&s=09",
//             dribble:"",
//             other:["",""],
//         },
//     },
//     {
//         officialName:"Manishi Bhatnagar",
//         pseudoName:"",
//         role:"UI/ UX Designer",
//         imgLink:"https://0rbit.co/team/manishi.png",
//         links:{
//             github:"",
//             twitter:"https://x.com/0xManishi?t=FKn7XBJwlIXwJR-f4KGkzw&s=09",
//             dribble:"https://dribbble.com/0xManishi",
//             other:["",""],
//         },
//     },
//     {
//         officialName:"Sarthak Shah",
//         pseudoName:"",
//         role:"Engineer",
//         imgLink:"https://0rbit.co/team/sarthak.png",
//         links:{
//             github:"https://github.com/Not-Sarthak",
//             twitter:"https://x.com/0xSarthak13?t=nvsUz9hxhq2hQO25wr8Rtw&s=09",
//             dribble:"",
//             other:["",""],
//         },
//     }],
//     description: "The Decentralized Oracle Network on AO for accessing any off-chain data.",
//     oneLiner: "Decentralized Oracle Network on Arweave",
//     token: {
//         name:"0rbt",
//         ticker:"0RBT",
//         processId:"BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
//         denomination:"",
//         totalSupply:"",
//         tokenomics:{
//             info:"",
//             linkToBlogorPaper:""
//         }
//     },
//     gettingStartedGuide:"",
//     projectOrigin:"",
//     useCases: [{
//         name:"",
//         info:"",
//         liveLink:"",
//         other:[""]
//     }],
//     advisorsInvestors:[{
//         name:"",
//         role:"",
//         moreInfo:"",
//         amountIfAny:[""],
//     }],
//     mileStones:[{
//         goal:"",
//         date:"",
//         proof:"",
//         status:""
//     }],
//     mediaMentions:[""],
//     collaborations:[{
//         name:"",
//         link:"",
//         info:""
//     }],
//     ownershipPercentages:[{
//         name:"",
//         role:"",
//         percentage:""
//     }]
// }
export const project =  {
  name: "Saturn",
  processID:"rXQaiyznUgDrt7A0Nzl9OQN2QBJ3we1X3qMe2W5DBXU",
  logoImageLink:"https://wkypibie7ccprx5ujbbqddvhyotazjdchydxq6w4pd6j7hik5ipa.arweave.net/srD0BQT4hPjftEhDAY6nw6YMpGI-B3h63Hj8n50K6h4",
  bannerLink:"/saturnBanner.png",
  links: {
      website: "/",
      docs:"/",
      discord: "https://discord.gg/MTP7BQgr",
      twitter: "https://x.com/Veritas_ao",
      github: "https://github.com/fundars/platform2.0",
      telegram:"",
      other: ["",""]
  },
  team: [{
      officialName:"Alice Johnson",
      pseudoName:"JohnDaughter",
      role:"CEO",
      imgLink:"https://jh2ukzgb546squzma2zxtkr6ckignjy7c6thm7xhe43aj7q3norq.arweave.net/SfVFZMHvPShTLAazeao-EpBmpx8XpnZ-5yc2BP4ba6M",
      links:{
          github:"",
          twitter:"",
          dribble:"",
          other:["",""],
      },
  },
  {
      officialName:"Bob Smith",
      pseudoName:"CryptoSmith",
      role:"Co-Founder",
      imgLink:"https://3v7icsuojvbggeifpyk6avvv5pz4vueyaj3kmzu65xvf5msqlgaq.arweave.net/3X6BSo5NQmMRBX4V4Fa16_PK0JgCdqZmnu3qXrJQWYE",
      links:{
          github:"",
          twitter:"",
          dribble:"",
          other:["",""],
      },
  },
 ],
  exchangeInfo: {
      cooldownPeriod: 10,
      aoethRewardRate: 60
    },
  description: "The Decentralized Dummy Project Functionality of Veritas. Lorem Ipsum Dolor Sit amet.",
  oneLiner: "Decentralized Dummy Placeholder Project",
  token: {
      name:"Sat",
      ticker:"SAT",
      processId:"lrTtKXMhdmMSi8ZfTsdSX24Xpm9FAo47CRHe82HZ7XA",
      denomination:"",
      totalSupply:"",
      tokenomics:{
          info:"",
          linkToBlogorPaper:""
      }
  },
  gettingStartedGuide:"",
  projectOrigin:"",
  useCases: [{
      name:"",
      info:"",
      liveLink:"",
      other:[""]
  }],
  advisorsInvestors:[{
      name:"",
      role:"",
      moreInfo:"",
      amountIfAny:[""],
  }],
  mileStones:[{
      goal:"",
      date:"",
      proof:"",
      status:""
  }],
  mediaMentions:[""],
  collaborations:[{
      name:"",
      link:"",
      info:""
  }],
  ownershipPercentages:[{
      name:"",
      role:"",
      percentage:""
  }]
}