import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingGlow } from './components/FloatingGlow';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AboutPage } from './pages/AboutPage';
import { DocsPage } from './pages/DocsPage';
import { FaqPage } from './pages/FaqPage';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Lock, Info, BookOpen, HelpCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Sync tab with URL hash if provided
  const getInitialTab = (): string => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['home', 'tool', 'about', 'docs', 'faq'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);

  // Theme state persisted in localStorage
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light'; // default to true (dark mode matching reference)
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['home', 'tool', 'about', 'docs', 'faq'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update HTML class whenever theme changes
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Mobile Bottom Navigation items
  const bottomNavItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'tool', label: 'Инструмент', icon: Lock },
    { id: 'about', label: 'О проекте', icon: Info },
    { id: 'docs', label: 'Доки', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300 pb-20 md:pb-0">
      {/* Background cyber streaks & glow */}
      <FloatingGlow isDarkTheme={isDarkTheme} />

      {/* Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Pages with smooth fade transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage setActiveTab={setActiveTab} isDarkTheme={isDarkTheme} />
            </motion.div>
          )}

          {activeTab === 'tool' && (
            <motion.div
              key="tool"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ToolPage isDarkTheme={isDarkTheme} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AboutPage isDarkTheme={isDarkTheme} />
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DocsPage isDarkTheme={isDarkTheme} />
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <FaqPage isDarkTheme={isDarkTheme} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modern Mobile Floating Bottom Dock (Visible only on mobile < md) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-50 max-w-sm mx-auto">
        <div className="glass-card rounded-2xl p-1.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl border border-white/[0.12] dark:border-white/[0.12] bg-[#12161B]/90 dark:bg-[#12161B]/90 light:bg-white/95">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#8BF58D] font-bold bg-[#171C22] shadow-sm'
                    : 'text-[#92999F] hover:text-[#F5F7F5]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#8BF58D]' : 'opacity-70'}`} />
                <span className="text-[10px] leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
