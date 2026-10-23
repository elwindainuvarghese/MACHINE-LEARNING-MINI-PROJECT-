import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import BentoGrid from "@/components/BentoGrid";
import { useHardware } from "@/context/HardwareContext";
import {
  SpotlightBentoCard,
  ScrambleText,
  ExplodedSmartphoneCAD,
  DataBusTrace,
} from "@/components/ui/cyber-telemetry-fx";
import {
  Cpu,
  Sparkles,
  Sliders,
  Trophy,
  Activity,
  Layers,
  ArrowRight,
  TrendingDown,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Server,
  Zap,
  Network,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    specs,
    setSpecs,
    activePreset,
    applyPreset,
    inference,
    activeTierMeta,
    backendConnected,
    PRESETS,
    theme,
  } = useHardware();

  const isLight = theme === "light";

  const handleCardSelect = (item) => {
    if (item.presetKey) {
      applyPreset(item.presetKey);
    }
    if (item.expId) {
      if (["exp6", "exp8", "exp9"].includes(item.expId)) {
        navigate("/manifold");
      } else {
        navigate("/arena");
      }
    }
  };

  const handleJumpToSection = (sectionId) => {
    if (sectionId === "predictor") navigate("/predict");
    else if (sectionId === "arena") navigate("/arena");
    else if (sectionId === "clustering" || sectionId === "syllabus-lab") navigate("/manifold");
    else if (sectionId === "depreciation-forecaster") navigate("/resale");
    else if (sectionId === "pricing-tiers") navigate("/guide");
    else navigate("/predict");
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ── 1. 3D PERSPECTIVE TUNNEL HERO ── */}
      <PerspectiveTunnelHero
        activeAccent={activeTierMeta.accent}
        activeTierLabel={activeTierMeta.name}
        onSelectCard={handleCardSelect}
        onJumpToSection={handleJumpToSection}
      />

      {/* Subtle Data Activity Line */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <DataBusTrace active={true} accent={activeTierMeta.accent} />
      </div>

      {/* ── 2. SYSTEM MODULE PORTALS (6 BESPOKE SPOTLIGHT TILES) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest ${
              isLight ? "border-slate-200 bg-white/80 text-slate-700 shadow-xs" : "border-white/10 bg-white/[0.03] text-white/70"
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F5D4]" />
              <span>Modular Architecture</span>
            </div>
            <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-4xl ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              System Modules & Research Labs
            </h2>
            <p className={`mt-1 text-xs sm:text-sm font-sans max-w-2xl ${
              isLight ? "text-slate-600" : "text-white/55"
            }`}>
              Select any workspace module below to evaluate model benchmarks, test interactive hardware configurations, or project 3D manifold embeddings.
            </p>
          </div>

          <div className={`flex items-center gap-2 font-mono text-xs ${
            isLight ? "text-slate-600" : "text-white/50"
          }`}>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 Canonical Engines Synchronized</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: 20-Spec Hardware Predictor */}
          <Link to="/predict" className="block group">
            <SpotlightBentoCard accentColor="#00F5D4" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white/5 border-white/10 text-[#00F5D4]"
                  }`}>
                    <Sliders className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
                    isLight ? "border-slate-200 bg-slate-100 text-slate-700 font-medium" : "border-white/10 bg-black/40 text-white/60"
                  }`}>
                    /predict
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isLight ? "text-slate-900 group-hover:text-emerald-700" : "text-white group-hover:text-[#00F5D4]"
                }`}>
                  20-Feature Hardware Configurator
                </h3>
                <p className={`mt-2 text-xs leading-relaxed font-sans ${
                  isLight ? "text-slate-600" : "text-white/60"
                }`}>
                  Real-time specification tuner with live exploded CAD phone schematic, multi-model consensus voting, and DBSCAN density anomaly alerts.
                </p>
              </div>
              <div className={`mt-5 flex items-center justify-between text-xs font-mono font-medium pt-3 border-t ${
                isLight ? "border-slate-200 text-emerald-700" : "border-white/5 text-[#00F5D4]"
              }`}>
                <span>Configure Specs</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 2: Supervised Model Arena */}
          <Link to="/arena" className="block group">
            <SpotlightBentoCard accentColor="#A855F7" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isLight ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-white/5 border-white/10 text-purple-400"
                  }`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
                    isLight ? "border-slate-200 bg-slate-100 text-slate-700 font-medium" : "border-white/10 bg-black/40 text-white/60"
                  }`}>
                    /arena
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isLight ? "text-slate-900 group-hover:text-purple-700" : "text-white group-hover:text-purple-300"
                }`}>
                  Supervised Benchmark Arena
                </h3>
                <p className={`mt-2 text-xs leading-relaxed font-sans ${
                  isLight ? "text-slate-600" : "text-white/60"
                }`}>
                  Rigorous empirical comparison of Multinomial Logistic Regression, CART Decision Trees (Gini vs. Entropy), Random Forest, and RBF Support Vector Machines.
                </p>
              </div>
              <div className={`mt-5 flex items-center justify-between text-xs font-mono font-medium pt-3 border-t ${
                isLight ? "border-slate-200 text-purple-700" : "border-white/5 text-purple-400"
              }`}>
                <span>View Benchmarks</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 3: 3D Manifolds & Topology Lab */}
          <Link to="/manifold" className="block group">
            <SpotlightBentoCard accentColor="#EC4899" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isLight ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-white/5 border-white/10 text-pink-400"
                  }`}>
                    <Network className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
                    isLight ? "border-slate-200 bg-slate-100 text-slate-700 font-medium" : "border-white/10 bg-black/40 text-white/60"
                  }`}>
                    /manifold
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isLight ? "text-slate-900 group-hover:text-pink-700" : "text-white group-hover:text-pink-300"
                }`}>
                  3D Manifolds & Cluster Topology
                </h3>
                <p className={`mt-2 text-xs leading-relaxed font-sans ${
                  isLight ? "text-slate-600" : "text-white/60"
                }`}>
                  Interactive 3D scatter projections comparing PCA, LDA, and TruncatedSVD dimensionality reduction alongside Minimum Spanning Tree graph edges.
                </p>
              </div>
              <div className={`mt-5 flex items-center justify-between text-xs font-mono font-medium pt-3 border-t ${
                isLight ? "border-slate-200 text-pink-700" : "border-white/5 text-pink-400"
              }`}>
                <span>Inspect Manifolds</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 4: 5-Month Resale Forecaster */}
          <Link to="/resale" className="block group">
            <SpotlightBentoCard accentColor="#10B981" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isLight ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white/5 border-white/10 text-emerald-400"
                  }`}>
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
                    isLight ? "border-slate-200 bg-slate-100 text-slate-700 font-medium" : "border-white/10 bg-black/40 text-white/60"
                  }`}>
                    /resale
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isLight ? "text-slate-900 group-hover:text-emerald-700" : "text-white group-hover:text-emerald-300"
                }`}>
                  Secondary Market Valuation
                </h3>
                <p className={`mt-2 text-xs leading-relaxed font-sans ${
                  isLight ? "text-slate-600" : "text-white/60"
                }`}>
                  Mathematical exponential depreciation model forecasting multi-brand device resale trajectory across Samsung, Apple, Xiaomi, OnePlus, and Google Pixel.
                </p>
              </div>
              <div className={`mt-5 flex items-center justify-between text-xs font-mono font-medium pt-3 border-t ${
                isLight ? "border-slate-200 text-emerald-700" : "border-white/5 text-emerald-400"
              }`}>
                <span>Forecast Resale</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 5: Hardware Dataset Specification */}
          <Link to="/guide" className="block group">
            <SpotlightBentoCard accentColor="#38BDF8" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isLight ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-white/5 border-white/10 text-sky-400"
                  }`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${
                    isLight ? "border-slate-200 bg-slate-100 text-slate-700 font-medium" : "border-white/10 bg-black/40 text-white/60"
                  }`}>
                    /guide
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isLight ? "text-slate-900 group-hover:text-sky-700" : "text-white group-hover:text-sky-300"
                }`}>
                  Hardware Dataset Specifications
                </h3>
                <p className={`mt-2 text-xs leading-relaxed font-sans ${
                  isLight ? "text-slate-600" : "text-white/60"
                }`}>
                  Complete feature dictionary covering all 20 Kaggle hardware dimensions and the official 4-tier mobile pricing taxonomy definitions.
                </p>
              </div>
              <div className={`mt-5 flex items-center justify-between text-xs font-mono font-medium pt-3 border-t ${
                isLight ? "border-slate-200 text-sky-700" : "border-white/5 text-sky-400"
              }`}>
                <span>Review Specs</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 6: Live Consensus State Tile */}
          <SpotlightBentoCard accentColor={activeTierMeta.accent} className="h-full flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${
                  isLight ? "bg-slate-100 text-slate-800 border border-slate-200 font-medium" : "bg-white/10 text-white"
                }`}>
                  <Zap className="h-3 w-3" style={{ color: activeTierMeta.accent }} />
                  Live State
                </span>
                <span className={`font-mono text-xs ${isLight ? "text-slate-600" : "text-white/60"}`}>
                  Continuous: <strong className={isLight ? "text-slate-900" : "text-white"}><ScrambleText text={inference.continuousIndex} /></strong>
                </span>
              </div>
              
              <div className="mt-4">
                <p className={`font-mono text-[10px] uppercase tracking-wider ${isLight ? "text-slate-500 font-medium" : "text-white/45"}`}>
                  Consensus Classification
                </p>
                <h3 className={`text-2xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                  <ScrambleText text={activeTierMeta.name} duration={300} />
                </h3>
                <p
                  className="mt-0.5 font-mono text-xs font-semibold"
                  style={{ color: activeTierMeta.accent }}
                >
                  <ScrambleText text={activeTierMeta.bracket} duration={260} />
                </p>
                <p className={`mt-2 text-xs font-mono ${isLight ? "text-slate-500 font-medium" : "text-white/50"}`}>
                  RAM: {specs.ram}MB · Bat: {specs.battery_power}mAh · Cores: {specs.n_cores}
                </p>
              </div>
            </div>

            <div className={`mt-5 flex items-center justify-between border-t pt-3 ${isLight ? "border-slate-200" : "border-white/10"}`}>
              <span
                className={`font-mono text-xs font-semibold ${
                  inference.isOutlier
                    ? isLight ? "text-rose-700" : "text-rose-400"
                    : isLight ? "text-emerald-700" : "text-emerald-400"
                }`}
              >
                {inference.isOutlier ? "⚠ DBSCAN Outlier" : "✓ Inlier Manifold"}
              </span>
              <Link
                to="/predict"
                className={`inline-flex items-center gap-1 font-mono text-xs transition ${
                  isLight ? "text-slate-700 hover:text-slate-900 font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                <span>Edit Specs</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </SpotlightBentoCard>
        </div>
      </section>

      {/* ── 3. HARDWARE SPECIFICATION BLUEPRINT (BENTO GRID) ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#00F5D4]">
              Hardware Architecture Overview
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              20-Feature Silicon Matrix
            </h2>
          </div>
          <Link
            to="/predict"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white hover:border-[#00F5D4] transition"
          >
            <span>Interactive Configurator</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#00F5D4]" />
          </Link>
        </div>
        <BentoGrid specs={specs} />
      </section>
    </div>
  );
}
