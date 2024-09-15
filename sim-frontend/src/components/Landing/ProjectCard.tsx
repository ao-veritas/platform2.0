// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProjectType } from "../../types/Project";

export default function ProjectCard({ project }: { project: ProjectType }) {
  //   const navigate = useNavigate();

  return (
    <Link
      to={"/project/" + project?.token.ticker}
      className="max-w-[390px] rounded-lg place-self-center
      flex flex-col gap-[6px] bg-zinc-900 justify-between items-center py-[15px] px-[21px] mb-10"
    >
      <div className="flex w-full h-1/2 gap-2">
        <div className="w-1/4 h-16">
          <img src={project?.logoImageLink} className="w-full h-full" />
        </div>
        <div className="flex flex-col w-1/3 gap-1">
          <div className="font-[Raleway] text-white text-3xl tracking-normal pl-1">{project?.name}</div>
          <div className="rounded-sm flex flex-row py-[3px] bg-[#393939] text-[#f1f1f1] gap-1 items-center">
            <svg width="20" height="20">
              <circle cx="10" cy="10" r="7" />
            </svg>
            <p className="text-white text-sm font-[Raleway] font-medium">${project?.token.ticker}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-sm text-justify text-wrap text-[#f1f1f1] font-[Raleway] font-light">{project?.description}</p>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col text-sm">
            <p className="font-[Raleway] text-[#40959D]">Amount Staked</p>
            <p>{(project.amountStaked / 10 ** 12).toFixed(2)} $AoEth</p>
          </div>
          <div className="flex flex-col text-sm">
            <p className="font-[Raleway] text-[#40959D]">Token Recieved</p>
            <p>500 $SAT</p>
          </div>
        </div>
        <div className="flex flex-row gap-2 text-xs">
          <button className="bg-teal-700 hover:bg-teal-600  text-black py-1 px-2 rounded-lg">Stake More</button>
          <button className="border border-teal-700 text-teal-600 hover:border-teal-600 hover:text-teal-600 py-1 px-2 rounded-lg">Unstake</button>
        </div>
      </div>
    </Link>
  );
}
