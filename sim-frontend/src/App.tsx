import { ConnectButton } from 'arweave-wallet-kit'
import './App.css'
import RegisterProject from './_components/RegisterProject'

function App() {

  return (
    <main className="bg-[#212121] min-h-[100vh] w-[100vw] text-[#ffffff] flex flex-col justify-start items-center gap-6">
      <h1 className=" font-bold text-[45px]">Simulated FE</h1>
      <ConnectButton accent="#25291C" profileModal={true} showBalance={false} />
      <RegisterProject/>
    </main>
  )
}

export default App
