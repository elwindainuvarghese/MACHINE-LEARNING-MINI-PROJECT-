"""
Module 4 (Exp 6): Dimensionality Reduction Suite — PCA, LDA, & TruncatedSVD
Extracts 2D and 3D coordinate manifolds, computes explained variance,
and benchmarks classifier accuracy and inference latency before vs. after reduction.
"""

import time
import numpy as np
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

def evaluate_dimensionality_reduction(data_dict, max_sample_points=200):
    X_train = data_dict['X_train_scaled']
    X_test = data_dict['X_test_scaled']
    y_train = data_dict['y_train']
    y_test = data_dict['y_test']
    df = data_dict['df']
    
    # --- 1. PCA (2D & 3D) ---
    pca_2d = PCA(n_components=2, random_state=42)
    X_pca_2d_train = pca_2d.fit_transform(X_train)
    X_pca_2d_test = pca_2d.transform(X_test)
    var_pca_2d = [round(float(v) * 100, 2) for v in pca_2d.explained_variance_ratio_]
    
    pca_3d = PCA(n_components=3, random_state=42)
    X_pca_3d_train = pca_3d.fit_transform(X_train)
    X_pca_3d_test = pca_3d.transform(X_test)
    var_pca_3d = [round(float(v) * 100, 2) for v in pca_3d.explained_variance_ratio_]
    
    # --- 2. LDA (Linear Discriminant Analysis - Supervised 2D & 3D) ---
    # With 4 classes, max components = min(n_features, n_classes - 1) = 3
    lda_2d = LDA(n_components=2)
    X_lda_2d_train = lda_2d.fit_transform(X_train, y_train)
    X_lda_2d_test = lda_2d.transform(X_test)
    var_lda_2d = [round(float(v) * 100, 2) for v in lda_2d.explained_variance_ratio_]
    
    lda_3d = LDA(n_components=3)
    X_lda_3d_train = lda_3d.fit_transform(X_train, y_train)
    X_lda_3d_test = lda_3d.transform(X_test)
    var_lda_3d = [round(float(v) * 100, 2) for v in lda_3d.explained_variance_ratio_]
    
    # --- 3. TruncatedSVD (2D & 3D) ---
    svd_2d = TruncatedSVD(n_components=2, random_state=42)
    X_svd_2d_train = svd_2d.fit_transform(X_train)
    X_svd_2d_test = svd_2d.transform(X_test)
    var_svd_2d = [round(float(v) * 100, 2) for v in svd_2d.explained_variance_ratio_]
    
    svd_3d = TruncatedSVD(n_components=3, random_state=42)
    X_svd_3d_train = svd_3d.fit_transform(X_train)
    X_svd_3d_test = svd_3d.transform(X_test)
    var_svd_3d = [round(float(v) * 100, 2) for v in svd_3d.explained_variance_ratio_]
    
    # --- 4. Downstream Classifier Benchmark (Accuracy & Latency Before vs. After) ---
    def benchmark_space(X_tr, X_te, name):
        clf = LogisticRegression(max_iter=1000, random_state=42)
        start_train = time.perf_counter()
        clf.fit(X_tr, y_train)
        train_ms = round((time.perf_counter() - start_train) * 1000, 3)
        
        start_inf = time.perf_counter()
        preds = clf.predict(X_te)
        inf_ms = round((time.perf_counter() - start_inf) * 1000, 3)
        acc = round(float(accuracy_score(y_test, preds)) * 100, 2)
        
        return {
            'feature_space': name,
            'dimensions': X_tr.shape[1],
            'accuracy': acc,
            'train_time_ms': train_ms,
            'inference_latency_ms': inf_ms
        }
        
    space_benchmarks = [
        benchmark_space(X_train, X_test, 'Full Uncompressed (20D)'),
        benchmark_space(X_pca_3d_train, X_pca_3d_test, 'PCA (3D Latent)'),
        benchmark_space(X_lda_3d_train, X_lda_3d_test, 'LDA (3D Supervised Discriminants)'),
        benchmark_space(X_svd_3d_train, X_svd_3d_test, 'TruncatedSVD (3D Subspace)')
    ]
    
    # --- 5. Generate Representative Samples for 3D/2D Plotting ---
    np.random.seed(42)
    n_total = len(data_dict['X_test_scaled'])
    sample_size = min(max_sample_points, n_total)
    sample_idx = np.random.choice(n_total, size=sample_size, replace=False)
    
    points = []
    for i in sample_idx:
        row_raw = data_dict['X_test_raw'].iloc[i]
        true_tier = int(y_test.iloc[i])
        
        points.append({
            'point_id': int(i),
            'true_tier': true_tier,
            'tier_label': f"Tier {true_tier}",
            'ram': int(row_raw['ram']),
            'battery_power': int(row_raw['battery_power']),
            'px_width': int(row_raw['px_width']),
            'px_height': int(row_raw['px_height']),
            'int_memory': int(row_raw['int_memory']),
            'mobile_wt': int(row_raw['mobile_wt']),
            'pca_2d': [round(float(X_pca_2d_test[i, 0]), 3), round(float(X_pca_2d_test[i, 1]), 3)],
            'pca_3d': [round(float(X_pca_3d_test[i, 0]), 3), round(float(X_pca_3d_test[i, 1]), 3), round(float(X_pca_3d_test[i, 2]), 3)],
            'lda_2d': [round(float(X_lda_2d_test[i, 0]), 3), round(float(X_lda_2d_test[i, 1]), 3)],
            'lda_3d': [round(float(X_lda_3d_test[i, 0]), 3), round(float(X_lda_3d_test[i, 1]), 3), round(float(X_lda_3d_test[i, 2]), 3)],
            'svd_2d': [round(float(X_svd_2d_test[i, 0]), 3), round(float(X_svd_2d_test[i, 1]), 3)],
            'svd_3d': [round(float(X_svd_3d_test[i, 0]), 3), round(float(X_svd_3d_test[i, 1]), 3), round(float(X_svd_3d_test[i, 2]), 3)]
        })
        
    projections = {
        'explained_variance': {
            'pca_2d': var_pca_2d,
            'pca_3d': var_pca_3d,
            'total_pca_3d_var': round(sum(var_pca_3d), 2),
            'lda_2d': var_lda_2d,
            'lda_3d': var_lda_3d,
            'total_lda_3d_var': round(sum(var_lda_3d), 2),
            'svd_2d': var_svd_2d,
            'svd_3d': var_svd_3d,
            'total_svd_3d_var': round(sum(var_svd_3d), 2)
        },
        'space_benchmarks': space_benchmarks,
        'points': points
    }
    
    return {
        'transformers': {
            'pca_2d': pca_2d,
            'pca_3d': pca_3d,
            'lda_2d': lda_2d,
            'lda_3d': lda_3d,
            'svd_2d': svd_2d,
            'svd_3d': svd_3d
        },
        'projections': projections
    }
