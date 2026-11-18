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
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `/${tab}`;
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

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
      isDarkTheme ? 'bg-[#080B0D] text-[#F5F7F5]' : 'bg-[#0E1317] text-[#F5F7F5]'
    }`}>
      {/* Background cyber streaks & glow */}
      <FloatingGlow />

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
              transition={{ duration: 0.25 }}
            >
              <HomePage setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'tool' && (
            <motion.div
              key="tool"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ToolPage />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AboutPage />
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <DocsPage />
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <FaqPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
