# 03 — Activation Functions

**Date:** 03 June 2026
**Stage:** Deep Learning
**Module:** Activation Functions
**Framework:** PyTorch

---

## 1. What Are Activation Functions?

An activation function determines the output of a neuron after its weighted sum.

A neuron first calculates:

$$
z = Wx+b
$$

Then:

$$
a=f(z)
$$

where `f` is the activation function.

```text
Input
  ↓
Wx + b
  ↓
Activation Function
  ↓
Output
```

Activation functions are one of the most important parts of neural networks because they introduce **nonlinearity**.

---

## 2. Why Do We Need Them?

Consider:

```python
nn.Linear(10, 32)
nn.Linear(32, 16)
nn.Linear(16, 1)
```

All three layers are linear transformations.

Even though there are multiple layers, their combination can still be represented as a single linear transformation.

Therefore, the network cannot properly learn complex nonlinear relationships.

With activations:

```text
Linear
  ↓
ReLU
  ↓
Linear
  ↓
ReLU
  ↓
Linear
```

the network can model much more complex functions.

### Key idea

> **Linear layers learn transformations; activation functions provide nonlinearity.**

---

# 3. Identity Activation

The identity function simply returns the input:

$$
f(x)=x
$$

Example:

```text
x = 5
output = 5
```

It is essentially no activation.

### Common use

Regression output layers often use a linear/identity output.

Example:

```text
House price → 250000
Temperature → 31.5
Sales → 1250
```

---

# 4. Binary Step Function

The binary step function produces either `0` or `1`.

$$
f(x)=
\begin{cases}
1 & x\geq0\\
0 & x<0
\end{cases}
$$

Example:

```text
x = -2 → 0
x =  3 → 1
```

It was important in early perceptrons.

### Problem

It is not useful for modern gradient-based training because its derivative is not suitable for gradient optimization.

---

# 5. Sigmoid

The sigmoid function is:

$$
\sigma(x)=\frac{1}{1+e^{-x}}
$$

Its output is between:

$$
0 < \sigma(x) < 1
$$

Examples:

$$
\sigma(0)=0.5
$$

$$
\sigma(2)\approx0.881
$$

$$
\sigma(-2)\approx0.119
$$

Shape:

```text
output
1 |             ______
  |          __/
  |       __/
0.5|------/
  |    _/
  |___/
0 +------------------ input
```

### Advantages

* Smooth
* Output between 0 and 1
* Useful for probability-like outputs

### Problems

For very large positive or negative values, it saturates.

Its derivative:

$$
\sigma'(x)=\sigma(x)(1-\sigma(x))
$$

The maximum derivative is only:

$$
0.25
$$

This can contribute to **vanishing gradients** in deep networks.

### Common use

Binary classification output in appropriate model/loss setups.

---

# 6. Tanh

The hyperbolic tangent function:

$$
\tanh(x)=\frac{e^x-e^{-x}}{e^x+e^{-x}}
$$

Output range:

$$
-1 < \tanh(x) < 1
$$

Examples:

$$
\tanh(0)=0
$$

$$
\tanh(2)\approx0.964
$$

$$
\tanh(-2)\approx-0.964
$$

```text
output
 1 |        ______
   |      /
 0 |-----/
   |   /
-1 |__/
   +---------------- input
```

### Advantage

It is zero-centered, unlike sigmoid.

### Problem

It can still saturate and cause vanishing gradients.

Today, ReLU-family functions are generally preferred for many hidden layers.

---

# 7. ReLU

ReLU means **Rectified Linear Unit**.

$$
ReLU(x)=\max(0,x)
$$

Therefore:

```text
x < 0 → 0
x > 0 → x
```

Examples:

$$
ReLU(-3)=0
$$

$$
ReLU(0)=0
$$

$$
ReLU(5)=5
$$

Graph:

```text
output
  |
  |       /
  |      /
  |     /
  |____/
  |
  +---------------- input
       0
```

### Why ReLU became popular

* Simple
* Computationally cheap
* Works well in deep networks
* Reduces some vanishing-gradient problems compared with sigmoid/tanh

### Main problem

**Dying ReLU**

If a neuron consistently receives negative values:

$$
ReLU(x)=0
$$

Its gradient is also zero for negative inputs.

The neuron can effectively stop learning.

---

# 8. ReLU Derivative

For:

$$
ReLU(x)=\max(0,x)
$$

the derivative is approximately:

$$
ReLU'(x)=
\begin{cases}
0 & x<0\\
1 & x>0
\end{cases}
$$

So:

```text
positive input → gradient ≈ 1
negative input → gradient = 0
```

This explains the dying-ReLU problem.

---

# 9. Leaky ReLU

Leaky ReLU keeps a small negative slope.

$$
f(x)=
\begin{cases}
x & x>0\\
\alpha x & x\leq0
\end{cases}
$$

Usually:

$$
\alpha=0.01
$$

Example:

$$
LeakyReLU(-5)=-0.05
$$

while:

$$
ReLU(-5)=0
$$

This allows some gradient to pass through negative values.

PyTorch:

```python
nn.LeakyReLU(0.01)
```

---

# 10. PReLU

PReLU means **Parametric ReLU**.

It is similar to Leaky ReLU, but the negative slope is learned.

$$
f(x)=
\begin{cases}
x & x>0\\
\alpha x & x\leq0
\end{cases}
$$

Here `α` is trainable.

PyTorch:

```python
nn.PReLU()
```

Difference:

| Function   | Negative slope |
| ---------- | -------------- |
| ReLU       | 0              |
| Leaky ReLU | Fixed          |
| PReLU      | Learned        |

---

# 11. ELU

ELU means **Exponential Linear Unit**.

$$
f(x)=
\begin{cases}
x & x>0\\
\alpha(e^x-1) & x\leq0
\end{cases}
$$

For positive values it behaves like ReLU.

For negative values it smoothly approaches:

$$
-\alpha
$$

PyTorch:

```python
nn.ELU()
```

It can produce smoother negative behavior than ReLU.

---

# 12. GELU

GELU means **Gaussian Error Linear Unit**.

A common approximation is:

$$
GELU(x)\approx
0.5x
\left(
1+\tanh
\left[
\sqrt{\frac{2}{\pi}}
(x+0.044715x^3)
\right]
\right)
$$

Unlike ReLU, GELU does not simply remove all negative values.

GELU is widely used in modern Transformer architectures.

PyTorch:

```python
nn.GELU()
```

You will encounter GELU again when studying Transformers.

---

# 13. SiLU / Swish

SiLU is:

$$
SiLU(x)=x\sigma(x)
$$

where:

$$
\sigma(x)=\frac{1}{1+e^{-x}}
$$

PyTorch:

```python
nn.SiLU()
```

It is also commonly called **Swish**.

SiLU is used in several modern deep-learning architectures.

---

# 14. Softmax

Softmax converts a vector of scores into values that sum to `1`.

For class score \(z_i\):

$$
softmax(z_i)=
\frac{e^{z_i}}
{\sum_j e^{z_j}}
$$

Example:

```text
Raw scores:

[2.0, 1.0, 0.1]
```

Softmax produces approximately:

```text
[0.659, 0.242, 0.099]
```

Check:

$$
0.659+0.242+0.099\approx1
$$

This allows us to interpret the outputs as class probabilities.

### Common use

Multiclass classification.

Example:

```text
Cat    0.66
Dog    0.24
Horse  0.10
```

Prediction:

```text
Cat
```

---

# 15. Softmax in PyTorch

```python
import torch

logits = torch.tensor([2.0, 1.0, 0.1])

probabilities = torch.softmax(logits, dim=0)

print(probabilities)
```

Important:

> In many PyTorch classification setups, you should **not manually apply Softmax before `CrossEntropyLoss`**. `CrossEntropyLoss` expects logits and internally handles the required normalization.

---

# 16. Activation Function Comparison

| Function   | Range                        | Main issue/use                               |
| ---------- | ---------------------------- | -------------------------------------------- |
| Identity   | \((-\infty,\infty)\)         | Regression output                            |
| Step       | 0 or 1                       | Classical perceptron                         |
| Sigmoid    | 0 to 1                       | Binary output                                |
| Tanh       | -1 to 1                      | Older hidden layers / some sequence contexts |
| ReLU       | 0 to ∞                       | Common hidden activation                     |
| Leaky ReLU | \(-\infty\) to ∞             | Reduce dying ReLU                            |
| PReLU      | \(-\infty\) to ∞             | Learn negative slope                         |
| ELU        | \(-\alpha\) to ∞             | Smooth negative region                       |
| GELU       | approximately \(-0.17\) to ∞ | Transformers/modern networks                 |
| SiLU       | approximately \(-0.28\) to ∞ | Modern deep networks                         |
| Softmax    | 0 to 1                       | Multiclass probabilities                     |

---

# 17. Hidden Layer vs Output Layer

Activation selection depends on **where** the activation is used.

### Hidden layers

Common choices:

```text
ReLU
Leaky ReLU
GELU
SiLU
```

### Regression output

Usually:

```text
Linear / Identity
```

### Binary classification

Often use a single logit with:

```python
nn.BCEWithLogitsLoss()
```

rather than manually applying sigmoid during training.

### Multiclass classification

Usually output raw logits:

```python
nn.Linear(hidden_size, num_classes)
```

and use:

```python
nn.CrossEntropyLoss()
```

---

# 18. PyTorch Example

```python
import torch
import torch.nn as nn

x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])

relu = nn.ReLU()

print(relu(x))
```

Output:

```text
tensor([0., 0., 0., 1., 2.])
```

Try:

```python
leaky_relu = nn.LeakyReLU(0.1)

print(leaky_relu(x))
```

Now negative values are not completely removed.

---

# 19. Practical Experiment

Test several functions:

```python
import torch
import torch.nn as nn

x = torch.linspace(-5, 5, 11)

functions = {
    "ReLU": nn.ReLU(),
    "LeakyReLU": nn.LeakyReLU(),
    "Tanh": nn.Tanh(),
    "Sigmoid": nn.Sigmoid(),
    "GELU": nn.GELU(),
    "SiLU": nn.SiLU()
}

for name, function in functions.items():
    print(name)
    print(function(x))
```

Observe:

* output range
* negative values
* behavior around zero
* saturation
* differences between functions

---

# 20. The Vanishing Gradient Problem

Sigmoid and tanh can saturate.

For example, sigmoid approaches:

$$
0
$$

or:

$$
1
$$

at extreme values.

Their derivatives become very small.

During backpropagation, gradients are multiplied through layers.

If many gradients are small:

$$
0.1\times0.1\times0.1=0.001
$$

The gradient can become extremely small.

This is called:

> **Vanishing gradient**

It can make deep networks difficult to train.

---

# 21. Exploding Gradients

The opposite can also happen.

If gradients repeatedly become large:

$$
10\times10\times10=1000
$$

gradients can grow rapidly.

This is:

> **Exploding gradient**

It can cause:

* unstable training
* extremely large updates
* NaN values
* model failure

Gradient clipping and appropriate initialization/architecture choices can help.

---

# 22. Choosing an Activation

A practical starting point:

```text
Hidden layers
    ↓
ReLU / GELU / SiLU
```

For classical/simple MLPs:

```text
ReLU
```

is a strong baseline.

For modern architectures:

```text
GELU / SiLU
```

are common.

For output layers:

```text
Regression       → Linear
Binary           → Logit + BCEWithLogitsLoss
Multiclass       → Logits + CrossEntropyLoss
```

Do not choose an output activation without considering the loss function.

---

# 23. Exercises

### Exercise 1

Calculate:

$$
ReLU(-4)
$$

$$
ReLU(7)
$$

### Exercise 2

Calculate approximately:

$$
\sigma(0)
$$

$$
\sigma(2)
$$

### Exercise 3

Explain why:

```text
Linear → Linear → Linear
```

is not enough to create a powerful nonlinear network.

### Exercise 4

Compare:

```text
ReLU
Leaky ReLU
GELU
```

and explain when you might use each.

### Exercise 5

For each task, choose an appropriate output setup:

| Task              | Output |
| ----------------- | ------ |
| House price       | ?      |
| Spam / not spam   | ?      |
| Cat / dog / horse | ?      |

---

# 24. Interview Questions

1. Why are activation functions necessary?
2. What is ReLU?
3. What is the dying ReLU problem?
4. How does Leaky ReLU address it?
5. What is the difference between ReLU and GELU?
6. Why can sigmoid cause vanishing gradients?
7. What is the output range of tanh?
8. What is Softmax used for?
9. Why shouldn't you normally apply Softmax before `CrossEntropyLoss`?
10. What activation is commonly used for regression output?
11. What is the difference between a logit and a probability?
12. What is the vanishing-gradient problem?
13. What is the exploding-gradient problem?
14. What is SiLU/Swish?
15. What is PReLU?

---

# 25. Knowledge Check

Before continuing, you should be able to:

* [ ] Explain why activation functions are needed
* [ ] Calculate ReLU manually
* [ ] Explain sigmoid and tanh
* [ ] Explain the dying ReLU problem
* [ ] Explain Leaky ReLU
* [ ] Understand GELU and SiLU
* [ ] Explain Softmax
* [ ] Understand vanishing gradients
* [ ] Understand exploding gradients
* [ ] Choose appropriate output activations/loss setups
* [ ] Implement common activations in PyTorch

---

# 26. Key Takeaways

The most important concepts:

$$
z=Wx+b
$$

followed by:

$$
a=f(z)
$$

Activation functions provide the **nonlinearity** that allows neural networks to learn complex patterns.

Remember the main choices:

```text
ReLU       → common hidden-layer baseline
Leaky ReLU → helps with dying ReLU
GELU       → common in Transformers
SiLU       → common modern activation
Sigmoid    → binary probability-style output
Softmax    → multiclass probability distribution
Linear     → regression output
```
