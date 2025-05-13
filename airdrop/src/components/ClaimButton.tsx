import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export const Connect2Phantom: React.FC = () => {
  const { connected, publicKey, connect, disconnect, wallet, select, wallets } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      if (!wallet) {
        const phantomWallet = wallets.find(w => 
          w.adapter.name === 'Phantom' || 
          w.adapter.name.toLowerCase().includes('phantom')
        );
        
        if (phantomWallet) {
          await select(phantomWallet.adapter.name);
        } else {
          throw new Error("Phantom wallet not found");
        }
      }
      
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await disconnect();
    } catch (error) {
      console.error("Disconnection error:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        {!connected ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-[#00F5A0]/90 hover:bg-[#00D48F]/90 text-[#0A0F1C] font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#00F5A0]/10 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0A0F1C]"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm">
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
            </span>
            <button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="bg-[#1E293B]/80 hover:bg-[#1E293B] text-white/90 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-[#334155]/50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isDisconnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Disconnecting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};