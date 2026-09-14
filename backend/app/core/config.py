import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "Flowzint AI Interview Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = Field(default="dev-secret-key", validation_alias="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = Field(default="sqlite:///./app.db", validation_alias="DATABASE_URL")
    BACKEND_CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "https://*.vercel.app"], validation_alias="BACKEND_CORS_ORIGINS")
    OPENAI_API_KEY: str = Field(default="", validation_alias="OPENAI_API_KEY")
    GEMINI_API_KEY: str = Field(default="", validation_alias="GEMINI_API_KEY")
    GROQ_API_KEY: str = Field(default="", validation_alias="GROQ_API_KEY")
    CHROMA_PERSIST_DIR: str = Field(default="./chroma_store")
    STORAGE_PROVIDER: str = Field(default="sqlite", validation_alias="STORAGE_PROVIDER")
    EMAIL_SENDER: str = Field(default="noreply@flowzint.com")


settings = Settings()
