import React from 'react';

interface BrainIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const BrainIcon: React.FC<BrainIconProps> = ({ 
  width = 28, 
  height = 28, 
  className 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="20" cy="32" rx="16" ry="20" fill="#90cdf4"/>
      <ellipse cx="44" cy="32" rx="16" ry="20" fill="#b794f4"/>
      <ellipse cx="32" cy="32" rx="18" ry="22" fill="#a0aec0" fillOpacity="0.5"/>
      <ellipse cx="32" cy="32" rx="14" ry="18" fill="#f7fafc" fillOpacity="0.7"/>
      <path d="M32 14C28 14 28 22 32 22C36 22 36 14 32 14Z" fill="#805ad5"/>
      <path d="M32 50C28 50 28 42 32 42C36 42 36 50 32 50Z" fill="#3182ce"/>
    </svg>
  );
}; 