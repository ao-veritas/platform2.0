import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0E9C9C", "#407AE5", "#FF6B6B", "#FFD93D", "#4CAF50", "#9C27B0"];

export function TokenBalancesPieChart({
  tokenBalancesData,
}: {
  tokenBalancesData: {
    address: string;
    quantity: number;
  }[];
}) {
  const processedTokenBalances = useMemo(() => {
    if (!tokenBalancesData) return [];
    // divide each quantity by 10^12
    const sorted = tokenBalancesData.sort((a, b) => b.quantity - a.quantity).map((item) => ({ address: item.address, quantity: item.quantity / 1000000 }));

    const top10 = sorted.slice(0, 10);
    const others = sorted.slice(10).reduce((acc, curr) => ({ address: "Others", quantity: acc.quantity + curr.quantity }), { address: "Others", quantity: 0 });
    return [...top10, others].filter((item) => item.quantity > 0);
  }, [tokenBalancesData]);

  console.log(processedTokenBalances);

  return (
    <PieChart>
      <Pie nameKey="address" data={[{ quantity: 5, address: "2342" }]} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#0E9C9C" dataKey="quantity">
        {[{ quantity: 5, address: "2342" }].map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
