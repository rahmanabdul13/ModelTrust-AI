import os
import io
import json
from pathlib import Path
from typing import Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from analysis import (
    load_dataset,
    profile_dataset,
    suggest_target_column,
    detect_problem_type,
    analyze_quality,
    analyze_feature_risks,
    analyze_data_leakage
)
from model import evaluate_baseline_model
from trust_score import calculate_trust_score

app = FastAPI(
    title="ModelTrust AI API",
    description="Backend API for ML Dataset Reliability Profiling & Model Validation Platform",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache stored datasets in-memory by session ID or current state
# For simple college mini-project, store current active dataframe
# Store active dataset globally or per session key
ACTIVE_DATASETS: Dict[str, Any] = {}

SAMPLES_DIR = Path(__file__).parent / "sample_datasets"

class TargetAnalysisRequest(BaseModel):
    session_id: str
    target_column: str
    problem_type: Optional[str] = None  # "classification" or "regression" or None for auto


def process_dataframe(df, filename: str, session_id: str, target_override: Optional[str] = None, problem_type_override: Optional[str] = None):
    """
    Executes full pipeline: profiling, quality, risks, leakage, model evaluation, and trust score.
    """
    if df is None or len(df) == 0:
        raise HTTPException(status_code=400, detail="Dataset is empty.")

    # Save to active datasets store
    ACTIVE_DATASETS[session_id] = df

    # 1. Dataset Profiling
    profile = profile_dataset(df)

    # 2. Target Column & Problem Type Selection
    if target_override and target_override in df.columns:
        target_col = target_override
        if problem_type_override in ["classification", "regression"]:
            prob_type = problem_type_override
        else:
            prob_type = detect_problem_type(df, target_col)
    else:
        target_col, prob_type = suggest_target_column(df)
        if problem_type_override in ["classification", "regression"]:
            prob_type = problem_type_override

    # 3. Quality Analysis
    quality = analyze_quality(df)

    # 4. Feature Risks Analysis
    risks = analyze_feature_risks(df, target_col=target_col)

    # 5. Data Leakage Detection
    leakage = analyze_data_leakage(df, target_col=target_col)

    # 6. Baseline Model Evaluation
    model_eval = evaluate_baseline_model(df, target_col=target_col, problem_type=prob_type)

    # 7. Trust Score Calculation & Recommendations
    trust_res = calculate_trust_score(quality, risks, leakage, model_eval)

    return {
        "session_id": session_id,
        "filename": filename,
        "target_column": target_col,
        "problem_type": prob_type,
        "available_columns": [str(c) for c in df.columns],
        "profile": profile,
        "quality": quality,
        "risks": risks,
        "leakage": leakage,
        "model_evaluation": model_eval,
        "trust_score": trust_res
    }


@app.get("/")
def root():
    return {
        "status": "online",
        "app": "ModelTrust AI",
        "description": "Intelligent ML Dataset Reliability & Model Validation Platform API"
    }


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    session_id: str = Form("default_session")
):
    try:
        content = await file.read()
        df = load_dataset(content, file.filename)
        result = process_dataframe(df, file.filename, session_id)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process dataset: {str(e)}")


@app.post("/api/analyze-target")
async def reanalyze_target(request: TargetAnalysisRequest):
    session_id = request.session_id
    if session_id not in ACTIVE_DATASETS:
        # Fallback to any active dataset if session matches or default
        if "default_session" in ACTIVE_DATASETS:
            session_id = "default_session"
        elif len(ACTIVE_DATASETS) > 0:
            session_id = list(ACTIVE_DATASETS.keys())[0]
        else:
            raise HTTPException(status_code=404, detail="No active dataset found. Please upload a dataset first.")

    df = ACTIVE_DATASETS[session_id]
    
    if request.target_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"Column '{request.target_column}' not found in dataset.")

    result = process_dataframe(
        df,
        filename="current_dataset",
        session_id=session_id,
        target_override=request.target_column,
        problem_type_override=request.problem_type
    )
    return result


@app.get("/api/sample-datasets")
def list_sample_datasets():
    samples = [
        {
            "id": "bank_churn_sample.csv",
            "name": "Bank Customer Churn",
            "type": "Classification",
            "rows": 25,
            "cols": 8,
            "description": "Customer banking data for predicting churn using Logistic Regression."
        },
        {
            "id": "housing_prices_sample.csv",
            "name": "Housing Market Prices",
            "type": "Regression",
            "rows": 20,
            "cols": 6,
            "description": "Real estate metrics for predicting home prices using Linear Regression."
        },
        {
            "id": "medical_leakage_sample.csv",
            "name": "Medical Records (Quality & Leakage Risks)",
            "type": "Classification (Risk Demo)",
            "rows": 16,
            "cols": 9,
            "description": "Demonstrates missing values, ID feature detection, collinearity, and target leakage."
        }
    ]
    return samples


@app.get("/api/sample-dataset/{filename}")
def load_sample(filename: str, session_id: str = "default_session"):
    file_path = SAMPLES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Sample dataset not found.")

    try:
        with open(file_path, "rb") as f:
            content = f.read()
        df = load_dataset(content, filename)
        result = process_dataframe(df, filename, session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sample dataset: {str(e)}")
