import { FC, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { RequestAirdrop } from './RequestAirdrop';
import { NetworkStatus } from './NetworkStatus';
import { NetworkSelector } from './NetworkSelector';

export const AppBar: FC = (props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/docs', label: 'Documentation' },
    { href: '/pricing', label: 'Pricing' }
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm">
        <div className="navbar flex flex-row shadow-lg bg-transparent text-neutral-content max-w-7xl mx-auto px-4">
          <div className="navbar-start">
            <Link href="/">
              <div className="flex items-center space-x-2 group">
                <div className="text-2xl font-bold transition-transform duration-200 group-hover:scale-105">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
                    TokenForge
                  </span>
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex ml-8 space-x-6" aria-label="Main navigation">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="text-gray-300 hover:text-[#00FFA3] transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:hidden navbar-end">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex navbar-end items-center space-x-4">
            <NetworkStatus />
            <NetworkSelector />
            <RequestAirdrop />
            <WalletMultiButton className="!bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] !transition-all hover:!scale-105 !px-6 !py-3" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-black bg-opacity-90 backdrop-blur-sm">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="block py-2 text-gray-300 hover:text-[#00FFA3] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <NetworkStatus />
              <NetworkSelector />
              <RequestAirdrop />
              <WalletMultiButton className="!w-full !bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] !transition-all hover:!scale-105 !px-6 !py-3" />
            </div>
          </nav>
        </div>
      </div>
      <div className="h-24"></div>
      {props.children}
    </>
  );
};
