import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { notify } from "../../utils/notifications";
import { NetworkContext } from '../../contexts/ContextProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getWorkingConnection } from '../../utils/rpc';
import { useWalletBalance } from '../../hooks/useWalletBalance';

export const RequestAirdrop: FC = () => {
    const { publicKey } = useWallet();
    const { network, isChangingNetwork } = useContext(NetworkContext);
    const [connection, setConnection] = useState(null);
    const balance = useWalletBalance();

    useEffect(() => {
        getWorkingConnection(network)
            .then(conn => setConnection(conn))
            .catch(console.error);
    }, [network]);

    const isMainnet = network === WalletAdapterNetwork.Mainnet;
    const disabled = isMainnet || isChangingNetwork;

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ 
                type: 'error', 
                message: 'Wallet not connected!',
                description: 'Please connect your wallet to request an airdrop.',
                network
            });
            return;
        }

        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
            await connection.confirmTransaction(signature, 'confirmed');
            notify({ 
                type: 'success', 
                message: 'Airdrop successful!', 
                description: 'You received 1 SOL',
                txid: signature,
                network
            });
        } catch (error: any) {
            notify({ 
                type: 'error', 
                message: 'Airdrop failed!', 
                description: error?.message, 
                txid: signature,
                network
            });
        }
    }, [publicKey, connection, network]);

    return isMainnet ? null : (
        <button
            className="px-4 py-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white rounded-lg 
                     font-medium hover:scale-105 transition-transform disabled:opacity-50 
                     disabled:hover:scale-100 disabled:cursor-not-allowed"
            onClick={onClick}
            disabled={disabled}
        >
            GET 1 SOL
        </button>
    );
};