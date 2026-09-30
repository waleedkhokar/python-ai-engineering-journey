# 📊 Matplotlib — Data Visualization with Python

> **Step 2: Data Science**
>
> **Library 03: Matplotlib**
>
> **Date: February 5, 2024** 🎯
>
> **Class 19 — Matplotlib Fundamentals and Data Visualization**

Matplotlib is the third major library in my Data Science journey.

After learning **NumPy** for numerical computing and **Pandas** for working with structured data, I am now learning how to visualize data using Matplotlib.

The goal of this class is to understand how to turn numerical and tabular data into clear visualizations that help reveal patterns, trends, comparisons, and relationships.

---

# 🎯 What is Matplotlib?

**Matplotlib** is a Python library used to create data visualizations.

It can create many types of charts and plots, including:

- Line charts
- Bar charts
- Horizontal bar charts
- Histograms
- Scatter plots
- Pie charts
- Box plots
- Area plots
- Error bars
- Subplots
- Custom visualizations

Matplotlib is one of the most widely used visualization libraries in Python.

---

# 🧠 Why Learn Matplotlib?

Numbers and tables are useful, but visualizations can make patterns easier to understand.

For example:

```text
Raw Data

January     120
February    150
March       180
April       210
````

A table gives us the values.

A chart can make the trend immediately visible.

```text
Data
 ↓
Visualization
 ↓
Pattern
 ↓
Insight
```

This is an important part of Data Science and Exploratory Data Analysis.

---

# 📚 What I Will Learn

This Matplotlib course covers:

### Matplotlib Fundamentals

* What is Matplotlib?
* Why Matplotlib is used
* Installing Matplotlib
* Importing Matplotlib
* Matplotlib architecture
* `pyplot`
* Figures
* Axes
* Plots
* Understanding the plotting workflow

### Basic Plotting

* Creating a simple plot
* X-axis
* Y-axis
* Plotting points
* Plotting lines
* `plt.show()`

### Line Charts

* Basic line plot
* Multiple lines
* Line styles
* Line width
* Markers
* Marker size
* Marker styles
* Colors
* Labels
* Titles
* Grid
* Legends

### Customizing Charts

* Figure size
* Axis labels
* Titles
* Tick labels
* Tick rotation
* Axis limits
* Grid customization
* Legends
* Annotations
* Text
* Formatting

### Bar Charts

* Vertical bar charts
* Horizontal bar charts
* Multiple bars
* Grouped bars
* Stacked bars
* Bar labels
* Customizing bars

### Scatter Plots

* Basic scatter plot
* X and Y relationships
* Markers
* Marker size
* Multiple groups
* Color mapping
* Understanding correlation visually

### Histograms

* Basic histogram
* Bins
* Distribution
* Frequency
* Density
* Comparing distributions

### Pie Charts

* Creating pie charts
* Labels
* Percentages
* Explode
* Start angle
* Legends

### Box Plots

* Creating box plots
* Median
* Quartiles
* Interquartile range
* Whiskers
* Outliers
* Comparing distributions

### Area Charts

* Basic area plots
* Multiple areas
* Stacked areas

### Subplots

* Creating multiple plots
* Rows and columns
* `plt.subplot()`
* `plt.subplots()`
* Figure and Axes objects
* Sharing axes

### Object-Oriented Matplotlib

* Figure
* Axes
* Axis
* `fig, ax`
* `ax.plot()`
* `ax.bar()`
* `ax.scatter()`
* `ax.set_title()`
* `ax.set_xlabel()`
* `ax.set_ylabel()`
* `ax.legend()`

### Saving Visualizations

* Saving PNG
* Saving JPG
* Saving PDF
* DPI
* Transparent backgrounds
* Bounding boxes

### Data Visualization with Pandas

* Plotting Pandas Series
* Plotting DataFrames
* Line plots
* Bar plots
* Histograms
* Scatter plots

### Data Science Visualization

* Visualizing distributions
* Comparing categories
* Showing trends
* Exploring relationships
* Finding outliers
* Preparing charts for EDA

### Practical Projects

* Student performance
* Sales analysis
* Monthly revenue
* Product comparison
* Employee salaries
* Dataset visualization

---

# 🛠️ Installation

Install Matplotlib using:

```bash
pip install matplotlib
```

Verify installation:

```python
import matplotlib

print(matplotlib.__version__)
```

---

# 📦 Importing Matplotlib

The most common way to use Matplotlib is:

```python
import matplotlib.pyplot as plt
```

`plt` is the standard abbreviation used for `matplotlib.pyplot`.

---

# 🧠 Matplotlib Architecture

The most important objects to understand are:

```text
Figure
   ↓
Axes
   ↓
Axis
   ↓
Data
```

A simple mental model:

```text
Figure
└── Axes
    ├── X-axis
    ├── Y-axis
    ├── Title
    ├── Labels
    ├── Legend
    └── Plot
```

---

# 🖼️ Figure

A **Figure** is the overall container for a visualization.

Example:

```python
fig = plt.figure()
```

Think of the Figure as the complete canvas.

---

# 📈 Axes

An **Axes** is the actual area where the data is plotted.

Example:

```python
fig, ax = plt.subplots()
```

Here:

```text
fig → Figure
ax  → Axes
```

This object-oriented approach becomes very important for professional Matplotlib usage.

---

# 📊 First Matplotlib Plot

The simplest line plot:

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 20, 30, 40, 50]

plt.plot(x, y)

plt.show()
```

The result is a line connecting the given points.

---

# 🧩 Understanding the Plot

In:

```python
plt.plot(x, y)
```

we have:

```text
x → X-axis values
y → Y-axis values
```

For example:

```text
x = [1, 2, 3, 4, 5]
y = [10, 20, 30, 40, 50]
```

creates points:

```text
(1, 10)
(2, 20)
(3, 30)
(4, 40)
(5, 50)
```

Matplotlib connects these points to create the line.

---

# 🏷️ Adding a Title

```python
plt.title("Monthly Sales")
```

Example:

```python
plt.plot(x, y)

plt.title("Monthly Sales")

plt.show()
```

---

# 📝 Axis Labels

X-axis:

```python
plt.xlabel("Month")
```

Y-axis:

```python
plt.ylabel("Sales")
```

Complete example:

```python
plt.plot(x, y)

plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.show()
```

---

# 🔲 Adding a Grid

```python
plt.grid()
```

Example:

```python
plt.plot(x, y)

plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.grid()

plt.show()
```

Grid lines can make values easier to read.

---

# 🏷️ Adding a Legend

A legend explains what different lines or data series represent.

Example:

```python
plt.plot(x, y, label="Sales")

plt.legend()

plt.show()
```

---

# 📈 Line Charts

Line charts are useful for showing:

* Trends
* Changes over time
* Continuous data
* Growth
* Decline

Example:

```python
months = ["Jan", "Feb", "Mar", "Apr", "May"]
sales = [100, 150, 130, 180, 220]

plt.plot(months, sales)

plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.show()
```

---

# 📈 Multiple Lines

Multiple datasets can be displayed on one chart.

```python
months = ["Jan", "Feb", "Mar", "Apr"]

sales_2023 = [100, 120, 140, 160]
sales_2024 = [120, 150, 170, 200]

plt.plot(
    months,
    sales_2023,
    label="2023"
)

plt.plot(
    months,
    sales_2024,
    label="2024"
)

plt.title("Sales Comparison")

plt.xlabel("Month")
plt.ylabel("Sales")

plt.legend()

plt.show()
```

---

# 🎨 Line Styles

Matplotlib provides different line styles.

Examples:

```python
plt.plot(x, y, linestyle="-")
plt.plot(x, y, linestyle="--")
plt.plot(x, y, linestyle=":")
plt.plot(x, y, linestyle="-.")
```

Common styles:

| Style | Meaning  |
| ----- | -------- |
| `-`   | Solid    |
| `--`  | Dashed   |
| `:`   | Dotted   |
| `-.`  | Dash-dot |

---

# 🔘 Markers

Markers show individual data points.

Example:

```python
plt.plot(
    x,
    y,
    marker="o"
)
```

Common markers include:

```text
o
s
^
v
*
D
x
+
```

---

# 📏 Line Width

```python
plt.plot(
    x,
    y,
    linewidth=2
)
```

Line width controls how thick the line appears.

---

# 🎨 Colors

Matplotlib allows chart elements to be customized.

Example:

```python
plt.plot(
    x,
    y,
    color="blue"
)
```

You can also use hexadecimal color codes when creating custom visualizations.

---

# 📊 Bar Charts

Bar charts are useful for comparing categories.

Example:

```python
subjects = ["Math", "Science", "English"]
marks = [85, 90, 78]

plt.bar(subjects, marks)

plt.title("Student Marks")
plt.xlabel("Subject")
plt.ylabel("Marks")

plt.show()
```

---

# ↔️ Horizontal Bar Chart

Use:

```python
plt.barh()
```

Example:

```python
subjects = ["Math", "Science", "English"]
marks = [85, 90, 78]

plt.barh(subjects, marks)

plt.title("Student Marks")

plt.show()
```

---

# 📊 Multiple Bar Charts

Grouped bars can compare multiple categories.

Example:

```python
subjects = ["Math", "Science", "English"]

boys = [80, 85, 75]
girls = [90, 88, 82]
```

These values can be plotted side-by-side to compare groups.

---

# 📚 Stacked Bar Charts

Stacked bars display multiple components within the same category.

Example:

```python
plt.bar(
    categories,
    first_values
)

plt.bar(
    categories,
    second_values,
    bottom=first_values
)
```

Stacked bars are useful when we want to understand both:

```text
Total
+
Composition
```

---

# 🔵 Scatter Plots

Scatter plots show relationships between two numerical variables.

Example:

```python
hours = [1, 2, 3, 4, 5, 6]
marks = [50, 55, 65, 70, 80, 90]

plt.scatter(hours, marks)

plt.title("Study Hours vs Marks")
plt.xlabel("Study Hours")
plt.ylabel("Marks")

plt.show()
```

Scatter plots are useful for visually exploring relationships and possible correlation.

---

# 🧠 Understanding Scatter Plots

Suppose:

```text
X = Study Hours
Y = Marks
```

Each point represents one student.

```text
Student
   ↓
Study Hours + Marks
   ↓
One point
```

This allows us to visually inspect whether higher study hours appear associated with higher marks.

A visualization can show a pattern, but correlation or causation should not be concluded from a plot alone.

---

# 📊 Histograms

A histogram shows the distribution of numerical data.

Example:

```python
ages = [
    18, 19, 20, 20, 21,
    22, 22, 23, 24, 25
]

plt.hist(ages)

plt.title("Age Distribution")
plt.xlabel("Age")
plt.ylabel("Frequency")

plt.show()
```

---

# 🪣 Histogram Bins

Bins divide numerical values into ranges.

Example:

```python
plt.hist(
    ages,
    bins=5
)
```

The number of bins affects how detailed the distribution appears.

Too few bins:

```text
Less detail
```

Too many bins:

```text
More detail but potentially noisy
```

---

# 📊 Density Histogram

A histogram can also represent density.

```python
plt.hist(
    ages,
    bins=5,
    density=True
)
```

Density is useful when comparing distributions with different sample sizes.

---

# 🥧 Pie Charts

Pie charts show parts of a whole.

Example:

```python
labels = ["Python", "JavaScript", "Java"]
values = [50, 30, 20]

plt.pie(
    values,
    labels=labels
)

plt.title("Programming Language Usage")

plt.show()
```

---

# 📊 Percentages in Pie Charts

Use:

```python
plt.pie(
    values,
    labels=labels,
    autopct="%1.1f%%"
)
```

This displays percentages for each category.

---

# 💥 Exploding a Pie Slice

A slice can be separated from the rest.

```python
explode = [0.1, 0, 0]

plt.pie(
    values,
    labels=labels,
    explode=explode
)
```

---

# 📦 Box Plots

Box plots summarize the distribution of numerical data.

Example:

```python
marks = [45, 50, 55, 60, 65, 70, 75, 80, 95]

plt.boxplot(marks)

plt.title("Marks Distribution")

plt.show()
```

Box plots can help identify:

* Median
* Quartiles
* Spread
* Potential outliers

---

# 🧠 Box Plot Concepts

A box plot commonly represents:

```text
Minimum
   ↓
Q1
   ↓
Median
   ↓
Q3
   ↓
Maximum
```

Potential outliers may appear beyond the whiskers.

---

# 🌊 Area Charts

Area charts fill the region below a line.

Example:

```python
months = ["Jan", "Feb", "Mar", "Apr"]
sales = [100, 150, 130, 180]

plt.fill_between(
    months,
    sales
)

plt.title("Sales Trend")

plt.show()
```

Area charts can be useful for showing trends and cumulative-style visual patterns.

---

# 🖼️ Figure Size

Control figure dimensions:

```python
plt.figure(
    figsize=(10, 6)
)
```

Example:

```python
plt.figure(figsize=(10, 6))

plt.plot(x, y)

plt.show()
```

---

# 🔍 Axis Limits

Set X-axis limits:

```python
plt.xlim(0, 10)
```

Set Y-axis limits:

```python
plt.ylim(0, 100)
```

Both:

```python
plt.xlim(0, 10)
plt.ylim(0, 100)
```

---

# 🏷️ Tick Labels

Ticks can be customized.

Example:

```python
plt.xticks(rotation=45)
```

This is useful when category names are long.

---

# 📝 Adding Text

Matplotlib allows text to be added to a chart.

```python
plt.text(
    3,
    40,
    "Important Point"
)
```

---

# 📌 Annotations

Annotations can point to important values.

Example:

```python
plt.annotate(
    "Highest Sales",
    xy=(5, 220),
    xytext=(3, 250),
    arrowprops={"arrowstyle": "->"}
)
```

Annotations are useful when explaining an important point in a visualization.

---

# 🧩 Subplots

Multiple plots can be displayed in one figure.

Example:

```python
fig, axes = plt.subplots(
    2,
    2
)
```

This creates:

```text
┌────────────┬────────────┐
│   Plot 1   │   Plot 2   │
├────────────┼────────────┤
│   Plot 3   │   Plot 4   │
└────────────┴────────────┘
```

---

# 📊 Example of Subplots

```python
fig, axes = plt.subplots(2, 2)

axes[0, 0].plot(x, y)
axes[0, 1].bar(x, y)
axes[1, 0].scatter(x, y)
axes[1, 1].hist(y)

plt.tight_layout()

plt.show()
```

Subplots are useful when comparing multiple views of the same dataset.

---

# 🧠 Figure and Axes

A professional Matplotlib workflow often uses:

```python
fig, ax = plt.subplots()
```

Then:

```python
ax.plot(x, y)
```

Instead of:

```python
plt.plot(x, y)
```

---

# 🆚 Pyplot vs Object-Oriented Style

### Pyplot Style

```python
plt.plot(x, y)
plt.title("Sales")
plt.xlabel("Month")
plt.ylabel("Sales")

plt.show()
```

### Object-Oriented Style

```python
fig, ax = plt.subplots()

ax.plot(x, y)
ax.set_title("Sales")
ax.set_xlabel("Month")
ax.set_ylabel("Sales")

plt.show()
```

The object-oriented style becomes especially useful when creating:

* Multiple plots
* Subplots
* Complex visualizations
* Reusable visualization functions
* Professional dashboards and reports

---

# 📊 Multiple Axes

A Figure can contain multiple Axes objects.

Example:

```python
fig, axes = plt.subplots(
    1,
    2
)
```

This creates two separate plotting areas.

```text
Figure
│
├── Axes 1
│
└── Axes 2
```

---

# 📏 Tight Layout

Use:

```python
plt.tight_layout()
```

This helps prevent overlapping labels and chart elements.

---

# 💾 Saving Charts

Matplotlib can save visualizations.

```python
plt.savefig("sales_chart.png")
```

---

# 🖼️ Saving With DPI

DPI controls image resolution.

```python
plt.savefig(
    "sales_chart.png",
    dpi=300
)
```

Higher DPI is useful for high-quality reports and documents.

---

# 📄 Saving as PDF

```python
plt.savefig(
    "sales_chart.pdf"
)
```

Matplotlib supports several output formats depending on the backend and file extension.

---

# 🐼 Matplotlib with Pandas

Pandas can directly create Matplotlib-based plots.

Example:

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "Month": ["Jan", "Feb", "Mar", "Apr"],
    "Sales": [100, 150, 130, 180]
})

df.plot(
    x="Month",
    y="Sales"
)

plt.show()
```

This connects the previous two libraries:

```text
NumPy
   ↓
Pandas
   ↓
Matplotlib
   ↓
Visualization
```

---

# 📊 Visualizing DataFrames

Example:

```python
df["Sales"].plot(
    kind="line"
)

plt.show()
```

Bar chart:

```python
df["Sales"].plot(
    kind="bar"
)

plt.show()
```

Histogram:

```python
df["Sales"].plot(
    kind="hist"
)

plt.show()
```

Scatter:

```python
df.plot(
    x="Study_Hours",
    y="Marks",
    kind="scatter"
)

plt.show()
```

---

# 🎯 Choosing the Right Chart

Choosing the visualization depends on the question.

| Goal                       | Common Chart   |
| -------------------------- | -------------- |
| Show trend over time       | Line           |
| Compare categories         | Bar            |
| Compare many categories    | Horizontal bar |
| Show distribution          | Histogram      |
| Show relationship          | Scatter        |
| Show median and spread     | Box plot       |
| Show simple part-to-whole  | Pie            |
| Show cumulative/trend area | Area           |
| Compare multiple views     | Subplots       |

The chart should communicate the data clearly rather than simply making the visualization more complicated.

---

# 📈 Data Visualization Workflow

A typical workflow is:

```text
Dataset
   ↓
Pandas
   ↓
Clean Data
   ↓
Analyze Data
   ↓
Choose Visualization
   ↓
Matplotlib
   ↓
Customize Chart
   ↓
Interpret Pattern
   ↓
Generate Insight
```

---

# 🔬 Matplotlib in Exploratory Data Analysis

Matplotlib is extremely useful during EDA.

For example, after loading a dataset:

```text
Dataset
   ↓
Understand Columns
   ↓
Check Statistics
   ↓
Visualize Distributions
   ↓
Compare Categories
   ↓
Explore Relationships
   ↓
Identify Patterns
   ↓
Identify Possible Outliers
```

Common visualizations include:

```text
Histogram
Bar Chart
Box Plot
Scatter Plot
Line Chart
```

---

# 🌍 Real-World Applications

Matplotlib can be used for:

## 🛒 E-Commerce

* Monthly sales
* Product performance
* Revenue trends
* Customer analysis

## 🏦 Finance

* Stock prices
* Revenue
* Expenses
* Financial trends

## 🎓 Education

* Student marks
* Attendance
* Study hours
* Performance

## 🏥 Healthcare

* Patient statistics
* Test results
* Age distributions
* Treatment data

## 💼 Business

* Revenue
* Employees
* Sales
* KPIs
* Performance reports

## 🤖 Machine Learning

* Training loss
* Validation loss
* Accuracy
* Predictions
* Feature relationships
* Model evaluation

---

# 🤖 Matplotlib in Machine Learning

Matplotlib becomes useful when analyzing Machine Learning models.

For example:

```text
Training
   ↓
Model
   ↓
Predictions
   ↓
Evaluation
   ↓
Visualization
```

Possible visualizations include:

* Training loss
* Validation loss
* Accuracy
* Prediction vs actual values
* Residuals
* Confusion matrices
* Feature relationships

---

# 📊 Example — Training Loss

A Machine Learning model may produce:

```python
epochs = [1, 2, 3, 4, 5]
loss = [0.8, 0.6, 0.45, 0.35, 0.28]

plt.plot(epochs, loss)

plt.title("Training Loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")

plt.show()
```

This allows us to visually inspect how loss changes during training.

---

# 🧠 Important Matplotlib Concepts

By the end of this course, I should understand:

```text
Matplotlib
│
├── Installation
├── pyplot
│
├── Figure
├── Axes
├── Axis
│
├── Line Charts
├── Bar Charts
├── Horizontal Bars
├── Scatter Plots
├── Histograms
├── Pie Charts
├── Box Plots
├── Area Charts
│
├── Titles
├── Labels
├── Legends
├── Grid
├── Markers
├── Line Styles
├── Axis Limits
├── Tick Labels
├── Text
├── Annotations
│
├── Subplots
├── Figure Size
├── Object-Oriented API
│
├── Saving Figures
├── Pandas Integration
└── EDA Visualization
```

---

# 📋 Important Matplotlib Functions

| Function             | Purpose                |
| -------------------- | ---------------------- |
| `plt.plot()`         | Line chart             |
| `plt.bar()`          | Bar chart              |
| `plt.barh()`         | Horizontal bar         |
| `plt.scatter()`      | Scatter plot           |
| `plt.hist()`         | Histogram              |
| `plt.pie()`          | Pie chart              |
| `plt.boxplot()`      | Box plot               |
| `plt.fill_between()` | Area-style plot        |
| `plt.title()`        | Chart title            |
| `plt.xlabel()`       | X-axis label           |
| `plt.ylabel()`       | Y-axis label           |
| `plt.legend()`       | Legend                 |
| `plt.grid()`         | Grid                   |
| `plt.xlim()`         | X-axis limits          |
| `plt.ylim()`         | Y-axis limits          |
| `plt.xticks()`       | X-axis ticks           |
| `plt.yticks()`       | Y-axis ticks           |
| `plt.text()`         | Add text               |
| `plt.annotate()`     | Add annotation         |
| `plt.figure()`       | Create figure          |
| `plt.subplots()`     | Create figure and axes |
| `plt.tight_layout()` | Improve layout         |
| `plt.savefig()`      | Save visualization     |
| `plt.show()`         | Display visualization  |

---

# 🧪 Practice Exercises

## Exercise 01 — First Line Chart

Create a line chart showing:

```text
Days:
Monday
Tuesday
Wednesday
Thursday
Friday

Sales:
100
120
150
130
180
```

Add:

* Title
* X-axis label
* Y-axis label
* Grid
* Legend

---

# Exercise 02 — Student Marks

Create a bar chart showing marks for:

```text
Math
Science
English
Computer
Physics
```

Add:

* Title
* Axis labels
* Appropriate styling
* Value labels

---

# Exercise 03 — Study Hours vs Marks

Create a scatter plot:

```text
Study Hours
Marks
```

Use the plot to visually inspect the relationship.

---

# Exercise 04 — Age Distribution

Create a dataset of student ages and create a histogram.

Experiment with different numbers of bins.

---

# Exercise 05 — Sales Distribution

Create a sales dataset and create:

* Histogram
* Box plot

Use both visualizations to understand the distribution.

---

# Exercise 06 — Monthly Revenue

Create a line chart showing 12 months of revenue.

Include:

* Title
* Labels
* Grid
* Legend
* Markers

---

# Exercise 07 — Multiple Products

Create a grouped bar chart comparing three products across several months.

---

# Exercise 08 — Multiple Subplots

Create a `2 × 2` figure containing:

```text
Line Chart
Bar Chart
Scatter Plot
Histogram
```

---

# Exercise 09 — Pandas + Matplotlib

Create a Pandas DataFrame containing:

```text
Date
Product
Sales
```

Use Pandas and Matplotlib together to visualize the sales trend.

---

# 🚀 Mini Project — Student Performance Visualization

Create a complete visualization project.

Dataset:

```text
Student_ID
Name
Age
Gender
Study_Hours
Attendance
Math
Science
English
```

Create visualizations for:

### 1. Marks Distribution

Histogram of total or average marks.

### 2. Subject Comparison

Bar chart comparing average:

```text
Math
Science
English
```

### 3. Study Hours vs Marks

Scatter plot.

### 4. Attendance Distribution

Histogram.

### 5. Gender Comparison

Appropriate category comparison.

### 6. Student Performance

Box plot of marks.

### 7. Monthly / Sequential Trend

If time-based data is available, create a line chart.

### 8. Dashboard-Style Figure

Create multiple visualizations using subplots.

The goal is to turn a raw dataset into meaningful visual information.

---

# 💼 Interview Questions

## Beginner

1. What is Matplotlib?
2. Why is Matplotlib used?
3. How do you install Matplotlib?
4. How do you import Matplotlib?
5. What is `pyplot`?
6. How do you create a line chart?
7. How do you add a title?
8. How do you add axis labels?
9. How do you display a chart?
10. How do you add a legend?

---

## Intermediate

11. What is the difference between Figure and Axes?
12. What is the difference between `plt.plot()` and `ax.plot()`?
13. How do you create subplots?
14. How do you customize figure size?
15. How do you change axis limits?
16. How do you rotate tick labels?
17. How do you save a chart?
18. What is DPI?
19. What is a histogram?
20. What is a scatter plot?
21. What is a box plot?
22. What is the purpose of `tight_layout()`?

---

## Advanced Foundation

23. What is the Matplotlib object-oriented API?
24. Why is the object-oriented approach useful?
25. What is the relationship between Figure, Axes, and Axis?
26. How do you create multiple Axes?
27. How do you annotate a plot?
28. How does Matplotlib work with Pandas?
29. Which visualization would you choose for a time series?
30. Which visualization would you use to explore the relationship between two numerical variables?
31. How can visualizations support EDA?
32. Why does visualization not automatically prove causation?

---

# 🧠 Visualization Decision Guide

Before creating a chart, ask:

```text
What am I trying to understand?
             ↓
      What type of data?
             ↓
      What is my goal?
             ↓
       Choose a chart
```

Examples:

```text
Trend
 ↓
Line Chart
```

```text
Category Comparison
 ↓
Bar Chart
```

```text
Distribution
 ↓
Histogram / Box Plot
```

```text
Relationship
 ↓
Scatter Plot
```

```text
Simple Part-to-Whole
 ↓
Pie Chart
```

Choosing the correct visualization is more important than adding unnecessary styling.

---

# 🔗 NumPy → Pandas → Matplotlib

These three libraries now form an important Data Science foundation.

```text
NumPy
  ↓
Numerical Computing
  ↓
Pandas
  ↓
Data Manipulation & Analysis
  ↓
Matplotlib
  ↓
Data Visualization
```

Together:

```text
Raw Data
   ↓
Pandas
   ↓
Clean Data
   ↓
NumPy
   ↓
Numerical Operations
   ↓
Matplotlib
   ↓
Visualization
   ↓
Insights
```

---

# 🎯 Learning Goals

After completing Matplotlib, I should be able to:

* Understand what Matplotlib is.
* Explain why visualization is important.
* Import Matplotlib correctly.
* Create line charts.
* Create bar charts.
* Create horizontal bar charts.
* Create scatter plots.
* Create histograms.
* Create pie charts.
* Create box plots.
* Create area charts.
* Customize chart titles.
* Add axis labels.
* Add legends.
* Add grids.
* Customize markers.
* Customize line styles.
* Set axis limits.
* Customize ticks.
* Add annotations.
* Create subplots.
* Understand Figure and Axes.
* Use the object-oriented Matplotlib API.
* Save charts to files.
* Use Matplotlib with Pandas.
* Visualize datasets during EDA.
* Select appropriate charts for different analytical goals.

---

# 📂 Folder Structure

```text
03-Matplotlib/
│
├── README.md
└── class19.ipynb
```

### README.md

Contains:

* Matplotlib overview
* Complete topic roadmap
* Important concepts
* Chart types
* Important functions
* Learning goals
* Practice exercises
* Mini project
* Interview questions
* Key takeaways

### class19.ipynb

Contains the complete practical Matplotlib course:

```text
Markdown
   ↓
Explanation
   ↓
Code
   ↓
Output
   ↓
Chart
   ↓
Chart Explanation
   ↓
Real-World Example
   ↓
Practice
```

---

# 📓 Notebook Structure

The practical notebook will follow this order:

```text
1. Title
2. Learning Objectives
3. What is Matplotlib?
4. Why Visualization?
5. Installation
6. Importing Matplotlib
7. Matplotlib Architecture
8. Figure
9. Axes
10. First Plot
11. Line Charts
12. Multiple Lines
13. Line Styles
14. Markers
15. Bar Charts
16. Horizontal Bar Charts
17. Grouped Bars
18. Stacked Bars
19. Scatter Plots
20. Histograms
21. Pie Charts
22. Box Plots
23. Area Charts
24. Titles
25. Axis Labels
26. Legends
27. Grid
28. Figure Size
29. Axis Limits
30. Tick Customization
31. Text
32. Annotations
33. Subplots
34. Figure and Axes
35. Object-Oriented Matplotlib
36. Saving Figures
37. Pandas Integration
38. EDA Visualization
39. Real-World Examples
40. Mini Project
41. Practice Exercises
42. Key Takeaways
43. Interview Questions
44. Navigation
```

Each major concept will follow:

```text
📖 Explanation
      ↓
💡 Simple Example
      ↓
💻 Code
      ↓
📊 Visualization
      ↓
🧠 Explain the Chart
      ↓
🌍 Real-World Use
      ↓
✏️ Practice
```

---

# 🔑 Key Takeaways

* Matplotlib is a Python library for data visualization.
* It can create many types of charts and plots.
* `pyplot` provides a convenient plotting interface.
* A Figure is the overall visualization container.
* Axes represent the actual plotting area.
* Line charts are useful for trends.
* Bar charts are useful for category comparisons.
* Scatter plots help explore relationships between numerical variables.
* Histograms show distributions.
* Box plots summarize distributions and can highlight potential outliers.
* Pie charts can show simple parts of a whole.
* Subplots allow multiple visualizations in one Figure.
* The object-oriented API provides a powerful way to build more complex visualizations.
* Matplotlib works closely with Pandas.
* Visualization is an important part of EDA.
* A good visualization should communicate information clearly.

> **Data tells us what happened. Visualization helps us see the pattern.**

---

# 🚀 Data Science Learning Path

Current progress:

```text
Step 2 — Data Science
│
├── 01 NumPy          ✅
│
├── 02 Pandas         ✅
│
├── 03 Matplotlib     ← Current
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

The goal of learning Matplotlib is not simply to memorize plotting functions.

The goal is to understand how to transform analyzed data into meaningful visual information.

```text
Data
 ↓
Analysis
 ↓
Visualization
 ↓
Pattern
 ↓
Insight
```

Matplotlib is therefore an important bridge between:

```text
Data Analysis
      ↓
Data Visualization
      ↓
Data Science
      ↓
Machine Learning
      ↓
AI Engineering
```

---

# 📚 Navigation

### Previous

[← Pandas — Class 18](../02-Pandas/README.md)

### Current

**Matplotlib — Class 19**

### Next

Seaborn — Class 20

---

# 📊 Data Science Journey

> **Learn the data → Clean the data → Analyze the data → Visualize the data → Find insights → Build intelligent systems**

**Python → NumPy → Pandas → Matplotlib → Seaborn → EDA → Statistics → Machine Learning**
