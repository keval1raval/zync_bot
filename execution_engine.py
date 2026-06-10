import time
from app.services.dhan_service import dhan

class ExecutionEngine:
    def __init__(self):
        # Default mode is PAPER to protect capital
        self.trading_mode = "PAPER"
        self.virtual_trades = []
        self.paper_balance = 100000.0  # 1 Lakh Virtual Capital

    def set_mode(self, mode: str):
        """Frontend થી મોડ બદલવા માટે"""
        if mode in ["PAPER", "REAL"]:
            self.trading_mode = mode
            return {"status": "success", "current_mode": self.trading_mode}
        return {"status": "error", "message": "Invalid Mode"}

    def execute_signal(self, symbol: str, security_id: str, side: str, qty: int, ltp: float):
        """સ્ટ્રેટેજી માંથી સિગ્નલ આવે ત્યારે આ ફંક્શન કોલ થશે"""

        print(f"⚡ SIGNAL RECEIVED: {side} {symbol} @ {ltp} | MODE: {self.trading_mode}")

        if self.trading_mode == "REAL":
            return self._execute_real_dhan_order(symbol, security_id, side, qty)
        else:
            return self._execute_paper_order(symbol, side, qty, ltp)

    def _execute_real_dhan_order(self, symbol, security_id, side, qty):
        """અસલી પૈસાથી ધન માં ઓર્ડર નાખશે"""
        try:
            response = dhan.place_order(
                security_id=security_id,
                exchange_segment=dhan.NSE_FNO,
                transaction_type=dhan.BUY if side == 'BUY' else dhan.SELL,
                quantity=qty,
                order_type=dhan.MARKET,
                product_type=dhan.MARGIN,
                price=0
            )
            print(f"🟢 REAL ORDER PLACED: {response}")
            return {"status": "SUCCESS", "mode": "REAL", "data": response}
        except Exception as e:
            print(f"🔴 REAL ORDER FAILED: {e}")
            return {"status": "FAILED", "mode": "REAL", "error": str(e)}

    def _execute_paper_order(self, symbol, side, qty, ltp):
        """વર્ચ્યુઅલ ટ્રેડિંગ માટે ડેટાબેઝમાં ઓર્ડર સેવ કરશે"""
        # Slippage simulation (રિયલ માર્કેટ જેવો જ અનુભવ આપવા 0.50 પૈસાનો તફાવત)
        executed_price = ltp + 0.50 if side == 'BUY' else ltp - 0.50

        trade_record = {
            "order_id": f"PAPER_{int(time.time())}",
            "symbol": symbol,
            "side": side,
            "qty": qty,
            "entry_price": round(executed_price, 2),
            "status": "OPEN",
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
        }

        self.virtual_trades.append(trade_record)
        print(f"🔵 PAPER ORDER PLACED: {trade_record}")

        return {"status": "SUCCESS", "mode": "PAPER", "data": trade_record}

# સિસ્ટમ માટે ગ્લોબલ એન્જિન
engine = ExecutionEngine()
