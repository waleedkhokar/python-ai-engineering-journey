# 🏷️ 04 — Classification

**Date:** 08 January 2026
**Level:** Beginner → Intermediate
**Goal:** Learn how Machine Learning models predict **categories/classes** and how to evaluate classification models correctly.

---

## 📌 1. What is Classification?

**Classification** is a supervised Machine Learning task where the model predicts a **discrete class or category**.

Examples:

| Problem              | Classes             |
| -------------------- | ------------------- |
| Email detection      | Spam / Not Spam     |
| Disease detection    | Positive / Negative |
| Fraud detection      | Fraud / Legitimate  |
| Image classification | Cat / Dog           |
| Customer churn       | Churn / No Churn    |

Basic workflow:

```text
Features (X)
     ↓
Classification Model
     ↓
Predicted Class
```

Unlike regression:

```text
Regression     → 25,000
Classification → "Spam"
```

---

# 🔢 2. Binary vs Multiclass Classification

### Binary Classification

Only two classes:

```text
Spam / Not Spam
Yes / No
0 / 1
```

### Multiclass Classification

More than two classes:

```text
Cat
Dog
Horse
Bird
```

The model chooses one class from multiple possible classes.

---

# 📈 3. Logistic Regression

Despite its name, **Logistic Regression is a classification algorithm**.

It predicts a probability between `0` and `1`.

The model uses the sigmoid function:

$$
\sigma(z)=\frac{1}{1+e^{-z}}
$$

Example:

```text
Model output = 0.87
```

This can mean:

```text
87% probability of class 1
```

A threshold is then used:

```text
Probability >= 0.5 → Class 1
Probability < 0.5  → Class 0
```

The threshold does not always have to be `0.5`; it can be adjusted depending on the application.

### Scikit-learn

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()

model.fit(X_train, y_train)

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)
```

---

# 👥 4. K-Nearest Neighbors — KNN

KNN predicts a sample based on the **nearest training examples**.

Example:

```text
        🟢 🟢
      🟢
              🔵
           🔵 🔵
              ?
```

If `?` is closest to the blue points, KNN may classify it as blue.

### How it works

1. Choose `K`
2. Calculate distance to training samples
3. Find the K nearest samples
4. Take the majority class

Example:

```text
K = 5

Nearest neighbors:
Blue
Blue
Blue
Red
Red

Prediction → Blue
```

### Scikit-learn

```python
from sklearn.neighbors import KNeighborsClassifier

model = KNeighborsClassifier(n_neighbors=5)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

⚠️ KNN is distance-based, so **feature scaling is important**.

---

# 🧮 5. Naive Bayes

Naive Bayes is based on **Bayes' theorem**:

$$
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
$$

It makes a strong assumption that features are conditionally independent given the class.

Despite this simplified assumption, it can work very well for some problems, particularly text classification.

Example:

```text
"Win free money now!"

        ↓
Naive Bayes
        ↓
Spam
```

Common variants:

```text
GaussianNB   → Continuous numerical features
MultinomialNB → Counts / text features
BernoulliNB   → Binary features
```

---

# 📐 6. Support Vector Machine — SVM

SVM attempts to find a decision boundary that separates classes.

```text
🟢 🟢 🟢 | 🔴 🔴
🟢 🟢 🟢 | 🔴 🔴
🟢 🟢 🟢 | 🔴 🔴
          ↑
     Decision boundary
```

The goal is to maximize the **margin** between classes.

Important concepts:

* Hyperplane
* Margin
* Support vectors
* Kernel

Popular kernels:

```text
linear
rbf
poly
```

### Scikit-learn

```python
from sklearn.svm import SVC

model = SVC(kernel="rbf")

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

SVM can also use kernels to model non-linear decision boundaries.

---

# 🌳 7. Decision Trees

A Decision Tree makes predictions using a sequence of questions.

Example:

```text
       Age > 30?
        /      \
      Yes       No
      /          \
Income > 50K?   No Churn
   /    \
 Yes     No
 |        |
Churn   No Churn
```

The tree repeatedly splits data based on features.

Common splitting criteria include:

* Gini impurity
* Entropy / information gain

### Scikit-learn

```python
from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(
    max_depth=5,
    random_state=42
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Decision Trees don't require feature scaling.

---

# 📊 8. Confusion Matrix

A confusion matrix shows how predictions compare with actual classes.

For binary classification:

|                     | Predicted Positive | Predicted Negative |
| ------------------- | -----------------: | -----------------: |
| **Actual Positive** |                 TP |                 FN |
| **Actual Negative** |                 FP |                 TN |

### Terms

**TP — True Positive**

Predicted positive and actually positive.

**TN — True Negative**

Predicted negative and actually negative.

**FP — False Positive**

Predicted positive but actually negative.

**FN — False Negative**

Predicted negative but actually positive.

Example: disease detection

```text
TP → Disease correctly detected
TN → Healthy person correctly identified
FP → Healthy person incorrectly flagged
FN → Disease missed
```

---

# 🎯 9. Classification Metrics

## Accuracy

$$
Accuracy=\frac{TP+TN}{TP+TN+FP+FN}
$$

Measures the percentage of correct predictions.

```text
90 correct / 100 samples = 90% accuracy
```

But accuracy can be misleading with **imbalanced datasets**.

---

## Precision

$$
Precision=\frac{TP}{TP+FP}
$$

Of everything predicted positive, how much was actually positive?

Useful when **false positives are costly**.

---

## Recall

$$
Recall=\frac{TP}{TP+FN}
$$

Of all actual positive cases, how many did the model find?

Useful when **false negatives are costly**.

---

## F1 Score

F1 combines precision and recall:

$$
F1=2\frac{Precision\times Recall}{Precision+Recall}
$$

Useful when you want a balance between precision and recall.

---

# 📈 10. ROC-AUC

A classification model can produce probabilities instead of only classes.

The **ROC curve** examines:

```text
True Positive Rate
        vs
False Positive Rate
```

**AUC** means **Area Under the ROC Curve**.

Generally:

```text
AUC = 1.0 → Perfect separation
AUC ≈ 0.5 → Random-like discrimination
```

Example:

```python
from sklearn.metrics import roc_auc_score

probabilities = model.predict_proba(X_test)[:, 1]

auc = roc_auc_score(y_test, probabilities)

print(auc)
```

For models without `predict_proba()`, some provide `decision_function()` instead.

---

# ⚠️ 11. Imbalanced Classification

Suppose:

```text
1000 transactions

990 → Legitimate
10  → Fraud
```

A model predicting **everything as legitimate** gets:

```text
Accuracy = 99%
```

But it detects:

```text
Fraud = 0 / 10
```

So accuracy alone is misleading.

For imbalanced problems, examine:

* Precision
* Recall
* F1
* Precision-Recall curve
* Confusion matrix
* ROC-AUC

---

# 🧪 12. Basic Classification Workflow

```text
Dataset
   ↓
Preprocessing
   ↓
Train/Test Split
   ↓
Train Classifier
   ↓
Predict
   ↓
Confusion Matrix
   ↓
Precision / Recall / F1
   ↓
ROC-AUC
```

Example:

```python
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

print(accuracy_score(y_test, predictions))
print(precision_score(y_test, predictions))
print(recall_score(y_test, predictions))
print(f1_score(y_test, predictions))
```

---

# 📝 Practice

Build a classification model using a dataset such as:

* Breast Cancer
* Titanic
* SMS Spam

Try:

* Logistic Regression
* KNN
* Naive Bayes
* SVM
* Decision Tree

Then compare:

```text
Accuracy
Precision
Recall
F1
ROC-AUC
Confusion Matrix
```

Also test what happens when you change the classification threshold.

---

# 🎯 Interview Questions

1. What is classification?
2. Binary vs multiclass classification?
3. Why is Logistic Regression called regression?
4. What is the sigmoid function?
5. How does KNN work?
6. Why does KNN require scaling?
7. What is Bayes' theorem?
8. What is the main assumption of Naive Bayes?
9. How does SVM classify data?
10. What are support vectors?
11. How does a Decision Tree make splits?
12. What are TP, TN, FP and FN?
13. Precision vs Recall?
14. When is accuracy misleading?
15. What is F1 score?
16. What does ROC-AUC measure?

---

# ✅ Key Takeaways

```text
Classification → Predict categories

Logistic Regression → Probability-based classification
KNN               → Nearest neighbors
Naive Bayes       → Bayes theorem
SVM               → Maximum-margin boundary
Decision Tree     → Rule-based splits

Accuracy  → Overall correctness
Precision → Correctness of positive predictions
Recall    → Positive cases found
F1        → Precision + Recall balance
ROC-AUC   → Ranking/discrimination ability
```

### Next → `05-Ensemble-Methods`
