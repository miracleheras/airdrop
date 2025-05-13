import { useAirdrops } from '../contexts/AirdropContext';
import { useNavigate } from 'react-router-dom';
import { Path } from '../consts';

export const AirdropList: React.FC = () => {
  const { airdrops, loading, error } = useAirdrops();
  const navigate = useNavigate();

  const handleNavigateToDetail = (address: string) => {
    navigate(`${Path.Detail}?address=${address}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00F5A0]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  
  if (airdrops.length === 0) {
    return (
      <div className="bg-[#0A0F1C] border border-[#1E293B] rounded-xl p-8 text-center">
        <p className="text-gray-400">No airdrops found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {airdrops.map(airdrop => (
        <div 
          key={airdrop.address}
          className="bg-[#0A0F1C] hover:bg-[#0F172A] border border-[#1E293B] hover:border-[#00F5A0]/30 rounded-xl p-6 transition-all duration-200 cursor-pointer group"
          onClick={() => handleNavigateToDetail(airdrop.address)}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00F5A0] transition-colors">
                {airdrop.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-medium truncate">{airdrop.address.substring(0, 12)}...</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sender</p>
                  <p className="text-white font-medium truncate">{airdrop.sender.substring(0, 12)}...</p>
                </div>
              </div>
            </div>

            <div className="md:w-56 flex flex-col items-start md:items-end space-y-3">
              <div className="bg-[#1E293B] rounded-lg px-4 py-2 text-center w-full md:w-auto border border-[#334155]">
                <p className="text-gray-400 text-xs">Number of Recipients</p>
                <p className="text-white font-medium text-xl">{airdrop.maxNumNodes}</p>
              </div>
              
              <button 
                className="w-full md:w-auto bg-[#00F5A0] hover:bg-[#00D48F] text-[#0A0F1C] font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#00F5A0]/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToDetail(airdrop.address);
                }}
              >
                <span>View Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
