# Quick Reference

## Directory Structure

```
flowzint/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI entry point
│   │   ├── api/                         # Route handlers
│   │   │   ├── __init__.py
│   │   │   ├── auth.py                  # Login/Signup
│   │   │   ├── user.py                  # User info
│   │   │   ├── resume.py                # Resume upload
│   │   │   ├── interview.py             # Questions & evaluation
│   │   │   ├── chat.py                  # Mock interview chat
│   │   │   ├── analytics.py             # Performance metrics
│   │   │   ├── deps.py                  # Dependency injection
│   │   │   └── routes.py                # Router aggregation
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py                # Environment config
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── base.py                  # ORM base
│   │   │   └── session.py               # Database setup
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User model
│   │   │   ├── resume.py                # Resume model
│   │   │   ├── interview.py             # Interview model
│   │   │   ├── chat.py                  # Message model
│   │   │   └── analytics.py             # Analytics model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User schemas
│   │   │   ├── token.py                 # Token schema
│   │   │   ├── resume.py                # Resume schemas
│   │   │   ├── interview.py             # Interview schemas
│   │   │   ├── chat.py                  # Chat schemas
│   │   │   └── analytics.py             # Analytics schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py          # Auth logic
│   │   │   ├── resume_service.py        # Resume parsing
│   │   │   ├── ai_service.py            # AI provider calls
│   │   │   └── rag_service.py           # ChromaDB memory
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── security.py              # JWT & hashing
│   │       └── file_parser.py           # PDF/DOCX parsing
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── app/
│   │   ├── page.tsx                     # Landing page
│   │   ├── layout.tsx                   # Root layout
│   │   ├── globals.css                  # Global styles
│   │   ├── auth/
│   │   │   ├── login/page.tsx           # Login page
│   │   │   └── signup/page.tsx          # Signup page
│   │   └── dashboard/
│   │       ├── layout.tsx               # Protected layout
│   │       ├── page.tsx                 # Dashboard home
│   │       ├── mock/page.tsx            # Mock interview
│   │       ├── resume/page.tsx          # Resume analyzer
│   │       ├── analytics/page.tsx       # Analytics
│   │       ├── history/page.tsx         # Interview history
│   │       └── settings/page.tsx        # User settings
│   ├── components/
│   │   ├── index.ts                     # Component exports
│   │   ├── navbar.tsx                   # Top navigation
│   │   ├── sidebar.tsx                  # Sidebar nav
│   │   ├── skeleton.tsx                 # Loading skeleton
│   │   ├── error-boundary.tsx           # Error boundary
│   │   ├── ui/
│   │   │   ├── button.tsx               # Button component
│   │   │   ├── input.tsx                # Input component
│   │   │   ├── card.tsx                 # Card component
│   │   │   └── modal.tsx                # Modal component
│   │   └── charts/
│   │       └── score-chart.tsx          # Recharts component
│   ├── hooks/
│   │   ├── index.ts                     # Hook exports
│   │   ├── use-api.ts                   # SWR hooks
│   │   └── use-toast.ts                 # Toast hook
│   ├── lib/
│   │   ├── api.ts                       # Axios client
│   │   ├── store.ts                     # Zustand store
│   │   └── protected-route.tsx          # Route protection
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.mjs
│   └── .env.example
├── docs/
│   ├── PROJECT_SUMMARY.md               # This file
│   ├── README.md                        # Overview
│   ├── architecture.md                  # Architecture
│   ├── api.md                           # API docs
│   ├── setup-deployment.md              # Setup guide
│   └── development.md                   # Dev guide
├── .env.example                         # Environment template
├── .gitignore                           # Git ignore rules
├── docker-compose.yml                   # Docker orchestration
├── setup.sh                             # Setup script
└── README.md                            # Project README
```

## Commands Quick Reference

### Backend
```bash
cd backend

# Development
uvicorn app.main:app --reload

# Testing
pytest tests/

# Linting
black app/
pylint app/

# Production
gunicorn app.main:app -w 4
```

### Frontend
```bash
cd frontend

# Development
npm run dev                   # Hot reload on :3000

# Build
npm run build                # Production build
npm run start                # Start production server

# Type checking
npm run type-check           # TypeScript check

# Linting
npm run lint                 # ESLint check
```

### Docker
```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## API Quick Reference

### Auth
```
POST   /api/auth/signup         { email, password, full_name }
POST   /api/auth/login          { username, password }
GET    /api/user/me
```

### Resumes
```
POST   /api/resume/upload       (multipart file)
GET    /api/resume/mine
```

### Interviews
```
POST   /api/interview/generate  { role, difficulty, categories, resume_id? }
POST   /api/interview/evaluate  { session_id, answer_text, question_index }
GET    /api/interview/history
```

### Chat
```
POST   /api/chat/message        { session_id, role, content }
GET    /api/chat/session/{id}
```

### Analytics
```
GET    /api/analytics/summary
```

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./app.db
OPENAI_API_KEY=your-key
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
CHROMA_PERSIST_DIR=./chroma_store
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Key Technologies

- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: JWT (python-jose)
- **State**: Zustand
- **HTTP**: Axios, SWR
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide
- **Styling**: Tailwind CSS

## File Naming Conventions

- **API routes**: `{resource}.py` (auth.py, resume.py)
- **Components**: `{ComponentName}.tsx` (PascalCase)
- **Pages**: `page.tsx` (routes defined by directory)
- **Utilities**: `{utility-name}.ts` (kebab-case)
- **Hooks**: `use-{hook-name}.ts` (kebab-case with use- prefix)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:8000 \| xargs kill -9` |
| CORS error | Check BACKEND_CORS_ORIGINS in .env |
| DB locked | Delete app.db and restart |
| Module not found | Run `npm install` or `pip install -r requirements.txt` |
| Type errors | Run `npm run type-check` |

## Performance Tips

✅ Use dynamic imports for heavy components
✅ Implement proper caching headers
✅ Optimize database queries with indexes
✅ Use async operations
✅ Compress API responses
✅ Lazy load images
✅ Use pagination for large lists
✅ Cache API responses with SWR

## Security Checklist

✅ Change SECRET_KEY in production
✅ Use strong DATABASE_URL
✅ Set proper CORS origins
✅ Enable HTTPS in production
✅ Validate all user inputs
✅ Use environment variables for secrets
✅ Implement rate limiting
✅ Add CSRF protection if needed

---

For detailed information, see:
- [Setup Guide](./setup-deployment.md)
- [Development Guide](./development.md)
- [API Documentation](./api.md)
