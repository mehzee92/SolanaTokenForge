import { useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { notify } from '../utils/notifications';

export const AirdropButton = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleAirdrop = useCallback(async () => {
    if (!publicKey) {
      notify('Please connect your wallet first', 'error');
      return;
    }

    try {
      const signature = await connection.requestAirdrop(publicKey, 1000000000);
      await connection.confirmTransaction(signature);
      notify('Airdrop successful! 1 SOL received', 'success');
    } catch (error) {
      notify('Airdrop failed. Please try again.', 'error');
    }
  }, [publicKey, connection]);

  return (
    <button
      onClick={handleAirdrop}
      className="px-4 py-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white rounded-lg font-medium hover:scale-105 transition-transform"
    >
      GET 1 SOL
    </button>
  );
}; 