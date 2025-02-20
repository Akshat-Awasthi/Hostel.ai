import os
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import traceback
import json

# Import MongoDB configuration from config.py
from config import MONGO_URI, DB_NAME, COLLECTION_NAME, GEMINI_API_KEY

# Setup MongoDB connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Remove the environment variable check and use the config directly
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in config.py")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-thinking-exp-01-21')

# Create a Blueprint for agent-related endpoints
agent_bp = Blueprint('agent_bp', __name__)

@agent_bp.route('/agent', methods=['POST'])
def agent():
    try:
        payload = request.get_json()
        question = payload.get('question')
        food = payload.get('food')
        
        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Retrieve reviews from MongoDB
        try:
            # Filter by food item if provided
            query = {"food": food} if food else {}
            docs = list(collection.find(query, {"review": 1, "_id": 0}))
            
            if not docs:
                return jsonify({
                    "suggestions": f"# No Reviews Available\n\nThere are currently no reviews {f'for {food} ' if food else ''}in the database. Please add some reviews first to get AI-powered suggestions for improvement."
                }), 200

            reviews_list = [doc["review"] for doc in docs]
            context = "\n".join(reviews_list[:20])
            
        except Exception as db_error:
            print("Database error:", str(db_error))
            return jsonify({"error": "Database error"}), 500

        # Build the prompt
        prompt = (
            "You are an expert food quality and nutrition consultant with deep knowledge of mess food management. "
            "Analyze these customer reviews and provide detailed insights. Your response must follow this exact structure:\n\n"
            "1. Use these sections with proper spacing:\n"
            "   ## 🍽️ Key Findings\n"
            "   Brief overview of main points\n\n"
            "   ## 📊 Quality Analysis\n"
            "   Detailed analysis with bullet points\n\n"
            "   ## 🥗 Nutritional Insights\n"
            "   Health and nutrition details\n\n"
            "   ## 💡 Recommendations\n"
            "   Actionable suggestions\n\n"
            "2. Format Guidelines:\n"
            "   - Use emojis for better readability\n"
            "   - Use **bold** for important points\n"
            "   - Add spacing between sections\n"
            "   - Use these indicators:\n"
            "     🟢 for positives\n"
            "     🔴 for concerns\n"
            "     ⭐ for highlights\n"
            "     📌 for important notes\n"
            "     ✨ for improvements\n\n"
            f"Context: Analyzing{f' {food}' if food else ' mess food'} reviews\n\n"
            f"Reviews:\n{context}\n\n"
            f"Question: {question}\n\n"
            "Response (follow the exact structure with markdown formatting):\n\n"
        )

        # Generate content
        try:
            response = model.generate_content(prompt)
            if not response:
                return jsonify({"error": "No response from AI model"}), 500
            
            return jsonify({"suggestions": response.text}), 200
            
        except Exception as ai_error:
            print("AI generation error:", str(ai_error))
            print("Traceback:", traceback.format_exc())
            return jsonify({"error": "AI generation error"}), 500

    except Exception as e:
        print("Unexpected error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@agent_bp.route('/analyze-menu', methods=['POST'])
def analyze_menu():
    try:
        reviews = list(collection.find({}, {"review": 1, "food": 1, "_id": 0}))
        reviews_text = "\n".join([f"Food: {r.get('food', 'N/A')}, Review: {r.get('review', 'N/A')}" for r in reviews])
        
        data = request.get_json()
        menu_data = data.get('menuData')
        
        # Modified prompt to get structured data
        menu_analysis_prompt = (
            "You are a professional nutritionist. Analyze this mess menu and provide a structured analysis. "
            "For each day and meal combination, calculate approximate nutritional values and provide feedback. "
            "Return ONLY a JSON object in this EXACT format (no other text):\n\n"
            '{"analysis": [{'
            '"day": "Monday",'
            '"meal": "Breakfast",'
            '"nutritionalAnalysis": {'
            '"calories": 500,'
            '"protein": 15,'
            '"carbs": 60,'
            '"fats": 20'
            '},'
            '"reviewAnalysis": {'
            '"positive": "Good variety of items",'
            '"negative": "High in simple carbs"'
            '},'
            '"recommendations": "Consider adding more whole grains"'
            '}]}'
            f"\n\nMenu Data: {json.dumps(menu_data)}\n"
            f"Reviews: {reviews_text}\n"
            "\nRespond ONLY with the JSON object, no other text or explanations."
        )

        try:
            response = model.generate_content(menu_analysis_prompt)
            if not response or not response.text:
                return jsonify({"error": "No response from AI model"}), 500
            
            # Clean the response text to ensure it's valid JSON
            cleaned_response = response.text.strip()
            if not cleaned_response.startswith('{'):
                cleaned_response = cleaned_response[cleaned_response.find('{'):]
            if not cleaned_response.endswith('}'):
                cleaned_response = cleaned_response[:cleaned_response.rfind('}')+1]
            
            try:
                analysis_data = json.loads(cleaned_response)
                if not isinstance(analysis_data, dict) or 'analysis' not in analysis_data:
                    raise ValueError("Invalid response structure")
                return jsonify(analysis_data), 200
            except (json.JSONDecodeError, ValueError) as e:
                print("Invalid JSON response:", cleaned_response)
                return jsonify({"error": f"Invalid response format from AI: {str(e)}"}), 500
            
        except Exception as ai_error:
            print("AI generation error:", str(ai_error))
            print("Traceback:", traceback.format_exc())
            return jsonify({"error": "AI generation error"}), 500

    except Exception as e:
        print("Unexpected error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

@agent_bp.route('/generate-menu', methods=['POST'])
def generate_menu():
    try:
        reviews = list(collection.find({}, {"review": 1, "food": 1, "_id": 0}))
        reviews_text = "\n".join([f"Food: {r.get('food', 'N/A')}, Review: {r.get('review', 'N/A')}" for r in reviews])
        
        menu_generation_prompt = (
            "You are a professional nutritionist and menu planner. Generate a weekly mess menu with these specifications:\n"
            "1. Include all 7 days (Monday to Sunday)\n"
            "2. Each day must have exactly 4 meals: Breakfast, Lunch, Evening Snacks, and Dinner\n"
            "3. Each meal should have nutritional info and suggested improvements\n\n"
            "Return ONLY a JSON object in this EXACT format (no other text):\n"
            '{"newMenu": [\n'
            '  {\n'
            '    "day": "Monday",\n'
            '    "meals": [\n'
            '      {\n'
            '        "time": "Breakfast",\n'
            '        "items": ["item1", "item2", "item3"],\n'
            '        "nutritionalInfo": {\n'
            '          "calories": 500,\n'
            '          "protein": 15,\n'
            '          "carbs": 60,\n'
            '          "fats": 20\n'
            '        },\n'
            '        "improvements": "Improvement suggestion"\n'
            '      },\n'
            '      // repeat for Lunch, Evening Snacks, and Dinner\n'
            '    ]\n'
            '  },\n'
            '  // repeat for all days of the week\n'
            ']}'
            f"\n\nConsider these reviews for improvements: {reviews_text}\n"
            "\nRespond ONLY with the JSON object, no other text or explanations."
        )

        try:
            response = model.generate_content(menu_generation_prompt)
            if not response or not response.text:
                return jsonify({"error": "No response from AI model"}), 500
            
            # Clean and parse the response
            cleaned_response = response.text.strip()
            if not cleaned_response.startswith('{'):
                cleaned_response = cleaned_response[cleaned_response.find('{'):]
            if not cleaned_response.endswith('}'):
                cleaned_response = cleaned_response[:cleaned_response.rfind('}')+1]
            
            try:
                new_menu_data = json.loads(cleaned_response)
                if not isinstance(new_menu_data, dict) or 'newMenu' not in new_menu_data:
                    raise ValueError("Invalid response structure")
                return jsonify(new_menu_data), 200
            except (json.JSONDecodeError, ValueError) as e:
                print("Invalid JSON response:", cleaned_response)
                return jsonify({"error": f"Invalid response format from AI: {str(e)}"}), 500
            
        except Exception as ai_error:
            print("AI generation error:", str(ai_error))
            print("Traceback:", traceback.format_exc())
            return jsonify({"error": "AI generation error"}), 500

    except Exception as e:
        print("Unexpected error:", str(e))
        print("Traceback:", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(agent_bp)
    app.run(debug=True)
