# 11 — Transfer Learning

**Date:** 11 June 2026
**Level:** Intermediate → Job-Ready
**Framework:** PyTorch
**Previous:** 10 — Transformers Basics
**Next:** 12 — Autoencoders

> **Target:** ~700–800 words. Kept strictly **under 900 words**.

---

## 1. What Is Transfer Learning?

**Transfer learning** means taking knowledge learned by a model on one task/dataset and reusing it for another related task.

Instead of training a neural network completely from zero:

```text
Random weights
    ↓
Train on your small dataset
```

we start with:

```text
Pretrained model
      ↓
Reuse learned features
      ↓
Adapt to your task
```

This can reduce:

* Training time
* Data requirements
* Compute requirements

---

# 2. Why Pretrained Models Work

Imagine a CNN trained on millions of images.

Early layers may learn general patterns such as:

```text
edges
↓
corners
↓
textures
↓
shapes
↓
objects
```

These representations can often be useful for another image task.

For example:

```text
ImageNet pretrained model
          ↓
Your medical/image dataset
          ↓
New classifier
```

The pretrained knowledge is reused instead of starting from random initialization.

---

# 3. Transfer Learning Workflow

Typical workflow:

```text
Pretrained Model
       ↓
Inspect architecture
       ↓
Replace task-specific head
       ↓
Freeze / unfreeze layers
       ↓
Train on new dataset
       ↓
Evaluate
       ↓
Fine-tune if necessary
```

---

# 4. Feature Extraction vs Fine-Tuning

There are two major approaches.

## Feature Extraction

Freeze the pretrained model and train only the new classifier.

```text
Pretrained layers → FROZEN
                    ↓
                New head
                    ↓
                  Train
```

Advantages:

* Faster
* Less compute
* Less risk of overfitting
* Useful with small datasets

---

## Fine-Tuning

Allow some or all pretrained layers to update.

```text
Pretrained model
       ↓
Unfreeze selected layers
       ↓
Train with small learning rate
```

This allows the model to adapt its learned representations to the new domain.

---

# 5. When Should You Freeze Layers?

Suppose your dataset is:

```text
500 images
```

and your pretrained model contains millions of parameters.

Training everything immediately may overfit.

A common starting point:

```text
Freeze backbone
       ↓
Train classifier
       ↓
Evaluate
       ↓
Unfreeze later layers
       ↓
Fine-tune carefully
```

---

# 6. PyTorch Example

Using torchvision:

```python
import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT

model = resnet18(weights=weights)
```

The model already contains pretrained parameters.

---

# 7. Freezing the Backbone

```python
for param in model.parameters():
    param.requires_grad = False
```

Now the pretrained parameters won't receive gradient updates.

Replace the final classifier:

```python
model.fc = nn.Linear(
    model.fc.in_features,
    3
)
```

If we have:

```text
cat
dog
horse
```

we need:

```text
3 output classes
```

The new classifier remains trainable.

---

# 8. Training Only the New Head

```python
import torch

optimizer = torch.optim.AdamW(
    model.fc.parameters(),
    lr=1e-3
)
```

Training flow:

```text
Input image
     ↓
Frozen pretrained backbone
     ↓
New classifier
     ↓
Loss
     ↓
Update classifier
```

The backbone does not change.

---

# 9. Fine-Tuning

After training the new head, we might decide that the pretrained features need adaptation.

Unfreeze selected layers:

```python
for param in model.layer4.parameters():
    param.requires_grad = True
```

Now:

```text
Earlier layers → Frozen
Later layers   → Trainable
Classifier     → Trainable
```

Usually, the learning rate for pretrained layers should be smaller than for the new head.

Example:

```python
optimizer = torch.optim.AdamW([
    {
        "params": model.layer4.parameters(),
        "lr": 1e-5
    },
    {
        "params": model.fc.parameters(),
        "lr": 1e-3
    }
])
```

This is called **discriminative learning rates**.

---

# 10. Why Smaller Learning Rates?

The pretrained model already contains useful knowledge.

A large learning rate can destroy that knowledge quickly.

Think:

```text
Pretrained weights
      ↓
small updates
      ↓
adapt to new task
```

rather than:

```text
Pretrained weights
      ↓
huge updates
      ↓
forget useful representations
```

This is sometimes called **catastrophic forgetting** in the broader context of fine-tuning.

---

# 11. Domain Similarity Matters

Transfer learning works especially well when the source and target tasks have useful similarities.

Example:

```text
General image classification
        ↓
Animal classification
```

is relatively intuitive.

But:

```text
Natural images
        ↓
Very specialized scientific images
```

may require more fine-tuning.

The further the target domain is from the original training data, the more carefully you should evaluate whether the pretrained representation transfers well.

---

# 12. Data Preprocessing

A pretrained model expects the preprocessing associated with its pretrained weights.

For torchvision weights:

```python
weights = ResNet18_Weights.DEFAULT

preprocess = weights.transforms()
```

Then:

```python
image = preprocess(image)
```

This helps maintain consistency between:

```text
pretraining preprocessing
        ↓
your inference/training preprocessing
```

Incorrect preprocessing can significantly reduce performance.

---

# 13. Train / Validation / Test

Transfer learning still requires proper dataset separation:

```text
Training data
     ↓
Update model
     
Validation data
     ↓
Tune decisions

Test data
     ↓
Final evaluation
```

Do not use the test set repeatedly while developing the model.

---

# 14. Common Transfer Learning Strategies

| Strategy            | Backbone            | New Head | Use Case                            |
| ------------------- | ------------------- | -------- | ----------------------------------- |
| Feature extraction  | Frozen              | Train    | Small dataset                       |
| Partial fine-tuning | Partially trainable | Train    | Moderate adaptation                 |
| Full fine-tuning    | Trainable           | Train    | Larger/related dataset              |
| Train from scratch  | Random              | Train    | Large custom dataset / special case |

---

# 15. Transfer Learning for NLP

The same idea applies beyond computer vision.

Example:

```text
Pretrained Transformer
        ↓
Text classification
```

A pretrained model already learned useful language representations.

We can adapt it to:

* Sentiment classification
* Spam detection
* Topic classification
* Named entity recognition

This connects directly to modern pretrained language models.

---

# 16. Common Mistakes

### Mistake 1 — Training everything immediately

With a tiny dataset, this can cause overfitting.

### Mistake 2 — Using a large learning rate

Pretrained weights can change too aggressively.

### Mistake 3 — Forgetting `requires_grad`

Frozen parameters should have:

```python
requires_grad = False
```

### Mistake 4 — Wrong preprocessing

Input normalization and image transformations should match the pretrained model's expected setup.

### Mistake 5 — Data leakage

Never allow validation/test information to influence training.

---

# 17. Practical Project

Build an image classifier:

```text
Dataset
  ↓
Train / Validation / Test
  ↓
Pretrained ResNet
  ↓
Replace classifier
  ↓
Freeze backbone
  ↓
Train head
  ↓
Evaluate
  ↓
Unfreeze final block
  ↓
Fine-tune
  ↓
Compare results
```

Record:

* Accuracy
* Precision
* Recall
* Validation loss
* Training time
* Number of trainable parameters

Compare:

```text
Model A → Feature extraction
Model B → Fine-tuning
Model C → Training from scratch
```

---

# 18. Interview Questions

**What is transfer learning?**
Reusing knowledge from a pretrained model for a new related task.

**What is feature extraction?**
Using a pretrained model as a mostly frozen feature generator while training a new task-specific head.

**What is fine-tuning?**
Updating some or all pretrained parameters on the target dataset.

**Why use a smaller learning rate for pretrained layers?**
To adapt existing representations without changing them too aggressively.

**Why freeze layers?**
To reduce computation, train fewer parameters, and reduce overfitting risk.

**What is domain shift?**
A difference between the data distribution used for pretraining and the target data distribution.

---

# 19. Key Takeaways

```text
Pretrained Model
       ↓
Reuse learned representations
       ↓
Replace task-specific head
       ↓
Freeze OR fine-tune
       ↓
Evaluate
```

Remember:

> **Feature extraction = reuse the model mostly as-is.**

> **Fine-tuning = adapt pretrained weights to your task.**

The practical strategy is often:

```text
Start frozen
     ↓
Train new head
     ↓
Evaluate
     ↓
Unfreeze selected layers
     ↓
Fine-tune with smaller LR
