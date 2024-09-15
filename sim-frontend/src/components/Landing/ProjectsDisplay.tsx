import ProjectCard from "./ProjectCard";
import { useProjects } from "../../utils/hooks";

const ProjectsDisplay = () => {
//   const projects = useProjects();

  return (
    <section id="projects" className="lg:px-20 px-6 flex flex-col items-center justify-start gap-9 md:fadeInScroll">
      <div className="flex flex-row justify-center items-center w-full ">
        <h3 className="md:text-[30px] text-[24px] text-[#40959D] font-[Rale-SemiBold] text-center">Featured Projects</h3>
        {/* <div className="flex flex-row gap-[12px] justify-end items-center">
          <input
            type="text"
            placeholder="Search for Projects"
            className=" text-[#f1f1f1] border-[1px] bg-[#00000000] rounded-md px-[12px] py-[6px] border-[#40959D] min-w-[310px]"
          />
          <a href="" className="bg-[#205156] rounded-sm p-[9px]">
            <img alt="search" src="/icons/searchIcon.svg" className="w-[18px] h-[18px]" />
          </a>
        </div> */}
      </div>
      <div className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[21px] w-full">
        {" "}
        {/* {projects.map((project) => {
          return <ProjectCard project={project} />;
        })} */}
      </div>
    </section>
  );
};

export default ProjectsDisplay;