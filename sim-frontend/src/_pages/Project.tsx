import { useEffect, useState } from "react";
import { brandDarkBg, brandDarkBorder, brandSecondaryBg, brandSecondaryText } from "../_utils/colors"
import { Footer, Navbar,  } from "../components"
import { projects } from "@/_utils/projects";
import { ProjectType } from "@/_utils/types";


const Project = ({pid}:any) => {
  const [currentProject, setCurrentProject] = useState<ProjectType>()
  useEffect(() => {
    projects.map((project)=>{
      if(project.processID==pid){
          setCurrentProject(project)
      }
    }) 
  }, [])
  return (
    <>
        <Navbar/>
        {currentProject ?<main className={`${brandDarkBg} w-[100vw] px-20 pt-[120px] text-[#FCFCFC] font-raleway`}>
            <section className="">
                <img src={currentProject.bannerLink?currentProject.bannerLink:dummyProject.bannerLink} alt="" className="rounded-[9px] max-h-[300px]"/>
                <div className={`mt-[-45px] border-[3px] border-solid ${brandDarkBorder} rounded-[9px] w-fit`}>
                    <img src={currentProject.logoImageLink?currentProject.logoImageLink:dummyProject.logoImageLink} alt="" className="w-[90px] h-[90px]"/>
                </div>
            </section>
            <section className="flex flex-row justify-between items-center mb-[24px]">
                <div className="flex flex-col gap-[0px]">
                    <h1 className="text-[30px] leading-[33px]">{currentProject.name ? currentProject.name : dummyProject.name}</h1>
                    <div className="flex flex-row gap-[3px] items-center">
                        <h4 className="text-[18px] font-thin">Process ID: {currentProject.processID ? currentProject.processID : dummyProject.processID} |</h4> 
                        <img src="/icons/share.svg" alt="" className="w-[24px] h-[24px] hover:opacity-60 cursor-pointer"/>
                    </div>
                </div>
                <button

                className={`${brandSecondaryBg} hover:opacity-60 cursor-pointer rounded-[9px] px-[24px] py-[6px] text-[18px] font-medium`}>
                    Stake Now
                </button>
            </section>
            <section className="flex flex-row gap-3 w-full mb-[12px]">
                <section className="w-full flex flex-col gap-6 rounded-[9px] bg-[#1F1E1E] px-[24px] py-[12px]">
                    <div className="flex flex-col gap-[3px]">
                        <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium`}>Project Info</h3>
                        <p>{currentProject.description ? currentProject.description : dummyProject.description}</p>
                    </div>
                    <div>
                        <div>
                            <h5>Project Type</h5>
                            <h5>Utility</h5>
                        </div>
                    </div>
                    <div className="flex flex-row gap-[24px] items-center justify-start">
                        {currentProject.links.website ? <a href={currentProject.links.website} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/website.png" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                        {currentProject.links.docs ? <a href={currentProject.links.docs} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/docs.svg" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                        {currentProject.links.github ? <a href={currentProject.links.github} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/github.svg" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                        {currentProject.links.discord ? <a href={currentProject.links.discord} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/discord.svg" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                        {currentProject.links.telegram ? <a href={currentProject.links.telegram} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/telegram.svg" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                        {currentProject.links.twitter ? <a href={currentProject.links.twitter} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/twitter.svg" className="w-[36px] h-[36px]" alt="" /></a> : ""}
                    </div>
                </section>
                <section className="flex flex-col gap-3">
                    {/* <ProjectStakes projectID={projectID}/> */}
                    <div className="rounded-[9px] bg-[#1F1E1E] px-[24px] py-[12px]">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium`}><span className="uppercase">${currentProject.token.name ? currentProject.token.name : dummyProject.token.name}</span> Token</h3>
                            <h4 className="bg-[#393939] rounded-[6px] px-[6px] py-[2px] text-[12px]">${currentProject.token.ticker ? currentProject.token.ticker : dummyProject.token.ticker}</h4>
                        </div>
                        <div>
                            <h6>Total Supply: {currentProject.token.totalSupply ? currentProject.token.totalSupply : dummyProject.token.totalSupply}</h6>
                            <h6>Process Id: {currentProject.token.processId ? currentProject.token.processId : dummyProject.token.processId}</h6>
                            <h6>Denomination: {currentProject.token.denomination ? currentProject.token.denomination : dummyProject.token.denomination}</h6>
                            {currentProject.token.tokenomics ? <h6>Tokenomics Link: {currentProject.token.tokenomics.linkToBlogorPaper ? currentProject.token.tokenomics.linkToBlogorPaper : dummyProject.token.tokenomics.linkToBlogorPaper}</h6> : ""}
                        </div>
                    </div>
                </section>
            </section>
            <section className="rounded-[9px] bg-[#1F1E1E] px-[30px] py-[15px] mb-[12px]">
                <h2 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Team</h2>
                <div className="flex flex-row items-center justify-between">
                {currentProject.team.map((member, index) => {
                    return <div className="flex flex-row gap-3" key={index}>
                        <img src={member.imgLink ? member.imgLink : dummyProject.team[index].imgLink} alt="" className="rounded-full max-w-[90px] max-h-[90px]"/>
                        <div>
                            <h6>{member.officialName ? member.officialName : dummyProject.team[index].officialName} {member.pseudoName ? <span>{"("}{member.pseudoName}{")"}</span> : ""}</h6>
                            <h6>{member.role ? member.role : dummyProject.team[index].role}</h6>
                            <div className="flex flex-row gap-[6px]">
                                {member.links.github ? <a href={member.links.github} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/github.svg"  className="w-[27px] h-[27px]" alt="" /></a> : ""}
                                {member.links.twitter ? <a href={member.links.twitter} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/twitter.svg" className="w-[27px] h-[27px]"  alt="" /></a> : ""}
                                {member.links.dribble ? <a href={member.links.dribble} target="_blank" className="bg-[#eeeeee] hover:opacity-30 cursor-pointer rounded-full p-[3px]"><img src="/icons/dribble.svg" className="w-[27px] h-[27px]"  alt="" /></a> : ""}
                            </div>
                        </div>
                    </div>
                })}
                </div>
            </section>
            <section className="rounded-[9px] bg-[#1F1E1E] px-[30px] py-[15px] flex flex-col gap-6">
                <div>
                    <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Getting Started with {currentProject.name ? currentProject.name : dummyProject.name}</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus iste nulla aut! Minus non tenetur illo, delectus eius porro officiis illum culpa numquam quo dolore ipsa eveniet facilis tempore quasi.</p>
                </div>
                <div>
                    <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium pb-3`}>Use Cases</h3>
                    {currentProject.useCases ? currentProject.useCases.map((usecase, index) => {
                        return <div key={index}>
                            <h4>{usecase.name ? usecase.name : dummyProject.useCases[index].name}</h4>
                            <div>
                                <p>{usecase.info ? usecase.info : dummyProject.useCases[index].info}</p>
                                <a href={usecase.liveLink ? usecase.liveLink : dummyProject.useCases[index].liveLink}>Try It!</a>
                            </div>
                        </div>
                    }) : ""}
                </div>
            </section>
        </main>:<h1>Project doesnt Exist</h1>}
        <Footer/>
    </>
  )
}

export default Project

const dummyProject =  {
  name: "Dummy Name",
  processID:"NO-ID",
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