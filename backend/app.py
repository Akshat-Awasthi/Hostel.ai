from flask import Flask, request, jsonify
from pymongo import MongoClient
import joblib
import os
from flask_cors import CORS
from config import MONGO_URI, DB_NAME, COLLECTION_NAME
from utils import get_analytics_data, get_negative_reviews

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Load sentiment model and vectorizer
model = joblib.load(os.path.join("model", "sentiment_model.pkl"))
vectorizer = joblib.load(os.path.join("model", "vectorizer.pkl"))

@app.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    food = data.get('food')
    review_text = data.get('review')

    if not food or not review_text:
        return jsonify({"error": "food and review are required"}), 400

    # Predict sentiment
    X_tfidf = vectorizer.transform([review_text])
    sentiment_score = model.predict(X_tfidf)  # 0 or 1

    # Store in MongoDB
    doc = {
        "food": food,
        "review": review_text,
        "sentiment_score": int(sentiment_score)
    }
    collection.insert_one(doc)

    return jsonify({"message": "Review added successfully"}), 201

@app.route('/analytics', methods=['GET'])
def get_analytics():
    data = get_analytics_data(collection)
    return jsonify(data), 200

@app.route('/analytics/<food_item>', methods=['GET'])
def get_food_negative_reviews(food_item):
    negative_reviews = get_negative_reviews(collection, food_item)
    return jsonify({
        "food": food_item,
        "negative_reviews": negative_reviews
    }), 200

# Import and register the agent blueprint
from agent import agent_bp
app.register_blueprint(agent_bp)

if __name__ == '__main__':
    app.run(debug=True)
