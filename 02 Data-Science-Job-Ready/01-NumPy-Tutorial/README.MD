# 🔢 NumPy — Numerical Python

> **Step 2: Data Science**  
> **Library 01: NumPy**  
> **Date: February 1, 2024** 🎯  
> **Class 17 — NumPy Fundamentals**

NumPy is the first major Python library in my Data Science journey.

It provides powerful tools for numerical computing, arrays, mathematical operations, statistics, linear algebra, and efficient data processing.

---

# 🎯 What is NumPy?

**NumPy** stands for:

> **Numerical Python**

It is one of the most important Python libraries for:

- Numerical computing
- Working with arrays
- Mathematical operations
- Statistical calculations
- Linear algebra
- Data manipulation
- Scientific computing
- Machine Learning
- Deep Learning
- Data Science

NumPy provides a powerful data structure called the:

> **NumPy Array (`ndarray`)**

Example:

```python
import numpy as np

numbers = np.array([10, 20, 30, 40, 50])

print(numbers)
````

Output:

```text
[10 20 30 40 50]
```

---

# 🚀 Why Learn NumPy?

Before working with Pandas, Machine Learning, Deep Learning, and many other tools, it is important to understand NumPy.

NumPy provides the foundation for numerical operations in Python.

It is commonly used in:

```text
NumPy
   ↓
Pandas
   ↓
Data Science
   ↓
Machine Learning
   ↓
Deep Learning
   ↓
AI
```

Many popular Python libraries use NumPy internally or work closely with NumPy arrays.

---

# 📚 What I Will Learn

In this NumPy course, I will learn:

### NumPy Fundamentals

* What is NumPy?
* Why NumPy is used
* Installing NumPy
* Importing NumPy
* NumPy version
* Creating NumPy arrays
* Python lists vs NumPy arrays
* One-dimensional arrays
* Two-dimensional arrays
* Multi-dimensional arrays
* `ndarray`

### Array Properties

* `ndim`
* `shape`
* `size`
* `dtype`
* `itemsize`

### Creating Arrays

* `np.array()`
* `np.zeros()`
* `np.ones()`
* `np.empty()`
* `np.full()`
* `np.arange()`
* `np.linspace()`
* `np.eye()`
* Random arrays

### Array Indexing

* Positive indexing
* Negative indexing
* Multi-dimensional indexing
* Row and column access
* Selecting individual values

### Array Slicing

* One-dimensional slicing
* Two-dimensional slicing
* Row slicing
* Column slicing
* Step slicing
* Reverse slicing

### Array Data Types

* Integer
* Float
* Boolean
* String
* `dtype`
* Converting data types
* `astype()`

### Mathematical Operations

* Addition
* Subtraction
* Multiplication
* Division
* Power
* Modulus
* Absolute values
* Square root
* Exponential
* Logarithms
* Trigonometric functions

### Statistical Operations

* Sum
* Mean
* Median
* Minimum
* Maximum
* Standard deviation
* Variance
* Percentiles
* Minimum/maximum index

### Array Operations

* Addition between arrays
* Subtraction between arrays
* Multiplication
* Division
* Comparison operations
* Boolean operations

### Broadcasting

* What broadcasting means
* Broadcasting rules
* Broadcasting with scalars
* Broadcasting between arrays

### Reshaping Arrays

* `reshape()`
* Flattening
* `flatten()`
* `ravel()`
* Transpose
* `T`

### Joining Arrays

* `concatenate()`
* `stack()`
* `vstack()`
* `hstack()`

### Splitting Arrays

* `split()`
* `vsplit()`
* `hsplit()`

### Copy and View

* Array references
* Copy
* View
* Difference between copy and view

### Sorting

* `sort()`
* Sorting arrays
* Sorting along an axis

### Searching

* `where()`
* Searching values
* Finding indexes
* Filtering arrays

### Boolean Filtering

* Boolean conditions
* Boolean masks
* Filtering values
* Multiple conditions

### Random Numbers

* Random numbers
* Random integers
* Random floats
* Random arrays
* Random seeds
* Reproducibility

### Linear Algebra

* Dot product
* Matrix multiplication
* Transpose
* Determinant
* Inverse
* Matrix operations

### Practical NumPy

* Working with numerical datasets
* Data preprocessing
* Normalization
* Standardization
* Feature arrays
* Handling missing values
* Preparing data for Machine Learning

---

# 🧠 NumPy Array

The most important concept in NumPy is the **array**.

A NumPy array is a collection of values stored in a structured numerical format.

Example:

```python
import numpy as np

numbers = np.array([10, 20, 30, 40, 50])

print(numbers)
```

Output:

```text
[10 20 30 40 50]
```

---

# 📊 Python List vs NumPy Array

Python list:

```python
numbers = [10, 20, 30, 40, 50]
```

NumPy array:

```python
import numpy as np

numbers = np.array([10, 20, 30, 40, 50])
```

NumPy arrays are designed for numerical operations and can perform many calculations more efficiently and conveniently than normal Python lists.

---

# 📐 Dimensions of Arrays

NumPy arrays can have different dimensions.

## 1D Array

```python
np.array([1, 2, 3, 4])
```

Structure:

```text
[1 2 3 4]
```

---

## 2D Array

```python
np.array([
    [1, 2, 3],
    [4, 5, 6]
])
```

Structure:

```text
[[1 2 3]
 [4 5 6]]
```

This can be thought of as:

```text
Rows × Columns

2 × 3
```

---

## 3D Array

```python
np.array([
    [
        [1, 2],
        [3, 4]
    ],
    [
        [5, 6],
        [7, 8]
    ]
])
```

3D arrays are useful when working with more complex numerical structures such as image data.

---

# 🔍 Important Array Properties

NumPy provides useful properties for understanding an array.

```python
import numpy as np

data = np.array([
    [10, 20, 30],
    [40, 50, 60]
])

print(data.ndim)
print(data.shape)
print(data.size)
print(data.dtype)
```

Important properties:

| Property   | Meaning                     |
| ---------- | --------------------------- |
| `ndim`     | Number of dimensions        |
| `shape`    | Size of each dimension      |
| `size`     | Total number of elements    |
| `dtype`    | Data type of elements       |
| `itemsize` | Memory size of each element |

---

# 🏗️ Creating NumPy Arrays

NumPy provides many functions for creating arrays.

## `np.array()`

```python
numbers = np.array([1, 2, 3, 4, 5])
```

## `np.zeros()`

```python
zeros = np.zeros(5)

print(zeros)
```

Output:

```text
[0. 0. 0. 0. 0.]
```

## `np.ones()`

```python
ones = np.ones(5)

print(ones)
```

## `np.full()`

```python
numbers = np.full(5, 10)

print(numbers)
```

Output:

```text
[10 10 10 10 10]
```

## `np.arange()`

```python
numbers = np.arange(1, 10)

print(numbers)
```

Output:

```text
[1 2 3 4 5 6 7 8 9]
```

## `np.linspace()`

```python
numbers = np.linspace(0, 10, 5)

print(numbers)
```

This creates evenly spaced values between two numbers.

---

# 🎯 Indexing

NumPy supports indexing similar to Python lists.

```python
numbers = np.array([10, 20, 30, 40, 50])

print(numbers[0])
print(numbers[2])
print(numbers[-1])
```

Output:

```text
10
30
50
```

---

# ✂️ Slicing

NumPy supports slicing.

```python
numbers = np.array([10, 20, 30, 40, 50])

print(numbers[1:4])
```

Output:

```text
[20 30 40]
```

For a 2D array:

```python
data = np.array([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
])

print(data[0:2, 1:3])
```

---

# ➕ Mathematical Operations

NumPy makes numerical calculations simple.

```python
import numpy as np

numbers = np.array([10, 20, 30, 40])

print(numbers + 10)
print(numbers - 5)
print(numbers * 2)
print(numbers / 10)
```

Output:

```text
[20 30 40 50]
[ 5 15 25 35]
[20 40 60 80]
[1. 2. 3. 4.]
```

---

# 📊 Statistical Functions

NumPy provides many statistical functions.

```python
data = np.array([10, 20, 30, 40, 50])

print(np.sum(data))
print(np.mean(data))
print(np.median(data))
print(np.min(data))
print(np.max(data))
print(np.std(data))
print(np.var(data))
```

These operations are extremely important in Data Science.

---

# 🎯 Boolean Filtering

NumPy can filter data using conditions.

```python
numbers = np.array([10, 20, 30, 40, 50])

result = numbers[numbers > 25]

print(result)
```

Output:

```text
[30 40 50]
```

This concept becomes very important later when working with Pandas and datasets.

---

# 📐 Reshaping

An array can be reshaped into another structure.

```python
numbers = np.arange(1, 7)

matrix = numbers.reshape(2, 3)

print(matrix)
```

Output:

```text
[[1 2 3]
 [4 5 6]]
```

The number of elements must remain the same.

---

# 🔄 Transpose

Transpose changes rows into columns and columns into rows.

```python
matrix = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(matrix.T)
```

Output:

```text
[[1 4]
 [2 5]
 [3 6]]
```

---

# 📡 Broadcasting

Broadcasting allows NumPy to perform operations between arrays with compatible shapes.

Example:

```python
numbers = np.array([10, 20, 30])

print(numbers + 5)
```

Output:

```text
[15 25 35]
```

The value `5` is automatically applied to every element.

Broadcasting is an important NumPy concept for Machine Learning and numerical computing.

---

# 🎲 Random Numbers

NumPy also provides tools for generating random numbers.

```python
import numpy as np

numbers = np.random.randint(1, 100, 5)

print(numbers)
```

Example output:

```text
[23 81 14 56 92]
```

Random numbers are commonly used in:

* Machine Learning
* Data Science
* Simulations
* Testing
* Model initialization

---

# 🧮 Linear Algebra

NumPy also provides tools for mathematical and matrix operations.

Examples include:

* Matrix multiplication
* Dot product
* Transpose
* Determinant
* Inverse
* Eigenvalues
* Eigenvectors

Example:

```python
a = np.array([
    [1, 2],
    [3, 4]
])

b = np.array([
    [5, 6],
    [7, 8]
])

result = np.matmul(a, b)

print(result)
```

---

# 🧹 Handling Numerical Data

NumPy can also be used for basic data preparation.

For example:

```python
data = np.array([10, 20, np.nan, 40, 50])

print(np.isnan(data))
```

NumPy provides functions that help identify and work with numerical data issues.

---

# 🤖 NumPy in Machine Learning

NumPy is one of the foundations of Machine Learning.

Machine Learning models work heavily with:

```text
Numbers
   ↓
Arrays
   ↓
Matrices
   ↓
Vectors
   ↓
Numerical Operations
   ↓
Machine Learning
```

For example, a dataset can be represented as:

```python
X = np.array([
    [20, 50000],
    [25, 60000],
    [30, 75000],
    [35, 90000]
])
```

Here:

```text
Rows    → Samples
Columns → Features
```

This idea will become important when learning Machine Learning.

---

# 🧠 NumPy in Deep Learning

Deep Learning frameworks such as PyTorch and TensorFlow work heavily with numerical arrays/tensors.

The basic idea is:

```text
NumPy Arrays
     ↓
Numerical Data
     ↓
Tensors
     ↓
Neural Networks
     ↓
Deep Learning
```

Understanding NumPy therefore makes later numerical and tensor operations easier to understand.

---

# 🌍 Real-World Uses of NumPy

NumPy is commonly used for:

* Data Science
* Machine Learning
* Deep Learning
* Scientific Computing
* Statistics
* Numerical Analysis
* Image Processing
* Signal Processing
* Financial Analysis
* Engineering
* Simulations
* Data Preprocessing

---

# 🛠️ Practical Examples

Throughout this NumPy course, examples will include:

### Student Marks

```text
Student scores
      ↓
NumPy Array
      ↓
Mean
      ↓
Maximum
      ↓
Minimum
      ↓
Statistics
```

### Sales Data

```text
Daily sales
      ↓
NumPy Array
      ↓
Total sales
      ↓
Average sales
      ↓
Highest sales
      ↓
Lowest sales
```

### Machine Learning Dataset

```text
Features
   ↓
NumPy Array
   ↓
Data preprocessing
   ↓
Model input
```

---

# 📋 NumPy Important Functions

| Function           | Purpose                        |
| ------------------ | ------------------------------ |
| `np.array()`       | Create an array                |
| `np.zeros()`       | Create zeros                   |
| `np.ones()`        | Create ones                    |
| `np.full()`        | Fill with a value              |
| `np.arange()`      | Create a range                 |
| `np.linspace()`    | Create evenly spaced values    |
| `np.reshape()`     | Change array shape             |
| `np.concatenate()` | Join arrays                    |
| `np.split()`       | Split arrays                   |
| `np.sort()`        | Sort values                    |
| `np.where()`       | Find values based on condition |
| `np.sum()`         | Calculate total                |
| `np.mean()`        | Calculate average              |
| `np.median()`      | Calculate median               |
| `np.min()`         | Find minimum                   |
| `np.max()`         | Find maximum                   |
| `np.std()`         | Standard deviation             |
| `np.var()`         | Variance                       |
| `np.sqrt()`        | Square root                    |
| `np.abs()`         | Absolute value                 |
| `np.random`        | Generate random values         |

---

# 🧠 Important NumPy Concepts

By the end of this course, I should understand:

```text
NumPy
│
├── Arrays
│   ├── 1D
│   ├── 2D
│   └── Multi-dimensional
│
├── Array Properties
│   ├── ndim
│   ├── shape
│   ├── size
│   └── dtype
│
├── Indexing
├── Slicing
├── Data Types
├── Array Creation
├── Mathematical Operations
├── Statistical Operations
├── Broadcasting
├── Reshaping
├── Joining
├── Splitting
├── Sorting
├── Filtering
├── Random Numbers
├── Copy & View
└── Linear Algebra
```

---

# 🎯 Learning Goals

After completing NumPy, I should be able to:

* Understand what NumPy is.
* Explain why NumPy is used.
* Create NumPy arrays.
* Understand dimensions and shapes.
* Access array elements.
* Slice arrays.
* Change array shapes.
* Perform mathematical operations.
* Perform statistical calculations.
* Filter numerical data.
* Understand broadcasting.
* Generate random data.
* Perform basic matrix operations.
* Work with numerical datasets.
* Prepare numerical data for Machine Learning.
* Understand the relationship between arrays, matrices, and numerical computing.

---

# 💼 Interview Questions

After completing this section, I should be able to answer:

### Beginner

1. What is NumPy?
2. What does NumPy stand for?
3. Why is NumPy used in Data Science?
4. What is a NumPy array?
5. What is `ndarray`?
6. What is the difference between a Python list and NumPy array?
7. What is `ndim`?
8. What is `shape`?
9. What is `size`?
10. What is `dtype`?

### Intermediate

11. What is broadcasting?
12. What is vectorization?
13. What is the difference between `reshape()` and `resize()`?
14. What is the difference between `flatten()` and `ravel()`?
15. What is the difference between a copy and a view?
16. How does Boolean filtering work?
17. How do you combine NumPy arrays?
18. How do you split NumPy arrays?
19. How do you generate random numbers using NumPy?
20. How is NumPy used in Machine Learning?

### Advanced Foundation

21. How does NumPy improve numerical computation?
22. What are NumPy axes?
23. How do operations work along an axis?
24. How does broadcasting work internally?
25. Why are NumPy operations generally faster than Python loops for numerical data?
26. What is vectorization?
27. How are NumPy arrays stored in memory?
28. What is the relationship between NumPy arrays and tensors?

---

# 📝 Practice Exercises

After learning each concept, I will practice with real examples.

### Exercise 01 — Basic Array

Create an array containing:

```text
10, 20, 30, 40, 50
```

Find:

* Number of elements
* Data type
* Number of dimensions
* Shape

---

### Exercise 02 — Student Marks

Create an array:

```text
[78, 85, 92, 67, 88, 95, 73]
```

Calculate:

* Total marks
* Average marks
* Highest marks
* Lowest marks
* Standard deviation

---

### Exercise 03 — Sales Data

Create daily sales data and calculate:

* Total sales
* Average sales
* Highest sales
* Lowest sales
* Days with sales above the average

---

### Exercise 04 — Matrix

Create a `3 × 3` matrix and practice:

* Indexing
* Slicing
* Transpose
* Sum
* Mean
* Maximum
* Minimum

---

### Exercise 05 — Boolean Filtering

Create an array of numbers and return:

* Numbers greater than 50
* Numbers less than 50
* Even numbers
* Odd numbers

---

### Exercise 06 — Reshaping

Create numbers from `1` to `12`.

Convert them into:

```text
2 × 6
3 × 4
4 × 3
6 × 2
```

---

### Exercise 07 — Broadcasting

Create an array of prices and increase every price by:

```text
10%
```

---

### Exercise 08 — Mini Data Science Project

Create a small numerical dataset containing:

```text
Student
Age
Study Hours
Marks
```

Use NumPy to calculate:

* Average age
* Average study hours
* Average marks
* Highest marks
* Lowest marks
* Students above average
* Relationship between study hours and marks

---

# 📂 Folder Structure

```text
01-NumPy/
│
├── README.md
└── class17.ipynb
```

### README.md

This file contains:

* NumPy overview
* Concepts
* Examples
* Important functions
* Learning goals
* Interview questions
* Practice exercises
* Key takeaways

### class17.ipynb

The Jupyter Notebook contains the practical learning material:

```text
Markdown
   ↓
Explanation
   ↓
Code
   ↓
Output
   ↓
Notes
   ↓
Example
   ↓
Practice
```

---

# 📓 Notebook Learning Style

The notebook will be written like a complete beginner-friendly course.

Each concept will follow a structure similar to:

```text
1. Concept
      ↓
2. Simple Explanation
      ↓
3. Syntax
      ↓
4. Example
      ↓
5. Output
      ↓
6. Explanation of Output
      ↓
7. Real-World Example
      ↓
8. Practice
```

The goal is that someone who has never used NumPy can open the notebook and understand the topic without needing another tutorial.

---

# 🔑 Key Takeaways

* NumPy means **Numerical Python**.
* NumPy is a fundamental Python library for numerical computing.
* The main data structure in NumPy is the `ndarray`.
* NumPy supports one-dimensional, two-dimensional, and multi-dimensional arrays.
* `shape`, `size`, `ndim`, and `dtype` are important array properties.
* NumPy provides powerful mathematical and statistical functions.
* Indexing and slicing allow us to access parts of arrays.
* Broadcasting allows operations between compatible arrays.
* NumPy is widely used in Data Science and Machine Learning.
* Understanding NumPy creates a strong foundation for Pandas and Machine Learning.

---

# 🚀 Data Science Learning Path

NumPy is the first library in my Data Science journey.

```text
Step 2 — Data Science
│
├── 01 NumPy          ← Current
│
├── 02 Pandas
│
├── 03 Matplotlib
│
├── 04 Seaborn
│
├── 05 Data Cleaning
│
├── 06 Exploratory Data Analysis
│
└── 07 Statistics
```

After completing Data Science:

```text
Data Science
      ↓
Machine Learning
      ↓
Deep Learning
      ↓
Generative AI / LLMs
      ↓
Agentic AI
      ↓
MLOps
      ↓
AI Engineering
```

---

# 🎯 Final Goal

The purpose of learning NumPy is not simply to memorize NumPy functions.

The goal is to understand how numerical data is represented, manipulated, analyzed, and prepared for later stages of Data Science and AI.

```text
Python
  ↓
NumPy
  ↓
Pandas
  ↓
Data Analysis
  ↓
Machine Learning
  ↓
Deep Learning
  ↓
AI Engineering
```

> **Strong fundamentals → Strong Data Science → Strong AI Engineering**
