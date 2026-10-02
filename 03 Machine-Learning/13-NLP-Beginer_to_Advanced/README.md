# 🧠 13 — NLP Basics: Beginner → Advanced Classical NLP

**Date:** 25 January 2026
**Folder:** `13-NLP-Basics`

---

# 📚 Natural Language Processing — Complete Classical NLP

## 🎯 Overview

**Natural Language Processing (NLP)** is a field of Artificial Intelligence that enables computers to work with human language.

Humans communicate using:

* Text
* Documents
* Messages
* Reviews
* Emails
* Questions
* Commands
* Speech

Machines, however, work with numbers.

The fundamental NLP problem is therefore:

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

This module builds NLP knowledge from **beginner level to practical classical NLP**, covering the complete pipeline before modern Transformer/LLM-based NLP.

---

# 🗺️ What You Will Learn

```text
NLP
│
├── 01. NLP Fundamentals
├── 02. Text Data
├── 03. Text Preprocessing
├── 04. Tokenization
├── 05. Stop Words
├── 06. Stemming
├── 07. Lemmatization
├── 08. Normalization
├── 09. N-Grams
├── 10. Bag of Words
├── 11. TF-IDF
├── 12. Feature Engineering
├── 13. Word Embeddings
├── 14. Similarity
├── 15. Text Classification
├── 16. Sentiment Analysis
├── 17. Spam Detection
├── 18. Topic Modeling
├── 19. Named Entity Recognition
├── 20. Text Clustering
├── 21. Search & Information Retrieval
├── 22. Text Similarity
├── 23. Imbalanced NLP
├── 24. NLP Evaluation
├── 25. NLP Pipelines
├── 26. Production Considerations
└── 27. Classical NLP Project Workflow
```

---

# 1. What Is NLP?

**Natural Language Processing** combines:

```text
Computer Science
        +
Artificial Intelligence
        +
Machine Learning
        +
Linguistics
```

to process human language.

Examples:

```text
Spam Detection
Sentiment Analysis
Document Classification
Search
Recommendation
Text Similarity
Topic Detection
Entity Extraction
```

---

# 2. Why Is NLP Difficult?

Human language is not perfectly structured.

Consider:

```text
"I love this phone."

"I don't love this phone."

"I LOVE this phone!!!"

"This phone is sick 🔥"
```

The words alone are not enough.

Meaning depends on:

* Context
* Word order
* Negation
* Grammar
* Slang
* Spelling
* Domain
* Tone
* Punctuation

Therefore NLP requires careful preprocessing and representation.

---

# 3. NLP vs Traditional Machine Learning

A normal ML dataset may look like:

```text
Age   Salary   Experience
23    50000    1
30    80000    5
```

NLP starts with:

```text
"This product is amazing."
```

We must convert text into numerical features.

```text
Text
 ↓
Preprocessing
 ↓
Vectorization
 ↓
Numerical Matrix
 ↓
ML Model
```

---

# 4. Main NLP Tasks

| Task               | Purpose                     |
| ------------------ | --------------------------- |
| Classification     | Assign text to a class      |
| Sentiment Analysis | Detect sentiment            |
| Spam Detection     | Detect spam                 |
| Topic Modeling     | Discover topics             |
| NER                | Extract entities            |
| Similarity         | Compare texts               |
| Search             | Retrieve relevant documents |
| Clustering         | Group similar texts         |
| Summarization      | Create shorter text         |
| Translation        | Convert languages           |

This module focuses primarily on **classical NLP**.

Modern:

```text
Transformers
BERT
GPT
LLMs
RAG
Agents
```

are covered later in the **Deep Learning / Generative AI** curriculum.

---

# 5. NLP Pipeline

A basic NLP pipeline looks like:

```text
Raw Text
   ↓
Cleaning
   ↓
Normalization
   ↓
Tokenization
   ↓
Stop Word Handling
   ↓
Stemming / Lemmatization
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

Not every NLP project needs every step.

---

# 6. Raw Text

Suppose we receive:

```text
"Wow!!! This phone is AMAZING 😍.
I bought it yesterday and I really love it."
```

This is raw, unstructured text.

We may want to transform it into something like:

```text
wow phone amazing
bought yesterday really love
```

But we should not blindly remove everything.

Every preprocessing operation should have a purpose.

---

# 7. Text Cleaning

Common cleaning operations include:

```text
Lowercasing
Removing HTML
Removing URLs
Removing unwanted symbols
Handling punctuation
Handling whitespace
Handling emojis
Handling numbers
Handling repeated characters
```

Example:

```python
text = "HELLO!!! Visit https://example.com"

text = text.lower()
```

Result:

```text
hello!!! visit https://example.com
```

Further processing depends on the task.

---

# 8. Lowercasing

Example:

```text
Apple
APPLE
apple
```

For many classical NLP tasks, converting everything to lowercase reduces vocabulary size.

```python
text = text.lower()
```

Result:

```text
apple
```

But lowercasing can sometimes remove useful information.

Example:

```text
US
us
```

These can have different meanings.

Therefore:

> Lowercasing is useful, but it is not universally correct.

---

# 9. Removing HTML

Web documents can contain:

```html
<p>This product is great</p>
```

The model usually needs:

```text
This product is great
```

Python:

```python
from bs4 import BeautifulSoup

clean = BeautifulSoup(html, "html.parser").get_text()
```

---

# 10. Removing URLs

Example:

```text
Visit https://example.com for details.
```

Could become:

```text
Visit for details.
```

However, URLs may sometimes contain useful information.

For example, in cybersecurity or website classification, URLs can themselves be features.

So preprocessing depends on the problem.

---

# 11. Punctuation

Example:

```text
"Great!!!"
```

Possible transformations:

```text
great
```

But punctuation can contain sentiment information.

Compare:

```text
Great.
Great!!!
```

Therefore removing punctuation is not always optimal.

---

# 12. Whitespace

Raw text can contain:

```text
Hello     world
```

Normalization can produce:

```text
Hello world
```

Python:

```python
text = " ".join(text.split())
```

---

# 13. Tokenization

**Tokenization** breaks text into smaller units called tokens.

Example:

```text
"I love machine learning."
```

Word tokenization:

```text
["I", "love", "machine", "learning"]
```

Tokens can be:

* Words
* Characters
* Subwords
* Sentences

---

# 14. Word Tokenization

Simple example:

```python
text.split()
```

For:

```text
"I love Python"
```

result:

```python
["I", "love", "Python"]
```

Real NLP systems usually use dedicated tokenizers because punctuation and special cases require more careful handling.

---

# 15. Sentence Tokenization

Example:

```text
"I love Python. It is powerful."
```

Sentence tokenizer:

```text
[
    "I love Python.",
    "It is powerful."
]
```

This is useful when processing documents sentence by sentence.

---

# 16. Tokenization Challenges

Consider:

```text
"don't"
"can't"
"U.S.A."
"New York"
"machine-learning"
"COVID-19"
```

Different tokenizers may produce different tokens.

This matters because tokenization affects the vocabulary and therefore model performance.

---

# 17. Stop Words

**Stop words** are very common words that may provide limited information for certain tasks.

Examples:

```text
the
is
a
an
of
to
and
```

Example:

```text
"The cat is on the table."
```

Possible filtered result:

```text
cat table
```

---

# 18. Should We Always Remove Stop Words?

**No.**

Consider:

```text
"I do not like this product."
```

Removing:

```text
do
not
```

could produce:

```text
like product
```

which changes the meaning.

Therefore stop-word removal must be task-dependent.

---

# 19. Stop Words with scikit-learn

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    stop_words="english"
)
```

This automatically removes the configured stop words during vectorization.

---

# 20. Stemming

**Stemming** reduces words to a simpler root-like form.

Example:

```text
playing
played
plays
player
```

A stemmer may produce something similar to:

```text
play
play
play
player
```

Stemming usually uses rules rather than understanding the actual meaning of a word.

---

# 21. Porter Stemmer

NLTK provides the Porter Stemmer.

```python
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()

words = [
    "playing",
    "played",
    "plays"
]

for word in words:
    print(stemmer.stem(word))
```

---

# 22. Advantages of Stemming

* Fast
* Simple
* Reduces vocabulary
* Useful in some search/classification tasks

---

# 23. Disadvantages of Stemming

Stemming can produce unnatural words.

For example:

```text
studies
```

could be reduced incorrectly depending on the algorithm.

The resulting stem does not necessarily need to be a valid dictionary word.

---

# 24. Lemmatization

**Lemmatization** attempts to reduce a word to its proper dictionary base form.

Examples:

```text
running → run
better → good
cars → car
studies → study
```

It is generally more linguistically meaningful than basic stemming.

---

# 25. Stemming vs Lemmatization

| Stemming                     | Lemmatization                  |
| ---------------------------- | ------------------------------ |
| Rule-based reduction         | Linguistic normalization       |
| Faster                       | Usually slower                 |
| Can create non-words         | Produces valid base forms      |
| Less accurate linguistically | More linguistically meaningful |

Remember:

```text
Stemming
→ Fast approximation

Lemmatization
→ More meaningful normalization
```

---

# 26. Word Normalization

Normalization tries to make equivalent text more consistent.

Examples:

```text
HELLO
Hello
hello
```

→

```text
hello
```

Other examples:

```text
can't → can not
u → you
gr8 → great
```

However, aggressive normalization can destroy useful information.

---

# 27. Handling Spelling Errors

User-generated text often contains:

```text
recieve
recieved
goood
amaazing
```

Possible approaches:

* Dictionary correction
* Edit distance
* Spell-checking
* Character features
* Robust embeddings

But automatic correction can also introduce errors.

---

# 28. Edit Distance

**Levenshtein distance** measures how many single-character operations are required to transform one string into another.

Operations:

```text
Insertion
Deletion
Substitution
```

Example:

```text
cat
bat
```

Distance:

```text
1
```

because:

```text
c → b
```

---

# 29. N-Grams

An **N-gram** is a sequence of `N` consecutive tokens.

### Unigram

```text
"I love machine learning"
```

becomes:

```text
I
love
machine
learning
```

### Bigram

```text
I love
love machine
machine learning
```

### Trigram

```text
I love machine
love machine learning
```

---

# 30. Why N-Grams Matter

A unigram model treats:

```text
"not good"
```

as:

```text
not
good
```

A bigram captures:

```text
not good
```

which preserves some local context.

---

# 31. N-Gram Trade-Off

Increasing `n` captures more context but increases vocabulary size.

```text
Unigram
→ Small vocabulary

Bigram
→ More context

Trigram
→ More context

Large N
→ Huge sparse feature space
```

---

# 32. Bag of Words

**Bag of Words (BoW)** represents text using word occurrence counts.

Suppose:

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

Representations:

```text
Document 1:
[1, 1, 1, 0, 0]

Document 2:
[1, 1, 0, 1, 1]
```

---

# 33. Why Is It Called "Bag"?

Because word order is largely ignored.

These:

```text
"dog bites man"
"man bites dog"
```

can produce similar word-count representations.

That is a major limitation.

---

# 34. CountVectorizer

scikit-learn implementation:

```python
from sklearn.feature_extraction.text import CountVectorizer

documents = [
    "I love Python",
    "I love machine learning"
]

vectorizer = CountVectorizer()

X = vectorizer.fit_transform(documents)

print(vectorizer.get_feature_names_out())
print(X.toarray())
```

---

# 35. Sparse Matrices

Text datasets often contain thousands of possible words.

But each document contains only a small subset.

Example:

```text
Vocabulary = 50,000 words
Document = 20 words
```

Most values are zero.

This creates a **sparse matrix**.

```text
[0,0,0,1,0,0,0,0,1,0,...]
```

Libraries therefore use sparse matrix representations to save memory.

---

# 36. TF-IDF

**TF-IDF = Term Frequency-Inverse Document Frequency**

It measures how important a word is to a document relative to a collection of documents.

The basic idea:

```text
Common everywhere
→ Less important

Common in one document
→ More important
```

---

# 37. Term Frequency

Term Frequency measures how frequently a term occurs in a document.

Simple concept:

$$
TF(t,d)=\frac{\text{count of }t\text{ in }d}{\text{total terms in }d}
$$

Example:

```text
Document:
"python python machine learning"
```

`python` appears twice.

---

# 38. Inverse Document Frequency

IDF reduces the importance of words appearing in many documents.

A common form is:

$$
IDF(t)=\log\left(\frac{N}{df(t)}\right)
$$

Where:

* `N` = number of documents
* `df(t)` = number of documents containing term `t`

If a word appears in almost every document, its IDF is lower.

---

# 39. TF-IDF Formula

$$
TFIDF(t,d)=TF(t,d)\times IDF(t)
$$

So:

```text
High frequency in current document
+
Low frequency across all documents
=
High TF-IDF
```

---

# 40. TfidfVectorizer

```python
from sklearn.feature_extraction.text import TfidfVectorizer

documents = [
    "I love Python",
    "Python is powerful",
    "Machine learning is powerful"
]

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(documents)

print(vectorizer.get_feature_names_out())
print(X.toarray())
```

---

# 41. BoW vs TF-IDF

| Bag of Words              | TF-IDF                        |
| ------------------------- | ----------------------------- |
| Counts words              | Weights words                 |
| Simple                    | More informative              |
| Common words can dominate | Common words are downweighted |
| Good baseline             | Strong classical baseline     |

---

# 42. Limitations of TF-IDF

TF-IDF does not truly understand meaning.

For example:

```text
car
automobile
vehicle
```

are semantically related.

TF-IDF treats them as separate vocabulary terms.

This is where **word embeddings** become useful.

---

# 43. Word Embeddings

Word embeddings represent words as dense numerical vectors.

Example:

```text
king
 ↓
[0.21, -0.14, 0.83, ...]
```

Instead of:

```text
word → ID
```

we have:

```text
word → vector
```

The vector can capture semantic relationships.

---

# 44. Dense vs Sparse Representation

### TF-IDF

```text
[0, 0, 0, 0, 0, 0, 0.8, 0, 0]
```

Mostly zeros.

### Embedding

```text
[0.21, -0.44, 0.71, 0.13, ...]
```

Mostly non-zero.

---

# 45. Word2Vec

**Word2Vec** learns word representations from surrounding context.

Two common approaches:

```text
CBOW
Skip-Gram
```

---

# 46. CBOW

**Continuous Bag of Words** predicts a target word from surrounding words.

Example:

```text
The cat is ___ the mat.
```

Context:

```text
The cat is
the mat
```

Model predicts:

```text
on
```

---

# 47. Skip-Gram

Skip-Gram does the opposite.

Given a target word:

```text
cat
```

predict surrounding context:

```text
the
is
on
```

Conceptually:

```text
Word
 ↓
Predict Context
```

---

# 48. Word2Vec Intuition

Words appearing in similar contexts tend to develop similar vectors.

For example:

```text
king
queen
prince
princess
```

may occupy related regions in vector space.

This gives embeddings semantic structure.

---

# 49. GloVe

**GloVe = Global Vectors for Word Representation**

GloVe learns word vectors using global word co-occurrence statistics.

Conceptually:

```text
Word Co-occurrence
        ↓
Statistical Relationships
        ↓
Dense Word Vectors
```

Word2Vec and GloVe are classical embedding approaches.

---

# 50. FastText

FastText represents words using character n-grams.

This helps with:

```text
Rare words
Misspellings
Morphologically rich languages
Unknown words
```

Example:

```text
playing
```

can be represented partly using character pieces.

---

# 51. Word Embedding Limitations

Traditional word embeddings generally assign one vector per word.

Therefore:

```text
bank
```

may have the same representation in:

```text
"river bank"
"bank account"
```

But the meanings are different.

Modern contextual models solve this much better.

Those models belong to later Deep Learning / Transformer studies.

---

# 52. Document Embeddings

Sometimes we need one vector representing an entire document.

Possible approaches:

```text
Average Word Embeddings
TF-IDF Vector
Doc2Vec
Sentence Embeddings
```

For classical NLP, averaging word vectors is a simple baseline.

---

# 53. Vector Similarity

Once text is represented as vectors, we can calculate similarity.

Common measure:

**Cosine Similarity**

$$
cos(\theta)=
\frac{A\cdot B}
{||A||||B||}
$$

Example:

```python
from sklearn.metrics.pairwise import cosine_similarity

similarity = cosine_similarity(X)
```

---

# 54. Text Similarity

Example:

```text
Text A:
"I love machine learning."

Text B:
"Machine learning is amazing."
```

Their vectors may have relatively high similarity.

Applications:

```text
Duplicate detection
Document search
Recommendation
FAQ matching
Plagiarism detection
```

---

# 55. Text Classification

One of the most important classical NLP tasks is **text classification**.

Input:

```text
"I love this product."
```

Output:

```text
Positive
```

Another:

```text
"Win a free prize now!!!"
```

Output:

```text
Spam
```

---

# 56. Classical NLP Classification Pipeline

```text
Raw Text
   ↓
Cleaning
   ↓
Tokenization
   ↓
TF-IDF
   ↓
Train/Test Split
   ↓
ML Classifier
   ↓
Evaluation
```

Common models:

```text
Logistic Regression
Naive Bayes
SVM
Random Forest
Gradient Boosting
```

For sparse text features, linear models are often strong baselines.

---

# 57. Logistic Regression for NLP

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

This creates an end-to-end text classification pipeline.

---

# 58. Naive Bayes for NLP

Naive Bayes is a classical probabilistic classifier.

It is especially popular for:

```text
Spam detection
Text classification
Document classification
```

Example:

```python
from sklearn.naive_bayes import MultinomialNB

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", MultinomialNB())
])
```

---

# 59. SVM for NLP

Linear SVM can work very well with high-dimensional sparse text features.

```python
from sklearn.svm import LinearSVC

model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LinearSVC())
])
```

---

# 60. Sentiment Analysis

**Sentiment Analysis** identifies the emotional polarity of text.

Common classes:

```text
Positive
Negative
Neutral
```

Example:

```text
"This laptop is excellent."
→ Positive

"The battery is terrible."
→ Negative

"The laptop arrived today."
→ Neutral
```

---

# 61. Sentiment Analysis Pipeline

```text
Reviews
   ↓
Clean Text
   ↓
TF-IDF / Embeddings
   ↓
Classifier
   ↓
Positive / Negative / Neutral
```

---

# 62. Sentiment Challenges

Consider:

```text
"The battery is not bad."
```

Simple keyword matching may see:

```text
bad
```

and incorrectly classify it as negative.

Other challenges:

```text
Sarcasm
Negation
Slang
Mixed sentiment
Context
Emojis
```

---

# 63. Negation

Negation is extremely important.

Compare:

```text
"I like this."

"I do not like this."
```

A preprocessing pipeline should avoid destroying:

```text
not
never
no
```

when they are important to the task.

---

# 64. Spam Detection

Spam classification is another practical NLP application.

Example:

```text
"Congratulations! You won $1000."
```

Possible output:

```text
Spam
```

Legitimate:

```text
"Your meeting is scheduled for 3 PM."
```

Output:

```text
Ham
```

---

# 65. Spam Detection Workflow

```text
SMS Dataset
    ↓
Text Cleaning
    ↓
Train/Test Split
    ↓
TF-IDF
    ↓
Naive Bayes / Logistic Regression / SVM
    ↓
Precision / Recall / F1
```

---

# 66. Topic Modeling

**Topic Modeling** discovers hidden themes in a collection of documents.

Suppose we have thousands of news articles.

The model may discover:

```text
Topic 1 → Sports
Topic 2 → Politics
Topic 3 → Technology
Topic 4 → Business
```

without manually assigning labels.

---

# 67. LDA Topic Modeling

**LDA = Latent Dirichlet Allocation**

Important:

> This is different from **Linear Discriminant Analysis** from Module 07.

LDA topic modeling assumes documents contain mixtures of topics and topics contain distributions of words.

Example:

```text
Document
 ↓
Topic A 70%
Topic B 20%
Topic C 10%
```

---

# 68. Topic Modeling Intuition

Imagine a document:

```text
"Python, model, training, dataset, neural network"
```

The model may discover a topic associated with:

```text
Machine Learning
```

Another document:

```text
"goal, player, match, league, score"
```

may form:

```text
Sports
```

---

# 69. LDA with scikit-learn

```python
from sklearn.decomposition import LatentDirichletAllocation

lda = LatentDirichletAllocation(
    n_components=5,
    random_state=42
)

topic_matrix = lda.fit_transform(X)
```

`n_components` represents the number of topics to discover.

---

# 70. Topic Modeling Limitations

Topic models are unsupervised.

The discovered topics do not automatically receive meaningful human labels.

The model might discover:

```text
Topic 1:
game, player, team, score
```

You interpret this as:

```text
Sports
```

The human assigns the label.

---

# 71. Named Entity Recognition

**NER = Named Entity Recognition**

NER identifies entities in text.

Example:

```text
"Elon Musk founded SpaceX in 2002."
```

Possible entities:

```text
Elon Musk → PERSON
SpaceX    → ORGANIZATION
2002      → DATE
```

---

# 72. Common Entity Types

```text
PERSON
ORGANIZATION
LOCATION
DATE
TIME
MONEY
PRODUCT
EVENT
```

Exact entity categories depend on the NLP library and dataset.

---

# 73. Why NER Is Useful

Applications:

```text
Information extraction
Document processing
Search
News analysis
Customer support
Resume parsing
Financial document analysis
```

For example, a resume parser might extract:

```text
Name
Company
University
Skills
Location
Dates
```

---

# 74. Classical vs Modern NER

Traditional approaches included:

```text
Rules
Regular Expressions
Hidden Markov Models
CRF
```

Modern systems often use neural architectures and Transformers.

Detailed modern NER belongs later in the Deep Learning/NLP curriculum.

---

# 75. Regular Expressions in NLP

Regex can extract structured patterns.

Example:

```python
import re

text = "Contact us at test@example.com"

emails = re.findall(
    r'\b[\w.-]+@[\w.-]+\.\w+\b',
    text
)
```

Output:

```text
["test@example.com"]
```

Regex is useful when patterns are predictable.

---

# 76. Regex Limitations

Regex cannot truly understand language.

For example:

```text
"Apple released a new iPhone."
```

and:

```text
"I ate an apple."
```

A regex alone cannot reliably understand the semantic difference.

---

# 77. Text Clustering

Text can also be clustered without labels.

Workflow:

```text
Documents
   ↓
TF-IDF
   ↓
Vector Representation
   ↓
K-Means
   ↓
Document Groups
```

Example:

```text
Cluster 1 → Sports
Cluster 2 → Technology
Cluster 3 → Business
```

---

# 78. K-Means for Text

```python
from sklearn.cluster import KMeans

model = KMeans(
    n_clusters=3,
    random_state=42,
    n_init="auto"
)

clusters = model.fit_predict(X)
```

The choice of `n_clusters` is important.

---

# 79. Information Retrieval

**Information Retrieval (IR)** is the process of finding relevant information from a collection of documents.

Search engines are a major example.

```text
User Query
    ↓
Search System
    ↓
Retrieve Documents
    ↓
Rank Documents
    ↓
Results
```

---

# 80. Classical Search with TF-IDF

A basic search system can:

```text
Query
 ↓
TF-IDF vector
 ↓
Compare against document vectors
 ↓
Cosine similarity
 ↓
Rank documents
```

This is a useful foundation for understanding modern search and retrieval systems.

---

# 81. Search Example

Documents:

```text
D1:
Python machine learning tutorial

D2:
Java web development guide

D3:
Machine learning with Python
```

Query:

```text
Python machine learning
```

TF-IDF + cosine similarity can rank:

```text
D1
D3
D2
```

depending on the learned weights.

---

# 82. Text Classification Evaluation

Use the classification metrics from Module 08.

Important metrics:

```text
Accuracy
Precision
Recall
F1
ROC-AUC
Precision-Recall
```

For imbalanced text datasets, accuracy can be misleading.

---

# 83. Confusion Matrix for NLP

Example spam detector:

|             | Predicted Spam | Predicted Ham |
| ----------- | -------------: | ------------: |
| Actual Spam |             TP |            FN |
| Actual Ham  |             FP |            TN |

This helps understand what kinds of mistakes the classifier makes.

---

# 84. Precision in Spam Detection

High precision means:

> When the model says something is spam, it is usually spam.

This is important because false positives could cause legitimate messages to be hidden.

---

# 85. Recall in Spam Detection

High recall means:

> The model catches most actual spam messages.

But increasing recall may also increase false positives.

Therefore the appropriate threshold depends on the application.

---

# 86. Train/Test Split

For NLP classification:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    texts,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels
)
```

---

# 87. Avoiding Data Leakage

Do not fit your vectorizer on the complete dataset before splitting.

Incorrect:

```python
vectorizer.fit_transform(all_text)
```

before train/test separation.

Better:

```text
Training Text
     ↓
fit TF-IDF
     ↓
Training Matrix

Test Text
     ↓
transform using same TF-IDF
     ↓
Test Matrix
```

Pipeline:

```python
Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("model", LogisticRegression())
])
```

handles this correctly.

---

# 88. Vocabulary Leakage

Suppose the test set contains a word that should not influence vocabulary construction.

If you build vocabulary using the complete dataset, information from the test set has influenced preprocessing.

Therefore:

```text
fit()
→ Training data only

transform()
→ Validation/Test data
```

---

# 89. NLP Cross-Validation

For classification:

```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    model,
    X_train,
    y_train,
    cv=5,
    scoring="f1"
)
```

Pipeline preprocessing is repeated correctly inside each fold.

---

# 90. Feature Engineering for NLP

Useful classical NLP features include:

```text
Word counts
Character counts
Sentence counts
Average word length
Number of punctuation marks
Number of URLs
Number of digits
Uppercase ratio
N-grams
TF-IDF
```

---

# 91. Character Features

Character n-grams can be useful for:

```text
Spelling variations
Short texts
Social media
Spam detection
Languages with complex morphology
```

Example:

```python
TfidfVectorizer(
    analyzer="char",
    ngram_range=(3, 5)
)
```

---

# 92. Word vs Character N-Grams

| Word N-Grams         | Character N-Grams             |
| -------------------- | ----------------------------- |
| Semantic word units  | Subword patterns              |
| Easier to interpret  | Robust to spelling variations |
| Larger vocabulary    | Can become very large         |
| Good for normal text | Good for noisy text           |

---

# 93. Word-Level TF-IDF

```python
vectorizer = TfidfVectorizer(
    analyzer="word",
    ngram_range=(1, 2)
)
```

This creates:

```text
Unigrams
+
Bigrams
```

---

# 94. Controlling Vocabulary

Large datasets can produce huge vocabularies.

Useful parameters:

```python
TfidfVectorizer(
    min_df=2,
    max_df=0.95,
    max_features=10000
)
```

### `min_df`

Ignore extremely rare terms.

### `max_df`

Ignore extremely common terms.

### `max_features`

Limit vocabulary size.

---

# 95. Maximum Features

Suppose the corpus contains:

```text
500,000 unique terms
```

Training with every feature may be expensive.

We can limit it:

```python
TfidfVectorizer(
    max_features=50_000
)
```

This can reduce memory and computation.

---

# 96. Binary Features

Sometimes word presence is more useful than count.

Example:

```text
word exists → 1
word absent → 0
```

`CountVectorizer` supports:

```python
CountVectorizer(
    binary=True
)
```

This can work well for some classification tasks.

---

# 97. Sublinear TF

Very frequent terms don't necessarily become proportionally more informative.

TF-IDF can use sublinear term frequency:

```python
TfidfVectorizer(
    sublinear_tf=True
)
```

This changes the term-frequency weighting.

---

# 98. Class Imbalance in NLP

Suppose:

```text
95,000 normal messages
5,000 spam messages
```

A model predicting everything as normal achieves:

```text
95% accuracy
```

but is useless for spam detection.

Solutions may include:

```text
Class weights
Resampling
Threshold tuning
Better metrics
More data
```

---

# 99. Class Weights

For Logistic Regression:

```python
LogisticRegression(
    class_weight="balanced",
    max_iter=1000
)
```

This gives more importance to minority classes during training.

---

# 100. Multiclass Text Classification

NLP isn't limited to binary classification.

Example:

```text
Sports
Technology
Business
Entertainment
Politics
```

The classifier chooses one of multiple classes.

Many scikit-learn classifiers support multiclass classification directly.

---

# 101. Multi-Label Classification

A document can belong to multiple categories.

Example:

```text
Article:
"AI is transforming healthcare."
```

Labels:

```text
AI
Healthcare
Technology
```

This is **multi-label classification**, not ordinary multiclass classification.

---

# 102. Multiclass vs Multi-Label

| Multiclass          | Multi-Label            |
| ------------------- | ---------------------- |
| One class           | Multiple classes       |
| Cat OR Dog OR Bird  | Cat + Animal + Pet     |
| One output category | Multiple output labels |

This distinction is important in real NLP systems.

---

# 103. Text Preprocessing Function

A reusable preprocessing function might look like:

```python
import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
```

But remember:

> Don't blindly apply aggressive cleaning to every NLP problem.

---

# 104. End-to-End NLP Example

```python
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

df = pd.read_csv("reviews.csv")

X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=2
        )
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print(
    classification_report(
        y_test,
        predictions
    )
)
```

---

# 105. Why Pipelines Matter

Without a pipeline:

```text
Preprocess
Vectorize
Train
Evaluate
```

you can accidentally fit preprocessing on the wrong data.

With a pipeline:

```text
Raw Text
 ↓
TF-IDF
 ↓
Classifier
```

all steps are connected and cross-validation can correctly fit transformations only on training folds.

---

# 106. NLP Pipeline with Grid Search

```python
from sklearn.model_selection import GridSearchCV

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("model", LogisticRegression(max_iter=1000))
])

params = {
    "tfidf__ngram_range": [
        (1, 1),
        (1, 2)
    ],
    "tfidf__min_df": [
        1,
        2,
        5
    ],
    "model__C": [
        0.1,
        1,
        10
    ]
}

search = GridSearchCV(
    pipeline,
    params,
    cv=5,
    scoring="f1"
)

search.fit(X_train, y_train)
```

This connects NLP with the **Hyperparameter Tuning** module.

---

# 107. Classical NLP Model Comparison

A useful experiment:

```text
TF-IDF
 ↓
Logistic Regression

TF-IDF
 ↓
Naive Bayes

TF-IDF
 ↓
Linear SVM
```

Compare:

```text
Accuracy
Precision
Recall
F1
Training time
Prediction time
```

---

# 108. Baseline First

A strong NLP workflow starts with a simple baseline.

For example:

```text
TF-IDF + Logistic Regression
```

Then compare:

```text
TF-IDF + Naive Bayes
TF-IDF + Linear SVM
Word Embeddings + ML model
```

This tells you whether additional complexity actually helps.

---

# 109. Why Linear Models Work Well with TF-IDF

TF-IDF creates:

```text
High-dimensional
Sparse
Numerical features
```

Linear models can efficiently learn decision boundaries in this space.

Common strong baselines:

```text
Logistic Regression
Linear SVM
Naive Bayes
```

---

# 110. NLP Model Selection

Choose based on:

```text
Dataset size
Feature representation
Class balance
Latency requirements
Interpretability
Accuracy requirements
Compute resources
```

Don't choose a model only because it is more complicated.

---

# 111. Interpretability

One advantage of classical NLP is that features can often be inspected.

For Logistic Regression:

```python
model.coef_
```

can help identify influential features.

This can be useful in:

```text
Spam detection
Sentiment analysis
Document classification
```

---

# 112. Important NLP Challenges

Real-world NLP has many complications:

```text
Misspellings
Slang
Sarcasm
Abbreviations
Multiple languages
Code-switching
Domain-specific terminology
Very long documents
Rare words
Ambiguous words
Negation
Class imbalance
Noisy text
```

A production system must account for the actual data.

---

# 113. Domain-Specific NLP

A model trained on general English may struggle with:

```text
Medical language
Legal language
Financial language
Technical documentation
Scientific papers
```

For example:

```text
"terminal"
```

can have different meanings in different domains.

Domain-specific data is therefore important.

---

# 114. Multilingual NLP

Different languages have different:

```text
Grammar
Word order
Morphology
Writing systems
Tokenization requirements
```

A preprocessing pipeline designed for English may not work correctly for Urdu, Arabic, Chinese, Japanese, etc.

---

# 115. Urdu NLP Example

Urdu can involve:

```text
Unicode normalization
Right-to-left text
Different word forms
Roman Urdu
Code-switching
```

Example:

```text
"mera phone acha hai"
```

Roman Urdu may require different preprocessing from standard Urdu script.

---

# 116. Unicode

Text isn't simply ASCII.

Examples:

```text
English → A
Urdu    → ا
Arabic  → ا
Emoji   → 😊
```

Always ensure your data-processing pipeline correctly handles Unicode.

---

# 117. Emojis

Emojis can contain sentiment.

Example:

```text
"Great product 😊"
```

Removing the emoji may remove useful information.

Possible strategies:

```text
Keep emoji
Convert emoji to text
Create emoji features
```

Choice depends on the task.

---

# 118. Hashtags

Social-media text:

```text
#MachineLearning
#AI
#Python
```

Hashtags can provide strong topical information.

Instead of simply removing `#`, you may transform:

```text
#MachineLearning
```

into:

```text
machine learning
```

when appropriate.

---

# 119. Mentions

Social media may contain:

```text
@username
```

Depending on the task, mentions may be:

```text
Removed
Anonymized
Converted into a feature
```

Never assume they are useless.

---

# 120. URLs

For sentiment analysis, URLs may be mostly noise.

For:

```text
phishing detection
website classification
cybersecurity
```

URLs can be extremely useful.

This illustrates an important NLP principle:

> **Feature usefulness depends on the task.**

---

# 121. Document Length

Documents may vary greatly:

```text
Tweet → 10 words
Review → 100 words
Article → 2,000 words
Book → 100,000+ words
```

Classical TF-IDF can handle documents, but very long documents can create different modeling challenges.

---

# 122. Long Documents

Possible strategies:

```text
Split into paragraphs
Split into sentences
Create chunk-level features
Aggregate predictions
Use document-level features
```

Modern long-context approaches are covered later.

---

# 123. Information Extraction

Information extraction converts unstructured text into structured data.

Example:

```text
"John joined Microsoft in 2024."
```

Output:

```json
{
  "person": "John",
  "organization": "Microsoft",
  "year": 2024
}
```

Useful techniques:

```text
Regex
NER
Relation extraction
Keyword extraction
```

---

# 124. Keyword Extraction

A simple keyword extraction approach can use TF-IDF.

Words with high TF-IDF scores can indicate terms important to a document.

Example:

```text
Document:
"Python machine learning model training"

Potential keywords:
Python
machine
learning
model
training
```

More advanced keyword extraction methods exist.

---

# 125. Keyword Extraction Limitations

TF-IDF keywords may not always represent the actual concept.

For example:

```text
"company"
"people"
"information"
```

may occur frequently but provide little specific meaning.

Domain knowledge remains useful.

---

# 126. Text Summarization

Summarization creates a shorter representation of a document.

Two major approaches:

```text
Extractive
Abstractive
```

### Extractive

Selects existing sentences.

### Abstractive

Generates new wording.

Modern abstractive summarization is mainly a Transformer/Generative AI topic and is outside the classical scope of this module.

---

# 127. Classical Extractive Summarization

A simple extractive system can:

```text
Split document into sentences
       ↓
Calculate sentence importance
       ↓
Rank sentences
       ↓
Select top sentences
```

TF-IDF or graph-based methods can be used.

---

# 128. Question Classification

Before building advanced question-answering systems, classical NLP can classify queries.

Example:

```text
"Where is my order?"
→ Order Status

"How can I return this?"
→ Return Request

"How do I change my password?"
→ Account Support
```

This is essentially text classification.

---

# 129. Intent Classification

Intent classification identifies the purpose of a user message.

```text
User:
"I want to cancel my order."

Intent:
cancel_order
```

This is widely used in:

```text
Chatbots
Customer support
Voice assistants
Automation
```

Modern LLM agents can perform this too, but classical classifiers provide a useful foundation.

---

# 130. NLP and Recommendation Systems

NLP can provide features for recommendation systems.

Example:

```text
Product Description
       ↓
TF-IDF / Embedding
       ↓
Product Vector
       ↓
Similarity
       ↓
Recommendations
```

This connects Module 13 with Module 12.

---

# 131. NLP and Search

Search systems can use:

```text
TF-IDF
BM25
Embeddings
Vector similarity
Learning-to-rank
```

Classical keyword-based retrieval forms an important foundation for understanding modern semantic search and RAG.

---

# 132. TF-IDF vs Embeddings

| TF-IDF            | Word Embeddings                |
| ----------------- | ------------------------------ |
| Sparse            | Dense                          |
| Lexical matching  | Semantic relationships         |
| Easy to interpret | Less directly interpretable    |
| Fast              | More computationally expensive |
| Strong baseline   | Better semantic representation |
| No deep context   | Limited contextual meaning     |

---

# 133. Classical NLP vs Modern NLP

| Classical NLP | Modern NLP              |
| ------------- | ----------------------- |
| TF-IDF        | Transformers            |
| BoW           | BERT                    |
| N-Grams       | GPT                     |
| Word2Vec      | Contextual embeddings   |
| Naive Bayes   | Transformer classifiers |
| Linear SVM    | LLMs                    |
| Regex         | Neural extraction       |

This module establishes the foundation required to understand why modern NLP systems evolved.

---

# 134. What Happens to NLP Later?

Your learning path continues:

```text
Classical NLP
     ↓
Deep Learning
     ↓
RNN / LSTM
     ↓
Attention
     ↓
Transformers
     ↓
BERT / GPT-style models
     ↓
Embeddings
     ↓
LLMs
     ↓
RAG
     ↓
Agents
```

Therefore this module should make classical NLP comfortable without duplicating your later Transformer/LLM work.

---

# 135. Practical NLP Project Architecture

A clean project might look like:

```text
nlp-project/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   ├── 01-eda.ipynb
│   ├── 02-preprocessing.ipynb
│   ├── 03-modeling.ipynb
│   └── 04-evaluation.ipynb
│
├── src/
│   ├── preprocessing.py
│   ├── features.py
│   ├── train.py
│   └── predict.py
│
├── models/
│
├── tests/
│
├── requirements.txt
│
└── README.md
```

---

# 136. Production NLP Workflow

```text
Data Collection
      ↓
Data Validation
      ↓
Cleaning
      ↓
Train/Validation/Test Split
      ↓
Feature Engineering
      ↓
Vectorization
      ↓
Model Training
      ↓
Cross-Validation
      ↓
Hyperparameter Tuning
      ↓
Evaluation
      ↓
Model Saving
      ↓
API
      ↓
Deployment
      ↓
Monitoring
```

---

# 137. Saving an NLP Pipeline

Because the vectorizer and model must stay together, save the entire pipeline.

```python
import joblib

joblib.dump(
    model,
    "nlp_pipeline.joblib"
)
```

Load:

```python
model = joblib.load(
    "nlp_pipeline.joblib"
)
```

Now:

```python
model.predict([
    "This product is amazing!"
])
```

can perform vectorization and prediction.

---

# 138. NLP API

A FastAPI service could expose:

```text
POST /predict
```

Input:

```json
{
  "text": "This product is excellent"
}
```

Output:

```json
{
  "label": "positive"
}
```

This connects NLP with your later **Model Deployment** module.

---

# 139. Batch vs Real-Time NLP

### Batch

Process thousands/millions of documents periodically.

```text
Database
 ↓
Batch Job
 ↓
NLP Model
 ↓
Results
```

### Real-Time

Process each request immediately.

```text
User
 ↓
API
 ↓
NLP Model
 ↓
Response
```

Choice depends on latency and business requirements.

---

# 140. NLP Performance Considerations

Important production metrics include:

```text
Accuracy
F1
Precision
Recall
Latency
Throughput
Memory
Model size
Inference cost
```

A model with slightly higher accuracy may not be practical if it is dramatically slower or more expensive.

---

# 141. Error Analysis

Never stop at a single metric.

Inspect wrong predictions.

Example:

```text
Text:
"The battery is not bad."

Actual:
Positive

Predicted:
Negative
```

This reveals a **negation problem**.

Error analysis tells you what to improve.

---

# 142. NLP Error Categories

Create categories such as:

```text
Negation
Sarcasm
Spelling
Unknown words
Slang
Ambiguity
Long text
Class imbalance
Incorrect labels
```

Then measure which errors are most common.

---

# 143. Data Quality

In NLP:

> Better data can matter more than a more complicated model.

Check:

```text
Duplicate texts
Wrong labels
Empty texts
Encoding problems
Spam/noise
Inconsistent labels
Class imbalance
```

---

# 144. Duplicate Detection

Duplicate documents can cause problems.

Example:

```text
Training:
"This phone is excellent."

Test:
"This phone is excellent."
```

The model may appear extremely accurate because it has effectively seen the same example.

Deduplication is therefore part of data quality.

---

# 145. Label Quality

Suppose:

```text
Text A → Positive
Text B → Negative
Text C → Positive
```

but human annotators disagree frequently.

No model can reliably learn inconsistent labels.

Review ambiguous samples.

---

# 146. Train/Validation/Test for NLP

Recommended:

```text
Dataset
  ↓
Train 70–80%
Validation 10–15%
Test 10–15%
```

Exact percentages depend on dataset size.

For smaller datasets, cross-validation can be particularly useful.

---

# 147. Stratification

If labels are imbalanced:

```python
train_test_split(
    X,
    y,
    stratify=y
)
```

helps preserve class proportions between splits.

---

# 148. NLP Reproducibility

Use:

```python
random_state=42
```

where supported.

Also record:

```text
Dataset version
Preprocessing configuration
Vectorizer settings
Model parameters
Training date
Evaluation metrics
Library versions
```

This becomes important in production ML.

---

# 149. NLP Experiment Tracking

You can track:

```text
Experiment
↓
Vectorizer
↓
Hyperparameters
↓
Model
↓
Metrics
```

Example:

```text
Experiment 01
TF-IDF + Logistic Regression
F1 = 0.91

Experiment 02
TF-IDF + Linear SVM
F1 = 0.93
```

This connects directly to your later **MLflow** module.

---

# 150. Recommended Classical NLP Toolkit

```text
Python
│
├── NLTK
├── spaCy
├── scikit-learn
├── Gensim
├── Pandas
├── NumPy
└── Matplotlib
```

Typical roles:

| Tool         | Typical use                       |
| ------------ | --------------------------------- |
| NLTK         | NLP learning/classical processing |
| spaCy        | Practical NLP pipelines/NER       |
| scikit-learn | Vectorization + ML                |
| Gensim       | Topic modeling/embeddings         |
| Pandas       | Data processing                   |

---

# 151. NLTK

NLTK provides many educational and classical NLP components.

Examples:

```text
Tokenization
Stop words
Stemming
Lemmatization
Corpus processing
```

It is useful for understanding NLP fundamentals.

---

# 152. spaCy

spaCy focuses on practical NLP pipelines.

It provides functionality for:

```text
Tokenization
POS tagging
NER
Lemmatization
Dependency parsing
```

It is commonly used in production-oriented classical NLP workflows.

---

# 153. scikit-learn NLP

scikit-learn is particularly useful for:

```text
CountVectorizer
TfidfVectorizer
Classification
Clustering
Feature selection
Evaluation
Pipelines
Hyperparameter tuning
```

For your classical NLP learning, it should be one of the main tools.

---

# 154. Gensim

Gensim is associated with:

```text
Topic modeling
Word embeddings
Document similarity
```

It is useful when studying Word2Vec and LDA-style workflows.

---

# 155. NLP Dataset Sources

Useful dataset categories:

```text
Movie reviews
Product reviews
SMS spam
News articles
Tweets/social media
Question-answer datasets
Text classification datasets
```

When selecting a dataset, check:

```text
Size
Language
Labels
Class balance
Licensing
Data quality
Duplicate samples
```

---

# 156. Example Project — Sentiment Analysis

```text
Dataset
  ↓
Reviews
  ↓
Clean Text
  ↓
Train/Test Split
  ↓
TF-IDF
  ↓
Logistic Regression
  ↓
F1 / Precision / Recall
  ↓
Error Analysis
```

---

# 157. Example Project — Spam Detector

```text
SMS
 ↓
Cleaning
 ↓
TF-IDF
 ↓
Naive Bayes
 ↓
Confusion Matrix
 ↓
Precision / Recall
 ↓
API
```

---

# 158. Example Project — News Classifier

Classes:

```text
Business
Sports
Technology
Politics
Entertainment
```

Pipeline:

```text
News Article
 ↓
TF-IDF
 ↓
Linear SVM
 ↓
Predicted Category
```

---

# 159. Example Project — Document Similarity

```text
Documents
 ↓
TF-IDF
 ↓
Cosine Similarity
 ↓
Similarity Matrix
 ↓
Top Similar Documents
```

Applications:

```text
Duplicate detection
Recommendation
Search
Document organization
```

---

# 160. Example Project — Topic Discovery

```text
Thousands of Articles
        ↓
TF-IDF / Count Matrix
        ↓
LDA
        ↓
Topics
        ↓
Top Words per Topic
```

---

# 161. Example Project — Resume Classification

Possible labels:

```text
Software Engineering
Data Science
AI/ML
DevOps
Finance
Marketing
```

Input:

```text
Resume text
```

Output:

```text
Predicted category
```

This connects classical NLP with real-world document intelligence.

---

# 162. NLP Learning Order

Recommended learning sequence:

```text
1. Text Fundamentals
        ↓
2. Cleaning
        ↓
3. Tokenization
        ↓
4. Stop Words
        ↓
5. Stemming
        ↓
6. Lemmatization
        ↓
7. N-Grams
        ↓
8. Bag of Words
        ↓
9. TF-IDF
        ↓
10. Word Embeddings
        ↓
11. Similarity
        ↓
12. Classification
        ↓
13. Sentiment
        ↓
14. Topic Modeling
        ↓
15. NER
        ↓
16. Search / Retrieval
        ↓
17. Evaluation
        ↓
18. Production Pipeline
```

---

# 163. Complete NLP Mental Model

Think of NLP as four major layers:

```text
┌───────────────────────────────┐
│          APPLICATION          │
│ Search / Spam / Sentiment     │
├───────────────────────────────┤
│            MODEL              │
│ Logistic / SVM / NB / LDA     │
├───────────────────────────────┤
│       REPRESENTATION          │
│ BoW / TF-IDF / Embeddings     │
├───────────────────────────────┤
│        TEXT PROCESSING        │
│ Clean / Tokenize / Normalize  │
└───────────────────────────────┘
```

---

# 164. Most Important Concepts

If you remember only the core concepts, remember:

```text
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
Text Classification
      ↓
Evaluation
```

These provide the foundation for understanding modern NLP.

---

# 165. Classical NLP Cheat Sheet

| Concept             | Purpose                           |
| ------------------- | --------------------------------- |
| Tokenization        | Split text                        |
| Stop Words          | Handle common words               |
| Stemming            | Reduce word forms                 |
| Lemmatization       | Find base words                   |
| N-Grams             | Capture local word sequences      |
| BoW                 | Count word occurrences            |
| TF-IDF              | Weight informative terms          |
| Word2Vec            | Learn word vectors                |
| GloVe               | Learn vectors from co-occurrence  |
| FastText            | Use character/subword information |
| Cosine Similarity   | Compare vectors                   |
| Naive Bayes         | Text classification               |
| Logistic Regression | Text classification               |
| Linear SVM          | Text classification               |
| LDA                 | Topic discovery                   |
| NER                 | Entity extraction                 |
| K-Means             | Text clustering                   |

---

# 🧪 166. Beginner Practice

### Exercise 1

Take:

```text
"I love Machine Learning!"
```

Perform:

```text
Lowercase
Tokenization
Stop-word handling
```

---

### Exercise 2

Create:

```text
10 short documents
```

and build:

```text
CountVectorizer
```

---

### Exercise 3

Use:

```text
TfidfVectorizer
```

and inspect:

```text
Vocabulary
TF-IDF matrix
```

---

### Exercise 4

Compare:

```text
Unigram
Bigram
Unigram + Bigram
```

---

### Exercise 5

Implement:

```text
Stemming
Lemmatization
```

and compare outputs.

---

# 🧪 167. Intermediate Practice

### Exercise 6

Build:

```text
SMS Spam Classifier
```

using:

```text
TF-IDF
+
Naive Bayes
```

---

### Exercise 7

Build:

```text
Sentiment Classifier
```

using:

```text
TF-IDF
+
Logistic Regression
```

---

### Exercise 8

Compare:

```text
Naive Bayes
Logistic Regression
Linear SVM
```

---

### Exercise 9

Use:

```text
Precision
Recall
F1
Confusion Matrix
```

to evaluate the models.

---

### Exercise 10

Perform:

```text
5-fold Cross-Validation
```

---

# 🧪 168. Advanced Classical NLP Practice

### Exercise 11

Build a:

```text
News Topic Classifier
```

---

### Exercise 12

Build:

```text
LDA Topic Model
```

and interpret the topics.

---

### Exercise 13

Build:

```text
Document Similarity System
```

using:

```text
TF-IDF
+
Cosine Similarity
```

---

### Exercise 14

Compare:

```text
Word TF-IDF
Character TF-IDF
```

for noisy text.

---

### Exercise 15

Build a:

```text
Resume Category Classifier
```

---

# 🧪 169. Production Practice

### Exercise 16

Save the complete NLP pipeline:

```text
TF-IDF
+
Classifier
```

using:

```python
joblib
```

---

### Exercise 17

Create:

```text
FastAPI
POST /predict
```

---

### Exercise 18

Create:

```text
Dockerfile
```

for the NLP API.

---

### Exercise 19

Create a simple:

```text
Streamlit UI
```

where users enter text and receive predictions.

---

### Exercise 20

Track experiments using:

```text
MLflow
```

This connects directly to Modules:

```text
14 ML Pipelines
15 MLflow
16 Model Deployment
```

---

# 🎤 170. Beginner Interview Questions

1. What is NLP?
2. Why is NLP difficult?
3. What is tokenization?
4. What are stop words?
5. What is stemming?
6. What is lemmatization?
7. Stemming vs lemmatization?
8. What is an N-gram?
9. What is Bag of Words?
10. Why is BoW called a bag?
11. What is TF-IDF?
12. Why is TF-IDF better than simple word counts in some cases?
13. What is a sparse matrix?
14. What is a word embedding?
15. What is cosine similarity?

---

# 🎤 171. Intermediate Interview Questions

16. TF-IDF vs Word2Vec?
17. Word2Vec CBOW vs Skip-Gram?
18. What is GloVe?
19. What is FastText?
20. Why are embeddings useful?
21. What is text classification?
22. Why is Naive Bayes useful for NLP?
23. Why does Linear SVM work well with TF-IDF?
24. How would you build a spam classifier?
25. How would you build sentiment analysis?
26. What is topic modeling?
27. What is LDA?
28. LDA topic modeling vs Linear Discriminant Analysis?
29. What is NER?
30. What is text similarity?

---

# 🎤 172. Advanced Interview Questions

31. How would you prevent NLP data leakage?
32. Why should TF-IDF be fitted only on training data?
33. Why use a Pipeline?
34. How would you handle class imbalance?
35. Word n-grams vs character n-grams?
36. How would you handle misspellings?
37. How would you handle negation?
38. When should you not remove stop words?
39. When should you not remove punctuation?
40. How would you handle multilingual text?
41. How would you handle very long documents?
42. How would you perform NLP error analysis?
43. How would you deploy an NLP classifier?
44. How would you reduce NLP inference latency?
45. How would you monitor a production NLP model?

---

# 🎤 173. Real-World Interview Scenarios

### Scenario 1

> Your spam classifier has 98% accuracy but catches very little spam. What is wrong?

Think about:

```text
Class imbalance
Recall
Precision
F1
Confusion Matrix
```

---

### Scenario 2

> Your sentiment model performs well during development but badly in production.

Investigate:

```text
Data distribution
Domain shift
Label quality
Preprocessing differences
Vocabulary changes
Class distribution
```

---

### Scenario 3

> You have 1 million documents and TF-IDF creates millions of features.

Consider:

```text
min_df
max_df
max_features
N-grams
Feature selection
Sparse matrices
```

---

### Scenario 4

> Your model treats "good" and "not good" similarly.

Investigate:

```text
Negation
N-grams
Preprocessing
Feature representation
```

---

### Scenario 5

> You need to classify customer support messages into 20 categories.

Possible approach:

```text
Clean text
 ↓
TF-IDF
 ↓
Linear SVM / Logistic Regression
 ↓
Cross-validation
 ↓
F1 evaluation
 ↓
Error analysis
```

---

# 🧠 174. NLP Decision Guide

### Need simple text classification?

Start with:

```text
TF-IDF + Logistic Regression
```

### Need a strong sparse-text baseline?

Try:

```text
TF-IDF + Linear SVM
```

### Need a simple probabilistic classifier?

Try:

```text
TF-IDF + Naive Bayes
```

### Need document similarity?

Try:

```text
TF-IDF + Cosine Similarity
```

### Need topic discovery?

Try:

```text
LDA
```

### Need entity extraction?

Try:

```text
spaCy / NER
```

### Need semantic/contextual understanding?

That is where you move toward:

```text
Embeddings
Transformers
BERT
LLMs
```

---

# 🔥 175. Final NLP Lifecycle

The complete classical NLP workflow is:

```text
                 RAW TEXT
                    │
                    ▼
             DATA COLLECTION
                    │
                    ▼
              DATA CLEANING
                    │
                    ▼
              NORMALIZATION
                    │
                    ▼
              TOKENIZATION
                    │
                    ▼
       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
    WORD/N-GRAMS            EMBEDDINGS
       │                         │
       ▼                         ▼
    BoW / TF-IDF           Word2Vec/GloVe
       │                         │
       └────────────┬────────────┘
                    ▼
             FEATURE MATRIX
                    │
                    ▼
            MACHINE LEARNING
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Classification Clustering  Topic Modeling
        │
        ▼
     EVALUATION
        │
        ▼
    ERROR ANALYSIS
        │
        ▼
     PIPELINE
        │
        ▼
      SAVE
        │
        ▼
       API
        │
        ▼
     DEPLOYMENT
        │
        ▼
     MONITORING
```

---

# ✅ Final Key Takeaways

### Text Processing

```text
Cleaning
Normalization
Tokenization
Stop Words
Stemming
Lemmatization
```

### Representation

```text
N-Grams
Bag of Words
TF-IDF
Word Embeddings
```

### Classical NLP Models

```text
Naive Bayes
Logistic Regression
Linear SVM
K-Means
LDA
```

### NLP Tasks

```text
Classification
Sentiment Analysis
Spam Detection
Topic Modeling
NER
Similarity
Search
Clustering
Information Extraction
```

### Production

```text
Pipeline
Cross-Validation
Evaluation
Error Analysis
Model Saving
FastAPI
Docker
MLflow
```

---

# 🏁 What You Should Be Able to Do After This Module

By the end of this module, you should be able to take raw text and build a complete classical NLP system:

```text
Raw Text
   ↓
Clean & Normalize
   ↓
Tokenize
   ↓
Create Features
   ↓
TF-IDF / Embeddings
   ↓
Train ML Model
   ↓
Cross-Validate
   ↓
Tune
   ↓
Evaluate
   ↓
Analyze Errors
   ↓
Save Pipeline
   ↓
Build API
   ↓
Deploy
```

You should also clearly understand the difference between:

```text
BoW
   ↓
TF-IDF
   ↓
Word2Vec / GloVe / FastText
   ↓
Contextual Embeddings
   ↓
Transformers
   ↓
LLMs
```

The last part is intentionally the **bridge to your Deep Learning and Generative AI curriculum**, rather than duplicating the Transformer/LLM material there.

---

## 🎯 Module Completion Checklist

```text
[ ] Understand NLP fundamentals
[ ] Understand text data
[ ] Clean text
[ ] Normalize text
[ ] Tokenize text
[ ] Understand stop words
[ ] Understand stemming
[ ] Understand lemmatization
[ ] Understand N-grams
[ ] Implement Bag of Words
[ ] Implement TF-IDF
[ ] Understand sparse matrices
[ ] Understand word embeddings
[ ] Understand Word2Vec
[ ] Understand CBOW
[ ] Understand Skip-Gram
[ ] Understand GloVe
[ ] Understand FastText
[ ] Calculate cosine similarity
[ ] Build text classification models
[ ] Build sentiment analysis
[ ] Build spam detection
[ ] Understand topic modeling
[ ] Implement LDA
[ ] Understand NER
[ ] Understand text clustering
[ ] Understand information retrieval
[ ] Handle imbalanced NLP data
[ ] Evaluate NLP models
[ ] Perform error analysis
[ ] Prevent data leakage
[ ] Build sklearn NLP pipelines
[ ] Tune NLP models
[ ] Save NLP pipelines
[ ] Understand NLP deployment
[ ] Understand classical → modern NLP transition
```

---

# 🚀 Next

**14 — ML Pipelines**

```text
sklearn Pipeline
ColumnTransformer
Custom Transformers
Data Preprocessing
Feature Engineering
Model Training
Cross-Validation
Hyperparameter Tuning
End-to-End ML Workflow
```
