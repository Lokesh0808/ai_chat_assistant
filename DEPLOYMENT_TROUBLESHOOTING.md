# Production Deployment Troubleshooting Guide

## Common Issues and Fixes

### Network Error on Production

If you see "Network Error: Cannot connect to API" in production, follow these steps:

#### 1. Check Your Render Environment Variables

**For the Backend Service (voice-ai-backend):**
- No special environment variables needed
- Make sure `NODE_ENV` is set to `production`

**For the Frontend Service (voice-ai-frontend):**
- Go to Render Dashboard → voice-ai-frontend → Environment
- Add/Update: `VITE_API_URL` = `https://voice-ai-backend.onrender.com`
  - Replace `voice-ai-backend` with your actual backend service name if different

#### 2. Check Backend Service Status

1. Go to Render Dashboard → voice-ai-backend
2. Check the "Latest Deploy" tab - look for errors in the build/start logs
3. Go to the "Logs" tab and scroll to see recent activity
4. If it says "Service is running" - the backend is online

#### 3. Verify Frontend Build

1. Go to Render Dashboard → voice-ai-frontend
2. Check "Latest Deploy" → "Build Logs"
3. Look for: `VITE_API_URL = https://voice-ai-backend.onrender.com`
4. If not showing, the environment variable wasn't set during build

#### 4. Check Browser Console

1. Open your site in browser
2. Press `F12` to open Developer Tools
3. Go to Console tab
4. Look for `[API Config]` entry - it should show:
   - `VITE_API_URL: https://voice-ai-backend.onrender.com`
   - `API_URL: https://voice-ai-backend.onrender.com`

If it shows `API_URL: /api` - this means `VITE_API_URL` wasn't set!

#### 5. Manual Fix on Render

If environment variable doesn't apply:

1. **Delete and Recreate Services** (nuclear option):
   - Go to Render Dashboard
   - Delete both services
   - Re-import from GitHub using the new `render.yaml`
   - Make sure environment variables are set during creation

2. **Or Add Event to Manually Trigger Rebuild**:
   - Go to voice-ai-frontend Settings
   - Click "Clear Build Cache"
   - Click "Manual Deploy" → "Deploy Latest Commit"
   - This forces a fresh build with current environment variables

### Connection Still Failing?

If backend URL is correct but still failing:

1. **Check Backend Health Endpoint:**
   - In browser, visit: `https://voice-ai-backend.onrender.com/health`
   - You should see: `{"status":"OK",...}`
   - If 404 or timeout → backend service isn't running

2. **Check CORS Settings:**
   - The backend now accepts:
     - `.onrender.com` domains
     - `.vercel.app` domains
     - `localhost` for dev
   - If using custom domain, it may need additional CORS configuration

3. **Render Service Cold Starts:**
   - Render may put services to sleep if unused
   - First request after sleep can take 30+ seconds
   - Wait 30 seconds and try again

## Quick Deployment Checklist

- [ ] Backend service deployed and showing "Live"
- [ ] Frontend service deployed and showing "Live"
- [ ] `VITE_API_URL` environment variable set on frontend service
- [ ] Rebuild frontend after setting environment variable
- [ ] Backend health check passes (`/health` endpoint)
- [ ] Check browser console for `[API Config]` with correct URL
- [ ] Try using "Check Server" button in error message

## Local Development

For local development, the app uses the Vite proxy automatically:
- No need to set `VITE_API_URL`
- Backend should run on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

## Still Not Working?

1. Open browser Console (F12)
2. Click the "Check Server" button in the error message
3. This will tell you if the backend is reachable
4. Copy any error messages and check the Backend service logs on Render
