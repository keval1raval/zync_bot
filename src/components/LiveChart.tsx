"use client";
import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts'; // CandlestickSeries ઉમેર્યું

export default function LiveChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: '#161b22' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      width: chartContainerRef.current.clientWidth,
      height: 340,
    });

    // v5 વર્ઝન માટે નવો કોડ
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981', wickDownColor: '#ef4444'
    });

    candleSeries.setData([
      { time: '2024-05-30', open: 22500, high: 22550, low: 22480, close: 22532.70 }
    ]);

    return () => chart.remove();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 px-1">
         <h3 className="text-sm font-bold text-white flex items-center gap-2">
            NIFTY 50 • 1m <span className="text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">LIVE</span>
         </h3>
         <div className="flex gap-3 text-xs text-slate-400 font-mono">
            <span>O: 22530.00</span> <span>H: 22545.65</span> <span>L: 22528.10</span> <span>C: 22532.70</span>
         </div>
      </div>
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
}
