import { useEffect, useState } from 'react'
import { getProjectStake } from '../../_utils/info';
import { brandSecondaryText } from '../../_utils/colors';

const ProjectStakes = ({projectID}:any) => {
    const [totalStaked, setTotalStaked] = useState("");
    useEffect(() => {
        const getTaoEthonProject = async () => {
          try {
            const staked = await getProjectStake(projectID);
            setTotalStaked(staked);  
          } catch (error) {
            console.error("Error fetching project stake:", error);
          }
        };
  
        getTaoEthonProject();
      }, []); 
  return (
    <div className="rounded-lg bg-[#1F1E1E] px-[24px] py-[12px]">
    <h3 className={`text-[27px] leading-[30px] ${brandSecondaryText} font-medium`}>Overall $TAOETH Staked</h3>
    <h4>${Number(totalStaked)/Math.pow(10, 12)}</h4>
</div>
  )
}

export default ProjectStakes