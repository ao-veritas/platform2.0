import React, { useEffect, useState } from 'react'
import { UserTokensResult } from '../../_utils/types';

const TaoEthBalance = () => {
const taoethID = import.meta.env.VITE_TAOETH_ID;
const [balance, setBalance] = useState<string>("")
useEffect(() => {
    test();
  }, [])
  const test = async() => {
    await window.arweaveWallet.connect(["ACCESS_TOKENS"]);
    const tokensWithBalances = await window.arweaveWallet.userTokens({ fetchBalance: true });
    tokensWithBalances.map((token:UserTokensResult) => {
      if(token.processId == taoethID){
        setBalance(token.balance)
        console.log(token.balance)

      }
    })
    console.log("Tokens with their balances:", tokensWithBalances);
  }
  return (
    <div>
        <div className="flex flex-col justify-start items-start">
        <h2 className="text-[#40959D] text-[27px] tracking-widest">$tAoEth Balance:</h2>
        {balance == "" ? (
          <div className="animate-pulse space-y-2">
            <div className="bg-gray-300 h-6 w-48 rounded"></div>
          </div>
        ) : (
          <h3 className="text-[#f1f1f1] text-[24px] font-[Rale-Medium]">{balance} $tAoEth</h3>
        )}
      </div>
    </div>
  )
}

export default TaoEthBalance