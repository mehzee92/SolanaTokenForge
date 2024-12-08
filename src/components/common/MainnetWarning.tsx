import { FC } from 'react';

interface MainnetWarningProps {
  compact?: boolean;
}

export const MainnetWarning: FC<MainnetWarningProps> = ({ compact = false }) => {
  return (
    <div className={`flex items-center ${compact ? 'px-2 py-1' : 'p-3'} rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20`}>
      <div className="flex items-center space-x-2">
        <span className="text-red-400">⚠️</span>
        <span className={`text-red-400 ${compact ? 'text-sm' : 'text-base'} font-medium`}>
          Mainnet Mode
        </span>
      </div>
    </div>
  );
}; 