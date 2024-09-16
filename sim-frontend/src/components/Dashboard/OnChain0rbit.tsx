import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const project = {
    name: "Project Alpha",
    processID: "PROC-001",
    tokenID: "TKN-001",
    tokensHeld: [
      { id: "TKN-001", ticker: "ALPHA", quantity: "1000000" },
      { id: "TKN-002", ticker: "BETA", quantity: "500000" }
    ],
    distribution: [
      { id: "DIST-001", quantity: "750000" },
      { id: "DIST-002", quantity: "750000" }
    ],
    tokenFlow: { daily: "10000", weekly: "70000", monthly: "300000" },
    messagesPerDay: "5000",
    uniqueUsers: { daily: "1000", weekly: "5000", monthly: "15000", lifetime: "50000" },
    typesOfMessages: [
      { name: "Type A", lastSixMonths: { jan: "1000", feb: "1200", mar: "1100", apr: "1300", may: "1500", jun: "1400" } },
      { name: "Type B", lastSixMonths: { jan: "800", feb: "900", mar: "1000", apr: "1100", may: "1200", jun: "1300" } },
      { name: "Type C", lastSixMonths: { jan: "600", feb: "700", mar: "800", apr: "900", may: "1000", jun: "1100" } }
    ]
  }
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const OnChain0rbit = () => {
    const messageTypeData = project.typesOfMessages[0].lastSixMonths
  const messageTypeChartData = Object.entries(messageTypeData).map(([month]) => ({
    month,
    "Type A": parseInt(project.typesOfMessages[0].lastSixMonths[month]),
    "Type B": parseInt(project.typesOfMessages[1].lastSixMonths[month]),
    "Type C": parseInt(project.typesOfMessages[2].lastSixMonths[month])
  }))

  const uniqueUsersData = [
    { subject: 'Daily', A: parseInt(project.uniqueUsers.daily) },
    { subject: 'Weekly', A: parseInt(project.uniqueUsers.weekly) },
    { subject: 'Monthly', A: parseInt(project.uniqueUsers.monthly) },
    { subject: 'Lifetime', A: parseInt(project.uniqueUsers.lifetime) }
  ]

  const tokenDistributionData = project.distribution.map((item, index) => ({
    name: `Distribution ${index + 1}`,
    value: parseInt(item.quantity)
  }))

  const projectTokensData = project.tokensHeld.map(token => ({
    name: token.ticker,
    value: parseInt(token.quantity)
  }))

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
            <p><strong>Process ID:</strong> {project.processID}</p>
            <p><strong>Token ID:</strong> {project.tokenID}</p>
            <p><strong>Messages Per Day:</strong> {project.messagesPerDay}</p>
            <p><strong>Token Flow:</strong></p>
            <ul className="list-disc list-inside pl-4">
              <li>Daily: {project.tokenFlow.daily}</li>
              <li>Weekly: {project.tokenFlow.weekly}</li>
              <li>Monthly: {project.tokenFlow.monthly}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    {/* stats */}
      <Card>
        <CardHeader>
          <CardTitle>Unique Users</CardTitle>
          <CardDescription>User statistics over different time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Daily</h3>
              <p className="text-3xl font-bold">{project.uniqueUsers.daily}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Weekly</h3>
              <p className="text-3xl font-bold">{project.uniqueUsers.weekly}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Monthly</h3>
              <p className="text-3xl font-bold">{project.uniqueUsers.monthly}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Lifetime</h3>
              <p className="text-3xl font-bold">{project.uniqueUsers.lifetime}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Unique Users</CardTitle>
          <CardDescription>Radar chart of unique users over time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={uniqueUsersData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar name="Users" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* bar graph */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Project Tokens</CardTitle>
          <CardDescription>Bar graph of project tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectTokensData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Area chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Types of Messages (Last 6 Months)</CardTitle>
          <CardDescription>Area chart showing message types over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={messageTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Type A" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="Type B" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="Type C" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* pie chart */}
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution</CardTitle>
          <CardDescription>Pie chart of token distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tokenDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tokenDistributionData.map((index) => (
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
  )
}

export default OnChain0rbit