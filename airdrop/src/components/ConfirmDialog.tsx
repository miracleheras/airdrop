import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  tokenName: string;
  isLoading: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  amount, 
  tokenName, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0A0F1C]/95 border border-[#1E293B]/50 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-semibold text-white/90 mb-4">Confirm Claim</h3>
        <p className="text-white/80 mb-6">
          You are about to claim {amount / 10 ** 6} {tokenName} tokens. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              bg-[#00F5A0]/90 hover:bg-[#00D48F]/90 text-[#0A0F1C] font-medium px-4 py-2 rounded-lg 
              transition-all duration-200 flex items-center justify-center gap-2 
              shadow-lg hover:shadow-[#00F5A0]/10 disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#0A0F1C]"></div>
                <span>Confirming...</span>
              </>
            ) : (
              'Confirm Claim'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 