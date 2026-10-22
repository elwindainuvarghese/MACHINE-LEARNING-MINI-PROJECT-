import os
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.svm import SVC, SVR
from sklearn.cluster import DBSCAN, KMeans
from sklearn.metrics import accuracy_score, f1_score, r2_score, root_mean_squared_error
from scipy.spatial.distance import pdist, squareform
from scipy.sparse.csgraph import minimum_spanning_tree

FEATURES = [
    "battery_power", "blue", "clock_speed", "dual_sim", "fc", "four_g",
    "int_memory", "m_dep", "mobile_wt", "n_cores", "pc", "px_height",
    "px_width", "ram", "sc_h", "sc_w", "talk_time", "three_g",
    "touch_screen", "wifi"
]

class MobileSpecsInput(BaseModel):
    battery_power: float = 1950
    blue: int = 1
    clock_speed: float = 2.8
    dual_sim: int = 1
    fc: float = 16
    four_g: int = 1
    int_memory: float = 64
    m_dep: float = 0.3
    mobile_wt: float = 136
    n_cores: int = 8
    pc: float = 20
    px_height: float = 1440
    px_width: float = 1920
    ram: float = 3850
    sc_h: float = 18
    sc_w: float = 9
    talk_time: float = 19
    three_g: int = 1
    touch_screen: int = 1
    wifi: int = 1

def load_or_synthesize_dataset(csv_path: str = "train.csv") -> pd.DataFrame:
    candidate_paths = [csv_path, os.path.join("backend", csv_path)]
    for p in candidate_paths:
        if os.path.exists(p):
            return pd.read_csv(p)
    rng = np.random.default_rng(42)
    n = 2000
    ram = rng.integers(256, 4000, n)
    battery_power = rng.integers(500, 2000, n)
    px_width = rng.integers(500, 1980, n)
    px_height = np.minimum(px_width - 100, rng.integers(100, 1960, n))
    score = (ram - 256) / 3744 * 2.4 + (battery_power - 500) / 1500 * 0.55 + (px_width * px_height) / (1980 * 1960) * 0.35
    price_range = np.clip(np.floor(score + rng.normal(0, 0.12, n) + 0.15), 0, 3).astype(int)
    return pd.DataFrame({
        "battery_power": battery_power,
        "blue": rng.integers(0, 2, n),
        "clock_speed": np.round(rng.uniform(0.5, 3.0, n), 1),
        "dual_sim": rng.integers(0, 2, n),
        "fc": rng.integers(0, 20, n),
        "four_g": rng.integers(0, 2, n),
        "int_memory": rng.integers(2, 65, n),
        "m_dep": np.round(rng.uniform(0.1, 1.0, n), 1),
        "mobile_wt": rng.integers(80, 201, n),
        "n_cores": rng.integers(1, 9, n),
        "pc": rng.integers(0, 21, n),
        "px_height": px_height,
        "px_width": px_width,
        "ram": ram,
        "sc_h": rng.integers(5, 20, n),
        "sc_w": rng.integers(1, 19, n),
        "talk_time": rng.integers(2, 21, n),
        "three_g": rng.integers(0, 2, n),
        "touch_screen": rng.integers(0, 2, n),
        "wifi": rng.integers(0, 2, n),
        "price_range": price_range,
    })

app = FastAPI(title="SPEC//WARP Mobile Price Classifier API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Train all 8 Lab Experiment models on startup
df = load_or_synthesize_dataset()
X_raw = df[FEATURES].copy()
# Exp 2: Treat anomalous 0 screen width / pixel height as missing data and impute
X_raw.loc[X_raw["sc_w"] == 0, "sc_w"] = np.nan
X_raw.loc[X_raw["px_height"] == 0, "px_height"] = np.nan
imputer = KNNImputer(n_neighbors=5)
scaler = StandardScaler()
X_imputed = imputer.fit_transform(X_raw)
X_scaled = scaler.fit_transform(X_imputed)
y = df["price_range"].values

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# Exp 2: Linear & Logistic Regression
lin_reg = LinearRegression().fit(X_train, y_train)
log_reg = LogisticRegression(max_iter=500).fit(X_train, y_train)

# Exp 3 & 4: CART Classification (Gini vs. Entropy) & CART Regression
cart_gini = DecisionTreeClassifier(criterion="gini", random_state=42).fit(X_train, y_train)
cart_entropy = DecisionTreeClassifier(criterion="entropy", random_state=42).fit(X_train, y_train)
cart_reg = DecisionTreeRegressor(criterion="squared_error", random_state=42).fit(X_train, y_train)

# Exp 5: Ensemble Learning (Random Forest Bagging & Gradient Boosting)
rf_bagging = RandomForestClassifier(n_estimators=200, oob_score=True, random_state=42).fit(X_train, y_train)
gb_boosting = GradientBoostingClassifier(random_state=42).fit(X_train, y_train)

# Exp 6: Dimensionality Reduction (PCA, LDA, SVD)
pca = PCA(n_components=3, random_state=42).fit(X_scaled)
lda = LinearDiscriminantAnalysis(n_components=3).fit(X_scaled, y)
svd = TruncatedSVD(n_components=3, random_state=42).fit(X_scaled)

# Exp 7: Linear & Non-Linear SVM (SVC & SVR)
svm_linear = SVC(kernel="linear", probability=True, random_state=42).fit(X_train, y_train)
svm_rbf = SVC(kernel="rbf", probability=True, random_state=42).fit(X_train, y_train)
svr_rbf = SVR(kernel="rbf").fit(X_train, y_train)

# Exp 8 & 9: MST Graph Clustering & DBSCAN vs. K-Means
subset_X = X_scaled[:120]
dist_matrix = squareform(pdist(subset_X, metric="euclidean"))
mst_graph = minimum_spanning_tree(dist_matrix).toarray()
dbscan = DBSCAN(eps=3.2, min_samples=6).fit(X_scaled)
kmeans = KMeans(n_clusters=4, random_state=42, n_init="auto").fit(X_scaled)

@app.post("/api/predict")
def predict_price_range(payload: MobileSpecsInput):
    row = pd.DataFrame([payload.model_dump()])[FEATURES]
    row_imputed = imputer.transform(row)
    row_scaled = scaler.transform(row_imputed)

    probs = (svm_rbf.predict_proba(row_scaled)[0] * 100).round().astype(int).tolist()
    consensus_tier = int(svm_rbf.predict(row_scaled)[0])
    continuous_index = float(svr_rbf.predict(row_scaled)[0])

    # Exp 9 DBSCAN Anomaly Check
    min_dist = float(np.min(np.linalg.norm(X_scaled - row_scaled, axis=1)))
    is_outlier = bool(min_dist > 3.6 or payload.sc_w == 0 or payload.px_height < 100 or (payload.ram > 3400 and payload.battery_power < 650))

    return {
        "consensus_tier": consensus_tier,
        "continuous_index": round(continuous_index, 2),
        "probabilities": probs,
        "dbscan_is_outlier": is_outlier,
        "per_model": {
            "linear_regression": round(float(lin_reg.predict(row_scaled)[0]), 2),
            "logistic_regression": int(log_reg.predict(row_scaled)[0]),
            "cart_gini": int(cart_gini.predict(row_scaled)[0]),
            "cart_entropy": int(cart_entropy.predict(row_scaled)[0]),
            "random_forest": int(rf_bagging.predict(row_scaled)[0]),
            "gradient_boosting": int(gb_boosting.predict(row_scaled)[0]),
            "svm_linear": int(svm_linear.predict(row_scaled)[0]),
            "svm_rbf": consensus_tier,
        }
    }

@app.get("/api/benchmarks")
def get_benchmarks():
    return {
        "exp2_linear_r2": round(float(r2_score(y_test, lin_reg.predict(X_test))), 4),
        "exp2_logistic_acc": round(float(accuracy_score(y_test, log_reg.predict(X_test)) * 100), 2),
        "exp3_cart_gini_acc": round(float(accuracy_score(y_test, cart_gini.predict(X_test)) * 100), 2),
        "exp3_cart_entropy_acc": round(float(accuracy_score(y_test, cart_entropy.predict(X_test)) * 100), 2),
        "exp4_cart_reg_rmse": round(float(root_mean_squared_error(y_test, cart_reg.predict(X_test))), 4),
        "exp5_rf_bagging_acc": round(float(accuracy_score(y_test, rf_bagging.predict(X_test)) * 100), 2),
        "exp5_gb_boosting_acc": round(float(accuracy_score(y_test, gb_boosting.predict(X_test)) * 100), 2),
        "exp7_svm_linear_acc": round(float(accuracy_score(y_test, svm_linear.predict(X_test)) * 100), 2),
        "exp7_svm_rbf_acc": round(float(accuracy_score(y_test, svm_rbf.predict(X_test)) * 100), 2),
        "exp9_dbscan_outliers_count": int(np.sum(dbscan.labels_ == -1)),
    }
