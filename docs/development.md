# Development Guide

## Project Structure

```
flowzint/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── core/         # Configuration
│   │   ├── db/           # Database session and base
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helper functions
│   │   └── main.py       # FastAPI app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and helpers
│   ├── styles/           # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
├── docs/                 # Documentation
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Adding New Features

### 1. Backend API Endpoint

Create a new router in `backend/app/api/`:

```python
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/feature", tags=["feature"])

@router.get("/")
def get_feature_data(current_user: User = Depends(get_current_user)):
    return {"feature": "data"}
```

Register in `app/api/routes.py`:

```python
from app.api.feature import router as feature_router
router.include_router(feature_router)
```

### 2. Frontend Page

Create in `frontend/app/path/page.tsx`:

```tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function FeaturePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-6 py-8">
        <Navbar />
        {/* Your content */}
      </div>
    </div>
  );
}
```

### 3. API Integration

Use the `api.ts` utilities:

```typescript
export const featureApi = {
  getData: () => api.get("/feature"),
};
```

## Code Standards

### Backend
- Use type hints in all functions
- Follow PEP 8 style guide
- Use async/await for I/O operations
- Add docstrings to complex functions

### Frontend
- Use TypeScript for all new code
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Keep components focused and testable

## Common Commands

```bash
# Backend
cd backend
uvicorn app.main:app --reload                    # Dev server
python -m pytest                                  # Run tests
python -m black app/                             # Format code
python -m pylint app/                            # Lint code

# Frontend
cd frontend
npm run dev                                       # Dev server
npm run build                                    # Build for production
npm run lint                                     # Lint code
npm run type-check                               # Type check

# Docker
docker-compose up --build                        # Start all services
docker-compose down                              # Stop all services
docker-compose logs -f backend                   # View backend logs
docker-compose logs -f frontend                  # View frontend logs
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am "Add my feature"`
3. Push to remote: `git push origin feature/my-feature`
4. Create a pull request on GitHub

## Debugging

### Backend
- Use FastAPI docs at `http://localhost:8000/docs`
- Add print statements or use debugger
- Check logs in terminal

### Frontend
- Use React DevTools browser extension
- Check browser console for errors
- Use VS Code debugger with Node.js

## Performance Tips

### Backend
- Use database indexes for frequently queried columns
- Cache results with Redis
- Implement pagination for large datasets
- Use async operations for I/O

### Frontend
- Lazy load heavy components with dynamic()
- Use React.memo() for expensive components
- Optimize images with Next.js Image component
- Implement virtual scrolling for long lists

---

For more help, see [Setup & Deployment](./setup-deployment.md)
