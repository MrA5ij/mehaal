import React from 'react';

export const Logo = ({ className, theme = 'dark' }: { className?: string, theme?: 'dark' | 'light' }) => {
  return (
    <div className={`font-bold text-xl flex items-center gap-2 ${className}`}>
      {/* SVG Logo - Colors controlled by props */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill={theme === 'dark' ? '#fff' : '#000'} />
        <path d="M16 8L24 24H8L16 8Z" fill={theme === 'dark' ? '#000' : '#fff'} />
      </svg>
      <span className="tracking-tight">MySaaS</span>
    </div>
  );
};
