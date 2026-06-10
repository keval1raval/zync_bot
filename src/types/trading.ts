export interface MarketTicker {
  symbol: string;
  ltp: number;
  change: number;
  percent: number;
  isUp: boolean;
}

export interface Position {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPercent: number;
}

export interface TradeSignal {
  time: string;
  symbol: string;
  type: "BUY" | "SELL";
  message: string;
}
