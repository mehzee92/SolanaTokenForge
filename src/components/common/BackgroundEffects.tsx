import { FC } from 'react';

export const BackgroundEffects: FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient Mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3]/5 via-transparent to-[#DC1FFF]/5 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-5" />
      </div>

      {/* Animated Orbs */}
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.3">
              <animate 
                attributeName="stop-color" 
                values="#00FFA3;#DC1FFF;#00FFA3" 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </stop>
            <stop offset="100%" stopColor="#DC1FFF" stopOpacity="0">
              <animate 
                attributeName="stop-color" 
                values="#DC1FFF;#00FFA3;#DC1FFF" 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </stop>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <circle
            key={i}
            className="animate-float-slow"
            cx={20 + (i * 15)}
            cy={30 + (i * 10)}
            r="3"
            fill="url(#orb-gradient)"
            filter="url(#glow)"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </svg>

      {/* Gradient Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-1/2 bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent animate-gradient transform -rotate-45"
            style={{
              top: `${30 + (i * 20)}%`,
              left: `${-50 + (i * 30)}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}; 