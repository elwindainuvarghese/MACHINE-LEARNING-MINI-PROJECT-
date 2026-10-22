import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";

/* ────────────────────────────────────────────────────────────────────
   1. CRYPTOGRAPHIC HEX SCRAMBLE COUNTER (Nothing OS / Palantir Style)
   ──────────────────────────────────────────────────────────────────── */
const GLYPHS = "0123456789ABCDEF<>/_#%*!@&$";

export function ScrambleText({
  text,
  className = "",
  duration = 260,
}) {
  const [display, setDisplay] = useState(String(text));
  const targetText = String(text);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(8, Math.round(duration / 16));
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      if (progress >= 1) {
        setDisplay(targetText);
        clearInterval(interval);
        return;
      }
      const scrambled = targetText
        .split("")
        .map((char, idx) => {
          if (char === " " || char === "." || char === "%" || char === "₹" || char === "$" || char === "·" || char === "—" || char === "–") {
            return char;
          }
          if (idx / targetText.length < progress) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setDisplay(scrambled);
    }, 16);

    return () => clearInterval(interval);
  }, [targetText, duration]);

  return (
    <span className={`font-mono tabular-nums tracking-tight ${className}`}>
      {display}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   2. LINEAR / RAYCAST CURSOR-TRACKED LASER BORDER BENTO CARD
   ──────────────────────────────────────────────────────────────────── */
export function SpotlightBentoCard({
  children,
  className = "",
  accentColor = "#00F5D4",
}) {
  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);

  function handleMouseMove(e) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  function handleMouseLeave() {
    mouseX.set(-600);
    mouseY.set(-600);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#070A11]/90 p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 ${className}`}
    >
      {/* Corner Technical Crosshairs */}
      <span className="pointer-events-none absolute left-3 top-3 h-2 w-2 border-l border-t border-white/30 z-20" />
      <span className="pointer-events-none absolute right-3 top-3 h-2 w-2 border-r border-t border-white/30 z-20" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 border-b border-l border-white/30 z-20" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-white/30 z-20" />

      {/* Subtle blueprint dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:18px_18px] opacity-40" />

      {/* Cursor-Tracked Specular Rim Light */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`radial-gradient(460px circle at ${mouseX}px ${mouseY}px, ${accentColor}25, transparent 75%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   3. LIVE EXPLODED CAD SMARTPHONE X-RAY SCHEMATIC
   Morphs chassis dimensions, CPU cores, RAM bus & battery cells live
   ──────────────────────────────────────────────────────────────────── */
export function ExplodedSmartphoneCAD({
  ram = 2000,
  battery = 1500,
  cores = 8,
  scH = 14,
  scW = 7,
  pxW = 1200,
  pxH = 800,
  fourG = true,
  isOutlier = false,
  accent = "#00F5D4",
}) {
  // Normalize physical dimensions for real-time SVG CAD scaling
  const widthPx = Math.max(88, Math.min(160, 80 + (scW / 18) * 78));
  const heightPx = Math.max(160, Math.min(250, 150 + (scH / 19) * 95));
  const batPct = Math.max(5, Math.min(100, Math.round(((battery - 500) / 1500) * 100)));
  const ramPct = Math.max(6, Math.min(100, Math.round(((ram - 256) / 3744) * 100)));

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#04060A] p-4 overflow-hidden">
      {/* Blueprint CAD Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* Top CAD Telemetry Header */}
      <div className="relative z-10 mb-2 flex w-full items-center justify-between font-mono text-[10px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: isOutlier ? "#F43F5E" : accent }} />
          CAD//SILICON X-RAY V3.1
        </span>
        <span style={{ color: isOutlier ? "#F43F5E" : accent }}>
          {scH}cm × {scW}cm · {pxW}×{pxH}px
        </span>
      </div>

      {/* Animated SVG Smartphone Schematic */}
      <div className="relative my-2 flex h-[270px] w-full items-center justify-center">
        <motion.div
          animate={{
            width: widthPx,
            height: heightPx,
            borderColor: isOutlier ? "#F43F5E" : accent,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="relative rounded-[22px] border-2 bg-black/85 p-2.5 shadow-2xl flex flex-col justify-between"
          style={{
            boxShadow: `0 0 35px -8px ${isOutlier ? "#F43F5E" : accent}45`,
          }}
        >
          {/* Top Notch & Camera Sensor */}
          <div>
            <div className="mx-auto mb-1.5 flex w-12 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-0.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span className="h-1 w-5 rounded-full bg-white/25" />
            </div>

            {/* Internal SoC Multi-Core Die (Lights up 1 to 8 Cores) */}
            <div className="rounded-lg border border-white/15 bg-white/[0.03] p-1.5">
              <div className="flex items-center justify-between font-mono text-[8px] text-white/60">
                <span>SoC DIE</span>
                <span style={{ color: accent }}>{cores} CORES</span>
              </div>
              <div className="mt-1 grid grid-cols-4 gap-1">
                {Array.from({ length: 8 }).map((_, i) => {
                  const active = i < cores;
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: active ? 1 : 0.15,
                        scale: active ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: active ? Infinity : 0,
                        delay: i * 0.1,
                      }}
                      className="h-2.5 rounded-[2px]"
                      style={{
                        backgroundColor: active ? accent : "#ffffff",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* High-Frequency RAM Bus Bar */}
          <div className="rounded-lg border border-white/15 bg-white/[0.03] p-1.5 my-1">
            <div className="flex justify-between font-mono text-[8px] text-white/60">
              <span>LPDDR5 RAM</span>
              <span style={{ color: accent }}>{ram} MB</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ width: `${ramPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="h-full rounded-full"
                style={{ backgroundColor: accent }}
              />
            </div>
          </div>

          {/* Segmented Lithium Battery Cell */}
          <div className="rounded-lg border border-white/15 bg-white/[0.03] p-1.5">
            <div className="flex justify-between font-mono text-[8px] text-white/60">
              <span>LI-ION CELL</span>
              <span className="text-emerald-400">{battery} mAh</span>
            </div>
            <div className="mt-1 grid grid-cols-5 gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const filled = batPct >= (idx + 1) * 18;
                return (
                  <div
                    key={idx}
                    className={`h-2.5 rounded-[2px] transition-colors duration-300 ${
                      filled ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 4G / 5G RF Antenna Wave Ring */}
          {fourG && (
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.96, 1.05, 0.96] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="pointer-events-none absolute -inset-2 rounded-[26px] border border-dashed"
              style={{ borderColor: `${accent}66` }}
            />
          )}
        </motion.div>
      </div>

      {/* Bottom Dimension Rulers */}
      <div className="relative z-10 flex w-full items-center justify-between border-t border-white/10 pt-2 font-mono text-[10px] text-white/45">
        <span>ASPECT: {(scH / Math.max(1, scW)).toFixed(2)}:1</span>
        <span className={isOutlier ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
          {isOutlier ? "STATUS: GEOMETRY ANOMALY" : "STATUS: NOMINAL"}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   4. LIVE DECISION-TREE ELECTRIC PATH VISUALIZER (Exp 3 & 4 CART)
   Highlights the exact split path taken by the user's current phone
   ──────────────────────────────────────────────────────────────────── */
export function LiveCartTreeVisualizer({
  ram = 2000,
  battery = 1500,
  pxHeight = 800,
  criterion = "entropy",
  accent = "#00F5D4",
}) {
  const rightBranch = ram >= 2200;
  const leafTier = !rightBranch
    ? battery >= 1350
      ? 1
      : 0
    : ram >= 3100 || pxHeight >= 1100
    ? 3
    : 2;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#04060A] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono uppercase tracking-wider text-white/60">
          LIVE CART DECISION PATH ({criterion.toUpperCase()} SPLIT)
        </span>
        <span className="font-mono text-xs font-bold" style={{ color: accent }}>
          Active Branch → Class {leafTier}
        </span>
      </div>

      <svg viewBox="0 0 520 175" className="w-full">
        {/* Left & Right Level 1 Branches */}
        <line
          x1="260"
          y1="32"
          x2="135"
          y2="92"
          stroke={!rightBranch ? accent : "rgba(255,255,255,0.12)"}
          strokeWidth={!rightBranch ? "3" : "1.2"}
          strokeDasharray={!rightBranch ? "none" : "3 3"}
        />
        <line
          x1="260"
          y1="32"
          x2="385"
          y2="92"
          stroke={rightBranch ? accent : "rgba(255,255,255,0.12)"}
          strokeWidth={rightBranch ? "3" : "1.2"}
          strokeDasharray={rightBranch ? "none" : "3 3"}
        />

        {/* Level 2 Branches (Left) */}
        <line
          x1="135"
          y1="92"
          x2="75"
          y2="148"
          stroke={leafTier === 0 ? accent : "rgba(255,255,255,0.1)"}
          strokeWidth={leafTier === 0 ? "3" : "1"}
        />
        <line
          x1="135"
          y1="92"
          x2="195"
          y2="148"
          stroke={leafTier === 1 ? accent : "rgba(255,255,255,0.1)"}
          strokeWidth={leafTier === 1 ? "3" : "1"}
        />

        {/* Level 2 Branches (Right) */}
        <line
          x1="385"
          y1="92"
          x2="325"
          y2="148"
          stroke={leafTier === 2 ? accent : "rgba(255,255,255,0.1)"}
          strokeWidth={leafTier === 2 ? "3" : "1"}
        />
        <line
          x1="385"
          y1="92"
          x2="445"
          y2="148"
          stroke={leafTier === 3 ? accent : "rgba(255,255,255,0.1)"}
          strokeWidth={leafTier === 3 ? "3" : "1"}
        />

        {/* Root Node: RAM Split */}
        <g transform="translate(185, 10)">
          <rect
            width="150"
            height="28"
            rx="6"
            fill="#0B101B"
            stroke={accent}
            strokeWidth="1.5"
          />
          <text
            x="75"
            y="18"
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            fontFamily="monospace"
          >
            ram ≥ 2200 MB? ({ram})
          </text>
        </g>

        {/* Internal Node L: Battery */}
        <g transform="translate(65, 76)">
          <rect
            width="140"
            height="26"
            rx="6"
            fill="#0B101B"
            stroke={!rightBranch ? accent : "rgba(255,255,255,0.2)"}
          />
          <text
            x="70"
            y="17"
            textAnchor="middle"
            fill="#fff"
            fontSize="9.5"
            fontFamily="monospace"
          >
            battery ≥ 1350? ({battery})
          </text>
        </g>

        {/* Internal Node R: Flagship RAM/Px */}
        <g transform="translate(315, 76)">
          <rect
            width="140"
            height="26"
            rx="6"
            fill="#0B101B"
            stroke={rightBranch ? accent : "rgba(255,255,255,0.2)"}
          />
          <text
            x="70"
            y="17"
            textAnchor="middle"
            fill="#fff"
            fontSize="9.5"
            fontFamily="monospace"
          >
            ram ≥ 3100 / pxH ≥ 1100
          </text>
        </g>

        {/* 4 Leaf Nodes */}
        {[
          { tier: 0, x: 35, label: "Tier 0 (Low)" },
          { tier: 1, x: 155, label: "Tier 1 (Med)" },
          { tier: 2, x: 285, label: "Tier 2 (High)" },
          { tier: 3, x: 405, label: "Tier 3 (Max)" },
        ].map((leaf) => {
          const active = leafTier === leaf.tier;
          return (
            <g key={leaf.tier} transform={`translate(${leaf.x}, 136)`}>
              <rect
                width="82"
                height="26"
                rx="6"
                fill={active ? accent : "#0B101B"}
                stroke={active ? "#fff" : "rgba(255,255,255,0.15)"}
              />
              <text
                x="41"
                y="17"
                textAnchor="middle"
                fill={active ? "#000" : "#9ca3af"}
                fontWeight={active ? "bold" : "normal"}
                fontSize="9.5"
                fontFamily="monospace"
              >
                {leaf.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   5. DBSCAN SONAR RADAR & CHROMATIC SHOCKWAVE ALERT (Exp 9 Outlier)
   ──────────────────────────────────────────────────────────────────── */
export function DbscanSonarRadar({ isOutlier = false, score = 69.5, reason = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
        isOutlier
          ? "border-rose-500/80 bg-rose-950/40 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.35)]"
          : "border-emerald-500/40 bg-emerald-950/25 text-emerald-200"
      }`}
    >
      {/* Sonar sweep overlay */}
      <div className="flex items-center gap-4">
        {/* Radar circle animation */}
        <div className="relative h-14 w-14 shrink-0 rounded-full border border-white/20 bg-black/60 flex items-center justify-center overflow-hidden">
          {/* Concentric rings */}
          <div className="absolute h-10 w-10 rounded-full border border-white/10" />
          <div className="absolute h-5 w-5 rounded-full border border-white/15" />
          
          {/* Rotating sonar sweep line */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: isOutlier ? 1.5 : 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 origin-center"
            style={{
              background: isOutlier
                ? "conic-gradient(from 0deg, transparent 270deg, rgba(244,63,94,0.6) 360deg)"
                : "conic-gradient(from 0deg, transparent 270deg, rgba(52,211,153,0.4) 360deg)",
            }}
          />

          {/* Center blip */}
          <span
            className={`relative z-10 h-2 w-2 rounded-full ${
              isOutlier ? "bg-rose-400 animate-ping" : "bg-emerald-400"
            }`}
          />
        </div>

        {/* Telemetry textual feed */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className={isOutlier ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {isOutlier ? "⚠ DBSCAN OUTLIER (CLUSTER -1)" : "✓ DENSITY CORE INLIER"}
            </span>
            <span className="opacity-60">ε = 2.85 · min_pts = 5</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed opacity-90 truncate">
            {isOutlier
              ? reason || "Anomalous spec geometry: High RAM with <650mAh battery or 0cm screen."
              : "Hardware parameters fall safely within high-density market manifold."}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] opacity-75">
            <span>ANOMALY PROBABILITY:</span>
            <span className="font-bold">{isOutlier ? `${score}%` : "3.2%"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   6. PCB DATA BUS TRACE (Moving Photon Packets)
   ──────────────────────────────────────────────────────────────────── */
export function DataBusTrace({ active = true, accent = "#00F5D4" }) {
  return (
    <div className="relative h-4 w-full overflow-hidden opacity-60">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <line
          x1="0"
          y1="8"
          x2="100%"
          y2="8"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>
      {active && (
        <motion.div
          animate={{ x: ["-10%", "110%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -translate-y-1/2 h-1.5 w-12 rounded-full blur-[1px]"
          style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   7. OSCILLOSCOPE PRECISION RULER SLIDER
   ──────────────────────────────────────────────────────────────────── */
export function PrecisionRulerSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  badge,
  accent = "#00F5D4",
  onChange,
}) {
  const pct = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/55 p-3.5 transition-colors hover:border-white/20">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/75 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/60">
              {badge}
            </span>
          )}
          <span className="font-mono font-bold text-white tabular-nums">
            {value} <span className="text-white/50 text-[11px]">{unit}</span>
          </span>
        </div>
      </div>

      {/* Track & Slider */}
      <div className="relative mt-2.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#00F5D4]"
          style={{ accentColor: accent }}
        />

        {/* Micro-ruler tick marks */}
        <div className="mt-1 flex justify-between px-0.5 opacity-30">
          {Array.from({ length: 11 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-[1px] ${i % 2 === 0 ? "h-2 bg-white/70" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
