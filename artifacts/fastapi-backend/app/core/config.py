from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    DB_PATH: str = "/home/runner/workspace/.emp_pro.db"

    SECRET_KEY: str = "emp-pro-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    @property
    def database_url(self) -> str:
        return f"sqlite:///{self.DB_PATH}"

    class Config:
        env_file = ".env"


settings = Settings()
