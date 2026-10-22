# Page 06: Evaluation Benchmarks & Metrics
[⬅️ Previous: Frontend UI & Interactive Dashboards](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/05_FRONTEND_UI_AND_DASHBOARDS.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Viva & Interview Defense Guide ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/07_VIVA_AND_INTERVIEW_DEFENSE_GUIDE.md)

---

## 📊 1. Supervised Algorithm Benchmark Comparison

All models were evaluated on an independent, stratified test set of 200 candidate-job pairs ($20\%$ hold-out):

| Machine Learning Algorithm | Paradigm | Accuracy | Macro Precision | Macro Recall | Macro F1-Score |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Random Forest Classifier (Champion)** | Ensemble Bagging | **96.50%** | **0.9686** | **0.9669** | **0.9675** |
| **Logistic Regression (Baseline)** | Generalized Linear | **95.00%** | **0.9511** | **0.9552** | **0.9528** |
| **Gradient Boosting Classifier** | Ensemble Boosting | **93.50%** | **0.9377** | **0.9398** | **0.9384** |

### Continuous Regressor Benchmark (Score Engine)
* **Model:** `RandomForestRegressor(n_estimators=100, random_state=42)`
* **Mean Absolute Error (MAE):** **2.09%**
  * *Meaning:* On average, the predicted candidate match score deviates by just ~2 points from the target suitability benchmark.
* **Coefficient of Determination ($R^2$):** **0.9867**
  * *Meaning:* $98.67\%$ of the variance in candidate compatibility scores is explained by the 8 extracted NLP features.

---

## ⚖️ 2. Feature Importance Breakdown

Random Forest's Gini impurity reduction calculates the exact relative importance of each feature in predicting candidate suitability:

| Rank | Feature Dimension | Relative Weight | Physical Interpretation |
| :---: | :--- | :---: | :--- |
| **1** | **Skills Overlap Ratio** | **29.54%** | Primary determinant of technical qualification. |
| **2** | **Missing Skills Count** | **19.85%** | Penalizes candidates missing required hard skills. |
| **3** | **Matched Skills Count** | **19.17%** | Rewards raw depth of technical overlap. |
| **4** | **Action Verb Density** | **11.33%** | Distinguishes high-impact achievers from passive resumes. |
| **5** | **Experience Difference** | **8.63%** | Evaluates seniority and practical tenure against JD demands. |
| **6** | **TF-IDF Text Similarity** | **8.12%** | Measures contextual vocabulary and domain alignment. |
| **7** | **Education Difference** | **2.47%** | Accounts for degree hierarchy prerequisites. |
| **8** | **Section Completeness** | **0.90%** | Checks baseline ATS structural formatting. |

```
Skills Overlap Ratio       ████████████████████████████  29.54%
Missing Skills Count       ███████████████████  19.85%
Matched Skills Count       ██████████████████  19.17%
Action Verb Density        ███████████  11.33%
Experience Difference      ████████  8.63%
TF-IDF Text Similarity     ████████  8.12%
Education Difference       ██  2.47%
Section Completeness       █  0.90%
```

---

## 🔲 3. Detailed Confusion Matrix Analysis

### Primary Model: Random Forest Classifier ($N=200$)

```
                       Predicted Class 0       Predicted Class 1       Predicted Class 2
                       (Low Relevance)         (Moderate Fit)          (Strong Match)
Actual Class 0 (Low)         51                      1                       0
Actual Class 1 (Moderate)     0                     69                       2
Actual Class 2 (High)         0                      4                      73
```

### Key Statistical Insights:
1. **Low Fit Candidates (Class 0):**
   * 51 out of 52 actual low-fit candidates were correctly identified ($98.08\%$ recall).
   * **Crucial Hiring Safety:** Zero low-fit candidates were ever mistakenly classified as High Match (0 false high positives).
2. **Moderate Fit Candidates (Class 1):**
   * 69 out of 71 correctly categorized ($97.18\%$ recall).
3. **High Fit Candidates (Class 2):**
   * 73 out of 77 correctly categorized ($94.81\%$ recall).
   * 4 were classified as Moderate (conservative classification, safe for recruitment screening).

---

## 🔍 4. Comparative Model Confusion Matrices

### Logistic Regression Baseline ($N=200$)
```
Actual \ Predicted       Class 0 (Low)    Class 1 (Mod)    Class 2 (High)
Class 0 (Low)                 52                0                0
Class 1 (Moderate)             2               67                2
Class 2 (High)                 0                6               71
```
* **Analysis:** Linear hyperplanes separate the extreme classes very well, but struggle slightly on the non-linear boundaries between Moderate and High fit.

### Gradient Boosting Classifier ($N=200$)
```
Actual \ Predicted       Class 0 (Low)    Class 1 (Mod)    Class 2 (High)
Class 0 (Low)                 51                1                0
Class 1 (Moderate)             2               66                3
Class 2 (High)                 0                7               70
```
* **Analysis:** Showed slightly higher error rates along the decision boundary than Random Forest due to higher sensitivity to noise.

---

[⬅️ Previous: Frontend UI & Interactive Dashboards](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/05_FRONTEND_UI_AND_DASHBOARDS.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Viva & Interview Defense Guide ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/07_VIVA_AND_INTERVIEW_DEFENSE_GUIDE.md)
