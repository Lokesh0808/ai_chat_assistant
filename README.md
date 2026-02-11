## Voice Conversational AI Application - Parakeet

A full-stack voice conversational AI web application built with React, Express, and Google Gemini API.

### Features

- **Real-time Voice Recognition**: Continuous speech-to-text using Web Speech API
- **AI Responses**: Integration with Google Gemini API for intelligent responses
- **Voice Synthesis**: Text-to-speech for AI responses
- **Smart Silence Detection**: Automatically detects when user finishes speaking
- **Duplicate Response Prevention**: Stores and filters repeated responses
- **Interrupt Detection**: Resume listening while AI is speaking
- **Modern UI**: Glassmorphism design with animations
- **Responsive Design**: Works on mobile and desktop
- **Conversation History**: Sidebar with conversation history
- **Dark/Light Mode**: Theme toggle for better UX
- **Session Management**: Maintains conversation context

### Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide Icons
- Axios

**Backend:**
- Node.js with Express
- Google Generative AI SDK
- CORS & Helmet for security
- Rate limiting
- Morgan for logging

### Project Structure

```
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   ├── routes/           # API routes
│   ├── config/           # Configuration
│   ├── index.js          # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API & voice services
│   │   ├── animations/   # Animation utilities
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main app component
│   │   └── index.css     # Styles
│   ├── public/           # Static files
│   ├── vite.config.js
│   └── package.json
└── README.md
```

### Getting Started

#### Prerequisites
- Node.js 16+
- Google Gemini API key

#### Setup

1. **Clone and navigate to project**
   ```bash
   cd /workspaces/codespaces-blank
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your Gemini API key
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Open browser to `http://localhost:5173`

### API Endpoints

**POST /api/ask-ai**
- Sends user message to Gemini API
- Maintains conversation history
- Filters duplicate responses
- Returns AI response

**POST /api/clear-session**
- Clears conversation history for a session

### Configuration

**Backend .env:**
```
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:5173
```

### Features Implementation

1. **Voice Recognition**
   - Continuous listening mode
   - Automatic silence detection (2 seconds)
   - Real-time transcript display

2. **AI Response System**
   - Session-based conversation context
   - Response deduplication
   - Optimized for voice conversation

3. **Voice Synthesis**
   - Natural sounding responses
   - Adjustable rate and pitch
   - Interrupt capability

4. **UI Components**
   - Animated microphone button
   - Waveform visualization
   - Live transcript display
   - Glassmorphism design
   - Responsive layout

### Security Features

- API key stored in backend .env only
- Input sanitization
- Rate limiting (100 requests/15 min globally, 10 requests/min for AI)
- CORS protection
- Helmet.js for security headers

### Performance Optimizations

- Session-based conversation memory
- Response caching (last 5 responses)
- Async/await architecture
- Optimized speech recognition
- Lazy loading components
- Memory leak prevention

### Browser Support

- Chrome/Edge 25+
- Firefox 29+
- Safari 14+
- Opera 27+

### Troubleshooting

**Microphone not working:**
- Check browser permissions
- Use HTTPS if deploying online
- Ensure browser supports Web Speech API

**API errors:**
- Verify Gemini API key is set
- Check backend is running on port 5000
- Look at backend console for detailed errors

**CORS issues:**
- Verify CORS_ORIGIN in backend .env matches frontend URL

### Development

**Available Scripts:**

Backend:
```bash
npm run dev    # Start with nodemon
npm start      # Start production server
```

Frontend:
```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

### License

MIT

### Author

Created as a full-stack voice AI application example.
