import { DetailPage } from './pages/Detail';
import { HomePage } from './pages/Home'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Path } from './consts';
import { ConnectionProvider, WalletProvider } from  '@solana/wallet-adapter-react'
import { AirdropProvider } from './contexts/AirdropContext';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useMemo } from 'react';

function App() {

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <BrowserRouter>
      <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
        <WalletProvider wallets={wallets} autoConnect>
          <AirdropProvider>
            <Routes>
              <Route path={Path.Home} element={<HomePage />} />
              <Route path={Path.Detail} element={<DetailPage />} />
            </Routes>
          </AirdropProvider>
        </WalletProvider>
      </ConnectionProvider>
    </BrowserRouter>
  );
}

export default App;