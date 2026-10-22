import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Sparkles, Terminal, Cpu, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04060A]/95 mt-20 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF2A85] via-purple-600 to-[#00F5D4] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.3)]">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-sm">
              SPEC<span className="text-[#00F5D4]">//WARP</span>
              <span className="text-white/40 ml-1.5 font-normal text-xs">· Mobile Intelligence Suite</span>
            </div>
            <div className="text-[11px] text-white/50 -mt-0.5 font-sans">
              20-Feature Silicon Classification & Secondary Market Valuation
            </div>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
          <Link to="/" className="hover:text-[#00F5D4] transition">3D Warp</Link>
          <span className="text-white/20">/</span>
          <Link to="/predict" className="hover:text-[#00F5D4] transition">20-Spec Predictor</Link>
          <span className="text-white/20">/</span>
          <Link to="/arena" className="hover:text-[#00F5D4] transition">Model Arena</Link>
          <span className="text-white/20">/</span>
          <Link to="/manifold" className="hover:text-[#00F5D4] transition">3D Manifolds</Link>
          <span className="text-white/20">/</span>
          <Link to="/resale" className="hover:text-[#00F5D4] transition">5-Month Resale</Link>
          <span className="text-white/20">/</span>
          <Link to="/guide" className="hover:text-[#00F5D4] transition">Architecture Defense</Link>
        </div>

        {/* Tech Badges */}
        <div className="flex items-center gap-3 text-white/40 text-[11px]">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            FastAPI Engine Active
          </span>
          <span>•</span>
          <span>Scikit-Learn 1.9+</span>
          <span>•</span>
          <span>Plotly WebGL</span>
        </div>
      </div>
    </footer>
  );
}
