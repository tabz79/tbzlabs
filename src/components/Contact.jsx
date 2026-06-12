import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

export default function Contact() {
  const emailHref = 'mailto:tabrez.ataher@gmail.com?subject=Enquiry%20about%20TBZ%20Labs';
  const whatsappHref = 'https://wa.me/919866962092?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20TBZ%20Labs.';

  return (
    <section id="contact" className="py-28 relative border-t border-zinc-900 bg-grid-pattern">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-left">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="text-sm text-violet-400 font-mono uppercase tracking-widest mb-3">Get in Touch</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Let's Build Something Useful
          </h2>
          <p className="text-zinc-400 font-light mt-4 max-w-lg mx-auto leading-relaxed text-center">
            Ready to design your next workflow, automate operational pipelines, or scale a product? Connect directly with Tabrez.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          
          {/* Email Card */}
          <motion.a
            href={emailHref}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 20px 30px -10px rgba(0,0,0,0.7), 0 0 25px 2px rgba(139, 92, 246, 0.08)",
              borderColor: "rgba(139, 92, 246, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-8 sm:p-10 rounded-3xl border border-zinc-900/90 bg-[#05050a]/80 backdrop-blur-md relative overflow-hidden group select-none flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-105 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-550 uppercase tracking-widest">Email Inquiry</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight leading-tight group-hover:text-violet-300 transition-colors">
                Send an Email
              </h3>
              <p className="text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                Draft a direct email to tabrez.ataher@gmail.com. Perfect for detailed project specs, requirements, or RFPs.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs font-mono text-zinc-450 border-t border-zinc-900/60 pt-4">
              <span className="text-zinc-500 font-semibold group-hover:text-violet-400 transition-colors">tabrez.ataher@gmail.com</span>
              <div className="flex items-center gap-1 text-violet-455 text-violet-400">
                <span>Direct Draft</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          {/* WhatsApp Card */}
          <motion.a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              boxShadow: "0 20px 30px -10px rgba(0,0,0,0.7), 0 0 25px 2px rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(16, 185, 129, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="p-8 sm:p-10 rounded-3xl border border-zinc-900/90 bg-[#05050a]/80 backdrop-blur-md relative overflow-hidden group select-none flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-550 uppercase tracking-widest">WhatsApp Message</span>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                Chat on WhatsApp
              </h3>
              <p className="text-sm text-zinc-400 mt-2 font-light leading-relaxed">
                Connect instantly on +91 98669 62092. Ideal for quick scope alignments, audio call schedules, or project updates.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs font-mono text-zinc-455 border-t border-zinc-900/60 pt-4">
              <span className="text-zinc-500 font-semibold group-hover:text-emerald-400 transition-colors">+91 98669 62092</span>
              <div className="flex items-center gap-1 text-emerald-455 text-emerald-400">
                <span>Start Chat</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>

        </div>

      </div>
    </section>
  );
}
