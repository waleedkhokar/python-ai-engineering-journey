# 10 — Transformers Basics

**Date:** 10 June 2026
**Level:** Intermediate → Job-Ready
**Framework:** PyTorch
**Previous:** 09 — LSTM & GRU
**Next:** 11 — Transfer Learning

> **Target:** ~700–800 words. This module stays **under 900 words**.

---

## 1. What Is a Transformer?

A **Transformer** is a neural-network architecture designed for sequence data using **attention** instead of relying primarily on recurrence.

Transformers became extremely important for:

* NLP
* Machine translation
* Text generation
* Computer vision
* Speech
* Multimodal AI
* Large Language Models

The key idea is:

> **Instead of processing tokens strictly one after another, attention allows tokens to directly interact with other relevant tokens.**

---

# 2. Why Transformers?

RNN:

```text
x₁ → x₂ → x₃ → x₄ → x₅
```

Information must travel through the sequence.

Transformer:

```text
x₁ ─────┐
x₂ ─────┤
x₃ ─────┼──→ Attention
x₄ ─────┤
x₅ ─────┘
```

Each token can directly consider other tokens.

This makes Transformers much more effective for long-range relationships and highly parallelizable during training.

---

# 3. Example

Consider:

```text
The animal didn't cross the road because it was tired.
```

What does `it` refer to?

Attention allows the representation of `it` to consider other words in the sentence and learn relevant relationships.

The important concept is:

```text
Token
 ↓
Compare with other tokens
 ↓
Determine relevance
 ↓
Combine useful information
```

---

# 4. Self-Attention

**Self-attention** means a sequence attends to itself.

Given:

```text
X = [x₁, x₂, x₃, x₄]
```

each token can interact with the others.

For every token, we create:

* Query `Q`
* Key `K`
* Value `V`

These are learned projections of the input.

$$
Q=XW_Q
$$

$$
K=XW_K
$$

$$
V=XW_V
$$

---

# 5. Query, Key, Value Intuition

Think of a search system.

### Query

> What information am I looking for?

### Key

> What information does this token represent?

### Value

> What information should actually be returned?

Therefore:

```text
Query
  ↓
compare with Keys
  ↓
attention scores
  ↓
weighted Values
```

---

# 6. Scaled Dot-Product Attention

The central Transformer equation is:

$$
\boxed{
Attention(Q,K,V)
=
softmax
\left(
\frac{QK^T}{\sqrt{d_k}}
\right)V
}
$$

Steps:

```text
QKᵀ
 ↓
Similarity scores
 ↓
Scale by √dₖ
 ↓
Softmax
 ↓
Attention weights
 ↓
Multiply by V
 ↓
Output
```

This equation is extremely important.

---

# 7. Why Divide by √dₖ?

As the key/query dimension increases, dot products can become large.

Large values entering Softmax can make the distribution extremely sharp.

Dividing by:

$$
\sqrt{d_k}
$$

helps keep the values at a more useful scale and makes optimization more stable.

---

# 8. Simple Attention Example

Suppose one token produces scores:

```text
[2, 1, 0]
```

After Softmax, approximately:

```text
[0.67, 0.24, 0.09]
```

So the model gives:

```text
67% attention → token 1
24% attention → token 2
9% attention  → token 3
```

The output becomes a weighted combination of the corresponding values.

Attention is therefore **not simply selecting one token**. It usually creates a weighted combination.

---

# 9. Multi-Head Attention

Instead of using one attention operation, Transformers use multiple **attention heads**.

```text
Input
  ↓
┌──────┬──────┬──────┐
Head 1 Head 2 Head 3 ...
└──────┴──────┴──────┘
       ↓
    Concatenate
       ↓
   Linear layer
```

Different heads can learn different relationships.

Conceptually:

```text
Head 1 → local relationship
Head 2 → grammatical relationship
Head 3 → semantic relationship
...
```

These are interpretations, not fixed rules; the model learns what each head represents.

---

# 10. Positional Information

Attention itself doesn't inherently know sequence order.

For example:

```text
dog bites man
```

and:

```text
man bites dog
```

contain the same tokens but have different meanings.

Therefore Transformers need **positional information**.

Original Transformers used **positional encoding**.

Conceptually:

```text
Token embedding
      +
Position information
      ↓
Transformer input
```

Modern Transformer architectures may use different positional methods, but the underlying requirement remains: the model needs information about token position/order.

---

# 11. Transformer Block

A simplified Transformer block:

```text
Input
  ↓
Multi-Head Self-Attention
  ↓
Add & Normalize
  ↓
Feed-Forward Network
  ↓
Add & Normalize
  ↓
Output
```

Two major components:

1. Self-attention
2. Feed-forward network

---

# 12. Residual Connections

Instead of:

```text
x → Layer → output
```

Transformers commonly use:

```text
x ───────────────┐
 ↓               +
Layer ───────────┘
```

This is a **residual connection**.

Mathematically:

$$
y=x+F(x)
$$

Residual connections help information and gradients flow through deep networks.

---

# 13. Layer Normalization

Transformers use **LayerNorm** to stabilize activations.

```python
nn.LayerNorm(d_model)
```

It normalizes features within each individual example rather than across the batch in the same way BatchNorm does.

This makes it well suited to sequence architectures.

---

# 14. Feed-Forward Network

After attention, each token is passed through a small neural network:

$$
FFN(x)=W_2\sigma(W_1x+b_1)+b_2
$$

Usually:

```text
Linear
 ↓
Activation
 ↓
Linear
```

The same feed-forward network is applied independently to each token position.

---

# 15. Encoder and Decoder

The original Transformer architecture contains:

```text
Encoder
   ↓
Decoder
```

### Encoder

Processes the input sequence.

### Decoder

Generates the output sequence.

Simplified:

```text
Input
 ↓
Encoder
 ↓
Representations
 ↓
Decoder
 ↓
Output
```

This architecture was originally introduced for sequence-to-sequence tasks such as machine translation.

---

# 16. Encoder-Only vs Decoder-Only

Modern Transformer systems use different configurations.

| Type            | Main idea                | Example use     |
| --------------- | ------------------------ | --------------- |
| Encoder-only    | Understand input         | Classification  |
| Decoder-only    | Generate sequence        | Text generation |
| Encoder-decoder | Transform input → output | Translation     |

Large language models commonly use **decoder-style Transformer architectures** for autoregressive generation.

---

# 17. Attention Masking

For autoregressive generation, a token should not see future tokens.

Example:

```text
I → can → build → AI
```

When predicting `build`, the model should not see `AI`.

A causal mask creates:

```text
✓ = can attend
✗ = cannot attend

Token 1 → ✓ ✗ ✗ ✗
Token 2 → ✓ ✓ ✗ ✗
Token 3 → ✓ ✓ ✓ ✗
Token 4 → ✓ ✓ ✓ ✓
```

This is called **causal/self-attention masking**.

---

# 18. PyTorch Transformer

PyTorch provides Transformer components directly.

Example:

```python
import torch.nn as nn

layer = nn.TransformerEncoderLayer(
    d_model=128,
    nhead=4,
    batch_first=True
)
```

Then:

```python
encoder = nn.TransformerEncoder(
    layer,
    num_layers=3
)
```

Input:

```text
[batch, sequence, d_model]
```

Example:

```text
[32, 20, 128]
```

---

# 19. Transformer vs RNN

| Feature             | RNN        | Transformer                     |
| ------------------- | ---------- | ------------------------------- |
| Recurrence          | Yes        | No                              |
| Hidden state        | Yes        | No recurrent hidden state       |
| Self-attention      | No         | Yes                             |
| Parallel training   | Limited    | Strong                          |
| Long dependencies   | Difficult  | Better                          |
| Sequence processing | Sequential | Highly parallel during training |
| Main mechanism      | Recurrence | Attention                       |

Transformers can still have substantial computational cost for long sequences because standard self-attention compares tokens with one another.

---

# 20. Important Limitation

Standard self-attention has approximately:

$$
O(n^2)
$$

attention complexity with respect to sequence length `n`.

If sequence length doubles:

```text
n → 2n
```

the pairwise attention work grows roughly:

```text
n² → 4n²
```

This is one reason long-context Transformer efficiency is an important research and engineering problem.

---

# 21. Practical Mental Model

Remember the Transformer as:

```text
Tokens
  ↓
Embeddings + Position
  ↓
Self-Attention
  ↓
Multi-Head Attention
  ↓
Residual + LayerNorm
  ↓
Feed-Forward Network
  ↓
Residual + LayerNorm
  ↓
Next Transformer Block
```

The most important concept:

> **Attention allows each token to dynamically gather useful information from other tokens.**

---

# 22. Interview Questions

**What is self-attention?**
A mechanism where each token calculates how strongly it should use information from other tokens in the same sequence.

**What are Q, K, and V?**
Learned Query, Key, and Value representations used to calculate and apply attention.

**Why use multiple attention heads?**
To allow the model to learn different relationships through separate attention subspaces.

**Why is positional information needed?**
Attention alone does not inherently encode sequence order.

**Why use residual connections?**
They improve information and gradient flow through deep networks.

**Why is LayerNorm used?**
To stabilize representations during training.

**Why do Transformers outperform traditional RNNs for many large-scale sequence tasks?**
They allow direct token-to-token interactions and highly parallelizable training.

---

# 23. Practice

Implement a small Transformer classifier:

```text
Input tokens
     ↓
Embedding
     ↓
Positional information
     ↓
Transformer Encoder
     ↓
Pooling
     ↓
Linear
     ↓
Classification
```

Experiment with:

```text
d_model = 64 / 128
heads = 2 / 4
layers = 1 / 2 / 3
```

Compare:

* Training loss
* Validation loss
* Accuracy
* Parameter count
* Training time

---

# 24. Key Takeaways

```text
Transformer
│
├── Self-Attention
│   ├── Query
│   ├── Key
│   └── Value
│
├── Multi-Head Attention
│
├── Positional Information
│
├── Feed-Forward Network
│
├── Residual Connections
│
├── Layer Normalization
│
└── Encoder / Decoder architectures
```

Core equation:

$$
\boxed{
Attention(Q,K,V)
=
softmax
\left(
\frac{QK^T}{\sqrt{d_k}}
\right)V
}
$$

The progression is:

```text
RNN
 ↓
LSTM / GRU
 ↓
Attention
 ↓
Transformer
 ↓
Modern LLMs
