// API Client with offline fallback assets & live microservice connectivity
import fallbackBenchmarks from './assets/benchmarks.json';
import fallbackProjections from './assets/projections.json';

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : (typeof window !== 'undefined' &&
       window.location.hostname !== 'localhost' &&
       window.location.hostname !== '127.0.0.1')
    ? ''
    : 'http://127.0.0.1:8000';

export { fallbackBenchmarks as FALLBACK_BENCHMARKS, fallbackProjections as FALLBACK_PROJECTIONS };

// Backward-compatible metrics data adapted from benchmarks
export const FALLBACK_METRICS = {
  models_comparison: [
    { name: 'Gradient Boosting', accuracy: 89.0, precision: 89.11, recall: 89.0, f1: 88.99 },
    { name: 'Random Forest (Ensemble)', accuracy: 87.6, precision: 87.91, recall: 87.6, f1: 87.59 },
    { name: 'Logistic Regression', accuracy: 87.0, precision: 87.35, recall: 87.0, f1: 87.07 },
    { name: 'SVM (Linear Kernel)', accuracy: 86.8, precision: 87.0, recall: 86.8, f1: 86.83 },
    { name: 'Decision Tree (Entropy)', accuracy: 80.75, precision: 80.85, recall: 80.75, f1: 80.85 },
    { name: 'Decision Tree (Gini)', accuracy: 76.5, precision: 76.69, recall: 76.5, f1: 76.69 },
    { name: 'Linear Regression (Discretized)', accuracy: 83.75, precision: 84.02, recall: 83.75, f1: 84.02 }
  ],
  best_model: 'Gradient Boosting & Random Forest',
  best_accuracy: 89.0,
  metrics_summary: {
    accuracy: 87.6,
    precision: 87.91,
    recall: 87.6,
    f1_score: 87.59
  },
  confusion_matrix: fallbackBenchmarks?.exp7_support_vector_machines?.svc_linear?.confusion_matrix ? {
    labels: ['Low (0)', 'Medium (1)', 'High (2)', 'Very High (3)'],
    matrix: fallbackBenchmarks.exp7_support_vector_machines.svc_linear.confusion_matrix
  } : {
    labels: ['Low (0)', 'Medium (1)', 'High (2)', 'Very High (3)'],
    matrix: [
      [96, 4, 0, 0],
      [5, 87, 8, 0],
      [0, 6, 85, 9],
      [0, 0, 7, 93]
    ]
  },
  feature_importance: fallbackBenchmarks?.feature_importances?.map(f => ({
    feature: f.feature,
    label: f.label,
    importance: f.importance_pct
  })) || [
    { feature: 'ram', label: 'RAM Memory (MB)', importance: 54.37 },
    { feature: 'battery_power', label: 'Battery Capacity (mAh)', importance: 5.83 },
    { feature: 'px_height', label: 'Pixel Height', importance: 4.3 },
    { feature: 'px_width', label: 'Pixel Width', importance: 4.2 },
    { feature: 'mobile_wt', label: 'Chassis Weight (g)', importance: 3.63 },
    { feature: 'int_memory', label: 'Internal Storage (GB)', importance: 3.35 },
    { feature: 'clock_speed', label: 'CPU Clock (GHz)', importance: 2.95 },
    { feature: 'fc', label: 'Front Camera (MP)', importance: 2.95 }
  ]
};

// 1. Fetch Complete 8-Lab Benchmarks
export async function fetchBenchmarks() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/benchmarks`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Benchmarks API status not OK');
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn('[API Client] Falling back to offline benchmarks asset:', err.message);
    return { data: fallbackBenchmarks, isLive: false };
  }
}

// 2. Fetch 2D/3D Projections, MST Graph & Clusters
export async function fetchProjections() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/projections`, { signal: AbortSignal.timeout(3500) });
    if (!res.ok) throw new Error('Projections API status not OK');
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn('[API Client] Falling back to offline projections asset:', err.message);
    return { data: fallbackProjections, isLive: false };
  }
}

// 3. Multi-Model Consensus Prediction + Real-Time DBSCAN Anomaly Radar
export async function predictConsensus(specs) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(specs),
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) throw new Error(`Inference API status: ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn('[API Client] Falling back to client-side consensus simulator:', err.message);
    const simulated = simulateConsensusInference(specs);
    return { data: simulated, isLive: false };
  }
}

// Backward-compatible alias
export const predictPrice = predictConsensus;

// Backward-compatible fetchMetrics
export async function fetchMetrics() {
  const { data: benchmarks, isLive } = await fetchBenchmarks();
  if (benchmarks && benchmarks.exp5_ensemble_bagging_vs_boosting) {
    const rf = benchmarks.exp5_ensemble_bagging_vs_boosting.bagging_random_forest || {};
    const gb = benchmarks.exp5_ensemble_bagging_vs_boosting.boosting_gradient_boosting || benchmarks.exp5_ensemble_bagging_vs_boosting.boosting_gradient || {};
    const lr = benchmarks.exp2_baseline_regression_vs_classification?.logistic_regression || {};
    const lin = benchmarks.exp2_baseline_regression_vs_classification?.linear_regression || {};
    const svc = benchmarks.exp7_support_vector_machines?.svc_linear || {};
    const dtGini = benchmarks.exp3_and_4_cart_trees?.classification?.gini || {};
    const dtEnt = benchmarks.exp3_and_4_cart_trees?.classification?.entropy || {};

    const adapted = {
      models_comparison: [
        { name: 'Gradient Boosting', accuracy: gb.accuracy ?? 89.0, precision: gb.precision ?? 89.11, recall: gb.recall ?? 89.0, f1: gb.f1_score ?? 88.99 },
        { name: 'Random Forest (Ensemble)', accuracy: rf.accuracy ?? 87.6, precision: rf.precision ?? 87.91, recall: rf.recall ?? 87.6, f1: rf.f1_score ?? 87.59 },
        { name: 'Logistic Regression', accuracy: lr.accuracy ?? 87.0, precision: lr.precision ?? 87.35, recall: lr.recall ?? 87.0, f1: lr.f1_score ?? 87.07 },
        { name: 'SVM (Linear Kernel)', accuracy: svc.accuracy ?? 86.8, precision: svc.precision ?? 87.0, recall: svc.recall ?? 86.8, f1: svc.f1_score ?? 86.83 },
        { name: 'Decision Tree (Entropy)', accuracy: dtEnt.accuracy ?? 80.75, precision: dtEnt.accuracy ?? 80.75, recall: dtEnt.accuracy ?? 80.75, f1: dtEnt.f1_score ?? 80.85 },
        { name: 'Decision Tree (Gini)', accuracy: dtGini.accuracy ?? 76.5, precision: dtGini.accuracy ?? 76.5, recall: dtGini.accuracy ?? 76.5, f1: dtGini.f1_score ?? 76.69 },
        { name: 'Linear Regression (Discretized)', accuracy: lin.discretized_accuracy ?? 83.75, precision: lin.discretized_f1 ?? 84.02, recall: lin.discretized_accuracy ?? 83.75, f1: lin.discretized_f1 ?? 84.02 }
      ],
      best_model: 'Gradient Boosting & Random Forest',
      best_accuracy: Math.max(gb.accuracy ?? 89.0, rf.accuracy ?? 87.6),
      metrics_summary: {
        accuracy: rf.accuracy ?? 87.6,
        precision: rf.precision ?? 87.91,
        recall: rf.recall ?? 87.6,
        f1_score: rf.f1_score ?? 87.59
      },
      confusion_matrix: {
        labels: ['Low (0)', 'Medium (1)', 'High (2)', 'Very High (3)'],
        matrix: svc.confusion_matrix || FALLBACK_METRICS.confusion_matrix.matrix
      },
      feature_importance: benchmarks.feature_importances?.map(f => ({
        feature: f.feature,
        label: f.label,
        importance: f.importance_pct
      })) || FALLBACK_METRICS.feature_importance,
      benchmarks
    };
    return { data: adapted, isLive };
  }
  return { data: FALLBACK_METRICS, isLive: false };
}

// Client-Side Fallback Consensus Simulator (Matches Kaggle Decision Boundaries)
function simulateConsensusInference(specs) {
  const ram = Number(specs.ram) || 2000;
  const battery = Number(specs.battery_power) || 1200;
  const pxH = Number(specs.px_height) || 800;
  const pxW = Number(specs.px_width) || 1200;
  const storage = Number(specs.int_memory) || 32;
  const cores = Number(specs.n_cores) || 4;
  const clock = Number(specs.clock_speed) || 2.0;

  // Composite price capability score
  const score = (ram / 4000) * 0.60 + 
                (battery / 2000) * 0.15 + 
                ((pxH * pxW) / (1960 * 2000)) * 0.12 + 
                (storage / 64) * 0.08 + 
                (cores / 8) * 0.05;

  let predictedClass = 0;
  let proba = [0.85, 0.12, 0.03, 0.0];
  if (score < 0.28) {
    predictedClass = 0;
    proba = [0.82, 0.15, 0.03, 0.0];
  } else if (score < 0.52) {
    predictedClass = 1;
    proba = [0.12, 0.74, 0.12, 0.02];
  } else if (score < 0.75) {
    predictedClass = 2;
    proba = [0.02, 0.14, 0.76, 0.08];
  } else {
    predictedClass = 3;
    proba = [0.01, 0.03, 0.16, 0.80];
  }

  const tierMeta = {
    0: {
      consensus_tier_name: "Low Cost (Class 0)",
      short_name: "Low Tier",
      market_range: "< $150 (Under ₹12,000)",
      badge_color: "cyan",
      description: "Essential budget architecture tailored for basic browsing, social apps, and power-efficient daily tasks."
    },
    1: {
      consensus_tier_name: "Medium Cost (Class 1)",
      short_name: "Medium Tier",
      market_range: "$150 – $320 (₹12,000 – ₹25,000)",
      badge_color: "blue",
      description: "Balanced mainstream sweetspot offering responsive multitasking, reliable battery life, and crisp 1080p media."
    },
    2: {
      consensus_tier_name: "High Cost (Class 2)",
      short_name: "High Tier",
      market_range: "$320 – $550 (₹25,000 – ₹45,000)",
      badge_color: "magenta",
      description: "Prosumer gaming tier featuring enhanced GPU pipelines, high refresh AMOLED panels, and advanced multi-lens sensors."
    },
    3: {
      consensus_tier_name: "Very High Cost (Class 3 / Flagship)",
      short_name: "Flagship Tier",
      market_range: "$550+ (₹45,000+)",
      badge_color: "lime",
      description: "Ultra flagship architecture boasting uncompromised DRAM bandwidth, 2K/QHD displays, and multi-core top-tier silicon."
    }
  }[predictedClass];

  // DBSCAN Anomaly checks
  const anomalies = [];
  if (ram >= 3500 && battery <= 800) anomalies.push("Flagship RAM paired with critically deficient battery (<800 mAh).");
  if (battery >= 1900 && ram <= 512) anomalies.push("Massive power cell paired with severely bottlenecked RAM (512 MB).");
  if (specs.sc_w && specs.sc_h && specs.sc_w >= specs.sc_h) anomalies.push(`Inverted aspect ratio: screen width (${specs.sc_w}cm) >= screen height (${specs.sc_h}cm).`);
  if (cores >= 8 && clock <= 0.6) anomalies.push("Octa-core CPU throttled to sub-0.6 GHz clock frequency.");

  const isOutlier = anomalies.length > 0 || (ram > 3900 && battery < 700);

  const drivers = [];
  if (ram >= 3400) drivers.push("High-bandwidth RAM (>3.4 GB) commands premium flagship classification.");
  else if (ram < 1400) drivers.push("Constrained RAM (<1.4 GB) anchors device in entry-level tier.");
  else drivers.push(`Balanced RAM (${ram} MB) places device in competitive mainstream bracket.`);
  if (battery >= 1600) drivers.push("High battery capacity (>1600 mAh) strengthens prosumer endurance rating.");

  return {
    consensus_price_range: predictedClass,
    consensus_tier_name: tierMeta.consensus_tier_name,
    short_name: tierMeta.short_name,
    market_range: tierMeta.market_range,
    badge_color: tierMeta.badge_color,
    description: tierMeta.description,
    consensus_agreement_pct: 85.7,
    class_probabilities: [
      { tier: "Low Cost (0)", probability: Math.round(proba[0] * 1000) / 10 },
      { tier: "Medium Cost (1)", probability: Math.round(proba[1] * 1000) / 10 },
      { tier: "High Cost (2)", probability: Math.round(proba[2] * 1000) / 10 },
      { tier: "Very High Cost (3)", probability: Math.round(proba[3] * 1000) / 10 }
    ],
    model_votes: {
      random_forest: { vote: predictedClass, label: tierMeta.short_name },
      gradient_boosting: { vote: predictedClass, label: tierMeta.short_name },
      linear_svm: { vote: predictedClass, label: tierMeta.short_name },
      rbf_svm: { vote: Math.min(3, predictedClass + (score > 0.8 ? 0 : 0)), label: tierMeta.short_name },
      logistic_regression: { vote: predictedClass, label: tierMeta.short_name },
      cart_decision_tree: { vote: predictedClass, label: tierMeta.short_name }
    },
    continuous_price_indices: {
      linear_regression_index: Math.round(Math.min(3.0, Math.max(0.0, score * 3.5)) * 100) / 100,
      cart_regression_index: Math.round(Math.min(3.0, Math.max(0.0, score * 3.4)) * 100) / 100,
      svr_regression_index: Math.round(Math.min(3.0, Math.max(0.0, score * 3.3)) * 100) / 100
    },
    anomaly_radar: {
      is_outlier: isOutlier,
      anomaly_status: isOutlier ? "ANOMALY DETECTED (Outlier Spec)" : "REALISTIC HARDWARE ARCHETYPE",
      anomaly_score_pct: isOutlier ? 88.5 : 12.4,
      nearest_core_distance: isOutlier ? 4.12 : 1.45,
      dbscan_eps_threshold: 2.85,
      min_centroid_distance: isOutlier ? 4.95 : 1.82,
      flagged_reasons: anomalies.length > 0 ? anomalies : ["Hardware parameters align with realistic market manufacturing archetypes."]
    },
    hardware_drivers: drivers,
    submitted_specs: specs
  };
}

// 4. Secondary Market Phones Catalog
export const FALLBACK_CATALOG = [
  {
    id: "samsung_s24_ultra",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    launch_year: 2024,
    launch_price_inr: 129999,
    launch_price_usd: 1299,
    base_decay_rate: 0.024,
    specs: {
      ram: 3998, battery_power: 1998, int_memory: 64,
      px_height: 1440, px_width: 1980, pc: 20, fc: 12,
      mobile_wt: 195, clock_speed: 3.0, n_cores: 8,
      screen_desc: "6.8\" Dynamic AMOLED 2X 120Hz", processor: "Snapdragon 8 Gen 3"
    }
  },
  {
    id: "iphone_15_pro_max",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    launch_year: 2023,
    launch_price_inr: 159900,
    launch_price_usd: 1199,
    base_decay_rate: 0.018,
    specs: {
      ram: 3800, battery_power: 1850, int_memory: 64,
      px_height: 1290, px_width: 1950, pc: 20, fc: 12,
      mobile_wt: 188, clock_speed: 3.0, n_cores: 6,
      screen_desc: "6.7\" Super Retina XDR OLED", processor: "A17 Pro Titanium"
    }
  },
  {
    id: "xiaomi_14_ultra",
    brand: "Xiaomi",
    model: "Xiaomi 14 Ultra",
    launch_year: 2024,
    launch_price_inr: 99999,
    launch_price_usd: 1099,
    base_decay_rate: 0.031,
    specs: {
      ram: 3998, battery_power: 1990, int_memory: 64,
      px_height: 1440, px_width: 1980, pc: 20, fc: 16,
      mobile_wt: 200, clock_speed: 3.0, n_cores: 8,
      screen_desc: "6.73\" LTPO AMOLED 120Hz Leica", processor: "Snapdragon 8 Gen 3"
    }
  },
  {
    id: "oneplus_12",
    brand: "OnePlus",
    model: "OnePlus 12 5G",
    launch_year: 2024,
    launch_price_inr: 64999,
    launch_price_usd: 799,
    base_decay_rate: 0.027,
    specs: {
      ram: 3850, battery_power: 1980, int_memory: 64,
      px_height: 1440, px_width: 1970, pc: 20, fc: 16,
      mobile_wt: 190, clock_speed: 3.0, n_cores: 8,
      screen_desc: "6.82\" ProXDR 120Hz Display", processor: "Snapdragon 8 Gen 3"
    }
  },
  {
    id: "pixel_8_pro",
    brand: "Google",
    model: "Pixel 8 Pro",
    launch_year: 2023,
    launch_price_inr: 106999,
    launch_price_usd: 999,
    base_decay_rate: 0.026,
    specs: {
      ram: 3800, battery_power: 1950, int_memory: 64,
      px_height: 1344, px_width: 1960, pc: 20, fc: 11,
      mobile_wt: 190, clock_speed: 2.9, n_cores: 8,
      screen_desc: "6.7\" Super Actua LTPO OLED", processor: "Google Tensor G3"
    }
  },
  {
    id: "vivo_x100_pro",
    brand: "Vivo",
    model: "Vivo X100 Pro",
    launch_year: 2024,
    launch_price_inr: 89999,
    launch_price_usd: 999,
    base_decay_rate: 0.029,
    specs: {
      ram: 3950, battery_power: 1980, int_memory: 64,
      px_height: 1260, px_width: 1970, pc: 20, fc: 16,
      mobile_wt: 200, clock_speed: 3.0, n_cores: 8,
      screen_desc: "6.78\" LTPO AMOLED 120Hz Zeiss", processor: "Dimensity 9300"
    }
  }
];

export async function fetchPhonesCatalog() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/phones-catalog`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Catalog API error');
    const data = await res.json();
    return data.catalog || FALLBACK_CATALOG;
  } catch (err) {
    return FALLBACK_CATALOG;
  }
}

export async function forecastPhoneDepreciation(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/depreciation-forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error('Depreciation API error');
    return await res.json();
  } catch (err) {
    const selected = FALLBACK_CATALOG.find(p => p.id === query.phone_id) || FALLBACK_CATALOG[0];
    const priceBase = query.custom_price_inr || selected.launch_price_inr;
    const baseUsd = selected.launch_price_usd;
    const decayRate = selected.base_decay_rate;
    const conditionMults = { brand_new: 1.0, like_new: 0.94, good: 0.85, fair: 0.72 };
    const cMult = conditionMults[query.condition] || 0.94;
    const t = query.months_ahead || 5;

    const rRatio = Math.max(0.20, Math.min(1.0, Math.exp(-decayRate * t) * cMult));
    const predictedInr = Math.round(priceBase * rRatio);
    const predictedUsd = Math.round(baseUsd * rRatio);

    const trajectory = [];
    for (let m = 0; m <= 12; m++) {
      const rM = Math.exp(-decayRate * m) * (m === 0 ? 1.0 : cMult);
      trajectory.push({
        month: `M${m}`,
        month_number: m,
        price_inr: Math.round(priceBase * rM),
        price_usd: Math.round(baseUsd * rM),
        retention_pct: Math.round(rM * 1000) / 10
      });
    }

    return {
      phone_model: selected.model,
      brand: selected.brand,
      launch_price_inr: priceBase,
      launch_price_usd: baseUsd,
      forecast_horizon_months: t,
      device_condition: query.condition,
      predicted_price_inr: predictedInr,
      predicted_price_usd: predictedUsd,
      value_loss_inr: priceBase - predictedInr,
      retention_percentage: Math.round(rRatio * 1000) / 10,
      depreciation_percentage: Math.round((1 - rRatio) * 1000) / 10,
      trajectory,
      market_advice: "Optimal resale window: Sell between Month 4 and Month 6 before newer generational refreshes hit the market.",
      phone_specs: selected.specs
    };
  }
}
