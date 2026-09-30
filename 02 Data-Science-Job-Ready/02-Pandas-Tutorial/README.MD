# 🐼 Pandas — Data Analysis with Python

> **Step 2: Data Science**
>
> **Library 02: Pandas**
>
> **Date: February 3, 2024** 🎯
>
> **Class 18 — Pandas Fundamentals and Data Analysis**

Pandas is the second major library in my Data Science journey.

It is one of the most important Python libraries for working with structured data, data cleaning, data analysis, and exploratory data analysis.

The goal of this class is not only to learn Pandas functions, but to understand how to use Pandas to work with real-world datasets.

---

# 🎯 What is Pandas?

**Pandas** is an open-source Python library designed for:

- Data manipulation
- Data analysis
- Data cleaning
- Data transformation
- Data exploration
- Working with structured datasets
- Handling missing values
- Grouping and aggregating data
- Reading and writing data files

Pandas is especially useful when working with data represented as:

- Tables
- Rows
- Columns
- CSV files
- Excel files
- SQL results
- JSON data

Example:

```python
import pandas as pd

data = {
    "Name": ["Ali", "Ahmed", "Sara"],
    "Age": [22, 25, 21],
    "Marks": [85, 90, 88]
}

df = pd.DataFrame(data)

print(df)
````

Output:

```text
    Name  Age  Marks
0    Ali   22     85
1  Ahmed   25     90
2   Sara   21     88
```

This table is called a:

> **DataFrame**

---

# 🧠 Why Learn Pandas?

Raw data is rarely ready for analysis.

Real-world datasets can contain:

```text
Missing values
Duplicate rows
Incorrect data types
Invalid values
Inconsistent text
Unnecessary columns
Outliers
Different formats
```

Pandas provides tools to inspect, clean, transform, and analyze this data.

The general workflow is:

```text
Raw Data
   ↓
Load Data
   ↓
Inspect Data
   ↓
Clean Data
   ↓
Transform Data
   ↓
Analyze Data
   ↓
Visualize Data
   ↓
Insights
```

This workflow is fundamental to Data Science.

---

# 📚 What I Will Learn

This Pandas course covers the complete foundation needed for practical Data Science.

---

# 1️⃣ Pandas Installation

Install Pandas using:

```bash
pip install pandas
```

Verify the installation:

```python
import pandas as pd

print(pd.__version__)
```

---

# 2️⃣ Importing Pandas

The standard way to import Pandas is:

```python
import pandas as pd
```

The `pd` abbreviation is the commonly used convention.

---

# 3️⃣ Pandas Data Structures

Pandas mainly provides two important data structures:

```text
Series
DataFrame
```

---

# 📌 Series

A Pandas Series is a one-dimensional labeled data structure.

Example:

```python
import pandas as pd

marks = pd.Series([85, 90, 78, 92])

print(marks)
```

Output:

```text
0    85
1    90
2    78
3    92
dtype: int64
```

A Series contains:

* Values
* Index
* Data type

---

# 📊 DataFrame

A DataFrame is a two-dimensional labeled data structure.

It looks similar to a table or spreadsheet.

Example:

```python
data = {
    "Name": ["Ali", "Ahmed", "Sara"],
    "Age": [22, 25, 21],
    "Marks": [85, 90, 88]
}

df = pd.DataFrame(data)

print(df)
```

Structure:

```text
Rows    → Records
Columns → Features / Variables
```

A DataFrame is one of the most important concepts in Pandas.

---

# 🔄 Series vs DataFrame

| Feature    | Series          | DataFrame        |
| ---------- | --------------- | ---------------- |
| Dimension  | 1D              | 2D               |
| Structure  | Single column   | Multiple columns |
| Similar to | List / column   | Table            |
| Has index  | Yes             | Yes              |
| Common use | Single variable | Complete dataset |

Example:

```text
Series

Age
---
22
25
21
```

```text
DataFrame

Name     Age    Marks
---------------------
Ali      22     85
Ahmed    25     90
Sara     21     88
```

---

# 🏗️ Creating DataFrames

A DataFrame can be created from many different sources.

## From Dictionary

```python
data = {
    "Name": ["Ali", "Ahmed", "Sara"],
    "Age": [22, 25, 21],
    "Marks": [85, 90, 88]
}

df = pd.DataFrame(data)
```

---

## From List of Lists

```python
data = [
    ["Ali", 22, 85],
    ["Ahmed", 25, 90],
    ["Sara", 21, 88]
]

df = pd.DataFrame(
    data,
    columns=["Name", "Age", "Marks"]
)

print(df)
```

---

# 📂 Reading Data from Files

One of the most important uses of Pandas is loading datasets.

---

# CSV Files

```python
df = pd.read_csv("students.csv")
```

CSV is one of the most common formats used in Data Science.

---

# Excel Files

```python
df = pd.read_excel("students.xlsx")
```

---

# JSON Files

```python
df = pd.read_json("students.json")
```

---

# SQL Data

Pandas can also work with SQL query results.

Example:

```python
df = pd.read_sql(query, connection)
```

This makes Pandas useful for backend and database-based applications as well.

---

# 🔍 Inspecting a Dataset

After loading a dataset, the first step is to understand what it contains.

Important methods include:

```python
df.head()
df.tail()
df.shape
df.columns
df.index
df.info()
df.describe()
```

---

# 👀 `head()`

Displays the first rows.

```python
df.head()
```

By default, it shows the first 5 rows.

You can specify the number:

```python
df.head(10)
```

---

# 🔚 `tail()`

Displays the last rows.

```python
df.tail()
```

---

# 📐 `shape`

Shows:

```text
(rows, columns)
```

Example:

```python
print(df.shape)
```

Output:

```text
(100, 5)
```

This means:

```text
100 rows
5 columns
```

---

# 📋 `columns`

Shows the column names.

```python
print(df.columns)
```

---

# 🔢 `index`

Shows the DataFrame index.

```python
print(df.index)
```

---

# ℹ️ `info()`

Provides important information about the dataset.

```python
df.info()
```

It can show:

* Number of rows
* Column names
* Non-null values
* Data types
* Memory usage

---

# 📊 `describe()`

Provides statistical information about numerical columns.

```python
df.describe()
```

It can show:

* Count
* Mean
* Standard deviation
* Minimum
* 25th percentile
* Median
* 75th percentile
* Maximum

---

# 🎯 Selecting Columns

Select one column:

```python
df["Name"]
```

Select multiple columns:

```python
df[["Name", "Marks"]]
```

---

# 🔎 Selecting Rows

Pandas provides:

```text
loc
iloc
```

---

# 📍 `loc`

`loc` selects data using labels.

Example:

```python
df.loc[0]
```

Select specific rows and columns:

```python
df.loc[0:2, ["Name", "Marks"]]
```

---

# 🔢 `iloc`

`iloc` selects data using integer positions.

Example:

```python
df.iloc[0]
```

Select rows:

```python
df.iloc[0:3]
```

Select rows and columns:

```python
df.iloc[0:3, 0:2]
```

---

# 🆚 `loc` vs `iloc`

| Method | Selection      |
| ------ | -------------- |
| `loc`  | Label-based    |
| `iloc` | Position-based |

Example:

```python
df.loc[2]
```

means:

> Select row with label `2`.

```python
df.iloc[2]
```

means:

> Select the third row by position.

---

# ✂️ Filtering Data

Filtering is one of the most important Pandas skills.

Example:

```python
df[df["Marks"] > 80]
```

This returns students whose marks are greater than 80.

---

# 🔗 Multiple Conditions

Use:

```text
&
|
~
```

Examples:

```python
df[(df["Age"] > 20) & (df["Marks"] > 80)]
```

OR:

```python
df[(df["Age"] > 20) | (df["Marks"] > 80)]
```

NOT:

```python
df[~(df["Marks"] > 80)]
```

---

# 🔍 `isin()`

Check whether values belong to a list.

```python
df[df["Name"].isin(["Ali", "Sara"])]
```

---

# 🔎 `between()`

Filter values within a range.

```python
df[df["Age"].between(20, 25)]
```

---

# 🧹 Missing Data

Real-world datasets often contain missing values.

Example:

```text
Name     Age     Salary
Ali      22      50000
Ahmed    NaN     60000
Sara     24      NaN
```

Pandas provides tools to handle missing values.

Important methods:

```python
isna()
isnull()
notna()
dropna()
fillna()
```

---

# 🔍 Detecting Missing Values

```python
df.isna()
```

Count missing values:

```python
df.isna().sum()
```

---

# 🗑️ Removing Missing Values

```python
df.dropna()
```

Remove rows containing missing values.

---

# 🩹 Filling Missing Values

```python
df["Age"] = df["Age"].fillna(25)
```

You can also use statistical values.

Example:

```python
df["Age"] = df["Age"].fillna(df["Age"].mean())
```

---

# 🔄 Changing Data Types

Check data types:

```python
df.dtypes
```

Convert a column:

```python
df["Age"] = df["Age"].astype(int)
```

Other useful types include:

```text
int
float
str
bool
datetime
category
```

---

# 📅 Working with Dates

Pandas provides powerful tools for dates.

Example:

```python
df["Date"] = pd.to_datetime(df["Date"])
```

Extract:

```python
df["Year"] = df["Date"].dt.year
df["Month"] = df["Date"].dt.month
df["Day"] = df["Date"].dt.day
```

Date handling is very important for real-world datasets.

---

# 📝 Working with Text

Pandas provides the `.str` accessor for text operations.

Examples:

```python
df["Name"].str.lower()
```

```python
df["Name"].str.upper()
```

```python
df["Name"].str.strip()
```

```python
df["Name"].str.contains("Ali")
```

Other useful operations include:

* `replace()`
* `contains()`
* `startswith()`
* `endswith()`
* `split()`
* `len()`

---

# ➕ Creating New Columns

Pandas makes it easy to create calculated columns.

Example:

```python
df["Total"] = df["Math"] + df["Science"]
```

Another example:

```python
df["Passed"] = df["Marks"] >= 50
```

---

# ✏️ Updating Columns

Example:

```python
df["Age"] = df["Age"] + 1
```

This increases every age by one.

---

# 🗑️ Removing Columns

Use:

```python
df.drop("Age", axis=1)
```

To modify the original DataFrame:

```python
df.drop("Age", axis=1, inplace=True)
```

A safer and often clearer approach is to assign the result:

```python
df = df.drop("Age", axis=1)
```

---

# 🗑️ Removing Rows

Example:

```python
df.drop(0)
```

Remove multiple rows:

```python
df.drop([0, 1])
```

---

# 🔄 Renaming Columns

Rename one column:

```python
df.rename(
    columns={"Marks": "Score"},
    inplace=True
)
```

Rename multiple columns:

```python
df.rename(
    columns={
        "Name": "Student_Name",
        "Marks": "Score"
    },
    inplace=True
)
```

---

# 🔁 Sorting Data

Sort by one column:

```python
df.sort_values("Marks")
```

Descending:

```python
df.sort_values("Marks", ascending=False)
```

Sort by multiple columns:

```python
df.sort_values(
    ["Age", "Marks"],
    ascending=[True, False]
)
```

---

# 🧮 Aggregation

Pandas provides many aggregation functions.

Common functions:

```text
sum()
mean()
median()
min()
max()
count()
std()
var()
```

Example:

```python
print(df["Marks"].mean())
print(df["Marks"].max())
print(df["Marks"].min())
```

---

# 📊 GroupBy

`groupby()` is one of the most important Pandas concepts.

It allows us to group data based on a category and perform calculations.

Example:

```python
df.groupby("Department")["Salary"].mean()
```

This calculates the average salary for each department.

---

# 📦 GroupBy with Multiple Aggregations

```python
df.groupby("Department")["Salary"].agg(
    ["count", "mean", "min", "max"]
)
```

This can provide multiple statistics for each group.

---

# 🔗 Combining DataFrames

Pandas provides several ways to combine datasets.

Important operations:

```text
concat()
merge()
join()
```

---

# ➕ `concat()`

Used to combine DataFrames vertically or horizontally.

Example:

```python
result = pd.concat([df1, df2])
```

---

# 🔗 `merge()`

Used to combine datasets using common columns.

Example:

```python
result = pd.merge(
    customers,
    orders,
    on="customer_id"
)
```

This is similar to a SQL JOIN.

---

# 🆚 Pandas Merge and SQL JOIN

| Pandas        | SQL               |
| ------------- | ----------------- |
| `merge()`     | `JOIN`            |
| `on=`         | `ON`              |
| `how="inner"` | `INNER JOIN`      |
| `how="left"`  | `LEFT JOIN`       |
| `how="right"` | `RIGHT JOIN`      |
| `how="outer"` | `FULL OUTER JOIN` |

This is especially useful when working with databases.

---

# 📋 Removing Duplicates

Find duplicates:

```python
df.duplicated()
```

Count duplicates:

```python
df.duplicated().sum()
```

Remove duplicates:

```python
df.drop_duplicates()
```

---

# 🧹 Data Cleaning

Data cleaning is one of the most important parts of Data Science.

A typical cleaning process:

```text
Raw Dataset
     ↓
Check Shape
     ↓
Check Data Types
     ↓
Check Missing Values
     ↓
Check Duplicates
     ↓
Fix Incorrect Values
     ↓
Clean Text
     ↓
Convert Data Types
     ↓
Handle Outliers
     ↓
Clean Dataset
```

---

# 📊 Data Analysis

Once the data is clean, we can analyze it.

Examples:

```python
df["Salary"].mean()
```

```python
df.groupby("Department")["Salary"].mean()
```

```python
df.sort_values("Salary", ascending=False)
```

```python
df[df["Salary"] > 100000]
```

---

# 📈 Exploratory Data Analysis

Pandas is one of the main tools used during **Exploratory Data Analysis (EDA)**.

EDA means exploring a dataset to understand:

* Structure
* Distributions
* Relationships
* Patterns
* Missing values
* Outliers
* Categories
* Trends

Typical workflow:

```text
Load Dataset
     ↓
Understand Dataset
     ↓
Clean Dataset
     ↓
Analyze Columns
     ↓
Explore Relationships
     ↓
Find Patterns
     ↓
Visualize
     ↓
Generate Insights
```

Visualization will later be handled using:

```text
Matplotlib
Seaborn
```

---

# 📊 Pivot Tables

Pandas provides pivot tables for summarizing data.

Example:

```python
pd.pivot_table(
    df,
    values="Sales",
    index="Region",
    columns="Product",
    aggfunc="sum"
)
```

Pivot tables are useful for:

* Business analysis
* Sales analysis
* Reporting
* Summarizing large datasets

---

# 🪟 Crosstab

Pandas also provides:

```python
pd.crosstab(
    df["Department"],
    df["Gender"]
)
```

This creates a frequency table between categories.

---

# 🔢 Unique Values

Find unique values:

```python
df["Department"].unique()
```

Count unique values:

```python
df["Department"].nunique()
```

Count occurrences:

```python
df["Department"].value_counts()
```

These are extremely useful during data exploration.

---

# 📊 Sampling Data

Get random rows:

```python
df.sample(5)
```

This is useful when inspecting large datasets.

---

# 🔄 Resetting Index

After filtering or removing rows, indexes may become non-sequential.

Use:

```python
df.reset_index(drop=True, inplace=True)
```

---

# 🧠 Setting an Index

A column can be used as the DataFrame index.

```python
df.set_index("Student_ID", inplace=True)
```

Reset it:

```python
df.reset_index(inplace=True)
```

---

# 📁 Exporting Data

Pandas can save processed data into different formats.

---

# CSV

```python
df.to_csv("cleaned_data.csv", index=False)
```

---

# Excel

```python
df.to_excel("cleaned_data.xlsx", index=False)
```

---

# JSON

```python
df.to_json("cleaned_data.json")
```

This allows us to build a complete data workflow:

```text
Read
  ↓
Clean
  ↓
Analyze
  ↓
Transform
  ↓
Export
```

---

# ⚡ Vectorized Operations

Pandas supports vectorized operations.

Instead of manually looping through every row:

```python
df["Salary"] = df["Salary"] * 1.10
```

This applies the operation to the entire column.

Vectorization is an important concept because it makes data operations concise and efficient.

---

# 🧩 `apply()`

Pandas allows functions to be applied to data.

Example:

```python
def add_bonus(salary):
    return salary + 5000

df["New_Salary"] = df["Salary"].apply(add_bonus)
```

A lambda function can also be used:

```python
df["New_Salary"] = df["Salary"].apply(
    lambda salary: salary + 5000
)
```

`apply()` is useful, but vectorized operations should generally be preferred when a direct vectorized solution exists.

---

# 🧠 `map()`

`map()` is useful for transforming values in a Series.

Example:

```python
mapping = {
    "M": "Male",
    "F": "Female"
}

df["Gender"] = df["Gender"].map(mapping)
```

---

# 🔄 `replace()`

Replace values:

```python
df["Gender"] = df["Gender"].replace(
    {"M": "Male", "F": "Female"}
)
```

---

# 🧮 `query()`

Pandas provides a readable way to filter data.

Example:

```python
df.query("Age > 25")
```

Multiple conditions:

```python
df.query("Age > 25 and Salary > 50000")
```

---

# 🗂️ MultiIndex

Pandas also supports multiple index levels.

Example:

```python
df.set_index(
    ["Department", "Employee"]
)
```

This creates a hierarchical index.

MultiIndex is useful for more advanced data analysis.

---

# 📅 Time Series Data

Pandas is especially powerful for time-based data.

Important concepts include:

* Datetime
* Date ranges
* Resampling
* Time-based indexing
* Time differences
* Rolling calculations

Example:

```python
dates = pd.date_range(
    start="2024-01-01",
    periods=10
)

print(dates)
```

---

# 📈 Rolling Calculations

Rolling calculations are useful for time-series analysis.

Example:

```python
df["Rolling_Average"] = (
    df["Sales"]
    .rolling(3)
    .mean()
)
```

This calculates a moving average over three observations.

---

# 🧪 Practical Data Science Workflow

A complete Pandas workflow can look like this:

```text
                DATA SCIENCE WORKFLOW

                    Dataset
                       ↓
                 Load with Pandas
                       ↓
                 Inspect Dataset
                       ↓
              ┌────────┴────────┐
              ↓                 ↓
        Missing Values      Duplicates
              ↓                 ↓
             Clean             Clean
              └────────┬────────┘
                       ↓
                 Data Types
                       ↓
                Transform Data
                       ↓
                  Filter Data
                       ↓
                 Group & Analyze
                       ↓
                 Find Patterns
                       ↓
                 Visualization
                       ↓
                    Insights
```

---

# 🌍 Real-World Pandas Examples

Pandas can be used in many domains.

## 🛒 E-Commerce

Analyze:

* Orders
* Customers
* Products
* Revenue
* Discounts
* Shipping
* Sales trends

---

## 🏦 Finance

Analyze:

* Transactions
* Revenue
* Expenses
* Investments
* Financial trends

---

## 🏥 Healthcare

Analyze:

* Patients
* Medical records
* Treatments
* Test results
* Hospital data

---

## 🎓 Education

Analyze:

* Students
* Marks
* Attendance
* Courses
* Performance

---

## 💼 Business

Analyze:

* Employees
* Departments
* Salaries
* Sales
* Customers
* KPIs

---

# 🤖 Pandas in Machine Learning

Pandas is commonly used before training Machine Learning models.

Typical workflow:

```text
CSV Dataset
     ↓
Pandas
     ↓
Load Data
     ↓
Clean Data
     ↓
Explore Data
     ↓
Transform Data
     ↓
Separate Features & Target
     ↓
NumPy / ML Framework
     ↓
Machine Learning Model
```

For example:

```python
X = df[["Age", "Income", "Experience"]]

y = df["Salary"]
```

Here:

```text
X → Features
y → Target
```

This becomes important in the Machine Learning stage.

---

# 🐼 Pandas vs NumPy

| Feature             | NumPy               | Pandas             |
| ------------------- | ------------------- | ------------------ |
| Main purpose        | Numerical computing | Data analysis      |
| Main structure      | ndarray             | Series / DataFrame |
| Labels              | Limited             | Built-in           |
| Tables              | Not its main focus  | Excellent          |
| Missing data        | Basic tools         | Extensive tools    |
| CSV handling        | Not primary         | Excellent          |
| Data cleaning       | Limited             | Extensive          |
| Grouping            | Limited             | Powerful           |
| SQL-like operations | Limited             | Merge / Join       |
| Data Science        | Foundation          | Core tool          |

A simple mental model:

```text
NumPy
  ↓
Numerical Arrays

Pandas
  ↓
Structured Data
```

---

# 🧠 Important Pandas Concepts

By the end of this course, I should understand:

```text
Pandas
│
├── Series
├── DataFrame
│
├── Creating Data
├── Reading Files
│   ├── CSV
│   ├── Excel
│   ├── JSON
│   └── SQL
│
├── Inspecting Data
│   ├── head()
│   ├── tail()
│   ├── info()
│   ├── describe()
│   └── shape
│
├── Selecting Data
│   ├── []
│   ├── loc
│   └── iloc
│
├── Filtering
│   ├── Conditions
│   ├── isin()
│   └── between()
│
├── Cleaning
│   ├── Missing Values
│   ├── Duplicates
│   ├── Data Types
│   └── Text Cleaning
│
├── Transformation
│   ├── New Columns
│   ├── apply()
│   ├── map()
│   └── replace()
│
├── Sorting
├── GroupBy
├── Aggregation
├── Merge
├── Join
├── Concat
├── Pivot Tables
├── Crosstab
├── Time Series
├── Rolling Operations
└── Exporting Data
```

---

# 📋 Important Pandas Functions

| Function / Method      | Purpose                  |
| ---------------------- | ------------------------ |
| `pd.Series()`          | Create a Series          |
| `pd.DataFrame()`       | Create a DataFrame       |
| `pd.read_csv()`        | Read CSV                 |
| `pd.read_excel()`      | Read Excel               |
| `pd.read_json()`       | Read JSON                |
| `df.head()`            | First rows               |
| `df.tail()`            | Last rows                |
| `df.info()`            | Dataset information      |
| `df.describe()`        | Statistical summary      |
| `df.shape`             | Rows and columns         |
| `df.columns`           | Column names             |
| `df.dtypes`            | Data types               |
| `df.loc[]`             | Label-based selection    |
| `df.iloc[]`            | Position-based selection |
| `df.isna()`            | Detect missing values    |
| `df.dropna()`          | Remove missing values    |
| `df.fillna()`          | Fill missing values      |
| `df.drop_duplicates()` | Remove duplicates        |
| `df.sort_values()`     | Sort data                |
| `df.groupby()`         | Group data               |
| `pd.merge()`           | Merge DataFrames         |
| `pd.concat()`          | Concatenate DataFrames   |
| `df.rename()`          | Rename columns           |
| `df.drop()`            | Remove rows/columns      |
| `df.value_counts()`    | Count values             |
| `df.unique()`          | Get unique values        |
| `df.nunique()`         | Count unique values      |
| `df.apply()`           | Apply function           |
| `df.map()`             | Map values               |
| `pd.to_datetime()`     | Convert to datetime      |
| `pd.pivot_table()`     | Create pivot table       |
| `df.to_csv()`          | Export CSV               |
| `df.to_excel()`        | Export Excel             |
| `df.to_json()`         | Export JSON              |

---

# 🎯 Learning Goals

After completing Pandas, I should be able to:

* Understand what Pandas is.
* Explain why Pandas is used in Data Science.
* Understand Series and DataFrame.
* Create DataFrames.
* Load datasets from different file formats.
* Inspect datasets.
* Select rows and columns.
* Understand `loc` and `iloc`.
* Filter datasets.
* Work with missing values.
* Remove duplicates.
* Change data types.
* Clean text data.
* Work with dates.
* Create new columns.
* Update and remove columns.
* Sort data.
* Group and aggregate data.
* Merge multiple datasets.
* Concatenate datasets.
* Create pivot tables.
* Analyze categorical data.
* Work with time-series data.
* Export cleaned datasets.
* Prepare data for Machine Learning.
* Perform the Pandas portion of an EDA workflow.

---

# 🧪 Practice Exercises

## Exercise 01 — Create a DataFrame

Create a student DataFrame containing:

```text
Name
Age
Gender
Marks
City
```

Perform:

* Display the DataFrame
* Display first rows
* Display last rows
* Check shape
* Check columns
* Check data types

---

## Exercise 02 — Student Analysis

Using a student dataset:

Calculate:

* Average marks
* Highest marks
* Lowest marks
* Number of students
* Students above average
* Students who passed

---

## Exercise 03 — Filtering

Filter students:

* Age > 20
* Marks > 80
* Marks between 60 and 90
* Students from Islamabad
* Students who passed

---

## Exercise 04 — Missing Values

Create a dataset containing missing values.

Practice:

* Detect missing values
* Count missing values
* Remove missing values
* Fill missing values
* Fill numerical missing values using the mean

---

## Exercise 05 — Data Cleaning

Create a dataset containing:

* Duplicate rows
* Missing values
* Incorrect capitalization
* Extra spaces
* Incorrect data types

Clean the complete dataset.

---

## Exercise 06 — GroupBy

Create an employee dataset containing:

```text
Employee
Department
Salary
Age
```

Calculate:

* Average salary by department
* Maximum salary by department
* Minimum salary by department
* Number of employees by department

---

## Exercise 07 — Merge

Create two DataFrames:

```text
Customers
Orders
```

Connect them using:

```text
customer_id
```

Practice:

* Inner merge
* Left merge
* Right merge
* Outer merge

---

## Exercise 08 — Sales Analysis

Create a sales dataset containing:

```text
Date
Product
Category
Region
Quantity
Price
```

Calculate:

* Total revenue
* Average order value
* Best-selling product
* Revenue by category
* Revenue by region
* Monthly sales
* Highest sales day

---

# 🚀 Mini Project — Student Performance Analysis

Create a complete Pandas project using a student dataset.

Dataset:

```text
Student_ID
Name
Age
Gender
City
Study_Hours
Attendance
Math
Science
English
```

Perform:

### Step 1 — Load Data

Load the dataset into Pandas.

### Step 2 — Inspect

Check:

* Shape
* Columns
* Data types
* Missing values
* Duplicates

### Step 3 — Clean

Handle:

* Missing values
* Duplicate records
* Incorrect data types
* Inconsistent text

### Step 4 — Transform

Create:

```text
Total_Marks
Average_Marks
Pass_Fail
Performance
```

### Step 5 — Analyze

Find:

* Average marks
* Highest marks
* Lowest marks
* Average attendance
* Average study hours
* Best-performing students
* Students below average
* Performance by city
* Performance by gender

### Step 6 — Prepare for Visualization

Prepare summary tables that can later be visualized using:

```text
Matplotlib
Seaborn
```

---

# 💼 Interview Questions

## Beginner

1. What is Pandas?
2. Why is Pandas used?
3. What is a Series?
4. What is a DataFrame?
5. What is the difference between Series and DataFrame?
6. How do you create a DataFrame?
7. How do you read a CSV file?
8. What does `head()` do?
9. What does `info()` do?
10. What does `describe()` do?

---

## Intermediate

11. What is the difference between `loc` and `iloc`?
12. How do you filter rows in Pandas?
13. How do you handle missing values?
14. What is the difference between `dropna()` and `fillna()`?
15. How do you remove duplicate rows?
16. How do you change a column's data type?
17. How do you rename columns?
18. How do you sort a DataFrame?
19. What is `groupby()`?
20. What is aggregation?

---

## Advanced Foundation

21. What is the difference between `merge()`, `join()`, and `concat()`?
22. How does Pandas handle indexes?
23. What is a MultiIndex?
24. What is vectorization?
25. When should you use `apply()`?
26. What is the difference between `map()` and `apply()`?
27. How do you work with datetime data?
28. What are pivot tables?
29. How does Pandas support EDA?
30. How is Pandas used before Machine Learning?

---

# 🧠 Mental Model

Think of Pandas as a tool that turns raw data into understandable information.

```text
Raw Data
   ↓
Pandas
   ↓
Understand
   ↓
Clean
   ↓
Transform
   ↓
Analyze
   ↓
Insights
```

For example:

```text
CSV File
   ↓
pd.read_csv()
   ↓
DataFrame
   ↓
df.info()
   ↓
Clean Data
   ↓
Filter
   ↓
GroupBy
   ↓
Statistics
   ↓
Visualization
   ↓
Insights
```

---

# 📓 Notebook Structure

The practical notebook will be:

```text
02-Pandas/
│
├── README.md
└── class18.ipynb
```

The notebook will follow a proper course structure.

```text
1. Title
2. Learning Objectives
3. What is Pandas?
4. Why Pandas?
5. Installation
6. Importing Pandas
7. Series
8. DataFrame
9. Creating DataFrames
10. Reading CSV
11. Reading Excel
12. Reading JSON
13. Dataset Inspection
14. Selecting Columns
15. loc
16. iloc
17. Filtering
18. Missing Values
19. Data Cleaning
20. Data Types
21. Text Operations
22. Date Operations
23. Creating Columns
24. Updating Data
25. Removing Data
26. Sorting
27. GroupBy
28. Aggregation
29. Merge
30. Join
31. Concat
32. Pivot Tables
33. Crosstab
34. Unique Values
35. Value Counts
36. Apply / Map
37. Time Series
38. Rolling Operations
39. Exporting Data
40. EDA Workflow
41. Real-World Example
42. Mini Project
43. Practice Exercises
44. Key Takeaways
45. Interview Questions
46. Navigation
```

Each section will follow:

```text
📖 Explanation
      ↓
💡 Simple Example
      ↓
💻 Code
      ↓
📤 Output
      ↓
🧠 Explanation of Output
      ↓
🌍 Real-World Use
      ↓
✏️ Practice
```

The purpose is to make the notebook understandable even for someone learning Pandas for the first time.

---

# 📁 Folder Structure

```text
02-Pandas/
│
├── README.md
└── class18.ipynb
```

### README.md

Contains:

* Pandas overview
* Complete topic roadmap
* Important concepts
* Functions
* Learning goals
* Practice exercises
* Mini project
* Interview questions
* Key takeaways

### class18.ipynb

Contains the complete practical Pandas course with:

* Markdown explanations
* Code examples
* Outputs
* Notes
* Real-world examples
* Exercises
* Mini project

---

# 🔗 Connection With NumPy

NumPy and Pandas work closely together.

```text
NumPy
  ↓
Numerical Arrays
  ↓
Pandas
  ↓
DataFrames
  ↓
Data Analysis
```

Pandas can work with NumPy arrays:

```python
import numpy as np
import pandas as pd

numbers = np.array([10, 20, 30, 40])

df = pd.DataFrame({
    "Numbers": numbers
})

print(df)
```

Understanding NumPy first makes it easier to understand the numerical foundation behind Pandas.

---

# 🚀 Data Science Roadmap

Current progress:

```text
Step 2 — Data Science
│
├── 01 NumPy          ✅
│
├── 02 Pandas         ← Current
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

Then:

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

The goal of learning Pandas is not simply to memorize functions.

The goal is to become comfortable working with real-world structured data.

I should be able to take:

```text
Raw Dataset
```

and perform:

```text
Load
 ↓
Inspect
 ↓
Clean
 ↓
Transform
 ↓
Filter
 ↓
Group
 ↓
Analyze
 ↓
Prepare for Visualization / ML
```

This creates the practical Data Science foundation required for the next stages of my AI Engineering journey.

---

# 🔑 Key Takeaways

* Pandas is a major Python library for data analysis.
* The two core structures are `Series` and `DataFrame`.
* DataFrames represent structured tabular data.
* Pandas can read CSV, Excel, JSON, and SQL data.
* `head()`, `tail()`, `info()`, and `describe()` help understand datasets.
* `loc` and `iloc` are important for selecting data.
* Boolean filtering allows specific records to be selected.
* Missing values can be detected, removed, or filled.
* Pandas provides powerful data-cleaning tools.
* `groupby()` is essential for grouped analysis.
* `merge()`, `join()`, and `concat()` allow datasets to be combined.
* Pivot tables and crosstabs help summarize data.
* Pandas is heavily used during EDA.
* Pandas prepares data for visualization and Machine Learning.
* Pandas and NumPy work closely together.

> **NumPy gives me the numerical foundation. Pandas gives me the tools to work with structured data.**

---

# 📚 Navigation

### Previous

[← NumPy — Class 17](../01-NumPy/README.md)

### Current

**Pandas — Class 18**

### Next

Matplotlib — Class 19

---

# 🐼 Data Science Journey

> **Learn the fundamentals → Work with real data → Analyze → Visualize → Build Machine Learning systems**

**Python → NumPy → Pandas → Matplotlib → Seaborn → EDA → Statistics → Machine Learning**