import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export function getDetailedErrorMessage(error: any, network: WalletAdapterNetwork): string {
  const message = error?.message || 'Unknown error';
  
  if (network === WalletAdapterNetwork.Mainnet) {
    if (message.includes('0x1') || message.includes('Transaction simulation failed')) {
      return 'Transaction simulation failed. Please check your token parameters and ensure sufficient SOL balance.';
    }
    if (message.includes('blockhash not found')) {
      return 'Network congestion detected. Please try again.';
    }
    if (message.includes('403')) {
      return 'RPC rate limit reached. Please try again in a few minutes or switch to a different RPC endpoint.';
    }
    if (message.includes('insufficient funds')) {
      return 'Insufficient SOL balance for transaction. Please ensure you have enough SOL to cover the transaction fees.';
    }
    if (message.includes('invalid account data')) {
      return 'Invalid account data. Please check your token configuration.';
    }
  }

  // Generic error messages
  if (message.includes('User rejected')) {
    return 'Transaction was rejected by user.';
  }
  if (message.includes('timeout')) {
    return 'Transaction timed out. Please try again.';
  }
  
  return message;
}

export function isRetryableError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  return !(
    message.includes('403') ||
    message.includes('invalid blockhash') ||
    message.includes('user rejected') ||
    message.includes('transaction signature verification failure')
  );
} 