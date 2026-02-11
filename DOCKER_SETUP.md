# Docker Setup (Optional)

## Dockerfile for Backend

Save as `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## Dockerfile for Frontend

Save as `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

## Docker Compose

Save as `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PORT=5000
      - CORS_ORIGIN=http://frontend:3000
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5000/api
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Usage

### Build Images
```bash
docker-compose build
```

### Run Services
```bash
GEMINI_API_KEY=your_key docker-compose up
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

## Production Deployment

For production, consider:
- Add nginx as reverse proxy
- Use environment variables for configuration
- Set up health checks
- Add volume mounts for persistence
- Configure resource limits
