import { brandDarkBg } from "@/_utils/colors";
import Navbar from "./Layout/Navbar";

import OnChain0rbit from "./Dashboard/OnChain0rbit";
import { Tabs } from "./ui/tabs";

// Sample project data

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
const tabs = [
  {
    title: "0rbit",
    value: "0rbit",
    content: (
      <div className="bg-[#161515] w-full py-3">
        <OnChain0rbit />
      </div>
    ),
  },
  {
    title: "BetterIDEa",
    value: "BetterIDEa",
    content: (
      <div className="bg-[#161515] w-full py-3">
        <OnChain0rbit />
      </div>
    ),
  },
];
