import { FC } from 'react';

const About: FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0F1424]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3">
                <animate 
                  attributeName="stop-color" 
                  values="#00FFA3;#DC1FFF;#00FFA3" 
                  dur="8s" 
                  repeatCount="indefinite" 
                />
              </stop>
              <stop offset="100%" stopColor="#DC1FFF">
                <animate 
                  attributeName="stop-color" 
                  values="#DC1FFF;#00FFA3;#DC1FFF" 
                  dur="8s" 
                  repeatCount="indefinite" 
                />
              </stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Animated Circles */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={50 + 30 * Math.cos((2 * Math.PI * i) / 20)}
              cy={50 + 30 * Math.sin((2 * Math.PI * i) / 20)}
              r="0.5"
              fill="url(#gradient)"
              filter="url(#glow)"
              opacity="0.5"
            >
              <animate
                attributeName="opacity"
                values="0.5;0.2;0.5"
                dur={`${3 + i * 0.2}s`}
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 50 50`}
                to={`360 50 50`}
                dur={`${20 + i}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] via-[#9945FF] to-[#DC1FFF] animate-gradient">
            TokenForge
          </span>
          <span className="text-4xl text-gray-400 ml-2">on Solana</span>
        </h1>
        <p className="text-2xl text-gray-300 mb-12 max-w-2xl animate-fade-in">
          Create and Deploy Solana Tokens with AI-Powered Tools
        </p>
        
        {/* Animated Arrow */}
        <div className="animate-bounce mt-8">
          <svg 
            className="w-8 h-8 text-[#00FFA3]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default About;
