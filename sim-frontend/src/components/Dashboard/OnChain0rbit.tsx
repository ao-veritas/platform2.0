import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  TooltipProps,
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

import { messageActivity, messageDistribution, tokenBalances, uniqueUsersData, userMetrics } from "./0rbitData";
import { format } from "date-fns";
import { TokenBalancesPieChart } from "./TokenBalances";
import { useMemo } from "react";
// import { ValueType } from "framer-motion";

const truncateAddress = (address: string) => {
  if (address === "Others") return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 shadow-md">
        <p className="text-gray-700 font-semibold">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-900">{`${entry.name}: ${entry.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const project = {
  name: "Project Alpha",
  processID: "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
  tokenID: "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
  tokensHeld: [
    { id: "TKN-001", ticker: "ALPHA", quantity: "1000000" },
    { id: "TKN-002", ticker: "BETA", quantity: "500000" },
    { id: "TKN-002", ticker: "BETA", quantity: "500000" },
    { id: "TKN-002", ticker: "BETA", quantity: "50000" },
    { id: "TKN-002", ticker: "BETA", quantity: "700000" },
    { id: "TKN-002", ticker: "BETA", quantity: "500000" },
  ],
  distribution: [
    { id: "DIST-001", quantity: "750000" },
    { id: "DIST-002", quantity: "750000" },
  ],
  tokenFlow: { daily: "10000", weekly: "70000", monthly: "300000" },
  messagesPerDay: "5000",
  uniqueUsers: { daily: "1000", weekly: "5000", monthly: "15000", lifetime: "50000" },
  typesOfMessages: [
    { name: "Type A", lastSixMonths: { jan: "1000", feb: "1200", mar: "1100", apr: "1300", may: "1500", jun: "1400" } },
    { name: "Type B", lastSixMonths: { jan: "800", feb: "900", mar: "1000", apr: "1100", may: "1200", jun: "1300" } },
    { name: "Type C", lastSixMonths: { jan: "600", feb: "700", mar: "800", apr: "900", may: "1000", jun: "1100" } },
  ],
};

const COLORS = ["#0E9C9C", "#407AE5", "#FF6B6B", "#FFD93D", "#4CAF50", "#9C27B0"];

const OnChain0rbit = () => {
  const processedTokenBalances = useMemo(() => {
    if (!tokenBalances) return [];
    // divide each quantity by 10^12
    const sorted = tokenBalances.sort((a, b) => b.quantity - a.quantity).map((item) => ({ address: item.address, quantity: item.quantity / 10 ** 12 }));

    const top10 = sorted.slice(0, 5);
    const others = sorted.slice(5).reduce((acc, curr) => ({ address: "Others", quantity: acc.quantity + curr.quantity }), { address: "Others", quantity: 0 });
    return [...top10, others].filter((item) => item.quantity > 0);
  }, []);
  // const messageTypeData = project.typesOfMessages[0].lastSixMonths;
  // const messageTypeChartData = Object.entries(messageTypeData).map(([month]) => ({
  //   month,
  //   "Type A": parseInt(project.typesOfMessages[0].lastSixMonths[month]),
  //   "Type B": parseInt(project.typesOfMessages[1].lastSixMonths[month]),
  //   "Type C": parseInt(project.typesOfMessages[2].lastSixMonths[month]),
  // }));

  // const uniqueUsersData = [
  //   { subject: "Daily", A: parseInt(project.uniqueUsers.daily) },
  //   { subject: "Weekly", A: parseInt(project.uniqueUsers.weekly) },
  //   { subject: "Monthly", A: parseInt(project.uniqueUsers.monthly) },
  //   { subject: "Lifetime", A: parseInt(project.uniqueUsers.lifetime) },
  // ];

  // Process token balances to show top 10 and group the rest

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* project details */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Key information about the project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Process ID:</strong> {project.processID}
            </p>
            <p>
              <strong>Token ID:</strong> {project.tokenID}
            </p>
            <p>
              <strong>Num of Token Holders:</strong> {tokenBalances.length}
            </p>
            <p>
              <strong>Avg. Messages Per Day:</strong> {Math.round(messageDistribution.reduce((acc, curr) => acc + curr.count, 0) / messageActivity.length)}
            </p>
          </div>
        </CardContent>
      </Card>
      {/* stats */}
      <Card>
        <CardHeader>
          <CardTitle>Unique Users</CardTitle>
          <CardDescription>Current user statistics as of {userMetrics[userMetrics.length - 1].date}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Daily</h3>
              <p className="text-3xl font-bold">{userMetrics[userMetrics.length - 1].dau}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Weekly</h3>
              <p className="text-3xl font-bold">{userMetrics[userMetrics.length - 1].wau}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Monthly</h3>
              <p className="text-3xl font-bold">{userMetrics[userMetrics.length - 1].mau}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Lifetime</h3>
              <p className="text-3xl font-bold">{uniqueUsersData[uniqueUsersData.length - 1].count}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Line chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Lifetime Users</CardTitle>
          <CardDescription>The total unique user growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {/* make a line graph */}
            <LineChart data={uniqueUsersData}>
              <Line dot={false} type="monotone" dataKey="count" stroke="#0E9C9C" />
              <XAxis interval={"preserveStartEnd"} angle={-45} textAnchor="end" height={50} dataKey="date" tickFormatter={(dateString) => format(new Date(dateString), "dd-MMM")} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>User Metrics</CardTitle>
          <CardDescription>The DAU, WAU and MAU for the project</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {/* make a line graph */}
            <LineChart data={userMetrics}>
              <Line dot={false} type="monotone" dataKey="dau" stroke="#0E9C9C" />
              <Line dot={false} type="monotone" dataKey="wau" stroke="#407AE5" />
              <Line dot={false} type="monotone" dataKey="mau" stroke="#FF6B6B" />
              <XAxis interval={"preserveStartEnd"} angle={-45} textAnchor="end" height={50} dataKey="date" tickFormatter={(dateString) => format(new Date(dateString), "dd-MMM")} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* pie graph */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Token Distribution</CardTitle>
          <CardDescription>Pie chart of token distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie nameKey="address" data={processedTokenBalances} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#0E9C9C" dataKey="quantity">
                {processedTokenBalances.map((value, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} tokens`, truncateAddress(name as string)]} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value, entry, index) => {
                  const { payload } = entry;
                  return (
                    <span className="flex items-center justify-between w-full">
                      <span className="font-medium">{truncateAddress(payload.address)}</span>
                      <span className="text-gray-600 ml-2">{Number(payload.quantity).toLocaleString()} tokens</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Area chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Message Activity</CardTitle>
          <CardDescription>Area chart showing messages sent by users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={messageActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis interval={"preserveStartEnd"} angle={-45} textAnchor="end" height={50} dataKey="date" tickFormatter={(dateString) => format(new Date(dateString), "dd-MMM")} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="Post-Real-Data" stackId="1" stroke="#0E9C9C" fill="#0E9C9C" />
              <Area type="monotone" dataKey="Get-Real-Data" stackId="1" stroke="#407AE5" fill="#407AE5" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* pie chart */}
      <Card>
        <CardHeader>
          <CardTitle>Message Distribution</CardTitle>
          <CardDescription>Pie chart of message distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={messageDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#0E9C9C" dataKey="count">
                {messageDistribution.map((value, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnChain0rbit;
