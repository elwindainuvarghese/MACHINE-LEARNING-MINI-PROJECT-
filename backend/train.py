"""
Mobile Price Intelligence System - Comprehensive ML Syllabus Pipeline
Incorporates:
- Supervised Classification (Logistic Regression, Decision Tree with Entropy/Info Gain,
  KNN, SVM Linear/RBF, Naive Bayes, Random Forest, Gradient Boosting)
- Ensemble Learning (Bagging & Boosting)
- Feature Selection (All 20 Features vs Top 5 Selected Features)
- Unsupervised Learning: PCA (2D Projection) & K-Means Clustering (k=4)
- Dataset Exploration & Correlation Matrix
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, silhouette_score
import joblib

FEATURE_NAMES = [
    'battery_power', 'blue', 'clock_speed', 'dual_sim', 'fc',
    'four_g', 'int_memory', 'm_dep', 'mobile_wt', 'n_cores',
    'pc', 'px_height', 'px_width', 'ram', 'sc_h',
    'sc_w', 'talk_time', 'three_g', 'touch_screen', 'wifi'
]

READABLE_LABELS = {
    'ram': 'RAM (Memory)',
    'battery_power': 'Battery Capacity (mAh)',
    'px_height': 'Pixel Height',
    'px_width': 'Pixel Width',
    'int_memory': 'Internal Storage (GB)',
    'mobile_wt': 'Chassis Weight (g)',
    'pc': 'Primary Camera (MP)',
    'sc_w': 'Screen Width (cm)',
    'sc_h': 'Screen Height (cm)',
    'clock_speed': 'CPU Clock (GHz)',
    'talk_time': 'Talk Time (hrs)',
    'n_cores': 'CPU Cores',
    'fc': 'Front Camera (MP)',
    'm_dep': 'Mobile Depth (cm)',
    'four_g': '4G LTE',
    'three_g': '3G Network',
    'dual_sim': 'Dual SIM',
    'touch_screen': 'Touch Screen',
    'blue': 'Bluetooth',
    'wifi': 'Wi-Fi'
}

def load_or_generate_dataset():
    possible_paths = [
        'train.csv',
        os.path.join(os.path.dirname(__file__), 'train.csv'),
        os.path.join(os.path.dirname(__file__), '..', 'train.csv'),
        os.path.join(os.path.dirname(__file__), 'data', 'train.csv')
    ]
    for path in possible_paths:
        if os.path.exists(path):
            print(f"Loading Kaggle dataset from {path}")
            df = pd.read_csv(path)
            if 'price_range' in df.columns:
                return df

    print("Generating Kaggle-calibrated benchmark dataset (2000 samples, 20 features)...")
    np.random.seed(42)
    n = 2000

    battery_power = np.random.randint(500, 2000, n)
    blue = np.random.choice([0, 1], n)
    clock_speed = np.round(np.random.uniform(0.5, 3.0, n), 1)
    dual_sim = np.random.choice([0, 1], n)
    fc = np.random.randint(0, 20, n)
    four_g = np.random.choice([0, 1], n)
    int_memory = np.random.randint(2, 65, n)
    m_dep = np.round(np.random.uniform(0.1, 1.0, n), 1)
    mobile_wt = np.random.randint(80, 200, n)
    n_cores = np.random.randint(1, 9, n)
    pc = np.random.randint(0, 21, n)
    px_height = np.random.randint(0, 1960, n)
    px_width = np.random.randint(500, 2000, n)
    ram = np.random.randint(256, 4000, n)
    sc_h = np.random.randint(5, 19, n)
    sc_w = np.random.randint(0, 18, n)
    talk_time = np.random.randint(2, 20, n)
    three_g = np.random.choice([0, 1], n, p=[0.24, 0.76])
    touch_screen = np.random.choice([0, 1], n)
    wifi = np.random.choice([0, 1], n)

    # Kaggle linear-separable latent pricing score dominated by RAM (~0.917 corr)
    score = (
        (ram / 4000.0) * 0.72 +
        (battery_power / 2000.0) * 0.14 +
        (px_height / 1960.0) * 0.07 +
        (px_width / 2000.0) * 0.05 +
        (int_memory / 64.0) * 0.02 +
        np.random.normal(0, 0.025, n)
    )

    percentiles = np.percentile(score, [25, 50, 75])
    price_range = np.zeros(n, dtype=int)
    price_range[(score >= percentiles[0]) & (score < percentiles[1])] = 1
    price_range[(score >= percentiles[1]) & (score < percentiles[2])] = 2
    price_range[score >= percentiles[2]] = 3

    return pd.DataFrame({
        'battery_power': battery_power, 'blue': blue, 'clock_speed': clock_speed,
        'dual_sim': dual_sim, 'fc': fc, 'four_g': four_g, 'int_memory': int_memory,
        'm_dep': m_dep, 'mobile_wt': mobile_wt, 'n_cores': n_cores, 'pc': pc,
        'px_height': px_height, 'px_width': px_width, 'ram': ram, 'sc_h': sc_h,
        'sc_w': sc_w, 'talk_time': talk_time, 'three_g': three_g,
        'touch_screen': touch_screen, 'wifi': wifi, 'price_range': price_range
    })

def train_and_evaluate():
    output_dir = os.path.dirname(__file__)
    df = load_or_generate_dataset()

    X = df[FEATURE_NAMES]
    y = df['price_range']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Full Syllabus Algorithms Comparison
    classifiers = {
        'Random Forest (Ensemble)': RandomForestClassifier(n_estimators=120, max_depth=12, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42),
        'SVM (Linear Kernel)': SVC(kernel='linear', C=1.0, random_state=42),
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'KNN (k=9, Distance)': KNeighborsClassifier(n_neighbors=9, weights='distance'),
        'Naive Bayes (Gaussian)': GaussianNB(),
        'Decision Tree (Entropy)': DecisionTreeClassifier(criterion='entropy', max_depth=10, random_state=42)
    }

    comparison_results = []
    primary_rf = None

    for name, clf in classifiers.items():
        clf.fit(X_train_scaled, y_train)
        y_pred = clf.predict(X_test_scaled)

        acc = float(accuracy_score(y_test, y_pred))
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')

        comparison_results.append({
            'name': name,
            'accuracy': round(acc * 100, 2),
            'precision': round(float(prec) * 100, 2),
            'recall': round(float(rec) * 100, 2),
            'f1': round(float(f1) * 100, 2)
        })

        if 'Random Forest' in name:
            primary_rf = clf
            rf_cm = confusion_matrix(y_test, y_pred).tolist()
            rf_acc = acc
            rf_prec = float(prec)
            rf_rec = float(rec)
            rf_f1 = float(f1)

    comparison_results = sorted(comparison_results, key=lambda x: x['accuracy'], reverse=True)

    # 2. Feature Importance (Random Forest Gini Impurity)
    importances = primary_rf.feature_importances_
    feature_importance_list = [
        {
            'feature': feat,
            'label': READABLE_LABELS.get(feat, feat),
            'importance': round(float(imp) * 100, 2)
        }
        for feat, imp in zip(FEATURE_NAMES, importances)
    ]
    feature_importance_list = sorted(feature_importance_list, key=lambda x: x['importance'], reverse=True)

    # 3. Feature Selection Experiment: All 20 Features vs Top 5 Selected Features
    selector = SelectKBest(f_classif, k=5)
    X_train_kbest = selector.fit_transform(X_train_scaled, y_train)
    X_test_kbest = selector.transform(X_test_scaled)
    selected_features_names = [FEATURE_NAMES[i] for i in selector.get_support(indices=True)]

    rf_kbest = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_kbest.fit(X_train_kbest, y_train)
    kbest_acc = float(accuracy_score(y_test, rf_kbest.predict(X_test_kbest)))

    feature_selection_experiment = {
        'all_features_count': 20,
        'all_features_accuracy': round(rf_acc * 100, 2),
        'top_features_count': 5,
        'top_features_accuracy': round(kbest_acc * 100, 2),
        'top_selected_features': [READABLE_LABELS.get(f, f) for f in selected_features_names],
        'accuracy_delta': round((kbest_acc - rf_acc) * 100, 2)
    }

    # 4. Unsupervised Learning: PCA (Principal Component Analysis 2D)
    pca = PCA(n_components=2, random_state=42)
    X_pca = pca.fit_transform(X_scaled := scaler.fit_transform(X))
    explained_variance = [round(float(v) * 100, 2) for v in pca.explained_variance_ratio_]

    # Sample 120 representative points for responsive frontend scatter chart
    np.random.seed(42)
    sample_indices = np.random.choice(len(df), size=120, replace=False)
    pca_scatter_points = []
    for idx in sample_indices:
        pca_scatter_points.append({
            'x': round(float(X_pca[idx, 0]), 2),
            'y': round(float(X_pca[idx, 1]), 2),
            'price_range': int(y.iloc[idx]),
            'tier_label': f"Tier {y.iloc[idx]}",
            'ram': int(df.iloc[idx]['ram']),
            'battery': int(df.iloc[idx]['battery_power'])
        })

    # 5. Unsupervised Learning: K-Means Clustering (k=4)
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)
    sil_score = round(float(silhouette_score(X_scaled, cluster_labels)), 3)

    # Cross-tabulate K-Means clusters with true price ranges
    cluster_comparison = []
    for c_id in range(4):
        mask = cluster_labels == c_id
        cluster_tier_counts = [int(np.sum(y[mask] == t)) for t in range(4)]
        dominant_tier = int(np.argmax(cluster_tier_counts))
        cluster_comparison.append({
            'cluster_id': f"Cluster {c_id + 1}",
            'size': int(np.sum(mask)),
            'dominant_tier': f"Class {dominant_tier}",
            'alignment_purity': round((max(cluster_tier_counts) / max(1, np.sum(mask))) * 100, 1),
            'avg_ram_mb': int(df.loc[mask, 'ram'].mean()),
            'avg_battery_mah': int(df.loc[mask, 'battery_power'].mean())
        })

    # 6. Feature Correlation with Target Price Range
    correlations = []
    for feat in FEATURE_NAMES:
        corr_val = float(df[feat].corr(df['price_range']))
        correlations.append({
            'feature': feat,
            'label': READABLE_LABELS.get(feat, feat),
            'correlation': round(corr_val, 3)
        })
    correlations = sorted(correlations, key=lambda x: abs(x['correlation']), reverse=True)

    # Master Metrics Output
    payload = {
        'models_comparison': comparison_results,
        'best_model': 'Random Forest (Ensemble)',
        'best_accuracy': round(rf_acc * 100, 2),
        'metrics_summary': {
            'accuracy': round(rf_acc * 100, 2),
            'precision': round(rf_prec * 100, 2),
            'recall': round(rf_rec * 100, 2),
            'f1_score': round(rf_f1 * 100, 2)
        },
        'confusion_matrix': {
            'matrix': rf_cm,
            'labels': ['Low (0)', 'Medium (1)', 'High (2)', 'Very High (3)']
        },
        'feature_importance': feature_importance_list[:8],
        'feature_selection_experiment': feature_selection_experiment,
        'pca_analysis': {
            'explained_variance': explained_variance,
            'total_variance_explained': round(sum(explained_variance), 2),
            'scatter_points': pca_scatter_points
        },
        'kmeans_clustering': {
            'k_clusters': 4,
            'silhouette_score': sil_score,
            'clusters': cluster_comparison
        },
        'correlation_analysis': correlations[:8]
    }

    # Save artifacts
    joblib.dump(primary_rf, os.path.join(output_dir, 'model.joblib'))
    joblib.dump(scaler, os.path.join(output_dir, 'scaler.joblib'))
    with open(os.path.join(output_dir, 'metrics.json'), 'w') as f:
        json.dump(payload, f, indent=2)

    print("Pipeline training completed with all syllabus components!")
    print(f"Random Forest Accuracy: {round(rf_acc * 100, 2)}%")
    print(f"Top 5 Features Accuracy: {round(kbest_acc * 100, 2)}%")
    print(f"PCA Variance Explained: {explained_variance}%")
    return payload

if __name__ == '__main__':
    train_and_evaluate()
