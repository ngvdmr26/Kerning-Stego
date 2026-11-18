import React from 'react';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#080B0D] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#171C22] border border-white/10 flex items-center justify-center">
              <span className="font-extrabold text-sm text-[#8BF58D]">K</span>
            </div>
            <span className="font-bold text-base tracking-tight text-[#F5F7F5]">
              Kerning Stego
            </span>
          </div>
          <p className="text-xs text-[#92999F] max-w-sm">
            Инновационная веб-стеганография на основе микроизменений межбуквенных интервалов.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#92999F]">
          <button 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#F5F7F5] transition-colors"
          >
            Главная
          </button>
          <button 
            onClick={() => { setActiveTab('tool'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#F5F7F5] transition-colors"
          >
            Инструмент
          </button>
          <button 
            onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#F5F7F5] transition-colors"
          >
            О проекте
          </button>
          <button 
            onClick={() => { setActiveTab('docs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#F5F7F5] transition-colors"
          >
            Документация
          </button>
          <button 
            onClick={() => { setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="hover:text-[#F5F7F5] transition-colors"
          >
            FAQ
          </button>
        </div>

        {/* Status / Tag */}
        <div className="flex items-center gap-2 text-xs text-[#92999F] bg-[#171C22] px-3.5 py-1.5 rounded-full border border-white/[0.08]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8BF58D]" />
          <span>Клиентская обработка 100% офлайн</span>
          <ArrowUpRight className="w-3 h-3 text-[#62686F]" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.04] text-center text-[11px] text-[#62686F]">
        © 2026 Kerning Stego. Безопасность и типографическая стеганография.
      </div>
    </footer>
  );
};
