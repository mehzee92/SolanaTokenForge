import { FC, ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export const ContentContainer: FC<ContentContainerProps> = ({ children }) => {
  return (
    <div className="relative z-10 flex-1">
      {children}
    </div>
  );
};
