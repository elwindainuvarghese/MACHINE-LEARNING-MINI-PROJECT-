# Page 02: NLP Pipeline & Feature Engineering
[⬅️ Previous: Executive Summary & Tech Stack](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/01_EXECUTIVE_SUMMARY_AND_TECH_STACK.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Machine Learning Models & Training ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/03_MACHINE_LEARNING_MODELS_AND_TRAINING.md)

---

## 🔬 1. Document Preprocessing & Parsing (`resume_parser.py`)

Raw resumes arrive either as plain text pasted directly into the UI or as uploaded `.pdf` documents.

### Step 1: In-Memory PDF Text Extraction (`extract_text_from_pdf`)
```python
def extract_text_from_pdf(pdf_file_bytes):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file_bytes))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        return ""
```
* **How it works:** Accepts binary file bytes directly from Flask's `request.files['resume_file'].read()`. It wraps the bytes in an `io.BytesIO` buffer, reads all pages via `PyPDF2.PdfReader`, and extracts text without creating temporary disk files.

### Step 2: Text Normalization (`clean_text`)
```python
def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'http\S+\s*', ' ', text)           # Strips URLs
    text = re.sub(r'[^\w\s\+\#\.\-]', ' ', text)      # Keeps C++, C#, .NET etc.
    text = re.sub(r'\s+', ' ', text).strip()          # Collapses whitespace
    return text
```
* **Crucial Edge-Case Handling:** Most standard text clean algorithms strip symbols like `+`, `#`, and `.`. In tech resumes, this destroys critical skill names (e.g., turning `C++` into `C`, `C#` into `C`, `.NET` into `NET`). The custom regex `[^\w\s\+\#\.\-]` explicitly preserves these tech symbols.

---

## 🗂️ 2. Domain Skill Extraction (`SKILL_DATABASE`)

The system maintains a comprehensive dictionary of technical skills categorized into 7 domains:

| Category | Skills Included |
| :--- | :--- |
| **Programming** | `python`, `java`, `c++`, `c#`, `javascript`, `typescript`, `php`, `ruby`, `go`, `golang`, `rust`, `kotlin`, `swift`, `r`, `matlab`, `scala`, `perl`, `html`, `css`, `sql`, `bash`, `powershell` |
| **Machine Learning & AI** | `machine learning`, `deep learning`, `artificial intelligence`, `nlp`, `natural language processing`, `computer vision`, `tensorflow`, `keras`, `pytorch`, `scikit-learn`, `sklearn`, `pandas`, `numpy`, `scipy`, `xgboost`, `lightgbm`, `catboost`, `opencv`, `transformers`, `huggingface`, `llm`, `bert`, `spacy`, `nltk`, `neural networks`, `cnn`, `rnn`, `lstm`, `reinforcement learning`, `data science` |
| **Web Technologies** | `react`, `react.js`, `angular`, `vue`, `vue.js`, `node.js`, `nodejs`, `express`, `flask`, `django`, `fastapi`, `spring boot`, `asp.net`, `laravel`, `bootstrap`, `tailwind`, `tailwind css`, `next.js`, `nuxt.js`, `graphql`, `rest api`, `restful api`, `json`, `microservices`, `webpack` |
| **Cloud & DevOps** | `aws`, `amazon web services`, `azure`, `gcp`, `google cloud`, `docker`, `kubernetes`, `k8s`, `terraform`, `ansible`, `jenkins`, `git`, `github`, `gitlab`, `ci/cd`, `cicd`, `linux`, `unix`, `bash`, `cloudformation`, `helm`, `nginx`, `apache`, `monitoring`, `prometheus`, `grafana` |
| **Databases** | `postgresql`, `postgres`, `mysql`, `sqlite`, `mongodb`, `redis`, `elasticsearch`, `cassandra`, `oracle`, `sql server`, `mssql`, `dynamodb`, `snowflake`, `bigquery`, `neo4j`, `mariadb` |
| **Data Engineering** | `spark`, `pyspark`, `hadoop`, `kafka`, `airflow`, `dbt`, `etl`, `elt`, `data warehousing`, `data pipeline`, `hive`, `flink`, `databricks`, `presto` |
| **Management & Soft Skills** | `project management`, `agile`, `scrum`, `jira`, `confluence`, `kanban`, `leadership`, `communication`, `problem solving`, `critical thinking`, `teamwork`, `collaboration`, `time management`, `stakeholder management`, `product management`, `sdlc` |

### Word Boundary Matching
To prevent false-positive substring matches (e.g., matching the programming language `"r"` inside `"react"` or `"go"` inside `"good"`):
```python
pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
if re.search(pattern, text_lower):
    found_skills.add(skill)
```

---

## 📐 3. Numerical & Structural Feature Extractors

### A. Experience Years Extraction (`extract_experience_years`)
1. **Explicit Pattern Regex:**
   * Pattern 1: `(\d{1,2})\s*\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience` (e.g., *"5+ years of experience"*)
   * Pattern 2: `experience\s*(?:of\s*)?(\d{1,2})\s*\+?\s*(?:years?|yrs?)` (e.g., *"experience of 4 years"*)
   * Pattern 3: `(\d{1,2})\s*\+\s*(?:years?|yrs?)` (e.g., *"3+ yrs"*)
   * Pattern 4: `(\d{1,2})\s*(?:years?|yrs?)\s+working` (e.g., *"6 years working"*)
2. **Chronological Span Fallback:**
   If no explicit duration is stated, the regex searches for 4-digit years:
   ```python
   year_matches = re.findall(r'\b(20\d{2}|19\d{2})\b', text_lower)
   if year_matches:
       span = max(years_list) - min(years_list)
   ```

### B. Education Tier Scoring (`extract_education_level`)
Converts non-linear academic degrees into an ordinal hierarchy:
* **Score 4**: PhD / Doctorate
* **Score 3**: Master's (M.S., M.Tech, MBA, Masters)
* **Score 2**: Bachelor's (B.S., B.Tech, B.E., BBA, Degree)
* **Score 1**: Associate / Diploma / High School

### C. Action Verb Density (`extract_action_words`)
Counts occurrences of 24 assertive action verbs:
```python
action_verbs = [
    'built', 'developed', 'engineered', 'implemented', 'designed', 'architected',
    'led', 'managed', 'optimized', 'scaled', 'created', 'deployed', 'automated',
    'improved', 'increased', 'reduced', 'spearheaded', 'established', 'achieved',
    'analyzed', 'orchestrated', 'refactored', 'delivered', 'transformed'
]
```

### D. Resume Section Completeness (`get_section_completeness`)
Checks for standard structural sections required by Applicant Tracking Systems:
* **Education**: `r'\b(education|academic|qualification)\b'`
* **Experience**: `r'\b(experience|work history|employment|projects)\b'`
* **Skills**: `r'\b(skills|technologies|technical proficiencies|competencies)\b'`
* **Summary**: `r'\b(summary|objective|profile|about me)\b'`
Each present section contributes $0.25$ (Score ranges from $0.25$ to $1.00$).

---

## 🎯 4. The 8-Dimensional Feature Vector

The output of `compute_nlp_features()` is condensed into an 8-dimensional numerical vector representing candidate-job compatibility:

| Index | Feature Key | Mathematical Formulation | Description |
| :---: | :--- | :--- | :--- |
| $f_0$ | `tfidf_sim` | $\frac{\vec{v}_{\text{resume}} \cdot \vec{v}_{\text{jd}}}{\|\vec{v}_{\text{resume}}\| \|\vec{v}_{\text{jd}}\|}$ | Cosine similarity between TF-IDF representations. |
| $f_1$ | `skills_overlap_ratio` | $\frac{|\text{Skills}_{\text{resume}} \cap \text{Skills}_{\text{jd}}|}{|\text{Skills}_{\text{jd}}|}$ | Jaccard overlap of required technical skills. |
| $f_2$ | `matched_skills_count` | $|\text{Skills}_{\text{resume}} \cap \text{Skills}_{\text{jd}}|$ | Raw count of matched domain skills. |
| $f_3$ | `missing_skills_count` | $|\text{Skills}_{\text{jd}} \setminus \text{Skills}_{\text{resume}}|$ | Raw count of missing target skills. |
| $f_4$ | `exp_diff` | $\text{Years}_{\text{resume}} - \text{Years}_{\text{jd}}$ | Experience surplus or deficit. |
| $f_5$ | `edu_diff` | $\text{EduLevel}_{\text{resume}} - \text{EduLevel}_{\text{jd}}$ | Degree hierarchy surplus or deficit. |
| $f_6$ | `action_words_count` | $\sum \text{Count}(\text{action\_verbs})$ | Active verb frequency. |
| $f_7$ | `section_completeness`| $\sum \text{PresentSections} \times 0.25$ | ATS structural completeness (0.25 – 1.0). |

---

[⬅️ Previous: Executive Summary & Tech Stack](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/01_EXECUTIVE_SUMMARY_AND_TECH_STACK.md) | [Back to Index](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/README.md) | [Next: Machine Learning Models & Training ➡️](file:///c:/Users/Admin/Desktop/ml%20mini%20project/docs/03_MACHINE_LEARNING_MODELS_AND_TRAINING.md)
