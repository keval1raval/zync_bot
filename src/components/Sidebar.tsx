"use client";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-[240px] bg-[#0b0f17] border-r border-[#1e293b] flex flex-col justify-between z-10 shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-xl font-bold text-white tracking-widest">ZYNC</span>
          <span className="text-[10px] bg-green-500 text-black px-1.5 py-0.5 rounded font-bold">BOT</span>
        </div>
        <nav className="space-y-1">
          <div className="bg-[#1e293b] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3">Dashboard</div>
          <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Market Watch</div>
          <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Option Chain</div>
          <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Strategies</div>
          <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Positions</div>
          <div className="hover:bg-slate-800/40 text-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition">Logs</div>
        </nav>
      </div>
      <div className="p-4 border-t border-[#1e293b]">
        <div className="bg-[#161b22] border border-[#1e293b] rounded-lg p-3">
            <div className="text-[11px] text-slate-400 mb-1">API Connection</div>
            <div className="text-xs text-white flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Dhan • <span className="text-green-500">Connected</span>
            </div>
        </div>
      </div>
    </aside>
  );
}
