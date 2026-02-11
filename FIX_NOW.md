# IMMEDIATE: Fix API Endpoint Issue

## What's Happening
- ✅ Backend is online at: `ai-chat-assistant-1-33b3.onrender.com`
- ❌ Frontend is still trying to call the frontend domain instead
- Result: 404 error

## MUST DO RIGHT NOW

### Step 1: Update VITE_API_URL on Render

1. Go to https://dashboard.render.com
2. **Click the frontend service** (which shows `ai-chat-assistant-vfan`)
3. Click on the **Environment** tab
4. Find the variable `VITE_API_URL` 
5. **Change the value to:**
   ```
   https://ai-chat-assistant-1-33b3.onrender.com
   ```
6. Click **Save**

### Step 2: Rebuild Frontend

1. Still in frontend service, click **Settings** (⚙️ gear icon)
2. Click **Clear Build Cache**
3. Click **Manual Deploy**
4. ⏳ Wait for the build to complete (~10 minutes)
5. ✅ Wait for green "Live" status to appear

### Step 3: Verify Fix

1. Reload your app in browser
2. Press **F12** to open console
3. Look for `[API Config]` message
4. Should show:
   ```
   API_URL: https://ai-chat-assistant-1-33b3.onrender.com
   ```
   NOT the frontend URL
5. Try speaking - should work now! ✅

---

## Voice Recognition Issues

Voice is listening but not capturing audio. This is usually permissions or microphone.

### Quick Fixes (try these first):

1. **Reload page fresh**
   - Close browser tab
   - Reopen URL
   - When asked for microphone, click **Allow**

2. **Check your microphone works**
   - Try voice in Google Docs
   - Check system sound settings
   - Make sure microphone isn't muted

3. **Check browser permissions**
   - Chrome: Settings → Privacy → Microphone → Allow
   - Firefox: Preferences → Privacy → Microphone → Allow

4. **Check if microphone is detected**
   - Open console (F12)
   - Look for line: `📋 Available audio input devices: X`
   - Should show at least 1 device
   - If shows 0, your browser can't find the microphone

### If Still Not Working

Let me know what the console shows:
- Do you see "📋 Available audio input devices: 1" or "0"?
- What error messages appear in red in the console?
- Does microphone work in Google Docs?

---

## Important Notes

⚠️ **The API endpoint error is the CRITICAL issue** - Fix that first by updating VITE_API_URL

The voice issue might be:
- Permissions not fully granted
- System microphone settings
- Browser not detecting the audio device

Once you update `VITE_API_URL` and rebuild, text should work (just type or allow voice to complete, then edit).

Voice recording will be investigated separately if still not working after the above.
