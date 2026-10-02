# 10 — Advanced Classical NLP

## 📌 Overview

Classical NLP starts with basic text preprocessing and gradually moves toward more advanced ways of extracting information from text.

By this stage, you already understand:

```text
NLP Fundamentals
      ↓
Text Preprocessing
      ↓
Text Representation
      ↓
BoW
      ↓
TF-IDF
      ↓
Word Embeddings
      ↓
Text Classification
      ↓
Sentiment Analysis
      ↓
NLP Evaluation
```

Now we can combine these concepts to solve more complex NLP problems.

This module focuses on **advanced classical NLP**, before moving toward Deep Learning, Transformers, LLMs, RAG, and Agentic AI.

---

# 1. What Is Advanced Classical NLP?

Advanced classical NLP means using traditional NLP techniques to solve more complex language problems.

Examples include:

* Named Entity Recognition
* Topic Modeling
* Text Clustering
* Keyword Extraction
* Information Extraction
* Document Similarity
* Information Retrieval
* Search
* Long-document processing
* Multilingual text processing
* Domain-specific NLP

The general idea remains:

```text
Text
 ↓
Preprocessing
 ↓
Representation
 ↓
Algorithm
 ↓
Useful Information
```

---

# 2. Named Entity Recognition

**Named Entity Recognition (NER)** identifies important entities inside text.

Example:

```text
"Apple opened a new office in London in 2025."
```

NER could identify:

```text
Apple   → ORGANIZATION
London  → LOCATION
2025    → DATE
```

Common entity types include:

| Entity       | Example      |
| ------------ | ------------ |
| PERSON       | Elon Musk    |
| ORGANIZATION | Microsoft    |
| LOCATION     | Islamabad    |
| DATE         | January 2026 |
| MONEY        | $500         |
| PRODUCT      | iPhone       |

NER is useful for:

* Document processing
* Search
* Resume analysis
* News analysis
* Customer support
* Information extraction

---

# 3. Regex and Rule-Based Extraction

Not every NLP problem requires machine learning.

For structured patterns, **Regular Expressions (Regex)** can be very useful.

Example:

```python
import re

text = "Contact us at test@example.com"

emails = re.findall(
    r'[\w\.-]+@[\w\.-]+\.\w+',
    text
)

print(emails)
```

Output:

```text
['test@example.com']
```

Regex works well for predictable patterns such as:

* Email addresses
* Phone numbers
* URLs
* Dates
* IDs
* Invoice numbers

However, regex struggles with deeper language understanding.

---

# 4. Information Extraction

Information Extraction attempts to convert unstructured text into structured information.

Example:

```text
"Ali joined Microsoft in Islamabad in 2025."
```

Possible structured result:

```text
Person       → Ali
Organization → Microsoft
Location     → Islamabad
Date         → 2025
```

The goal is:

```text
Unstructured Text
        ↓
Structured Information
```

This is extremely useful for business applications.

---

# 5. Keyword Extraction

Keyword extraction identifies the most important words or phrases in a document.

Example:

```text
Document:
"Machine learning allows computers to learn patterns
from data and make predictions."
```

Possible keywords:

```text
machine learning
computers
patterns
data
predictions
```

Classical approaches include:

* TF-IDF
* Frequency-based methods
* N-grams
* TextRank
* RAKE

---

# 6. TF-IDF for Keyword Extraction

TF-IDF can be used to identify important terms.

A word that appears frequently in one document but rarely across the corpus can receive a high TF-IDF score.

Example:

```text
Document A:
"machine learning models predict house prices"

Document B:
"machine learning models classify images"
```

Words such as:

```text
house
prices
classify
images
```

may become more useful for distinguishing the documents.

TF-IDF therefore has applications beyond classification.

---

# 7. TextRank

**TextRank** is a graph-based algorithm inspired by the idea behind PageRank.

It can be used for:

* Keyword extraction
* Extractive summarization

Basic idea:

```text
Text
 ↓
Words / Sentences
 ↓
Graph
 ↓
Importance scores
 ↓
Important keywords / sentences
```

Unlike simple frequency counting, TextRank considers relationships between elements.

---

# 8. Topic Modeling

Topic modeling attempts to discover hidden topics in a collection of documents.

Suppose we have thousands of news articles.

The model might discover topics such as:

```text
Topic 1 → Technology
Topic 2 → Sports
Topic 3 → Politics
Topic 4 → Business
```

No topic labels are necessarily provided.

This makes topic modeling an **unsupervised learning** problem.

---

# 9. Latent Dirichlet Allocation

One classical topic modeling algorithm is **LDA — Latent Dirichlet Allocation**.

Important:

> LDA here means **Latent Dirichlet Allocation**, not Linear Discriminant Analysis.

The basic idea is that documents contain mixtures of topics.

Example:

```text
Document:
"AI companies are developing new machine learning models."

Possible topic distribution:

Technology → 80%
Business   → 15%
Other      → 5%
```

LDA represents:

```text
Document
   ↓
Topic Distribution
   ↓
Word Distribution
```

---

# 10. Topic Modeling Example

Suppose we have:

```text
Doc 1 → football match player goal
Doc 2 → football team championship goal
Doc 3 → stock market company investment
Doc 4 → company revenue financial market
```

Topic modeling may discover:

```text
Topic A:
football
match
player
goal
team

Topic B:
stock
company
market
investment
revenue
```

The algorithm discovers patterns based on word distributions.

---

# 11. Limitations of Classical Topic Modeling

Topic modeling does not truly understand topics like a human.

Problems can include:

* Difficult topic interpretation
* Similar topics
* Poor results with short documents
* Sensitivity to preprocessing
* Choosing number of topics
* Generic words dominating topics

Therefore, topic modeling results should be inspected and interpreted rather than blindly accepted.

---

# 12. Text Clustering

Text clustering groups similar documents without predefined labels.

Example:

```text
Documents
    ↓
TF-IDF
    ↓
K-Means
    ↓
Clusters
```

Possible result:

```text
Cluster 1 → Sports
Cluster 2 → Technology
Cluster 3 → Business
```

This is useful for:

* Document organization
* Customer segmentation
* News grouping
* Support ticket grouping
* Discovering hidden patterns

---

# 13. K-Means for Text

A common classical approach is:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(documents)

model = KMeans(
    n_clusters=3,
    random_state=42
)

model.fit(X)

labels = model.labels_
```

The documents are represented as vectors and grouped according to their similarity.

---

# 14. Document Similarity

Document similarity measures how similar two pieces of text are.

A common method is **cosine similarity**.

Conceptually:

```text
Document A → Vector
Document B → Vector
       ↓
Cosine Similarity
       ↓
Similarity Score
```

Example:

```text
A:
"machine learning tutorial"

B:
"machine learning course"
```

These documents may have relatively high similarity.

---

# 15. Cosine Similarity

The cosine similarity formula is:

```text
              A · B
cosine = ----------------
         ||A|| × ||B||
```

The result commonly ranges from:

```text
-1 → Opposite direction
 0 → No similarity
 1 → Same direction
```

For many TF-IDF applications, values closer to `1` indicate greater similarity.

Python:

```python
from sklearn.metrics.pairwise import cosine_similarity

similarity = cosine_similarity(
    document_vectors
)
```

---

# 16. Information Retrieval

Information Retrieval, or **IR**, is the process of finding relevant information from a collection.

Example:

```text
User Query:
"machine learning tutorial"

        ↓

Search Engine

        ↓

Documents

        ↓

Relevant Results
```

A classical search system can use:

```text
TF-IDF
+
Cosine Similarity
```

The query is converted into a vector and compared with document vectors.

---

# 17. Classical Search Pipeline

A simple search engine:

```text
Documents
   ↓
Clean Text
   ↓
TF-IDF
   ↓
Store Vectors

User Query
   ↓
Same TF-IDF
   ↓
Query Vector
   ↓
Cosine Similarity
   ↓
Rank Documents
   ↓
Return Results
```

This is one of the most important practical applications of classical NLP.

---

# 18. Keyword Search vs Semantic Similarity

Traditional keyword search focuses heavily on exact terms.

Example:

```text
Query:
"car repair"
```

A document containing:

```text
"car repair service"
```

matches directly.

But:

```text
"vehicle maintenance center"
```

may not match strongly using simple keyword methods.

Embeddings can capture broader semantic relationships.

Therefore:

```text
Keyword Search
→ Exact lexical matching

Embeddings
→ Semantic similarity
```

Modern search systems often combine both approaches.

---

# 19. Long Documents

Long documents create challenges.

Examples:

* Books
* Legal documents
* Research papers
* Company reports
* PDFs
* Contracts

A simple approach is to split the document:

```text
Long Document
      ↓
Chunks
      ↓
Process Each Chunk
      ↓
Combine Results
```

For example:

```text
Document
 ├── Chunk 1
 ├── Chunk 2
 ├── Chunk 3
 └── Chunk 4
```

This idea becomes especially important later in **RAG systems**.

---

# 20. Extractive Summarization

Extractive summarization selects important sentences from an existing document.

Example:

```text
Original Document
       ↓
Sentence Scoring
       ↓
Important Sentences
       ↓
Summary
```

Classical approaches can use:

* TF-IDF
* TextRank
* Sentence frequency
* Position
* Similarity

The system selects existing sentences rather than generating completely new ones.

---

# 21. Extractive vs Abstractive Summarization

### Extractive

Uses existing text:

```text
Document
 ↓
Select sentences
 ↓
Summary
```

### Abstractive

Generates new text:

```text
Document
 ↓
Understand content
 ↓
Generate new wording
 ↓
Summary
```

Abstractive summarization is strongly associated with modern deep learning and Transformer-based NLP, so it belongs more naturally in later modules.

---

# 22. Multilingual NLP

Classical NLP becomes more challenging with multiple languages.

Different languages have different:

* Writing systems
* Word structures
* Grammar
* Tokenization rules
* Stop words
* Stemming requirements
* Vocabulary

For example:

```text
English
Urdu
Arabic
Chinese
German
```

should not always be processed using exactly the same rules.

---

# 23. Urdu and Roman Urdu NLP

Roman Urdu introduces another challenge.

Example:

```text
"ye product bohat acha hai"
```

The same idea may be written differently:

```text
"ye product bohat acha hai"
"ye product boht acha hy"
"ya product bohat acha ha"
```

There may be:

* Spelling variation
* English + Urdu mixing
* Informal grammar
* Romanized words
* Different spellings

A classical NLP system may require specialized normalization and training data.

---

# 24. Code-Switching

Code-switching occurs when multiple languages appear in the same sentence.

Example:

```text
"ye phone bohat acha hai but battery weak hai"
```

This contains English and Roman Urdu.

Classical systems can struggle because vocabulary and linguistic rules come from multiple languages.

Possible approaches include:

* Language detection
* Normalization
* Character n-grams
* Multilingual datasets
* Language-specific preprocessing

---

# 25. Unicode Handling

Text may contain Unicode characters from many writing systems.

Examples:

```text
English → Hello
Urdu    → ہیلو
Arabic  → مرحبا
Emoji   → 😊
```

Applications should handle Unicode correctly.

Important areas include:

* Encoding
* Normalization
* Special characters
* Emoji
* Different scripts

Incorrect Unicode handling can corrupt text before the NLP model even receives it.

---

# 26. Domain-Specific NLP

A model trained on general text may perform poorly in a specialized domain.

Examples:

```text
General NLP
     ↓
General vocabulary

Medical NLP
     ↓
Medical terminology

Legal NLP
     ↓
Legal terminology

Financial NLP
     ↓
Financial terminology
```

Domain-specific datasets and vocabulary can improve performance.

---

# 27. Feature Engineering

Classical NLP allows us to manually design useful features.

Examples:

### Word features

```text
word frequency
TF-IDF
```

### N-grams

```text
unigrams
bigrams
trigrams
```

### Character features

```text
character n-grams
```

### Document features

```text
document length
word count
sentence count
```

### Special features

```text
emoji count
URL count
hashtag count
uppercase count
```

These can be combined depending on the task.

---

# 28. Word vs Character Features

Consider:

```text
"amazinggg"
```

A word-based system may treat it as a completely new word.

Character n-grams can capture parts such as:

```text
amaz
amazi
zing
ingg
```

Character features can therefore help with:

* Misspellings
* Slang
* Usernames
* Social media text
* Morphological variations
* Roman Urdu

---

# 29. Controlling the Vocabulary

Text datasets can contain millions of unique features.

This can increase:

* Memory usage
* Training time
* Noise
* Overfitting

Useful controls include:

```python
TfidfVectorizer(
    min_df=2,
    max_df=0.95,
    max_features=50000
)
```

### `min_df`

Removes extremely rare terms.

### `max_df`

Removes terms appearing in too many documents.

### `max_features`

Limits the vocabulary size.

---

# 30. Binary Features

Sometimes we only care whether a word appears.

Instead of:

```text
word frequency = 7
```

we can represent:

```text
present = 1
```

or:

```text
absent = 0
```

Example:

```python
CountVectorizer(
    binary=True
)
```

Binary features can be useful when frequency is less important than presence.

---

# 31. Advanced NLP Project Architecture

A classical NLP project can be organized as:

```text
NLP Project
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   ├── exploration.ipynb
│   └── modeling.ipynb
│
├── src/
│   ├── preprocessing.py
│   ├── features.py
│   ├── training.py
│   └── prediction.py
│
├── models/
│   └── model.pkl
│
├── app/
│   └── main.py
│
├── requirements.txt
└── README.md
```

This separates experimentation from reusable application code.

---

# 32. End-to-End Classical NLP System

A complete system can look like:

```text
                    Dataset
                       ↓
               Data Cleaning
                       ↓
              Train/Test Split
                       ↓
             Text Preprocessing
                       ↓
               TF-IDF / BoW
                       ↓
                ML Algorithm
                       ↓
                 Evaluation
                       ↓
                Error Analysis
                       ↓
               Hyperparameter
                  Tuning
                       ↓
                Final Pipeline
                       ↓
                  Save Model
                       ↓
                   FastAPI
                       ↓
                    Docker
                       ↓
                 Production
```

This connects everything learned throughout the NLP module.

---

# 33. Classical NLP Production Pipeline

A production application may contain:

```text
User
 ↓
API
 ↓
Input Validation
 ↓
Preprocessing
 ↓
Feature Extraction
 ↓
Model
 ↓
Prediction
 ↓
Post-processing
 ↓
Response
```

Example:

```text
POST /predict
```

Input:

```json
{
  "text": "I really love this product"
}
```

Output:

```json
{
  "sentiment": "positive"
}
```

---

# 34. Common Classical NLP Applications

Classical NLP can be used for:

### Document Classification

```text
Document
 ↓
TF-IDF
 ↓
Classifier
 ↓
Category
```

### Spam Detection

```text
Email
 ↓
Features
 ↓
Classifier
 ↓
Spam / Not Spam
```

### Sentiment Analysis

```text
Review
 ↓
TF-IDF
 ↓
Classifier
 ↓
Positive / Negative
```

### Document Similarity

```text
Document A
     ↘
      Similarity
     ↗
Document B
```

### Search

```text
Query
 ↓
TF-IDF
 ↓
Similarity
 ↓
Ranked Documents
```

### Topic Discovery

```text
Documents
 ↓
Topic Modeling
 ↓
Discovered Topics
```

---

# 35. Classical NLP Limitations

Classical NLP is powerful, but it has limitations.

It can struggle with:

* Deep context
* Long-range dependencies
* Sarcasm
* Ambiguous language
* Complex reasoning
* Context-dependent meanings
* Large-scale multilingual understanding
* Generating natural language

For example:

```text
"I saw the man with the telescope."
```

The sentence can have multiple interpretations.

Traditional feature-based methods may struggle to capture such context.

---

# 36. Classical NLP → Deep Learning

The progression looks like:

```text
Classical NLP
     ↓
BoW
     ↓
TF-IDF
     ↓
Static Word Embeddings
     ↓
Neural Networks
     ↓
RNN
     ↓
LSTM / GRU
     ↓
Attention
     ↓
Transformers
     ↓
BERT / GPT
     ↓
LLMs
     ↓
RAG
     ↓
Agents
```

The classical concepts remain important because they establish the foundation for understanding why newer approaches were developed.

---

# 37. Practical Learning Projects

Good projects for this module include:

### 1. News Topic Discovery

```text
News Articles
 ↓
TF-IDF
 ↓
Clustering / LDA
 ↓
Topics
```

### 2. Document Search Engine

```text
Documents
 ↓
TF-IDF
 ↓
User Query
 ↓
Cosine Similarity
 ↓
Ranked Results
```

### 3. Resume Classification

```text
Resume
 ↓
Text Extraction
 ↓
TF-IDF
 ↓
Classifier
 ↓
Job Category
```

### 4. Keyword Extractor

```text
Document
 ↓
TF-IDF / TextRank
 ↓
Important Keywords
```

### 5. Document Similarity Tool

```text
Document A
     ↓
Vector
     ↓
Cosine Similarity
     ↑
Vector
     ↑
Document B
```

---

# 38. Recommended Classical NLP Workflow

When starting a new NLP problem:

```text
1. Understand the task
        ↓
2. Inspect the dataset
        ↓
3. Clean the text
        ↓
4. Build a simple baseline
        ↓
5. Try TF-IDF
        ↓
6. Train a simple model
        ↓
7. Evaluate
        ↓
8. Perform error analysis
        ↓
9. Engineer useful features
        ↓
10. Tune the model
        ↓
11. Compare approaches
        ↓
12. Save the pipeline
        ↓
13. Deploy if required
```

Do not start with the most complicated technique.

Start simple and improve based on evidence.

---

# 39. Important Tools

Useful classical NLP libraries include:

| Tool         | Purpose                       |
| ------------ | ----------------------------- |
| NLTK         | NLP fundamentals              |
| spaCy        | NLP processing and NER        |
| scikit-learn | ML and text features          |
| Gensim       | Topic modeling and embeddings |
| Pandas       | Data processing               |
| NumPy        | Numerical operations          |
| Matplotlib   | Visualization                 |
| Regex        | Pattern extraction            |

Later modules can introduce additional tools for modern NLP and LLM applications.

---

# 40. Classical NLP Cheat Sheet

| Problem             | Classical Approach           |
| ------------------- | ---------------------------- |
| Text classification | TF-IDF + ML                  |
| Sentiment           | TF-IDF + classifier          |
| Spam detection      | TF-IDF + classifier          |
| Similarity          | TF-IDF + cosine              |
| Search              | TF-IDF + ranking             |
| Topic discovery     | LDA                          |
| Document clustering | K-Means                      |
| Keyword extraction  | TF-IDF / TextRank            |
| Pattern extraction  | Regex                        |
| Entity extraction   | NER                          |
| Summarization       | TextRank                     |
| Misspellings        | Edit distance                |
| Social media text   | Character n-grams            |
| Long documents      | Chunking                     |
| Multilingual text   | Language-aware preprocessing |

---

# 🧠 Final Mental Model

Classical NLP is essentially:

```text
                 RAW TEXT
                    ↓
             PREPROCESSING
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
      WORD FEATURES      CHARACTER FEATURES
          ↓                   ↓
       BoW / TF-IDF       N-Grams
          ↓                   ↓
          └─────────┬─────────┘
                    ↓
              ML / NLP METHOD
                    ↓
       ┌────────────┼────────────┐
       ↓            ↓            ↓
 Classification   Clustering   Search
       ↓            ↓            ↓
 Sentiment        Topics      Similarity
       ↓
    Evaluation
       ↓
 Error Analysis
       ↓
   Improvement
       ↓
   Deployment
```

---

# 📌 Key Takeaways

After completing **Advanced Classical NLP**, you should understand:

* Named Entity Recognition
* Regex-based information extraction
* Keyword extraction
* TF-IDF keyword scoring
* TextRank
* Topic modeling
* LDA
* Text clustering
* K-Means for documents
* Document similarity
* Cosine similarity
* Information Retrieval
* Classical search
* Extractive summarization
* Long-document processing
* Multilingual NLP
* Roman Urdu NLP
* Code-switching
* Unicode handling
* Domain-specific NLP
* Word and character features
* Vocabulary control
* Binary features
* Classical NLP project architecture
* End-to-end NLP pipelines
* Production NLP workflow
* Classical NLP limitations
* Classical NLP → Deep Learning progression

The biggest idea to remember is:

> **Classical NLP turns unstructured language into useful numerical features and then uses algorithms to classify, compare, organize, search, or extract information from text.**

---

# 🎯 NLP Basics — Complete Flow

You have now covered the complete classical NLP module:

```text
01 NLP Fundamentals
        ↓
02 Text Preprocessing
        ↓
03 Text Representation
        ↓
04 Bag of Words
        ↓
05 TF-IDF
        ↓
06 Word Embeddings
        ↓
07 Text Classification
        ↓
08 Sentiment Analysis
        ↓
09 NLP Evaluation
        ↓
10 Advanced Classical NLP
```

This completes the **classical NLP foundation inside Machine Learning**.

The next step in your overall roadmap is to connect these foundations with **Deep Learning NLP**, where you move from traditional features such as TF-IDF toward neural representations, RNNs/LSTMs, attention, and eventually Transformers.
