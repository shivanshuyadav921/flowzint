# Troubleshooting & Performance Guide

## Common Issues & Solutions

### Backend Issues

#### 1. Port 8000 Already in Use
```bash
# Find process on port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use this one-liner
lsof -ti:8000 | xargs kill -9
```

#### 2. Database Locked / Connection Issues
```bash
# For SQLite
rm backend/app.db

# Restart the server
uvicorn app.main:app --reload
```

#### 3. Import Errors / Module Not Found
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

#### 4. CORS Errors in Frontend
Edit `.env` in backend:
```env
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

#### 5. API Returns 401 Unauthorized
- Check token is being sent in Authorization header
- Verify SECRET_KEY is set in .env
- Ensure token hasn't expired

#### 6. Resume Upload Fails
```bash
# Ensure file parser dependencies are installed
pip install pdfminer.six python-docx

# Test file parsing manually
python -c "from app.utils.file_parser import extract_resume_text"
```

### Frontend Issues

#### 1. Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

#### 2. Module Not Found / Dependencies Issue
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 3. TypeScript Errors
```bash
# Type check
npm run type-check

# Generate types
npm run build
```

#### 4. API Connection Issues
Check `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### 5. Authentication Lost After Refresh
- Check browser localStorage for token
- Verify token expiration time
- Check Zustand persist middleware

#### 6. Tailwind Styles Not Loading
```bash
# Rebuild CSS
npm run build

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Docker Issues

#### 1. Container Fails to Start
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild
docker-compose down
docker-compose up --build
```

#### 2. Port Conflicts in Docker
Edit `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Change 8000 to 8001
  - "3001:3000"  # Change 3000 to 3001
```

#### 3. Volume Permission Issues
```bash
# Fix permissions
docker-compose down
docker volume prune
docker-compose up --build
```

---

## Performance Optimization

### Backend Optimization

#### 1. Database Query Optimization
```python
# ✅ Good: Use eager loading
from sqlalchemy.orm import joinedload
resumes = db.query(Resume).options(joinedload(Resume.owner)).all()

# ✅ Good: Pagination for large datasets
from sqlalchemy import limit, offset
resumes = db.query(Resume).limit(20).offset(0).all()

# ❌ Avoid: N+1 queries
resumes = db.query(Resume).all()
for resume in resumes:
    print(resume.owner.email)  # Extra query per resume!
```

#### 2. Add Database Indexes
```python
# In models
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    created_at = Column(DateTime, index=True)
```

#### 3. Implement Caching
```python
# Add Redis caching
from functools import lru_cache

@lru_cache(maxsize=128)
def get_analytics(user_id: int):
    return db.query(AnalyticsRecord).filter_by(user_id=user_id).all()
```

#### 4. Use Async Properly
```python
# ✅ Correct: async service calls
async def generate_questions(...):
    result = await call_openai(prompt)
    return result

# ❌ Avoid: Blocking I/O in async routes
def get_data():
    time.sleep(5)  # Don't do this!
```

#### 5. Connection Pooling
```python
# In db/session.py
from sqlalchemy.pool import QueuePool

engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=40,
)
```

### Frontend Optimization

#### 1. Code Splitting
```typescript
// ✅ Good: Dynamic import
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('@/components/charts/score-chart'))

// ❌ Avoid: Large bundle
import * as HeavyComponent from '@/components/heavy'
```

#### 2. Component Memoization
```typescript
// ✅ Good: Memoize expensive components
export const AnalyticsCard = React.memo(({ data }) => {
  return <Card>{data}</Card>
})

// ❌ Avoid: Re-render on every parent update
export const Card = ({ data }) => <div>{data}</div>
```

#### 3. Image Optimization
```typescript
// ✅ Good: Next.js Image component
import Image from 'next/image'
<Image src={url} alt="Resume" width={200} height={300} />

// ❌ Avoid: HTML img tag
<img src={url} alt="Resume" />
```

#### 4. Efficient State Management
```typescript
// ✅ Good: Zustand for global state
const { token, setToken } = useAuth()

// ✅ Good: Local state for form data
const [formData, setFormData] = useState({})

// ❌ Avoid: Context for frequently changing data
const AuthContext = createContext()
```

#### 5. Data Fetching Optimization
```typescript
// ✅ Good: SWR with cache
const { data: resumes } = useResumes()

// ✅ Good: Conditional fetching
const { data: analytics } = useAnalytics(isOpen)

// ❌ Avoid: Multiple API calls
fetch('api/data1').then(() => fetch('api/data2'))
```

### General Performance Tips

#### 1. Enable Compression
```bash
# Backend: Install middleware
pip install compression

# Frontend: Next.js does this automatically
```

#### 2. Implement Pagination
```python
# Limit results
per_page = 20
page = request.query_params.get("page", 1)
offset = (page - 1) * per_page
results = db.query(Model).offset(offset).limit(per_page)
```

#### 3. Use CDN for Static Assets
```typescript
// Configure Next.js for CDN
// next.config.mjs
export default {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },
}
```

#### 4. Monitor Performance
```typescript
// Frontend: Use web-vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

#### 5. Lazy Load Components
```typescript
// Load components on scroll
import { useInView } from 'react-intersection-observer'

const { ref, inView } = useInView()
return (
  <div ref={ref}>
    {inView && <HeavyComponent />}
  </div>
)
```

---

## Monitoring & Debugging

### Backend Logging
```python
import logging

logger = logging.getLogger(__name__)

@app.get("/api/data")
async def get_data():
    logger.info("Fetching data")
    try:
        data = fetch_data()
        logger.debug(f"Data: {data}")
        return data
    except Exception as e:
        logger.error(f"Error: {e}")
        raise
```

### Frontend Console Debugging
```typescript
// Add custom logging
const logger = {
  log: (msg: string) => console.log(`[LOG] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
}

// Use in components
logger.log("Component mounted")
```

### Performance Profiling
```typescript
// Measure function execution time
const start = performance.now()
doSomething()
const end = performance.now()
console.log(`Executed in ${end - start}ms`)
```

---

## Load Testing

### Using Apache Bench (Backend)
```bash
# Install
sudo apt-get install apache2-utils

# Simple test
ab -n 100 -c 10 http://localhost:8000/api/user/me

# With headers
ab -n 100 -c 10 \
  -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/resume/mine
```

### Using k6 (Load Testing)
```bash
# Install k6
brew install k6

# Create test script
cat > test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  let res = http.get('http://localhost:3000');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
EOF

# Run test
k6 run test.js
```

---

## Production Checklist

- ✅ Change SECRET_KEY to secure random string
- ✅ Set DATABASE_URL to production database
- ✅ Update BACKEND_CORS_ORIGINS for production domain
- ✅ Enable HTTPS
- ✅ Set proper environment variables
- ✅ Test all API endpoints
- ✅ Set up error monitoring (Sentry)
- ✅ Configure logging
- ✅ Set up backups
- ✅ Enable rate limiting
- ✅ Use strong database credentials
- ✅ Enable CSRF protection if needed
- ✅ Test authentication flow
- ✅ Verify file upload limits
- ✅ Set up monitoring

---

For more help, see:
- [Setup Guide](./setup-deployment.md)
- [Development Guide](./development.md)
- [Quick Reference](./QUICK_REFERENCE.md)
