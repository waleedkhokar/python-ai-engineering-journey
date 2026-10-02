# 12 — Autoencoders

**Date:** 12 June 2026
**Level:** Intermediate → Job-Ready
**Framework:** PyTorch
**Previous:** 11 — Transfer Learning
**Next:** 13 — GANs

> **Target:** ~700–800 words. Kept strictly **under 900 words**.

---

## 1. What Is an Autoencoder?

An **autoencoder** is a neural network that learns to represent input data in a smaller or useful representation and then reconstruct the original input.

Basic structure:

```text
Input
  ↓
Encoder
  ↓
Latent Representation
  ↓
Decoder
  ↓
Reconstructed Input
```

The model learns:

$$
x \rightarrow z \rightarrow \hat{x}
$$

where:

* `x` = original input
* `z` = latent representation
* `x̂` = reconstructed input

The goal is:

$$
\hat{x} \approx x
$$

---

# 2. Why Use Autoencoders?

Autoencoders can be useful for:

* Dimensionality reduction
* Feature learning
* Data compression
* Denoising
* Anomaly detection
* Representation learning
* Pretraining

Example:

```text
784 pixel values
      ↓
   Encoder
      ↓
32-dimensional latent vector
      ↓
   Decoder
      ↓
784 reconstructed pixels
```

Instead of manually deciding which features matter, the network learns them.

---

# 3. Encoder

The encoder transforms the input into a latent representation.

$$
z=f_\theta(x)
$$

Example:

```text
Input: 784
   ↓
Linear: 256
   ↓
Linear: 64
   ↓
Latent: 16
```

The latent vector contains a compressed representation of the input.

---

# 4. Latent Space

The **latent space** is the internal representation learned by the encoder.

For example:

```text
784 dimensions
      ↓
     128
      ↓
     32
      ↓
     8
```

The final 8-dimensional vector is the latent representation.

A good latent space can capture important patterns while ignoring unnecessary details.

---

# 5. Decoder

The decoder reconstructs the original input:

$$
\hat{x}=g_\phi(z)
$$

Example:

```text
Latent: 16
   ↓
Linear: 64
   ↓
Linear: 256
   ↓
Output: 784
```

Complete architecture:

```text
784
 ↓
256
 ↓
64
 ↓
16  ← latent space
 ↓
64
 ↓
256
 ↓
784
```

---

# 6. Reconstruction Loss

The autoencoder compares:

```text
Original x
    vs
Reconstructed x̂
```

A common loss is Mean Squared Error:

$$
MSE=\frac{1}{n}\sum_{i=1}^{n}(x_i-\hat{x}_i)^2
$$

The training objective is:

$$
\min L(x,\hat{x})
$$

The model learns to reconstruct the input as accurately as possible.

---

# 7. Important Idea: Bottleneck

The latent representation is often smaller than the input.

Example:

```text
Input
784
 ↓
128
 ↓
32
 ↓
8 ← bottleneck
 ↓
32
 ↓
128
 ↓
784
```

Why is this useful?

The network cannot simply copy every input value through the bottleneck.

It must learn a more compact representation.

This is called an **undercomplete autoencoder**.

---

# 8. Simple Numerical Example

Suppose:

```text
Original:
[1.0, 0.5, 0.2]

Reconstruction:
[0.8, 0.6, 0.3]
```

Squared errors:

$$
(1.0-0.8)^2=0.04
$$

$$
(0.5-0.6)^2=0.01
$$

$$
(0.2-0.3)^2=0.01
$$

MSE:

$$
\frac{0.04+0.01+0.01}{3}
=
0.02
$$

Training attempts to reduce this reconstruction error.

---

# 9. PyTorch Autoencoder

```python
import torch
import torch.nn as nn

class Autoencoder(nn.Module):

    def __init__(self):
        super().__init__()

        self.encoder = nn.Sequential(
            nn.Linear(784, 128),
            nn.ReLU(),
            nn.Linear(128, 32),
            nn.ReLU(),
            nn.Linear(32, 16)
        )

        self.decoder = nn.Sequential(
            nn.Linear(16, 32),
            nn.ReLU(),
            nn.Linear(32, 128),
            nn.ReLU(),
            nn.Linear(128, 784),
            nn.Sigmoid()
        )

    def forward(self, x):

        z = self.encoder(x)

        reconstruction = self.decoder(z)

        return reconstruction
```

---

# 10. Training

```python
model = Autoencoder()

criterion = nn.MSELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=1e-3
)
```

Training:

```python
for epoch in range(20):

    model.train()

    optimizer.zero_grad()

    reconstruction = model(x)

    loss = criterion(
        reconstruction,
        x
    )

    loss.backward()

    optimizer.step()
```

Notice something important:

```text
target = input
```

The model learns from the input itself.

This is why autoencoders are commonly considered **self-supervised / unsupervised-style representation learning** depending on the exact formulation.

---

# 11. Getting the Latent Representation

Sometimes we don't care primarily about reconstruction.

We want the compressed representation.

```python
with torch.no_grad():

    latent = model.encoder(x)
```

Example:

```text
Input
[batch, 784]

Latent
[batch, 16]
```

This latent vector can potentially be used for:

* Clustering
* Visualization
* Classification
* Similarity search
* Anomaly detection

---

# 12. Denoising Autoencoder

A **denoising autoencoder** receives corrupted input but tries to reconstruct the clean input.

```text
Clean image
    ↓
Add noise
    ↓
Noisy image
    ↓
Encoder
    ↓
Decoder
    ↓
Clean reconstruction
```

Training:

$$
\text{noisy }x \rightarrow \hat{x}_{clean}
$$

This forces the model to learn useful structure rather than simply copying noise.

---

# 13. Anomaly Detection

Autoencoders can also detect unusual examples.

Suppose we train on:

```text
normal transactions
```

The model learns to reconstruct normal patterns well.

For a very different example:

```text
anomalous transaction
```

reconstruction error may be higher.

Conceptually:

```text
Normal
  ↓
Low reconstruction error

Anomaly
  ↓
High reconstruction error
```

A threshold can then be selected:

$$
error > threshold \Rightarrow anomaly
$$

The threshold should be chosen using validation data rather than arbitrarily.

---

# 14. Autoencoder vs PCA

Autoencoders and PCA can both perform dimensionality reduction.

| Feature              | PCA     | Autoencoder    |
| -------------------- | ------- | -------------- |
| Main method          | Linear  | Neural network |
| Nonlinear features   | No      | Yes            |
| Complexity           | Low     | Higher         |
| Interpretability     | Higher  | Lower          |
| Large data           | Limited | Strong         |
| Deep representations | No      | Yes            |

A basic linear autoencoder can learn a representation closely related to PCA, while nonlinear autoencoders can capture more complex patterns.

---

# 15. Convolutional Autoencoder

For images, fully connected layers aren't always ideal.

A CNN-based autoencoder can use:

```text
Image
 ↓
Conv layers
 ↓
Latent representation
 ↓
Transpose Conv / Upsampling
 ↓
Reconstructed image
```

This preserves spatial structure better than flattening everything immediately.

---

# 16. Important Problem: Overcomplete Autoencoders

Suppose:

```text
Input = 784
Latent = 2000
```

The latent representation is larger than the input.

The model might learn an almost direct identity mapping:

```text
x → x
```

This may not produce a useful compressed representation.

Therefore, architecture design and regularization matter.

---

# 17. VAE Connection

A **Variational Autoencoder (VAE)** extends the basic autoencoder idea.

Instead of simply learning:

```text
x → fixed latent vector
```

a VAE learns a **probabilistic latent distribution**.

Conceptually:

```text
Input
 ↓
Encoder
 ↓
Distribution
 ↓
Sample latent vector
 ↓
Decoder
 ↓
Reconstruction
```

VAEs are important generative models, but the full mathematical treatment belongs in a dedicated generative-model study rather than basic autoencoders.

---

# 18. Common Mistakes

### 1. Wrong output activation

For normalized image data `[0,1]`, a sigmoid output can be appropriate.

For other target ranges, the output activation should match the data.

### 2. Incorrect normalization

Input preprocessing and output assumptions must be consistent.

### 3. Latent dimension too large

The network may learn a trivial identity mapping.

### 4. Only checking training reconstruction

Always inspect validation reconstruction too.

### 5. Assuming reconstruction quality means useful features

A model can reconstruct well without producing the representation you actually need.

---

# 19. Practical Project

Build a **MNIST autoencoder**.

Pipeline:

```text
MNIST
 ↓
Normalize
 ↓
Flatten
 ↓
Encoder
 ↓
16/32-dimensional latent space
 ↓
Decoder
 ↓
Reconstruction
```

Compare:

```text
latent = 4
latent = 16
latent = 64
```

Measure:

* Reconstruction loss
* Visual reconstruction quality
* Training time
* Latent representation size

Then build a denoising version.

---

# 20. Interview Questions

**What is an autoencoder?**
A network that learns to encode input into a representation and reconstruct the original input.

**What is the bottleneck?**
The compressed latent representation between encoder and decoder.

**What is reconstruction loss?**
A loss measuring the difference between the original input and reconstruction.

**Why use an undercomplete representation?**
To force the model to learn a compact representation rather than simply copying the input.

**What is a denoising autoencoder?**
It receives corrupted input and learns to reconstruct the clean version.

**How can autoencoders detect anomalies?**
Examples that reconstruct poorly can have unusually high reconstruction error.

---

# 21. Key Takeaways

```text
Autoencoder
│
├── Encoder
│      ↓
│   Latent Space
│      ↓
├── Decoder
│      ↓
└── Reconstruction
```

Core objective:

$$
\boxed{x \rightarrow z \rightarrow \hat{x}}
$$

with:

$$
\boxed{\hat{x}\approx x}
$$

Remember:

> **Encoder = compress/represent**

> **Latent space = learned representation**

> **Decoder = reconstruct**

> **Reconstruction loss = measure how well the model rebuilt the input**
