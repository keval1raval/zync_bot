"use client";
import React from "react";
import { useTradingStore } from "@/store/useTradingStore";

export default function StatsGrid() {
  const { totalPnl, realizedPnl, unrealizedPnl, winRate } = useTradingStore();

  return (
    <div className="grid grid-cols-5 gap-4 shrink-0">
      <div className="col-span-2 bg-[#161b22] border border-[#1e293b] p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
        <span className="text-sm text-slate-400">Total P&L</span>
        <div className="mt-2">
          <span className="text-3xl font-bold text-green-500">+{totalPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          <span className="block text-xs text-green-500 mt-1">+1.87% Today</span>
        </div>
      </div>
      <div className="bg-[#161b22] border border-[#1e293b] p-5 rounded-xl flex flex-col justify-between">
        <span className="text-sm text-slate-400">Realized P&L</span>
        <div className="mt-2">
          <span className="text-xl font-bold text-green-500">+{realizedPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          <span className="block text-[11px] text-slate-400 mt-1">Today</span>
        </div>
      </div>
      <div className="bg-[#161b22] border border-[#1e293b] p-5 rounded-xl flex flex-col justify-between">
        <span className="text-sm text-slate-400">Unrealized P&L</span>
        <div className="mt-2">
          <span className="text-xl font-bold text-green-500">+{unrealizedPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          <span className="block text-[11px] text-slate-400 mt-1">Live</span>
        </div>
      </div>
      <div className="bg-[#161b22] border border-[#1e293b] p-5 rounded-xl flex flex-col justify-between">
        <span className="text-sm text-slate-400">Win Rate</span>
        <div className="mt-2">
          <span className="text-xl font-bold text-white">{winRate}%</span>
          <span className="block text-[11px] text-slate-400 mt-1">This Month</span>
        </div>
      </div>
    </div>
  );
}
