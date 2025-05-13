import BN from 'bn.js';

type DistributorDetails = {
  numNodesClaimed: BN;
  maxNumNodes: BN;
  totalAmountClaimed: BN;
  maxTotalClaim: BN;
  unlockPeriod: BN;
  startTs: BN;
  clawedBack: boolean;
};

export const getBNValue = (bnValue: BN | null | undefined): number => {
  if (!bnValue) return 0;
  
  try {
    return parseInt(bnValue.toString());
  } catch (e) {
    console.error("Error parsing BN value:", e);
    return 0;
  }
};

export const formatTokenAmount = (bnValue: BN | null | undefined, decimals: number = 6): string => {
  const value = getBNValue(bnValue);
  return (value / Math.pow(10, decimals)).toFixed(2);
};

export const getAirdropType = (unlockPeriod: BN | null | undefined): string => {
  if (!unlockPeriod) return "Unknown";
  const period = getBNValue(unlockPeriod);
  return period === 1 ? "Instant" : "Vested";
};

export const getRecipientProgress = (distributorDetails: DistributorDetails | null): { claimed: number, total: number, percentage: string } => {
  if (!distributorDetails) return { claimed: 0, total: 0, percentage: "0%" };
  
  const claimed = getBNValue(distributorDetails.numNodesClaimed);
  const total = getBNValue(distributorDetails.maxNumNodes);
  const percentage = total > 0 ? `${(claimed / total * 100).toFixed(2)}%` : "0%";
  
  return { claimed, total, percentage };
};

export const getTokenProgress = (distributorDetails: DistributorDetails | null): { claimed: string, total: string, percentage: string } => {
  if (!distributorDetails) return { claimed: "0", total: "0", percentage: "0%" };
  
  const claimed = getBNValue(distributorDetails.totalAmountClaimed);
  const total = getBNValue(distributorDetails.maxTotalClaim);
  const percentage = total > 0 ? `${(claimed / total * 100).toFixed(2)}%` : "0%";
  
  return {
    claimed: formatTokenAmount(distributorDetails.totalAmountClaimed),
    total: formatTokenAmount(distributorDetails.maxTotalClaim),
    percentage
  };
}; 