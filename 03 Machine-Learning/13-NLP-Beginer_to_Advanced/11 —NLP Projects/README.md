# 11 — NLP Projects & End-to-End Practice

## 📌 Overview

The best way to understand NLP is to build complete projects.

Throughout this module, you learned how to:

```text
Raw Text
   ↓
Preprocessing
   ↓
Tokenization
   ↓
Text Representation
   ↓
BoW / TF-IDF / Embeddings
   ↓
Machine Learning
   ↓
Evaluation
   ↓
Error Analysis
   ↓
Deployment
```

This final practice section brings those concepts together into **complete classical NLP projects**.

The goal is not to introduce another major NLP algorithm.

The goal is to learn how to take an NLP problem from:

```text
Idea → Dataset → Model → Evaluation → Application
```

---

# 1. End-to-End NLP Workflow

A practical NLP project usually follows:

```text
1. Define Problem
       ↓
2. Collect Dataset
       ↓
3. Explore Data
       ↓
4. Clean Text
       ↓
5. Split Dataset
       ↓
6. Build Baseline
       ↓
7. Represent Text
       ↓
8. Train Model
       ↓
9. Evaluate
       ↓
10. Error Analysis
       ↓
11. Improve
       ↓
12. Save Pipeline
       ↓
13. Build API / Application
```

This workflow is more important than memorizing individual NLP algorithms.

---

# 2. Project 1 — Sentiment Analysis

A good first project is a review sentiment classifier.

### Problem

Given a review:

```text
"This product is absolutely amazing"
```

Predict:

```text
Positive
```

### Architecture

```text
Review
 ↓
Preprocessing
 ↓
TF-IDF
 ↓
Logistic Regression
 ↓
Sentiment
```

Example dataset:

| Review               | Sentiment |
| -------------------- | --------- |
| Amazing product      | Positive  |
| Terrible service     | Negative  |
| Very good experience | Positive  |
| Completely useless   | Negative  |

---

# 3. Sentiment Project Structure

```text
sentiment-analysis/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   └── sentiment-analysis.ipynb
│
├── src/
│   ├── preprocessing.py
│   ├── training.py
│   └── prediction.py
│
├── models/
│   └── sentiment_pipeline.pkl
│
├── app/
│   └── main.py
│
├── requirements.txt
└── README.md
```

This structure separates experimentation from reusable code.

---

# 4. Project 2 — Spam Detection

Spam detection is another practical text classification problem.

Input:

```text
"Congratulations! You won a free prize."
```

Output:

```text
Spam
```

Another:

```text
"Can you send me the meeting notes?"
```

Output:

```text
Not Spam
```

Pipeline:

```text
Email / Message
       ↓
Cleaning
       ↓
TF-IDF
       ↓
Naive Bayes / Logistic Regression
       ↓
Spam Classification
```

Important evaluation metrics include:

* Precision
* Recall
* F1-score
* Confusion matrix

---

# 5. Project 3 — News Classification

The goal is to classify news articles.

Possible categories:

```text
Technology
Sports
Business
Entertainment
Politics
Science
```

Example:

```text
"Apple introduced a new computer processor."
```

Prediction:

```text
Technology
```

Pipeline:

```text
News Article
     ↓
Preprocessing
     ↓
TF-IDF
     ↓
Linear SVM
     ↓
Category
```

This project helps you practice **multiclass classification**.

---

# 6. Project 4 — Document Similarity

The goal is to determine how similar two documents are.

Example:

```text
Document A:
"Machine learning is used to predict prices."

Document B:
"ML models can be used for price prediction."
```

Pipeline:

```text
Document A ──┐
             ↓
          TF-IDF
             ↓
       Cosine Similarity
             ↑
          TF-IDF
             ↑
Document B ──┘
```

Possible output:

```text
Similarity: 0.82
```

The actual value depends on the data and preprocessing.

Applications include:

* Duplicate detection
* Document matching
* Recommendation
* Search
* Plagiarism-like similarity analysis

---

# 7. Project 5 — Document Search Engine

Build a simple search system over a collection of documents.

Example query:

```text
"machine learning tutorial"
```

The system should return relevant documents.

Architecture:

```text
Documents
   ↓
Preprocessing
   ↓
TF-IDF Index
   ↓
User Query
   ↓
Query Vector
   ↓
Cosine Similarity
   ↓
Ranking
   ↓
Search Results
```

Example:

```text
Query:
"Python machine learning"

Results:

1. Machine Learning with Python
2. Python Data Science Guide
3. Introduction to ML
```

This is a practical introduction to **Information Retrieval**.

---

# 8. Project 6 — Topic Discovery

Use unsupervised learning to discover topics from documents.

Example:

```text
1000 News Articles
        ↓
     TF-IDF
        ↓
      LDA
        ↓
   Topic Discovery
```

Possible topics:

```text
Topic 1:
computer
software
AI
technology

Topic 2:
football
team
match
player

Topic 3:
market
company
stock
business
```

No topic labels are required during training.

---

# 9. Project 7 — News Clustering

Instead of assigning predefined labels, group similar news articles.

Pipeline:

```text
News Articles
      ↓
TF-IDF
      ↓
K-Means
      ↓
Clusters
```

Possible clusters:

```text
Cluster 0 → Sports
Cluster 1 → Technology
Cluster 2 → Business
Cluster 3 → Entertainment
```

This teaches the difference between:

```text
Classification → Known labels

Clustering → Discover groups
```

---

# 10. Project 8 — Keyword Extraction

Build a system that extracts important terms from documents.

Input:

```text
"Machine learning allows computers to learn
patterns from data and make predictions."
```

Possible output:

```text
machine learning
computers
patterns
data
predictions
```

Possible approaches:

```text
TF-IDF
TextRank
RAKE
N-Grams
```

This is useful for:

* Document tagging
* Search
* Summaries
* Content organization

---

# 11. Project 9 — Resume Classification

This is particularly useful for AI/HR applications.

Input:

```text
Resume Text
```

Output:

```text
Software Engineer
```

or:

```text
Data Scientist
```

or:

```text
Marketing
```

Pipeline:

```text
Resume
   ↓
Text Extraction
   ↓
Cleaning
   ↓
TF-IDF
   ↓
Classifier
   ↓
Job Category
```

Possible extensions:

```text
Resume
 ↓
Skills Extraction
 ↓
Experience Extraction
 ↓
Classification
 ↓
Job Matching
```

This project connects NLP with practical business applications.

---

# 12. Project 10 — Support Ticket Classification

A company may receive thousands of support messages.

Example:

```text
"My payment failed and the money was deducted."
```

Possible category:

```text
Payment Issue
```

Another:

```text
"I cannot log into my account."
```

Category:

```text
Authentication Issue
```

Pipeline:

```text
Support Message
       ↓
TF-IDF
       ↓
Classifier
       ↓
Ticket Category
       ↓
Routing
```

This can help automatically route tickets to the appropriate team.

---

# 13. Project 11 — Intent Classification

Intent classification identifies what the user wants.

Example:

```text
"Where is my order?"
```

Intent:

```text
track_order
```

Another:

```text
"I want to cancel my order."
```

Intent:

```text
cancel_order
```

Possible intents:

```text
track_order
cancel_order
refund
payment_issue
change_address
account_help
```

Pipeline:

```text
User Message
      ↓
Text Processing
      ↓
TF-IDF
      ↓
Classifier
      ↓
Intent
```

This is an important foundation for later chatbot and agent systems.

---

# 14. Project 12 — Roman Urdu Sentiment Analysis

A useful regional NLP project is sentiment analysis for Roman Urdu.

Example:

```text
"ye product bohat acha hai"
```

Prediction:

```text
Positive
```

Another:

```text
"service bilkul achi nahi thi"
```

Prediction:

```text
Negative
```

Challenges include:

* Spelling variation
* Romanization
* Urdu + English
* Informal language
* Missing standard vocabulary
* Code-switching

Useful features can include:

```text
Word n-grams
Character n-grams
TF-IDF
```

This is a good example of why dataset quality and preprocessing matter.

---

# 15. Project Selection by NLP Concept

| Project               | Main Concept                  |
| --------------------- | ----------------------------- |
| Sentiment Analysis    | Classification                |
| Spam Detection        | Binary Classification         |
| News Classification   | Multiclass Classification     |
| Document Similarity   | Cosine Similarity             |
| Search Engine         | Information Retrieval         |
| Topic Discovery       | LDA                           |
| News Clustering       | K-Means                       |
| Keyword Extraction    | TF-IDF / TextRank             |
| Resume Classification | NLP + ML                      |
| Support Tickets       | Classification                |
| Intent Classification | Text Classification           |
| Roman Urdu Sentiment  | Multilingual / Code-Switching |

---

# 16. Baseline Before Complexity

For most classical NLP projects, start with:

```text
TF-IDF
   ↓
Logistic Regression
```

Then compare:

```text
TF-IDF + Naive Bayes
TF-IDF + Logistic Regression
TF-IDF + Linear SVM
```

Only after establishing a baseline should you introduce more complicated techniques.

This makes it easier to understand whether an improvement actually helps.

---

# 17. Error Analysis in Projects

After evaluation, inspect incorrect predictions.

Create:

| Text                          | Actual   | Predicted | Error            |
| ----------------------------- | -------- | --------- | ---------------- |
| not bad                       | Positive | Negative  | Negation         |
| amazing... another failure    | Negative | Positive  | Sarcasm          |
| bohat acha hai                | Positive | Negative  | Roman Urdu       |
| great camera terrible battery | Mixed    | Positive  | Multiple aspects |

Look for repeated patterns.

If many errors belong to the same category, improve that part of the pipeline.

---

# 18. Project Improvement Cycle

A strong project follows an iterative process:

```text
Baseline
   ↓
Evaluate
   ↓
Error Analysis
   ↓
Identify Problem
   ↓
Feature Improvement
   ↓
Retrain
   ↓
Evaluate Again
```

Example:

```text
Baseline F1
    ↓
0.78

Add bigrams
    ↓
0.81

Add character features
    ↓
0.83

Tune classifier
    ↓
0.85
```

The numbers are only illustrative.

The important concept is **measure → improve → measure again**.

---

# 19. Saving the Complete Pipeline

Do not save only the classifier.

Save the complete preprocessing + feature extraction + model pipeline.

```python id="g5m8d8"
import joblib

joblib.dump(
    model,
    "nlp_pipeline.pkl"
)
```

Load it later:

```python id="2zqf7r"
model = joblib.load(
    "nlp_pipeline.pkl"
)
```

Then:

```python id="3c2tqj"
prediction = model.predict(
    ["I really love this product"]
)
```

This avoids having to manually recreate preprocessing during inference.

---

# 20. Turning the Model into an API

A trained NLP model can be exposed through FastAPI.

Architecture:

```text
Frontend
   ↓
FastAPI
   ↓
NLP Pipeline
   ↓
Prediction
   ↓
JSON Response
```

Example:

```text
POST /predict
```

Input:

```json id="4d4j1m"
{
  "text": "This product is amazing"
}
```

Response:

```json id="j6n6l4"
{
  "prediction": "positive"
}
```

This turns an NLP experiment into a usable application.

---

# 21. Dockerizing the NLP Application

A simple production architecture:

```text
NLP Model
   ↓
Python Application
   ↓
FastAPI
   ↓
Docker
   ↓
Cloud / Server
```

Docker helps package:

* Python version
* Dependencies
* Application code
* Model
* Runtime environment

This connects classical NLP with your later **MLOps and deployment** learning.

---

# 22. Batch vs Real-Time NLP

There are two common processing styles.

### Real-Time

```text
User
 ↓
API
 ↓
NLP Model
 ↓
Instant Prediction
```

Useful for:

* Chat applications
* Sentiment APIs
* Intent detection
* Search

### Batch

```text
10,000 Documents
       ↓
Batch Processing
       ↓
Predictions
       ↓
Database / Report
```

Useful for:

* Large document collections
* Historical analysis
* Customer review processing
* Data pipelines

---

# 23. Project Evaluation Checklist

Before calling a project complete, check:

```text
□ Problem clearly defined
□ Dataset collected
□ Dataset inspected
□ Missing/invalid data handled
□ Class distribution checked
□ Train/test split created
□ No data leakage
□ Baseline created
□ Text preprocessing implemented
□ Text representation selected
□ Model trained
□ Evaluation performed
□ Confusion matrix inspected
□ Error analysis performed
□ Model improved
□ Final test performed
□ Pipeline saved
□ README written
□ Requirements recorded
□ API created if needed
□ Dockerized if needed
```

---

# 24. What a Good NLP Project README Should Contain

Every project should document:

```text
1. Project Overview
2. Problem Statement
3. Dataset
4. Features
5. Preprocessing
6. Model
7. Training
8. Evaluation
9. Results
10. Error Analysis
11. Project Structure
12. Installation
13. Usage
14. API
15. Future Improvements
```

Example:

```text id="l9i4qb"
# Sentiment Analysis

## Problem
Classify reviews as positive or negative.

## Dataset
...

## Approach
TF-IDF + Logistic Regression

## Evaluation
Accuracy / Precision / Recall / F1

## API
FastAPI

## Deployment
Docker
```

---

# 25. Portfolio-Level NLP Project

A portfolio project should go beyond a notebook.

Instead of:

```text
notebook.ipynb
```

build:

```text
Dataset
   ↓
EDA
   ↓
Preprocessing
   ↓
Training
   ↓
Evaluation
   ↓
Saved Model
   ↓
FastAPI
   ↓
Docker
   ↓
Frontend
```

This demonstrates that you understand the complete engineering lifecycle.

---

# 26. Recommended Project Progression

Build projects in increasing difficulty:

```text
Level 1
Sentiment Analysis
      ↓
Level 2
Spam Detection
      ↓
Level 3
News Classification
      ↓
Level 4
Document Similarity
      ↓
Level 5
Search Engine
      ↓
Level 6
Topic Modeling
      ↓
Level 7
Resume / Support Classification
      ↓
Level 8
Multilingual / Roman Urdu NLP
      ↓
Level 9
NLP API + Docker
```

You do not need to build every possible project.

The purpose is to practice different NLP concepts.

---

# 27. Classical NLP Project Mental Model

Think of every project as five layers:

```text
                    NLP PROJECT
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
      DATA         PROCESSING       REPRESENTATION
        │               │               │
        ↓               ↓               ↓
     Dataset         Cleaning       TF-IDF / BoW
     Labels          Tokenization   Embeddings
     Quality         Normalization  N-Grams
        │               │               │
        └───────────────┼───────────────┘
                        ↓
                      MODEL
                        ↓
              Classification / Clustering
                        ↓
                    EVALUATION
                        ↓
                 Error Analysis
                        ↓
                    DEPLOYMENT
```

This structure can be reused for many NLP problems.

---

# 28. What You Should Be Able to Build

After completing this NLP module, you should be able to build a classical NLP system such as:

```text
User Text
    ↓
Preprocessing
    ↓
TF-IDF
    ↓
Machine Learning Model
    ↓
Prediction
    ↓
Evaluation
    ↓
Saved Pipeline
    ↓
FastAPI
    ↓
Docker
```

You should also understand when to use:

```text
Classification
Clustering
Similarity
Search
Topic Modeling
Keyword Extraction
NER
```

rather than treating every NLP problem as classification.

---

# 🧠 Final NLP Mental Model

The complete classical NLP journey is:

```text
RAW LANGUAGE
     ↓
UNDERSTAND THE PROBLEM
     ↓
COLLECT DATA
     ↓
CLEAN TEXT
     ↓
TOKENIZE
     ↓
NORMALIZE
     ↓
REPRESENT TEXT
     ↓
BoW / TF-IDF / EMBEDDINGS
     ↓
CHOOSE NLP / ML METHOD
     ↓
TRAIN
     ↓
EVALUATE
     ↓
ERROR ANALYSIS
     ↓
IMPROVE
     ↓
SAVE PIPELINE
     ↓
API / APPLICATION
     ↓
DEPLOY
```

---

# 📌 Final Takeaways

After completing this project section, you should understand how to:

* Turn an NLP idea into a project
* Select an appropriate dataset
* Prepare and inspect text data
* Build classical NLP pipelines
* Use TF-IDF and n-grams
* Train classification models
* Perform clustering and topic modeling
* Build similarity systems
* Build simple search systems
* Extract keywords
* Perform information extraction
* Analyze errors
* Improve a baseline
* Save complete NLP pipelines
* Build FastAPI inference APIs
* Dockerize NLP applications
* Process text in batch or real time
* Document NLP projects professionally

Most importantly:

> **An NLP project is not just a trained model. It is the complete pipeline from raw text and data quality to preprocessing, representation, modeling, evaluation, error analysis, and deployment.**

---

## 🎯 Classical NLP Module Complete

Your complete NLP progression is now:

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
        ↓
11 NLP Projects & End-to-End Practice
```

This gives you the **classical NLP foundation** needed before moving into **Deep Learning NLP → Transformers → LLMs → RAG → Agentic AI**.
