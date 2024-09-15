import React from "react";
interface TeamProps {
  pname: string;
  github?: string;
  dribble?: string;
  twitter: string;
  info: string;
  last: boolean;
  img: string;
}

const TeamCard: React.FC<TeamProps> = ({ pname, github, dribble, twitter, info, img }) => {
  return (
    <div
      className={`ttbAnim teamWave text-center flex flex-col justify-start items-center
        w-[100%] sm:rounded-full rounded-b-lg rounded-t-full h-fit min-h-full max-h-fit
        xl:gap-[6px] lg:gap-[3px] gap-[6px]
        xl:pt-3 xl:pb-[30px] xl:px-3 
        pt-[12px] pb-[21px] px-[12px]
        bg-[#272727] border-[#4FD2DE] border-[1px]
        `}
    >
      <img
        src={img}
        height={150}
        width={150}
        alt={pname}
        className="rounded-full 
          justify-self-start
          xl:w-[135px] xl:h-[198px] xl:mb-[6.6px]
          w-[135px] h-[198px] mb-[6.6px]"
      />
      <h2
        className="xl:text-[18px] xl:leading-[18px] 
          text-[18px] leading-[18px]
         capitalize text-[#4FD2DE]"
      >
        {pname}
      </h2>
      <h4
        className="  font-light
        xl:text-[12px] xl:leading-[15px] xl:max-w-[135px]
        text-[12px] leading-[15px] max-w-[135px]"      >
        {info}
      </h4>
      <div className=" flex flex-row xl:gap-3 gap-[9px] pt-3">
        <a href={twitter}>
          <img
            src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/icons/twitterTeam.svg"}
            alt="x"
            height={30}
            width={30}
            className="xl:w-[15px] xl:h-[15px]
              w-[15px] h-[15px]
              hover:opacity-75 hover:scale-90 hover:cursor-pointer"
          />
        </a>
        {github && (
          <a href={github}>
            <img
              src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/icons/githubTeam.svg"}
              alt="github"
              height={30}
              width={30}
              className="xl:w-[15px] xl:h-[15px]
              w-[15px] h-[15px] hover:opacity-75 hover:scale-90 hover:cursor-pointer"
            />
          </a>
        )}
        {dribble && (
          <a href={dribble}>
            {/* <FaDribbble
              className={` hover:opacity-75 hover:scale-90 hover:cursor-pointer 
                xl:w-[15px] xl:h-[15px]
                lg:w-3 lg:h-3
                w-3 h-3 
                w-[15px] h-[15px]`}
            />{" "} */}
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
