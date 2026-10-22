import React from "react";
import { Link } from "react-router-dom";
import { useHardware, PRESETS, TIER_META } from "@/context/HardwareContext";
import {
  SpotlightBentoCard,
  ScrambleText,
  ExplodedSmartphoneCAD,
  DbscanSonarRadar,
  PrecisionRulerSlider,
  DataBusTrace,
} from "@/components/ui/cyber-telemetry-fx";
import {
  Sliders,
  Sparkles,
  Wifi,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Layers,
  Network,
  Cpu,
  Server,
  Zap,
  Activity,
  HardDrive,
  Compass,
} from "lucide-react";

export default function PredictorPage() {
  const {
    specs,
    setSpecs,
    activePreset,
    setActivePreset,
    applyPreset,
    inference,
    activeTierMeta,
    backendConnected,
    updateSpec,
    toggleBinary,
  } = useHardware();

  const slidersList = [
    {
      key: "ram",
      label: "RAM (`ram`)",
      unit: "MB",
      min: 256,
      max: 4000,
      step: 32,
      accent: "#00F5D4",
      badge: "68.2% Imp.",
    },
    {
      key: "battery_power",
      label: "Battery (`battery_power`)",
      unit: "mAh",
      min: 500,
      max: 2000,
      step: 25,
      accent: "#34D399",
      badge: "17.9% Imp.",
    },
    {
      key: "px_width",
      label: "Pixel Width (`px_width`)",
      unit: "px",
      min: 500,
      max: 1980,
      step: 20,
      accent: "#C084FC",
      badge: "Display Matrix",
    },
    {
      key: "px_height",
      label: "Pixel Height (`px_height`)",
      unit: "px",
      min: 0,
      max: 1960,
      step: 20,
      accent: "#F472B6",
      badge: "Display Matrix",
    },
    {
      key: "int_memory",
      label: "Internal Memory (`int_memory`)",
      unit: "GB",
      min: 2,
      max: 64,
      step: 2,
      accent: "#38BDF8",
      badge: "NVMe Storage",
    },
    {
      key: "clock_speed",
      label: "Clock Speed (`clock_speed`)",
      unit: "GHz",
      min: 0.5,
      max: 3.0,
      step: 0.1,
      accent: "#FBBF24",
      badge: "SoC Frequency",
    },
    {
      key: "n_cores",
      label: "CPU Cores (`n_cores`)",
      unit: "Cores",
      min: 1,
      max: 8,
      step: 1,
      accent: "#F59E0B",
      badge: "Silicon Die",
    },
    {
      key: "pc",
      label: "Primary Camera (`pc`)",
      unit: "MP",
      min: 0,
      max: 20,
      step: 1,
      accent: "#FB7185",
      badge: "Main Optics",
    },
    {
      key: "fc",
      label: "Front Camera (`fc`)",
      unit: "MP",
      min: 0,
      max: 19,
      step: 1,
      accent: "#FB7185",
      badge: "Selfie Optics",
    },
    {
      key: "mobile_wt",
      label: "Weight (`mobile_wt`)",
      unit: "g",
      min: 80,
      max: 200,
      step: 2,
      accent: "#2DD4BF",
      badge: "Chassis Inertia",
    },
    {
      key: "sc_h",
      label: "Screen Height (`sc_h`)",
      unit: "cm",
      min: 5,
      max: 19,
      step: 1,
      accent: "#818CF8",
      badge: "Panel Dimension",
    },
    {
      key: "sc_w",
      label: "Screen Width (`sc_w`)",
      unit: "cm",
      min: 0,
      max: 18,
      step: 1,
      accent: "#818CF8",
      badge: "Panel Dimension",
    },
    {
      key: "m_dep",
      label: "Mobile Depth (`m_dep`)",
      unit: "cm",
      min: 0.1,
      max: 1.0,
      step: 0.1,
      accent: "#22D3EE",
      badge: "Profile Z-Height",
    },
    {
      key: "talk_time",
      label: "Talk Time (`talk_time`)",
      unit: "hrs",
      min: 2,
      max: 20,
      step: 1,
      accent: "#34D399",
      badge: "Discharge Time",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-white/70">
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" />
            <span>Interactive Hardware Configurator</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            20-Feature Hardware Configurator & CAD Model
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed font-sans">
            Adjust device parameters in real time. The multi-model consensus engine evaluates Linear Regression, Decision Trees, Random Forest, Gradient Boosting, and Support Vector Machines, while DBSCAN acts as an automated density anomaly guardrail.
          </p>
        </div>

        {/* 5 Quick Hardware Presets */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`rounded-xl border px-3 py-2 text-left text-xs transition cursor-pointer font-mono ${
                activePreset === key
                  ? "border-[#00F5D4] bg-[#00F5D4]/15 text-white shadow-[0_0_15px_rgba(0,245,212,0.2)] font-semibold"
                  : "border-white/10 bg-[#070A11] text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="font-semibold text-xs">{item.label}</div>
              <div className="text-[10px] opacity-55">
                {item.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PCB Data Bus Pulse Strip */}
      <div className="relative">
        <DataBusTrace active={true} accent={activeTierMeta.accent} />
      </div>

      {/* ── MAIN WORKBENCH: BENTO TILE 1 (CONFIGURATOR & CAD) + BENTO TILE 2 (CONSENSUS & DBSCAN) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* TILE 1: 20-SPEC HARDWARE CONFIGURATOR (7 COLS) */}
        <SpotlightBentoCard className="lg:col-span-7 space-y-6" accentColor={activeTierMeta.accent}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="h-5 w-5 text-[#00F5D4]" />
              <div>
                <h3 className="font-bold text-white text-base">
                  Hardware Telemetry Matrix
                </h3>
                <span className="font-mono text-[11px] text-white/50">
                  All 20 Kaggle Silicon Parameters
                </span>
              </div>
            </div>
            <span className="rounded-full border border-[#00F5D4]/30 bg-[#00F5D4]/10 px-3 py-1 font-mono text-[11px] text-[#00F5D4]">
              KNN Missing-Data Imputer (k=5) Active
            </span>
          </div>

          {/* 14 Continuous Sliders in Precision Ruler Format */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {slidersList.map((slider) => (
              <PrecisionRulerSlider
                key={slider.key}
                label={slider.label}
                value={specs[slider.key]}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                unit={slider.unit}
                badge={slider.badge}
                accent={slider.accent}
                onChange={(v) => updateSpec(slider.key, v)}
              />
            ))}
          </div>

          {/* 6 Binary Connectivity Toggles */}
          <div className="border-t border-white/10 pt-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-white/50">
              Binary Radio & Physical Sensor Buses (6 Features)
            </p>
            <div className="flex flex-wrap gap-2.5">
              {[
                ["four_g", "4G LTE Radio (`four_g`)"],
                ["three_g", "3G Baseband (`three_g`)"],
                ["wifi", "Wi-Fi 802.11 (`wifi`)"],
                ["blue", "Bluetooth 5.2 (`blue`)"],
                ["dual_sim", "Dual SIM Tray (`dual_sim`)"],
                ["touch_screen", "Digitizer (`touch_screen`)"],
              ].map(([field, label]) => {
                const active = specs[field] === 1;
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleBinary(field)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-mono font-medium transition cursor-pointer ${
                      active
                        ? "border-[#00F5D4] bg-[#00F5D4]/20 text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.25)]"
                        : "border-white/10 bg-black/50 text-white/40 hover:text-white"
                    }`}
                  >
                    <Wifi className="h-3 w-3" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </SpotlightBentoCard>

        {/* TILE 2: LIVE EXPLODED CAD SMARTPHONE + CONSENSUS RADAR (5 COLS) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Live Exploded CAD Schematic */}
          <ExplodedSmartphoneCAD
            ram={specs.ram}
            battery={specs.battery_power}
            cores={specs.n_cores}
            scH={specs.sc_h}
            scW={specs.sc_w}
            pxW={specs.px_width}
            pxH={specs.px_height}
            fourG={specs.four_g === 1}
            isOutlier={inference.isOutlier}
            accent={activeTierMeta.accent}
          />

          {/* Consensus Verdict Spotlight Card */}
          <SpotlightBentoCard
            accentColor={activeTierMeta.accent}
            className={`border ${activeTierMeta.border} space-y-6`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white">
                <Sparkles className="h-3.5 w-3.5" style={{ color: activeTierMeta.accent }} />
                Ensemble Consensus Engine
              </span>
              <span className="font-mono text-xs text-white/70">
                Continuous Score:{" "}
                <strong className="text-white">
                  <ScrambleText text={`${inference.continuousIndex} / 3.00`} />
                </strong>
              </span>
            </div>

            {/* Target Class Box */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Predicted Target Class (`price_range`)
              </p>
              <h3 className="mt-1 text-3xl font-black text-white sm:text-4xl tracking-tight">
                <ScrambleText text={activeTierMeta.name} duration={320} />
              </h3>
              <p
                className="mt-1 font-mono text-base font-bold"
                style={{ color: activeTierMeta.accent }}
              >
                Market Bracket: <ScrambleText text={activeTierMeta.bracket} duration={280} />
              </p>
            </div>

            {/* Probability Gauges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>POSTERIOR PROBABILITY DISTRIBUTION</span>
                <span>MULTINOMIAL SOFTMAX</span>
              </div>
              {TIER_META.map((t, idx) => (
                <div key={t.tier} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/80">{t.name}</span>
                    <span className="font-bold text-white tabular-nums">
                      <ScrambleText text={`${inference.probs[idx]}%`} duration={220} />
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-black/80 border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${inference.probs[idx]}%`,
                        backgroundColor: t.accent,
                        boxShadow: `0 0 10px ${t.accent}80`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Per-Model Leaderboard Votes */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                Consensus Algorithm Ballots (Supervised Models)
              </p>
              {inference.modelVotes.map((m) => (
                <div
                  key={m.model}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-black/50 px-3.5 py-2 text-xs font-mono"
                >
                  <span className="text-white/80">{m.model}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">
                      {m.acc}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: TIER_META[m.tier]?.accent || "#00F5D4" }}
                    >
                      Tier {m.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* DBSCAN Sonar Radar Outlier Guardrail */}
            <div className="pt-2">
              <DbscanSonarRadar
                isOutlier={inference.isOutlier}
                score={inference.isOutlier ? 78.4 : 3.2}
                reason={
                  inference.isOutlier
                    ? "Anomalous hardware spec detected! High RAM paired with <650mAh battery or 0cm screen width."
                    : `Minimum Spanning Tree (MST): Phone assigned to "${inference.mstArchetype}".`
                }
              />
            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/manifold"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono text-white hover:border-[#00F5D4] transition"
              >
                <Network className="h-3.5 w-3.5 text-[#00F5D4]" />
                3D Manifold Lab
              </Link>
              <Link
                to="/resale"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-mono text-white hover:border-emerald-400 transition"
              >
                <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                5-Month Resale
              </Link>
            </div>
          </SpotlightBentoCard>
        </div>
      </div>
    </div>
  );
}
