import streamflowLogo from '../assets/streamflow.svg';
import solanaIcon from '../assets/solanaIcon.svg';
import { Connect2Phantom } from './ClaimButton';
import { useState } from 'react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={streamflowLogo} alt="Streamflow" className="h-8" />
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-white text-lg font-bold">Streamflow</span>
            <span className="text-indigo-400 font-semibold sm:ml-2">Airdrops</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">          
          <div className="flex items-center gap-3">
            <button className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition shadow-lg">
              <img src={solanaIcon} alt="Solana" className="h-5 w-5 mr-2" />
              Solana
            </button>
            <Connect2Phantom />
          </div>
        </div>
        
        <button 
          className="md:hidden bg-slate-800 p-2 rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
          <div className="flex flex-col gap-3 px-6 py-4 border-t border-slate-800">
            <button className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg justify-center transition">
              <img src={solanaIcon} alt="Solana" className="h-5 w-5 mr-2" />
              Solana
            </button>
            <div className="w-full">
              <Connect2Phantom />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};