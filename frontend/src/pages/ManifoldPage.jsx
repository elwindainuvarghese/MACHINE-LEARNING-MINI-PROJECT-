import React from "react";
import { Link } from "react-router-dom";
import SyllabusAnalysis from "@/components/SyllabusAnalysis";
import { useHardware } from "@/context/HardwareContext";
import { SpotlightBentoCard } from "@/components/ui/cyber-telemetry-fx";
import {
  Network,
  Cpu,
  Sliders,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function ManifoldPage() {
  const { benchmarksData, projectionsData, specs } = useHardware();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#FF2A85]">
            <Network className="h-3.5 w-3.5" />
            <span>Unsupervised Topology & Manifolds</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            20D Manifold Subspace Projection & Topology Lab
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed">
            Project the 20-dimensional smartphone feature manifold into 3D and 2D coordinates using <strong>Principal Component Analysis (PCA)</strong>, <strong>Linear Discriminant Analysis (LDA)</strong>, and <strong>TruncatedSVD</strong>. Trace natural hardware subtrees with <strong>Minimum Spanning Trees (MST)</strong>, and isolate impossible hardware configurations with <strong>DBSCAN density clustering</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-[#00F5D4] transition"
          >
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" />
            Adjust Active Phone Specs
          </Link>
          <Link
            to="/resale"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-emerald-400 transition"
          >
            <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
            5-Month Resale
          </Link>
        </div>
      </div>

      {/* ── FULL PLOTLY 3D MANIFOLD & LAB COMPONENT ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl">
        <SyllabusAnalysis
          benchmarksData={benchmarksData}
          projectionsData={projectionsData}
        />
      </div>

      {/* ── THEORETICAL LAB SYNTHESIS GRID WITH SPOTLIGHT CARDS ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SpotlightBentoCard accentColor="#00F5D4" className="space-y-3">
          <p className="font-mono text-xs text-[#00F5D4] uppercase tracking-wider font-bold">
            Subspace Projection: PCA vs. LDA vs. SVD
          </p>
          <h3 className="font-bold text-white text-base">Unsupervised vs. Supervised Reduction</h3>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            PCA and SVD maximize orthogonal variance without knowing class labels. In contrast, <strong>LDA maximizes Fisher's criterion</strong> (between-class scatter over within-class scatter), enabling 84.8% classification accuracy with 4.4x faster inference latency (2.8ms).
          </p>
        </SpotlightBentoCard>

        <SpotlightBentoCard accentColor="#A855F7" className="space-y-3">
          <p className="font-mono text-xs text-purple-400 uppercase tracking-wider font-bold">
            Graph-Theoretic Spanning Trees (MST)
          </p>
          <h3 className="font-bold text-white text-base">Graph-Theoretic Market Segmentation</h3>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            MST builds a connected graph where every smartphone is connected through the minimum total Euclidean edge distance. Removing the $k-1$ longest bridge edges splits the manifold into natural hardware archetypes without assuming round cluster shapes.
          </p>
        </SpotlightBentoCard>

        <SpotlightBentoCard accentColor="#FF2A85" className="space-y-3">
          <p className="font-mono text-xs text-pink-400 uppercase tracking-wider font-bold">
            Density Anomaly Guardrail: DBSCAN vs. K-Means
          </p>
          <h3 className="font-bold text-white text-base">Density-Based Anomaly Detection</h3>
          <p className="text-xs text-white/65 leading-relaxed font-sans">
            K-Means partitions every sample into a cluster even if it is physically absurd. DBSCAN evaluates spatial density: phones having &lt;5 neighbors within radius $\varepsilon=2.85$ are flagged as noise (-1), guarding against sensor corruption.
          </p>
        </SpotlightBentoCard>
      </div>
    </div>
  );
}
