# 🔎 Exploratory Data Analysis (EDA) — Complete Data Investigation Workflow

> **Step 2: Data Science**
>
> **Topic 06: Exploratory Data Analysis**
>
> **Date: February 11, 2024** 🎯
>
> **Class 22 — Exploratory Data Analysis (EDA) Workflow**

---

# 📌 What is EDA?

**Exploratory Data Analysis (EDA)** is the process of exploring, understanding, summarizing, and visualizing a dataset before making conclusions or building Machine Learning models.

In simple words:

> **EDA means asking questions about your data and using statistics + visualization to find the answers.**

For example, if you receive a student dataset:

```text
Student
Age
Gender
Study Hours
Attendance
Marks
```

EDA helps you discover:

* Who performs better?
* Is study time related to marks?
* Does attendance affect performance?
* What is the average mark?
* Are there unusual values?
* Are some values missing?
* Which variables are related?
* Are there patterns or trends?

---

# 🧠 The Simple EDA Mental Model

Remember:

```text
Raw Data
   ↓
Understand
   ↓
Clean
   ↓
Explore
   ↓
Visualize
   ↓
Analyze
   ↓
Find Patterns
   ↓
Generate Insights
   ↓
Prepare for ML
```

### ⭐ Golden Rule

> **EDA is not just making charts.**

EDA combines:

```text
EDA
├── Data Understanding
├── Data Quality Checking
├── Statistics
├── Visualization
├── Relationship Analysis
├── Pattern Detection
├── Outlier Detection
└── Insight Generation
```

---

# 🎯 Why is EDA Important?

A dataset can look simple but contain hidden problems.

For example:

```text
Age:
20
21
22
23
250
```

Without EDA, you may train a model using incorrect data.

EDA helps you discover:

* Missing values
* Duplicates
* Outliers
* Incorrect values
* Data distributions
* Relationships
* Correlations
* Trends
* Imbalanced categories
* Potential data leakage
* Important features

---

# 🔄 Complete EDA Workflow

This is the main workflow you should remember:

```text
                Dataset
                   ↓
          1. Understand Dataset
                   ↓
          2. Inspect Structure
                   ↓
          3. Check Data Quality
                   ↓
          4. Clean Data
                   ↓
       5. Univariate Analysis
                   ↓
       6. Bivariate Analysis
                   ↓
       7. Multivariate Analysis
                   ↓
       8. Statistical Analysis
                   ↓
       9. Detect Patterns
                   ↓
      10. Find Relationships
                   ↓
      11. Generate Insights
                   ↓
      12. Document Findings
                   ↓
        ML / Decision Making
```

---

# 1️⃣ Understand the Problem

Before opening Pandas, understand the dataset.

Ask:

### What is the dataset about?

Example:

```text
Student Performance Dataset
```

### What does each row represent?

```text
One row = One student
```

### What does each column represent?

```text
Age        → Student age
Gender     → Student gender
StudyHours → Daily study hours
Marks      → Exam marks
```

### What are you trying to discover?

For example:

> **What factors are associated with student performance?**

This question guides your EDA.

---

# 2️⃣ Load the Dataset

```python
import pandas as pd

df = pd.read_csv("students.csv")
```

Check:

```python
df.head()
```

---

# 3️⃣ Inspect Dataset Structure

Start with:

```python
df.shape
```

Example:

```text
(1000, 8)
```

Meaning:

```text
1000 rows
8 columns
```

Check columns:

```python
df.columns
```

Check data types:

```python
df.dtypes
```

Full information:

```python
df.info()
```

---

# 4️⃣ Preview the Data

Use:

```python
df.head()
df.tail()
df.sample(5)
```

Why all three?

| Function   | Purpose        |
| ---------- | -------------- |
| `head()`   | Beginning      |
| `tail()`   | End            |
| `sample()` | Random records |

Random sampling is particularly useful because problems aren't always located at the beginning of a dataset.

---

# 5️⃣ Understand Numerical Data

Use:

```python
df.describe()
```

It provides:

```text
count
mean
std
min
25%
50%
75%
max
```

This helps understand:

* Central tendency
* Spread
* Minimum
* Maximum
* Potential outliers

---

# 6️⃣ Understand Categorical Data

Use:

```python
df["Gender"].value_counts()
```

And:

```python
df["Gender"].unique()
```

And:

```python
df["Gender"].nunique()
```

This helps answer:

> What categories exist and how frequently do they occur?

---

# 7️⃣ Check Data Quality

Before analyzing patterns:

```python
df.isnull().sum()
```

Check duplicates:

```python
df.duplicated().sum()
```

Check data types:

```python
df.dtypes
```

Check suspicious values:

```python
df["Age"].describe()
```

EDA and Data Cleaning are closely connected:

```text
EDA
 ↓
Find Problem
 ↓
Clean Data
 ↓
EDA Again
 ↓
Find New Insights
```

So EDA is often **iterative**, not strictly one-directional.

---

# 8️⃣ Univariate Analysis

**Uni = One**

Univariate analysis means analyzing **one variable at a time**.

Examples:

```text
Age
Salary
Marks
Gender
Department
```

Questions:

* What is the distribution?
* What is the average?
* What is the most common category?
* Are there outliers?

---

## 📊 Numerical Univariate Analysis

Useful statistics:

```python
df["Marks"].mean()
df["Marks"].median()
df["Marks"].min()
df["Marks"].max()
df["Marks"].std()
```

Visualizations:

```text
Histogram
KDE Plot
Box Plot
```

Example:

```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.histplot(data=df, x="Marks", kde=True)

plt.show()
```

---

# 9️⃣ Categorical Univariate Analysis

For categorical variables:

```python
df["Department"].value_counts()
```

Visualize:

```python
sns.countplot(
    data=df,
    x="Department"
)

plt.show()
```

This tells you how observations are distributed among categories.

---

# 🔟 Bivariate Analysis

**Bi = Two**

Bivariate analysis examines the relationship between **two variables**.

Examples:

```text
Age ↔ Salary
Study Hours ↔ Marks
Experience ↔ Salary
Gender ↔ Marks
```

---

## 🔵 Numerical + Numerical

Example:

```python
sns.scatterplot(
    data=df,
    x="Study_Hours",
    y="Marks"
)

plt.show()
```

Question:

> Do students who study more tend to have higher marks?

---

# 1️⃣1️⃣ Numerical + Categorical

Example:

```text
Department → Salary
Gender → Marks
```

Use:

```python
sns.boxplot(
    data=df,
    x="Department",
    y="Salary"
)

plt.show()
```

Or:

```python
sns.barplot(
    data=df,
    x="Department",
    y="Salary"
)

plt.show()
```

---

# 1️⃣2️⃣ Categorical + Categorical

Example:

```text
Gender ↔ Department
```

You can use:

```python
pd.crosstab(
    df["Gender"],
    df["Department"]
)
```

And visualize the result with a heatmap.

---

# 1️⃣3️⃣ Multivariate Analysis

**Multi = More than two**

Multivariate analysis examines multiple variables together.

Example:

```text
Age
Study Hours
Attendance
Marks
Gender
```

Useful tools:

```text
Pair Plot
Correlation Heatmap
Grouped Analysis
Facets
```

---

# 🔗 1️⃣4️⃣ Correlation Analysis

Correlation measures the degree to which numerical variables move together.

Calculate:

```python
df.corr(numeric_only=True)
```

Visualize:

```python
sns.heatmap(
    df.corr(numeric_only=True),
    annot=True
)

plt.show()
```

---

# 📈 Positive Correlation

Example:

```text
Study Hours ↑
       ↓
Marks ↑
```

Both variables tend to increase together.

---

# 📉 Negative Correlation

Example:

```text
Price ↑
   ↓
Demand ↓
```

One variable tends to increase while the other decreases.

---

# ⚠️ Correlation Does NOT Mean Causation

This is one of the most important EDA concepts.

If:

```text
Study Hours ↔ Marks
```

have a strong correlation, that does **not automatically prove**:

> Studying more causes higher marks.

There may be other factors involved.

Remember:

> **Correlation describes an association; it does not by itself establish causation.**

---

# 1️⃣5️⃣ Distribution Analysis

You should understand how numerical variables are distributed.

Common shapes:

```text
Normal
Right-Skewed
Left-Skewed
Uniform
Bimodal
```

Use:

```python
sns.histplot(
    data=df,
    x="Salary",
    kde=True
)

plt.show()
```

---

# 1️⃣6️⃣ Detect Outliers

Use:

```python
sns.boxplot(
    data=df,
    y="Salary"
)

plt.show()
```

Or calculate IQR.

```python
Q1 = df["Salary"].quantile(0.25)
Q3 = df["Salary"].quantile(0.75)

IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
```

Then:

```python
outliers = df[
    (df["Salary"] < lower) |
    (df["Salary"] > upper)
]
```

---

# 1️⃣7️⃣ Analyze Groups

Grouping is extremely useful in EDA.

Example:

```python
df.groupby("Department")["Salary"].mean()
```

You can investigate:

```text
Department → Average Salary
Gender → Average Marks
City → Average Sales
Category → Average Revenue
```

---

# 1️⃣8️⃣ Use Multiple Statistics

Instead of only calculating the mean:

```python
df.groupby("Department")["Salary"].agg([
    "count",
    "mean",
    "median",
    "min",
    "max"
])
```

This gives a much better understanding of the data.

---

# 1️⃣9️⃣ Analyze Missing Values

Don't just count missing values.

Find their percentage:

```python
missing_percentage = (
    df.isnull().mean() * 100
)

print(missing_percentage)
```

Then ask:

* Which columns have missing data?
* How much is missing?
* Is missingness concentrated in certain groups?
* Could the missingness itself contain information?

---

# 2️⃣0️⃣ Analyze Relationships

Create specific questions.

Instead of:

> "Let's make charts."

Ask:

> "Does study time relate to marks?"

Then:

```python
sns.scatterplot(
    data=df,
    x="Study_Hours",
    y="Marks"
)

plt.show()
```

This makes EDA **question-driven**.

---

# ⭐ Question-Driven EDA

This is one of the best ways to learn EDA.

```text
Question
   ↓
Choose Analysis
   ↓
Choose Statistic / Visualization
   ↓
Analyze Result
   ↓
Write Insight
```

Example:

```text
Question:
Does attendance relate to marks?

        ↓

Visualization:
Scatter Plot

        ↓

Analysis:
Look for relationship

        ↓

Insight:
Describe what the data shows
```

---

# 📝 2️⃣1️⃣ Write Insights

Don't stop after creating charts.

Write what you learned.

Example:

```text
📌 Insight:

Students with higher attendance generally show
higher marks in this dataset, although the relationship
is not perfect and does not establish causation.
```

This is what turns visualization into **analysis**.

---

# 📊 2️⃣2️⃣ EDA Visualization Guide

| Question                                      | Recommended Visualization |
| --------------------------------------------- | ------------------------- |
| What does one numerical variable look like?   | Histogram                 |
| Is the distribution smooth?                   | KDE                       |
| Are there outliers?                           | Box Plot                  |
| How many categories exist?                    | Count Plot                |
| Relationship between two numerical variables? | Scatter Plot              |
| Trend over time?                              | Line Plot                 |
| Compare categories?                           | Bar Plot                  |
| Compare distributions?                        | Box/Violin Plot           |
| Many numerical variables?                     | Pair Plot                 |
| Correlation between variables?                | Heatmap                   |
| Category vs category?                         | Count/Crosstab/Heatmap    |

---

# 🧠 2️⃣3️⃣ EDA Statistics

Important statistics:

### Central Tendency

```text
Mean
Median
Mode
```

### Spread

```text
Range
Variance
Standard Deviation
IQR
```

### Position

```text
Percentiles
Quartiles
```

### Relationship

```text
Correlation
Covariance
```

---

# 🧩 2️⃣4️⃣ EDA with NumPy + Pandas + Matplotlib + Seaborn

You now combine everything you've learned.

```text
NumPy
 ↓
Numerical Operations
 ↓
Pandas
 ↓
Data Manipulation
 ↓
Data Cleaning
 ↓
Matplotlib
 ↓
General Visualization
 ↓
Seaborn
 ↓
Statistical Visualization
 ↓
EDA
 ↓
Insights
```

This is the point where your previous libraries start working together.

---

# 🏢 2️⃣5️⃣ Real-World EDA Examples

## 🛒 E-Commerce

Questions:

```text
Which products sell the most?
Which category generates the most revenue?
Does price affect quantity sold?
Which customers spend the most?
```

---

## 💰 Finance

Questions:

```text
How are returns distributed?
Which assets move together?
Are there unusual returns?
How does volatility change?
```

---

## 🏥 Healthcare

Questions:

```text
How is age distributed?
Are some groups more represented?
Which variables are associated with an outcome?
Are there unusual measurements?
```

---

## 🎓 Education

Questions:

```text
Does attendance relate to marks?
Does study time relate to performance?
Which subjects have lower scores?
Are there performance differences between groups?
```

---

# 🤖 2️⃣6️⃣ EDA Before Machine Learning

EDA is an important step before ML.

```text
Dataset
   ↓
Data Understanding
   ↓
Data Cleaning
   ↓
EDA
   ↓
Feature Understanding
   ↓
Feature Engineering
   ↓
Train/Test Split
   ↓
Machine Learning
```

EDA helps you understand what you're feeding into the model.

---

# ⚠️ 2️⃣7️⃣ Important ML EDA Rule — Avoid Data Leakage

When EDA is being used to build a predictive ML pipeline, be careful about using information from the test set to make preprocessing or feature-selection decisions.

A safer workflow is:

```text
Raw Dataset
     ↓
Basic Understanding
     ↓
Train / Validation / Test Split
     ↓
Learn preprocessing from Training Data
     ↓
Apply to Validation/Test
     ↓
Model
```

For a learning project, you should understand this distinction before moving deeply into ML.

---

# 🔁 2️⃣8️⃣ EDA Is Iterative

EDA doesn't always happen once.

You may do:

```text
Explore
 ↓
Find Problem
 ↓
Clean
 ↓
Explore Again
 ↓
Find Another Problem
 ↓
Clean Again
 ↓
Analyze
 ↓
Discover Pattern
 ↓
Ask New Question
 ↓
Analyze Again
```

That's normal.

> **EDA is an investigation, not a checklist you execute once and forget.**

---

# ❌ Common EDA Mistakes

### Mistake 1 — Making random charts

Don't create 20 charts without questions.

### Mistake 2 — Only looking at averages

Mean alone doesn't describe the whole dataset.

### Mistake 3 — Ignoring distributions

Two groups can have the same mean but completely different distributions.

### Mistake 4 — Ignoring outliers

Outliers can strongly affect statistics and models.

### Mistake 5 — Assuming correlation means causation

Always distinguish association from causation.

### Mistake 6 — Ignoring categorical variables

Not everything important is numerical.

### Mistake 7 — Not writing insights

A chart without interpretation is incomplete analysis.

### Mistake 8 — Treating every unusual value as an error

Investigate first.

---

# ⭐ Best EDA Tips

### 💡 Tip 1 — Start with questions

Don't start with charts.

Start with:

> **What do I want to know?**

---

### 💡 Tip 2 — Understand every column

Know:

```text
Name
Meaning
Type
Expected values
Units
```

---

### 💡 Tip 3 — Use statistics + visualization

Don't rely on only one.

```text
Statistics → Numbers
Visualization → Patterns
```

Together:

```text
Statistics + Visualization = Better Understanding
```

---

### 💡 Tip 4 — Compare groups

Instead of:

```text
Average salary = 60,000
```

Try:

```text
Average salary by department
Average salary by experience
Average salary by city
```

---

### 💡 Tip 5 — Look at distributions

Always ask:

> What does the data actually look like?

---

### 💡 Tip 6 — Write down findings

For every important chart:

```text
📌 Question
📊 Visualization
🔎 Observation
💡 Insight
```

This is excellent practice for real Data Science work.

---

# 🧪 Mini Project — Complete EDA on Student Performance

Use a dataset containing:

```text
Student_ID
Name
Age
Gender
Study_Hours
Attendance
Previous_Marks
Final_Marks
City
```

### Step 1 — Understand

```python
df.shape
df.head()
df.info()
df.describe()
```

### Step 2 — Data Quality

```python
df.isnull().sum()
df.duplicated().sum()
```

### Step 3 — Univariate Analysis

Analyze:

```text
Age
Study Hours
Attendance
Final Marks
Gender
City
```

### Step 4 — Bivariate Analysis

Investigate:

```text
Study Hours → Final Marks
Attendance → Final Marks
Previous Marks → Final Marks
Gender → Final Marks
```

### Step 5 — Multivariate Analysis

Use:

```text
Pair Plot
Correlation Heatmap
Grouped Analysis
```

### Step 6 — Outliers

Investigate:

```text
Age
Study Hours
Attendance
Final Marks
```

### Step 7 — Write Insights

Create at least **5–10 meaningful findings**.

Example:

```text
📌 Finding 1:
Students with higher attendance generally have
higher final marks in this dataset.

📌 Finding 2:
Study hours show a positive association with
final marks, although the relationship is not perfect.
```

### Step 8 — Final Report

Your notebook should finish with:

```text
Dataset Summary
↓
Data Quality Findings
↓
Statistical Findings
↓
Visualization Findings
↓
Important Relationships
↓
Outliers
↓
Final Insights
```

---

# 🎯 Learning Goals

After completing **Class 22 — EDA**, you should understand:

* [ ] What EDA means
* [ ] Why EDA is important
* [ ] Complete EDA workflow
* [ ] Understanding a dataset
* [ ] Dataset inspection
* [ ] Data quality analysis
* [ ] Univariate analysis
* [ ] Bivariate analysis
* [ ] Multivariate analysis
* [ ] Numerical analysis
* [ ] Categorical analysis
* [ ] Distribution analysis
* [ ] Outlier analysis
* [ ] Correlation analysis
* [ ] Group analysis
* [ ] Missing-value analysis
* [ ] Statistics in EDA
* [ ] Visualization selection
* [ ] Question-driven EDA
* [ ] Writing insights
* [ ] EDA with Pandas
* [ ] EDA with Matplotlib
* [ ] EDA with Seaborn
* [ ] EDA before Machine Learning
* [ ] Data leakage awareness
* [ ] Iterative EDA
* [ ] Complete EDA project

---

# ❓ Interview Questions

### Beginner

1. What is EDA?
2. Why is EDA important?
3. What is the purpose of `df.describe()`?
4. What is univariate analysis?
5. What is bivariate analysis?
6. What is multivariate analysis?
7. Why do we visualize data?

### Intermediate

8. How do you find missing values?
9. How do you detect outliers?
10. What is correlation?
11. What is the difference between correlation and causation?
12. What is the purpose of a correlation heatmap?
13. When would you use a box plot?
14. When would you use a scatter plot?
15. How do you analyze categorical variables?
16. Why are distributions important?
17. Why is EDA iterative?

### Practical

18. You receive a completely unknown CSV. What do you do first?
19. How would you investigate the relationship between two numerical variables?
20. How would you compare salaries between departments?
21. How would you investigate an unusual value?
22. How would you find the most important relationships in a dataset?
23. How would you present your EDA findings to a non-technical person?

---

# 📁 Folder Structure

```text
02-Data-Science/
│
├── README.md
│
├── 01-NumPy/
│   ├── README.md
│   └── class17.ipynb
│
├── 02-Pandas/
│   ├── README.md
│   └── class18.ipynb
│
├── 03-Matplotlib/
│   ├── README.md
│   └── class19.ipynb
│
├── 04-Seaborn/
│   ├── README.md
│   └── class20.ipynb
│
├── 05-Data-Cleaning/
│   ├── README.md
│   └── class21.ipynb
│
└── 06-EDA-Workflow/
    ├── README.md
    └── class22.ipynb
```

---

# 📓 Notebook Structure

Your `class22.ipynb` should follow this flow:

```text
📌 Title
   ↓
🎯 Learning Objectives
   ↓
🔎 What is EDA?
   ↓
🧠 EDA Mental Model
   ↓
📂 Load Dataset
   ↓
🔍 Understand Dataset
   ↓
📊 Inspect Structure
   ↓
🧹 Data Quality Check
   ↓
1️⃣ Univariate Analysis
   ↓
2️⃣ Bivariate Analysis
   ↓
3️⃣ Multivariate Analysis
   ↓
📈 Distribution Analysis
   ↓
📦 Outlier Analysis
   ↓
🔗 Correlation Analysis
   ↓
👥 Group Analysis
   ↓
📊 Visualization
   ↓
💡 Generate Insights
   ↓
📝 Document Findings
   ↓
🚀 Complete EDA Project
   ↓
🧠 Key Takeaways
   ↓
❓ Interview Questions
   ↓
➡️ Next: Statistics
```

---

# 🧠 The EDA Formula to Remember

```text
             EDA
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
   Inspect  Analyze  Visualize
      │       │        │
      └───────┼────────┘
              ↓
          Find Patterns
              ↓
          Ask Questions
              ↓
         Generate Insights
```

### The most important habit:

> **Don't ask “Which chart should I make?” first. Ask “What do I want to know about this data?”**

Then choose the statistic or visualization that helps answer that question.
