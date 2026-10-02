# 08 — RNN (Recurrent Neural Networks)

**Date:** 08 June 2026
**Level:** Intermediate → Job-Ready
**Framework:** PyTorch
**Previous:** 07 — CNNs
**Next:** 09 — LSTM & GRU

---

# 1. What Is an RNN?

**RNN (Recurrent Neural Network)** is a neural network designed for **sequential data**.

Unlike a standard feed-forward network, an RNN keeps a **hidden state** that carries information from previous time steps.

Examples of sequential data:

* Text
* Sentences
* Speech
* Time series
* Stock prices
* Sensor readings
* Weather measurements
* User activity
* Logs
* Sequential events

The core idea:

```text
Previous information
        ↓
Current input → RNN → Current output
        ↑
     hidden state
```

At every time step, the network receives:

```text
current input + previous hidden state
```

and produces:

```text
new hidden state + output
```

---

# 2. Why Do We Need RNNs?

Consider:

```text
I went to the bank to deposit money.
```

The meaning of `bank` depends on surrounding words.

A normal dense network doesn't naturally remember previous words.

An RNN processes the sequence:

```text
I
↓
went
↓
to
↓
the
↓
bank
↓
to
↓
deposit
↓
money
```

and carries information forward.

The hidden state acts like a small **memory**.

---

# 3. Feed-Forward Network vs RNN

## Feed-Forward Network

```text
x → Layer → Layer → Output
```

Each input is processed independently.

## RNN

```text
x₁ → h₁ → h₂ → h₃ → h₄
      ↑    ↑    ↑    ↑
     x₂   x₃   x₄
```

Information flows through time.

| Feature                  | Feed-forward | RNN             |
| ------------------------ | ------------ | --------------- |
| Sequential input         | Not natural  | Yes             |
| Memory                   | No           | Hidden state    |
| Order matters            | Usually no   | Yes             |
| Text                     | Limited      | Designed for it |
| Time series              | Limited      | Designed for it |
| Variable sequence length | Less natural | Natural         |

---

# 4. The Core RNN Idea

At time `t`, we have:

* `xₜ` → current input
* `hₜ₋₁` → previous hidden state
* `hₜ` → new hidden state
* `yₜ` → output

The hidden state is calculated as:

$$
h_t = \tanh(W_{xh}x_t + W_{hh}h_{t-1} + b_h)
$$

Then output:

$$
y_t = W_{hy}h_t + b_y
$$

The most important equation is:

$$
\boxed{
h_t = \tanh(W_{xh}x_t + W_{hh}h_{t-1} + b_h)
}
$$

This is the heart of a basic RNN.

---

# 5. Understanding the Hidden State

Suppose we process:

```text
"The cat is sleeping"
```

The RNN processes:

```text
The
 ↓
cat
 ↓
is
 ↓
sleeping
```

After processing `"The"`:

```text
h₁
```

After `"cat"`:

```text
h₂
```

After `"is"`:

```text
h₃
```

After `"sleeping"`:

```text
h₄
```

Each hidden state contains information influenced by previous inputs.

Conceptually:

```text
h₁ = information about "The"

h₂ = information about "The cat"

h₃ = information about "The cat is"

h₄ = information about "The cat is sleeping"
```

This is simplified intuition, but it is useful.

---

# 6. RNN Unrolled Through Time

The compact RNN:

```text
       ┌──────────────┐
xₜ →   │     RNN      │ → hₜ
       └──────────────┘
              ↑
            hₜ₋₁
```

When unrolled:

```text
x₁       x₂       x₃       x₄
↓        ↓        ↓        ↓
┌───┐   ┌───┐   ┌───┐   ┌───┐
│RNN│ → │RNN│ → │RNN│ → │RNN│
└───┘   └───┘   └───┘   └───┘
 ↓        ↓        ↓        ↓
h₁       h₂       h₃       h₄
```

The **same RNN parameters** are reused at every time step.

This is called **parameter sharing**.

---

# 7. Why Parameter Sharing Matters

Imagine a sequence of 100 words.

We don't want:

```text
RNN₁ with different weights
RNN₂ with different weights
RNN₃ with different weights
...
RNN₁₀₀ with different weights
```

Instead:

```text
Same RNN parameters
        ↓
used at every time step
```

Therefore the model can process sequences of different lengths.

---

# 8. RNN Inputs

Suppose our sequence is:

```text
I love AI
```

We might represent each word as a vector:

```text
I    → [0.2, 0.1, 0.4]
love → [0.7, 0.3, 0.8]
AI   → [0.5, 0.9, 0.6]
```

Then:

```text
x₁ = [0.2, 0.1, 0.4]
x₂ = [0.7, 0.3, 0.8]
x₃ = [0.5, 0.9, 0.6]
```

The RNN processes them sequentially.

---

# 9. RNN Dimensions

Suppose:

```text
input_size = 3
hidden_size = 4
```

Then:

```text
xₜ → 3 values

hₜ → 4 values
```

The input-to-hidden weights have:

$$
W_{xh} \in \mathbb{R}^{4 \times 3}
$$

The hidden-to-hidden weights have:

$$
W_{hh} \in \mathbb{R}^{4 \times 4}
$$

Bias:

$$
b_h \in \mathbb{R}^{4}
$$

---

# 10. Parameter Count

For a simple RNN:

$$
Parameters =
D_{hidden}D_{input}
+
D_{hidden}D_{hidden}
+
D_{hidden}
$$

If:

```text
input_size = 3
hidden_size = 4
```

Then:

$$
4(3)+4(4)+4
$$

$$
=12+16+4
$$

$$
=32
$$

That's for the recurrent layer itself, excluding an output layer.

---

# 11. Numerical Example

Let's simplify everything.

Suppose:

$$
x_t = 2
$$

$$
h_{t-1}=0.5
$$

and:

$$
W_{xh}=0.4
$$

$$
W_{hh}=0.6
$$

$$
b=0.1
$$

Then:

$$
z_t=(0.4)(2)+(0.6)(0.5)+0.1
$$

$$
=0.8+0.3+0.1
$$

$$
=1.2
$$

Now:

$$
h_t=\tanh(1.2)
$$

Approximately:

$$
h_t\approx0.834
$$

So the new hidden state is approximately:

```text
0.834
```

---

# 12. Why `tanh`?

Traditional RNNs commonly use:

$$
\tanh(z)
$$

because it produces values between:

$$
-1 \text{ and } 1
$$

This gives the hidden state a bounded representation.

Example:

```text
large positive → close to +1
0              → 0
large negative → close to -1
```

However, `tanh` can saturate.

Its derivative becomes small for large positive/negative values.

That contributes to the **vanishing gradient problem**.

---

# 13. Sequence-to-Sequence Thinking

RNNs can be used in several input/output configurations.

## 1. One-to-One

```text
input → output
```

Example:

```text
image → class
```

Not really an RNN-specific task.

---

## 2. Many-to-One

```text
x₁
x₂
x₃
x₄
 ↓
output
```

Example:

```text
sentence → sentiment
```

```text
"I really enjoyed this movie"
                 ↓
             Positive
```

This is common for sequence classification.

---

## 3. One-to-Many

```text
input
 ↓
x₁ → x₂ → x₃ → x₄
```

Example:

```text
image → generated sequence
```

---

## 4. Many-to-Many

```text
x₁ → y₁
x₂ → y₂
x₃ → y₃
x₄ → y₄
```

Example:

```text
word → POS tag
```

or sequence labeling.

---

# 14. Many-to-One Sentiment Example

Input:

```text
"This movie was excellent"
```

Process:

```text
This
 ↓
movie
 ↓
was
 ↓
excellent
```

The final hidden state contains information from the sequence.

Then:

```text
h_final
   ↓
Linear layer
   ↓
Positive / Negative
```

Architecture:

```text
Words
 ↓
Embeddings
 ↓
RNN
 ↓
Final hidden state
 ↓
Linear
 ↓
Classification
```

---

# 15. Many-to-Many Example

For:

```text
I love machine learning
```

we could predict a label for every word:

```text
I       → label
love    → label
machine → label
learning→ label
```

Architecture:

```text
x₁ → RNN → y₁
x₂ → RNN → y₂
x₃ → RNN → y₃
x₄ → RNN → y₄
```

---

# 16. Initial Hidden State

What should:

$$
h_0
$$

be?

The simplest approach:

```text
h₀ = zeros
```

For example:

```python
h0 = torch.zeros(batch_size, hidden_size)
```

PyTorch can also initialize it internally.

---

# 17. RNN in PyTorch

PyTorch provides:

```python
torch.nn.RNN
```

Basic example:

```python
import torch
import torch.nn as nn

rnn = nn.RNN(
    input_size=10,
    hidden_size=20,
    batch_first=True
)
```

Here:

```text
input_size  = 10
hidden_size = 20
```

---

# 18. Understanding `batch_first`

With:

```python
batch_first=True
```

PyTorch expects:

```text
(batch, sequence, features)
```

Example:

```text
[32, 10, 50]
```

means:

```text
32  = batch size
10  = sequence length
50  = features per time step
```

Without `batch_first`, the usual format is:

```text
(sequence, batch, features)
```

This is one of the most common RNN tensor-shape mistakes.

---

# 19. Simple PyTorch Example

```python
import torch
import torch.nn as nn

batch_size = 4
sequence_length = 6
input_size = 10
hidden_size = 16

x = torch.randn(
    batch_size,
    sequence_length,
    input_size
)

rnn = nn.RNN(
    input_size=input_size,
    hidden_size=hidden_size,
    batch_first=True
)

output, hidden = rnn(x)

print(output.shape)
print(hidden.shape)
```

Expected:

```text
output: [4, 6, 16]
hidden: [1, 4, 16]
```

---

# 20. What Is `output`?

`output` contains the hidden representation for **every time step**.

```text
[batch, sequence, hidden]
```

For our example:

```text
[4, 6, 16]
```

means:

```text
4 sequences
6 time steps
16 hidden features
```

---

# 21. What Is `hidden`?

`hidden` contains the final hidden state.

For one RNN layer:

```text
[num_layers, batch, hidden_size]
```

Therefore:

```text
[1, 4, 16]
```

means:

```text
1 layer
4 samples
16 hidden features
```

For a many-to-one task, we often use the final hidden state.

---

# 22. Using the Final Hidden State

```python
output, hidden = rnn(x)

final_hidden = hidden[-1]

print(final_hidden.shape)
```

Output:

```text
[4, 16]
```

Now:

```python
classifier = nn.Linear(16, 2)

logits = classifier(final_hidden)
```

Output:

```text
[4, 2]
```

This can represent two classes.

---

# 23. Complete RNN Classifier

```python
import torch
import torch.nn as nn

class RNNClassifier(nn.Module):

    def __init__(
        self,
        input_size,
        hidden_size,
        num_classes
    ):
        super().__init__()

        self.rnn = nn.RNN(
            input_size=input_size,
            hidden_size=hidden_size,
            batch_first=True
        )

        self.fc = nn.Linear(
            hidden_size,
            num_classes
        )

    def forward(self, x):

        output, hidden = self.rnn(x)

        final_hidden = hidden[-1]

        return self.fc(final_hidden)
```

Usage:

```python
model = RNNClassifier(
    input_size=50,
    hidden_size=64,
    num_classes=2
)
```

---

# 24. Forward Pass

Suppose:

```text
batch = 32
sequence = 20
features = 50
hidden = 64
classes = 2
```

Input:

```text
[32, 20, 50]
```

RNN output:

```text
[32, 20, 64]
```

Final hidden state:

```text
[32, 64]
```

Classifier:

```text
[32, 2]
```

Pipeline:

```text
[32, 20, 50]
      ↓
     RNN
      ↓
[32, 20, 64]
      ↓
final hidden
      ↓
[32, 64]
      ↓
Linear
      ↓
[32, 2]
```

---

# 25. Training an RNN

For classification:

```python
criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=1e-3
)
```

Training:

```python
for epoch in range(10):

    model.train()

    optimizer.zero_grad()

    logits = model(x)

    loss = criterion(logits, y)

    loss.backward()

    optimizer.step()
```

The important flow remains:

```text
forward
↓
loss
↓
backward
↓
optimizer step
```

---

# 26. RNN and Backpropagation Through Time

RNN parameters are reused across time.

Therefore, during training, gradients must flow backward through the sequence.

This is called:

# Backpropagation Through Time — BPTT

Suppose:

```text
x₁ → x₂ → x₃ → x₄
```

Forward:

```text
h₁ → h₂ → h₃ → h₄
```

Backward:

```text
h₄ → h₃ → h₂ → h₁
```

This is essentially backpropagation applied to the **unrolled recurrent network**.

You already learned the chain rule and backpropagation in Module 05.

---

# 27. Why BPTT Is Difficult

Imagine a sequence with:

```text
100 time steps
```

The gradient must travel through many recurrent operations.

If gradients repeatedly become smaller:

```text
0.5 × 0.5 × 0.5 × ...
```

they can approach zero.

This is:

# Vanishing Gradient

If gradients repeatedly become very large:

```text
2 × 2 × 2 × ...
```

they can explode.

This is:

# Exploding Gradient

---

# 28. Vanishing Gradient

Suppose:

```text
gradient = 0.5
```

and it passes through 10 steps:

$$
0.5^{10}
$$

$$
\approx0.00098
$$

The gradient becomes extremely small.

The model struggles to learn relationships between distant time steps.

---

# 29. Exploding Gradient

Suppose:

```text
gradient = 2
```

across 10 steps:

$$
2^{10}=1024
$$

The gradient can become very large.

This can cause:

* unstable training
* huge parameter updates
* NaN values
* training failure

---

# 30. Gradient Clipping

A common technique for exploding gradients is:

```python
torch.nn.utils.clip_grad_norm_(
    model.parameters(),
    max_norm=1.0
)
```

Example:

```python
loss.backward()

torch.nn.utils.clip_grad_norm_(
    model.parameters(),
    max_norm=1.0
)

optimizer.step()
```

This limits gradient magnitude.

---

# 31. Why Vanilla RNNs Struggle With Long-Term Dependencies

Consider:

```text
The students who studied very hard for the difficult
exam because they wanted to pass it eventually ______.
```

The model may need information from much earlier in the sequence.

A vanilla RNN can struggle to preserve useful information over many steps.

This is called a:

**long-term dependency problem**

This limitation motivated architectures such as:

* LSTM
* GRU

which we'll study next.

---

# 32. RNN vs CNN

| Feature        | CNN                 | RNN                 |
| -------------- | ------------------- | ------------------- |
| Main purpose   | Spatial patterns    | Sequential patterns |
| Images         | Excellent           | Not natural         |
| Text           | Possible            | Natural             |
| Time series    | Possible            | Natural             |
| Memory         | No recurrent memory | Hidden state        |
| Processing     | Spatial/local       | Temporal            |
| Main dimension | H × W               | Time                |

Example:

```text
Image → CNN
Text sequence → RNN
Sensor sequence → RNN
```

Modern architectures can blur these boundaries, but this is the basic distinction.

---

# 33. RNN vs LSTM

| Feature           | Vanilla RNN | LSTM         |
| ----------------- | ----------- | ------------ |
| Hidden state      | Yes         | Yes          |
| Cell state        | No          | Yes          |
| Gates             | No          | Yes          |
| Long dependencies | Difficult   | Better       |
| Architecture      | Simple      | More complex |
| Parameters        | Fewer       | More         |
| Training          | Simpler     | More complex |

The LSTM adds mechanisms that help control what information should be:

```text
forgotten
stored
exposed
```

---

# 34. RNN vs GRU

GRU is another gated recurrent architecture.

Compared with LSTM:

```text
LSTM
├── cell state
├── hidden state
├── forget gate
├── input gate
└── output gate

GRU
├── hidden state
├── update gate
└── reset gate
```

GRU is generally simpler.

We'll study both in Module 09.

---

# 35. RNN for Time-Series Prediction

Suppose we have daily temperatures:

```text
30
31
32
33
31
...
```

We can create sequences:

```text
[30, 31, 32] → 33
[31, 32, 33] → 31
[32, 33, 31] → next
```

Architecture:

```text
past values
     ↓
    RNN
     ↓
hidden state
     ↓
Linear
     ↓
next value
```

For regression:

```python
self.fc = nn.Linear(
    hidden_size,
    1
)
```

And use:

```python
nn.MSELoss()
```

---

# 36. Sequence Length

Sequence length means:

> How many time steps are included in one input sequence?

Example:

```text
sequence_length = 10
```

means the model receives 10 time steps.

For stock/time-series data:

```text
last 10 days → predict day 11
```

For text:

```text
10 tokens → prediction
```

---

# 37. Padding

Real datasets may contain sequences with different lengths.

Example:

```text
"I love AI"
```

3 tokens.

```text
"I really love artificial intelligence"
```

5 tokens.

A batch often needs consistent tensor dimensions.

We can pad:

```text
[1, 2, 3]
[4, 5, 6, 7, 8]
```

to:

```text
[1, 2, 3, 0, 0]
[4, 5, 6, 7, 8]
```

The padding value should generally be handled carefully so the model does not treat padding as meaningful information.

---

# 38. Packed Sequences

PyTorch supports:

```python
pack_padded_sequence()
```

and:

```python
pad_packed_sequence()
```

These can make recurrent models more efficient when sequences have different lengths.

You don't need to memorize the APIs immediately.

Understand the problem first:

```text
different sequence lengths
        ↓
padding / packing
        ↓
efficient batching
```

---

# 39. Bidirectional RNN

A normal RNN processes:

```text
left → right
```

A bidirectional RNN processes:

```text
forward:
x₁ → x₂ → x₃ → x₄

backward:
x₄ → x₃ → x₂ → x₁
```

Then combines both representations.

PyTorch:

```python
nn.RNN(
    input_size=50,
    hidden_size=64,
    batch_first=True,
    bidirectional=True
)
```

The output hidden dimension becomes:

```text
64 × 2 = 128
```

because there are two directions.

---

# 40. When Bidirectional RNNs Are Useful

They can be useful when the complete sequence is available.

Examples:

* Text classification
* Named entity recognition
* Sequence labeling

They are less suitable for tasks where future information is unavailable at prediction time.

For example, real-time forecasting:

```text
past → current
```

should not use future observations.

---

# 41. Stacked RNNs

We can use multiple recurrent layers:

```text
Input
 ↓
RNN Layer 1
 ↓
RNN Layer 2
 ↓
RNN Layer 3
 ↓
Output
```

PyTorch:

```python
nn.RNN(
    input_size=50,
    hidden_size=64,
    num_layers=2,
    batch_first=True
)
```

More layers increase model capacity but also increase complexity and training difficulty.

---

# 42. Dropout in RNNs

PyTorch supports dropout between recurrent layers when:

```python
num_layers > 1
```

Example:

```python
nn.RNN(
    input_size=50,
    hidden_size=64,
    num_layers=2,
    dropout=0.2,
    batch_first=True
)
```

Remember:

```text
dropout → training
no dropout → evaluation
```

Use:

```python
model.train()
```

and:

```python
model.eval()
```

appropriately.

---

# 43. Common RNN Mistakes

## Mistake 1 — Wrong tensor shape

With:

```python
batch_first=True
```

expected:

```text
[batch, sequence, features]
```

not:

```text
[sequence, batch, features]
```

---

## Mistake 2 — Confusing hidden size with sequence length

Example:

```text
[32, 20, 64]
```

means:

```text
32 = batch
20 = sequence
64 = hidden/features
```

---

## Mistake 3 — Applying Softmax before CrossEntropyLoss

Don't do:

```python
logits = model(x)

probs = torch.softmax(logits, dim=1)

loss = nn.CrossEntropyLoss()(probs, y)
```

Prefer:

```python
logits = model(x)

loss = nn.CrossEntropyLoss()(logits, y)
```

`CrossEntropyLoss` expects logits.

---

## Mistake 4 — Forgetting sequence order

RNNs are specifically designed to use ordering.

Don't randomly reorder time steps.

---

## Mistake 5 — Using future information

For forecasting:

```text
past → future
```

Don't accidentally allow future values into the input.

This creates **data leakage**.

---

# 44. Practical RNN Experiment

Build a synthetic sequence dataset.

Generate:

```text
sin(t)
```

Then create windows:

```text
[sin₁, sin₂, sin₃, sin₄, sin₅] → sin₆
[sin₂, sin₃, sin₄, sin₅, sin₆] → sin₇
...
```

Architecture:

```text
5 time steps
     ↓
RNN
     ↓
hidden state
     ↓
Linear
     ↓
1 prediction
```

Compare:

```text
hidden_size = 16
hidden_size = 32
hidden_size = 64
```

Observe:

* training loss
* validation loss
* prediction quality
* training stability

---

# 45. Simple RNN Time-Series Model

```python
class RNNRegressor(nn.Module):

    def __init__(
        self,
        input_size=1,
        hidden_size=32
    ):
        super().__init__()

        self.rnn = nn.RNN(
            input_size=input_size,
            hidden_size=hidden_size,
            batch_first=True
        )

        self.fc = nn.Linear(
            hidden_size,
            1
        )

    def forward(self, x):

        output, hidden = self.rnn(x)

        final_hidden = hidden[-1]

        return self.fc(final_hidden)
```

---

# 46. Training

```python
model = RNNRegressor()

criterion = nn.MSELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)
```

Training:

```python
for epoch in range(20):

    model.train()

    optimizer.zero_grad()

    prediction = model(X_train)

    loss = criterion(
        prediction,
        y_train
    )

    loss.backward()

    torch.nn.utils.clip_grad_norm_(
        model.parameters(),
        1.0
    )

    optimizer.step()

    print(
        f"Epoch {epoch + 1}: "
        f"{loss.item():.4f}"
    )
```

---

# 47. RNN Mental Model

Think about an RNN like this:

```text
              ┌──────────────┐
x₁ ─────────→ │              │
              │     RNN      │ → h₁
h₀ ─────────→ │              │
              └──────────────┘
                       ↓
                      h₁
                       ↓
              ┌──────────────┐
x₂ ─────────→ │     RNN      │ → h₂
              └──────────────┘
                       ↓
                      h₂
                       ↓
                    ...
```

The key idea:

> **The hidden state carries information from previous time steps into the current computation.**

---

# 48. RNN Mathematical Summary

Main equation:

$$
h_t =
\tanh(
W_{xh}x_t +
W_{hh}h_{t-1} +
b_h
)
$$

Output:

$$
y_t =
W_{hy}h_t+b_y
$$

Initial state:

$$
h_0 = 0
$$

Training:

```text
Forward through sequence
        ↓
Calculate loss
        ↓
BPTT
        ↓
Gradients
        ↓
Optimizer
```

---

# 49. What You Should Understand

After this module, you should be able to explain:

* What sequence data is
* Why RNNs exist
* What hidden state means
* How an RNN processes time steps
* What recurrent weights do
* Why parameters are shared
* RNN input/output shapes
* Many-to-one
* One-to-many
* Many-to-many
* BPTT
* Vanishing gradients
* Exploding gradients
* Gradient clipping
* Bidirectional RNN
* Stacked RNN
* PyTorch `nn.RNN`
* Why vanilla RNNs struggle with long-term dependencies
* Why LSTM/GRU were introduced

---

# 50. Interview Questions

### Beginner

**1. What is an RNN?**

A neural network designed for sequential data that maintains a hidden state across time steps.

**2. What is hidden state?**

A representation carrying information from previous time steps.

**3. Why does an RNN have memory?**

Because its current hidden state depends on the previous hidden state.

**4. What activation is traditionally used in vanilla RNNs?**

`tanh`.

**5. What is sequence length?**

The number of time steps in an input sequence.

---

### Intermediate

**6. What is BPTT?**

Backpropagation Through Time; it applies backpropagation through the unrolled recurrent computation.

**7. Why do RNNs suffer from vanishing gradients?**

Repeated multiplication through recurrent transformations can make gradients become extremely small.

**8. What causes exploding gradients?**

Repeated transformations can cause gradients to grow very large.

**9. How can exploding gradients be controlled?**

Gradient clipping is a common technique.

**10. Why are RNN parameters shared?**

The same recurrent computation is applied at every time step, allowing variable-length sequences while controlling parameter count.

---

### Advanced

**11. Why does a vanilla RNN struggle with long-term dependencies?**

Because information and gradients must propagate through many recurrent steps, making useful signals difficult to preserve.

**12. What is the difference between output and hidden state in PyTorch?**

`output` contains the hidden representation for each time step, while `hidden` contains the final hidden state for each recurrent layer/direction.

**13. Why are LSTMs better suited to long-term dependencies?**

Their gated architecture and cell state provide mechanisms for controlling information flow and preserving useful information over longer sequences.

**14. What is a bidirectional RNN?**

An RNN that processes the sequence in both forward and backward directions.

**15. When should you avoid bidirectional models?**

When future information is unavailable or would create leakage, such as real-time causal forecasting.

---

# 51. Exercises

## Exercise 1 — Shapes

Given:

```text
batch = 32
sequence = 15
input_size = 20
hidden_size = 64
```

Find:

```text
input shape
RNN output shape
final hidden shape
```

---

## Exercise 2 — Parameter Count

Calculate the recurrent parameters for:

```text
input_size = 10
hidden_size = 20
```

Use:

$$
D_hD_x+D_hD_h+D_h
$$

---

## Exercise 3 — From Scratch

Implement:

```python
h_t = tanh(
    W_xh @ x_t +
    W_hh @ h_prev +
    b
)
```

using NumPy.

---

## Exercise 4 — Time Series

Create:

```text
sin(t)
```

and train an RNN to predict the next value.

Try:

```text
hidden_size = 16
32
64
```

Compare the results.

---

## Exercise 5 — Classification

Create synthetic sequences where:

```text
positive sequences → higher values
negative sequences → lower values
```

Train:

```text
RNN → Linear → CrossEntropyLoss
```

---

# 52. Knowledge Check

Before moving to LSTM/GRU, answer these without looking:

1. What problem does an RNN solve?
2. What is hidden state?
3. Why does the previous hidden state matter?
4. Write the RNN hidden-state equation.
5. What does sequence length mean?
6. What is many-to-one?
7. What is many-to-many?
8. What is BPTT?
9. Why do vanishing gradients happen?
10. What is gradient clipping?
11. What does `batch_first=True` mean?
12. What does PyTorch `output` contain?
13. What does `hidden` contain?
14. What is a bidirectional RNN?
15. Why do we need LSTM/GRU?

If you can answer these clearly, you understand the fundamentals of RNNs.

---

# 53. Key Takeaways

```text
RNN
│
├── Designed for sequential data
│
├── Maintains hidden state
│
├── Processes one time step at a time
│
├── Shares parameters across time
│
├── Supports different sequence lengths
│
├── Can perform many-to-one
│
├── Can perform many-to-many
│
├── Trained using BPTT
│
├── Can suffer from vanishing gradients
│
├── Can suffer from exploding gradients
│
├── Gradient clipping helps exploding gradients
│
└── Struggles with long-term dependencies
```

The most important mental model is:

```text
Current input
     +
Previous hidden state
     ↓
    RNN
     ↓
New hidden state
     ↓
Next time step
```

And the major limitation:

```text
Vanilla RNN
     ↓
Long-term dependency problem
     ↓
LSTM / GRU
```

---

# 54. Connection to the Next Module

You now know **why recurrent networks need memory**.

But vanilla RNN memory is limited because information must travel through many recurrent steps.

The next question is:

> **Can we design a recurrent network that learns what information to keep and what information to forget?**

That leads directly to:

# 09 — LSTM & GRU

```text
RNN
 ↓
Long-term dependency problem
 ↓
LSTM
 ├── Forget gate
 ├── Input gate
 ├── Output gate
 └── Cell state

GRU
 ├── Update gate
 └── Reset gate
```

That is the main reason **LSTM and GRU** became important improvements over the vanilla RNN.
