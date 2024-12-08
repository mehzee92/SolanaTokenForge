import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { throttle } from 'lodash';

interface BalanceCache {
  [key: string]: {
    balance: number;
    timestamp: number;
  }
}

const CACHE_DURATION = 3000; // 3 seconds
const balanceCache: BalanceCache = {};

// Throttled getBalance function - max 1 call per second per address
const throttledGetBalance = throttle(async (
  connection: Connection,
  address: PublicKey
): Promise<number> => {
  try {
    const balance = await connection.getBalance(address);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    // If authentication fails, try fallback endpoint
    if (error.message.includes('401') || error.message.includes('Must be authenticated')) {
      console.warn('Authentication failed, using fallback endpoint');
      const fallbackConnection = new Connection('https://api.mainnet-beta.solana.com');
      const balance = await fallbackConnection.getBalance(address);
      return balance / LAMPORTS_PER_SOL;
    }
    throw error;
  }
}, 1000, { leading: true, trailing: true });

export async function getCachedBalance(
  connection: Connection,
  address: PublicKey
): Promise<number> {
  const key = address.toBase58();
  const now = Date.now();
  const cached = balanceCache[key];

  // Return cached balance if still valid
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.balance;
  }

  // Get fresh balance
  const balance = await throttledGetBalance(connection, address);
  
  // Update cache
  balanceCache[key] = {
    balance,
    timestamp: now
  };

  return balance;
} 