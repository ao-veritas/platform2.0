import { useEffect, useState } from "react";
import Nav from "../_components/Nav"
import stake from "../_utils/stake";
type UserTokensResult = {
  Name?: string;
  Ticker?: string;
  Logo?: string;
  Denomination: number;
  processId: string;
  balance?: string | null;
}
const Saturn = () => {
  const taoethID = import.meta.env.VITE_TAOETH_ID;
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [maxAvailable, setMaxAvailable] = useState<string>("")
  const stakeHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    stake(stakeAmount)
  };
  useEffect(() => {
    test();
  }, [])
  const test = async() => {
    await window.arweaveWallet.connect(["ACCESS_TOKENS"]);
    const tokensWithBalances = await window.arweaveWallet.userTokens({ fetchBalance: true });
    tokensWithBalances.map((token:UserTokensResult) => {
      if(token.processId == taoethID){
        setMaxAvailable(token.balance)
        console.log(token.balance)

      }
    })
    console.log("Tokens with their balances:", tokensWithBalances);
  }
  return (
    <main
    className="bg-[#212121] min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6">
      <Nav/>
      <h2>SATURN</h2>
      <form action=""  onSubmit={(e) => {stakeHandler(e)}} className="flex flex-col gap-3 w-[300px]">
        <div className="flex flex-col gap-[6px]">
            <label className="text-[18px]" htmlFor="">Amount</label>
            <input
            value={stakeAmount}
            onChange={(e) => {
                setStakeAmount(Number(e.target.value))
            }}
            className="bg-[#666666] rounded-md py-[4px] px-[12px] text-[15px]" type="number" />
        </div>
        <input type="submit" value="Stake" className="bg-[#101010] py-[6px] rounded-sm hover:opacity-60 cursor-pointer px-[12px]"/>
      </form>
      <h3>MAX: {maxAvailable? maxAvailable:"Loading..."}</h3>
    </main>
  )
}

export default Saturn