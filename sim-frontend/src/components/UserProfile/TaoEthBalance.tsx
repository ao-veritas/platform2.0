import { useEffect, useState } from 'react'
// import { UserTokensResult } from '../../_utils/types';
import { useActiveAddress } from "arweave-wallet-kit";
import { useUserAoETH } from '../../_utils/useAoEth';

const TaoEthBalance = () => {
  const address = useActiveAddress();
  const [balance, setBalance] = useState<string>("")
  const availableAOEth = useUserAoETH(address).aoeth ?? 0;
  useEffect(() => {
    setBalance(availableAOEth.toString())
  },[])

  return (
    <div>
        <div className="flex flex-col justify-start items-start">
        <h2 className="text-[#000000] text-[27px] tracking-normal">$AoEth Balance:</h2>
        {balance == "" ? (
          <div className="animate-pulse space-y-2">
            <div className="bg-gray-300 h-6 w-48 rounded"></div>
          </div>
        ) : (
          <h3 className="text-[#f1f1f1] text-[24px] font-sans tracking-tight">{balance} $tAoEth</h3>
        )}
      </div>
    </div>
  )
}

export default TaoEthBalance