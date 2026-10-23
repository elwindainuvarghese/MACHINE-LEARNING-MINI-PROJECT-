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
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    activeTierMeta,
    backendConnected,
    inference,
    theme,
    toggleTheme,
  } = useHardware();

  const isLight = theme === "light";

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
      <nav className={`border rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
        isLight 
          ? "bg-white/90 border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)]" 
          : "bg-[#080B12]/90 border-white/10"
      }`}>
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-inner transition-colors ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-white/10 border-white/15"
          }`}>
            <Smartphone className={`w-4 h-4 ${isLight ? "text-slate-800" : "text-white"}`} />
          </div>
          <div>
            <div className={`font-semibold tracking-tight flex items-center gap-1.5 text-sm md:text-base ${
              isLight ? "text-slate-900" : "text-white"
            }`}>
              SPEC<span className="text-[#00F5D4]">//WARP</span>
            </div>
            <div className={`text-[10px] font-mono tracking-wider uppercase -mt-0.5 ${
              isLight ? "text-slate-500" : "text-white/45"
            }`}>
              ML Intelligence Suite
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`hidden lg:flex items-center gap-1 border rounded-full p-1 text-xs font-medium ${
          isLight ? "bg-slate-100/80 border-slate-200" : "bg-black/40 border-white/10"
        }`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? isLight
                        ? "bg-white border border-slate-300 text-slate-900 font-semibold shadow-sm"
                        : "bg-white/15 border border-white/20 text-white font-semibold shadow-sm"
                      : isLight
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
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

        {/* Right Status & Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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
                : isLight
                  ? "bg-slate-100 border-slate-200 text-slate-600"
                  : "bg-white/5 border-white/10 text-white/70"
            }`}
          >
            <Server className="w-3 h-3 text-[#00F5D4]" />
            <span>{backendConnected ? "Live API" : "Client Engine"}</span>
          </div>

          {/* Global Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-8 h-8 rounded-full border transition cursor-pointer shadow-sm ${
              isLight
                ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                : "bg-white/5 border-white/15 text-white/80 hover:text-white hover:border-[#00F5D4]"
            }`}
            title={isLight ? "Switch to Obsidian Dark Mode" : "Switch to Titanium Light Mode"}
            aria-label="Toggle theme mode"
          >
            {isLight ? (
              <Moon className="w-4 h-4 text-purple-600 transition-transform hover:rotate-12" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex lg:hidden items-center justify-center w-8 h-8 rounded-full border transition ${
              isLight
                ? "bg-slate-100 border-slate-300 text-slate-700"
                : "border-white/15 bg-white/5 text-white/80 hover:text-white"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden mt-2 rounded-2xl border p-3 shadow-2xl space-y-1 backdrop-blur-2xl transition-all ${
          isLight
            ? "bg-white/98 border-slate-200 shadow-slate-200/50"
            : "bg-[#090D17]/98 border-white/15"
        }`}>
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
                    ? isLight
                      ? "bg-slate-100 border border-slate-200 text-slate-900 font-semibold"
                      : "bg-white/15 border border-white/20 text-white font-semibold"
                    : isLight
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#00F5D4]" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            );
          })}

          {/* Mobile Theme Switcher Bar */}
          <div className={`pt-2 border-t mt-2 flex items-center justify-between px-3 py-1.5 ${
            isLight ? "border-slate-200" : "border-white/10"
          }`}>
            <span className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-white/50"}`}>
              Theme: {isLight ? "Titanium Light" : "Obsidian Dark"}
            </span>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono transition cursor-pointer ${
                isLight
                  ? "bg-slate-100 border-slate-300 text-slate-800"
                  : "bg-white/5 border-white/15 text-white"
              }`}
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-purple-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
