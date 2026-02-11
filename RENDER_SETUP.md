# Render.com Deployment Setup Guide

## Problem You're Facing
API endpoint not found at `https://ai-chat-assistant-vfan.onrender.com/ask-ai`

**This means:** Your frontend is trying to connect to itself instead of the backend service.

## Root Cause
You likely deployed **ONLY the frontend** as a static site. You need **BOTH**:
1. **Backend service** (Node.js Web Service)
2. **Frontend service** (Static Site)

## Solution: Deploy Both Services

### OPTION 1: Use render.yaml (RECOMMENDED)

#### Step 1: Delete Current Frontend Service
1. Go to https://dashboard.render.com
2. Find your frontend service (e.g., `ai-chat-assistant-vfan`)
3. Go to **Settings** (⚙️)
4. Scroll to bottom → **Delete Service**
5. Confirm deletion

#### Step 2: Deploy Using render.yaml
This repo has `render.yaml` that deploys BOTH services automatically:

1. Go to https://dashboard.render.com/new
2. Click **Blueprint** (not Web Service)
3. Connect your GitHub repository
4. Click "Deploy Blueprint"
5. Render will read `render.yaml` and create:
   - `voice-ai-backend` (Node.js Web Service) 
   - `voice-ai-frontend` (Static Site)

#### Step 3: Get Your Backend URL
After deployment completes (15-20 minutes):
1. Go to Dashboard
2. Click **voice-ai-backend**
3. Copy the URL (e.g., `https://voice-ai-backend.onrender.com`)

#### Step 4: Update Frontend Environment Variable
1. Click **voice-ai-frontend**
2. Go to **Environment**
3. Find `VITE_API_URL` 
4. Change it to your backend URL from Step 3
5. Click **Save**
6. Click **Manual Deploy** to rebuild

---

### OPTION 2: Manual Setup (If Option 1 doesn't work)

#### Create Backend Service
1. Go to https://dashboard.render.com/new
2. Click **Web Service**
3. Connect GitHub repository
4. Settings:
   - **Name:** `voice-ai-backend`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** *(leave blank or enter `backend`)*
5. Click **Create Web Service**
6. Wait 10-15 minutes for deployment
7. **Copy the service URL** (e.g., `https://voice-ai-backend.onrender.com`)

#### Create Frontend Service  
1. Go to https://dashboard.render.com/new
2. Click **Static Site**
3. Settings:
   - **Name:** `voice-ai-frontend`
   - **Environment Variables:**
     - `VITE_API_URL` = `https://voice-ai-backend.onrender.com` (from previous step)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Root Directory:** *(leave blank)*
4. Click **Create Static Site**
5. Wait for deployment to complete

---

## Verify It's Working

### Check Backend is Running
1. In browser, visit your backend URL + `/health`
   - Example: `https://voice-ai-backend.onrender.com/health`
2. You should see: `{"status":"OK"...}`
3. If not: Check backend service logs on Render

### Check Frontend Knows About Backend
1. Open frontend URL in browser
2. Press **F12** (Console)
3. Look for `[API Config]` message
4. Should show:
   ```
   API_URL: https://voice-ai-backend.onrender.com
   ```
   NOT the frontend URL!

### Test the App
1. Click microphone
2. Speak: "What is AI?"
3. Should work without 404 error ✅

---

## Common Problems & Fixes

### Backend service never shows up
- Make sure you deleted the old frontend first (Step 1)
- Blueprint deploy reads `render.yaml` and creates both services
- Takes 15-20 minutes total

### Still seeing frontend URL in error
- `VITE_API_URL` environment variable not set
- Go to frontend service → Environment → Make sure `VITE_API_URL` is there
- If you just added it, click **Manual Deploy** on frontend

### 502 Bad Gateway error
- Backend is still booting (Render startup can take 30 seconds)
- Wait 30 seconds and try again
- Check backend logs for errors

### Cannot find `/ask-ai` endpoint
- Backend service not running
- Check backend service logs on Render
- Might need to restart the service

---

## Service Structure on Render

After successful deployment, you should have:

```
Render Dashboard
├─ voice-ai-backend (Web Service - Node.js)
│  ├─ Status: Live
│  ├─ URL: https://voice-ai-backend.onrender.com
│  └─ Environment: NODE_ENV=production
│
└─ voice-ai-frontend (Static Site)
   ├─ Status: Live  
   ├─ URL: https://voice-ai-frontend.onrender.com
   └─ Environment: VITE_API_URL=https://voice-ai-backend.onrender.com
```

---

## Local Development

For testing locally before deploying:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
# Automatically proxies /api to http://localhost:5000
```

No environment variables needed for local development.

---

## Still Not Working?

### Get Exact Backend URL
1. Dashboard → voice-ai-backend → Copy the URL from the large button at top
2. Go to frontend Environment
3. Set `VITE_API_URL` to EXACTLY that URL (no trailing slash)
4. Click Save
5. Manual Deploy on frontend
6. Wait 5-10 minutes
7. Check console again (F12)

### Check Service Logs
1. Dashboard → backend service
2. Click **Logs** tab
3. Look for errors in startup
4. Common issue: `GEMINI_API_KEY` not set (if not using Google AI, no worries)

### Last Resort - Delete & Rebuild
1. Delete both services
2. Re-deploy using Blueprint from render.yaml
3. This creates both from scratch with correct configuration
