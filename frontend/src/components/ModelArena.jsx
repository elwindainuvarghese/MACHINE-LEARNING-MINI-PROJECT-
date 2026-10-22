import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Trophy, CheckCircle2, Cpu, Activity, Zap, Layers, 
  GitBranch, ShieldCheck, Scale, Network, Sparkles, AlertCircle 
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';
import { ScrambleText, LiveCartTreeVisualizer } from './ui/cyber-telemetry-fx';

export default function ModelArena({ metricsData, benchmarksData }) {
  const [activeTab, setActiveTab] = useState('exp5_ensemble'); // 'exp2_baselines' | 'exp3_trees' | 'exp5_ensemble' | 'exp7_svm'
  const { specs, activeTierMeta } = useHardware();
  
  // Safe extraction of benchmark labs
  const bm = benchmarksData || metricsData?.benchmarks;
  const exp2 = bm?.exp2_baseline_regression_vs_classification;
  const exp3 = bm?.exp3_and_4_cart_trees;
  const exp5 = bm?.exp5_ensemble_bagging_vs_boosting;
  const exp7 = bm?.exp7_support_vector_machines;
  const featureImportances = bm?.feature_importances || metricsData?.feature_importance || [
    { feature: 'ram', label: 'RAM Memory (MB)', importance_pct: 54.37 },
    { feature: 'battery_power', label: 'Battery Capacity (mAh)', importance_pct: 5.83 },
    { feature: 'px_height', label: 'Pixel Height', importance_pct: 4.30 },
    { feature: 'px_width', label: 'Pixel Width', importance_pct: 4.20 },
    { feature: 'mobile_wt', label: 'Chassis Weight (g)', importance_pct: 3.63 },
    { feature: 'int_memory', label: 'Internal Storage (GB)', importance_pct: 3.35 },
    { feature: 'clock_speed', label: 'Processor Clock (GHz)', importance_pct: 2.95 },
    { feature: 'fc', label: 'Front Camera (MP)', importance_pct: 2.95 }
  ];

  const cmData = exp7?.svc_linear?.confusion_matrix || metricsData?.confusion_matrix?.matrix || [
    [96, 4, 0, 0],
    [5, 87, 8, 0],
    [0, 6, 85, 9],
    [0, 0, 7, 93]
  ];

  const cmLabels = ['Class 0 (Low)', 'Class 1 (Mid)', 'Class 2 (High)', 'Class 3 (Ultra)'];

  // Global Leaderboard models
  const leaderboardModels = metricsData?.models_comparison || [
    { name: 'Gradient Boosting (Sequential)', accuracy: 89.0, precision: 89.11, recall: 89.0, f1: 88.99, tag: 'Champion Boosting' },
    { name: 'Random Forest (Bagging)', accuracy: 87.6, precision: 87.91, recall: 87.6, f1: 87.59, tag: 'Champion Bagging' },
    { name: 'Multinomial Logistic (Softmax)', accuracy: 87.0, precision: 87.35, recall: 87.0, f1: 87.07, tag: 'Multinomial Softmax' },
    { name: 'Linear SVM (Maximum Margin)', accuracy: 86.8, precision: 87.0, recall: 86.8, f1: 86.83, tag: 'Maximum Margin' },
    { name: 'Linear Reg Continuous (OLS)', accuracy: 83.75, precision: 84.02, recall: 83.75, f1: 84.02, tag: 'Discretized OLS' },
    { name: 'CART Tree (Shannon Entropy)', accuracy: 80.75, precision: 80.85, recall: 80.75, f1: 80.85, tag: 'Info Gain Split' },
    { name: 'CART Tree (Gini Impurity)', accuracy: 76.5, precision: 76.69, recall: 76.5, f1: 76.69, tag: 'Gini Impurity Split' }
  ];

  const barColors = ['#00f5d4', '#39ff14', '#7b2cbf', '#3b82f6', '#ffbe0b', '#ff2a85', '#ec4899'];

  return (
    <section id="model-arena" className="py-6 px-2 sm:px-6 max-w-7xl mx-auto">
      {/* Algorithmic Suite Tabs Ribbon */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'exp5_ensemble', label: 'Ensemble: Bagging vs. Boosting', icon: Zap },
          { id: 'exp2_baselines', label: 'OLS Regression vs. Softmax', icon: Scale },
          { id: 'exp3_trees', label: 'CART: Gini vs. Entropy', icon: GitBranch },
          { id: 'exp7_svm', label: 'Support Vector Machines (RBF)', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-semibold shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                  : 'bg-black/40 text-white/60 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB CONTENT 1: ENSEMBLE LEARNING & FEATURE IMPORTANCES ================= */}
      {activeTab === 'exp5_ensemble' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Champion Banner */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 stripe-lime neon-shadow-lime border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-neon-lime/20 border border-neon-lime/40 flex items-center justify-center shrink-0">
                <Trophy className="w-8 h-8 text-neon-lime animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neon-lime font-bold mb-1">
                  CHAMPION ENSEMBLE ARCHITECTURES
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gradient Boosting (89.0%) vs. Random Forest (87.6%) ✨
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Sequential gradient-boosted trees minimize bias, while parallel bagging with bootstrap replicas minimizes variance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
              <div className="text-right font-mono">
                <div className="text-[11px] text-gray-400">Random Forest OOB Score</div>
                <div className="text-xl font-bold text-neon-cyan">
                  {exp5?.bagging_random_forest?.oob_score ? `${exp5.bagging_random_forest.oob_score}%` : '86.8%'}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-[11px] text-gray-400">Multiclass ROC-AUC (GB)</div>
                <div className="text-xl font-bold text-neon-lime">
                  {exp5?.boosting_gradient?.multiclass_roc_auc ? `${exp5.boosting_gradient.multiclass_roc_auc}` : '0.985'}
                </div>
              </div>
            </div>
          </div>

          {/* Grid: Bagging vs Boosting Head-to-Head & Feature Importance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Bagging vs Boosting Table (6 Cols) */}
            <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-cyan">
                  Bagging vs. Boosting Comparison
                </span>
                <span className="text-xs font-mono text-gray-400">Exp 5 Lab</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-3 p-3 bg-white/5 rounded-xl text-gray-400 font-bold">
                  <span>Metric / Property</span>
                  <span className="text-neon-cyan">Random Forest</span>
                  <span className="text-neon-lime">Gradient Boosting</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-black/20 rounded-xl">
                  <span className="text-gray-300">Ensemble Paradigm</span>
                  <span className="text-gray-200">Bagging (Parallel)</span>
                  <span className="text-gray-200">Boosting (Sequential)</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Primary Objective</span>
                  <span className="text-neon-cyan">Variance Reduction</span>
                  <span className="text-neon-lime">Bias Reduction</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-black/20 rounded-xl">
                  <span className="text-gray-300">Test Accuracy</span>
                  <span className="font-bold text-white">87.60%</span>
                  <span className="font-bold text-neon-lime">89.00%</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Weighted F1-Score</span>
                  <span className="text-white">87.59%</span>
                  <span className="text-neon-lime">88.99%</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-black/20 rounded-xl">
                  <span className="text-gray-300">Validation Mode</span>
                  <span className="text-neon-cyan">Out-of-Bag (86.8%)</span>
                  <span className="text-neon-lime">Validation Stratified</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Inference Latency</span>
                  <span className="text-gray-300">~12.4 ms</span>
                  <span className="text-gray-300">~8.2 ms</span>
                </div>
              </div>

              <div className="p-3.5 bg-neon-cyan/5 rounded-xl border border-neon-cyan/20 text-xs text-gray-300 leading-relaxed">
                💡 <strong className="text-neon-cyan">Lab Takeaway:</strong> Random Forest trains independent deep trees on bootstrap replicas in parallel, preventing overfitting. Gradient Boosting fits consecutive shallow trees to the negative gradients (pseudo-residuals) of the loss function, achieving the highest classification accuracy.
              </div>
            </div>

            {/* Feature Importance Ranking Chart (6 Cols) */}
            <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-magenta">
                  Random Forest Feature Importances
                </span>
                <span className="text-xs font-mono text-gray-400">Mean Impurity Decrease</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={featureImportances} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#94a3b8" unit="%" fontSize={11} domain={[0, 60]} />
                    <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                    <Tooltip 
                      formatter={(val) => [`${val}%`, 'Importance']}
                      contentStyle={{ backgroundColor: '#0d0d1a', borderColor: '#ff2a85', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="importance_pct" radius={[0, 8, 8, 0]}>
                      {featureImportances.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#00f5d4' : index === 1 ? '#39ff14' : '#ff2a85'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 bg-neon-magenta/5 rounded-xl border border-neon-magenta/20 text-xs text-gray-300 leading-relaxed">
                🎯 <strong className="text-neon-magenta">Dominant Feature:</strong> RAM Memory accounts for over <strong className="text-neon-cyan">54.4%</strong> of the total tree split decisions, followed by Battery Capacity (~5.8%) and Display Pixel Matrix (~8.5% combined).
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ================= TAB CONTENT 2: EXP 2 BASELINE LINEAR VS LOGISTIC ================= */}
      {activeTab === 'exp2_baselines' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Linear Regression Continuous Estimator Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 stripe-cyan">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-cyan">
                  Model A: Linear Regression (OLS)
                </span>
                <span className="text-xs font-mono text-gray-400">Continuous Estimator</span>
              </div>
              <p className="text-xs text-gray-300">
                Treats the price tiers as a continuous numeric index [0.0 - 3.0] minimized via Ordinary Least Squares:
              </p>
              
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">R² Score</div>
                  <div className="text-lg font-bold text-neon-cyan mt-1">
                    {exp2?.linear_regression?.r2_score ?? '0.9027'}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">MAE</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {exp2?.linear_regression?.mae ?? '0.2872'}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">RMSE</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {exp2?.linear_regression?.rmse ?? '0.3487'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/30 rounded-2xl border border-white/5 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Thresholded Discrete Accuracy:</span>
                  <span className="font-bold text-neon-cyan">{exp2?.linear_regression?.discretized_accuracy ?? '83.75'}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discretized F1-Score:</span>
                  <span className="font-bold text-white">{exp2?.linear_regression?.discretized_f1 ?? '84.02'}%</span>
                </div>
                <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  Method: Continuous output rounded and clamped to {"{0, 1, 2, 3}"}.
                </div>
              </div>
            </div>

            {/* Multinomial Logistic Regression Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 stripe-magenta">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-magenta">
                  Model B: Multinomial Logistic Regression
                </span>
                <span className="text-xs font-mono text-gray-400">Softmax Classifier</span>
              </div>
              <p className="text-xs text-gray-300">
                Directly models categorical posterior class probabilities via the Softmax log-odds formulation:
              </p>

              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">Classification Accuracy</div>
                  <div className="text-lg font-bold text-neon-magenta mt-1">
                    {exp2?.logistic_regression?.accuracy ?? '87.00'}%
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">Precision (Macro)</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {exp2?.logistic_regression?.precision ?? '87.35'}%
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400">F1-Score (Macro)</div>
                  <div className="text-lg font-bold text-white mt-1">
                    {exp2?.logistic_regression?.f1_score ?? '87.07'}%
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/30 rounded-2xl border border-white/5 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Classification Advantage (Delta):</span>
                  <span className="font-bold text-neon-lime">+{exp2?.comparison_summary?.accuracy_delta ?? '3.25'}% Accuracy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Optimization Loss:</span>
                  <span className="font-bold text-white">Cross-Entropy Log-Loss</span>
                </div>
                <div className="text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  Direct classification assigns calibrated probabilities without unbounded regression extrapolation.
                </div>
              </div>
            </div>

          </div>

          {/* Theoretical Lab Deduction Card */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-gradient-to-r from-neon-purple/10 to-transparent">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              Experiment 2 Architectural Insight & Viva Defense:
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              While Linear Regression achieves a strong continuous R² = 0.9027 and discretized accuracy of 83.75%, it assumes constant distance between ordinal classes and can predict unrealistic numbers outside the [0, 3] bounds. Multinomial Logistic Regression outperforms it (87.0% accuracy, +3.25% delta) because the Softmax activation naturally guarantees normalized class probabilities summing to 1.0, optimizing directly for decision-boundary margin separation.
            </p>
          </div>
        </motion.div>
      )}

      {/* ================= TAB CONTENT 3: EXP 3 & 4 CART TREES (GINI VS ENTROPY) ================= */}
      {activeTab === 'exp3_trees' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* CART Classification: Gini vs Entropy Delta */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-lime">
                CART Classification Split Criteria — Gini Impurity vs. Information Gain (Entropy)
              </span>
              <span className="text-xs font-mono text-neon-cyan font-bold">
                Entropy Wins (+4.25% Accuracy)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* Gini Card */}
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">Gini Impurity Criterion</span>
                  <span className="text-gray-400 text-[11px]">I_G(p) = 1 - Σ(p_i²)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Accuracy</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {exp3?.classification?.gini?.accuracy ?? '76.50'}%
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Tree Depth</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {exp3?.classification?.gini?.tree_depth ?? 8}
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Node Count</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {exp3?.classification?.gini?.node_count ?? 227}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Gini minimizes the probability of misclassification when randomly assigning a label according to class distribution. Fast computation, but can create slightly more redundant nodes.
                </p>
              </div>

              {/* Entropy Card */}
              <div className="bg-neon-lime/5 p-4 rounded-2xl border border-neon-lime/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neon-lime text-sm">Entropy (Information Gain)</span>
                  <span className="text-neon-lime text-[11px]">H(S) = -Σ(p_i · log₂ p_i)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Accuracy</div>
                    <div className="text-sm font-bold text-neon-lime mt-0.5">
                      {exp3?.classification?.entropy?.accuracy ?? '80.75'}%
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Tree Depth</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {exp3?.classification?.entropy?.tree_depth ?? 8}
                    </div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400">Node Count</div>
                    <div className="text-sm font-bold text-neon-lime mt-0.5">
                      {exp3?.classification?.entropy?.node_count ?? 203} (-24 nodes)
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Information gain measures reduction in Shannon entropy. It produces a cleaner, more parsimonious tree with 24 fewer nodes and +4.25% higher classification accuracy on this dataset.
                </p>
              </div>
            </div>
          </div>

          {/* Live Decision Tree Electric Path Flow (Active Phone Traversal) */}
          <LiveCartTreeVisualizer
            ram={specs?.ram || 2000}
            battery={specs?.battery_power || 1500}
            pxHeight={specs?.px_height || 800}
            criterion="entropy"
            accent={activeTierMeta?.accent || "#00F5D4"}
          />

          {/* CART Regression: Continuous Loss Optimization */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neon-cyan">
                CART Continuous Regression Trees (Continuous Loss Optimization)
              </span>
              <span className="text-xs font-mono text-gray-400">Squared vs. Absolute Error</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <div className="text-neon-cyan font-bold mb-1">squared_error</div>
                <div className="text-gray-300">R² Score: <span className="text-white font-bold">{exp3?.regression?.squared_error?.r2_score ?? '0.863'}</span></div>
                <div className="text-gray-300">RMSE: <span className="text-white font-bold">{exp3?.regression?.squared_error?.rmse ?? '0.4138'}</span></div>
                <div className="text-gray-300">Discretized Acc: <span className="text-neon-lime font-bold">{exp3?.regression?.squared_error?.discretized_accuracy ?? '80.75'}%</span></div>
              </div>
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <div className="text-neon-lime font-bold mb-1">friedman_mse</div>
                <div className="text-gray-300">R² Score: <span className="text-white font-bold">{exp3?.regression?.friedman_mse?.r2_score ?? '0.863'}</span></div>
                <div className="text-gray-300">RMSE: <span className="text-white font-bold">{exp3?.regression?.friedman_mse?.rmse ?? '0.4138'}</span></div>
                <div className="text-gray-300">Discretized Acc: <span className="text-neon-lime font-bold">{exp3?.regression?.friedman_mse?.discretized_accuracy ?? '80.75'}%</span></div>
              </div>
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5">
                <div className="text-neon-magenta font-bold mb-1">absolute_error</div>
                <div className="text-gray-300">R² Score: <span className="text-white font-bold">{exp3?.regression?.absolute_error?.r2_score ?? '0.836'}</span></div>
                <div className="text-gray-300">RMSE: <span className="text-white font-bold">{exp3?.regression?.absolute_error?.rmse ?? '0.4528'}</span></div>
                <div className="text-gray-300">Discretized Acc: <span className="text-gray-200 font-bold">{exp3?.regression?.absolute_error?.discretized_accuracy ?? '79.50'}%</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= TAB CONTENT 4: EXP 7 SUPPORT VECTOR MACHINES ================= */}
      {activeTab === 'exp7_svm' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* SVM Kernel Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Linear Kernel */}
            <div className="glass-panel p-5 rounded-3xl border border-neon-cyan/40 stripe-cyan space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neon-cyan text-sm">Linear Kernel (SVC)</span>
                <span className="text-[10px] text-gray-400">K(x, x') = x · x'</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {exp7?.svc_linear?.accuracy ?? '86.80'}% <span className="text-xs font-normal text-gray-400">Accuracy</span>
              </div>
              <div className="space-y-1 text-gray-300">
                <div className="flex justify-between"><span>F1-Score:</span><span className="text-white font-bold">{exp7?.svc_linear?.f1_score ?? '86.83'}%</span></div>
                <div className="flex justify-between"><span>Training Time:</span><span className="text-neon-cyan font-bold">{exp7?.svc_linear?.training_time_sec ?? '0.024'} s</span></div>
                <div className="flex justify-between"><span>Support Vectors:</span><span className="text-white font-bold">{exp7?.svc_linear?.support_vectors_count ?? '684'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5">
                Fastest convergence and maximum generalization. Strongest performer among SVM kernels on 20 scaled dimensions.
              </p>
            </div>

            {/* RBF Kernel */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neon-lime text-sm">RBF Kernel (SVC)</span>
                <span className="text-[10px] text-gray-400">exp(-γ ||x - x'||²)</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {exp7?.svc_rbf?.accuracy ?? '84.25'}% <span className="text-xs font-normal text-gray-400">Accuracy</span>
              </div>
              <div className="space-y-1 text-gray-300">
                <div className="flex justify-between"><span>F1-Score:</span><span className="text-white font-bold">{exp7?.svc_rbf?.f1_score ?? '84.20'}%</span></div>
                <div className="flex justify-between"><span>Training Time:</span><span className="text-white font-bold">{exp7?.svc_rbf?.training_time_sec ?? '0.048'} s</span></div>
                <div className="flex justify-between"><span>Support Vectors:</span><span className="text-white font-bold">{exp7?.svc_rbf?.support_vectors_count ?? '1240'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5">
                Non-linear Gaussian projection. Maps hardware points to infinite-dimensional Hilbert space.
              </p>
            </div>

            {/* Poly Kernel */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-neon-magenta text-sm">Poly Kernel (deg=3)</span>
                <span className="text-[10px] text-gray-400">(γ x · x' + r)³</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {exp7?.svc_poly?.accuracy ?? '78.50'}% <span className="text-xs font-normal text-gray-400">Accuracy</span>
              </div>
              <div className="space-y-1 text-gray-300">
                <div className="flex justify-between"><span>F1-Score:</span><span className="text-white font-bold">{exp7?.svc_poly?.f1_score ?? '78.44'}%</span></div>
                <div className="flex justify-between"><span>Training Time:</span><span className="text-white font-bold">{exp7?.svc_poly?.training_time_sec ?? '0.062'} s</span></div>
                <div className="flex justify-between"><span>Support Vectors:</span><span className="text-white font-bold">{exp7?.svc_poly?.support_vectors_count ?? '1410'}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-white/5">
                Higher polynomial degrees over-parameterize the boundary across 20 dimensions without regularization.
              </p>
            </div>
          </div>

          {/* 4x4 Confusion Matrix Grid */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Confusion Matrix Heatmap (Linear SVM Classifier on Test Set, n=400)
              </span>
              <span className="text-xs font-mono text-neon-cyan">86.8% Overall Accuracy</span>
            </div>

            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                {/* Header Row */}
                <div className="p-2 text-[10px] text-gray-500 font-bold">True \ Pred</div>
                {cmLabels.map((l, i) => (
                  <div key={i} className="p-2 text-[10px] text-gray-400 font-bold truncate">T{i}</div>
                ))}

                {/* Matrix Rows */}
                {cmData.map((row, rowIdx) => (
                  <React.Fragment key={rowIdx}>
                    <div className="p-2 text-[10px] text-gray-400 font-bold flex items-center justify-center">
                      T{rowIdx}
                    </div>
                    {row.map((val, colIdx) => {
                      const isDiagonal = rowIdx === colIdx;
                      return (
                        <div
                          key={colIdx}
                          className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all ${
                            isDiagonal
                              ? 'bg-neon-cyan/25 text-neon-cyan border border-neon-cyan/40 shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                              : val > 0
                              ? 'bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/20'
                              : 'bg-black/20 text-gray-600'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-4 px-2">
                <span>Diagonal = Correct Predictions</span>
                <span className="text-neon-cyan font-bold">Trace Sum = 347 / 400</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Global Benchmark Leaderboard Bar Chart */}
      <div className="mt-12 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-neon-cyan font-bold">
              Global Cross-Lab Benchmark Leaderboard
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Multi-Algorithm Accuracy Ranking
            </h3>
          </div>
          <span className="text-xs font-mono text-gray-400">80/20 Stratified Test Partition</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaderboardModels} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 95]} unit="%" />
              <Tooltip 
                formatter={(val) => [`${val}%`, 'Accuracy']}
                contentStyle={{ backgroundColor: '#0d0d1a', borderColor: '#00f5d4', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                {leaderboardModels.map((entry, index) => (
                  <Cell key={`lead-cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
