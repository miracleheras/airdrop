# Solana Airdrop Platform

A modern web application for managing and claiming Solana airdrops, built with React and the Streamflow SDK.

## Features

- 🔗 Connect with Phantom Wallet
- 📊 View airdrop details and progress
- 💰 Claim tokens with confirmation dialog
- 📱 Responsive design
- 🔒 Secure transaction handling

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Streamflow SDK
- Phantom Wallet Integration

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Phantom Wallet browser extension

## Installation

1. Clone the repository:
```bash
git clone https://github.com/miracleheras/airdrop.git
cd airdrop
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
airdrop/
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── utils/             # Utility functions
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── consts/            # Constants
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## Usage

1. Connect your Phantom Wallet
2. Browse available airdrops
3. View airdrop details including:
   - Token information
   - Claim progress
   - Recipient statistics
4. Claim tokens with confirmation

## Development

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Maintain consistent UI/UX

## Acknowledgments

- [Streamflow](https://streamflow.finance/) for the SDK
- [Solana](https://solana.com/) for the blockchain infrastructure
- [Phantom](https://phantom.app/) for the wallet integration 