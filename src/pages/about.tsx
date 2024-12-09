import type { NextPage } from "next";
import Head from "next/head";

const About: NextPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center mb-8">
        <svg width="200" height="45" viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="about-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
          </defs>
          <path d="M20 32C20 14.3269 34.3269 0 52 0H231C248.673 0 263 14.3269 263 32C263 49.6731 248.673 64 231 64H52C34.3269 64 20 49.6731 20 32Z" fill="url(#about-gradient)"/>
          <text x="141.5" y="38" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">TokenForge</text>
        </svg>
      </div>
      
      <div className="space-y-6 text-gray-300">
        <p>TokenForge is the easiest way to create Solana tokens with custom branding. Our platform combines powerful blockchain technology with an intuitive interface, making token creation accessible to everyone.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-[#00FFA3]">Our Mission</h3>
            <p>To democratize token creation on Solana by providing powerful tools that anyone can use.</p>
          </div>
          
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-[#00FFA3]">Why Choose Us</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>AI-powered logo generation</li>
              <li>Simple, intuitive interface</li>
              <li>Instant token deployment</li>
              <li>Full ownership control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 