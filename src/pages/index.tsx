import type { NextPage } from "next";
import Head from "next/head";
import { FC, useEffect, useState, useContext } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Features from '../components/features/Features';
import { BackgroundEffects } from '../components/common/BackgroundEffects';
import { NetworkContext } from '../contexts/ContextProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { getWorkingConnection } from '../utils/rpc';
import { useRouter } from 'next/router';

const steps = [
  {
    title: "Connect Wallet",
    description: "Connect your Phantom wallet",
    details: "Securely connect your Solana wallet to start creating tokens. We support Phantom and other popular wallets."
  },
  {
    title: "Configure Token",
    description: "Set token details",
    details: "Specify your token's name, symbol, supply, and decimals. All parameters are customizable."
  },
  {
    title: "Design Logo",
    description: "Generate AI logo",
    details: "Use our AI to generate unique logos or upload your own. Describe what you want, and we'll create it."
  },
  {
    title: "Deploy Token",
    description: "Launch on Solana",
    details: "Deploy your token to Solana blockchain with one click. Manage ownership and transfers easily."
  }
];

const featureHighlights = [
  { 
    title: 'Token Standards',
    description: 'SPL Token & Token-2022 support',
    icon: (
      <div className="relative">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <defs>
            <linearGradient id="standardsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3">
                <animate attributeName="stop-color" values="#00FFA3;#DC1FFF;#00FFA3" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#DC1FFF">
                <animate attributeName="stop-color" values="#DC1FFF;#00FFA3;#DC1FFF" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
            <animate attributeName="stroke-dasharray" values="1,150;150,1" dur="2s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    )
  },
  { 
    title: 'AI-Powered',
    description: 'Generate unique token logos instantly',
    icon: (
      <div className="relative">
        <svg className="w-8 h-8 animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/20 to-[#DC1FFF]/20 blur-xl animate-pulse-slow" />
      </div>
    )
  },
  { 
    title: 'Transfer Fees',
    description: 'Optional token transfer fee support',
    icon: (
      <div className="relative">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            <animate
              attributeName="stroke-dashoffset"
              values="0;360"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="1,150;150,1"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#DC1FFF]/10 to-[#00FFA3]/10 blur-lg animate-pulse-slow" />
      </div>
    )
  }
];

const AnimatedValue: FC<{ value: number; unit: string }> = ({ value, unit }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count}
      {unit}
    </span>
  );
};

const Home: NextPage = () => {
  const { network } = useContext(NetworkContext);
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (router.pathname !== path) {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1424] relative overflow-hidden">
      <BackgroundEffects />
      
      <Head>
        <title>TokenForge | AI-Powered Solana Token Creator</title>
        <meta
          name="description"
          content="Create and deploy Solana tokens with AI-powered tools using TokenForge"
        />
      </Head>
      
      <div className="relative z-10">
        <div className="relative overflow-hidden py-8">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] via-[#9945FF] to-[#DC1FFF]">
                  Create Solana Tokens
                </span>
              </h1>
              
              {/* Enhanced CTA Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link href="/mint">
                  <button className="px-8 py-4 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white 
                    rounded-lg text-lg font-medium hover:scale-105 transition-all duration-300 
                    flex items-center space-x-2 cursor-pointer">
                    <span>Start Creating</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
                <Link href="/learn">
                  <button className="px-8 py-4 border-2 border-[#00FFA3] text-[#00FFA3] 
                    rounded-lg text-lg font-medium hover:bg-[#00FFA3]/10 transition-colors 
                    duration-300 cursor-pointer">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Highlights Section */}
        <div className="border-y border-gray-800 bg-gray-900/20 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureHighlights.map((feature, index) => (
                <div key={index} 
                  className="group p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 
                             hover:border-[#00FFA3]/50 transition-all duration-300 
                             hover:transform hover:scale-105 hover:shadow-lg hover:shadow-[#00FFA3]/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-[#00FFA3]/20 to-[#DC1FFF]/20 rounded-lg 
                                  group-hover:from-[#00FFA3]/30 group-hover:to-[#DC1FFF]/30 
                                  transition-all duration-300">
                      <div className="text-[#00FFA3] group-hover:scale-110 transform transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white group-hover:text-[#00FFA3] transition-colors duration-300">
                        {feature.title}
                      </div>
                      <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
              How It Works
            </span>
          </h2>
          <Features steps={steps} />
        </div>
      </div>
    </div>
  );
};

export default Home;
