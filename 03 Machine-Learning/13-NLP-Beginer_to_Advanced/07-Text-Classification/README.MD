# 🤖 07 — Text Classification

**Date:** 31 January 2026
**Folder:** `07-Text-Classification`

---

# 📚 Text Classification

## 🎯 Overview

**Text classification** is the process of assigning text to one or more predefined categories.

Examples:

```text
Email
   ↓
Spam / Not Spam
```

```text
Customer Message
   ↓
Support / Refund / Order / Complaint
```

```text
News Article
   ↓
Sports / Politics / Technology / Business
```

The important classical NLP workflow is:

```text
Text
 ↓
Preprocessing
 ↓
Text Representation
 ↓
ML Classifier
 ↓
Prediction
 ↓
Evaluation
```

This folder combines the concepts learned in the previous NLP sections.

---

# 1. What Is Text Classification?

Suppose we have:

```text
"This product is amazing"
```

and our categories are:

```text
Positive
Negative
```

The model should predict:

```text
"This product is amazing"
            ↓
         Positive
```

The model learns this from labeled training examples.

```text
Training Data

Text                         Label
---------------------------------------
"This is excellent"          Positive
"I love this product"        Positive
"This is terrible"           Negative
"I hate this product"        Negative
```

---

# 2. Supervised Learning

Classical text classification is usually a **supervised learning** problem.

We provide:

```text
X = Text
y = Labels
```

For example:

```text
X:
["I love this", "This is terrible"]

y:
["positive", "negative"]
```

The model learns a relationship:

```text
Text Features → Label
```

Then it can classify unseen text.

---

# 3. Text Must Become Numbers

Machine-learning models cannot directly process:

```text
"I love Python"
```

We first convert the text into numerical features.

Common representations include:

```text
Bag of Words
TF-IDF
Word Embeddings
```

A very common classical architecture is:

```text
Text
 ↓
TF-IDF
 ↓
Logistic Regression
 ↓
Prediction
```

This is one of the most useful baseline approaches for classical NLP.

---

# 4. Common Classification Algorithms

Several traditional ML algorithms work well with text.

### Naive Bayes

Especially useful as a simple and fast baseline.

```text
Text
 ↓
BoW / TF-IDF
 ↓
Naive Bayes
 ↓
Class
```

### Logistic Regression

A strong and interpretable baseline for many classification tasks.

```text
TF-IDF
 ↓
Logistic Regression
 ↓
Prediction
```

### Linear SVM

Often performs strongly with high-dimensional sparse text features.

```text
TF-IDF
 ↓
Linear SVM
 ↓
Prediction
```

The best choice should be determined using validation/testing rather than assuming one model always wins.

---

# 5. Binary Classification

Binary classification has two classes.

Example:

```text
Spam
Not Spam
```

or:

```text
Positive
Negative
```

Example:

```text
"Congratulations! You won a prize."
          ↓
         Spam
```

The model learns to separate the two classes based on the available features.

---

# 6. Multiclass Classification

Multiclass classification contains more than two classes.

Example:

```text
News
 ├── Sports
 ├── Technology
 ├── Business
 └── Entertainment
```

One document normally receives one class.

Example:

```text
"Apple released a new processor"
              ↓
         Technology
```

---

# 7. Multi-Label Classification

**Multi-label classification** is different from multiclass classification.

A single document can receive multiple labels.

Example:

```text
"AI is being used in healthcare and robotics."
```

Possible labels:

```text
AI
Healthcare
Robotics
```

So:

```text
Multiclass
→ One document → one class

Multi-label
→ One document → multiple classes
```

This distinction is important in real-world NLP systems.

---

# 8. Train / Test Split

We should evaluate the model on data it has not seen during training.

Typical workflow:

```text
Dataset
   ↓
Train / Test Split
   ↓
Training Data
   ↓
Fit Vectorizer + Model
   ↓
Testing Data
   ↓
Transform + Predict
   ↓
Evaluation
```

For classification, **stratification** can help maintain similar class proportions:

```python
train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)
```

---

# 9. Data Leakage

A very important rule:

> **Never allow information from the test set to influence training.**

Incorrect:

```text
Entire Dataset
      ↓
Fit TF-IDF
      ↓
Train/Test Split
```

Correct:

```text
Dataset
   ↓
Train/Test Split
   ↓
Training Text → Fit TF-IDF
   ↓
Testing Text → Transform Only
```

Using a scikit-learn `Pipeline` helps prevent this mistake.

---

# 10. Scikit-Learn Pipeline

A clean text-classification pipeline can combine vectorization and the model:

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])
```

Then:

```python
pipeline.fit(X_train, y_train)
```

Prediction:

```python
predictions = pipeline.predict(X_test)
```

The pipeline ensures the same transformation process is applied consistently.

---

# 11. Complete Example

```python
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

texts = [
    "I love this product",
    "This is amazing",
    "This product is excellent",
    "I hate this product",
    "This is terrible",
    "Very bad experience"
]

labels = [
    "positive",
    "positive",
    "positive",
    "negative",
    "negative",
    "negative"
]

X_train, X_test, y_train, y_test = train_test_split(
    texts,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels
)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", LogisticRegression())
])

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

print(predictions)
```

The architecture is:

```text
Text
 ↓
TF-IDF
 ↓
Logistic Regression
 ↓
Prediction
```

---

# 12. Evaluation

A classifier should not be judged only by accuracy.

Important metrics include:

```text
Accuracy
Precision
Recall
F1 Score
ROC-AUC
```

For example, in spam detection:

### Precision

Of the messages predicted as spam, how many were actually spam?

```text
Precision =
True Positive
-------------------------
True Positive + False Positive
```

### Recall

Of all actual spam messages, how many did the model detect?

```text
Recall =
True Positive
-------------------------
True Positive + False Negative
```

### F1 Score

Balances precision and recall:

```text
F1 = 2 × (Precision × Recall)
     --------------------------
       Precision + Recall
```

---

# 13. Confusion Matrix

A confusion matrix shows classification results.

For binary classification:

```text
                  Predicted
                Positive Negative

Actual Positive    TP       FN

Actual Negative    FP       TN
```

Where:

```text
TP → True Positive
TN → True Negative
FP → False Positive
FN → False Negative
```

This helps us understand **what kinds of mistakes the model is making**.

---

# 14. Class Imbalance

Sometimes classes are not equally represented.

Example:

```text
Normal messages → 9,500
Spam messages   →   500
```

A model could achieve high accuracy by mostly predicting:

```text
Normal
```

but still perform poorly on spam detection.

Possible approaches include:

* Class weights
* Better evaluation metrics
* Resampling
* More representative data

For linear models, for example:

```python
LogisticRegression(
    class_weight="balanced"
)
```

can give more importance to underrepresented classes.

---

# 15. Feature Engineering

Text classification can improve through appropriate feature choices.

Useful options include:

```text
Word features
Character features
N-grams
TF-IDF
Binary features
```

### Word features

Useful for semantic/content information.

### Character features

Can help with:

* Spelling variations
* URLs
* Usernames
* Product codes
* Short text
* Noisy text

For example:

```python
TfidfVectorizer(
    analyzer="char",
    ngram_range=(3, 5)
)
```

---

# 16. Baseline First

A good practical approach is:

```text
Dataset
 ↓
Simple preprocessing
 ↓
TF-IDF
 ↓
Simple model
 ↓
Evaluation
```

For example:

```text
TF-IDF + Logistic Regression
```

This becomes a baseline.

Then compare alternatives:

```text
TF-IDF + Naive Bayes
TF-IDF + Logistic Regression
TF-IDF + Linear SVM
```

This makes model selection evidence-based rather than guessing.

---

# 17. Hyperparameter Tuning

After establishing a baseline, we can tune parameters.

For example:

```python
from sklearn.model_selection import GridSearchCV

parameters = {
    "tfidf__ngram_range": [(1, 1), (1, 2)],
    "tfidf__min_df": [1, 2],
    "classifier__C": [0.1, 1, 10]
}
```

Then:

```python
grid = GridSearchCV(
    pipeline,
    parameters,
    cv=5,
    scoring="f1"
)

grid.fit(X_train, y_train)
```

This searches different combinations using cross-validation.

---

# 18. Error Analysis

A model's score does not tell the whole story.

Look at incorrect predictions.

Example:

```text
Text:
"This phone is sick 🔥"

Actual:
Positive

Prediction:
Negative
```

Possible reason:

```text
Slang / Emoji / Domain-specific language
```

Another example:

```text
Text:
"I expected better, but the battery is excellent."

Prediction:
Positive
```

The model may struggle with mixed sentiment.

Error analysis helps identify these weaknesses.

---

# 19. Real-World Applications

Text classification is used for:

```text
Spam Detection
Sentiment Analysis
News Classification
Customer Support Routing
Intent Classification
Toxicity Detection
Resume Classification
Email Categorization
Topic Classification
```

Example customer-support system:

```text
Customer Message
       ↓
TF-IDF
       ↓
Classifier
       ↓
┌─────────────────┐
│ Refund          │
│ Technical Issue │
│ Order Status    │
│ Complaint       │
└─────────────────┘
```

---

# 🧠 Mental Model

Remember text classification as:

```text
                  TEXT
                   ↓
             PREPROCESSING
                   ↓
          TEXT REPRESENTATION
          ┌────────┴────────┐
        BoW             TF-IDF
          └────────┬────────┘
                   ↓
             ML CLASSIFIER
          ┌──────┬──────┬─────┐
          NB    LR     SVM
          └──────┴──────┴─────┘
                   ↓
              PREDICTION
                   ↓
               EVALUATION
```

The key idea:

> **Text classification combines text preprocessing, numerical representation, and supervised machine learning to assign text to meaningful categories.**

---

# 🎯 What You Should Understand

After this folder, you should be able to explain:

* What text classification is
* Why it is usually supervised learning
* Binary vs multiclass vs multi-label classification
* How BoW/TF-IDF connect to ML models
* Naive Bayes
* Logistic Regression
* Linear SVM
* Train/test splitting
* Stratification
* Data leakage
* Scikit-learn Pipelines
* Accuracy, precision, recall, and F1
* Confusion matrices
* Class imbalance
* Word vs character features
* Baseline-first model development
* Hyperparameter tuning
* Error analysis
* Real-world text-classification applications

Next:

```text
08 — Sentiment Analysis
```

where we apply text classification specifically to **positive, negative, and neutral opinions/emotions in text**.
