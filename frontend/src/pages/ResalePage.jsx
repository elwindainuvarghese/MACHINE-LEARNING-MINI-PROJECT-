import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DepreciationForecaster from "@/components/DepreciationForecaster";
import { useHardware } from "@/context/HardwareContext";
import { SpotlightBentoCard } from "@/components/ui/cyber-telemetry-fx";
import {
  TrendingDown,
  Sparkles,
  ArrowRight,
  Sliders,
  Trophy,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function ResalePage() {
  const navigate = useNavigate();
  const { applySpecsToClassifier } = useHardware();

  const handleApplySpecs = (phoneSpecs) => {
    applySpecsToClassifier(phoneSpecs);
    navigate("/predict");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Secondary Market Valuation Engine</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Multi-Brand 5-Month Resale Valuation Forecaster
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed font-sans">
            Predict the secondary market price and residual resale value for phones from <strong>Samsung, Apple, Xiaomi, OnePlus, Google Pixel, Realme, Vivo, and Motorola</strong>. Compute dynamic monthly depreciation curves across 1 to 18 months, generate certified valuation slips, and instantly bridge phone specs into the 20-Feature Classifier.
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
            to="/guide"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-sky-400 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            Pricing Tiers Taxonomy
          </Link>
        </div>
      </div>

      {/* ── FULL DEPRECIATION FORECASTER COMPONENT ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl">
        <DepreciationForecaster onApplySpecsToClassifier={handleApplySpecs} />
      </div>

      {/* ── METHODOLOGY EXPLANATION (SPOTLIGHT BENTO CARD) ── */}
      <SpotlightBentoCard accentColor="#34D399" className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            Secondary Market Depreciation Mechanics & Formula
          </h3>
        </div>
        <p className="text-xs text-white/70 leading-relaxed max-w-4xl font-sans">
          The resale forecasting algorithm computes expected residual value using an exponential decay model with brand-specific retention coefficients (λ_brand), hardware premium weighting (α_ram, battery), and monthly seasonal release discounts.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs font-sans">
            <span className="font-bold text-white font-mono">Apple iOS Ecosystem:</span>
            <p className="mt-1 text-white/65 leading-relaxed">
              Lowest depreciation (~1.4% / month). Exceptional residual value retention due to long-term iOS update support and brand loyalty.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs font-sans">
            <span className="font-bold text-white font-mono">Samsung Flagships:</span>
            <p className="mt-1 text-white/65 leading-relaxed">
              Moderate steady decay (~2.2% / month). Strong secondary demand stabilized by 7 years of Android platform upgrades and trade-in programs.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs font-sans">
            <span className="font-bold text-white font-mono">Xiaomi / OnePlus Mid-Tier:</span>
            <p className="mt-1 text-white/65 leading-relaxed">
              Rapid initial decay (~2.9% / month) driven by aggressive bi-annual product launch cycles and intense price-to-performance competition.
            </p>
          </div>
        </div>
      </SpotlightBentoCard>
    </div>
  );
}
