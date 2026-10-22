import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, ArrowDown, Sparkles, Sliders, BarChart3, Network } from "lucide-react";

export default function LiquidSculptureHero({
  activeAccent = "#00F5D4",
  activeTierLabel = "Tier 3: Very High Cost",
  onJumpToSection,
}) {
  const canvasRef = useRef(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e) => {
      setPointer({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("pointermove", handlePointerMove);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = "#05070B";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.22;

      // Draw cybernetic liquid contour rings
      const rings = 6;
      for (let r = rings; r >= 1; r--) {
        const ringRadius = baseRadius * (r / rings) * 1.5;
        const alpha = 0.12 + (r / rings) * 0.2;

        ctx.beginPath();
        const segments = 90;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const noise =
            Math.sin(theta * 4 + time * 1.5) * 18 +
            Math.cos(theta * 3 - time * 2) * 14 +
            Math.sin(theta * 7 + time * 0.8) * 8;

          const mouseDistX = (pointer.x - 0.5) * 60;
          const mouseDistY = (pointer.y - 0.5) * 60;

          const currentR = ringRadius + noise;
          const x = centerX + Math.cos(theta) * currentR + mouseDistX * (r / rings);
          const y = centerY + Math.sin(theta) * currentR + mouseDistY * (r / rings);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(
          centerX,
          centerY,
          ringRadius * 0.2,
          centerX,
          centerY,
          ringRadius * 1.2
        );
        grad.addColorStop(0, `${activeAccent}11`);
        grad.addColorStop(0.6, `${activeAccent}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`);
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = `${activeAccent}${Math.floor(alpha * 180).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = r === rings ? 2.5 : 1.2;
        ctx.stroke();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [activeAccent, pointer.x, pointer.y]);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#05070B] text-white flex items-center justify-center select-none">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Top Glassmorphic Telemetry HUD Navbar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-5 sm:px-12">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 backdrop-blur-md"
            style={{ boxShadow: `0 0 20px ${activeAccent}40` }}
          >
            <Cpu className="h-4 w-4" style={{ color: activeAccent }} />
          </div>
          <div>
            <span className="font-mono text-sm font-bold tracking-wider text-white">
              SPEC//WARP
            </span>
            <span className="ml-2 hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/70 sm:inline-block">
              LIQUID GPGPU
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 rounded-full border border-white/10 bg-white/[0.03] px-6 py-2 text-xs font-medium text-white/75 backdrop-blur-xl">
          <button
            onClick={() => onJumpToSection?.("predictor")}
            className="hover:text-[#00F5D4] transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" /> 20-Spec Predictor
          </button>
          <button
            onClick={() => onJumpToSection?.("arena")}
            className="hover:text-[#00F5D4] transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="h-3.5 w-3.5 text-purple-400" /> Exp 2–7 Arena
          </button>
          <button
            onClick={() => onJumpToSection?.("clustering")}
            className="hover:text-[#00F5D4] transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Network className="h-3.5 w-3.5 text-pink-400" /> Exp 6, 8, 9 Manifold
          </button>
        </nav>

        <button
          onClick={() => onJumpToSection?.("predictor")}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs font-medium text-white backdrop-blur-md transition hover:border-[#00F5D4] cursor-pointer"
          style={{ borderColor: `${activeAccent}66` }}
        >
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeAccent }}
          />
          {activeTierLabel}
        </button>
      </header>

      {/* Central Interactive Content */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-6"
          style={{ color: activeAccent }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest">
            WebGL2 GPGPU Silicon Sculpture
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
          LIQUID
          <br />
          <span style={{ color: activeAccent }}>CYBERNETICS.</span>
        </h1>

        <p className="mt-4 max-w-[44ch] text-xs sm:text-sm md:text-base font-light text-neutral-300">
          Continuous fluid hardware manifold reacting to user spec inputs in real time. Hover your pointer across the fluid topology or jump into the Bento Workbench.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onJumpToSection?.("predictor")}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-black transition hover:scale-105 cursor-pointer shadow-lg"
            style={{ backgroundColor: activeAccent }}
          >
            <Zap className="h-4 w-4" /> Open Bento Workbench
          </button>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="absolute bottom-7 z-30 flex flex-col items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
        <span>Scroll Down to Access All 8 Lab Modules</span>
        <ArrowDown className="h-3.5 w-3.5 text-[#00F5D4] animate-bounce" />
      </div>
    </div>
  );
}
