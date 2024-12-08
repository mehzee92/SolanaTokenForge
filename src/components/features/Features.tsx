import { FC } from 'react';

interface Step {
  title: string;
  description: string;
  details: string;
}

interface FeaturesProps {
  steps: Step[];
}

const Features: FC<FeaturesProps> = ({ steps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="bg-[#1A1F35] p-8 rounded-xl hover:scale-105 transition-transform">
          <div className="text-[#00FFA3] text-2xl font-bold mb-4">Step {index + 1}</div>
          <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
          <p className="text-gray-400 mb-2">{step.description}</p>
          <p className="text-sm text-gray-500">{step.details}</p>
        </div>
      ))}
    </div>
  );
};

export default Features; 