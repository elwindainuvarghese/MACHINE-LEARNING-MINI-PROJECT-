import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Brain, Cpu, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function FeatureImpact({ metricsData }) {
  const features = metricsData?.feature_importance || [
    { feature: 'ram', label: 'RAM (Memory)', importance: 67.4 },
    { feature: 'battery_power', label: 'Battery Capacity', importance: 13.8 },
    { feature: 'px_height', label: 'Display Resolution (Y)', importance: 7.9 },
    { feature: 'px_width', label: 'Display Resolution (X)', importance: 5.2 },
    { feature: 'int_memory', label: 'Internal Storage', importance: 2.8 },
    { feature: 'pc', label: 'Primary Camera MP', importance: 1.4 },
    { feature: 'mobile_wt', label: 'Device Chassis Weight', importance: 0.9 },
    { feature: 'clock_speed', label: 'CPU Clock Speed', importance: 0.6 }
  ];

  // Neon colors matching the palette
  const getBarColor = (index) => {
    const palette = ['#ff00ff', '#00ffff', '#39ff14', '#a855f7', '#3b82f6', '#ec4899', '#eab308', '#6366f1'];
    return palette[index % palette.length];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-dark p-3 rounded-xl border border-white/20 shadow-xl font-mono text-xs">
          <div className="text-white font-bold">{data.label}</div>
          <div className="text-neon-cyan mt-1">Gini Importance: {data.importance}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="feature-impact" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-4 border-neon-magenta/40 stripe-magenta">
          <Brain className="w-4 h-4 text-neon-magenta" />
          <span className="font-semibold text-xs uppercase tracking-wider text-gray-200 font-mono">
            Feature Attribution & Explainability
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
          Feature Impact Analysis —
        </h2>
        <p className="text-gray-400 text-lg font-medium">
          Decoupling the decision boundaries: how Random Forest attributes weight across internal hardware dimensions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Recharts Horizontal Bar Chart */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 border border-white/15 stripe-cyan neon-shadow-cyan">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Gini Impurity Feature Importance
              </h3>
              <p className="text-xs text-gray-400 mt-1">Percentage attribution toward pricing class separation</p>
            </div>
            <span className="text-xs font-mono bg-neon-cyan/10 text-neon-cyan px-3 py-1 rounded-full border border-neon-cyan/30 font-bold">
              RAM DOMINANCE
            </span>
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={features}
                margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis type="number" domain={[0, 60]} stroke="#94a3b8" unit="%" tick={{ fontSize: 11 }} />
                <YAxis 
                  dataKey="label" 
                  type="category" 
                  stroke="#cbd5e1" 
                  width={140} 
                  tick={{ fontSize: 11, fontWeight: 500, fontFamily: 'Space Grotesk' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]} animationDuration={1400}>
                  {features.map((entry, index) => (
                    <Cell key={`feat-${index}`} fill={getBarColor(index)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Narrative Insights Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-8 stripe-magenta neon-shadow-magenta border border-white/15">
            <div className="flex items-center gap-3 text-neon-magenta text-xs font-mono uppercase tracking-widest font-bold mb-3">
              <Cpu size={16} /> Key Model Takeaways
            </div>
            <h4 className="text-2xl font-bold text-white tracking-tight mb-3">
              RAM acts as the primary price watershed. 🧠
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              In smartphone manufacturing and market positioning, DRAM bandwidth represents the single steepest bill-of-materials (BOM) cost differentiator. Random Forest assigns over <strong className="text-neon-lime">50% - 55%</strong> of split decisions to RAM alone.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 stripe-lime neon-shadow-lime border border-white/15">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <TrendingUp className="text-neon-lime w-5 h-5" /> Secondary Pricing Drivers
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              Battery capacity (mAh) and display pixel dimensions act as secondary discriminators, separating devices within the same RAM bracket (e.g. differentiating Mid-Tier from High-Tier).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
