import pandas as pd
import numpy as np
from typing import Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, r2_score, mean_absolute_error, mean_squared_error

def evaluate_baseline_model(df: pd.DataFrame, target_col: str, problem_type: str) -> Dict[str, Any]:
    """
    Trains a baseline model (Logistic Regression for classification, Linear Regression for regression)
    using scikit-learn Pipeline and ColumnTransformer with pandas-safe dtype handling.
    """
    if target_col not in df.columns:
        return {
            "success": False,
            "error": f"Target column '{target_col}' not found in dataset.",
            "metrics": {}
        }

    # Drop rows where target is NaN
    clean_df = df.dropna(subset=[target_col]).copy()
    if len(clean_df) < 5:
        return {
            "success": False,
            "error": "Dataset has too few valid rows (< 5) after removing missing target values to train a model.",
            "metrics": {}
        }

    X = clean_df.drop(columns=[target_col])
    y = clean_df[target_col]

    if X.shape[1] == 0:
        return {
            "success": False,
            "error": "No feature columns remaining to train the model.",
            "metrics": {}
        }

    # Use pandas-safe API to identify numeric and categorical columns
    numeric_cols = [str(c) for c in X.columns if pd.api.types.is_numeric_dtype(X[c])]
    categorical_cols = [str(c) for c in X.columns if not pd.api.types.is_numeric_dtype(X[c])]

    # Preprocessing pipelines
    transformers = []
    if numeric_cols:
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])
        transformers.append(('num', numeric_transformer, numeric_cols))

    if categorical_cols:
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        transformers.append(('cat', categorical_transformer, categorical_cols))

    if not transformers:
        return {
            "success": False,
            "error": "Could not build preprocessing pipeline for the feature columns.",
            "metrics": {}
        }

    preprocessor = ColumnTransformer(transformers=transformers, remainder='drop')

    try:
        if problem_type == "classification":
            # Check unique target classes
            unique_classes = y.nunique()
            if unique_classes < 2:
                return {
                    "success": False,
                    "error": f"Classification requires at least 2 distinct target classes. Selected column '{target_col}' contains only {unique_classes} class.",
                    "metrics": {}
                }

            # Check for rare classes with only 1 sample
            class_counts = y.value_counts()
            min_class_count = class_counts.min()

            # Encode target as discrete integer labels
            le = LabelEncoder()
            y_encoded = le.fit_transform(y.astype(str))

            # Train/Test Split (80/20) with stratification if min_class_count >= 2
            try:
                if min_class_count >= 2 and len(y_encoded) >= 10:
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
                    )
                else:
                    X_train, X_test, y_train, y_test = train_test_split(
                        X, y_encoded, test_size=0.2, random_state=42
                    )
            except Exception:
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y_encoded, test_size=0.2, random_state=42
                )

            # Check if train split has at least 2 classes
            if len(np.unique(y_train)) < 2:
                return {
                    "success": False,
                    "error": "Some target classes contain too few samples for reliable model evaluation. Please select a better target or use a larger dataset.",
                    "metrics": {}
                }

            model_pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('classifier', LogisticRegression(max_iter=1000, random_state=42))
            ])

            model_pipeline.fit(X_train, y_train)
            y_pred = model_pipeline.predict(X_test)

            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
            rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
            f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

            return {
                "success": True,
                "algorithm": "Logistic Regression",
                "problem_type": "classification",
                "metrics": {
                    "accuracy": round(float(acc) * 100, 2),
                    "precision": round(float(prec) * 100, 2),
                    "recall": round(float(rec) * 100, 2),
                    "f1_score": round(float(f1) * 100, 2)
                },
                "primary_score": round(float(f1) * 100, 1),
                "primary_metric_name": "F1 Score",
                "split": f"80% Train ({len(X_train)} rows) / 20% Test ({len(X_test)} rows)"
            }

        else:  # Regression
            # Convert y to float numeric safely
            y_numeric = pd.to_numeric(y, errors='coerce')
            valid_mask = y_numeric.notnull()

            if valid_mask.sum() < 5:
                return {
                    "success": False,
                    "error": f"The selected target column '{target_col}' cannot be converted to numeric values for regression. Switch problem type to Classification or select a numeric target.",
                    "metrics": {}
                }

            X_reg = X[valid_mask]
            y_reg = y_numeric[valid_mask]

            X_train, X_test, y_train, y_test = train_test_split(
                X_reg, y_reg, test_size=0.2, random_state=42
            )

            model_pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('regressor', LinearRegression())
            ])

            model_pipeline.fit(X_train, y_train)
            y_pred = model_pipeline.predict(X_test)

            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))

            # Normalized R^2 score for Trust Score (0 to 100)
            norm_r2 = max(0.0, min(100.0, r2 * 100.0))

            return {
                "success": True,
                "algorithm": "Linear Regression",
                "problem_type": "regression",
                "metrics": {
                    "r2_score": round(float(r2), 4),
                    "r2_pct": round(float(r2) * 100, 2),
                    "mae": round(float(mae), 4),
                    "rmse": round(float(rmse), 4)
                },
                "primary_score": round(float(norm_r2), 1),
                "primary_metric_name": "R² Score",
                "split": f"80% Train ({len(X_train)} rows) / 20% Test ({len(X_test)} rows)"
            }

    except Exception as e:
        return {
            "success": False,
            "error": f"Model evaluation encountered an error: {str(e)}",
            "metrics": {}
        }
