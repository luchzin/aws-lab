from datetime import datetime, timedelta, timezone
import jwt
from pwdlib import PasswordHash
from config.config import settings

password_hash = PasswordHash.recommended()


def create_email_confirmation_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.confirm_email_token_expire_minutes
    )
    payload = {
        "sub": email,
        "type": "confirm_email",
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def verify_email_confirmation_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        if payload.get("type") != "confirm_email":
            return None
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def create_password_reset_token(email: str) -> str:
    """Generates a temporary JWT token specifically for password reset."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.reset_password_token_expire_minutes
    )
    payload = {
        "sub": email,
        "type": "reset_password",
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def verify_password_reset_token(token: str) -> str | None:
    """Verifies the reset token and returns the target user email, or None if invalid."""
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        if payload.get("type") != "reset_password":
            return None
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.secret_key,
        algorithms=[settings.algorithm],
    )