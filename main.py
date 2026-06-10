import asyncio
import json
import os
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Aapna services import karo
from app.services.dhan_service import get_real_nifty_spot, get_real_funds, get_real_positions
from app.services.dhan_option_chain import DhanOptionChainManager

# Error logs control karva
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ZYNC ALGO ENGINE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Option Chain Manager setup
client_id = os.getenv("DHAN_CLIENT_ID", "")
access_token = os.getenv("DHAN_ACCESS_TOKEN", "")
chain_manager = DhanOptionChainManager(client_id, access_token)

@app.get("/")
def read_root():
    return {"status": "ZYNC Algo Bot is Running 🚀"}

# --- ROBUST WEBSOCKET ENDPOINT ---
@app.websocket("/ws/market-feed")
async def market_feed_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("🟢 Dashboard Connected to REAL Engine")

    try:
        while True:
            try:
                # 1. Data fetch karo
                real_nifty_spot = get_real_nifty_spot()
                real_funds = get_real_funds()
                real_positions = get_real_positions()

                # 2. Payload banavo
                if real_nifty_spot is None:
                    option_chain = []
                    ltp = 0.0
                else:
                    option_chain = chain_manager.generate_live_option_chain(real_nifty_spot)
                    ltp = round(float(real_nifty_spot), 2)

                payload = {
                    "type": "ULTRA_STREAM",
                    "spot_prices": {
                        "NIFTY 50": {"ltp": ltp}
                    },
                    "real_funds": real_funds,
                    "real_positions": real_positions,
                    "option_chain": option_chain
                }

                # 3. Data frontend ne moklo
                await websocket.send_text(json.dumps(payload))

                # 4. Thodi vaar wait karo (1 sec)
                await asyncio.sleep(1)

            except Exception as loop_err:
                # Loop ni andar koi error aave to connection bandh na thay
                logger.error(f"Error in data loop: {loop_err}")
                await asyncio.sleep(2) # 2 sec wait karine retry karse

    except WebSocketDisconnect:
        logger.info("🔴 Dashboard Disconnected")
    except Exception as e:
        logger.error(f"Critical WebSocket Error: {e}")
