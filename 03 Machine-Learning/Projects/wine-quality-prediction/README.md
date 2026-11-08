# Wine Quality Prediction using Linear Regression

## 📌 Project Overview

This project focuses on Exploratory Data Analysis (EDA) and Machine Learning using the Red Wine Quality dataset. The main objective is to explore the relationship between the chemical properties of red wine and its quality score using Linear Regression.

The project covers data inspection, visualization, outlier detection, data filtering, model training, and performance evaluation.

## 🎯 Objectives

- Explore and understand the Red Wine Quality dataset.
- Analyze relationships between chemical properties and wine quality.
- Visualize data using scatter plots and box plots.
- Identify potential outliers using Z-score and the Interquartile Range (IQR) method.
- Build Simple and Multiple Linear Regression models.
- Evaluate model performance using the R² score.

## 📊 Dataset Information

The dataset, `wine.csv`, contains information about the chemical properties and quality of red wine.

- **Number of records:** 1,599
- **Number of columns:** 12
- **Target variable:** `quality`

### Features

| Feature | Description |
|---|---|
| `fixed acidity` | Non-volatile acids in wine |
| `volatile acidity` | Volatile acidity level |
| `citric acid` | Citric acid content |
| `residual sugar` | Sugar remaining after fermentation |
| `chlorides` | Chloride concentration |
| `free sulfur dioxide` | Free sulfur dioxide content |
| `total sulfur dioxide` | Total sulfur dioxide content |
| `density` | Density of the wine |
| `pH` | Acidity or alkalinity level |
| `sulphates` | Sulphate concentration |
| `alcohol` | Alcohol content |
| `quality` | Wine quality score (target variable) |

## 🛠️ Technologies and Libraries

- **Python** — Programming language
- **Pandas** — Data manipulation and analysis
- **NumPy** — Numerical computations
- **Matplotlib** — Data visualization
- **Scikit-learn** — Linear Regression, train-test splitting, and model evaluation
- **SciPy** — Z-score calculation

## 🔍 Project Workflow

### 1. Data Loading and Inspection
- Load the dataset using Pandas.
- Examine the dataset shape, column names, and data types.
- Check for missing values and understand the data structure.

### 2. Exploratory Data Analysis (EDA)
- Explore the distribution of wine quality scores.
- Analyze relationships between chemical properties.
- Create scatter plots and box plots to understand patterns and potential outliers.

### 3. Data Preprocessing and Outlier Detection
- Calculate Z-scores to investigate extreme observations.
- Apply the Interquartile Range (IQR) method to identify potential outliers in `fixed acidity`.
- Filter observations outside the selected IQR boundaries.

### 4. Model Building
- Split the dataset into training and testing sets.
- Build a Multiple Linear Regression model using chemical properties to predict wine quality.
- Explore Simple Linear Regression using a selected feature.

### 5. Model Evaluation
- Evaluate the regression model using the R² score.
- Use the score to assess how well the model explains variation in wine quality.

## 📈 Results and Analysis

The notebook explores a baseline Multiple Linear Regression model using an 80:20 training-test split.

The reported baseline R² score is approximately **0.403**. This value should be interpreted as the proportion of variation explained by the model on the evaluated data, provided it is the score calculated on the test set.

The outlier analysis also examines the `fixed acidity` feature using the IQR method. The filtered dataset and its resulting model performance can be compared with the baseline to investigate the effect of outlier handling.

*Note: Results may vary depending on the data split, preprocessing steps, and model configuration.*

## 📉 Visualizations

The notebook explores relationships between selected features, including:

- pH vs. Wine Quality
- Alcohol vs. Wine Quality
- Alcohol vs. pH
- Box plots for identifying potential outliers

These visualizations help reveal patterns and relationships within the dataset.

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/wine-quality-prediction.git
cd wine-quality-prediction
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Install Dependencies

```bash
pip install pandas numpy matplotlib scikit-learn scipy
```

### 3. Open the Notebook

Open `Wine_Quality_Prediction.ipynb` in Google Colab or Jupyter Notebook.

### 4. Load the Dataset

Make sure `wine.csv` is available at the file path expected by the notebook. Update the path if necessary.

### 5. Run the Notebook

Execute the cells in order to perform data exploration, visualization, preprocessing, model training, and evaluation.

## 💡 Key Learnings

- Understanding a real-world tabular dataset.
- Performing exploratory data analysis.
- Creating meaningful data visualizations.
- Identifying potential outliers using statistical methods.
- Implementing Simple and Multiple Linear Regression.
- Evaluating regression performance using R².

## 🔮 Future Improvements

- Compare Linear Regression with other regression algorithms.
- Evaluate performance using MAE, MSE, and RMSE.
- Use cross-validation for more reliable model evaluation.
- Compare baseline and filtered-data model performance.
- Investigate additional preprocessing and feature-selection techniques.

## 👩‍💻 Author

**Khadija Mushtaq**

Machine Learning and Data Science Learner

---

*This project was developed for learning and practicing Exploratory Data Analysis and foundational Machine Learning techniques using Python.*
