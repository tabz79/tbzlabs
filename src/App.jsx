import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutStudio from './components/AboutStudio';
import SystemsBuilt from './components/SystemsBuilt';
import WhatWeBuild from './components/WhatWeBuild';
import HowIWork from './components/HowIWork';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SynosPage from './components/SynosPage';
import ContactOptionsModal from './components/ContactOptionsModal';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [contactModal, setContactModal] = useState({ isOpen: false, context: 'general', projectName: '' });

  const handleOpenContact = (context = 'general', projectName = '') => {
    setContactModal({ isOpen: true, context, projectName });
  };

  const handleCloseContact = () => {
    setContactModal(prev => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/synos' || path === '/synos' || path === '/synos/') {
        setCurrentView('synos');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
      }
    };

    // Run on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    // Also listen to popstate if pushState is used
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateToSynos = () => {
    // Set hash for simple SPA navigation
    window.location.hash = '#/synos';
  };

  const navigateToHome = (hash = '#systems') => {
    // If we have a pathname of /synos, clear it to prevent sticking
    if (window.location.pathname === '/synos' || window.location.pathname === '/synos/') {
      window.history.pushState({}, '', '/' + hash);
      // Trigger update manually
      setCurrentView('home');
      // Scroll to hash target
      setTimeout(() => {
        const id = hash.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.location.hash = hash;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 flex flex-col justify-between overflow-x-hidden">
      {/* Glow ambient lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col justify-between"
          >
            <Navbar onContactClick={() => handleOpenContact('general')} />
            <main className="flex-1">
              <Hero onContactClick={() => handleOpenContact('general')} />
              <AboutStudio />
              <SystemsBuilt onExploreSynos={navigateToSynos} onContactClick={(projName) => handleOpenContact('project', projName)} />
              <WhatWeBuild />
              <HowIWork />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        ) : (
          <motion.div
            key="synos-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col justify-between"
          >
            <SynosPage onBack={() => navigateToHome('#systems')} onContactClick={() => handleOpenContact('synos')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Contact Options modal */}
      <ContactOptionsModal
        isOpen={contactModal.isOpen}
        onClose={handleCloseContact}
        context={contactModal.context}
        projectName={contactModal.projectName}
      />
    </div>
  );
}

export default App;

