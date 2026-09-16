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
import CloudPortal from './components/CloudPortal';
import ContactOptionsModal from './components/ContactOptionsModal';
import FAQ from './components/FAQ';
import { Analytics } from '@vercel/analytics/react';

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
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/synos' || path === '/synos/' || hash === '#/synos' || hash === '#synos') {
        setCurrentView('synos');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/cloud' || path === '/cloud/' || path === '/controltower' || path === '/controltower/' || hash === '#/cloud' || hash === '#cloud') {
        setCurrentView('cloud');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentView('home');
        // Handle legacy hash scroll on direct landing
        if (hash) {
          const id = hash.replace('#', '');
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Run on initial load
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    const cleanPath = currentView === 'synos' ? '/synos' : (currentView === 'cloud' ? '/cloud' : '/');
    const cleanUrl = window.location.origin + cleanPath;
    canonicalLink.setAttribute('href', cleanUrl);
  }, [currentView]);

  const handleNavigate = (target) => {
    if (target === '/synos' || target === 'synos') {
      window.history.pushState({}, '', '/synos');
      setCurrentView('synos');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (target === '/cloud' || target === 'cloud' || target === 'controltower') {
      window.history.pushState({}, '', '/cloud');
      setCurrentView('cloud');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (target === '/' || target === 'home' || target === '') {
      window.history.pushState({}, '', '/');
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sectionId = target.replace('#', '').replace('/', '');
      if (currentView !== 'home') {
        window.history.pushState({}, '', '/');
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navigateToSynos = () => {
    handleNavigate('/synos');
  };

  const navigateToHome = (hash = 'systems') => {
    handleNavigate(hash);
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
            <Navbar currentView={currentView} onNavigate={handleNavigate} onContactClick={() => handleOpenContact('general')} />
            <main className="flex-1">
              <Hero onNavigate={handleNavigate} onContactClick={() => handleOpenContact('general')} />
              <SystemsBuilt onExploreSynos={navigateToSynos} onContactClick={(projName) => handleOpenContact('project', projName)} />
              <AboutStudio />
              <WhatWeBuild />
              <HowIWork />
              <Contact />
              <FAQ />
            </main>
            <Footer onNavigate={handleNavigate} />
          </motion.div>
        ) : currentView === 'synos' ? (
          <motion.div
            key="synos-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col justify-between"
          >
            <SynosPage onBack={() => navigateToHome('systems')} onContactClick={() => handleOpenContact('synos')} />
          </motion.div>
        ) : (
          <motion.div
            key="cloud-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col justify-between"
          >
            <CloudPortal onBack={() => navigateToHome('home')} />
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
      <Analytics />
    </div>
  );
}

export default App;
