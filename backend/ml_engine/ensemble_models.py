"""
Module 3 (Exp 5): Ensemble Learning — Bagging vs. Boosting
Benchmarks Random Forest (Bagging + OOB) against Gradient Boosting (Boosting),
analyzing Variance Reduction vs. Bias Reduction, training time, and ROC-AUC.
"""

import time
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, roc_auc_score, confusion_matrix
)
from sklearn.preprocessing import label_binarize
try:
    from .data_loader import FEATURE_NAMES, READABLE_LABELS
except (ImportError, ValueError):
    from data_loader import FEATURE_NAMES, READABLE_LABELS

def evaluate_ensemble_models(data_dict):
    X_train = data_dict['X_train_raw']
    X_test = data_dict['X_test_raw']
    y_train = data_dict['y_train']
    y_test = data_dict['y_test']
    
    # Binarize targets for multiclass ROC-AUC calculation (One-vs-Rest)
    y_test_bin = label_binarize(y_test, classes=[0, 1, 2, 3])
    
    # 1. Bagging: Random Forest with Out-of-Bag (OOB) Score
    start_rf = time.perf_counter()
    rf = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        oob_score=True,
        random_state=42,
        n_jobs=-1
    )
    rf.fit(X_train, y_train)
    rf_train_time = round((time.perf_counter() - start_rf) * 1000, 2) # in ms
    
    y_pred_rf = rf.predict(X_test)
    y_proba_rf = rf.predict_proba(X_test)
    
    rf_acc = float(accuracy_score(y_test, y_pred_rf))
    rf_prec, rf_rec, rf_f1, _ = precision_recall_fscore_support(
        y_test, y_pred_rf, average='weighted', zero_division=0
    )
    rf_oob = float(rf.oob_score_)
    rf_auc = float(roc_auc_score(y_test_bin, y_proba_rf, multi_class='ovr', average='weighted'))
    rf_cm = confusion_matrix(y_test, y_pred_rf).tolist()
    
    # Feature Importances from Random Forest Gini splits
    feature_importances = []
    for feat, imp in zip(FEATURE_NAMES, rf.feature_importances_):
        feature_importances.append({
            'feature': feat,
            'label': READABLE_LABELS.get(feat, feat),
            'importance_pct': round(float(imp) * 100, 2),
            'importance_raw': round(float(imp), 4)
        })
    feature_importances = sorted(feature_importances, key=lambda x: x['importance_raw'], reverse=True)
    
    # 2. Boosting: Gradient Boosting Classifier
    start_gb = time.perf_counter()
    gb = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42
    )
    gb.fit(X_train, y_train)
    gb_train_time = round((time.perf_counter() - start_gb) * 1000, 2) # in ms
    
    y_pred_gb = gb.predict(X_test)
    y_proba_gb = gb.predict_proba(X_test)
    
    gb_acc = float(accuracy_score(y_test, y_pred_gb))
    gb_prec, gb_rec, gb_f1, _ = precision_recall_fscore_support(
        y_test, y_pred_gb, average='weighted', zero_division=0
    )
    gb_auc = float(roc_auc_score(y_test_bin, y_proba_gb, multi_class='ovr', average='weighted'))
    gb_cm = confusion_matrix(y_test, y_pred_gb).tolist()
    
    benchmarks = {
        'bagging_random_forest': {
            'paradigm': 'Bagging (Bootstrap Aggregating with Random Subspaces)',
            'objective': 'Variance Reduction via Independent Tree Averaging',
            'accuracy': round(rf_acc * 100, 2),
            'f1_score': round(float(rf_f1) * 100, 2),
            'oob_score': round(rf_oob * 100, 2),
            'roc_auc_ovr': round(rf_auc, 4),
            'train_time_ms': rf_train_time,
            'n_estimators': 120,
            'confusion_matrix': rf_cm
        },
        'boosting_gradient_boosting': {
            'paradigm': 'Boosting (Sequential Gradient Residual Minimization)',
            'objective': 'Bias Reduction via Iterative Weak Learner Weighting',
            'accuracy': round(gb_acc * 100, 2),
            'f1_score': round(float(gb_f1) * 100, 2),
            'roc_auc_ovr': round(gb_auc, 4),
            'train_time_ms': gb_train_time,
            'n_estimators': 100,
            'confusion_matrix': gb_cm
        },
        'bagging_vs_boosting_comparison': {
            'accuracy_delta': round((gb_acc - rf_acc) * 100, 2),
            'speedup_ratio': round(gb_train_time / max(1, rf_train_time), 2),
            'variance_reducer': 'Random Forest (Bagging reduces estimation variance through averaging de-correlated trees)',
            'bias_reducer': 'Gradient Boosting (Sequentially targets pseudo-residuals, reducing bias at cost of serial training time)',
            'champion': 'Random Forest' if rf_acc >= gb_acc else 'Gradient Boosting'
        },
        'top_features': feature_importances[:8]
    }
    
    return {
        'models': {
            'random_forest': rf,
            'gradient_boosting': gb
        },
        'benchmarks': benchmarks
    }
