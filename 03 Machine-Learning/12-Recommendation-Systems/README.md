# 🎯 12 — Recommendation Systems

**Date:** 24 January 2026
**Folder:** `12-Recommendation-Systems`

---

## 🎯 Overview

A **Recommendation System** predicts what a user may want, based on information about the user, items, and interactions.

Examples:

* Netflix → movies/shows
* YouTube → videos
* Amazon → products
* Spotify → songs
* E-commerce → recommended products

Basic idea:

```text
User + Items + Past Behavior
            ↓
   Recommendation Model
            ↓
   Ranked Recommendations
```

The goal is not simply to predict a rating. It is often to **rank relevant items for each user**.

---

# 1. Main Recommendation Approaches

There are three important approaches:

```text
Recommendation Systems
├── Content-Based Filtering
├── Collaborative Filtering
└── Hybrid Systems
```

---

# 2. Content-Based Filtering

**Content-based filtering** recommends items similar to items the user already likes.

It uses **item features**.

Example:

```text
User likes:
→ Action
→ Sci-Fi
→ Superhero

Recommend:
→ Other Action/Sci-Fi/Superhero movies
```

For movies:

| Movie   | Genre          | Director   |
| ------- | -------------- | ---------- |
| Movie A | Action, Sci-Fi | Director X |
| Movie B | Action, Sci-Fi | Director Y |
| Movie C | Romance        | Director Z |

If the user likes Movie A, Movie B may be recommended because its features are similar.

### Basic Workflow

```text
User's Previous Likes
        ↓
Create User Profile
        ↓
Compare with Item Features
        ↓
Calculate Similarity
        ↓
Rank Items
```

Common similarity measure:

### Cosine Similarity

$$
cos(\theta)=\frac{A\cdot B}{||A||||B||}
$$

Values closer to `1` indicate greater directional similarity.

Example:

```python id="8l0m7z"
from sklearn.metrics.pairwise import cosine_similarity

similarity = cosine_similarity(item_matrix)
```

### Advantage

Works even when there are relatively few users because it can rely heavily on item information.

### Limitation

It may keep recommending items similar to what the user already knows and can struggle to introduce genuinely new types of content.

---

# 3. Collaborative Filtering

**Collaborative filtering** uses the behavior of many users to make recommendations.

Instead of asking:

> "What is this item about?"

it asks:

> "What did similar users like?"

Example:

```text
User A → Movie 1 ✓
User A → Movie 2 ✓
User B → Movie 1 ✓
User B → Movie 2 ?
```

Because User A and User B have similar preferences, Movie 2 may be recommended to User B.

---

# 4. User-Item Interaction Matrix

A common representation is a **user-item matrix**.

Example:

|        | Movie A | Movie B | Movie C |
| ------ | ------: | ------: | ------: |
| User 1 |       5 |       4 |       ? |
| User 2 |       5 |       ? |       4 |
| User 3 |       1 |       2 |       5 |

`?` represents an unknown interaction.

The system can use existing interactions to estimate what a user may prefer.

Interactions don't have to be ratings.

They can include:

```text
Click
View
Like
Purchase
Watch time
Add to cart
```

---

# 5. User-Based vs Item-Based

### User-Based Collaborative Filtering

Find users with similar behavior.

```text
User A
  ↓
Similar Users
  ↓
Items they liked
  ↓
Recommendations
```

### Item-Based Collaborative Filtering

Find items that are commonly interacted with together.

```text
Item A
  ↓
Similar Items
  ↓
Recommend Similar Items
```

For large systems, item-based approaches can sometimes be easier to manage because item relationships can be relatively stable compared with constantly changing user-user relationships.

---

# 6. Matrix Factorization

A large user-item matrix is usually sparse.

**Matrix Factorization** represents users and items using lower-dimensional latent vectors.

Conceptually:

$$
R \approx U \times V^T
$$

Where:

* `R` → User-item interaction matrix
* `U` → User latent factors
* `V` → Item latent factors

Example:

```text
User Vector
[0.8, 0.2, 0.7]

        ×

Item Vector
[0.9, 0.1, 0.8]

        ↓

Preference Score
```

The latent factors might represent hidden preferences such as:

```text
Action preference
Comedy preference
Price sensitivity
Genre preference
```

The model learns these factors from interaction patterns rather than requiring us to manually define their meaning.

---

# 7. Collaborative Filtering with SVD

A common classical technique is **Singular Value Decomposition (SVD)**.

The idea is to decompose a large interaction matrix into lower-dimensional representations.

Conceptually:

```text
User × Item Matrix
        ↓
      SVD
        ↓
Latent User + Item Factors
        ↓
Predicted Preferences
```

A simple implementation can be built using libraries designed for recommender systems or matrix-factorization techniques.

---

# 8. Hybrid Recommendation Systems

A **hybrid system** combines multiple recommendation approaches.

Example:

```text
             ┌── Content-Based ──┐
User Data ───┤                   ├──→ Combined Score
             └ Collaborative ────┘
                         ↓
                   Recommendations
```

Example e-commerce system:

```text
Product similarity
        +
User purchase history
        +
Similar users
        +
Current session behavior
        ↓
Final Ranking
```

Hybrid systems can help address weaknesses that occur when using only one approach.

---

# 9. Cold Start Problem

One of the major recommendation-system challenges is **cold start**.

### New User

No interaction history exists.

```text
New User
   ↓
No history
   ↓
What should we recommend?
```

Possible solutions:

* Ask for preferences
* Use popular items
* Use demographic/context information where appropriate
* Use content-based recommendations
* Learn from the first few interactions

### New Item

A newly added product/movie has no interaction history.

Content-based information can help recommend it before enough interaction data exists.

---

# 10. Practical Recommendation Workflow

```text
Collect User + Item Data
          ↓
Create Interaction Matrix
          ↓
Clean / Transform Data
          ↓
Choose Approach
          ↓
Content / Collaborative / Hybrid
          ↓
Generate Candidate Items
          ↓
Calculate Scores
          ↓
Rank Recommendations
          ↓
Evaluate
          ↓
Deploy
```

A production recommendation system often has **candidate generation + ranking** rather than simply returning the nearest items.

---

# 🧪 Practice

1. Build a movie recommendation dataset.
2. Create a user-item interaction matrix.
3. Implement content-based recommendations using TF-IDF and cosine similarity.
4. Build a simple collaborative filtering system.
5. Experiment with matrix factorization.
6. Recommend similar products based on user purchase history.
7. Create a simple hybrid recommender.
8. Demonstrate the cold-start problem.
9. Rank the top 5 recommendations for a user.

---

# 🎤 Interview Questions

1. What is a recommendation system?
2. Content-based vs collaborative filtering?
3. What is a user-item interaction matrix?
4. User-based vs item-based collaborative filtering?
5. What is matrix factorization?
6. What is SVD?
7. What is cosine similarity?
8. What is the cold-start problem?
9. How can you recommend a new item with no interaction history?
10. Why use a hybrid recommendation system?
11. What is the difference between explicit and implicit feedback?
12. Why is ranking important in recommendation systems?

---

# ✅ Key Takeaways

* **Content-Based Filtering** → recommends items similar to what the user already likes.
* **Collaborative Filtering** → uses patterns across users and items.
* **User-Based** → finds similar users.
* **Item-Based** → finds similar items.
* **Matrix Factorization** → learns latent user/item representations.
* **Hybrid Systems** → combine multiple recommendation approaches.
* **Cosine Similarity** → commonly measures vector similarity.
* **Cold Start** → problem of new users/items with little or no history.
* Real systems often **generate candidates and then rank them**.

---

### ➡️ Next

**13 — NLP Basics** → Text Preprocessing, Bag of Words, TF-IDF, Word Embeddings, and Sentiment Analysis.
