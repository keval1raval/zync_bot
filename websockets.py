import asyncio
import json
import redis.asyncio as aioredis
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
router = APIRouter()
class ConnectionManager:
def __init__(self):
self.active_connections: list[WebSocket] = []
async def connect(self, websocket: WebSocket):
await websocket.accept()
self.active_connections.append(websocket)
def disconnect(self, websocket: WebSocket):
self.active_connections.remove(websocket)
async def send_personal_message(self, message: dict, websocket: WebSocket):
await websocket.send_json(message)
manager = ConnectionManager()
async def redis_market_feed_listener(redis_url: str):
"""
Subscribes to Dhan Live Tick channel in Redis and broadcasts directly to connected users.
"""
redis = aioredis.from_url(redis_url)
pubsub = redis.pubsub()
await pubsub.subscribe("dhan_live_ticks", "zync_signals")
try:
async for message in pubsub.listen():
if message['type'] == 'message':
data = json.loads(message['data'].decode('utf-8'))
# Broadcast across all live front-end connections
for connection in manager.active_connections:
try:
await connection.send_json(data)
except Exception:
manager.disconnect(connection)
finally:
await pubsub.unsubscribe("dhan_live_ticks", "zync_signals")
await redis.close()
@router.websocket("/live-feed")
async def websocket_endpoint(websocket: WebSocket):
await manager.connect(websocket)
try:
while True:
# Maintain connection alive, receive client-side requests (e.g., changing strategy
charts)
client_data = await websocket.receive_text()
parsed_request = json.loads(client_data)
# Process dynamic subscription adjustments if required
except WebSocketDisconnect:
manager.disconnect(websocket)
