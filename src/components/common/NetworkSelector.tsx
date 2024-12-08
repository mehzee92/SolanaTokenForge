import { FC } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useContext } from 'react';
import { NetworkContext } from '../../contexts/ContextProvider';

export const NetworkSelector: FC = () => {
    const { network, setNetwork, isChangingNetwork } = useContext(NetworkContext);

    return (
        <div className="flex items-center space-x-2">
            <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as WalletAdapterNetwork)}
                className="bg-gray-800/50 text-white rounded-lg px-3 py-2 border border-gray-700 disabled:opacity-50"
                disabled={isChangingNetwork}
            >
                <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
                <option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
            </select>
            {isChangingNetwork && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00FFA3]" />
            )}
        </div>
    );
}; 