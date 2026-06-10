"use client";
import React from "react";
import { useTradingStore } from "@/store/useTradingStore";

export default function PositionsTable() {
  const { positions } = useTradingStore();

  return (
    <div className="bg-[#161b22] border border-[#1e293b] rounded-xl p-0 shrink-0">
      <div className="p-4 border-b border-[#1e293b] flex gap-4">
        <h3 className="text-sm font-bold text-blue-400 border-b-2 border-blue-400 pb-4 -mb-[17px]">Open Positions ({positions.length})</h3>
        <h3 className="text-sm font-medium text-slate-400 cursor-pointer">Closed Positions</h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr className="text-slate-400 border-b border-[#1e293b]">
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium text-center">Type</th>
              <th className="pb-3 font-medium text-right">Qty</th>
              <th className="pb-3 font-medium text-right">Avg Price</th>
              <th className="pb-3 font-medium text-right">LTP</th>
              <th className="pb-3 font-medium text-right">P&L</th>
              <th className="pb-3 font-medium text-right">P&L %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id} className="border-b border-[#1e293b]/50 hover:bg-[#1e293b]/30">
                <td className="py-4 text-white">{pos.symbol}</td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pos.type==='BUY'?'text-[#34d399] bg-[#064e3b]':'text-[#f87171] bg-[#7f1d1d]'}`}>{pos.type}</span>
                </td>
                <td className="py-4 text-right font-mono text-slate-300">{pos.qty}</td>
                <td className="py-4 text-right font-mono text-slate-300">{pos.avgPrice.toFixed(2)}</td>
                <td className="py-4 text-right font-mono text-slate-300">{pos.ltp.toFixed(2)}</td>
                <td className={`py-4 text-right font-mono font-bold ${pos.pnl >= 0 ? 'text-green-500':'text-red-500'}`}>
                  {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                </td>
                <td className={`py-4 text-right font-mono font-medium ${pos.pnlPercent >= 0 ? 'text-green-500':'text-red-500'}`}>
                  {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
