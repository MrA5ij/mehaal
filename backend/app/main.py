from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.models import Base
from app.routes import (
    home_page,
    pricing,
    features,
    docs,
    login,
    signup,
    legal,
    settings,
    media
)
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mehaal CMS API",
    description="FastAPI backend for Mehaal website with comprehensive CMS",
    version="1.0.0"
)

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(home_page.router)
app.include_router(pricing.router)
app.include_router(features.router)
app.include_router(docs.router)
app.include_router(login.router)
app.include_router(signup.router)
app.include_router(legal.router)
app.include_router(settings.router)
app.include_router(media.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Mehaal CMS API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "endpoints": {
            "home_page": "/api/home-page",
            "pricing": "/api/pricing",
            "features": "/api/features",
            "docs": "/api/docs",
            "auth_pages": "/api/auth-pages",
            "legal": "/api/legal",
            "settings": "/api/settings",
            "media": "/api/media"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
