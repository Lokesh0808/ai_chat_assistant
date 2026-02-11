# Voice AI Application - Comprehensive Setup & Usage Guide

## ✅ FIXED ISSUES

### 1. **Continuous Listening** ✓
- Changed Web Speech API from `continuous: false` to `continuous: true`
- Listening now resumes automatically after response is spoken
- Speech recognition runs continuously until user stops it

### 2. **Real-time Transcription Display** ✓
- Shows interim (in-progress) text as you speak
- Shows final text when phrase is completed
- Displays in live input box with status indicators

### 3. **Response Display & Voice** ✓
- Last AI response shows in "Assistant Response" box
- Response is automatically spoken using Text-to-Speech
- Speaking indicator shows when audio is playing
- Response text wraps properly for long answers

### 4. **Conversation History** ✓
- Questions and answers saved in conversation history sidebar
- Click on any item to expand and see full answer
- History persists for current session
- Clear button removes all history
- Q&A pairs grouped together, not individual messages

### 5. **Auto-Restart Listening** ✓
- After response finishes speaking, listening automatically restarts
- User can continue asking questions without clicking microphone button
- Processing indicator shows when waiting for AI response

### 6. **Backend Connection** ✓
- API endpoint `/api/ask-ai` fully functional
- Session management working
- Error handling implemented
- Demo responses available (use real Gemini API key for live responses)

---

## 🚀 HOW TO USE THE APPLICATION

### Starting the App
1. **Backend**: `cd backend && npm run dev` (runs on port 5000)
2. **Frontend**: `cd frontend && npm run dev` (runs on port 5173)
3. **Browser**: Open http://localhost:5173

### Basic Usage

#### First Question
1. **Click the blue microphone button** (center of screen)
2. **Speak your question** - Watch as it appears in real-time in the input box
3. **Pause for 2 seconds** - System automatically sends the message
4. **Wait for response** - AI processes and displays the answer
5. **Hear the response** - Text-to-speech reads the response aloud

#### Continuing Conversation
- **After response finishes voice**: Microphone automatically becomes active again
- **Just speak the next question** - No need to click the button
- **Same flow repeats** - Message displayed, sent, response received

#### Using History Sidebar
- **Desktop**: Sidebar always visible on left
- **Mobile**: Click "Show History" button to toggle
- **Click any Q&A item** to expand and see full answer
- **Clear History**: Click trash icon to clear all conversations

#### Theme Toggle
- Click sun/moon icon in header to switch dark/light mode
- Preference saved in browser

---

## 📱 INTERFACE LAYOUT

```
┌─────────────────────────────────────────────┐
│ Parakeet AI | 🌙 (Theme Toggle)             │
├─────────┬───────────────────────────────────┤
│         │                                   │
│ HISTORY │     YOUR INPUT (Real-time)        │
│         │  [Show what you're saying]        │
│ Q & A   │                                   │
│ Items   │     🎤 [Microphone Button]       │
│ (Click  │     ≈ ≈ ≈ (Waveform)             │
│ to      │                                   │
│ expand) │  ASSISTANT RESPONSE               │
│         │  [AI answer shown here]           │
│         │  🔊 Speaking... (if playing)      │
│         │                                   │
│ 🗑️ Clear│  [Continue/History toggle]        │
└─────────┴───────────────────────────────────┘
```

---

## 🔧 TECHNICAL DETAILS

### Frontend Components
- **ChatInterface.jsx** - Main orchestrator
- **MicrophoneButton.jsx** - Click to toggle listening
- **TranscriptDisplay.jsx** - Shows your input
- **ResponseDisplay.jsx** - Shows AI response  
- **Waveform.jsx** - Visual feedback while listening
- **ConversationHistory.jsx** - Clickable Q&A history

### Frontend Hooks
- **useVoiceRecognition** - Web Speech API integration
- **useVoiceSynthesis** - Text-to-speech
- **useConversation** - API calls and history management
- **useThemeMode** - Dark/light mode

### Backend Endpoints
- **POST /api/ask-ai** - Send message, get response
- **POST /api/clear-session** - Clear history
- **GET /health** - Server status

### Data Flow
```
1. User speaks
   ↓
2. Web Speech API recognizes speech
   ↓
3. Transcript displayed in real-time
   ↓
4. After 2 seconds silence, message sent to backend
   ↓
5. Backend receives message, adds to session history
   ↓
6. Backend calls Gemini API (or uses demo response)
   ↓
7. Backend returns response to frontend
   ↓
8. Frontend displays response in Response box
   ↓
9. Text-to-speech plays response
   ↓
10. Conversation added to history sidebar
   ↓
11. Listening automatically resumes (repeat from step 1)
```

---

## 🎯 FEATURES CHECKLIST

- ✅ Continuous speech listening
- ✅ Real-time transcription display
- ✅ Automatic silence detection (2 seconds)
- ✅ AI response generation
- ✅ Text-to-speech voice
- ✅ Conversation history display
- ✅ Expandable history items
- ✅ Auto-restart listening after response
- ✅ Interrupt detection (can speak while AI is speaking)
- ✅ Session management
- ✅ Clear history button
- ✅ Dark/Light mode toggle
- ✅ Mobile responsive design
- ✅ Error handling
- ✅ Loading indicators
- ✅ Processing status display

---

## 🐛 TROUBLESHOOTING

### Issue: Microphone not working
**Solution**: 
- Check browser microphone permissions
- Ensure browser supports Web Speech API (Chrome, Edge, Firefox, Safari)
- Try refreshing the page

### Issue: Text not speaking
**Solution**:
- Check system volume
- Ensure microphone is not blocking browser from using speakers
- Try a different browser

### Issue: History not showing
**Solution**:
- Make sure you've sent at least one message
- Check if mobile "Show History" button is clicked
- Refresh page if history disappeared

### Issue: Continuous listening not working
**Solution**:
- Check browser console (F12) for errors
- Verify backend is running (`curl http://localhost:5000/health`)
- Clear browser cache and try again

### Issue: API errors
**Solution**:
- Verify backend is running: `ps aux | grep node`
- Check .env file has proper API key
- Restart backend with `npm run dev`

---

## 🔐 SECURITY NOTES

- API key stored server-side only (in backend/.env)
- Input sanitized to max 1000 characters
- Rate limiting: 10 AI requests per minute
- CORS protection enabled
- Session IDs are unique per user

---

## 📊 EXPECTED RESPONSE TIME

- User speaks: Instant display
- Silence detection: Up to 2 seconds
- API response: 2-8 seconds (depending on API)
- Voice playback: Variable (based on response length)
- **Total cycle**: ~5-15 seconds per Q&A

---

## 🎓 TIPS FOR BEST RESULTS

1. **Speak clearly** - Better speech recognition
2. **Pause between sentences** - Clearer message separation
3. **Use natural pauses** - System detects silence naturally
4. **Keep questions concise** - Better API responses
5. **Fresh browser session** - Clear cache if experiencing issues

---

## 📝 EXAMPLE CONVERSATION

```
You: "What is machine learning?"
[Microphone active, listening...]
[2 seconds silence detected, message sent]
[Processing... response received]
Assistant: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience..."
[Response spoken aloud]
[Listening automatically resumes]

You: "Can you explain neural networks?"
[Same flow repeats]
```

---

## 🚀 NEXT STEPS

1. **Test with real questions** - Try various topics
2. **Set up Gemini API key** - For live AI responses
3. **Customize responses** - Edit demo responses in backend
4. **Deploy to production** - See DOCKER_SETUP.md
5. **Add authentication** - For multi-user setup

---

## 📞 SUPPORT

- Check console logs (F12 in browser)
- Review DEVELOPMENT_NOTES.md for architecture
- Check API_REFERENCE.md for endpoint details
- Review SETUP_GUIDE.md for configuration

---

**The application is now fully functional! Start using it and enjoy your voice AI assistant! 🎙️🤖**
