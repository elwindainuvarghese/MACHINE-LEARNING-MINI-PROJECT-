import React from "react";
import { Link } from "react-router-dom";
import ModelArena from "@/components/ModelArena";
import { useHardware } from "@/context/HardwareContext";
import { SpotlightBentoCard } from "@/components/ui/cyber-telemetry-fx";
import {
  Trophy,
  Zap,
  Scale,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Network,
  BookOpen,
} from "lucide-react";

export default function ArenaPage() {
  const { benchmarksData } = useHardware();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-purple-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>Supervised Model Arena</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Algorithmic Arena & Split Criteria Benchmark Lab
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed">
            Exhaustive empirical comparison uniting canonical Machine Learning architectures: Baseline Linear vs. Logistic Regression, CART Classification & Regression Trees with Gini vs. Entropy criteria, Ensemble Bagging vs. Boosting, and Support Vector Machines with Kernel Tricks.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-[#00F5D4] transition"
          >
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" />
            Test Live Specs
          </Link>
          <Link
            to="/manifold"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-[#FF2A85] transition"
          >
            <Network className="h-3.5 w-3.5 text-[#FF2A85]" />
            3D Manifold Lab
          </Link>
        </div>
      </div>

      {/* ── FULL MODEL ARENA LAB BENCHMARK COMPONENT ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl">
        <ModelArena benchmarksData={benchmarksData} />
      </div>

      {/* ── SYLLABUS LAB SYNTHESIS SPOTLIGHT CARDS ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SpotlightBentoCard accentColor="#38BDF8" className="space-y-3">
          <div className="flex items-center gap-2 text-sky-400">
            <Scale className="h-5 w-5" />
            <h3 className="font-bold text-white text-sm">Continuous vs. Softmax Regression</h3>
          </div>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            Multiple Linear Regression treats price tier as a continuum ($R^2 = 0.918$). When discretized at half-integer cutoffs, it scores 89.5% accuracy, but Multinomial Logistic cross-entropy reaches 94.25% by modeling sharp class boundaries.
          </p>
        </SpotlightBentoCard>

        <SpotlightBentoCard accentColor="#F59E0B" className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <GitBranch className="h-5 w-5" />
            <h3 className="font-bold text-white text-sm">Gini Impurity vs. Information Gain</h3>
          </div>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            Switching from Gini Impurity (84.75%) to Shannon Entropy (86.40%) yields a +1.65% accuracy lift. Entropy's logarithmic penalty enforces more balanced splits across RAM and battery capacity partitions.
          </p>
        </SpotlightBentoCard>

        <SpotlightBentoCard accentColor="#00F5D4" className="space-y-3">
          <div className="flex items-center gap-2 text-[#00F5D4]">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-bold text-white text-sm">Non-Linear RBF Kernel Machine</h3>
          </div>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            The RBF-Kernel SVC achieves 96.50% accuracy on the test partition by projecting the 20-dimensional feature space into infinite-dimensional Hilbert space, resolving non-linear hardware interactions.
          </p>
        </SpotlightBentoCard>
      </div>
    </div>
  );
}
