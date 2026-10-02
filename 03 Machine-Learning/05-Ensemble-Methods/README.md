# 🌲 05 — Ensemble Methods

**Date:** 11 January 2026
**Level:** Intermediate
**Goal:** Learn how combining multiple models can produce stronger and more robust predictions than relying on a single model.

---

## 📌 1. What are Ensemble Methods?

**Ensemble Learning** combines predictions from multiple models to create a final prediction.

Instead of:

```text
Data → One Model → Prediction
```

we use:

```text
             ┌→ Model 1 ─┐
Data ────────┼→ Model 2 ─┼→ Combine → Final Prediction
             ├→ Model 3 ─┤
             └→ Model 4 ─┘
```

The individual models are often called **base learners**.

The main idea:

> Several models can work together to reduce errors and improve generalization.

---

# 🧩 2. Main Ensemble Strategies

The major approaches are:

| Method       | Main Idea                                       |
| ------------ | ----------------------------------------------- |
| **Bagging**  | Train models independently on different samples |
| **Boosting** | Train models sequentially to correct errors     |
| **Voting**   | Combine predictions from different models       |
| **Stacking** | Use another model to combine model predictions  |

---

# 🌳 3. Random Forest

**Random Forest** is a bagging-based ensemble of Decision Trees.

Instead of creating one tree:

```text
Data → Decision Tree → Prediction
```

we create many trees:

```text
              ┌→ Tree 1 ─┐
Data ─────────┼→ Tree 2 ─┼→ Vote/Average → Prediction
              ├→ Tree 3 ─┤
              └→ Tree N ─┘
```

Each tree gets a random sample of training data and considers random subsets of features.

### Classification

Trees vote:

```text
Tree 1 → Cat
Tree 2 → Dog
Tree 3 → Dog
Tree 4 → Dog

Final → Dog
```

### Regression

Predictions are generally averaged.

```python id="s9g7hd"
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    random_state=42
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Important parameters:

* `n_estimators` → number of trees
* `max_depth` → maximum tree depth
* `max_features` → features considered at each split
* `min_samples_split`
* `min_samples_leaf`

---

# 🚀 4. Gradient Boosting

Boosting works differently from Random Forest.

Instead of building independent trees, models are built **sequentially**.

```text
Model 1
   ↓
Find errors
   ↓
Model 2 focuses on errors
   ↓
Find remaining errors
   ↓
Model 3
   ↓
Final Ensemble
```

Each new model attempts to improve the current ensemble.

Gradient Boosting is commonly built using shallow Decision Trees.

---

# ⚡ 5. XGBoost

**XGBoost (Extreme Gradient Boosting)** is a highly optimized gradient-boosting algorithm based on decision trees.

It became popular because it provides:

* Strong predictive performance
* Regularization
* Efficient training
* Handling of complex tabular relationships
* Support for missing values in many workflows
* Extensive hyperparameter control

Example:

```python id="x5ow7t"
from xgboost import XGBClassifier

model = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

Important parameters:

```text
n_estimators
max_depth
learning_rate
subsample
colsample_bytree
```

### Key tradeoff

A very large number of trees + high complexity can cause overfitting.

---

# 💡 6. LightGBM

**LightGBM** is another gradient-boosting framework designed for efficient training, especially on large tabular datasets.

It uses a histogram-based approach and grows trees using a **leaf-wise** strategy.

```python id="6bkg72"
from lightgbm import LGBMClassifier

model = LGBMClassifier(
    n_estimators=100,
    learning_rate=0.1,
    random_state=42
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Important parameters include:

* `n_estimators`
* `learning_rate`
* `num_leaves`
* `max_depth`
* `min_child_samples`

### Important distinction

LightGBM's leaf-wise tree growth can improve training efficiency and accuracy, but without appropriate constraints it can also overfit.

---

# 🐱 7. CatBoost

**CatBoost** is a gradient-boosting algorithm particularly known for handling **categorical features** effectively.

Example:

```python id="2x4zj6"
from catboost import CatBoostClassifier

model = CatBoostClassifier(
    iterations=100,
    learning_rate=0.1,
    depth=6,
    verbose=False
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

One of its major practical advantages is strong support for categorical data without requiring you to manually one-hot encode every categorical feature.

---

# 🎯 8. AdaBoost

**AdaBoost (Adaptive Boosting)** builds models sequentially while giving more attention to examples that previous models classified incorrectly.

Conceptually:

```text
Initial Model
     ↓
Incorrect examples get more attention
     ↓
Next Model
     ↓
Repeat
```

A common base learner is a shallow Decision Tree.

```python id="8gknxw"
from sklearn.ensemble import AdaBoostClassifier

model = AdaBoostClassifier(
    n_estimators=100,
    learning_rate=0.5,
    random_state=42
)

model.fit(X_train, y_train)
```

---

# 🗳️ 9. Voting Classifier

Voting combines predictions from **different classification models**.

Example:

```text
Logistic Regression → Cat
SVM                 → Cat
Decision Tree       → Dog

Final → Cat
```

### Hard Voting

Uses predicted classes.

```python id="j9ipvc"
from sklearn.ensemble import VotingClassifier

ensemble = VotingClassifier(
    estimators=[
        ("lr", LogisticRegression()),
        ("svm", SVC(probability=True)),
        ("tree", DecisionTreeClassifier())
    ],
    voting="hard"
)
```

### Soft Voting

Uses predicted probabilities and combines them.

```python id="q2z4jv"
ensemble = VotingClassifier(
    estimators=[
        ("lr", LogisticRegression()),
        ("svm", SVC(probability=True)),
        ("tree", DecisionTreeClassifier())
    ],
    voting="soft"
)
```

Soft voting can be useful when the models provide meaningful probability estimates.

---

# 🧠 10. Stacking

**Stacking** combines different models using a **meta-model**.

```text
                ┌→ Logistic Regression ─┐
Input ──────────┼→ Random Forest ────────┼→ Meta Model → Final Prediction
                └→ SVM ─────────────────┘
```

The first-level models generate predictions.

A second model learns how to combine those predictions.

Example:

```python id="8e9q4s"
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

estimators = [
    ("rf", RandomForestClassifier(n_estimators=100)),
    ("svm", SVC(probability=True))
]

model = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression()
)

model.fit(X_train, y_train)
```

Stacking is more flexible than simple voting but also more complex.

---

# ⚖️ 11. Bagging vs Boosting

|             | Bagging                     | Boosting                |
| ----------- | --------------------------- | ----------------------- |
| Training    | Mostly parallel/independent | Sequential              |
| Main idea   | Reduce variance             | Correct previous errors |
| Example     | Random Forest               | XGBoost                 |
| Base models | Often trees                 | Often weak trees        |
| Overfitting | Generally controlled well   | Requires careful tuning |

### Easy way to remember

```text
Bagging   → Many independent models
Boosting  → Models learn from previous mistakes
```

---

# 🔥 12. Why Ensembles Work

Suppose three models make different mistakes:

```text
Model A → 90% correct
Model B → 89% correct
Model C → 91% correct
```

If their errors are not perfectly correlated, combining them can produce a more robust prediction.

The key isn't simply:

> "More models = better."

The models need useful diversity and appropriate training.

---

# 🧪 13. Practical Workflow

For a tabular classification problem:

```text
Dataset
   ↓
Preprocessing
   ↓
Train/Test Split
   ↓
Baseline Model
   ↓
Random Forest
   ↓
XGBoost / LightGBM / CatBoost
   ↓
Evaluate
   ↓
Hyperparameter Tuning
   ↓
Final Model
```

Always compare against a reasonable baseline instead of assuming an ensemble is automatically better.

---

# 📝 Practice

Use a classification dataset and train:

* Decision Tree
* Random Forest
* AdaBoost
* XGBoost
* LightGBM
* CatBoost
* Voting Classifier
* Stacking Classifier

Compare:

```text
Accuracy
Precision
Recall
F1
ROC-AUC
Training time
```

Also experiment with:

```text
n_estimators
learning_rate
max_depth
```

---

# 🎯 Interview Questions

1. What is ensemble learning?
2. Why do ensemble methods work?
3. Bagging vs boosting?
4. How does Random Forest work?
5. Why does Random Forest use random features?
6. What is Gradient Boosting?
7. XGBoost vs Random Forest?
8. What is the main idea behind LightGBM?
9. Why is CatBoost useful for categorical data?
10. How does AdaBoost work?
11. Hard voting vs soft voting?
12. What is stacking?
13. What is a meta-model?
14. Can ensemble models overfit?

---

# ✅ Key Takeaways

```text
Ensemble Learning
       ↓
Multiple Models
       ↓
Better / More Robust Predictions
```

### Main algorithms

```text
Bagging
  └── Random Forest

Boosting
  ├── Gradient Boosting
  ├── XGBoost
  ├── LightGBM
  ├── CatBoost
  └── AdaBoost

Combination
  ├── Voting
  └── Stacking
```

**Remember:**

> **Bagging = independent models.**
> **Boosting = sequential error correction.**
> **Voting = combine predictions.**
> **Stacking = learn how to combine predictions.**

### Next → `06-Clustering`
