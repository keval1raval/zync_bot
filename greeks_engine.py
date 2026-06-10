import math
from scipy.stats import norm
from datetime import datetime

class OptionGreeksEngine:
    def __init__(self):
        self.r = 0.07  # Risk-free interest rate (7% India Standard)

    def calculate_greeks(self, spot, strike, days_to_expiry, iv, option_type="CE"):
        if days_to_expiry <= 0:
            days_to_expiry = 0.00001 # Avoid division by zero

        T = days_to_expiry / 365.0
        sigma = iv / 100.0

        if sigma <= 0:
            sigma = 0.01

        d1 = (math.log(spot / strike) + (self.r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))
        d2 = d1 - sigma * math.sqrt(T)

        # Greeks Formulas
        if option_type == "CE":
            delta = norm.cdf(d1)
            theta = (- (spot * norm.pdf(d1) * sigma) / (2 * math.sqrt(T)) - self.r * strike * math.exp(-self.r * T) * norm.cdf(d2)) / 365.0
        else:
            delta = norm.cdf(d1) - 1
            theta = (- (spot * norm.pdf(d1) * sigma) / (2 * math.sqrt(T)) + self.r * strike * math.exp(-self.r * T) * norm.cdf(-d2)) / 365.0

        gamma = norm.pdf(d1) / (spot * sigma * math.sqrt(T))
        vega = (spot * math.sqrt(T) * norm.pdf(d1)) / 100.0

        return {
            "delta": round(delta, 3),
            "gamma": round(gamma, 4),
            "theta": round(theta, 2),
            "vega": round(vega, 2)
        }

    def determine_moneyness(self, spot, strike, option_type="CE"):
        """ITM, ATM, OTM નક્કી કરવા માટેનું લોજિક"""
        diff = abs(spot - strike)
        if diff <= 25: # Nifty 50 strike interval boundary
            return "ATM"

        if option_type == "CE":
            return "ITM" if spot > strike else "OTM"
        else:
            return "ITM" if spot < strike else "OTM"
