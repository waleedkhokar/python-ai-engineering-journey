# 📊 05 — TF-IDF

**Date:** 29 January 2026
**Folder:** `05-TF-IDF`

---

# 📚 TF-IDF

## 🎯 Overview

**TF-IDF** stands for:

> **Term Frequency — Inverse Document Frequency**

It is a classical NLP technique used to convert text into numerical features while giving higher importance to words that are useful for a particular document.

The main idea is:

> **A word is important when it appears frequently in a document but does not appear frequently across many other documents.**

TF-IDF is widely used for:

* Text classification
* Document similarity
* Search
* Information retrieval
* Keyword identification
* Recommendation systems

The basic workflow is:

```text
Documents
   ↓
Vocabulary
   ↓
Term Frequency
   ↓
Inverse Document Frequency
   ↓
TF-IDF Scores
   ↓
Numerical Matrix
   ↓
Machine Learning
```

---

# 1. Why TF-IDF?

Bag of Words mainly tells us:

```text
How many times does a word appear?
```

But frequency alone does not tell us how **informative** a word is.

Suppose we have many documents containing:

```text
the
is
this
product
```

Words such as `the` may appear everywhere.

They are frequent but often not very useful for distinguishing documents.

TF-IDF attempts to reduce the importance of words that appear across many documents.

---

# 2. Term Frequency

**Term Frequency (TF)** measures how often a term appears in a document.

A simple formula is:

```text id="v5f8fi"
TF(t,d) =
count of term t in document d
--------------------------------
total number of terms in d
```

Example:

```text
Document:

"python python machine learning"
```

There are 4 total terms.

`python` appears 2 times:

```text
TF(python) = 2 / 4 = 0.5
```

`machine` appears once:

```text
TF(machine) = 1 / 4 = 0.25
```

So TF gives more weight to terms that appear more frequently within the document.

---

# 3. Inverse Document Frequency

**Inverse Document Frequency (IDF)** measures how rare or common a term is across the entire collection of documents.

A common simplified formula is:

```text id="yhyfso"
IDF(t) = log(N / df(t))
```

where:

* `N` = total number of documents
* `df(t)` = number of documents containing term `t`

### Example

Suppose:

```text id="z3ps5t"
Total documents = 100
```

A word appears in:

```text id="t9k4az"
5 documents
```

Then:

```text id="zv6qcw"
IDF = log(100 / 5)
```

The word receives a relatively high IDF because it is uncommon.

Now suppose another word appears in:

```text id="dr2z9a"
90 documents
```

Then:

```text id="u8gq9n"
IDF = log(100 / 90)
```

Its IDF is much lower.

---

# 4. Combining TF and IDF

The basic formula is:

```text id="e5w7rv"
TF-IDF = TF × IDF
```

Therefore:

```text
High TF
+
High IDF
=
High TF-IDF
```

A word receives a high score when:

```text id="lgy5mb"
It is frequent in the current document
+
It is relatively rare across the corpus
```

A word appearing in almost every document receives a lower score.

---

# 5. Simple Intuition

Imagine a collection of news articles.

The word:

```text id="7m3pqw"
"the"
```

may appear in almost every article.

It does not help distinguish one article from another.

But:

```text id="4r5j9n"
"cryptocurrency"
```

might appear frequently in a specific technology article but rarely in unrelated articles.

Therefore:

```text id="q4v6na"
"the"
→ low importance

"cryptocurrency"
→ potentially higher importance
```

This is the core intuition behind TF-IDF.

---

# 6. TF-IDF Matrix

Suppose we have:

```text id="yjjq9s"
Document 1:
"I love Python"

Document 2:
"I love machine learning"

Document 3:
"Python is powerful"
```

TF-IDF creates a numerical matrix:

```text id="qjq4qi"
             I    love    Python    machine    learning
Doc 1       ...    ...      ...        0          0
Doc 2       ...    ...       0         ...        ...
Doc 3       ...    ...      ...         0          0
```

Each value represents the TF-IDF weight of a term for a particular document.

The result is still generally a **sparse matrix** because most documents contain only a small portion of the vocabulary.

---

# 7. TF-IDF with Scikit-Learn

Scikit-learn provides:

```python id="o0mtj9"
from sklearn.feature_extraction.text import TfidfVectorizer
```

Example:

```python id="1izwml"
from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "I love Python",
    "I love machine learning",
    "Python is powerful"
]

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(documents)
```

View the vocabulary:

```python id="z4wh2p"
print(vectorizer.get_feature_names_out())
```

View the matrix:

```python id="w2p8h7"
print(X.toarray())
```

The values are no longer simple counts.

They are TF-IDF weights.

---

# 8. `fit_transform()` vs `transform()`

During training:

```python id="k8l2ri"
X_train = vectorizer.fit_transform(train_text)
```

This does two things:

```text
fit
→ Learn vocabulary and IDF statistics

transform
→ Convert text into TF-IDF vectors
```

For test data:

```python id="9n5h0p"
X_test = vectorizer.transform(test_text)
```

Do **not** fit the vectorizer again on test data.

Correct:

```text id="g4y53b"
Training Data
     ↓
fit_transform()
     ↓
Learn vocabulary + IDF
     ↓
Testing Data
     ↓
transform()
```

This prevents data leakage.

---

# 9. TF-IDF Parameters

`TfidfVectorizer` provides many useful options.

### `ngram_range`

Include word sequences:

```python id="4yt1mg"
TfidfVectorizer(
    ngram_range=(1, 2)
)
```

This includes:

```text
Unigrams
+
Bigrams
```

For example:

```text id="4c8h4w"
"machine learning"
```

becomes a feature.

---

### `min_df`

Ignore very rare terms:

```python id="d77x0b"
TfidfVectorizer(min_df=2)
```

Useful for reducing noise.

---

### `max_df`

Ignore extremely common terms:

```python id="03ymg8"
TfidfVectorizer(max_df=0.90)
```

---

### `max_features`

Limit vocabulary size:

```python id="iqx0ab"
TfidfVectorizer(max_features=5000)
```

This can reduce memory usage and training time.

---

# 10. Sublinear TF

Normal term frequency can give increasing importance to repeated words.

A common alternative is **sublinear TF scaling**:

```text id="d9t6kr"
TF = 1 + log(tf)
```

In scikit-learn:

```python id="t4h2k8"
TfidfVectorizer(
    sublinear_tf=True
)
```

This can reduce the effect of very high word counts.

For example, the difference between:

```text
1 occurrence
```

and:

```text
10 occurrences
```

does not need to be treated as ten times more important.

---

# 11. Normalization

TF-IDF vectors are commonly normalized.

Scikit-learn's `TfidfVectorizer` uses L2 normalization by default.

Conceptually:

```text id="w8zq7v"
Raw TF-IDF Vector
       ↓
Normalization
       ↓
Normalized Vector
```

This makes vectors easier to compare, particularly when using **cosine similarity**.

---

# 12. TF-IDF for Text Classification

A very common classical NLP architecture is:

```text id="y7h0fb"
Text
 ↓
Preprocessing
 ↓
TF-IDF
 ↓
Logistic Regression
 ↓
Prediction
```

For example:

```text id="q6j2a1"
Customer Review
       ↓
TF-IDF
       ↓
Logistic Regression
       ↓
Positive / Negative
```

TF-IDF works particularly well with linear models because the resulting features are high-dimensional and sparse.

Common models include:

```text
Logistic Regression
Linear SVM
Naive Bayes
```

---

# 13. TF-IDF for Search

TF-IDF can also be used for information retrieval.

Example:

```text id="4o7q1j"
Query:
"machine learning tutorial"
```

Documents are represented using TF-IDF.

Then we can compare:

```text id="z5c7xe"
Query Vector
      ↓
Cosine Similarity
      ↓
Document Scores
      ↓
Most Relevant Documents
```

Documents with more relevant terms can receive higher similarity scores.

This forms a simple classical search system.

---

# 14. TF-IDF for Similarity

Suppose:

```text id="3y0t7u"
Text A:
"machine learning tutorial"

Text B:
"machine learning course"
```

Their TF-IDF vectors may share important features such as:

```text
machine
learning
```

We can calculate cosine similarity:

```text id="w5ks4f"
Similarity(Text A, Text B)
```

A higher score indicates that the vectors point in more similar directions.

---

# 15. TF-IDF vs Bag of Words

| Feature                    | Bag of Words | TF-IDF  |
| -------------------------- | ------------ | ------- |
| Numerical representation   | Yes          | Yes     |
| Word counts                | Yes          | Uses TF |
| Considers corpus frequency | No           | Yes     |
| Downweights common words   | No           | Yes     |
| Sparse                     | Yes          | Yes     |
| Easy to implement          | Yes          | Yes     |
| Useful for classification  | Yes          | Yes     |
| Useful for search          | Yes          | Yes     |

Simple mental model:

```text id="j0s5a1"
BoW
→ "How often does this word appear?"

TF-IDF
→ "How important is this word for this document?"
```

---

# 16. Limitations of TF-IDF

TF-IDF is powerful for classical NLP, but it has important limitations.

### No deep semantic understanding

These words may be treated as separate features:

```text
car
automobile
vehicle
```

TF-IDF does not automatically understand that they are related.

### Limited context

Compare:

```text
"I like this product"
"I do not like this product"
```

The model can use `not` as a feature, but TF-IDF itself does not understand the semantic effect of negation.

### Large vocabulary

Large datasets can create very high-dimensional sparse matrices.

### No true word meaning

A TF-IDF vector represents word importance, not a deep representation of meaning.

These limitations motivate word embeddings and modern neural NLP.

---

# 17. Practical End-to-End Example

```python id="1w9g1k"
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

texts = [
    "I love this product",
    "This product is amazing",
    "I hate this product",
    "This product is terrible"
]

labels = [
    "positive",
    "positive",
    "negative",
    "negative"
]

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(texts)

model = LogisticRegression()

model.fit(X, labels)

new_text = ["I love this amazing product"]

X_new = vectorizer.transform(new_text)

prediction = model.predict(X_new)

print(prediction)
```

The architecture is:

```text
Text
 ↓
TF-IDF Vectorization
 ↓
Numerical Features
 ↓
Logistic Regression
 ↓
Prediction
```

In a real project, you would split the data into training and testing sets and place preprocessing/vectorization and the model into a proper pipeline.

---

# 🧠 Mental Model

Remember TF-IDF as:

```text
                DOCUMENT
                   ↓
          ┌─────────────────┐
          │ Term Frequency  │
          └────────┬────────┘
                   │
                   ×
          ┌────────▼────────┐
          │  Inverse        │
          │ Document        │
          │ Frequency       │
          └────────┬────────┘
                   ↓
               TF-IDF
                   ↓
          Numerical Vector
                   ↓
              ML / Search
```

The key idea:

> **TF-IDF gives higher importance to terms that are useful in a document but relatively uncommon across the document collection.**

---

# 🎯 What You Should Understand

After this folder, you should be able to explain:

* What TF-IDF means
* Term Frequency
* Inverse Document Frequency
* The TF-IDF formula
* Why common words receive lower importance
* How `TfidfVectorizer` works
* `fit_transform()` vs `transform()`
* N-grams with TF-IDF
* `min_df`, `max_df`, and `max_features`
* Sublinear TF
* Normalization
* TF-IDF for classification
* TF-IDF for search
* TF-IDF for similarity
* TF-IDF vs BoW
* TF-IDF limitations
* Why TF-IDF works well with classical ML

Next:

```text
06 — Word Embeddings
```

where we move from **word-frequency-based representations → dense numerical representations that can capture relationships between words**.
