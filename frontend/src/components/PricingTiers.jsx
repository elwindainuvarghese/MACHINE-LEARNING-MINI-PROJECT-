import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Layers } from 'lucide-react';

export default function PricingTiers({ currentPredictionTier }) {
  const tiers = [
    {
      id: 0,
      title: 'Low Tier (Class 0)',
      target: 'Budget & Entry Market',
      priceEquiv: '< $150 · ₹12,000',
      specsList: [
        'RAM: 256 MB – 1,500 MB',
        'Standard 720p / 1080p panel',
        'Single/dual optical sensor',
        'Sub-3,000 mAh battery capacity'
      ],
      accent: 'text-sky-400',
      borderAccent: 'border-sky-500/30',
      bgPill: 'bg-sky-500/10'
    },
    {
      id: 1,
      title: 'Medium Tier (Class 1)',
      target: 'Mainstream Everyday',
      priceEquiv: '$150 – $320 · ₹25,000',
      specsList: [
        'RAM: 1,500 MB – 2,500 MB',
        'FHD+ IPS/OLED high-refresh',
        'Multi-lens 48MP camera array',
        '3,500 – 4,500 mAh battery cell'
      ],
      accent: 'text-[#00F5D4]',
      borderAccent: 'border-[#00F5D4]/30',
      bgPill: 'bg-[#00F5D4]/10'
    },
    {
      id: 2,
      title: 'High Tier (Class 2)',
      target: 'Prosumer & Performance',
      priceEquiv: '$320 – $550 · ₹45,000',
      specsList: [
        'RAM: 2,500 MB – 3,500 MB',
        '90Hz / 120Hz AMOLED panel',
        '64MP+ High dynamic range lens',
        'Fast-charge 4,500+ mAh battery'
      ],
      accent: 'text-purple-400',
      borderAccent: 'border-purple-500/30',
      bgPill: 'bg-purple-500/10'
    },
    {
      id: 3,
      title: 'Flagship Tier (Class 3)',
      target: 'Ultra Flagship Elite',
      priceEquiv: '$550 – $1,200+ · ₹75,000+',
      specsList: [
        'RAM: 3,500 MB – 4,000+ MB',
        '2K/QHD+ 120Hz LTPO display',
        'Studio-grade optics with OIS',
        '5,000+ mAh Silicon-Carbon cell'
      ],
      accent: 'text-pink-400',
      borderAccent: 'border-pink-500/30',
      bgPill: 'bg-pink-500/10',
      isHero: true
    }
  ];

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {tiers.map((tier) => {
          const isSelected = currentPredictionTier === tier.id;
          return (
            <motion.div
              key={tier.id}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0B0F19] text-white border-2 border-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.15)]'
                  : 'bg-[#070A12]/80 text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#00F5D4] text-black font-mono font-bold text-[10px] tracking-wider uppercase shadow-md">
                  ACTIVE PREDICTION
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-md ${tier.bgPill} ${tier.accent}`}>
                    CLASS {tier.id}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">{tier.priceEquiv}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1 text-white">
                  {tier.title}
                </h3>
                <div className="text-xs text-white/50 mb-5 font-sans">
                  {tier.target}
                </div>

                <div className="space-y-2.5 mb-6">
                  {tier.specsList.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 size={15} className={`${tier.accent} shrink-0 mt-0.5 opacity-80`} />
                      <span className="text-white/70 font-sans">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 mt-auto flex items-center justify-between text-[11px] font-mono text-white/45">
                <span>Target:</span>
                <span className={`font-semibold ${tier.accent}`}>
                  Tier {tier.id}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
