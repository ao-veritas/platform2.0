import { ConnectButton, useActiveAddress } from 'arweave-wallet-kit';
import Navbar from '../components/Layout/Navbar';
import { brandDarkBg } from '../_utils/colors';
import { TaoEthBalance, TaoEthStaked } from '../components';
import ProjectCard from '../components/Landing/ProjectCard';
import { project } from './Saturn';

// type UserStakes = {
//     UserID: string;
//     TokenID: string;
//     TotalStaked: string;
//     ProjectID: string;
//   };


const User = () => {
  const address = useActiveAddress();
    if (!address)
      return (
        <>
        <Navbar/>
        <main className={`${brandDarkBg} min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6 pt-[120px]`}>
          <section className='flex flex-col rounded-lg bg-[#1F1E1E] px-[30px] py-[15px] items-start gap-6'>
            <h3 className='font-medium text-[21px]'>Please connect Wallet to view your Stakes:</h3>
            <ConnectButton accent="rgb(14, 156, 156)"/> 
          </section>
        </main>
    </>
      ); 
    return (
      <>
        <Navbar/>
        <main className={`${brandDarkBg} min-h-[100vh] w-full text-[#ffffff] flex flex-col justify-start items-center gap-6 pt-[120px]`}>
          <div className='flex flex-col justify-start w-4/5 gap-20'>
            <div className='flex gap-20 ml-20'>
              <TaoEthBalance/> 
              <TaoEthStaked/>
            </div>
            <div className='grid md:grid-cols-2 '>
              <ProjectCard project={project}/>
              <ProjectCard project={project}/>
              <ProjectCard project={project}/>
            </div>
          </div>
        </main>
    </>
  )
}

export default User