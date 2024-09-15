import { Arch, Footer, Hero, Navbar, ProjectsDisplay } from "../components"

const HomePage = () => {
  return (
    <>
      <Navbar/>
      <main className={`pt-[120px] bg-[#111111] font-raleway min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6`}>
        <Hero/>
        <Arch/>
        <ProjectsDisplay/>

      </main>
      <Footer/>
    </>
  )
}

export default HomePage