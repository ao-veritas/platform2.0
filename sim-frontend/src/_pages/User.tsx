import { ConnectButton, useActiveAddress, useConnection } from 'arweave-wallet-kit';
import { useEffect, useState } from 'react'
import userStakes from '../_utils/info';
import Navbar from '../components/Layout/Navbar';
import { brandDarkBg } from '../_utils/colors';
import { TaoEthBalance, TaoEthStaked } from '../components';

type UserStakes = {
    UserID: string;
    TokenID: string;
    TotalStaked: string;
    ProjectID: string;
  };


const User = () => {
  const address = useActiveAddress();
    const { connected } = useConnection();  

    if (!address)
      return (
        <div className="text-white flex justify-center items-start h-60">
          <ConnectButton />
        </div>
      ); 
    return (
      <>
        <Navbar/>
        <main className={`${brandDarkBg} min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6 pt-[120px]`}>
           <TaoEthBalance/> 
            {/* <button onClick={async()=>{
              setUserData(await userStakes());
            }}>Get user</button> */}
            <TaoEthStaked/>
        </main>
    </>
  )
}

export default User