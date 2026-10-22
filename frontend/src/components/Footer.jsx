import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Server } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06080E]/95 mt-20 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white tracking-tight text-sm">
              SPEC<span className="text-[#00F5D4]">//WARP</span>
              <span className="text-white/40 ml-1.5 font-normal text-xs">· ML Suite</span>
            </div>
            <div className="text-[11px] text-white/45 font-sans">
              20-Feature Hardware Classification & Market Valuation Engine
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/55">
          <Link to="/" className="hover:text-white transition">Overview</Link>
          <span className="text-white/15">/</span>
          <Link to="/predict" className="hover:text-white transition">Predictor</Link>
          <span className="text-white/15">/</span>
          <Link to="/arena" className="hover:text-white transition">Model Arena</Link>
          <span className="text-white/15">/</span>
          <Link to="/manifold" className="hover:text-white transition">3D Manifolds</Link>
          <span className="text-white/15">/</span>
          <Link to="/resale" className="hover:text-white transition">Resale Valuation</Link>
          <span className="text-white/15">/</span>
          <Link to="/guide" className="hover:text-white transition">Hardware Specs</Link>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2.5 text-white/40 text-[11px]">
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Machine Learning Engine Active
          </span>
          <span>•</span>
          <span>Scikit-Learn 1.4+</span>
        </div>
      </div>
    </footer>
  );
}
