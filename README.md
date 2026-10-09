# ModelTrust AI – Intelligent ML Dataset Reliability & Model Validation Platform

**ModelTrust AI** is a web application that allows users to upload a CSV or Excel dataset and automatically analyze whether the dataset is reliable and suitable for machine learning.

Built specifically to be simple, robust, and easy to explain in an academic viva presentation.

---

## 🚀 Key Features

1. **Dataset Profiling**: Automatic row/column metrics, data preview (first 10 rows), missing counts, and column metadata.
2. **Target & Task Detection**:
   - Auto-detects target variable names (`target`, `label`, `outcome`, `result`, etc.).
   - Auto-detects **Classification** vs **Regression** tasks to prevent `Unknown label type` errors.
   - Baseline models: **Logistic Regression** for Classification, **Linear Regression** for Regression.
3. **Data Quality Analysis**: Missing values summary, duplicate row count, and zero-variance constant column warnings with Green/Yellow/Red status badges.
4. **Feature Risk Analysis**:
   - **ID Column Warnings**: Identifies identifier features (regex match or ≥ 95% uniqueness ratio).
   - **High Multicollinearity**: Detects numeric feature pairs with absolute correlation $|r| \ge 0.90$.
5. **Data Leakage Detection**: Scans suspicious target-derived column names and features exhibiting $\ge 95\%$ target similarity.
6. **Scikit-Learn Baseline Evaluation**: Automatic 80% train / 20% test split with `ColumnTransformer` pipelines:
   - Classification Metrics: Accuracy, Precision, Recall, F1 Score.
   - Regression Metrics: R² Score, MAE, RMSE.
7. **ModelTrust Score (0–100)**:
   - Formula: $(0.25 \times \text{Quality}) + (0.20 \times \text{Risk}) + (0.25 \times \text{Leakage}) + (0.30 \times \text{Model Performance})$
   - Trust levels: 🟢 High Trust (80-100), 🟡 Moderate Trust (60-79), 🔴 Low Trust (0-59).
8. **Automated Recommendations**: Prioritized data cleaning & risk remediation advice.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.13, FastAPI, Uvicorn
- **Machine Learning**: Pandas, NumPy, Scikit-Learn

---

## 🏃 How to Run the Application

### 1. Start the FastAPI Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Backend will start at: `http://127.0.0.1:8000`

### 2. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:3000`

---

## 🎓 Viva Presentation Cheat-Sheet

- **Data Quality**: Checks missing cells, duplicates, and constant zero-variance features.
- **Feature Risks**: Catches ID columns that cause memorization/overfitting and collinear pairs that distort linear weights.
- **Data Leakage**: Flags features that directly contain the target outcome, preventing deceptive 100% test accuracy.
- **Baseline Models**: Logistic and Linear Regression provide transparent benchmark metrics without complex black-box hyper-parameters.
- **Trust Score**: Merges quality, risk, leakage safety, and model metrics into one composite 0–100 reliability score.
