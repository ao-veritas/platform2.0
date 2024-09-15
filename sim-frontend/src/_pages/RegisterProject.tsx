import { useEffect, useState } from "react"
import { brandDarkBg } from "../_utils/colors";
import { Footer, Navbar, OwnerForm, RegisterProjectForm } from "../components";

const RegisterProject = () => {
  const ownerAddress = import.meta.env.VITE_OWNER_ADDRESS;
  const [currentAddress, setCurrentAddress] = useState("");
    useEffect(() => {
      getAddress();
    }, [])
    const getAddress = async() => {
      const userAddress = await window.arweaveWallet.getActiveAddress();
      setCurrentAddress(userAddress);
    }
    return (
      <>
        <Navbar/>
        <main className={`${brandDarkBg} pt-[120px] min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6`}>
        {
          currentAddress == ownerAddress && 
            <OwnerForm/>
        }
        {
          currentAddress !=ownerAddress && 
            <RegisterProjectForm/>
        }
        </main>
        <Footer/>
      </>
  )
}

export default RegisterProject