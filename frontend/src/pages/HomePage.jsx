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
  RotateCcw,
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
  } = useHardware();

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
    <div className="space-y-16">
      {/* ── 1. 3D PERSPECTIVE TUNNEL HERO ── */}
      <PerspectiveTunnelHero
        activeAccent={activeTierMeta.accent}
        activeTierLabel={activeTierMeta.name}
        onSelectCard={handleCardSelect}
        onJumpToSection={handleJumpToSection}
      />

      {/* PCB Data Bus Pulse Header */}
      <div className="mx-auto max-w-7xl px-6">
        <DataBusTrace active={true} accent={activeTierMeta.accent} />
      </div>

      {/* ── 2. QUICK PORTAL NAVIGATION MATRIX (6 BESPOKE SPOTLIGHT TILES) ── */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#00F5D4]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Anti-AI Boutique Architecture</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Dedicated Section Portals —
            </h2>
            <p className="mt-1 text-sm text-white/60 font-sans">
              Cursor-tracked laser border spotlight cards powered by GPU shaders. Hover over any tile to illuminate its specular rim.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/60">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All 8 Lab Modules Active & Synced
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: 20-Spec Hardware Predictor */}
          <Link to="/predict" className="block group">
            <SpotlightBentoCard accentColor="#00F5D4" className="h-full flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F5D4]/15 text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)]">
                    <Sliders className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-[#00F5D4]">
                    /predict
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                  20-Spec Hardware Synthesizer
                </h3>
                <p className="mt-2 text-xs text-white/65 leading-relaxed font-sans">
                  Synthesize 14 continuous parameters + 6 connectivity flags in real time with continuous regressor scores, Softmax probability bars, and live exploded CAD smartphone schematics.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-semibold text-[#00F5D4] pt-3 border-t border-white/5">
                <span>Launch Synthesizer</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 2: Supervised Model Arena */}
          <Link to="/arena" className="block group">
            <SpotlightBentoCard accentColor="#A855F7" className="h-full flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-purple-400">
                    /arena
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Supervised Model Arena
                </h3>
                <p className="mt-2 text-xs text-white/65 leading-relaxed font-sans">
                  Empirical benchmarking of Linear vs. Logistic Regression, CART Decision Trees (Gini vs. Entropy delta), Ensemble Bagging vs. Boosting, and RBF Support Vector Machines (96.5%).
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-semibold text-purple-400 pt-3 border-t border-white/5">
                <span>Enter Arena</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 3: 3D Manifolds & Topology Lab */}
          <Link to="/manifold" className="block group">
            <SpotlightBentoCard accentColor="#FF2A85" className="h-full flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-[#FF2A85] shadow-[0_0_15px_rgba(255,42,133,0.2)]">
                    <Network className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-[#FF2A85]">
                    /manifold
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#FF2A85] transition-colors">
                  3D Manifolds & Topology Lab
                </h3>
                <p className="mt-2 text-xs text-white/65 leading-relaxed font-sans">
                  Plotly WebGL 3D projection engine with PCA, LDA, TruncatedSVD, Minimum Spanning Tree (MST) Euclidean edges, and DBSCAN density outlier inspection.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FF2A85] pt-3 border-t border-white/5">
                <span>Explore Manifolds</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 4: 5-Month Resale Forecaster */}
          <Link to="/resale" className="block group">
            <SpotlightBentoCard accentColor="#34D399" className="h-full flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-emerald-400">
                    /resale
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  5-Month Resale Forecaster
                </h3>
                <p className="mt-2 text-xs text-white/65 leading-relaxed font-sans">
                  Multi-brand secondary market valuation simulator for Samsung, Apple, Xiaomi, OnePlus, and Google Pixel with 1–18 month horizon and certificate exporter.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 pt-3 border-t border-white/5">
                <span>Forecast Valuation</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 5: Viva Exam & Syllabus Defense */}
          <Link to="/guide" className="block group">
            <SpotlightBentoCard accentColor="#38BDF8" className="h-full flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-sky-400">
                    /guide
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  Pricing Tiers & Viva Defense
                </h3>
                <p className="mt-2 text-xs text-white/65 leading-relaxed font-sans">
                  4 Physical market tier mappings, mathematical justifications, and comprehensive architecture defense Q&A covering all 8 intelligence engines.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-400 pt-3 border-t border-white/5">
                <span>Open Defense Guide</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
              </div>
            </SpotlightBentoCard>
          </Link>

          {/* Card 6: Live Consensus Telemetry Badge */}
          <SpotlightBentoCard accentColor={activeTierMeta.accent} className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white">
                  <Zap className="h-3 w-3" style={{ color: activeTierMeta.accent }} />
                  Telemetry State
                </span>
                <span className="font-mono text-xs text-white/70">
                  Continuous Score: <strong className="text-white"><ScrambleText text={inference.continuousIndex} /></strong>
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-white/50">
                Active Target Classification
              </p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                <ScrambleText text={activeTierMeta.name} duration={300} />
              </h3>
              <p
                className="mt-0.5 font-mono text-sm font-semibold"
                style={{ color: activeTierMeta.accent }}
              >
                <ScrambleText text={activeTierMeta.bracket} duration={260} />
              </p>
              <p className="mt-2 text-xs font-mono text-white/60">
                RAM: {specs.ram}MB · Bat: {specs.battery_power}mAh · Storage: {specs.int_memory}GB
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <span
                className={`font-mono text-xs font-bold ${
                  inference.isOutlier ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {inference.isOutlier ? "⚠ DBSCAN Outlier (-1)" : "✓ Core Inlier"}
              </span>
              <Link
                to="/predict"
                className="inline-flex items-center gap-1 font-mono text-xs text-white hover:underline"
              >
                Tweak Specs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </SpotlightBentoCard>
        </div>
      </section>

      {/* ── 3. SILICON BLUEPRINT OVERVIEW (BENTO GRID) ── */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#00F5D4]">
              Hardware Architecture Blueprint
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              20-Feature Silicon Matrix Overview
            </h2>
          </div>
          <Link
            to="/predict"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-white hover:border-[#00F5D4] transition"
          >
            Open Interactive Controls <ArrowRight className="h-3.5 w-3.5 text-[#00F5D4]" />
          </Link>
        </div>
        <BentoGrid specs={specs} />
      </section>
    </div>
  );
}
