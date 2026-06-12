import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, Activity, ShoppingBag, GraduationCap, Utensils, Zap 
} from 'lucide-react';

export default function WhatWeBuild() {
  const cards = [
    {
      icon: Server,
      title: "Operational Platforms",
      description: "Custom dashboards and central databases that connect distributed teams, automate legacy procedures, and serve as a business's single source of truth."
    },
    {
      icon: Activity,
      title: "Healthcare Systems",
      description: "Rigorous systems engineered for clinical diagnostic laboratory tracking, patient registrations, sample inventory, and secure reporting."
    },
    {
      icon: ShoppingBag,
      title: "Retail Software",
      description: "Point-of-sale terminals, product catalog synchronizers, digital billing pipelines, and printing protocols that run brick-and-mortar stores."
    },
    {
      icon: GraduationCap,
      title: "Education ERP",
      description: "Relational database platforms structured to manage academic rosters, class planning, student records, and administration workflows."
    },
    {
      icon: Utensils,
      title: "Hospitality Systems",
      description: "High-concurrency ordering gateways, kitchen display ticket flows, live table arrangement matrices, and dispatch dispatchers."
    },
    {
      icon: Zap,
      title: "Business Automation",
      description: "Background cron task runners, data synchronization jobs, and API connectors that link tools together and remove manual copy-paste errors."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="capabilities" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-xl text-left mb-16">
          <div className="text-sm text-violet-400 font-mono uppercase tracking-widest mb-3">Core Competencies</div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            What TBZ Labs Builds
          </h2>
          <p className="text-zinc-400 font-light mt-4 leading-relaxed">
            We focus exclusively on custom software that solves core business workflow challenges. No generic templates, just functional systems built to your operational specifications.
          </p>
        </div>

        {/* Capability Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className="p-8 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mb-6 group-hover:border-violet-500/30 group-hover:bg-violet-950/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-wide mb-3">{card.title}</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
