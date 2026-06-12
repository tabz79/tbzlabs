import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, X } from 'lucide-react';

export default function ContactOptionsModal({ isOpen, onClose, context = 'general', projectName = '' }) {
  // Determine text based on context
  let subject = 'Enquiry about TBZ Labs';
  let waText = 'Hi, I would like to enquire about TBZ Labs.';
  let title = 'Let\'s Connect';
  let subtitle = 'Choose your preferred channel to start a conversation with Tabrez.';

  if (context === 'synos') {
    subject = 'Enquiry about SynOS';
    waText = 'Hi, I would like to enquire about SynOS.';
    title = 'Book SynOS Demo';
    subtitle = 'Request a direct walkthrough or ask questions about the Diagnostic Operating System.';
  } else if (context === 'project' && projectName) {
    subject = `Enquiry about ${projectName}`;
    waText = `Hi, I would like to enquire about ${projectName}.`;
    title = `Request Demo for ${projectName}`;
    subtitle = `Learn more about the architecture and performance metrics of ${projectName}.`;
  }

  const emailHref = `mailto:tabrez.ataher@gmail.com?subject=${encodeURIComponent(subject)}`;
  const whatsappHref = `https://wa.me/919866962092?text=${encodeURIComponent(waText)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="w-full max-w-md bg-zinc-950/95 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl z-10"
          >
            {/* Ambient glows inside modal */}
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 rounded-xl border border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-left mb-8 pr-8">
              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Email Button */}
              <a
                href={emailHref}
                onClick={onClose}
                className="group flex items-center gap-5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-violet-500/30 hover:bg-[#0c0a18]/70 transition-all duration-300 select-none cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-105 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    Send an Email
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">
                    tabrez.ataher@gmail.com
                  </div>
                </div>
              </a>

              {/* WhatsApp Button */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group flex items-center gap-5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-emerald-500/30 hover:bg-[#06120e]/70 transition-all duration-300 select-none cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Chat on WhatsApp
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">
                    +91 98669 62092
                  </div>
                </div>
              </a>
            </div>

            {/* Bottom Note */}
            <div className="text-[10px] text-zinc-650 font-mono text-center mt-6">
              Instant routing • Active response within 24 hours
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
