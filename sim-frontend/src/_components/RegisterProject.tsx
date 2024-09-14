import { useState } from "react"
import registerProject from "../_utils/registerProject";

type ProjectDetails = {
    projectID: string;
    projectTokenID: string;
  };

const RegisterProject = () => {
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({ projectID: '', projectTokenID: '' });
    const registerProjectHandler = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await registerProject(projectDetails);
        if (success) {
            // If registration is successful, reset the form and show success message
            setProjectDetails({ projectID: '', projectTokenID: '' });
            alert("Registration successful!");
          } else {
            // Handle registration failure (optional)
            alert("Registration failed. Please try again.");
          }
    }
    const validateInput = (pid: string, tpid: string): boolean => {
        return pid.length === 43 && tpid.length === 43;
      };
    console.log(validateInput(projectDetails.projectID, projectDetails.projectTokenID))

    return (
    <form
    onSubmit={(e) => {registerProjectHandler(e)}}
    className="flex flex-col gap-[12px] w-[390px]">
        <div className="flex flex-col gap-[6px]">
        <label className="text-[18px]" htmlFor="">Project Process ID</label>
        <input
        value={projectDetails.projectID}
            onChange={(e) => {
                setProjectDetails(prevDetails => ({
                ...prevDetails,
                projectID: e.target.value 
                }));
            }}
        className="bg-[#666666] rounded-md py-[4px] px-[12px] text-[15px]" type="text" />
        </div>
        <div className="flex flex-col gap-[6px]">
            <label className="text-[18px]" htmlFor="">Token Process ID</label>
            <input 
            value={projectDetails.projectTokenID}
            onChange={(e) => {
                setProjectDetails(prevDetails => ({
                ...prevDetails,
                projectTokenID: e.target.value 
                }));
            }}
            className="bg-[#666666] rounded-md py-[4px] px-[12px] text-[15px]" type="text" />
        </div>
        <input
        disabled={!validateInput(projectDetails.projectID, projectDetails.projectTokenID)}
        className={`bg-[#101010] py-[6px] rounded-sm ${!validateInput(projectDetails.projectID, projectDetails.projectTokenID) ? "opacity-50 cursor-not-allowed" : "hover:opacity-60 cursor-pointer"}`} type="submit" value="Register Project" />
    </form>
  )
}

export default RegisterProject