import { brandDarkBg, brandDarkBorder, brandSecondaryBg, brandSecondaryText } from "../_utils/colors"
import { Navbar, ProjectStakes } from "../components"


const Saturn = () => {
    const projectID:string = import.meta.env.VITE_SATURN_ID;
  return (
    <>
        <Navbar/>
        <main className={` ${brandDarkBg} w-[100vw] px-20 pt-[120px] text-[#FCFCFC] font-raleway`}>
            <section className="">
                <img src={project.bannerLink} alt="" className="rounded-md max-h-[300px]"/>
                <div className={`mt-[-45px] border-[3px] border-solid ${brandDarkBorder} rounded-md w-fit`}>
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
                <button className={`${brandSecondaryBg} hover:opacity-60 cursor-pointer rounded-md px-[24px] py-[6px] text-[18px] font-medium`}>Stake Now</button>
            </section>
            <section className="flex flex-row gap-3 w-full mb-[12px]">
                <section className="w-full flex flex-col gap-6 rounded-lg bg-[#1F1E1E] px-[24px] py-[12px]">
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
                    <div className="rounded-lg bg-[#1F1E1E] px-[24px] py-[12px]">
                        <div className="flex flex-row items-center justify-between">
                        <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium `}><span className="uppercase">${project.token.name}</span> Token</h3>
                        <h4 className="bg-[#393939] rounded-sm px-[6px] py-[2px] text-[12px]">${project.token.ticker}</h4>
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
            <section className="rounded-lg bg-[#1F1E1E] px-[30px] py-[15px] mb-[12px]">
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
            <section className="rounded-lg bg-[#1F1E1E] px-[30px] py-[15px] flex flex-col gap-6">
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
    </>
  )
}

export default Saturn

const project = {
    name: "0rbit",
    processID:"BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
    logoImageLink:"https://www.0rbit.co/logos/sqLightFill.svg",
    bannerLink:"https://www.0rbit.co/logos/ogBanner.jpeg",
    links: {
        website: "https://0rbit.co/",
        docs:"https://docs.0rbit.co/",
        discord: "https://discord.gg/JVSjqaKJgV",
        twitter: "https://twitter.com/0rbitco",
        github: "https://github.com/0rbit-co",
        telegram: "",
        other: ["https://www.playground.0rbit.co/","https://mirror.xyz/0x26B11B188E9E69b2426FD6111302E721F423020E"]
    },
    team: [{
        officialName:"Yash Garg",
        pseudoName:"megabyte",
        role:"Co-Founder",
        imgLink:"https://0rbit.co/team/megabyte.png",
        links:{
            github:"https://github.com/megabyte0x",
            twitter:"https://x.com/megabyte0x?t=WZYKcJAvN-CM7a6yU4lPNQ&s=09",
            dribble:"",
            other:["",""],
        },
    },
    {
        officialName:"Ayush Agrawal",
        pseudoName:"lucifer0x17",
        role:"Co-Founder",
        imgLink:"https://0rbit.co/team/lucifer.png",
        links:{
            github:"https://github.com/Lucifer0x17",
            twitter:"https://x.com/Lucifer0x17?t=fH5LRms3xy2hSPLJbNubaA&s=09",
            dribble:"",
            other:["",""],
        },
    },
    {
        officialName:"Manishi Bhatnagar",
        pseudoName:"",
        role:"UI/ UX Designer",
        imgLink:"https://0rbit.co/team/manishi.png",
        links:{
            github:"",
            twitter:"https://x.com/0xManishi?t=FKn7XBJwlIXwJR-f4KGkzw&s=09",
            dribble:"https://dribbble.com/0xManishi",
            other:["",""],
        },
    },
    {
        officialName:"Sarthak Shah",
        pseudoName:"",
        role:"Engineer",
        imgLink:"https://0rbit.co/team/sarthak.png",
        links:{
            github:"https://github.com/Not-Sarthak",
            twitter:"https://x.com/0xSarthak13?t=nvsUz9hxhq2hQO25wr8Rtw&s=09",
            dribble:"",
            other:["",""],
        },
    }],
    description: "The Decentralized Oracle Network on AO for accessing any off-chain data.",
    oneLiner: "Decentralized Oracle Network on Arweave",
    token: {
        name:"0rbt",
        ticker:"0RBT",
        processId:"BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
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