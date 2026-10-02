# 04 — Loss Functions and Optimizers

**Date:** 04 June 2026
**Stage:** Deep Learning
**Module:** Loss Functions and Optimizers
**Framework:** PyTorch

---

## 1. What You Will Learn

By the end of this module, you should understand:

* What a loss function is
* Why neural networks need loss
* Prediction vs target
* MSE, MAE, Huber Loss
* Binary Cross-Entropy
* `BCEWithLogitsLoss`
* Multiclass Cross-Entropy
* Logits and probabilities
* Loss vs metric
* What an optimizer does
* Gradient Descent
* Learning rate
* SGD
* Momentum
* RMSprop
* Adam
* AdamW
* Weight decay
* Learning-rate scheduling
* How loss and optimizers work together

---

# 2. What Is a Loss Function?

A **loss function** measures how different the model's prediction is from the correct target.

Suppose the real house price is:

```text
Target = 300,000
```

and the model predicts:

```text
Prediction = 280,000
```

The loss function converts this error into a numerical value.

```text
Input
 ↓
Neural Network
 ↓
Prediction
 ↓
Loss Function
 ↓
Loss
```

The training process tries to make the loss smaller.

---

# 3. Prediction vs Target

Use:

$$
y = \text{true target}
$$

$$
\hat{y} = \text{model prediction}
$$

The loss function compares:

$$
y
$$

with:

$$
\hat{y}
$$

Example:

```text
Target      = 10
Prediction  = 8
```

The prediction error is:

$$
8-10=-2
$$

Different loss functions treat this error differently.

---

# 4. Loss vs Metric

These are related but not identical.

### Loss

Used by the training algorithm to calculate gradients and update parameters.

### Metric

Used to evaluate model performance.

Example:

```text
Training:
Cross Entropy Loss

Evaluation:
Accuracy
```

Another example:

```text
Training:
MSE

Evaluation:
MAE / RMSE
```

A metric does not necessarily need to be differentiable.

---

# 5. Regression Loss Functions

For regression, the target is usually a continuous number.

Examples:

```text
house price
temperature
sales
age
salary
```

Common losses:

* MSE
* MAE
* Huber Loss

---

# 6. Mean Squared Error — MSE

MSE is:

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat y_i)^2
$$

It calculates the squared error and averages it.

Example:

```text
Targets:
[10, 20, 30]

Predictions:
[8, 23, 27]
```

Errors:

$$
[10-8,\ 20-23,\ 30-27]
$$

$$
[2,-3,3]
$$

Squared errors:

$$
[4,9,9]
$$

Mean:

$$
MSE=\frac{4+9+9}{3}
$$

$$
MSE=\frac{22}{3}
$$

$$
MSE\approx7.33
$$

---

# 7. Why Does MSE Square the Error?

Squaring has two important effects:

### 1. Removes negative signs

$$
(-3)^2=9
$$

### 2. Penalizes large errors strongly

Compare:

$$
2^2=4
$$

and:

$$
10^2=100
$$

A large prediction error receives a much larger penalty.

### Problem

MSE can be highly affected by outliers.

If one prediction is extremely wrong, its squared error can dominate the total loss.

---

# 8. PyTorch MSE

```python
import torch
import torch.nn as nn

loss_fn = nn.MSELoss()

target = torch.tensor([10.0, 20.0, 30.0])
prediction = torch.tensor([8.0, 23.0, 27.0])

loss = loss_fn(prediction, target)

print(loss)
```

Output:

```text
tensor(7.3333)
```

---

# 9. Mean Absolute Error — MAE

MAE is:

$$
MAE=\frac{1}{n}\sum_{i=1}^{n}|y_i-\hat y_i|
$$

Using the same example:

```text
Errors:
[2, -3, 3]
```

Absolute errors:

```text
[2, 3, 3]
```

Therefore:

$$
MAE=\frac{2+3+3}{3}
$$

$$
MAE=\frac{8}{3}
$$

$$
MAE\approx2.67
$$

---

# 10. MSE vs MAE

| Property            | MSE        | MAE               |
| ------------------- | ---------- | ----------------- |
| Error               | Squared    | Absolute          |
| Outlier sensitivity | High       | Lower             |
| Gradient            | Smooth     | Less smooth at 0  |
| Common use          | Regression | Robust regression |

Simple intuition:

```text
MSE → strongly punishes big mistakes
MAE → treats errors more proportionally
```

---

# 11. Huber Loss

Huber Loss combines properties of MSE and MAE.

For small errors, it behaves approximately like MSE.

For large errors, it behaves approximately like MAE.

Conceptually:

```text
Small error
    ↓
MSE-like behavior

Large error
    ↓
MAE-like behavior
```

This makes it useful when you want some protection against outliers while retaining smooth behavior around small errors.

PyTorch:

```python
loss_fn = nn.HuberLoss()
```

---

# 12. Classification Losses

Classification is different from regression.

Examples:

```text
Spam / Not Spam
Cat / Dog
Car / Bus / Bike
```

The model must learn to assign appropriate scores/probabilities to classes.

Important classification losses include:

* Binary Cross-Entropy
* BCE with logits
* Cross-Entropy Loss
* Negative Log-Likelihood

---

# 13. Binary Classification

Binary classification has two possible classes:

```text
0 → Not spam
1 → Spam
```

A neural network can produce a single output called a **logit**.

Example:

```text
logit = 2.0
```

A sigmoid can convert it into a probability:

$$
\sigma(2)\approx0.881
$$

So approximately:

```text
Spam probability = 88.1%
```

---

# 14. Binary Cross-Entropy

Binary Cross-Entropy is:

$$
BCE=
-\left[
y\log(p)+(1-y)\log(1-p)
\right]
$$

where:

```text
y = true label
p = predicted probability
```

### Correct confident prediction

Suppose:

```text
y = 1
p = 0.9
```

Then:

$$
Loss=-\log(0.9)
$$

$$
Loss\approx0.105
$$

Small loss.

### Wrong confident prediction

Suppose:

```text
y = 1
p = 0.01
```

Then:

$$
Loss=-\log(0.01)
$$

$$
Loss\approx4.605
$$

Very large loss.

This encourages the model to avoid being confidently wrong.

---

# 15. `BCEWithLogitsLoss`

In PyTorch, a common and numerically stable approach is:

```python
nn.BCEWithLogitsLoss()
```

It combines:

```text
Sigmoid
+
Binary Cross-Entropy
```

internally.

Therefore, during training, give it the **raw logits**, not sigmoid probabilities.

```python
loss_fn = nn.BCEWithLogitsLoss()

logits = model(x)

loss = loss_fn(logits, targets)
```

For prediction, you can convert logits to probabilities:

```python
probabilities = torch.sigmoid(logits)
```

---

# 16. Multiclass Classification

Suppose we have:

```text
0 → Cat
1 → Dog
2 → Horse
```

The model produces three logits:

```text
[2.5, 1.0, 0.2]
```

These are **not probabilities**.

They are raw scores.

The largest logit indicates the predicted class:

```text
2.5 → Cat
```

---

# 17. Cross-Entropy Loss

For a multiclass problem, PyTorch commonly uses:

```python
nn.CrossEntropyLoss()
```

Conceptually:

```text
Logits
 ↓
Softmax
 ↓
Probabilities
 ↓
Negative log probability of correct class
```

If the correct class has high probability:

```text
low loss
```

If the correct class has very low probability:

```text
high loss
```

---

# 18. Important PyTorch Rule

For:

```python
nn.CrossEntropyLoss()
```

provide:

```text
raw logits
```

not:

```text
softmax(logits)
```

Correct:

```python
loss_fn = nn.CrossEntropyLoss()

logits = model(x)

loss = loss_fn(logits, targets)
```

Incorrect in the usual setup:

```python
probabilities = torch.softmax(logits, dim=1)

loss = loss_fn(probabilities, targets)
```

`CrossEntropyLoss` internally performs the appropriate log-softmax operation.

---

# 19. Classification Example

```python
import torch
import torch.nn as nn

loss_fn = nn.CrossEntropyLoss()

logits = torch.tensor([
    [2.5, 1.0, 0.2]
])

target = torch.tensor([0])

loss = loss_fn(logits, target)

print(loss)
```

The target:

```text
0
```

means the first class is correct.

---

# 20. Loss Function Selection

| Problem                   | Common loss       |
| ------------------------- | ----------------- |
| Regression                | MSE / MAE / Huber |
| Binary classification     | BCEWithLogitsLoss |
| Multiclass classification | CrossEntropyLoss  |
| Multilabel classification | BCEWithLogitsLoss |

The output layer and loss function must be designed together.

---

# 21. What Is an Optimizer?

The loss tells us:

> **How wrong is the model?**

The optimizer decides:

> **How should the model's parameters change?**

Training therefore becomes:

```text
Prediction
 ↓
Loss
 ↓
Gradients
 ↓
Optimizer
 ↓
Updated weights
```

The optimizer uses gradients calculated during backpropagation.

---

# 22. Gradient Descent

Suppose we have a parameter:

$$
w
$$

and its loss gradient:

$$
\frac{\partial L}{\partial w}
$$

Gradient descent updates:

$$
w_{new}=w-\eta\frac{\partial L}{\partial w}
$$

where:

$$
\eta
$$

is the **learning rate**.

---

# 23. Numerical Example

Suppose:

```text
w = 5
gradient = 2
learning rate = 0.1
```

Then:

$$
w_{new}=5-(0.1)(2)
$$

$$
w_{new}=4.8
$$

The parameter moved in the direction that reduces the loss.

If:

```text
gradient = -2
```

then:

$$
w_{new}=5-(0.1)(-2)
$$

$$
w_{new}=5.2
$$

---

# 24. Learning Rate

The learning rate controls the size of parameter updates.

### Too small

```text
tiny updates
↓
very slow training
```

### Too large

```text
huge updates
↓
unstable training
↓
loss may explode
```

### Good learning rate

```text
reasonable updates
↓
stable convergence
```

Learning rate is one of the most important hyperparameters in deep learning.

---

# 25. Stochastic Gradient Descent — SGD

SGD updates parameters using gradients calculated from batches of training data.

PyTorch:

```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01
)
```

Training:

```python
loss.backward()
optimizer.step()
optimizer.zero_grad()
```

---

# 26. Momentum

Normal SGD can sometimes move inefficiently.

Momentum adds information from previous updates.

Conceptually:

```text
Current gradient
+
Previous movement
↓
Update direction
```

This can help:

* accelerate training
* reduce oscillation
* move through shallow regions more effectively

PyTorch:

```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01,
    momentum=0.9
)
```

---

# 27. RMSprop

RMSprop adapts the learning rate based on recent gradient magnitudes.

Conceptually:

```text
Large historical gradients
→ smaller effective updates

Small historical gradients
→ relatively larger updates
```

PyTorch:

```python
optimizer = torch.optim.RMSprop(
    model.parameters(),
    lr=0.001
)
```

It has been useful for various neural-network training problems, particularly historically in sequence models.

---

# 28. Adam

Adam stands for:

**Adaptive Moment Estimation**

It combines ideas related to:

* momentum
* adaptive learning rates

Adam tracks moving averages of gradients and squared gradients.

PyTorch:

```python
optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)
```

Adam is a common starting optimizer for many deep-learning experiments.

---

# 29. AdamW

AdamW is a variant of Adam with **decoupled weight decay**.

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001,
    weight_decay=0.01
)
```

AdamW is widely used in modern deep learning, including many Transformer-based architectures.

A useful distinction:

```text
Adam
→ adaptive optimization

AdamW
→ Adam + decoupled weight decay
```

---

# 30. Optimizer Comparison

| Optimizer      | Main idea                                |
| -------------- | ---------------------------------------- |
| SGD            | Basic gradient updates                   |
| SGD + Momentum | Uses previous movement                   |
| RMSprop        | Adaptive updates based on gradient scale |
| Adam           | Momentum + adaptive learning rates       |
| AdamW          | Adam + decoupled weight decay            |

A common practical approach:

```text
Start with Adam/AdamW
↓
Tune learning rate
↓
Compare with SGD when appropriate
```

There is no universally best optimizer for every problem.

---

# 31. Weight Decay

Weight decay discourages excessively large weights.

Conceptually:

```text
Large weights
 ↓
penalty
 ↓
encourages simpler parameters
```

It is commonly used as a form of regularization.

Example:

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001,
    weight_decay=0.01
)
```

Regularization will be studied more deeply in:

**06 — Regularization Techniques**

---

# 32. Learning-Rate Scheduling

A fixed learning rate may not always be ideal.

A scheduler changes the learning rate during training.

Example:

```python
scheduler = torch.optim.lr_scheduler.StepLR(
    optimizer,
    step_size=10,
    gamma=0.1
)
```

Conceptually:

```text
Initial LR
   ↓
training
   ↓
reduce LR
   ↓
training
   ↓
reduce LR again
```

Other common schedulers include:

* ReduceLROnPlateau
* CosineAnnealingLR
* OneCycleLR
* Linear warmup/decay strategies

---

# 33. Complete Training Loop

A basic PyTorch training loop:

```python
for epoch in range(epochs):

    model.train()

    for x, y in train_loader:

        optimizer.zero_grad()

        predictions = model(x)

        loss = loss_fn(predictions, y)

        loss.backward()

        optimizer.step()
```

The order is important:

```text
zero gradients
↓
forward
↓
calculate loss
↓
backward
↓
optimizer step
```

---

# 34. Why `zero_grad()`?

PyTorch accumulates gradients by default.

If you do:

```python
loss.backward()
```

gradients are added to existing gradients.

Therefore, normally:

```python
optimizer.zero_grad()
```

is called before the next backward pass.

Otherwise, gradients can accumulate unintentionally.

---

# 35. Loss Curve

During training, record:

```text
epoch → loss
```

Example:

```text
Epoch 1 → 2.40
Epoch 2 → 1.70
Epoch 3 → 1.20
Epoch 4 → 0.85
Epoch 5 → 0.61
```

This suggests the model is learning.

But training loss alone is not enough.

You should also monitor validation performance.

---

# 36. What If Loss Is Not Decreasing?

Possible causes:

```text
Wrong learning rate
Wrong loss function
Wrong labels
Bad preprocessing
Incorrect output layer
Shape mismatch
Poor initialization
Exploding/vanishing gradients
Bug in training loop
```

Debug systematically rather than immediately changing everything.

---

# 37. Learning Rate Problems

### Loss barely changes

Possible:

```text
learning rate too small
```

### Loss jumps wildly

Possible:

```text
learning rate too large
```

### Loss becomes NaN

Possible causes include:

* unstable training
* excessively large learning rate
* numerical overflow
* invalid input values
* exploding gradients

---

# 38. Practical Model Example

```python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Linear(32, 1)
)

loss_fn = nn.MSELoss()

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001
)
```

Training:

```python
x = torch.randn(32, 10)
y = torch.randn(32, 1)

optimizer.zero_grad()

prediction = model(x)

loss = loss_fn(prediction, y)

loss.backward()

optimizer.step()

print(loss.item())
```

This is the fundamental training cycle.

---

# 39. Important Mental Model

Remember these four components:

```text
MODEL
↓
makes prediction

LOSS
↓
measures error

BACKPROPAGATION
↓
calculates gradients

OPTIMIZER
↓
updates parameters
```

Together:

$$
\boxed{
\text{Model}
\rightarrow
\text{Loss}
\rightarrow
\text{Gradient}
\rightarrow
\text{Optimizer}
}
$$

---

# 40. Exercises

### Exercise 1 — MSE

Calculate MSE:

```text
Target:
[10, 20, 30]

Prediction:
[9, 18, 33]
```

### Exercise 2 — MAE

Calculate MAE for the same values.

### Exercise 3 — Gradient Descent

Given:

```text
w = 10
gradient = 4
learning rate = 0.1
```

Calculate the updated weight.

### Exercise 4 — Optimizers

Explain the difference between:

```text
SGD
Adam
AdamW
```

### Exercise 5 — PyTorch

Build:

```text
Linear(4, 16)
ReLU
Linear(16, 1)
```

Then use:

```text
MSELoss
AdamW
```

and perform one training step.

---

# 41. Interview Questions

### Fundamentals

1. What is a loss function?
2. Why do neural networks need loss functions?
3. What is the difference between loss and metric?
4. What is MSE?
5. What is MAE?
6. When would Huber Loss be useful?
7. What is Binary Cross-Entropy?
8. What is Cross-Entropy Loss?
9. What is a logit?
10. Why does `BCEWithLogitsLoss` exist?

### Optimizers

11. What is gradient descent?
12. What is the learning rate?
13. What happens if the learning rate is too large?
14. What happens if it is too small?
15. What is SGD?
16. What does momentum do?
17. What is Adam?
18. What is AdamW?
19. What is weight decay?
20. What is a learning-rate scheduler?

### PyTorch

21. Why call `zero_grad()`?
22. What does `loss.backward()` do?
23. What does `optimizer.step()` do?
24. Why should raw logits be passed to `CrossEntropyLoss`?
25. Why should raw logits be passed to `BCEWithLogitsLoss`?

---

# 42. Knowledge Check

Before moving forward, you should be able to:

* [ ] Explain what loss measures
* [ ] Calculate MSE manually
* [ ] Calculate MAE manually
* [ ] Explain Huber Loss
* [ ] Explain BCE
* [ ] Explain logits
* [ ] Explain Cross-Entropy
* [ ] Understand `BCEWithLogitsLoss`
* [ ] Understand `CrossEntropyLoss`
* [ ] Explain gradient descent
* [ ] Explain learning rate
* [ ] Explain SGD and momentum
* [ ] Explain Adam
* [ ] Explain AdamW
* [ ] Understand weight decay
* [ ] Understand learning-rate scheduling
* [ ] Write a basic PyTorch training step

---

# 43. Key Takeaways

The core training process is:

```text
Input
 ↓
Model
 ↓
Prediction
 ↓
Loss
 ↓
Backward
 ↓
Gradients
 ↓
Optimizer
 ↓
Updated parameters
```

Remember:

### Regression

```text
MSE
MAE
Huber
```

### Binary classification

```text
Logits
 ↓
BCEWithLogitsLoss
```

### Multiclass classification

```text
Logits
 ↓
CrossEntropyLoss
```

### Optimization

```text
SGD
Momentum
Adam
AdamW
```

And the most important equation:

$$
\boxed{
w_{new}=w-\eta\frac{\partial L}{\partial w}
}
$$

This connects the **loss**, **gradient**, and **optimizer**.
