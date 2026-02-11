# Development Notes

## Architecture Overview

### Backend Architecture

The backend uses Express.js with a layered architecture:

```
Client Request
    ↓
Express Middleware (CORS, Rate Limiting, etc)
    ↓
Route Handler (routes/aiRoutes.js)
    ↓
Controller (controllers/aiController.js)
    ↓
Service Layer (services/aiService.js)
    ↓
Gemini API
    ↓
Response back to Client
```

### Conversation Management

- **Session-based**: Each user gets a unique session ID
- **History tracking**: Maintains conversation history in memory
- **Duplicate prevention**: Tracks last 5 responses and checks similarity
- **Similarity algorithm**: Uses Levenshtein distance with 70% threshold

### Frontend Architecture

```
User Input (Microphone)
    ↓
Voice Recognition Hook (useVoiceRecognition)
    ↓
API Service (aiService)
    ↓
Conversation Hook (useConversation)
    ↓
Voice Synthesis Hook (useVoiceSynthesis)
    ↓
UI Components
```

## Key Components

### Backend Services

#### aiService.js
- `ConversationManager`: Manages session state and conversation history
- `getAIResponse()`: Calls Gemini API with proper context
- `isSimilarResponse()`: Checks for duplicate responses
- `calculateSimilarity()`: Uses Levenshtein distance algorithm

### Frontend Hooks

#### useVoiceRecognition.js
- Manages speech recognition state
- Handles transcript updates
- Implements silence detection logic
- Auto-resets after sending

#### useVoiceSynthesis.js
- Wraps Web Speech API for speech synthesis  
- Handles utterance configuration
- Promise-based for async/await support

#### useConversation.js
- Manages conversation state
- Handles API calls to backend
- Updates conversation history
- Error handling

#### useThemeMode.js
- Manages dark/light theme
- Persists preference to localStorage

### Frontend Components

#### ChatInterface.jsx (Main Container)
- Orchestrates all hooks and components
- Manages message flow
- Handles user interactions
- Responsive layout

#### MicrophoneButton.jsx
- Interactive button with animations
- Indicates listening/speaking state
- Disabled state during processing

#### Waveform.jsx
- Visual feedback during listening
- CSS-based animation

#### ConversationHistory.jsx
- Sidebar with chat history
- Clear history functionality
- Message role indication

#### TranscriptDisplay.jsx & ResponseDisplay.jsx
- Show current user input and AI response
- Loading indicators
- Error states

## Performance Optimizations

### Memory Management
1. **Session cleanup**: Old sessions are not actively cleared (can be enhanced)
2. **Response caching**: Only last 5 responses stored
3. **React re-renders**: Optimized with hooks and useCallback

### API Optimization
1. **Streaming responses**: Gemini API returns complete responses
2. **Rate limiting**: 10 requests/minute for AI endpoint
3. **CORS caching**: Browser caches preflight requests

### UI Performance
1. **CSS animations**: Hardware-accelerated transforms
2. **Lazy rendering**: Components render only when needed
3. **No unnecessary re-renders**: useCallback for stable references

## Voice API Implementation Details

### Web Speech API Configuration
```javascript
recognition.continuous = false     // Stop after phrase completion
recognition.interimResults = true  // Show real-time transcription
recognition.lang = 'en-US'         // Language setting
```

### Silence Detection Logic
- Monitors final results from Web Speech API
- 2-second timeout after last detection
- Automatically triggers message sending

### Speech Synthesis Configuration
```javascript
utterance.rate = 1              // Normal speed
utterance.pitch = 1             // Normal pitch  
utterance.volume = 1            // Full volume
utterance.lang = 'en-US'        // Language
```

## Error Handling Strategy

### Backend
1. Input validation before processing
2. Try-catch blocks in controller
3. Sanitization of user input
4. Rate limit error responses
5. Detailed error logging

### Frontend
1. Error states in hooks
2. User-friendly error messages
3. Graceful fallbacks
4. Console logging for debugging

## Security Measures

### Implemented
✅ Gemini API key in backend only (.env)
✅ Input sanitization (max 1000 chars, remove HTML)
✅ Rate limiting (100 general, 10 AI requests/min)
✅ CORS protection
✅ Helmet.js for security headers
✅ Session isolation

### Recommended for Production
- HTTPS only
- Refresh token mechanism
- User authentication
- Database for conversation persistence
- API key rotation
- Request signing
- VPN/firewall rules

## Testing Checklist

### Frontend Testing
- [ ] Microphone permissions work
- [ ] Waveform animation shows while listening
- [ ] Transcript displays in real-time
- [ ] Message sent after silence detection
- [ ] AI response displays correctly
- [ ] Response is spoken automatically
- [ ] Can interrupt and ask new question while speaking
- [ ] Conversation history updates
- [ ] Clear history button works
- [ ] Theme toggle works
- [ ] Mobile responsive layout works
- [ ] Error messages display properly

### Backend Testing
- [ ] Server starts on port 5000
- [ ] /health endpoint responds
- [ ] /api/ask-ai accepts POST requests
- [ ] Gemini API integration works
- [ ] Response filtering works
- [ ] Session management works
- [ ] Rate limiting works
- [ ] CORS allows frontend requests
- [ ] Errors are logged properly

### Integration Testing
- [ ] Frontend connects to backend
- [ ] Full conversation flow works
- [ ] Conversation history persists per session
- [ ] Simultaneous listen/speak works
- [ ] Network errors handled gracefully

## Future Enhancements

### Features to Add
1. **User Authentication**: Login/signup for persistence
2. **Database Integration**: Save conversations permanently
3. **Multiple AI Models**: Support Claude, GPT, etc.
4. **Custom Instructions**: System prompts for different personalities
5. **Language Selection**: Support multiple languages
6. **Voice Selection**: Different TTS voices
7. **Sentiment Analysis**: Detect and respond to emotion
8. **Real-time Translation**: Multi-language support
9. **Recording Playback**: Save and replay conversations
10. **Export Options**: Save chats as PDF/Text

### Performance Improvements
1. **Message queuing**: Handle rapid user input
2. **Response streaming**: Real-time text display as it arrives
3. **Voice endpoint optimization**: WebRTC for lower latency
4. **Caching layer**: Redis for session data
5. **CDN**: Serve frontend from CDN
6. **Database indexing**: For conversation searches
7. **Response compression**: Gzip API responses

### UI/UX Improvements
1. **Keyboard shortcuts**: Quick access (e.g., Space to toggle mic)
2. **Voice commands**: Control UI with voice
3. **Custom themes**: More theme options
4. **Accessibility**: Screen reader support, keyboard navigation
5. **Mobile app**: React Native version
6. **Desktop app**: Electron version

## Debugging Tips

### Enable Detailed Logging
Add to backend index.js:
```javascript
if (process.env.DEBUG) {
  app.use(express.json());
  console.log('Response:', res.json);
}
```

### Check Speech Recognition
In browser console:
```javascript
console.log(SpeechRecognition);
console.log(voiceService.getIsListening());
console.log(voiceService.getIsSpeaking());
```

### Monitor API Calls
In browser DevTools → Network tab:
- Check POST /api/ask-ai requests
- Verify request/response payloads
- Check response times

### Backend Logging
```javascript
console.log('Message received:', message);
console.log('Session ID:', sessionId);
console.log('AI Response:', response);
```

## Code Style & Best Practices

### JavaScript Standards
- Use const/let (no var)
- Arrow functions for callbacks
- async/await for promises
- Template literals for strings
- Destructuring for imports

### React Best Practices
- Functional components only
- Hooks for state management
- useCallback for stable functions
- Proper dependency arrays
- Error boundaries for crashes

### Express Best Practices
- Middleware for cross-cutting concerns
- Separation of concerns (routes/controllers/services)
- Error handling middleware
- Logging for debugging
- Environment variables for config

## Known Limitations

1. **In-memory storage**: No data persists between server restarts
2. **Single user**: No multi-user isolation (add auth for production)
3. **No local recording**: Responses not saved locally
4. **Language**: English only (can add i18n)
5. **Mobile microphone**: Works but may have permissions issues
6. **API rate limits**: Gemini API has its own quotas
7. **Simultaneous requests**: Backend doesn't queue requests
8. **Session timeout**: No automatic cleanup of old sessions

## Deployment Checklist

- [ ] Remove debug logs
- [ ] Update CORS_ORIGIN to production URL
- [ ] Set NODE_ENV=production
- [ ] Use strong API keys and rotate regularly
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerting
- [ ] Configure database for persistence
- [ ] Add user authentication
- [ ] Set up automated backups
- [ ] Create deployment documentation
- [ ] Test all features in production environment
- [ ] Set up rollback procedures
