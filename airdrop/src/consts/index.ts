export const Path = {
  Home: '/',
  Detail: '/detail/',
}

export const API_BASE_URL = 'https://staging-api.streamflow.finance/v2/api/airdrops';

export const SOLANA_CLUSTER_URL = 'https://api.devnet.solana.com';

export const DEFAULT_AIRDROP_LIMIT = 10;

export const getAirdropsPayload = (limit: number = DEFAULT_AIRDROP_LIMIT) => ({
  "actor": "",
  "limit": limit,
  "offset": 0,
  "filters": {
    "include": {
      "isOnChain": true,
      "isActive": true
    }
  },
  "sorters": [
    {
      "by": "id",
      "order": "desc"
    }
  ]
});