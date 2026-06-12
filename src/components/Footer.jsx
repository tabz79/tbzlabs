import React from 'react';
import { Mail } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

export default function Footer() {
  const links = [
    { name: 'Home', href: '#' },
    { name: 'SynOS', href: '#/synos' },
    { name: 'See Our Work', href: '#systems' },
    { name: 'What We Build', href: '#capabilities' },
    { name: 'How I Work', href: '#how-i-work' },
    { name: 'About', href: '#about' },
  ];

  return (
    <footer className="border-t border-zinc-900 bg-[#020204] py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        
        {/* Left branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
          <a href="#" className="flex items-center group mb-3">
            <img 
              src={logoSvg} 
              alt="TBZ Labs" 
              className="h-10 w-auto opacity-70 group-hover:opacity-100 transition-all duration-300"
            />
          </a>
          <p className="text-sm text-zinc-500 leading-relaxed font-light mt-1">
            Building Software that runs Businesses.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Social Link Handles */}
        <div className="flex items-center gap-4">
          {/* GitHub Inline SVG */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
          </a>

          {/* LinkedIn Inline SVG */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
          </a>

          {/* Email Link */}
          <a
            href="mailto:contact@tbzlabs.com"
            aria-label="Email Studio"
            className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        </div>

      </div>

      {/* Copyright Subbar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-mono">
        <span>&copy; {new Date().getFullYear()} TBZ Labs. All rights reserved.</span>
        <span className="text-zinc-600">Designed and built by Tabrez.</span>
      </div>
    </footer>
  );
}
