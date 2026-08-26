from fastapi_mail import FastMail, MessageSchema, MessageType
from core.mail import mail_config

class MailService:
    def __init__(self):
        self.fastmail = FastMail(mail_config)

    async def send_confirmation_email(
        self, email_to: str, username: str, confirm_token: str
    ):
        confirm_url = f"http://localhost:8000/auth/confirm-email?token={confirm_token}"

        template_body = {
            "username": username,
            "confirm_url": confirm_url,
        }

        message = MessageSchema(
            subject="Confirm Your Email Address",
            recipients=[email_to],
            template_body=template_body,
            subtype=MessageType.html,
        )

        await self.fastmail.send_message(
            message, template_name="confirm_email.html"
        )

    async def send_reset_password_email(
        self, email_to: str, username: str, reset_token: str
    ):
        reset_url = f"http://localhost:8000/auth/reset-password?token={reset_token}"

        template_body = {
            "username": username,
            "reset_url": reset_url,
        }

        message = MessageSchema(
            subject="Password Reset Request",
            recipients=[email_to],
            template_body=template_body,
            subtype=MessageType.html,
        )

        await self.fastmail.send_message(
            message, template_name="reset_password.html"
        )