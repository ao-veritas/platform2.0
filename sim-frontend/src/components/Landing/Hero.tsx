
const Hero = () => {
  return (
    <section className="w-full text-[#eeeeee] flex flex-col justify-center items-center lg:px-20 px-6 pt-[15px] pb-[90px]">
      <div className="relative flex flex-row justify-between items-center w-full">
        <div className="w-fit ltrAnim">
          <img
            src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/HeroCircle.svg"}
            className="lg:w-[390px] lg:h-[390px] md:w-[270px] md:h-[270px] w-[180px] h-[180px]"
          />
        </div>
        <div className="w-fit absolute inset-0 mx-auto rotate-[-90deg] z-10">
          <img
            src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/HeroCircle.svg"}
            className="lg:w-[390px] lg:h-[390px] md:w-[270px] md:h-[270px] w-[180px] h-[180px]"
          />
        </div>
        <h1 className="lg:text-[36px] md:text-[27px] text-[18px]
        ttbAnim text-center z-10 w-fit mx-[-120px]">
          Explore the <span className=" text-[#40959D] block">Permissonless Ecosystem Funding</span> platform on AO
        </h1>
        <div className="w-fit rtlAnim">
          <img
            src={"https://ykxdc44ycigwbzizbvfquofna2yx2tkn3e6fx5zjltzbjfpbeqcq.arweave.net/wq4xc5gSDWDlGQ1LCjitBrF9TU3ZPFv3KVzyFJXhJAU/HeroCircle.svg"}
            className="lg:w-[390px] lg:h-[390px] md:w-[270px] md:h-[270px] w-[180px] h-[180px] rotate-180"
          />
        </div>
      </div>
      <div className="flex flex-row gap-6 fadeIn pt-9">
        <a href="/register">
          <button className="hover:bg-[#40959d36] hover:tracking-wider rounded-md md:w-[180px] w-[120px] md:text-[16.5px] text-[12px] py-[9px] border-[1px] border-[#40959D]">Add your project</button>
        </a>
        <a href="https://github.com/fundars/platform2.0">
          <button className="hover:bg-[#40959ddf] hover:tracking-wider rounded-md md:w-[180px] w-[120px] md:text-[16.5px] text-[12px] py-[9px] bg-[#40959D]">Explore</button>
        </a>
      </div>
    </section>
  );
};

export default Hero;
