"""
Master ML Training & Evaluation Pipeline
Coordinates Modules 1 through 6 (Experiments 2 through 9),
evaluates all benchmarks, and serializes artifacts into backend/artifacts/.
"""

import os
import json
import joblib

try:
    from .data_loader import preprocess_and_split, FEATURE_NAMES, READABLE_LABELS
    from .baseline_models import evaluate_baseline_models
    from .tree_models import evaluate_tree_models
    from .ensemble_models import evaluate_ensemble_models
    from .dim_reduction import evaluate_dimensionality_reduction
    from .svm_models import evaluate_svm_models
    from .clustering_anomaly import evaluate_clustering_and_mst, AnomalyDetector
except (ImportError, ValueError):
    from data_loader import preprocess_and_split, FEATURE_NAMES, READABLE_LABELS
    from baseline_models import evaluate_baseline_models
    from tree_models import evaluate_tree_models
    from ensemble_models import evaluate_ensemble_models
    from dim_reduction import evaluate_dimensionality_reduction
    from svm_models import evaluate_svm_models
    from clustering_anomaly import evaluate_clustering_and_mst, AnomalyDetector

def run_full_pipeline(artifacts_dir=None):
    if artifacts_dir is None:
        artifacts_dir = os.path.join(os.path.dirname(__file__), '..', 'artifacts')
    os.makedirs(artifacts_dir, exist_ok=True)
    
    print("=" * 70)
    print("[PIPELINE] STARTING COMPREHENSIVE ML LAB PIPELINE (MODULES 1 TO 6 / EXP 2-9)")
    print("=" * 70)
    
    # 1. Data Loading & Preprocessing (Exp 2)
    print("\n[1/6] Loading & Preprocessing Dataset...")
    data_dict = preprocess_and_split()
    print(f"      Train Samples: {len(data_dict['X_train_scaled'])}, Test Samples: {len(data_dict['X_test_scaled'])}")
    
    # 2. Baseline Models: Linear vs. Logistic Regression (Exp 2)
    print("\n[2/6] Evaluating Baseline Models (Linear vs. Logistic Regression)...")
    baseline_res = evaluate_baseline_models(data_dict)
    
    # 3. CART Decision Trees: Gini vs. Entropy & Regression Trees (Exp 3 & 4)
    print("\n[3/6] Evaluating CART Decision Trees (Classification vs. Regression)...")
    tree_res = evaluate_tree_models(data_dict)
    
    # 4. Ensemble Learning: Bagging vs. Boosting (Exp 5)
    print("\n[4/6] Evaluating Ensemble Learning (Random Forest vs. Gradient Boosting)...")
    ensemble_res = evaluate_ensemble_models(data_dict)
    
    # 5. Dimensionality Reduction: PCA, LDA, TruncatedSVD (Exp 6)
    print("\n[5/6] Computing Dimensionality Reductions (PCA, LDA, SVD Manifolds)...")
    dim_res = evaluate_dimensionality_reduction(data_dict)
    
    # 6. SVM Suite: Linear, RBF, Poly (Exp 7)
    print("\n[6/6] Evaluating Support Vector Machines (Linear, RBF, Poly SVC/SVR)...")
    svm_res = evaluate_svm_models(data_dict)
    
    # 7. Unsupervised Segmentation & Anomaly Detection: MST, DBSCAN, K-Means (Exp 8 & 9)
    print("\n[7/7] Computing MST Graph Clustering & DBSCAN vs. K-Means...")
    cluster_res = evaluate_clustering_and_mst(data_dict)
    
    # Initialize real-time anomaly detector
    anomaly_detector = AnomalyDetector(
        scaler=data_dict['scaler'],
        kmeans_model=cluster_res['models']['kmeans'],
        core_samples=cluster_res['models']['core_samples']
    )
    
    # Bundle all trained models for real-time consensus inference
    trained_models = {
        'scaler': data_dict['scaler'],
        'logistic_regression': baseline_res['models']['logistic_regression'],
        'linear_regression': baseline_res['models']['linear_regression'],
        'cart_gini': tree_res['models']['clf_gini'],
        'cart_entropy': tree_res['models']['clf_entropy'],
        'cart_regressor': tree_res['models']['reg_trees']['squared_error'],
        'random_forest': ensemble_res['models']['random_forest'],
        'gradient_boosting': ensemble_res['models']['gradient_boosting'],
        'svc_linear': svm_res['models']['svc']['linear'],
        'svc_rbf': svm_res['models']['svc']['rbf'],
        'svr_rbf': svm_res['models']['svr']['rbf'],
        'kmeans': cluster_res['models']['kmeans'],
        'dbscan': cluster_res['models']['dbscan'],
        'anomaly_detector': anomaly_detector
    }
    
    # Compile Master Benchmark Payload
    master_benchmarks = {
        'exp2_baseline_regression_vs_classification': baseline_res['benchmarks'],
        'exp3_and_4_cart_trees': tree_res['benchmarks'],
        'exp5_ensemble_bagging_vs_boosting': ensemble_res['benchmarks'],
        'exp6_dimensionality_reduction': {
            'explained_variance': dim_res['projections']['explained_variance'],
            'space_benchmarks': dim_res['projections']['space_benchmarks']
        },
        'exp7_support_vector_machines': svm_res['benchmarks'],
        'exp8_and_9_clustering_and_anomaly': cluster_res['benchmarks'],
        'feature_importances': ensemble_res['benchmarks']['top_features'],
        'meta': {
            'dataset_rows': len(data_dict['df']),
            'features_count': len(FEATURE_NAMES),
            'target_classes': [0, 1, 2, 3],
            'class_names': ['Low Cost (0)', 'Medium Cost (1)', 'High Cost (2)', 'Very High Cost (3)']
        }
    }
    
    # Compile Master Projections Payload (2D/3D Scatter, MST Edges, Clusters)
    master_projections = {
        'explained_variance': dim_res['projections']['explained_variance'],
        'sample_points': dim_res['projections']['points'],
        'mst_graph': cluster_res['mst_graph_data'],
        'kmeans_summary': cluster_res['benchmarks']['kmeans_vs_dbscan']['kmeans'],
        'dbscan_summary': cluster_res['benchmarks']['kmeans_vs_dbscan']['dbscan']
    }
    
    # Serialize artifacts
    models_path = os.path.join(artifacts_dir, 'models.joblib')
    scaler_path = os.path.join(artifacts_dir, 'scaler.joblib')
    benchmarks_path = os.path.join(artifacts_dir, 'benchmarks.json')
    projections_path = os.path.join(artifacts_dir, 'projections.json')
    
    joblib.dump(trained_models, models_path)
    joblib.dump(data_dict['scaler'], scaler_path)
    
    with open(benchmarks_path, 'w') as f:
        json.dump(master_benchmarks, f, indent=2)
        
    with open(projections_path, 'w') as f:
        json.dump(master_projections, f, indent=2)
        
    print("\n" + "=" * 70)
    print("[SUCCESS] MASTER ML PIPELINE COMPLETED SUCCESSFULLY!")
    print(f"   Artifacts saved in: {artifacts_dir}")
    print(f"   - Models: {models_path}")
    print(f"   - Benchmarks: {benchmarks_path}")
    print(f"   - Projections: {projections_path}")
    print("=" * 70)
    
    return {
        'models': trained_models,
        'benchmarks': master_benchmarks,
        'projections': master_projections
    }

if __name__ == '__main__':
    run_full_pipeline()
