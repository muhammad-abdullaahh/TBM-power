import httpx
from app.config import settings

async def send_whatsapp_message(to_number: str, message: str):
    """
    Asynchronous WhatsApp sender.
    This is a mock that logs to the console unless a URL is configured.
    """
    if not settings.WHATSAPP_API_URL or not settings.WHATSAPP_TOKEN:
        print(f"[MOCK WHATSAPP] To: {to_number} | Message: {message}")
        return
    
    # Example using a generic HTTP API (e.g. Meta Cloud API or UltraMsg)
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": message}
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(settings.WHATSAPP_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            print(f"WhatsApp sent successfully to {to_number}")
    except Exception as e:
        print(f"Failed to send WhatsApp to {to_number}: {e}")

async def send_order_whatsapp(order_id: int):
    message = f"🚨 *New Order Alert!*\nOrder ID: #{order_id}\nCheck the TBM Admin Panel for details."
    await send_whatsapp_message(settings.ADMIN_WHATSAPP, message)

async def send_lead_whatsapp(lead_id: int):
    message = f"☀️ *New Solar Lead!*\nLead ID: #{lead_id}\nCheck the TBM Admin Panel for details."
    await send_whatsapp_message(settings.ADMIN_WHATSAPP, message)
