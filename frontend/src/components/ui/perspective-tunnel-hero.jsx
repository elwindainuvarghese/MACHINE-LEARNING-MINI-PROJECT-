import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useHardware } from "@/context/HardwareContext";
import {
  Cpu,
  Sparkles,
  ArrowDown,
  Layers,
  GitBranch,
  Network,
  ShieldCheck,
  BarChart3,
  Sliders,
  ChevronDown
} from "lucide-react";

/* 9 Curated Tech/Silicon Images Mapped to the 8 Lab Experiments + Dataset */
export const DEFAULT_TUNNEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    title: "20D Hardware Matrix",
    subtitle: "RAM · Battery · Pixel Density",
    badge: "KAGGLE 2,000×20",
    accent: "#00F5D4",
    presetKey: "flagship",
    expId: "exp7",
  },
  {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    title: "Linear & Logistic",
    subtitle: "KNN Imputation & Softmax",
    badge: "REGRESSION & SOFTMAX",
    accent: "#38BDF8",
    presetKey: "budget",
    expId: "exp2",
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    title: "CART Decision Tree",
    subtitle: "Gini Impurity vs. Shannon Entropy",
    badge: "CART CLASSIFICATION",
    accent: "#10B981",
    presetKey: "midrange",
    expId: "exp3_4",
  },
  {
    src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
    title: "CART Regression",
    subtitle: "Continuous Variance Splitting",
    badge: "REGRESSION TREE",
    accent: "#A855F7",
    presetKey: "midrange",
    expId: "exp3_4",
  },
  {
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    title: "Bagging & Boosting",
    subtitle: "Random Forest vs. Gradient Boost",
    badge: "ENSEMBLE (89.0%)",
    accent: "#EC4899",
    presetKey: "high",
    expId: "exp5",
  },
  {
    src: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
    title: "PCA · LDA · SVD",
    subtitle: "20D-to-3D Eigen-Manifolds",
    badge: "EIGEN-PROJECTIONS",
    accent: "#00F5D4",
    presetKey: "flagship",
    expId: "exp6",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    title: "Support Vector Machines",
    subtitle: "Linear, RBF & Polynomial Kernels",
    badge: "RBF SVC (96.5%)",
    accent: "#8B5CF6",
    presetKey: "flagship",
    expId: "exp7",
  },
  {
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
    title: "MST Graph Topology",
    subtitle: "Minimum Spanning Tree Clusters",
    badge: "GRAPH TOPOLOGY",
    accent: "#38BDF8",
    presetKey: "high",
    expId: "exp8",
  },
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    title: "DBSCAN Anomaly Radar",
    subtitle: "Hardware Density Outliers",
    badge: "DENSITY GUARDRAIL",
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
  isLight = false,
}) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1000 : -1600;
  const nearZ = stage.isMobile ? 280 : 450;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(
    localProgress,
    [0, 0.18, 0.82, 0.98],
    [0, 1, 1, 0]
  );

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(160, stage.width * 0.38))
    : Math.max(190, Math.min(260, stage.width * 0.17));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 15 : 40;

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
        className={`group relative h-full w-full overflow-hidden rounded-2xl border p-3.5 backdrop-blur-xl transition-all duration-300 hover:scale-105 ${
          isLight
            ? "border-slate-200/90 bg-white/95 shadow-[0_12px_36px_rgba(15,23,42,0.1)] hover:border-slate-400/60"
            : "border-white/10 bg-[#0B0F19]/85 shadow-2xl hover:border-white/30"
        }`}
        style={{
          boxShadow: isLight
            ? `0 12px 30px rgba(15,23,42,0.08), 0 0 20px ${card.item.accent}20`
            : `0 10px 30px rgba(0,0,0,0.6), 0 0 20px ${card.item.accent}15`,
        }}
      >
        <div className={`relative h-[58%] w-full overflow-hidden rounded-xl ${isLight ? "bg-slate-100" : "bg-black/40"}`}>
          <img
            src={card.item.src}
            alt={card.item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-white/95 via-transparent to-transparent" : "from-[#0B0F19] via-transparent to-transparent"}`} />
          <span
            className={`absolute top-2 left-2 rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider backdrop-blur-md ${
              isLight
                ? "border-slate-200 bg-white/90 text-slate-800 shadow-sm"
                : "border-white/20 bg-black/70"
            }`}
            style={{ color: card.item.accent }}
          >
            {card.item.badge}
          </span>
        </div>

        <div className="mt-2.5 flex flex-col justify-between">
          <div>
            <h4 className={`text-xs sm:text-sm font-bold tracking-tight transition-colors truncate ${
              isLight ? "text-slate-900 group-hover:text-emerald-600" : "text-white group-hover:text-[#00F5D4]"
            }`}>
              {card.item.title}
            </h4>
            <p className={`mt-0.5 text-[10px] sm:text-[11px] line-clamp-2 leading-relaxed ${
              isLight ? "text-slate-600 font-medium" : "text-white/55"
            }`}>
              {card.item.subtitle}
            </p>
          </div>

          <div className={`mt-2 flex items-center justify-between border-t pt-2 text-[10px] font-mono ${
            isLight ? "border-slate-200 text-slate-500" : "border-white/10 text-white/40"
          }`}>
            <span>INDEX 0{card.index + 1}</span>
            <span className={`group-hover:translate-x-0.5 transition-transform font-medium ${
              isLight ? "text-emerald-600" : "text-[#00F5D4]"
            }`}>
              Explore →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PerspectiveTunnelHero({
  cards = DEFAULT_TUNNEL_IMAGES,
  activeAccent = "#00F5D4",
  activeTierLabel = "Tier 3 · Flagship",
  onSelectCard,
  onJumpToSection,
}) {
  const { theme } = useHardware();
  const isLight = theme === "light";
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
      rotationZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 4) * 2),
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

  const rawProgress = useMotionValue(0.12);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  // Responsive scroll & touch swipe handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Desktop Mouse Wheel handler
    const handleWheel = (e) => {
      const current = rawProgress.get();
      const delta = e.deltaY * 0.0008;

      if (current >= 0.98 && e.deltaY > 0) return;
      if (current <= 0.02 && e.deltaY < 0) return;

      e.preventDefault();
      const next = Math.min(1, Math.max(0, current + delta));
      rawProgress.set(next);
    };

    // Mobile Finger Touch swipe handler
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      const current = rawProgress.get();

      // If at end of tunnel and swiping down, let page scroll down to content
      if (current >= 0.95 && deltaY > 0) return;
      if (current <= 0.05 && deltaY < 0) return;

      const next = Math.min(1, Math.max(0, current + deltaY * 0.0025));
      rawProgress.set(next);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1, 1.25]);
  const titleOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.9, 1],
    [0.6, 1, 1, 0.2]
  );
  const promptOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const handleScrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.92,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[92svh] md:h-[100svh] w-full overflow-hidden select-none flex items-center justify-center pt-16 md:pt-0 transition-colors duration-300 ${
        isLight ? "bg-[#F4F5F8] text-slate-900" : "bg-[#05070B] text-white"
      }`}
      style={{
        perspective: stage.isMobile ? "800px" : "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background Architectural Grid & Subtle Radial Atmosphere */}
      <div className={`pointer-events-none absolute inset-0 [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_50%,transparent_100%)] ${
        isLight
          ? "bg-[radial-gradient(#94a3b8_1px,transparent_1px)] opacity-35"
          : "bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-40"
      }`} />
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: isLight
            ? `radial-gradient(circle at center, ${activeAccent}18 0%, rgba(241,245,249,0.4) 55%, transparent 80%)`
            : `radial-gradient(circle at center, ${activeAccent}14 0%, rgba(15,23,42,0.08) 45%, transparent 75%)`,
        }}
      />

      {/* Concentric Guide Rings */}
      <div className={`pointer-events-none absolute h-[44vmin] w-[44vmin] rounded-full border ${
        isLight ? "border-slate-300/40" : "border-white/[0.06]"
      }`} />
      <div className={`pointer-events-none absolute h-[72vmin] w-[72vmin] rounded-full border border-dashed ${
        isLight ? "border-slate-300/30" : "border-white/[0.04]"
      }`} />

      {/* Central Hero Typography */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="z-10 flex flex-col items-center text-center px-6 max-w-3xl"
      >
        <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-mono uppercase tracking-widest backdrop-blur-xl mb-4 shadow-sm ${
          isLight
            ? "border-slate-200 bg-white/80 text-slate-700"
            : "border-white/10 bg-white/[0.03] text-white/70"
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
          <span>Kaggle Dataset · 2,000 Hardware Profiles</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] ${
          isLight ? "text-slate-900" : "text-white"
        }`}>
          Mobile Price <br />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
            isLight
              ? "from-slate-900 via-slate-700 to-slate-500"
              : "from-white via-neutral-200 to-white/60"
          }`}>
            Architecture Suite
          </span>
        </h1>

        <p className={`mt-4 max-w-xl text-xs sm:text-sm md:text-base font-sans leading-relaxed ${
          isLight ? "text-slate-600" : "text-white/60"
        }`}>
          High-performance machine learning suite evaluating 8 supervised algorithms,
          continuous regressors, 3D manifold topologies, and secondary market valuations.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
          <button
            onClick={() => onJumpToSection?.("predictor")}
            className="inline-flex items-center gap-2 rounded-full bg-[#00F5D4] px-6 py-2.5 text-xs font-semibold text-black transition hover:bg-[#00F5D4]/90 hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(0,245,212,0.3)]"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Launch Predictor</span>
          </button>
          
          <button
            onClick={handleScrollToContent}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-mono backdrop-blur-md transition cursor-pointer shadow-sm ${
              isLight
                ? "border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400 hover:text-slate-900"
                : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:text-white"
            }`}
          >
            <span>Explore Modules</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Bottom Progress Bar & Interaction Hint */}
      <div className="absolute bottom-6 z-30 flex flex-col items-center gap-2">
        <motion.div
          style={{ opacity: promptOpacity }}
          className={`pointer-events-none flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] ${
            isLight ? "text-slate-500" : "text-white/40"
          }`}
        >
          <span>{stage.isMobile ? "Swipe Up to Fly · Tap to Load" : "Scroll to Navigate · Click to Select"}</span>
          <ArrowDown className="h-3 w-3 text-[#00F5D4] animate-bounce" />
        </motion.div>
        
        <div className={`h-1 w-36 overflow-hidden rounded-full ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
          <motion.div
            className="h-full rounded-full"
            style={{ width: progressBarWidth, backgroundColor: activeAccent }}
          />
        </div>
      </div>

      {/* 3D Z-Space Corridor with Floating Telemetry Cards */}
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
            isLight={isLight}
          />
        ))}
      </div>
    </div>
  );
}
