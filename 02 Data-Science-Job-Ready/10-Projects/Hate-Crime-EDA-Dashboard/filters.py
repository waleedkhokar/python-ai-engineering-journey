from pathlib import Path
from typing import List, Tuple

import numpy as np
import pandas as pd

DATA_FILE = Path("data/hate_crime.csv")
CLEANED_FILE = Path("data/hate_crime_cleaned.csv")
REPORT_FILE = Path("data/cleaning_report.txt")

TARGET_COL = "avg_hatecrimes_per_100k_fbi"
INCOME_COL = "median_household_income"
STATE_COL = "state"


def add_engineered_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    if INCOME_COL in df.columns:
        try:
            df["income_group"] = pd.qcut(
                df[INCOME_COL],
                q=3,
                labels=["Low Income", "Middle Income", "High Income"],
                duplicates="drop",
            ).astype(str)
        except Exception:
            df["income_group"] = "Income Group"

    if TARGET_COL in df.columns:
        try:
            df["hate_crime_level"] = pd.qcut(
                df[TARGET_COL],
                q=3,
                labels=["Low", "Medium", "High"],
                duplicates="drop",
            ).astype(str)
        except Exception:
            df["hate_crime_level"] = "Level"

    df["sequence"] = np.arange(1, len(df) + 1)
    return df


def load_and_clean_data(path: Path = DATA_FILE) -> Tuple[pd.DataFrame, pd.DataFrame, str]:
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found at {path}. Keep exact file name: data/hate_crime.csv"
        )

    raw_df = pd.read_csv(path)
    df = raw_df.copy()

    rows_before, cols_before = df.shape
    missing_before = int(df.isna().sum().sum())
    duplicates_before = int(df.duplicated().sum())

    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
        .str.replace("-", "_", regex=False)
    )

    text_cols = df.select_dtypes(include=["object", "string"]).columns

    for col in text_cols:
        df[col] = df[col].astype(str).str.strip()
        df[col] = df[col].replace({"nan": np.nan, "None": np.nan, "": np.nan})

        if col == STATE_COL:
            df[col] = df[col].str.title()

    df = df.drop_duplicates()

    for col in df.columns:
        if col != STATE_COL:
            try:
                df[col] = pd.to_numeric(df[col], errors="raise")
            except Exception:
                pass

    numeric_cols = df.select_dtypes(include=["number"]).columns

    for col in numeric_cols:
        median_value = df[col].median()
        df[col] = df[col].fillna(median_value)
        df[col] = df[col].apply(
            lambda x: 0 if pd.notna(x) and x < 0 else x
        )

    text_cols = df.select_dtypes(include=["object", "string"]).columns

    for col in text_cols:
        if df[col].isna().sum() > 0:
            mode_value = df[col].mode(dropna=True)
            fill_value = mode_value.iloc[0] if not mode_value.empty else "Unknown"
            df[col] = df[col].fillna(fill_value)

    df = add_engineered_features(df)

    rows_after, cols_after = df.shape
    missing_after = int(df.isna().sum().sum())
    duplicates_after = int(df.duplicated().sum())

    CLEANED_FILE.parent.mkdir(exist_ok=True)
    df.to_csv(CLEANED_FILE, index=False)

    report = f"""
DATA CLEANING REPORT
====================

Dataset file used exactly as required: data/hate_crime.csv

Rows before cleaning: {rows_before}
Rows after cleaning: {rows_after}

Columns before cleaning: {cols_before}
Columns after cleaning: {cols_after}

Missing values before cleaning: {missing_before}
Missing values after cleaning: {missing_after}

Duplicate rows before cleaning: {duplicates_before}
Duplicate rows after cleaning: {duplicates_after}

Cleaning and preprocessing steps:
1. Loaded the raw, uncleaned CSV dataset.
2. Standardized column names for coding consistency.
3. Cleaned text values and state names.
4. Removed duplicate rows.
5. Converted numeric-looking columns where possible.
6. Filled missing numeric values with the median.
7. Filled missing text values with the mode.
8. Replaced invalid negative numeric values with 0.
9. Added engineered features: income_group, hate_crime_level, and sequence.
10. Saved cleaned data as data/hate_crime_cleaned.csv.
""".strip()

    REPORT_FILE.write_text(report, encoding="utf-8")

    return raw_df, df, report


def apply_filters(
    df: pd.DataFrame,
    selected_states: List[str],
    income_groups: List[str],
    min_income: float,
    max_income: float,
    min_hate: float,
    max_hate: float,
    search_text: str,
) -> pd.DataFrame:
    filtered = df.copy()

    if selected_states:
        filtered = filtered[filtered[STATE_COL].isin(selected_states)]

    if income_groups and "income_group" in filtered.columns:
        filtered = filtered[filtered["income_group"].isin(income_groups)]

    filtered = filtered[
        (filtered[INCOME_COL] >= min_income)
        & (filtered[INCOME_COL] <= max_income)
        & (filtered[TARGET_COL] >= min_hate)
        & (filtered[TARGET_COL] <= max_hate)
    ]

    if search_text and search_text.strip():
        query = search_text.strip().lower()
        filtered = filtered[
            filtered.astype(str).apply(
                lambda row: row.str.lower().str.contains(query, na=False).any(),
                axis=1,
            )
        ]

    return filtered.reset_index(drop=True)


def get_summary(filtered: pd.DataFrame) -> dict:
    if filtered.empty:
        return {
            "total_records": 0,
            "total_states": 0,
            "avg_hate": 0,
            "max_hate": 0,
            "min_hate": 0,
            "avg_income": 0,
        }

    return {
        "total_records": int(len(filtered)),
        "total_states": int(filtered[STATE_COL].nunique()),
        "avg_hate": round(float(filtered[TARGET_COL].mean()), 3),
        "max_hate": round(float(filtered[TARGET_COL].max()), 3),
        "min_hate": round(float(filtered[TARGET_COL].min()), 3),
        "avg_income": round(float(filtered[INCOME_COL].mean()), 2),
    }


def save_filtered_csv(filtered: pd.DataFrame) -> str:
    output = Path("data/filtered_dashboard_data.csv")
    output.parent.mkdir(exist_ok=True)
    filtered.to_csv(output, index=False)
    return str(output)