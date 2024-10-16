import { useState } from "react";

const RegisterProjectForm = () => {
    const [projectName, setProjectName] = useState("");
    const [projectContact, setProjectContact] = useState("")
  return (
    <form
        onSubmit={(e) => {e.preventDefault}}
        className="flex flex-col gap-[12px] w-[390px]">
            <div className="flex flex-col gap-[6px]">
                <label className="text-[18px]" htmlFor="">Project Name</label>
                <input
                    value={projectName}
                    onChange={(e) => {setProjectName(e.target.value)}}
                    className="bg-[#666666] rounded-[9px] py-[4px] px-[12px] text-[15px]" type="text" />
            </div>
            <div className="flex flex-col gap-[6px]">
                <label className="text-[18px]" htmlFor="">Contact Details {"("}Email/ Discord/ Twitter{")"}</label>
                <input 
                value={projectContact}
                onChange={(e) => {setProjectContact(e.target.value)}}
                className="bg-[#666666] rounded-[9px] py-[4px] px-[12px] text-[15px]" type="text" />
            </div>
            <input
            className={`bg-[#101010] py-[6px] rounded-[6px] `} type="submit" value="Submit! We'xll reach out to you soon" />
    </form>
  )
}

export default RegisterProjectForm