# Setup & Deployment Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn
- PostgreSQL (optional - SQLite is used by default)

## Environment Setup

### 1. Backend Setup

```bash
cd backend

# Copy environment template
cp ../.env.example .env

# Edit .env with your values
nano .env

# Install dependencies
python -m pip install -r requirements.txt

# Run migrations (if using a migration tool)
# alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API URL
nano .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the application at `http://localhost:3000`

## Environment Variables

### Backend (.env)

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./backend/app.db
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
CHROMA_PERSIST_DIR=./chroma_store
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Docker Deployment

```bash
# Start both services
docker-compose up --build

# Service URLs:
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## Production Deployment

### Backend (Docker)

```bash
cd backend
docker build -t flowzint-backend .
docker run -p 8000:8000 --env-file .env flowzint-backend
```

### Frontend (Next.js Build)

```bash
cd frontend
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel deploy --prod
```

## API Documentation

After starting the backend, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Troubleshooting

### CORS Issues
Ensure `BACKEND_CORS_ORIGINS` in `.env` includes your frontend URL.

### Database Issues
For SQLite:
```bash
rm backend/app.db
uvicorn app.main:app --reload
```

### Port Already in Use
Change ports in docker-compose.yml or kill the process:
```bash
# Kill port 8000
lsof -ti:8000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

## Performance Optimization

### Frontend
- Enable caching with Service Workers
- Optimize images with Next.js Image component
- Use dynamic imports for heavy components

### Backend
- Enable Redis caching for frequently accessed data
- Use database connection pooling
- Implement rate limiting for API endpoints

## Monitoring

### Backend
Add logging and monitoring with tools like:
- Sentry for error tracking
- DataDog for performance monitoring
- ELK stack for log aggregation

### Frontend
- Implement analytics with Plausible or similar
- Monitor Core Web Vitals with web-vitals
- Track user interactions with PostHog

---

For more information, see [Architecture](./architecture.md) and [API Documentation](./api.md)
