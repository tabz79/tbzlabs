import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is TBZ Labs?",
    answer: "TBZ Labs is a custom software development studio founded by Tabrez Shaik. We design and build high-performance, operational software systems that solve real-world workflow challenges. We partner directly with businesses in healthcare, retail, education, and hospitality to develop custom applications, custom POS interfaces, and internal business operating systems that scale."
  },
  {
    question: "What is SynOS?",
    answer: "SynOS is a comprehensive Diagnostic Lab Operating System created by TBZ Labs. It integrates laboratory operations, pathology workbenches, radiology scans, billing, inventory control, and director command centers into a unified web application. SynOS streamlines the entire patient journey—from registration and phlebotomy queues to sample collection and automated reporting."
  },
  {
    question: "Why should diagnostic labs choose custom software like SynOS over off-the-shelf LIS?",
    answer: "Off-the-shelf Laboratory Information Systems (LIS) are often rigid and force labs to alter their workflows. SynOS offers custom diagnostic lab management built around how your specific lab operates. It integrates clinical workbenches directly with finance and inventory pipelines, reducing manual data entry errors and automating billing reconciliation for multiple collection centers."
  },
  {
    question: "Does TBZ Labs build HIPAA-compliant healthcare software?",
    answer: "Yes, TBZ Labs builds custom healthcare and diagnostic software prioritizing data security and compliance. We implement robust access controls, detailed audit trails, end-to-end encryption for patient records, and standard interfaces for medical imaging and reports. This ensures your medical workflows are fully secure and compliant with modern digital healthcare standards."
  },
  {
    question: "What technologies does TBZ Labs use to build custom applications?",
    answer: "TBZ Labs builds modern, high-performance web applications using robust and scalable technologies. Our typical stack utilizes HTML5, custom CSS/Tailwind variables, React, and Vite for fast, premium user interfaces. For backend workflows, database management, and automation pipelines, we structure lightweight services that ensure quick response times and maximum uptime."
  },
  {
    question: "What kinds of custom software development services do you offer?",
    answer: "TBZ Labs offers custom software development services including bespoke operational systems, custom POS development, healthcare software engineering, workflow automation pipelines, and internal ERP/CRM builds. We work directly with key operators to understand their daily procedures, translate manual processes into clean digital interfaces, and eliminate operational bottlenecks."
  },
  {
    question: "How do you design user interfaces for complex operational workflows?",
    answer: "We focus on high-fidelity, intuitive, and premium designs that match the operator's actual workspace. By removing clutter and prioritizing visual flow (such as bento grids, subtle progress micro-animations, and clean typography), we reduce cognitive load on staff, speed up data entry, and minimize training requirements for complex systems like diagnostic labs."
  },
  {
    question: "How does workflow automation benefit businesses?",
    answer: "Workflow automation eliminates repetitive administrative tasks, such as manual reporting, status notifications, and double entry between separate systems. TBZ Labs designs integration pipelines that connect your primary database, CRM, financial ledger, and notifications. This streamlines business procedures, reduces human error, and allows your staff to focus on high-value operations."
  },
  {
    question: "What is your development process at TBZ Labs?",
    answer: "Our process is builder-led and highly collaborative. We design layouts and architectures directly with the business stakeholders to align with their actual operational processes. Once approved, we build the systems using clean, modern standards, execute comprehensive testing, and manage deployment onto production servers like Vercel with clean paths and optimized SEO settings."
  },
  {
    question: "Can you integrate custom POS systems with existing ERP software?",
    answer: "Yes, TBZ Labs specializes in designing custom point-of-sale (POS) systems that integrate seamlessly with existing inventory, billing, and accounting software. We build custom API bridges and middleware to synchronize stock levels, orders, sales tracking, and payroll data in real time, ensuring a unified data view across all business departments."
  },
  {
    question: "Can TBZ Labs turn my early-stage app idea into a fully-functional product?",
    answer: "Yes. TBZ Labs specializes in taking early-stage software concepts and transforming them into complete, production-ready applications. We guide founders through software architecture, user flow mapping, database design, and premium UI design. We build cohesive, scalable ecosystems tailored specifically for your target audience, handling technical execution from blueprint to final launch."
  },
  {
    question: "Do you work with non-technical founders to design and build custom software?",
    answer: "Yes, we collaborate closely with non-technical founders and business operators. We translate complex product ideas into straightforward, functional specifications. By focusing on direct communication and transparent prototyping, we handle all technical development, system integration, database administration, and server deployment so you can focus entirely on growing your business."
  },
  {
    question: "Can TBZ Labs scale a simple prototype into a full enterprise software ecosystem?",
    answer: "Absolutely. We build software architectures designed to expand alongside your business. Whether you have a basic prototype or want to integrate multiple platforms, we develop custom API integrations, internal operations systems (ERP), customer portals, and automation tools to unify your workflows into a single, high-performing software ecosystem."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 border-t border-zinc-900 bg-[#030303] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono font-medium tracking-widest text-violet-400 uppercase bg-violet-950/30 px-3.5 py-1.5 rounded-full border border-violet-900/40 inline-block mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-light leading-relaxed"
          >
            Direct, factual answers about our custom development studio, our specialized products like SynOS, and custom operational systems.
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? 'border-violet-500/20 bg-zinc-900/20 shadow-lg shadow-violet-500/2' 
                    : 'border-zinc-850 bg-zinc-950/20 hover:border-zinc-700/50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer border-none bg-transparent"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base font-semibold transition-colors duration-200 ${isOpen ? 'text-violet-400' : 'text-zinc-200 hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-violet-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm md:text-base text-zinc-400 font-light leading-relaxed border-t border-zinc-900/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
