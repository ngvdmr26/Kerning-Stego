import React, { useState } from 'react';
import { GAP_STEP_EM, FONT_SIZE_PX } from '../lib/kerningStego';

const LEVEL_BITS = ['00', '01', '10', '11'];

export const KerningDemo: React.FC = () => {
  const [gap, setGap] = useState(0.06);

  const level = Math.min(3, Math.round(gap / GAP_STEP_EM));
  const exact = Math.abs(gap - level * GAP_STEP_EM) < 0.001;
  const px = (gap * FONT_SIZE_PX).toFixed(2);
  const tooWide = gap > GAP_STEP_EM * 3 + 0.001;

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8BF58D] font-mono mb-1">
            живой кёрнинг
          </div>
          <div className="text-sm sm:text-base font-semibold text-[#F5F7F5]">
            Подвиньте зазор между буквами
          </div>
        </div>
        <span
          className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
            tooWide
              ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
              : 'text-[#8BF58D] border-[#8BF58D]/25 bg-[#8BF58D]/10'
          }`}
        >
          {tooWide ? 'заметно глазу' : 'в схеме'}
        </span>
      </div>

      <div className="rounded-2xl bg-[#080B0D]/60 border border-white/[0.08] px-4 py-8 sm:py-10 flex items-end justify-center overflow-hidden">
        <span className="font-display text-4xl sm:text-6xl text-[#F5F7F5] leading-none select-none">
          Т
        </span>
        <span
          className="flex flex-col items-center self-stretch justify-end mx-1.5 sm:mx-2"
          style={{ width: `${Math.max(1, gap * 180)}px`, minWidth: '2px' }}
        >
          <span className="w-px flex-1 min-h-[22px] bg-[#8BF58D] shadow-[0_0_8px_rgba(139,245,141,0.8)]" />
          <span className="mt-1.5 font-mono text-[9px] sm:text-[10px] text-[#8BF58D] whitespace-nowrap">
            {gap.toFixed(2)}em
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-[#92999F] whitespace-nowrap">
            {px}px
          </span>
        </span>
        <span className="font-display text-4xl sm:text-6xl text-[#F5F7F5] leading-none select-none">
          и
        </span>
      </div>

      <div className="mt-5">
        <input
          type="range"
          min={0}
          max={0.12}
          step={0.01}
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
          aria-label="Межбуквенный зазор"
          className="range-kerning w-full"
        />
        <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-[#62686F]">
          <span>0.00</span>
          <span>0.06 — предел схемы</span>
          <span>0.12</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#92999F]">
        <span>
          биты:{' '}
          <strong className="font-mono text-[#8BF58D]">
            {exact ? LEVEL_BITS[level] : '—'}
          </strong>
        </span>
        <span>
          уровень: <strong className="text-[#F5F7F5]">{level + 1} / 4</strong>
        </span>
        <span className="text-[#62686F]">шаг схемы 0.02em = 0.32px</span>
      </div>
    </div>
  );
};
