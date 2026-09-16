# 🧠 Breast Cancer Classification — Machine Learning Project

## 📌 Project Overview

This project builds an end-to-end Machine Learning classification system that predicts whether a breast tumor is:

- **Malignant** — cancerous
- **Benign** — non-cancerous

The project uses the **Breast Cancer Wisconsin dataset** provided by Scikit-learn.

The goal is not simply to train one model. The project demonstrates a complete Machine Learning workflow:



```
text

Dataset
   ↓
Data Understanding
   ↓
Exploratory Data Analysis
   ↓
Data Cleaning
   ↓
Feature Selection
   ↓
Train/Test Split
   ↓
Preprocessing
   ↓
Pipelines
   ↓
Multiple ML Models
   ↓
Model Comparison
   ↓
Cross-Validation
   ↓
Hyperparameter Tuning
   ↓
Learning Curves
   ↓
Validation Curves
   ↓
PCA Experiment
   ↓
Final Model
   ↓
Model Evaluation
   ↓
ROC-AUC
   ↓
Feature Importance
   ↓
Probability Prediction
   ↓
Save / Load Model
   ↓
Prediction Function
   ↓
API / Deployment Ready
```

> **Important:** This project is for Machine Learning education and demonstration. It is **not a clinically validated medical diagnostic system**.

---



## 🎯 Project Goal

The main objective is to train a Machine Learning model that can learn patterns from tumor measurements and predict the tumor diagnosis.

Conceptually:

```text
Tumor Measurements
        ↓
Machine Learning Model
        ↓
Malignant / Benign
```

The model learns from historical examples where the correct diagnosis is already known.

This makes the problem a **Supervised Machine Learning Classification** problem.

---

## 🧠 What Type of Machine Learning Is This?

This project uses:

### Supervised Learning

We have:

* Input data → tumor measurements
* Known output → malignant or benign

Therefore, the model learns:

```text
X → y
```

Where:

```text
X = Tumor features
y = Tumor diagnosis
```

---

## 📊 Dataset

The dataset comes from:

**Breast Cancer Wisconsin Dataset**

It contains:

* **569 samples**
* **30 numerical features**
* **1 target column**

After converting the dataset into a Pandas DataFrame:

```text
569 rows × 31 columns
```

The 31 columns consist of:

```text
30 features + 1 target
```

---

## 🔬 What Does One Row Represent?

Each row represents one tumor/sample.

The features describe properties of the tumor calculated from digitized images of breast mass samples.

Examples include:

```text
mean radius
mean texture
mean perimeter
mean area
mean smoothness
mean compactness
mean concavity
mean concave points
...
worst radius
worst texture
worst perimeter
worst area
...
```

These measurements are used by the Machine Learning model to learn patterns associated with the two classes.

---

## 🎯 Target Variable

The target contains two classes:

```text
0 → Malignant
1 → Benign
```

So the model's task is:

```text
30 tumor measurements
        ↓
      Model
        ↓
0 = Malignant
1 = Benign
```

---

## 📦 Loading the Dataset

We loaded the built-in dataset using:

```python
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
```

Scikit-learn provides the dataset as a structured object containing:

```text
data
target
target_names
feature_names
DESCR
...
```

We then converted the feature data into a Pandas DataFrame:

```python
df = pd.DataFrame(
    data.data,
    columns=data.feature_names
)

df["target"] = data.target
```

This gave us a normal tabular dataset that can easily be analyzed using Pandas.

---

## 🔍 Exploratory Data Analysis (EDA)

Before training Machine Learning models, we first explored the dataset.

EDA helps answer:

* How large is the dataset?
* What types of features exist?
* Are there missing values?
* Are there duplicate rows?
* How are the classes distributed?
* Are there outliers?
* Which features are correlated?

### Dataset Shape

The dataset contains:

```text
569 samples
30 features
```

plus the target column.

### Missing Values

We checked for missing values.

Result:

```text
No missing values
```

This means we did not need to perform missing-value imputation.

This is important because preprocessing should be based on the actual data rather than adding unnecessary transformations.

### Duplicate Rows

We also checked for duplicate records.

Duplicate rows can cause problems because the same observation could appear multiple times during training.

We removed duplicate rows using:

```python
df = df.drop_duplicates()
```

---

## 📊 Target Distribution

The dataset contains approximately:

```text
Malignant → 212
Benign    → 357
```

The classes are therefore not perfectly balanced.

However, the dataset is not extremely imbalanced either.

Because this is a classification problem, we therefore evaluate the model using more than accuracy.

We also use:

* Precision
* Recall
* F1-score
* Confusion Matrix
* ROC-AUC

---

## 📈 Feature Distributions

We visualized numerical feature distributions using histograms.

This helps us understand:

* Typical feature values
* Spread
* Skewness
* Possible unusual values

Different features have very different numerical scales.

For example:

```text
radius → around tens
area → hundreds/thousands
```

This becomes important later when using algorithms that are sensitive to feature scale.

---

## 🔥 Feature Correlation

We used a correlation heatmap to understand relationships between features.

Many features are strongly correlated.

For example:

```text
radius
perimeter
area
```

are naturally related because they describe different measurements of the same physical property.

High correlation can create redundant information.

This is one reason why we experimented with:

* Feature Selection
* PCA

---

## 📦 Outlier Analysis

Boxplots were used to inspect possible outliers.

An outlier is a value that is unusually far from the typical range.

Important:

> An outlier is not automatically a bad value.

In a medical dataset, unusual measurements may represent real observations.

Therefore, we inspected the outliers instead of blindly deleting them.

---

## 🧹 Data Cleaning

After EDA, we prepared the data for Machine Learning.

We separated:

```python
X = df.drop("target", axis=1)
y = df["target"]
```

Where:

### X — Features

Contains the 30 tumor measurements.

```text
X =
radius
texture
perimeter
area
...
```

### y — Target

Contains the diagnosis:

```text
0 → Malignant
1 → Benign
```

---

## ✂️ Train/Test Split

We divided the dataset into training and testing data.

```python
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

Result:

```text
Training samples → 455
Testing samples  → 114
```

### Why Split the Data?

The model needs data to learn from and separate data to evaluate itself.

Think of it like:

```text
Training Data
      ↓
Model learns patterns

Testing Data
      ↓
Model takes final exam
```

The test data should remain unseen during training.

Otherwise, we would not know whether the model can generalize to new data.

---

## 🎯 Why Did We Use `stratify=y`?

The dataset contains two classes.

`stratify=y` keeps approximately the same class distribution in both training and testing sets.

Without stratification, we could accidentally create a train/test split with noticeably different class proportions.

---

## 🎯 Feature Selection

We used:

```python
SelectKBest
```

with:

```python
f_classif
```

to select the top 10 features.

Originally:

```text
30 features
```

After selection:

```text
10 features
```

The selected features were:

```text
mean radius
mean perimeter
mean area
mean concavity
mean concave points
worst radius
worst perimeter
worst area
worst concavity
worst concave points
```

### Why Feature Selection?

Feature selection asks:

> Do we really need every feature?

Using fewer features can potentially:

* Simplify the model
* Reduce noise
* Improve interpretability
* Reduce computational cost
* Sometimes improve generalization

The feature selector was fitted only on the training data to avoid data leakage.

For production-level cross-validation and tuning, feature selection should be placed inside the Pipeline.

---

## ⚖️ Feature Scaling

Some Machine Learning algorithms are sensitive to feature magnitude.

For example:

```text
radius = 15
area = 700
```

These values are on very different scales.

Algorithms such as:

* Logistic Regression
* KNN
* SVM

can benefit from scaling.

We used:

```python
StandardScaler()
```

Conceptually:

```text
Original Features
       ↓
StandardScaler
       ↓
Features on comparable scale
       ↓
Machine Learning Model
```

---

## 🔗 Pipelines

One of the most important concepts in this project is the Scikit-learn Pipeline.

Example:

```python
Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])
```

The Pipeline connects preprocessing and model training into one workflow.

```text
Raw Data
   ↓
StandardScaler
   ↓
Logistic Regression
   ↓
Prediction
```

### Why Use a Pipeline?

Without a Pipeline, preprocessing can easily be performed incorrectly.

For example, scaling the entire dataset before cross-validation can cause **data leakage**.

A Pipeline ensures that transformations are fitted correctly inside each training process.

It also makes the final model easier to save and deploy.

---

## 🤖 Models Tested

We compared seven different classification algorithms.

### 1. Logistic Regression

Despite its name, Logistic Regression is a classification algorithm.

It calculates the probability of belonging to a class.

Conceptually:

```text
Features
   ↓
Logistic Regression
   ↓
Probability
   ↓
Class
```

It performed extremely well on this dataset.

### 2. K-Nearest Neighbors (KNN)

KNN predicts a sample based on nearby training examples.

Conceptually:

```text
New Sample
    ↓
Find nearby samples
    ↓
Look at their classes
    ↓
Choose the dominant class
```

KNN is sensitive to feature scale, so we used StandardScaler.

### 3. Naive Bayes

Naive Bayes is a probabilistic classification algorithm.

It estimates how likely a sample belongs to each class based on its features.

It is fast and simple, but performed below the strongest models in this project.

### 4. Support Vector Machine (SVM)

SVM tries to find a decision boundary that separates the classes.

Conceptually:

```text
Malignant samples | Benign samples
        ← Decision Boundary →
```

SVM performed extremely well and became our second strongest model based on cross-validation.

### 5. Decision Tree

A Decision Tree makes decisions through a sequence of questions.

Conceptually:

```text
Is radius > X?
      ↓
    Yes / No
      ↓
Is area > Y?
      ↓
    Yes / No
      ↓
Prediction
```

Decision Trees are easy to understand but can overfit if not controlled.

### 6. Random Forest

Random Forest combines many Decision Trees.

Conceptually:

```text
Tree 1 ─┐
Tree 2 ─┤
Tree 3 ─┤
Tree 4 ─┤ → Combined Prediction
Tree 5 ─┤
...     ┘
```

The combination of many trees usually makes the model more robust than a single Decision Tree.

### 7. Gradient Boosting

Gradient Boosting builds models sequentially.

Each new model tries to improve the errors made by previous models.

Conceptually:

```text
Model 1
   ↓
Find errors
   ↓
Model 2 improves errors
   ↓
Find remaining errors
   ↓
Model 3 improves them
   ↓
Final model
```

---

## 📊 Baseline Model Results

The initial test-set comparison produced:

| Model               | Accuracy | Precision | Recall |     F1 |
| ------------------- | -------: | --------: | -----: | -----: |
| Logistic Regression |   98.25% |    98.61% | 98.61% | 98.61% |
| SVM                 |   98.25% |    98.61% | 98.61% | 98.61% |
| Gradient Boosting   |   95.61% |    94.67% | 98.61% | 96.60% |
| Random Forest       |   95.61% |    95.89% | 97.22% | 96.55% |
| KNN                 |   95.61% |    95.89% | 97.22% | 96.55% |
| Naive Bayes         |   92.98% |    94.44% | 94.44% | 94.44% |
| Decision Tree       |   91.23% |    95.59% | 90.28% | 92.86% |

At this stage, Logistic Regression and SVM were the strongest models.

However, we did not immediately select the final model.

---

## 🔄 Cross-Validation

A single train/test split can sometimes give a lucky or unlucky result.

Therefore, we used **5-Fold Cross-Validation**.

Conceptually:

```text
Dataset
   ↓
Split into 5 folds

Fold 1 → Validation
Folds 2-5 → Training

Fold 2 → Validation
Folds 1,3,4,5 → Training

...
```

Every part of the training data gets a chance to become validation data.

---

## 📊 Cross-Validation Results

| Model               | Mean CV F1 | Std CV F1 |
| ------------------- | ---------: | --------: |
| Logistic Regression |     98.43% |     1.01% |
| SVM                 |     97.73% |     1.40% |
| KNN                 |     97.40% |     1.64% |
| Random Forest       |     96.84% |     1.51% |
| Gradient Boosting   |     96.50% |     1.06% |
| Naive Bayes         |     94.59% |     0.40% |
| Decision Tree       |     92.82% |     1.50% |

Logistic Regression had the highest mean CV F1-score.

Therefore, it became the leading candidate.

---

## 🎛️ Hyperparameter Tuning with GridSearchCV

Machine Learning algorithms have hyperparameters.

These are settings chosen before or during model training.

For example, SVM has:

```text
C
kernel
gamma
```

Instead of guessing the best values manually, we used:

```python
GridSearchCV
```

GridSearchCV tests multiple combinations and identifies the best-performing configuration using cross-validation.

### SVM Tuning

The best SVM configuration found was:

```text
C = 0.1
kernel = linear
gamma = scale
```

Best CV F1:

```text
98.28%
```

This was very close to Logistic Regression.

### Random Forest Tuning

Random Forest hyperparameters were also tested.

The best configuration found was:

```text
n_estimators = 200
max_depth = None
min_samples_split = 2
```

CV F1:

```text
96.84%
```

Tuning did not significantly improve Random Forest compared with its original configuration.

---

## 📉 Learning Curves

Learning curves help us understand whether a model is:

* Underfitting
* Overfitting
* Generalizing well

We compared:

```text
Training F1
      vs
Validation F1
```

For Logistic Regression:

```text
Training F1 ≈ 99.17%
Validation F1 ≈ 98.43%
```

The scores were close.

This suggests that the model does not have significant overfitting on this dataset.

---

## 🎚️ Validation Curves

Validation curves show how model performance changes when a hyperparameter changes.

We tested the SVM `C` parameter.

Results:

```text
C = 0.01 → underfitting
C = 0.1  → strong improvement
C = 1    → excellent
C = 10   → excellent
C = 100  → performance decreases
```

This demonstrated how hyperparameters can affect:

```text
Underfitting
     ↓
Good Fit
     ↓
Overfitting
```

---

## 🧩 PCA — Principal Component Analysis

PCA was used as an optional dimensionality-reduction experiment.

We started with:

```text
30 features
```

PCA reduced them to:

```text
10 components
```

while retaining:

```text
95.27% of the variance
```

Conceptually:

```text
30 Features
     ↓
    PCA
     ↓
10 Components
```

### Why PCA?

PCA can reduce the number of dimensions while preserving most of the information.

This can be useful when:

* There are many features
* Features are highly correlated
* Visualization is needed
* Computational efficiency matters

However, PCA was treated as an **experiment**, not automatically added to the final model.

The original Logistic Regression already performed extremely well and is easier to interpret.

---

## 🏆 Final Model

After comparing the models and evaluating their performance, **Logistic Regression** was selected as the final model.

The final architecture is:

```text
Input Features
      ↓
StandardScaler
      ↓
Logistic Regression
      ↓
Prediction + Probability
```

This entire process is stored inside one Pipeline.

---

## 📊 Final Model Evaluation

The final Logistic Regression model was evaluated on the unseen test set.

Results:

| Metric    |     Result |
| --------- | ---------: |
| Accuracy  | **98.25%** |
| Precision | **98.61%** |
| Recall    | **98.61%** |
| F1-score  | **98.61%** |
| ROC-AUC   | **99.54%** |

---

## 🎯 Accuracy

Accuracy measures the percentage of predictions that were correct.

The model achieved:

```text
98.25%
```

There were:

```text
114 test samples
```

and only:

```text
2 incorrect predictions
```

---

## 🎯 Precision

Precision answers:

> When the model predicts a class, how often is that prediction correct?

Result:

```text
98.61%
```

High precision means the model made very few incorrect positive predictions.

---

## 🎯 Recall

Recall answers:

> Out of the actual samples belonging to a class, how many did the model correctly identify?

Result:

```text
98.61%
```

Recall is especially important in many medical classification scenarios because missing an important case can have serious consequences.

---

## 🎯 F1-Score

F1-score combines Precision and Recall into a single metric.

Result:

```text
98.61%
```

The F1-score is useful when we want a balance between:

```text
Precision ↔ Recall
```

---

## 🧮 Confusion Matrix

The final confusion matrix was:

```text
[[41  1]
 [ 1 71]]
```

Conceptually:

```text
                    Predicted
                 Malignant  Benign

Actual Malignant     41       1

Actual Benign        1       71
```

Meaning:

```text
41 → Malignant correctly predicted
71 → Benign correctly predicted

1 → Malignant incorrectly predicted as Benign
1 → Benign incorrectly predicted as Malignant
```

Therefore:

```text
112 correct
2 incorrect
```

out of:

```text
114 total test samples
```

---

## 📈 ROC-AUC

ROC-AUC evaluates how well the model can distinguish between the two classes across different classification thresholds.

The model achieved:

```text
ROC-AUC = 0.9954
```

or:

```text
99.54%
```

A score close to 1.0 indicates excellent class separation on this dataset.

---

## 🎲 Probability Prediction

The model can provide more than just:

```text
Malignant
```

or:

```text
Benign
```

It can also provide probabilities.

We used:

```python
model.predict_proba()
```

The output has two probabilities:

```text
[P(Malignant), P(Benign)]
```

For example:

```text
[0.4665, 0.5335]
```

means approximately:

```text
Malignant → 46.65%
Benign    → 53.35%
```

The model predicts the class with the higher probability.

---

## 🔍 Feature Importance

For Logistic Regression, we examined the model coefficients.

The strongest features included:

```text
worst texture
radius error
worst concave points
worst area
worst radius
worst symmetry
area error
worst concavity
worst perimeter
worst smoothness
```

Because the features were standardized before Logistic Regression, coefficient magnitudes can be compared to understand relative model influence.

The coefficient sign represents the direction of influence toward the model's classes.

> Feature importance in a Machine Learning model should not be interpreted as medical causation.

---

## 💾 Model Saving

After training the final Pipeline, we saved it using Joblib:

```python
import joblib

joblib.dump(
    final_model,
    "breast_cancer_model.pkl"
)
```

The saved file contains the trained Machine Learning Pipeline.

---

## 📂 Why Save the Pipeline?

Without saving:

```text
Every application startup
        ↓
Retrain model
```

That would be inefficient.

Instead:

```text
Train Model
    ↓
Save Model
    ↓
Application starts
    ↓
Load Model
    ↓
Make Predictions
```

This is how a trained Machine Learning model can be reused.

---

## 🔄 Loading the Model

The saved model can later be loaded:

```python
loaded_model = joblib.load(
    "breast_cancer_model.pkl"
)
```

We successfully loaded the saved model.

This confirms that the trained Pipeline can be persisted and reused.

---

## 🔮 Final Prediction Function

A reusable function was created so that new feature data can be passed to the model.

Conceptually:

```text
New Tumor Measurements
          ↓
    Prediction Function
          ↓
     Saved ML Model
          ↓
 ┌────────┴─────────┐
 ↓                  ↓
Class          Probabilities
```

The function returns:

```text
Prediction
Malignant Probability
Benign Probability
```

This is an important step toward deploying the model as an API.

---

## 🚀 API / Deployment Ready Architecture

The trained model can later be connected to a FastAPI backend.

For example:

```text
Frontend / Mobile App
        ↓
      HTTP Request
        ↓
      FastAPI
        ↓
Loaded ML Pipeline
        ↓
Prediction
        ↓
Probability
        ↓
JSON Response
        ↓
Frontend
```

Example response:

```json
{
    "prediction": "Benign",
    "malignant_probability": 0.02,
    "benign_probability": 0.98
}
```

This is the basic architecture behind turning a Machine Learning model into an application.

---

## 🧠 What We Learned

This project covered a complete Machine Learning classification workflow.

### Data

* Dataset loading
* Pandas DataFrame
* Features
* Target
* Dataset inspection

### EDA

* Shape
* Data types
* Missing values
* Duplicate detection
* Target distribution
* Feature distributions
* Correlation analysis
* Outlier analysis

### Preprocessing

* Duplicate removal
* Feature/target separation
* Train/test split
* Stratified splitting
* Feature scaling
* Data leakage awareness

### Feature Engineering / Selection

* Feature selection
* SelectKBest
* ANOVA F-test
* PCA
* Dimensionality reduction

### Machine Learning Algorithms

* Logistic Regression
* KNN
* Naive Bayes
* SVM
* Decision Tree
* Random Forest
* Gradient Boosting

### Model Evaluation

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix
* Classification Report
* ROC Curve
* ROC-AUC

### Model Validation

* Cross-Validation
* 5-Fold Cross-Validation
* Learning Curves
* Validation Curves

### Model Optimization

* GridSearchCV
* Hyperparameter tuning
* Model comparison

### Deployment Preparation

* Probability prediction
* Joblib model saving
* Model loading
* Reusable prediction function
* API-ready architecture

---

## 🏁 Final Results

The final Logistic Regression model achieved:

```text
Accuracy  → 98.25%
Precision → 98.61%
Recall    → 98.61%
F1-score  → 98.61%
ROC-AUC   → 99.54%
```

The model made only:

```text
2 mistakes
```

on:

```text
114 unseen test samples
```

The project demonstrates how multiple Machine Learning concepts can be combined into one complete end-to-end workflow.

---

## 📁 Project Structure

```text
ML-Projects/
│
└── Project-2-Breast-Cancer-Classification/
    │
    ├── breast_cancer_classification.ipynb
    ├── breast_cancer_model.pkl
    └── README.md
```

---

## 🛠️ Technologies Used

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn
* Joblib
* Jupyter Notebook

---

## ⚠️ Disclaimer

This project is created for **Machine Learning learning and portfolio purposes**.

The model is not clinically validated and should **not** be used to diagnose, treat, or make medical decisions about real patients.

---

### One important point

Yes — this README now covers **the project as a whole**, not just "what code we typed."

The main thing I want you to remember is:

**The project wasn't about Breast Cancer specifically.** The breast-cancer dataset was the real-world problem we used to practice the **entire classification ML lifecycle**:

> **Data → Understand → Clean → Prepare → Train → Compare → Validate → Tune → Evaluate → Save → Predict → Deploy**.
```