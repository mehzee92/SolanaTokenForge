import React, { FC, ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { clusterApiUrl } from '@solana/web3.js';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';
import { notify } from "../utils/notifications";
import { getWorkingConnection, getRPCEndpoint } from '../utils/rpc';
import { createContext } from 'react';
import { Connection } from '@solana/web3.js';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

// Dynamic import of WalletModalProvider to prevent SSR issues
const WalletModalProvider = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletModalProvider),
    { ssr: false }
);

export const NetworkContext = createContext({
    network: WalletAdapterNetwork.Devnet,
    setNetwork: (network: WalletAdapterNetwork) => {},
    connection: null as Connection | null,
    setConnection: (connection: Connection | null) => {},
    isChangingNetwork: false
});

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { autoConnect } = useAutoConnect();
    const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
    const [connection, setConnection] = useState<Connection | null>(null);
    const [isChangingNetwork, setIsChangingNetwork] = useState(false);

    useEffect(() => {
        const initConnection = async () => {
            try {
                const conn = await getWorkingConnection(network);
                setConnection(conn);
            } catch (error) {
                console.error('Failed to initialize connection:', error);
            }
        };

        initConnection();
    }, [network]);

    const handleNetworkChange = async (newNetwork: WalletAdapterNetwork) => {
        setIsChangingNetwork(true);
        try {
            setNetwork(newNetwork);
            notify({ 
                type: 'success', 
                message: `Switched to ${newNetwork}`,
                description: `Now connected to Solana ${newNetwork}`,
                network: newNetwork
            });
        } finally {
            setIsChangingNetwork(false);
        }
    };

    // Empty wallets array since we're using wallet-standard
    const wallets = useMemo(
        () => [],
        [network]
    );

    const onError = useCallback(
        (error: WalletError) => {
            notify({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
            console.error(error);
        },
        []
    );

    return (
        <NetworkContext.Provider value={{ 
            network, 
            setNetwork: handleNetworkChange, 
            connection, 
            setConnection,
            isChangingNetwork 
        }}>
            <ConnectionProvider endpoint={getRPCEndpoint(network)}>
                <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
                    <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </NetworkContext.Provider>
    );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <AutoConnectProvider>
            <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
    );
};
