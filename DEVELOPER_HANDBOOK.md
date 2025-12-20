# Developer Handbook — Best Practices & Standards

Professional development guidelines for the Mehaal Platform.

---

## Code Quality Standards

### TypeScript / JavaScript Frontend

#### Naming Conventions
```typescript
// Components - PascalCase
const HeroSection = () => {}
const AdminDashboard = () => {}

// Variables & Functions - camelCase
const userId = "123"
const fetchUserData = () => {}

// Constants - UPPER_SNAKE_CASE
const API_TIMEOUT = 5000
const MAX_FILE_SIZE = 10485760

// Interfaces/Types - PascalCase
interface UserData {
  id: string
  email: string
}

type SettingsConfig = {
  theme: string
  language: string
}
```

#### Component Structure
```typescript
// Recommended structure
interface Props {
  title: string
  onClose?: () => void
}

export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  // 1. State
  const [isLoading, setIsLoading] = useState(false)
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // 3. Handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // 4. JSX
  return (
    <div className="component">
      {/* JSX here */}
    </div>
  )
}
```

#### Import Organization
```typescript
// 1. External packages
import React, { useState } from 'react'
import axios from 'axios'

// 2. Internal packages
import { api } from '@/lib/api'
import { Button } from '@/components/Button'

// 3. Types & Constants
import type { User } from '@/types'
import { MAX_RETRIES } from '@/constants'

// 4. Styles (last)
import styles from './Component.module.css'
```

### Python Backend

#### Module Organization
```python
# 1. Standard library imports
import os
from datetime import datetime
from typing import List, Optional

# 2. Third-party imports
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# 3. Local imports
from app.models import User
from app.schemas import UserSchema
from app.database import get_db
```

#### Naming Conventions
```python
# Functions & Variables - snake_case
def get_user_by_id(user_id: int) -> User:
    pass

current_user_id = 123

# Classes - PascalCase
class UserService:
    pass

# Constants - UPPER_SNAKE_CASE
MAX_LOGIN_ATTEMPTS = 5
API_VERSION = "v1"
```

#### Function Signatures
```python
@router.get("/users/{user_id}", response_model=UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
) -> UserOut:
    """
    Retrieve user by ID.
    
    Args:
        user_id: The user ID to retrieve
        db: Database session dependency
        
    Returns:
        UserOut: The user data
        
    Raises:
        HTTPException: If user not found
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

---

## Documentation Standards

### Commenting Guidelines

#### What to Comment
✅ **DO Comment**
- Why something is done (not how)
- Complex algorithm explanations
- Workarounds for known issues
- Security/performance critical sections

❌ **DON'T Comment**
- Self-explanatory code
- Variable assignments
- Simple loops/conditions

#### Comment Format

**JavaScript/TypeScript:**
```typescript
// Single line comment for brief explanations

/**
 * Multi-line comment for complex logic
 * explaining the reasoning and approach
 */

// FIXME: Known issue description
// TODO: Future improvement description
```

**Python:**
```python
# Single line comment

def function_name():
    """
    Multi-line docstring for functions.
    
    Args:
        param1: Description
        
    Returns:
        Description of return value
        
    Raises:
        ExceptionType: When this occurs
    """
    pass
```

### README Files

Every module should have a `README.md`:

```markdown
# Module Name

Brief description of what this module does.

## Features
- Feature 1
- Feature 2

## Usage
```typescript
// Code example
```

## API Reference
- `functionName()` — Description
- `AnotherComponent` — Description

## Notes
- Important implementation detail
- Known limitation
```

---

## Git Workflow

### Branch Naming

```
main                      # Production-ready code
├── dev                   # Development branch
├── feature/user-auth     # New features
├── bugfix/login-issue    # Bug fixes
├── hotfix/security-patch # Emergency fixes
└── chore/deps-update     # Maintenance
```

### Commit Messages

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code reorganization
- `perf:` Performance improvement
- `docs:` Documentation update
- `test:` Test addition/modification
- `chore:` Maintenance/dependencies

**Examples:**
```
feat(hero): add motion animation presets

Implement react-spring based animations for hero entry,
idle, and CTA states. Add presets to motion.ts module.

Closes #123
```

```
fix(admin): resolve platform settings save issue

Fix issue where PUT request wasn't validating empty
fields. Added validation schema to pydantic model.

Fixes #456
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update

## Testing
How to test this change:

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

---

## Performance Guidelines

### Frontend Performance

#### Code Splitting
```typescript
// Use dynamic imports for large components
const AdminDashboard = lazy(() => import('@/admin/Dashboard'))

// Use in routes with Suspense
<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

#### Memoization
```typescript
// Memoize expensive components
const HeroSection = React.memo(({ platform, content }) => {
  return <section>...</section>
})

// Memoize callbacks
const handleSubmit = useCallback(() => {
  // Handle submission
}, [dependency])
```

#### Image Optimization
```typescript
// Use responsive images
<img
  src={imagePath}
  alt="Description"
  srcSet={`${image}@1x.jpg 1x, ${image}@2x.jpg 2x`}
  loading="lazy"
/>

// Or use modern format
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

### Backend Performance

#### Database Optimization
```python
# Use select() for specific columns
users = db.query(User.id, User.email).all()

# Use eager loading
from sqlalchemy.orm import joinedload
user = db.query(User).options(joinedload(User.posts)).first()

# Add database indexes
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
```

#### Caching Strategy
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_platform_settings():
    """Cache platform settings for 1 hour"""
    return db.query(PlatformSettings).first()
```

---

## Testing Standards

### Frontend Tests

```typescript
// Example with Vitest + React Testing Library
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/Hero'

describe('HeroSection', () => {
  it('renders headline', () => {
    render(<HeroSection headline="Test Headline" />)
    expect(screen.getByText('Test Headline')).toBeInTheDocument()
  })

  it('applies theme colors', () => {
    const { container } = render(
      <HeroSection backgroundColor="#000" />
    )
    expect(container.firstChild).toHaveStyle('backgroundColor: #000')
  })
})
```

### Backend Tests

```python
# Example with pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_platform_settings():
    response = client.get("/api/platform-settings")
    assert response.status_code == 200
    assert "primary_color" in response.json()

def test_update_platform_settings():
    payload = {"primary_color": "#FF0000"}
    response = client.put("/api/platform-settings", json=payload)
    assert response.status_code == 200
    assert response.json()["primary_color"] == "#FF0000"
```

---

## Security Best Practices

### Frontend Security

```typescript
// ✅ Use environment variables for sensitive data
const API_URL = import.meta.env.VITE_API_URL

// ✅ Never hardcode secrets
// ❌ const API_KEY = "sk_live_abc123..."

// ✅ Escape user input (React does this by default)
<div>{userInput}</div> // Safe

// ✅ Use HTTPS only in production
// ✅ Set security headers
// ✅ Validate form inputs before sending
```

### Backend Security

```python
# ✅ Validate all inputs with Pydantic
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Add validation: min length, complexity

# ✅ Use environment variables
import os
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ Implement rate limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/data")
@limiter.limit("100/minute")
def get_data(request: Request):
    pass

# ✅ Use CORS properly
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)
```

---

## API Design Standards

### REST Conventions

```
GET    /api/users              # List all users
POST   /api/users              # Create new user
GET    /api/users/{id}         # Get specific user
PUT    /api/users/{id}         # Update user
DELETE /api/users/{id}         # Delete user

GET    /api/users/{id}/posts   # Get user's posts
POST   /api/users/{id}/posts   # Create post for user
```

### Response Format

```typescript
// Success Response
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "meta": {
    "timestamp": "2025-12-20T10:30:00Z",
    "version": "1.0"
  }
}

// Error Response
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": {
    "timestamp": "2025-12-20T10:30:00Z",
    "request_id": "abc-123"
  }
}
```

---

## Environment Configuration

### Development (.env.development)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
NODE_ENV=development
```

### Production (.env.production)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_DEBUG=false
NODE_ENV=production
```

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname
ENVIRONMENT=production

# Security
SECRET_KEY=your-secret-key-min-32-chars
CORS_ORIGINS=["https://yourdomain.com"]

# API
API_TIMEOUT=30
LOG_LEVEL=INFO
```

---

## Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] All tests passing
- [ ] ESLint/Prettier checks pass
- [ ] Type checking (TypeScript) passes
- [ ] No console.log() left in code
- [ ] No hardcoded secrets
- [ ] Code reviewed by at least 1 person

### Build
- [ ] Production build succeeds
- [ ] Build size is acceptable
- [ ] Source maps excluded from build
- [ ] Assets are optimized

### Security
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation complete
- [ ] Database backups configured

### Monitoring
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Health check endpoint working
- [ ] Logs aggregation setup

### Documentation
- [ ] README updated
- [ ] Deployment steps documented
- [ ] Environment variables documented
- [ ] API endpoints documented

---

## Tools & Setup

### Recommended Tools

**Frontend:**
- VS Code with ESLint, Prettier extensions
- React DevTools
- Redux DevTools (if applicable)
- Chrome DevTools

**Backend:**
- PyCharm or VS Code with Python extension
- Postman or Thunder Client
- pgAdmin for database
- Docker Desktop

**DevOps:**
- AWS/GCP console
- Monitoring dashboard (Datadog/NewRelic)
- Log aggregation (CloudWatch/ELK)

---

## Resources

- **React Docs:** https://react.dev
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **TypeScript Handbook:** https://www.typescriptlang.org/docs
- **SQLAlchemy Docs:** https://docs.sqlalchemy.org
- **PostgreSQL Docs:** https://www.postgresql.org/docs

---

## Questions & Support

For clarification on these standards:
1. Check the relevant documentation
2. Review existing code as examples
3. Ask in code review
4. Update this handbook if standards need clarification

---

**Version:** 1.0  
**Last Updated:** December 2025  
**Maintainer:** Development Team

Happy coding! 🚀
