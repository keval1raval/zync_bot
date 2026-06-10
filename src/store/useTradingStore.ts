import { create } from 'zustand';

interface TradingState {
  marketData: any;       // લાઈવ માર્કેટ ડેટા માટે
  optionChain: any[];    // ઓપ્શન ચેઇનના ડેટા માટે
  globalMetrics: any;
  positions: any[];
  autoTrading: boolean;
  tradingMode: 'PAPER' | 'REAL';
  updateLiveStream: (payload: any) => void;
  toggleAutoTrading: () => void;
  setTradingMode: (mode: 'PAPER' | 'REAL') => void;
  executeTrade: (symbol: string, type: 'BUY' | 'SELL', qty: number, price: number) => Promise<void>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  // શરૂઆતમાં બધું ખાલી (0), કોઈ ફેક ડેટા નહિ
  marketData: {},
  optionChain: [],
  globalMetrics: { gross_pnl: 0, realized_pnl: 0, unrealized_pnl: 0 },
  positions: [],
  autoTrading: false,
  tradingMode: "PAPER", // Default Paper Mode

  updateLiveStream: (payload) => set((state) => {
    // 1. ધનના અસલી ફંડ્સ અને P&L નું મેપિંગ
    const funds = payload.real_funds || {};
    const realized = funds.realizedProfit || 0;
    const unrealized = funds.unrealizedProfit || 0;
    const totalPnl = realized + unrealized;

    // 2. ધનની અસલી પોઝિશનને UI માટે ફોર્મેટ કરવી
    const rawPositions = payload.real_positions || [];
    const formattedPositions = rawPositions.map((p: any, index: number) => {
      // ધનના રિસ્પોન્સ મુજબ ગણતરી (ખરેખર જે ઓર્ડર લીધા હશે તે જ દેખાશે)
      const qty = p.buyQty - p.sellQty;
      const isBuy = p.positionType === 'LONG' || qty > 0;

      return {
        id: index.toString(),
        symbol: p.tradingSymbol,
        type: isBuy ? 'BUY' : 'SELL',
        qty: Math.abs(qty),
        avgPrice: p.costPrice,
        ltp: p.lastTradedPrice || p.costPrice,
        pnl: p.realizedProfit + p.unrealizedProfit,
        pnlPercent: qty !== 0 && p.costPrice > 0
          ? ((p.realizedProfit + p.unrealizedProfit) / (p.costPrice * Math.abs(qty))) * 100
          : 0
      };
    });

    return {
      // જો નવો ડેટા ન આવે તો જૂનો ડેટા સચવાઈ રહે તે માટે state.XX રાખેલ છે
      marketData: payload.spot_prices || state.marketData,
      optionChain: payload.option_chain || state.optionChain,
      globalMetrics: {
        gross_pnl: totalPnl,
        realized_pnl: realized,
        unrealized_pnl: unrealized
      },
      positions: formattedPositions
    };
  }),

  setTradingMode: async (mode: "PAPER" | "REAL") => {
    try {
      // બેકએન્ડને મોડ ચેન્જ કરવાની રિક્વેસ્ટ મોકલો
      await fetch("http://localhost:8000/api/set-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
      });
      set({ tradingMode: mode });
    } catch (error) {
      console.error("Failed to change mode:", error);
    }
  },

  executeTrade: async (symbol, type, qty, price) => {
    try {
      // બેકએન્ડમાં ટ્રેડ મારવા માટે રિક્વેસ્ટ મોકલો
      const res = await fetch('http://localhost:8000/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, order_type: type, qty, price })
      });

      const data = await res.json();

      if (data.status === "SUCCESS") {
         alert(`✅ ${data.mode} Order Executed: ${type} ${symbol} @ ₹${price}`);
      } else {
         alert(`❌ Order Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Trade execution failed:", error);
      alert("❌ API Connection Error: Backend is not running.");
    }
  },

  toggleAutoTrading: () => set((state) => ({ autoTrading: !state.autoTrading }))
}));
