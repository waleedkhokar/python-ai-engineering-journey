# 🧠 01 — NLP Fundamentals

**Date:** 25 January 2026
**Folder:** `01-NLP-Fundamentals`

---

# 📚 NLP Fundamentals

## 🎯 Overview

**Natural Language Processing (NLP)** is a field of Artificial Intelligence that enables computers to work with human language.

Humans communicate through:

* Text
* Documents
* Messages
* Emails
* Reviews
* Questions
* Commands
* Speech

Computers, however, primarily work with numerical data.

Therefore, one of the fundamental goals of NLP is:

```text
Human Language
      ↓
Text Processing
      ↓
Numerical Representation
      ↓
Machine Learning
      ↓
Prediction / Analysis
```

This folder introduces the fundamental ideas needed before learning text preprocessing, vectorization, embeddings, and NLP models.

---

# 1. What Is NLP?

NLP combines:

```text
Computer Science
       +
Artificial Intelligence
       +
Machine Learning
       +
Linguistics
```

to allow computers to process and analyze human language.

Examples include:

```text
Spam Detection
Sentiment Analysis
Text Classification
Search
Text Similarity
Topic Detection
Entity Extraction
```

---

# 2. Why Do We Need NLP?

A computer does not naturally understand:

```text
"I really love this laptop."
```

in the same way a human does.

For a machine-learning model, text must eventually become numerical data.

For example:

```text
"I love Python"
        ↓
Tokenization
        ↓
["I", "love", "Python"]
        ↓
Vectorization
        ↓
[0, 1, 1, 0, ...]
        ↓
Machine Learning Model
```

This conversion from language into useful numerical representations is one of the central ideas of NLP.

---

# 3. Why Is Human Language Difficult?

Human language is highly variable.

Compare:

```text
"I love this phone."

"I don't love this phone."

"I LOVE this phone!!!"

"This phone is sick 🔥"
```

The same words can have different meanings depending on:

* Context
* Word order
* Negation
* Grammar
* Punctuation
* Slang
* Spelling
* Domain
* Tone

For example:

```text
"I like this."

"I don't like this."
```

The word `like` appears in both sentences, but `not` changes the meaning.

Therefore, NLP cannot simply treat every word independently.

---

# 4. NLP vs Traditional Machine Learning

A traditional ML dataset may already contain numerical features:

```text
Age    Salary    Experience
23     50000     1
30     80000     5
```

NLP often starts with unstructured text:

```text
"This product is amazing."
```

The text must first be transformed:

```text
Raw Text
   ↓
Preprocessing
   ↓
Feature Representation
   ↓
Numerical Matrix
   ↓
ML Model
   ↓
Prediction
```

This is one of the biggest differences between ordinary tabular ML and text-based ML.

---

# 5. Common NLP Tasks

| Task                   | Purpose                           |
| ---------------------- | --------------------------------- |
| Text Classification    | Assign text to a category         |
| Sentiment Analysis     | Detect sentiment                  |
| Spam Detection         | Detect unwanted messages          |
| Topic Modeling         | Discover hidden topics            |
| NER                    | Extract named entities            |
| Text Similarity        | Compare texts                     |
| Search                 | Retrieve relevant documents       |
| Clustering             | Group similar documents           |
| Information Extraction | Convert text into structured data |

Example:

```text
"This laptop battery is terrible."

        ↓

Sentiment Analysis

        ↓

Negative
```

---

# 6. Classical NLP

This module focuses primarily on **classical NLP**.

Important classical techniques include:

```text
Text Preprocessing
       ↓
Tokenization
       ↓
N-Grams
       ↓
Bag of Words
       ↓
TF-IDF
       ↓
Word Embeddings
       ↓
Classical ML
```

Common models include:

```text
Naive Bayes
Logistic Regression
Linear SVM
K-Means
LDA
```

Modern approaches such as:

```text
Transformers
BERT
GPT
LLMs
RAG
Agents
```

will be studied later.

---

# 7. NLP Pipeline

A basic NLP workflow can look like:

```text
Raw Text
   ↓
Cleaning
   ↓
Normalization
   ↓
Tokenization
   ↓
Feature Extraction
   ↓
Vectorization
   ↓
Machine Learning
   ↓
Evaluation
   ↓
Prediction
```

Not every NLP project requires every step.

For example, removing punctuation or stop words may help one project but hurt another.

The pipeline should be designed according to the problem and dataset.

---

# 8. Raw Text

Raw text is the original unprocessed language data.

Example:

```text
"Wow!!! This phone is AMAZING 😍.
I bought it yesterday."
```

This may contain:

```text
Uppercase letters
Punctuation
Emoji
Whitespace
Multiple sentences
```

Before training a classical ML model, we may need to transform the text into a more consistent representation.

However, we should **not blindly remove information**.

For example:

```text
"Great."
"Great!!!"
```

may contain different levels of emotional emphasis.

---

# 9. Text as Data

NLP data can come from many sources:

```text
Emails
SMS
Reviews
Social Media
News
Books
Web Pages
PDFs
Customer Support Messages
Resumes
Documentation
```

A dataset might look like:

```text
Text                              Label

"This product is excellent"       Positive
"This product is terrible"        Negative
"Win a free prize now"            Spam
```

The text is the input, while the label is the target for supervised learning.

---

# 10. NLP and Machine Learning

Classical NLP often combines language processing with traditional ML.

A common architecture is:

```text
Text
 ↓
TF-IDF
 ↓
Numerical Features
 ↓
Logistic Regression
 ↓
Prediction
```

For example:

```text
"I love this product"

        ↓

TF-IDF

        ↓

Numerical Vector

        ↓

Classifier

        ↓

Positive
```

This is why understanding both NLP and Machine Learning is important.

---

# 11. Important NLP Vocabulary

### Corpus

A **corpus** is a collection of text documents.

```text
Corpus
 ├── Document 1
 ├── Document 2
 ├── Document 3
 └── Document 4
```

### Document

A single piece of text.

```text
"This is one document."
```

### Token

A smaller unit extracted from text.

```text
"I love Python"

→

["I", "love", "Python"]
```

### Vocabulary

The collection of unique tokens in a corpus.

```text
["I", "love", "Python", "machine", "learning"]
```

These terms will become important when learning vectorization.

---

# 12. NLP Representation Problem

The machine-learning model needs numbers.

We start with:

```text
"This product is amazing"
```

and eventually need something like:

```text
[0.0, 1.0, 0.7, 0.2, ...]
```

Different NLP techniques create different representations.

### Classical representations

```text
Bag of Words
TF-IDF
Word Embeddings
```

Each representation has different strengths and limitations.

---

# 13. Context Matters

Consider:

```text
"I went to the bank."
```

What does `bank` mean?

It could mean:

```text
Financial institution
```

or:

```text
Side of a river
```

The surrounding words provide context.

Classical approaches have limited ability to understand this type of contextual meaning.

This limitation eventually motivated the development of more advanced neural and Transformer-based NLP systems.

---

# 14. NLP Application Examples

### Customer Support

```text
Customer message
      ↓
Intent Classification
      ↓
Order / Refund / Technical Support
```

### Spam Detection

```text
SMS
 ↓
Text Features
 ↓
Classifier
 ↓
Spam / Ham
```

### Sentiment Analysis

```text
Review
 ↓
Text Representation
 ↓
Classifier
 ↓
Positive / Negative / Neutral
```

### Search

```text
User Query
 ↓
Text Representation
 ↓
Similarity / Retrieval
 ↓
Relevant Documents
```

---

# 15. Classical NLP Mental Model

Think about classical NLP as four layers:

```text
┌──────────────────────────────┐
│          APPLICATION         │
│ Search / Spam / Sentiment    │
├──────────────────────────────┤
│             MODEL            │
│ NB / Logistic / SVM / LDA    │
├──────────────────────────────┤
│        REPRESENTATION        │
│ BoW / TF-IDF / Embeddings    │
├──────────────────────────────┤
│        TEXT PROCESSING       │
│ Clean / Tokenize / Normalize │
└──────────────────────────────┘
```

The lower layers prepare the text for the upper layers.

---

# 16. Classical NLP → Modern NLP

The historical progression can be understood roughly as:

```text
Rules
  ↓
Tokenization
  ↓
N-Grams
  ↓
BoW
  ↓
TF-IDF
  ↓
Word2Vec / GloVe / FastText
  ↓
Neural NLP
  ↓
Attention
  ↓
Transformers
  ↓
BERT / GPT-style Models
  ↓
LLMs
```

This module focuses on the classical portion of this progression.

---

# 🎯 What You Should Understand After This Folder

You should be able to explain:

* What NLP is
* Why NLP is needed
* Why language is difficult for computers
* What raw text means
* What a corpus, document, token, and vocabulary are
* How NLP connects with machine learning
* What an NLP pipeline looks like
* What classical NLP means
* Why text must be converted into numerical features
* The basic difference between classical and modern NLP
* Why context and representation matter

---

# 🧠 Key Takeaways

```text
NLP
↓
Computers working with human language

Raw Text
↓
Preprocessing
↓
Representation
↓
Numerical Features
↓
Machine Learning
↓
Prediction
```

The most important idea to remember:

> **Machines work with numbers, while NLP provides methods for transforming human language into useful representations that machines can process.**

Next:

```text
02 — Text Preprocessing
```

where we will move from **understanding NLP → actually preparing text for NLP models**.
