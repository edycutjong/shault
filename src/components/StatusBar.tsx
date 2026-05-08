"use client";

import { Activity } from "lucide-react";

export function StatusBar() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between glass-panel rounded-full px-6 py-2 text-xs font-mono w-full max-w-2xl mx-auto shadow-[0_0_15px_rgba(168,85,247,0.1)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-slate-300 font-bold tracking-widest">SYSTEM ONLINE</span>
        </div>
        <span className="text-slate-700">|</span>
        <span className="text-slate-500">v1.0.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3 text-cyan-400" /> LATENCY: <span className="text-cyan-400">12ms</span></span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-400 flex items-center gap-1">UPTIME: <span className="text-emerald-400">99.9%</span></span>
      </div>
    </div>
  );
}
