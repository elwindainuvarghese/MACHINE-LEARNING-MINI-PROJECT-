"""
Module 1 (Exp 2): Data Loading, Missing Data & Zero-Dimension Sanity Pipeline
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    'battery_power', 'blue', 'clock_speed', 'dual_sim', 'fc',
    'four_g', 'int_memory', 'm_dep', 'mobile_wt', 'n_cores',
    'pc', 'px_height', 'px_width', 'ram', 'sc_h',
    'sc_w', 'talk_time', 'three_g', 'touch_screen', 'wifi'
]

READABLE_LABELS = {
    'battery_power': 'Battery Capacity (mAh)',
    'blue': 'Bluetooth 5.0 (0/1)',
    'clock_speed': 'Processor Clock (GHz)',
    'dual_sim': 'Dual SIM Support (0/1)',
    'fc': 'Front Camera (MP)',
    'four_g': '4G LTE Module (0/1)',
    'int_memory': 'Internal Storage (GB)',
    'm_dep': 'Chassis Thickness (cm)',
    'mobile_wt': 'Chassis Weight (g)',
    'n_cores': 'CPU Core Count (1-8)',
    'pc': 'Primary Camera (MP)',
    'px_height': 'Display Pixel Height',
    'px_width': 'Display Pixel Width',
    'ram': 'RAM Memory (MB)',
    'sc_h': 'Screen Height (cm)',
    'sc_w': 'Screen Width (cm)',
    'talk_time': 'Battery Talk Time (hrs)',
    'three_g': '3G Module (0/1)',
    'touch_screen': 'Touchscreen Tech (0/1)',
    'wifi': 'Wi-Fi Module (0/1)'
}

FEATURE_MIN_MAX = {
    'battery_power': (500, 2000),
    'blue': (0, 1),
    'clock_speed': (0.5, 3.0),
    'dual_sim': (0, 1),
    'fc': (0, 20),
    'four_g': (0, 1),
    'int_memory': (2, 64),
    'm_dep': (0.1, 1.0),
    'mobile_wt': (80, 200),
    'n_cores': (1, 8),
    'pc': (0, 20),
    'px_height': (0, 1960),
    'px_width': (500, 2000),
    'ram': (256, 3998),
    'sc_h': (5, 19),
    'sc_w': (0, 18),
    'talk_time': (2, 20),
    'three_g': (0, 1),
    'touch_screen': (0, 1),
    'wifi': (0, 1)
}

def load_or_generate_dataset(data_path=None):
    """
    Loads train.csv if available in root or backend folder;
    otherwise generates a statistically calibrated synthetic dataset matching Kaggle distributions.
    """
    candidate_paths = [
        data_path,
        'train.csv',
        os.path.join(os.path.dirname(__file__), '..', 'train.csv'),
        os.path.join(os.path.dirname(__file__), '..', '..', 'train.csv'),
        os.path.join(os.path.dirname(__file__), '..', 'data', 'train.csv')
    ]
    
    for path in candidate_paths:
        if path and os.path.exists(path):
            try:
                df = pd.read_csv(path)
                if 'price_range' in df.columns and all(f in df.columns for f in FEATURE_NAMES):
                    print(f"[DataLoader] Successfully loaded Kaggle dataset from: {path}")
                    return df
            except Exception as e:
                print(f"[DataLoader] Failed to read {path}: {e}")
                
    print("[DataLoader] train.csv not found locally. Generating synthetic benchmark dataset (2000 samples)...")
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
    sc_w = np.random.randint(0, 18, n) # Contains zero-dimension anomaly
    talk_time = np.random.randint(2, 20, n)
    three_g = np.random.choice([0, 1], n, p=[0.24, 0.76])
    touch_screen = np.random.choice([0, 1], n)
    wifi = np.random.choice([0, 1], n)
    
    # Kaggle price_range linear latent combination:
    # RAM has ~0.917 correlation, battery has ~0.20, px_width/px_height have ~0.15
    score = (
        (ram / 4000.0) * 0.72 +
        (battery_power / 2000.0) * 0.14 +
        (px_height / 1960.0) * 0.06 +
        (px_width / 2000.0) * 0.05 +
        (int_memory / 64.0) * 0.03 +
        np.random.normal(0, 0.03, n)
    )
    
    percentiles = np.percentile(score, [25, 50, 75])
    price_range = np.zeros(n, dtype=int)
    price_range[(score >= percentiles[0]) & (score < percentiles[1])] = 1
    price_range[(score >= percentiles[1]) & (score < percentiles[2])] = 2
    price_range[score >= percentiles[2]] = 3
    
    data_dict = {
        'battery_power': battery_power, 'blue': blue, 'clock_speed': clock_speed,
        'dual_sim': dual_sim, 'fc': fc, 'four_g': four_g, 'int_memory': int_memory,
        'm_dep': m_dep, 'mobile_wt': mobile_wt, 'n_cores': n_cores, 'pc': pc,
        'px_height': px_height, 'px_width': px_width, 'ram': ram, 'sc_h': sc_h,
        'sc_w': sc_w, 'talk_time': talk_time, 'three_g': three_g,
        'touch_screen': touch_screen, 'wifi': wifi, 'price_range': price_range
    }
    return pd.DataFrame(data_dict)

def preprocess_and_split(df=None, test_size=0.2, random_state=42):
    """
    Sanitizes zero-dimension anomalies, imputes edge cases,
    and returns standardized feature matrices and target splits.
    """
    if df is None:
        df = load_or_generate_dataset()
    else:
        df = df.copy()
        
    # Anomaly Sanity Check: sc_w == 0 or px_height == 0
    # In physical phones, screen width cannot be 0cm. Replace zeros with non-zero median.
    sc_w_median = df.loc[df['sc_w'] > 0, 'sc_w'].median()
    if pd.isna(sc_w_median):
        sc_w_median = 4.0
    df['sc_w'] = df['sc_w'].replace(0, sc_w_median)
    
    px_height_median = df.loc[df['px_height'] > 0, 'px_height'].median()
    if pd.isna(px_height_median):
        px_height_median = 600.0
    df['px_height'] = df['px_height'].replace(0, px_height_median)
    
    # Handle any nulls if present
    df = df.fillna(df.median(numeric_only=True))
    
    X = df[FEATURE_NAMES]
    y = df['price_range'].astype(int)
    
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_raw)
    X_test_scaled = scaler.transform(X_test_raw)
    
    return {
        'df': df,
        'X_train_raw': X_train_raw,
        'X_test_raw': X_test_raw,
        'X_train_scaled': X_train_scaled,
        'X_test_scaled': X_test_scaled,
        'y_train': y_train,
        'y_test': y_test,
        'scaler': scaler
    }
