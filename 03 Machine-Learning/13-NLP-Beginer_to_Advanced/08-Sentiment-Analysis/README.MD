# 08 — Sentiment Analysis

## 📌 Overview

**Sentiment Analysis** is an NLP task used to identify the emotional or opinion-based meaning of text.

The most common goal is to determine whether a piece of text is:

* **Positive**
* **Negative**
* **Neutral**

For example:

```text
"I really love this product"
→ Positive

"The service was terrible"
→ Negative

"The package arrived today"
→ Neutral
```

Sentiment analysis is widely used in:

* Product reviews
* Customer feedback
* Social media analysis
* Support tickets
* Survey responses
* App reviews
* Brand monitoring
* Opinion mining

In classical NLP, sentiment analysis is usually built using **text preprocessing + text representation + machine learning**.

---

# 1. What Is Sentiment Analysis?

Sentiment analysis is the process of automatically detecting the **sentiment or opinion expressed in text**.

A basic sentiment classifier can learn:

```text
Input Text
     ↓
Preprocessing
     ↓
Text Representation
     ↓
Machine Learning Model
     ↓
Sentiment
```

Example:

```text
"This phone has an amazing camera"
                    ↓
              Positive
```

The model does not understand the sentence exactly like a human. Instead, it learns patterns from training examples.

---

# 2. Sentiment Analysis as Classification

Sentiment analysis is commonly treated as a **classification problem**.

### Binary classification

Two classes:

```text
Positive
Negative
```

Example:

| Text                 | Label    |
| -------------------- | -------- |
| I love this movie    | Positive |
| This movie is boring | Negative |

### Three-class classification

```text
Positive
Negative
Neutral
```

Example:

| Text                | Label    |
| ------------------- | -------- |
| Amazing experience  | Positive |
| Terrible experience | Negative |
| The package arrived | Neutral  |

### Multi-class sentiment

Some datasets use more detailed categories:

```text
Very Negative
Negative
Neutral
Positive
Very Positive
```

The number of classes depends on the dataset and business requirement.

---

# 3. Sentiment Analysis Pipeline

A classical sentiment analysis pipeline can look like this:

```text
Raw Text
   ↓
Text Cleaning
   ↓
Tokenization
   ↓
Normalization
   ↓
TF-IDF / BoW
   ↓
Train ML Model
   ↓
Evaluate
   ↓
Predict Sentiment
```

Example:

```text
"I absolutely LOVE this phone!!!"
              ↓
Cleaning
              ↓
"absolutely love phone"
              ↓
TF-IDF
              ↓
Logistic Regression
              ↓
Positive
```

---

# 4. Dataset

A sentiment dataset normally contains:

```text
text → sentiment label
```

Example:

| Text                       | Sentiment |
| -------------------------- | --------- |
| This product is excellent  | Positive  |
| I hate this service        | Negative  |
| The delivery arrived today | Neutral   |

A dataset can be split into:

```text
Training Set
Validation Set
Test Set
```

The training data teaches the model.

The validation data can help with model or hyperparameter selection.

The test data measures final generalization.

---

# 5. Text Preprocessing

Before training, text may need preprocessing.

Common operations include:

* Lowercasing
* Removing HTML
* Cleaning URLs
* Handling punctuation
* Removing unnecessary whitespace
* Tokenization
* Stop-word handling
* Stemming
* Lemmatization
* Handling emojis
* Handling repeated characters

Example:

```text
"I LOVE this product!!! 😍😍"
```

Possible normalized form:

```text
"love product"
```

However, preprocessing should not blindly remove everything.

For sentiment analysis, some information is important.

For example:

```text
"good"
"not good"
```

These have completely different meanings.

---

# 6. Negation Handling

**Negation** is one of the most important problems in sentiment analysis.

Compare:

```text
"This phone is good"
```

and:

```text
"This phone is not good"
```

The word `not` changes the sentiment.

Another example:

```text
"I don't like this product"
```

If preprocessing removes `don't` or `not`, important sentiment information may be lost.

Therefore:

> Do not automatically remove every stop word when building a sentiment model.

Negation can be handled using:

* Keeping important negation words
* N-grams
* Negation-aware preprocessing
* Feature engineering
* More advanced NLP models

---

# 7. N-Grams for Sentiment

Single words are sometimes not enough.

Consider:

```text
"not good"
```

With unigrams:

```text
not
good
```

With bigrams:

```text
not good
```

The bigram preserves useful context.

A TF-IDF vectorizer can use:

```python
TfidfVectorizer(
    ngram_range=(1, 2)
)
```

This creates:

```text
unigrams + bigrams
```

For sentiment analysis, n-grams can help capture phrases such as:

```text
very good
not good
really bad
highly recommend
waste of
```

---

# 8. Text Representation

Machine learning models need numerical input.

Common representations include:

### Bag of Words

```text
word → frequency
```

### TF-IDF

```text
word → importance
```

### Word Embeddings

```text
word → dense vector
```

For classical sentiment analysis, **TF-IDF + linear models** is a strong and practical baseline.

---

# 9. Machine Learning Models

Several classical models can be used.

### Naive Bayes

Useful for many text classification problems.

```text
TF-IDF / BoW
      ↓
Naive Bayes
      ↓
Sentiment
```

### Logistic Regression

A strong baseline for binary and multiclass text classification.

```text
TF-IDF
   ↓
Logistic Regression
   ↓
Positive / Negative
```

### Linear SVM

Linear SVM is also commonly used with sparse text features.

```text
TF-IDF
   ↓
Linear SVM
   ↓
Sentiment
```

The best model depends on the dataset and evaluation results rather than the algorithm name alone.

---

# 10. Complete Classical Example

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

model = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1, 2),
        min_df=2
    )),
    ("classifier", LogisticRegression(
        max_iter=1000
    ))
])

model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

Prediction:

```python
texts = [
    "I absolutely love this product",
    "This service is terrible"
]

predictions = model.predict(texts)

print(predictions)
```

Possible output:

```text
['positive', 'negative']
```

---

# 11. Why Use a Pipeline?

A `Pipeline` keeps preprocessing and prediction together.

Without a pipeline:

```text
Text
 ↓
TF-IDF
 ↓
Model
```

You have to manually ensure that the same transformation is applied during training and prediction.

With a pipeline:

```python
Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("model", LogisticRegression())
])
```

The workflow becomes reusable and safer.

It also helps reduce preprocessing mistakes and data leakage.

---

# 12. Evaluation

Accuracy alone is not always enough.

Important metrics include:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix

Example:

```python
from sklearn.metrics import classification_report

print(classification_report(y_test, predictions))
```

A classification report can show:

```text
              precision
              recall
              f1-score
```

For imbalanced sentiment datasets, **F1-score, precision, and recall** can be more informative than accuracy alone.

---

# 13. Confusion Matrix

A confusion matrix shows where the model makes mistakes.

For binary sentiment:

```text
                 Predicted
              Positive Negative

Actual Positive    TP      FN
Actual Negative    FP      TN
```

For example:

```text
Positive → Positive
Positive → Negative
Negative → Positive
Negative → Negative
```

This helps identify whether the model struggles more with positive or negative examples.

---

# 14. Class Imbalance

Suppose a dataset contains:

```text
Positive → 90%
Negative → 10%
```

A model could achieve high accuracy by predicting positive very often.

This can produce misleading results.

Possible solutions include:

* Class weights
* Better sampling
* More balanced data
* Appropriate evaluation metrics

Example:

```python
LogisticRegression(
    class_weight="balanced",
    max_iter=1000
)
```

---

# 15. Feature Engineering

Sentiment models can benefit from additional text features.

### Word features

```text
good
bad
excellent
terrible
```

### Word n-grams

```text
very good
not good
really bad
```

### Character n-grams

Useful for:

* Misspellings
* Slang
* Repeated characters
* Social media text

Example:

```text
goooood
```

Character features may capture patterns that normal word features miss.

---

# 16. Emojis and Sentiment

Emojis can contain strong sentiment information.

Example:

```text
"I love this 😍"
```

and:

```text
"I hate this 😡"
```

Removing emojis blindly may remove useful information.

Depending on the application, emojis can be:

* Kept
* Converted into text descriptions
* Mapped to sentiment-related features
* Removed if irrelevant

The correct approach depends on the dataset.

---

# 17. Social Media Sentiment

Social media text creates additional challenges:

```text
"This phone is soooo good 😂🔥"
```

Problems include:

* Slang
* Hashtags
* Mentions
* Emojis
* Misspellings
* Repeated characters
* Short sentences
* Code-switching

For example:

```text
"ye phone bohat acha hai 🔥"
```

Roman Urdu and mixed-language text can require specialized preprocessing and datasets.

---

# 18. Sentiment vs Emotion

Sentiment analysis and emotion detection are related but different.

### Sentiment

Usually:

```text
Positive
Negative
Neutral
```

### Emotion

Can include:

```text
Joy
Anger
Sadness
Fear
Surprise
Disgust
```

Example:

```text
"I am extremely angry about this service"
```

Possible:

```text
Sentiment → Negative
Emotion → Anger
```

Sentiment describes overall polarity, while emotion classification attempts to identify a more specific emotional category.

---

# 19. Aspect-Based Sentiment Analysis

A single review can contain different opinions about different aspects.

Example:

```text
"The camera is excellent but the battery is terrible."
```

Overall sentiment alone loses useful information.

Aspect-based analysis can identify:

```text
Camera  → Positive
Battery → Negative
```

This is useful for:

* Product reviews
* Restaurant reviews
* Customer feedback
* Service analysis

Aspect-based sentiment becomes more complex than simple positive/negative classification.

---

# 20. Error Analysis

A model should not only be evaluated by metrics.

Inspect incorrect predictions.

Example:

```text
Text:
"The battery is not bad"

Actual:
Positive

Predicted:
Negative
```

Possible error category:

```text
Negation handling
```

Another:

```text
"Yeah, amazing... another broken update."
```

The model may predict:

```text
Positive
```

even though the sentence is sarcastic.

Possible error:

```text
Sarcasm
```

Useful error categories include:

* Negation
* Sarcasm
* Slang
* Spelling errors
* Mixed languages
* Ambiguous text
* Long text
* Domain-specific language
* Incorrect labels

---

# 21. Common Challenges

Classical sentiment analysis can struggle with:

### Sarcasm

```text
"Wow, what an amazing way to waste my time."
```

### Context

```text
"This is sick!"
```

Depending on context, `sick` can be negative or positive.

### Negation

```text
"not bad"
```

### Mixed sentiment

```text
"Great camera but terrible battery."
```

### Domain differences

```text
"unpredictable"
```

could have different meanings in different domains.

### Code-switching

```text
"phone bohat acha hai but battery weak hai"
```

These cases show why traditional keyword-based approaches have limitations.

---

# 22. Baseline First

A practical workflow is:

```text
1. Prepare dataset
       ↓
2. Clean text
       ↓
3. TF-IDF
       ↓
4. Logistic Regression
       ↓
5. Evaluate
       ↓
6. Error analysis
       ↓
7. Try improvements
```

Do not immediately build a complicated system.

Start with a simple baseline and measure improvement.

---

# 23. Hyperparameter Tuning

Useful parameters include:

### TF-IDF

```python
ngram_range
min_df
max_df
max_features
sublinear_tf
```

### Logistic Regression

```python
C
class_weight
```

### Linear SVM

```python
C
class_weight
```

You can use `GridSearchCV` or `RandomizedSearchCV` to compare configurations.

---

# 24. Saving the Model

Once the pipeline is trained, it can be saved.

```python
import joblib

joblib.dump(model, "sentiment_pipeline.pkl")
```

Later:

```python
model = joblib.load("sentiment_pipeline.pkl")
```

The complete pipeline can then accept raw text and produce predictions.

---

# 25. Production Architecture

A simple sentiment API can look like:

```text
User Text
    ↓
FastAPI
    ↓
Saved NLP Pipeline
    ↓
TF-IDF
    ↓
Classifier
    ↓
Sentiment
    ↓
JSON Response
```

Example response:

```json
{
  "text": "I love this product",
  "sentiment": "positive"
}
```

The model can be packaged using Docker for deployment.

---

# 26. Real-World Applications

Sentiment analysis can be used for:

### Customer Feedback

```text
Customer reviews
      ↓
Sentiment
      ↓
Business insights
```

### Product Reviews

```text
Reviews
   ↓
Positive / Negative
   ↓
Product analysis
```

### Support Tickets

```text
Support messages
       ↓
Sentiment
       ↓
Prioritization / analytics
```

### Social Media

```text
Posts
 ↓
Sentiment
 ↓
Opinion monitoring
```

---

# 27. Classical Sentiment Analysis vs Modern NLP

Classical approach:

```text
Text
 ↓
Preprocessing
 ↓
TF-IDF / BoW
 ↓
ML Model
 ↓
Sentiment
```

Modern approach:

```text
Text
 ↓
Transformer Model
 ↓
Contextual Representation
 ↓
Classification
```

Classical NLP is still valuable because it teaches:

* Text preprocessing
* Feature engineering
* Sparse representations
* Classification
* Evaluation
* Error analysis
* Production pipelines

These concepts remain useful even when working with modern NLP systems.

---

# 28. Key Takeaways

You should understand:

* What sentiment analysis is
* Sentiment as a classification problem
* Binary and multiclass sentiment
* Sentiment datasets
* Preprocessing for sentiment
* Why negation matters
* N-grams for sentiment
* TF-IDF for sentiment classification
* Logistic Regression
* Naive Bayes
* Linear SVM
* Evaluation metrics
* Confusion matrices
* Class imbalance
* Feature engineering
* Character n-grams
* Emojis and social media text
* Aspect-based sentiment
* Sentiment vs emotion
* Error analysis
* Model pipelines
* Hyperparameter tuning
* Saving a trained pipeline
* Basic production deployment

---

# 🧠 Mental Model

Remember sentiment analysis as:

```text
TEXT
 ↓
CLEAN
 ↓
TOKENIZE
 ↓
HANDLE NEGATION
 ↓
REPRESENT
(TF-IDF / Embeddings)
 ↓
CLASSIFY
(Logistic Regression / NB / SVM)
 ↓
EVALUATE
 ↓
ERROR ANALYSIS
 ↓
IMPROVE
 ↓
DEPLOY
```

The most important practical idea is:

> **Good sentiment analysis is not just choosing a classifier. It depends on the quality of the text preprocessing, representation, dataset, evaluation, and error analysis.**

---

## 📚 Next Topic

### `09-NLP-Evaluation`

Next, focus specifically on **evaluating NLP systems**, including:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion Matrix
* ROC-AUC
* Cross-validation
* Class imbalance
* Error analysis
* Baseline comparison
* Model comparison
* NLP-specific evaluation considerations
