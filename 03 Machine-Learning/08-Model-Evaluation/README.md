# 📊 08 — Model Evaluation

**Date:** 17 January 2026
**Folder:** `08-Model-Evaluation`

---

## 🎯 Overview

A machine learning model is not useful just because it can make predictions. We need to know **how well it performs on unseen data**.

**Model Evaluation** is the process of measuring a model's performance using appropriate metrics and validation techniques.

This module covers:

* Confusion Matrix
* ROC Curve and AUC
* Precision-Recall Curve
* Cross-Validation
* Learning Curves
* Choosing the right evaluation method

---

# 1. Confusion Matrix

A **confusion matrix** evaluates classification predictions by comparing actual and predicted classes.

|                     | Predicted Positive | Predicted Negative |
| ------------------- | -----------------: | -----------------: |
| **Actual Positive** |                 TP |                 FN |
| **Actual Negative** |                 FP |                 TN |

### Terms

* **TP — True Positive:** Correctly predicted positive
* **TN — True Negative:** Correctly predicted negative
* **FP — False Positive:** Predicted positive but actually negative
* **FN — False Negative:** Predicted negative but actually positive

### Example

For a spam detector:

* TP → Spam correctly detected
* TN → Normal message correctly detected
* FP → Normal message incorrectly marked spam
* FN → Spam incorrectly classified as normal

---

# 2. Classification Metrics

### Accuracy

Percentage of all predictions that are correct.

$$
Accuracy = \frac{TP + TN}{TP + TN + FP + FN}
$$

Good when classes are reasonably balanced.

### Precision

Of everything predicted positive, how many were actually positive?

$$
Precision = \frac{TP}{TP + FP}
$$

Useful when **false positives are expensive**.

### Recall

Of all actual positives, how many did the model detect?

$$
Recall = \frac{TP}{TP + FN}
$$

Useful when **false negatives are expensive**.

### F1 Score

Harmonic mean of precision and recall.

$$
F1 = 2 \times \frac{Precision \times Recall}{Precision + Recall}
$$

Useful when you want a balance between precision and recall.

---

# 3. ROC Curve

**ROC = Receiver Operating Characteristic**

The ROC curve evaluates a binary classifier across different classification thresholds.

It plots:

* **True Positive Rate (TPR)** → Recall
* **False Positive Rate (FPR)**

$$
TPR = \frac{TP}{TP + FN}
$$

$$
FPR = \frac{FP}{FP + TN}
$$

A model's threshold can change the balance between detecting positives and generating false positives.

---

# 4. AUC

**AUC = Area Under the ROC Curve**

AUC summarizes the ROC curve into a value between 0 and 1.

|   AUC | General interpretation |
| ----: | ---------------------- |
|   1.0 | Perfect separation     |
|   0.9 | Very strong separation |
|   0.7 | Moderate               |
|   0.5 | Approximately random   |
| < 0.5 | Worse than random      |

AUC measures how well the model **ranks positive examples above negative examples**.

---

# 5. Precision-Recall Curve

The **Precision-Recall (PR) curve** plots:

* Precision
* Recall

at different classification thresholds.

PR curves are particularly useful when the dataset is **highly imbalanced**.

### Example

Suppose:

```text
100,000 transactions
99,000 legitimate
1,000 fraudulent
```

A model predicting every transaction as legitimate gets:

```text
Accuracy = 99%
```

That sounds good, but it detects **zero fraud**.

Precision, recall, F1, and the PR curve can provide a much more useful picture.

---

# 6. ROC vs Precision-Recall

| Situation                        | Useful evaluation |
| -------------------------------- | ----------------- |
| Balanced classification          | ROC-AUC           |
| Highly imbalanced classification | Precision-Recall  |
| False positives important        | Precision         |
| False negatives important        | Recall            |
| Need balance                     | F1                |
| Overall correctness              | Accuracy          |

Don't blindly use accuracy for every classification problem.

---

# 7. Cross-Validation

A single train/test split can produce a misleading result depending on which samples happen to be selected.

**Cross-validation** repeatedly divides the training data into training and validation portions.

### K-Fold Cross-Validation

Example with `K = 5`:

```text
Fold 1 → Validation
Fold 2 → Validation
Fold 3 → Validation
Fold 4 → Validation
Fold 5 → Validation
```

Each fold becomes the validation set once.

The final score is usually the **average of all folds**.

### Common Strategies

| Strategy          | Use                       |
| ----------------- | ------------------------- |
| K-Fold            | General datasets          |
| Stratified K-Fold | Classification            |
| Leave-One-Out     | Very small datasets       |
| Time Series Split | Time-dependent data       |
| Group K-Fold      | Grouped/dependent samples |

### Scikit-learn

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model,
    X,
    y,
    cv=5,
    scoring="accuracy"
)

print(scores)
print(scores.mean())
```

---

# 8. Learning Curves

A **learning curve** shows model performance as the amount of training data increases.

Usually we compare:

```text
Training Score
Validation Score
```

against:

```text
Training Set Size
```

### Diagnosing Problems

**High training score + low validation score**

→ Likely **overfitting**

**Both training and validation scores are low**

→ Likely **underfitting**

**Both scores become high and close**

→ Better generalization

Learning curves help determine whether collecting more training data might help.

---

# 9. Avoid Data Leakage

Evaluation must represent how the model will behave on **unseen real-world data**.

Never allow information from the validation/test set to influence model training.

For example, don't scale the complete dataset before splitting:

```python
scaler.fit_transform(X)  # ❌
```

Instead:

```python
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
```

Better:

```python
from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

The pipeline keeps preprocessing inside the evaluation process.

---

# 10. Practical Evaluation Workflow

```text
Raw Dataset
     ↓
Train / Test Split
     ↓
Cross-Validation on Training Data
     ↓
Train Model
     ↓
Tune / Select Model
     ↓
Evaluate on Test Set
     ↓
Confusion Matrix / Metrics
     ↓
ROC-AUC / PR Curve
     ↓
Learning Curve
     ↓
Final Model
```

The **test set should normally be kept untouched until final evaluation**.

---

# 🧪 Practice

1. Create a classification model using a scikit-learn dataset.
2. Generate a confusion matrix.
3. Calculate accuracy, precision, recall and F1.
4. Plot an ROC curve and calculate ROC-AUC.
5. Plot a Precision-Recall curve.
6. Compare 5-fold and Stratified K-Fold cross-validation.
7. Generate a learning curve.
8. Create an imbalanced classification example and explain why accuracy can be misleading.
9. Identify whether a model is overfitting or underfitting from its learning curve.

---

# 🎤 Interview Questions

1. What is a confusion matrix?
2. What is the difference between precision and recall?
3. When would you prioritize recall over precision?
4. What is ROC-AUC?
5. ROC-AUC vs Precision-Recall — when would you use each?
6. Why can accuracy be misleading for imbalanced datasets?
7. What is cross-validation?
8. Why is Stratified K-Fold useful for classification?
9. What is a learning curve?
10. How can you identify overfitting using a learning curve?
11. What is data leakage?
12. Why should the test set remain untouched until final evaluation?

---

# ✅ Key Takeaways

* **Confusion Matrix** → Understand TP, TN, FP and FN.
* **Precision** → How reliable positive predictions are.
* **Recall** → How many actual positives were found.
* **F1** → Balance between precision and recall.
* **ROC-AUC** → Measures ranking/separation performance across thresholds.
* **PR Curve** → Especially useful for imbalanced classification.
* **Cross-Validation** → Gives a more reliable estimate of model performance.
* **Learning Curves** → Help diagnose underfitting and overfitting.
* **Data Leakage** → Can make evaluation look unrealistically good.
* Always evaluate models on **unseen data**.

---

### ➡️ Next

**09 — Hyperparameter Tuning** → GridSearchCV, RandomizedSearchCV, Optuna and Bayesian Optimization.
