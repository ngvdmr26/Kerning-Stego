import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEMO: Array<{ char: string; gap: number }> = [
  { char: 'В', gap: 0 },
  { char: 'с', gap: 0.02 },
  { char: 'т', gap: 0 },
  { char: 'р', gap: 0.04 },
  { char: 'е', gap: 0 },
  { char: 'ч', gap: 0.02 },
  { char: 'а', gap: 0 },
  { char: ' ', gap: 0.06 },
  { char: 'в', gap: 0 },
  { char: ' ', gap: 0.02 },
  { char: '1', gap: 0 },
  { char: '9', gap: 0.04 },
  { char: ':', gap: 0 },
  { char: '0', gap: 0.02 },
  { char: '0', gap: 0 },
];

/**
 * Карточка-перевёртыш: снаружи обычное сообщение, внутри — те же буквы
 * с измеримыми зазорами, в которых лежит послание.
 */
export const SecretCard: React.FC = () => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setFlipped((prev) => !prev), 5600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      <div className="absolute -inset-6 rounded-[36px] bg-[#8BF58D]/10 blur-3xl pointer-events-none" />

      <div className="relative h-[380px] sm:h-[420px]" style={{ perspective: '1400px' }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Снаружи */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#1C2229]/95 to-[#12161B]/98 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#62686F]">
                так видит человек
              </span>
              <EyeOff className="w-4 h-4 text-[#62686F]" />
            </div>

            <p className="font-display text-3xl sm:text-[34px] leading-[1.4] text-[#F5F7F5]">
              Встреча в 19:00
            </p>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#62686F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BF58D]/60" />
              обычное сообщение, без вложений
            </div>

            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#8BF58D]/10 blur-2xl" />
          </div>

          {/* Внутри */}
          <div
            className="absolute inset-0 rounded-3xl border border-[#8BF58D]/25 bg-[#0B0F12] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] p-6 sm:p-7 flex flex-col justify-between overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#8BF58D]">
                так видит декодер
              </span>
              <Eye className="w-4 h-4 text-[#8BF58D]" />
            </div>

            <div className="flex flex-wrap items-end gap-y-2 py-2">
              {DEMO.map((cell, idx) => (
                <span key={idx} className="inline-flex items-end">
                  <span className="font-display text-xl sm:text-2xl leading-none text-[#F5F7F5] whitespace-pre">
                    {cell.char === ' ' ? '\u00A0' : cell.char}
                  </span>
                  {idx < DEMO.length - 1 && (
                    <span className="flex flex-col items-center mx-0.5 sm:mx-1">
                      <span
                        className={`w-px h-3.5 sm:h-4 ${
                          cell.gap > 0
                            ? 'bg-[#8BF58D] shadow-[0_0_6px_rgba(139,245,141,0.8)]'
                            : 'bg-white/20'
                        }`}
                      />
                      <span
                        className={`mt-1 text-[7px] sm:text-[8px] leading-none tabular-nums ${
                          cell.gap > 0 ? 'text-[#8BF58D]' : 'text-[#62686F]'
                        }`}
                      >
                        {cell.gap.toFixed(2)}
                      </span>
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="rounded-xl border border-[#8BF58D]/20 bg-[#8BF58D]/[0.07] px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#92999F]">скрыто</span>
              <span className="text-xs font-semibold text-[#8BF58D]">«K-26»</span>
            </div>

            <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-[#8BF58D]/10 blur-3xl" />
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        className="mt-4 w-full text-center text-[10px] font-mono uppercase tracking-[0.18em] text-[#62686F] hover:text-[#8BF58D] transition-colors cursor-pointer"
      >
        перевернуть
      </button>
    </div>
  );
};
