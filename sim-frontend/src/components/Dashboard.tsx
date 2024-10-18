import { brandDarkBg } from "@/_utils/colors";
import Navbar from "./Layout/Navbar";

// import OnChain0rbit from "./Dashboard/OnChain0rbit";
import { Tabs } from "./ui/tabs";
import Dashboard from "./Dashboard/Dashboard";
import {
  orbitMessageActivity,
  orbitMessageDistribution,
  orbitTokenBalances,
  orbitUniqueUsersData,
  orbitUserMetrics,
} from "../../../analysis/fetch/data_files/BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ/data";
import {
  outcomeMessageActivity,
  outcomeMessageDistribution,
  outcomeTokenBalances,
  outcomeUniqueUsersData,
  outcomeUserMetrics,
} from "../../../analysis/fetch/data_files/Dgs1OEsExsPRVcbe_3buCGf0suVKUFwMJFddqMhywbY/data";
import {
  apusMessageActivity,
  apusMessageDistribution,
  apusTokenBalances,
  apusUniqueUsersData,
  apusUserMetrics,
} from "../../../analysis/fetch/data_files/vp4pxoOsilVxdsRqTmLjP86CwwUwtj1RoKeGrFVxIVk/data";

const orbit = {
  name: "Orbit",
  processID: "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ",
  tokenID: "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc",
};
const outcome = {
  name: "Outcome",
  processID: "Dgs1OEsExsPRVcbe_3buCGf0suVKUFwMJFddqMhywbY",
  tokenID: "Dgs1OEsExsPRVcbe_3buCGf0suVKUFwMJFddqMhywbY",
};
const apus = {
  name: "Apus",
  processID: "vp4pxoOsilVxdsRqTmLjP86CwwUwtj1RoKeGrFVxIVk",
  tokenID: "al1xXXnWnfJD8qyZJvttVGq60z1VPGn4M5y6uCcMBUM",
};

export default function ProjectDashboard() {
  // Prepare data for charts

  return (
    <>
      <Navbar />
      <main className={`py-4 pt-[90px] ${brandDarkBg}`}>
        <div className="flex flex-col">
          <div className="w-full bg-[#0E9C9C]  px-20 py-6">
            <h1 className={`text-[#000000] text-[36px] font-bold `}>Project On-Chain Analysis</h1>
            <Tabs tabs={tabs} />
          </div>
          <span className="py-3 bg-[#0e9c9ca3] w-full"></span>
          <span className="py-3 bg-[#0e9c9c3e] w-full"></span>
          <span className="py-3 bg-[#0e9c9c24] w-full"></span>
        </div>
      </main>
    </>
  );
}

//Add dashboards with all the data required here, pass it as pr
const tabs = [
  {
    title: "0rbit",
    value: "0rbit",
    content: (
      <div className="bg-[#161515] w-full py-3">
        <Dashboard
          project={orbit}
          actionsTracked={["Post-Real-Data", "Get-Real-Data"]}
          messageActivity={orbitMessageActivity}
          messageDistribution={orbitMessageDistribution}
          tokenBalances={orbitTokenBalances}
          uniqueUsersData={orbitUniqueUsersData}
          userMetrics={orbitUserMetrics}
        />
      </div>
    ),
  },
  {
    title: "Outcome",
    value: "Outcome",
    content: (
      <div className="bg-[#161515] w-full py-3">
        <Dashboard
          project={outcome}
          actionsTracked={["Buy", "Claim"]}
          messageActivity={outcomeMessageActivity}
          messageDistribution={outcomeMessageDistribution}
          tokenBalances={outcomeTokenBalances}
          uniqueUsersData={outcomeUniqueUsersData}
          userMetrics={outcomeUserMetrics}
        />
      </div>
    ),
  },
  {
    title: "Apus",
    value: "Apus Network",
    content: (
      <div className="bg-[#161515] w-full py-3">
        <Dashboard
          project={apus}
          actionsTracked={["Create-Dataset"]}
          messageActivity={apusMessageActivity}
          messageDistribution={apusMessageDistribution}
          tokenBalances={apusTokenBalances}
          uniqueUsersData={apusUniqueUsersData}
          userMetrics={apusUserMetrics}
        />
      </div>
    ),
  },
  // {
  //   title: "BetterIDEa",
  //   value: "BetterIDEa",
  //   content: (
  //     <div className="bg-[#161515] w-full py-3">
  //       <Dashboard />
  //     </div>
  //   ),
  // },
];
