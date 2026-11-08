"""
train_program_model.py
----------------
Trains a calibrated Random Forest Classifier to recommend a program
(B.Tech/CSE, Medical, BSc, Arts) for students who were Selected,
based on their subject marks.

The pipeline:
  1. RandomForestClassifier (100 trees, max_depth=6) — averages
     probabilities across trees to avoid single-tree 0%/100% spikes.
  2. CalibratedClassifierCV (cv=3) — further smooths and calibrates
     the probability outputs for realistic confidence scores.

This is a separate model from admission screening on purpose:
mixing "why selected" and "why this program" into one model would
blur the SHAP explanations and make them harder to interpret
individually.

Run with:
    python train_program_model.py
"""

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import shap
import joblib

# ---------------------------------------------------------
# 1. Load the dataset and keep only Selected students
#    Program recommendation only makes sense for admitted
#    students, so Not Selected rows are dropped here.
# ---------------------------------------------------------
import os
base_dir = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(base_dir, "..", "data", "students.csv")
df = pd.read_csv(DATA_PATH)
df_selected = df[df["selected"] == 1].reset_index(drop=True)

print(f"Loaded {len(df)} total students, {len(df_selected)} were selected.")

# ---------------------------------------------------------
# 2. Prepare features (X) and target (y)
#    Only subject marks matter here — entrance_test_score and
#    documents_complete already did their job in Model 1.
# ---------------------------------------------------------
feature_columns = [
    "physics_marks",
    "chemistry_marks",
    "biology_marks",
    "computer_science_marks",
    "math_marks",
    "english_marks",
]

X = df_selected[feature_columns]
y = df_selected["recommended_program"]

print("Program distribution among selected students:")
print(y.value_counts())

# ---------------------------------------------------------
# 3. Split into training and testing sets
# ---------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------------------------------------
# 4. Train the Random Forest model with calibration
#    This is a MULTI-CLASS problem (4 possible programs).
#    RandomForest handles that automatically and averages
#    probabilities across 100 trees. CalibratedClassifierCV
#    adds calibration on top for well-calibrated outputs.
# ---------------------------------------------------------
base_model = RandomForestClassifier(
    n_estimators=100, max_depth=6, random_state=42
)
model = CalibratedClassifierCV(base_model, cv=3)
model.fit(X_train, y_train)

# ---------------------------------------------------------
# 5. Evaluate accuracy on the held-out test set
# ---------------------------------------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nProgram model accuracy on test data: {accuracy * 100:.2f}%")

from sklearn.metrics import classification_report
print("\nPer-class performance:")
print(classification_report(y_test, y_pred))

# ---------------------------------------------------------
# 6. Save the trained model to disk
# ---------------------------------------------------------
joblib.dump(model, "program_model.pkl")
print("Model saved as program_model.pkl")

# ---------------------------------------------------------
# 7. Use SHAP to explain feature importance PER CLASS
#    Unlike Model 1 (binary), this model has 4 output classes,
#    so SHAP gives us one importance value per feature per class
#    (e.g. "computer_science_marks matters a lot for B.Tech/CSE
#    but not for Arts").
#    CalibratedClassifierCV wraps the base estimators, so we
#    extract one of the underlying calibrated RandomForests
#    for SHAP (TreeExplainer requires a tree-based model).
# ---------------------------------------------------------
base_rf = model.calibrated_classifiers_[0].estimator
explainer = shap.TreeExplainer(base_rf)
shap_values = explainer.shap_values(X_test)

class_names = base_rf.classes_  # e.g. ['Arts' 'B.Tech/CSE' 'BSc' 'Medical']

print("\nFeature importance (mean absolute SHAP value) per program:")
for class_index, class_name in enumerate(class_names):
    if isinstance(shap_values, list):
        class_shap = shap_values[class_index]
    else:
        class_shap = shap_values[:, :, class_index]

    importance = pd.DataFrame({
        "feature": feature_columns,
        "mean_abs_shap_value": abs(class_shap).mean(axis=0)
    }).sort_values(by="mean_abs_shap_value", ascending=False)

    print(f"\n--- {class_name} ---")
    print(importance.to_string(index=False))