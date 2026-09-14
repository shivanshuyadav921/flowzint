# Flowzint - AI Interview Preparation Assistant

A premium full-stack web application for AI-powered interview preparation with resume analysis, mock interviews, answer evaluation, and performance analytics.

## Features

✨ **Core Capabilities**
- JWT-based authentication with signup/login
- Resume upload and parsing (PDF/DOCX)
- AI-generated interview questions by role, difficulty, and category
- Answer evaluation with feedback and scoring
- Conversational mock interview interface
- Dashboard analytics and performance tracking
- ChromaDB semantic retrieval for personalized coaching
- Production-ready Docker deployment
- **Vercel-ready frontend deployment**

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **AI**: OpenAI/Gemini/Groq integration, ChromaDB embeddings
- **Auth**: JWT (python-jose), bcrypt password hashing
- **Deployment**: Vercel (frontend), Docker, docker-compose

## Project Structure

```
flowzint/
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend (Vercel-deployable)
├── docs/              # Architecture & API documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker (optional)

### Option 1: Deploy to Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set **Root Directory** to `frontend`
4. Add environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = your backend URL (e.g., `https://your-backend.onrender.com/api`)
5. Click **Deploy**

> **Note**: The backend (FastAPI) needs to be deployed separately on a platform like [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io). Set the `BACKEND_CORS_ORIGINS` env var on your backend to include your Vercel frontend URL.

### Option 2: Docker (Full Stack)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# Then start services
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 3: Manual Setup

**Backend Setup**
```bash
cd backend

# Copy and configure environment
cp ../.env.example .env

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup** (in new terminal)
```bash
cd frontend

# Copy and configure environment
cp .env.example .env.local

# Install dependencies
npm install

# Run development server
npm run dev
```

Access frontend at http://localhost:3000

## Environment Setup

### Backend (.env)

```env
SECRET_KEY=your-secret-key-min-32-chars
DATABASE_URL=sqlite:///./backend/app.db
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
GROQ_API_KEY=your-groq-key
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://your-app.vercel.app"]
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

> **For Vercel**: Set `NEXT_PUBLIC_API_URL` in your Vercel project's Environment Variables settings to point to your deployed backend.

## Vercel Deployment Guide

### Step 1: Deploy Backend
Deploy the FastAPI backend to any Python-compatible hosting:

| Platform | How |
|----------|-----|
| **Render** | Connect repo → set root to `backend` → start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Railway** | Connect repo → set root to `backend` → auto-detects Python |
| **Fly.io** | `fly launch` from `backend/` directory |

### Step 2: Deploy Frontend to Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** = `frontend`
3. Framework = **Next.js** (auto-detected)
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`
5. Deploy!

### Step 3: Update Backend CORS
Add your Vercel URL to the backend's `BACKEND_CORS_ORIGINS` environment variable:
```
BACKEND_CORS_ORIGINS=["https://your-app.vercel.app"]
```

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Setup & Deployment Guide](./docs/setup-deployment.md)
- [Development Guide](./docs/development.md)

## Key Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Resumes
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/mine` - List resumes

### Interviews
- `POST /api/interview/generate` - Generate questions
- `POST /api/interview/evaluate` - Evaluate answer
- `GET /api/interview/history` - Session history

### Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/session/{id}` - Get session

### Analytics
- `GET /api/analytics/summary` - Performance metrics

Full API docs available at `http://localhost:8000/docs`

## Development

### Running Tests

```bash
# Backend
cd backend
pytest tests/

# Frontend
cd frontend
npm run test
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Common Issues

**Port already in use:**
```bash
# Kill port 8000
lsof -ti:8000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

**CORS errors:**
Ensure `BACKEND_CORS_ORIGINS` in your backend `.env` includes your Vercel frontend URL.

**Database errors:**
```bash
# Reset SQLite database
rm backend/app.db
uvicorn app.main:app --reload
```

**Vercel build fails:**
- Ensure Root Directory is set to `frontend`
- Check that `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- Run `npm run build` locally first to verify

## License

MIT License

## Support

For issues or questions, please open a GitHub issue.

---

**Next Steps:**
- [View Architecture](./docs/architecture.md)
- [Deploy to Vercel](#vercel-deployment-guide)
- [Start Development](./docs/development.md)
