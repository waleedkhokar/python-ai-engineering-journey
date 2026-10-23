# 🎬 Movie Review Classification System

A Machine Learning and Natural Language Processing (NLP) project that analyzes movie reviews and predicts whether the sentiment is **Positive or Negative**.

The system combines text preprocessing, a trained Machine Learning model, a Flask backend, and a web interface to provide sentiment predictions from user-submitted reviews.


##👩‍💻 About Me

Hi, I'm **Sania Salahuddin**, a Software Engineering student at the University of Sargodha, passionate about Artificial Intelligence, Machine Learning, and Full Stack Web Development.

I enjoy building practical applications that combine intelligent systems with user-friendly interfaces. This Movie Review Classification System demonstrates my work with Natural Language Processing, supervised Machine Learning, and Flask-based web development.

I'm continuously learning, building projects, and exploring new technologies.

- **GitHub:** [SaniaSalahuddin](https://github.com/SaniaSalahuddin)
- **LinkedIn:** [Connect with me](https://www.linkedin.com/in/sania-salahuddin-1a4781324/)
- **Portfolio:** [Visit my portfolio](https://sania-portfolio-2026.vercel.app/)


## 📸 Screenshots

### Application Interface
![Movie Review Classification Interface](screenshots/home.png)

### Positive Sentiment Prediction
![Positive sentiment prediction](screenshots/positive-prediction.png)

### Negative Sentiment Prediction
![Negative sentiment prediction](screenshots/negative-prediction.png)

## ✨ Features

- **Sentiment Classification:** Predicts positive or negative sentiment from a movie review.
- **Text Preprocessing:** Cleans review text using NLTK.
- **Stopword Removal:** Removes common English words during preprocessing.
- **Lemmatization:** Reduces words to their base forms using WordNet.
- **Machine Learning:** Uses a trained Logistic Regression classifier.
- **Flask Backend:** Integrates the trained model into a web application.
- **REST API:** Accepts review text and returns prediction results.
- **User Interface:** Provides an interface for entering and analyzing reviews.

## 🛠️ Tech Stack

- **Language:** Python
- **Machine Learning:** Scikit-learn, Logistic Regression
- **NLP:** NLTK
- **Backend:** Flask
- **Frontend:** HTML, CSS, JavaScript
- **Dataset:** IMDb movie reviews

## 🔄 How It Works

1. The user enters a movie review through the web interface.
2. The application preprocesses the review text.
3. The processed text is passed to the trained model pipeline.
4. The model predicts the sentiment.
5. The application returns and displays the prediction.

## 🧠 Machine Learning Workflow

1. Load labeled movie reviews.
2. Clean and preprocess the text.
3. Convert text into numerical features using a trained text vectorizer.
4. Train a Logistic Regression classifier.
5. Evaluate the model using appropriate classification metrics.
6. Save the trained pipeline for use in the Flask application.

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or a compatible version
- pip

### Installation

Clone your repository and navigate to the project folder:

```bash
git clone https://github.com/SaniaSalahuddin/python-ai-engineering-journey.git
cd python-ai-engineering-journey/03\ Machine-Learning/Projects/Movie-Review-Classification
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Ensure the trained model file, `model.pkl`, is available in the project directory and is compatible with your installed library versions.

### Run the Application

```bash
python app.py
```

Open `http://127.0.0.1:5000` in your browser.

## 📊 Model Evaluation

Accuracy, precision, recall, F1-score, and other relevant metrics should be added after evaluating the trained model. No performance figures are reported here because measured results have not yet been provided.

- 

## 🔮 Future Improvements

- Improve classification performance through model experimentation.
- Add a confusion matrix and classification report.
- Enhance the interface and user experience.
- Compare Logistic Regression with other Machine Learning models.
- Deploy the application for online access.



## ⚠️ Limitations

Predictions depend on the quality of the training data and the trained model. The system may misclassify reviews containing sarcasm, mixed opinions, or ambiguous language.

## 👩‍💻 Project Purpose

This project demonstrates practical application of NLP, supervised Machine Learning, model integration, REST API development, and frontend-backend communication.

