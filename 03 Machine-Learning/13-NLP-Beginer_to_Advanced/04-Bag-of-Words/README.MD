# 👜 04 — Bag of Words

**Date:** 28 January 2026
**Folder:** `04-Bag-of-Words`

---

# 📚 Bag of Words

## 🎯 Overview

**Bag of Words (BoW)** is one of the simplest and most important techniques for converting text into numerical features.

The basic idea is:

> **Represent a document by the words it contains and how frequently those words appear.**

For example:

```text
"I love Python"
```

cannot directly be given to a traditional machine-learning model.

BoW converts it into numbers:

```text
Text
 ↓
Vocabulary
 ↓
Word Counts
 ↓
Numerical Vector
 ↓
ML Model
```

BoW is called a **"bag"** because the basic representation does not care about the original order of words.

---

# 1. Simple Example

Suppose we have two documents:

```text
Document 1:
"I love Python"

Document 2:
"I love machine learning"
```

First, create a vocabulary containing the unique words:

```text
["I", "love", "Python", "machine", "learning"]
```

Now represent each document using word counts.

```text
Document 1:
[1, 1, 1, 0, 0]

Document 2:
[1, 1, 0, 1, 1]
```

Each position corresponds to a word in the vocabulary.

```text
I       → position 1
love    → position 2
Python  → position 3
machine → position 4
learning→ position 5
```

---

# 2. Why Is It Called Bag of Words?

Consider:

```text
"I love Python"
```

and:

```text
"Python love I"
```

A basic BoW representation can treat both similarly because they contain the same words.

The representation focuses on:

```text
Which words?
+
How many times?
```

rather than:

```text
What is the exact word order?
```

This makes BoW simple and useful, but also creates limitations.

---

# 3. Word Frequency

Suppose:

```text
"This laptop is good and this laptop is fast"
```

The word counts might be:

```text
this   → 2
laptop → 2
is     → 2
good   → 1
and    → 1
fast   → 1
```

The document can therefore be represented using these frequencies.

This is called a **count-based representation**.

---

# 4. Vocabulary

The vocabulary is the collection of unique terms found in the training documents.

Example:

```text
Documents:

"I love Python"

"I love AI"
```

Vocabulary:

```text
["I", "love", "Python", "AI"]
```

The vocabulary determines the number of features.

If the vocabulary contains:

```text
10,000 words
```

then a basic BoW representation can contain:

```text
10,000 features per document
```

Most documents will use only a small portion of those words, which makes the matrix **sparse**.

---

# 5. CountVectorizer

In Python, scikit-learn provides:

```python
from sklearn.feature_extraction.text import CountVectorizer
```

Example:

```python
from sklearn.feature_extraction.text import CountVectorizer

documents = [
    "I love Python",
    "I love machine learning",
    "Python is powerful"
]

vectorizer = CountVectorizer()

X = vectorizer.fit_transform(documents)
```

`CountVectorizer` performs two important tasks:

```text
Text
 ↓
Build Vocabulary
 ↓
Count Word Occurrences
```

---

# 6. Viewing the Vocabulary

We can inspect the learned vocabulary:

```python
print(vectorizer.get_feature_names_out())
```

Possible output:

```text
['learning' 'love' 'machine' 'powerful' 'python']
```

The vectorizer has converted the text vocabulary into numerical feature positions.

---

# 7. Viewing the Matrix

The resulting matrix can be inspected:

```python
print(X.toarray())
```

For example:

```text
[[0 1 0 0 1]
 [1 1 1 0 0]
 [0 0 0 1 1]]
```

Each row represents one document.

Each column represents one vocabulary word.

```text
Rows    → Documents
Columns → Words
Values  → Word counts
```

---

# 8. Binary Bag of Words

BoW does not always have to store the exact word count.

We can use **binary features**:

```text
1 → word exists
0 → word does not exist
```

Example:

```text
"python python machine"
```

Instead of:

```text
python  → 2
machine → 1
```

binary BoW becomes:

```text
python  → 1
machine → 1
```

In scikit-learn:

```python
vectorizer = CountVectorizer(binary=True)
```

This can be useful when **presence** matters more than frequency.

---

# 9. N-Grams with BoW

Basic BoW usually uses individual words, called **unigrams**.

But we can also include phrases.

### Unigrams

```text
"I love Python"

→

I
love
Python
```

### Bigrams

```text
"I love Python"

→

"I love"
"love Python"
```

In scikit-learn:

```python
vectorizer = CountVectorizer(
    ngram_range=(1, 2)
)
```

This creates both:

```text
Unigrams
+
Bigrams
```

N-grams can help capture short phrases such as:

```text
"not good"
"very good"
"customer service"
```

---

# 10. Controlling the Vocabulary

Real datasets can contain huge vocabularies.

For example:

```text
1 million unique words
```

Creating all possible features may be unnecessary.

`CountVectorizer` provides useful controls.

### `min_df`

Ignore words appearing in too few documents.

```python
CountVectorizer(min_df=2)
```

### `max_df`

Ignore extremely common words.

```python
CountVectorizer(max_df=0.90)
```

### `max_features`

Limit the vocabulary size.

```python
CountVectorizer(max_features=5000)
```

These options can reduce memory usage and noise.

---

# 11. BoW and Stop Words

Stop words can be removed when appropriate.

Example:

```python
CountVectorizer(stop_words="english")
```

This can remove common English words.

However, stop-word removal should not automatically be applied to every NLP task.

For example:

```text
"I do not like this"
```

contains important meaning in `not`.

Always evaluate preprocessing choices against the task.

---

# 12. Advantages of BoW

### Simple

It is easy to understand and implement.

### Fast

BoW works efficiently with many classical ML algorithms.

### Strong baseline

It can provide a useful starting point for text classification.

### Interpretable

Features correspond directly to words.

For example:

```text
Feature 15 → "excellent"
Feature 92 → "terrible"
```

This makes model behavior easier to inspect.

---

# 13. Limitations of BoW

### 1. Ignores word order

```text
"dog bites man"
"man bites dog"
```

can have similar word-count representations.

But their meanings are different.

### 2. No deep semantic understanding

BoW does not understand that:

```text
"car"
```

and:

```text
"automobile"
```

can have similar meanings.

### 3. High dimensionality

Large vocabularies can create thousands or millions of features.

### 4. Sparse representation

Most documents contain only a small fraction of the vocabulary.

### 5. Weak handling of context

The meaning of a word can depend heavily on surrounding words.

---

# 14. BoW with Machine Learning

A common classical NLP architecture is:

```text
Text
 ↓
Preprocessing
 ↓
CountVectorizer
 ↓
Bag of Words
 ↓
Logistic Regression
 ↓
Prediction
```

For example:

```text
"I love this product"
```

could become:

```text
[0, 1, 0, 1, 0, ...]
```

and the classifier uses these numerical features to predict:

```text
Positive
```

---

# 15. BoW vs TF-IDF

| Feature                  | BoW       | TF-IDF                |
| ------------------------ | --------- | --------------------- |
| Counts words             | Yes       | Weighted values       |
| Uses vocabulary          | Yes       | Yes                   |
| Sparse                   | Yes       | Yes                   |
| Considers word frequency | Yes       | Yes                   |
| Penalizes common words   | No        | Yes                   |
| Simple                   | Very      | Relatively            |
| Common use               | Baselines | Classification/Search |

The main difference is:

```text
BoW
→ How many times does the word appear?

TF-IDF
→ How important is the word to this document compared with the corpus?
```

---

# 16. Practical Example

```python
from sklearn.feature_extraction.text import CountVectorizer

texts = [
    "I love machine learning",
    "I love Python",
    "Python is powerful"
]

vectorizer = CountVectorizer()

X = vectorizer.fit_transform(texts)

print("Vocabulary:")
print(vectorizer.get_feature_names_out())

print("\nBoW Matrix:")
print(X.toarray())
```

The important workflow is:

```text
fit_transform()
      ↓
Learn vocabulary
      +
Transform documents
      ↓
Numerical matrix
```

For new text:

```python
new_text = ["I love Python"]

X_new = vectorizer.transform(new_text)
```

Notice that we use:

```python
transform()
```

instead of:

```python
fit_transform()
```

because the vocabulary should come from the training data.

---

# ⚠️ Important: Avoid Vocabulary Leakage

Never build your vocabulary using the entire dataset before splitting into training and testing data.

Incorrect:

```text
Entire Dataset
      ↓
Fit Vectorizer
      ↓
Train/Test Split
```

Better:

```text
Dataset
   ↓
Train/Test Split
   ↓
Training Data → Fit Vectorizer
   ↓
Testing Data → Transform Only
```

This prevents information from the test set from influencing the learned vocabulary.

Using a scikit-learn `Pipeline` is a good way to enforce this correctly.

---

# 🧠 Mental Model

Remember BoW as:

```text
Documents
   ↓
Unique Words
   ↓
Vocabulary
   ↓
Count Occurrences
   ↓
Sparse Matrix
   ↓
Machine Learning
```

The key idea:

> **Bag of Words converts documents into numerical vectors based on word occurrence or frequency, without trying to understand the deeper meaning of the text.**

---

# 🎯 What You Should Understand

After this folder, you should be able to explain:

* What Bag of Words is
* Why it is called a "bag"
* What a vocabulary is
* How word counts become features
* What sparse matrices are
* How `CountVectorizer` works
* Binary BoW
* Unigrams and n-grams
* `min_df`, `max_df`, and `max_features`
* Advantages and limitations of BoW
* BoW vs TF-IDF
* How BoW connects to ML models
* Why vocabulary leakage must be avoided

Next:

```text
05 — TF-IDF
```

where we move from **simple word counts → measuring how important words are within a document collection**.
