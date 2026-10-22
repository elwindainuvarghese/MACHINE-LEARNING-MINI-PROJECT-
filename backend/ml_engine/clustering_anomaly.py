"""
Module 6 (Exp 8 & Exp 9): Unsupervised Segmentation & Anomaly Detection — MST & DBSCAN
Implements Minimum Spanning Tree (MST) Graph Clustering and DBSCAN vs. K-Means,
plus a real-time Anomaly Spec Detector for flagging unrealistic phone configurations.
"""

import numpy as np
from scipy.spatial.distance import pdist, squareform, cdist
from scipy.sparse.csgraph import minimum_spanning_tree, connected_components
from scipy.sparse import csr_matrix
from sklearn.cluster import KMeans, DBSCAN
from sklearn.metrics import silhouette_score
try:
    from .data_loader import FEATURE_NAMES, READABLE_LABELS
except (ImportError, ValueError):
    from data_loader import FEATURE_NAMES, READABLE_LABELS

def evaluate_clustering_and_mst(data_dict, max_mst_points=120):
    X_scaled = data_dict['X_train_scaled']
    y_train = data_dict['y_train']
    
    # --- 1. Graph-Based Clustering via Minimum Spanning Tree (MST) ---
    # Take representative subset for crisp, fast MST graph edges
    np.random.seed(42)
    n_total = len(X_scaled)
    sample_size = min(max_mst_points, n_total)
    sample_indices = np.random.choice(n_total, size=sample_size, replace=False)
    X_sample = X_scaled[sample_indices]
    y_sample = y_train.iloc[sample_indices].to_numpy()
    
    # Compute full pairwise Euclidean distance matrix
    dist_matrix = squareform(pdist(X_sample, metric='euclidean'))
    
    # Compute Minimum Spanning Tree via Kruskal/Prim algorithm in SciPy
    mst_sparse = minimum_spanning_tree(dist_matrix)
    mst_array = mst_sparse.toarray()
    
    # Extract all MST edges (u, v, weight)
    edges = []
    sources, targets = np.nonzero(mst_array)
    for u, v in zip(sources, targets):
        edges.append({
            'source': int(u),
            'target': int(v),
            'weight': round(float(mst_array[u, v]), 3)
        })
        
    # Sort edges descending by weight to find the k-1 = 3 longest bottleneck edges
    k_clusters = 4
    edges_sorted = sorted(edges, key=lambda e: e['weight'], reverse=True)
    cut_edges = edges_sorted[:(k_clusters - 1)]
    
    # Create severed MST graph to extract archetype connected components
    mst_pruned = mst_array.copy()
    for cut in cut_edges:
        mst_pruned[cut['source'], cut['target']] = 0
        mst_pruned[cut['target'], cut['source']] = 0
        
    # Compute connected components of the pruned tree
    n_components, mst_labels = connected_components(
        csr_matrix(mst_pruned + mst_pruned.T), directed=False
    )
    
    # --- 2. Density-Based Clustering: DBSCAN vs. K-Means ---
    # K-Means (k=4)
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans_labels = kmeans.fit_predict(X_scaled)
    kmeans_sil = round(float(silhouette_score(X_scaled, kmeans_labels)), 3)
    
    # DBSCAN
    # Calibrated eps on 20-dim standardized space: ~2.8 to 3.2 captures high-density manifolds
    dbscan = DBSCAN(eps=2.85, min_samples=6)
    dbscan_labels = dbscan.fit_predict(X_scaled)
    
    n_noise = int(np.sum(dbscan_labels == -1))
    noise_ratio = round((n_noise / len(dbscan_labels)) * 100, 2)
    n_dbscan_clusters = len(set(dbscan_labels)) - (1 if -1 in dbscan_labels else 0)
    
    non_noise_mask = dbscan_labels != -1
    if len(set(dbscan_labels[non_noise_mask])) > 1:
        dbscan_sil = round(float(silhouette_score(X_scaled[non_noise_mask], dbscan_labels[non_noise_mask])), 3)
    else:
        dbscan_sil = 0.0
        
    benchmarks = {
        'mst_clustering': {
            'nodes_count': sample_size,
            'edges_count': len(edges),
            'pruned_bottleneck_edges': cut_edges,
            'derived_archetypes': int(n_components),
            'algorithm_details': 'Minimum Spanning Tree (Kruskal/Prim) with (k-1) longest bridge pruning'
        },
        'kmeans_vs_dbscan': {
            'kmeans': {
                'k_clusters': 4,
                'silhouette_score': kmeans_sil,
                'cluster_distribution': [int(np.sum(kmeans_labels == c)) for c in range(4)]
            },
            'dbscan': {
                'eps': 2.85,
                'min_samples': 6,
                'identified_clusters': n_dbscan_clusters,
                'outlier_noise_count': n_noise,
                'outlier_noise_ratio_pct': noise_ratio,
                'silhouette_score_core': dbscan_sil
            },
            'comparison_insight': 'K-Means enforces spherical partitions of fixed k=4, whereas DBSCAN autonomously discovers dense core hardware clusters while naturally flagging outliers as label -1.'
        }
    }
    
    mst_graph_data = {
        'sample_indices': [int(idx) for idx in sample_indices],
        'edges': edges,
        'cut_edges': cut_edges,
        'mst_labels': [int(l) for l in mst_labels],
        'kmeans_sample_labels': [int(kmeans_labels[idx]) for idx in sample_indices],
        'dbscan_sample_labels': [int(dbscan_labels[idx]) for idx in sample_indices]
    }
    
    return {
        'models': {
            'kmeans': kmeans,
            'dbscan': dbscan,
            'core_samples': X_scaled[dbscan.core_sample_indices_] if len(dbscan.core_sample_indices_) > 0 else X_scaled
        },
        'benchmarks': benchmarks,
        'mst_graph_data': mst_graph_data
    }

class AnomalyDetector:
    """
    Real-Time DBSCAN & Centroid-Distance Anomaly Detector
    Flags unrealistic/outlier phone hardware combinations entered in the UI.
    """
    def __init__(self, scaler, kmeans_model, core_samples, dbscan_eps=2.85):
        self.scaler = scaler
        self.kmeans = kmeans_model
        self.core_samples = core_samples
        self.eps = dbscan_eps
        
    def check_anomaly(self, input_vector_dict):
        # Convert dictionary to ordered feature vector
        vector = np.array([input_vector_dict.get(f, 0) for f in FEATURE_NAMES]).reshape(1, -1)
        scaled_vec = self.scaler.transform(vector)
        
        # 1. Compute distance to nearest DBSCAN core sample
        core_distances = cdist(scaled_vec, self.core_samples, metric='euclidean')[0]
        min_core_dist = float(np.min(core_distances))
        
        # 2. Compute distance to nearest K-Means cluster centroid
        centroid_distances = cdist(scaled_vec, self.kmeans.cluster_centers_, metric='euclidean')[0]
        min_centroid_dist = float(np.min(centroid_distances))
        
        # 3. Domain Logic Anomaly Checks
        anomalies_flagged = []
        ram = input_vector_dict.get('ram', 0)
        battery = input_vector_dict.get('battery_power', 0)
        px_h = input_vector_dict.get('px_height', 0)
        px_w = input_vector_dict.get('px_width', 0)
        sc_h = input_vector_dict.get('sc_h', 0)
        sc_w = input_vector_dict.get('sc_w', 0)
        cores = input_vector_dict.get('n_cores', 0)
        clock = input_vector_dict.get('clock_speed', 0)
        
        if ram >= 3500 and battery <= 800:
            anomalies_flagged.append("High RAM (Flagship tier) paired with critically deficient battery (<800 mAh).")
        if battery >= 4500 and ram <= 512:
            anomalies_flagged.append("Massive power cell paired with severely bottlenecked RAM (512 MB).")
        if sc_w >= sc_h and sc_h > 0:
            anomalies_flagged.append(f"Inverted aspect ratio: screen width ({sc_w}cm) >= screen height ({sc_h}cm).")
        if px_h >= 1800 and px_w <= 600:
            anomalies_flagged.append("Extreme aspect distortion in display pixel matrix.")
        if cores >= 8 and clock <= 0.6:
            anomalies_flagged.append("Octa-core CPU throttled to sub-0.6 GHz clock frequency.")
        if cores <= 1 and ram >= 3800:
            anomalies_flagged.append("Single-core CPU mismatched with 4GB ultra-high-speed RAM.")
            
        # DBSCAN Outlier criteria
        is_density_outlier = min_core_dist > (self.eps * 1.15)
        if is_density_outlier:
            anomalies_flagged.append(f"Density Outlier: Hardware vector distance ({round(min_core_dist, 2)}) exceeds DBSCAN core epsilon radius ({self.eps}).")
            
        is_outlier = is_density_outlier or (len(anomalies_flagged) > 0)
        
        anomaly_score = round(min(1.0, min_core_dist / (self.eps * 2.0)) * 100, 1)
        
        return {
            'is_outlier': bool(is_outlier),
            'anomaly_status': 'ANOMALY DETECTED (Outlier Spec)' if is_outlier else 'REALISTIC HARDWARE ARCHETYPE',
            'anomaly_score_pct': anomaly_score,
            'nearest_core_distance': round(min_core_dist, 3),
            'dbscan_eps_threshold': round(self.eps, 3),
            'min_centroid_distance': round(min_centroid_dist, 3),
            'flagged_reasons': anomalies_flagged if anomalies_flagged else ["Hardware parameters align with realistic market manufacturing archetypes."]
        }
