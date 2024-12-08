import { Connection, ConnectionConfig } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const RPC_ENDPOINTS = {
  [WalletAdapterNetwork.Mainnet]: [
    'https://yolo-still-reel.solana-mainnet.quiknode.pro/0b94596f1cf49869cc25b1c0d7fbdb49cd495d37/',
    'https://api.mainnet-beta.solana.com', // fallback
  ].filter(Boolean),
  [WalletAdapterNetwork.Devnet]: [
    'https://api.devnet.solana.com',
  ].filter(Boolean)
};

const CONNECTION_CONFIG: ConnectionConfig = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 120000,
  wsEndpoint: 'wss://yolo-still-reel.solana-mainnet.quiknode.pro/0b94596f1cf49869cc25b1c0d7fbdb49cd495d37/',
  disableRetryOnRateLimit: false
};

export async function getWorkingConnection(network: WalletAdapterNetwork): Promise<Connection> {
  const endpoints = RPC_ENDPOINTS[network];
  
  for (const endpoint of endpoints) {
    try {
      const connection = new Connection(endpoint, {
        ...CONNECTION_CONFIG,
        wsEndpoint: network === WalletAdapterNetwork.Mainnet 
          ? CONNECTION_CONFIG.wsEndpoint 
          : undefined,
        commitment: 'finalized'
      });
      
      // Quick validation
      const { blockhash } = await connection.getLatestBlockhash('finalized');
      if (!blockhash) throw new Error('Failed to get blockhash');
      
      return connection;
    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed:`, error);
      continue;
    }
  }
  
  throw new Error(`Failed to establish connection to ${network}`);
}

// Export endpoints for other uses
export const getRPCEndpoint = (network: WalletAdapterNetwork): string => {
  const endpoint = RPC_ENDPOINTS[network][0];
  if (!endpoint) {
    throw new Error(`No endpoint available for network ${network}`);
  }
  return endpoint;
};