from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sockets.s2s_handler import speech_to_speech_endpoint
from routers import auth, shop, cms, admin
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(shop.router, prefix="/api")
app.include_router(cms.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "online", "modules": ["auth", "shop", "cms", "admin", "3d"]}

@app.websocket("/ws/s2s")
async def websocket_endpoint(websocket: WebSocket):
    await speech_to_speech_endpoint(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
