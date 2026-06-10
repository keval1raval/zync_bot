"use client";
import React from "react";
import { useTradingStore } from "@/store/useTradingStore";
import { useMarketFeed } from "@/hooks/useMarketFeed";
import LiveChart from "@/components/LiveChart";

export default function AdvancedDashboard() {
  // ફિક્સ: અહીંયા tradingMode, setTradingMode, અને executeTrade ઉમેર્યા છે
  const {
    marketData,
    globalMetrics,
    optionChain,
    positions,
    autoTrading,
    toggleAutoTrading,
    tradingMode,
    setTradingMode,
    executeTrade
  } = useTradingStore();

  // Connect to the Real Asynchronous Core Streaming Engine
  useMarketFeed("ws://localhost:8000/ws/market-feed");

  const nifty = marketData?.["NIFTY 50"] || { ltp: 0.00, change: 0.00, percent: "0.00%" };

  return (
    <div className="flex h-screen w-full bg-[#0b0f17] text-slate-300 font-sans overflow-hidden">

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-60 bg-[#0d1117] border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold text-white tracking-widest mb-8 flex items-center gap-2">
            ZYNC <span className="text-xs bg-green-500 text-black font-bold px-1.5 py-0.5 rounded">BOT</span>
          </div>
          <nav className="space-y-1">
            <div className="bg-[#1e293b] text-white px-4 py-2.5 rounded-lg text-sm font-medium">Dashboard</div>
            <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Option Chain</div>
            <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Positions</div>
            <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Strategies</div>
          </nav>
        </div>
        <div className="border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 text-green-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> Dhan Live Connected
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">


        {/* TOP REAL-TIME TICKER HEADER */}
        <header className="h-16 border-b border-slate-800 bg-[#0d1117] flex items-center justify-between px-6 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider">NIFTY 50</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-mono">{nifty.ltp.toFixed(2)}</span>
              <span className="text-xs text-green-500 font-mono">{nifty.change} ({nifty.percent})</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Auto Algorithmic Execution</span>
              <button
                onClick={toggleAutoTrading}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${autoTrading ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'}`}
              >
                {autoTrading ? "AUTO ON" : "MANUAL"}
              </button>
            </div>

            {/* Trading Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#161b22] border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setTradingMode("PAPER")}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${tradingMode === 'PAPER' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                PAPER TRADING
              </button>
              <button
                onClick={() => {
                  if(window.confirm("WARNING: You are switching to REAL MONEY mode. Are you sure?")) {
                    setTradingMode("REAL");
                  }
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${tradingMode === 'REAL' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                REAL MONEY
              </button>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* CORE ACCOUNT METRICS WITH NET P&L TAX DEDUCTIONS */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#161b22] border border-slate-800/80 p-4 rounded-xl">
              <span className="text-xs font-medium text-slate-500">Gross Account P&L</span>
              <div className="text-2xl font-bold text-green-500 mt-1">₹{(globalMetrics?.gross_pnl || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            </div>
            <div className="bg-[#161b22] border border-slate-800/80 p-4 rounded-xl">
              <span className="text-xs font-medium text-slate-500">Brokerage & Taxes (Estimated)</span>
              <div className="text-2xl font-bold text-red-400 mt-1">₹{(globalMetrics?.total_taxes || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            </div>
            <div className="bg-[#161b22] border border-slate-800/80 p-4 rounded-xl border-l-2 border-l-green-500">
              <span className="text-xs font-medium text-slate-400 font-bold">Pure NET P&L (Take Home)</span>
              <div className="text-2xl font-bold text-green-400 mt-1">₹{(globalMetrics?.net_pnl || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
            </div>
            <div className="bg-[#161b22] border border-slate-800/80 p-4 rounded-xl">
              <span className="text-xs font-medium text-slate-500">System Accuracy</span>
              <div className="text-2xl font-bold text-white mt-1">{globalMetrics?.win_rate || 0}%</div>
            </div>
          </div>

          {/* DYNAMIC MIDDLE ROW: CHART & GREEKS OPTION CHAIN MATRIX */}
          <div className="grid grid-cols-12 gap-4">

            {/* Live Chart Canvas */}
            <div className="col-span-6 bg-[#161b22] border border-slate-800/60 rounded-xl p-4 h-[420px]">
              <LiveChart />
            </div>

            {/* Institutional Option Chain Component */}
            <div className="col-span-6 bg-[#161b22] border border-slate-800/60 rounded-xl p-4 h-[420px] flex flex-col overflow-hidden">
              <div className="flex justify-between border-b border-slate-800 pb-2 mb-2 items-center">
                <h3 className="text-xs font-bold text-white tracking-wide">OPTION CHAIN (NIFTY)</h3>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">Greek Model Active</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800 sticky top-0 bg-[#161b22]">
                      <th className="pb-1">Calls (LTP)</th>
                      <th className="pb-1 text-center">CE Delta</th>
                      <th className="pb-1 text-center bg-slate-800/30">Strike</th>
                      <th className="pb-1 text-center">PE Delta</th>
                      <th className="pb-1 text-right">Puts (LTP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(optionChain || []).map((row: any, i: number) => (
                      <tr key={i} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">

                        {/* CALL SIDE (Click to Buy CE) */}
                        <td
                          onClick={() => executeTrade(`NIFTY ${row.strike} CE`, 'BUY', 75, row.ce.ltp)}
                          className={`py-2 cursor-pointer hover:ring-1 hover:ring-green-500 rounded ${row.ce.moneyness === 'ITM' ? 'bg-green-950/20 text-green-400 font-bold' : 'text-slate-300'}`}
                          title="Click to Buy CE"
                        >
                          {row.ce.ltp.toFixed(2)} <span className="text-[9px] text-slate-500 ml-1">{row.ce.moneyness}</span>
                        </td>

                        <td className="text-center py-2 text-blue-400">{row.ce.greeks.delta}</td>
                        <td className="text-center py-2 bg-slate-800/40 text-white font-bold">{row.strike}</td>
                        <td className="text-center py-2 text-blue-400">{row.pe.greeks.delta}</td>

                        {/* PUT SIDE (Click to Buy PE) */}
                        <td
                          onClick={() => executeTrade(`NIFTY ${row.strike} PE`, 'BUY', 75, row.pe.ltp)}
                          className={`py-2 text-right cursor-pointer hover:ring-1 hover:ring-red-500 rounded ${row.pe.moneyness === 'ITM' ? 'bg-green-950/20 text-green-400 font-bold' : 'text-slate-300'}`}
                          title="Click to Buy PE"
                        >
                          <span className="text-[9px] text-slate-500 mr-1">{row.pe.moneyness}</span> {row.pe.ltp.toFixed(2)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
