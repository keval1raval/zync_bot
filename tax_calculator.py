class TaxCalculator:
    def __init__(self):
        # Current Indian Brokerage & Tax Rates (F&O)
        self.brokerage_per_order = 20.0
        self.stt_rate = 0.000125  # Options Premium Par (Sell side only)
        self.exchange_txn_charge = 0.0005 # NSE Options (0.05%)
        self.gst_rate = 0.18 # 18% on (Brokerage + Txn Charges)
        self.sebi_charges = 0.000001 # 10 per crore
        self.stamp_duty = 0.00003 # 0.003% (Buy side only)

    def calculate_fo_taxes(self, buy_price, sell_price, qty):
        # Turnover Calculation
        buy_turnover = buy_price * qty
        sell_turnover = sell_price * qty
        total_turnover = buy_turnover + sell_turnover

        # 1. Brokerage
        brokerage = 40.0 # Rs. 20 Buy + Rs. 20 Sell

        # 2. STT (Securities Transaction Tax) - Only on Sell Side for Options
        stt = round(sell_turnover * self.stt_rate)

        # 3. Exchange Transaction Charges
        txn_charges = round(total_turnover * self.exchange_txn_charge, 2)

        # 4. GST
        gst = round((brokerage + txn_charges) * self.gst_rate, 2)

        # 5. SEBI Charges
        sebi = round(total_turnover * self.sebi_charges, 2)

        # 6. Stamp Duty (Only on Buy side)
        stamp_duty = round(buy_turnover * self.stamp_duty, 2)

        total_taxes = brokerage + stt + txn_charges + gst + sebi + stamp_duty
        gross_pnl = (sell_price - buy_price) * qty
        net_pnl = gross_pnl - total_taxes

        return {
            "gross_pnl": round(gross_pnl, 2),
            "total_taxes": round(total_taxes, 2),
            "net_pnl": round(net_pnl, 2),
            "breakdown": {
                "brokerage": brokerage,
                "stt": stt,
                "txn_charges": txn_charges,
                "gst": gst,
                "sebi": sebi,
                "stamp_duty": stamp_duty
            }
        }
