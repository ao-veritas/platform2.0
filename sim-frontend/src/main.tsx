import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ArweaveWalletKit } from 'arweave-wallet-kit'
import AppRouter from './AppRouter.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>

     <ArweaveWalletKit
      config={{
        permissions: ["SIGN_TRANSACTION", "ACCESS_ADDRESS"],
        ensurePermissions: true,
      }}
      theme={{
        radius: "minimal",
        titleHighlight: { r: 209, g: 109, b: 27 },
        accent: { r: 37, g: 41, b: 28 },
      }}
    >
        <AppRouter />
    </ArweaveWalletKit>

  </StrictMode>,
)
