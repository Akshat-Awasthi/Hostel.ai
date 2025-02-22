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
    print(f"Received data for review: {data}")  # Debugging

    food = data.get('food')
    review_text = data.get('review')

    if not food or not review_text:
        print("Error: Missing food or review")  # Debugging
        return jsonify({"error": "food and review are required"}), 400

    try:
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
        print("Review added successfully")  # Debugging

        return jsonify({"message": "Review added successfully"}), 201
    except Exception as e:
        print(f"Error in /reviews endpoint: {e}")  # Debugging
        return jsonify({"error": "Internal server error"}), 500

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

@app.route('/leave', methods=['POST'])
def submit_leave_request():
    data = request.get_json()
    name = data.get('name')
    roll_number = data.get('roll_number')
    reason = data.get('reason')
    date = data.get('date')

    if not name or not roll_number or not reason or not date:
        return jsonify({"error": "All fields are required"}), 400

    # Store leave request in MongoDB
    leave_request = {
        "name": name,
        "roll_number": roll_number,
        "reason": reason,
        "date": date
    }
    collection.insert_one(leave_request)

    return jsonify({"message": "Leave request submitted successfully"}), 201

@app.route('/complaint', methods=['POST'])
def submit_complaint():
    data = request.get_json()
    email = data.get('email')
    topic = data.get('topic')
    subject = data.get('subject')
    description = data.get('description')

    if not email or not topic or not subject or not description:
        return jsonify({"error": "All fields are required"}), 400

    # Store complaint in MongoDB
    complaint = {
        "email": email,
        "topic": topic,
        "subject": subject,
        "description": description
    }
    collection.insert_one(complaint)

    return jsonify({"message": "Complaint submitted successfully"}), 201

# Import and register the agent blueprint
from agent import agent_bp
app.register_blueprint(agent_bp)

if __name__ == '__main__':
    app.run(debug=True)
