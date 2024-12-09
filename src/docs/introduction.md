# TokenForge Documentation

## Overview
TokenForge is an AI-powered Solana token creator that simplifies the process of launching custom tokens on the Solana blockchain. With features like AI-generated logos and intuitive token management, TokenForge makes token creation accessible to everyone.

## Key Features
- Custom Token Creation with SPL Token Support
- AI-Powered Logo Generation
- Transfer Fee Configuration
- Token Metadata Support
- Instant Deployment
- Ownership Management

## Getting Started

### Prerequisites
- Solana Wallet (Phantom recommended)
- SOL tokens for deployment (1 SOL per token)
- Modern web browser

### Quick Start
1. Connect your Solana wallet
2. Navigate to the Create Token page
3. Fill in token details:
   - Name
   - Symbol
   - Supply
   - Decimals
4. Generate or upload a logo
5. Review and deploy

## Technical Documentation

### Network Support
- Mainnet
- Devnet (for testing)
- Local Development

### Token Standards
- SPL Token Program
- Metaplex Token Metadata

### Security Features
- Secure Wallet Connection
- Transaction Confirmation
- Ownership Verification 

### 2. Metadata Structure

## Error Handling
Common error codes and their meanings:
- 4001: User rejected transaction
- 4100: Unauthorized operation
- 4200: Insufficient funds
- 4300: Invalid token configuration 

### 3. AI Logo Generation
Endpoint: `/api/generate-logo`
Method: POST
Parameters:
- prompt: string
- style: "minimal" | "detailed" | "abstract"

