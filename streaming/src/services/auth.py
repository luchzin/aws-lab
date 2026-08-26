from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from .mail import MailService
from models.user import User
from core.security import (
    create_access_token,
    create_email_confirmation_token,
    hash_password,
    verify_email_confirmation_token,
    verify_password,
)

from pydantic import BaseModel, EmailStr
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from core.security import (
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
    hash_password,
    verify_password,
)

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RequestResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class MessageResponse(BaseModel):
    message: str
class RequestConfirmEmailRequest(BaseModel):
    email: EmailStr

class ConfirmEmailRequest(BaseModel):
    token: str
class AuthService:

    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def register(self, email: str, password: str) -> User:
        result = await self.db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user = User(
            email=email,
            password_hash=hash_password(password),
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def login(self, email: str, password: str) -> dict:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        token = create_access_token(user.id)
        return {"access_token": token, "token_type": "bearer"}

    async def request_confirm_email(self, email: str) -> str:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            return "If the account exists, a confirmation link has been sent."
        if user.is_verified:  
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already verified",
            )

        token = create_email_confirmation_token(user.email)
        await MailService.send_confirmation_email(user.email, token)
        return "If the account exists, a confirmation link has been sent."

    async def confirm_email(self, token: str) -> dict:
        email = verify_email_confirmation_token(token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired confirmation token",
            )

        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        if user.is_verified:
            return {"message": "Email is already verified"}

        user.is_verified = True
        await self.db.commit()
        return {"message": "Email successfully verified"}
    async def request_reset_password(self, email: str) -> str:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            return "If the account exists, a reset link has been generated."

        reset_token = create_password_reset_token(user.email)
        await MailService.send_confirmation_email(user.email, reset_token)
        return reset_token

    async def reset_password(self, token: str, new_password: str) -> dict:
        email = verify_password_reset_token(token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.password_hash = hash_password(new_password)
        await self.db.commit()
        return {"message": "Password successfully reset"}
