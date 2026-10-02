# 15 — NLP with Deep Learning

**Date: 15 June 2026**

## 1. What Is NLP?

**Natural Language Processing (NLP)** is the field of AI that enables computers to process and understand human language.

Deep learning allows models to learn useful language representations directly from text.

Common applications:

* Sentiment analysis
* Text classification
* Spam detection
* Named entity recognition
* Machine translation
* Text generation
* Question answering
* Search

Typical pipeline:

```text
Text
 ↓
Tokenization
 ↓
Numerical Representation
 ↓
Neural Network
 ↓
Prediction
```

---

## 2. Why Text Is Different

Images naturally contain numerical pixel values, but computers cannot directly process:

```text
"I love this product"
```

A model needs numerical representations.

The basic transformation is:

```text
Text
 ↓
Tokens
 ↓
Token IDs
 ↓
Embeddings
 ↓
Neural Network
```

---

## 3. Tokenization

**Tokenization** breaks text into smaller units.

Example:

```text
"I love AI"

→ ["I", "love", "AI"]
```

A tokenizer may instead use subwords:

```text
"unbelievable"
→ ["un", "believ", "able"]
```

Tokenization strategy depends on the model and vocabulary.

Each token receives an integer ID:

```text
"I"     → 15
"love"  → 82
"AI"    → 431
```

These IDs are then converted into vectors.

---

## 4. Word Embeddings

An embedding represents a token as a dense numerical vector.

```text
Token ID
   ↓
Embedding Layer
   ↓
[0.21, -0.44, 0.73, ...]
```

In PyTorch:

```python
import torch.nn as nn

embedding = nn.Embedding(
    num_embeddings=10000,
    embedding_dim=128
)
```

Input:

```text
[15, 82, 431]
```

Output shape:

```text
[3, 128]
```

The model learns useful representations during training.

---

## 5. Sequence Modeling

Words depend on their surrounding context.

Compare:

```text
"I went to the bank to deposit money."

"I sat beside the river bank."
```

The same word has different meaning depending on context.

Earlier deep-learning approaches used **RNNs, LSTMs, and GRUs** to process sequences.

```text
Token 1 → RNN → h1
Token 2 → RNN → h2
Token 3 → RNN → h3
                ↓
             Prediction
```

LSTMs and GRUs improve long-range dependency handling compared with basic RNNs.

---

## 6. Attention

Attention allows a model to determine which parts of a sequence are important when processing a token.

For example:

```text
"The animal didn't cross the road because it was tired."
```

Understanding what **"it"** refers to requires context.

Transformers use **self-attention** to connect tokens with other tokens.

The core equation is:

$$
Attention(Q,K,V)
=
softmax\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

You studied the mechanism in Module 10.

The important progression is:

```text
RNN
 ↓
LSTM / GRU
 ↓
Attention
 ↓
Transformer
```

---

## 7. Text Classification

One common NLP problem is classification.

Example:

```text
"I really enjoyed this movie."
        ↓
      Model
        ↓
Positive
```

Architecture:

```text
Text
 ↓
Tokenizer
 ↓
Embedding
 ↓
Transformer / RNN
 ↓
Classification Layer
 ↓
Class
```

For binary classification, the final layer can produce one logit.

For multiple classes:

```python
nn.Linear(hidden_size, num_classes)
```

Use `CrossEntropyLoss` for standard multiclass classification.

---

## 8. Padding and Attention Masks

Sequences have different lengths:

```text
"I love AI"
"I love deep learning"
```

A batch requires consistent dimensions.

Padding adds special tokens:

```text
"I love AI <PAD> <PAD>"
"I love deep learning"
```

The model should know that `<PAD>` is not real language content.

An **attention mask** identifies valid tokens.

This becomes especially important when working with Transformer models.

---

## 9. Sequence-to-Sequence

Some NLP tasks transform one sequence into another.

Examples:

```text
English → French
Question → Answer
Text → Summary
```

Conceptually:

```text
Input Sequence
      ↓
    Encoder
      ↓
Representation
      ↓
    Decoder
      ↓
Output Sequence
```

This architecture is important historically and conceptually, although modern NLP systems often use Transformer-based architectures.

---

## 10. NLP Evaluation

Different tasks require different metrics.

### Classification

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix

### Generation / Translation

Metrics such as:

* BLEU
* ROUGE

can provide automated measurements, but human evaluation may still be necessary because language quality is difficult to capture with one number.

---

## 11. Practical PyTorch Project

### Sentiment Classification

Build a model that predicts:

```text
Positive
Negative
```

Pipeline:

```text
Dataset
 ↓
Clean text
 ↓
Tokenize
 ↓
Vocabulary / pretrained tokenizer
 ↓
Embedding
 ↓
LSTM / Transformer
 ↓
Linear classifier
 ↓
Prediction
```

Start with an LSTM classifier to understand sequence modeling.

Then replace the LSTM with a pretrained Transformer and compare:

* Accuracy
* F1-score
* Training time
* Inference time
* Number of parameters

This gives practical understanding of how NLP architectures evolved.

---

## 12. Common Mistakes

* Treating token IDs as meaningful numerical values themselves
* Ignoring padding
* Using incorrect attention masks
* Data leakage between train and test sets
* Removing useful words during preprocessing
* Using accuracy on heavily imbalanced datasets
* Training a large model from scratch on a tiny dataset
* Forgetting that tokenization is part of the model pipeline
* Using different preprocessing during inference

---

## 13. NLP vs Computer Vision

| Aspect               | Computer Vision     | NLP                |
| -------------------- | ------------------- | ------------------ |
| Input                | Images/video        | Text               |
| Basic representation | Pixels/tensors      | Tokens/embeddings  |
| Common models        | CNNs, ViTs          | RNNs, Transformers |
| Major challenges     | Spatial information | Context/sequence   |
| Example              | Object detection    | Sentiment analysis |

---

## 14. Interview Questions

1. What is NLP?
2. Why can't neural networks directly process raw text?
3. What is tokenization?
4. What is an embedding?
5. Why are LSTMs useful for NLP?
6. What problem does attention solve?
7. Why is padding required?
8. What is an attention mask?
9. Classification vs sequence-to-sequence?
10. Why did Transformers become important for NLP?

---

## 15. Key Takeaways

* NLP applies deep learning to human language.
* Text must be converted into **tokens and numerical representations**.
* Embeddings provide dense representations of tokens.
* RNNs, LSTMs, and GRUs introduced neural sequence modeling.
* Attention allows models to focus on relevant context.
* Transformers became the foundation of modern NLP.
* Padding and masking are essential for batched sequences.
* Different NLP tasks require different architectures and evaluation metrics.

### Next → **16 — Model Deployment**
