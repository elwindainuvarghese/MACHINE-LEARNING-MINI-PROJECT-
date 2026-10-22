import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useHardware } from "@/context/HardwareContext";
import {
  Smartphone,
  Sparkles,
  Sliders,
  Trophy,
  Network,
  TrendingDown,
  BookOpen,
  Server,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const {
    activeTierMeta,
    backendConnected,
    heroMode,
    setHeroMode,
    inference,
  } = useHardware();

  const navLinks = [
    { to: "/", label: "3D Warp", icon: Sparkles },
    { to: "/predict", label: "20-Spec Predictor", icon: Sliders },
    { to: "/arena", label: "Model Arena", icon: Trophy },
    { to: "/manifold", label: "3D Manifolds", icon: Network },
    { to: "/resale", label: "5-Month Resale", icon: TrendingDown },
    { to: "/guide", label: "Silicon Taxonomy", icon: BookOpen },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="border border-white/15 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-[#070A12]/90">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF2A85] via-purple-600 to-[#00F5D4] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.4)]">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight flex items-center gap-1.5 text-sm md:text-base">
              SPEC<span className="text-[#00F5D4]">//WARP</span>
              <span className="hidden sm:inline text-xs font-mono text-white/50">| ML Suite</span>
            </div>
            <div className="text-[10px] text-white/50 font-mono tracking-wider uppercase -mt-0.5">
              8 Intelligence Engines Unified
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full p-1 text-xs font-mono">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-[#00F5D4]/20 border border-[#00F5D4]/60 text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.25)] font-semibold"
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active Target Tier Badge */}
          <Link
            to="/predict"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono transition hover:scale-105"
            style={{
              borderColor: `${activeTierMeta.accent}66`,
              backgroundColor: `${activeTierMeta.accent}1a`,
              color: activeTierMeta.accent,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeTierMeta.accent }}
            />
            <span className="font-bold">Tier {inference.consensusTier}</span>
          </Link>

          {/* Engine Status Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              backendConnected
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                : "bg-indigo-950/60 border-indigo-500/40 text-indigo-300"
            }`}
          >
            <Server className="w-3 h-3 text-[#00F5D4]" />
            <span>{backendConnected ? "FastAPI Live" : "Client Engine"}</span>
          </div>

          {/* Hero Mode Toggle (Visible on Home) */}
          {location.pathname === "/" && (
            <button
              onClick={() => setHeroMode(heroMode === "tunnel" ? "liquid" : "tunnel")}
              className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono text-white/80 hover:border-[#00F5D4] hover:text-white transition cursor-pointer"
              title="Toggle between 3D Perspective Tunnel Hero and WebGL2 Liquid Sculpture Hero"
            >
              <Sparkles className="w-3 h-3 text-[#00F5D4]" />
              <span className="hidden sm:inline">{heroMode === "tunnel" ? "3D Tunnel" : "Liquid Sculpture"}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden items-center justify-between gap-1 overflow-x-auto py-2 px-3 mt-2 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl text-[11px] font-mono">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2.5 py-1 rounded-xl whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/40"
                    : "text-white/60 hover:text-white"
                }`
              }
            >
              <Icon className="w-3 h-3" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
}
