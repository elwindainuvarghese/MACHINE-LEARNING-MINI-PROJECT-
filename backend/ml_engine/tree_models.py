"""
Module 2 (Exp 3 & Exp 4): CART Decision Trees — Classification vs. Regression
Compares Gini Index vs. Entropy (Information Gain) for Classification,
and Squared Error vs. Friedman MSE vs. Absolute Error for Regression.
"""

import numpy as np
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support, confusion_matrix,
    mean_squared_error, mean_absolute_error, r2_score
)

def evaluate_tree_models(data_dict):
    X_train = data_dict['X_train_raw']
    X_test = data_dict['X_test_raw']
    y_train = data_dict['y_train']
    y_test = data_dict['y_test']
    
    # --- 1. CART Classification Trees (Exp 3) ---
    # Model A: Gini Impurity
    clf_gini = DecisionTreeClassifier(criterion='gini', max_depth=8, random_state=42)
    clf_gini.fit(X_train, y_train)
    y_pred_gini = clf_gini.predict(X_test)
    
    acc_gini = float(accuracy_score(y_test, y_pred_gini))
    prec_g, rec_g, f1_gini, _ = precision_recall_fscore_support(
        y_test, y_pred_gini, average='weighted', zero_division=0
    )
    depth_gini = int(clf_gini.get_depth())
    nodes_gini = int(clf_gini.tree_.node_count)
    
    # Model B: Entropy (Information Gain)
    clf_entropy = DecisionTreeClassifier(criterion='entropy', max_depth=8, random_state=42)
    clf_entropy.fit(X_train, y_train)
    y_pred_entropy = clf_entropy.predict(X_test)
    
    acc_entropy = float(accuracy_score(y_test, y_pred_entropy))
    prec_e, rec_e, f1_entropy, _ = precision_recall_fscore_support(
        y_test, y_pred_entropy, average='weighted', zero_division=0
    )
    depth_entropy = int(clf_entropy.get_depth())
    nodes_entropy = int(clf_entropy.tree_.node_count)
    
    classification_benchmarks = {
        'gini': {
            'criterion': 'Gini Impurity',
            'accuracy': round(acc_gini * 100, 2),
            'f1_score': round(float(f1_gini) * 100, 2),
            'tree_depth': depth_gini,
            'node_count': nodes_gini,
            'formula': 'I_G(p) = 1 - sum(p_i^2)'
        },
        'entropy': {
            'criterion': 'Entropy (Information Gain)',
            'accuracy': round(acc_entropy * 100, 2),
            'f1_score': round(float(f1_entropy) * 100, 2),
            'tree_depth': depth_entropy,
            'node_count': nodes_entropy,
            'formula': 'H(S) = -sum(p_i * log2(p_i))'
        },
        'criteria_delta': {
            'accuracy_delta': round((acc_entropy - acc_gini) * 100, 2),
            'f1_delta': round((float(f1_entropy) - float(f1_gini)) * 100, 2),
            'depth_delta': depth_entropy - depth_gini,
            'node_count_delta': nodes_entropy - nodes_gini,
            'preferred_criterion': 'Entropy' if acc_entropy > acc_gini else 'Gini'
        }
    }
    
    # --- 2. CART Regression Trees (Exp 4) ---
    criteria_reg = ['squared_error', 'friedman_mse', 'absolute_error']
    regression_benchmarks = {}
    reg_models = {}
    
    for crit in criteria_reg:
        reg_tree = DecisionTreeRegressor(criterion=crit, max_depth=8, random_state=42)
        reg_tree.fit(X_train, y_train)
        y_pred_reg = reg_tree.predict(X_test)
        
        r2 = float(r2_score(y_test, y_pred_reg))
        mae = float(mean_absolute_error(y_test, y_pred_reg))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_reg)))
        
        # Continuous to discrete thresholding
        y_pred_reg_discrete = np.clip(np.round(y_pred_reg), 0, 3).astype(int)
        acc_reg = float(accuracy_score(y_test, y_pred_reg_discrete))
        
        regression_benchmarks[crit] = {
            'criterion': crit,
            'r2_score': round(r2, 4),
            'mae': round(mae, 4),
            'rmse': round(rmse, 4),
            'discretized_accuracy': round(acc_reg * 100, 2),
            'tree_depth': int(reg_tree.get_depth()),
            'node_count': int(reg_tree.tree_.node_count)
        }
        reg_models[crit] = reg_tree
        
    # Side-by-side comparison matrix
    side_by_side = {
        'classification_tree_gini': {
            'target_nature': 'Discrete Price Tiers {0,1,2,3}',
            'loss_optimization': 'Minimizing class impurity via Gini index',
            'performance': f"{classification_benchmarks['gini']['accuracy']}% Accuracy",
            'f1': f"{classification_benchmarks['gini']['f1_score']}%"
        },
        'regression_tree_squared': {
            'target_nature': 'Continuous Price Index [0.0 - 3.0]',
            'loss_optimization': 'Minimizing variance / sum of squared errors',
            'performance': f"R² = {regression_benchmarks['squared_error']['r2_score']}, RMSE = {regression_benchmarks['squared_error']['rmse']}",
            'discretized_acc': f"{regression_benchmarks['squared_error']['discretized_accuracy']}%"
        }
    }
    
    return {
        'models': {
            'clf_gini': clf_gini,
            'clf_entropy': clf_entropy,
            'reg_trees': reg_models
        },
        'benchmarks': {
            'classification': classification_benchmarks,
            'regression': regression_benchmarks,
            'side_by_side': side_by_side
        }
    }
