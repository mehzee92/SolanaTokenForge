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
        <div className="mb-6">
          <svg width="400" height="90" viewBox="0 0 283 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FFA3">
                  <animate 
                    attributeName="stop-color" 
                    values="#00FFA3;#DC1FFF;#9945FF;#00FFA3" 
                    dur="8s" 
                    repeatCount="indefinite" 
                  />
                </stop>
                <stop offset="100%" stopColor="#DC1FFF">
                  <animate 
                    attributeName="stop-color" 
                    values="#DC1FFF;#00FFA3;#9945FF;#DC1FFF" 
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
            <path d="M20 32C20 14.3269 34.3269 0 52 0H231C248.673 0 263 14.3269 263 32C263 49.6731 248.673 64 231 64H52C34.3269 64 20 49.6731 20 32Z" fill="url(#hero-gradient)" filter="url(#glow)">
              <animate
                attributeName="opacity"
                values="1;0.8;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <text x="141.5" y="38" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">
              TokenForge
              <animate
                attributeName="fill-opacity"
                values="1;0.7;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </text>
          </svg>
        </div>
        <span className="text-4xl text-gray-400 ml-2">on Solana</span>
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
