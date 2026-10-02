# 📈 03 — Regression

**Date:** 05 January 2026
**Level:** Beginner → Intermediate
**Goal:** Learn how Machine Learning models predict **continuous numerical values**.

---

## 📌 1. What is Regression?

**Regression** is a supervised Machine Learning technique used to predict a numerical value.

Examples:

* House price → `15,500,000`
* Salary → `180,000`
* Temperature → `32.5°C`
* Sales → `250,000`
* Delivery time → `42.7 minutes`

Basic idea:

```text
Features (X)
    ↓
Regression Model
    ↓
Numerical Prediction (y)
```

Example:

```text
Area + Bedrooms + Location
          ↓
     ML Model
          ↓
     House Price
```

---

# 📐 2. Linear Regression

Linear Regression assumes a relationship between input features and the target that can be approximated by a linear equation.

For one feature:

$$
y = mx + b
$$

Where:

| Symbol | Meaning      |
| ------ | ------------ |
| `y`    | Prediction   |
| `x`    | Feature      |
| `m`    | Slope/weight |
| `b`    | Intercept    |

For multiple features:

$$
y = w_1x_1 + w_2x_2 + ... + w_nx_n + b
$$

Example:

```text
House Price =
5000 × Area
+ 100000 × Bedrooms
+ 200000 × Bathrooms
+ b
```

The model learns the weights from training data.

---

# 🎯 3. How Does Linear Regression Learn?

The model initially has unknown parameters.

```text
Weights + Bias
     ↓
Prediction
     ↓
Compare with actual value
     ↓
Calculate error
     ↓
Optimize parameters
```

A common objective is to minimize **Mean Squared Error (MSE)**:

$$
MSE = \frac{1}{n}\sum_{i=1}^{n}(y_i-\hat{y_i})^2
$$

Where:

* \(y_i\) = actual value
* \(\hat{y_i}\) = predicted value
* \(n\) = number of observations

The model tries to make predictions as close as possible to the actual values.

---

# 💻 4. Linear Regression with Scikit-Learn

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

Inspect learned parameters:

```python
print(model.coef_)
print(model.intercept_)
```

---

# 🔄 5. Polynomial Regression

Sometimes the relationship between features and target is not linear.

Example:

```text
Linear:

y
│       /
│     /
│   /
│ /
└──────── x
```

But the actual relationship might look like:

```text
y
│      )
│    )
│  )
│_)
└──────── x
```

Polynomial Regression adds powers of the features:

$$
y = b + w_1x + w_2x^2 + w_3x^3
$$

Scikit-learn:

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

model = Pipeline([
    ("poly", PolynomialFeatures(degree=2)),
    ("regressor", LinearRegression())
])

model.fit(X_train, y_train)
```

### Important

Increasing the polynomial degree makes the model more flexible but can also increase **overfitting**.

---

# 🛡️ 6. Ridge Regression

**Ridge Regression** adds L2 regularization.

Objective:

$$
MSE + \lambda\sum w_j^2
$$

The penalty discourages very large weights.

```python
from sklearn.linear_model import Ridge

model = Ridge(alpha=1.0)

model.fit(X_train, y_train)
```

### Why use Ridge?

Useful when:

* Features are correlated
* The model has many features
* You want to reduce overfitting

---

# ✂️ 7. Lasso Regression

**Lasso** uses L1 regularization.

$$
MSE + \lambda\sum |w_j|
$$

Unlike Ridge, Lasso can push some feature weights exactly toward **zero**.

```python
from sklearn.linear_model import Lasso

model = Lasso(alpha=0.1)

model.fit(X_train, y_train)
```

This makes Lasso useful for **feature selection**.

---

# ⚖️ 8. ElasticNet

ElasticNet combines:

```text
L1 Regularization → Lasso
+
L2 Regularization → Ridge
```

```python
from sklearn.linear_model import ElasticNet

model = ElasticNet(
    alpha=0.1,
    l1_ratio=0.5
)

model.fit(X_train, y_train)
```

`l1_ratio` controls the balance between L1 and L2 regularization.

```text
l1_ratio = 1.0 → Lasso-like
l1_ratio = 0.0 → Ridge-like
```

---

# 📊 9. Regression Evaluation Metrics

A regression model needs numerical metrics to measure prediction error.

## MAE — Mean Absolute Error

$$
MAE = \frac{1}{n}\sum|y-\hat{y}|
$$

Example:

```text
Actual:    100, 200, 300
Predicted: 110, 180, 310
```

Errors:

```text
10, 20, 10
```

MAE:

```text
40 / 3 = 13.33
```

**Easy interpretation:** average prediction error is about `13.33` units.

---

## MSE — Mean Squared Error

$$
MSE = \frac{1}{n}\sum(y-\hat{y})^2
$$

Large errors receive much greater penalties.

---

## RMSE — Root Mean Squared Error

$$
RMSE = \sqrt{MSE}
$$

RMSE is useful because it is expressed in the **same units as the target**.

For example:

```text
RMSE = 25,000 PKR
```

means the model's typical error is measured on the scale of PKR.

---

## R² — R-Squared

R² measures how much of the target's variation is explained by the model.

Conceptually:

```text
R² = 1.0 → Perfect fit
R² ≈ 0   → Weak explanatory performance
R² < 0   → Can happen when predictions are worse than a simple baseline
```

Example:

```python
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)
import numpy as np

mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, predictions)

print("MAE:", mae)
print("MSE:", mse)
print("RMSE:", rmse)
print("R²:", r2)
```

---

# 📋 10. Regression Model Comparison

| Model                 | Main Idea                  | Main Strength                 |
| --------------------- | -------------------------- | ----------------------------- |
| Linear Regression     | Straight-line relationship | Simple baseline               |
| Polynomial Regression | Curved relationship        | Captures non-linearity        |
| Ridge                 | L2 regularization          | Controls large weights        |
| Lasso                 | L1 regularization          | Can perform feature selection |
| ElasticNet            | L1 + L2                    | Balanced regularization       |

---

# 🧠 11. Simple Example

Suppose you're predicting house prices:

```text
Area = 2000 sq ft
Bedrooms = 4
Bathrooms = 3
Age = 5 years
```

The trained model receives these features:

```text
[2000, 4, 3, 5]
       ↓
   Regression
       ↓
Prediction = 18,500,000
```

Then compare:

```text
Actual     = 19,000,000
Predicted  = 18,500,000
```

The difference between actual and predicted values contributes to the model's error.

---

# ⚠️ 12. Common Regression Problems

### Overfitting

A very complex model performs extremely well on training data but poorly on unseen data.

Solutions include:

* Regularization
* Cross-validation
* Simpler models
* Better feature selection

### Multicollinearity

Features may be strongly correlated.

Example:

```text
House size in sq ft
House size in square meters
```

Both represent almost the same information.

This can make coefficient interpretation unstable, especially for linear models.

---

# 📝 Practice

Build a regression model using a house-price dataset.

Try:

* Linear Regression
* Polynomial Regression
* Ridge
* Lasso
* ElasticNet
* MAE
* MSE
* RMSE
* R²

Then compare their validation/test performance.

---

# 🎯 Interview Questions

1. What is regression?
2. Regression vs classification?
3. Explain Linear Regression.
4. What does the slope represent?
5. What is MSE?
6. MAE vs MSE?
7. Why use RMSE?
8. What does R² represent?
9. Ridge vs Lasso?
10. Why does Lasso perform feature selection?
11. What is ElasticNet?
12. What is polynomial regression?
13. What is regularization?
14. What is multicollinearity?

---

# ✅ Key Takeaways

```text
Regression → Predict numerical values

Linear Regression
      ↓
Polynomial Regression
      ↓
Ridge → L2
Lasso → L1
ElasticNet → L1 + L2

MAE  → Average absolute error
MSE  → Penalizes large errors
RMSE → Error in target units
R²   → Explained variance / goodness of fit
```

### Next → `04-Classification`
