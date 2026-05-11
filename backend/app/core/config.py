import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "Flowzint AI Interview Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = Field(default="dev-secret-key", env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = Field(default="sqlite:///./app.db", env="DATABASE_URL")
    BACKEND_CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000"], env="BACKEND_CORS_ORIGINS")
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY")
    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")
    GROQ_API_KEY: str = Field(default="", env="GROQ_API_KEY")
    CHROMA_PERSIST_DIR: str = Field(default="./chroma_store")
    STORAGE_PROVIDER: str = Field(default="sqlite", env="STORAGE_PROVIDER")
    EMAIL_SENDER: str = Field(default="noreply@flowzint.com")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
