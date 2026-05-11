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

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL/SQLite
- **AI**: OpenAI/Gemini/Groq integration, ChromaDB embeddings
- **Auth**: JWT (python-jose), bcrypt password hashing
- **Deployment**: Docker, docker-compose

## Project Structure

```
flowzint/
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend
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

### Option 1: Docker (Recommended)

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

### Option 2: Manual Setup

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
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
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

## Performance Optimization

- Server-side rendering with Next.js
- Dynamic imports for heavy components
- Database query optimization and indexing
- Redis caching support
- Async FastAPI routes
- Lazy loading and pagination

## Security

- JWT authentication with secure tokens
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- Environment variable protection

## Common Issues

**Port already in use:**
```bash
# Kill port 8000
lsof -ti:8000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

**CORS errors:**
Ensure `BACKEND_CORS_ORIGINS` in `.env` includes your frontend URL

**Database errors:**
```bash
# Reset SQLite database
rm backend/app.db
uvicorn app.main:app --reload
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Commit: `git commit -am "Add feature"`
4. Push: `git push origin feature/my-feature`

## License

MIT License

## Support

For issues or questions, please open a GitHub issue.

---

**Next Steps:**
- [View Architecture](./docs/architecture.md)
- [Setup Production Deployment](./docs/setup-deployment.md)
- [Start Development](./docs/development.md)
