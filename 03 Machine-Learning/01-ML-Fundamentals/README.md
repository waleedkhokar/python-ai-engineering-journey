# 🤖 01 — ML Fundamentals

**Date:** 02 January 2026
**Level:** Beginner → Intermediate
**Goal:** Understand how Machine Learning works before learning individual algorithms.

---

## 📌 1. What is Machine Learning?

**Machine Learning (ML)** is a branch of AI where computers learn patterns from data and use those patterns to make predictions or decisions.

### Traditional Programming

```text
Rules + Data → Output
```

Example:

```text
if marks >= 50:
    result = "Pass"
```

### Machine Learning

```text
Data + Correct Outputs → Model
Model + New Data → Prediction
```

Example:

```text
House features → ML Model → Predicted Price
```

Instead of manually writing every rule, the model learns relationships from examples.

---

# 🧠 2. Main Types of Machine Learning

| Type                       | Data      | Goal           | Example            |
| -------------------------- | --------- | -------------- | ------------------ |
| **Supervised Learning**    | Labeled   | Predict output | House price        |
| **Unsupervised Learning**  | Unlabeled | Find patterns  | Customer groups    |
| **Reinforcement Learning** | Rewards   | Learn actions  | Game-playing agent |

---

## 2.1 Supervised Learning

The dataset contains both:

```text
Input (X) → Target (y)
```

Example:

| Area | Bedrooms | Price |
| ---: | -------: | ----: |
| 1000 |        2 |    8M |
| 1500 |        3 |   12M |
| 2000 |        4 |   17M |

The model learns:

```text
Area + Bedrooms → Price
```

Two major supervised-learning tasks:

### Regression

Predict a **continuous numerical value**.

Examples:

* House price
* Temperature
* Salary
* Sales

### Classification

Predict a **category/class**.

Examples:

* Spam / Not Spam
* Fraud / Not Fraud
* Disease / No Disease
* Cat / Dog

---

# 2.2 Unsupervised Learning

There is no target column.

```text
X → Model → Hidden Patterns
```

Example:

```text
Customer data
      ↓
Clustering
      ↓
Group 1 | Group 2 | Group 3
```

Common tasks:

* Clustering
* Dimensionality reduction
* Anomaly detection

Algorithms include:

* K-Means
* DBSCAN
* PCA

These will be covered later.

---

# 2.3 Reinforcement Learning

An **agent** interacts with an environment.

```text
Agent
  ↓ action
Environment
  ↓
Reward / Penalty
  ↓
Agent learns
```

Example:

A game-playing AI receives:

```text
Good action → +10 reward
Bad action  → -10 reward
```

The goal is to learn actions that maximize long-term reward.

> Reinforcement Learning is part of ML, but it is outside the main classical ML workflow in this curriculum.

---

# 📊 3. Features and Target

Suppose we want to predict house prices.

```text
Area
Bedrooms
Bathrooms
Location
Age
      ↓
   Features (X)
      ↓
    Model
      ↓
Price (y)
```

### Feature

An input variable used by the model.

```text
X = [Area, Bedrooms, Bathrooms]
```

### Target

The value we want to predict.

```text
y = Price
```

In classification:

```text
X = Email text
y = Spam / Ham
```

---

# ✂️ 4. Train, Validation and Test Data

We normally divide our dataset into multiple parts.

```text
Complete Dataset
       │
       ├── Training Data
       ├── Validation Data
       └── Test Data
```

| Dataset        | Purpose            |
| -------------- | ------------------ |
| **Training**   | Learn patterns     |
| **Validation** | Tune/select models |
| **Test**       | Final evaluation   |

A common split:

```text
70% Training
15% Validation
15% Testing
```

Another common approach:

```text
80% Training
20% Testing
```

with cross-validation used inside the training set.

### Important rule

**Never use test data to train or tune your model.**

Otherwise, your final performance estimate becomes unreliable.

---

# ⚖️ 5. Bias vs Variance

A major ML concept is balancing **bias** and **variance**.

### High Bias

Model is too simple.

```text
Underfitting
```

It performs poorly on:

```text
Training data ❌
Test data ❌
```

Example:

Trying to predict a complex relationship using an overly simple linear model.

### High Variance

Model is too complex.

```text
Overfitting
```

It performs:

```text
Training → Excellent
Test → Poor
```

The model has learned the training data too closely instead of learning general patterns.

### Goal

```text
Good Bias + Good Variance
          ↓
   Better Generalization
```

---

# 🚨 6. Underfitting vs Overfitting

|                  | Underfitting | Good Fit    | Overfitting |
| ---------------- | ------------ | ----------- | ----------- |
| Model complexity | Too low      | Appropriate | Too high    |
| Training error   | High         | Low         | Very low    |
| Test error       | High         | Low         | High        |
| Generalization   | Poor         | Good        | Poor        |

### Example

Suppose:

```text
Training Accuracy = 60%
Test Accuracy     = 58%
```

Likely **underfitting**.

```text
Training Accuracy = 99%
Test Accuracy     = 70%
```

Likely **overfitting**.

```text
Training Accuracy = 92%
Test Accuracy     = 90%
```

Generally indicates better generalization.

---

# 🔄 7. Generalization

**Generalization** means the model performs well on **new, unseen data**.

This is one of the most important goals of ML.

```text
Training Data
      ↓
    Model
      ↓
Unseen Data
      ↓
Reliable Prediction
```

A model that memorizes training examples but fails on new examples is not useful in production.

---

# 🧪 8. Basic ML Workflow

A typical Machine Learning workflow:

```text
1. Collect Data
      ↓
2. Explore Data
      ↓
3. Clean Data
      ↓
4. Preprocess Data
      ↓
5. Split Data
      ↓
6. Train Model
      ↓
7. Validate / Tune
      ↓
8. Test Model
      ↓
9. Deploy
      ↓
10. Monitor & Improve
```

You will learn these stages throughout the ML curriculum.

---

# 💻 9. Basic Scikit-Learn Example

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

X = df[["area", "bedrooms"]]
y = df["price"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = LinearRegression()

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

The important pattern is:

```python
model.fit(X_train, y_train)
model.predict(X_test)
```

Almost every supervised-learning algorithm follows this general API style in scikit-learn.

---

# 📝 Practice

Before moving forward, make sure you can explain:

* What Machine Learning is
* Supervised vs Unsupervised Learning
* Regression vs Classification
* Features vs Target
* Training vs Validation vs Test data
* Bias vs Variance
* Overfitting vs Underfitting
* Generalization
* Basic ML workflow
* `fit()` vs `predict()`

---

# 🎯 Interview Questions

1. What is Machine Learning?
2. What is the difference between AI and ML?
3. What is supervised learning?
4. Regression vs classification?
5. What is unsupervised learning?
6. What are features and targets?
7. Why do we split data into train and test sets?
8. What is overfitting?
9. What is underfitting?
10. What is the bias-variance tradeoff?
11. What is generalization?
12. Why should test data not be used during training?

---

# ✅ Key Takeaways

```text
ML = Learn patterns from data

Supervised     → Labeled data
Unsupervised   → Unlabeled data
Reinforcement  → Rewards/actions

Regression     → Numerical prediction
Classification → Class prediction

Training       → Learn
Validation     → Tune/select
Testing        → Final evaluation

Underfitting   → Model too simple
Overfitting    → Model too complex

Goal           → Generalize to unseen data
```

### Next → `02-Data-Preprocessing`
