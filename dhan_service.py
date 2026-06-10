import os
import time
import requests
import logging

# 1. Dhan ni a badhi faltu warnings bandh karo
logging.getLogger("root").setLevel(logging.ERROR)
logging.getLogger("dhanhq").setLevel(logging.ERROR)

from dotenv import load_dotenv
load_dotenv()

client_id = os.getenv("DHAN_CLIENT_ID", "")
access_token = os.getenv("DHAN_ACCESS_TOKEN", "")

# Headers je badha API call ma common che
headers = {
    "access-token": access_token,
    "client-id": client_id,
    "Content-Type": "application/json"
}

# Cache variable
api_cache = {"spot": 0.0, "time": 0.0, "funds": {}, "pos": []}

def get_real_nifty_spot():
    """Direct HTTP call to Dhan v2 API (No Library methods)"""
    if time.time() - api_cache["time"] < 1.0: return api_cache["spot"]
    try:
        url = "https://api.dhan.co/v2/marketfeed/ltp"
        payload = {"IDX_I": ["13"]}
        response = requests.post(url, headers=headers, json=payload, timeout=2)
        if response.status_code == 200:
            data = response.json()
            price = float(data['data']['IDX_I']['13']['last_price'])
            api_cache["spot"] = price
            api_cache["time"] = time.time()
            return price
    except: pass
    return api_cache["spot"]

def get_real_funds():
    """Direct API call for funds"""
    try:
        url = "https://api.dhan.co/fundlimit"
        response = requests.get(url, headers=headers, timeout=2)
        if response.status_code == 200:
            return response.json().get('data', {})
    except: pass
    return {}

def get_real_positions():
    """Direct API call for positions"""
    try:
        url = "https://api.dhan.co/positions"
        response = requests.get(url, headers=headers, timeout=2)
        if response.status_code == 200:
            return response.json().get('data', [])
    except: pass
    return []

def place_dhan_order(security_id, transaction_type, qty, price):
    """Direct API call to place order"""
    try:
        url = "https://api.dhan.co/orders"
        payload = {
            "dhanClientId": client_id,
            "correlationId": str(int(time.time())),
            "transactionType": transaction_type,
            "exchangeSegment": "NSE_FNO",
            "productType": "MARGIN",
            "orderType": "MARKET",
            "quantity": qty,
            "securityId": security_id
        }
        response = requests.post(url, headers=headers, json=payload, timeout=2)
        return response.json()
    except Exception as e:
        return {"status": "FAILED", "error": str(e)}
