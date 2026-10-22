import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Battery, HardDrive, Camera, Maximize, Smartphone, Zap, Sparkles, Shield, Compass } from 'lucide-react';

export default function BentoGrid({ specs }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Anti-gravity spread animation variants
  // Cards start overlapping near center and smoothly burst outwards into their bento slots
  const cardVariants = {
    hidden: (custom) => ({
      opacity: 0,
      scale: 0.4,
      x: custom.startX || 0,
      y: custom.startY || 60,
      rotate: custom.rotate || 0,
      filter: 'blur(10px)'
    }),
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 90,
        delay: custom.delay || 0.1
      }
    })
  };

  const ramGB = Math.round((specs.ram / 1024) * 10) / 10;
  const batteryPct = Math.round((specs.battery_power / 5000) * 100);

  return (
    <section id="bento-grid" ref={containerRef} className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-4 border-neon-magenta/40 stripe-magenta">
          <Zap className="w-4 h-4 text-neon-magenta" />
          <span className="font-semibold text-xs uppercase tracking-wider text-gray-200 font-mono">
            Meta Shifu Anti-Gravity Grid
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          Silicon Blueprint & Metric Bento —
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          A physical manifestation of raw input specifications spreading across gravitational axes.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
        
        {/* Card 1: RAM (Hero Bento Card - Olive Green / Obsidian) */}
        <motion.div
          custom={{ startX: -120, startY: -100, rotate: -8, delay: 0.1 }}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.02, y: -6 }}
          className="md:col-span-8 md:row-span-2 rounded-3xl bg-olive text-white p-8 md:p-10 stripe-lime neon-shadow-lime relative overflow-hidden flex flex-col justify-between group"
        >
          {/* Background Ambient Icon */}
          <div className="absolute -right-6 -bottom-6 opacity-15 group-hover:opacity-25 transition-opacity text-white">
            <Cpu size={260} />
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-neon-lime text-xs font-mono uppercase tracking-widest mb-2 font-bold">
                <Sparkles size={14} /> Dominant Classifier Dimension
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                {specs.ram} MB LPDDR5X
              </h3>
              <p className="text-white/80 font-medium text-sm md:text-base mt-2 max-w-md">
                Allocates {ramGB} GB high-speed memory bandwidth. Dictates 67.4% of total price class variance.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 font-mono text-neon-lime text-xs">
              0034 — 0095 METRIC
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs uppercase font-mono text-white/60">Bus Width</div>
                <div className="text-xl font-mono font-bold text-neon-lime">64-bit Quad</div>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div>
                <div className="text-xs uppercase font-mono text-white/60">Transfer Rate</div>
                <div className="text-xl font-mono font-bold text-white">8533 MT/s</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full text-white">
                ML Correlation: +0.917 🔥
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Battery Power (White Liquid Glass) */}
        <motion.div
          custom={{ startX: 120, startY: -100, rotate: 6, delay: 0.2 }}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.03, y: -6 }}
          className="md:col-span-4 md:row-span-2 rounded-3xl glass-panel p-8 stripe-magenta neon-shadow-purple relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity text-neon-magenta">
            <Battery size={200} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neon-magenta font-bold flex items-center gap-1">
                <Battery size={14} /> Power Cell
              </span>
              <span className="text-xs font-mono px-2.5 py-1 bg-magenta-500/10 text-neon-magenta rounded-full border border-neon-magenta/30">
                {batteryPct}% INDEX
              </span>
            </div>
            <h3 className="text-4xl font-bold tracking-tight text-white mt-1">
              {specs.battery_power} <span className="text-lg text-gray-400 font-normal">mAh</span>
            </h3>
            <p className="text-xs text-gray-300 font-medium mt-2">
              High-capacity Silicon-Anode cell powering uninterrupted talk time.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="text-xs font-mono text-gray-400 mb-1">Standardized Cell Density:</div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-neon-magenta h-full rounded-full"
                style={{ width: `${Math.min(100, (specs.battery_power / 2000) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-2">
              <span>500 mAh</span>
              <span>2000 mAh</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Internal Storage (Deep Obsidian) */}
        <motion.div
          custom={{ startX: -100, startY: 100, rotate: -4, delay: 0.3 }}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.03, y: -4 }}
          className="md:col-span-4 rounded-3xl glass-dark text-white p-7 stripe-cyan neon-shadow-cyan relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neon-cyan text-xs font-mono font-bold uppercase">
              <HardDrive size={16} /> Flash Storage
            </div>
            <span className="text-xs font-mono text-gray-400">UFS 4.0</span>
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight text-white font-mono">
              {specs.int_memory} <span className="text-neon-cyan text-lg">GB</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Sequential Read: 4,200 MB/s</p>
          </div>
        </motion.div>

        {/* Card 4: Display Matrix (Olive Glass) */}
        <motion.div
          custom={{ startX: 0, startY: 120, rotate: 0, delay: 0.4 }}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.03, y: -4 }}
          className="md:col-span-4 rounded-3xl bg-olive/90 text-white p-7 stripe-lime neon-shadow-lime relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neon-lime text-xs font-mono font-bold uppercase">
              <Maximize size={16} /> AMOLED Density
            </div>
            <span className="text-xs font-mono text-white/70">120Hz LTPO</span>
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-white font-mono">
              {specs.px_width} × {specs.px_height}
            </div>
            <p className="text-xs text-white/80 mt-1">
              ~{Math.round(Math.sqrt(specs.px_width ** 2 + specs.px_height ** 2) / 6.5)} PPI Pixel Density
            </p>
          </div>
        </motion.div>

        {/* Card 5: Optics Camera Sensor (White Glass) */}
        <motion.div
          custom={{ startX: 100, startY: 100, rotate: 5, delay: 0.5 }}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ scale: 1.03, y: -4 }}
          className="md:col-span-4 rounded-3xl glass-panel p-7 stripe-purple neon-shadow-purple relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neon-magenta text-xs font-mono font-bold uppercase">
              <Camera size={16} /> Primary Optics
            </div>
            <span className="text-xs font-mono text-neon-magenta font-bold">f/1.8 OIS</span>
          </div>

          <div>
            <div className="text-3xl font-bold tracking-tight text-white font-mono">
              {specs.pc} <span className="text-neon-magenta text-lg">MP</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Quad Bayer HDR Sensor</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
