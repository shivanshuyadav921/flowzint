# Architecture Overview

## Backend
- FastAPI application serving REST APIs under `/api`
- JWT authentication with `python-jose` and `passlib`
- SQLAlchemy models for users, resumes, interviews, conversations, and analytics
- Resume parsing using `pdfminer.six` and `python-docx`
- AI orchestration via OpenAI-compatible endpoints
- Semantic retrieval through ChromaDB and embeddings
- Modular structure: `app/api`, `app/models`, `app/schemas`, `app/services`, `app/utils`

## Frontend
- Next.js App Router with TypeScript and Tailwind CSS
- Reusable UI primitives and premium dashboard layout
- Pages for landing, auth, dashboard, mock interview, resume analyzer, analytics, history, settings
- Animated components powered by Framer Motion
- Responsive layout with a polished dark SaaS design

## Deployment
- Docker support with `docker-compose.yml`
- Backend runs on port `8000`
- Frontend runs on port `3000`
- Environment variables configured via `.env`

## Data Flow
1. User signs up / logs in via frontend.
2. Frontend stores JWT and calls protected backend routes.
3. Resume uploads are parsed and saved; metadata is extracted.
4. AI endpoints generate questions, evaluate answers, and power mock interviews.
5. Analytics and history routes provide metrics and session trends.
