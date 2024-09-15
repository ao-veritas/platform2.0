import { ProjectType } from "../types/Project";
import { stake } from "../utils/stake";
import { ConnectButton, useActiveAddress } from "arweave-wallet-kit";
import { useState } from "react";
import { useStakeLoader, useUserAoETH } from "../utils/hooks";
import Loader from "./Loader";
import { humanizeDuration } from "../utils/helpers";

export default function StakeModal({ project }: { project: ProjectType }) {
  const address = useActiveAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState("0");
  const [amount, setAmount] = useState("");
  const [stakeLoading, setStakeLoading] = useState(false);

  const { start, stop, projectConfirmedStake, receivedAoETH: recievedAoETH, rewardsSent } = useStakeLoader(project, address);
  if (step == "2" && rewardsSent) {
    stop();
  }

  console.log({ project });

  const availableAOEth = useUserAoETH(address).aoeth ?? 0;

  const handleMaxClick = () => {
    setAmount(availableAOEth.toString());
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue === "" || Number(newValue) < 0) {
      setAmount("");
      return;
    }
    if (Number(newValue) > availableAOEth) {
      setAmount(availableAOEth.toString());
      return;
    }
    setAmount(event.target.value);
  };
  const openModal = () => {
    setIsModalOpen(true);
    setStep("1");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStakeLoading(false);
    setAmount("");
    setStep("0");
  };

  return (
    <div className=" overflow-hidden">
    <button onClick={openModal}>TEST</button>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-[#626262] bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-fit max-w-[450px] bg-[#111111] p-8 rounded-lg ">
              <button onClick={closeModal} className="absolute top-2 right-4 text-2xl font-bold text-gray-500 hover:text-gray-600">
                &times;
              </button>
              {step == "1" && (
                <>
                  <h2 className="text-[30px] font-semibold text-[#f1f1f1]">
                    <span className="text-[#40959D]">Stake </span>$tAoEth, <span className="text-[#40959D]"> Get </span>${project.ticker}{" "}
                    {/* <span className="text-[#40959D]">in return</span> */}
                  </h2>
                  <div className="mb-6">
                    <div className="text-[#40959D]">
                      Available $tAoEth: <span className="font-semibold text-[#f1f1f1] lining-figures">{availableAOEth}</span>
                    </div>
                    <h4 className="text-[#8D8D8D] font-[Rale-SemiBold] text-[13.5px]">Enter quantity of $tAoEth to be staked</h4>
                    <div
                      className="flex items-center justify-between rounded bg-[#1A1A1A] text-[#f1f1f1]
                pl-2"
                    >
                      <input
                        disabled={stakeLoading}
                        type="number"
                        value={amount}
                        onChange={handleChange}
                        title="$tAoEth to be staked"
                        className="bg-[#00000000] p-2 w-full h-full"
                      />
                      <div className="h-full min-w-fit">
                        <button onClick={handleMaxClick} className="bg-[#111111] border-[2px] border-[#121212] text-white px-3 py-2 rounded min-w-fit m-2">
                          GO MAX
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded mb-6 max-w-[100%]">
                    <p className="text-[#8D8D8D] text-[12px]">{`On staking $tAoEth you will receive ${amount ? parseFloat(amount) * project.aoethRewardRate : "-"} of $${
                      project.ticker
                    }. There is a cool down period of ${humanizeDuration(project.cooldownPeriod)} for unstaking your $tAoEth.`}</p>
                  </div>
                  <button
                    onClick={async () => {
                      setStakeLoading(true);
                      const startDate = new Date();
                      await stake(project, parseFloat(amount), address);
                      start(startDate);
                      setStep("2");
                      setStakeLoading(false);
                    }}
                    disabled={amount === "" || parseFloat(amount) <= 0 || parseFloat(amount) > availableAOEth || stakeLoading}
                    className={`flex gap-4 w-fit ${stakeLoading ? "bg-gray-400" : "bg-[#205156]"} text-[#f1f1f1] py-[6px] px-[18px] rounded`}
                  >
                    {stakeLoading ? <Loader /> : ""}
                    Stake $tAoEth
                  </button>
                </>
              )}
              {step == "2" && (
                <div className="relative">
                  <div className="absolute h-0 inset-0 flex mt-2 ml-2">
                    <div className="w-1 h-[100px] bg-teal-300"></div>
                  </div>
                  <div className="relative z-10 flex flex-col space-y-6">
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${recievedAoETH ? "bg-teal-600" : "bg-gray-800"}  text-white`}>✓</div>
                      <div className={`ml-4 ${recievedAoETH ? "text-teal-300" : "text-white"} text-lg`}>
                        {amount} $tAoEth staked on {project.name}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${projectConfirmedStake ? "bg-teal-600" : "bg-gray-800"} text-white`}>
                        ✓
                      </div>
                      <div className={`ml-4 ${projectConfirmedStake ? "text-teal-300" : "text-white"} text-lg`}>{project.name} confirmed deposit</div>
                    </div>
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-teal-600 ${rewardsSent ? "bg-teal-600" : "bg-gray-800"} text-white`}>✓</div>

                      <div className={`ml-4 ${rewardsSent ? "text-teal-300" : "text-white"} text-lg`}>${project.ticker} reward sent to your wallet</div>
                    </div>
                  </div>
                  <button
                    disabled={!rewardsSent}
                    onClick={() => (window.location.href = "#profile")}
                    className={`${!rewardsSent ? "bg-gray-400" : "bg-[#205156]"} text-[#f1f1f1] py-[6px] px-[18px] rounded m-4`}
                  >
                    {rewardsSent ? (
                      "See Your Profile"
                    ) : (
                      <div className="flex gap-4">
                        <Loader />
                        Confirming Transaction
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
}
