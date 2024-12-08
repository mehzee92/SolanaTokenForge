import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BackgroundEffects } from "../components/common/BackgroundEffects";

const PricingFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2">
    <svg className="w-5 h-5 text-[#00FFA3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    {children}
  </li>
);

const Pricing: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1424] relative overflow-hidden">
      <BackgroundEffects />
      
      <Head>
        <title>Pricing | TokenForge</title>
        <meta
          name="description"
          content="Simple and transparent pricing for creating Solana tokens with TokenForge"
        />
      </Head>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
            Simple, Transparent Pricing
          </span>
        </h1>
        
        <div className="max-w-md mx-auto p-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-[#00FFA3]/20 hover:border-[#00FFA3]/40 transition-colors">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Launch Plan</h2>
            <div className="text-4xl font-bold mb-6">
              <span className="text-[#00FFA3]">1 SOL</span>
              <span className="text-sm text-gray-400 ml-2">per token</span>
            </div>
            
            <ul className="text-left space-y-4 mb-8 text-gray-300">
              <PricingFeature>Custom Token Creation</PricingFeature>
              <PricingFeature>AI Logo Generation</PricingFeature>
              <PricingFeature>Ownership Management</PricingFeature>
              <PricingFeature>Instant Deployment</PricingFeature>
              <PricingFeature>Token Metadata</PricingFeature>
            </ul>
            
            <div className="inline-block w-full">
              <Link 
                href="/mint"
                as="/mint"
                passHref
              >
                <div className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#00FFA3]/20">
                  Start Creating
                </div>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              No hidden fees. Pay only when you create a token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;