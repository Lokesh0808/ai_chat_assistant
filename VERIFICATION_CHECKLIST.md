# ✅ VERIFICATION CHECKLIST - Voice AI Application

## Backend Status
```bash
# Check backend is running on port 5000
curl http://localhost:5000/health
# Expected: {"status":"OK","timestamp":"..."}

# Check API is accepting requests
curl -X POST http://localhost:5000/api/ask-ai \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test"}'
# Expected: {"success":true,"response":"...","sessionId":"test"}
```

**Status**: ✅ Backend running and responding

---

## Frontend Features
### Startup
- [ ] Page loads at http://localhost:5173
- [ ] Dark theme visible with gradient background
- [ ] Header shows "Parakeet AI" title
- [ ] Theme toggle (sun/moon) visible in header

### Layout
- [ ] Desktop: History sidebar on left (~25% width)
- [ ] Desktop: Main chat area on right (~75% width)
- [ ] Mobile: "Show History" toggle button visible
- [ ] Responsive design works on phone screen

### Voice Components
- [ ] Microphone button visible (blue circle in center)
- [ ] Waveform animation appears when listening
- [ ] "Listening..." indicator shown while microphone active
- [ ] "Speak now..." placeholder in input box

### Interaction Flow (WHAT TO TEST)

#### Test 1: Speak a question
1. Click the blue microphone button
2. Say: "What is artificial intelligence?"
3. Observe:
   - [ ] Real-time transcription appears in input box
   - [ ] Waveform animates while speaking
   - [ ] After 2 seconds of silence, message disappears from input
   - [ ] "Processing..." indicator appears
   - [ ] Response appears in "Assistant Response" box
   - [ ] Response is read aloud (you'll hear voice)
   - [ ] History gets populated with Q&A

#### Test 2: Continue conversation
1. Wait for voice to finish (1-2 seconds)
2. Say next question (without clicking mic again)
3. Observe:
   - [ ] Microphone auto-restarts listening
   - [ ] Same flow as Test 1 repeats
   - [ ] History shows multiple Q&A pairs

#### Test 3: Check History
1. Look at left sidebar (desktop) or click "Show History"
2. Observe:
   - [ ] Q&A items appear with questions
   - [ ] Each item shows truncated question
   - [ ] Click on any item to expand
   - [ ] Full answer appears when expanded
   - [ ] Item highlights when selected

#### Test 4: Clear History
1. Click trash icon in history header
2. Observe:
   - [ ] All history items disappear
   - [ ] History shows "No conversations yet"
   - [ ] Empty conversation ready for new chat

#### Test 5: Theme Toggle
1. Click sun/moon icon in header
2. Observe:
   - [ ] Background changes (light mode)
   - [ ] Text colors adjust
   - [ ] All components visible in new theme
3. Click again to return to dark mode

---

## Expected Behavior

### When You Click Microphone
```
1. Button turns BLUE
2. Waveform starts animating
3. "Listening..." text appears
4. Input box shows "Speak now..."
→ System ready for speech
```

### When You Speak
```
1. Real-time text appears in input box
2. Text updates as you speak
3. Waveform continues animating
→ System recognizing speech
```

### After 2 Seconds of Silence
```
1. Input text disappears
2. "Processing..." indicator appears
3. Response box shows "Generating response..."
4. Microphone button becomes GRAY (disabled)
→ Sending to backend
```

### When Response Arrives
```
1. "Processing..." disappears
2. Response appears in bot response box
3. Response text is spoken aloud
4. "Speaking..." indicator shown (with volume icon)
5. Microphone automatically becomes BLUE again (active)
→ Ready for next question
```

### History Update
```
1. Question appears in history sidebar
2. Answer appears below when expanded
3. Item highlights in blue
4. Shows in Q&A pair format
→ Conversation preserved
```

---

## Common Issues & Solutions

### Issue: Page shows but no interaction
**Check**:
- Backend running: `curl http://localhost:5000/health`
- Browser console (F12) for JavaScript errors
- Network tab to see API calls
**Fix**: Restart frontend `npm run dev`

### Issue: Microphone doesn't work
**Check**:
- Browser microphone permissions (ask for allow)
- Browser supports Web Speech API (use Chrome/Edge/Firefox)
- Console logs for speech recognition errors
**Fix**: Allow microphone access, refresh page

### Issue: Text doesn't show in real-time
**Check**:
- Voice recognition is working (check onresult in console)
- useVoiceRecognition hook is receiving callbacks
**Fix**: Check browser console for specific errors

### Issue: Response doesn't appear
**Check**:
- API is responding: `curl http://localhost:5000/api/ask-ai ...`
- Frontend console shows API response
- voiceSynthesis hook is working
**Fix**: Check if backend is running, restart both services

### Issue: Voice doesn't play
**Check**:
- System volume is up
- Browser allows audio (may need user interaction first)
- Text-to-speech not blocked by browser
**Fix**: Check volume, try clicking any button first to enable audio

### Issue: Listening doesn't auto-restart
**Check**:
- Voice synthesis completes (isPlaying becomes false)
- Chat interface useEffect fires
- startListening is called
**Fix**: Check browser console for errors in voice service

---

## Console Debugging

Open browser console (F12) and look for:

```javascript
// When microphone starts
"Speech recognition started"

// When text is recognized
handleTranscript called with interim/final text

// When silence detected
"Silence detected, sending message"

// When API called
"Sending message: ..."

// When response received
"Received response: ..."

// When speaking
"Speaking response: ..."
```

---

## Testing Checklist

- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] Microphone button clickable
- [ ] Real-time transcription working
- [ ] Auto-send after silence working
- [ ] Response displays correctly
- [ ] Voice plays (check speaker icon)
- [ ] History populated
- [ ] History items expandable
- [ ] Auto-restart listening working
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] Clear history works
- [ ] New session works (refresh page)

---

## Performance Expectations

- Speech recognition: Real-time (< 100ms latency)
- Pause detection: ~2 seconds
- API response: 2-8 seconds (Gemini API)
- Voice playback: Depends on response length (5-30 seconds typical)
- **Full cycle**: 10-15 seconds per question

---

## If Everything Passes ✅

🎉 **Application is fully functional!**

You can now:
- Ask questions continuously with voice
- See real-time transcription
- Get AI responses with voice output
- View conversation history
- Switch between light/dark modes
- Use on mobile and desktop

**Enjoy your Voice AI Assistant!** 🎙️🤖

---

## Next Steps

1. **Deploy**: See DOCKER_SETUP.md
2. **Add API Key**: Put valid Gemini API key in backend/.env
3. **Customize**: Edit demo responses or UI components
4. **Authentication**: Add user login for production
5. **Database**: Store conversations permanently
