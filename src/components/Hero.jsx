import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Server, Smartphone, Laptop, Database, 
  Cpu, Activity, Zap, CheckCircle2
} from 'lucide-react';

export default function Hero({ onContactClick, onNavigate }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const capabilities = [
    {
      id: 'web',
      icon: Laptop,
      title: "Full Stack Web Apps",
      description: "Custom SaaS dashboards, administrative portals, and client-facing web systems designed to consolidate operations.",
      badge: "SaaS & Portals",
      accent: "group-hover:border-violet-500/30",
      visual: <WebAppsVisual />
    },
    {
      id: 'mobile',
      icon: Smartphone,
      title: "Mobile Applications",
      description: "Native & cross-platform iOS and Android apps engineered for operational workflows, offline usage, and smooth client UX.",
      badge: "iOS & Android",
      accent: "group-hover:border-cyan-500/30",
      visual: <MobileAppsVisual />
    },
    {
      id: 'custom',
      icon: Database,
      title: "Custom Business Software",
      description: "Bespoke point-of-sale clients, diagnostic lab pipelines, and relational ERP systems engineered around your specific rules.",
      badge: "ERP & POS Systems",
      accent: "group-hover:border-emerald-500/30",
      visual: <BusinessSoftwareVisual />
    },
    {
      id: 'automation',
      icon: Zap,
      title: "Workflow Automations",
      description: "Background synchronization scripts, custom API pipes, and automated message triggers that connect disconnected tools.",
      badge: "APIs & Sync Engines",
      accent: "group-hover:border-indigo-500/30",
      visual: <AutomationsVisual />
    }
  ];

  return (
    <section className="relative min-h-screen pt-36 pb-20 flex flex-col justify-center overflow-hidden bg-grid-pattern">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Container aligned to full 7xl navigation grid */}
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
        
        {/* Centered Hero Header */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-3xl mb-16"
        >
          {/* Accent Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-violet-400 mb-6 tracking-wide uppercase"
          >
            <Server className="w-3.5 h-3.5" />
            Independent Software Studio
          </motion.div>

          {/* Centered Headline */}
          <motion.h1 
            variants={itemVariants}
            className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.05] mb-6"
          >
            Building Software <br />
            that <span className="text-violet-400 font-semibold">runs</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-100 to-white">Businesses.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light"
          >
            TBZ Labs designs and builds operational software that solves real-world workflow challenges across healthcare, retail, education, and hospitality.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet-500/20 text-sm font-semibold border-none cursor-pointer"
            >
              Let's Talk
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <a
              href="/#systems"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.('systems');
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-350 hover:text-white transition-all text-sm font-semibold cursor-pointer"
            >
              See Our Work
            </a>
          </motion.div>
        </motion.div>

        {/* Full-Width Showcase Grid (4 columns, edge-to-edge width matching navigation bar) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mt-4"
        >
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div 
                key={cap.id}
                className={`p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[360px] relative overflow-hidden group border-white/5 hover:bg-zinc-900/30 transition-all duration-500 ease-out ${cap.accent}`}
              >
                {/* Dot background layer */}
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
                
                {/* Top header details */}
                <div className="z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{cap.badge}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-white tracking-tight">{cap.title}</h3>
                  <p className="text-xs text-zinc-500 mt-2 font-light leading-relaxed">{cap.description}</p>
                </div>

                {/* Animated Mockup Panel */}
                <div className="mt-6 w-full relative z-10">
                  {cap.visual}
                </div>

              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

/* --- Core Offerings Custom Visual Mockups (CSS/SVG) --- */

// 1. Full Stack Web Dashboard visual
function WebAppsVisual() {
  return (
    <div className="w-full aspect-[16/10] bg-zinc-950/80 border border-zinc-900/80 rounded-xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
      <div className="flex justify-between items-center text-[8px] border-b border-zinc-900 pb-1.5">
        <span className="text-zinc-500 font-mono">Operations Portal</span>
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
      </div>
      
      {/* Mini Chart */}
      <div className="h-14 flex items-end gap-1 px-1 my-2">
        {[40, 65, 35, 80, 50, 95, 75].map((val, idx) => (
          <div key={idx} className="flex-1 bg-zinc-900 rounded-t overflow-hidden relative h-full">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: 0.5 + idx * 0.05, duration: 0.8, ease: 'easeOut' }}
              className="w-full bg-gradient-to-t from-violet-600 to-violet-400 absolute bottom-0 rounded-t"
            />
          </div>
        ))}
      </div>

      <div className="text-[8px] text-zinc-500 font-mono flex justify-between">
        <span>Active user throughput</span>
        <span className="font-bold text-zinc-300">Live stats</span>
      </div>
    </div>
  );
}

// 2. Mobile Device Mockup visual
function MobileAppsVisual() {
  return (
    <div className="h-28 w-full flex items-center justify-center relative">
      {/* Smartphone frame */}
      <div className="h-full aspect-[9/16] rounded-xl border-2 border-zinc-850 bg-zinc-950 p-1.5 flex flex-col justify-between relative shadow-lg">
        {/* Notch */}
        <div className="w-8 h-1.5 rounded-full bg-zinc-900 absolute top-1 left-1/2 -translate-x-1/2" />
        
        {/* Ticket / Order details mock */}
        <div className="flex-1 flex flex-col justify-center gap-1 mt-2">
          <div className="h-4 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-between px-1.5 text-[6.5px] leading-none whitespace-nowrap">
            <span className="text-zinc-400">#4829</span>
            <span className="text-cyan-400 font-bold">45.00</span>
          </div>
          <div className="h-4 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-between px-1.5 text-[6.5px] leading-none whitespace-nowrap">
            <span className="text-zinc-400">SYN-042</span>
            <span className="text-violet-400 font-bold">Done</span>
          </div>
          <div className="h-4 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-between px-1.5 text-[6.5px] leading-none whitespace-nowrap">
            <span className="text-zinc-400">Table 4</span>
            <span className="text-emerald-400 font-bold">12:30</span>
          </div>
        </div>

        {/* Home bar */}
        <div className="w-6 h-0.5 rounded-full bg-zinc-800 mx-auto" />
      </div>
    </div>
  );
}

// 3. Custom Business Software / ERP Pipeline visual
function BusinessSoftwareVisual() {
  return (
    <div className="w-full aspect-[16/10] bg-zinc-950/80 border border-zinc-900/80 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
      <div className="text-[8px] text-zinc-500 font-mono pb-1 border-b border-zinc-900 flex justify-between">
        <span>Relational Database</span>
        <span>ERP Sync</span>
      </div>

      <div className="flex-1 flex items-center justify-around relative my-1">
        {/* Animated flow connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 40">
          <path d="M15,20 L50,10 M15,20 L50,30 M50,10 L85,20 M50,30 L85,20" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
          <circle cx="50" cy="20" r="1.5" fill="#10b981" className="flow-line" />
        </svg>

        {/* Left: Input */}
        <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center shadow-sm">
          <Database className="w-3.5 h-3.5 text-zinc-500" />
        </div>

        {/* Center Nodes */}
        <div className="flex flex-col gap-2 z-10">
          <div className="px-1 py-0.5 rounded bg-zinc-900 border border-emerald-500/30 text-[6px] font-mono text-emerald-400">Registrar</div>
          <div className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[6px] font-mono text-zinc-550">Billing</div>
        </div>

        {/* Right: Output */}
        <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      <div className="text-[7px] text-zinc-550 text-center font-mono leading-none">
        Active ledger transactions
      </div>
    </div>
  );
}

// 4. API Automations / Cogs visual
function AutomationsVisual() {
  return (
    <div className="w-full aspect-[16/10] bg-zinc-950/80 border border-zinc-900/80 rounded-xl p-3 flex items-center justify-center overflow-hidden">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Spinning cogs / rings */}
        <div className="absolute inset-0 rounded-full border border-zinc-900 border-t-indigo-500 animate-[spin_6s_linear_infinite]" />
        <div className="absolute inset-2 rounded-full border border-zinc-900 border-b-cyan-500 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Central sync node */}
        <div className="w-6 h-6 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center z-10">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        {/* Orbit indicators */}
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
      </div>
      
      {/* Side integration list */}
      <div className="ml-4 flex flex-col gap-1 text-[7px] font-mono text-zinc-500 text-left border-l border-zinc-900 pl-3">
        <span className="text-zinc-400">► Stripe Gateway</span>
        <span>► Twilio API Sync</span>
        <span>► SMTP Mailer</span>
      </div>
    </div>
  );
}
