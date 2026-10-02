# 09 — LSTM & GRU

**Date:** 09 June 2026
**Level:** Intermediate → Job-Ready
**Framework:** PyTorch
**Previous:** 08 — RNN
**Next:** 10 — Transformers Basics

> **Target:** ~700–800 words. All remaining modules will stay **under 900 words**.

---

## 1. Why LSTM and GRU?

Vanilla RNNs can remember previous information through their hidden state, but they struggle with **long-term dependencies**.

Example:

```text
I grew up in Pakistan. ...
[Many words later]
... I speak Urdu.
```

The model may need information from much earlier in the sequence.

During BPTT, gradients can become extremely small or large.

This causes:

* Vanishing gradients
* Exploding gradients
* Difficulty learning long-term dependencies

LSTM and GRU solve this using **gates** that control information flow.

---

# 2. LSTM

**LSTM = Long Short-Term Memory**

An LSTM has two important states:

```text
Hidden state → hₜ
Cell state   → cₜ
```

The **cell state** acts as a longer-term information pathway.

Its gates decide:

```text
What should I forget?
What should I store?
What should I output?
```

---

# 3. LSTM Architecture

An LSTM has three main gates:

```text
             ┌─────────────┐
xₜ ─────────→│ Forget Gate │
             ├─────────────┤
xₜ ─────────→│ Input Gate  │
             ├─────────────┤
xₜ ─────────→│ Output Gate │
             └─────────────┘
                    ↓
               Cell State
```

The gates use sigmoid:

$$
\sigma(x)=\frac{1}{1+e^{-x}}
$$

Therefore gate values are between:

$$
0 \rightarrow 1
$$

Interpretation:

```text
0 → mostly reject
1 → mostly keep
```

---

# 4. Forget Gate

The forget gate decides what information from the previous cell state should remain.

$$
f_t=\sigma(W_f[h_{t-1},x_t]+b_f)
$$

Then:

```text
previous cell state
        ×
   forget gate
        ↓
information retained
```

If:

```text
f = 0.1
```

most information is forgotten.

If:

```text
f = 0.9
```

most information is retained.

---

# 5. Input Gate

The input gate decides what new information should enter the cell state.

$$
i_t=\sigma(W_i[h_{t-1},x_t]+b_i)
$$

A candidate cell value is calculated:

$$
\tilde{c}_t=
\tanh(W_c[h_{t-1},x_t]+b_c)
$$

Then:

$$
c_t=f_t\odot c_{t-1}+i_t\odot\tilde{c}_t
$$

This is one of the most important LSTM equations.

---

# 6. Output Gate

The output gate controls what part of the cell state becomes the new hidden state.

$$
o_t=\sigma(W_o[h_{t-1},x_t]+b_o)
$$

Then:

$$
h_t=o_t\odot\tanh(c_t)
$$

So:

```text
Cell state
    ↓
Output gate
    ↓
Hidden state
```

---

# 7. Complete LSTM Flow

The complete process:

```text
xₜ + hₜ₋₁
     ↓
┌─────────────┐
│ Forget Gate │ → what to remove
├─────────────┤
│ Input Gate  │ → what to add
├─────────────┤
│ Cell State  │ → long-term memory
├─────────────┤
│ Output Gate │ → what to expose
└─────────────┘
     ↓
hₜ
```

Mental model:

> **LSTM learns what to forget, what to remember, and what to output.**

---

# 8. Simple Numerical Intuition

Suppose:

```text
old cell state = 0.8
forget gate    = 0.9
input gate     = 0.2
candidate      = 0.5
```

Then:

$$
c_t=(0.9)(0.8)+(0.2)(0.5)
$$

$$
=0.72+0.10
$$

$$
=0.82
$$

The model mostly retained the previous memory while adding some new information.

---

# 9. GRU

**GRU = Gated Recurrent Unit**

GRU is another improved recurrent architecture.

Unlike LSTM, GRU uses:

* One hidden state
* No separate cell state
* Fewer gates

Main gates:

```text
Update gate
Reset gate
```

---

# 10. Update Gate

The update gate decides how much old information should remain versus how much new information should be used.

Conceptually:

```text
old information
      ↓
 update gate
      ↓
new hidden state
```

A simplified equation:

$$
z_t=\sigma(W_z[x_t,h_{t-1}]+b_z)
$$

---

# 11. Reset Gate

The reset gate controls how much previous information is used when creating new candidate information.

$$
r_t=\sigma(W_r[x_t,h_{t-1}]+b_r)
$$

Conceptually:

```text
Previous hidden state
        ↓
    reset gate
        ↓
how much previous information to use
```

---

# 12. LSTM vs GRU

| Feature        | LSTM         | GRU          |
| -------------- | ------------ | ------------ |
| Hidden state   | Yes          | Yes          |
| Cell state     | Yes          | No           |
| Gates          | 3 main gates | 2 main gates |
| Parameters     | More         | Fewer        |
| Complexity     | Higher       | Lower        |
| Memory control | Strong       | Strong       |
| Training speed | Often slower | Often faster |

There is no universal rule that one always performs better. The best choice depends on the dataset, task, architecture, and compute budget.

---

# 13. PyTorch LSTM

```python
import torch.nn as nn

lstm = nn.LSTM(
    input_size=50,
    hidden_size=64,
    batch_first=True
)
```

Input:

```text
[batch, sequence, features]
```

Example:

```text
[32, 20, 50]
```

Output:

```python
output, (hidden, cell) = lstm(x)
```

Shapes for one layer:

```text
output → [32, 20, 64]
hidden → [1, 32, 64]
cell   → [1, 32, 64]
```

---

# 14. PyTorch GRU

```python
gru = nn.GRU(
    input_size=50,
    hidden_size=64,
    batch_first=True
)
```

Forward:

```python
output, hidden = gru(x)
```

Unlike LSTM:

```text
GRU → output, hidden
LSTM → output, (hidden, cell)
```

---

# 15. LSTM Classifier

```python
class LSTMClassifier(nn.Module):

    def __init__(self, input_size, hidden_size, classes):
        super().__init__()

        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            batch_first=True
        )

        self.fc = nn.Linear(
            hidden_size,
            classes
        )

    def forward(self, x):

        output, (hidden, cell) = self.lstm(x)

        final_hidden = hidden[-1]

        return self.fc(final_hidden)
```

Pipeline:

```text
Sequence
   ↓
LSTM
   ↓
Final hidden state
   ↓
Linear
   ↓
Class
```

---

# 16. When to Use Them

Common applications:

* Text classification
* Sentiment analysis
* Time-series prediction
* Speech-related sequence tasks
* Sequence labeling
* Sequential sensor data
* Event prediction

Modern Transformer architectures are often preferred for many large-scale NLP tasks, but LSTM/GRU remain important for understanding sequence modeling and can still be useful in smaller or specialized systems.

---

# 17. Common Mistakes

### 1. Confusing LSTM states

LSTM returns:

```python
output, (hidden, cell)
```

### 2. Forgetting tensor shape

With:

```python
batch_first=True
```

use:

```text
[batch, sequence, features]
```

### 3. Using future information

For forecasting, future data must not enter the input.

### 4. Assuming GRU is always better

GRU has fewer parameters, but performance depends on the actual task.

### 5. Applying Softmax before CrossEntropyLoss

Return logits and let `CrossEntropyLoss` handle the required transformation.

---

# 18. Interview Questions

**What problem does LSTM solve?**
It improves the ability of recurrent networks to learn long-term dependencies.

**What are the main LSTM gates?**
Forget, input, and output gates.

**What is the cell state?**
A memory pathway that carries information through the sequence.

**What is GRU?**
A gated recurrent architecture with a simpler structure than LSTM.

**LSTM vs GRU?**
LSTM has a separate cell state and more gates; GRU combines information into a single hidden state with fewer gates.

**Why use sigmoid in gates?**
It produces values between 0 and 1, allowing the network to control information flow.

---

# 19. Practice

Build three models for the same sequence-classification dataset:

```text
1. Vanilla RNN
2. LSTM
3. GRU
```

Compare:

* Training loss
* Validation loss
* Accuracy
* Number of parameters
* Training time
* Long-sequence performance

The goal is not simply to find a winner, but to understand **how their architectures affect learning**.

---

# 20. Key Takeaways

```text
Vanilla RNN
    ↓
Long-term dependency problems
    ↓
LSTM / GRU
    ↓
Gated information flow
```

Remember:

```text
LSTM
├── Forget gate
├── Input gate
├── Cell state
├── Output gate
└── Hidden state

GRU
├── Update gate
├── Reset gate
└── Hidden state
```

The main idea:

> **RNNs provide memory; LSTM and GRU provide controlled memory.**
