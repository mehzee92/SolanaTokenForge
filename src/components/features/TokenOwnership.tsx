import { FC, useState, useCallback, useContext } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { notify } from "../../utils/notifications";
import { createSetAuthorityInstruction, AuthorityType, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { NetworkContext } from '../../contexts/ContextProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { MainnetWarning } from '../common/MainnetWarning';

interface TokenOwnershipProps {
  mintAddress: string;
  className?: string;
}

export const TokenOwnership: FC<TokenOwnershipProps> = ({ mintAddress, className }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { network, isChangingNetwork } = useContext(NetworkContext);
  const [newOwner, setNewOwner] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const isMainnet = network === WalletAdapterNetwork.Mainnet;

  const confirmMainnetTransfer = useCallback(() => {
    if (!isMainnet) return true;
    return window.confirm(
      'You are about to transfer token ownership on mainnet. This action cannot be undone. Continue?'
    );
  }, [isMainnet]);

  const transferOwnership = async () => {
    if (isChangingNetwork) {
      notify({ 
        type: 'error', 
        message: 'Network switching in progress',
        description: 'Please wait for network switch to complete'
      });
      return;
    }

    if (!confirmMainnetTransfer()) {
      return;
    }

    if (!publicKey || !mintAddress || !newOwner) {
      notify({ type: 'error', message: 'Please enter a valid wallet address' });
      return;
    }

    setIsTransferring(true);
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      const newOwnerPublicKey = new PublicKey(newOwner);

      const transaction = new Transaction().add(
        createSetAuthorityInstruction(
          mintPublicKey,
          publicKey,
          AuthorityType.MintTokens,
          newOwnerPublicKey,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      });
      
      notify({ 
        type: 'success', 
        message: 'Ownership transferred successfully!',
        description: `New owner: ${newOwner}`,
        txid: signature
      });
      setNewOwner('');
    } catch (error) {
      console.error('Transfer error:', error);
      notify({ 
        type: 'error', 
        message: 'Failed to transfer ownership',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Transfer Token Ownership</h4>
        {isMainnet && (
          <div className="mb-4">
            <MainnetWarning />
            <p className="mt-2 text-sm text-gray-400">
              Transfers on mainnet are permanent and cannot be undone.
            </p>
          </div>
        )}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="New owner wallet address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            className="flex-1 bg-gray-800/50 text-white rounded-lg px-3 py-2 border border-gray-700"
            disabled={isTransferring || isChangingNetwork}
          />
          <button
            onClick={transferOwnership}
            disabled={isTransferring || isChangingNetwork || !newOwner}
            className={`px-4 py-2 rounded-lg font-medium transition-all
              ${isTransferring || isChangingNetwork || !newOwner
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white hover:scale-105'
              }`}
          >
            {isTransferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};