import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingDown, Smartphone, Calendar, ShieldCheck, DollarSign, 
  ArrowRight, Sparkles, Cpu, Battery, HardDrive, Camera, AlertCircle, RefreshCw, 
  FileText, CheckCircle, Scale 
} from 'lucide-react';
import { fetchPhonesCatalog, forecastPhoneDepreciation, FALLBACK_CATALOG } from '../api';

export default function DepreciationForecaster({ onApplySpecsToClassifier }) {
  const [catalog, setCatalog] = useState(FALLBACK_CATALOG);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedPhoneId, setSelectedPhoneId] = useState('samsung_a55');
  const [monthsAhead, setMonthsAhead] = useState(5);
  const [condition, setCondition] = useState('like_new');
  const [customPrice, setCustomPrice] = useState('');
  const [forecastResult, setForecastResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'multi-brand'

  useEffect(() => {
    async function loadData() {
      const phones = await fetchPhonesCatalog();
      setCatalog(phones);
      runForecast('samsung_a55', 5, 'like_new', null);
    }
    loadData();
  }, []);

  const runForecast = async (phoneId, months, cond, price) => {
    setLoading(true);
    const query = {
      phone_id: phoneId,
      months_ahead: months,
      condition: cond,
      custom_price_inr: price ? Number(price) : null
    };
    const res = await forecastPhoneDepreciation(query);
    setForecastResult(res);
    setLoading(false);
  };

  const handlePhoneChange = (newId) => {
    setSelectedPhoneId(newId);
    setCustomPrice('');
    runForecast(newId, monthsAhead, condition, null);
  };

  const handleMonthsChange = (val) => {
    const m = Number(val);
    setMonthsAhead(m);
    runForecast(selectedPhoneId, m, condition, customPrice);
  };

  const handleConditionChange = (cond) => {
    setCondition(cond);
    runForecast(selectedPhoneId, monthsAhead, cond, customPrice);
  };

  const brands = ['All', 'Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Google Pixel', 'Realme', 'Motorola', 'Vivo / iQOO'];
  const filteredCatalog = selectedBrand === 'All' 
    ? catalog 
    : catalog.filter(p => 
        p.brand === selectedBrand || 
        (selectedBrand.includes('Google') && p.brand.includes('Google')) ||
        (selectedBrand.includes('Vivo') && p.brand.includes('Vivo'))
      );

  const currentPhone = catalog.find(p => p.id === selectedPhoneId) || catalog[0];

  // Multi-brand comparison data for 0 to 12 months
  const multiBrandTrajectory = Array.from({ length: 13 }, (_, m) => {
    const decayRates = {
      Apple: 0.015,
      Google: 0.024,
      Samsung: 0.023,
      OnePlus: 0.025,
      Xiaomi: 0.029,
      Realme: 0.031
    };
    return {
      month: `M${m}`,
      month_num: m,
      Apple: Math.round(Math.exp(-decayRates.Apple * m) * (m === 0 ? 100 : 94)),
      "Google Pixel": Math.round(Math.exp(-decayRates.Google * m) * (m === 0 ? 100 : 94)),
      Samsung: Math.round(Math.exp(-decayRates.Samsung * m) * (m === 0 ? 100 : 94)),
      OnePlus: Math.round(Math.exp(-decayRates.OnePlus * m) * (m === 0 ? 100 : 94)),
      Xiaomi: Math.round(Math.exp(-decayRates.Xiaomi * m) * (m === 0 ? 100 : 94)),
      Realme: Math.round(Math.exp(-decayRates.Realme * m) * (m === 0 ? 100 : 94))
    };
  });

  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-dark p-3 rounded-2xl border border-white/20 font-mono text-xs shadow-2xl">
          <div className="font-bold text-white mb-1">Month {data.month_number}</div>
          <div className="text-neon-lime text-sm font-bold">₹{data.price_inr.toLocaleString()}</div>
          <div className="text-neon-cyan">${data.price_usd} USD</div>
          <div className="text-gray-400 mt-1">Value Retained: {data.retention_pct}%</div>
        </div>
      );
    }
    return null;
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section id="depreciation-forecaster" className="py-6 px-2 sm:px-6 max-w-7xl mx-auto">
      {/* Brand Filter Pills */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all border cursor-pointer ${
              selectedBrand === b
                ? 'bg-[#00F5D4]/15 text-[#00F5D4] border-[#00F5D4] font-semibold shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                : 'bg-black/40 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Device Selector & Horizon Controller */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 md:p-8 stripe-cyan neon-shadow-cyan border border-white/15 space-y-6">
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold block mb-2">
              1. Choose Smartphone Model ({filteredCatalog.length} available):
            </label>
            <select
              value={selectedPhoneId}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/60 border border-white/20 font-bold text-white focus:outline-none focus:border-neon-cyan text-sm shadow-sm"
            >
              {filteredCatalog.map((phone) => (
                <option key={phone.id} value={phone.id} className="bg-gray-900 text-white">
                  {phone.brand}: {phone.model} (Launch: ₹{phone.launch_price_inr.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Hardware Specs Badge (Meta Shifu style) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-neon-cyan">
              <span className="flex items-center gap-1.5"><Smartphone size={14} /> {currentPhone.model}</span>
              <span className="text-gray-400 font-normal">{currentPhone.launch_year} Launch</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-300 pt-2 border-t border-white/10">
              <div>• RAM: {Math.round((currentPhone.specs.ram / 1024) * 10) / 10} GB</div>
              <div>• Battery: {currentPhone.specs.battery_power} mAh</div>
              <div>• Storage: {currentPhone.specs.int_memory} GB</div>
              <div>• Camera: {currentPhone.specs.pc} MP</div>
            </div>
            {currentPhone.specs.screen_desc && (
              <div className="text-[11px] font-mono text-gray-400 pt-1">
                Display: {currentPhone.specs.screen_desc}
              </div>
            )}
          </div>

          {/* Forecast Horizon Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-widest text-gray-600 font-bold flex items-center gap-1.5">
                <Calendar size={14} className="text-neon-magenta" /> 2. Forecast Horizon:
              </label>
              <span className="text-base font-mono font-bold text-neon-magenta bg-magenta-500/10 px-3 py-0.5 rounded-lg border border-neon-magenta/30">
                After {monthsAhead} Month{monthsAhead > 1 ? 's' : ''} ✨
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="18"
              step="1"
              value={monthsAhead}
              onChange={(e) => handleMonthsChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-neon-magenta"
            />
            <div className="flex justify-between text-[11px] font-mono text-gray-400 mt-1">
              <span>1 Month</span>
              <span className="text-neon-magenta font-bold">5 Months (Target)</span>
              <span>12 Months</span>
              <span>18 Months</span>
            </div>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold block mb-2">
              3. Device Physical Condition:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'like_new', label: 'Like New (Flawless)' },
                { id: 'good', label: 'Good (Minor wear)' },
                { id: 'fair', label: 'Fair (Scratches)' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleConditionChange(c.id)}
                  className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all border text-center cursor-pointer ${
                    condition === c.id
                      ? 'bg-neon-lime/20 text-neon-lime border-neon-lime shadow-[0_0_12px_rgba(57,255,20,0.35)]'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:border-gray-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {onApplySpecsToClassifier && (
              <button
                onClick={() => onApplySpecsToClassifier(currentPhone.specs)}
                className="w-full py-3.5 rounded-xl bg-neon-cyan/20 text-neon-cyan font-bold text-xs flex items-center justify-center gap-2 border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-all cursor-pointer shadow-lg"
              >
                <Sparkles size={14} className="text-neon-cyan" />
                Load {currentPhone.brand} Specs into 20-Spec Hardware Classifier
                <ArrowRight size={14} className="text-neon-magenta" />
              </button>
            )}

            <button
              onClick={handlePrintCertificate}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer shadow-sm"
            >
              <FileText size={14} className="text-neon-magenta" />
              Print / Save Valuation Certificate
            </button>
          </div>
        </div>

        {/* Right Column: Future Price Valuation Output Card & Trajectory Curve */}
        <div className="lg:col-span-7 space-y-6">
          {forecastResult ? (
            <div className="glass-dark rounded-3xl p-6 md:p-8 stripe-lime neon-shadow-lime border border-white/20 relative overflow-hidden">
              
              {/* Header Badges with View Mode Toggle */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-lime animate-ping"></span>
                  <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold">
                    Forecasting Verdict • {forecastResult.brand}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'single' ? 'multi-brand' : 'single')}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-neon-cyan border border-neon-cyan/40 font-bold cursor-pointer hover:bg-white/20"
                  >
                    {viewMode === 'single' ? 'Compare Brands 📊' : 'Single Phone View 📱'}
                  </button>
                  <span className="text-xs font-mono px-3 py-1 bg-neon-lime/20 text-neon-lime border border-neon-lime/40 rounded-full font-bold">
                    {forecastResult.forecast_horizon_months} MONTHS OUT
                  </span>
                </div>
              </div>

              {/* Main Numbers: Launch Price vs Predicted Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-white/10">
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase">Original Launch Value</div>
                  <div className="text-3xl font-mono font-bold text-gray-300 mt-1 line-through opacity-80">
                    ₹{forecastResult.launch_price_inr.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-gray-400">${forecastResult.launch_price_usd} USD</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xs font-mono text-neon-lime uppercase font-bold flex items-center gap-1.5">
                    <Sparkles size={14} /> Predicted Price After {forecastResult.forecast_horizon_months} Months:
                  </div>
                  <div className="text-4xl md:text-5xl font-mono font-bold text-neon-lime mt-1">
                    ₹{forecastResult.predicted_price_inr.toLocaleString()}
                  </div>
                  <div className="text-xs font-mono text-neon-cyan mt-1 font-bold">
                    ~${forecastResult.predicted_price_usd} USD • {forecastResult.retention_percentage}% Value Retained
                  </div>
                </div>
              </div>

              {/* Depreciation Stats Ribbon */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-gray-400">Total Loss</div>
                  <div className="text-neon-magenta font-bold mt-1 text-sm">
                    -₹{forecastResult.value_loss_inr.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-gray-400">Depreciation</div>
                  <div className="text-orange-400 font-bold mt-1 text-sm">
                    {forecastResult.depreciation_percentage}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-gray-400">Monthly Decay</div>
                  <div className="text-neon-cyan font-bold mt-1 text-sm">
                    ~{Math.round((forecastResult.depreciation_percentage / Math.max(1, forecastResult.forecast_horizon_months)) * 10) / 10}% / mo
                  </div>
                </div>
              </div>

              {/* Chart: Single Phone Area vs Multi-Brand Line Chart */}
              {viewMode === 'single' ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-gray-300 mb-2 font-bold">
                    <span>12-Month Value Decay Trajectory (INR):</span>
                    <span className="text-neon-cyan">Month 0 to Month 12</span>
                  </div>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastResult.trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="priceDecayGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#39ff14" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#00ffff" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 10 }} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="price_inr" 
                          stroke="#39ff14" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#priceDecayGrad)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-gray-300 mb-2 font-bold">
                    <span>Side-by-Side Brand Value Retention Rate (%):</span>
                    <span className="text-neon-cyan">Apple vs Google vs Samsung vs OnePlus vs Xiaomi</span>
                  </div>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={multiBrandTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                        <YAxis stroke="#9ca3af" domain={[40, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} unit="%" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#090D18',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                            padding: '12px 16px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            color: '#fff'
                          }}
                          itemStyle={{ padding: '2px 0' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace' }} />
                        <Line type="monotone" dataKey="Apple" stroke="#00F5D4" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="Google Pixel" stroke="#38BDF8" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="Samsung" stroke="#10B981" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="OnePlus" stroke="#EC4899" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Xiaomi" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Market Advice Footer */}
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300 font-mono">
                <span className="flex items-center gap-1.5 text-neon-cyan font-bold">
                  <AlertCircle size={14} /> Resale Window:
                </span>
                <span className="text-right text-gray-200">{forecastResult.market_advice}</span>
              </div>

            </div>
          ) : (
            <div className="glass-dark rounded-3xl p-12 border border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-300 font-mono">Computing depreciation matrix...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
