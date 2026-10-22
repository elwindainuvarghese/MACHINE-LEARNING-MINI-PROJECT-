import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Smartphone, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function PricingTiers({ currentPredictionTier }) {
  const tiers = [
    {
      id: 0,
      title: 'Low Tier (Class 0)',
      target: 'Budget & Entry Market',
      priceEquiv: '< $150',
      specsList: [
        'RAM: 256 MB – 1,500 MB',
        'Standard 720p / 1080p display',
        'Basic single/dual camera setup',
        'Sub-3,000 mAh battery capacity'
      ],
      stripe: 'stripe-cyan',
      shadow: 'neon-shadow-cyan',
      accent: 'text-neon-cyan',
      glowDot: 'bg-neon-cyan'
    },
    {
      id: 1,
      title: 'Medium Tier (Class 1)',
      target: 'Mainstream Everyday',
      priceEquiv: '$150 – $320',
      specsList: [
        'RAM: 1,500 MB – 2,500 MB',
        'FHD+ IPS/OLED screen',
        'Multi-lens 48MP camera array',
        '3,500 – 4,500 mAh battery density'
      ],
      stripe: 'border-l-8 border-l-blue-500',
      shadow: 'shadow-[0_15px_50px_-15px_rgba(59,130,246,0.5)]',
      accent: 'text-blue-500',
      glowDot: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'High Tier (Class 2)',
      target: 'Prosumers & Gamers',
      priceEquiv: '$320 – $550',
      specsList: [
        'RAM: 2,500 MB – 3,500 MB',
        '90Hz / 120Hz AMOLED panel',
        '64MP+ High dynamic range sensors',
        'Fast-charge 4,500+ mAh battery'
      ],
      stripe: 'stripe-purple',
      shadow: 'neon-shadow-purple',
      accent: 'text-neon-magenta',
      glowDot: 'bg-neon-magenta'
    },
    {
      id: 3,
      title: 'Premium Tier (Class 3)',
      target: 'Ultra Flagship Elite',
      priceEquiv: '$550 – $1,200+',
      specsList: [
        'RAM: 3,500 MB – 4,000+ MB',
        '2K/QHD+ 120Hz LTPO display',
        '108MP Studio-grade optics + OIS',
        '5,000+ mAh Silicon-Carbon cell'
      ],
      stripe: 'stripe-lime',
      shadow: 'neon-shadow-lime',
      accent: 'text-neon-lime',
      glowDot: 'bg-neon-lime',
      isHero: true
    }
  ];

  return (
    <section id="pricing-tiers" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-4 border-neon-cyan/40 stripe-cyan">
          <Layers className="w-4 h-4 text-neon-cyan" />
          <span className="font-semibold text-xs uppercase tracking-wider text-gray-200 font-mono">
            Model Output Taxonomy
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          The 4 Classification Tiers —
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          Repurposed pricing tier architecture mapping model target outputs to physical market economics.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const isSelected = currentPredictionTier === tier.id;
          return (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.03, y: -6 }}
              className={`rounded-3xl p-6 md:p-8 ${tier.stripe} ${tier.shadow} transition-all duration-300 relative flex flex-col justify-between ${
                tier.isHero || isSelected
                  ? 'glass-dark text-white border-2 border-neon-cyan/50 shadow-[0_0_25px_rgba(0,245,212,0.25)]'
                  : 'glass-panel text-white border border-white/10'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-neon-lime text-black font-mono font-bold text-[10px] tracking-wider uppercase shadow-[0_0_15px_#39ff14]">
                  ACTIVE PREDICTION MATCH ✨
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono uppercase tracking-widest font-bold ${tier.accent}`}>
                    CLASS {tier.id}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${tier.glowDot} animate-pulse`}></span>
                </div>

                <h3 className="text-2xl font-bold tracking-tight mb-1 text-white">
                  {tier.title}
                </h3>
                <div className="text-xs font-medium text-gray-400 mb-6 font-mono">
                  Market Benchmark: {tier.priceEquiv}
                </div>

                <div className="space-y-3 mb-8">
                  {tier.specsList.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-medium">
                      <CheckCircle2 size={16} className={`${tier.accent} shrink-0 mt-0.5 glow-bullet`} />
                      <span className="text-gray-300">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-auto">
                <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                  Target Demographic:
                </div>
                <div className={`text-xs font-bold mt-1 ${tier.accent}`}>
                  {tier.target}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
