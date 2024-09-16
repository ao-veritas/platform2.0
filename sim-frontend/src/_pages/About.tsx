import { BackgroundBeams } from "@/components/ui/background-beams";
import { brandDarkBg } from "../_utils/colors";
import { Footer, Navbar, TeamCard } from "../components";

export default function About() {
  return (
    <>
     <Navbar/>
    <main
      className={`${brandDarkBg} flex flex-col items-center md:justify-center justify-between text-[#f1f1f1] pt-[0px] min-h-[93vh]`}>
      <h1
        className="uppercase tracking-wider font-bold leading-[51px]
      xl:text-[45px] text-[36px] text-[#4FD2DE]"
      >
        Team
      </h1>
      <h3
        className="capitalize pb-6 tracking-wide text-center md:font-normal font-medium
      xl:text-[30px] md:text-[21px] text-[15px]"
      >
        Meet the amazing team behind <span className={` tracking-wide text-[#4FD2DE]`}>Veritas</span>
      </h3>
      <div
        className="
        z-50 
          xl:gap-6 
          md:gap-[18px] flex md:flex-row
          flex-col gap-3
          items-center justify-center"
      >
        <TeamCard
          img={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/team/manishi.png"}
          pname="manishi"
          dribble="https://dribbble.com/0xManishi"
          twitter="https://x.com/0xManishi"
          info="Designer"
          last={false}
        />
        <TeamCard
          img={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/team/lilith.png"}
          pname="lilith"
          github="https://github.com/0xLPircy"
          twitter="https://x.com/0xLPircy"
          info="Developer"
          last={false}
        />
        <TeamCard
          img={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/team/parth.png"}
          pname="parth"
          github="https://github.com/parthks"
          twitter="https://x.com/1human_in/"
          info="Smart Contract Developer"
          last={false}
        />
      </div>
    </main>
    <Footer/>      <BackgroundBeams /></>
  );
}
