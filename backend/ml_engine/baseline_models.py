"""
Module 1 (Exp 2): Baseline Models — Linear Regression vs. Logistic Regression
"""

import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_recall_fscore_support, confusion_matrix
)

def evaluate_baseline_models(data_dict):
    X_train_scaled = data_dict['X_train_scaled']
    X_test_scaled = data_dict['X_test_scaled']
    y_train = data_dict['y_train']
    y_test = data_dict['y_test']
    
    # 1. Simple & Multiple Linear Regression (Continuous Price-Index Estimator)
    lin_reg = LinearRegression()
    lin_reg.fit(X_train_scaled, y_train)
    y_pred_cont = lin_reg.predict(X_test_scaled)
    
    lin_r2 = float(r2_score(y_test, y_pred_cont))
    lin_mae = float(mean_absolute_error(y_test, y_pred_cont))
    lin_rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_cont)))
    
    # Discretize continuous predictions via thresholding: [0, 0.5)->0, [0.5, 1.5)->1, etc.
    y_pred_discrete = np.clip(np.round(y_pred_cont), 0, 3).astype(int)
    lin_acc = float(accuracy_score(y_test, y_pred_discrete))
    lin_prec, lin_rec, lin_f1, _ = precision_recall_fscore_support(
        y_test, y_pred_discrete, average='weighted', zero_division=0
    )
    
    # 2. Multinomial Logistic Regression (Discrete Probabilistic Classifier)
    log_reg = LogisticRegression(
        solver='lbfgs', max_iter=1000, random_state=42
    )
    log_reg.fit(X_train_scaled, y_train)
    y_pred_log = log_reg.predict(X_test_scaled)
    
    log_acc = float(accuracy_score(y_test, y_pred_log))
    log_prec, log_rec, log_f1, _ = precision_recall_fscore_support(
        y_test, y_pred_log, average='weighted', zero_division=0
    )
    log_cm = confusion_matrix(y_test, y_pred_log).tolist()
    
    results = {
        'linear_regression': {
            'model_type': 'Continuous Estimator (Ordinary Least Squares)',
            'r2_score': round(lin_r2, 4),
            'mae': round(lin_mae, 4),
            'rmse': round(lin_rmse, 4),
            'discretized_accuracy': round(lin_acc * 100, 2),
            'discretized_f1': round(float(lin_f1) * 100, 2),
            'thresholding_note': 'Continuous output rounded and bounded to {0,1,2,3}'
        },
        'logistic_regression': {
            'model_type': 'Multinomial Classification (Softmax)',
            'accuracy': round(log_acc * 100, 2),
            'precision': round(float(log_prec) * 100, 2),
            'recall': round(float(log_rec) * 100, 2),
            'f1_score': round(float(log_f1) * 100, 2),
            'confusion_matrix': log_cm
        },
        'comparison_summary': {
            'accuracy_delta': round((log_acc - lin_acc) * 100, 2),
            'winner': 'Logistic Regression' if log_acc >= lin_acc else 'Thresholded Linear Regression',
            'insight': 'Multinomial Logistic Regression directly models class log-odds, preventing unbounded regression extrapolation at extreme values.'
        }
    }
    
    return {
        'models': {
            'linear_regression': lin_reg,
            'logistic_regression': log_reg
        },
        'benchmarks': results
    }
