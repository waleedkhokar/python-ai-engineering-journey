 # NLP Datasets

This folder contains datasets used for practicing Classical Natural Language Processing (NLP).

The datasets are mainly used for:

- Text preprocessing
- Tokenization
- Bag of Words
- TF-IDF
- Word embeddings
- Text classification
- Sentiment analysis
- Spam detection
- Text similarity
- Named Entity Recognition
- Topic modeling
- Text clustering

## Dataset Structure

```text
datasets/
├── README.md
├── sentiment/
├── spam/
├── news/
├── similarity/
└── ner/
````

## Dataset Guidelines

Each dataset should contain:

* Dataset name
* Source
* Task
* Number of samples
* Input/text column
* Target/label column
* License if available

## Example

For a sentiment dataset:

```text
sentiment/
└── sentiment.csv
```

Example columns:

```text
text,label
"I really enjoyed this movie",positive
"This product is terrible",negative
```

## Important

Do not commit large datasets or private/sensitive data to GitHub.

For large datasets, use:

* Kaggle
* Hugging Face Datasets
* UCI Machine Learning Repository
* Other official dataset sources

Store only small practice datasets directly in this repository when appropriate.

## Purpose

The goal of these datasets is to provide practical data for learning the complete Classical NLP workflow:

```text
Raw Text
   ↓
Preprocessing
   ↓
Tokenization
   ↓
Text Representation
   ↓
Feature Extraction
   ↓
ML Model
   ↓
Evaluation
   ↓
Prediction