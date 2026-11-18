import React from 'react';
import { ArrowRight, Play, Lock, Zap, Shield, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Hero Section: Left Text + Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 lg:pt-8">
          
          {/* Left Hero Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#F5F7F5] tracking-tight leading-[1.08] mb-6">
              Скрывайте <br />
              сообщения <br />
              <span className="text-[#8BF58D] inline-block drop-shadow-[0_0_25px_rgba(139,245,141,0.25)]">
                невидимым способом
              </span>
            </h1>

            <p className="text-[#92999F] text-base sm:text-lg max-w-xl leading-relaxed mb-10">
              Метод Кёрнинга позволяет передавать скрытый текст, изменяя расстояние между
              символами в тексте, незаметно для глаз.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-16 sm:mb-20">
              <button
                onClick={() => setActiveTab('tool')}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,245,141,0.45)] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Попробовать онлайн</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-medium text-[#F5F7F5] bg-[#171C22]/80 backdrop-blur-md border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current text-[#F5F7F5] ml-0.5" />
                </div>
                <span>Узнать больше</span>
              </button>
            </div>
          </motion.div>

          {/* Right Hero Column: 3D Typography Aa Kerning Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient Backlight for 3D card */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#8BF58D]/15 blur-[90px] pointer-events-none" />

            {/* The Main 3D Aa Kerning Card */}
            <div className="relative group perspective-[1000px] w-full max-w-[380px]">
              
              {/* Fallback & Enhanced Render Container */}
              <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#1C2229]/90 to-[#12161B]/95 border border-white/[0.14] shadow-2xl backdrop-blur-2xl transition-transform duration-500 group-hover:rotate-y-[-4deg] group-hover:rotate-x-[4deg]">
                
                {/* Image asset if available, else high-fidelity interactive 3D visual */}
                <div className="relative z-10 flex flex-col items-center justify-center py-6">
                  
                  {/* Top row: Standard Aa */}
                  <div className="text-center mb-8">
                    <div className="font-serif text-6xl sm:text-7xl font-bold tracking-normal text-[#F5F7F5] select-none">
                      A<span className="opacity-95">a</span>
                    </div>
                  </div>

                  {/* Kerning Spacing Divider with measurement lines */}
                  <div className="w-full flex items-center justify-center gap-4 my-2 opacity-60">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8BF58D]/40" />
                    <span className="text-[10px] tracking-widest uppercase font-mono text-[#8BF58D]">kerning shift</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8BF58D]/40" />
                  </div>

                  {/* Bottom row: Kerning shifted Aa with glowing green vertical measurement lines */}
                  <div className="relative text-center mt-6">
                    <div className="font-serif text-6xl sm:text-7xl font-bold text-[#F5F7F5] select-none flex items-center justify-center">
                      <span>A</span>
                      {/* Vertical green kerning laser calipers */}
                      <span className="relative mx-3.5 flex flex-col items-center justify-center">
                        <span className="w-[1.5px] h-14 bg-[#8BF58D] shadow-[0_0_10px_#8BF58D]" />
                        <span className="absolute -top-1 w-2.5 h-[1.5px] bg-[#8BF58D]" />
                        <span className="absolute -bottom-1 w-2.5 h-[1.5px] bg-[#8BF58D]" />
                      </span>
                      <span>a</span>
                    </div>
                  </div>

                  {/* Micro label indicator */}
                  <div className="mt-8 px-3 py-1 rounded-full bg-[#080B0D]/70 border border-[#8BF58D]/30 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] animate-ping" />
                    <span className="text-[11px] font-mono text-[#8BF58D]">Δ +0.12em (Bit: 1)</span>
                  </div>

                </div>

                {/* Floating Glass Pill Tile: Eye-off icon (matching bottom-right on reference) */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 w-14 h-14 rounded-2xl bg-[#171C22]/90 backdrop-blur-xl border border-white/[0.16] shadow-xl flex items-center justify-center"
                >
                  <EyeOff className="w-6 h-6 text-[#8BF58D] drop-shadow-[0_0_8px_rgba(139,245,141,0.5)]" />
                </motion.div>

              </div>
            </div>

          </motion.div>
        </div>

        {/* Bottom Three Advantage Cards: matching reference exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-14 sm:mt-20">
          
          {/* Card 1: Полная невидимость */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Lock className="w-5 h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Полная невидимость
              </div>
              <div className="text-xs text-[#92999F] mt-0.5">
                Не отличимо от обычного текста
              </div>
            </div>
          </div>

          {/* Card 2: Быстро и просто */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Zap className="w-5 h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Быстро и просто
              </div>
              <div className="text-xs text-[#92999F] mt-0.5">
                Мгновенное кодирование в один клик
              </div>
            </div>
          </div>

          {/* Card 3: Работает в любом тексте */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-[#12161B] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-[#8BF58D]/30 group-hover:shadow-[0_0_15px_rgba(139,245,141,0.15)] transition-all">
              <Shield className="w-5 h-5 text-[#8BF58D]" />
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
                Работает в любом тексте
              </div>
              <div className="text-xs text-[#92999F] mt-0.5">
                Совместимо с мессенджерами и веб-страницами
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
