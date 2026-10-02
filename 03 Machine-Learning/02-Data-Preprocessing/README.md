# 🧹 02 — Data Preprocessing

**Date:** 03 January 2026
**Level:** Beginner → Intermediate
**Goal:** Learn how to convert raw, messy data into clean, model-ready data.

---

## 📌 1. What is Data Preprocessing?

Real-world datasets are rarely ready for Machine Learning.

They may contain:

* Missing values
* Text categories
* Different numerical scales
* Duplicate records
* Incorrect data types
* Irrelevant columns
* Outliers

**Data preprocessing** prepares this data before it is given to a model.

```text
Raw Data
   ↓
Clean Data
   ↓
Transform Features
   ↓
Train/Test Split
   ↓
ML Model
```

Good preprocessing can significantly affect model performance.

---

# 🧹 2. Handling Missing Values

Example:

| Age | Salary | City      |
| --: | -----: | --------- |
|  23 |  50000 | Islamabad |
| NaN |  65000 | Lahore    |
|  29 |    NaN | Karachi   |

Common strategies:

### Numerical Data

**Mean**

```python
df["age"] = df["age"].fillna(df["age"].mean())
```

**Median**

```python
df["age"] = df["age"].fillna(df["age"].median())
```

Median is often better when the data contains strong outliers.

### Categorical Data

Use the most frequent category:

```python
df["city"] = df["city"].fillna(df["city"].mode()[0])
```

### When to Drop

If a column has extremely large amounts of missing data, you may consider removing it.

```python
df.drop(columns=["unnecessary_column"], inplace=True)
```

But don't automatically delete missing values—understand why they are missing first.

---

# 🔤 3. Encoding Categorical Data

ML algorithms generally require numerical inputs.

Example:

```text
City
------
Islamabad
Lahore
Karachi
```

We need to convert categories into numbers.

---

## One-Hot Encoding

Creates separate binary columns.

```text
City_Islamabad
City_Lahore
City_Karachi
```

Example:

| City      | Islamabad | Lahore | Karachi |
| --------- | --------: | -----: | ------: |
| Islamabad |         1 |      0 |       0 |
| Lahore    |         0 |      1 |       0 |
| Karachi   |         0 |      0 |       1 |

Scikit-learn:

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(handle_unknown="ignore")
```

Best for **nominal categories** where there is no natural order.

---

## Label Encoding

Converts categories into integer labels.

```text
Cat → 0
Dog → 1
Horse → 2
```

Useful when the categories represent classes, but be careful using arbitrary numbers as input features because some models may interpret them as ordered.

For target labels:

```python
from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
y = encoder.fit_transform(y)
```

---

## Target Encoding

Replaces a category with a statistic calculated from the target.

Example:

```text
City       Average Price
Islamabad  15M
Lahore     12M
Karachi    10M
```

Useful for high-cardinality categorical features.

⚠️ **Important:** Target encoding can cause **data leakage** if calculated using validation/test information.

---

# 📏 4. Feature Scaling

Suppose:

```text
Age       = 25
Salary    = 150000
```

The numerical ranges are very different.

Some algorithms are sensitive to feature scale, especially:

* KNN
* K-Means
* SVM
* Logistic Regression
* Neural networks

---

## Standardization

Transforms data approximately to:

```text
mean = 0
standard deviation = 1
```

Formula:

$$
z = \frac{x-\mu}{\sigma}
$$

Scikit-learn:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
```

### Critical rule

```text
Training data → fit_transform()
Test data     → transform()
```

Do **not** fit the scaler separately on test data.

---

## Min-Max Scaling

Usually converts values to:

```text
0 → 1
```

Formula:

$$
x' = \frac{x-x_{min}}{x_{max}-x_{min}}
$$

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
```

Useful when you want features in a fixed range.

---

## Robust Scaling

Uses median and interquartile range (IQR).

```python
from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()
```

It can be useful when strong outliers exist.

---

# ✂️ 5. Feature Splitting

Separate:

```text
Features → X
Target   → y
```

Example:

```python
X = df.drop("price", axis=1)
y = df["price"]
```

Then split the data:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)
```

A common split:

```text
80% → Training
20% → Testing
```

---

# 🔄 6. Cross-Validation

Instead of relying on one train/test split, **cross-validation** evaluates a model across multiple splits.

### 5-Fold Cross-Validation

```text
Dataset
────────────────────────
Fold 1 | Fold 2 | Fold 3 | Fold 4 | Fold 5
```

Each fold becomes the validation set once.

```text
Round 1 → Test Fold 1
Round 2 → Test Fold 2
Round 3 → Test Fold 3
Round 4 → Test Fold 4
Round 5 → Test Fold 5
```

Then calculate the average score.

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model,
    X,
    y,
    cv=5
)

print(scores.mean())
```

Cross-validation gives a more reliable estimate of model performance.

---

# 🚨 7. Data Leakage

**Data leakage** happens when information that should be unavailable during training enters the model-building process.

Example:

```text
❌ Fit scaler on entire dataset
        ↓
Train + Test information leaked
```

Correct:

```text
Training Data
     ↓
fit scaler
     ↓
transform training

Test Data
     ↓
transform only
```

The same principle applies to:

* Imputation
* Feature selection
* Target encoding
* Scaling
* Feature engineering

---

# 🏗️ 8. Preprocessing Pipeline

Scikit-learn allows preprocessing and modeling to be combined.

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)
```

This helps keep preprocessing consistent and reduces leakage.

You will study `Pipeline` and `ColumnTransformer` in depth in **Module 14**.

---

# 🧠 9. Example End-to-End Flow

Suppose we have:

```text
Age
Salary
City
Experience
Purchased
```

We can build:

```text
Raw Dataset
     ↓
Handle missing values
     ↓
Encode City
     ↓
Split X / y
     ↓
Train/Test Split
     ↓
Scale numerical features
     ↓
Train Model
     ↓
Evaluate
```

---

# 📝 Practice

Practice preprocessing on a small dataset such as Titanic or another tabular dataset.

Try:

* Find missing values
* Fill numerical missing values
* Fill categorical missing values
* One-hot encode categories
* Split X and y
* Create train/test sets
* Apply StandardScaler
* Apply cross-validation
* Identify possible leakage

---

# 🎯 Interview Questions

1. Why is preprocessing necessary?
2. Mean vs median imputation?
3. What is one-hot encoding?
4. Label encoding vs one-hot encoding?
5. What is target encoding?
6. Why do we scale features?
7. StandardScaler vs MinMaxScaler?
8. When would you use RobustScaler?
9. What is cross-validation?
10. What is data leakage?
11. Why do we `fit_transform()` on training data but only `transform()` on test data?
12. Why are ML pipelines useful?

---

# ✅ Key Takeaways

```text
Raw Data
   ↓
Missing Values → Handle
   ↓
Categorical Data → Encode
   ↓
Numerical Features → Scale when needed
   ↓
X / y Split
   ↓
Train / Test Split
   ↓
Cross-Validation
   ↓
Model
```

### Remember

**Preprocessing must be learned from training data—not from the test set.**

### Next → `03-Regression`
