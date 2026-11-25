import React from 'react';

/**
 * Слой фона: медленные aurora-пятна, сетка с растворением и зерно.
 * Всё декоративное, вне потока и без перехвата событий.
 */
export const FloatingGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Верхний световой конус */}
      <div
        className="absolute -top-[38%] left-1/2 -translate-x-1/2 w-[1300px] h-[720px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(139,245,141,0.14) 0%, rgba(139,245,141,0) 62%)',
        }}
      />

      {/* Aurora-пятна */}
      <div
        className="aurora -top-40 -right-40 w-[620px] h-[620px]"
        style={{
          background:
            'radial-gradient(circle, rgba(139,245,141,0.35) 0%, rgba(139,245,141,0) 70%)',
          opacity: 0.22,
        }}
      />

      <div
        className="aurora aurora-b top-1/3 -left-56 w-[560px] h-[560px]"
        style={{
          background: 'radial-gradient(circle, rgba(95,231,200,0.30) 0%, rgba(95,231,200,0) 70%)',
          opacity: 0.16,
        }}
      />

      <div
        className="aurora aurora-c -bottom-48 left-1/2 -translate-x-1/2 w-[760px] h-[460px]"
        style={{
          background:
            'radial-gradient(circle, rgba(139,245,141,0.22) 0%, rgba(139,245,141,0) 70%)',
          opacity: 0.16,
        }}
      />

      {/* Сетка, растворяющаяся книзу */}
      <div className="absolute inset-0 bg-grid-cyber mask-fade-b opacity-40" />

      {/* Зерно */}
      <div className="absolute inset-0 bg-noise" />
    </div>
  );
};
