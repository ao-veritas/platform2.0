import { Link } from "react-router-dom";
import { brandDarkBg } from "../../_utils/colors";

const Footer = () => {
  return (
    <footer className={`flex flex-row justify-between items-center md:px-20 px-3 py-[24px] ${brandDarkBg}`}>
      <Link to="/">
        <img src="/logos/LogoDarkMode.svg" className="h-[30px] w-[150px]" />
      </Link>
      <div className="flex md:flex-row flex-col md:gap-[39px] gap-[12px] text-center text-[#40959D] text-[18px]">
        <Link to="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Team</h4>
        </Link>
        <Link to="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Dummy Stake</h4>
        </Link>
        <Link to="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Faucet</h4>
        </Link>
        <Link to="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Dashboards</h4>
        </Link>
      </div>
      <div className="flex flex-row gap-[12px]">
        <Link to="https://github.com/fundars/platform2.0" target="_blank">
          <img
            src="/icons/githubSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </Link>
        <Link to="https://x.com/Veritas_ao" target="_blank">
          <img
            src="/icons/twitterSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </Link>
        <Link to="https://discord.gg/MTP7BQgr" target="_blank">
          <img
            src="/icons/discordSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
