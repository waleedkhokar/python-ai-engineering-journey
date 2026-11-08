
# 🎓 Student Exam Scores Analysis & Prediction

An end-to-end Machine Learning project that analyzes student academic performance and predicts exam scores using study habits, attendance, sleep duration, and previous academic results.

🔗 **Live Demo:** [Try Application](https://2zexyhfcqx5gfyrb8cpjkg.streamlit.app/)

## 📌 Project Overview

Student performance depends on multiple factors, including study time, attendance, sleep, and previous academic achievement. Understanding these factors can help identify patterns associated with academic outcomes.

This project uses data analysis, visualization, and regression models to explore student performance and predict exam scores from selected student-related features.

### 🎯 Problem Statement

The goal is to predict a student's exam score based on the following factors:

- Hours studied
- Sleep hours
- Attendance percentage
- Previous exam scores

The project demonstrates how Machine Learning can estimate continuous numerical values and help analyze relationships between student habits and academic performance.

## 📊 Dataset Information

The dataset contains **200 student records** and six columns.

| Feature | Description |
|---|---|
| `student_id` | Unique student identifier |
| `hours_studied` | Number of hours studied |
| `sleep_hours` | Hours of sleep |
| `attendance_percent` | Attendance percentage |
| `previous_scores` | Previous academic scores |
| `exam_score` | Exam score to be predicted |

**Data preprocessing and exploration:**
- Checked missing values.
- Checked duplicate records.
- Generated descriptive statistics.
- Analyzed feature correlations.
- Created visualizations to explore relationships between features and exam scores.

The notebook recorded zero missing values and zero duplicate rows.

## 🧠 Machine Learning Algorithms

### 1. Linear Regression — Primary Model

Linear Regression is the primary model used for prediction and evaluation in this notebook.

It learns a linear relationship between input features and the target variable, `exam_score`.

The model uses the following features:

```python
X = df[
    [
        "hours_studied",
        "sleep_hours",
        "attendance_percent",
        "previous_scores"
    ]
]

y = df["exam_score"]
```

The dataset is split into training and testing sets using an 80:20 ratio, with `random_state=42`.

### 2. Random Forest Regressor — Comparison Model

A Random Forest Regressor is also trained to compare its performance with Linear Regression.

The notebook explores different hyperparameters using `GridSearchCV` with five-fold cross-validation and R² scoring.

The best parameters recorded during hyperparameter tuning were:

- `n_estimators`: 500
- `max_depth`: 10
- `min_samples_split`: 5

In the recorded experiment, Random Forest achieved a lower test-set R² score than the primary Linear Regression model.

## 📈 Model Evaluation Metrics

The following results were recorded for the **Linear Regression model** on the held-out test set.

| Metric | Result |
|---|---:|
| Mean Absolute Error (MAE) | 2.31 |
| Mean Squared Error (MSE) | 7.76 |
| Root Mean Squared Error (RMSE) | 2.79 |
| R² Score | 0.8537 |

### What do these results mean?

- **MAE = 2.31:** Predictions differ from actual exam scores by approximately 2.31 score units on average.
- **MSE = 7.76:** Measures the average squared prediction error.
- **RMSE = 2.79:** Represents prediction error in the same units as the exam score.
- **R² = 0.8537:** The model explains approximately 85.37% of the variation in exam scores on the test set, relative to a mean-based baseline.

**Important:** This is a regression problem, so MAE, MSE, RMSE, and R² are more appropriate evaluation metrics than classification accuracy or F1-score.

## 🔍 Key Findings

Based on the notebook's exploratory analysis:

- Study hours have the strongest positive correlation with exam scores among the selected features, with a correlation of approximately `0.777`.
- Previous scores have a positive correlation with exam scores of approximately `0.431`.
- Attendance percentage has a positive correlation of approximately `0.226`.
- Sleep hours have a weaker positive correlation with exam scores of approximately `0.188`.

These are observed relationships in the dataset and do not, by themselves, establish causation.

## 🛠️ Technologies and Libraries

The notebook uses the following Python libraries:

- **Python** — Core programming language
- **Pandas** — Data manipulation and analysis
- **NumPy** — Numerical computations
- **Matplotlib** — Data visualization
- **Scikit-learn** — Regression models, train-test splitting, evaluation metrics, and hyperparameter tuning
- **Joblib** — Saving the trained model

**Streamlit** is used for the deployed web application.


### 3. Prepare the dataset

Download the dataset and update the CSV file path in your code to match your local dataset location.

For example:

```python
df = pd.read_csv("student_exam_scores.csv")
```

### 4. Run the Streamlit application

If the main application file is named `app.py`, run:

```bash
streamlit run app.py
```

The exact entry-point filename and additional setup requirements should match your repository.

## 💾 Save the Trained Model

The notebook saves the trained Linear Regression model using Joblib:

```python
import joblib

joblib.dump(model, "student_exam_model.pkl")
```

This saved model can be loaded into an application for predictions, provided the same feature order and preprocessing are used.


## 👩‍💻 Author

**Aleesha Nadeem**

AI & Machine Learning Enthusiast



