
import ProjectCard from "./ProjectCard";
import { projects } from "@/_utils/projects";

const ProjectsDisplay = () => {
  return (
    <section id="projects" className="lg:px-20 px-6 flex flex-col items-center justify-start md:gap-9 md:fadeInScroll mb-12">
      <div className="flex flex-row justify-center items-center w-full ">
        <h3 className="md:text-[39px] text-[24px] text-[#40959D] font-[Rale-Medium] text-center mb-[-15px]">Featured Projects</h3>
        {/* <div className="flex flex-row gap-[12px] justify-end items-center">
          <input
            type="text"
            placeholder="Search for Projects"
            className=" text-[#f1f1f1] border-[1px] bg-[#00000000] rounded-[9px] px-[12px] py-[6px] border-[#40959D] min-w-[310px]"
          />
          <a href="" className="bg-[#205156] rounded-[6px] p-[9px]">
            <img alt="search" src="/icons/searchIcon.svg" className="w-[18px] h-[18px]" />
          </a>
        </div> */}
      </div>
      <div className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-[21px] gap-[0px] w-full">
        {" "}
        {projects.map((project) => {
          return <ProjectCard project={project} />;
        })}
      </div>
    </section>
  );
};

export default ProjectsDisplay;
// export const project = {
//   name: "0rbit",
//   processID:"BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
//   logoImageLink:"https://www.0rbit.co/logos/sqLightFill.svg",
//   bannerLink:"https://www.0rbit.co/logos/ogBanner.jpeg",
//   links: {
//       website: "https://0rbit.co/",
//       docs:"https://docs.0rbit.co/",
//       discord: "https://discord.gg/JVSjqaKJgV",
//       twitter: "https://twitter.com/0rbitco",
//       github: "https://github.com/0rbit-co",
//       telegram: "",
//       other: ["https://www.playground.0rbit.co/","https://mirror.xyz/0x26B11B188E9E69b2426FD6111302E721F423020E"]
//   },
//   team: [{
//       officialName:"Yash Garg",
//       pseudoName:"megabyte",
//       role:"Co-Founder",
//       imgLink:"https://0rbit.co/team/megabyte.png",
//       links:{
//           github:"https://github.com/megabyte0x",
//           twitter:"https://x.com/megabyte0x?t=WZYKcJAvN-CM7a6yU4lPNQ&s=09",
//           dribble:"",
//           other:["",""],
//       },
//   },
//   {
//       officialName:"Ayush Agrawal",
//       pseudoName:"lucifer0x17",
//       role:"Co-Founder",
//       imgLink:"https://0rbit.co/team/lucifer.png",
//       links:{
//           github:"https://github.com/Lucifer0x17",
//           twitter:"https://x.com/Lucifer0x17?t=fH5LRms3xy2hSPLJbNubaA&s=09",
//           dribble:"",
//           other:["",""],
//       },
//   },
//   {
//       officialName:"Manishi Bhatnagar",
//       pseudoName:"",
//       role:"UI/ UX Designer",
//       imgLink:"https://0rbit.co/team/manishi.png",
//       links:{
//           github:"",
//           twitter:"https://x.com/0xManishi?t=FKn7XBJwlIXwJR-f4KGkzw&s=09",
//           dribble:"https://dribbble.com/0xManishi",
//           other:["",""],
//       },
//   },
//   {
//       officialName:"Sarthak Shah",
//       pseudoName:"",
//       role:"Engineer",
//       imgLink:"https://0rbit.co/team/sarthak.png",
//       links:{
//           github:"https://github.com/Not-Sarthak",
//           twitter:"https://x.com/0xSarthak13?t=nvsUz9hxhq2hQO25wr8Rtw&s=09",
//           dribble:"",
//           other:["",""],
//       },
//   }],
//   exchangeInfo:{
//       cooldownPeriod:60,
//       aoethRewardRate:10,
//   },
//   description: "The Decentralized Oracle Network on AO for accessing any off-chain data.",
//   oneLiner: "Decentralized Oracle Network on Arweave",
//   token: {
//       name:"0rbt",
//       ticker:"0RBT",
//       processId:"BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
//       denomination:"",
//       totalSupply:"",
//       tokenomics:{
//           info:"",
//           linkToBlogorPaper:""
//       }
//   },
//   gettingStartedGuide:"",
//   projectOrigin:"",
//   useCases: [{
//       name:"",
//       info:"",
//       liveLink:"",
//       other:[""]
//   }],
//   advisorsInvestors:[{
//       name:"",
//       role:"",
//       moreInfo:"",
//       amountIfAny:[""],
//   }],
//   mileStones:[{
//       goal:"",
//       date:"",
//       proof:"",
//       status:""
//   }],
//   mediaMentions:[""],
//   collaborations:[{
//       name:"",
//       link:"",
//       info:""
//   }],
//   ownershipPercentages:[{
//       name:"",
//       role:"",
//       percentage:""
//   }]
// }