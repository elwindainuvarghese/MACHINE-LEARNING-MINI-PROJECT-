import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Battery, HardDrive, Camera, Maximize, Smartphone, Zap, Sparkles, Layers } from 'lucide-react';

export default function BentoGrid({ specs }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay }
    })
  };

  const ramGB = Math.round((specs.ram / 1024) * 10) / 10;
  const batteryPct = Math.round((specs.battery_power / 2000) * 100);

  return (
    <div ref={containerRef} className="py-2 w-full">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[220px]">
        
        {/* Card 1: RAM (Hero Bento Card - Primary Feature) */}
        <motion.div
          custom={0.05}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ y: -4 }}
          className="md:col-span-8 md:row-span-2 rounded-3xl bg-[#090D17] border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          {/* Subtle Background Icon */}
          <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
            <Cpu size={260} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#00F5D4] text-xs font-mono uppercase tracking-widest mb-2 font-semibold">
                <Sparkles size={13} /> Most Influential Metric (54.4% Importance)
              </div>
              <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                {specs.ram} MB <span className="text-xl sm:text-2xl text-white/50 font-normal">RAM</span>
              </h3>
              <p className="text-white/65 text-xs sm:text-sm mt-2 max-w-md leading-relaxed font-sans">
                Corresponds to {ramGB} GB memory capacity. High RAM is the single most statistically significant predictor for Tier 2 and Tier 3 flagship classification.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-mono text-[#00F5D4] text-xs shrink-0">
              CORRELATION: +0.917
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[11px] uppercase font-mono text-white/50">Feature Impact</div>
                <div className="text-base sm:text-lg font-mono font-bold text-white">Rank 1 of 20</div>
              </div>
              <div className="h-7 w-px bg-white/10" />
              <div>
                <div className="text-[11px] uppercase font-mono text-white/50">Variance Explained</div>
                <div className="text-base sm:text-lg font-mono font-bold text-[#00F5D4]">54.37%</div>
              </div>
            </div>
            <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/75">
              Target Split Criterion: &gt; 3,100 MB
            </span>
          </div>
        </motion.div>

        {/* Card 2: Battery Power */}
        <motion.div
          custom={0.1}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ y: -4 }}
          className="md:col-span-4 md:row-span-2 rounded-3xl bg-[#090D17] border border-white/10 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-white pointer-events-none">
            <Battery size={200} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                <Battery size={14} /> Battery Capacity
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                {batteryPct}% MAX
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              {specs.battery_power} <span className="text-base text-white/40 font-normal">mAh</span>
            </h3>
            <p className="text-xs text-white/60 mt-2 font-sans leading-relaxed">
              Second most critical hardware attribute in CART classification splits and linear baseline pricing.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6">
            <div className="text-[11px] font-mono text-white/50 mb-1.5 flex justify-between">
              <span>Standardized Battery Range:</span>
              <span className="text-white">{specs.battery_power} mAh</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, (specs.battery_power / 2000) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1.5">
              <span>500 mAh</span>
              <span>2,000 mAh</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Internal Storage */}
        <motion.div
          custom={0.15}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ y: -4 }}
          className="md:col-span-4 rounded-3xl bg-[#090D17] border border-white/10 p-6 relative overflow-hidden flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-mono font-semibold uppercase">
              <HardDrive size={15} /> Storage Capacity
            </div>
            <span className="text-xs font-mono text-white/40">int_memory</span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {specs.int_memory} <span className="text-sky-400 text-lg">GB</span>
            </div>
            <p className="text-xs text-white/55 mt-1 font-sans">Kaggle Dataset Range: 2 GB to 64 GB</p>
          </div>
        </motion.div>

        {/* Card 4: Display Matrix */}
        <motion.div
          custom={0.2}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ y: -4 }}
          className="md:col-span-4 rounded-3xl bg-[#090D17] border border-white/10 p-6 relative overflow-hidden flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono font-semibold uppercase">
              <Maximize size={15} /> Display Resolution
            </div>
            <span className="text-xs font-mono text-white/40">px_w × px_h</span>
          </div>

          <div className="mt-4">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono truncate">
              {specs.px_width} × {specs.px_height}
            </div>
            <p className="text-xs text-white/55 mt-1 font-sans">
              Display Surface: {((specs.px_width * specs.px_height) / 1000000).toFixed(2)} Megapixels
            </p>
          </div>
        </motion.div>

        {/* Card 5: Optics Camera Sensor */}
        <motion.div
          custom={0.25}
          variants={cardVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          whileHover={{ y: -4 }}
          className="md:col-span-4 rounded-3xl bg-[#090D17] border border-white/10 p-6 relative overflow-hidden flex flex-col justify-between shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-pink-400 text-xs font-mono font-semibold uppercase">
              <Camera size={15} /> Primary Camera
            </div>
            <span className="text-xs font-mono text-white/40">pc / fc</span>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {specs.pc} <span className="text-pink-400 text-lg">MP</span>
              <span className="text-xs text-white/40 font-normal ml-2">Front: {specs.fc} MP</span>
            </div>
            <p className="text-xs text-white/55 mt-1 font-sans">Optical sensor resolution</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
