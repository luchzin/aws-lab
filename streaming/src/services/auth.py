from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from core.security import (
    create_access_token,
    hash_password,
    verify_password,
)


class AuthService:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def confirm_password():
        return 
    async def reset_password():
            return 
    async def request_reset_password():
                return 
    async def register(
        self,
        email: str,
        password: str,
    ):
        result = await self.db.execute(
            select(User).where(User.email == email)
        )

        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            email=email,
            password_hash=hash_password(password),
        )

        self.db.add(user)

        await self.db.commit()
        await self.db.refresh(user)

        return user

    async def login(
        self,
        email: str,
        password: str,
    ):
        result = await self.db.execute(
            select(User).where(User.email == email)
        )

        user = result.scalar_one_or_none()

        if not user:
            raise ValueError("Invalid credentials")

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise ValueError("Invalid credentials")

        token = create_access_token(user.id)

        return {
            "access_token": token,
            "token_type": "bearer",
        }

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"