from pathlib import Path
from fastapi_mail import ConnectionConfig

# Path to directory containing your HTML templates
TEMPLATE_FOLDER = Path(__file__).parent.parent / "templates" / "email"

mail_config = ConnectionConfig(
    MAIL_USERNAME="",  # Not required for local SMTP
    MAIL_PASSWORD="",  # Not required for local SMTP
    MAIL_FROM="noreply@yourdomain.com",
    MAIL_PORT=1025,  # Default port for Mailpit / MailHog
    MAIL_SERVER="localhost",
    MAIL_FROM_NAME="Your App Name",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=False,
    TEMPLATE_FOLDER=TEMPLATE_FOLDER,
)