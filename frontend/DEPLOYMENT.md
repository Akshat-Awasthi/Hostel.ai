# Free Deployment Guide

## Free Deployment Options

### Frontend (React + Vite)
**GitHub Pages** (Completely Free)
1. Install gh-pages:
```bash
npm install gh-pages --save-dev
```

2. Update package.json:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Backend (Flask)
**Render** (Free Tier)
- Offers free web services
- 512 MB RAM
- Automatic HTTPS
- Sleep after 15 minutes of inactivity

### Database
**MongoDB Atlas** (Free M0 Cluster)
- 512 MB storage
- Shared RAM
- Perfect for small applications

## Step-by-Step Deployment

### 1. Frontend Deployment (GitHub Pages)

1. Push your code to GitHub
2. Update vite.config.js:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
})
```

3. Deploy:
```bash
npm run deploy
```

### 2. Backend Deployment (Render)

1. Create account on Render.com
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure:
   ```
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```
5. Add environment variables in Render dashboard

### 3. Database Setup (MongoDB Atlas)

1. Create free account on MongoDB Atlas
2. Create M0 (free) cluster
3. Set up database access:
   - Create user with read/write access
   - Add IP address 0.0.0.0/0 for access from anywhere
4. Get connection string
5. Add to Render environment variables

## Required Configuration Files

1. **requirements.txt** (for Render):
```text
Flask==2.2.3
Flask-Cors==3.0.10
gunicorn==20.1.0
pymongo==4.3.3
google-generativeai==0.3.2
scikit-learn==1.2.2
pandas==1.5.3
```

2. **vite.config.js** update:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

## Important Notes

1. **Render Free Tier Limitations**:
   - Service sleeps after 15 minutes of inactivity
   - Wakes up on next request (may take a few seconds)
   - 512 MB RAM limit

2. **MongoDB Atlas Free Tier Limitations**:
   - 512 MB storage
   - Shared resources
   - No dedicated RAM

3. **GitHub Pages Limitations**:
   - Only static content
   - No server-side processing

## Environment Variables

1. Create .env file for local development
2. Add these variables to Render:
```
MONGO_URI=your_mongodb_uri
DB_NAME=your_db_name
COLLECTION_NAME=your_collection_name
GEMINI_API_KEY=your_gemini_api_key
```

## Accessing Your Deployed App

- Frontend: https://yourusername.github.io/your-repo-name
- Backend: https://your-app-name.onrender.com
- Database: MongoDB Atlas cloud interface

## Monitoring Free Tools

1. **Render Dashboard**:
   - Basic logs
   - Deploy status
   - Error monitoring

2. **MongoDB Atlas**:
   - Database metrics
   - Connection monitoring
   - Performance alerts

## Tips for Free Tier

1. **Optimize Backend**:
   - Minimize dependencies
   - Use efficient queries
   - Implement caching

2. **Manage Database Size**:
   - Regular cleanup of old data
   - Implement data limits
   - Use efficient indexing

3. **Handle Cold Starts**:
   - Implement loading states in frontend
   - Use lightweight dependencies
   - Optimize initial load time 