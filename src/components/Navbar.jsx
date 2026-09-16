import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageSquare, Cloud } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function Navbar({ onContactClick, currentView, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SynOS', href: '/synos', target: 'synos' },
    { name: 'TBZ Cloud', href: '/cloud', target: 'cloud', badge: 'New' },
    { name: 'See Our Work', href: '/#systems', target: 'systems' },
    { name: 'What We Build', href: '/#capabilities', target: 'capabilities' },
    { name: 'How I Work', href: '/#how-i-work', target: 'how-i-work' },
    { name: 'About', href: '/#about', target: 'about' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    onNavigate?.(link.target);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#030303]/80 backdrop-blur-md border-b border-white/5 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.('home');
          }}
          className="flex items-center group"
        >
          <img 
            src={logoSvg} 
            alt="TBZ Labs" 
            className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
            >
              {link.name}
              {link.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('cloud')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5 text-violet-400" />
            Control Tower
          </button>
          <button
            onClick={onContactClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-white hover:bg-zinc-850 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-violet-400" />
            Let's Talk
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#030303]/95 border-b border-zinc-800"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, link);
                  }}
                  className="text-lg text-zinc-400 hover:text-white transition-colors duration-200 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate?.('cloud');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-850 transition-colors cursor-pointer"
                >
                  <Cloud className="w-4 h-4 text-violet-400" />
                  Control Tower
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onContactClick();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors cursor-pointer border-none"
                >
                  Let's Talk
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
