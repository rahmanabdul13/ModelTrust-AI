import io
import re
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, List, Optional

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans DataFrame: strips column names, drops completely empty rows/columns,
    without altering existing column data types.
    """
    if df is None or df.empty:
        return df

    # Strip whitespace from column names
    df.columns = [str(c).strip() for c in df.columns]

    # Drop completely empty rows and columns
    df = df.dropna(how='all')
    df = df.dropna(axis=1, how='all')

    return df


def load_dataset(file_content: bytes, filename: str) -> pd.DataFrame:
    """
    Parses CSV or XLSX binary data into a pandas DataFrame safely.
    Handles auto-detection of CSV delimiters.
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith(('.xlsx', '.xls')):
        try:
            df = pd.read_excel(io.BytesIO(file_content))
            return clean_dataframe(df)
        except Exception as e:
            raise ValueError(f"Could not parse Excel file. Please ensure it is a valid .xlsx or .xls file. ({str(e)})")
            
    # For CSV files
    try:
        try:
            text_str = file_content.decode('utf-8')
        except UnicodeDecodeError:
            text_str = file_content.decode('latin-1')
    except Exception as e:
        raise ValueError(f"Could not decode text encoding in CSV file: {str(e)}")

    # 1. Try pandas auto-detection engine='python', sep=None
    try:
        df_auto = pd.read_csv(io.StringIO(text_str), sep=None, engine='python')
        if df_auto is not None and df_auto.shape[1] > 1 and df_auto.shape[0] > 0:
            return clean_dataframe(df_auto)
    except Exception:
        pass

    # 2. Try common separators explicitly
    separators = [',', ';', '\t', '|']
    best_df = None
    max_cols = 0

    for sep in separators:
        try:
            df_temp = pd.read_csv(io.StringIO(text_str), sep=sep, engine='python')
            if df_temp is not None and df_temp.shape[1] > max_cols and df_temp.shape[0] > 0:
                max_cols = df_temp.shape[1]
                best_df = df_temp
        except Exception:
            continue

    if best_df is not None and max_cols > 0:
        return clean_dataframe(best_df)

    raise ValueError("Could not parse CSV file automatically. Please check the file formatting and delimiters.")


def profile_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Returns high-level structural metrics, data preview, and column metadata using pandas-safe type checks.
    """
    total_rows = len(df)
    total_cols = len(df.columns)
    duplicate_rows = int(df.duplicated().sum())

    # Use pandas API for numeric vs categorical check
    numeric_cols = [str(c) for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
    categorical_cols = [str(c) for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]

    # Column info summary
    columns_info = []
    for col in df.columns:
        series = df[col]
        raw_dtype_str = str(series.dtype)

        if pd.api.types.is_bool_dtype(series):
            clean_type = "Boolean"
        elif pd.api.types.is_integer_dtype(series):
            clean_type = "Integer"
        elif pd.api.types.is_float_dtype(series):
            clean_type = "Float"
        elif pd.api.types.is_numeric_dtype(series):
            clean_type = "Numeric"
        elif pd.api.types.is_datetime64_any_dtype(series):
            clean_type = "Datetime"
        elif pd.api.types.is_categorical_dtype(series):
            clean_type = "Categorical"
        else:
            clean_type = "Categorical / Text"

        missing_cnt = int(series.isnull().sum())
        missing_pct = round((missing_cnt / total_rows * 100), 1) if total_rows > 0 else 0.0
        unique_cnt = int(series.nunique(dropna=True))

        columns_info.append({
            "name": str(col),
            "type": clean_type,
            "raw_dtype": raw_dtype_str,
            "missing_count": missing_cnt,
            "missing_pct": missing_pct,
            "unique_count": unique_cnt
        })

    # Prepare preview rows (first 10) safely converting NaN to None for JSON
    preview_df = df.head(10).copy()
    preview_df = preview_df.where(pd.notnull(preview_df), None)
    preview_records = preview_df.to_dict(orient="records")

    return {
        "total_rows": total_rows,
        "total_cols": total_cols,
        "duplicate_rows": duplicate_rows,
        "duplicate_pct": round((duplicate_rows / total_rows * 100), 1) if total_rows > 0 else 0.0,
        "num_numeric_cols": len(numeric_cols),
        "num_categorical_cols": len(categorical_cols),
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "columns_info": columns_info,
        "preview": preview_records
    }


def suggest_target_column(df: pd.DataFrame) -> Tuple[str, str]:
    """
    Suggests the most probable target column name and auto-detects problem type (classification vs regression).
    """
    target_keywords = ['churn', 'target', 'label', 'class', 'output', 'result', 'outcome', 'species', 'diagnosis', 'category', 'y']
    suggested_col = None

    # Exact match check first
    for col in df.columns:
        col_lower = str(col).strip().lower()
        if col_lower in target_keywords:
            suggested_col = str(col)
            break

    # Substring match if exact match not found
    if not suggested_col:
        for col in df.columns:
            col_lower = str(col).strip().lower()
            if any(kw in col_lower for kw in target_keywords):
                suggested_col = str(col)
                break

    # Fallback to last column
    if not suggested_col:
        suggested_col = str(df.columns[-1])

    problem_type = detect_problem_type(df, suggested_col)
    return suggested_col, problem_type


def detect_problem_type(df: pd.DataFrame, target_col: str) -> str:
    """
    Detects whether target is Classification or Regression using pandas-safe API type checks.
    """
    if target_col not in df.columns:
        return "classification"

    target_series = df[target_col].dropna()
    if len(target_series) == 0:
        return "classification"

    # Non-numeric (string, object, category, bool) -> classification
    if not pd.api.types.is_numeric_dtype(target_series) or pd.api.types.is_bool_dtype(target_series):
        return "classification"

    n_unique = int(target_series.nunique())
    total_len = len(target_series)

    # For numeric targets: check unique value count
    if n_unique <= 10:
        return "classification"
    elif n_unique <= 20 and (n_unique / total_len) <= 0.05:
        return "classification"
    else:
        return "regression"


def analyze_quality(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Analyzes missing values, duplicate rows, and constant columns.
    """
    total_rows = len(df)
    total_cols = len(df.columns)
    total_cells = total_rows * total_cols if total_rows > 0 and total_cols > 0 else 1

    missing_cells = int(df.isnull().sum().sum())
    missing_pct = round((missing_cells / total_cells * 100), 1)

    missing_by_col = {}
    for col in df.columns:
        cnt = int(df[col].isnull().sum())
        if cnt > 0:
            missing_by_col[str(col)] = cnt

    duplicate_rows = int(df.duplicated().sum())
    duplicate_pct = round((duplicate_rows / total_rows * 100), 1) if total_rows > 0 else 0.0

    constant_cols = [str(col) for col in df.columns if df[col].nunique(dropna=False) <= 1]

    # Status indicator determination
    if missing_cells == 0 and duplicate_rows == 0 and len(constant_cols) == 0:
        status = "good"
        status_color = "green"
        status_label = "High Quality"
    elif missing_pct <= 10.0 and duplicate_pct <= 5.0 and len(constant_cols) <= 1:
        status = "warning"
        status_color = "yellow"
        status_label = "Minor Quality Issues"
    else:
        status = "danger"
        status_color = "red"
        status_label = "Significant Quality Issues"

    return {
        "missing_cells": missing_cells,
        "missing_pct": missing_pct,
        "cols_with_missing": len(missing_by_col),
        "missing_by_col": missing_by_col,
        "duplicate_rows": duplicate_rows,
        "duplicate_pct": duplicate_pct,
        "constant_cols": constant_cols,
        "constant_cols_count": len(constant_cols),
        "status": status,
        "status_color": status_color,
        "status_label": status_label
    }


def analyze_feature_risks(df: pd.DataFrame, target_col: Optional[str] = None) -> Dict[str, Any]:
    """
    Detects ID-like features and highly correlated numerical feature pairs using pandas-safe API type checks.
    """
    total_rows = len(df)
    id_cols = []
    id_regex = re.compile(r'^(id|identifier|roll|registration|serial|index|no|num|_id)$', re.IGNORECASE)

    for col in df.columns:
        if target_col and col == target_col:
            continue

        col_str = str(col).strip().lower()
        unique_cnt = int(df[col].nunique(dropna=True))

        # Name match check
        is_name_match = bool(id_regex.search(col_str)) or col_str.endswith('_id') or col_str.startswith('id_') or col_str == 'id'
        
        # High uniqueness ratio check for non-float columns
        is_high_unique = False
        if total_rows >= 10:
            uniqueness_ratio = unique_cnt / total_rows
            # Safely check if NOT float using pandas API
            if uniqueness_ratio >= 0.95 and not pd.api.types.is_float_dtype(df[col]):
                is_high_unique = True

        if is_name_match or is_high_unique:
            reason = "Matches ID naming convention" if is_name_match else "Extremely high uniqueness ratio (>= 95%)"
            id_cols.append({
                "column": str(col),
                "reason": reason,
                "unique_values": unique_cnt
            })

    # Correlation calculation for numeric columns using pandas API
    numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c]) and c != target_col]
    high_correlation_pairs = []

    if len(numeric_cols) >= 2:
        try:
            corr_matrix = df[numeric_cols].corr().abs()
            for i in range(len(numeric_cols)):
                for j in range(i + 1, len(numeric_cols)):
                    c1 = numeric_cols[i]
                    c2 = numeric_cols[j]
                    val = corr_matrix.loc[c1, c2]
                    if pd.notnull(val) and val >= 0.90:
                        high_correlation_pairs.append({
                            "feature_1": str(c1),
                            "feature_2": str(c2),
                            "correlation": round(float(val), 3)
                        })
        except Exception:
            pass

    return {
        "id_cols": id_cols,
        "id_cols_count": len(id_cols),
        "high_corr_pairs": high_correlation_pairs,
        "high_corr_count": len(high_correlation_pairs)
    }


def analyze_data_leakage(df: pd.DataFrame, target_col: str) -> Dict[str, Any]:
    """
    Detects potential data leakage: suspicious feature names and high target similarity.
    """
    suspicious_features = []
    similarity_leaks = []

    if target_col not in df.columns:
        return {
            "suspicious_features": [],
            "similarity_leaks": [],
            "has_leakage": False
        }

    target_lower = str(target_col).strip().lower()
    leakage_keywords = ['target', 'label', 'outcome', 'result', 'decision', 'churn_status']

    for col in df.columns:
        if col == target_col:
            continue

        col_lower = str(col).strip().lower()

        # Suspicious column names check
        name_match = any(kw in col_lower for kw in leakage_keywords) or (target_lower in col_lower and len(target_lower) > 2)
        if name_match:
            suspicious_features.append({
                "feature": str(col),
                "reason": f"Feature name resembles target column '{target_col}' or leakage keyword."
            })

        # Target similarity check
        try:
            s1 = df[col].astype(str)
            s2 = df[target_col].astype(str)
            valid_mask = df[col].notnull() & df[target_col].notnull()
            
            if valid_mask.sum() > 5:
                match_ratio = float((s1[valid_mask] == s2[valid_mask]).mean())
                if match_ratio >= 0.95:
                    similarity_leaks.append({
                        "feature": str(col),
                        "similarity_pct": round(match_ratio * 100, 1),
                        "reason": f"{round(match_ratio * 100, 1)}% of values are identical to target variable values."
                    })
        except Exception:
            pass

    has_leakage = len(suspicious_features) > 0 or len(similarity_leaks) > 0

    return {
        "suspicious_features": suspicious_features,
        "similarity_leaks": similarity_leaks,
        "has_leakage": has_leakage,
        "leakage_count": len(suspicious_features) + len(similarity_leaks)
    }
