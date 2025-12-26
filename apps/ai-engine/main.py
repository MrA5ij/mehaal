import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sockets.s2s_handler import speech_to_speech_endpoint
from routers import auth, shop, cms, admin

# Environment Variables se settings uthana (12-Factor App methodology)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
IS_DEBUG = os.getenv("DEBUG", "False").lower() == "true"

app = FastAPI(
    title="Mehaal AI Engine",
    docs_url="/docs" if IS_DEBUG else None, # Production main docs hide karna security best practice hai
    redoc_url=None
)

# Dynamic CORS Policy
origins = [
    FRONTEND_URL,
    "https://mehaal.tech", # Add production domain manually if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(shop.router, prefix="/api/v1/shop", tags=["Shop"])
app.include_router(cms.router, prefix="/api/v1/cms", tags=["CMS"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/health")
def health_check():
    """K8s Liveness Probe endpoint"""
    return {"status": "online", "environment": "production" if not IS_DEBUG else "development"}

@app.websocket("/ws/s2s")
async def websocket_endpoint(websocket: WebSocket):
    await speech_to_speech_endpoint(websocket)

# Note: Production main ye block nahi chalta, Docker Gunicorn use karega.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=IS_DEBUG)