# API Reference

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### 1. Ask AI

**Endpoint:** `POST /ask-ai`

Send user message and get AI response.

#### Request

```http
POST /api/ask-ai HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "message": "What is machine learning?",
  "sessionId": "session-1707557690000-abc123xyz"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's question/statement |
| `sessionId` | string | Yes | Unique session identifier |

#### Response

**Success (200):**
```json
{
  "success": true,
  "response": "Machine learning is a subset of artificial intelligence...",
  "sessionId": "session-1707557690000-abc123xyz"
}
```

**Error (400):**
```json
{
  "error": "Message and sessionId are required"
}
```

**Error (429):**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

**Error (500):**
```json
{
  "error": "Failed to generate response from Gemini API",
  "status": 500,
  "timestamp": "2024-02-10T12:34:56.789Z"
}
```

#### Using cURL

```bash
curl -X POST http://localhost:5000/api/ask-ai \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "sessionId": "session-123456"
  }'
```

#### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:5000/api/ask-ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello, how are you?',
    sessionId: 'session-123456'
  })
});

const data = await response.json();
console.log(data.response);
```

---

### 2. Clear Session

**Endpoint:** `POST /clear-session`

Clear conversation history for a specific session.

#### Request

```http
POST /api/clear-session HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "sessionId": "session-1707557690000-abc123xyz"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | Yes | Session identifier to clear |

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Session cleared"
}
```

**Error (400):**
```json
{
  "error": "sessionId is required"
}
```

#### Using cURL

```bash
curl -X POST http://localhost:5000/api/clear-session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123456"
  }'
```

---

### 3. Health Check

**Endpoint:** `GET /health`

Check if the server is running and healthy.

#### Request

```http
GET /health HTTP/1.1
Host: localhost:5000
```

#### Response

**Success (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-02-10T12:34:56.789Z"
}
```

#### Using cURL

```bash
curl http://localhost:5000/health
```

---

## Rate Limiting

### Global Rate Limit
- **Limit:** 100 requests per 15 minutes per IP
- **Header Response:** Includes `RateLimit-*` headers

### AI Endpoint Rate Limit
- **Limit:** 10 requests per minute per IP
- **Response Code:** 429 Too Many Requests

### Response Headers

```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1707557850
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description",
  "status": 400,
  "timestamp": "2024-02-10T12:34:56.789Z"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | AI response retrieved |
| 400 | Bad Request | Missing required fields |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Gemini API failure |
| 404 | Not Found | Invalid endpoint |

---

## Environment Variables

Required environment variables in backend `.env`:

```
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
GEMINI_API_KEY=your_key_here          # Gemini API key
CORS_ORIGIN=http://localhost:5173     # Frontend URL
```

---

## Frontend Client Service

The frontend includes an `aiService` that wraps these API calls:

### Import

```javascript
import { aiService } from '../services/aiService';
```

### Usage

#### Ask AI

```javascript
try {
  const response = await aiService.askAI(
    "Your message here",
    "session-123456"
  );
  console.log(response); // AI response
} catch (error) {
  console.error(error);
}
```

#### Clear Session

```javascript
try {
  await aiService.clearSession("session-123456");
} catch (error) {
  console.error(error);
}
```

---

## WebSocket (Future Enhancement)

Currently uses REST API. Future versions may support WebSocket for:
- Real-time response streaming
- Reduced latency
- Bidirectional communication

---

## Authentication (Future Enhancement)

Currently no authentication. Production should implement:
- API keys for client authentication
- JWT tokens for user sessions
- Rate limiting per user instead of IP

---

## Versioning

Current version: **1.0.0**

Endpoints don't have version prefix (e.g., `/v1/ask-ai`). 
For future versions, use `/api/v2/ask-ai` pattern.

---

## CORS Configuration

The backend is configured to accept requests from:
- Frontend: `http://localhost:5173` (development)
- Configurable via `CORS_ORIGIN` environment variable

### CORS Headers

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Request Validation

### Input Validation Rules

- **Message length:** Max 1000 characters
- **Message content:** Non-empty, HTML tags stripped
- **Session ID:** Required, no length restriction
- **Content type:** Must be `application/json`

### Validation Errors

```json
{
  "error": "Invalid input: message must be non-empty and under 1000 characters",
  "status": 400
}
```

---

## Response Characteristics

### AI Response Properties

- **Language:** English only (customizable)
- **Response style:** Conversational, optimized for voices
- **Timeout:** 30 seconds (Gemini API timeout)
- **Max length:** Unlimited (practical limit ~5000 chars)
- **Format:** Plain text

### Deduplication

- Tracks last 5 responses per session
- Similarity threshold: 70%
- Auto-regenerates similar responses
- Max regeneration attempts: 3

---

## Session Management

### Session ID Format

```
session-{timestamp}-{random}
```

Example:
```
session-1707557690000-abc123xyz
```

### Session Storage

- **Duration:** In-memory while server running
- **Persistence:** None (add database for production)
- **Context:** Last 10-15 messages typically
- **Cleanup:** None (implement for production)

---

## Performance Metrics

### Typical Response Times

| Operation | Time |
|-----------|------|
| API request -> Gemini | 1-5 seconds |
| Gemini processing | 1-3 seconds |
| Backend processing | < 100ms |
| Network latency | < 50ms |
| **Total** | **~2-8 seconds** |

---

## Testing the API

### Using Postman

1. Create new request
2. Method: POST
3. URL: `http://localhost:5000/api/ask-ai`
4. Header: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "message": "Test message",
  "sessionId": "test-session-123"
}
```

### Using Thunder Client (VS Code)

1. Open Thunder Client extension
2. Create new request
3. Method: POST
4. URL: `http://localhost:5000/api/ask-ai`
5. Body: Same JSON as above

### Using Node.js

```javascript
const http = require('http');

const data = JSON.stringify({
  message: 'Hello',
  sessionId: 'test-123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ask-ai',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let result = '';
  res.on('data', (chunk) => result += chunk);
  res.on('end', () => console.log(JSON.parse(result)));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
```

---

## Monitoring & Logging

### Backend Logs

The backend logs:
- Request method and path
- Request duration
- Response status
- Errors with full stack trace

### Enable Debug Logging

Set `DEBUG=*` environment variable:
```bash
DEBUG=* npm run dev
```

---

## Compliance & Security

- ✅ Input sanitization
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Error message safe (no sensitive info leaks)
- ✅ API key never exposed to client
- ✅ Helmet.js security headers

---

## Support & Issues

For issues or questions:
1. Check browser console (F12)
2. Check backend logs
3. Use `/health` endpoint to verify server
4. Check CORS setup
5. Verify Gemini API key

---

## Changelog

### Version 1.0.0 (Initial Release)
- Voice-to-text functionality
- Gemini API integration
- Conversation history
- Response deduplication
- Rate limiting
- CORS support
