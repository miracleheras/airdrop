import { useWallet } from "@solana/wallet-adapter-react";

export const Connect2Phantom: React.FC = () => {
  const { connected, publicKey, connect, disconnect, wallet, select, wallets } = useWallet();

  const handleConnect = async () => {
    try {
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
    }
  };

  return (
    <div>
      <div className="flex items-center">
        {!connected ? (
          <button
            onClick={handleConnect}
            className="bg-[#7760E5] text-white px-4 py-2 rounded-lg hover:bg-[#6652D9] transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm">
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
            </span>
            <button
              onClick={() => disconnect()}
              className="bg-[#23263B] text-white px-4 py-2 rounded-lg hover:bg-[#2A2E46] transition"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};