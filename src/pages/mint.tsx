import type { NextPage } from "next";
import { useEffect } from 'react';
import { CreateToken } from '../components/features/CreateToken';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

const MintPage: NextPage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="h-screen bg-[#0F1424] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3]/10 via-transparent to-[#DC1FFF]/10" />
      </div>

      <div className="h-full container mx-auto px-2 relative z-10 flex flex-col">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          <CreateToken />
        </div>
      </div>
    </div>
  );
};

export default MintPage;