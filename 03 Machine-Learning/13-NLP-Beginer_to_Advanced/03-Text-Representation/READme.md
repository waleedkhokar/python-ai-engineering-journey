# 🔢 03 — Text Representation

**Date:** 27 January 2026
**Folder:** `03-Text-Representation`

---

# 📚 Text Representation

## 🎯 Overview

After preprocessing, we have clean text, but machine-learning models still cannot directly work with sentences like:

```text
"I love this laptop"
```

Most classical ML algorithms require **numerical features**.

Therefore, text representation is the process of converting text into numerical forms that a machine-learning model can process.

```text
Raw Text
   ↓
Preprocessing
   ↓
Tokens
   ↓
Text Representation
   ↓
Numerical Features
   ↓
Machine Learning Model
```

Different representation techniques capture different types of information.

---

# 1. Why Do We Need Text Representation?

Consider:

```text
"I love Python"
"I love machine learning"
"I hate this software"
```

A model cannot directly calculate mathematical relationships between these sentences.

We need to represent them as numbers:

```text
Text
 ↓
Numerical Vector
 ↓
ML Model
```

This is one of the most important steps in classical NLP.

---

# 2. Main Types of Text Representation

Classical NLP commonly uses:

```text
1. One-Hot Encoding
2. Bag of Words
3. N-Grams
4. TF-IDF
5. Word Embeddings
```

They can broadly be divided into:

| Type   | Representation       |
| ------ | -------------------- |
| Sparse | One-Hot, BoW, TF-IDF |
| Dense  | Word Embeddings      |

---

# 3. One-Hot Encoding

One-hot encoding represents each word using a vector where one position is `1` and all other positions are `0`.

Suppose our vocabulary is:

```text
["cat", "dog", "car"]
```

Representations could be:

```text
cat → [1, 0, 0]

dog → [0, 1, 0]

car → [0, 0, 1]
```

Each word gets its own position.

### Problem

The vectors become very large when the vocabulary contains thousands or millions of words.

They also do not capture semantic relationships.

For example:

```text
king
queen
```

have completely independent one-hot representations.

---

# 4. Sparse Representation

A vector is called **sparse** when most of its values are zero.

For example:

```text
[0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
```

Only a few positions contain useful values.

Classical NLP techniques such as:

```text
Bag of Words
TF-IDF
```

usually create sparse matrices.

Large text datasets can therefore produce:

```text
Documents × Vocabulary
```

matrices with millions of possible positions.

Libraries such as scikit-learn use sparse matrix structures to store these efficiently.

---

# 5. Bag of Words

**Bag of Words (BoW)** represents a document based on the words it contains.

Example:

```text
Document 1:
"I love Python"

Document 2:
"I love machine learning"
```

Vocabulary:

```text
["I", "love", "Python", "machine", "learning"]
```

The documents can then be represented by word counts.

The important idea is:

> BoW focuses on **which words appear and how often they appear**, rather than understanding the deeper meaning of the sentence.

BoW is covered in detail in:

```text
04-Bag-of-Words/
```

---

# 6. N-Grams

An **N-gram** is a sequence of `N` consecutive tokens.

### Unigram

One word:

```text
"I love Python"
```

becomes:

```text
["I", "love", "Python"]
```

### Bigram

Two consecutive words:

```text
["I love", "love Python"]
```

### Trigram

Three consecutive words:

```text
["I love Python"]
```

N-grams allow classical NLP models to capture some word-order information.

For example:

```text
"not good"
```

contains the bigram:

```text
"not good"
```

which is more informative than treating `not` and `good` completely independently.

---

# 7. TF-IDF

**TF-IDF** stands for:

> **Term Frequency — Inverse Document Frequency**

It assigns a weight to words based on:

1. How frequently they appear in a document
2. How common they are across the entire collection of documents

A word that appears frequently in one document but rarely across other documents can receive a higher weight.

A simplified idea is:

```text
TF-IDF = TF × IDF
```

Where:

```text
TF = Term Frequency
IDF = Inverse Document Frequency
```

A common IDF form is:

```text
IDF = log(N / df)
```

where:

* `N` = total number of documents
* `df` = number of documents containing the term

TF-IDF is covered in detail in:

```text
05-TF-IDF/
```

---

# 8. Word Embeddings

Word embeddings represent words as **dense numerical vectors**.

Instead of:

```text
Python → [0, 0, 0, 1, 0, 0, ...]
```

an embedding might look conceptually like:

```text
Python → [0.21, -0.43, 0.71, 0.18, ...]
```

The vector contains many continuous numerical values.

Embedding models can learn relationships between words based on their contexts.

Examples include:

```text
Word2Vec
GloVe
FastText
```

These will be studied in detail in:

```text
06-Word-Embeddings/
```

---

# 9. Sparse vs Dense Representation

| Feature              | Sparse                   | Dense                          |
| -------------------- | ------------------------ | ------------------------------ |
| Example              | BoW, TF-IDF              | Word2Vec, GloVe                |
| Many zeros           | Yes                      | Usually no                     |
| Dimensions           | Often very large         | Usually smaller                |
| Semantic information | Limited                  | Better                         |
| Memory               | Efficient sparse storage | Stores most values             |
| Typical use          | Classical ML             | Similarity / semantic features |

For example:

```text
TF-IDF
→ [0, 0, 0, 0.72, 0, 0.15, 0]

Embedding
→ [0.21, -0.43, 0.71, 0.18, 0.52]
```

---

# 10. Document Representation

We do not always need to represent individual words.

A complete document can also be represented as a vector.

For example:

```text
Document
   ↓
Tokens
   ↓
Word Vectors
   ↓
Aggregation
   ↓
Document Vector
```

Simple approaches may use:

```text
Average word embeddings
```

More advanced approaches can learn dedicated document representations.

This becomes useful for:

* Document similarity
* Search
* Clustering
* Recommendation
* Classification

---

# 11. Text Similarity

Once text is represented numerically, we can compare vectors.

One common method is **cosine similarity**.

Conceptually:

```text
Text A → Vector A
Text B → Vector B
           ↓
    Cosine Similarity
           ↓
    Similarity Score
```

For example:

```text
"machine learning tutorial"

"machine learning course"
```

may have higher similarity than:

```text
"machine learning tutorial"

"football match today"
```

Cosine similarity is commonly used with TF-IDF and embeddings.

---

# 12. Choosing a Representation

There is no single representation that is always correct.

### BoW

Useful when:

```text
Word occurrence/counts
```

are sufficient.

### TF-IDF

Useful for:

```text
Text classification
Search
Keyword importance
Document similarity
```

### Word Embeddings

Useful when:

```text
Semantic relationships
Similarity
Meaning
```

are important.

A practical classical NLP workflow might be:

```text
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

---

# 13. Important Limitation

Classical representations have limitations.

For example, TF-IDF treats words largely as independent features.

Compare:

```text
"The movie is good"
"The movie is not good"
```

A simple word-based representation may not fully understand how `not` changes the meaning.

Similarly, traditional word embeddings generally assign a relatively fixed vector to a word, while the meaning of a word can change depending on context.

These limitations helped motivate neural NLP and eventually Transformer-based models.

---

# 🧠 Mental Model

Remember the progression:

```text
Text
 ↓
Tokens
 ↓
Representation
 ├── One-Hot
 ├── BoW
 ├── N-Grams
 ├── TF-IDF
 └── Embeddings
       ↓
Numerical Vectors
       ↓
ML / NLP Task
```

The key idea is:

> **Text representation converts language into numerical features while trying to preserve information useful for the NLP task.**

---

# 🎯 What You Should Understand

After this folder, you should understand:

* Why text must be converted into numbers
* What one-hot encoding is
* What sparse representations are
* What BoW represents
* What N-grams are
* What TF-IDF represents
* What dense embeddings are
* Sparse vs dense representations
* Word vs document representations
* Basic text similarity
* When different representations are useful
* Why classical representations have limitations

Next:

```text
04 — Bag of Words
```

where we will implement **BoW practically with Python and scikit-learn**.
