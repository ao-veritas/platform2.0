import { useEffect, useState } from "react";
import { getTaoEthStake } from "../../_utils/info";


const TaoEthStaked = () => {
    const [taoEthStaked, setTaoEthStaked] = useState<number>(0);
    useEffect(() => {
      callGetTaoStakes();
    }, [])
    const callGetTaoStakes = async() => {
      setTaoEthStaked(await getTaoEthStake());
    }
  return (
    <div className="flex flex-col justify-start items-start">
    <h2 className="text-[#40959D] text-[27px] tracking-widest">Total $tAoEth Staked:</h2>
    {!taoEthStaked ? (
      <div className="animate-pulse space-y-2">
        <div className="bg-gray-300 h-6 w-48 rounded"></div>
      </div>
    ) : (
      <h3 className="text-[#f1f1f1] text-[24px] font-[Rale-Medium]">{taoEthStaked} $tAoEth</h3>
    )}
  </div>
  )
}

export default TaoEthStaked