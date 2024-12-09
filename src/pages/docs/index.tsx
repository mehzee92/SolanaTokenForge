import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const DocsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1424] text-gray-300">
      <Head>
        <title>Documentation | TokenForge</title>
        <meta name="description" content="TokenForge documentation - Learn how to create and manage Solana tokens" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
            TokenForge Documentation
          </span>
        </h1>

        <div className="space-y-12">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold text-[#00FFA3] mb-4">Overview</h2>
            <p className="mb-4">TokenForge is an AI-powered Solana token creator that simplifies the process of launching custom tokens on the Solana blockchain.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-[#00FFA3]">Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Custom Token Creation with SPL Token Support</li>
                  <li>AI-Powered Logo Generation</li>
                  <li>Transfer Fee Configuration</li>
                  <li>Token Metadata Support</li>
                  <li>Instant Deployment</li>
                </ul>
              </div>

              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl">
                <h3 className="text-xl font-bold mb-4 text-[#00FFA3]">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Connect your Solana wallet</li>
                  <li>Navigate to Create Token page</li>
                  <li>Configure token details</li>
                  <li>Generate or upload logo</li>
                  <li>Review and deploy</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Technical Documentation */}
          <section>
            <h2 className="text-2xl font-bold text-[#00FFA3] mb-4">Technical Documentation</h2>
            <div className="space-y-6">
              <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl">
                <h3 className="text-xl font-bold mb-4">Network Support</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Mainnet</li>
                  <li>Devnet (for testing)</li>
                  <li>Local Development</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DocsPage; 