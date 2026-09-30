# 🧹 Data Cleaning — Cleaning and Preparing Real-World Data

> **Step 2: Data Science**
>
> **Topic 05: Data Cleaning**
>
> **Date: February 8, 2024** 🎯
>
> **Class 21 — Data Cleaning, Preprocessing and Data Quality**

---

## 📌 What is Data Cleaning?

**Data Cleaning** is the process of finding, correcting, removing, or handling incorrect, incomplete, inconsistent, duplicate, and unusable data.

Real-world data is usually **messy**.

For example:

```text
Name       Age    Gender     Salary
Ali        23     Male       50000
Ahmed      25     male       55000
Sara       ?      Female     60000
Ali        23     Male       50000
Ayesha     200    Female     65000
```

Problems:

* `male` and `Male` are inconsistent
* Age is missing
* `Ali` appears twice
* Age `200` may be invalid
* Some values may have wrong data types
* There may be extra spaces
* Salary may contain text such as `"60,000 PKR"`

Data cleaning turns this:

```text
❌ Messy Data
```

into:

```text
✅ Clean Data
```

---

# 🧠 The Most Important Idea

Don't think:

> **Data Cleaning = deleting bad rows**

Think:

> **Data Cleaning = understanding the data and making it reliable for analysis.**

Sometimes you:

* remove data
* replace data
* fill missing data
* correct data
* standardize data
* convert data types
* keep unusual data because it is actually valid

This last point is **very important**.

An unusual value is not automatically a bad value.

---

# 🔄 Data Cleaning Mental Model

Remember this workflow:

```text
Raw Dataset
     ↓
Understand the Data
     ↓
Find Problems
     ↓
Decide What Each Problem Means
     ↓
Clean / Transform
     ↓
Validate
     ↓
Clean Dataset
     ↓
EDA
     ↓
Machine Learning
```

### ⭐ Golden Rule

> **Inspect → Understand → Clean → Validate**

Never blindly clean a dataset.

---

# 🧩 What Problems Exist in Real Data?

```text
Data Quality Problems
│
├── Missing Values
├── Duplicate Records
├── Incorrect Data Types
├── Inconsistent Values
├── Invalid Values
├── Outliers
├── Wrong Formatting
├── Extra Spaces
├── Spelling Errors
├── Mixed Case
├── Incorrect Dates
├── Incorrect Units
├── Impossible Values
├── Irrelevant Columns
└── Data Entry Errors
```

---

# 1️⃣ Understand the Dataset First

Before changing anything:

```python
df.head()
df.tail()
df.shape
df.columns
df.info()
df.describe()
```

Also:

```python
df.sample(5)
```

Ask:

* How many rows?
* How many columns?
* What does each column represent?
* Which columns are numerical?
* Which are categorical?
* Which contain dates?
* Which columns have missing values?
* Are there suspicious values?

---

# 2️⃣ Check Missing Values

Missing data is one of the most common problems.

Example:

```text
Name    Age    Salary
Ali     23     50000
Ahmed   NaN    55000
Sara    25     NaN
```

Check:

```python
df.isnull().sum()
```

Percentage:

```python
df.isnull().mean() * 100
```

---

# 🧠 Missing Value Decision

Don't automatically do:

```python
df.dropna()
```

First ask:

> **Why is this value missing?**

Then decide.

```text
Missing Value
     ↓
Understand why?
     ↓
 ┌───┴────┐
 ↓        ↓
Useful?  Not useful?
 ↓        ↓
Fill     Remove
```

Possible solutions:

| Situation                   | Possible Solution     |
| --------------------------- | --------------------- |
| Very few missing rows       | Remove rows           |
| Numerical data              | Mean / Median         |
| Categorical data            | Mode                  |
| Time-series data            | Forward/Backward fill |
| Missing because unavailable | Keep as missing       |
| Important feature           | Investigate carefully |

---

# 3️⃣ Mean vs Median

Suppose:

```text
Salary:
40k
45k
50k
55k
500k
```

The `500k` value is very large.

Mean can be heavily affected by it.

In such cases, **median** may be more representative.

### Simple rule

```text
Normally distributed data
        ↓
      Mean

Skewed data / Outliers
        ↓
     Median
```

But don't treat this as a blind rule. Understand the data first.

---

# 4️⃣ Categorical Missing Values

Example:

```text
Gender
Male
Female
NaN
Male
Female
```

You may use the most common category:

```python
df["Gender"].fillna(df["Gender"].mode()[0], inplace=True)
```

But again:

> Check whether using the mode makes business/data sense.

---

# 5️⃣ Find Duplicate Rows

Duplicates can distort analysis.

Check:

```python
df.duplicated()
```

Count:

```python
df.duplicated().sum()
```

Remove:

```python
df.drop_duplicates()
```

Or:

```python
df.drop_duplicates(inplace=True)
```

---

# ⚠️ Important: Not Every Duplicate-Looking Row Is Wrong

Suppose:

```text
Customer   Product
Ali        Laptop
Ali        Mouse
```

The customer appears twice, but these are **different transactions**.

So don't remove duplicates simply because one column repeats.

You need to understand what defines a **duplicate record**.

---

# 6️⃣ Fix Data Types

Example:

```text
Age
"20"
"21"
"22"
```

These may be stored as strings instead of integers.

Check:

```python
df.dtypes
```

Convert:

```python
df["Age"] = df["Age"].astype(int)
```

For safer numeric conversion:

```python
df["Age"] = pd.to_numeric(
    df["Age"],
    errors="coerce"
)
```

---

# 7️⃣ Dates and Time

Real datasets often contain dates in different formats:

```text
01/02/2024
2024-02-01
Feb 1, 2024
```

Convert:

```python
df["Date"] = pd.to_datetime(
    df["Date"],
    errors="coerce"
)
```

Then extract:

```python
df["Year"] = df["Date"].dt.year
df["Month"] = df["Date"].dt.month
df["Day"] = df["Date"].dt.day
```

---

# 8️⃣ Remove Extra Spaces

Messy:

```text
" Ali "
" Ahmed"
"Sara "
```

Clean:

```python
df["Name"] = df["Name"].str.strip()
```

This is a very common real-world cleaning step.

---

# 9️⃣ Standardize Text

You may have:

```text
Male
male
MALE
mAle
```

Convert:

```python
df["Gender"] = df["Gender"].str.lower()
```

Now:

```text
male
male
male
male
```

Or capitalize:

```python
df["Gender"] = df["Gender"].str.title()
```

Result:

```text
Male
Male
Male
Male
```

---

# 🔟 Fix Spelling / Inconsistent Categories

Example:

```text
Pakistan
pakistan
PAKISTAN
Pakistaan
```

You need to standardize them.

For known corrections:

```python
df["Country"] = df["Country"].replace({
    "pakistan": "Pakistan",
    "PAKISTAN": "Pakistan",
    "Pakistaan": "Pakistan"
})
```

---

# 1️⃣1️⃣ Invalid Values

Example:

```text
Age
21
25
30
-5
200
```

You need to investigate values that don't make sense for the variable.

Example:

```python
df[df["Age"] < 0]
```

Or:

```python
df[df["Age"] > 120]
```

But don't automatically delete every unusual value.

Ask:

> **Is this value impossible, or simply unusual?**

---

# 1️⃣2️⃣ Outliers

An outlier is a value that is unusually far from other observations.

Example:

```text
Salary:
40k
42k
45k
47k
50k
900k
```

`900k` is an outlier.

But it might be:

```text
❌ Data entry mistake
```

or:

```text
✅ CEO salary
```

Therefore:

> **Outlier ≠ automatically bad data.**

This is one of the most important Data Cleaning lessons.

---

# 1️⃣3️⃣ Detect Outliers with IQR

IQR means:

**Interquartile Range**

Formula:

```text
IQR = Q3 - Q1
```

Common boundaries:

```text
Lower Bound = Q1 - 1.5 × IQR

Upper Bound = Q3 + 1.5 × IQR
```

Using Pandas:

```python
Q1 = df["Salary"].quantile(0.25)
Q3 = df["Salary"].quantile(0.75)

IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

outliers = df[
    (df["Salary"] < lower) |
    (df["Salary"] > upper)
]
```

---

# 1️⃣4️⃣ Standardize Units

This is a very important real-world problem.

Example:

```text
Height:
170 cm
1.75 m
180 cm
```

These cannot be directly compared without standardization.

Convert everything to one unit.

For example:

```text
Everything → centimeters
```

Similarly:

```text
kg / pounds
meters / kilometers
USD / PKR
```

---

# 1️⃣5️⃣ Clean Currency Data

Example:

```text
"Rs. 50,000"
"PKR 60000"
"70,000"
```

Convert them into a consistent numerical format.

Possible workflow:

```python
df["Salary"] = (
    df["Salary"]
    .str.replace("Rs.", "", regex=False)
    .str.replace("PKR", "", regex=False)
    .str.replace(",", "", regex=False)
    .str.strip()
)

df["Salary"] = pd.to_numeric(
    df["Salary"],
    errors="coerce"
)
```

Now you can perform numerical analysis.

---

# 1️⃣6️⃣ Rename Columns

Messy:

```text
Student Name
student-age
SALARY
```

Clean:

```python
df.rename(columns={
    "Student Name": "student_name",
    "student-age": "student_age",
    "SALARY": "salary"
}, inplace=True)
```

A common convention:

```text
snake_case
```

Example:

```text
student_name
study_hours
monthly_salary
date_of_birth
```

---

# 1️⃣7️⃣ Remove Unnecessary Columns

Sometimes datasets contain columns you don't need.

Example:

```text
Name
Age
Salary
Temporary_ID
Unnamed: 0
```

If a column is irrelevant:

```python
df.drop(
    columns=["Temporary_ID"],
    inplace=True
)
```

But first understand why it exists.

---

# 1️⃣8️⃣ Boolean / Yes-No Standardization

Messy:

```text
Yes
yes
YES
Y
1
True
```

You may want one consistent representation.

For example:

```text
Yes
No
```

Or:

```text
True
False
```

---

# 1️⃣9️⃣ Handle Special Characters

Example:

```text
"$50,000"
"50,000 PKR"
"50k"
```

Before analysis, these may need to be converted into consistent numerical values.

---

# 2️⃣0️⃣ Validate After Cleaning

This step is often forgotten.

After cleaning, check again:

```python
df.info()
df.isnull().sum()
df.duplicated().sum()
df.describe()
```

Also check:

```python
df.shape
df.dtypes
```

Ask:

```text
Are missing values handled?
Are duplicates handled?
Are data types correct?
Are categories consistent?
Are values valid?
Are dates correct?
Are units consistent?
```

---

# 🧪 The Most Important Data Cleaning Workflow

Use this as your mental checklist:

```text
1. Load Data
      ↓
2. Inspect Data
      ↓
3. Understand Columns
      ↓
4. Check Missing Values
      ↓
5. Check Duplicates
      ↓
6. Check Data Types
      ↓
7. Check Unique Values
      ↓
8. Standardize Text
      ↓
9. Fix Invalid Values
      ↓
10. Handle Outliers
      ↓
11. Standardize Units
      ↓
12. Remove Unnecessary Data
      ↓
13. Validate Everything
      ↓
14. Save Clean Dataset
```

---

# 🔍 Useful Inspection Commands

| Purpose                 | Pandas                     |
| ----------------------- | -------------------------- |
| First rows              | `df.head()`                |
| Last rows               | `df.tail()`                |
| Random rows             | `df.sample()`              |
| Dimensions              | `df.shape`                 |
| Column names            | `df.columns`               |
| Data types              | `df.dtypes`                |
| Complete info           | `df.info()`                |
| Statistics              | `df.describe()`            |
| Missing values          | `df.isnull().sum()`        |
| Duplicate rows          | `df.duplicated().sum()`    |
| Unique values           | `df["col"].unique()`       |
| Number of unique values | `df["col"].nunique()`      |
| Category frequency      | `df["col"].value_counts()` |

---

# 🧠 The 5 Questions You Should Ask About Every Dataset

When you receive a new dataset, ask:

### 1. What does each column mean?

```text
Don't clean what you don't understand.
```

### 2. What is wrong with the data?

Find:

```text
Missing
Duplicate
Invalid
Inconsistent
Wrong type
Outliers
```

### 3. Why is it wrong?

This is extremely important.

### 4. What is the correct treatment?

```text
Remove?
Replace?
Fill?
Convert?
Keep?
```

### 5. Did my cleaning actually work?

Always validate.

---

# ⚠️ Common Data Cleaning Mistakes

### ❌ Mistake 1

Deleting all missing rows immediately.

### ❌ Mistake 2

Deleting every outlier.

### ❌ Mistake 3

Changing data without understanding it.

### ❌ Mistake 4

Using mean for every missing numerical value.

### ❌ Mistake 5

Removing duplicates without understanding what a duplicate means.

### ❌ Mistake 6

Ignoring data types.

### ❌ Mistake 7

Ignoring inconsistent categories.

### ❌ Mistake 8

Cleaning but never validating afterward.

### ❌ Mistake 9

Modifying the original raw dataset.

---

# ⭐ Professional Tip: Keep Raw Data Safe

A very good habit is:

```text
data/
├── raw/
│   └── students.csv
│
├── cleaned/
│   └── students_cleaned.csv
│
└── processed/
    └── students_processed.csv
```

Think:

```text
RAW
 ↓
CLEANED
 ↓
PROCESSED
```

Never destroy your original raw dataset unless you have a specific reason.

---

# 🧠 Data Cleaning vs Data Preprocessing

These terms are related but not exactly identical.

| Data Cleaning              | Data Preprocessing          |
| -------------------------- | --------------------------- |
| Fix missing values         | Scale features              |
| Remove duplicates          | Encode categories           |
| Fix incorrect values       | Feature transformation      |
| Correct data types         | Feature engineering         |
| Standardize text           | Prepare ML input            |
| Handle data quality issues | Transform data for modeling |

Simple understanding:

```text
Data Cleaning
      ↓
Make data correct and reliable
      ↓
Data Preprocessing
      ↓
Make data suitable for analysis / ML
```

There can be overlap depending on the project and how people use the terms.

---

# 🌍 Real-World Example

Imagine a company gives you:

```text
customer_id | name | age | gender | salary | country
```

Raw data:

```text
1 | Ali    | 23  | Male   | Rs.50,000 | Pakistan
2 | Ahmed  | NaN | male   | 60000     | pakistan
3 | Ali    | 23  | Male   | Rs.50,000 | Pakistan
4 | Sara   | 250 | Female | 70000     | Pakistaan
```

You identify:

```text
❌ Missing age
❌ Duplicate record
❌ Gender inconsistency
❌ Country inconsistency
❌ Impossible/suspicious age
❌ Salary formatting inconsistency
```

After investigation:

```text
1 | Ali   | 23 | Male   | 50000 | Pakistan
2 | Ahmed | 24 | Male   | 60000 | Pakistan
3 | Sara  | ?  | Female | 70000 | Pakistan
```

The important part is not just the final table.

The important part is knowing **why each change was made**.

---

# 🧪 Mini Project — Real-World Data Cleaning

Create a messy **Student Performance Dataset**:

```text
student_id
name
age
gender
study_hours
attendance
marks
city
```

Intentionally introduce:

* Missing values
* Duplicate records
* Extra spaces
* Different capitalization
* Invalid ages
* Incorrect data types
* Inconsistent city names
* Outliers
* Different formats

Then create a complete cleaning pipeline:

```text
Raw Dataset
     ↓
Inspection
     ↓
Missing Values
     ↓
Duplicates
     ↓
Data Types
     ↓
Text Cleaning
     ↓
Invalid Values
     ↓
Outliers
     ↓
Standardization
     ↓
Validation
     ↓
Clean Dataset
```

Finally, save:

```text
students_raw.csv
students_cleaned.csv
```

Then use **Seaborn + Matplotlib** to perform EDA on the cleaned dataset.

---

# 🎯 Learning Goals

After completing **Class 21 — Data Cleaning**, you should understand:

* [ ] What Data Cleaning means
* [ ] Why real-world data is messy
* [ ] How to inspect a dataset
* [ ] Missing values
* [ ] Duplicate records
* [ ] Incorrect data types
* [ ] Inconsistent categories
* [ ] Text cleaning
* [ ] Date cleaning
* [ ] Invalid values
* [ ] Outliers
* [ ] IQR method
* [ ] Unit standardization
* [ ] Currency cleaning
* [ ] Column cleaning
* [ ] Removing unnecessary columns
* [ ] Mean vs median
* [ ] Validation
* [ ] Raw vs cleaned data
* [ ] Data Cleaning vs Data Preprocessing
* [ ] Complete cleaning workflow
* [ ] Real-world data quality problems

---

# ❓ Interview Questions

### Beginner

1. What is Data Cleaning?
2. Why is Data Cleaning important?
3. What are missing values?
4. How do you detect missing values in Pandas?
5. How do you remove duplicates?
6. How do you check data types?
7. What is data validation?

### Intermediate

8. How do you handle missing numerical values?
9. When would you use mean vs median?
10. What is an outlier?
11. Does every outlier need to be removed?
12. What is IQR?
13. How do you handle inconsistent categorical values?
14. How do you clean date columns?
15. How do you convert strings into numerical values?
16. What is the difference between Data Cleaning and Data Preprocessing?

### Practical

17. You have 30% missing values in a column. What would you do?
18. A salary column contains `"Rs. 50,000"`. How would you clean it?
19. A dataset contains `Male`, `male`, `MALE`. How would you standardize it?
20. A customer's age is `250`. What would you do?
21. How would you determine whether a duplicate row is actually a duplicate?
22. How would you validate a cleaned dataset?



# 📓 Notebook Strategy


```text
📖 Concept
   ↓
🤔 Why does this problem happen?
   ↓
🔍 How to detect it
   ↓
💻 How to fix it
   ↓
📤 Before → After
   ↓
🧠 Why did we choose this solution?
   ↓
🌍 Real-world example
   ↓
✏️ Practice
```