import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, ShoppingBag, GraduationCap, Utensils, 
  CheckCircle2, Clock, Globe, ArrowUpRight, Database, GitMerge
} from 'lucide-react';

// Static ESM imports for Vite to bundle correctly
import synosImg from '../assets/SynOS.png';
import slipkitImg from '../assets/slipkit-pos.png';
import restaurantImg from '../assets/restaurant-webapp.png';

export default function SystemsBuilt({ onExploreSynos, onContactClick }) {
  const [imgErrors, setImgErrors] = useState({
    synos: false,
    slipkit: false,
    restaurant: false
  });

  const handleImageError = (project) => {
    setImgErrors(prev => ({ ...prev, [project]: true }));
  };

  const systems = [
    {
      id: 'synos',
      title: 'SynOS',
      category: 'Healthcare Operations',
      status: 'In Development',
      badgeStatus: 'dev',
      description: 'Diagnostic laboratory management system designed to streamline patient registration, billing, sample collection, reporting, and operational workflows.',
      isFlagship: true,
      imageSrc: synosImg,
      frameType: 'desktop',
      fallbackColor: 'from-violet-500/10 to-indigo-500/5',
      accentColor: 'border-violet-500/30'
    },
    {
      id: 'slipkit',
      title: 'SlipKit POS',
      category: 'Retail Operations',
      status: 'Live',
      badgeStatus: 'live',
      description: 'Point-of-sale software built for retail businesses to manage sales, billing, inventory, and day-to-day operations.',
      isFlagship: false,
      imageSrc: slipkitImg,
      frameType: 'desktop',
      fallbackColor: 'from-emerald-500/10 to-teal-500/5',
      accentColor: 'border-emerald-500/30'
    },
    {
      id: 'restaurant',
      title: 'Restaurant Platform',
      category: 'Hospitality Operations',
      status: 'Client Project',
      badgeStatus: 'client',
      description: 'Restaurant management platform focused on customer experience and operational efficiency, built as a high-performance mobile web application.',
      isFlagship: false,
      imageSrc: restaurantImg,
      frameType: 'mobile',
      fallbackColor: 'from-cyan-500/10 to-blue-500/5',
      accentColor: 'border-cyan-500/30'
    },
    {
      id: 'eduassist',
      title: 'Edu-Assist',
      category: 'Education Operations',
      status: 'In Development',
      badgeStatus: 'dev',
      description: 'Educational ERP system designed to manage academic and administrative workflows.',
      isFlagship: false,
      imageSrc: null,
      frameType: 'schematic',
      fallbackColor: 'from-zinc-500/10 to-slate-500/5',
      accentColor: 'border-zinc-500/30'
    }
  ];

  return (
    <section id="systems" className="py-28 relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-xl text-left mb-20">
          <div className="text-sm text-violet-400 font-mono uppercase tracking-widest mb-3">Portfolio</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            See Our Work
          </h2>
          <p className="text-zinc-400 font-light mt-4 leading-relaxed">
            Real operational software platforms designed and engineered to run businesses, from diagnostic labs to retail terminals.
          </p>
        </div>

        {/* Grid Structure */}
        <div className="flex flex-col gap-16">
          
          {systems.map((project, idx) => {
            const isFlagship = project.isFlagship;
            const fallbackActive = project.imageSrc === null || imgErrors[project.id];
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-sm relative group overflow-hidden ${
                  isFlagship ? 'border-violet-500/20 ring-1 ring-violet-500/5' : ''
                }`}
              >
                
                {/* Visual Frame Container */}
                <div 
                  onClick={
                    project.id === 'synos' 
                      ? onExploreSynos 
                      : project.id === 'restaurant' 
                        ? () => window.open('https://miyabhai.in', '_blank') 
                        : undefined
                  }
                  className={`col-span-1 lg:col-span-7 w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-tr ${project.fallbackColor} border border-zinc-800/80 flex items-center justify-center relative shadow-2xl ${
                    idx % 2 === 1 ? 'lg:order-2' : ''
                  } ${(project.id === 'synos' || project.id === 'restaurant') ? 'cursor-pointer transition-all duration-300' : ''} ${
                    project.id === 'synos' ? 'hover:border-violet-500/50' : project.id === 'restaurant' ? 'hover:border-cyan-500/50' : ''
                  }`}
                >
                  
                  {/* Outer Grid lines */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

                  {/* Browser Shell Frame (Desktop Mode) */}
                  {project.frameType === 'desktop' && (
                    <div className="w-full h-full flex flex-col justify-end relative">
                      {/* Browser Header */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-950 border-b border-zinc-900 px-4 flex items-center justify-start gap-3 z-20">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-zinc-800" />
                          <span className="w-2 h-2 rounded-full bg-zinc-800" />
                          <span className="w-2 h-2 rounded-full bg-zinc-800" />
                        </div>
                      </div>
                      
                      {/* Desktop Image */}
                      {!fallbackActive ? (
                        <div className="w-full h-[calc(100%-32px)] bg-zinc-100 p-0.5 overflow-hidden">
                          <img
                            src={project.imageSrc}
                            alt={`${project.title} Screenshot`}
                            className="w-full h-full object-cover object-top brightness-90 hover:brightness-100 transition-all duration-500 ease-out group-hover:scale-[1.01]"
                            onError={() => handleImageError(project.id)}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-[calc(100%-32px)] p-6 flex flex-col justify-between overflow-hidden text-left bg-[#050507]">
                          {project.id === 'synos' && <SynOSVisual />}
                          {project.id === 'slipkit' && <SlipKitVisual />}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Smartphone Mobile Shell Frame (9:16 Aspect Mode) */}
                  {project.frameType === 'mobile' && (
                    <div className="h-[92%] aspect-[9/16] relative z-25 flex items-center justify-center">
                      <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-xl opacity-50 pointer-events-none" />
                      
                      <div className="w-full h-full rounded-[24px] border-[5px] border-zinc-850 bg-[#09090b] overflow-hidden relative shadow-2xl flex flex-col justify-end ring-1 ring-zinc-800">
                        {/* Speaker Notch */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center z-30">
                          <span className="w-1 h-1 rounded-full bg-zinc-950 mr-1" />
                          <span className="w-1.5 h-0.5 rounded-full bg-zinc-950" />
                        </div>

                        {/* Mobile Screen Screen */}
                        {!fallbackActive ? (
                          <div className="w-full h-full bg-zinc-50 overflow-hidden">
                            <img
                              src={project.imageSrc}
                              alt={`${project.title} Screenshot`}
                              className="w-full h-full object-cover object-top brightness-90 hover:brightness-100 transition-all duration-500 ease-out group-hover:scale-[1.02]"
                              onError={() => handleImageError(project.id)}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full p-4 flex flex-col justify-between overflow-hidden text-left bg-[#050507] pt-8">
                            <RestaurantVisual />
                          </div>
                        )}
                        
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-zinc-700 z-30" />
                      </div>
                    </div>
                  )}

                  {/* Schematic Canvas Layout */}
                  {project.frameType === 'schematic' && (
                    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden text-left bg-[#050507] border-t border-zinc-900">
                      <EduAssistVisual />
                    </div>
                  )}

                </div>

                {/* Project Details */}
                <div className={`col-span-1 lg:col-span-5 text-left flex flex-col justify-center ${
                  idx % 2 === 1 ? 'lg:order-1' : ''
                }`}>
                  
                  {/* Flagship Badge */}
                  {isFlagship && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400 w-fit mb-4 uppercase tracking-wider badge-glow">
                      <Activity className="w-3.5 h-3.5" />
                      Flagship Project
                    </span>
                  )}

                  {/* Title & Category */}
                  <div className="mb-2">
                    <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase">{project.category}</span>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-1">{project.title}</h3>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    {project.badgeStatus === 'live' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/30">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    )}
                    {project.badgeStatus === 'dev' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-400 px-2 py-0.5 rounded bg-violet-950/30 border border-violet-900/30">
                        <Clock className="w-3 h-3" /> In Development
                      </span>
                    )}
                    {project.badgeStatus === 'client' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-900/30">
                        <Globe className="w-3 h-3" /> Client Project
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-zinc-400 font-light leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Action Link */}
                  {project.id === 'synos' ? (
                    <motion.button
                      onClick={onExploreSynos}
                      animate={{
                        scale: [1, 1.025, 1],
                        boxShadow: [
                          "0 10px 20px -5px rgba(139, 92, 246, 0.4), 0 0 0 0 rgba(139, 92, 246, 0.4)",
                          "0 10px 20px -5px rgba(139, 92, 246, 0.4), 0 0 0 10px rgba(139, 92, 246, 0)",
                          "0 10px 20px -5px rgba(139, 92, 246, 0.4), 0 0 0 0 rgba(139, 92, 246, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-650 hover:bg-violet-600 text-sm font-bold text-white transition-all duration-300 border-none cursor-pointer mt-4 group/btn"
                    >
                      <span>Click to know more</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </motion.button>
                  ) : project.id === 'restaurant' ? (
                    <a
                      href="https://miyabhai.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-cyan-400 transition-colors group/link mt-2 cursor-pointer no-underline"
                    >
                      miyabhai.in
                      <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  ) : project.badgeStatus === 'live' ? (
                    <button
                      onClick={() => onContactClick(project.title)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-violet-400 transition-colors group/link mt-2 border-none bg-transparent cursor-pointer"
                    >
                      Request Demo 
                      <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </button>
                  ) : project.badgeStatus === 'dev' ? (
                    <span className="text-xs text-zinc-500 font-mono mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-violet-400" /> Under active development
                    </span>
                  ) : (
                    <button
                      onClick={() => onContactClick(project.title)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-violet-400 transition-colors group/link mt-2 border-none bg-transparent cursor-pointer"
                    >
                      Request Demo 
                      <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </button>
                  )}

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

/* --- Project-Specific Custom Mockup Visuals (CSS/SVG) --- */

// 1. SynOS Diagnostic Operations Visual
function SynOSVisual() {
  return (
    <div className="flex-1 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Diagnostic Pipeline</div>
          <div className="text-base font-bold text-white mt-0.5">Laboratory Console</div>
        </div>
        <span className="px-2 py-0.5 rounded bg-violet-600/10 border border-violet-500/20 text-[9px] font-mono text-violet-400">
          99.98% uptime
        </span>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        <div className="col-span-8 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="text-[9px] text-zinc-400 mb-2 font-mono flex items-center justify-between">
            <span>Recent Registers</span>
            <span className="text-violet-400">Live feed</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'SYN-042', name: 'John Doe', test: 'CBC Panel', status: 'Completed', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40' },
              { id: 'SYN-043', name: 'Jane Smith', test: 'Lipid Profile', status: 'Processing', color: 'text-violet-400 bg-violet-950/40 border-violet-900/40' },
              { id: 'SYN-044', name: 'Mike Ross', test: 'LFT Test', status: 'Pending', color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700/40' }
            ].map(row => (
              <div key={row.id} className="flex items-center justify-between p-1.5 rounded bg-zinc-950/50 border border-zinc-900 text-[9px]">
                <span className="font-mono text-zinc-500">{row.id}</span>
                <span className="text-zinc-200 font-medium">{row.name}</span>
                <span className="text-zinc-400">{row.test}</span>
                <span className={`px-1 rounded text-[8px] border ${row.color}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-2.5">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex-1 flex flex-col justify-between">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wide">Processed Today</span>
            <div className="text-xl font-bold text-white font-mono mt-1">1,492</div>
            <span className="text-[8px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              ↑ 12% vs yesterday
            </span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex-1 flex flex-col justify-between">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wide">Avg Turnaround</span>
            <div className="text-xl font-bold text-white font-mono mt-1">1.8h</div>
            <span className="text-[8px] text-violet-400 mt-1 flex items-center gap-1 font-mono">
              ★ Target met
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. SlipKit Retail Point-of-Sale Visual
function SlipKitVisual() {
  return (
    <div className="flex-1 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Register Terminal</div>
          <div className="text-base font-bold text-white mt-0.5">SlipKit POS</div>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-600/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
          Device connected
        </span>
      </div>

      <div className="grid grid-cols-12 gap-3 flex-1">
        <div className="col-span-7 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="text-[9px] text-zinc-400 pb-1.5 border-b border-zinc-800/80 font-mono">Current Sale</div>
          <div className="flex-1 py-2 space-y-1.5">
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-200">1x Wireless Mouse Black</span>
              <span className="font-mono text-zinc-400">$45.00</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-200">2x Mechanical Keyboard</span>
              <span className="font-mono text-zinc-400">$238.00</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-zinc-200">1x USB-C Cable 1.5m</span>
              <span className="font-mono text-zinc-400">$19.99</span>
            </div>
          </div>
          <div className="border-t border-zinc-800/80 pt-1.5 flex justify-between text-[10px] font-bold">
            <span className="text-zinc-400">Total Due</span>
            <span className="font-mono text-white">$302.99</span>
          </div>
        </div>

        <div className="col-span-5 grid grid-cols-3 gap-1.5">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(num => (
            <div key={num} className="rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-semibold hover:border-zinc-700 select-none py-1.5">
              {num}
            </div>
          ))}
          <div className="col-span-3 rounded bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center text-[10px] font-bold text-white py-2 shadow-lg shadow-emerald-500/10 cursor-pointer select-none">
            PAY NOW
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Restaurant Platform Kitchen Display Visual
function RestaurantVisual() {
  return (
    <div className="flex-1 flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] text-cyan-400 font-mono">Kitchen Dispatch Board</span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] space-y-1">
          <div className="text-zinc-400 font-mono">Table 4 • 4m ago</div>
          <div className="text-zinc-200 font-medium">1x Truffle Burger</div>
          <div className="text-zinc-200 font-medium">1x Double Fries</div>
          <div className="py-0.5 px-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit font-bold text-[7px] mt-1">
            PREPPING
          </div>
        </div>
        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] space-y-1">
          <div className="text-zinc-400 font-mono">Table 12 • 8m ago</div>
          <div className="text-zinc-200 font-medium">2x Ribeye Steak</div>
          <div className="py-0.5 px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit font-bold text-[7px] mt-1">
            READY
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Edu-Assist Interactive Database/Workflow Schematic
function EduAssistVisual() {
  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Academic & Admin Workflow</div>
          <div className="text-base font-bold text-white mt-0.5">Edu-Assist Core ERP Architecture</div>
        </div>
        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[9px] font-mono text-zinc-400 flex items-center gap-1">
          <GitMerge className="w-3 h-3 text-violet-400" /> relational database
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-1 z-10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 160">
          <path d="M200,80 L80,40" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" className="flow-line" />
          <path d="M200,80 L80,120" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" className="flow-line" />
          <path d="M200,80 L320,40" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" className="flow-line" />
          <path d="M200,80 L320,120" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" className="flow-line" />
        </svg>

        <div className="absolute w-24 h-24 rounded-full bg-violet-600/10 border border-violet-500/40 flex flex-col items-center justify-center z-15 backdrop-blur-md shadow-[0_0_25px_rgba(139,92,246,0.15)]">
          <Database className="w-6 h-6 text-violet-400" />
          <span className="text-[8px] text-zinc-300 font-bold uppercase tracking-wider mt-1 text-center">ERP Engine</span>
        </div>

        <div className="absolute top-2 left-6 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-medium text-zinc-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Students Registry
        </div>

        <div className="absolute bottom-2 left-6 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-medium text-zinc-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Grades Ledger
        </div>

        <div className="absolute top-2 right-6 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-medium text-zinc-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Academics Hub
        </div>

        <div className="absolute bottom-2 right-6 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-medium text-zinc-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Fee Platform
        </div>
      </div>
    </div>
  );
}
