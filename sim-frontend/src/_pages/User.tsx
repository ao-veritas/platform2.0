import { useConnection } from 'arweave-wallet-kit';
import { useEffect, useState } from 'react'
import userStakes from '../_utils/info';
import Navbar from '../_components/Layout/Navbar';

type UserStakes = {
    UserID: string;
    TokenID: string;
    TotalStaked: string;
    ProjectID: string;
  };


const User = () => {
    const { connected } = useConnection();  
    const [userData, setUserData] = useState<UserStakes[]>([]);
    useEffect(() => {
      userData.map((user) => {
        console.log(user)
      })
    }, [userData])
    
    return (
    <main className="bg-[#212121] min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6">
              <Navbar/>
              <button onClick={async()=>{
                setUserData(await userStakes());
              }}>Get user</button>
    </main>
  )
}

export default User