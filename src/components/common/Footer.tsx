import { FC } from 'react';
import Link from 'next/link';

export const Footer: FC = () => {
  return (
    <footer className="border-t border-gray-800/30 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="relative block">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
                TokenForge
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/5 to-[#DC1FFF]/5 blur-xl" />
            </Link>
          </div>

          <nav className="flex gap-8 mb-4 md:mb-0">
            <Link 
              href="/mint"
              className="text-gray-400 hover:text-[#00FFA3] transition-colors"
            >
              Create Token
            </Link>
            <Link 
              href="/about"
              className="text-gray-400 hover:text-[#00FFA3] transition-colors"
            >
              About
            </Link>
            <Link 
              href="/pricing"
              className="text-gray-400 hover:text-[#00FFA3] transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="text-gray-500 text-sm">
            Built on Solana
          </div>
        </div>
      </div>
    </footer>
  );
};
