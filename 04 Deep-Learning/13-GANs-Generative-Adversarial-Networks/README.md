# 13 — GANs (Generative Adversarial Networks)

**Date: 13 June 2026**

## 1. What Are GANs?

**Generative Adversarial Networks (GANs)** are deep learning models used to **generate new data** that resembles real training data.

Examples:

* Generate realistic images
* Create synthetic faces
* Image-to-image translation
* Data augmentation
* Generate artwork or textures

A GAN has two neural networks competing with each other:

| Network               | Job                     |
| --------------------- | ----------------------- |
| **Generator (G)**     | Creates fake samples    |
| **Discriminator (D)** | Determines real vs fake |

The idea is similar to a counterfeiter and detective:

```text
Random Noise
     ↓
 Generator
     ↓
 Fake Image ──────┐
                  ↓
             Discriminator
                  ↑
 Real Image ──────┘
                  ↓
            Real / Fake
```

The Generator improves by trying to fool the Discriminator.

---

## 2. Generator

The Generator receives random noise:

$$
z \sim P(z)
$$

and produces a synthetic sample:

$$
G(z)
$$

For example:

```text
Random vector
[0.2, -1.1, 0.7, ...]
       ↓
   Generator
       ↓
   Fake Image
```

The Generator's goal:

> Make generated samples look realistic enough that the Discriminator classifies them as real.

---

## 3. Discriminator

The Discriminator receives either:

* A real training sample
* A generated sample

and predicts whether it is real.

$$
D(x) \rightarrow probability(real)
$$

Example:

```text
Real image → Discriminator → 0.94
Fake image → Discriminator → 0.08
```

During training, the Discriminator learns to distinguish real from fake while the Generator learns to produce better fakes.

---

## 4. Adversarial Training

GAN training is a two-player optimization problem:

$$
\min_G \max_D V(D,G)
$$

The original objective is:

$$
\min_G\max_D
E_{x\sim p_{data}}[\log D(x)]
+
E_{z\sim p_z}[\log(1-D(G(z)))]
$$

You do **not** need to memorize the equation initially. Understand the competition:

```text
Generator:
"Make fake samples realistic."

Discriminator:
"Detect fake samples."

Generator improves
      ↓
Discriminator improves
      ↓
Generator improves
      ↓
...
```

Ideally, the Generator eventually produces samples that are difficult to distinguish from real data.

---

## 5. GAN Loss Intuition

For the Discriminator:

* Real → target `1`
* Fake → target `0`

Binary cross-entropy is commonly used.

For example:

```text
Real sample:
D(x) = 0.9
Target = 1

Fake sample:
D(G(z)) = 0.1
Target = 0
```

The Discriminator wants these predictions to become correct.

The Generator has the opposite goal: it wants fake samples to be classified as real.

In practical implementations, the Generator is commonly trained with the **non-saturating loss**:

$$
L_G=-E_z[\log D(G(z))]
$$

---

## 6. Basic PyTorch GAN

A simple Generator:

```python
import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, noise_dim=100):
        super().__init__()

        self.model = nn.Sequential(
            nn.Linear(noise_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 784),
            nn.Tanh()
        )

    def forward(self, z):
        return self.model(z)
```

Simple Discriminator:

```python
class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()

        self.model = nn.Sequential(
            nn.Linear(784, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.model(x)
```

For MNIST:

```text
784 = 28 × 28
```

The Generator creates a flattened image, while the Discriminator evaluates it.

---

## 7. GAN Training Loop

Training alternates between the two networks.

### Step 1 — Train Discriminator

```text
Real images → D → target 1
Fake images → D → target 0
```

Update only `D`.

### Step 2 — Train Generator

```text
Noise → G → fake image → D
                         ↓
                    should be 1
```

Update only `G`.

Conceptually:

```python
# Train discriminator
optimizer_D.zero_grad()

real_pred = D(real)
fake = G(noise).detach()
fake_pred = D(fake)

loss_D = loss_real + loss_fake
loss_D.backward()
optimizer_D.step()


# Train generator
optimizer_G.zero_grad()

fake = G(noise)
prediction = D(fake)

loss_G = criterion(prediction, real_labels)
loss_G.backward()
optimizer_G.step()
```

`detach()` prevents the Generator from being updated during the Discriminator step.

---

## 8. DCGAN

A **DCGAN (Deep Convolutional GAN)** uses convolutional architectures instead of simple fully connected layers.

Typical architecture:

```text
Noise
  ↓
Transpose Convolutions
  ↓
Upsampling
  ↓
Generated Image
```

Discriminator:

```text
Image
  ↓
Convolution Layers
  ↓
Feature Extraction
  ↓
Real/Fake
```

DCGANs became important because convolutional networks work much better for image generation than basic dense networks.

---

## 9. Major GAN Problems

### Mode Collapse

The Generator may produce very similar samples repeatedly.

```text
Expected:
A B C D E F

Generated:
A A A A A A
```

The Generator finds one type of output that successfully fools the Discriminator.

### Training Instability

GANs can be difficult to train because both networks continuously change.

Problems include:

* Discriminator becomes too strong
* Generator receives weak/unstable gradients
* Oscillating losses
* Poor-quality samples
* Mode collapse

Therefore, **GAN loss curves alone do not always tell you whether generation quality is improving**. Generated samples should also be inspected.

---

## 10. WGAN

**Wasserstein GAN (WGAN)** changes the training objective to provide more useful gradients and improve training stability.

High-level idea:

```text
Standard GAN
→ Classification-style real/fake objective

WGAN
→ Measures a smoother distance between distributions
```

You should understand **why WGAN exists** before learning its mathematical details.

---

## 11. GANs vs Autoencoders

| Feature               | Autoencoder         | GAN                       |
| --------------------- | ------------------- | ------------------------- |
| Main goal             | Reconstruction      | Generation                |
| Architecture          | Encoder + Decoder   | Generator + Discriminator |
| Latent representation | Explicit            | Noise input               |
| Training              | Reconstruction loss | Adversarial loss          |
| Typical output        | Reconstructed data  | New synthetic data        |
| Training difficulty   | Usually easier      | Usually harder            |

---

## 12. Practical Project

### MNIST GAN

Build a GAN that generates handwritten digits.

Pipeline:

```text
MNIST
  ↓
Train Discriminator
  ↓
Generate images from random noise
  ↓
Train Generator
  ↓
Save generated samples every epoch
  ↓
Observe improvement
```

Experiment with:

* Noise dimension
* Learning rate
* Batch size
* Generator size
* Discriminator size
* Number of epochs

Save generated images after every few epochs so you can visually compare progress.

---

## 13. Common Mistakes

* Updating both networks during every step
* Forgetting `detach()` for fake samples during D training
* Using incorrect real/fake labels
* Applying `softmax` unnecessarily to a single discriminator output
* Ignoring input normalization
* Judging GAN quality only from loss values
* Making the Discriminator overwhelmingly stronger
* Expecting stable training immediately

---

## 14. Interview Questions

1. What is a GAN?
2. What are Generator and Discriminator?
3. Why are GANs called adversarial?
4. What does the Generator optimize?
5. What does the Discriminator optimize?
6. What is mode collapse?
7. Why are GANs difficult to train?
8. What is DCGAN?
9. Why is `detach()` used while training the Discriminator?
10. What problem does WGAN try to address?

---

## 15. Key Takeaways

* GANs learn to **generate new data**.
* They contain a **Generator and Discriminator**.
* The Generator creates fake samples.
* The Discriminator distinguishes real from fake.
* Training is adversarial.
* DCGANs use convolutional architectures for image generation.
* **Mode collapse and instability** are major challenges.
* WGAN improves the training objective for better stability.

### Next → **14 — Computer Vision with Deep Learning**
