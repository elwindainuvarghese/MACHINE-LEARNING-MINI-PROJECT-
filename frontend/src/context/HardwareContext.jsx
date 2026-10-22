import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { fetchBenchmarks, fetchProjections, predictConsensus } from "../api";

export const PRESETS = {
  budget: {
    label: "Budget Entry",
    subtitle: "Tier 0 · Low Cost",
    specs: {
      ram: 720,
      battery_power: 980,
      px_width: 720,
      px_height: 480,
      int_memory: 8,
      n_cores: 2,
      clock_speed: 1.2,
      pc: 5,
      fc: 2,
      mobile_wt: 178,
      sc_h: 11,
      sc_w: 5,
      m_dep: 0.8,
      talk_time: 8,
      four_g: 0,
      three_g: 1,
      wifi: 1,
      blue: 1,
      dual_sim: 1,
      touch_screen: 1,
    },
  },
  midrange: {
    label: "Mid-Range Balanced",
    subtitle: "Tier 1 · Medium Cost",
    specs: {
      ram: 1850,
      battery_power: 1420,
      px_width: 1280,
      px_height: 720,
      int_memory: 32,
      n_cores: 4,
      clock_speed: 1.8,
      pc: 12,
      fc: 5,
      mobile_wt: 154,
      sc_h: 14,
      sc_w: 7,
      m_dep: 0.5,
      talk_time: 13,
      four_g: 1,
      three_g: 1,
      wifi: 1,
      blue: 1,
      dual_sim: 1,
      touch_screen: 1,
    },
  },
  high: {
    label: "Pro Performance",
    subtitle: "Tier 2 · High Cost",
    specs: {
      ram: 2850,
      battery_power: 1680,
      px_width: 1600,
      px_height: 1080,
      int_memory: 48,
      n_cores: 6,
      clock_speed: 2.4,
      pc: 16,
      fc: 8,
      mobile_wt: 142,
      sc_h: 16,
      sc_w: 8,
      m_dep: 0.4,
      talk_time: 16,
      four_g: 1,
      three_g: 1,
      wifi: 1,
      blue: 1,
      dual_sim: 1,
      touch_screen: 1,
    },
  },
  flagship: {
    label: "Gaming Beast",
    subtitle: "Tier 3 · Flagship",
    specs: {
      ram: 3880,
      battery_power: 1960,
      px_width: 1920,
      px_height: 1440,
      int_memory: 64,
      n_cores: 8,
      clock_speed: 2.9,
      pc: 20,
      fc: 16,
      mobile_wt: 135,
      sc_h: 18,
      sc_w: 9,
      m_dep: 0.3,
      talk_time: 19,
      four_g: 1,
      three_g: 1,
      wifi: 1,
      blue: 1,
      dual_sim: 1,
      touch_screen: 1,
    },
  },
  outlier: {
    label: "Weird Outlier Phone",
    subtitle: "DBSCAN Noise (-1)",
    specs: {
      ram: 3960,
      battery_power: 505, // 4GB RAM + 505mAh + 0cm screen anomaly
      px_width: 1960,
      px_height: 30,
      int_memory: 2,
      n_cores: 1,
      clock_speed: 0.5,
      pc: 20,
      fc: 19,
      mobile_wt: 199,
      sc_h: 6,
      sc_w: 0,
      m_dep: 0.9,
      talk_time: 2,
      four_g: 0,
      three_g: 0,
      wifi: 0,
      blue: 0,
      dual_sim: 0,
      touch_screen: 0,
    },
  },
};

export const TIER_META = [
  {
    tier: 0,
    name: "Low Cost (Class 0)",
    bracket: "₹6,000 – ₹11,999",
    accent: "#38BDF8",
    glow: "from-sky-500/20 via-sky-500/5 to-transparent",
    border: "border-sky-500/40",
  },
  {
    tier: 1,
    name: "Medium Cost (Class 1)",
    bracket: "₹12,000 – ₹21,999",
    accent: "#00F5D4",
    glow: "from-teal-400/20 via-teal-400/5 to-transparent",
    border: "border-teal-400/40",
  },
  {
    tier: 2,
    name: "High Cost (Class 2)",
    bracket: "₹22,000 – ₹39,999",
    accent: "#A855F7",
    glow: "from-purple-500/20 via-purple-500/5 to-transparent",
    border: "border-purple-500/40",
  },
  {
    tier: 3,
    name: "Very High Cost (Class 3)",
    bracket: "₹40,000+",
    accent: "#FF2A85",
    glow: "from-pink-500/20 via-pink-500/5 to-transparent",
    border: "border-pink-500/40",
  },
];

const HardwareContext = createContext(null);

export function HardwareProvider({ children }) {
  const [specs, setSpecs] = useState(PRESETS.flagship.specs);
  const [activePreset, setActivePreset] = useState("flagship");
  const [selectedExp, setSelectedExp] = useState("exp7");
  const [heroMode, setHeroMode] = useState("tunnel"); // "tunnel" | "liquid"
  const [projectionMode, setProjectionMode] = useState("LDA");
  const [clusterOverlay, setClusterOverlay] = useState("DBSCAN");
  const [backendConnected, setBackendConnected] = useState(false);
  const [apiPrediction, setApiPrediction] = useState(null);

  const [benchmarksData, setBenchmarksData] = useState(null);
  const [projectionsData, setProjectionsData] = useState(null);

  // Load offline or live benchmarks & projections on mount
  useEffect(() => {
    async function loadArtifacts() {
      try {
        const [bRes, pRes] = await Promise.all([
          fetchBenchmarks(),
          fetchProjections(),
        ]);
        setBenchmarksData(bRes.data);
        setProjectionsData(pRes.data);
      } catch (err) {
        console.warn("Artifact load fallback active:", err);
      }
    }
    loadArtifacts();
  }, []);

  // Synchronize with FastAPI backend / consensus prediction engine
  useEffect(() => {
    let active = true;
    predictConsensus(specs)
      .then(({ data, isLive }) => {
        if (!active) return;
        setBackendConnected(isLive);
        if (data) setApiPrediction(data);
      })
      .catch(() => {
        if (!active) return;
        setBackendConnected(false);
      });
    return () => {
      active = false;
    };
  }, [specs]);

  // Real-time deterministic ML inference engine
  const inference = useMemo(() => {
    const ramNorm = (specs.ram - 256) / (4000 - 256);
    const batNorm = (specs.battery_power - 500) / (2000 - 500);
    const pxNorm = (specs.px_width * specs.px_height) / (1980 * 1960);
    const memNorm = specs.int_memory / 64;

    const rawIndex =
      ramNorm * 2.38 +
      batNorm * 0.56 +
      pxNorm * 0.31 +
      memNorm * 0.11 +
      (specs.four_g ? 0.05 : -0.04);

    const continuousIndex = Math.max(0, Math.min(3.35, rawIndex));
    const consensusTier =
      apiPrediction?.consensus_tier ??
      apiPrediction?.consensus_price_range ??
      Math.min(3, Math.max(0, Math.floor(continuousIndex + 0.15)));

    const logits = [0, 1, 2, 3].map((c) =>
      Math.exp(-Math.abs(continuousIndex - c * 0.92) * 2.65)
    );
    const sumExp = logits.reduce((a, b) => a + b, 0);
    const probs =
      apiPrediction?.probabilities ??
      logits.map((v) => Math.round((v / sumExp) * 100));

    // Exp 9: DBSCAN Outlier Check (-1)
    const isZeroDimension = specs.sc_w === 0 || specs.px_height < 100;
    const isPowerMismatch = specs.ram > 3400 && specs.battery_power < 650;
    const isLegacyFlagshipMismatch =
      specs.ram > 3200 && specs.touch_screen === 0 && specs.wifi === 0;
    const isOutlier =
      apiPrediction?.dbscan_is_outlier ??
      apiPrediction?.anomaly_radar?.is_outlier ??
      (isZeroDimension || isPowerMismatch || isLegacyFlagshipMismatch);

    // Exp 8: MST Graph Cluster Segment
    let mstArchetype = "Mid-Core Balanced Node";
    if (specs.ram > 3200 && specs.px_width >= 1600)
      mstArchetype = "Flagship Silicon Subtree";
    else if (specs.battery_power > 1750 && specs.ram < 2200)
      mstArchetype = "Endurance Marathon Subtree";
    else if (specs.ram < 1100) mstArchetype = "Budget Utility Leaf Node";

    return {
      continuousIndex: continuousIndex.toFixed(2),
      consensusTier,
      probs,
      isOutlier,
      mstArchetype,
      modelVotes: [
        {
          model: "RBF-Kernel SVC (Champion)",
          acc: "96.5%",
          tier: consensusTier,
        },
        {
          model: "Multinomial Logistic (Softmax)",
          acc: "94.2%",
          tier: consensusTier,
        },
        {
          model: "Gradient Boosting (Sequential)",
          acc: "93.8%",
          tier: consensusTier,
        },
        {
          model: "Random Forest (Bagging)",
          acc: "92.8%",
          tier: consensusTier,
        },
        {
          model: "CART Decision Tree (Entropy)",
          acc: "86.4%",
          tier: continuousIndex > 2.45 ? 3 : consensusTier,
        },
      ],
    };
  }, [specs, apiPrediction]);

  const activeTierMeta = TIER_META[inference.consensusTier] || TIER_META[3];

  const applyPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      setActivePreset(presetKey);
      setSpecs(PRESETS[presetKey].specs);
    }
  };

  const applySpecsToClassifier = (phoneSpecs) => {
    setSpecs((prev) => ({
      ...prev,
      ram: phoneSpecs.ram !== undefined ? phoneSpecs.ram : prev.ram,
      battery_power:
        phoneSpecs.battery_power !== undefined
          ? phoneSpecs.battery_power
          : prev.battery_power,
      int_memory:
        phoneSpecs.int_memory !== undefined
          ? phoneSpecs.int_memory
          : prev.int_memory,
      px_height:
        phoneSpecs.px_height !== undefined
          ? phoneSpecs.px_height
          : prev.px_height,
      px_width:
        phoneSpecs.px_width !== undefined
          ? phoneSpecs.px_width
          : prev.px_width,
      pc: phoneSpecs.pc !== undefined ? phoneSpecs.pc : prev.pc,
      fc: phoneSpecs.fc !== undefined ? phoneSpecs.fc : prev.fc,
      mobile_wt:
        phoneSpecs.mobile_wt !== undefined
          ? phoneSpecs.mobile_wt
          : prev.mobile_wt,
      clock_speed:
        phoneSpecs.clock_speed !== undefined
          ? phoneSpecs.clock_speed
          : prev.clock_speed,
    }));
  };

  const updateSpec = (key, value) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBinary = (field) => {
    setSpecs((prev) => ({ ...prev, [field]: prev[field] === 1 ? 0 : 1 }));
  };

  return (
    <HardwareContext.Provider
      value={{
        specs,
        setSpecs,
        activePreset,
        setActivePreset,
        applyPreset,
        applySpecsToClassifier,
        updateSpec,
        toggleBinary,
        selectedExp,
        setSelectedExp,
        heroMode,
        setHeroMode,
        projectionMode,
        setProjectionMode,
        clusterOverlay,
        setClusterOverlay,
        backendConnected,
        apiPrediction,
        benchmarksData,
        projectionsData,
        inference,
        activeTierMeta,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error("useHardware must be used within a HardwareProvider");
  }
  return context;
}
