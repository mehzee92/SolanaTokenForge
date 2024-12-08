import type { NextPage } from "next";
import Head from "next/head";

const About: NextPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
          About TokenForge
        </span>
      </h1>
      
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