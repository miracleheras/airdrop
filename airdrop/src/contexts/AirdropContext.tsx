import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { type Airdrop } from '../types';
import { getAirdrops } from '../services/api';
import { DEFAULT_AIRDROP_LIMIT } from '../consts';

interface AirdropContextType {
  airdrops: Airdrop[];
  setAirdrops: React.Dispatch<React.SetStateAction<Airdrop[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  fetchAirdrops: () => Promise<void>;
}

const AirdropContext = createContext<AirdropContextType | undefined>(undefined);

interface AirdropProviderProps {
  children: ReactNode;
}

export const AirdropProvider: React.FC<AirdropProviderProps> = ({ children }) => {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(DEFAULT_AIRDROP_LIMIT);

  const fetchAirdrops = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAirdrops(limit);
      
      const formattedAirdrops: Airdrop[] = data.items.map((item: any) => ({
        address: item.address,
        name: item.name,
        maxNumNodes: parseInt(item.maxNumNodes),
        mint: item.mint,
        sender: item.sender
      }));
      
      setAirdrops(formattedAirdrops);
    } catch (error) {
      console.error("Error fetching airdrops:", error);
      setError("Failed to fetch airdrops. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdrops();
  }, [limit]);

  const value = {
    airdrops,
    setAirdrops,
    loading,
    setLoading,
    error,
    limit,
    setLimit,
    fetchAirdrops
  };

  return (
    <AirdropContext.Provider value={value}>
      {children}
    </AirdropContext.Provider>
  );
};

export const useAirdrops = () => {
  const context = useContext(AirdropContext);
  if (context === undefined) {
    throw new Error('useAirdrops must be used within an AirdropProvider');
  }
  return context;
}; 