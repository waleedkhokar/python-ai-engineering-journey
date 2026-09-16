# 🐾 Animal Image Classification System

## Project Overview

This project is a Deep Learning based **Animal Image Classification System**.

The main goal of this project was to build a model that can take an animal image as input and classify it into one of 10 predefined animal categories.

The final system follows this general process:

Image
↓
Image Preprocessing
↓
CNN-Based Deep Learning Model
↓
Transfer Learning with ResNet18
↓
Feature Extraction
↓
Classification Layer
↓
Animal Prediction
↓
Confidence Score

The final model is capable of recognizing the following 10 animal classes:

1. Dog
2. Horse
3. Elephant
4. Butterfly
5. Chicken
6. Cat
7. Cow
8. Sheep
9. Spider
10. Squirrel

The project focuses only on the **Deep Learning model**. No frontend, backend, FastAPI, Next.js, or deployment layer was added because the objective was to understand and build the machine learning/deep learning model itself.


# 1. Project Objective

The objective of this project was to move from traditional Machine Learning into practical Deep Learning.

In the previous SMS Spam Detection project, text data was converted into numerical features using TF-IDF and then classified using traditional Machine Learning algorithms such as Logistic Regression and Naive Bayes.

This project is different because the input is an image.

Images contain pixels rather than simple numerical or text features. Therefore, a neural network is required to automatically learn useful visual patterns such as:

- Edges
- Shapes
- Textures
- Colors
- Patterns
- Body structures
- Facial features
- Object parts

The main objective was therefore to build a multi-class image classification model using a CNN architecture and improve its performance using Transfer Learning.


# 2. Dataset

The dataset used in this project is an animal image dataset containing approximately 26,000 images.

The local dataset contains:

- 26,179 total images
- 10 animal classes
- JPEG and PNG images
- Different image dimensions
- Different image aspect ratios

The dataset contains the following classes:

| Class | Number of Images |
|---|---:|
| Dog | 4,863 |
| Horse | 2,623 |
| Elephant | 1,446 |
| Butterfly | 2,112 |
| Chicken | 3,098 |
| Cat | 1,668 |
| Cow | 1,866 |
| Sheep | 1,820 |
| Spider | 4,821 |
| Squirrel | 1,862 |
| **Total** | **26,179** |

The dataset is not perfectly balanced because some classes contain significantly more images than others.

For example, Dog and Spider contain more than 4,800 images, while Elephant contains approximately 1,400 images.

This class imbalance is important because a model can sometimes perform better on classes with more training examples.


# 3. Dataset Folder Structure

The original dataset uses Italian folder names.

The folders were mapped to English animal names using a class mapping dictionary.

The original folders were:

cane
cavallo
elefante
farfalla
gallina
gatto
mucca
pecora
ragno
scoiattolo

They were mapped as follows:

| Original Folder | Final Class |
|---|---|
| cane | dog |
| cavallo | horse |
| elefante | elephant |
| farfalla | butterfly |
| gallina | chicken |
| gatto | cat |
| mucca | cow |
| pecora | sheep |
| ragno | spider |
| scoiattolo | squirrel |

This mapping allowed the model predictions to use readable English class names.


# 4. Dataset Verification

Before training the model, the dataset was inspected carefully.

The purpose of this step was to make sure that the data was usable before spending computational time on model training.

The following checks were performed:

- Dataset folders were verified.
- Number of classes was verified.
- Number of images in every class was counted.
- Total number of images was calculated.
- Random images from every class were visually inspected.
- Image dimensions were inspected.
- Image formats were inspected.
- Corrupted images were checked.


# 5. Visual Inspection

Random images from each animal class were displayed and inspected.

This was important because simply having image files does not guarantee that the dataset is correct.

Visual inspection confirmed that the images actually represented the expected animal classes.

For example:

Dog → dog images

Cat → cat images

Horse → horse images

Elephant → elephant images

and so on.

This helped verify that the dataset structure and class mapping were correct before training.


# 6. Image Dimensions and Formats

The dataset contains images with different dimensions.

Examples included:

300 × 225
225 × 300
300 × 200
300 × 300

This means that the dataset does not have a single standardized image size.

Deep Learning models require batches of images with the same dimensions.

Therefore, the images needed to be transformed into a standard size before being passed to the neural network.

The final model uses:

224 × 224 pixels

This is also the standard input size commonly used with pretrained ImageNet models such as ResNet18.


# 7. Corrupted Image Detection

Every image in the dataset was checked to make sure it could be opened successfully.

The result was:

Corrupted Images: 0

This means that all 26,179 images passed the validation check.

This step is important because corrupted files can cause training to stop unexpectedly during a DataLoader iteration.


# 8. Train, Validation, and Test Split

The complete dataset was divided into three separate sets.

The split used was:

- 70% Training
- 15% Validation
- 15% Testing

The actual number of images was:

| Dataset | Images |
|---|---:|
| Training | 18,325 |
| Validation | 3,927 |
| Testing | 3,927 |
| **Total** | **26,179** |

The split was performed using stratification.

Stratification ensures that the class distribution remains approximately similar across the training, validation, and test datasets.

This is important because the original dataset is not perfectly balanced.


# 9. Why We Need Three Datasets

## Training Set

The training dataset is used to teach the model.

The model sees these images and updates its learnable parameters based on the prediction errors.

## Validation Set

The validation dataset is used during model development.

It helps us determine how well the model performs on images that were not used for updating the model parameters.

Validation performance can help us identify problems such as overfitting.

## Test Set

The test dataset is used for the final evaluation.

These images are kept separate from training.

The final test accuracy gives us a better estimate of how well the trained model generalizes to completely unseen images.


# 10. Image Preprocessing

The images were transformed before being passed to ResNet18.

For training images, the following transformations were used:

- Resize
- Random Resized Crop
- Random Horizontal Flip
- Random Rotation
- Conversion to Tensor
- ImageNet Normalization

For validation and testing images, deterministic transformations were used:

- Resize
- Center Crop
- Conversion to Tensor
- ImageNet Normalization

Training uses random transformations because they help the model see slightly different versions of images.

This is called **Data Augmentation**.

Data augmentation can improve generalization because the model does not simply memorize one exact version of every training image.


# 11. Why ImageNet Normalization Was Used

The final model uses a pretrained ResNet18 model.

ResNet18 was originally trained on ImageNet.

Therefore, the input images are normalized using the ImageNet mean and standard deviation:

Mean:

[0.485, 0.456, 0.406]

Standard Deviation:

[0.229, 0.224, 0.225]

Using the expected normalization makes the input distribution more compatible with the pretrained network.


# 12. Custom PyTorch Dataset

A custom PyTorch Dataset class was created.

The purpose of the custom Dataset was to:

1. Store image paths.
2. Store their corresponding labels.
3. Open an image when requested.
4. Convert the image to RGB.
5. Convert the animal name into a numerical class index.
6. Apply image transformations.
7. Return the processed image and label.

The model cannot directly understand labels such as:

"dog"

"cat"

"horse"

Therefore, the classes were converted into numerical values.

The final mapping was:

Dog → 0

Horse → 1

Elephant → 2

Butterfly → 3

Chicken → 4

Cat → 5

Cow → 6

Sheep → 7

Spider → 8

Squirrel → 9


# 13. DataLoader

PyTorch DataLoader was used to efficiently provide images to the model in batches.

The batch size used was:

32

Therefore, instead of sending one image at a time to the model, the model processes approximately 32 images at once.

The resulting number of batches was:

Training batches: 573

Validation batches: 123

Testing batches: 123

Batch processing makes training more efficient and is standard practice when working with neural networks.


# 14. CNN Baseline Model

Before using Transfer Learning, a custom CNN model was created as a baseline.

The purpose of the baseline was to understand how a CNN performs when it has to learn visual features from the dataset itself.

The custom CNN contained three convolution blocks.

The architecture was approximately:

Input Image
↓
Conv2D
↓
ReLU
↓
Max Pooling
↓
Conv2D
↓
ReLU
↓
Max Pooling
↓
Conv2D
↓
ReLU
↓
Max Pooling
↓
Adaptive Average Pooling
↓
Flatten
↓
Fully Connected Layer
↓
10 Class Predictions


# 15. Custom CNN Results

The custom CNN was trained for 5 epochs.

The training results were:

| Epoch | Training Loss | Training Accuracy |
|---|---:|---:|
| 1 | 2.1473 | 20.95% |
| 2 | 1.9944 | 28.05% |
| 3 | 1.8578 | 34.23% |
| 4 | 1.7476 | 38.48% |
| 5 | 1.6839 | 40.58% |

The final training accuracy was approximately:

40.58%

The model was learning, but its performance was not strong enough for our final system.

Training was also computationally expensive on the available hardware.

Each epoch took approximately 35 minutes.

Therefore, training the custom CNN for 5 epochs took around 3 hours.

This demonstrated an important practical Deep Learning lesson:

A CNN trained from scratch may require significant computational resources and a large amount of training time.


# 16. Why We Changed the Approach

Instead of continuing to train the custom CNN for many more hours, we changed the strategy.

The better approach for this project was:

**Transfer Learning**

Transfer Learning allows us to use knowledge learned by a neural network from a large existing dataset.

Instead of learning every visual feature from zero, the pretrained model already understands many general image features.

The model can then be adapted to our specific animal classification task.

This provides two major advantages:

1. Much faster training.
2. Much better performance with relatively little training.


# 17. Transfer Learning

For the final model, we used:

**ResNet18**

ResNet18 is a Convolutional Neural Network architecture.

The original ResNet18 model was pretrained on ImageNet.

The pretrained network already contains useful visual feature representations.

These features can include general concepts such as:

- Edges
- Curves
- Textures
- Shapes
- Patterns
- Object structures

Instead of throwing away this knowledge, we reused it for our animal classification task.


# 18. ResNet18

The ResNet18 architecture contains many convolutional layers and uses residual connections.

Residual connections help deep neural networks learn effectively by allowing information and gradients to pass through the network more easily.

For this project, the pretrained ResNet18 model was loaded using Torchvision.

The pretrained weights were downloaded and loaded successfully.


# 19. Freezing the Pretrained Layers

Initially, all pretrained ResNet18 parameters were frozen.

This means:

requires_grad = False

for the existing pretrained parameters.

Therefore, the original ResNet18 feature extractor was not modified during the first transfer-learning training stage.

Only the newly created classification layer was trained.

This greatly reduced the number of trainable parameters.


# 20. Replacing the Final Layer

The original ResNet18 model was designed for ImageNet classification.

ImageNet contains 1000 classes.

Our project only has 10 classes.

Therefore, the original final classification layer was replaced.

The new layer was:

Linear → 10 outputs

Each output corresponds to one animal class.

The model therefore produces 10 numerical scores for every input image.

These scores are then converted into probabilities using Softmax.


# 21. Trainable Parameters

After freezing the pretrained layers and replacing the final classification layer, the number of trainable parameters was:

5,130

This is extremely small compared with training the entire ResNet18 network.

This is one of the reasons the transfer-learning approach was much faster.


# 22. Loss Function

The project uses:

CrossEntropyLoss

This is a standard loss function for multi-class classification.

The model produces a score for each of the 10 animal classes.

CrossEntropyLoss compares those predictions with the correct class and produces a loss value.

During training, the optimizer attempts to minimize this loss.

In simple terms:

Correct prediction → lower loss

Incorrect prediction → higher loss


# 23. Optimizer

The optimizer used was:

Adam

Learning rate:

0.001

The optimizer updates the trainable parameters of the final classification layer based on the gradients calculated during backpropagation.


# 24. Training Process

The final transfer-learning model was trained for only:

2 epochs

This was intentional.

The goal was not to train for many hours unnecessarily.

The pretrained ResNet18 already contained useful visual knowledge.

Therefore, only a small amount of training was required to adapt the final classification layer to our 10 animal classes.


# 25. Transfer Learning Training Results

The training results were:

| Epoch | Train Loss | Train Accuracy | Validation Accuracy |
|---|---:|---:|---:|
| 1 | 0.6817 | 79.77% | 94.55% |
| 2 | 0.4697 | 84.69% | 95.24% |

The best validation accuracy was:

**95.24%**

This was a major improvement compared with the custom CNN baseline.


# 26. CNN vs Transfer Learning

The difference between the two approaches was significant.

### Custom CNN

Training Accuracy after 5 epochs:

40.58%

### Transfer Learning

Validation Accuracy after only 2 epochs:

95.24%

This demonstrates why Transfer Learning is extremely useful in practical Deep Learning projects.

Instead of spending several hours training a CNN from scratch, we reused a pretrained model that had already learned useful visual representations.


# 27. Final Test Evaluation

After training, the best validation model was restored.

The model was then evaluated on the completely unseen test dataset.

The test dataset contained:

3,927 images

The final test accuracy was:

**94.27%**

This is the main final performance metric of the project.

It means that the model correctly classified approximately 94 out of every 100 test images.


# 28. Why Test Accuracy Is Important

We should not judge a model only from training accuracy.

Training accuracy tells us how well the model performs on images used during training.

Validation accuracy tells us how well it performs during model development on unseen validation images.

Test accuracy is used for the final evaluation on a separate dataset.

Our final result was:

Training Accuracy: 84.69%

Best Validation Accuracy: 95.24%

Final Test Accuracy: 94.27%

The small difference between validation and test performance indicates that the model generalizes well to unseen images from the same dataset.


# 29. Classification Report

The final model was evaluated using precision, recall, and F1-score for every animal class.

The results were:

| Animal | Precision | Recall | F1-Score |
|---|---:|---:|---:|
| Dog | 0.97 | 0.94 | 0.95 |
| Horse | 0.91 | 0.93 | 0.92 |
| Elephant | 0.94 | 0.97 | 0.96 |
| Butterfly | 0.90 | 0.99 | 0.94 |
| Chicken | 0.95 | 0.97 | 0.96 |
| Cat | 0.95 | 0.94 | 0.95 |
| Cow | 0.88 | 0.83 | 0.86 |
| Sheep | 0.90 | 0.89 | 0.90 |
| Spider | 0.98 | 0.97 | 0.97 |
| Squirrel | 0.98 | 0.95 | 0.96 |

Overall:

Accuracy: 94.27%

Macro F1-score: approximately 0.94

Weighted F1-score: approximately 0.94


# 30. Class-Level Performance

The model performed particularly well on:

- Spider
- Elephant
- Chicken
- Squirrel
- Dog
- Cat

Spider achieved an F1-score of approximately 0.97.

Elephant, Chicken, and Squirrel achieved approximately 0.96 F1-score.

Dog and Cat achieved approximately 0.95 F1-score.

The weakest class was Cow, with an F1-score of approximately 0.86.

This does not necessarily mean that the model is bad at recognizing cows.

It indicates that cow images were more difficult for the model compared with some of the other classes.


# 31. Confusion Matrix

A confusion matrix was generated to analyze the predictions in more detail.

The confusion matrix contains:

- Actual classes on one axis.
- Predicted classes on the other axis.

The diagonal represents correct predictions.

For example, if an actual Dog image is predicted as Dog, that prediction appears on the Dog/Dog position of the matrix.

Values outside the diagonal represent misclassifications.

This allows us to identify which animal classes the model confuses with each other.

This is more informative than looking at accuracy alone because it helps us understand the model's specific weaknesses.


# 32. Error Analysis

Error analysis is an important part of a real Machine Learning project.

A model with 94.27% accuracy does not mean that every image will be classified correctly.

Some images may be difficult because of:

- Poor image quality
- Unusual camera angles
- Similar animal appearances
- Multiple animals in one image
- Occlusion
- Background similarity
- Unusual poses
- Very small animals
- Cropped images
- Dataset noise

For example, some animal categories can have visually similar shapes or appearances.

The confusion matrix and classification report help identify these difficult categories.


# 33. Model Prediction Concept

The final model receives an image as input.

For example:

my_dog.jpg

The image goes through the same preprocessing pipeline used during testing.

The processed image is then passed through ResNet18.

The model produces 10 output scores.

Softmax converts these scores into probabilities.

The class with the highest probability becomes the predicted class.

For example:

Animal: Dog

Confidence: 97.4%

The confidence value represents the model's predicted probability for the selected class.

It should not be interpreted as a guarantee that the prediction is correct.


# 34. Final Prediction Pipeline

The complete prediction process is:

User Image
↓
Open Image
↓
Convert to RGB
↓
Resize
↓
Center Crop
↓
Convert to Tensor
↓
ImageNet Normalization
↓
Add Batch Dimension
↓
ResNet18
↓
10 Class Scores
↓
Softmax
↓
Highest Probability
↓
Animal Name + Confidence


# 35. Important Deep Learning Concepts Learned

This project provided practical experience with several important Deep Learning concepts.

### CNN

Convolutional Neural Networks are designed to work effectively with image data.

### Convolution

Convolutional layers learn visual features from images.

### Pooling

Pooling reduces spatial dimensions and helps create more compact feature representations.

### Activation Functions

ReLU introduces non-linearity into the neural network.

### Classification

The model predicts one class from 10 possible animal classes.

### Cross Entropy Loss

Used to measure the difference between predicted classes and actual classes.

### Backpropagation

Used to calculate gradients and update trainable parameters.

### Adam Optimizer

Used to update model parameters during training.

### Data Augmentation

Used to create variation in training images and improve generalization.

### Train/Validation/Test Split

Used to separate training, model development, and final evaluation.

### Transfer Learning

Used to reuse knowledge learned by a pretrained neural network.

### Fine-Grained Evaluation

Precision, recall, F1-score, and confusion matrices were used to analyze performance.


# 36. Most Important Practical Lesson

One of the biggest lessons from this project was that building a larger neural network from scratch is not always the best practical approach.

The custom CNN required approximately 3 hours of training and reached only around 40.58% training accuracy after 5 epochs.

The pretrained ResNet18 achieved:

95.24% validation accuracy

and

94.27% test accuracy

after only 2 training epochs.

This demonstrates the practical value of Transfer Learning.

In real-world Machine Learning and Deep Learning projects, pretrained models can save significant time and computational resources while providing strong performance.


# 37. Final Model

The final model used in this project is:

**ResNet18 + Transfer Learning**

Configuration:

- Architecture: ResNet18
- Pretrained: Yes
- Pretrained dataset: ImageNet
- Number of classes: 10
- Input size: 224 × 224
- Batch size: 32
- Optimizer: Adam
- Learning rate: 0.001
- Loss: CrossEntropyLoss
- Training epochs: 2
- Best validation accuracy: 95.24%
- Test accuracy: 94.27%


# 38. Final Result

The final Animal Image Classification System successfully learned to classify images into 10 different animal categories.

The final model achieved:

**94.27% Test Accuracy**

on 3,927 completely unseen test images.

The project therefore successfully demonstrates a practical Deep Learning workflow from raw image data to a trained and evaluated CNN-based classifier.


# 39. Limitations

Although the model achieved strong test performance, it has limitations.

The model is trained only on the 10 animal categories contained in the dataset.

Therefore, it should not be expected to correctly identify every possible animal in the world.

For example, an image of a lion, tiger, bear, rabbit, or giraffe is outside the model's training classes.

The model will still be forced to choose one of its 10 known classes if it is given an unknown animal.

Therefore, the model's confidence should not be interpreted as proof that the image actually belongs to one of the supported classes.

Another limitation is that test accuracy is measured on images from the same overall dataset distribution.

Real-world images may have different:

- Backgrounds
- Lighting
- Camera quality
- Image resolutions
- Animal poses
- Viewing angles
- Occlusions

Therefore, real-world performance can be lower than the reported test accuracy.


# 40. Future Improvements

If more computational resources were available, the model could potentially be improved using:

- Fine-tuning deeper ResNet layers
- Larger pretrained architectures
- Better data augmentation
- Class-balanced sampling
- Learning-rate scheduling
- More training epochs
- Hyperparameter tuning
- More diverse datasets
- Additional animal classes
- Real-world image evaluation

However, these improvements were intentionally not added because the current model already achieved strong performance with significantly less training time.


# 41. Final Project Architecture

The complete model architecture can be summarized as:

Raw Animal Dataset
        ↓
Dataset Verification
        ↓
Train / Validation / Test Split
        ↓
Image Preprocessing
        ↓
Data Augmentation
        ↓
PyTorch Dataset
        ↓
PyTorch DataLoader
        ↓
CNN Baseline
        ↓
Transfer Learning
        ↓
Pretrained ResNet18
        ↓
Freeze Pretrained Layers
        ↓
Replace Final Layer
        ↓
Train Classification Layer
        ↓
Validation
        ↓
Best Model Selection
        ↓
Final Test Evaluation
        ↓
Classification Report
        ↓
Confusion Matrix
        ↓
Final Animal Classifier


# 42. Conclusion

This project successfully demonstrates the complete workflow of a practical Deep Learning image classification system.

We started with raw animal images and first verified the dataset, including class counts, image formats, image dimensions, visual samples, and corrupted files.

The dataset was then divided into training, validation, and testing sets using stratified splitting.

A custom CNN was initially created as a baseline. Although the CNN successfully learned some visual patterns, it required significant training time and achieved only 40.58% training accuracy after five epochs.

Instead of continuing to spend several hours training the CNN from scratch, Transfer Learning was introduced.

A pretrained ResNet18 model was used as the final architecture. The pretrained feature extraction layers were frozen and the final classification layer was replaced with a new layer containing 10 outputs.

After only two training epochs, the model achieved:

Best Validation Accuracy: 95.24%

Final Test Accuracy: 94.27%

The classification report showed strong performance across most animal classes, with the best performance coming from classes such as Spider, Elephant, Chicken, and Squirrel.

The project also demonstrated the importance of evaluating a model beyond simple accuracy through precision, recall, F1-score, and confusion matrix analysis.

Overall, this project provided practical experience with:

- PyTorch
- CNNs
- Image preprocessing
- Data augmentation
- Dataset management
- DataLoaders
- Transfer Learning
- ResNet18
- Model training
- Validation
- Test evaluation
- Classification reports
- Confusion matrices
- Error analysis
- Multi-class image classification

The final result is a strong 10-class animal image classifier based on Deep Learning and Transfer Learning.