import { FC, useContext } from 'react';
import { NetworkContext } from '../../contexts/ContextProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletBalance } from '../../hooks/useWalletBalance';

export const NetworkStatus: FC = () => {
    const { network, isChangingNetwork } = useContext(NetworkContext);
    const { publicKey } = useWallet();
    const balance = useWalletBalance();
    
    const getStatusColor = () => {
        if (isChangingNetwork) return 'bg-yellow-500';
        return 'bg-gradient-to-r from-[#00FFA3] to-[#00FF85]';
    };

    const getTextColor = () => {
        if (isChangingNetwork) return 'text-yellow-500';
        return 'text-[#00FFA3]';
    };

    return (
        <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor()} shadow-lg`} />
            <span className={`text-sm font-medium ${getTextColor()}`}>
                {isChangingNetwork ? 'Switching...' : network}
            </span>
            {publicKey && (
                <span className="text-[#00FFA3] ml-2">
                    {balance.toFixed(4)} SOL
                </span>
            )}
        </div>
    );
}; 