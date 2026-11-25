import React, { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'tool', label: 'Инструмент' },
    { id: 'docs', label: 'Документация' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B0D]/85 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]'
          : 'bg-[#080B0D]/60'
      } border-b border-white/[0.08]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#1C2229] to-[#12161B] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-[#8BF58D]/50 group-hover:shadow-[0_0_18px_rgba(139,245,141,0.25)]">
            <span className="font-display text-sm sm:text-base text-[#8BF58D] leading-none pt-0.5">
              K
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm sm:text-base text-[#F5F7F5] group-hover:text-white transition-colors">
              Kerning Stego
            </span>
            <span className="hidden sm:block text-[9px] uppercase tracking-[0.22em] text-[#62686F] mt-1">
              типографика · биты
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((navItem) => {
            const isActive = activeTab === navItem.id;
            return (
              <button
                key={navItem.id}
                onClick={() => handleNavClick(navItem.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-[#F5F7F5]' : 'text-[#92999F] hover:text-[#F5F7F5]'
                }`}
              >
                {navItem.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[#8BF58D] shadow-[0_0_10px_#8BF58D]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('tool')}
            className="btn-shine flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] hover:shadow-[0_0_22px_rgba(139,245,141,0.4)] transition-all transform active:scale-95 cursor-pointer"
          >
            <span>Начать</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F5F7F5] hover:text-[#8BF58D]"
            aria-label="Меню навигации"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-b border-white/10 bg-[#080B0D]/98 backdrop-blur-2xl px-4 py-4 flex flex-col gap-2"
        >
          {navItems.map((navItem) => (
            <button
              key={navItem.id}
              onClick={() => handleNavClick(navItem.id)}
              className={`flex items-center justify-between text-left py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === navItem.id
                  ? 'bg-[#171C22] text-[#8BF58D] font-semibold border border-white/10'
                  : 'text-[#92999F] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{navItem.label}</span>
              {activeTab === navItem.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#8BF58D] shadow-[0_0_6px_#8BF58D]" />
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-white/10 mt-1">
            <button
              onClick={() => handleNavClick('tool')}
              className="w-full py-3 rounded-xl bg-[#8BF58D] text-[#080B0D] font-bold text-center flex items-center justify-center gap-2 shadow-glow-sm"
            >
              <span>Открыть инструмент</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};
