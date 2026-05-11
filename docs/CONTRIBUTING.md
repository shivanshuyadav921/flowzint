# Contributing Guide

## Welcome! 👋

We're excited that you want to contribute to Flowzint! This guide will help you get started.

## Code of Conduct

Please be respectful and inclusive. Treat others how you'd like to be treated.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/flowzint.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes
5. Push to your fork: `git push origin feature/my-feature`
6. Open a Pull Request

## Development Workflow

### Backend

1. Create a new branch for your feature
2. Write code following PEP 8 standards
3. Add type hints to all functions
4. Write tests for new functionality
5. Run linters: `black app/ && pylint app/`
6. Test your changes: `pytest`

### Frontend

1. Create a new branch for your feature
2. Write code in TypeScript
3. Follow React best practices
4. Use Tailwind CSS for styling
5. Test your changes: `npm run type-check && npm run lint`
6. Test in browser

## Code Style

### Backend (Python)

```python
# ✅ Good
def get_user_by_email(db: Session, email: str) -> User:
    """Retrieve user by email address."""
    return db.query(User).filter(User.email == email.lower()).first()

# ✅ Good: Type hints and docstring
async def generate_interview_questions(
    role: str,
    difficulty: str,
    categories: list[str],
) -> str:
    """Generate interview questions using AI."""
    prompt = f"Generate questions for {role} role..."
    return await call_openai(prompt)

# ❌ Bad: No type hints or docstring
def process_data(data):
    return transformed_data

# ❌ Bad: Magic numbers
score = data * 100 / 4.5
```

### Frontend (TypeScript)

```typescript
// ✅ Good: Proper typing and naming
interface UserProfile {
  email: string;
  fullName: string;
  createdAt: Date;
}

const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

// ✅ Good: Component with clear props
interface CardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  isLoading = false,
}) => {
  return <div>{isLoading ? <Skeleton /> : children}</div>;
};

// ❌ Bad: No typing
const getUser = async (id) => {
  return fetch(`/user/${id}`);
};

// ❌ Bad: Any types
const processData: any = (data: any) => any;
```

## Commit Messages

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "feat: Add resume upload endpoint"
git commit -m "fix: Correct JWT token expiration logic"
git commit -m "docs: Update API documentation"
git commit -m "refactor: Simplify user authentication flow"
git commit -m "test: Add tests for resume parser"

# Bad examples
git commit -m "Fix bugs"
git commit -m "Changes"
git commit -m "WIP"
```

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation if needed
3. Add a clear description of your changes
4. Reference any related issues: `Closes #123`
5. Wait for review and address feedback

### PR Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

## Adding Features

### Backend: Adding a New Endpoint

1. Create schema in `app/schemas/`
2. Add endpoint in `app/api/{resource}.py`
3. Create service in `app/services/` if needed
4. Add model in `app/models/` if needed
5. Test with FastAPI docs at `/docs`

Example:
```python
# app/schemas/new_resource.py
from pydantic import BaseModel

class NewResourceCreate(BaseModel):
    name: str
    description: str | None = None

# app/api/new_resource.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/new_resource", tags=["new_resource"])

@router.post("/")
async def create_new_resource(
    data: NewResourceCreate,
    current_user: User = Depends(get_current_user),
):
    # Implementation
    return {"created": True}
```

### Frontend: Adding a New Page

1. Create page in `app/section/page.tsx`
2. Create components in `components/`
3. Use existing components and styles
4. Test responsiveness
5. Add navigation links

Example:
```typescript
// app/section/page.tsx
"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Card } from "@/components/ui/card";

export default function SectionPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 px-6 py-8">
        <Navbar />
        <div className="mt-8 space-y-6">
          <Card title="My Card">
            <p>Content here</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## Testing Guidelines

### Backend Tests

```python
# tests/test_auth.py
import pytest
from app.services.auth_service import authenticate_user

def test_authenticate_user_success(db):
    # Arrange
    user = create_test_user(db, "test@example.com", "password123")
    
    # Act
    authenticated = authenticate_user(db, "test@example.com", "password123")
    
    # Assert
    assert authenticated is not None
    assert authenticated.email == "test@example.com"

def test_authenticate_user_wrong_password(db):
    create_test_user(db, "test@example.com", "password123")
    authenticated = authenticate_user(db, "test@example.com", "wrong")
    assert authenticated is None
```

### Frontend Tests

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Documentation

Update documentation when making changes:

- Update `docs/` files for architectural changes
- Update README for setup/usage changes
- Add docstrings to functions
- Comment complex logic
- Update API docs for new endpoints

## Performance Considerations

- Use pagination for large datasets
- Implement caching where appropriate
- Optimize database queries
- Use lazy loading for components
- Minimize API calls
- Test on slow networks

## Security Best Practices

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries (SQLAlchemy handles this)
- Check permissions before returning data
- Hash sensitive data
- Use HTTPS in production

## Review Process

All pull requests must pass:

1. Code style checks
2. Type checking (TypeScript/MyPy)
3. Automated tests
4. Manual review
5. Merge conflicts resolved

## Questions?

- Check the [Development Guide](./development.md)
- Review [Troubleshooting](./TROUBLESHOOTING.md)
- Ask in Pull Request or Issues

Thank you for contributing! 🎉
