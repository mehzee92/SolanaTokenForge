import { Connection, Transaction, TransactionSignature, Signer } from '@solana/web3.js';
import { notify } from './notifications';
import { getWorkingConnection } from './rpc';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface SendTransactionOptions {
  maxRetries?: number;
  skipPreflight?: boolean;
  network?: WalletAdapterNetwork;
}

// Exponential backoff helper
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const getBackoffDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 10000);

export async function sendTransactionWithRetry(
  connection: Connection,
  transaction: Transaction,
  signers: Array<Signer>,
  options: SendTransactionOptions = {}
): Promise<TransactionSignature> {
  const { skipPreflight = false, network = WalletAdapterNetwork.Mainnet } = options;
  
  try {
    // Log transaction state before sending
    console.log('Sending transaction:', {
      numInstructions: transaction.instructions.length,
      signers: signers.map(s => s.publicKey.toBase58()),
      signatures: transaction.signatures.map(s => ({
        pubkey: s.publicKey.toBase58(),
        signature: s.signature?.toString('base64') || null
      }))
    });

    // Send raw transaction with detailed error handling
    const rawTx = transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTx, {
      skipPreflight,
      preflightCommitment: 'confirmed',
      maxRetries: 5
    }).catch((error: any) => {
      if (error.logs) console.error('Transaction logs:', error.logs);
      throw error;
    });

    // Enhanced confirmation with timeout
    const confirmation = await Promise.race([
      connection.confirmTransaction({
        signature,
        blockhash: transaction.recentBlockhash!,
        lastValidBlockHeight: transaction.lastValidBlockHeight!
      }, 'confirmed'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Confirmation timeout')), 60000)
      )
    ]) as { value: { err: any } };

    if (confirmation.value?.err) {
      throw new Error(
        typeof confirmation.value.err === 'object'
          ? JSON.stringify(confirmation.value.err)
          : confirmation.value.err.toString()
      );
    }

    return signature;
  } catch (error: any) {
    console.error('Transaction failed:', {
      error: error.message,
      logs: error.logs,
      details: error
    });
    throw error;
  }
} 