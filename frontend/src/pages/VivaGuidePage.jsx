import React from "react";
import { Link } from "react-router-dom";
import PricingTiers from "@/components/PricingTiers";
import { useHardware } from "@/context/HardwareContext";
import {
  BookOpen,
  Sliders,
  Trophy,
  Database,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Binary,
  Radio,
  Eye,
  BatteryCharging,
  Maximize2,
  HardDrive
} from "lucide-react";

export default function VivaGuidePage() {
  const { inference } = useHardware();

  const datasetFeatures = [
    { name: "battery_power", desc: "Total energy stored in mAh", type: "Integer (500 – 2000)", category: "Hardware", icon: BatteryCharging },
    { name: "blue", desc: "Has Bluetooth support (0 = No, 1 = Yes)", type: "Binary (0/1)", category: "Connectivity", icon: Radio },
    { name: "clock_speed", desc: "Speed at which microprocessor executes", type: "Float (0.5 – 3.0 GHz)", category: "Processor", icon: Cpu },
    { name: "dual_sim", desc: "Dual SIM card support", type: "Binary (0/1)", category: "Connectivity", icon: Radio },
    { name: "fc", desc: "Front Camera megapixels", type: "Integer (0 – 19 MP)", category: "Optics", icon: Eye },
    { name: "four_g", desc: "Has 4G LTE network band", type: "Binary (0/1)", category: "Connectivity", icon: Radio },
    { name: "int_memory", desc: "Internal Memory in Gigabytes", type: "Integer (2 – 64 GB)", category: "Storage", icon: HardDrive },
    { name: "m_dep", desc: "Mobile Depth in cm", type: "Float (0.1 – 1.0 cm)", category: "Chassis", icon: Maximize2 },
    { name: "mobile_wt", desc: "Weight of mobile phone in grams", type: "Integer (80 – 200 g)", category: "Chassis", icon: Layers },
    { name: "n_cores", desc: "Number of processor cores", type: "Integer (1 – 8 Cores)", category: "Processor", icon: Cpu },
    { name: "pc", desc: "Primary Camera megapixels", type: "Integer (0 – 20 MP)", category: "Optics", icon: Eye },
    { name: "px_height", desc: "Pixel Resolution Height", type: "Integer (0 – 1960 px)", category: "Display", icon: Maximize2 },
    { name: "px_width", desc: "Pixel Resolution Width", type: "Integer (500 – 1980 px)", category: "Display", icon: Maximize2 },
    { name: "ram", desc: "Random Access Memory in Megabytes", type: "Integer (256 – 4000 MB)", category: "Memory", icon: Cpu },
    { name: "sc_h", desc: "Screen Height in cm", type: "Integer (5 – 19 cm)", category: "Display", icon: Maximize2 },
    { name: "sc_w", desc: "Screen Width in cm", type: "Integer (0 – 18 cm)", category: "Display", icon: Maximize2 },
    { name: "talk_time", desc: "Longest battery talk time in hours", type: "Integer (2 – 20 hrs)", category: "Battery", icon: BatteryCharging },
    { name: "three_g", desc: "Has 3G network connectivity", type: "Binary (0/1)", category: "Connectivity", icon: Radio },
    { name: "touch_screen", desc: "Has touchscreen support", type: "Binary (0/1)", category: "Display", icon: Sparkles },
    { name: "wifi", desc: "Has Wi-Fi wireless networking", type: "Binary (0/1)", category: "Connectivity", icon: Radio },
    { name: "price_range", desc: "Target Class: 0 (Low), 1 (Medium), 2 (High), 3 (Very High)", type: "Target (0 – 3)", category: "Target Label", icon: ShieldCheck }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-sky-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Silicon Hardware & Pricing Taxonomy</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Hardware Taxonomy & Dataset Matrix
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed font-sans">
            Calibrated pricing tier definitions and the comprehensive 20-feature silicon hardware specification matrix powering the multi-model classification and market segmentation engines.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-[#00F5D4] transition"
          >
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" />
            Return to Classifier
          </Link>
          <Link
            to="/arena"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-purple-400 transition"
          >
            <Trophy className="h-3.5 w-3.5 text-purple-400" />
            Model Arena
          </Link>
        </div>
      </div>

      {/* ── 1. THE 4 CLASSIFICATION PRICING TIERS ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl">
        <PricingTiers currentPredictionTier={inference.consensusTier} />
      </div>

      {/* ── 2. 20-FEATURE KAGGLE DATASET SCHEMA REFERENCE ── */}
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-purple-400">
              <Database className="h-3.5 w-3.5" />
              <span>Dataset Specification</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Silicon Hardware Feature Matrix (20 Features + Target)
            </h2>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Complete hardware schema calibrated across supervised classifiers and unsupervised manifold projections.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-white/70">
              <span className="text-white/40">FEATURES:</span> <strong className="text-[#00F5D4]">20 HARDWARE</strong>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-white/70">
              <span className="text-white/40">TARGET:</span> <strong className="text-[#FF2A85]">4 TIERS (0-3)</strong>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/45">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Value Range / Type</th>
                <th className="py-3 px-4">Physical Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {datasetFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <tr key={f.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#00F5D4]">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-white/40" />
                        <span>{f.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/60">
                      <span className="rounded-md bg-white/5 px-2 py-0.5 border border-white/10 text-[11px]">
                        {f.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/75">{f.type}</td>
                    <td className="py-3 px-4 text-white/90 font-sans">{f.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
