import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { getCachedBalance } from '../utils/balanceCache';

export const useWalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateBalance = async () => {
      if (!publicKey || !connection) {
        setBalance(0);
        return;
      }

      try {
        const walletBalance = await getCachedBalance(connection, publicKey);
        setBalance(walletBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    updateBalance();
    intervalId = setInterval(updateBalance, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [connection, publicKey]);

  return balance;
}; 