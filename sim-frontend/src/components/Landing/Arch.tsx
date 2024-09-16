import { brandSecondaryText } from "../../_utils/colors";
import { Cover } from "../ui/cover";

const Arch = () => {
    return (
      <section className="w-[100vw] text-[#eeeeee] lg:flex hidden flex-col justify-center items-center fadeInScroll">
        {/* <img src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/arch/archBg.svg"} className="w-full" />
        <img
          src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/arch/archPointer.svg"}
          className={`w-[21px] h-[21px] absolute opacity-1 z-10 ltr`}
        />
        <img
          src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/arch/archArrowDown.svg"}
          className={`w-[21px] h-[21px] absolute opacity-1 z-10 ttb `}
        />
        <img
          src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/arch/archPointerLeft.svg"}
          className={`w-[21px] h-[21px] absolute opacity-1 z-10 rtl `}
        /> */}
        {/* <img
          src="https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/arch/archArrow.svg"
          className={`w-[21px] h-[21px] absolute opacity-1 z-10 arr1 `}
        /> */}
        <h1 className="text-[39px] font-medium text-center max-w-[60%]">Stake <Cover><span className={`${brandSecondaryText}`}>$AOEth</span></Cover> at projects built on arweave and recieve their <Cover><span className={`${brandSecondaryText}`}>$tokens</span></Cover> </h1>
        <img src="/arch.svg" className="mt-[-180px]"/>
      </section>
    );
  };
  
  export default Arch;
  