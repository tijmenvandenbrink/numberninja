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
    allow_origins=["*"],  # Allow all origins in K8s environment
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