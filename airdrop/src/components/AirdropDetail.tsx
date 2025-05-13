import { Link, useSearchParams } from "react-router-dom";
import { useAirdrops } from "../contexts/AirdropContext";
import React, { useEffect, useState } from "react";
import type { Airdrop } from "../types";
import { SolanaDistributorClient } from "@streamflow/distributor/solana";
import { ICluster } from "@streamflow/stream";
import { SOLANA_CLUSTER_URL, API_BASE_URL } from "../consts";
import { useWallet } from '@solana/wallet-adapter-react'
import BN from "bn.js";
import { ConfirmDialog } from "./ConfirmDialog";
import { getAirdropType, getBNValue, getRecipientProgress, getTokenProgress } from "../utils/airdrop";


export const AirdropDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");

  const { airdrops, loading } = useAirdrops();
  const [airdrop, setAirdrop] = useState<Airdrop | null>(null);

  const [notFound, setNotFound] = useState<boolean>(false);
  const [distributorDetails, setDistributorDetails] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [userClaimableAmount, setUserClaimableAmount] = useState<number>(0);
  const [claimantData, setClaimantData] = useState<any>(null);
  
  const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();

  const distributorClient = new SolanaDistributorClient({
    clusterUrl: SOLANA_CLUSTER_URL,
    cluster: ICluster.Devnet,
  });

  const [isClaiming, setIsClaiming] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (address && airdrops.length > 0) {
      const foundAirdrop = airdrops.find(item => item.address === address);
      if (foundAirdrop) {
        setAirdrop(foundAirdrop);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [address, airdrops]);

  useEffect(() => {
    const getUserClaimAmount = async () => {
      if (!address || !publicKey) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/${address}/claimants/${publicKey.toString()}`);
        const data = await response.json();
        
        setClaimantData(data);
        
        if (data.amountUnlocked > 0 || data.amountLocked > 0) {
          setIsClaimable(true);
          setUserClaimableAmount(data.amountUnlocked > 0 ? data.amountUnlocked : data.amountLocked);
        }
      } catch (error) {
        console.error("Error fetching user claim amount:", error);
      }
    };
    
    getUserClaimAmount();
  }, [address, publicKey]);

  useEffect(() => {
    const getDistributorDetails = async () => {
      if (!address) return;
      setIsLoading(true);
      
      try {        
        const details = await distributorClient.getDistributors({
          ids: [address],
        });
        
        if (details && details.length > 0) {
          setDistributorDetails(details[0]);
        } else {
          setError("No details found for this distributor");
        }
      } catch (error) {
        console.error("Error fetching distributor details:", error);
        setError("Failed to fetch distributor details");
      } finally {
        setIsLoading(false);
      }
    };
    
    getDistributorDetails();
  }, [address]);

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!address || !publicKey) return;

      try {
        const claimResults = await distributorClient.getClaims([
          {
            id: address,
            recipient: publicKey.toString(),
          }
        ])
        if (claimResults && claimResults[0]) {
          setIsClaimable(false);
        }
      } catch (error) {
        console.error("Error checking claim status:", error);
      }
    }

    checkClaimStatus();
  }, [address, publicKey, distributorClient]);
  

  const recipients = getRecipientProgress(distributorDetails);
  const tokens = getTokenProgress(distributorDetails);

  const handleClaimClick = () => {
    if (!connected || !publicKey || !address || !isClaimable) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmClaim = async () => {
    if (!connected || !publicKey || !address) {
      console.error("Wallet not connected or airdrop address missing");
      return;
    }

    try {
      setIsClaiming(true);
      if (!claimantData) {
        alert("No claimable tokens found for your wallet");
        return;
      }
      
      const amountUnlocked = claimantData.amountUnlocked || 0;
      const amountLocked = claimantData.amountLocked || 0;
      const proof = claimantData.proof || [];
      
      console.log("Claiming with params:", {
        id: address,
        amountUnlocked: new BN(amountUnlocked),
        amountLocked: new BN(amountLocked),
        proof
      });
      
      const claimResult = await distributorClient.claim({
        id: address,
        amountUnlocked: new BN(amountUnlocked),
        amountLocked: new BN(amountLocked),
        proof: proof,
      }, {
        invoker: {
          publicKey,
          signTransaction,
          signAllTransactions
        } as any
      });

      setIsClaimable(false);
      setShowConfirmDialog(false);

      console.log("Claim result:", claimResult);
      
      alert("Claim initiated, please see the console for the transaction details");
    } catch (error: any) {
      console.error("Error claiming airdrop:", error);
      let errorMessage = "Unknown error";
      
      if (error?.message?.includes("User rejected")) {
        errorMessage = "Transaction was rejected by the user";
      } else if (error?.message?.includes("simulation")) {
        errorMessage = "Transaction failed in simulation. You may need SOL for fees or the airdrop may not be claimable yet.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      alert(`Failed to claim airdrop: ${errorMessage}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white transition"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to all airdrops
        </Link>
      </div>
      
      {(loading || isLoading) ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : notFound ? (
        <div className="bg-red-900/30 backdrop-blur-sm text-red-200 p-8 rounded-xl text-center border border-red-800/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Airdrop Not Found</h2>
          <p>The airdrop with address <span className="font-mono">{address}</span> could not be found.</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 backdrop-blur-sm text-red-200 p-8 rounded-xl text-center border border-red-800/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Error Loading Distributor</h2>
          <p>{error}</p>
        </div>
      ) : airdrop ? (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-indigo-500/10 p-4 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{airdrop.name}</h1>
                <div className="flex items-center mt-1 gap-2">
                  <span className={`px-2 py-1 text-sm rounded-full ${getAirdropType(distributorDetails.unlockPeriod) === 'Instant' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {getAirdropType(distributorDetails.unlockPeriod)} Airdrop
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Airdrop Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Address</p>
                      <p className="text-white font-medium break-all">{airdrop.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Sender</p>
                      <p className="text-white font-medium break-all">{airdrop.sender}</p>
                    </div>
                    
                    {connected && publicKey && (
                      <div>
                        <p className="text-gray-400 text-sm">Your Claimable Amount</p>
                        <p className="text-white font-medium">
                          {userClaimableAmount === 0 || !isClaimable ? "Nothing to claim" : `${userClaimableAmount / 10 ** 6} tokens`}
                        </p>
                      </div>
                    )}
                    
                    {/* Recipients Progress */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-400 text-sm">Recipients</p>
                        <p className="text-white font-medium">
                          {recipients.claimed} / {recipients.total}
                        </p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: recipients.percentage }}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">{recipients.percentage} claimed</p>
                    </div>
                    
                    {/* Tokens Progress */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-gray-400 text-sm">Tokens</p>
                        <p className="text-white font-medium">
                          {tokens.claimed} / {tokens.total}
                        </p>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: tokens.percentage }}></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">{tokens.percentage} claimed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Token Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Token Address</p>
                      <p className="text-white font-medium break-all">{airdrop.mint}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://explorer.solana.com/address/${airdrop.mint}?cluster=devnet`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 text-sm"
                      >
                        View on Solana Explorer
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {distributorDetails && (
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Additional Details</h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Unlock Period</p>
                        <p className="text-white font-medium">
                          {getBNValue(distributorDetails.unlockPeriod) === 1 ? 
                            "Instant (1)" : 
                            `${getBNValue(distributorDetails.unlockPeriod)} seconds`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Start Time</p>
                        <p className="text-white font-medium">
                          {new Date(getBNValue(distributorDetails.startTs) * 1000).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className="text-white font-medium">
                          {distributorDetails.clawedBack ? 
                            <span className="text-red-400">Clawed Back</span> : 
                            <span className="text-green-400">Active</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <button 
                className={`
                  bg-[#00F5A0]/90 hover:bg-[#00D48F]/90 text-[#0A0F1C] font-medium py-3 px-8 rounded-lg 
                  transition-all duration-200 flex items-center justify-center gap-2 
                  shadow-lg hover:shadow-[#00F5A0]/10
                  ${(!connected || !isClaimable || isClaiming) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={!connected || !isClaimable || isClaiming}
                onClick={handleClaimClick}
              >
                {isClaiming ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0A0F1C]"></div>
                    <span>Claiming...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>
                      {!connected
                        ? 'Connect Wallet to Claim'
                        : !isClaimable
                          ? 'Nothing to Claim'
                          : 'Claim Airdrop'
                      }
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClaim}
        amount={userClaimableAmount}
        tokenName={airdrop?.name || 'tokens'}
        isLoading={isClaiming}
      />
    </div>
  );
};