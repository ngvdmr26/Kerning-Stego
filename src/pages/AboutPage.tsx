import React from 'react';
import { Info, Check, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] py-6 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Content + Right 3D Cube */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-10 sm:mb-16">
          
          {/* Left Column: Title + Description + Info Pill matching Reference */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 text-left">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F5] tracking-tight mb-4 sm:mb-6">
              О проекте
            </h1>

            <p className="text-[#92999F] text-xs sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Kerning Stego — это современный инструмент для стеганографии, использующий метод Кёрнинга.
              Он позволяет передавать скрытые сообщения путём незаметного изменения расстояний между
              символами в тексте.
            </p>

            {/* Bottom Alert / Info Box matching Reference */}
            <div className="rounded-xl sm:rounded-2xl p-3.5 sm:p-5 bg-[#171C22]/80 border border-white/[0.12] backdrop-blur-md flex items-start gap-3 sm:gap-4 max-w-xl shadow-glass">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#8BF58D]/10 border border-[#8BF58D]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#8BF58D]" />
              </div>
              <p className="text-xs sm:text-sm text-[#F5F7F5] leading-relaxed">
                Метод Кёрнинга безопасен, прост в использовании и не требует установки дополнительного ПО.
              </p>
            </div>
          </div>

          {/* Right Column: 3D Translucent Glass Cube with glowing 'K' */}
          <div className="lg:col-span-5 relative flex items-center justify-center w-full px-2 sm:px-0">
            {/* Ambient green halo */}
            <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#8BF58D]/15 blur-[80px] pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] group"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.14] bg-[#12161B]/80 shadow-2xl backdrop-blur-2xl">
                <img 
                  src="/assets/about-cube-k.jpg" 
                  alt="3D Glass Cube with glowing K"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Overlay card details */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#080B0D]/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8BF58D] animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-mono text-[#8BF58D]">Kerning Protocol v1.4</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-[#92999F]">Zero-Trace</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Detailed Sections: Principles, Capabilities, Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 pt-6 border-t border-white/[0.08]">
          
          {/* Card 1: Назначение и принцип */}
          <div className="glass-card rounded-xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#101418] border border-white/10 flex items-center justify-center text-[#8BF58D]">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F7F5]">
              Принцип работы
            </h3>
            <p className="text-xs sm:text-sm text-[#92999F] leading-relaxed">
              В типографике кёрнинг регулирует расстояние между символами. В методе Kerning Stego интервалы модулируются бинарно: стандартный интервал кодирует бит «0», а расширенный — «1».
            </p>
            <div className="mt-auto pt-3 border-t border-white/[0.06] text-[11px] sm:text-xs text-[#8BF58D]">
              ✓ Не меняет семантику текста
            </div>
          </div>

          {/* Card 2: Преимущества метода */}
          <div className="glass-card rounded-xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#101418] border border-white/10 flex items-center justify-center text-[#8BF58D]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F7F5]">
              Ключевые преимущества
            </h3>
            <ul className="text-xs sm:text-sm text-[#92999F] space-y-2 leading-relaxed">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0" />
                <span>Человеческий глаз не замечает разницы</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0" />
                <span>Работает в браузерах и мессенджерах</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8BF58D] flex-shrink-0" />
                <span>Контрольная сумма CRC16 исключает шум</span>
              </li>
            </ul>
            <div className="mt-auto pt-3 border-t border-white/[0.06] text-[11px] sm:text-xs text-[#8BF58D]">
              ✓ Мгновенная клиентская обработка
            </div>
          </div>

          {/* Card 3: Ограничения метода */}
          <div className="glass-card rounded-xl sm:rounded-3xl p-4 sm:p-7 flex flex-col gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#101418] border border-white/10 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F5F7F5]">
              Ограничения метода
            </h3>
            <p className="text-xs sm:text-sm text-[#92999F] leading-relaxed">
              Стеганография скрывает факт передачи, но не является шифрованием. Агрессивные системы фильтрации контента без поддержки Unicode могут стирать маркеры.
            </p>
            <div className="mt-auto pt-3 border-t border-white/[0.06] text-[11px] sm:text-xs text-amber-300">
              ⚠ Для секретных данных рекомендуется предшифрование
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
