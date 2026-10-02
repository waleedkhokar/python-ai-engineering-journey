# Machine Learning

> Classical Machine Learning Curriculum – from fundamentals to ML engineering

---

## 🎯 What is it?

This repository is your **complete, serious, job‑ready Machine Learning curriculum**.

It is designed to take you from:

ML fundamentals  
→ Mathematical foundations  
→ Data preprocessing  
→ Core algorithms (regression, classification, clustering, etc.)  
→ Model evaluation and hyperparameter tuning  
→ Feature selection and dimensionality reduction  
→ Anomaly detection, time series, recommendation systems, classical NLP  
→ ML pipelines, experiment tracking, interpretability, deployment  
→ Practical ML engineering & interview‑ready understanding  

This is **classical Machine Learning**, not Deep Learning.

---

## 🚀 Why Learn It?

Machine Learning is the foundation of:

- Real‑world prediction systems (churn, fraud, risk, pricing, demand forecasting, etc.).
- Recommendation engines, search ranking, segmentation, scoring systems.
- Many “AI” products that don’t require deep neural networks or LLMs.
- Feature‑driven solutions where data is mainly **tabular** or structured.

Even as Deep Learning and LLMs dominate headlines, **classical ML remains critical** because it is:

- Often **simpler, faster, more interpretable**.
- Better suited for **small/medium datasets**.
- Easier to **productionize and maintain** in many industry contexts.

This repo aims to give you **true mastery**, not just `.fit()` / `.predict()`.

---

## 🧠 Why Does It Exist?

Typical ML resources are:

- Too shallow (“What is X?” + one line of scikit‑learn code).
- Too mathematical, without code or experiments.
- Too library‑driven, treating ML as “call this function and hope it works”.
- Too scattered, without a clear progression or connection between topics.

This curriculum exists to provide a **coherent, deep, practical path**:

- **Mathematics + Intuition + Code** – always connected.
- **From‑scratch implementations** to understand algorithms internally.
- **Scikit‑learn usage** for professional workflows.
- **Real experiment design, debugging, and model comparison.**
- **Interview preparation** and **ML engineering practices**.

---

## 📚 What I Will Learn

By the end, you should be able to:

1. Understand ML concepts and terminology precisely.
2. Explain **how major algorithms work internally** (not just use them).
3. Understand and use **the mathematics** behind important methods.
4. Implement **simplified from‑scratch versions** (Python + NumPy).
5. Use **Scikit‑learn** in a professional way (pipelines, CV, tuning).
6. Work with real datasets and perform realistic **experiments**.
7. Tune hyperparameters and understand **why results change**.
8. Evaluate models correctly and choose appropriate **metrics**.
9. Diagnose and debug ML problems (overfitting, leakage, etc.).
10. Compare algorithms and choose among them for real problems.
11. Build **reproducible ML pipelines**.
12. Track experiments and report results clearly.
13. Interpret models and explain them to non‑technical stakeholders.
14. Deploy ML models and understand basic ML engineering.
15. Answer **interview questions** at beginner, intermediate, and advanced levels.
16. Solve real‑world ML problems, not just toy examples.

---

## 🔬 Core Concepts

This repository covers (at depth):

- **ML Fundamentals**
  - Supervised vs unsupervised vs semi‑supervised vs reinforcement (at high level).
  - Regression vs classification vs ranking vs clustering.
  - Bias/variance, underfitting, overfitting, generalization.
  - Baselines and problem framing.

- **Mathematical Foundations (ML‑focused)**
  - Linear algebra: vectors, matrices, dot products, norms, eigenvalues/eigenvectors.
  - Calculus: derivatives, gradients, optimization intuition.
  - Probability: conditional probability, Bayes’ theorem, likelihood.
  - Statistics: mean, variance, correlation, hypothesis testing concepts.
  - Optimization: objective/cost functions, gradient descent, convexity intuition.

- **Data Preprocessing**
  - Handling missing values, outliers.
  - Scaling/normalization, encoding, transformations.
  - Train/validation/test splitting, time‑aware splits.
  - Data leakage pitfalls.

- **Supervised Learning**
  - Linear Regression, Polynomial Regression.
  - Regularized Regression: Ridge, Lasso, ElasticNet.
  - Logistic Regression, KNN, Naive Bayes, SVM.
  - Decision Trees: regression & classification trees.
  - Ensemble Methods: Random Forests, Gradient Boosting (GBM), XGBoost, LightGBM, CatBoost.

- **Unsupervised Learning**
  - Clustering: K‑Means, Hierarchical, DBSCAN, GMM.
  - Dimensionality reduction: PCA, t‑SNE, UMAP (conceptual comparison).

- **Model Evaluation & Tuning**
  - Train/val/test splits, cross‑validation.
  - Metrics: RMSE, MAE, R², accuracy, precision, recall, F1, ROC‑AUC, PR curves.
  - Learning curves, validation curves.
  - Hyperparameter tuning: Grid Search, Random Search, Bayesian/Optuna (conceptual).
  - Bias‑variance trade‑off.

- **Feature Engineering & Selection**
  - Domain‑driven features.
  - Filter, wrapper, and embedded feature selection.
  - Regularization‑based selection, feature importance, permutation importance.

- **Specialized Topics**
  - Anomaly detection.
  - Time series forecasting basics.
  - Recommendation systems basics.
  - Classical NLP (Bag‑of‑Words, TF‑IDF, classical text classifiers).

- **ML Engineering**
  - Pipelines in Scikit‑learn.
  - Basic experiment tracking.
  - Model interpretability (global & local).
  - Model deployment basics.
  - Engineering practices: baselines, logging, reproducibility.

---

## 🧮 Mathematical Foundation

You will not just see formulas – you will:

- Learn **why** each formula exists.
- Understand **every symbol** in important equations.
- Work through **step‑by‑step numerical examples**.
- Connect formulas to actual algorithm steps.
- See how math maps to **code** and **model behavior**.

Mathematics is always used with purpose:

- Linear Regression:
  - Normal equations, gradient descent, loss landscapes.
- Logistic Regression:
  - Sigmoid, log‑odds, cross‑entropy.
- K‑Means:
  - Distances, centroid updates, convergence.
- PCA:
  - Covariance matrices, eigenvalues/eigenvectors, variance explained.
- Naive Bayes:
  - Bayes’ theorem, conditional independence assumption.
- SVM:
  - Margins, hyperplanes, kernel trick (intuitive math, not full proofs).

This is **ML‑level math**, not a separate math degree – but enough to really understand the algorithms.

---

## ⚙️ How It Works (Learning Style)

For each major algorithm or concept, we follow a deep progression:

1. **What is it?**
2. **Why does it exist?**
3. **What problem does it solve?**
4. Intuition & real‑world analogies.
5. Core components and internal mechanism.
6. Mathematical foundation and formulas.
7. Step‑by‑step numerical example.
8. Visual explanation (plots, boundaries, etc.).
9. Simplified **from‑scratch implementation** (Python + NumPy).
10. **Scikit‑learn implementation**.
11. Real‑dataset example.
12. Outputs & interpretation.
13. Hyperparameters & their effects.
14. Assumptions, advantages, limitations.
15. Common mistakes and failure modes.
16. Debugging and diagnostics.
17. Comparisons with alternative algorithms.
18. Real‑world applications and production notes.
19. Exercises (multiple levels).
20. Interview questions.
21. Key takeaways and connection to the next topic.

---

## 💻 Implementation

Primary tools:

- **Python** (already known).
- **NumPy** for from‑scratch implementations.
- **Pandas** for data handling.
- **Matplotlib/Seaborn** for visualizations.
- **Scikit‑learn** as the main ML library.
- **Statsmodels**, **XGBoost**, **LightGBM**, **CatBoost**, **Optuna**, **MLflow** where appropriate (practical introductions, not full frameworks).

We will not hide algorithm logic in opaque helpers; the goal is learning, not minimal lines of code.

---

## 📊 Examples & Datasets

We will use:

- Tiny hand‑crafted datasets for step‑by‑step walkthroughs.
- Synthetic datasets for controlled experiments.
- Realistic datasets such as:
  - Iris, Wine, Breast Cancer, Digits.
  - California Housing.
  - Titanic, Adult Income.
  - 20 Newsgroups (classical NLP).
  - Suitable time series datasets for forecasting basics.
  - Suitable recommendation datasets (conceptual, small‑scale).

We avoid unnecessarily huge datasets; you can download standard datasets programmatically via scikit‑learn or online sources.

---

## 🌍 Real-World Applications

You will practice reasoning from **problem → data → target → model**, not from algorithm first.

Examples:

- Customer churn prediction.
- Credit default prediction.
- Fraud detection (class imbalance).
- Price prediction (regression).
- Customer segmentation (clustering).
- Recommendation basics (user/item behavior).
- Text classification with classical NLP.

Each case forces reasoning about:

- Targets and features.
- Train/validation/test splits.
- Suitable metrics and baselines.
- Model selection and tuning.
- Interpretability and deployment implications.

---

## 🧪 Experiments

This curriculum emphasizes **experimentation** and **comparison**, not one fixed run.

Examples:

- Compare different **learning rates**, regularization strengths, K values, tree depths, number of estimators.
- Evaluate:

  - Training vs validation vs test scores.
  - Metric trade‑offs (accuracy vs recall vs F1).
  - Runtime and scalability.
  - Overfitting vs underfitting behavior.

You will learn to think:

> “Why did this model improve/worsen when I changed X?”

rather than:

> “The tutorial says set C = 1.0 so I will always do that.”

---

## ⚙️ Important Parameters (High-Level)

Key hyperparameters and concepts you will master:

- Regression:
  - Regularization strength (alpha, lambda).
  - Polynomial degree.
- KNN:
  - k, distance metric, weighting, scaling.
- SVM:
  - C, kernel, gamma, margin.
- Trees:
  - max_depth, min_samples_split, min_samples_leaf, max_features.
- Ensembles:
  - n_estimators, learning_rate, subsampling, regularization.
- Clustering:
  - Number of clusters K, distance metric, linkage (hierarchical), eps/min_samples (DBSCAN).
- PCA:
  - Number of components, variance explained.

You will see how each parameter affects **bias/variance**, decision boundaries, and performance.

---

## ⚠️ Common Mistakes & 🚨 Failure Modes

We explicitly teach how models fail and how to debug them.

Examples:

- **Overfitting**:
  - High train accuracy, low validation accuracy.
  - Very deep decision trees, too many parameters, no regularization.
- **Data leakage**:
  - Target leaking into features.
  - Using test data during preprocessing or tuning.
- **Imbalanced classification**:
  - High accuracy but terrible recall for minority class.
  - Using accuracy instead of F1/recall/PR curves.
- **Poor preprocessing**:
  - No scaling for distance‑based methods or SVMs.
  - Target included in scaling.
- **Bad hyperparameters**:
  - Wrong K in K‑Means, large gamma in RBF SVM, too large learning rate in boosting.

You will learn to **diagnose symptoms** (metrics, plots, behavior) and derive likely causes and fixes.

---

## 📊 Model Evaluation

You will learn evaluation deeply:

- Splits:
  - Train / validation / test.
  - K‑fold CV, stratified CV, time‑series splits.
- Metrics:
  - Regression: MAE, MSE, RMSE, R².
  - Classification: accuracy, precision, recall, F1, ROC‑AUC, PR‑AUC.
  - Ranking / recommendations: top‑k metrics (conceptual).
- Tools:
  - Confusion matrix.
  - ROC curves.
  - Precision‑recall curves.
  - Learning curves.
  - Validation curves.

The focus is on **choosing the right metric** for the problem and interpreting it correctly.

---

## 🔄 Comparisons & Model Selection

We do not teach algorithms in isolation.

You will compare:

- Linear vs Polynomial vs Ridge vs Lasso vs ElasticNet.
- Logistic Regression vs KNN vs Naive Bayes vs SVM vs Decision Trees.
- Decision Trees vs Random Forests.
- Random Forest vs Gradient Boosting vs XGBoost vs LightGBM vs CatBoost.
- K‑Means vs Hierarchical Clustering vs DBSCAN vs GMM.
- PCA vs t‑SNE vs UMAP (conceptual comparison).
- Grid Search vs Random Search vs Bayesian/Optuna.

For each comparison:

- Assumptions and requirements.
- Strengths and weaknesses.
- Interpretability.
- Scalability.
- When algorithm A is preferable to B.

---

## 🛠️ Practical Exercises

Every major folder will include **exercises** from basic to advanced:

- Manual calculations (e.g., impurity, distances, loss).
- Implement small algorithms (e.g., KNN from scratch).
- Change hyperparameters and observe effects.
- Identify overfitting / underfitting from curves.
- Diagnose data leakage scenarios.
- Compare multiple models on the same problem.
- Design train/val/test splits for given use cases.
- Choose evaluation metrics for given business problems.

---

## 💼 Interview Questions

Each major folder will have an `interview-questions.md` file, with:

- **Beginner**:
  - Definitions, terminology, concept checks.
- **Intermediate**:
  - Conceptual reasoning, implementation details.
- **Advanced**:
  - Mathematics, internal mechanisms, complexity.
- **Practical**:
  - Real‑world scenarios, debugging, model selection.

Example progressions:

- “What is Random Forest?”  
  → “Why does Random Forest reduce variance?”  
  → “How does bootstrap sampling work?”  
  → “How do random feature subsets help?”  
  → “How does prediction aggregation work?”  
  → “How do depth/max_features/n_estimators affect performance?”  
  → “When choose Random Forest vs Gradient Boosting?”  
  → “How to debug overfitting in a Random Forest?”

---

## 🧠 Knowledge Check

At the end of each major topic, you should ask yourself:

1. Can I explain it without notes?
2. Can I explain **why** it exists?
3. Can I explain **how** it works internally?
4. Do I understand its main mathematics?
5. Can I calculate a small numeric example?
6. Can I implement a simplified version from scratch?
7. Can I use Scikit‑learn properly?
8. Can I tune it and interpret hyperparameters?
9. Can I identify its failure modes and debug them?
10. Can I compare it with alternative algorithms?
11. Can I explain where it’s useful in the real world?
12. Can I answer common interview questions about it?

If the answer is **no** for several of these, revisit the topic.

---

## 📁 Repository Structure

```text
03-Machine-Learning/
│
├── 00-Setup-and-Environment/
├── 01-ML-Fundamentals/
├── 02-Mathematical-Foundations/
├── 03-Data-Preprocessing/
├── 04-Linear-Regression/
├── 05-Polynomial-and-Regularized-Regression/
├── 06-Logistic-Regression/
├── 07-KNN/
├── 08-Naive-Bayes/
├── 09-SVM/
├── 10-Decision-Trees/
├── 11-Ensemble-Methods/
├── 12-Clustering/
├── 13-Dimensionality-Reduction/
├── 14-Model-Evaluation/
├── 15-Hyperparameter-Tuning/
├── 16-Feature-Selection/
├── 17-Anomaly-Detection/
├── 18-Time-Series/
├── 19-Recommendation-Systems/
├── 20-NLP-with-Classical-ML/
├── 21-ML-Pipelines/
├── 22-Experiment-Tracking/
├── 23-Model-Interpretability/
├── 24-Model-Deployment/
├── 25-ML-Engineering-Practices/
│
├── Projects/        # Only used when explicitly requested
│
└── README.md        # (this file)




cat > README.md << 'EOF'
# 📘 03 — Machine Learning

Full Machine Learning curriculum — **30 days**, **17 modules + 4 real projects**.

## 📅 Timeline
- **Start:** Jan 1, 2026
- **End:** Jan 30, 2026
- **Duration:** 30 days

## 📁 Structure

| # | Folder | Date |
|---|--------|------|
| 01 | `00-Setup-and-Environment` | Jan 1 |
| 02 | `01-ML-Fundamentals` | Jan 2 |
| 03 | `02-Data-Preprocessing` | Jan 3 |
| 04 | `03-Regression` | Jan 5 |
| 05 | `04-Classification` | Jan 8 |
| 06 | `05-Ensemble-Methods` | Jan 11 |
| 07 | `06-Clustering` | Jan 13 |
| 08 | `07-Dimensionality-Reduction` | Jan 15 |
| 09 | `08-Model-Evaluation` | Jan 17 |
| 10 | `09-Hyperparameter-Tuning` | Jan 19 |
| 11 | `10-Feature-Selection` | Jan 20 |
| 12 | `11-Time-Series` | Jan 22 |
| 13 | `12-Recommendation-Systems` | Jan 24 |
| 14 | `13-NLP-Basics` | Jan 25 |
| 15 | `14-ML-Pipelines` | Jan 26 |
| 16 | `15-MLflow-and-Experiment-Tracking` | Jan 27 |
| 17 | `16-Model-Deployment` | Jan 28 |
| 18 | `Projects/01-House-Price-Prediction` | Jan 29 |
| 19 | `Projects/02-Breast-Cancer-Classification` | Jan 29 |
| 20 | `Projects/03-Customer-Segmentation` | Jan 30 |
| 21 | `Projects/04-Sales-Forecasting` | Jan 30 |

## 🎯 Goal
Go from zero to job-ready in classical Machine Learning — able to build, evaluate, and deploy real models end-to-end.

## ✅ How to Use
1. Work through folders **in order**.
2. Each folder has its own **README** with topics, deliverables, and completion criteria.
3. Do the **4 projects** at the end — they consolidate everything.
4. Commit daily with a descriptive message.

## 🔗 Next Step
After completion → **04 Deep-Learning** (Feb 1 → Feb 20, 2026).
EOF

echo "✅ Top-level README.md created."