import React from 'react';
import { ArrowRight, Play, Lock, Zap, Shield, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  isDarkTheme?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, isDarkTheme = true }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between py-4 sm:py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Hero Section: Left Text + Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center pt-1 sm:pt-4 lg:pt-8">
          
          {/* Left Hero Column */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start z-10 text-left"
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#F5F7F5] tracking-tight leading-[1.12] mb-3 sm:mb-6">
              Скрывайте <br />
              сообщения <br />
              <span className="text-[#8BF58D] inline-block drop-shadow-[0_0_25px_rgba(139,245,141,0.25)]">
                невидимым способом
              </span>
            </h1>

            {/* Mobile-optimized description: concise on mobile, detailed on desktop */}
            <p className="text-[#92999F] text-xs sm:text-lg max-w-xl leading-relaxed mb-5 sm:mb-10">
              <span className="hidden sm:inline">
                Метод Кёрнинга позволяет передавать скрытый текст, изменяя расстояние между
                символами в тексте, незаметно для глаз.
              </span>
              <span className="sm:hidden">
                Передавайте тайные сообщения через незаметные микроинтервалы между символами.
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full sm:w-auto mb-6 sm:mb-16">
              <button
                type="button"
                onClick={() => setActiveTab('tool')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,245,141,0.45)] transform active:scale-95 cursor-pointer"
              >
                <span>Попробовать онлайн</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-medium text-[#F5F7F5] bg-[#171C22]/80 backdrop-blur-md border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 cursor-pointer"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-current text-[#F5F7F5] ml-0.5" />
                </div>
                <span>Узнать больше</span>
              </button>
            </div>
          </motion.div>

          {/* Right Hero Column: 3D Typography Aa Kerning Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center w-full px-1 sm:px-0"
          >
            {/* Ambient Backlight */}
            <div className="absolute w-52 h-52 sm:w-96 sm:h-96 rounded-full bg-[#8BF58D]/15 blur-[80px] pointer-events-none" />

            {/* The Main 3D Aa Kerning Card */}
            <div className="relative group w-full max-w-[290px] sm:max-w-[380px]">
              
              <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-10 bg-gradient-to-br from-[#1C2229]/90 to-[#12161B]/95 border border-white/[0.14] shadow-2xl backdrop-blur-2xl transition-transform duration-500 overflow-hidden">
                
                {/* Theme-aware 3D Image if loaded, with beautiful typography layer */}
                <img 
                  src={isDarkTheme ? '/assets/hero-aa-card.jpg' : '/assets/hero-aa-card-light.jpg'}
                  alt="3D Kerning Card"
                  className="w-full h-auto object-cover rounded-xl mb-4 opacity-90 transition-opacity duration-300"
                  onError={(e) => {
                    // Fallback to CSS render if image is loading
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center py-2 sm:py-4">
                  
                  {/* Top row: Standard Aa */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="font-serif text-5xl sm:text-6xl font-bold tracking-normal text-[#F5F7F5] select-none">
                      A<span className="opacity-95">a</span>
                    </div>
                  </div>

                  {/* Kerning Spacing Divider */}
                  <div className="w-full flex items-center justify-center gap-2 sm:gap-4 my-1 opacity-60">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8BF58D]/40" />
                    <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-mono text-[#8BF58D]">kerning shift</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8BF58D]/40" />
                  </div>

                  {/* Bottom row: Kerning shifted Aa */}
                  <div className="relative text-center mt-4 sm:mt-5">
                    <div className="font-serif text-5xl sm:text-6xl font-bold text-[#F5F7F5] select-none flex items-center justify-center">
                      <span>A</span>
                      {/* Vertical green kerning laser calipers */}
                      <span className="relative mx-2 sm:mx-3 flex flex-col items-center justify-center">
                        <span className="w-[1.5px] h-10 sm:h-12 bg-[#8BF58D] shadow-[0_0_10px_#8BF58D]" />
                        <span className="absolute -top-1 w-2 sm:w-2.5 h-[1.5px] bg-[#8BF58D]" />
                        <span className="absolute -bottom-1 w-2 sm:w-2.5 h-[1.5px] bg-[#8BF58D]" />
                      </span>
                      <span>a</span>
                    </div>
                  </div>

                  {/* Micro label indicator */}
                  <div className="mt-5 sm:mt-6 px-3 py-0.5 sm:py-1 rounded-full bg-[#080B0D]/70 border border-[#8BF58D]/30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] animate-ping" />
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#8BF58D]">Δ +0.12em (Bit: 1)</span>
                  </div>

                </div>

                {/* Floating Glass Pill Tile: Eye-off icon */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute bottom-2 right-2 sm:-bottom-5 sm:-right-5 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#171C22]/90 backdrop-blur-xl border border-white/[0.16] shadow-xl flex items-center justify-center"
                >
                  <EyeOff className="w-4 h-4 sm:w-6 sm:h-6 text-[#8BF58D] drop-shadow-[0_0_8px_rgba(139,245,141,0.5)]" />
                </motion.div>

              </div>
            </div>

          </motion.div>
        </div>

        {/* Bottom Three Advantage Cards: Clean & Uncluttered on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6 mt-8 sm:mt-16 lg:mt-20">
          
          {/* Card 1: Полная невидимость */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 flex items-center gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Полная невидимость
              </div>
              <div className="hidden sm:block text-xs text-[#92999F] mt-0.5">
                Не отличимо от обычного текста
              </div>
            </div>
          </div>

          {/* Card 2: Быстро и просто */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 flex items-center gap-3 sm:gap-4 group">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Быстро и просто
              </div>
              <div className="hidden sm:block text-xs text-[#92999F] mt-0.5">
                Мгновенное кодирование в один клик
              </div>
            </div>
          </div>

          {/* Card 3: Работает в любом тексте */}
          <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 flex items-center gap-3 sm:gap-4 group sm:col-span-2 md:col-span-1">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Работает в любом тексте
              </div>
              <div className="hidden sm:block text-xs text-[#92999F] mt-0.5">
                Совместимо с мессенджерами и веб-страницами
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
