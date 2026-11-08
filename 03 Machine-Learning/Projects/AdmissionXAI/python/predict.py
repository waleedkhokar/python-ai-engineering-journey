"""
predict.py
----------------
Loads BOTH trained models (admission_model.pkl and
program_model.pkl), runs predictions on a CSV of students, and
outputs a JSON array. For each student:

    Always included:
        - student_id, name
        - decision (Selected / Not Selected)
        - confidence (admission confidence, 0.0 – 100.0%)
        - admission_shap_values (why they were/weren't selected)

    Only included if Selected:
        - recommended_program
        - program_confidence
        - program_shap_values (why that specific program)

    Only relevant if Not Selected:
        - needs_email: true  (signals Java to show/send the
          rejection email using admission_shap_values as reasons)

Run with:
    python predict.py ../data/students.csv
"""

import sys
import os
import json
import pandas as pd
import joblib
import shap

ADMISSION_FEATURES = [
    "physics_marks",
    "chemistry_marks",
    "biology_marks",
    "computer_science_marks",
    "math_marks",
    "english_marks",
    "entrance_test_score",
    "extracurriculars",
    "documents_complete",
]

PROGRAM_FEATURES = [
    "physics_marks",
    "chemistry_marks",
    "biology_marks",
    "computer_science_marks",
    "math_marks",
    "english_marks",
]


def get_class1_shap(shap_values):
    """Handles both old (list) and new (array) SHAP output formats
    for a binary classifier, returning contributions toward class 1."""
    if isinstance(shap_values, list):
        return shap_values[1]
    return shap_values[:, :, 1]


def _extract_base_tree_model(model):
    """Extract a tree-based estimator from a CalibratedClassifierCV
    wrapper (needed by SHAP's TreeExplainer). Falls back to the
    model itself if it's already tree-based."""
    if hasattr(model, "calibrated_classifiers_"):
        return model.calibrated_classifiers_[0].estimator
    return model


def main():
    if len(sys.argv) < 2:
        print("Usage: python predict.py <path_to_csv>", file=sys.stderr)
        sys.exit(1)

    csv_path = sys.argv[1]

    # -------------------------------------------------------
    # Dynamic Pathing to Load Models from Script Directory
    # -------------------------------------------------------
    base_dir = os.path.dirname(os.path.abspath(__file__))
    admission_model_path = os.path.join(base_dir, "admission_model.pkl")
    program_model_path = os.path.join(base_dir, "program_model.pkl")

    if not os.path.exists(admission_model_path) or not os.path.exists(program_model_path):
        print(f"Error: Model files missing in directory {base_dir}", file=sys.stderr)
        sys.exit(1)

    admission_model = joblib.load(admission_model_path)
    program_model = joblib.load(program_model_path)

    df = pd.read_csv(csv_path)

    # -------------------------------------------------------
    # STAGE 1: Admission predictions for ALL students
    # -------------------------------------------------------
    X_admission = df[ADMISSION_FEATURES]
    admission_preds = admission_model.predict(X_admission)
    admission_probs = admission_model.predict_proba(X_admission)

    # Extract a tree-based estimator for SHAP (CalibratedClassifierCV
    # wraps the base model; TreeExplainer needs the raw forest).
    admission_base = _extract_base_tree_model(admission_model)
    admission_explainer = shap.TreeExplainer(admission_base)
    admission_shap_raw = admission_explainer.shap_values(X_admission)
    admission_shap = get_class1_shap(admission_shap_raw)

    # -------------------------------------------------------
    # STAGE 2: Program predictions ONLY for selected students
    # -------------------------------------------------------
    X_program = df[PROGRAM_FEATURES]
    program_preds = program_model.predict(X_program)
    program_probs = program_model.predict_proba(X_program)
    program_classes = list(program_model.classes_)

    program_base = _extract_base_tree_model(program_model)
    program_explainer = shap.TreeExplainer(program_base)
    program_shap_raw = program_explainer.shap_values(X_program)

    # -------------------------------------------------------
    # Build combined JSON output
    # -------------------------------------------------------
    results = []
    for i in range(len(df)):
        is_selected = admission_preds[i] == 1
        decision = "Selected" if is_selected else "Not Selected"

        # Confidence as a clean percentage (e.g. 87.3) — avoids
        # rigid 100.0 spikes thanks to the calibrated RF pipeline.
        raw_confidence = float(max(admission_probs[i]))
        admission_confidence = round(raw_confidence * 100, 1)

        admission_shap_dict = {
            feature: round(float(admission_shap[i][j]), 4)
            for j, feature in enumerate(ADMISSION_FEATURES)
        }

        entry = {
            "student_id": str(df.iloc[i]["student_id"]),
            "name": str(df.iloc[i]["name"]),
            "decision": decision,
            "confidence": admission_confidence,
            "admission_shap_values": admission_shap_dict,
        }

        if is_selected:
            predicted_class = program_preds[i]
            class_index = program_classes.index(predicted_class)
            raw_program_conf = float(program_probs[i][class_index])
            program_confidence = round(raw_program_conf * 100, 1)

            if isinstance(program_shap_raw, list):
                class_shap = program_shap_raw[class_index]
            else:
                class_shap = program_shap_raw[:, :, class_index]

            program_shap_dict = {
                feature: round(float(class_shap[i][j]), 4)
                for j, feature in enumerate(PROGRAM_FEATURES)
            }

            entry["recommended_program"] = str(predicted_class)
            entry["program_confidence"] = program_confidence
            entry["program_shap_values"] = program_shap_dict
        else:
            entry["recommended_program"] = None
            entry["needs_email"] = True

        results.append(entry)

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()