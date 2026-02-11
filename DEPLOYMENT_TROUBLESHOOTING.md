# Production Deployment Troubleshooting Guide

## 404 Error in Production

If you see "API endpoint not found" or "404" error when trying to send a message:

### Quick Fix Checklist

1. **Frontend service is getting wrong URL**
   - The frontend needs to know your backend's exact URL
   - Example error in console: `ai-chat-assistant-vf.ender.com//ask-ai`
   - This means `VITE_API_URL` is NOT set correctly

2. **Verify Render Deployment**
   - Backend service name: `voice-ai-backend`
   - Frontend service name: `voice-ai-frontend`
   - Your actual backend URL will be: `https://voice-ai-backend.onrender.com` (replace with your service name)

3. **Set the Environment Variable on Render**
   - Go to Render Dashboard
   - Click **voice-ai-frontend** service
   - Go to **Environment** tab
   - Find or create `VITE_API_URL` variable
   - Set it to: `https://voice-ai-backend.onrender.com`
   - Replace `voice-ai-backend` with your actual backend service name from Render

4. **Rebuild the Frontend**
   - Go to voice-ai-frontend Settings
   - Click **Manual Deploy** to rebuild with new environment variable
   - Wait ~5-10 minutes for build to complete
   - Check the build logs to confirm `VITE_API_URL` is being used

5. **Test in Console**
   - Open your app in browser
   - Press F12 (Developer Console)
   - Look for `[API Config]` message
   - It should show your full backend URL, like:
     ```
     API_URL: https://voice-ai-backend.onrender.com
     ```
   - NOT `/api` or partial domain

## Common Issues and Solutions

### Issue: Console shows truncated or malformed URL
- Error: `ai-chat-assistant-vf.ender.com//ask-ai`
- Cause: `VITE_API_URL` environment variable not set during build
- Fix: Set `VITE_API_URL` on frontend service and rebuild

### Issue: Console shows `API_URL: /api`
- Cause: `VITE_API_URL` is empty, using fallback for development
- Fix: Set `VITE_API_URL=https://voice-ai-backend.onrender.com` and rebuild

### Issue: Status 404 after setting environment variable
- The environment variable might not be applied yet
- Click **Clear Build Cache** then **Manual Deploy** on frontend
- Wait for build to finish, then reload the page

### Issue: Backend is responding but still 404
- Check backend service logs on Render
- Verify backend is actually running (should see "Server running on port...")
- Make sure backend routes are correct: `/api/ask-ai` and `/api/clear-session`

## Network Error vs 404 Error

- **Network Error**: Can't reach the server at all → Check if URLs are correct and services are running
- **404 Error**: Server is reachable but endpoint doesn't exist → Check `VITE_API_URL` is correct

## Render Service Structure

Your deployment should have:

```
Render Dashboard
├── voice-ai-backend
│   ├── Type: Web Service (Node.js)
│   ├── Status: Live
│   └── URL: https://voice-ai-backend.onrender.com
│       (your actual service name may be different)
│
└── voice-ai-frontend
    ├── Type: Static Site
    ├── Status: Live
    ├── Environment: VITE_API_URL=https://voice-ai-backend.onrender.com
    └── URL: https://voice-ai-frontend.onrender.com
        (your actual service name may be different)
```

## Step-by-Step Fix

1. **Note your actual Render service names**
   - Go to Render Dashboard
   - See what backend service is named (e.g., `voice-ai-backend`)
   - See what frontend service is named (e.g., `voice-ai-frontend`)

2. **Update Environment Variable**
   - Click frontend service
   - Environment tab
   - Add: `VITE_API_URL = https://voice-ai-backend.onrender.com`
   - If backend has different name, update accordingly

3. **Force Rebuild**
   - Click Settings (gear icon)
   - Clear Build Cache
   - Manual Deploy
   - Wait for green "Live" status

4. **Test**
   - Open frontend URL
   - F12 Console
   - Confirm `[API Config]` shows your backend URL
   - Try sending a message

5. **If still failing**
   - Frontend console should show exact error URL
   - Compare to actual backend URL in Render Dashboard
   - They must match exactly (including protocol and domain)

## Local Development

For local development, you don't need to set `VITE_API_URL`:

```bash
cd backend
npm run dev      # Runs on http://localhost:5000

cd frontend
npm run dev      # Runs on http://localhost:5173
               # Automatically proxies /api to http://localhost:5000
```

No environment variables needed - Vite proxy handles it automatically.

## Still Not Working?

1. **Check console errors** (F12)
2. **Compare frontend-reported URL to Render dashboard**
3. **Check backend service logs** on Render for errors
4. **Try the Health Check button** in the error message
5. **Clear browser cache** (Ctrl+Shift+Delete)
6. **Wait 30 seconds** - Render services can be slow to wake up
