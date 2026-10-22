"""
Mobile Price Range Classifier & Market Segmentation Engine
FastAPI Production Microservice exposing:
- POST /api/predict: Multi-model consensus inference + real-time DBSCAN anomaly radar
- GET /api/benchmarks: Full 8-experiment benchmark metrics (Exps 2 through 9)
- GET /api/projections: 2D/3D manifold coordinates (PCA/LDA/SVD), MST edges, and cluster topologies
- GET /api/phones-catalog & POST /api/depreciation-forecast: Multi-brand secondary market resale forecaster
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

try:
    from ml_engine.data_loader import FEATURE_NAMES, READABLE_LABELS, FEATURE_MIN_MAX
    from ml_engine.trainer import run_full_pipeline
except (ImportError, ValueError):
    try:
        from .ml_engine.data_loader import FEATURE_NAMES, READABLE_LABELS, FEATURE_MIN_MAX
        from .ml_engine.trainer import run_full_pipeline
    except (ImportError, ValueError):
        from backend.ml_engine.data_loader import FEATURE_NAMES, READABLE_LABELS, FEATURE_MIN_MAX
        from backend.ml_engine.trainer import run_full_pipeline

app = FastAPI(
    title="Mobile Price Range Classifier & Market Segmentation Engine API",
    description="Unified Machine Learning Analytics Suite & Consensus Inference Engine for Smartphone Hardware.",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
MODELS_PATH = os.path.join(ARTIFACTS_DIR, "models.joblib")
SCALER_PATH = os.path.join(ARTIFACTS_DIR, "scaler.joblib")
BENCHMARKS_PATH = os.path.join(ARTIFACTS_DIR, "benchmarks.json")
PROJECTIONS_PATH = os.path.join(ARTIFACTS_DIR, "projections.json")

# In-memory artifact cache
cached_models = None
cached_scaler = None
cached_benchmarks = None
cached_projections = None

def get_or_load_artifacts():
    global cached_models, cached_scaler, cached_benchmarks, cached_projections
    if not (os.path.exists(MODELS_PATH) and os.path.exists(BENCHMARKS_PATH) and os.path.exists(PROJECTIONS_PATH)):
        print("[FastAPI] Artifacts missing. Running automated master ML training pipeline...")
        run_full_pipeline(ARTIFACTS_DIR)
        
    if cached_models is None:
        cached_models = joblib.load(MODELS_PATH)
    if cached_scaler is None:
        cached_scaler = joblib.load(SCALER_PATH)
    if cached_benchmarks is None:
        with open(BENCHMARKS_PATH, "r") as f:
            cached_benchmarks = json.load(f)
    if cached_projections is None:
        with open(PROJECTIONS_PATH, "r") as f:
            cached_projections = json.load(f)

# Auto-load on boot
try:
    get_or_load_artifacts()
except Exception as e:
    print(f"[FastAPI] Artifact loading notice: {e}")

class MobileSpecs(BaseModel):
    # Hardware & Performance
    battery_power: int = Field(default=4000, description="Battery capacity in mAh (500 - 5500)")
    clock_speed: float = Field(default=2.4, description="Processor clock speed in GHz (0.5 - 3.2)")
    n_cores: int = Field(default=8, description="Number of CPU cores (1 - 8)")
    ram: int = Field(default=3500, description="RAM in Megabytes (256 - 4000)")
    int_memory: int = Field(default=128, description="Internal Memory in GB (2 - 512)")
    talk_time: int = Field(default=16, description="Talk time on full charge in hours (2 - 20)")
    
    # Display & Body
    px_height: int = Field(default=1080, description="Pixel Resolution Height (0 - 1960)")
    px_width: int = Field(default=2340, description="Pixel Resolution Width (500 - 2560)")
    sc_h: int = Field(default=16, description="Screen Height in cm (5 - 19)")
    sc_w: int = Field(default=7, description="Screen Width in cm (1 - 18)")
    m_dep: float = Field(default=0.8, description="Mobile Depth in cm (0.1 - 1.0)")
    mobile_wt: int = Field(default=180, description="Mobile Weight in grams (80 - 220)")
    
    # Camera
    fc: int = Field(default=16, description="Front Camera Megapixels (0 - 32)")
    pc: int = Field(default=50, description="Primary Camera Megapixels (0 - 200)")
    
    # Connectivity (0 or 1)
    blue: int = Field(default=1, description="Bluetooth module (0 or 1)")
    dual_sim: int = Field(default=1, description="Dual SIM support (0 or 1)")
    four_g: int = Field(default=1, description="4G LTE support (0 or 1)")
    three_g: int = Field(default=1, description="3G support (0 or 1)")
    touch_screen: int = Field(default=1, description="Touch screen (0 or 1)")
    wifi: int = Field(default=1, description="Wi-Fi module (0 or 1)")

TIER_METADATA = {
    0: {
        "tier_name": "Low Cost (Class 0)",
        "short_name": "Low Tier",
        "market_range": "< $150 (Under ₹12,000)",
        "badge_color": "cyan",
        "description": "Essential budget architecture tailored for basic browsing, social apps, and power-efficient daily tasks."
    },
    1: {
        "tier_name": "Medium Cost (Class 1)",
        "short_name": "Medium Tier",
        "market_range": "$150 – $320 (₹12,000 – ₹25,000)",
        "badge_color": "blue",
        "description": "Balanced mainstream sweetspot offering responsive multitasking, reliable battery life, and crisp 1080p media."
    },
    2: {
        "tier_name": "High Cost (Class 2)",
        "short_name": "High Tier",
        "market_range": "$320 – $550 (₹25,000 – ₹45,000)",
        "badge_color": "magenta",
        "description": "Prosumer gaming tier featuring enhanced GPU pipelines, high refresh AMOLED panels, and advanced multi-lens sensors."
    },
    3: {
        "tier_name": "Very High Cost (Class 3 / Flagship)",
        "short_name": "Flagship Tier",
        "market_range": "$550+ (₹45,000+)",
        "badge_color": "lime",
        "description": "Ultra flagship architecture boasting uncompromised DRAM bandwidth, 2K/QHD displays, and multi-core top-tier silicon."
    }
}

@app.get("/")
def read_root():
    return {
        "status": "online",
        "engine": "Mobile Price Range Classifier & Market Segmentation Engine",
        "version": "3.0.0",
        "endpoints": {
            "predict": "/api/predict",
            "benchmarks": "/api/benchmarks",
            "projections": "/api/projections",
            "phones_catalog": "/api/phones-catalog",
            "depreciation_forecast": "/api/depreciation-forecast",
            "docs": "/docs"
        }
    }

@app.get("/api/benchmarks")
def get_benchmarks():
    """Returns comprehensive benchmarks for all 8 lab experiments."""
    get_or_load_artifacts()
    if os.path.exists(BENCHMARKS_PATH):
        with open(BENCHMARKS_PATH, "r") as f:
            return json.load(f)
    if cached_benchmarks:
        return cached_benchmarks
    raise HTTPException(status_code=500, detail="Benchmarks unavailable")

@app.get("/api/projections")
def get_projections():
    """Returns 2D/3D PCA/LDA/SVD coordinates, MST graph edges, and cluster assignments."""
    get_or_load_artifacts()
    if os.path.exists(PROJECTIONS_PATH):
        with open(PROJECTIONS_PATH, "r") as f:
            return json.load(f)
    if cached_projections:
        return cached_projections
    raise HTTPException(status_code=500, detail="Projections unavailable")

@app.post("/api/predict")
def predict_consensus(specs: MobileSpecs):
    """
    Runs real-time consensus inference across:
    Logistic Regression, CART Decision Trees, Random Forest, Gradient Boosting, Linear SVM, RBF SVM
    plus checks real-time DBSCAN Anomaly Radar.
    """
    get_or_load_artifacts()
    input_dict = specs.model_dump()
    
    # Sanitize zero dimension anomaly for screen width & height
    if input_dict['sc_w'] <= 0:
        input_dict['sc_w'] = 4.0
    if input_dict['px_height'] <= 0:
        input_dict['px_height'] = 600
        
    features_ordered = [input_dict.get(f, 0) for f in FEATURE_NAMES]
    X_raw = np.array(features_ordered).reshape(1, -1)
    X_scaled = cached_scaler.transform(X_raw)
    
    # 1. Multi-model inferences
    models = cached_models
    
    pred_rf = int(models['random_forest'].predict(X_raw)[0])
    proba_rf = models['random_forest'].predict_proba(X_raw)[0].tolist()
    
    pred_gb = int(models['gradient_boosting'].predict(X_raw)[0])
    pred_log = int(models['logistic_regression'].predict(X_scaled)[0])
    pred_cart_gini = int(models['cart_gini'].predict(X_raw)[0])
    pred_cart_ent = int(models['cart_entropy'].predict(X_raw)[0])
    pred_svc_lin = int(models['svc_linear'].predict(X_scaled)[0])
    pred_svc_rbf = int(models['svc_rbf'].predict(X_scaled)[0])
    
    # Continuous Regressors
    pred_lin_cont = float(models['linear_regression'].predict(X_scaled)[0])
    pred_cart_reg = float(models['cart_regressor'].predict(X_raw)[0])
    pred_svr_cont = float(models['svr_rbf'].predict(X_scaled)[0])
    
    # 2. Consensus Voting
    votes = [pred_rf, pred_gb, pred_log, pred_cart_gini, pred_cart_ent, pred_svc_lin, pred_svc_rbf]
    consensus_class = int(max(set(votes), key=votes.count))
    consensus_tier = TIER_METADATA.get(consensus_class, TIER_METADATA[0])
    
    consensus_agreement_pct = round((votes.count(consensus_class) / len(votes)) * 100, 1)
    
    # 3. Real-Time DBSCAN & Density Anomaly Check (Module 6)
    anomaly_radar = models['anomaly_detector'].check_anomaly(input_dict)
    
    # Primary hardware drivers
    drivers = []
    if specs.ram >= 3400:
        drivers.append("High-bandwidth RAM (>3.4 GB) commands premium flagship classification.")
    elif specs.ram < 1400:
        drivers.append("Constrained RAM (<1.4 GB) anchors device in entry-level tier.")
    else:
        drivers.append(f"Balanced RAM ({specs.ram} MB) places device in competitive mainstream bracket.")
        
    if specs.battery_power >= 4500:
        drivers.append("Large battery capacity (>4500 mAh) strengthens prosumer endurance rating.")
    if specs.px_height * specs.px_width >= 2340 * 1080:
        drivers.append("High pixel matrix resolution supports rich visual density.")
        
    return {
        "consensus_tier": consensus_class,
        "consensus_price_range": consensus_class,
        "consensus_tier_name": consensus_tier["tier_name"],
        "short_name": consensus_tier["short_name"],
        "market_range": consensus_tier["market_range"],
        "badge_color": consensus_tier["badge_color"],
        "description": consensus_tier["description"],
        "consensus_agreement_pct": consensus_agreement_pct,
        "continuous_index": round(max(0.0, min(3.0, pred_svr_cont)), 2),
        "probabilities": [round(p * 100) for p in proba_rf],
        "dbscan_is_outlier": bool(anomaly_radar['is_outlier']),
        "class_probabilities": [
            {"tier": "Low Cost (0)", "probability": round(proba_rf[0] * 100, 2)},
            {"tier": "Medium Cost (1)", "probability": round(proba_rf[1] * 100, 2)},
            {"tier": "High Cost (2)", "probability": round(proba_rf[2] * 100, 2)},
            {"tier": "Very High Cost (3)", "probability": round(proba_rf[3] * 100, 2)}
        ],
        "per_model": {
            "linear_regression": round(float(pred_lin_cont), 2),
            "logistic_regression": pred_log,
            "cart_gini": pred_cart_gini,
            "cart_entropy": pred_cart_ent,
            "random_forest": pred_rf,
            "gradient_boosting": pred_gb,
            "svm_linear": pred_svc_lin,
            "svm_rbf": pred_svc_rbf
        },
        "model_votes": {
            "random_forest": {"vote": pred_rf, "label": TIER_METADATA[pred_rf]["short_name"]},
            "gradient_boosting": {"vote": pred_gb, "label": TIER_METADATA[pred_gb]["short_name"]},
            "linear_svm": {"vote": pred_svc_lin, "label": TIER_METADATA[pred_svc_lin]["short_name"]},
            "rbf_svm": {"vote": pred_svc_rbf, "label": TIER_METADATA[pred_svc_rbf]["short_name"]},
            "logistic_regression": {"vote": pred_log, "label": TIER_METADATA[pred_log]["short_name"]},
            "cart_decision_tree": {"vote": pred_cart_gini, "label": TIER_METADATA[pred_cart_gini]["short_name"]}
        },
        "continuous_price_indices": {
            "linear_regression_index": round(max(0.0, min(3.0, pred_lin_cont)), 2),
            "cart_regression_index": round(max(0.0, min(3.0, pred_cart_reg)), 2),
            "svr_regression_index": round(max(0.0, min(3.0, pred_svr_cont)), 2)
        },
        "anomaly_radar": anomaly_radar,
        "hardware_drivers": drivers,
        "submitted_specs": input_dict
    }

# Backward compatibility for legacy endpoint
@app.post("/predict")
def legacy_predict(specs: MobileSpecs):
    res = predict_consensus(specs)
    return {
        "price_range": res["consensus_price_range"],
        "tier_name": res["consensus_tier_name"],
        "short_name": res["short_name"],
        "badge_color": res["badge_color"],
        "description": res["description"],
        "target_market": res["market_range"],
        "confidence_percentage": res["consensus_agreement_pct"],
        "class_probabilities": res["class_probabilities"],
        "primary_drivers": res["hardware_drivers"],
        "submitted_specs": res["submitted_specs"]
    }

@app.get("/metrics")
def legacy_metrics():
    return get_benchmarks()

# --- SMARTPHONE CATALOG & 5-MONTH DEPRECIATION FORECASTER ---

PHONES_CATALOG = [
    {
        "id": "samsung_a55",
        "brand": "Samsung",
        "model": "Samsung Galaxy A55 5G",
        "launch_year": 2024,
        "launch_price_inr": 39999,
        "launch_price_usd": 420,
        "base_decay_rate": 0.025,
        "specs": {
            "ram": 4000, "battery_power": 5000, "int_memory": 256,
            "px_height": 1080, "px_width": 2340, "pc": 50, "fc": 32,
            "mobile_wt": 213, "clock_speed": 2.75, "n_cores": 8,
            "screen_desc": "6.6\" Super AMOLED 120Hz", "processor": "Exynos 1480"
        }
    },
    {
        "id": "samsung_s24u",
        "brand": "Samsung",
        "model": "Samsung Galaxy S24 Ultra",
        "launch_year": 2024,
        "launch_price_inr": 129999,
        "launch_price_usd": 1299,
        "base_decay_rate": 0.021,
        "specs": {
            "ram": 4000, "battery_power": 5000, "int_memory": 512,
            "px_height": 1440, "px_width": 3120, "pc": 200, "fc": 12,
            "mobile_wt": 232, "clock_speed": 3.39, "n_cores": 8,
            "screen_desc": "6.8\" Dynamic AMOLED 2X", "processor": "Snapdragon 8 Gen 3"
        }
    },
    {
        "id": "samsung_m34",
        "brand": "Samsung",
        "model": "Samsung Galaxy M34 5G",
        "launch_year": 2023,
        "launch_price_inr": 18999,
        "launch_price_usd": 220,
        "base_decay_rate": 0.028,
        "specs": {
            "ram": 2048, "battery_power": 6000, "int_memory": 128,
            "px_height": 1080, "px_width": 2340, "pc": 50, "fc": 13,
            "mobile_wt": 208, "clock_speed": 2.4, "n_cores": 8,
            "screen_desc": "6.5\" Super AMOLED 120Hz", "processor": "Exynos 1280"
        }
    },
    {
        "id": "apple_ip15pm",
        "brand": "Apple",
        "model": "iPhone 15 Pro Max",
        "launch_year": 2023,
        "launch_price_inr": 159900,
        "launch_price_usd": 1199,
        "base_decay_rate": 0.015,
        "specs": {
            "ram": 4000, "battery_power": 4422, "int_memory": 256,
            "px_height": 1290, "px_width": 2796, "pc": 48, "fc": 12,
            "mobile_wt": 221, "clock_speed": 3.78, "n_cores": 6,
            "screen_desc": "6.7\" Super Retina XDR ProMotion", "processor": "Apple A17 Pro"
        }
    },
    {
        "id": "apple_ip15",
        "brand": "Apple",
        "model": "iPhone 15",
        "launch_year": 2023,
        "launch_price_inr": 79900,
        "launch_price_usd": 799,
        "base_decay_rate": 0.017,
        "specs": {
            "ram": 3072, "battery_power": 3349, "int_memory": 128,
            "px_height": 1179, "px_width": 2556, "pc": 48, "fc": 12,
            "mobile_wt": 171, "clock_speed": 3.46, "n_cores": 6,
            "screen_desc": "6.1\" Super Retina XDR OLED", "processor": "Apple A16 Bionic"
        }
    },
    {
        "id": "xiaomi_14u",
        "brand": "Xiaomi",
        "model": "Xiaomi 14 Ultra",
        "launch_year": 2024,
        "launch_price_inr": 99999,
        "launch_price_usd": 999,
        "base_decay_rate": 0.026,
        "specs": {
            "ram": 4000, "battery_power": 5000, "int_memory": 512,
            "px_height": 1440, "px_width": 3200, "pc": 50, "fc": 32,
            "mobile_wt": 220, "clock_speed": 3.3, "n_cores": 8,
            "screen_desc": "6.73\" LTPO AMOLED 120Hz", "processor": "Snapdragon 8 Gen 3"
        }
    },
    {
        "id": "oneplus_12",
        "brand": "OnePlus",
        "model": "OnePlus 12",
        "launch_year": 2024,
        "launch_price_inr": 64999,
        "launch_price_usd": 799,
        "base_decay_rate": 0.023,
        "specs": {
            "ram": 4000, "battery_power": 5400, "int_memory": 512,
            "px_height": 1440, "px_width": 3168, "pc": 50, "fc": 32,
            "mobile_wt": 220, "clock_speed": 3.3, "n_cores": 8,
            "screen_desc": "6.82\" 2K ProXDR Display 120Hz", "processor": "Snapdragon 8 Gen 3"
        }
    },
    {
        "id": "google_p8p",
        "brand": "Google Pixel",
        "model": "Google Pixel 8 Pro",
        "launch_year": 2023,
        "launch_price_inr": 106999,
        "launch_price_usd": 999,
        "base_decay_rate": 0.027,
        "specs": {
            "ram": 4000, "battery_power": 5050, "int_memory": 256,
            "px_height": 1344, "px_width": 2992, "pc": 50, "fc": 10,
            "mobile_wt": 213, "clock_speed": 3.0, "n_cores": 9,
            "screen_desc": "6.7\" Super Actua OLED 120Hz", "processor": "Google Tensor G3"
        }
    }
]

class DepreciationQuery(BaseModel):
    phone_id: Optional[str] = "samsung_a55"
    custom_price_inr: Optional[float] = None
    months_ahead: int = Field(default=5, ge=1, le=24)
    condition: str = Field(default="like_new")

@app.get("/api/phones-catalog")
@app.get("/phones-catalog")
def get_phones_catalog():
    return {"catalog": PHONES_CATALOG}

@app.post("/api/depreciation-forecast")
@app.post("/depreciation-forecast")
def forecast_depreciation(query: DepreciationQuery):
    selected_phone = next((p for p in PHONES_CATALOG if p["id"] == query.phone_id), PHONES_CATALOG[0])
    
    price_base = query.custom_price_inr if (query.custom_price_inr and query.custom_price_inr > 0) else selected_phone["launch_price_inr"]
    base_usd = selected_phone["launch_price_usd"]
    decay_rate = selected_phone["base_decay_rate"]
    
    condition_multipliers = {
        "brand_new": 1.0,
        "like_new": 0.94,
        "good": 0.85,
        "fair": 0.72
    }
    c_mult = condition_multipliers.get(query.condition, 0.94)
    t = query.months_ahead
    
    retained_ratio = max(0.20, min(1.0, np.exp(-decay_rate * t) * c_mult))
    predicted_inr = int(round(price_base * retained_ratio))
    predicted_usd = int(round(base_usd * retained_ratio))
    value_loss_inr = price_base - predicted_inr
    depreciation_pct = round((1 - retained_ratio) * 100, 1)
    retention_pct = round(retained_ratio * 100, 1)
    
    trajectory = []
    for m in range(0, 13):
        r_m = np.exp(-decay_rate * m) * (1.0 if m == 0 else c_mult)
        trajectory.append({
            "month": f"M{m}",
            "month_number": m,
            "price_inr": int(round(price_base * r_m)),
            "price_usd": int(round(base_usd * r_m)),
            "retention_pct": round(r_m * 100, 1)
        })
        
    return {
        "phone_model": selected_phone["model"],
        "brand": selected_phone["brand"],
        "launch_price_inr": price_base,
        "launch_price_usd": base_usd,
        "forecast_horizon_months": t,
        "device_condition": query.condition,
        "predicted_price_inr": predicted_inr,
        "predicted_price_usd": predicted_usd,
        "value_loss_inr": value_loss_inr,
        "retention_percentage": retention_pct,
        "depreciation_percentage": depreciation_pct,
        "trajectory": trajectory,
        "market_advice": "Optimal trade-in window: Sell between Month 4 and Month 6 before newer generational refreshes hit the market.",
        "phone_specs": selected_phone["specs"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
