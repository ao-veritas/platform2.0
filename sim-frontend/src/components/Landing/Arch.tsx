import { brandSecondaryText } from "../../_utils/colors";
import { Cover } from "../ui/cover";

const Arch = () => {
    return (
      <section className="w-[100vw] text-[#eeeeee] flex flex-col justify-center items-center fadeInScroll">
        <h1 className="lg:text-[39px] md:text-[27px] text-[18px]
        lg:leading-[39px] md:leading-[27px] leading-[21px]
        font-medium text-center max-w-[60%]">Stake <Cover><span className={`${brandSecondaryText}`}>$AOEth</span></Cover> at projects built on arweave and recieve their <Cover><span className={`${brandSecondaryText}`}>$tokens</span></Cover> </h1>
        <img src="/arch.png" className="lg:mt-[-90px] md:mt-[-45px] mt-[-30px]"/>
      </section>
    );
  };
  
  export default Arch;
  