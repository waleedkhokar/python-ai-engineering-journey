# ⚙️ Feature Engineering — Creating Better Features for Machine Learning

**Step 2: Data Science → Topic 07 → Class 23** | Date: February 14, 2024 🎯

> **Feature Engineering = turning raw data into useful information that a Machine Learning model can learn from.**

Feature Engineering is the process of creating, transforming, selecting, and preparing features so that Machine Learning models can understand the important patterns in the data.

Good features can improve model performance, reduce noise, and make models easier to train and interpret.

---

# 🎯 Learning Objectives

By completing this topic, I will understand how to:

- Create new features from existing data
- Transform numerical features
- Extract useful information from dates and text
- Encode categorical variables
- Scale numerical features
- Create interaction and ratio features
- Create aggregation features
- Handle missing values using features
- Identify constant and near-constant features
- Handle high-cardinality categorical features
- Detect and prevent data leakage
- Apply preprocessing safely using `Pipeline`
- Use polynomial features
- Understand PCA as an introductory dimensionality-reduction technique
- Select useful features for Machine Learning

---

# 🧠 What is Feature Engineering?

Machine Learning models learn from **features**.

For example, suppose we have:

```text
House Size
Bedrooms
Bathrooms
Location
Year Built
Price
````

Instead of using only the raw columns, we can create additional useful information.

For example:

```text
House Size
Bedrooms
Bathrooms
Location
Year Built
Price
        ↓
New Features
        ↓
Price per Square Foot
House Age
Rooms per Bedroom
Is New House
Location Encoding
```

The goal is to represent the original data in a way that makes useful patterns easier for the model to learn.

---

# 🔄 Feature Engineering Workflow

```text
Raw Data
   ↓
Understand Features
   ↓
Clean Data
   ↓
Create Features
   ↓
Transform Features
   ↓
Encode Categories
   ↓
Scale Numerical Features
   ↓
Select Useful Features
   ↓
Prevent Data Leakage
   ↓
Train Machine Learning Model
```

---

# 📚 Main Topics

## 1. Feature Creation

Creating new features from existing columns.

### Examples

```python
df["total_rooms"] = df["bedrooms"] + df["bathrooms"]

df["price_per_area"] = df["price"] / df["area"]

df["age"] = 2024 - df["year_built"]
```

Feature creation is useful when existing columns contain information that can be represented in a more meaningful way.

---

# 2. Numerical Feature Transformation

Numerical values may need to be transformed before Machine Learning.

### Common transformations

* Log transformation
* Square root transformation
* Power transformation
* Standardization
* Min-Max scaling
* Binning

Example:

```python
import numpy as np

df["log_income"] = np.log1p(df["income"])
```

Transformations can help models handle skewed distributions and different feature scales.

---

# 3. Date and Time Features

Dates often contain useful information that should be extracted.

Example:

```python
df["date"] = pd.to_datetime(df["date"])

df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["day_of_week"] = df["date"].dt.dayofweek
df["hour"] = df["date"].dt.hour
```

### Possible date features

* Year
* Month
* Day
* Day of week
* Week of year
* Hour
* Weekend indicator
* Month start/end
* Time since event

---

# 4. Categorical Features

Categorical variables contain labels rather than numerical measurements.

Example:

```text
City
Gender
Department
Education
Product Category
```

Machine Learning models often require these categories to be converted into numerical representations.

---

# 5. Binary Encoding

For categories containing two values:

```text
Yes / No
True / False
Male / Female
```

Example:

```python
df["is_active"] = df["status"].map({
    "Active": 1,
    "Inactive": 0
})
```

---

# 6. Ordinal Encoding

Used when categories have a meaningful order.

Example:

```text
Low < Medium < High
```

Example:

```python
mapping = {
    "Low": 1,
    "Medium": 2,
    "High": 3
}

df["priority_encoded"] = df["priority"].map(mapping)
```

Ordinal encoding should only be used when the ordering actually has meaning.

---

# 7. One-Hot Encoding

Used for nominal categories without an inherent order.

Example:

```text
Red
Blue
Green
```

becomes:

```text
is_red
is_blue
is_green
```

Using Pandas:

```python
df = pd.get_dummies(
    df,
    columns=["color"],
    drop_first=True
)
```

Or with Scikit-learn:

```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(
    handle_unknown="ignore"
)
```

---

# 8. Scaling

Different numerical features may have very different ranges.

Example:

```text
Age       → 18–80
Income    → 20,000–500,000
Distance  → 1–100
```

Some Machine Learning algorithms are sensitive to feature scale.

---

## StandardScaler

Standardization transforms values approximately to:

```text
Mean = 0
Standard Deviation = 1
```

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)
```

---

## MinMaxScaler

Scales values into a specified range, commonly:

```text
0 → 1
```

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()

X_scaled = scaler.fit_transform(X)
```

---

# 9. Interaction Features

Interaction features capture relationships between variables.

Example:

```python
df["rooms_per_person"] = (
    df["rooms"] / df["people"]
)
```

Another example:

```python
df["area_per_room"] = (
    df["area"] / df["rooms"]
)
```

Interaction features can help models capture relationships that are not obvious from individual variables.

---

# 10. Ratio Features

Ratios can provide more meaningful information than raw values.

Examples:

```python
df["income_per_person"] = (
    df["income"] / df["household_size"]
)

df["price_per_sqft"] = (
    df["price"] / df["sqft"]
)

df["debt_to_income"] = (
    df["debt"] / df["income"]
)
```

Always consider division-by-zero and missing values when creating ratio features.

---

# 11. Aggregation Features

Aggregations summarize multiple records.

Example:

```python
customer_total = (
    df.groupby("customer_id")["amount"]
      .sum()
)
```

Possible aggregation features:

* Total
* Average
* Minimum
* Maximum
* Count
* Standard deviation
* Frequency

Example:

```text
Customer
   ↓
Total Orders
Average Order Value
Total Spending
Last Order Date
```

These features are especially useful for customer, transaction, and time-based datasets.

---

# 12. Missing-Value Features

Missing values can sometimes contain useful information themselves.

For example:

```text
income = NULL
```

may indicate that the value was not provided.

Create a missing indicator:

```python
df["income_missing"] = (
    df["income"].isna().astype(int)
)
```

Result:

```text
1 → value was missing
0 → value was present
```

This can be combined with normal missing-value imputation.

---

# 13. Constant Features

A constant feature has the same value for every row.

Example:

```text
country
-------
Pakistan
Pakistan
Pakistan
Pakistan
Pakistan
```

It provides no useful variation for many models.

Such features can usually be removed.

---

# 14. Near-Constant Features

A near-constant feature contains almost the same value for most observations.

Example:

```text
Feature
-------
0
0
0
0
0
1
0
0
0
```

Such features may provide very little information and can be candidates for removal.

---

# 15. High-Cardinality Features

High-cardinality categorical features contain many unique values.

Examples:

```text
User ID
Product ID
Email
Zip Code
Transaction ID
```

Naively applying one-hot encoding to thousands of unique values can create a very large feature space.

Possible approaches include:

* Frequency encoding
* Target encoding
* Hashing
* Grouping rare categories
* Domain-specific feature extraction
* Embeddings in advanced systems

Target encoding must be performed carefully to avoid data leakage.

---

# 🚨 Data Leakage

**Data leakage is one of the most important concepts in Feature Engineering.**

Data leakage happens when information that would not be available at prediction time is accidentally used during model training.

This can produce unrealistically good evaluation results.

---

## Example

Suppose we want to predict whether a customer will cancel an order.

If we create a feature using information that only becomes available **after the cancellation**, the model is receiving future information.

That is leakage.

```text
Future Information
       ↓
Training Data
       ↓
Model
       ↓
Artificially High Performance
```

The model may look excellent during testing but perform poorly in real-world use.

---

# 🔐 Train/Test Leakage

Preprocessing must also be fitted only on training data.

Incorrect:

```python
scaler.fit_transform(X)
```

before splitting the dataset.

Correct:

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

scaler.fit(X_train)

X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

The test set should remain unseen during preprocessing and model development.

---

# 🧩 Pipelines

Scikit-learn `Pipeline` helps create a safer and reproducible preprocessing workflow.

Example:

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

The pipeline ensures that preprocessing is learned from the training data and then applied consistently.

---

# 🔀 ColumnTransformer

Real datasets usually contain multiple feature types.

For example:

```text
Age       → Numerical
Income    → Numerical
City      → Categorical
Gender    → Categorical
```

`ColumnTransformer` allows different preprocessing for different columns.

Example:

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import (
    StandardScaler,
    OneHotEncoder
)

preprocessor = ColumnTransformer([
    (
        "num",
        StandardScaler(),
        numerical_features
    ),
    (
        "cat",
        OneHotEncoder(handle_unknown="ignore"),
        categorical_features
    )
])
```

This is an important pattern for real Machine Learning projects.

---

# 🔢 Polynomial Features

Polynomial features create additional combinations of numerical features.

Example:

```text
x
```

can become:

```text
x
x²
```

For two features:

```text
x₁
x₂
```

polynomial expansion may produce:

```text
x₁
x₂
x₁²
x₂²
x₁x₂
```

Scikit-learn:

```python
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(
    degree=2
)

X_poly = poly.fit_transform(X)
```

Polynomial features can help some models capture non-linear relationships.

However, higher degrees can greatly increase the number of features and may lead to overfitting.

---

# 📉 PCA — Introduction

**Principal Component Analysis (PCA)** is a dimensionality-reduction technique.

Instead of keeping many original features, PCA creates a smaller number of new components that capture much of the variation in the data.

```text
Many Features
      ↓
      PCA
      ↓
Fewer Components
```

Example:

```python
from sklearn.decomposition import PCA

pca = PCA(
    n_components=2
)

X_reduced = pca.fit_transform(X_scaled)
```

Important concepts:

* Principal components
* Explained variance
* Explained variance ratio
* Dimensionality reduction
* Feature transformation

PCA is introduced here and can be studied more deeply later.

---

# 🎯 Feature Selection

Feature engineering is not only about creating features.

It also includes deciding which features should remain.

### Possible approaches

* Domain knowledge
* Correlation analysis
* Statistical tests
* Feature importance
* Recursive Feature Elimination
* L1 regularization
* Model-based selection
* Removing redundant features

The goal is to keep useful information while reducing unnecessary complexity.

---

# ⚠️ Common Mistakes

### 1. Creating features using future information

```text
Future Data → Training Feature
```

This causes leakage.

---

### 2. Fitting preprocessing on the complete dataset

Always learn preprocessing parameters from the training data.

---

### 3. Encoding categories incorrectly

Do not assign arbitrary numerical values to categories without considering whether an order actually exists.

---

### 4. Creating too many features

More features do not automatically mean a better model.

Too many features can cause:

* Overfitting
* Higher memory usage
* Longer training
* More noise
* Harder interpretation

---

### 5. Ignoring the business meaning

A mathematically valid feature may not make sense in the real problem.

Always ask:

> **Does this feature represent something useful and available at prediction time?**

---

# 🧠 Important Mental Model

Feature Engineering can be divided into four major activities:

```text
Feature Creation
      ↓
Feature Transformation
      ↓
Feature Extraction
      ↓
Feature Selection
```

### Feature Creation

Create new information.

### Feature Transformation

Change the representation of existing information.

### Feature Extraction

Extract useful information from complex data such as dates or text.

### Feature Selection

Keep the features that are useful for the model.

---

# 🔄 Practical Feature Engineering Workflow

```text
1. Understand the Problem
        ↓
2. Understand the Dataset
        ↓
3. Identify Feature Types
        ↓
4. Clean the Data
        ↓
5. Create Useful Features
        ↓
6. Transform Numerical Features
        ↓
7. Encode Categorical Features
        ↓
8. Handle Missing Values
        ↓
9. Check for Leakage
        ↓
10. Build Preprocessing Pipeline
        ↓
11. Select Useful Features
        ↓
12. Train Model
        ↓
13. Evaluate
```

---

# 🛠️ Main Libraries

| Library      | Purpose                                |
| ------------ | -------------------------------------- |
| Pandas       | Data manipulation and feature creation |
| NumPy        | Numerical operations                   |
| Scikit-learn | Preprocessing and feature engineering  |
| Matplotlib   | Visualization                          |
| Seaborn      | Data exploration and visualization     |

---

# 📝 Practical Exercises

The notebook for this topic should practice:

* Creating numerical features
* Creating ratio features
* Creating interaction features
* Extracting date features
* Encoding categorical variables
* Standard scaling
* Min-Max scaling
* Missing-value indicators
* Detecting low-information features
* Handling high-cardinality categories
* Building preprocessing pipelines
* Using `ColumnTransformer`
* Creating polynomial features
* Applying PCA
* Selecting useful features
* Checking for data leakage

---

# 💡 How to Use With YOUR Data

Replace the sample-data cell with your own dataset:

```python
import pandas as pd

df = pd.read_csv("your_file.csv")
```

Then update the column names used throughout the notebook according to your dataset.

For example:

```python
df["new_feature"] = (
    df["your_column_1"] /
    df["your_column_2"]
)
```

The exact feature engineering steps should always depend on the structure and meaning of your dataset.

---

# 🎯 Key Takeaways

* Features are the information used by Machine Learning models.
* Feature Engineering converts raw data into useful model inputs.
* Features can be created, transformed, extracted, and selected.
* Numerical and categorical features require different preprocessing.
* Date/time information can often produce useful features.
* Ratios and interactions can capture meaningful relationships.
* Missingness can sometimes itself be a useful signal.
* High-cardinality features require careful handling.
* Scaling is important for many Machine Learning algorithms.
* PCA can reduce dimensionality.
* Too many features can increase complexity and overfitting.
* **Data leakage must be prevented.**
* Preprocessing should be fitted only on training data.
* `Pipeline` and `ColumnTransformer` help create safe, reproducible workflows.
* Feature engineering should be driven by both **data understanding and domain knowledge**.

---

# 🚀 Final Goal

The goal of Feature Engineering is not to create the largest number of features.

It is to create the **right features** that represent the underlying problem clearly and provide useful information to the Machine Learning model.

```text
Raw Data
   ↓
Understanding
   ↓
Feature Engineering
   ↓
Useful Features
   ↓
Machine Learning
   ↓
Better Learning
