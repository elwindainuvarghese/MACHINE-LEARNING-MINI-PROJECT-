import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Plotly from 'plotly.js-dist-min';
import { 
  Network, Cpu, Sliders, Database, Layers, Sparkles, 
  CheckCircle2, ArrowRight, TrendingUp, Compass, Activity, 
  Eye, Box, GitFork, ShieldAlert, BarChart3, Info 
} from 'lucide-react';
import { FALLBACK_PROJECTIONS, FALLBACK_BENCHMARKS } from '../api';

export default function SyllabusAnalysis({ benchmarksData, projectionsData }) {
  const [projectionMode, setProjectionMode] = useState('pca_3d'); // 'pca_3d' | 'lda_3d' | 'svd_3d' | 'pca_2d'
  const [colorMode, setColorMode] = useState('true_tier'); // 'true_tier' | 'dbscan' | 'kmeans'
  const [showMstEdges, setShowMstEdges] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const plotContainerRef = useRef(null);

  // Projections and benchmarks data extraction
  const proj = projectionsData || FALLBACK_PROJECTIONS;
  const bm = benchmarksData || FALLBACK_BENCHMARKS;
  const exp6 = bm?.exp6_dimensionality_reduction;
  const exp8 = bm?.exp8_and_9_clustering_and_anomaly;

  const points = proj?.sample_points || [];
  const mst = proj?.mst_graph || {};

  // Color mappings
  const tierColors = {
    0: '#00f5d4', // Low Tier - Cyan
    1: '#3b82f6', // Mid Tier - Blue
    2: '#ff2a85', // High Tier - Magenta
    3: '#39ff14'  // Flagship - Lime
  };

  const dbscanColors = {
    '-1': '#ff0055', // Outlier noise - Laser Red
    '0': '#00f5d4',
    '1': '#3b82f6',
    '2': '#ff2a85',
    '3': '#39ff14'
  };

  const kmeansColors = {
    0: '#ffbe0b',
    1: '#00f5d4',
    2: '#7b2cbf',
    3: '#39ff14'
  };

  // Render or update Plotly 3D/2D scatter plot
  useEffect(() => {
    if (!plotContainerRef.current || points.length === 0) return;

    const is3D = projectionMode !== 'pca_2d';
    const traces = [];

    // 1. Group points by category for clean interactive legends
    const groups = {};

    points.forEach((pt, idx) => {
      let groupKey = 'Class 0';
      let groupColor = tierColors[0];

      if (colorMode === 'true_tier') {
        groupKey = `Tier ${pt.true_tier}: ${pt.tier_label}`;
        groupColor = tierColors[pt.true_tier] || '#00f5d4';
      } else if (colorMode === 'dbscan') {
        const dLabel = (mst.dbscan_sample_labels && mst.dbscan_sample_labels[idx] !== undefined)
          ? mst.dbscan_sample_labels[idx]
          : -1;
        groupKey = dLabel === -1 ? 'DBSCAN Noise (-1)' : `DBSCAN Cluster ${dLabel}`;
        groupColor = dbscanColors[String(dLabel)] || '#ff0055';
      } else if (colorMode === 'kmeans') {
        const kLabel = (mst.kmeans_sample_labels && mst.kmeans_sample_labels[idx] !== undefined)
          ? mst.kmeans_sample_labels[idx]
          : 0;
        groupKey = `K-Means Cluster ${kLabel}`;
        groupColor = kmeansColors[kLabel] || '#ffbe0b';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: groupKey,
          color: groupColor,
          x: [], y: [], z: [],
          customdata: [],
          text: []
        };
      }

      // Extract coordinates
      let coords = [0, 0, 0];
      if (projectionMode === 'pca_3d') coords = pt.pca_3d || [0, 0, 0];
      else if (projectionMode === 'lda_3d') coords = pt.lda_3d || [0, 0, 0];
      else if (projectionMode === 'svd_3d') coords = pt.svd_3d || [0, 0, 0];
      else if (projectionMode === 'pca_2d') coords = [pt.pca_2d[0], pt.pca_2d[1], 0];

      groups[groupKey].x.push(coords[0]);
      groups[groupKey].y.push(coords[1]);
      if (is3D) groups[groupKey].z.push(coords[2]);

      groups[groupKey].customdata.push(pt);
      groups[groupKey].text.push(
        `<b>${pt.tier_label}</b><br>` +
        `RAM: ${pt.ram} MB<br>` +
        `Battery: ${pt.battery_power} mAh<br>` +
        `Storage: ${pt.int_memory} GB<br>` +
        `Display: ${pt.px_width}x${pt.px_height}`
      );
    });

    // 2. Add scatter traces
    Object.values(groups).forEach(g => {
      if (is3D) {
        traces.push({
          type: 'scatter3d',
          mode: 'markers',
          name: g.name,
          x: g.x,
          y: g.y,
          z: g.z,
          text: g.text,
          hoverinfo: 'text',
          customdata: g.customdata,
          marker: {
            size: 5,
            color: g.color,
            opacity: 0.9,
            line: { color: '#ffffff', width: 0.5 }
          }
        });
      } else {
        traces.push({
          type: 'scatter',
          mode: 'markers',
          name: g.name,
          x: g.x,
          y: g.y,
          text: g.text,
          hoverinfo: 'text',
          customdata: g.customdata,
          marker: {
            size: 8,
            color: g.color,
            opacity: 0.9,
            line: { color: '#ffffff', width: 0.5 }
          }
        });
      }
    });

    // 3. Minimum Spanning Tree (MST) Graph Edges Overlay (Exp 8 & 9)
    if (showMstEdges && mst.edges && mst.edges.length > 0) {
      const edgeLinesX = [];
      const edgeLinesY = [];
      const edgeLinesZ = [];

      mst.edges.forEach((edge) => {
        const u = edge.source !== undefined ? edge.source : edge[0];
        const v = edge.target !== undefined ? edge.target : edge[1];
        if (points[u] && points[v]) {
          let uCoord = [0, 0, 0];
          let vCoord = [0, 0, 0];

          if (projectionMode === 'pca_3d') {
            uCoord = points[u].pca_3d;
            vCoord = points[v].pca_3d;
          } else if (projectionMode === 'lda_3d') {
            uCoord = points[u].lda_3d;
            vCoord = points[v].lda_3d;
          } else if (projectionMode === 'svd_3d') {
            uCoord = points[u].svd_3d;
            vCoord = points[v].svd_3d;
          } else {
            uCoord = [points[u].pca_2d[0], points[u].pca_2d[1], 0];
            vCoord = [points[v].pca_2d[0], points[v].pca_2d[1], 0];
          }

          edgeLinesX.push(uCoord[0], vCoord[0], null);
          edgeLinesY.push(uCoord[1], vCoord[1], null);
          if (is3D) edgeLinesZ.push(uCoord[2], vCoord[2], null);
        }
      });

      if (is3D) {
        traces.push({
          type: 'scatter3d',
          mode: 'lines',
          name: 'MST Euclidean Edges',
          x: edgeLinesX,
          y: edgeLinesY,
          z: edgeLinesZ,
          hoverinfo: 'none',
          line: {
            color: 'rgba(255, 255, 255, 0.22)',
            width: 1.5
          }
        });
      } else {
        traces.push({
          type: 'scatter',
          mode: 'lines',
          name: 'MST Euclidean Edges',
          x: edgeLinesX,
          y: edgeLinesY,
          hoverinfo: 'none',
          line: {
            color: 'rgba(255, 255, 255, 0.25)',
            width: 1.2
          }
        });
      }
    }

    // Plotly layout dark theme
    const layout = {
      autosize: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 0, r: 0, b: 0, t: 0 },
      showlegend: true,
      legend: {
        x: 0, y: 1,
        font: { family: 'Space Grotesk', color: '#cbd5e1', size: 10 },
        bgcolor: 'rgba(13, 13, 26, 0.8)',
        bordercolor: 'rgba(255,255,255,0.1)',
        borderwidth: 1
      }
    };

    if (is3D) {
      layout.scene = {
        xaxis: { title: { text: 'Comp 1' }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: '#00f5d4', color: '#94a3b8' },
        yaxis: { title: { text: 'Comp 2' }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: '#ff2a85', color: '#94a3b8' },
        zaxis: { title: { text: 'Comp 3' }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: '#39ff14', color: '#94a3b8' },
        bgcolor: 'rgba(8, 8, 17, 0.4)',
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.2 }
        }
      };
    } else {
      layout.xaxis = { title: { text: 'Component 1' }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: '#00f5d4', color: '#94a3b8' };
      layout.yaxis = { title: { text: 'Component 2' }, gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: '#ff2a85', color: '#94a3b8' };
    }

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud']
    };

    try {
      Plotly.react(plotContainerRef.current, traces, layout, config);
    } catch (err) {
      console.error("[SyllabusAnalysis] Plotly react error:", err);
    }

    // Event listener for click inspection
    const plotElem = plotContainerRef.current;
    const handleClick = (data) => {
      if (data && data.points && data.points[0] && data.points[0].customdata) {
        setSelectedPoint(data.points[0].customdata);
      }
    };

    plotElem.on('plotly_click', handleClick);

    return () => {
      if (plotElem && plotElem.removeAllListeners) {
        plotElem.removeAllListeners('plotly_click');
      }
    };
  }, [projectionMode, colorMode, showMstEdges, points, mst]);

  return (
    <section id="syllabus-lab" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel mb-4 border-neon-cyan/40 stripe-cyan">
          <Network className="w-4 h-4 text-neon-cyan" />
          <span className="font-semibold text-xs uppercase tracking-wider text-gray-200 font-mono">
            Bento Tile 04 // 3D Manifolds & Graph Topology
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white mb-4">
          Dimensionality Reduction & MST Clustering —
        </h2>
        <p className="text-gray-400 text-base sm:text-lg font-medium leading-relaxed">
          Unsupervised & Supervised Manifold projections (PCA, LDA, TruncatedSVD) combined with Minimum Spanning Tree (MST) graph topologies and DBSCAN density clustering.
        </p>

        {/* Projection Mode Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {[
            { id: 'pca_3d', label: 'PCA 3D Manifold', icon: Box },
            { id: 'lda_3d', label: 'LDA 3D Supervised', icon: Compass },
            { id: 'svd_3d', label: 'TruncatedSVD 3D', icon: Layers },
            { id: 'pca_2d', label: 'PCA 2D Projection', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setProjectionMode(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                  projectionMode === tab.id
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,245,212,0.35)]'
                    : 'glass-panel text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3D WebGL Visualization Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Plotly Interactive Canvas (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 relative overflow-hidden">
          
          {/* Canvas Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
            {/* Color Palette Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Color Palette:</span>
              <button
                onClick={() => setColorMode('true_tier')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                  colorMode === 'true_tier'
                    ? 'bg-neon-lime/20 border-neon-lime text-neon-lime'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                Price Tiers (0-3)
              </button>
              <button
                onClick={() => setColorMode('dbscan')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                  colorMode === 'dbscan'
                    ? 'bg-neon-magenta/20 border-neon-magenta text-neon-magenta'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                DBSCAN Clusters & Outliers
              </button>
              <button
                onClick={() => setColorMode('kmeans')}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                  colorMode === 'kmeans'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                K-Means (k=4)
              </button>
            </div>

            {/* MST Edges Toggle */}
            <button
              onClick={() => setShowMstEdges(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono border cursor-pointer transition-all ${
                showMstEdges
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,245,212,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>MST Edges {showMstEdges ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* WebGL Plotly Container */}
          <div 
            ref={plotContainerRef} 
            className="w-full h-[520px] rounded-2xl overflow-hidden bg-black/40 border border-white/5"
          />

          {/* Interactive instruction pill */}
          <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-gray-400">
            <span>🖱️ Click & Drag to Orbit 3D Manifold • Scroll to Zoom</span>
            <span className="text-neon-cyan">Click any node to inspect hardware specs</span>
          </div>
        </div>

        {/* Sidebar Info & Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected Point Inspector */}
          {selectedPoint ? (
            <div className="glass-panel rounded-3xl p-5 border border-neon-cyan/40 stripe-cyan space-y-3 shadow-[0_0_25px_rgba(0,245,212,0.2)]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono text-neon-cyan font-bold uppercase">
                  Hardware Inspector
                </span>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-white text-xs font-mono"
                >
                  ✕ Close
                </button>
              </div>
              <div className="text-xl font-bold text-white">
                Phone Node #{selectedPoint.point_id} — {selectedPoint.tier_label}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">RAM Memory</div>
                  <div className="font-bold text-neon-cyan">{selectedPoint.ram} MB</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">Battery Power</div>
                  <div className="font-bold text-neon-lime">{selectedPoint.battery_power} mAh</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">Display Resolution</div>
                  <div className="font-bold text-white">{selectedPoint.px_width}x{selectedPoint.px_height}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <div className="text-[10px] text-gray-400">Internal Storage</div>
                  <div className="font-bold text-neon-magenta">{selectedPoint.int_memory} GB</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-5 border border-white/10 text-center py-8">
              <Compass className="w-8 h-8 text-neon-cyan/50 mx-auto mb-2 animate-pulse" />
              <div className="text-xs font-mono text-gray-300 font-bold">Node Inspector Idle</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Click any smartphone point in the 3D space to isolate its raw hardware specs.
              </div>
            </div>
          )}

          {/* Subspace Projection Benchmarks */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-neon-lime font-bold uppercase">
                Subspace Projection Benchmarks
              </span>
              <span className="text-[10px] font-mono text-gray-400">Dim Reduction Impact</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 bg-white/5 rounded-xl">
                <span className="text-gray-300">Original (20 Features)</span>
                <span className="font-bold text-white">87.6% (12.4 ms)</span>
              </div>
              <div className="flex justify-between p-2 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20">
                <span className="text-neon-cyan">LDA (3 Components)</span>
                <span className="font-bold text-neon-cyan">84.8% (2.8 ms) ⚡</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-xl">
                <span className="text-gray-300">PCA (3 Components)</span>
                <span className="font-bold text-white">74.3% (3.1 ms)</span>
              </div>
              <div className="flex justify-between p-2 bg-white/5 rounded-xl">
                <span className="text-gray-300">TruncatedSVD (3 Comp)</span>
                <span className="font-bold text-white">72.5% (3.2 ms)</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal pt-1">
              💡 <strong>Key Finding:</strong> Linear Discriminant Analysis (LDA) achieves <strong className="text-neon-cyan">4.4x lower latency</strong> while retaining 84.8% accuracy because it explicitly maximizes between-class scatter relative to within-class variance.
            </p>
          </div>

          {/* Unsupervised Clustering Comparison Metrics */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-neon-magenta font-bold uppercase">
                Unsupervised Clustering Analytics
              </span>
              <span className="text-[10px] font-mono text-gray-400">MST & DBSCAN</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">MST Spanning Nodes</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {exp8?.mst_clustering?.nodes_count ?? 120} Nodes
                </div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">Euclidean Tree Edges</div>
                <div className="text-base font-bold text-neon-cyan mt-0.5">
                  {exp8?.mst_clustering?.edges_count ?? 119} Edges
                </div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">K-Means Silhouette</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {exp8?.kmeans_vs_dbscan?.kmeans?.silhouette_score ?? '0.043'}
                </div>
              </div>
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-400">DBSCAN Epsilon Radius</div>
                <div className="text-base font-bold text-neon-magenta mt-0.5">
                  ε = {exp8?.kmeans_vs_dbscan?.dbscan?.eps ?? '2.85'}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal pt-1">
              Minimum Spanning Tree (MST) identifies bridge connections between hardware profiles. Pruning the longest (k-1) edges decomposes the global dataset into natural density archetypes without imposing spherical cluster assumptions.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
