from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "TBM Power Solar E-commerce"
    DEBUG: bool = False

    # Database
    # Using asyncpg driver, e.g., postgresql+asyncpg://postgres:password@localhost:5432/tbm_solar
    DATABASE_URL: str

    # Auth
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Email (SMTP)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    ADMIN_EMAIL: str = "admin@tbmpower.com.pk"

    # WhatsApp (Mock)
    WHATSAPP_API_URL: str = ""
    WHATSAPP_TOKEN: str = ""
    ADMIN_WHATSAPP: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
