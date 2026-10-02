# 05 — Backpropagation

**Date:** 05 June 2026
**Stage:** Deep Learning
**Module:** Backpropagation
**Framework:** PyTorch

---

## 1. What You Will Learn

By the end of this module, you should understand:

* What backpropagation actually is
* Why neural networks need backpropagation
* Computational graphs
* Derivatives and gradients
* The chain rule
* Forward pass vs backward pass
* How a loss produces gradients
* How gradients reach every parameter
* Manual backpropagation with numbers
* Gradient descent updates
* NumPy implementation from scratch
* PyTorch autograd
* `.backward()`
* `.grad`
* `zero_grad()`
* `optimizer.step()`
* Gradient accumulation
* `detach()` and `no_grad()`
* Vanishing and exploding gradients
* Gradient debugging
* Common mistakes
* How backpropagation connects to optimization

---

# 2. What Is Backpropagation?

**Backpropagation** is the algorithm used to efficiently calculate how much each model parameter contributed to the final loss.

In simple terms:

> Backpropagation works backward through the neural network to calculate gradients.

The overall process is:

```text
Input
 ↓
Forward Pass
 ↓
Prediction
 ↓
Loss
 ↓
Backpropagation
 ↓
Gradients
 ↓
Optimizer
 ↓
Updated Weights
```

Remember the distinction:

```text
Backpropagation → calculates gradients

Optimizer → uses gradients to update parameters
```

They are related, but they are **not the same thing**.

---

# 3. Why Do We Need Backpropagation?

Consider a neural network with:

```text
100,000 parameters
```

After making a prediction, we want to know:

```text
How should each parameter change
to reduce the loss?
```

For every parameter \(w_i\), we need:

$$
\frac{\partial L}{\partial w_i}
$$

Doing this manually for every parameter would be extremely inefficient.

Backpropagation calculates these derivatives efficiently by applying the **chain rule** through the computational graph.

---

# 4. The Core Idea

Suppose:

$$
x \rightarrow a \rightarrow b \rightarrow L
$$

The loss \(L\) depends on \(b\).

\(b\) depends on \(a\).

\(a\) depends on \(x\).

If we want:

$$
\frac{\partial L}{\partial x}
$$

we can use:

$$
\boxed{
\frac{\partial L}{\partial x}
=
\frac{\partial L}{\partial b}
\frac{\partial b}{\partial a}
\frac{\partial a}{\partial x}
}
$$

This is the **chain rule**.

Backpropagation is essentially the efficient application of this idea to a neural network.

---

# 5. What Is a Derivative?

A derivative tells us how one quantity changes when another quantity changes.

Suppose:

$$
y=x^2
$$

Then:

$$
\frac{dy}{dx}=2x
$$

At:

$$
x=3
$$

the derivative is:

$$
\frac{dy}{dx}=6
$$

Meaning a small change in \(x\) produces approximately six times that change in \(y\) around \(x=3\).

---

# 6. Why Derivatives Matter in Deep Learning

Suppose:

$$
L
$$

is the loss and:

$$
w
$$

is a model weight.

We calculate:

$$
\frac{\partial L}{\partial w}
$$

This tells us:

> How sensitive is the loss to this weight?

If:

$$
\frac{\partial L}{\partial w}>0
$$

increasing \(w\) locally increases the loss.

If:

$$
\frac{\partial L}{\partial w}<0
$$

increasing \(w\) locally decreases the loss.

Therefore gradient descent uses:

$$
w_{new}
=
w-\eta\frac{\partial L}{\partial w}
$$

---

# 7. Computational Graph

A neural network can be represented as a computational graph.

Example:

$$
x
\rightarrow
w
\rightarrow
z
\rightarrow
\hat y
\rightarrow
L
$$

Suppose:

$$
z=wx
$$

and:

$$
\hat y=z
$$

and:

$$
L=(\hat y-y)^2
$$

The graph becomes:

```text
x ──→ z ──→ ŷ ──→ L
      ↑
      w
```

Forward pass:

```text
x
↓
z
↓
prediction
↓
loss
```

Backward pass:

```text
loss
↓
prediction
↓
z
↓
w
```

---

# 8. Forward Pass

The **forward pass** calculates the prediction.

For a simple neuron:

$$
z=wx+b
$$

Then:

$$
\hat y=f(z)
$$

Finally:

$$
L=\text{Loss}(y,\hat y)
$$

Example:

```text
Input
 ↓
Linear transformation
 ↓
Activation
 ↓
Prediction
 ↓
Loss
```

---

# 9. Backward Pass

After calculating the loss, we move backward.

We calculate:

$$
\frac{\partial L}{\partial w}
$$

$$
\frac{\partial L}{\partial b}
$$

and other parameter gradients.

Then the optimizer updates the parameters.

```text
Loss
 ↓
Gradients
 ↓
Weights
 ↓
Update
```

---

# 10. Chain Rule

The chain rule is the mathematical foundation of backpropagation.

Suppose:

$$
y=f(g(x))
$$

Then:

$$
\frac{dy}{dx}
=
\frac{dy}{dg}
\frac{dg}{dx}
$$

For multiple operations:

$$
x
\rightarrow a
\rightarrow b
\rightarrow c
\rightarrow L
$$

we have:

$$
\frac{\partial L}{\partial x}
=
\frac{\partial L}{\partial c}
\frac{\partial c}{\partial b}
\frac{\partial b}{\partial a}
\frac{\partial a}{\partial x}
$$

---

# 11. Simple Numerical Example

Consider:

$$
x=2
$$

$$
w=3
$$

Define:

$$
z=wx
$$

Therefore:

$$
z=3(2)=6
$$

Suppose:

$$
L=z^2
$$

Therefore:

$$
L=6^2=36
$$

We want:

$$
\frac{\partial L}{\partial w}
$$

---

# 12. Break the Problem Apart

We have:

$$
w
\rightarrow
z
\rightarrow
L
$$

where:

$$
z=wx
$$

and:

$$
L=z^2
$$

Using the chain rule:

$$
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial z}
\frac{\partial z}{\partial w}
$$

---

# 13. Calculate Each Derivative

First:

$$
L=z^2
$$

Therefore:

$$
\frac{\partial L}{\partial z}=2z
$$

Since:

$$
z=6
$$

we get:

$$
\frac{\partial L}{\partial z}=12
$$

Next:

$$
z=wx
$$

Therefore:

$$
\frac{\partial z}{\partial w}=x
$$

Since:

$$
x=2
$$

we get:

$$
\frac{\partial z}{\partial w}=2
$$

---

# 14. Apply the Chain Rule

Therefore:

$$
\frac{\partial L}{\partial w}
=
12\times2
$$

$$
\boxed{
\frac{\partial L}{\partial w}=24
}
$$

This means the gradient of the loss with respect to \(w\) is:

```text
24
```

---

# 15. Update the Weight

Suppose:

$$
\eta=0.1
$$

and:

$$
\frac{\partial L}{\partial w}=24
$$

Gradient descent:

$$
w_{new}=w-\eta\frac{\partial L}{\partial w}
$$

Therefore:

$$
w_{new}=3-(0.1)(24)
$$

$$
w_{new}=0.6
$$

The weight changed from:

```text
3 → 0.6
```

because the gradient indicated the direction in which the loss was increasing.

---

# 16. A More Realistic Example

Consider a neuron:

$$
z=wx+b
$$

with:

```text
x = 2
w = 3
b = 1
```

Then:

$$
z=(3)(2)+1
$$

$$
z=7
$$

Suppose the target is:

$$
y=5
$$

and we use:

$$
L=(z-y)^2
$$

Therefore:

$$
L=(7-5)^2
$$

$$
L=4
$$

---

# 17. Calculate Gradient With Respect to Weight

We have:

$$
w
\rightarrow
z
\rightarrow
L
$$

Therefore:

$$
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial z}
\frac{\partial z}{\partial w}
$$

For:

$$
L=(z-y)^2
$$

we get:

$$
\frac{\partial L}{\partial z}
=
2(z-y)
$$

Therefore:

$$
\frac{\partial L}{\partial z}
=
2(7-5)
$$

$$
=4
$$

And:

$$
z=wx+b
$$

so:

$$
\frac{\partial z}{\partial w}=x=2
$$

Therefore:

$$
\frac{\partial L}{\partial w}
=
4(2)
$$

$$
\boxed{8}
$$

---

# 18. Gradient With Respect to Bias

Again:

$$
\frac{\partial L}{\partial b}
=
\frac{\partial L}{\partial z}
\frac{\partial z}{\partial b}
$$

Since:

$$
z=wx+b
$$

we have:

$$
\frac{\partial z}{\partial b}=1
$$

Therefore:

$$
\frac{\partial L}{\partial b}
=
4(1)
$$

$$
\boxed{4}
$$

So:

```text
dL/dw = 8
dL/db = 4
```

---

# 19. Update Both Parameters

Suppose:

$$
\eta=0.1
$$

Weight:

$$
w_{new}=3-(0.1)(8)
$$

$$
w_{new}=2.2
$$

Bias:

$$
b_{new}=1-(0.1)(4)
$$

$$
b_{new}=0.6
$$

New parameters:

```text
w = 2.2
b = 0.6
```

---

# 20. What Just Happened?

The complete process was:

```text
Forward:
x = 2
↓
z = wx + b
↓
z = 7
↓
loss = 4

Backward:
loss
↓
dL/dz = 4
↓
dL/dw = 8
dL/db = 4

Optimizer:
w → 2.2
b → 0.6
```

That is the core of neural-network learning.

---

# 21. Backpropagation Through an Activation

Now suppose:

$$
z=wx+b
$$

and:

$$
a=ReLU(z)
$$

and:

$$
L=(a-y)^2
$$

The graph becomes:

```text
x
↓
z
↓
ReLU
↓
a
↓
Loss
```

The gradient must pass through every operation.

Therefore:

$$
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial a}
\frac{\partial a}{\partial z}
\frac{\partial z}{\partial w}
$$

This is why understanding activation-function derivatives is important.

---

# 22. ReLU Derivative

ReLU:

$$
ReLU(x)=\max(0,x)
$$

Its derivative is approximately:

$$
ReLU'(x)=
\begin{cases}
0 & x<0\\
1 & x>0
\end{cases}
$$

Therefore:

```text
Positive activation
→ gradient passes through

Negative activation
→ gradient becomes zero
```

This connects directly to the **dying ReLU** problem discussed in activation functions.

---

# 23. Backpropagation Through Multiple Layers

Consider:

```text
Input
 ↓
Linear Layer 1
 ↓
ReLU
 ↓
Linear Layer 2
 ↓
Output
 ↓
Loss
```

The gradient travels backward:

```text
Loss
 ↓
Layer 2
 ↓
ReLU
 ↓
Layer 1
 ↓
Input
```

Each operation contributes a local derivative.

The chain rule combines those local derivatives.

---

# 24. Local Gradients

Imagine:

$$
a=f(x)
$$

and:

$$
b=g(a)
$$

and:

$$
L=h(b)
$$

Each operation knows its local derivative:

```text
h → dh/db
g → db/da
f → da/dx
```

Backpropagation multiplies them:

$$
\frac{dL}{dx}
=
\frac{dL}{db}
\frac{db}{da}
\frac{da}{dx}
$$

This is one reason computational graphs are so useful.

---

# 25. Why Backpropagation Is Efficient

A neural network may contain millions or billions of parameters.

Naively calculating each derivative separately would involve enormous repeated computation.

Backpropagation reuses intermediate gradient calculations.

This makes gradient computation practical for large neural networks.

The important idea is:

> Calculate gradients once and reuse them as the backward pass moves through the graph.

---

# 26. Backpropagation vs Gradient Descent

These are often confused.

| Backpropagation            | Gradient Descent |
| -------------------------- | ---------------- |
| Calculates gradients       | Uses gradients   |
| Uses chain rule            | Uses update rule |
| Answers "which direction?" | Moves parameters |
| Computes \(dL/dw\)         | Updates \(w\)    |

Together:

```text
Backpropagation
↓
Gradient
↓
Gradient Descent / Optimizer
↓
New parameters
```

---

# 27. Backpropagation vs Optimizer

For example:

```python id="q5h8ax"
loss.backward()
```

calculates gradients.

Then:

```python id="qg1p8r"
optimizer.step()
```

updates the parameters.

So:

```text
loss.backward()
→ backpropagation/autograd

optimizer.step()
→ parameter update
```

---

# 28. NumPy From-Scratch Example

Let's implement the simple neuron manually.

```python id="i0dr8g"
import numpy as np

x = 2.0
w = 3.0
b = 1.0
y = 5.0

# Forward
z = w * x + b
loss = (z - y) ** 2

print("z:", z)
print("loss:", loss)
```

Output:

```text
z: 7.0
loss: 4.0
```

---

# 29. Manual Backward Pass

```python id="j4j4b1"
dL_dz = 2 * (z - y)

dL_dw = dL_dz * x
dL_db = dL_dz * 1

print("dL/dw:", dL_dw)
print("dL/db:", dL_db)
```

Output:

```text
dL/dw: 8.0
dL/db: 4.0
```

This is backpropagation written explicitly.

---

# 30. Manual Parameter Update

```python id="3u8j6e"
learning_rate = 0.1

w = w - learning_rate * dL_dw
b = b - learning_rate * dL_db

print(w)
print(b)
```

Output:

```text
2.2
0.6
```

---

# 31. PyTorch Autograd

PyTorch provides automatic differentiation through:

```python id="xw3xg8"
torch.autograd
```

Example:

```python id="gl9n2f"
import torch

x = torch.tensor(2.0)
w = torch.tensor(3.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

z = w * x + b

loss = (z - 5.0) ** 2

loss.backward()

print(w.grad)
print(b.grad)
```

Output:

```text
tensor(8.)
tensor(4.)
```

PyTorch calculated the gradients for us.

---

# 32. `requires_grad=True`

This tells PyTorch:

> Track operations involving this tensor because I may need gradients later.

Example:

```python id="h7y2l5"
w = torch.tensor(
    3.0,
    requires_grad=True
)
```

After the forward computation, PyTorch builds the necessary computation history.

Then:

```python id="j1d5cl"
loss.backward()
```

calculates gradients.

---

# 33. `.grad`

After:

```python id="w0p2p8"
loss.backward()
```

the gradient can be accessed through:

```python id="fxu7j6"
w.grad
```

For example:

```text id="n5v7n1"
w.grad = 8
b.grad = 4
```

These gradients are then used by the optimizer.

---

# 34. PyTorch Training Example

```python id="v4b6g0"
import torch
import torch.nn as nn

model = nn.Linear(1, 1)

loss_fn = nn.MSELoss()

optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01
)

x = torch.tensor([[2.0]])
y = torch.tensor([[5.0]])

optimizer.zero_grad()

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

optimizer.step()
```

The important sequence:

```text
zero_grad()
↓
forward
↓
loss
↓
backward()
↓
optimizer.step()
```

---

# 35. Why `zero_grad()` Is Important

Gradients accumulate.

Consider:

```python id="b8s1po"
loss.backward()
loss.backward()
```

without clearing the gradients.

The second backward pass adds to the existing gradient.

Usually, we want each optimization step to use the gradient from the current batch.

Therefore:

```python id="3n4u9e"
optimizer.zero_grad()
```

is normally called before the next backward pass.

---

# 36. Gradient Accumulation

Suppose:

```text id="0yqjz4"
First backward:
gradient = 3

Second backward:
gradient = 4
```

Without clearing:

$$
3+4=7
$$

So:

```text id="s9t5ad"
stored gradient = 7
```

This behavior can actually be useful for **gradient accumulation**, where multiple mini-batches are intentionally combined before an optimizer update.

---

# 37. Gradient Accumulation for Large Models

Suppose GPU memory only allows:

```text id="c3as9m"
batch size = 8
```

but you want an effective batch size of:

```text id="h6d3xe"
32
```

You can accumulate gradients over four batches:

```text id="qzqv8g"
Batch 1 → backward
Batch 2 → backward
Batch 3 → backward
Batch 4 → backward
             ↓
        optimizer.step()
```

In real training, the loss is commonly scaled appropriately when accumulating.

---

# 38. `torch.no_grad()`

During inference, we usually do not need gradients.

Use:

```python id="j0f2f3"
with torch.no_grad():
    prediction = model(x)
```

This avoids unnecessary gradient tracking.

For modern PyTorch inference code, `torch.inference_mode()` can also be used when its stronger inference semantics are appropriate.

---

# 39. `model.train()` vs `model.eval()`

Training:

```python id="5f2b0k"
model.train()
```

Evaluation/inference:

```python id="1n8hkg"
model.eval()
```

These affect layers such as:

* Dropout
* Batch Normalization

Important:

```text
model.eval()
```

does **not** itself disable gradient tracking.

For inference, commonly:

```python id="2n4q2u"
model.eval()

with torch.no_grad():
    output = model(x)
```

---

# 40. `detach()`

Sometimes you want to remove a tensor from the current autograd graph.

```python id="yqj4fw"
y = x.detach()
```

The resulting tensor shares storage in the usual case but is no longer connected to the original computation graph for gradient propagation.

A common use is when you want to use a tensor's value without propagating gradients through that part of the computation.

---

# 41. Gradient Graph Concept

PyTorch dynamically builds an autograd graph from operations.

For example:

```python id="v9kz7u"
x
 ↓
multiply
 ↓
add
 ↓
square
 ↓
loss
```

Each operation stores enough information for the backward computation.

When:

```python id="kqf9rt"
loss.backward()
```

is called, PyTorch traverses the graph backward.

---

# 42. A Simple Graph

Suppose:

$$
a=wx
$$

$$
b=a+2
$$

$$
L=b^2
$$

Graph:

```text
w ──┐
    ↓
x → multiply → a → add → b → square → L
```

Backward:

```text
L
↓
b
↓
a
↓
w
```

The chain rule connects every step.

---

# 43. Gradient of the Example

We have:

$$
a=wx
$$

$$
b=a+2
$$

$$
L=b^2
$$

Therefore:

$$
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial b}
\frac{\partial b}{\partial a}
\frac{\partial a}{\partial w}
$$

Each part is:

$$
\frac{\partial L}{\partial b}=2b
$$

$$
\frac{\partial b}{\partial a}=1
$$

$$
\frac{\partial a}{\partial w}=x
$$

Therefore:

$$
\boxed{
\frac{\partial L}{\partial w}=2bx
}
$$

---

# 44. Gradients in a Neural Network

For a dense layer:

$$
z=xW+b
$$

The backward pass calculates gradients such as:

$$
\frac{\partial L}{\partial W}
$$

and:

$$
\frac{\partial L}{\partial b}
$$

and also the gradient flowing into the previous layer:

$$
\frac{\partial L}{\partial x}
$$

This allows the gradient to continue traveling backward through the network.

---

# 45. Why the Gradient Flows Backward

The loss is at the end of the network.

```text
Input
 ↓
Layer 1
 ↓
Layer 2
 ↓
Layer 3
 ↓
Loss
```

To determine how Layer 1 affected the loss, we must trace the dependency backward:

```text
Loss
 ↓
Layer 3
 ↓
Layer 2
 ↓
Layer 1
```

That is why it is called **backpropagation**.

---

# 46. Vanishing Gradients

In a deep network, gradients may become extremely small as they are propagated backward.

Example:

```text
0.5
↓
0.2
↓
0.05
↓
0.01
↓
0.002
```

Eventually:

```text
gradient ≈ 0
```

Earlier layers then learn extremely slowly.

This is called the:

**Vanishing Gradient Problem**

---

# 47. Exploding Gradients

The opposite can also happen.

Gradients can become extremely large:

```text
1
↓
5
↓
30
↓
200
↓
1500
```

This can produce:

* unstable training
* extremely large parameter updates
* `NaN`
* loss explosion

This is the:

**Exploding Gradient Problem**

---

# 48. Why RNNs Are Vulnerable

Recurrent neural networks repeatedly apply transformations across time.

Conceptually:

```text
h1
↓
h2
↓
h3
↓
h4
↓
...
```

During Backpropagation Through Time, gradients pass through many repeated operations.

This can cause:

```text
vanishing gradients
or
exploding gradients
```

This is one major reason LSTM and GRU architectures were developed.

---

# 49. Gradient Clipping

Gradient clipping limits excessively large gradients.

Example:

```python id="f4i3yq"
torch.nn.utils.clip_grad_norm_(
    model.parameters(),
    max_norm=1.0
)
```

Typical training:

```python id="g8g2ml"
optimizer.zero_grad()

output = model(x)

loss = loss_fn(output, y)

loss.backward()

torch.nn.utils.clip_grad_norm_(
    model.parameters(),
    max_norm=1.0
)

optimizer.step()
```

This is particularly useful in some recurrent or unstable training scenarios.

---

# 50. Common Backpropagation Mistakes

### Mistake 1 — Forgetting `zero_grad()`

```python id="j6p1qn"
loss.backward()
optimizer.step()
```

Repeated without clearing gradients can cause unintended accumulation.

---

### Mistake 2 — Updating Parameters Before Backward

Incorrect sequence:

```text id="9ex9b2"
optimizer.step()
↓
loss.backward()
```

Normally:

```text id="l9h8kr"
loss.backward()
↓
optimizer.step()
```

---

### Mistake 3 — Using Gradients During Inference

If gradients are not needed:

```python id="e9w1kt"
with torch.no_grad():
    output = model(x)
```

---

### Mistake 4 — Wrong Loss/Output Combination

For example:

```text id="0a0t0f"
CrossEntropyLoss
+
manually applied softmax
```

is generally unnecessary and can lead to incorrect training behavior.

---

# 51. Checking Gradients

When debugging a model:

```python id="w9qz0j"
for name, param in model.named_parameters():
    if param.grad is not None:
        print(
            name,
            param.grad.abs().mean().item()
        )
```

This can reveal:

```text
normal gradients
very small gradients
very large gradients
missing gradients
```

---

# 52. What Does a Zero Gradient Mean?

A zero gradient does not automatically mean the model is broken.

Possible reasons:

* activation derivative is zero
* parameter does not affect the current output
* computation was detached
* parameter is frozen
* certain loss/model structures naturally produce zero gradients

You need to inspect the computation.

---

# 53. Frozen Parameters

Suppose:

```python id="9v17ne"
for param in model.parameters():
    param.requires_grad = False
```

Those parameters will not be trained normally.

This is common in:

**Transfer Learning**

where a pretrained model's layers may initially be frozen.

---

# 54. Backpropagation and Batch Size

Suppose batch size is:

```text id="u7f2lb"
32
```

The loss is calculated across those examples.

The gradients represent the effect of the batch according to the loss reduction being used.

With:

```python id="v2m0fw"
nn.MSELoss()
```

the default reduction is generally:

```text id="3r3h3w"
mean
```

So the batch contributes an averaged loss.

---

# 55. Gradient Checking

For debugging mathematical implementations, you can compare an analytical gradient with a numerical approximation.

A simple numerical derivative is:

$$
\frac{f(x+\epsilon)-f(x-\epsilon)}
{2\epsilon}
$$

This is called the **central difference approximation**.

Example:

```text id="1eqz3e"
Analytical gradient = 2.0000

Numerical gradient   = 1.9999
```

They should be close.

This technique is useful when implementing custom layers or operations.

---

# 56. Why Not Always Use Numerical Gradients?

Numerical differentiation requires multiple function evaluations.

For a large neural network with millions of parameters, doing this for every parameter would be extremely expensive.

Backpropagation calculates gradients much more efficiently.

Therefore:

```text
Numerical gradients
→ useful for checking

Backpropagation
→ used for actual training
```

---

# 57. The Complete Learning Algorithm

A simplified neural-network training process is:

### Step 1 — Initialize

```text
Weights
Biases
```

### Step 2 — Forward Pass

```text
Input
 ↓
Layers
 ↓
Prediction
```

### Step 3 — Calculate Loss

```text
Prediction
+
Target
↓
Loss
```

### Step 4 — Backpropagation

```text
Loss
↓
Gradients
```

### Step 5 — Optimizer

```text
Gradients
↓
Updated parameters
```

### Step 6 — Repeat

```text
Many batches
↓
Many epochs
↓
Better parameters
```

---

# 58. The Most Important Distinction

Memorize the roles, not the words:

| Component       | Job                                 |
| --------------- | ----------------------------------- |
| Forward pass    | Calculate prediction                |
| Loss            | Measure error                       |
| Backpropagation | Calculate gradients                 |
| Optimizer       | Update parameters                   |
| Epoch           | Complete pass through training data |
| Batch           | Group of training examples          |

This distinction is extremely important for interviews and practical debugging.

---

# 59. Mini Experiment

Create a simple model:

```python id="8a4f2k"
model = nn.Sequential(
    nn.Linear(2, 8),
    nn.ReLU(),
    nn.Linear(8, 1)
)
```

Then:

1. Generate random input.
2. Generate targets.
3. Run forward pass.
4. Calculate MSE.
5. Call `loss.backward()`.
6. Print parameter gradients.
7. Call `optimizer.step()`.
8. Repeat for 100 epochs.
9. Plot the loss.

You should observe the loss generally decrease if the setup is sensible.

---

# 60. Debugging Checklist

If training is not working, check:

```text
[ ] Correct input shape
[ ] Correct target shape
[ ] Correct loss function
[ ] Correct output shape
[ ] Correct target dtype
[ ] Learning rate
[ ] optimizer.zero_grad()
[ ] loss.backward()
[ ] optimizer.step()
[ ] model.train()
[ ] Validation procedure
[ ] NaN/Inf values
[ ] Gradient magnitude
```

---

# 61. Interview Questions

### Fundamentals

1. What is backpropagation?
2. Why is backpropagation needed?
3. What is the chain rule?
4. What is a computational graph?
5. What is a gradient?
6. What is the difference between forward and backward propagation?
7. How does a gradient tell us how to update a parameter?

### PyTorch

8. What does `requires_grad=True` mean?
9. What does `loss.backward()` do?
10. Where are gradients stored?
11. Why do we call `optimizer.zero_grad()`?
12. What does `optimizer.step()` do?
13. What is `torch.no_grad()`?
14. What is `detach()`?
15. What is the difference between `model.eval()` and `torch.no_grad()`?

### Advanced

16. What is vanishing gradient?
17. What is exploding gradient?
18. Why are RNNs vulnerable to gradient problems?
19. What is gradient clipping?
20. Why is numerical differentiation not used for normal neural-network training?
21. How does backpropagation make gradient computation efficient?
22. What happens if a parameter has `requires_grad=False`?

---

# 62. Knowledge Check

Before moving forward, you should be able to:

* [ ] Explain backpropagation in your own words
* [ ] Explain the chain rule
* [ ] Draw a computational graph
* [ ] Calculate a simple derivative
* [ ] Calculate a simple gradient manually
* [ ] Perform a manual backward pass
* [ ] Explain forward vs backward pass
* [ ] Explain gradient descent
* [ ] Use `requires_grad=True`
* [ ] Use `loss.backward()`
* [ ] Read `.grad`
* [ ] Explain gradient accumulation
* [ ] Use `optimizer.zero_grad()`
* [ ] Explain `torch.no_grad()`
* [ ] Explain `detach()`
* [ ] Explain vanishing gradients
* [ ] Explain exploding gradients
* [ ] Explain gradient clipping
* [ ] Debug missing/abnormal gradients
* [ ] Explain backpropagation vs optimizer

---

# 63. Key Takeaways

The most important idea:

$$
\boxed{
\text{Backpropagation calculates how each parameter affects the loss}
}
$$

The mathematical foundation is:

$$
\boxed{\text{Chain Rule}}
$$

The training flow is:

```text
Forward Pass
     ↓
Prediction
     ↓
Loss
     ↓
Backpropagation
     ↓
Gradients
     ↓
Optimizer
     ↓
Parameter Update
```

In PyTorch:

```python id="6i1q5m"
optimizer.zero_grad()

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

optimizer.step()
```

Remember:

```text
loss.backward()
→ calculate gradients

optimizer.step()
→ update weights
```
