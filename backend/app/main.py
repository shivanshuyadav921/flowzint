from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
import logging

from app.api.routes import router as api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
import app.models  # noqa: F401 - Register all models for SQLAlchemy

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Flowzint AI Interview Assistant API",
    description="Backend API for AI-powered interview preparation and resume analysis.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "app": "Flowzint AI Interview Assistant API", "version": "0.1.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
