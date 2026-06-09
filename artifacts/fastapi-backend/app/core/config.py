from pydantic_settings import BaseSettings
from typing import Optional
import os

# Resolve DB path relative to this file so it works on any machine
# (Replit dev, Replit production, VSCode, local clone, etc.)
# config.py lives at: <root>/artifacts/fastapi-backend/app/core/config.py
# Going up 4 dirs puts us at the project root.
_HERE = os.path.dirname(os.path.abspath(__file__))
_DEFAULT_DB_PATH = os.path.normpath(os.path.join(_HERE, "..", "..", "..", "..", ".emp_pro.db"))


class Settings(BaseSettings):
    DB_PATH: str = _DEFAULT_DB_PATH

    SECRET_KEY: str = "emp-pro-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    @property
    def database_url(self) -> str:
        return f"sqlite:///{self.DB_PATH}"

    class Config:
        env_file = ".env"


settings = Settings()
