import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getCachedBalance } from './balanceCache';

export async function validateTransactionFeasibility(
  connection: Connection,
  publicKey: PublicKey,
  estimatedSize: number,
  isTransferFeeEnabled: boolean
): Promise<{ isValid: boolean; error?: string }> {
  try {
    // Use cached balance
    const balanceInSol = await getCachedBalance(connection, publicKey);
    const balance = balanceInSol * LAMPORTS_PER_SOL;
    
    const rentExemption = await connection.getMinimumBalanceForRentExemption(estimatedSize);
    const estimatedCost = rentExemption + (isTransferFeeEnabled ? 10000000 : 5000000);
    
    if (balance < estimatedCost) {
      return {
        isValid: false,
        error: `Insufficient balance. Need at least ${(estimatedCost / LAMPORTS_PER_SOL).toFixed(4)} SOL`
      };
    }

    // Verify program availability
    const programInfo = await connection.getAccountInfo(TOKEN_2022_PROGRAM_ID);
    if (!programInfo) {
      return {
        isValid: false,
        error: 'Token program not available'
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Validation failed'
    };
  }
} 