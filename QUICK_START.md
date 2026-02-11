# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### Step 2: Configure Backend

```bash
cd /workspaces/codespaces-blank/backend

# Edit .env file
# Windows: notepad .env
# Mac/Linux: nano .env
# Paste your API key where it says: GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Start Services

**Terminal 1 - Backend:**
```bash
cd /workspaces/codespaces-blank/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /workspaces/codespaces-blank/frontend
npm run dev
```

### Step 4: Open Application

Open your browser to: **http://localhost:5173**

## ✨ How to Use

1. **Click the microphone button** - The center circular button turns blue
2. **Speak naturally** - You'll see your words appear in real-time
3. **Pause for 2 seconds** - Message automatically sends
4. **AI responds** - The response appears and is spoken aloud
5. **Interrupt anytime** - Click the mic again to ask a new question

## 🎯 Features Overview

| Feature | How to Use |
|---------|-----------|
| **Continuous Listening** | Click mic button to start |
| **Auto-silence Detection** | Pause 2 seconds between sentences |
| **Voice Response** | AI automatically speaks responses |
| **Interrupt** | Click mic while AI is speaking |
| **Conversation History** | Check left sidebar (desktop) or "Show History" button (mobile) |
| **Clear History** | Click trash icon in history panel |
| **Dark/Light Mode** | Click sun/moon icon in header |

## 🔧 Troubleshooting

### "Microphone not working"
- Allow browser microphone access when prompted
- Check browser supports Web Speech API (Chrome, Edge, Firefox, Safari all work)

### "Cannot connect to API"
- Ensure backend is running (`npm run dev` in backend directory)
- Check you're on http://localhost:5173, not 5000

### "Gemini API Error"
- Verify API key is correct in backend/.env
- Check Gemini API is enabled in your Google project

### "Too many requests"
- Wait 30 seconds (rate limit is 10 per minute)
- In production, implement authentication

## 📱 Mobile Usage

- All features work on mobile
- Use "Show History" to toggle conversation sidebar
- Web Speech API works on Chrome, Firefox, Safari on iOS/Android
- Grant microphone permission in browser settings

## 💡 Tips

- Speak clearly for better recognition
- Use natural pauses between thoughts
- The system learns context from conversation history
- Responses are cached to avoid repetition
- Each session is isolated

## 📚 Documentation

- **README.md** - Full feature documentation
- **SETUP_GUIDE.md** - Detailed installation instructions
- **DEVELOPMENT_NOTES.md** - Architecture and development info
- **DOCKER_SETUP.md** - Deployment with Docker

## 🔐 Important

⚠️ **Never commit your .env file to version control!**

The .env file contains your Gemini API key. It's already in .gitignore, so it won't be committed.

## Next Steps

After getting started:

1. **Test different questions** - Try various types of queries
2. **Check conversation history** - See how context is maintained
3. **Try mobile** - Test on your phone
4. **Explore settings** - Toggle dark mode, clear history
5. **Read DEVELOPMENT_NOTES.md** - Learn about architecture

## Support Commands

### Check Backend Health
```bash
curl http://localhost:5000/health
```

### View Backend Logs
```bash
# Backend automatically logs to console when running with npm run dev
```

### Clear Browser Cache
```bash
# Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
# Firefox: Ctrl+Shift+Delete or Cmd+Shift+Delete
```

## Common Issues Table

| Issue | Cause | Solution |
|-------|-------|----------|
| Mic button not responding | Frontend not running | `cd frontend && npm run dev` |
| API errors | Backend not running | `cd backend && npm run dev` |
| No microphone access | Browser permission | Allow access in browser settings |
| Responses not speaking | Volume muted | Check system volume |
| Duplicate responses | Cache full | Responses auto-refresh after 5 repeated answers |

## Performance Tips

- Use a stable WiFi connection for better API reliability
- Close other browser tabs to free up resources
- Clear browser cache if performance degrades
- Restart browser if experiencing issues

## What's Next?

### For Development
- Read DEVELOPMENT_NOTES.md for architecture details
- Explore the code in backend/ and frontend/
- Try modifying components and seeing live changes

### For Deployment
- Read DOCKER_SETUP.md for containerization
- Set up a reverse proxy (nginx)
- Use a real database for conversation persistence
- Enable HTTPS
- Set up monitoring and logging

### For Features
- Add user authentication
- Implement conversation saving
- Add support for multiple languages
- Enable custom instructions
- Add voice selection for TTS

## Security Reminders

✅ API key stored in backend only
✅ Input sanitized on backend
✅ Rate limiting enabled
✅ CORS protection active
✅ Non-production mode enabled for development

Enjoy your Voice AI Assistant! 🎙️🤖
