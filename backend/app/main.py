from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import game

app = FastAPI(
    title="Number Ninja API",
    description="Backend API for Number Ninja - A gamified math practice app for kids",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(game.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Number Ninja API! 🥷🧮"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "number-ninja-api"}