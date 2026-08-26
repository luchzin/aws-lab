from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Awesome API"
    admin_email: str
    items_per_user: int = 50

    # Security / JWT settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    confirm_email_token_expire_minutes: int = 60 * 24
    reset_password_token_expire_minutes: int = 15

    # FastAPI-Mail settings
    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = "noreply@yourdomain.com"
    mail_port: int = 1025
    mail_server: str = "localhost"
    mail_from_name: str = "Your App Name"
    mail_starttls: bool = False
    mail_ssl_tls: bool = False
    use_credentials: bool = False

    # Database settings
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/streaming"
    db_echo: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()