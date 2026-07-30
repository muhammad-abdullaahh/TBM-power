import smtplib
from email.message import EmailMessage
from app.config import settings

def send_email_sync(subject: str, body: str, to_email: str):
    """
    Synchronous email sender intended to be run in a background thread or task.
    """
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        print(f"[MOCK EMAIL] To: {to_email} | Subject: {subject}\n{body}")
        return

    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

async def send_order_email(order_id: int):
    # In a real app, you might fetch order details here or pass them in.
    subject = f"New Order Received: #{order_id}"
    body = f"A new order (ID: {order_id}) has been placed on the TBM Power store.\nPlease check the admin panel for details."
    # Can use run_in_executor to avoid blocking the event loop
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, send_email_sync, subject, body, settings.ADMIN_EMAIL)

async def send_lead_email(lead_id: int):
    subject = f"New Solar Calculator Lead: #{lead_id}"
    body = f"A new solar calculator lead (ID: {lead_id}) has been submitted.\nPlease check the admin panel for details."
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, send_email_sync, subject, body, settings.ADMIN_EMAIL)
