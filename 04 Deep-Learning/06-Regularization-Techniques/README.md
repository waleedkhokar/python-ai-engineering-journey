# 06 — Regularization Techniques

**Date:** 06 June 2026
**Stage:** Deep Learning
**Module:** Regularization Techniques
**Framework:** PyTorch

---

## 1. What You Will Learn

By the end of this module, you should understand:

* Overfitting
* Underfitting
* Generalization
* Bias and variance
* L1 regularization
* L2 regularization
* Weight decay
* Dropout
* Early stopping
* Data augmentation
* Batch Normalization
* Layer Normalization
* `train()` vs `eval()`
* How to choose regularization techniques
* Common mistakes

---

# 2. What Is Regularization?

**Regularization** means using techniques that help a model generalize better instead of simply memorizing the training data.

The goal is:

```text
Training data
      ↓
Learn useful patterns
      ↓
Generalize to unseen data
```

Without appropriate regularization, a large neural network can memorize the training examples.

---

# 3. Overfitting

Overfitting happens when the model performs very well on training data but poorly on unseen data.

Example:

```text
Training accuracy    = 99%
Validation accuracy  = 75%
```

The model has learned the training set extremely well, but its learned patterns do not generalize sufficiently.

Typical signs:

```text
Training loss   ↓↓↓
Validation loss ↓ then ↑
```

---

# 4. Underfitting

Underfitting occurs when the model cannot learn the underlying pattern sufficiently.

Example:

```text
Training accuracy    = 65%
Validation accuracy  = 63%
```

Both are poor.

Possible causes:

* model too simple
* insufficient training
* poor features/data
* excessive regularization

---

# 5. Generalization

The real objective of machine learning is not:

> Memorize the training dataset.

It is:

> Learn patterns that work on new data.

Therefore:

```text
Training performance
        +
Generalization
        ↓
Useful model
```

Regularization is one tool for improving this balance.

---

# 6. Bias and Variance

A simplified view:

### High bias

```text
Model too simple
↓
Underfitting
```

### High variance

```text
Model too sensitive to training data
↓
Overfitting
```

Regularization generally tries to reduce excessive variance.

It does not mean:

> More regularization is always better.

Too much regularization can cause underfitting.

---

# 7. L1 Regularization

L1 adds a penalty based on the absolute values of weights.

$$
L_{total}
=
L_{data}
+
\lambda\sum_i |w_i|
$$

where:

* \(L_{data}\) = original loss
* \(\lambda\) = regularization strength
* \(w_i\) = model weights

The model is encouraged to keep unnecessary weights small, and L1 can encourage some weights toward exactly zero.

---

# 8. L2 Regularization

L2 adds a squared-weight penalty:

$$
L_{total}
=
L_{data}
+
\lambda\sum_i w_i^2
$$

Large weights receive a stronger penalty.

Conceptually:

```text
Large weights
      ↓
Higher penalty
      ↓
Encourage smaller weights
```

L2 regularization is extremely common in neural-network training.

---

# 9. L1 vs L2

| Feature                     | L1             | L2              |   |         |
| --------------------------- | -------------- | --------------- | - | ------- |
| Penalty                     | (              | w               | ) | \(w^2\) |
| Encourages zeros            | More strongly  | Less directly   |   |         |
| Effect                      | Sparse weights | Smaller weights |   |         |
| Common neural-network usage | Less common    | Very common     |   |         |

---

# 10. Weight Decay

**Weight decay** is closely related to L2 regularization.

The idea is to discourage unnecessarily large weights.

A simple update can be viewed conceptually as:

$$
w \leftarrow w-\eta
\left(
\nabla L+\lambda w
\right)
$$

Modern optimizers can implement weight decay differently.

This distinction matters for Adam-based optimizers.

---

# 11. Adam vs AdamW

With Adam, regularization and adaptive optimization can interact in a coupled way.

**AdamW** uses **decoupled weight decay**.

Example:

```python
optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001,
    weight_decay=0.01
)
```

AdamW is a common practical choice when using weight decay with Adam-style optimization.

---

# 12. Dropout

Dropout randomly removes some activations during training.

Example:

```text
Before:
[1.2, 0.7, 2.1, 0.4]

Dropout:
[1.2, 0, 2.1, 0]
```

The network cannot rely too heavily on specific neurons.

This encourages more robust representations.

---

# 13. PyTorch Dropout

```python
model = nn.Sequential(
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(64, 10)
)
```

Here:

```text
p = 0.3
```

means approximately 30% of activations are dropped during training.

---

# 14. Dropout During Training vs Inference

Dropout behaves differently depending on model mode.

Training:

```python
model.train()
```

Dropout is active.

Inference:

```python
model.eval()
```

Dropout is disabled.

Therefore:

```python
model.eval()

with torch.no_grad():
    output = model(x)
```

is a common inference pattern.

---

# 15. Why Dropout Works

Imagine a network always depends heavily on one particular neuron.

If that neuron disappears during training, the network must learn alternative paths.

Conceptually:

```text
Without dropout:
Neuron A → very important

With dropout:
A may disappear
↓
Network learns multiple useful representations
```

This can reduce over-reliance on individual features.

---

# 16. Early Stopping

Early stopping stops training when validation performance stops improving.

Example:

```text
Epoch    Train Loss    Val Loss

1        0.80          0.85
2        0.60          0.65
3        0.45          0.50
4        0.32          0.42
5        0.25          0.40
6        0.18          0.44
7        0.12          0.51
```

Training loss keeps decreasing.

But validation loss starts increasing.

That is a warning sign of overfitting.

---

# 17. Patience

Instead of stopping immediately after one bad epoch, use **patience**.

For example:

```text
patience = 3
```

means training can continue for several epochs without improvement before stopping.

A typical workflow:

```text
Validation improves
      ↓
Continue

No improvement
      ↓
Wait

Still no improvement
      ↓
Stop
```

---

# 18. Data Augmentation

Data augmentation creates modified versions of training examples.

For images:

```text
Original image
     ↓
Flip
Rotate
Crop
Resize
Color changes
     ↓
Additional training examples
```

The goal is to expose the model to reasonable variations.

---

# 19. PyTorch Image Augmentation

Using torchvision transforms:

```python
from torchvision import transforms

train_transform = transforms.Compose([
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor()
])
```

The exact augmentations should match the problem.

Do not apply transformations that change the meaning of the label.

---

# 20. Data Augmentation vs Regularization

Data augmentation does not directly modify model weights.

Instead, it changes the training data.

```text
Weight regularization:
Model constraints

Data augmentation:
Data variation
```

Both can improve generalization.

---

# 21. Batch Normalization

Batch Normalization normalizes activations using statistics calculated from the current mini-batch during training.

Conceptually:

```text
Layer output
   ↓
Normalize
   ↓
Scale + Shift
   ↓
Next layer
```

PyTorch:

```python
nn.BatchNorm1d(64)
```

or for images:

```python
nn.BatchNorm2d(64)
```

It can make optimization easier and sometimes provide a regularizing effect.

---

# 22. BatchNorm Train vs Eval

BatchNorm behaves differently during training and evaluation.

During training:

```text
Uses batch statistics
```

During evaluation:

```text
Uses stored running statistics
```

Therefore:

```python
model.train()
```

and:

```python
model.eval()
```

are important.

Incorrect mode handling can produce unexpected validation or inference results.

---

# 23. Layer Normalization

Layer Normalization normalizes across features within an individual example rather than relying on batch statistics.

PyTorch:

```python
nn.LayerNorm(512)
```

It is particularly common in Transformer architectures.

Conceptually:

```text
BatchNorm
→ across batch-related dimensions

LayerNorm
→ within each example's feature representation
```

---

# 24. BatchNorm vs LayerNorm

| Feature                           | BatchNorm          | LayerNorm        |
| --------------------------------- | ------------------ | ---------------- |
| Depends on batch statistics       | Yes                | No               |
| Common in CNNs                    | Yes                | Less common      |
| Common in Transformers            | Less common        | Yes              |
| Works naturally with tiny batches | Can be problematic | Generally better |

The exact behavior depends on tensor shape and architecture.

---

# 25. Choosing Regularization

A practical decision process:

### Model overfits

Consider:

```text
More training data
Data augmentation
Weight decay
Dropout
Early stopping
Smaller model
```

### Model underfits

Consider:

```text
Less regularization
Larger model
Better features
Longer training
```

Do not automatically add every regularization technique.

---

# 26. Common Mistakes

### Mistake 1 — Dropout during inference

Always ensure:

```python
model.eval()
```

when evaluating.

---

### Mistake 2 — Too much dropout

Example:

```text
Dropout = 0.8
```

can make learning unnecessarily difficult.

---

### Mistake 3 — Excessive weight decay

Very strong regularization can prevent the model from learning useful patterns.

---

### Mistake 4 — Data leakage

Augmentation and preprocessing must respect the train/validation/test separation.

Do not use information from validation/test data to train the model.

---

# 27. Practical Experiment

Train the same neural network in three versions:

### Model A

```text
No regularization
```

### Model B

```text
Dropout
```

### Model C

```text
Weight decay
```

Compare:

```text
Training loss
Validation loss
Training accuracy
Validation accuracy
```

The goal is not simply to find the lowest training loss.

Look at the **generalization gap**.

$$
\text{Generalization Gap}
=
\text{Training Performance}
-
\text{Validation Performance}
$$

---

# 28. Simple PyTorch Example

```python
model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Dropout(0.3),

    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Dropout(0.3),

    nn.Linear(128, 10)
)

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001,
    weight_decay=0.01
)
```

This combines:

```text
Dropout
+
Weight decay
```

---

# 29. Regularization Comparison

| Technique         | Main idea                         |
| ----------------- | --------------------------------- |
| L1                | Penalize absolute weights         |
| L2                | Penalize squared weights          |
| Weight decay      | Reduce excessive weight magnitude |
| Dropout           | Randomly remove activations       |
| Early stopping    | Stop before overfitting           |
| Data augmentation | Increase useful data variation    |
| BatchNorm         | Normalize batch activations       |
| LayerNorm         | Normalize feature representations |

---

# 30. Interview Questions

1. What is overfitting?
2. What is underfitting?
3. What is regularization?
4. Why does regularization help?
5. What is L1 regularization?
6. What is L2 regularization?
7. What is weight decay?
8. What is dropout?
9. Why is dropout disabled during inference?
10. What is early stopping?
11. What is data augmentation?
12. What is BatchNorm?
13. What is LayerNorm?
14. BatchNorm vs LayerNorm?
15. What happens if regularization is too strong?
16. Why use `model.eval()`?
17. Why can validation loss increase while training loss decreases?

---

# 31. Knowledge Check

You should now be able to:

* [ ] Explain overfitting
* [ ] Explain underfitting
* [ ] Explain generalization
* [ ] Explain bias and variance
* [ ] Explain L1
* [ ] Explain L2
* [ ] Explain weight decay
* [ ] Explain AdamW
* [ ] Explain dropout
* [ ] Use `Dropout` in PyTorch
* [ ] Explain early stopping
* [ ] Explain data augmentation
* [ ] Explain BatchNorm
* [ ] Explain LayerNorm
* [ ] Explain `train()` vs `eval()`
* [ ] Identify overfitting from training/validation curves
* [ ] Choose an appropriate regularization technique

---

# 32. Key Takeaways

The main problem:

```text
Model memorizes training data
          ↓
Poor generalization
          ↓
Overfitting
```

Regularization provides different ways to reduce this problem:

```text
L1 / L2
   ↓
Control weights

Dropout
   ↓
Reduce neuron dependency

Data Augmentation
   ↓
Increase useful variation

Early Stopping
   ↓
Stop before excessive fitting

BatchNorm / LayerNorm
   ↓
Improve training behavior
```

The most important rule is:

> **Regularization should improve generalization, not simply make training loss smaller.**
