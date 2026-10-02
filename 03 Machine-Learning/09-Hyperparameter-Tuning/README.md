# 🎯 09 — Hyperparameter Tuning

**Date:** 19 January 2026
**Folder:** `09-Hyperparameter-Tuning`

---

## 🎯 Overview

Machine learning models have settings that control **how they learn**. These settings are called **hyperparameters**.

**Hyperparameter tuning** is the process of finding hyperparameter values that produce better model performance on validation data.

Examples:

```text
Random Forest
├── n_estimators
├── max_depth
├── min_samples_split
└── max_features

XGBoost
├── learning_rate
├── n_estimators
├── max_depth
└── subsample
```

---

# 1. Parameters vs Hyperparameters

This distinction is important.

### Parameters

Parameters are **learned by the model during training**.

For Linear Regression:

$$
y = wx + b
$$

`w` and `b` are learned from the training data.

### Hyperparameters

Hyperparameters are **set before training**.

Example:

```python
RandomForestClassifier(
    n_estimators=200,
    max_depth=10
)
```

Here:

* `n_estimators` → hyperparameter
* `max_depth` → hyperparameter
* Tree weights/splits → learned parameters

---

# 2. Why Tune Hyperparameters?

Default settings don't necessarily work well for every dataset.

For example:

```text
max_depth = 2
```

may make a tree too simple → **underfitting**

while:

```text
max_depth = 50
```

may make it too complex → **overfitting**

The goal is to find a configuration that generalizes well to unseen data.

---

# 3. Grid Search

**GridSearchCV** tests every combination from a predefined set of values.

Example:

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(random_state=42)

param_grid = {
    "n_estimators": [100, 200],
    "max_depth": [5, 10, 20]
}

grid = GridSearchCV(
    model,
    param_grid,
    cv=5,
    scoring="f1"
)

grid.fit(X_train, y_train)

print(grid.best_params_)
print(grid.best_score_)
```

The combinations are:

```text
100, 5
100, 10
100, 20
200, 5
200, 10
200, 20
```

With `cv=5`, each configuration is evaluated across 5 folds.

### Advantages

* Simple
* Exhaustive within the specified grid
* Easy to understand

### Disadvantage

Can become expensive when there are many hyperparameters and values.

---

# 4. Randomized Search

**RandomizedSearchCV** randomly samples combinations instead of testing every possible combination.

```python
from sklearn.model_selection import RandomizedSearchCV

search = RandomizedSearchCV(
    model,
    param_distributions=param_grid,
    n_iter=10,
    cv=5,
    scoring="f1",
    random_state=42
)

search.fit(X_train, y_train)

print(search.best_params_)
```

### Grid vs Random

| GridSearchCV                 | RandomizedSearchCV           |
| ---------------------------- | ---------------------------- |
| Tests every combination      | Tests random combinations    |
| Can be expensive             | Usually faster               |
| Good for small search spaces | Good for large search spaces |
| Exhaustive                   | Sample-based                 |

If you have a huge search space, randomized search can explore it more efficiently.

---

# 5. Optuna

**Optuna** is a modern hyperparameter optimization framework.

Instead of manually defining every combination, Optuna uses optimization algorithms to intelligently search the hyperparameter space.

Example:

```python
import optuna

def objective(trial):

    max_depth = trial.suggest_int(
        "max_depth", 3, 15
    )

    learning_rate = trial.suggest_float(
        "learning_rate", 0.01, 0.3,
        log=True
    )

    model = XGBClassifier(
        max_depth=max_depth,
        learning_rate=learning_rate
    )

    model.fit(X_train, y_train)

    return model.score(X_valid, y_valid)


study = optuna.create_study(
    direction="maximize"
)

study.optimize(objective, n_trials=30)

print(study.best_params)
```

Optuna can explore the search space more intelligently than simply testing every combination.

---

# 6. Bayesian Optimization

**Bayesian Optimization** chooses the next hyperparameters based on results from previous experiments.

Instead of:

```text
Try → Try → Try → Try
```

it learns from previous trials:

```text
Trial 1 → Result
           ↓
      Search model
           ↓
Trial 2 → Better region
           ↓
      Search model
           ↓
Trial 3 → Better region
```

The objective is to reach good configurations with **fewer expensive experiments**.

It is particularly useful when model training is expensive.

---

# 7. Important Hyperparameters

### Random Forest

```text
n_estimators
max_depth
min_samples_split
min_samples_leaf
max_features
```

### XGBoost

```text
n_estimators
learning_rate
max_depth
subsample
colsample_bytree
```

### SVM

```text
C
kernel
gamma
```

### KNN

```text
n_neighbors
weights
metric
```

### Logistic Regression

```text
C
penalty
solver
```

---

# 8. Tuning with the Correct Evaluation Strategy

Don't tune against the test set.

Correct:

```text
Dataset
   ↓
Train + Test Split
   ↓
Hyperparameter Search
   ↓
Cross-Validation on Training Data
   ↓
Best Model
   ↓
Final Test Evaluation
```

The test set should remain untouched until the final evaluation.

Otherwise, repeated tuning against the test set can cause **overfitting to the test data**.

---

# 9. Pipeline + Hyperparameter Tuning

Preprocessing should be included in the pipeline.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

params = {
    "model__C": [0.01, 0.1, 1, 10]
}

search = GridSearchCV(
    pipeline,
    params,
    cv=5,
    scoring="f1"
)

search.fit(X_train, y_train)
```

Notice:

```text
model__C
```

means the `C` hyperparameter belongs to the pipeline step named `model`.

This approach also helps prevent **data leakage** during cross-validation.

---

# 10. Choosing a Scoring Metric

Don't always optimize for accuracy.

| Problem                   | Possible metric |
| ------------------------- | --------------- |
| Balanced classification   | Accuracy        |
| Imbalanced classification | F1 / PR-AUC     |
| Avoid false positives     | Precision       |
| Avoid false negatives     | Recall          |
| Regression                | RMSE / MAE / R² |

The optimization metric should match the actual problem.

---

# 🔬 Practical Workflow

```text
Choose Model
     ↓
Identify Important Hyperparameters
     ↓
Define Search Space
     ↓
Choose Metric
     ↓
Choose Cross-Validation
     ↓
Grid / Random / Optuna
     ↓
Find Best Configuration
     ↓
Train Best Model
     ↓
Evaluate Once on Test Set
```

---

# 🧪 Practice

1. Train a Random Forest classifier.
2. Tune `n_estimators` and `max_depth` using `GridSearchCV`.
3. Repeat using `RandomizedSearchCV`.
4. Compare the best scores.
5. Tune an XGBoost model.
6. Experiment with Optuna.
7. Use a Pipeline during tuning.
8. Try different scoring metrics.
9. Explain why the test set should not be used during hyperparameter search.

---

# 🎤 Interview Questions

1. What is hyperparameter tuning?
2. Parameters vs hyperparameters?
3. How does GridSearchCV work?
4. Grid Search vs Randomized Search?
5. When would you use RandomizedSearchCV?
6. What is Optuna?
7. What is Bayesian Optimization?
8. Why use cross-validation during hyperparameter tuning?
9. Why shouldn't you tune using the test set?
10. What is the difference between model selection and hyperparameter tuning?
11. How do you choose the scoring metric?
12. How can hyperparameter tuning cause overfitting?

---

# ✅ Key Takeaways

* **Hyperparameters** are settings chosen before/during model training rather than learned as model parameters.
* **GridSearchCV** exhaustively searches a defined grid.
* **RandomizedSearchCV** samples combinations from a search space.
* **Optuna** provides intelligent automated optimization.
* **Bayesian Optimization** uses previous trial results to guide future trials.
* Use **cross-validation** during tuning.
* Use a **Pipeline** to keep preprocessing inside the CV process.
* Choose a scoring metric that matches the business/problem objective.
* Keep the **test set untouched** until final evaluation.

---

### ➡️ Next

**10 — Feature Selection** → Filter methods, RFE, embedded methods, Lasso, tree importance, and VarianceThreshold.
