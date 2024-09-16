import { projects } from '@/_utils/projects';
import { useParams } from 'react-router-dom';
import Project from './Project';
import Saturn from './Saturn';


const ProjectRoute = () => {
  const saturnID:string = import.meta.env.VITE_SATURN_ID;
    const { processID } = useParams();
    console.log("project rout epid", processID)
    if(processID==saturnID){
      return <Saturn/>
    }
  return (
    <>
    {projects.map((project)=> {
        if(project.processID == processID){
            return <Project pid={processID}/>
        }
    })}
    </>
  )
}

export default ProjectRoute