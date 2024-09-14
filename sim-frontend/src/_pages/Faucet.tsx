import { ConnectButton, useActiveAddress } from "arweave-wallet-kit";
import { useState } from "react";
import { toast } from "sonner";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useUserAoETH } from "../_utils/useAoEth";
import { AOETH_TOKEN_PID } from "../_utils/constants";
import Loader from "../_components/Loader";

export default function Faucet() {
  const address = useActiveAddress();
  // const { connected } = useConnection();
  const { aoeth: aoethBalance, refresh: refreshAoethBalance } = useUserAoETH(address);
  const [loading, setLoading] = useState(false);

  if (!address) {
    <div className="text-white flex justify-center items-start h-60">
      <ConnectButton />
    </div>;
  }

  const airdropTokens = async () => {
    setLoading(true);
    // Call the backend API to airdrop the tokens
    const res = await message({
      process: AOETH_TOKEN_PID,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "tAoETH-Airdrop" }],
    });
    const postResult = await result({
      process: AOETH_TOKEN_PID,
      message: res,
    });

    console.log({ postResult });
    if (postResult.Error || postResult.Messages.length === 0) {
      console.log(postResult.Error);
      throw new Error(postResult.Error);
    }
    await refreshAoethBalance();
  };

  return (
    <main className="w-[100vw] flex flex-col gap-12 font-[Rale-Regular] px-20">
      <div className="flex flex-col justify-start items-start">
        <h2 className="text-[#40959D] text-[27px] tracking-widest">$tAoEth Balance:</h2>
        {aoethBalance == null ? (
          <div className="animate-pulse space-y-2">
            <div className="bg-gray-300 h-6 w-48 rounded"></div>
          </div>
        ) : (
          <h3 className="text-[#f1f1f1] text-[24px] font-[Rale-Medium]">{aoethBalance.toFixed(2)} $tAoEth</h3>
        )}
      </div>
      <h2 className="text-[#40959D] text-[27px] tracking-widest">Need tAoETH to explore Permissionless Ecosystem Funding?</h2>

      <button
        onClick={() => {
          const promise = airdropTokens();
          toast.promise(promise, {
            loading: "Sending $tAoEth...",
            success: () => {
              return `Sent $tAoEth to ${address}`;
            },
            error: "Please wait for some time before requesting an airdrop again!",
          });
          promise.finally(() => setLoading(false));
        }}
        disabled={loading}
        className={`flex gap-4 w-fit ${loading ? "bg-gray-400" : "bg-[#205156]"} text-[#f1f1f1] py-[6px] px-[18px] rounded`}
      >
        {loading ? <Loader /> : ""}
        Get $tAoEth
      </button>
    </main>
  );
}
