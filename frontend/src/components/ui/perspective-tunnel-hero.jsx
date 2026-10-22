import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  Cpu,
  Sparkles,
  ArrowDown,
  Zap,
  Layers,
  GitBranch,
  Network,
  ShieldAlert,
  BarChart3,
  Sliders,
} from "lucide-react";

/* 9 Verified Unsplash Tech/Silicon Images Mapped to the 8 Lab Experiments + Dataset */
export const DEFAULT_TUNNEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    title: "20D Silicon Matrix",
    subtitle: "RAM · Battery · Pixel Density",
    badge: "KAGGLE 2000×20",
    accent: "#00F5D4",
    presetKey: "flagship",
    expId: "exp7",
  },
  {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    title: "Linear & Logistic",
    subtitle: "KNN Imputation & Softmax Baseline",
    badge: "REGRESSION & SOFTMAX",
    accent: "#38BDF8",
    presetKey: "budget",
    expId: "exp2",
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    title: "CART Decision Tree",
    subtitle: "Gini Impurity vs. Shannon Entropy",
    badge: "CART DECISION TREE",
    accent: "#00F5D4",
    presetKey: "midrange",
    expId: "exp3_4",
  },
  {
    src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
    title: "CART Regression",
    subtitle: "Continuous Price & Variance Split",
    badge: "CONTINUOUS CART SVR",
    accent: "#A855F7",
    presetKey: "midrange",
    expId: "exp3_4",
  },
  {
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    title: "Bagging & Boosting",
    subtitle: "Random Forest OOB vs. Gradient Boost",
    badge: "ENSEMBLE SUITE",
    accent: "#FF2A85",
    presetKey: "high",
    expId: "exp5",
  },
  {
    src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
    title: "PCA · LDA · SVD",
    subtitle: "20D-to-3D Eigen-Manifold Projection",
    badge: "SUBSPACE PROJECTION",
    accent: "#00F5D4",
    presetKey: "flagship",
    expId: "exp6",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    title: "SVM Hyperplanes",
    subtitle: "Linear, RBF & Poly Kernel Trick (96.5%)",
    badge: "RBF KERNEL CHAMPION",
    accent: "#A855F7",
    presetKey: "flagship",
    expId: "exp7",
  },
  {
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
    title: "MST Graph Clusters",
    subtitle: "Minimum Spanning Tree Edge Pruning",
    badge: "GRAPH TOPOLOGY MST",
    accent: "#38BDF8",
    presetKey: "high",
    expId: "exp8",
  },
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    title: "DBSCAN Noise Radar",
    subtitle: "Density Outlier Guardrail (Label -1)",
    badge: "DBSCAN ANOMALY RADAR",
    accent: "#F43F5E",
    presetKey: "outlier",
    expId: "exp9",
  },
];

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({
  card,
  progress,
  pointer,
  total,
  stage,
  onCardClick,
}) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(
    localProgress,
    [0, 0.18, 0.82, 0.98],
    [0, 1, 1, 0]
  );

  const cardWidth = stage.isMobile
    ? Math.max(140, Math.min(185, stage.width * 0.4))
    : Math.max(195, Math.min(275, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]) => {
      const offsetX = baseX - px * panStrength;
      const offsetY = baseY - py * panStrength;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
    }
  );

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      onClick={() => onCardClick?.(card.item)}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
    >
      <div
        className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl shadow-black/90 ring-1 ring-white/15 transition-all duration-500 hover:scale-[1.03]"
        style={{
          boxShadow: `0 20px 50px -15px ${card.item.accent}33`,
        }}
      >
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Cyberpunk Telemetry Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/40 to-transparent flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-black"
              style={{ backgroundColor: card.item.accent }}
            >
              {card.item.badge}
            </span>
            <Sparkles
              className="h-3.5 w-3.5 opacity-80 transition-transform group-hover:rotate-45"
              style={{ color: card.item.accent }}
            />
          </div>

          <div>
            <p className="text-sm sm:text-base font-bold tracking-tight text-white drop-shadow-md">
              {card.item.title}
            </p>
            <p className="mt-0.5 text-[11px] font-mono text-white/70 line-clamp-1">
              {card.item.subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PerspectiveTunnelHero({
  cards = DEFAULT_TUNNEL_IMAGES,
  eyebrow = "HARDWARE TELEMETRY & INTELLIGENCE SUITE",
  headlineTop = "INTO THE",
  headlineBottom = "SILICON.",
  description = "Scroll your wheel to fly through all 8 Machine Learning models in 3D Z-space, or click any floating node to load its hardware preset.",
  activeAccent = "#00F5D4",
  activeTierLabel = "Tier 3: Very High Cost",
  onSelectCard,
  onJumpToSection,
}) {
  const containerRef = useRef(null);
  const reduce = useReducedMotion();

  const tunnelCards = cards.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.28 + (i % 3) * 0.08;
    const radiusFactorY = 0.26 + (i % 2) * 0.09;

    return {
      item,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX,
      radiusFactorY,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

  const [stage, setStage] = useState({
    width: 1440,
    height: 900,
    isMobile: false,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const rawProgress = useMotionValue(0.15);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  // Smart Wheel Handler: Flies through the 3D tunnel between 0..1, and releases page scroll at boundaries
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const current = rawProgress.get();
      const delta = e.deltaY * 0.0008;

      // Release scroll lock when user finishes flying through the tunnel so page scrolls to Bento Grid
      if (current >= 0.98 && e.deltaY > 0) {
        return;
      }
      if (current <= 0.02 && e.deltaY < 0) {
        return;
      }

      e.preventDefault();
      const next = Math.min(1, Math.max(0, current + delta));
      rawProgress.set(next);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.78, 1, 1.32]);
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.12, 0.88, 1],
    [0.4, 1, 1, 0.15]
  );
  const promptOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#05070B] text-white select-none flex items-center justify-center"
      style={{
        perspective: stage.isMobile ? "900px" : "1200px",
        transformStyle: "preserve-3d",
      }}
    >
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
              v2.5 ML ENGINE
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
            <BarChart3 className="h-3.5 w-3.5 text-purple-400" /> Model Arena
          </button>
          <button
            onClick={() => onJumpToSection?.("clustering")}
            className="hover:text-[#00F5D4] transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Network className="h-3.5 w-3.5 text-pink-400" /> 3D Manifolds
          </button>
          <button
            onClick={() => onJumpToSection?.("depreciation-forecaster")}
            className="hover:text-[#00F5D4] transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-[#39FF14]" /> 5-Month Resale
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

      {/* Immersive Cyberpunk Background Grid & Radial Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_55%,transparent_100%)] opacity-75" />
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${activeAccent}22 0%, rgba(123,44,191,0.12) 40%, transparent 75%)`,
        }}
      />

      {/* Depth Ring Guides */}
      <div className="pointer-events-none absolute h-[46vmin] w-[46vmin] rounded-full border border-[#00F5D4]/15" />
      <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

      {/* Central Anchor Typography */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="z-10 flex flex-col items-center text-center px-6 max-w-2xl"
      >
        <p
          className="text-xs font-mono uppercase tracking-[0.35em] mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md"
          style={{ color: activeAccent }}
        >
          {eyebrow}
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-[0.88] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
          {headlineTop}
          <br />
          <span style={{ color: activeAccent }}>{headlineBottom}</span>
        </h1>
        <p className="mt-4 max-w-[44ch] text-xs sm:text-sm md:text-base font-light text-neutral-300">
          {description}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <button
            onClick={() => onJumpToSection?.("predictor")}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-black transition hover:scale-105 cursor-pointer shadow-lg"
            style={{ backgroundColor: activeAccent }}
          >
            <Zap className="h-3.5 w-3.5" /> Launch Bento Workbench
          </button>
          <button
            onClick={() => rawProgress.set(rawProgress.get() > 0.8 ? 0.1 : 0.85)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2.5 text-xs font-mono text-white/80 backdrop-blur-md transition hover:border-white/50 hover:text-white cursor-pointer"
          >
            Warp Z-Corridor
          </button>
        </div>
      </motion.div>

      {/* Bottom Tunnel Progress & Scroll Prompt */}
      <div className="absolute bottom-7 z-30 flex flex-col items-center gap-2.5">
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400"
        >
          <span>Scroll Wheel to Fly · Click Any Card to Load Spec</span>
          <ArrowDown className="h-3.5 w-3.5 text-[#00F5D4] animate-bounce" />
        </motion.div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ width: progressBarWidth, backgroundColor: activeAccent }}
          />
        </div>
      </div>

      {/* 3D Z-Space Plane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {tunnelCards.map((card, i) => (
          <TunnelCard
            key={i}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={tunnelCards.length}
            stage={stage}
            onCardClick={onSelectCard}
          />
        ))}
      </div>
    </div>
  );
}
