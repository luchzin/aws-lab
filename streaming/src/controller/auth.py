from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_db
from services.auth import (
    AuthService,
    ConfirmEmailRequest,
      
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    RequestConfirmEmailRequest,
    RequestResetPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

@router.post("/register", status_code=201)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.register(request.email, request.password)

@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.login(request.email, request.password)

@router.post("/request-confirm-email", response_model=MessageResponse)
async def request_confirm_email(
    request: RequestConfirmEmailRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    await service.request_confirm_email(request.email)
    return {"message": "Confirmation email sent"}

@router.post("/confirm-email", response_model=MessageResponse)
async def confirm_email(
    request: ConfirmEmailRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.confirm_email(request.token)

@router.post("/request-reset-password", response_model=MessageResponse)
async def request_reset_password(
    request: RequestResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    await service.request_reset_password(request.email)
    return {"message": "Password reset instructions sent"}

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AuthService(db)
    return await service.reset_password(request.token, request.new_password)