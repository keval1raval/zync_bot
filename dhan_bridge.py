import aiohttp
import asyncio
import logging
from pydantic_settings import BaseSettings
class Settings(BaseSettings):
DHAN_CLIENT_ID: str
DHAN_ACCESS_TOKEN: str
class Config:
env_file = ".env"
settings = Settings()
logger = logging.getLogger("ZyncDhanBridge")
class DhanProductionBridge:
def __init__(self):
self.base_url = "https://api.dhan.co/v2"
self.headers = {
"access-token": settings.DHAN_ACCESS_TOKEN,
"client-id": settings.DHAN_CLIENT_ID,
"Content-Type": "application/json"
}
async def place_fno_market_order(self, symbol: str, quantity: int, transaction_type: str) ->
dict:
endpoint = f"{self.base_url}/orders"
payload = {
"dhanClientId": settings.DHAN_CLIENT_ID,
"correlationId": f"ZYNC_{int(asyncio.get_event_loop().time())}",
"transactionType": transaction_type.upper(),
"exchangeSegment": "NSE_FNO",
"productType": "MARGIN",
"orderType": "MARKET",
"validity": "DAY",
"tradingSymbol": symbol,
"quantity": quantity,
"price": 0.0
}
async with aiohttp.ClientSession() as session:
try:
async with session.post(endpoint, json=payload, headers=self.headers) as response:
response_data = await response.json()
if response.status in [200, 201]:
logger.info(f"Order Placed: {symbol} | ID: {response_data.get('orderId')}")
return {"status": "SUCCESS", "order_id": response_data.get("orderId"),
"data": response_data}
else:
logger.error(f"Dhan API Rejection: {response_data}")
return {"status": "REJECTED", "reason": response_data.get("remarks")}
except Exception as e:
logger.critical(f"Critical Bridge Outage: {str(e)}")
return {"status": "CRITICAL_ERROR", "reason": str(e)}
