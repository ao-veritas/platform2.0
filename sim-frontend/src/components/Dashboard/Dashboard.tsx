import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
  } from "recharts";
  import {
    NameType,
    ValueType,
  } from "recharts/types/component/DefaultTooltipContent";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "../ui/card";
  import { format } from "date-fns";
  import { useMemo } from "react";
  
  const truncateAddress = (address: string) => {
    if (address === "Others") return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md">
          <p className="text-gray-700 font-semibold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-gray-900"
            >{`${entry.name}: ${entry.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // const project = {
  //   name: "Project Alpha",
  //   processID: "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
  //   tokenID: "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
  // };
  
  const COLORS = [
    "#0E9C9C",
    "#407AE5",
    "#FF6B6B",
    "#FFD93D",
    "#4CAF50",
    "#9C27B0",
  ];
  
  
  //TODO: Correct type setting for props here 
  
  const Dashboard = ({project, messageActivity, messageDistribution, tokenBalances, uniqueUsersData, userMetrics}: any) => {
    const sortedTokenBalances = useMemo(() => {
      if (!tokenBalances) return [];
      // divide each quantity by 10^12
      // remove the project.tokenID from the array
      
      const sorted = tokenBalances
        .filter((item: any) => item.address !== project.tokenID)
        //@ts-ignore
        .sort((a, b) => b.quantity - a.quantity)
        //@ts-ignore
        .map((item) => ({
          address: item.address,
          quantity: item.quantity / 10 ** 12,
        }));
      return sorted;
    }, []);
  
    const processedTokenBalances = useMemo(() => {
      if (!tokenBalances) return [];
      // divide each quantity by 10^12
      // remove the project.tokenID from the array
  
      const top10 = sortedTokenBalances.slice(0, 5);
      const others = sortedTokenBalances
        .slice(5)
        .reduce(
          //@ts-ignore
          (acc, curr) => ({
            address: "Others",
            quantity: acc.quantity + curr.quantity,
          }),
          { address: "Others", quantity: 0 }
        );
      return [...top10, others].filter((item) => item.quantity > 0);
    }, [sortedTokenBalances]);
  
    const histogramData = useMemo(() => {
      const buckets = [0, 100, 1000, 10000, 100000, 1000000, Infinity];
      const labels = ["0-100", "100-1K", "1K-10K", "10K-100K", "100K-1M", "1M+"];
      const counts = new Array(buckets.length - 1).fill(0);
      //@ts-ignore
      sortedTokenBalances.forEach(({ quantity }) => {
        for (let i = 0; i < buckets.length - 1; i++) {
          if (quantity >= buckets[i] && quantity < buckets[i + 1]) {
            counts[i]++;
            break;
          }
        }
      });
  
      return labels.map((label, index) => ({
        range: label,
        count: counts[index],
      }));
    }, [sortedTokenBalances]);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* project details */}
        <Card className="col-span-4">
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
                <strong>Avg. Messages Per Day:</strong>{" "}
                {Math.round(
                  //@ts-ignore
                  messageDistribution.reduce((acc, curr) => acc + curr.count, 0) /
                    messageActivity.length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        {/* user stats */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Unique Users</CardTitle>
            <CardDescription>
              Current user statistics as of{" "}
              {userMetrics[userMetrics.length - 1].date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Daily</h3>
                <p className="text-3xl font-bold">
                  {userMetrics[userMetrics.length - 1].dau}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Weekly</h3>
                <p className="text-3xl font-bold">
                  {userMetrics[userMetrics.length - 1].wau}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Monthly</h3>
                <p className="text-3xl font-bold">
                  {userMetrics[userMetrics.length - 1].mau}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Lifetime</h3>
                <p className="text-3xl font-bold">
                  {uniqueUsersData[uniqueUsersData.length - 1].count}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Token Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
            <CardDescription>
              Pie chart of token distribution (without project token address)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  nameKey="address"
                  data={processedTokenBalances}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#0E9C9C"
                  dataKey="quantity"
                >
                  {processedTokenBalances.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} tokens`,
                    truncateAddress(name as string),
                  ]}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(_, entry) => {
                    const { payload } = entry as unknown as {
                      payload: { address: string; quantity: number };
                    };
                    return (
                      <span className="flex items-center justify-between w-full">
                        <span className="font-medium">
                          {truncateAddress(payload.address)}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {Number(payload.quantity).toLocaleString()} tokens
                        </span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Token Balance Histogram */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Token Balance Distribution</CardTitle>
            <CardDescription>Histogram of token balances</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                data={histogramData}
              >
                <XAxis
                  label={{
                    value: "Token Balance Range",
                    position: "bottom",
                    offset: 0,
                    style: { textAnchor: "middle" },
                  }}
                  dataKey="range"
                />
                <YAxis
                  label={{
                    value: "Number of Holders",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0E9C9C" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* user metrics */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Metrics</CardTitle>
            <CardDescription>
              The DAU, WAU and MAU for the project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {/* make a line graph */}
              <LineChart data={userMetrics}>
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="dau"
                  stroke="#0E9C9C"
                />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="wau"
                  stroke="#407AE5"
                />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="mau"
                  stroke="#FF6B6B"
                />
                <XAxis
                  interval={"preserveStartEnd"}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  dataKey="date"
                  tickFormatter={(dateString) =>
                    format(new Date(dateString), "dd-MMM")
                  }
                />
                <YAxis
                  label={{
                    value: "Number of Users",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Lifetime Users */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Lifetime Users</CardTitle>
            <CardDescription>The total unique user growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {/* make a line graph */}
              <LineChart data={uniqueUsersData}>
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="count"
                  stroke="#0E9C9C"
                />
                <XAxis
                  interval={"preserveStartEnd"}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  dataKey="date"
                  tickFormatter={(dateString) =>
                    format(new Date(dateString), "dd-MMM")
                  }
                />
                <YAxis
                  label={{
                    value: "Number of Users",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Area chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Message Activity</CardTitle>
            <CardDescription>
              Area chart showing messages sent by users over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={messageActivity}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis
                  interval={"preserveStartEnd"}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  dataKey="date"
                  tickFormatter={(dateString) =>
                    format(new Date(dateString), "dd-MMM")
                  }
                />
                <YAxis
                  label={{
                    value: "Number of Messages",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Post-Real-Data"
                  stackId="1"
                  stroke="#0E9C9C"
                  fill="#0E9C9C"
                />
                <Area
                  type="monotone"
                  dataKey="Get-Real-Data"
                  stackId="1"
                  stroke="#407AE5"
                  fill="#407AE5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* pie chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Message Distribution</CardTitle>
            <CardDescription>Pie chart of message distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={messageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#0E9C9C"
                  dataKey="count"
                >
                  {/*@ts-ignore*/}
                  {messageDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
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
  
  export default Dashboard;