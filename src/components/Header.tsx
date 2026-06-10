"use client";
import React from "react";
import { useTradingStore } from "@/store/useTradingStore";

export default function Header() {
  const { tickers, autoTrading, toggleAutoTrading } = useTradingStore();

  return (
    <header className="h-16 border-b border-[#1e293b] bg-[#0b0f17] flex items-center justify-between px-6 shrink-0">
      <div className="flex gap-8">
        {Object.values(tickers).map((t) => (
          <div key={t.symbol} className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400">{t.symbol}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{t.ltp.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              <span className={`text-[11px] font-medium ${t.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {t.change > 0 ? '+' : ''}{t.change} ({t.percent}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border border-[#1e293b] rounded-lg px-3 py-1.5 bg-[#161b22]">
            <span className="text-xs font-medium text-slate-300">Auto Trading</span>
            <button
              onClick={toggleAutoTrading}
              className={`text-[10px] px-3 py-1 rounded font-bold transition-colors ${autoTrading ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
              {autoTrading ? 'ON' : 'OFF'}
            </button>
          </div>
      </div>
    </header>
  );
}
