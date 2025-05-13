import React from 'react';

interface AirdropLimitControlProps {
  limit: number;
  onLimitChange: (newLimit: number) => void;
}

export const AirdropLimitControl: React.FC<AirdropLimitControlProps> = ({ limit, onLimitChange }) => {
  return (
    <div className="bg-[#0A0F1C]/80 rounded-xl p-4 flex items-center gap-4 border border-[#1E293B]/50">
      <label htmlFor="limit" className="text-white/80 font-medium">Number Of Airdrops:</label>
      <select
        id="limit"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="bg-[#1E293B]/80 text-white/90 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00F5A0]/50 border border-[#334155]/50"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}; 