import { brandDarkBg } from "../../_utils/colors";

const Footer = () => {
  return (
    <footer className={`flex flex-row justify-between items-center md:px-20 px-3 py-[24px] ${brandDarkBg}`}>
      <a href="/">
        <img src="/logos/LogoDarkMode.svg" className="h-[30px] w-[150px]" />
      </a>
      <div className="flex md:flex-row flex-col md:gap-[39px] gap-[12px] text-center text-[#40959D] text-[18px]">
        <a href="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Team</h4>
        </a>
        <a href="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Dummy Stake</h4>
        </a>
        <a href="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Faucet</h4>
        </a>
        <a href="/about">
          <h4 className="hover:opacity-90 hover:underline underline-offset-[3px] hover:cursor-pointer">Dashboards</h4>
        </a>
      </div>
      <div className="flex flex-row gap-[12px]">
        <a href="https://github.com/fundars/platform2.0" target="_blank">
          <img
            src="/icons/githubSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </a>
        <a href="https://x.com/Veritas_ao" target="_blank">
          <img
            src="/icons/twitterSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </a>
        <a href="https://discord.gg/MTP7BQgr" target="_blank">
          <img
            src="/icons/discordSecondary.svg"
            className="h-[36px] w-[36px]"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
