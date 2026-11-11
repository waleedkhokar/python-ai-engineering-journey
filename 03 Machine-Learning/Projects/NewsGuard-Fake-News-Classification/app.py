import pickle
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

model = pickle.load(open('model.pkl', 'rb'))
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict_news():

    try:

        data = request.get_json()

        title = data.get('title', '')
        text = data.get('text', '')

        if not title.strip() or not text.strip():

            return jsonify({
                'error': 'Please enter the text and title for analysis'
            }), 400

        combined_input = title + ' ' + text

        vectorized_input = vectorizer.transform(
            [combined_input]
        )

        predicted_news = model.predict(
            vectorized_input
        )[0]

        return jsonify({
            'prediction': predicted_news
        })

    except Exception as e:

        return jsonify({
            'error': str(e)
        }), 500


if __name__ == '__main__':
    app.run(
        debug=True,
        port=5000
    )