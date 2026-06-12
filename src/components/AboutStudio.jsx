import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Award, Settings2 } from 'lucide-react';

export default function AboutStudio() {
  const features = [
    {
      icon: Terminal,
      title: "Founder-Led",
      description: "Collaborate directly with the engineer building your platform. No account managers, translation layers, or miscommunications."
    },
    {
      icon: Settings2,
      title: "Product Mindset",
      description: "We bring the same product-first standards, testing rigors, and design standards to client projects as we do to our own proprietary products."
    }
  ];

  return (
    <section id="about" className="py-24 border-y border-zinc-900 bg-zinc-950/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Text Content (5 cols) */}
          <div className="lg:col-span-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
              <Code className="w-5 h-5 text-violet-400" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-6 leading-tight">
              An independent software studio.
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-6">
              TBZ Labs is founded and operated by Tabrez. The studio designs and builds high-performance operational systems that run business operations day-to-day.
            </p>
            <p className="text-zinc-400 font-light leading-relaxed">
              We focus on replacing fragmented processes, spreadsheet pile-ups, and legacy clunkiness with elegant, modern, custom platforms engineered to last.
            </p>
          </div>

          {/* Cards/Features Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-violet-600/20 transition-colors">
                      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 tracking-wide">{feat.title}</h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">{feat.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Quote/Highlight Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sm:col-span-2 p-8 rounded-2xl bg-gradient-to-tr from-violet-950/20 via-zinc-900/50 to-zinc-900/50 border border-violet-500/10 hover:border-violet-500/20 transition-all duration-300 text-left"
            >
              <div className="text-sm text-violet-300 font-mono mb-2 uppercase tracking-widest">Our Philosophy</div>
              <p className="text-base sm:text-lg text-zinc-300 font-light italic leading-relaxed">
                "We don't build generic SaaS landing pages or boilerplate agency templates. We engineer the core operational platforms that power diagnostic laboratories, points of sale, administrative hubs, and guest experiences."
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
