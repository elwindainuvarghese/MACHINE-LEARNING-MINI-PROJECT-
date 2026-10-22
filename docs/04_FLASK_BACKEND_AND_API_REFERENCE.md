# Page 04: Flask Backend & REST API Reference
[⬅️ Previous: Machine Learning Models & Training](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/03_MACHINE_LEARNING_MODELS_AND_TRAINING.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Frontend UI & Interactive Dashboards ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/05_FRONTEND_UI_AND_DASHBOARDS.md)

---

## 🚀 1. Server Architecture & Model Bootstrapping (`app.py`)

The Flask application acts as the orchestration layer between client requests and the machine learning inference pipeline.

### Bootstrapping & In-Memory Model Caching
Instead of reloading model files from disk on every HTTP request (which causes severe latency), models are loaded once into memory upon server startup:

```python
MODEL_PATH = 'models/resume_matcher_model.joblib'
VECTORIZER_PATH = 'models/tfidf_vectorizer.joblib'
SCALER_PATH = 'models/scaler.joblib'
METRICS_PATH = 'models/model_metrics.json'

ml_payload = None
vectorizer = None
scaler = None
model_metrics = {}

def load_ml_components():
    global ml_payload, vectorizer, scaler, model_metrics
    if os.path.exists(MODEL_PATH): ml_payload = joblib.load(MODEL_PATH)
    if os.path.exists(VECTORIZER_PATH): vectorizer = joblib.load(VECTORIZER_PATH)
    if os.path.exists(SCALER_PATH): scaler = joblib.load(SCALER_PATH)
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, 'r') as f:
            model_metrics = json.load(f)

load_ml_components()
```
* **Performance Gain:** Reduces inference response latency to **< 50 milliseconds**.

---

## ⚡ 2. The Core Inference Engine (`predict_resume_relevance`)

When a resume and job description are submitted, `predict_resume_relevance()` executes the following steps:

1. **Input Validation**: Ensures neither the resume nor the JD is empty or shorter than 5 words.
2. **Text Vectorization**: Computes TF-IDF vector cosine similarity between candidate text and JD text.
3. **Domain Feature Extraction**: Calls `compute_nlp_features()` to extract skill overlaps, missing skills, experience delta, education delta, and action verb frequency.
4. **Vector Assembly & Transformation**: Builds the exact 8-dimensional vector and transforms it with `scaler.transform()`.
5. **Model Inference**:
   * `classifier.predict(scaled_feats)` $\rightarrow$ Predicts discrete class (`0`, `1`, or `2`).
   * `classifier.predict_proba(scaled_feats)` $\rightarrow$ Calculates prediction confidence percentage.
   * `regressor.predict(scaled_feats)` $\rightarrow$ Calculates continuous match percentage bounded between $10.0\%$ and $99.0\%$.
6. **Dynamic AI Action Plan Generation**:
   Generates targeted, contextual feedback to help candidates improve:
   * **Missing Skills Alert**: *"Consider adding or highlighting these key missing skills: Python, Docker, AWS."*
   * **Experience Gap Alert**: *"The job requires ~5 years, while your resume indicates ~3 years. Emphasize project complexity and leadership roles."*
   * **Action Verb Density Alert**: *"Increase active verb density (e.g., 'Engineered', 'Optimized', 'Architected') to strengthen bullet points."*
   * **Section Completeness Alert**: *"Standardize resume structure by adding explicit headers for: Education, Summary."*
   * **Vocabulary Alignment Alert**: *"Incorporate more industry-specific vocabulary from the job description to pass ATS filtering."*

---

## 🌐 3. REST API Endpoint Reference

### Endpoint 1: Single Resume Matcher
* **URL:** `POST /api/match`
* **Content-Type:** `multipart/form-data` or `application/json`
* **Request Parameters:**
  | Field | Type | Description |
  | :--- | :--- | :--- |
  | `resume_file` | Binary File | Optional uploaded `.pdf` or `.txt` file |
  | `resume_text` | String | Candidate resume plain text (if not uploading file) |
  | `jd_text` | String | Target job description text (Required) |

* **Sample Success Response (`200 OK`):**
```json
{
  "status": "success",
  "data": {
    "match_score": 88.4,
    "fit_class": 2,
    "fit_label": "Highly Relevant (Strong Match)",
    "badge_class": "success",
    "color": "#10b981",
    "confidence": 97.2,
    "breakdown": {
      "text_similarity": 34.8,
      "skills_overlap_pct": 80.0,
      "matched_skills_count": 8,
      "missing_skills_count": 2,
      "resume_exp_years": 4,
      "jd_req_exp_years": 3,
      "resume_edu": "Master's Degree",
      "jd_edu": "Master's Degree",
      "action_words_count": 12,
      "section_completeness_pct": 100.0
    },
    "skills": {
      "matched": ["python", "machine learning", "deep learning", "nlp", "sql", "pandas", "numpy", "scikit-learn"],
      "missing": ["tensorflow", "pytorch"]
    },
    "recommendations": [
      "Consider adding or highlighting these key missing skills if you possess them: tensorflow, pytorch."
    ]
  }
}
```

---

### Endpoint 2: Bulk Candidate Screener
* **URL:** `POST /api/bulk_match`
* **Content-Type:** `multipart/form-data` or `application/json`
* **Request Parameters:**
  * `jd_text`: String (Required)
  * `resume_files`: Array of binary files (`.pdf` or `.txt`) **OR**
  * `candidates`: JSON array of `{ name: string, text: string }`

* **Sample Success Response (`200 OK`):**
```json
{
  "status": "success",
  "summary": {
    "total_candidates": 5,
    "high_matches": 2,
    "avg_score": 67.4,
    "top_score": 91.2
  },
  "leaderboard": [
    {
      "rank": 1,
      "candidate_name": "Alex Morgan (Senior DS)",
      "match_score": 91.2,
      "fit_label": "Highly Relevant (Strong Match)",
      "badge_class": "success",
      "matched_skills": ["python", "machine learning", "deep learning"],
      "missing_skills": [],
      "exp_years": 4,
      "text_sim": 38.5
    }
  ]
}
```

---

### Endpoint 3: Model Performance Metrics
* **URL:** `GET /api/model_info`
* **Response:** Returns serialized contents of `model_metrics.json` including accuracy, macro F1, confusion matrices for Random Forest, Gradient Boosting, and Logistic Regression, plus relative feature importances for Chart.js visualization.

---

### Endpoint 4: Sample Demo Presets
* **URL:** `GET /api/sample_data`
* **Response:** Returns pre-packaged, realistic resumes and job descriptions (*Data Scientist, Frontend Developer, DevOps Engineer*) enabling 1-click evaluation without manual typing.

---

[⬅️ Previous: Machine Learning Models & Training](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/03_MACHINE_LEARNING_MODELS_AND_TRAINING.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Frontend UI & Interactive Dashboards ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/05_FRONTEND_UI_AND_DASHBOARDS.md)
