import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Cpu, Battery, HardDrive, 
  Camera, Maximize, Smartphone, Zap, CheckCircle2, 
  Activity, ShieldCheck, Flame, Layers, AlertTriangle, 
  Radio, Wifi, Bluetooth, Disc, Compass, Gauge
} from 'lucide-react';

export default function HeroPrediction({ specs, setSpecs, onPredict, predictionResult, isLoading }) {
  const [activeDeck, setActiveDeck] = useState('performance'); // 'performance' | 'display' | 'camera' | 'connectivity'
  const [activePreset, setActivePreset] = useState('flagship');

  const handleSliderChange = (key, value) => {
    setSpecs(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleToggle = (key) => {
    setSpecs(prev => ({ ...prev, [key]: prev[key] === 1 ? 0 : 1 }));
  };

  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    if (presetName === 'budget') {
      setSpecs({
        battery_power: 800,
        clock_speed: 1.2,
        n_cores: 4,
        ram: 950,
        int_memory: 16,
        talk_time: 8,
        px_height: 480,
        px_width: 800,
        sc_h: 11,
        sc_w: 4,
        m_dep: 0.8,
        mobile_wt: 140,
        fc: 2,
        pc: 5,
        blue: 1,
        dual_sim: 1,
        four_g: 0,
        three_g: 1,
        touch_screen: 1,
        wifi: 1
      });
    } else if (presetName === 'midrange') {
      setSpecs({
        battery_power: 1400,
        clock_speed: 2.0,
        n_cores: 6,
        ram: 2100,
        int_memory: 32,
        talk_time: 14,
        px_height: 850,
        px_width: 1300,
        sc_h: 14,
        sc_w: 6,
        m_dep: 0.6,
        mobile_wt: 165,
        fc: 8,
        pc: 13,
        blue: 1,
        dual_sim: 1,
        four_g: 1,
        three_g: 1,
        touch_screen: 1,
        wifi: 1
      });
    } else if (presetName === 'gaming') {
      setSpecs({
        battery_power: 1850,
        clock_speed: 2.8,
        n_cores: 8,
        ram: 3100,
        int_memory: 64,
        talk_time: 18,
        px_height: 1200,
        px_width: 1800,
        sc_h: 16,
        sc_w: 8,
        m_dep: 0.5,
        mobile_wt: 180,
        fc: 12,
        pc: 18,
        blue: 1,
        dual_sim: 1,
        four_g: 1,
        three_g: 1,
        touch_screen: 1,
        wifi: 1
      });
    } else if (presetName === 'flagship') {
      setSpecs({
        battery_power: 1980,
        clock_speed: 3.0,
        n_cores: 8,
        ram: 3950,
        int_memory: 64,
        talk_time: 20,
        px_height: 1440,
        px_width: 1980,
        sc_h: 17,
        sc_w: 8,
        m_dep: 0.4,
        mobile_wt: 190,
        fc: 16,
        pc: 20,
        blue: 1,
        dual_sim: 1,
        four_g: 1,
        three_g: 1,
        touch_screen: 1,
        wifi: 1
      });
    } else if (presetName === 'outlier') {
      // DBSCAN Anomaly Trigger: 3950 MB RAM with critically tiny 520 mAh battery + inverted aspect ratio
      setSpecs({
        battery_power: 520,
        clock_speed: 0.5,
        n_cores: 8,
        ram: 3950,
        int_memory: 4,
        talk_time: 3,
        px_height: 1920,
        px_width: 520,
        sc_h: 6,
        sc_w: 12, // Inverted aspect
        m_dep: 1.0,
        mobile_wt: 85,
        fc: 20,
        pc: 1,
        blue: 0,
        dual_sim: 0,
        four_g: 0,
        three_g: 0,
        touch_screen: 0,
        wifi: 0
      });
    }
  };

  const tierStyles = {
    0: {
      badgeBg: 'bg-cyan-500/20 text-neon-cyan border-neon-cyan/40',
      stripe: 'stripe-cyan',
      shadow: 'neon-shadow-cyan',
      glow: 'shadow-[0_0_50px_rgba(0,245,212,0.35)]',
      accentColor: '#00f5d4'
    },
    1: {
      badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      stripe: 'border-l-6 border-l-blue-500',
      shadow: 'shadow-[0_15px_45px_-10px_rgba(59,130,246,0.45)]',
      glow: 'shadow-[0_0_50px_rgba(59,130,246,0.35)]',
      accentColor: '#3b82f6'
    },
    2: {
      badgeBg: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/40',
      stripe: 'stripe-magenta',
      shadow: 'neon-shadow-magenta',
      glow: 'shadow-[0_0_50px_rgba(255,42,133,0.35)]',
      accentColor: '#ff2a85'
    },
    3: {
      badgeBg: 'bg-neon-lime/20 text-neon-lime border-neon-lime/40',
      stripe: 'stripe-lime',
      shadow: 'neon-shadow-lime',
      glow: 'shadow-[0_0_50px_rgba(57,255,20,0.35)]',
      accentColor: '#39ff14'
    }
  };

  const currentTier = predictionResult?.consensus_price_range ?? predictionResult?.price_range ?? 3;
  const currentTierStyle = tierStyles[currentTier] || tierStyles[3];
  const radar = predictionResult?.anomaly_radar;
  const isAnomaly = radar?.is_outlier;

  return (
    <section id="prediction-engine" className="relative pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-visible">
      {/* Structural Neon Ambient Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-neon-purple/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-neon-cyan/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Headline */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel mb-6 border-neon-cyan/40 stripe-cyan shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-neon-cyan animate-spin" />
          <span className="font-semibold tracking-tight text-xs md:text-sm uppercase text-gray-200">
            Multi-Model Consensus & Density Anomaly Engine
          </span>
          <span className="text-neon-magenta font-mono text-xs">🚀 8 ML MODULES ACTIVE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.08] text-white mb-5"
        >
          It's not just a prediction — <br />
          <span className="bg-gradient-to-r from-neon-cyan via-purple-400 to-neon-magenta bg-clip-text text-transparent">
            it's a precision pricing engine.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          A high-accuracy Machine Learning classification suite predicting smartphone market tiers based on 20 raw hardware specifications, backed by real-time DBSCAN density anomaly gating.
        </motion.p>

        {/* Preset Quick Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          <span className="text-xs uppercase tracking-wider font-mono text-gray-400 font-bold mr-1">
            Quick Archetypes:
          </span>
          {[
            { id: 'budget', label: 'Budget Entry (Tier 0)', icon: '📱' },
            { id: 'midrange', label: 'Mid-Range (Tier 1)', icon: '⚡' },
            { id: 'gaming', label: 'Gaming Beast (Tier 2)', icon: '🎮' },
            { id: 'flagship', label: 'Flagship Ultra (Tier 3)', icon: '👑' },
            { id: 'outlier', label: 'Weird Outlier (DBSCAN Anomaly)', icon: '⚠️' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer border ${
                activePreset === p.id
                  ? p.id === 'outlier'
                    ? 'bg-neon-magenta/25 border-neon-magenta text-neon-magenta shadow-[0_0_15px_rgba(255,42,133,0.5)]'
                    : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                  : 'glass-panel text-gray-400 border-white/10 hover:border-gray-500 hover:text-white'
              }`}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Cyber Bento: Tile 1 (20-Spec Cyber-Deck) & Tile 2 (Consensus Verdict & Anomaly Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= BENTO TILE 1: 20-SPEC HARDWARE CONFIGURATOR (7 Cols) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 stripe-cyan neon-shadow-cyan border border-white/15 relative overflow-hidden"
        >
          {/* Deck Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan font-bold">
                  Bento Tile 01 // Input Matrix
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                20-Feature Hardware Synthesizer
              </h3>
            </div>

            {/* Cyber Deck Tabs */}
            <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full">
              {[
                { id: 'performance', label: 'Performance', icon: Cpu },
                { id: 'display', label: 'Display & Body', icon: Maximize },
                { id: 'camera', label: 'Optics', icon: Camera },
                { id: 'connectivity', label: 'Radios', icon: Radio }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDeck(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeDeck === tab.id
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configurator Sliders Body */}
          <div className="py-6 min-h-[360px]">
            {/* Deck 1: Performance Core */}
            {activeDeck === 'performance' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* RAM */}
                <div className="glass-light p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <Cpu className="w-4 h-4 text-neon-cyan" />
                      RAM Memory (Primary Pricing Driver)
                    </span>
                    <span className="font-mono text-neon-cyan text-sm font-bold bg-neon-cyan/10 px-2.5 py-0.5 rounded-lg border border-neon-cyan/30">
                      {specs.ram} MB ({Math.round(specs.ram / 1024 * 10) / 10} GB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="4000"
                    step="32"
                    value={specs.ram}
                    onChange={(e) => handleSliderChange('ram', e.target.value)}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1">
                    <span>256 MB (Legacy Budget)</span>
                    <span className="text-neon-lime">3998 MB (Flagship Max)</span>
                  </div>
                </div>

                {/* Battery */}
                <div className="glass-light p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <Battery className="w-4 h-4 text-neon-lime" />
                      Battery Capacity (Power Cell)
                    </span>
                    <span className="font-mono text-neon-lime text-sm font-bold bg-neon-lime/10 px-2.5 py-0.5 rounded-lg border border-neon-lime/30">
                      {specs.battery_power} mAh
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="20"
                    value={specs.battery_power}
                    onChange={(e) => handleSliderChange('battery_power', e.target.value)}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1">
                    <span>500 mAh</span>
                    <span>1998 mAh (Dataset Ceiling)</span>
                  </div>
                </div>

                {/* Storage & Clock Speed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                        <HardDrive className="w-3.5 h-3.5 text-neon-magenta" />
                        Internal Storage
                      </span>
                      <span className="font-mono text-neon-magenta text-xs font-bold bg-neon-magenta/10 px-2 py-0.5 rounded-md">
                        {specs.int_memory} GB
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="64"
                      step="2"
                      value={specs.int_memory}
                      onChange={(e) => handleSliderChange('int_memory', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Clock Speed
                      </span>
                      <span className="font-mono text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-md">
                        {specs.clock_speed} GHz
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={specs.clock_speed}
                      onChange={(e) => handleSliderChange('clock_speed', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Cores & Talk Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">CPU Cores</span>
                      <span className="font-mono text-white text-xs font-bold bg-white/10 px-2 py-0.5 rounded-md">
                        {specs.n_cores} Cores
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={specs.n_cores}
                      onChange={(e) => handleSliderChange('n_cores', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Talk Time (Full Charge)</span>
                      <span className="font-mono text-white text-xs font-bold bg-white/10 px-2 py-0.5 rounded-md">
                        {specs.talk_time} hrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="1"
                      value={specs.talk_time}
                      onChange={(e) => handleSliderChange('talk_time', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Deck 2: Display & Chassis */}
            {activeDeck === 'display' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Resolution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Pixel Height (`px_height`)</span>
                      <span className="font-mono text-neon-cyan text-xs font-bold">{specs.px_height} px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1960"
                      step="20"
                      value={specs.px_height}
                      onChange={(e) => handleSliderChange('px_height', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Pixel Width (`px_width`)</span>
                      <span className="font-mono text-neon-cyan text-xs font-bold">{specs.px_width} px</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="2000"
                      step="20"
                      value={specs.px_width}
                      onChange={(e) => handleSliderChange('px_width', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Screen Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Screen Height (`sc_h`)</span>
                      <span className="font-mono text-white text-xs font-bold">{specs.sc_h} cm</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="19"
                      step="1"
                      value={specs.sc_h}
                      onChange={(e) => handleSliderChange('sc_h', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Screen Width (`sc_w`)</span>
                      <span className="font-mono text-white text-xs font-bold">{specs.sc_w} cm</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="18"
                      step="1"
                      value={specs.sc_w}
                      onChange={(e) => handleSliderChange('sc_w', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Weight & Depth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Chassis Weight</span>
                      <span className="font-mono text-amber-400 text-xs font-bold">{specs.mobile_wt} g</span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="200"
                      step="5"
                      value={specs.mobile_wt}
                      onChange={(e) => handleSliderChange('mobile_wt', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="glass-light p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-200">Thickness / Depth</span>
                      <span className="font-mono text-amber-400 text-xs font-bold">{specs.m_dep} cm</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={specs.m_dep}
                      onChange={(e) => handleSliderChange('m_dep', e.target.value)}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Deck 3: Optics (Cameras) */}
            {activeDeck === 'camera' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="glass-light p-5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <Camera className="w-4 h-4 text-neon-magenta" />
                      Primary Rear Sensor (`pc`)
                    </span>
                    <span className="font-mono text-neon-magenta text-sm font-bold bg-neon-magenta/10 px-3 py-1 rounded-lg border border-neon-magenta/30">
                      {specs.pc} MP Sensor
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={specs.pc}
                    onChange={(e) => handleSliderChange('pc', e.target.value)}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1">
                    <span>0 MP (No Rear Camera)</span>
                    <span>20 MP (Dataset Standard Maximum)</span>
                  </div>
                </div>

                <div className="glass-light p-5 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                      <Camera className="w-4 h-4 text-neon-cyan" />
                      Front Selfie Sensor (`fc`)
                    </span>
                    <span className="font-mono text-neon-cyan text-sm font-bold bg-neon-cyan/10 px-3 py-1 rounded-lg border border-neon-cyan/30">
                      {specs.fc} MP Sensor
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={specs.fc}
                    onChange={(e) => handleSliderChange('fc', e.target.value)}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1">
                    <span>0 MP (No Front Cam)</span>
                    <span>20 MP (Ultra Selfie)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Deck 4: Connectivity Matrix */}
            {activeDeck === 'connectivity' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3.5"
              >
                {[
                  { key: 'four_g', label: '4G LTE Module', icon: Radio },
                  { key: 'three_g', label: '3G Fallback', icon: Radio },
                  { key: 'wifi', label: 'Wi-Fi 802.11', icon: Wifi },
                  { key: 'blue', label: 'Bluetooth Radio', icon: Bluetooth },
                  { key: 'dual_sim', label: 'Dual SIM Tray', icon: Smartphone },
                  { key: 'touch_screen', label: 'Capacitive Touch', icon: Disc }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = specs[item.key] === 1;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleToggle(item.key)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'glass-dark border-neon-cyan/60 bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,245,212,0.25)]'
                          : 'glass-light border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-neon-cyan' : 'text-gray-400'}`} />
                        <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-neon-cyan animate-pulse' : 'bg-gray-600'}`}></span>
                      </div>
                      <div className="font-semibold text-xs text-white tracking-tight">{item.label}</div>
                      <div className="font-mono text-[10px] text-gray-400 mt-0.5">
                        {isActive ? 'ENABLED (1)' : 'DISABLED (0)'}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs font-mono text-gray-400">
              ⚡ Instant inference across 7 models
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onPredict}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-cyan via-purple-600 to-neon-magenta text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,245,212,0.4)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              <span>{isLoading ? 'Synthesizing...' : 'Initialize Consensus Inference ✨'}</span>
            </motion.button>
          </div>
        </motion.div>


        {/* ================= BENTO TILE 2: CONSENSUS VERDICT & DBSCAN RADAR (5 Cols) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Output Card */}
          <div className={`glass-panel rounded-3xl p-6 sm:p-7 ${currentTierStyle.stripe} ${currentTierStyle.shadow} border border-white/15 relative overflow-hidden`}>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-lime animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-gray-300 font-bold">
                  Bento Tile 02 // Verdict Matrix
                </span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20">
                {predictionResult?.consensus_agreement_pct || 85.7}% CONSENSUS
              </div>
            </div>

            {/* Big Tier Output */}
            <div className="mb-6">
              <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
                CLASSIFIED PRICE TIER
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {predictionResult?.consensus_tier_name || predictionResult?.tier_name || "Very High Cost (Flagship)"}
              </div>
              <div className="text-sm font-mono text-neon-cyan mt-1 flex items-center gap-2">
                <span>ESTIMATED VALUE:</span>
                <span className="font-bold text-white bg-black/40 px-2.5 py-0.5 rounded-lg border border-neon-cyan/40">
                  {predictionResult?.market_range || "$550+ (₹45,000+)"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {predictionResult?.description || "Flagship silicon with uncompromised memory bandwidth and QHD visuals."}
              </p>
            </div>

            {/* Model Consensus Voting Chips */}
            <div className="mb-5 bg-black/30 p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Individual Model Ballots (Exp 2 - Exp 7):</span>
                <span className="text-neon-cyan font-bold">6 Algorithms</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {predictionResult?.model_votes ? (
                  Object.entries(predictionResult.model_votes).map(([modelKey, val]) => (
                    <div key={modelKey} className="flex items-center justify-between bg-white/5 px-2.5 py-1 rounded-lg">
                      <span className="text-gray-300 truncate capitalize">{modelKey.replace('_', ' ')}</span>
                      <span className={`font-bold ml-1 ${val.vote === currentTier ? 'text-neon-lime' : 'text-neon-magenta'}`}>
                        T{val.vote}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between bg-white/5 px-2 py-1 rounded"><span>Random Forest</span><span className="text-neon-lime font-bold">T{currentTier}</span></div>
                    <div className="flex justify-between bg-white/5 px-2 py-1 rounded"><span>Gradient Boost</span><span className="text-neon-lime font-bold">T{currentTier}</span></div>
                    <div className="flex justify-between bg-white/5 px-2 py-1 rounded"><span>Linear SVM</span><span className="text-neon-lime font-bold">T{currentTier}</span></div>
                    <div className="flex justify-between bg-white/5 px-2 py-1 rounded"><span>Logistic Reg</span><span className="text-neon-lime font-bold">T{currentTier}</span></div>
                  </>
                )}
              </div>
            </div>

            {/* Continuous Regressor Price Indices (Exp 2 Baseline) */}
            <div className="mb-5 bg-black/30 p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Continuous Regressor Price Indices [0.0 - 3.0]:</span>
                <Gauge className="w-3.5 h-3.5 text-neon-cyan" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">Linear Reg (OLS)</div>
                  <div className="text-sm font-bold text-neon-cyan mt-0.5">
                    {predictionResult?.continuous_price_indices?.linear_regression_index ?? '2.95'}
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">CART Regressor</div>
                  <div className="text-sm font-bold text-neon-lime mt-0.5">
                    {predictionResult?.continuous_price_indices?.cart_regression_index ?? '3.00'}
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">SVR (RBF Kernel)</div>
                  <div className="text-sm font-bold text-neon-magenta mt-0.5">
                    {predictionResult?.continuous_price_indices?.svr_regression_index ?? '2.88'}
                  </div>
                </div>
              </div>
            </div>

            {/* Probability Distribution */}
            {predictionResult?.class_probabilities && (
              <div className="space-y-2 mb-2">
                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Posterior Softmax Class Probabilities:
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {predictionResult.class_probabilities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-20 text-gray-400 text-[11px] truncate">{item.tier}</span>
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.probability}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full ${
                            idx === currentTier ? 'bg-neon-cyan' : 'bg-gray-600'
                          }`}
                        />
                      </div>
                      <span className="w-10 text-right text-white font-bold text-[11px]">{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= REAL-TIME DBSCAN ANOMALY RADAR (MODULE 6) ================= */}
          <div className={`glass-panel rounded-3xl p-5 sm:p-6 border ${
            isAnomaly 
              ? 'border-neon-magenta stripe-magenta shadow-[0_0_35px_rgba(255,42,133,0.35)]' 
              : 'border-neon-lime/40 stripe-lime shadow-[0_0_25px_rgba(57,255,20,0.2)]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${isAnomaly ? 'text-neon-magenta animate-bounce' : 'text-neon-lime'}`} />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-200">
                  DBSCAN Anomaly Radar (Exp 8 & 9)
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                isAnomaly
                  ? 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50'
                  : 'bg-neon-lime/20 text-neon-lime border-neon-lime/50'
              }`}>
                {radar?.anomaly_status || (isAnomaly ? "OUTLIER SPEC DETECTED" : "REALISTIC ARCHETYPE")}
              </span>
            </div>

            {/* Radar Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono my-3">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">Core Distance / Threshold</div>
                <div className={`text-sm font-bold mt-0.5 ${isAnomaly ? 'text-neon-magenta' : 'text-neon-lime'}`}>
                  {radar?.nearest_core_distance ?? 1.45} / {radar?.dbscan_eps_threshold ?? 2.85} ε
                </div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">Outlier Anomaly Risk</div>
                <div className={`text-sm font-bold mt-0.5 ${isAnomaly ? 'text-neon-magenta' : 'text-neon-lime'}`}>
                  {radar?.anomaly_score_pct ?? (isAnomaly ? 85.0 : 12.0)}%
                </div>
              </div>
            </div>

            {/* Flagged reasons */}
            <div className="space-y-1 text-xs text-gray-300">
              {radar?.flagged_reasons?.map((reason, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                  <span className={isAnomaly ? 'text-neon-magenta' : 'text-neon-lime'}>
                    {isAnomaly ? '✕' : '✓'}
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
