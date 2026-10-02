# 00 — Setup and Environment

**Date: 01 January 2026**

## 📌 Overview

This module prepares the environment required for the **Machine Learning curriculum**.

The goal is to have a clean and reproducible setup for working with datasets, experiments, models, visualization, and notebooks.

---

## 🛠️ Python Environment

Create a virtual environment for the ML project:

```bash
python -m venv .venv
```

Activate it:

**Windows**

```bash
.venv\Scripts\activate
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

Check Python:

```bash
python --version
```

---

## 📦 Main Libraries

The core ML stack:

```text
Python
│
├── NumPy          → Numerical computing
├── Pandas         → Data manipulation
├── Matplotlib     → Visualization
├── Seaborn        → Statistical visualization
├── Scikit-learn   → Classical Machine Learning
├── XGBoost        → Gradient boosting
├── LightGBM       → Gradient boosting
├── CatBoost       → Gradient boosting
├── Jupyter        → Interactive notebooks
└── MLflow         → Experiment tracking
```

Install the main packages:

```bash
pip install numpy pandas matplotlib seaborn scikit-learn
pip install xgboost lightgbm catboost
pip install jupyter notebook mlflow
```

Save dependencies:

```bash
pip freeze > requirements.txt
```

---

## 📓 Jupyter Notebook

Jupyter will be used for:

* Exploring datasets
* Visualizing data
* Testing algorithms
* Running experiments
* Understanding model behavior

Start Jupyter:

```bash
jupyter notebook
```

A typical notebook workflow:

```text
Markdown
   ↓
Load Data
   ↓
Explore
   ↓
Preprocess
   ↓
Train Model
   ↓
Evaluate
   ↓
Experiment
```

---

## 🧰 Development Tools

Recommended setup:

* **VS Code** — main development environment
* **Jupyter Notebook** — experiments and learning
* **Git** — version control
* **GitHub** — project repository
* **Python virtual environment** — dependency isolation

Make sure VS Code is using the project's `.venv` interpreter.

---

## 📊 Datasets

During this curriculum, datasets can come from:

* Kaggle
* UCI Machine Learning Repository
* Scikit-learn datasets
* Open-source datasets
* Custom datasets

Always inspect a dataset before training:

```text
Rows / Columns
Missing Values
Duplicates
Data Types
Target Distribution
Class Balance
Outliers
```

Never immediately train a model without understanding the data first.

---

## 📁 Recommended Structure

```text
03-Machine-Learning/
│
├── 00-Setup-and-Environment/
│   ├── README.md
│   └── notebooks/
│
├── 01-ML-Fundamentals/
├── 02-Data-Preprocessing/
├── ...
├── 16-Model-Deployment/
│
├── datasets/
├── models/
├── notebooks/
└── requirements.txt
```

Keep datasets, trained models, notebooks, and source code organized instead of putting everything in one folder.

---

## 🔍 Verify the Environment

Run:

```python
import numpy
import pandas
import matplotlib
import seaborn
import sklearn
import xgboost
import lightgbm
import catboost

print("ML environment ready!")
```

Check Scikit-learn:

```python
import sklearn

print(sklearn.__version__)
```

---

## 🔄 Reproducibility

ML experiments can produce different results because of randomness.

Use a fixed random seed when appropriate:

```python
import numpy as np

np.random.seed(42)
```

Scikit-learn models commonly support:

```python
random_state=42
```

This helps make experiments easier to reproduce and compare.

---

## ⚠️ Common Setup Problems

### Package not found

Make sure the virtual environment is activated:

```bash
.venv\Scripts\activate
```

Then install the missing package.

### Wrong Python interpreter

Check:

```bash
where python
```

VS Code should point to the project's `.venv`.

### Jupyter using the wrong environment

Install the kernel inside the environment:

```bash
pip install ipykernel
```

Then select the correct kernel in VS Code/Jupyter.

---

## 🎯 Practice

Before moving to Module 01:

* [ ] Create `.venv`
* [ ] Install ML libraries
* [ ] Configure VS Code
* [ ] Run Jupyter
* [ ] Verify imports
* [ ] Create `requirements.txt`
* [ ] Test a Scikit-learn dataset
* [ ] Make one simple visualization
* [ ] Commit the setup to Git

---

## 🎤 Interview Questions

1. Why use a Python virtual environment?
2. What is Scikit-learn?
3. NumPy vs Pandas?
4. Why use Jupyter notebooks?
5. Why is reproducibility important in ML?
6. What is `random_state`?
7. Why should dependencies be stored in `requirements.txt`?

---

## ✅ Key Takeaways

* Python is the main language for this ML curriculum.
* **Scikit-learn** is the primary classical ML framework.
* NumPy and Pandas handle numerical and tabular data.
* Matplotlib and Seaborn handle visualization.
* XGBoost, LightGBM, and CatBoost provide powerful boosting algorithms.
* Jupyter is useful for experiments and learning.
* Virtual environments keep dependencies isolated.
* Reproducible experiments make ML development easier.

### Next → **01 — ML Fundamentals**
