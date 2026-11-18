import React from 'react';

export const FloatingGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top right subtle green glow */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #8BF58D 0%, rgba(139, 245, 141, 0) 70%)',
        }}
      />
      
      {/* Center left dark cyan/green accent glow */}
      <div 
        className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full opacity-10 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, #5FE7C8 0%, rgba(95, 231, 200, 0) 70%)',
        }}
      />

      {/* Bottom center glow */}
      <div 
        className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, #8BF58D 0%, rgba(139, 245, 141, 0) 70%)',
        }}
      />

      {/* Subtle fine cyber grid overlay */}
      <div className="absolute inset-0 bg-grid-cyber opacity-40" />
    </div>
  );
};
