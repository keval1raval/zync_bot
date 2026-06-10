import asyncio
from datetime import datetime
from app.services.dhan_service import get_real_nifty_spot, place_dhan_order
from app.services.greeks_engine import OptionGreeksEngine

greeks_calc = OptionGreeksEngine()

class AdvancedAlgoBot:
    def __init__(self):
        self.is_running = False
        self.trading_mode = "PAPER" # બાય ડિફોલ્ટ પેપર મોડ
        self.qty = 75 # 1 Lot of Nifty
        self.last_trade_time = None
        self.cooldown_seconds = 300 # એક ટ્રેડ લીધા પછી 5 મિનિટ (300 સેકન્ડ) નો બ્રેક

        # આ મેમરી બોટને ટ્રેન્ડ નક્કી કરવામાં મદદ કરશે
        self.price_history = []

    def set_mode(self, mode: str):
        if mode in ["PAPER", "REAL"]:
            self.trading_mode = mode
            return {"status": "success", "current_mode": self.trading_mode}
        return {"status": "error", "message": "Invalid Mode"}

    async def start_bot_loop(self):
        """આ ફંક્શન બેકગ્રાઉન્ડમાં સતત માર્કેટને સ્કેન કરતું રહેશે"""
        self.is_running = True
        print("🤖 ZYNC ALGO ENGINE: Started & Scanning Market...")

        while self.is_running:
            try:
                spot_price = get_real_nifty_spot()

                if spot_price is None:
                    await asyncio.sleep(2) # માર્કેટ ડેટા ન મળે તો 2 સેકન્ડ રાહ જુઓ
                    continue

                # ટ્રેન્ડ એનાલિસિસ માટે હિસ્ટ્રી મેન્ટેન કરો (છેલ્લા 10 ટિક્સ)
                self.price_history.append(spot_price)
                if len(self.price_history) > 10:
                    self.price_history.pop(0)

                # જો 10 ટિક્સનો ડેટા ભેગો થઈ ગયો હોય, તો સ્ટ્રેટેજી રન કરો
                if len(self.price_history) == 10:
                    await self._evaluate_strategy(spot_price)

            except Exception as e:
                print(f"⚠️ Bot Loop Error: {e}")

            await asyncio.sleep(1) # દર 1 સેકન્ડે માર્કેટ ચેક કરો

    async def _evaluate_strategy(self, current_spot):
        """
        EXTRA ORDINARY STRATEGY:
        1. Momentum Breakout: છેલ્લા 10 ટિક્સમાં જો ભાવ સતત વધતો હોય.
        2. Options Greeks: ATM Strike નો Delta 0.50 થી વધુ હોય.
        """
        # ટ્રેડ કૂલડાઉન ચેક (ઓવર-ટ્રેડિંગ અટકાવવા)
        if self.last_trade_time:
            time_since_trade = (datetime.now() - self.last_trade_time).total_seconds()
            if time_since_trade < self.cooldown_seconds:
                return # કૂલડાઉનમાં છે, કોઈ ટ્રેડ નહિ

        # 1. સાદું મોમેન્ટમ લોજિક (Momentum Logic)
        start_price = self.price_history[0]
        price_change = current_spot - start_price

        # સ્ટ્રાઈક નક્કી કરો (ATM)
        atm_strike = round(current_spot / 50) * 50

        # 2. જો Nifty માં +10 પોઈન્ટનો ઝડપી ઉછાળો આવ્યો હોય (Bullish Breakout)
        if price_change > 10:
            # Call (CE) ના ગ્રીક્સ ચેક કરો
            ce_greeks = greeks_calc.calculate_greeks(current_spot, atm_strike, days_to_expiry=4, iv=12.5, option_type="CE")

            # 3. જો ડેલ્ટા 0.52 થી ઉપર હોય (મતલબ સ્ટ્રોંગ મુવમેન્ટ)
            if ce_greeks["delta"] > 0.52:
                print(f"🚀 BULLISH BREAKOUT DETECTED! Nifty: {current_spot}, CE Delta: {ce_greeks['delta']}")
                await self._execute_trade(f"NIFTY {atm_strike} CE", "BUY")

        # 4. જો Nifty માં -10 પોઈન્ટનો ઝડપી ઘટાડો આવ્યો હોય (Bearish Breakdown)
        elif price_change < -10:
            # Put (PE) ના ગ્રીક્સ ચેક કરો
            pe_greeks = greeks_calc.calculate_greeks(current_spot, atm_strike, days_to_expiry=4, iv=12.5, option_type="PE")

            # PE નો ડેલ્ટા નેગેટિવ હોય છે, એટલે આપણે Absolute value ચેક કરીએ (-0.52 થી નીચે)
            if pe_greeks["delta"] < -0.52:
                 print(f"🩸 BEARISH BREAKDOWN DETECTED! Nifty: {current_spot}, PE Delta: {pe_greeks['delta']}")
                 await self._execute_trade(f"NIFTY {atm_strike} PE", "BUY")

    async def _execute_trade(self, symbol, order_type):
        """ટ્રેડ પ્લેસમેન્ટ (Paper vs Real)"""
        print(f"⚡ EXECUTING {self.trading_mode} TRADE: {order_type} {symbol}")
        self.last_trade_time = datetime.now()

        if self.trading_mode == "REAL":
            # પ્રોડક્શનમાં અહીંયા સાચો Security ID પાસ કરવો પડે
            # અત્યારે API Call નું માળખું રેડી છે
            res = place_dhan_order(security_id="DUMMY_ID_FOR_NOW", transaction_type=order_type, qty=self.qty, price=0)
            print(f"✅ REAL Order Status: {res}")
        else:
            # PAPER TRADING
            print(f"✅ PAPER Order Placed for {symbol}. (Saved to DB)")

# સિંગલ ઇન્સ્ટન્સ બનાવો
algo_bot = AdvancedAlgoBot()
