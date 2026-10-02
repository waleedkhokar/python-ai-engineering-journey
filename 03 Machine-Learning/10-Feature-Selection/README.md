# 🎯 10 — Feature Selection

**Date:** 20 January 2026
**Folder:** `10-Feature-Selection`

---

## 🎯 Overview

A dataset can contain many features, but **not every feature is useful** for prediction.

**Feature Selection** is the process of choosing the most relevant features while removing unnecessary, redundant, or noisy ones.

Example:

```text
100 Features
     ↓
Feature Selection
     ↓
25 Useful Features
     ↓
Model
```

Feature selection can:

* Reduce model complexity
* Improve training speed
* Reduce overfitting
* Remove noise
* Improve interpretability
* Reduce unnecessary data collection

> **Feature Selection ≠ Dimensionality Reduction**
> Feature selection keeps the original features, while methods such as PCA create new transformed features.

---

# 1. Why Feature Selection Matters

Suppose you're predicting house prices:

```text
Useful:
✓ Area
✓ Location
✓ Bedrooms
✓ Bathrooms

Potentially unnecessary:
✗ Random ID
✗ Duplicate information
✗ Constant column
✗ Unrelated text field
```

Including irrelevant features can make the model learn patterns that don't generalize.

A good workflow is:

```text
Raw Features
     ↓
Remove Obviously Bad Features
     ↓
Feature Selection
     ↓
Train Model
     ↓
Evaluate
```

---

# 2. Filter Methods

**Filter methods** select features using statistical properties of the data, usually **before training a model**.

They are generally fast and model-independent.

### Common methods

* Correlation
* Chi-square
* VarianceThreshold

---

## Correlation

Correlation measures the relationship between numerical variables.

A correlation close to:

```text
+1 → Strong positive relationship
 0 → Little/no linear relationship
-1 → Strong negative relationship
```

Example:

```python
import pandas as pd

correlation = df.corr(numeric_only=True)

print(correlation)
```

If two features are highly correlated, they may contain redundant information.

For example:

```text
house_area_m2
house_area_sqft
```

Both represent almost the same information.

You may keep one rather than both.

> High correlation does **not automatically mean one feature must be removed**. Domain knowledge and model behavior also matter.

---

# 3. Chi-Square Test

The **chi-square test** can be used for feature selection when:

* Features are categorical/non-negative
* Target is categorical

It checks whether a feature and target have a statistically meaningful association.

Scikit-learn:

```python
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import chi2

selector = SelectKBest(
    score_func=chi2,
    k=5
)

X_selected = selector.fit_transform(X, y)
```

For text classification, chi-square can help select informative terms/features.

---

# 4. VarianceThreshold

A feature with almost no variation often provides little information.

Example:

```text
Feature A:
1, 1, 1, 1, 1, 1
```

There is no useful variation.

Scikit-learn provides:

```python
from sklearn.feature_selection import VarianceThreshold

selector = VarianceThreshold(
    threshold=0.01
)

X_selected = selector.fit_transform(X)
```

This removes features whose variance is below the chosen threshold.

---

# 5. Wrapper Methods

Wrapper methods evaluate **subsets of features by actually training a model**.

One important technique is:

### RFE — Recursive Feature Elimination

RFE repeatedly:

1. Trains a model
2. Measures feature importance
3. Removes the least important features
4. Repeats

```text
All Features
     ↓
Train Model
     ↓
Remove Weakest
     ↓
Train Again
     ↓
Remove Weakest
     ↓
Best Feature Subset
```

Example:

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)

selector = RFE(
    estimator=model,
    n_features_to_select=5
)

X_selected = selector.fit_transform(X, y)
```

### Advantages

* Uses actual model performance
* Can produce useful feature subsets

### Disadvantages

* Computationally expensive
* Requires repeatedly training models

---

# 6. Embedded Methods

Embedded methods perform feature selection **during model training**.

Common examples:

* Lasso
* Decision Trees
* Random Forest
* Gradient Boosting

---

## Lasso Feature Selection

Lasso uses **L1 regularization**.

Its objective includes:

$$
Loss + \lambda \sum |w_i|
$$

The L1 penalty can force some coefficients to exactly **zero**.

Example:

```text
Feature       Coefficient
Area              0.82
Bedrooms          0.35
Age              -0.12
Noise              0
Random_ID          0
```

Features with coefficient `0` can effectively be removed.

```python
from sklearn.linear_model import Lasso

model = Lasso(alpha=0.1)

model.fit(X, y)

print(model.coef_)
```

---

# 7. Tree-Based Feature Importance

Tree-based models can estimate feature importance.

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    random_state=42
)

model.fit(X, y)

importance = model.feature_importances_

print(importance)
```

Example:

| Feature    | Importance |
| ---------- | ---------: |
| Age        |       0.31 |
| Income     |       0.27 |
| Experience |       0.22 |
| City       |       0.15 |
| ID         |       0.05 |

You can investigate whether low-importance features should be removed.

> Feature importance is useful evidence, but it is not automatically proof that a feature should be deleted.

---

# 8. Filter vs Wrapper vs Embedded

| Method   | Model Required? | Speed  | Example                 |
| -------- | --------------- | ------ | ----------------------- |
| Filter   | No              | Fast   | Correlation, Chi-square |
| Wrapper  | Yes             | Slow   | RFE                     |
| Embedded | Yes             | Medium | Lasso, Trees            |

### Easy way to remember

```text
Filter
→ Select before model

Wrapper
→ Model evaluates feature subsets

Embedded
→ Model selects while learning
```

---

# 9. Feature Selection + Cross-Validation

Feature selection can cause **data leakage** if performed using the entire dataset before cross-validation.

Bad:

```text
Entire Dataset
      ↓
Feature Selection
      ↓
Cross-Validation
```

Better:

```text
Training Data
      ↓
Cross-Validation
      ↓
Feature Selection inside each fold
      ↓
Model Training
```

A Pipeline is useful:

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("selection", SelectKBest(f_classif, k=10)),
    ("model", LogisticRegression(max_iter=1000))
])
```

This ensures feature selection is learned within the training process.

---

# 🧪 Practical Workflow

```text
Dataset
   ↓
Remove IDs / Constant / Obviously Irrelevant Features
   ↓
Check Correlation
   ↓
Apply Filter / Wrapper / Embedded Method
   ↓
Cross-Validation
   ↓
Compare Performance
   ↓
Keep Useful Features
   ↓
Final Model
```

Don't assume that **fewer features automatically means a better model**. Compare performance using proper validation.

---

# 🧪 Practice

1. Calculate feature correlations.
2. Remove a constant feature using `VarianceThreshold`.
3. Use `SelectKBest`.
4. Apply chi-square feature selection to a classification dataset.
5. Apply RFE with Logistic Regression.
6. Use Lasso to identify zero-coefficient features.
7. Extract Random Forest feature importance.
8. Compare model performance before and after feature selection.
9. Put feature selection inside a Pipeline.
10. Explain how feature selection can cause data leakage.

---

# 🎤 Interview Questions

1. What is feature selection?
2. Feature selection vs dimensionality reduction?
3. What are filter methods?
4. How does correlation help with feature selection?
5. What is the chi-square test used for?
6. What is VarianceThreshold?
7. What is RFE?
8. Filter vs wrapper vs embedded methods?
9. How does Lasso perform feature selection?
10. How do tree models provide feature importance?
11. Can feature selection cause data leakage?
12. Why should feature selection be performed inside cross-validation?

---

# ✅ Key Takeaways

* **Feature selection** keeps useful original features and removes unnecessary ones.
* **Filter methods** → correlation, chi-square, VarianceThreshold.
* **Wrapper methods** → RFE and model-based subset evaluation.
* **Embedded methods** → Lasso and tree-based importance.
* **Lasso** can drive unnecessary coefficients toward zero.
* **Tree models** can provide feature importance.
* Feature selection can improve speed, interpretability, and sometimes generalization.
* Always validate whether removing features actually improves the model.
* Use **Pipeline + Cross-Validation** to avoid data leakage.

---

### ➡️ Next

**11 — Time Series** → ARIMA, SARIMA, Prophet, LSTM basics, and forecasting.
