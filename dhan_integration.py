import requests
from app.core.config import settings

class DhanTradeManager:
    def __init__(self):
        self.base_url = "https://api.dhan.co/v2"
        self.headers = {
            "access-token": settings.DHAN_ACCESS_TOKEN,
            "client-id": settings.DHAN_CLIENT_ID,
            "Content-Type": "application/json"
        }

    def place_order(self, symbol, quantity, order_type, price=0):
        payload = {
            "dhanClientId": settings.DHAN_CLIENT_ID,
            "correlationId": "zync-bot-order-1",
            "transactionType": "BUY" if order_type == "BUY" else "SELL",
            "exchangeSegment": "NSE_FNO",
            "productType": "MARGIN",
            "orderType": "MARKET" if price == 0 else "LIMIT",
            "validity": "DAY",
            "tradingSymbol": symbol,
            "quantity": quantity,
            "price": price
        }

        response = requests.post(f"{self.base_url}/orders", json=payload, headers=self.headers)
        return response.json()
