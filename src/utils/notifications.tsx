import { toast, ToastOptions } from 'react-hot-toast';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

interface NotifyType {
  type: 'success' | 'error';
  message: string;
  description?: string;
  txid?: string;
  network?: WalletAdapterNetwork;
}

const getExplorerUrl = (txid: string, network: WalletAdapterNetwork) => {
  const baseUrl = 'https://explorer.solana.com/tx/';
  const networkParam = network === WalletAdapterNetwork.Mainnet ? '' : `?cluster=${network}`;
  return `${baseUrl}${txid}${networkParam}`;
};

export const notify = ({ type, message, description, txid, network = WalletAdapterNetwork.Devnet }: NotifyType): void => {
  const toastOptions: ToastOptions = {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#1E2132',
      color: 'white',
      border: '1px solid',
      borderColor: type === 'success' ? '#00FFA3' : '#FF0000',
      padding: '12px',
      borderRadius: '8px',
    },
  };

  const content = (
    <div className="flex flex-col gap-1">
      <p className="font-medium">{message}</p>
      {description && <p className="text-sm text-gray-300">{description}</p>}
      {txid && (
        <a
          href={getExplorerUrl(txid, network)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#00FFA3] hover:underline"
        >
          View transaction
        </a>
      )}
    </div>
  );

  if (type === 'success') {
    toast.success(content, toastOptions);
  } else {
    toast.error(content, toastOptions);
  }
};