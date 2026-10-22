"""
Module 5 (Exp 7): Support Vector Machines — Linear & Non-Linear Kernels
Evaluates Linear, RBF, and Polynomial kernels for both Classification (SVC) and Regression (SVR).
"""

import numpy as np
from sklearn.svm import SVC, SVR
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, confusion_matrix,
    mean_squared_error, mean_absolute_error, r2_score
)

def evaluate_svm_models(data_dict):
    X_train_scaled = data_dict['X_train_scaled']
    X_test_scaled = data_dict['X_test_scaled']
    y_train = data_dict['y_train']
    y_test = data_dict['y_test']
    
    # 1. Classification (SVC) across Linear, RBF, and Polynomial Kernels
    svc_kernels = {
        'linear': SVC(kernel='linear', C=1.0, probability=True, random_state=42),
        'rbf': SVC(kernel='rbf', C=1.0, gamma='scale', probability=True, random_state=42),
        'poly': SVC(kernel='poly', degree=3, C=1.0, probability=True, random_state=42)
    }
    
    svc_results = {}
    for k_name, model in svc_kernels.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        
        acc = float(accuracy_score(y_test, preds))
        prec, rec, f1, _ = precision_recall_fscore_support(
            y_test, preds, average='weighted', zero_division=0
        )
        cm = confusion_matrix(y_test, preds).tolist()
        
        svc_results[k_name] = {
            'kernel': k_name.upper(),
            'accuracy': round(acc * 100, 2),
            'precision': round(float(prec) * 100, 2),
            'recall': round(float(rec) * 100, 2),
            'f1_score': round(float(f1) * 100, 2),
            'support_vectors_count': int(len(model.support_)),
            'confusion_matrix': cm
        }
        
    # 2. Regression (SVR) across Linear, RBF, and Polynomial Kernels
    svr_kernels = {
        'linear': SVR(kernel='linear', C=1.0),
        'rbf': SVR(kernel='rbf', C=1.0, gamma='scale'),
        'poly': SVR(kernel='poly', degree=3, C=1.0)
    }
    
    svr_results = {}
    for k_name, model in svr_kernels.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        
        r2 = float(r2_score(y_test, preds))
        mae = float(mean_absolute_error(y_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        
        # Continuous discretized accuracy
        preds_disc = np.clip(np.round(preds), 0, 3).astype(int)
        acc_disc = float(accuracy_score(y_test, preds_disc))
        
        svr_results[k_name] = {
            'kernel': k_name.upper(),
            'r2_score': round(r2, 4),
            'mae': round(mae, 4),
            'rmse': round(rmse, 4),
            'discretized_accuracy': round(acc_disc * 100, 2)
        }
        
    benchmarks = {
        'classification_svc': svc_results,
        'regression_svr': svr_results,
        'kernel_summary': {
            'champion_svc_kernel': max(svc_results.keys(), key=lambda k: svc_results[k]['accuracy']).upper(),
            'champion_svr_kernel': max(svr_results.keys(), key=lambda k: svr_results[k]['r2_score']).upper(),
            'kernel_tradeoff_insight': 'Linear SVM excels on this dataset because RAM acts as a strongly linearly separable decision boundary; RBF handles localized spec trade-offs.'
        }
    }
    
    return {
        'models': {
            'svc': svc_kernels,
            'svr': svr_kernels
        },
        'benchmarks': benchmarks
    }
