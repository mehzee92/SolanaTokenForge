import { FC, ReactNode } from 'react';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: FC<AccessibilityProviderProps> = ({ children }) => {
  return (
    <>
      {/* Skip Link */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50
                 bg-[#00FFA3] text-black px-4 py-2 rounded-md focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Notifications */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
        id="notifications-live-region"
      />

      {children}
    </>
  );
}; 