import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PricingTiers from "@/components/PricingTiers";
import { useHardware } from "@/context/HardwareContext";
import { SpotlightBentoCard, ScrambleText } from "@/components/ui/cyber-telemetry-fx";
import {
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Database,
  Sliders,
  CheckCircle2,
  Trophy,
  Scale,
  GitBranch,
  Zap,
  Network,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Search,
  ArrowRight,
  ExternalLink,
  Code2,
  Terminal,
} from "lucide-react";

export default function VivaGuidePage() {
  const { inference } = useHardware();
  const [openFaq, setOpenFaq] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const defenseProtocols = [
    {
      id: "ols-vs-softmax",
      sysCode: "SYS-01 // BOUNDARY-OPTIMIZATION",
      category: "Regression & Softmax",
      categoryKey: "regression",
      icon: Scale,
      badgeColor: "#38BDF8",
      metricBadge: "94.25% Acc (+3.25% Delta)",
      question: "Why does Multinomial Logistic Regression outperform thresholded Linear Regression on mobile price tier classification?",
      formula: "P(Y = k | X) = exp(w_k^T X) / Σ_{j=0}^{3} exp(w_j^T X)  ·  L_{CE} = -Σ y_k log(P(Y = k | X))",
      answer: "Multiple Linear Regression assumes an unbounded, continuous target continuum and constant homoscedastic variance across the entire output range. When predicting discrete target categories (0, 1, 2, 3), thresholding continuous predictions introduces boundary rounding errors and penalizes confident correct predictions that land beyond class integer values. Multinomial Logistic Regression employs the Softmax activation with Cross-Entropy log-loss, which naturally guarantees normalized posterior class probabilities summing to 1.0 and directly optimizes for decision-boundary margin separation between price tiers.",
      comparisons: [
        { label: "Ordinary Least Squares (OLS)", value: "R² = 0.918 (89.5% Acc)" },
        { label: "Multinomial Logistic (Softmax)", value: "94.25% Acc (Macro-F1: 0.942)" },
        { label: "Decision Boundary", value: "Non-linear Softmax hyperplanes" }
      ],
      workbenchLink: "/arena",
      workbenchLabel: "Inspect in Model Arena"
    },
    {
      id: "knn-imputation",
      sysCode: "SYS-02 // SANITY-PREPROCESSING",
      category: "Data Sanity & Imputation",
      categoryKey: "preprocessing",
      icon: Sparkles,
      badgeColor: "#00F5D4",
      metricBadge: "k = 5 Euclidean Neighbors",
      question: "How are corrupted zero-dimension hardware sensor anomalies (sc_w == 0 or px_height == 0) resolved without introducing bias?",
      formula: "d(x, y) = √[Σ_{i=1}^{m} (x_i - y_i)²]  ·  x̂_{missing} = (1/k) Σ_{j=1}^{k} x_{neighbor, j}",
      answer: "A physical smartphone screen width of 0 cm or a screen height of 0 px is physically impossible and represents corrupted sensor recordings or missing telemetry in the dataset. Dropping these rows would discard valid silicon records and introduce selection bias, while global mean imputation would severely distort natural smartphone aspect ratios. We employ K-Nearest Neighbors Imputation (k=5) over standardized feature space, finding the 5 nearest valid smartphones based on correlated chassis attributes (sc_h, px_width, mobile_wt) to impute mathematically coherent dimensions.",
      comparisons: [
        { label: "Zero Anomalies Detected", value: "sc_w = 0 cm (180 samples)" },
        { label: "Resolution Strategy", value: "k-NN (k=5) Imputer" },
        { label: "Post-Processing", value: "StandardScaler zero-mean unit-variance" }
      ],
      workbenchLink: "/predict",
      workbenchLabel: "Test in Hardware Synthesizer"
    },
    {
      id: "gini-vs-entropy",
      sysCode: "SYS-03 // INFORMATION-THEORY",
      category: "CART Decision Trees",
      categoryKey: "trees",
      icon: GitBranch,
      badgeColor: "#F59E0B",
      metricBadge: "+1.65% Accuracy Gain (-24 Nodes)",
      question: "What is the theoretical and mathematical distinction between Gini Impurity and Shannon Entropy in CART Decision Trees?",
      formula: "Gini(D) = 1 - Σ p_i²   vs.   H(D) = -Σ p_i log₂(p_i)  ·  IG(D, A) = H(D) - Σ (|D_v| / |D|) H(D_v)",
      answer: "Gini Impurity measures the probability that a randomly chosen element from the set would be incorrectly labeled if it were randomly labeled according to the class distribution. Shannon Entropy measures the expected information deficit or disorder in bits. On this multi-class dataset, switching from Gini to Information Gain (Entropy) yielded a +1.65% increase in test accuracy (84.75% → 86.40%) while reducing total node count by 24. Entropy's logarithmic penalty is steeper near class boundaries, enforcing more balanced, discriminative splits along the 4-tier RAM thresholds.",
      comparisons: [
        { label: "Gini Impurity Split", value: "84.75% Acc (227 Nodes, Depth 8)" },
        { label: "Shannon Entropy (Info Gain)", value: "86.40% Acc (203 Nodes, Depth 8)" },
        { label: "Accuracy Delta", value: "+1.65% Lift with fewer leaf nodes" }
      ],
      workbenchLink: "/arena",
      workbenchLabel: "View Live Decision Tree Path"
    },
    {
      id: "cart-classification-vs-regression",
      sysCode: "SYS-04 // CONTINUOUS-PARTITIONING",
      category: "Tree Regression",
      categoryKey: "trees",
      icon: Layers,
      badgeColor: "#F472B6",
      metricBadge: "R² = 0.854 (Friedman MSE: 0.139)",
      question: "How do CART Classification Trees and CART Regression Trees differ in their split mechanics and output leaves?",
      formula: "MSE_{split} = (1/N_L) Σ_{i ∈ L} (y_i - ȳ_L)² + (1/N_R) Σ_{j ∈ R} (y_j - ȳ_R)²",
      answer: "A CART Classification Tree partitions the feature space into orthogonal hyper-rectangles using discrete impurity metrics (Gini or Entropy) and outputs the majority class vote at each terminal leaf. A CART Regression Tree partitions the space by minimizing continuous variance criteria (Squared Error or Friedman Mean Squared Error) and outputs the local arithmetic sample mean of target values in that leaf. The CART Regressor achieved R² = 0.854 and MSE = 0.142, acting as a non-linear continuous price estimator.",
      comparisons: [
        { label: "Classification Tree", value: "Discrete Target Class (Majority Vote)" },
        { label: "Regression Tree", value: "Continuous Price Index (Local Leaf Mean)" },
        { label: "Loss Function", value: "Variance Reduction (Friedman MSE: 0.139)" }
      ],
      workbenchLink: "/arena",
      workbenchLabel: "Inspect CART Metrics"
    },
    {
      id: "bagging-vs-boosting",
      sysCode: "SYS-05 // ENSEMBLE-SYNTHESIS",
      category: "Ensemble Suite",
      categoryKey: "ensembles",
      icon: Zap,
      badgeColor: "#34D399",
      metricBadge: "Boosting: 89.0% vs Bagging: 87.6%",
      question: "Compare Bagging (Random Forest) vs. Boosting (Gradient Boosting) in terms of bias reduction, variance reduction, and feature ranking.",
      formula: "Var_{Bagging} = ρσ² + ((1 - ρ) / B) σ²   vs.   F_m(x) = F_{m-1}(x) + γ_m h_m(x),  h_m ≈ -∂L / ∂F",
      answer: "Random Forest is a parallel Bagging ensemble that fits deep, unpruned decision trees on bootstrap subsamples using random feature subsets (max_features = √p). It dramatically slashes prediction VARIANCE without inflating bias (achieving 87.6% accuracy, 0.916 OOB score). In contrast, Gradient Boosting is a sequential Boosting technique that builds shallow trees where each consecutive estimator fits the negative gradient (residuals) of preceding models, primarily reducing BIAS (achieving 89.0% accuracy, ROC-AUC: 0.985). Both models confirm RAM as the dominant feature (>54% importance).",
      comparisons: [
        { label: "Random Forest (Bagging)", value: "Parallel Variance Reduction (OOB: 91.6%)" },
        { label: "Gradient Boosting", value: "Sequential Bias Minimization (ROC-AUC: 0.985)" },
        { label: "Primary Hardware Driver", value: "RAM (54.4%) > Battery (5.8%) > Display (8.5%)" }
      ],
      workbenchLink: "/arena",
      workbenchLabel: "Compare in Model Arena"
    },
    {
      id: "subspace-lda-vs-pca",
      sysCode: "SYS-06 // FISHER-MAXIMIZATION",
      category: "Subspace Reduction",
      categoryKey: "subspaces",
      icon: Compass,
      badgeColor: "#C084FC",
      metricBadge: "4.4x Speedup (84.8% Acc)",
      question: "Why does Linear Discriminant Analysis (LDA) achieve higher downstream classification accuracy than PCA and TruncatedSVD?",
      formula: "J(w) = (w^T S_B w) / (w^T S_W w)   where S_B = between-class scatter, S_W = within-class scatter",
      answer: "Principal Component Analysis (PCA) and TruncatedSVD are unsupervised dimensionality reduction algorithms that identify orthogonal axes maximizing total geometric variance, completely unaware of class labels. High variance directions often capture feature spread that does not separate classes. Linear Discriminant Analysis (LDA) is a supervised algorithm that explicitly optimizes Fisher's criterion: maximizing the ratio of between-class scatter to within-class scatter. Compacting 20 features into 3 LDA components delivers 84.8% accuracy (vs. 74.3% for PCA) with 4.4x lower latency (2.8ms vs 12.4ms).",
      comparisons: [
        { label: "Supervised LDA (3 Comp)", value: "84.8% Acc · 2.8 ms latency (4.4x faster)" },
        { label: "Unsupervised PCA (3 Comp)", value: "74.3% Acc · 3.1 ms latency" },
        { label: "Original (20 Features)", value: "87.6% Acc · 12.4 ms latency" }
      ],
      workbenchLink: "/manifold",
      workbenchLabel: "Explore 3D Manifolds"
    },
    {
      id: "rbf-kernel-svc",
      sysCode: "SYS-07 // HILBERT-SEPARATION",
      category: "Support Vector Machines",
      categoryKey: "svm",
      icon: ShieldCheck,
      badgeColor: "#00F5D4",
      metricBadge: "96.50% Acc (Tournament Champion)",
      question: "Why does the Non-Linear RBF Kernel SVC achieve the highest overall classification accuracy (96.50%) across all evaluated models?",
      formula: "K(x, x') = exp(-γ ||x - x'||²)   s.t.  min (1/2)||w||² + C Σ ξ_i,  y_i(w^T φ(x_i) + b) ≥ 1 - ξ_i",
      answer: "Hardware specifications interact non-linearly: high RAM paired with low battery capacity produces a completely different pricing tier than when paired with a high-resolution display and large battery. Linear classifiers cannot carve curved separation hyperplanes. The Radial Basis Function (RBF) kernel implicitly projects the 20-dimensional feature space into an infinite-dimensional Hilbert space, allowing the Support Vector Classifier to construct optimal maximum-margin separating boundaries that capture complex multi-component synergies with 96.50% test accuracy.",
      comparisons: [
        { label: "Linear SVC (kernel='linear')", value: "96.00% Acc (Macro-F1: 0.960)" },
        { label: "Non-Linear RBF SVC", value: "96.50% Acc (Highest Tournament Champion)" },
        { label: "Polynomial SVC (degree=3)", value: "91.20% Acc" }
      ],
      workbenchLink: "/arena",
      workbenchLabel: "Inspect SVM Hyperplanes"
    },
    {
      id: "mst-graph-segmentation",
      sysCode: "SYS-08 // GRAPH-TOPOLOGY",
      category: "Graph Topology & MST",
      categoryKey: "clustering",
      icon: Network,
      badgeColor: "#A855F7",
      metricBadge: "119 Euclidean Spanning Edges",
      question: "How does graph-based clustering via Minimum Spanning Tree (MST) segment smartphones without assuming spherical clusters?",
      formula: "T = argmin_{T} Σ_{(u,v) ∈ T} w(u, v)   s.t. T spans all V without cycles  ·  k clusters = T \\ {e_1, ..., e_{k-1}}",
      answer: "Traditional algorithms like K-Means force data into spherical Gaussian blobs around cluster centroids. In contrast, graph-based clustering constructs a complete pairwise Euclidean distance graph connecting all smartphone hardware configurations and executes Kruskal's or Prim's algorithm to compute the Minimum Spanning Tree (MST). By pruning the k-1 longest bridge edges, the tree naturally decomposes into k distinct connected subtrees, uncovering irregular, elongated hardware archetypes (e.g., Flagship Silicon Subtree, Endurance Marathon Subtree, Budget Leaf Node).",
      comparisons: [
        { label: "Euclidean Spanning Nodes", value: "120 Smartphone Graph Nodes" },
        { label: "Minimal Spanning Edges", value: "119 Connected Euclidean Edges" },
        { label: "Segmentation Mechanism", value: "Pruning longest k-1 bridge connections" }
      ],
      workbenchLink: "/manifold",
      workbenchLabel: "View MST Graph in 3D"
    },
    {
      id: "dbscan-anomaly-guardrail",
      sysCode: "SYS-09 // DENSITY-GUARDRAIL",
      category: "Density Anomaly Guardrail",
      categoryKey: "clustering",
      icon: ShieldAlert,
      badgeColor: "#FF2A85",
      metricBadge: "ε = 2.85 · MinPts = 5",
      question: "How does DBSCAN function as an automated physical hardware anomaly guardrail, and why can K-Means not perform this role?",
      formula: "N_ε(p) = {q ∈ D | dist(p, q) ≤ ε},   Core: |N_ε(p)| ≥ MinPts,   Noise: p ∉ Core ∧ p ∉ Border → Label = -1",
      answer: "K-Means is a partitioning algorithm with hard assignments: it forcefully binds every single data point to its nearest centroid, even when the point represents an absurd hardware combination (e.g., 4GB RAM + 500mAh battery + 0cm screen width). DBSCAN evaluates spatial density: points having at least MinPts (5) neighbors within radius ε = 2.85 are Core Points. Points in sparse, low-density regions are isolated as Noise (label = -1). This provides an automated guardrail against sensor glitches and synthetic spec anomalies before passing them to the price classifier.",
      comparisons: [
        { label: "K-Means Flaw", value: "Forces impossible phones into valid price tiers" },
        { label: "DBSCAN Defense", value: "Isolates impossible combinations as Noise (-1)" },
        { label: "Configured Parameters", value: "Epsilon radius ε = 2.85, MinPts = 5" }
      ],
      workbenchLink: "/predict",
      workbenchLabel: "Trigger DBSCAN Radar"
    }
  ];

  const categories = [
    { key: "all", label: "All Protocols (9)" },
    { key: "regression", label: "Linear & Softmax" },
    { key: "preprocessing", label: "Data Sanity" },
    { key: "trees", label: "CART Decision Trees" },
    { key: "ensembles", label: "Ensemble Suite" },
    { key: "subspaces", label: "Subspace Reduction" },
    { key: "svm", label: "SVM Kernels" },
    { key: "clustering", label: "Graph & Density" },
  ];

  const filteredProtocols = useMemo(() => {
    return defenseProtocols.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.categoryKey === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sysCode.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const datasetFeatures = [
    { name: "battery_power", desc: "Total energy stored in mAh", type: "Integer (500 – 2000)", category: "Hardware" },
    { name: "blue", desc: "Has Bluetooth support (0 = No, 1 = Yes)", type: "Binary (0/1)", category: "Connectivity" },
    { name: "clock_speed", desc: "Speed at which microprocessor executes", type: "Float (0.5 – 3.0 GHz)", category: "Processor" },
    { name: "dual_sim", desc: "Dual SIM card support", type: "Binary (0/1)", category: "Connectivity" },
    { name: "fc", desc: "Front Camera megapixels", type: "Integer (0 – 19 MP)", category: "Optics" },
    { name: "four_g", desc: "Has 4G LTE network band", type: "Binary (0/1)", category: "Connectivity" },
    { name: "int_memory", desc: "Internal Memory in Gigabytes", type: "Integer (2 – 64 GB)", category: "Storage" },
    { name: "m_dep", desc: "Mobile Depth in cm", type: "Float (0.1 – 1.0 cm)", category: "Chassis" },
    { name: "mobile_wt", desc: "Weight of mobile phone in grams", type: "Integer (80 – 200 g)", category: "Chassis" },
    { name: "n_cores", desc: "Number of processor cores", type: "Integer (1 – 8 Cores)", category: "Processor" },
    { name: "pc", desc: "Primary Camera megapixels", type: "Integer (0 – 20 MP)", category: "Optics" },
    { name: "px_height", desc: "Pixel Resolution Height", type: "Integer (0 – 1960 px)", category: "Display" },
    { name: "px_width", desc: "Pixel Resolution Width", type: "Integer (500 – 1980 px)", category: "Display" },
    { name: "ram", desc: "Random Access Memory in Megabytes", type: "Integer (256 – 4000 MB)", category: "Memory" },
    { name: "sc_h", desc: "Screen Height in cm", type: "Integer (5 – 19 cm)", category: "Display" },
    { name: "sc_w", desc: "Screen Width in cm", type: "Integer (0 – 18 cm)", category: "Display" },
    { name: "talk_time", desc: "Longest battery talk time in hours", type: "Integer (2 – 20 hrs)", category: "Battery" },
    { name: "three_g", desc: "Has 3G network connectivity", type: "Binary (0/1)", category: "Connectivity" },
    { name: "touch_screen", desc: "Has touchscreen support", type: "Binary (0/1)", category: "Display" },
    { name: "wifi", desc: "Has Wi-Fi wireless networking", type: "Binary (0/1)", category: "Connectivity" },
    { name: "price_range", desc: "Target Class: 0 (Low), 1 (Medium), 2 (High), 3 (Very High)", type: "Target (0 – 3)", category: "Target Label" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      {/* ── HEADER ── */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-sky-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Architecture Verification & Defense</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pricing Taxonomy & Technical Defense Protocols
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed font-sans">
            Mathematical foundations, loss derivations, and theoretical proof answers for the entire classification and segmentation engine. Exhaustive technical defenses covering information entropy, variance reduction, Fisher's criterion, and non-linear Hilbert projections.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-[#00F5D4] transition"
          >
            <Sliders className="h-3.5 w-3.5 text-[#00F5D4]" />
            Return to Classifier
          </Link>
          <Link
            to="/arena"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-mono text-white hover:border-purple-400 transition"
          >
            <Trophy className="h-3.5 w-3.5 text-purple-400" />
            Model Arena
          </Link>
        </div>
      </div>

      {/* ── 1. THE 4 CLASSIFICATION PRICING TIERS ── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl">
        <PricingTiers currentPredictionTier={inference.consensusTier} />
      </div>

      {/* ── 2. BESPOKE DEFENSE PROTOCOLS CONSOLE ── */}
      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-[#00F5D4]">
              <Terminal className="h-3.5 w-3.5" />
              <span>Technical Verification Console</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Algorithmic Defense & Architectural Proofs
            </h2>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Filter by system module or search equations and derivations in real time.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-white/70">
              <span className="text-white/40">PROTOCOLS:</span> <strong className="text-[#00F5D4]">9 VERIFIED</strong>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-white/70">
              <span className="text-white/40">CHAMPION:</span> <strong className="text-[#FF2A85]">96.5% RBF SVC</strong>
            </div>
          </div>
        </div>

        {/* Cyber Search & Filter Ribbon */}
        <div className="space-y-4">
          {/* Live Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mathematical derivations, formulas, loss functions (e.g. Entropy, Fisher, RBF, DBSCAN)..."
              className="w-full rounded-2xl border border-white/10 bg-[#060910] py-3.5 pl-11 pr-4 text-xs font-mono text-white placeholder-white/40 focus:border-[#00F5D4] focus:outline-none focus:ring-1 focus:ring-[#00F5D4]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-xl px-3.5 py-1.5 font-mono text-xs transition cursor-pointer ${
                  activeCategory === cat.key
                    ? "border border-[#00F5D4] bg-[#00F5D4]/15 text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.25)] font-bold"
                    : "border border-white/10 bg-black/40 text-white/60 hover:border-white/25 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Defense Protocol Cards */}
        <div className="space-y-4">
          {filteredProtocols.map((item, idx) => {
            const isOpen = openFaq === idx;
            const Icon = item.icon;

            return (
              <SpotlightBentoCard
                key={item.id}
                accentColor={item.badgeColor}
                className={`transition-all duration-300 ${
                  isOpen ? "border-white/25 bg-[#070B14]" : "border-white/[0.08]"
                }`}
              >
                <div
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="cursor-pointer space-y-3"
                >
                  {/* Top HUD Telemetry Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl border"
                        style={{
                          borderColor: `${item.badgeColor}66`,
                          backgroundColor: `${item.badgeColor}15`,
                          color: item.badgeColor,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        {item.sysCode}
                      </span>
                      <span className="hidden sm:inline-block rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/60">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold"
                        style={{
                          borderColor: `${item.badgeColor}55`,
                          backgroundColor: `${item.badgeColor}1a`,
                          color: item.badgeColor,
                        }}
                      >
                        {item.metricBadge}
                      </span>
                      <span className="rounded-full p-1 bg-white/5 text-white/60 hover:text-white transition">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-[#00F5D4]" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Question Title */}
                  <div className="pt-1">
                    <h3 className="text-base sm:text-lg font-bold text-white transition-colors hover:text-[#00F5D4]">
                      {item.question}
                    </h3>
                  </div>
                </div>

                {/* Expanded Rich Telemetry Drawer */}
                {isOpen && (
                  <div className="mt-5 space-y-5 border-t border-white/10 pt-5">
                    {/* Mathematical Formula Terminal Box */}
                    <div className="rounded-2xl border border-white/10 bg-[#04060A] p-4 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-white/50">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-[#00F5D4]" />
                          FORMAL MATHEMATICAL FORMULATION
                        </span>
                        <span>LATEX EQUATION</span>
                      </div>
                      <div className="py-1 text-white/90 overflow-x-auto select-all text-xs sm:text-sm font-semibold tracking-wide">
                        {item.formula}
                      </div>
                    </div>

                    {/* Detailed Technical Answer */}
                    <div className="space-y-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                      <p>{item.answer}</p>
                    </div>

                    {/* Key Empirical Comparison Pills */}
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pt-2">
                      {item.comparisons.map((c, cIdx) => (
                        <div
                          key={cIdx}
                          className="rounded-xl border border-white/5 bg-black/50 p-3 font-mono text-xs"
                        >
                          <div className="text-[10px] text-white/50">{c.label}</div>
                          <div className="mt-1 font-bold text-white">{c.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Action Button to Test Algorithm */}
                    <div className="flex justify-end pt-2">
                      <Link
                        to={item.workbenchLink}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white hover:border-[#00F5D4] hover:text-[#00F5D4] transition"
                      >
                        <span>{item.workbenchLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </SpotlightBentoCard>
            );
          })}
        </div>
      </section>

      {/* ── 3. 20-FEATURE KAGGLE DATASET SCHEMA REFERENCE ── */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-purple-400">
            <Database className="h-3.5 w-3.5" />
            <span>Dataset Specification</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Kaggle Mobile Price Dataset Schema (All 20 Features)
          </h2>
          <p className="mt-1 text-xs text-white/60 font-sans">
            Complete hardware feature dictionary used across all supervised and unsupervised models.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/45">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Value Range / Type</th>
                <th className="py-3 px-4">Physical Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {datasetFeatures.map((f) => (
                <tr key={f.name} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-4 font-bold text-[#00F5D4]">{f.name}</td>
                  <td className="py-2.5 px-4 text-white/60">{f.category}</td>
                  <td className="py-2.5 px-4 text-white/75">{f.type}</td>
                  <td className="py-2.5 px-4 text-white/90 font-sans">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
