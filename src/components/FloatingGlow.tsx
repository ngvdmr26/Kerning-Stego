import React from 'react';

interface FloatingGlowProps {
  isDarkTheme?: boolean;
}

/**
 * Слой фона: медленные aurora-пятна, сетка с растворением и зерно.
 * Всё декоративное, вне потока и без перехвата событий.
 */
export const FloatingGlow: React.FC<FloatingGlowProps> = ({ isDarkTheme = true }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Верхний световой конус */}
      <div
        className="absolute -top-[38%] left-1/2 -translate-x-1/2 w-[1300px] h-[720px]"
        style={{
          background: isDarkTheme
            ? 'radial-gradient(ellipse at center, rgba(139,245,141,0.14) 0%, rgba(139,245,141,0) 62%)'
            : 'radial-gradient(ellipse at center, rgba(5,150,105,0.10) 0%, rgba(5,150,105,0) 62%)',
        }}
      />

      {/* Aurora-пятна */}
      <div
        className="aurora -top-40 -right-40 w-[620px] h-[620px]"
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, rgba(139,245,141,0.35) 0%, rgba(139,245,141,0) 70%)'
            : 'radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(52,211,153,0) 70%)',
          opacity: isDarkTheme ? 0.22 : 0.28,
        }}
      />

      <div
        className="aurora aurora-b top-1/3 -left-56 w-[560px] h-[560px]"
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, rgba(95,231,200,0.30) 0%, rgba(95,231,200,0) 70%)'
            : 'radial-gradient(circle, rgba(56,189,248,0.28) 0%, rgba(56,189,248,0) 70%)',
          opacity: isDarkTheme ? 0.16 : 0.22,
        }}
      />

      <div
        className="aurora aurora-c -bottom-48 left-1/2 -translate-x-1/2 w-[760px] h-[460px]"
        style={{
          background: isDarkTheme
            ? 'radial-gradient(circle, rgba(139,245,141,0.22) 0%, rgba(139,245,141,0) 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 70%)',
          opacity: isDarkTheme ? 0.16 : 0.22,
        }}
      />

      {/* Сетка, растворяющаяся книзу */}
      <div
        className={`absolute inset-0 bg-grid-cyber mask-fade-b transition-opacity duration-500 ${
          isDarkTheme ? 'opacity-40' : 'opacity-50'
        }`}
      />

      {/* Зерно */}
      <div className="absolute inset-0 bg-noise" />
    </div>
  );
};
