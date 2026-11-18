import React, { useState } from 'react';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkTheme?: boolean;
  toggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkTheme = true,
  toggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'tool', label: 'Инструмент' },
    { id: 'about', label: 'О проекте' },
    { id: 'docs', label: 'Документация' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080B0D]/80 border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#171C22] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-[#8BF58D]/50 group-hover:shadow-glow-sm">
            <span className="font-extrabold text-lg text-[#8BF58D] tracking-tighter">K</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#F5F7F5] group-hover:text-white transition-colors">
            Kerning Stego
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#F5F7F5]'
                    : 'text-[#92999F] hover:text-[#F5F7F5]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#8BF58D] rounded-full shadow-[0_0_8px_#8BF58D]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle (Decorative/Interactive) */}
          <button
            onClick={toggleTheme}
            aria-label="Сменить тему оформления"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#92999F] hover:text-[#F5F7F5] hover:bg-white/[0.05] transition-all"
            title="Тема оформления"
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-[#92999F] hover:text-[#8BF58D] transition-colors" /> : <Moon className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Primary CTA button matching reference */}
          <button
            onClick={() => handleNavClick('tool')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#8BF58D] text-[#080B0D] hover:bg-[#A4FBA6] hover:shadow-[0_0_20px_rgba(139,245,141,0.4)] transition-all transform active:scale-95"
          >
            <span>Начать</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#92999F]"
          >
            {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F5F7F5] hover:text-[#8BF58D]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080B0D]/95 backdrop-blur-2xl px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-base font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-[#171C22] text-[#8BF58D]'
                  : 'text-[#92999F] hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-[#8BF58D]" />}
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
        </div>
      )}
    </header>
  );
};
