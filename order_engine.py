import time
from app.services.dhan_service import dhan
from app.services.tax_calculator import TaxCalculator

tax_calc = TaxCalculator()

# અહીંયા ક્લાસનું નામ 'TradingEngine' હોવું જરૂરી છે
class TradingEngine:
    def __init__(self):
        # બાય ડિફોલ્ટ સિસ્ટમ હંમેશા PAPER મોડમાં જ રહેશે (સલામતી માટે)
        self.trading_mode = "PAPER"

        # પેપર ટ્રેડિંગ માટેનું વર્ચ્યુઅલ ફંડ
        self.paper_balance = 100000.0
        self.paper_positions = []
        self.paper_pnl = {"realized": 0.0, "unrealized": 0.0}

    def set_mode(self, mode: str):
        """ફ્રન્ટએન્ડ થી મોડ બદલવા માટેનું ફંક્શન"""
        if mode in ["PAPER", "REAL"]:
            self.trading_mode = mode
            return {"status": "success", "current_mode": self.trading_mode}
        return {"status": "error", "message": "Invalid Mode"}

    def execute_trade(self, symbol, order_type, qty, current_ltp):
        """સ્ટ્રેટેજી અથવા ડેશબોર્ડ આ ફંક્શનને કોલ કરશે ટ્રેડ લેવા માટે"""

        if self.trading_mode == "REAL":
            # 🚀 અસલી પૈસાથી ટ્રેડ - ધન API માં ઓર્ડર જશે
            return self._place_real_order(symbol, order_type, qty, current_ltp)
        else:
            # 🧪 પેપર ટ્રેડ - માત્ર ડેટાબેઝમાં નોંધ થશે
            return self._place_paper_order(symbol, order_type, qty, current_ltp)

    def _place_real_order(self, symbol, order_type, qty, current_ltp):
        try:
            # Dhan API Order Placement
            response = dhan.place_order(
                security_id="12345", # ભવિષ્યમાં આપણે અહી સાચો ઓપ્શન ID મેપ કરીશું
                exchange_segment=dhan.NSE_FNO,
                transaction_type=dhan.BUY if order_type == 'BUY' else dhan.SELL,
                quantity=qty,
                order_type=dhan.MARKET,
                product_type=dhan.MARGIN,
                price=0
            )
            return {"status": "SUCCESS", "mode": "REAL", "message": f"Real Order Placed: {symbol}"}
        except Exception as e:
            return {"status": "FAILED", "mode": "REAL", "error": str(e)}

    def _place_paper_order(self, symbol, order_type, qty, current_ltp):
        # 0.5 થી 1 રૂપિયાનું Slippage (ભાવમાં થતો ફેરફાર) ગણતરીમાં લઈએ જેથી 100% રિયલ ફીલ આવે
        slippage = 0.5
        executed_price = current_ltp + slippage if order_type == 'BUY' else current_ltp - slippage

        order_record = {
            "order_id": f"PAPER_{int(time.time())}",
            "symbol": symbol,
            "type": order_type,
            "qty": qty,
            "entry_price": round(executed_price, 2),
            "status": "OPEN",
            "timestamp": time.strftime("%H:%M:%S")
        }

        self.paper_positions.append(order_record)
        return {"status": "SUCCESS", "mode": "PAPER", "message": f"Virtual Order Executed at {executed_price}"}
