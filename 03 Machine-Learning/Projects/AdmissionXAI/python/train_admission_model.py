"""
train_admission_model.py
----------------
Trains a calibrated Random Forest Classifier to predict whether a
student is Selected or Not Selected, based on subject marks,
entrance test score, extracurriculars, and document completeness.

The pipeline:
  1. RandomForestClassifier (100 trees, max_depth=6) — averages
     probabilities across trees to avoid single-tree 0%/100% spikes.
  2. CalibratedClassifierCV (cv=3) — further smooths and calibrates
     the probability outputs for realistic confidence scores.

Run with:
    python train_admission_model.py
"""

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import shap
import joblib

# ---------------------------------------------------------
# 1. Load the dataset
# ---------------------------------------------------------
DATA_PATH = "../data/students.csv"
df = pd.read_csv(DATA_PATH)

print(f"Loaded {len(df)} student records.")

# ---------------------------------------------------------
# 2. Prepare features (X) and target (y)
#    Features: all 6 subject marks + entrance test + extracurriculars
#    + documents_complete. We exclude student_id, name (identifiers),
#    selected (the target), and recommended_program (that's Model 2's
#    target, not relevant here).
# ---------------------------------------------------------
feature_columns = [
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

X = df[feature_columns]
y = df["selected"]

# ---------------------------------------------------------
# 3. Split into training and testing sets
# ---------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------------------------------------
# 4. Train the Random Forest model with calibration
#    RandomForest already smooths probabilities by averaging
#    across 100 trees. CalibratedClassifierCV adds Platt
#    scaling / isotonic regression on top for well-calibrated
#    confidence scores that avoid rigid 100% or 0% outputs.
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
print(f"Model accuracy on test data: {accuracy * 100:.2f}%")

# ---------------------------------------------------------
# 6. Save the trained model to disk
# ---------------------------------------------------------
joblib.dump(model, "admission_model.pkl")
print("Model saved as admission_model.pkl")

# ---------------------------------------------------------
# 7. Use SHAP to explain the model's overall behavior
#    CalibratedClassifierCV wraps the base estimators, so we
#    extract one of the underlying calibrated RandomForests
#    for SHAP (TreeExplainer requires a tree-based model).
# ---------------------------------------------------------
# Extract a base RandomForest from the calibrated pipeline
base_rf = model.calibrated_classifiers_[0].estimator
explainer = shap.TreeExplainer(base_rf)
shap_values = explainer.shap_values(X_test)

if isinstance(shap_values, list):
    class1_shap_values = shap_values[1]
else:
    class1_shap_values = shap_values[:, :, 1]

mean_abs_shap = pd.DataFrame({
    "feature": feature_columns,
    "mean_abs_shap_value": abs(class1_shap_values).mean(axis=0)
}).sort_values(by="mean_abs_shap_value", ascending=False)

print("\nFeature importance (mean absolute SHAP value):")
print(mean_abs_shap.to_string(index=False))