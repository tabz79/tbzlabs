import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Workflow, Layout, Target } from 'lucide-react';

export default function HowIWork() {
  const points = [
    {
      index: "01",
      icon: UserCheck,
      title: "Direct Builder Collaboration",
      subtitle: "Zero communication lag",
      description: "You work directly with Tabrez—the engineer designing and building your code. No sales reps, account managers, or junior hand-offs."
    },
    {
      index: "02",
      icon: Workflow,
      title: "Operational Workflow Focus",
      subtitle: "Solving real business bottlenecks",
      description: "We dive deep into your processes, spreadsheet patterns, and daily friction to build software that matches your specific business mechanics."
    },
    {
      index: "03",
      icon: Layout,
      title: "Product-Builder Mindset",
      subtitle: "Proprietary software standard",
      description: "Because we develop and run our own live software products, we treat client projects with the same high-touch testing, performance targets, and long-term maintainability."
    },
    {
      index: "04",
      icon: Target,
      title: "Selective Project Engagement",
      subtitle: "Undivided development focus",
      description: "We partner with only a few select businesses at a time, ensuring your system receives deep focus, fast turnaround, and thorough validation."
    }
  ];

  return (
    <section id="how-i-work" className="py-24 border-t border-zinc-900 bg-zinc-950/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-xl text-left mb-20">
          <div className="text-sm text-violet-400 font-mono uppercase tracking-widest mb-3">The Partnership</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            How I Work
          </h2>
          <p className="text-zinc-400 font-light mt-4 leading-relaxed">
            Eliminating agency bloat. A modern engineering approach centered on direct contact, product ownership, and solving real operational challenges.
          </p>
        </div>

        {/* Content List/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-6 p-6 rounded-2xl border border-zinc-900/60 hover:border-zinc-800 bg-zinc-950/20 text-left transition-colors duration-300"
              >
                {/* Index / Icon column */}
                <div className="flex flex-col items-center">
                  <span className="text-zinc-700 font-mono text-xs font-bold leading-none mb-3 select-none">{pt.index}</span>
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-violet-400" />
                  </div>
                </div>

                {/* Copy column */}
                <div>
                  <h3 className="text-lg font-semibold text-white tracking-wide">{pt.title}</h3>
                  <div className="text-xs text-zinc-500 font-mono mb-3 uppercase tracking-wide mt-0.5">{pt.subtitle}</div>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{pt.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
