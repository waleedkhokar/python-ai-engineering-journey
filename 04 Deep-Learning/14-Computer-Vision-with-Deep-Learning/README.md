# 14 — Computer Vision with Deep Learning

**Date: 14 June 2026**

## 1. What Is Computer Vision?

**Computer Vision (CV)** is the field of AI that enables computers to understand and work with images and video.

Deep learning has made CV effective because neural networks can automatically learn visual features.

Common applications:

* Image classification
* Object detection
* Image segmentation
* Face recognition
* OCR
* Medical imaging
* Autonomous systems
* Quality inspection

Typical workflow:

```text
Image / Video
     ↓
Preprocessing
     ↓
Deep Learning Model
     ↓
Prediction
     ↓
Post-processing
     ↓
Application
```

---

## 2. Main Computer Vision Tasks

| Task             | Output               | Example              |
| ---------------- | -------------------- | -------------------- |
| Classification   | Class                | Cat / Dog            |
| Object Detection | Class + Bounding Box | Find cars            |
| Segmentation     | Pixel-level labels   | Separate road/person |
| Image Generation | New image            | Synthetic face       |
| OCR              | Text                 | Read document        |

### Classification

The model answers:

> "What is in this image?"

```text
Image → CNN → [Cat: 0.92, Dog: 0.08]
```

One image normally receives one or more class predictions.

### Object Detection

Detection answers:

> "What objects are present and where?"

```text
Image
 ↓
Model
 ↓
[Car, box, confidence]
[Person, box, confidence]
```

### Segmentation

Segmentation assigns labels to individual pixels.

```text
Background → 0
Road       → 1
Car        → 2
Person     → 3
```

---

## 3. Image Preprocessing

Deep learning models usually require consistent input.

Common operations:

* Resize
* Normalize
* Convert image format
* Crop
* Augment
* Convert to tensor

Example:

```python
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])
```

The exact preprocessing should match the model's expected input.

---

## 4. Data Augmentation

Augmentation creates varied training examples from existing images.

Examples:

```text
Original
   ↓
 ┌───────────────┐
 │ Random Crop   │
 │ Flip          │
 │ Rotation      │
 │ Color Change  │
 └───────────────┘
```

Example:

```python
train_transform = transforms.Compose([
    transforms.RandomResizedCrop(224),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])
```

Augmentation can improve generalization, but it must make sense for the problem.

For example, horizontal flipping may be useful for many natural images but could be inappropriate for text recognition.

---

## 5. Transfer Learning for CV

Training a large vision model from zero often requires substantial data and computation.

A common approach is:

```text
Pretrained Model
       ↓
Reuse learned visual features
       ↓
Replace final classifier
       ↓
Train on your dataset
```

For example:

```python
from torchvision.models import resnet18, ResNet18_Weights
import torch.nn as nn

model = resnet18(weights=ResNet18_Weights.DEFAULT)

model.fc = nn.Linear(
    model.fc.in_features,
    5
)
```

Here the model is adapted for **5 classes**.

The detailed transfer-learning strategies were covered in Module 11; here the focus is how they fit into a complete CV workflow.

---

## 6. Training Pipeline

A practical classification pipeline:

```text
Dataset
  ↓
Train / Validation / Test Split
  ↓
Preprocessing + Augmentation
  ↓
Pretrained CNN
  ↓
Training
  ↓
Validation
  ↓
Best Checkpoint
  ↓
Test Evaluation
  ↓
Inference
```

Keep validation and test data separate from training augmentation.

---

## 7. Evaluation Metrics

### Accuracy

$$
Accuracy=\frac{Correct\ Predictions}{Total\ Predictions}
$$

Useful when classes are reasonably balanced.

### Precision

$$
Precision=\frac{TP}{TP+FP}
$$

Of the samples predicted positive, how many were actually positive?

### Recall

$$
Recall=\frac{TP}{TP+FN}
$$

Of the actual positive samples, how many did the model find?

### IoU

**Intersection over Union** is important for detection and segmentation:

$$
IoU=\frac{Area\ of\ Overlap}{Area\ of\ Union}
$$

Example:

```text
Predicted box ∩ Ground-truth box
---------------------------------
Predicted box ∪ Ground-truth box
```

### mAP

**Mean Average Precision (mAP)** is widely used for object detection. It considers both classification confidence and localization quality across predictions/classes.

---

## 8. Classification vs Detection vs Segmentation

| Task           | Main Question                | Output          |
| -------------- | ---------------------------- | --------------- |
| Classification | What is it?                  | Class           |
| Detection      | What and where?              | Boxes + classes |
| Segmentation   | Which pixels belong to what? | Pixel masks     |

Example: analyzing a road image:

```text
Classification → "Road scene"

Detection → Car + Person + Traffic light

Segmentation → Road pixels + Car pixels + Person pixels
```

---

## 9. Video Understanding

Video is essentially a sequence of frames:

```text
Frame 1 → Frame 2 → Frame 3 → ...
```

A practical video pipeline can be:

```text
Video
 ↓
Extract Frames
 ↓
Preprocess
 ↓
Vision Model
 ↓
Predictions
 ↓
Track / Aggregate Results
```

For more advanced temporal understanding, CNN features can be combined with sequence models or Transformer-based architectures.

---

## 10. Common CV Problems

### Class Imbalance

Example:

```text
Normal images: 9,500
Defective images: 500
```

Accuracy alone could hide poor minority-class performance.

Possible solutions:

* Better data collection
* Augmentation
* Class weighting
* Balanced sampling
* Appropriate metrics

### Data Leakage

Never allow nearly identical images from the same source to appear across training and test sets.

### Wrong Preprocessing

Using preprocessing different from what the pretrained model expects can significantly reduce performance.

### Overfitting

Watch training and validation metrics:

```text
Training accuracy ↑
Validation accuracy → / ↓
```

This can indicate overfitting.

---

## 11. Practical Project

### Image Classification

Build a classifier for **cats vs dogs** or another small custom dataset.

Tasks:

1. Collect and clean images.
2. Create train/validation/test splits.
3. Apply augmentation.
4. Use a pretrained ResNet.
5. Replace the classifier.
6. Train and save the best checkpoint.
7. Evaluate using accuracy, precision, recall, and confusion matrix.
8. Build an inference script.
9. Test it on completely unseen images.

Then extend the project to **multi-class classification**.

---

## 12. Interview Questions

1. What is computer vision?
2. Classification vs detection vs segmentation?
3. What is data augmentation?
4. Why use transfer learning?
5. What is IoU?
6. What is mAP?
7. Why isn't accuracy always sufficient?
8. What causes overfitting in CV?
9. What is data leakage?
10. How would you deploy an image classification model?

---

## 13. Key Takeaways

* Computer Vision allows models to understand images and video.
* **Classification** predicts what is present.
* **Detection** predicts what and where.
* **Segmentation** works at pixel level.
* Preprocessing and augmentation strongly affect model performance.
* Transfer learning is commonly used with pretrained vision models.
* Use metrics appropriate to the task and dataset.
* A production CV system includes much more than the neural network: **data → preprocessing → model → evaluation → inference → deployment**.
