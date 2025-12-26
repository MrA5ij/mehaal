from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.database import get_db
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

# Security Config
SECRET_KEY = "super_secret_key_change_this"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/auth/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Check User in DB
    result = await db.execute(text("SELECT id, password, role FROM \"User\" WHERE email = :email"), {"email": request.email})
    user = result.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Verify Password (Mocking hash check if DB has plain text for dev, use verify in prod)
    # In real prod: pwd_context.verify(request.password, user.password)
    if request.password != user.password: 
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3. Generate JWT
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
