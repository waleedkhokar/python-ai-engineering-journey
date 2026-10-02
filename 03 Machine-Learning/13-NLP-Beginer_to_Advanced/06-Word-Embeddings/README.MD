# 🧠 06 — Word Embeddings

**Date:** 30 January 2026
**Folder:** `06-Word-Embeddings`

---

# 📚 Word Embeddings

## 🎯 Overview

**Word embeddings** represent words as dense numerical vectors.

Instead of representing a word as a huge sparse vector like Bag of Words or TF-IDF, embeddings represent it using a relatively small number of continuous numerical values.

For example:

```text
"python"
    ↓
[0.21, -0.43, 0.71, 0.18, ...]
```

The important idea is:

> **Words with similar meanings or similar usage can have similar vector representations.**

The basic workflow is:

```text
Text
 ↓
Tokens
 ↓
Embedding Model
 ↓
Dense Vectors
 ↓
Similarity / ML / NLP Task
```

---

# 1. Why Do We Need Embeddings?

BoW and TF-IDF represent words based mainly on their occurrence.

For example:

```text
car
automobile
vehicle
```

are treated as separate features.

They do not automatically know that these words are related.

Word embeddings try to capture relationships from how words are used in context.

Conceptually:

```text
car        → [0.2, 0.7, -0.1, ...]
automobile → [0.21, 0.69, -0.08, ...]
banana     → [-0.4, 0.1, 0.8, ...]
```

The vectors for related words may be closer together.

---

# 2. Sparse vs Dense Representation

### Sparse representation

BoW and TF-IDF may produce:

```text
[0, 0, 0, 0, 1, 0, 0, 0, 1, 0, ...]
```

Most values are zero.

### Dense representation

Embeddings look more like:

```text
[0.21, -0.43, 0.71, 0.18, 0.52]
```

Most values are non-zero.

| Feature                | Sparse           | Dense           |
| ---------------------- | ---------------- | --------------- |
| Examples               | BoW, TF-IDF      | Word2Vec, GloVe |
| Many zeros             | Yes              | Usually no      |
| Dimensions             | Often very large | Usually smaller |
| Semantic relationships | Limited          | Better          |
| Representation         | Word occurrence  | Learned vector  |

---

# 3. Distributional Hypothesis

A fundamental idea behind word embeddings is:

> **Words that occur in similar contexts tend to have related meanings.**

For example:

```text
"I drink hot coffee."

"I drink hot tea."
```

`coffee` and `tea` occur in similar contexts.

Therefore, an embedding model can learn that their vectors should have some relationship.

This is called the **distributional hypothesis**.

---

# 4. Word2Vec

**Word2Vec** is one of the most well-known word embedding techniques.

It learns word vectors from surrounding words in a large text corpus.

Two important Word2Vec architectures are:

```text
CBOW
Skip-Gram
```

---

# 5. CBOW

**CBOW** stands for:

> **Continuous Bag of Words**

CBOW predicts a target word from its surrounding context.

Example:

```text
"The cat drinks milk"
```

If the target is:

```text
drinks
```

the surrounding words might be:

```text
cat
milk
```

Conceptually:

```text
Context Words
      ↓
    Model
      ↓
Target Word
```

CBOW is generally designed to predict the missing/target word using nearby words.

---

# 6. Skip-Gram

Skip-Gram works in the opposite direction.

It uses a target word to predict surrounding context words.

Example:

```text
"The cat drinks milk"
```

For the target:

```text
cat
```

the model may try to predict nearby words:

```text
the
drinks
```

Conceptually:

```text
Target Word
     ↓
   Model
     ↓
Context Words
```

So:

```text
CBOW
Context → Target

Skip-Gram
Target → Context
```

---

# 7. Word2Vec Intuition

Suppose a corpus contains:

```text
"The cat drinks milk"

"The dog drinks water"

"The cat likes fish"

"The dog likes meat"
```

The model observes which words appear near each other.

Over time, it learns vector representations where words with similar contexts can have similar locations in vector space.

Conceptually:

```text
          cat
           ●
          / \
         /   \
      dog     milk
       ●
```

This is only an intuition; actual embedding spaces contain hundreds of dimensions.

---

# 8. GloVe

**GloVe** stands for:

> **Global Vectors for Word Representation**

GloVe learns word vectors using global word co-occurrence statistics.

The general idea is:

```text
Large Corpus
     ↓
Word Co-occurrence Information
     ↓
Learning Algorithm
     ↓
Word Vectors
```

Compared with Word2Vec, GloVe emphasizes the statistical relationships between words across the corpus.

Both can produce useful dense word representations.

---

# 9. FastText

**FastText** extends the basic word-embedding idea by using **subword information**.

Instead of treating a word as one indivisible unit, FastText can represent it using character n-grams.

This can be particularly useful for:

* Rare words
* Misspellings
* Morphologically rich languages
* Words not seen exactly during training

For example, related word forms may share character-level information.

This makes FastText useful when word morphology matters.

---

# 10. Embedding Dimensions

An embedding is usually represented using a fixed number of dimensions.

For example:

```text
50 dimensions
100 dimensions
200 dimensions
300 dimensions
```

A 100-dimensional embedding could look conceptually like:

```text
word
 ↓
[0.21, -0.43, 0.71, ... 100 values ...]
```

The dimensions are generally **learned features**, rather than manually defined things like:

```text
dimension 1 = happiness
dimension 2 = size
```

We usually cannot directly assign simple human meanings to individual dimensions.

---

# 11. Word Similarity

Once words are represented as vectors, we can compare them.

A common method is **cosine similarity**.

```text
Word A → Vector A
Word B → Vector B
       ↓
Cosine Similarity
       ↓
Similarity Score
```

For example:

```text
king ↔ queen
car ↔ automobile
doctor ↔ physician
```

may have relatively high similarity compared with unrelated pairs.

---

# 12. Embeddings and Semantic Relationships

One interesting property of some learned embedding spaces is that relationships can appear as vector relationships.

A famous conceptual example is:

```text
king - man + woman ≈ queen
```

This should be understood as an observation about certain learned embedding spaces, **not a universal rule**.

The quality of these relationships depends on:

* Training data
* Embedding algorithm
* Vocabulary
* Hyperparameters
* Domain

---

# 13. Document Embeddings

Word embeddings represent individual words, but many NLP tasks require representing complete documents.

One simple approach is to combine word vectors.

For example:

```text
Document
   ↓
Words
   ↓
Word Embeddings
   ↓
Average / Aggregate
   ↓
Document Vector
```

Example:

```text
"I love Python"

"I"      → vector
"love"   → vector
"Python" → vector

       ↓

Average

       ↓

Document Vector
```

This is simple but loses some word-order and contextual information.

---

# 14. Embeddings for NLP Tasks

Embeddings can be used for:

### Text Similarity

```text
Document A
    ↓
Embedding
    ↓
Compare
    ↓
Document B
```

### Search

Represent queries and documents as vectors and compare them.

### Classification

Use embeddings as numerical features for a classifier.

### Clustering

Group documents or words according to their vector representations.

### Recommendation

Compare item or document representations based on semantic similarity.

---

# 15. Pretrained Embeddings

We do not always need to train embeddings ourselves.

Pretrained embeddings can be trained on large corpora and then reused.

Examples include:

```text
Word2Vec
GloVe
FastText
```

Workflow:

```text
Large External Corpus
        ↓
Pretrained Embeddings
        ↓
Your NLP Project
        ↓
Similarity / Features / Model
```

This is useful when your own dataset is too small to learn high-quality embeddings from scratch.

---

# 16. Important Limitation: Context

Traditional word embeddings generally assign one main vector to a word.

Consider:

```text
"I deposited money at the bank."

"I sat beside the river bank."
```

The word:

```text
bank
```

has different meanings.

A traditional static embedding may not represent these meanings separately according to each sentence.

This is an important limitation.

Later approaches such as:

```text
Contextual Embeddings
Transformers
BERT
GPT-style models
```

produce representations that depend much more on context.

These belong to the later Deep Learning / GenAI parts of the roadmap.

---

# 17. Word Embeddings vs TF-IDF

| Feature                 | TF-IDF             | Word Embeddings           |
| ----------------------- | ------------------ | ------------------------- |
| Representation          | Sparse             | Dense                     |
| Based on word frequency | Yes                | Not primarily             |
| Semantic relationships  | Limited            | Better                    |
| Context                 | Limited            | Depends on method         |
| Dimensions              | Often very large   | Usually smaller           |
| Interpretability        | Relatively high    | Lower                     |
| Classical ML            | Excellent baseline | Can be useful             |
| Examples                | TF-IDF             | Word2Vec, GloVe, FastText |

Simple mental model:

```text
TF-IDF
→ "How important is this word in this document?"

Embeddings
→ "How is this word represented in relation to other words?"
```

---

# 18. Practical Example

Using Gensim's Word2Vec:

```python
from gensim.models import Word2Vec

sentences = [
    ["i", "love", "python"],
    ["i", "love", "machine", "learning"],
    ["python", "is", "powerful"],
    ["machine", "learning", "is", "useful"]
]

model = Word2Vec(
    sentences,
    vector_size=100,
    window=5,
    min_count=1,
    workers=4
)
```

Get a word vector:

```python
vector = model.wv["python"]

print(vector)
```

Find similar words:

```python
similar_words = model.wv.most_similar("python")

print(similar_words)
```

The model learns vectors from the word contexts in the training sentences.

For a serious project, much larger datasets are normally required to learn high-quality embeddings from scratch.

---

# 19. Real-World Considerations

Embedding quality depends heavily on the training data.

If the training corpus contains:

```text
Technical documents
```

the embeddings may learn useful relationships between technical terms.

If the corpus contains:

```text
Social media
```

the representations may capture slang and informal language.

Therefore:

> **Embedding quality is strongly influenced by the data and domain used to train the embeddings.**

---

# 🧠 Mental Model

Remember the progression:

```text
Raw Text
   ↓
Tokens
   ↓
Embedding Model
   ↓
Dense Vectors
   ↓
Similarity / Classification / Clustering
```

And the main classical embedding approaches:

```text
Word2Vec
 ├── CBOW
 └── Skip-Gram

GloVe

FastText
```

The key idea:

> **Word embeddings transform words into dense vectors where useful relationships can be learned from how words occur in language.**

---

# 🎯 What You Should Understand

After this folder, you should be able to explain:

* What word embeddings are
* Sparse vs dense representations
* Why embeddings are useful
* The distributional hypothesis
* Word2Vec
* CBOW
* Skip-Gram
* GloVe
* FastText
* Embedding dimensions
* Cosine similarity
* Semantic relationships
* Document embeddings
* Pretrained embeddings
* Embeddings for NLP applications
* Static embedding limitations
* TF-IDF vs embeddings
* Why context matters

Next:

```text
07 — Text Classification
```

where we combine **text representations + classical ML models** to build practical text classifiers.
