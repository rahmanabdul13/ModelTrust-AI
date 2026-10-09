from typing import Dict, Any, List

def calculate_trust_score(
    quality_res: Dict[str, Any],
    risk_res: Dict[str, Any],
    leakage_res: Dict[str, Any],
    model_res: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes the composite ModelTrust Score (0-100) and produces actionable recommendations.
    """
    # 1. Data Quality Sub-score (0-100)
    q_missing_pct = quality_res.get("missing_pct", 0.0)
    q_dup_pct = quality_res.get("duplicate_pct", 0.0)
    q_const_cnt = quality_res.get("constant_cols_count", 0)

    quality_score = 100.0
    quality_score -= min(40.0, q_missing_pct * 3.0)
    quality_score -= min(30.0, q_dup_pct * 2.5)
    quality_score -= min(30.0, q_const_cnt * 15.0)
    quality_score = max(0.0, min(100.0, round(quality_score, 1)))

    # 2. Feature Risk Sub-score (0-100)
    r_id_cnt = risk_res.get("id_cols_count", 0)
    r_corr_cnt = risk_res.get("high_corr_count", 0)

    risk_score = 100.0
    risk_score -= min(50.0, r_id_cnt * 25.0)
    risk_score -= min(50.0, r_corr_cnt * 15.0)
    risk_score = max(0.0, min(100.0, round(risk_score, 1)))

    # 3. Leakage Safety Sub-score (0-100)
    l_susp_cnt = len(leakage_res.get("suspicious_features", []))
    l_sim_cnt = len(leakage_res.get("similarity_leaks", []))

    leakage_score = 100.0
    leakage_score -= min(50.0, l_susp_cnt * 25.0)
    leakage_score -= min(50.0, l_sim_cnt * 25.0)
    leakage_score = max(0.0, min(100.0, round(leakage_score, 1)))

    # 4. Model Performance Sub-score (0-100)
    if model_res.get("success", False):
        model_score = float(model_res.get("primary_score", 0.0))
        model_score = max(0.0, min(100.0, round(model_score, 1)))
    else:
        model_score = 50.0 # Default fallback if model training failed

    # Overall Composite Trust Score
    overall_score = round(
        (quality_score * 0.25) +
        (risk_score * 0.20) +
        (leakage_score * 0.25) +
        (model_score * 0.30)
    )

    overall_score = max(0, min(100, overall_score))

    # Trust level classification
    if overall_score >= 80:
        level = "High Trust"
        badge = "🟢"
        level_code = "high"
    elif overall_score >= 60:
        level = "Moderate Trust"
        badge = "🟡"
        level_code = "moderate"
    else:
        level = "Low Trust"
        badge = "🔴"
        level_code = "low"

    # Recommendations generation
    recommendations = generate_recommendations(
        quality_res, risk_res, leakage_res, model_res, overall_score
    )

    return {
        "overall_score": overall_score,
        "trust_level": level,
        "level_badge": badge,
        "level_code": level_code,
        "breakdown": {
            "data_quality": {
                "score": quality_score,
                "weight": 25,
                "label": "Data Quality"
            },
            "feature_risk": {
                "score": risk_score,
                "weight": 20,
                "label": "Feature Risk"
            },
            "leakage_safety": {
                "score": leakage_score,
                "weight": 25,
                "label": "Leakage Safety"
            },
            "model_performance": {
                "score": model_score,
                "weight": 30,
                "label": "Model Performance"
            }
        },
        "recommendations": recommendations
    }


def generate_recommendations(
    quality_res: Dict[str, Any],
    risk_res: Dict[str, Any],
    leakage_res: Dict[str, Any],
    model_res: Dict[str, Any],
    overall_score: int
) -> List[Dict[str, str]]:
    """
    Generates human-readable, prioritized recommendations.
    """
    recs = []

    # Missing values
    missing_cells = quality_res.get("missing_cells", 0)
    if missing_cells > 0:
        recs.append({
            "type": "warning",
            "category": "Data Quality",
            "title": "Missing Values Detected",
            "message": f"{missing_cells} missing value cell(s) detected across dataset. Consider mean/median imputation or removing sparse rows before deployment."
        })

    # Duplicates
    dup_rows = quality_res.get("duplicate_rows", 0)
    if dup_rows > 0:
        recs.append({
            "type": "warning",
            "category": "Data Quality",
            "title": "Duplicate Rows Found",
            "message": f"{dup_rows} duplicate row(s) detected. Consider removing duplicate records to prevent data leakage between train and test splits."
        })

    # Constant columns
    const_cols = quality_res.get("constant_cols", [])
    if len(const_cols) > 0:
        recs.append({
            "type": "info",
            "category": "Data Quality",
            "title": "Zero-Variance Columns",
            "message": f"{len(const_cols)} constant column(s) detected ({', '.join(const_cols[:3])}). Constant columns provide no signal for ML models and should be dropped."
        })

    # ID columns
    id_cols = risk_res.get("id_cols", [])
    if len(id_cols) > 0:
        col_names = [item["column"] for item in id_cols]
        recs.append({
            "type": "danger" if len(id_cols) > 1 else "warning",
            "category": "Feature Risk",
            "title": "ID-Like Features Detected",
            "message": f"Identifier columns detected ({', '.join(col_names[:3])}). ID features can cause severe overfitting by memorizing sample indices. Exclude them from training."
        })

    # Correlation
    corr_pairs = risk_res.get("high_corr_pairs", [])
    if len(corr_pairs) > 0:
        pair_str = ", ".join([f"{p['feature_1']} ↔ {p['feature_2']} ({p['correlation']})" for p in corr_pairs[:2]])
        recs.append({
            "type": "info",
            "category": "Feature Risk",
            "title": "High Multicollinearity",
            "message": f"Highly correlated feature pairs detected: {pair_str}. Redundant features can inflate variance in linear models."
        })

    # Leakage
    susp_features = leakage_res.get("suspicious_features", [])
    sim_leaks = leakage_res.get("similarity_leaks", [])
    if len(susp_features) > 0 or len(sim_leaks) > 0:
        leak_cols = list(set([f["feature"] for f in susp_features] + [f["feature"] for f in sim_leaks]))
        recs.append({
            "type": "danger",
            "category": "Data Leakage",
            "title": "Possible Data Leakage Detected",
            "message": f"Suspicious leakage features detected ({', '.join(leak_cols[:3])}). Input features directly encoding target information create artificially inflated test metrics."
        })

    # Model Performance
    if model_res.get("success", False):
        score = model_res.get("primary_score", 0.0)
        metric_name = model_res.get("primary_metric_name", "Score")
        if score < 60.0:
            recs.append({
                "type": "warning",
                "category": "Model Performance",
                "title": "Low Baseline Performance",
                "message": f"Baseline model achieved a low {metric_name} of {score}%. Consider feature engineering, handling missing data, or checking class balance."
            })
    else:
        recs.append({
            "type": "danger",
            "category": "Model Performance",
            "title": "Model Training Issue",
            "message": f"Baseline training failed: {model_res.get('error', 'Unknown error')}. Check target column selection."
        })

    # Clean dataset recommendation
    if len(recs) == 0 or overall_score >= 85:
        recs.insert(0, {
            "type": "success",
            "category": "Overall Status",
            "title": "Dataset Ready for Machine Learning",
            "message": "Dataset quality looks good, feature risks are low, and baseline model performance is solid. Ready for production modeling!"
        })

    return recs
