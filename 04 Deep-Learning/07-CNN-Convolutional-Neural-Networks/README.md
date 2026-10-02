# 07 — CNN: Convolutional Neural Networks

**Date:** 07 June 2026
**Stage:** Deep Learning
**Module:** Convolutional Neural Networks (CNNs)
**Framework:** PyTorch

---

## 1. What You Will Learn

By the end of this module, you should understand:

* Why CNNs are useful for images
* Image tensors and channels
* Convolution
* Kernels / filters
* Feature maps
* Stride
* Padding
* Convolution output size
* Receptive fields
* Pooling
* CNN architecture
* Parameter counting
* `nn.Conv2d`
* `nn.MaxPool2d`
* Building a CNN in PyTorch
* Training an image classifier
* Common CNN mistakes
* CNN limitations

---

# 2. What Is a CNN?

A **Convolutional Neural Network (CNN)** is a neural network architecture designed especially for data with spatial structure, particularly images.

Instead of treating every pixel independently, CNNs learn local patterns such as:

```text
Edges
 ↓
Textures
 ↓
Shapes
 ↓
Objects
```

A typical CNN:

```text
Image
 ↓
Convolution
 ↓
Activation
 ↓
Pooling
 ↓
Convolution
 ↓
Activation
 ↓
Pooling
 ↓
Classifier
 ↓
Prediction
```

---

# 3. Why Not Use a Normal Dense Network?

Suppose an RGB image is:

```text
224 × 224 × 3
```

Number of pixels/features:

$$
224\times224\times3=150,528
$$

If we flatten this and connect it to a dense layer with 1,000 neurons:

$$
150,528\times1,000
$$

That is over **150 million weights** in just one layer.

CNNs use local connections and shared filters, dramatically reducing parameters while preserving spatial structure.

---

# 4. Image as a Tensor

A color image usually contains three channels:

```text
Red
Green
Blue
```

For PyTorch, a batch of RGB images commonly has:

$$
[N,C,H,W]
$$

where:

```text
N = batch size
C = channels
H = height
W = width
```

Example:

```text
[32, 3, 224, 224]
```

means:

```text
32 images
3 channels
224 height
224 width
```

---

# 5. Grayscale vs RGB

Grayscale:

```text
[1, H, W]
```

RGB:

```text
[3, H, W]
```

A batch:

```text
Grayscale → [N, 1, H, W]
RGB       → [N, 3, H, W]
```

This tensor ordering is important when working with PyTorch CNNs.

---

# 6. What Is Convolution?

A convolution applies a small matrix called a **kernel** or **filter** across an input.

Example kernel:

$$
\begin{bmatrix}
1&0&-1\\
1&0&-1\\
1&0&-1
\end{bmatrix}
$$

The kernel moves across the image and performs multiplication and addition.

The result is a **feature map**.

---

# 7. Simple Convolution Example

Input:

$$
\begin{bmatrix}
1&2&3\\
4&5&6\\
7&8&9
\end{bmatrix}
$$

Kernel:

$$
\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}
$$

Take the top-left 2×2 region:

$$
\begin{bmatrix}
1&2\\
4&5
\end{bmatrix}
$$

Multiply element-by-element:

$$
(1)(1)+(2)(0)+(4)(0)+(5)(1)
$$

$$
=1+5
$$

$$
=6
$$

The kernel then moves to another position and repeats the operation.

---

# 8. What Does a Filter Learn?

During training, the filter's values are learned.

Early CNN layers may learn patterns resembling:

```text
Edges
Corners
Simple textures
```

Deeper layers can combine these into:

```text
Shapes
Parts
Objects
```

The network learns useful filters automatically rather than requiring us to manually define them.

---

# 9. Feature Map

The output created by applying a filter is called a **feature map**.

Conceptually:

```text
Image
 ↓
Filter 1 → Edge feature map
Filter 2 → Texture feature map
Filter 3 → Shape feature map
```

Multiple filters produce multiple output channels.

---

# 10. Channels in Convolution

Suppose an input is:

```text
3 channels
```

and the convolution has:

```text
64 filters
```

The output will have:

```text
64 channels
```

Example:

```python id="y9d4tv"
nn.Conv2d(
    in_channels=3,
    out_channels=64,
    kernel_size=3
)
```

Input:

```text
[N, 3, H, W]
```

Output:

```text
[N, 64, H_out, W_out]
```

---

# 11. Kernel Size

Common kernel sizes include:

```text
3 × 3
5 × 5
7 × 7
```

A 3×3 kernel looks at a small local region.

Smaller kernels are commonly stacked to build increasingly large receptive fields while keeping parameter counts manageable.

---

# 12. Stride

**Stride** controls how far the kernel moves after each operation.

### Stride 1

```text
Move one pixel
```

### Stride 2

```text
Move two pixels
```

Larger stride usually reduces the spatial dimensions.

PyTorch:

```python id="w3q4kh"
nn.Conv2d(
    3,
    32,
    kernel_size=3,
    stride=2
)
```

---

# 13. Padding

Padding adds values around the image border.

For example:

```text
Original
 ↓
Add border
 ↓
Convolution
```

Padding helps control the output size and allows border pixels to participate more fully in convolution.

Common choice:

```python id="pgp9g5"
padding=1
```

with:

```text
kernel_size=3
stride=1
```

which preserves height and width.

---

# 14. Convolution Output Size

For one spatial dimension:

$$
H_{out}
=
\left\lfloor
\frac{
H+2P-D(K-1)-1
}{S}
+1
\right\rfloor
$$

where:

```text
H = input size
P = padding
D = dilation
K = kernel size
S = stride
```

For normal convolution with:

```text
D = 1
```

this becomes:

$$
H_{out}
=
\left\lfloor
\frac{H+2P-K}{S}
+1
\right\rfloor
$$

The same calculation applies to width.

---

# 15. Output Size Example

Input:

```text
H = 32
```

Kernel:

```text
K = 3
```

Padding:

```text
P = 1
```

Stride:

```text
S = 1
```

Then:

$$
H_{out}
=
\frac{32+2(1)-3}{1}+1
$$

$$
=32
$$

Therefore:

```text
32 × 32
```

remains:

```text
32 × 32
```

---

# 16. Downsampling With Stride

Input:

```text
32 × 32
```

Use:

```text
kernel = 3
padding = 1
stride = 2
```

Then:

$$
H_{out}
=
\left\lfloor
\frac{32+2-3}{2}+1
\right\rfloor
$$

$$
=16
$$

So:

```text
32 × 32
↓
16 × 16
```

The spatial resolution decreases.

---

# 17. Parameter Count

For a convolution layer:

$$
Parameters=
C_{out}
\times
C_{in}
\times
K_h
\times
K_w
+
C_{out}
$$

The final term represents one bias for each output channel when bias is enabled.

Example:

```text
in_channels = 3
out_channels = 16
kernel = 3 × 3
```

Parameters:

$$
16\times3\times3\times3+16
$$

$$
=432+16
$$

$$
=448
$$

Only 448 parameters.

This is dramatically smaller than connecting every pixel to every neuron.

---

# 18. Local Connectivity

A convolution filter does not initially connect to every pixel.

It looks at a local region.

Example:

```text
Image
┌──────────────┐
│              │
│   ┌──────┐   │
│   │Kernel│   │
│   └──────┘   │
│              │
└──────────────┘
```

The same filter then moves across the image.

This is called **local connectivity**.

---

# 19. Parameter Sharing

The same kernel weights are reused at different positions.

For example:

```text
Position 1 → same filter
Position 2 → same filter
Position 3 → same filter
```

This is called **parameter sharing**.

It allows the network to detect the same pattern regardless of where it appears.

For example, an edge detector can detect an edge on the:

```text
left
center
right
```

of an image.

---

# 20. Receptive Field

A neuron's **receptive field** is the region of the original input that can influence it.

As convolutional layers are stacked:

```text
Layer 1
↓
small receptive field

Layer 2
↓
larger receptive field

Layer 3
↓
even larger receptive field
```

Therefore deeper neurons can use information from larger portions of the image.

---

# 21. Pooling

Pooling reduces spatial dimensions.

Common pooling operation:

**Max Pooling**

Example:

$$
\begin{bmatrix}
1&5\\
3&2
\end{bmatrix}
$$

Maximum:

$$
5
$$

PyTorch:

```python id="eqt6sq"
nn.MaxPool2d(kernel_size=2)
```

---

# 22. Why Use Pooling?

Pooling can:

* reduce spatial dimensions
* reduce computation
* increase effective receptive field
* provide some tolerance to small spatial changes

Example:

```text
64 × 64
 ↓
32 × 32
 ↓
16 × 16
```

---

# 23. Max Pooling vs Average Pooling

### Max Pooling

Takes the maximum value.

```text
[1, 5]
[3, 2]

→ 5
```

### Average Pooling

Takes the average.

$$
\frac{1+5+3+2}{4}=2.75
$$

PyTorch:

```python id="u7my03"
nn.MaxPool2d(2)
```

or:

```python id="wq7h0a"
nn.AvgPool2d(2)
```

---

# 24. Typical CNN Architecture

A basic CNN might look like:

```text
Input Image
     ↓
Conv2D
     ↓
ReLU
     ↓
MaxPool
     ↓
Conv2D
     ↓
ReLU
     ↓
MaxPool
     ↓
Flatten
     ↓
Linear
     ↓
Output
```

Early layers learn simple visual patterns.

Later layers learn more complex representations.

---

# 25. CNN in PyTorch

```python id="x4s4i4"
import torch.nn as nn

model = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),

    nn.Conv2d(32, 64, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),

    nn.Flatten(),
    nn.Linear(64 * 56 * 56, 10)
)
```

This assumes the input image is:

```text
3 × 224 × 224
```

because two 2×2 pooling layers reduce:

```text
224 → 112 → 56
```

---

# 26. CNN Forward Shape

For:

```text
Input
[32, 3, 224, 224]
```

After first convolution:

```text
[32, 32, 224, 224]
```

After first pooling:

```text
[32, 32, 112, 112]
```

After second convolution:

```text
[32, 64, 112, 112]
```

After second pooling:

```text
[32, 64, 56, 56]
```

After flatten:

$$
64\times56\times56=200,704
$$

So the classifier receives 200,704 features per image.

---

# 27. Better Practice: Avoid Hardcoding Shapes

Instead of guessing the flattened dimension, you can:

* calculate it from the architecture
* inspect tensor shapes
* use adaptive pooling

Example:

```python id="0pj4ul"
nn.AdaptiveAvgPool2d((1, 1))
```

Then:

```text
[N, 64, H, W]
↓
[N, 64, 1, 1]
```

This makes architectures more flexible.

---

# 28. A Practical CNN

```python id="a0iv3z"
class CNN(nn.Module):

    def __init__(self, num_classes=10):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )

        self.classifier = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)
```

This is a compact and reusable CNN architecture.

---

# 29. CNN Training

The training process remains the same:

```text
Image
 ↓
CNN
 ↓
Logits
 ↓
CrossEntropyLoss
 ↓
Backward
 ↓
Optimizer
```

Example:

```python id="r7t5m3"
loss_fn = nn.CrossEntropyLoss()

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=0.001
)
```

The CNN itself does not change the fundamental training process learned earlier.

---

# 30. CNN Classification Example

Suppose we classify:

```text
0 → Cat
1 → Dog
2 → Horse
```

The final layer produces:

```text
[2.4, 0.7, -0.2]
```

These are logits.

The largest value is:

```text
2.4
```

so the predicted class is:

```text
Cat
```

During training:

```python id="4w1vvi"
loss = nn.CrossEntropyLoss()(logits, labels)
```

---

# 31. Common CNN Mistakes

### 1. Wrong tensor order

PyTorch expects:

```text
[N, C, H, W]
```

not:

```text
[N, H, W, C]
```

---

### 2. Wrong input channels

RGB:

```text
in_channels = 3
```

Grayscale:

```text
in_channels = 1
```

---

### 3. Incorrect flattened size

The spatial dimensions change after convolution and pooling.

Always calculate or inspect the output shape.

---

### 4. Applying Softmax before CrossEntropyLoss

Use:

```python id="kq9fpy"
loss = nn.CrossEntropyLoss()(logits, labels)
```

and let `CrossEntropyLoss` handle the appropriate internal transformation.

---

# 32. CNN Limitations

CNNs are powerful, but they are not perfect.

Challenges include:

* require significant labeled data for some tasks
* computational cost can be high
* architecture design matters
* standard convolutions primarily capture local spatial patterns
* long-range relationships can require deeper architectures or other mechanisms

Modern vision systems may combine CNNs with attention or use Transformer-based architectures.

---

# 33. CNN vs Fully Connected Network

| Feature                               | Fully Connected  | CNN       |
| ------------------------------------- | ---------------- | --------- |
| Spatial structure                     | Poorly preserved | Preserved |
| Local patterns                        | Not specialized  | Excellent |
| Parameter efficiency for images       | Low              | Higher    |
| Image applications                    | Possible         | Common    |
| Weight sharing                        | No               | Yes       |
| Translation-related pattern detection | Less natural     | Strong    |

---

# 34. Practical Experiment

Take a small image dataset such as:

```text
CIFAR-10
```

Build a CNN with:

```text
Conv2d
ReLU
MaxPool
Conv2d
ReLU
MaxPool
Linear
```

Track:

```text
Training loss
Validation loss
Training accuracy
Validation accuracy
```

Then experiment with:

```text
kernel size
number of filters
learning rate
dropout
weight decay
```

Observe how the architecture changes performance and training behavior.

---

# 35. Interview Questions

1. What is a CNN?
2. Why are CNNs useful for images?
3. What is convolution?
4. What is a kernel?
5. What is a feature map?
6. What is stride?
7. What is padding?
8. How do you calculate convolution output size?
9. What is parameter sharing?
10. What is local connectivity?
11. What is a receptive field?
12. What is pooling?
13. Max pooling vs average pooling?
14. Why do CNNs use multiple filters?
15. How do CNN parameters get learned?
16. What is the shape of a PyTorch image batch?
17. How do you calculate Conv2d parameters?
18. Why does spatial size decrease?
19. Why use adaptive pooling?
20. CNN vs fully connected network?

---

# 36. Knowledge Check

You should be able to:

* [ ] Explain why CNNs are useful
* [ ] Understand image tensor shapes
* [ ] Explain convolution
* [ ] Perform a simple convolution manually
* [ ] Explain kernels
* [ ] Explain feature maps
* [ ] Explain channels
* [ ] Explain stride
* [ ] Explain padding
* [ ] Calculate output dimensions
* [ ] Calculate convolution parameters
* [ ] Explain receptive fields
* [ ] Explain pooling
* [ ] Build a CNN with PyTorch
* [ ] Train an image classifier
* [ ] Debug tensor-shape problems
* [ ] Explain CNN limitations

---

# 37. Key Takeaways

The main CNN idea is:

```text
Image
 ↓
Local filters
 ↓
Feature maps
 ↓
Learn visual patterns
 ↓
Combine simple patterns
 ↓
Recognize complex objects
```

Three concepts are especially important:

### 1. Local connectivity

A filter examines a local region.

### 2. Parameter sharing

The same filter is reused across the image.

### 3. Hierarchical features

```text
Edges
 ↓
Textures
 ↓
Shapes
 ↓
Object parts
 ↓
Objects
```

A CNN therefore provides a natural way to learn spatial features from images without flattening the entire image into one huge dense layer.