# 🔵 06 — Clustering

**Date:** 13 January 2026
**Level:** Intermediate
**Goal:** Learn how Machine Learning can discover **groups and hidden patterns in unlabeled data**.

---

## 📌 1. What is Clustering?

**Clustering** is an unsupervised Machine Learning technique that groups similar data points together.

Unlike supervised learning, there is **no target label**.

```text
Supervised:
X + y → Model → Prediction

Clustering:
X → Clustering Algorithm → Groups
```

Example:

```text
Customer Data
     ↓
Clustering
     ↓
┌──────────┐
│ Group 1  │ → High-value customers
│ Group 2  │ → Regular customers
│ Group 3  │ → Low-activity customers
└──────────┘
```

The algorithm discovers the groups from the data rather than being given the group names.

---

# 📍 2. What Makes Data Points Similar?

Clustering algorithms need some way to measure similarity or distance.

A common choice is **Euclidean distance**:

$$
d(x,y)=\sqrt{\sum_{i=1}^{n}(x_i-y_i)^2}
$$

For two points:

```text
A = (2, 3)
B = (5, 7)
```

$$
d=\sqrt{(5-2)^2+(7-3)^2}
$$

$$
=\sqrt{9+16}=5
$$

Smaller distance generally means the points are more similar.

⚠️ Because distance-based algorithms are affected by feature scales, **scaling is often important before clustering**.

---

# 🎯 3. K-Means Clustering

**K-Means** divides data into `K` clusters.

Example:

```text id="2l7y5g"
       🟢 🟢
    🟢 🟢

                  🔵 🔵
               🔵 🔵

       🟠
     🟠 🟠
```

If:

```text
K = 3
```

the algorithm tries to create three groups.

### How K-Means Works

1. Choose `K`
2. Initialize cluster centroids
3. Assign each point to the nearest centroid
4. Recalculate centroids
5. Repeat until the assignments stabilize

```text id="m08i8r"
Points
  ↓
Initialize centroids
  ↓
Assign points
  ↓
Update centroids
  ↓
Repeat
  ↓
Final clusters
```

### Scikit-learn

```python id="g4b1st"
from sklearn.cluster import KMeans

model = KMeans(
    n_clusters=3,
    random_state=42,
    n_init="auto"
)

labels = model.fit_predict(X)
```

`labels` contains the cluster assigned to each observation.

---

# 📐 4. Choosing K — Elbow Method

One challenge with K-Means is deciding how many clusters to use.

The **Elbow Method** compares the clustering cost for different values of `K`.

```python id="qz7kn2"
from sklearn.cluster import KMeans

inertias = []

for k in range(2, 11):
    model = KMeans(
        n_clusters=k,
        random_state=42,
        n_init="auto"
    )
    model.fit(X)
    inertias.append(model.inertia_)
```

Then plot:

```text id="h75f2g"
Inertia
  │\
  │ \
  │  \
  │   \__
  │      \__
  └──────────── K
       ↑
     Elbow
```

The "elbow" can provide a useful candidate for `K`, but it is not a guaranteed answer.

---

# 🌳 5. Hierarchical Clustering

Hierarchical clustering creates a hierarchy of clusters.

A common approach is **agglomerative clustering**.

It starts with every point as its own cluster:

```text id="n8k3da"
A  B  C  D  E
```

Then repeatedly combines the closest groups:

```text id="o9ppgy"
A+B    C+D    E
  ↓
 A+B   C+D+E
  ↓
 A+B+C+D+E
```

The hierarchy can be visualized using a **dendrogram**.

```text id="a3p0bz"
       ┌─────────────┐
   ┌───┤             ├───┐
   A   B             C   └──D
```

### Scikit-learn

```python id="5x3y3b"
from sklearn.cluster import AgglomerativeClustering

model = AgglomerativeClustering(
    n_clusters=3
)

labels = model.fit_predict(X)
```

Hierarchical clustering is useful when understanding relationships between groups is important.

---

# 🌐 6. DBSCAN

**DBSCAN** stands for **Density-Based Spatial Clustering of Applications with Noise**.

Instead of requiring you to specify the number of clusters, it identifies regions with sufficiently high point density.

```text id="xg6qzh"
🟢 🟢 🟢
🟢 🟢

                 🔵 🔵
               🔵 🔵 🔵

                         ⚪
```

The isolated `⚪` can be classified as **noise/outlier**.

Important parameters:

### `eps`

Maximum neighborhood distance.

### `min_samples`

Minimum number of nearby points required to form a dense region.

```python id="7o2t5a"
from sklearn.cluster import DBSCAN

model = DBSCAN(
    eps=0.5,
    min_samples=5
)

labels = model.fit_predict(X)
```

DBSCAN can find irregularly shaped clusters and identify noise.

---

# 🧪 7. Gaussian Mixture Models — GMM

A **Gaussian Mixture Model** assumes the data comes from a mixture of several Gaussian probability distributions.

Instead of saying:

```text id="5m8vpx"
Point → Cluster 1
```

GMM can give probabilities:

```text id="q6i8y9"
Point A:
Cluster 1 → 0.80
Cluster 2 → 0.20
```

This is called **soft clustering**.

K-Means generally gives hard assignments:

```text id="m9zj5u"
Point → Cluster 1
```

### Scikit-learn

```python id="v5p0ha"
from sklearn.mixture import GaussianMixture

model = GaussianMixture(
    n_components=3,
    random_state=42
)

model.fit(X)

labels = model.predict(X)
probabilities = model.predict_proba(X)
```

---

# 📊 8. Silhouette Score

How do we evaluate clustering when we don't have true labels?

One useful metric is the **Silhouette Score**.

It measures how well each point fits within its own cluster compared with other clusters.

The score ranges approximately from:

```text id="u7f0a8"
-1 → Poor separation
 0 → Overlapping clusters
+1 → Strong separation
```

Scikit-learn:

```python id="d3k0nq"
from sklearn.metrics import silhouette_score

score = silhouette_score(X, labels)

print(score)
```

A higher score generally indicates better-separated clusters, but domain knowledge and visualization should also be considered.

---

# ⚖️ 9. Comparing Clustering Algorithms

| Algorithm        | Main Idea                 | Strength                       |
| ---------------- | ------------------------- | ------------------------------ |
| **K-Means**      | Centroid-based            | Simple and fast                |
| **Hierarchical** | Cluster hierarchy         | Shows relationships            |
| **DBSCAN**       | Density-based             | Finds noise & irregular shapes |
| **GMM**          | Probability distributions | Soft cluster assignment        |

---

# 🧠 10. K-Means vs DBSCAN

|                    | K-Means                         | DBSCAN                    |
| ------------------ | ------------------------------- | ------------------------- |
| Number of clusters | Usually required                | Not directly required     |
| Cluster shape      | Best for roughly compact groups | Can find irregular shapes |
| Outliers           | Assigns points to clusters      | Can identify noise        |
| Main parameters    | `K`                             | `eps`, `min_samples`      |
| Distance-sensitive | Yes                             | Yes                       |

---

# 🛒 11. Real-World Example

Imagine an e-commerce company has:

```text
Annual Spending
Purchase Frequency
Average Order Value
```

There are no predefined customer groups.

Apply clustering:

```text id="q8k7jp"
Customer Data
     ↓
Scale Features
     ↓
K-Means
     ↓
Cluster 0
Cluster 1
Cluster 2
```

You might then analyze the characteristics of each cluster and assign business-friendly descriptions such as:

```text
Cluster 0 → High spending / frequent buyers
Cluster 1 → Low spending / occasional buyers
Cluster 2 → Medium spending / frequent buyers
```

The algorithm creates the clusters; **you interpret what they mean**.

---

# ⚠️ 12. Common Clustering Problems

### Wrong Feature Scale

```text
Income = 500,000
Age = 25
```

Income can dominate distance calculations.

**Solution:** Scale features when appropriate.

### Wrong Number of Clusters

For K-Means, choosing `K` poorly can produce meaningless groups.

Use:

* Elbow method
* Silhouette score
* Domain knowledge

### Assuming Every Cluster Has Business Meaning

A mathematically separated cluster isn't automatically a meaningful real-world segment.

Always inspect the resulting groups.

---

# 📝 Practice

Use a customer dataset and:

1. Select useful numerical features.
2. Scale the features.
3. Apply K-Means.
4. Test several values of `K`.
5. Use the Elbow Method.
6. Calculate Silhouette Score.
7. Try DBSCAN.
8. Try Hierarchical Clustering.
9. Try GMM.
10. Visualize the resulting clusters.

---

# 🎯 Interview Questions

1. What is clustering?
2. Supervised vs unsupervised learning?
3. How does K-Means work?
4. What is a centroid?
5. How do you choose K?
6. What is the Elbow Method?
7. What is Hierarchical Clustering?
8. What is a dendrogram?
9. How does DBSCAN work?
10. What are `eps` and `min_samples`?
11. How does DBSCAN handle outliers?
12. What is a Gaussian Mixture Model?
13. Hard vs soft clustering?
14. What is the Silhouette Score?
15. Why should features often be scaled before clustering?

---

# ✅ Key Takeaways

```text id="m2q4q9"
Clustering
     ↓
Unsupervised Learning
     ↓
Find groups in unlabeled data
```

### Main algorithms

```text id="6y7t2n"
K-Means
   ↓
Centroid-based clusters

Hierarchical
   ↓
Cluster hierarchy

DBSCAN
   ↓
Density + noise detection

GMM
   ↓
Probability-based soft clustering
```

**Remember:**

> **K-Means = centroids**
> **Hierarchical = hierarchy**
> **DBSCAN = density + noise**
> **GMM = probability distributions**

### Next → `07-Dimensionality-Reduction`
