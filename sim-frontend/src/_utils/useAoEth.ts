import { dryrun } from "@permaweb/aoconnect";
import { useEffect, useState } from "react";

export function useUserAoETH(address?: string) {
  const AOETH_TOKEN_PID = import.meta.env.VITE_TAOETH_ID;
  const [aoeth, setAoeth] = useState<number | null>(null);
  const fetchData = async () => {
    if (!address) return;
    const result = await dryrun({
      process: AOETH_TOKEN_PID,
      tags: [
        { name: "Action", value: "Balance" },
        { name: "Recipient", value: address },
      ],
      anchor: "1234",
    });
    const aoeth = JSON.parse(result.Messages[0].Data);
    console.log("got taoeth", aoeth);
    setAoeth(aoeth / 10 ** 12);
  };
  useEffect(() => {
    fetchData();
  }, [address]);

  const refresh = async () => {
    await fetchData();
  };

  return { aoeth, refresh };
}
