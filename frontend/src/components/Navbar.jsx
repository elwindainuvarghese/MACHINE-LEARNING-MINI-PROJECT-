import React, { useState } from "react";
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
  Menu,
  X,
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activeTierMeta,
    backendConnected,
    inference,
  } = useHardware();

  const navLinks = [
    { to: "/", label: "Overview", icon: Sparkles },
    { to: "/predict", label: "Predictor", icon: Sliders },
    { to: "/arena", label: "Model Arena", icon: Trophy },
    { to: "/manifold", label: "3D Manifolds", icon: Network },
    { to: "/resale", label: "Resale Valuation", icon: TrendingDown },
    { to: "/guide", label: "Hardware Specs", icon: BookOpen },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 md:px-8 max-w-7xl mx-auto">
      <nav className="border border-white/10 rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-[#080B12]/90 transition-colors">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-inner">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white tracking-tight flex items-center gap-1.5 text-sm md:text-base">
              SPEC<span className="text-[#00F5D4]">//WARP</span>
            </div>
            <div className="text-[10px] text-white/45 font-mono tracking-wider uppercase -mt-0.5">
              ML Intelligence Suite
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 border border-white/10 rounded-full p-1 text-xs font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 border border-white/20 text-white font-semibold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
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
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono transition hover:scale-105"
            style={{
              borderColor: `${activeTierMeta.accent}55`,
              backgroundColor: `${activeTierMeta.accent}12`,
              color: activeTierMeta.accent,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeTierMeta.accent }}
            />
            <span className="font-semibold">Tier {inference.consensusTier}</span>
          </Link>

          {/* Engine Status Pill */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              backendConnected
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border-white/10 text-white/70"
            }`}
          >
            <Server className="w-3 h-3 text-[#00F5D4]" />
            <span>{backendConnected ? "Live API" : "Client Engine"}</span>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 rounded-2xl border border-white/15 bg-[#090D17]/98 backdrop-blur-2xl p-3 shadow-2xl space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-white/15 border border-white/20 text-white font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#00F5D4]" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
