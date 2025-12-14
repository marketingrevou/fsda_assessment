import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
