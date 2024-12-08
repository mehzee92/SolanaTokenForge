import React from 'react';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useWallet } from '@solana/wallet-adapter-react';

const SOLBalanceDisplay = () => {
  const { publicKey } = useWallet();
  const balance = useWalletBalance();

  if (!publicKey) return null;

  return (
    <div className="text-white mt-4">
      SOL: {balance.toLocaleString() || 0}
    </div>
  );
};

export default SOLBalanceDisplay; 