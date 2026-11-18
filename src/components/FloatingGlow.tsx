import React from 'react';

interface FloatingGlowProps {
  isDarkTheme?: boolean;
}

export const FloatingGlow: React.FC<FloatingGlowProps> = ({ isDarkTheme = true }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top right subtle green glow */}
      <div 
        className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-700 ${
          isDarkTheme ? 'opacity-15' : 'opacity-20'
        }`}
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, #8BF58D 0%, rgba(139, 245, 141, 0) 70%)'
            : 'radial-gradient(circle, #34D399 0%, rgba(52, 211, 153, 0) 70%)',
        }}
      />
      
      {/* Center left dark cyan/green accent glow */}
      <div 
        className={`absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full blur-[130px] transition-all duration-700 ${
          isDarkTheme ? 'opacity-10' : 'opacity-15'
        }`}
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, #5FE7C8 0%, rgba(95, 231, 200, 0) 70%)'
            : 'radial-gradient(circle, #38BDF8 0%, rgba(56, 189, 248, 0) 70%)',
        }}
      />

      {/* Bottom center glow */}
      <div 
        className={`absolute -bottom-48 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] transition-all duration-700 ${
          isDarkTheme ? 'opacity-10' : 'opacity-15'
        }`}
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, #8BF58D 0%, rgba(139, 245, 141, 0) 70%)'
            : 'radial-gradient(circle, #10B981 0%, rgba(16, 185, 129, 0) 70%)',
        }}
      />

      {/* Fine cyber grid overlay */}
      <div className={`absolute inset-0 bg-grid-cyber transition-opacity duration-500 ${
        isDarkTheme ? 'opacity-40' : 'opacity-30'
      }`} />
    </div>
  );
};
