# Setup Guide - Voice Conversational AI Application

## Prerequisites

Before getting started, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- A Google Generative AI API key (get it at: https://makersuite.google.com/app/apikey)
- A modern web browser supporting Web Speech API (Chrome, Edge, Firefox, Safari)

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd /workspaces/codespaces-blank
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file and add your Gemini API key
# Windows: notepad .env
# Mac/Linux: nano .env
# Or use VS Code to open and edit
```

**Important:** In `.env`, replace the placeholder with your actual Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start Backend Server

From the backend directory:
```bash
npm run dev
```

You should see:
```
✓ Server running on port 5000
✓ Environment: development
```

### 4. Setup Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install
```

### 5. Start Frontend Development Server

From the frontend directory:
```bash
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Getting Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click on "Create API Key" 
3. Select "Create API key in new project" or choose an existing project
4. Copy the API key
5. Paste it in your backend `.env` file

## Running Both Servers Simultaneously

**Option 1: Using two terminals**
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

**Option 2: Using concurrently (if installed globally)**
```bash
# From root directory
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## Features Guide

### Microphone Button
- **Click to start listening** - System enters listening mode with waveform animation
- **Click again to stop** - Stops listening immediately
- The button turns blue while listening
- The button turns green while speaking (AI response)

### How to Use

1. Click the microphone button
2. Speak naturally - the system will transcribe your speech in real-time
3. After 2 seconds of silence, the message is automatically sent to the AI
4. The AI processes your message and generates a response
5. The response is spoken aloud automatically
6. You can click the microphone again at any time to interrupt and ask a new question

### Conversation History

- View your conversation history in the left sidebar (desktop) or toggle with "Show History" button (mobile)
- Click the trash icon to clear conversation history
- History is maintained for the current session

### Theme Toggle

- Click the sun/moon icon in the header to toggle between dark and light themes
- Your preference is saved in localStorage

## Troubleshooting

### Issue: "Microphone not working"
**Solution:**
- Check browser microphone permissions
- Grant permission when browser asks to "Use your microphone"
- Ensure your browser supports Web Speech API

### Issue: "API Error - 429 Too Many Requests"
**Solution:**
- The app has rate limiting enabled (10 requests/minute for AI)
- Wait a moment before sending another message

### Issue: "CORS Error"
**Solution:**
- Ensure backend is running on port 5000
- Verify frontend is running on port 5173
- Check that CORS_ORIGIN in backend/.env matches your frontend URL

### Issue: "Cannot GET /"
**Solution:**
- Make sure you're accessing http://localhost:5173 (frontend)
- Not http://localhost:5000 (backend - that's just the API)

### Issue: "Gemini API Key Error"
**Solution:**
- Verify the API key is correctly set in backend/.env
- Go to console (F12) → Network tab to see exact error
- Check that the API key has appropriate permissions

## Environment Variables

### Backend (.env)

```
PORT=5000                          # Server port
NODE_ENV=development              # Environment mode
GEMINI_API_KEY=your_key_here      # Your Gemini API key
CORS_ORIGIN=http://localhost:5173 # Frontend URL for CORS
```

## Project Structure Overview

```
/workspaces/codespaces-blank/
├── backend/                    # Express server
│   ├── index.js               # Entry point
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic (AI integration)
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── hooks/             # React hooks
│   │   ├── services/          # API services
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main component
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md                  # Full documentation
└── SETUP_GUIDE.md            # This file
```

## API Endpoints

### POST /api/ask-ai
Send a message to the AI and get a response.

**Request:**
```json
{
  "message": "What is the weather like?",
  "sessionId": "session-1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I don't have access to real-time weather data, but you can check...",
  "sessionId": "session-1234567890"
}
```

### POST /api/clear-session
Clear conversation history for a session.

**Request:**
```json
{
  "sessionId": "session-1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session cleared"
}
```

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-02-10T12:34:56.789Z"
}
```

## Performance Tips

1. **For faster responses:** Use a stable internet connection (API calls to Gemini require good connectivity)
2. **For better accuracy:** Speak clearly and pause between sentences
3. **For smoother UI:** Close other applications to free up system resources

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Best Web Speech API support |
| Edge    | ✅ Full | Chromium-based |
| Firefox | ✅ Full | Good support |
| Safari  | ✅ Full | iOS and Mac |
| Opera   | ✅ Full | Chromium-based |

## Deployment

For production deployment:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve built files with express:
   - Copy frontend/dist to backend/public
   - Update backend to serve static files

3. Set environment variables on your hosting platform

4. Ensure your Gemini API key is secured and never exposed in client code

## Support & Debugging

**Enable debug mode:**
- Open browser DevTools (F12)
- Go to Console tab to see detailed logs
- Go to Network tab to inspect API calls

**Common errors in console:**
- `SpeechRecognition is not defined` → Browser doesn't support Web Speech API
- `CORS error` → Backend not running or wrong CORS settings
- `401 Unauthorized` → Invalid Gemini API key

## Next Steps

1. Test the microphone button and waveform animation
2. Try speaking different types of questions
3. Check conversation history
4. Experiment with dark/light mode
5. Test on different devices/browsers

## Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)

Enjoy your Voice AI Assistant! 🎙️
