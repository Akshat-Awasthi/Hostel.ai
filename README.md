# Hostel Management System

A modern web application for managing hostel operations, featuring food review analysis, menu management, and AI-powered insights.

## 🚀 Features

- 📊 Dashboard with analytics
- 🍽️ Food review system with sentiment analysis
- 🤖 AI-powered menu analysis and suggestions
- 📅 Menu management system
- 📈 Analytics visualization
- 🔄 Real-time feedback system

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Chart.js for analytics

### Backend
- Python Flask
- MongoDB
- Scikit-learn for ML
- Google Gemini AI
- Flask-CORS

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.9 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd hostel-management-system
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the ML model (ensure you have f.csv in the backend directory)
python train_model.py

# Start the Flask server
python app.py
```

3. **Setup Frontend**
```bash
cd ../
npm install
npm run dev
```

4. **Configure Environment**

Create a `config.py` file in the backend directory:
```python
MONGO_URI = "your_mongodb_uri"
DB_NAME = "your_db_name"
COLLECTION_NAME = "your_collection_name"
GEMINI_API_KEY = "your_gemini_api_key"
```

### 🌐 Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📝 API Endpoints

- `POST /reviews` - Submit food reviews
- `GET /analytics` - Get general analytics
- `GET /analytics/<food_item>` - Get food-specific analytics
- `POST /agent` - Get AI-powered insights
- `POST /analyze-menu` - Analyze menu nutritional value
- `POST /generate-menu` - Generate AI-powered menu suggestions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React + Vite template
- TailwindCSS for styling
- Google Gemini AI for intelligent insights
- MongoDB for database management
- Flask for backend API
