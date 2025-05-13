import { withMainLayout } from "../layouts/MainLayout";
import { AirdropList } from "../components/AirdropList";
import { AirdropLimitControl } from "../components/AirdropLimitControl";
import { useAirdrops } from "../contexts/AirdropContext";

export const HomePage: React.FC = withMainLayout(() => {
  const { fetchAirdrops, limit, setLimit } = useAirdrops();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative rounded-2xl bg-[#0A0F1C]/80 p-8 md:p-12 mb-10 border border-[#1E293B]/50">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 mb-6">
            Streamflow <span className="text-[#00F5A0]/90">Airdrops</span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button 
              onClick={() => fetchAirdrops()}
              className="bg-[#00F5A0]/90 hover:bg-[#00D48F]/90 text-[#0A0F1C] font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#00F5A0]/10 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Airdrops</span>
            </button>
            
            <AirdropLimitControl limit={limit} onLimitChange={setLimit} />
          </div>
        </div>
      </div>
      
      <AirdropList />
    </div>
  );
});