# 📉 07 — Dimensionality Reduction

**Date:** 15 January 2026
**Level:** Intermediate
**Goal:** Learn how to reduce the number of features while preserving useful information and structure in the data.

---

## 📌 1. What is Dimensionality Reduction?

**Dimensionality reduction** means reducing the number of input features in a dataset.

Suppose we have:

```text
Dataset
100 features
     ↓
Dimensionality Reduction
     ↓
10 useful dimensions
```

Why do this?

* Reduce computational cost
* Remove redundant information
* Reduce noise
* Help visualization
* Reduce overfitting in some situations
* Make high-dimensional data easier to understand

---

# 🧠 2. Feature Selection vs Dimensionality Reduction

These are related but different.

### Feature Selection

Select existing features.

```text
Age
Salary
Height
Weight
Experience
     ↓
Age
Salary
Experience
```

The original features remain unchanged.

### Dimensionality Reduction

Create **new representations** from existing features.

```text
Age + Salary + Height + Weight
             ↓
       Transformation
             ↓
        Component 1
        Component 2
```

The new dimensions may not directly correspond to individual original features.

---

# 📐 3. PCA — Principal Component Analysis

**PCA** is one of the most important dimensionality-reduction techniques.

Its goal is to transform the original features into a smaller number of **principal components** that capture as much variance as possible.

Example:

```text
Original:

Feature 2
   │    • •
   │  • •
   │ •
   └────────── Feature 1
```

If the data mainly varies along one direction, PCA can represent much of that information using one component.

```text
Feature 2
   │
   │   ╱
   │ ╱  → Principal Component 1
   │╱
   └──────── Feature 1
```

---

# 🔢 4. PCA Intuition

PCA approximately follows these steps:

```text
Original Data
     ↓
Center / scale data when appropriate
     ↓
Find directions of maximum variance
     ↓
Rank principal components
     ↓
Select top components
     ↓
Transform data
```

### Principal Component

A principal component is a new direction formed from a combination of the original features.

For example:

$$
PC_1 = w_1x_1+w_2x_2+w_3x_3
$$

The first component captures the greatest possible variance, the second captures the greatest remaining variance subject to being orthogonal to the first, and so on.

---

# 💻 5. PCA with Scikit-Learn

```python id="n0yqmi"
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)

X_reduced = pca.fit_transform(X_scaled)

print(X_reduced.shape)
```

You can inspect how much variance each component explains:

```python id="f8cc4y"
print(pca.explained_variance_ratio_)
```

Example:

```text id="8p8e9x"
PC1 → 0.60
PC2 → 0.25
PC3 → 0.10
PC4 → 0.05
```

The first two components explain:

```text
60% + 25% = 85%
```

of the variance represented by these components.

---

# 🎯 6. Choosing Number of Components

Instead of arbitrarily choosing `2`, you can choose enough components to preserve a desired amount of variance.

```python id="3xj3j4"
pca = PCA(n_components=0.95)

X_reduced = pca.fit_transform(X_scaled)
```

This asks PCA to retain approximately **95% of the variance**.

Another approach is to inspect:

```python id="o6k5bp"
pca.explained_variance_ratio_
```

and choose an appropriate number of components.

---

# ⚠️ 7. Why Scaling Matters for PCA

PCA is affected by feature magnitude.

Suppose:

```text
Age       → 18–80
Salary    → 30,000–500,000
```

Salary has a much larger numerical scale.

Without appropriate scaling, it can dominate the variance calculation.

A common workflow is:

```text id="8r8u5s"
Raw Features
     ↓
StandardScaler
     ↓
PCA
     ↓
Reduced Features
```

However, whether scaling is appropriate depends on the meaning and units of the features.

---

# 🧭 8. t-SNE

**t-SNE (t-distributed Stochastic Neighbor Embedding)** is mainly used to visualize high-dimensional data in 2D or 3D.

Example:

```text id="0d2e6f"
100-dimensional data
        ↓
       t-SNE
        ↓
     2D plot
```

It tries to preserve **local neighborhood relationships**.

If similar points are close together in the original space, t-SNE attempts to keep them close in the visualization.

### Scikit-learn

```python id="p8pr1e"
from sklearn.manifold import TSNE

tsne = TSNE(
    n_components=2,
    random_state=42
)

X_2d = tsne.fit_transform(X)
```

### Important

t-SNE is primarily a **visualization technique**, not a general-purpose preprocessing step for production ML.

Its output can be sensitive to parameters and random initialization.

---

# 🌍 9. UMAP

**UMAP (Uniform Manifold Approximation and Projection)** is another nonlinear dimensionality-reduction technique.

Like t-SNE, it is commonly used to visualize high-dimensional datasets.

```text id="q3l8lm"
High-dimensional data
        ↓
       UMAP
        ↓
  2D / 3D representation
```

UMAP aims to preserve important local structure while also representing broader structure in the data.

Typical usage:

```python id="2zqz4p"
import umap

reducer = umap.UMAP(
    n_components=2,
    random_state=42
)

X_2d = reducer.fit_transform(X)
```

UMAP is widely used for exploratory analysis and visualization.

---

# 🏷️ 10. LDA — Linear Discriminant Analysis

There is an important distinction:

**LDA can mean two different things in ML.**

Here, we mean **Linear Discriminant Analysis** as a supervised dimensionality-reduction method.

Unlike PCA, LDA uses class labels.

### PCA

```text id="9z0m6p"
X only
 ↓
Find directions of high variance
```

### LDA

```text id="b9u0cc"
X + y
 ↓
Find directions that separate classes
```

LDA attempts to maximize separation between classes while reducing variation within each class.

```python id="lhj09a"
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

lda = LinearDiscriminantAnalysis(
    n_components=2
)

X_reduced = lda.fit_transform(X, y)
```

LDA is therefore useful when the target classes are known.

---

# ⚖️ 11. PCA vs t-SNE vs UMAP vs LDA

| Technique | Type      | Uses Labels? | Main Use                              |
| --------- | --------- | -----------: | ------------------------------------- |
| **PCA**   | Linear    |            ❌ | Compression / preprocessing           |
| **t-SNE** | Nonlinear |            ❌ | Visualization                         |
| **UMAP**  | Nonlinear |    Usually ❌ | Visualization / structure exploration |
| **LDA**   | Linear    |            ✅ | Class separation                      |

### Easy memory trick

```text id="z8q2zq"
PCA  → Preserve variance
t-SNE → Preserve local neighborhoods
UMAP → Preserve manifold/local structure
LDA  → Separate classes
```

---

# 🔥 12. Curse of Dimensionality

As the number of dimensions increases, many ML problems become harder.

Problems can include:

* More computation
* Sparse data
* Greater distance between observations
* More difficult visualization
* Increased risk of overfitting

This is known as the **curse of dimensionality**.

Dimensionality reduction can sometimes help by creating a more compact representation.

---

# 🧪 13. Practical Workflow

Suppose you have a dataset with 100 features:

```text id="0d5yd5"
100 Features
     ↓
Remove irrelevant features
     ↓
Scale when appropriate
     ↓
PCA
     ↓
20 Components
     ↓
ML Model
```

For visualization:

```text id="7h9c1m"
100 Features
     ↓
PCA / UMAP / t-SNE
     ↓
2D
     ↓
Plot
     ↓
Inspect patterns
```

Do not automatically reduce dimensions just because you can. Check whether the reduced representation actually helps your task.

---

# 📝 Practice

Use a dataset such as **Breast Cancer** or **Digits**.

Try:

1. Standardize the features.
2. Apply PCA.
3. Reduce to 2 components.
4. Check explained variance.
5. Try retaining 90–95% variance.
6. Visualize the result.
7. Try t-SNE.
8. Try UMAP.
9. Compare PCA and nonlinear visualizations.
10. Apply LDA using the target labels.

---

# 🎯 Interview Questions

1. What is dimensionality reduction?
2. Feature selection vs dimensionality reduction?
3. What is PCA?
4. What is a principal component?
5. Why can scaling be important before PCA?
6. What is explained variance?
7. How do you choose the number of PCA components?
8. What is the curse of dimensionality?
9. What is t-SNE mainly used for?
10. t-SNE vs PCA?
11. What is UMAP?
12. What is Linear Discriminant Analysis?
13. PCA vs LDA?
14. Which dimensionality-reduction techniques are supervised?

---

# ✅ Key Takeaways

```text
Dimensionality Reduction
          ↓
Fewer Dimensions
          ↓
Less Complexity + Easier Visualization
```

### Main techniques

```text
PCA
→ Linear
→ Unsupervised
→ Preserves variance

t-SNE
→ Nonlinear
→ Visualization
→ Preserves local neighborhoods

UMAP
→ Nonlinear
→ Visualization / structure

LDA
→ Linear
→ Supervised
→ Separates classes
```

**Remember:**
**PCA is commonly useful for compact representations, while t-SNE and UMAP are primarily visualization/exploration tools.**

### Next → `08-Model-Evaluation`
