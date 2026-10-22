# Page 05: Frontend UI & Interactive Dashboards
[⬅️ Previous: Flask Backend & API Reference](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/04_FLASK_BACKEND_AND_API_REFERENCE.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Evaluation Benchmarks & Metrics ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/06_EVALUATION_BENCHMARKS_AND_METRICS.md)

---

## 🎨 1. Design System & Glassmorphic Styling (`style.css`)

The user interface uses a **Modern Dark Glassmorphic Aesthetic** built with pure CSS3 without heavy external CSS frameworks.

### Core Visual Principles
* **CSS Custom Properties (Variables):**
  * Backgrounds: `--bg-primary: #0f172a`, `--bg-card: rgba(30, 41, 59, 0.7)`
  * Glass Borders: `--border-color: rgba(255, 255, 255, 0.08)`
  * Accents: Emerald (`#10b981`), Amber (`#f59e0b`), Crimson (`#ef4444`), Indigo (`#6366f1`)
  * Backdrop Filter: `backdrop-filter: blur(12px)` for frosted-glass realism.
* **Typography:** `Plus Jakarta Sans` for clean UI chrome and headings, paired with `Space Grotesk` for data metrics and badges.
* **Responsive Layouts:** Built using CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(...))`) and Flexbox for mobile, tablet, and desktop viewports.

---

## 🖥️ 2. The 4 Interactive Views

### View 1: Single Resume Matcher (`index.html`)
* **Dual Input Mode:** Toggle between pasting raw text into an expansive text area or dragging & dropping `.pdf` / `.txt` files into an interactive dropzone.
* **1-Click Demo Presets:** Top quick-load buttons automatically fill the form with realistic pre-configured pairs (Data Scientist Strong, Data Scientist Moderate, Frontend Strong).
* **Animated Conic-Gradient Circular Gauge:**
  A dynamic CSS circular progress gauge renders the exact match score with color-coding:
  * Green (`#10b981`): Strong Match ($\ge 75\%$)
  * Amber (`#f59e0b`): Moderate Fit ($50 - 74\%$)
  * Red (`#ef4444`): Low Fit ($< 50\%$)
* **Skill Badges & Action Plan:** Renders present skills as green pills, missing skills as amber warning pills, and provides prioritized action points.

---

### View 2: Bulk Candidate Screener & HR Leaderboard (`bulk.html`)
* Designed for high-volume recruitment screening:
  1. Paste target job description.
  2. Upload dozens of candidate PDF resumes at once, or click **"Load Sample Applicant Pool"** to evaluate a pre-configured 5-candidate cohort.
  3. The backend evaluates each candidate concurrently and returns a sorted leaderboard.
* **Summary KPI Cards:**
  * Total Applicants Count
  * High Matches Count ($\ge 75\%$)
  * Average Match Score
  * Top Candidate Match Score
* **Client-Side CSV Export (`exportLeaderboardCSV()` in `main.js`):**
  Generates a real-time `.csv` download report directly in the browser using JavaScript's `Blob` API, without taxing the backend:
  ```javascript
  let csv = "Rank,Candidate Name,ML Match Score,Fit Label,Matched Skills Count,Experience Years\n";
  window.currentLeaderboardData.forEach(c => {
      csv += `"${c.rank}","${c.candidate_name}","${c.match_score}%","${c.fit_label}","${c.matched_skills.length}","${c.exp_years}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  ```

---

### View 3: ATS Keyword & Gap Optimizer (`optimizer.html`)
* Tailored for job seekers and resume refinement:
  * Compares candidate resume text against target job descriptions.
  * Side-by-side keyword presence vs missing critical skills.
  * Measures **Action Verb Density** and **Section Completeness**.
  * Outputs an ATS Optimization Checklist.

> 💡 **Pro-Tip:** In `templates/base.html` lines 41–43, the navigation bar link to `/optimizer` is currently commented out. Uncommenting it adds the tab directly to the global header navigation.

---

### View 4: ML Model Performance Dashboard (`analytics.html` + `analytics.js`)
* Renders real-time evaluations dynamically using **Chart.js**:
  1. **Model Comparison Bar Chart**: Side-by-side Accuracy and Macro F1 comparison across Random Forest, Gradient Boosting, and Logistic Regression.
  2. **Feature Importance Horizontal Bar Chart**: Visually shows the exact percentage weight of each of the 8 features.
  3. **Interactive Confusion Matrix**: $3 \times 3$ grid displaying True Positive vs False Positive distributions.

---

## ⚡ 3. Client-Side JavaScript Architecture (`main.js`)

* **Drag-and-Drop Event Listeners:** Standardizes `dragenter`, `dragover`, `dragleave`, and `drop` events to capture files via `e.dataTransfer.files`.
* **State Management:** Tracks active files (`selectedFile`, `selectedBulkFiles`) and current leaderboard arrays (`window.currentLeaderboardData`).
* **Non-Blocking Network Requests:** All form submissions prevent default reload (`e.preventDefault()`) and utilize asynchronous `fetch()` with loading spinners and error handling.

---

[⬅️ Previous: Flask Backend & API Reference](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/04_FLASK_BACKEND_AND_API_REFERENCE.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Evaluation Benchmarks & Metrics ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/06_EVALUATION_BENCHMARKS_AND_METRICS.md)
