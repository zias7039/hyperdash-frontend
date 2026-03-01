import React from 'react';

interface HistoryRecord {
    date: string;
    equity: number;
    btc_nav?: number;
    btc_price?: number;
    daily_pnl?: number;
}

interface HeatmapProps {
    history: HistoryRecord[];
}

export default function Heatmap({ history }: HeatmapProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Get the last 120 days or so to fit nicely in the UI
    const recentHistory = history.slice(-120);

    const getColorClass = (pnl?: number) => {
        if (pnl === undefined || pnl === 0) return 'bg-zinc-800/60';
        if (pnl > 0) {
            if (pnl > 500) return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'; // Neon bright
            if (pnl > 100) return 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]';
            if (pnl > 0) return 'bg-emerald-700/80';
        } else {
            if (pnl < -500) return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]';
            if (pnl < -100) return 'bg-rose-600 shadow-[0_0_5px_rgba(225,29,72,0.5)]';
            if (pnl < 0) return 'bg-rose-800/80';
        }
        return 'bg-zinc-800/60';
    };

    return (
        <div className="glass-panel p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-4">일일 손익 히트맵</h3>
            {recentHistory.length > 0 ? (
                <div className="flex-1 flex flex-wrap gap-1.5 items-end justify-start overflow-hidden">
                    {recentHistory.map((day, idx) => (
                        <div
                            key={idx}
                            className={`w-4 h-4 rounded-sm ${getColorClass(day.daily_pnl)} transition-opacity hover:opacity-75 cursor-help group relative`}
                        >
                            <div className="absolute font-sans bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-white/10 text-xs text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <span className="text-zinc-400 mr-2">{day.date}</span>
                                <span className={`font-bold ${day.daily_pnl && day.daily_pnl > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]'}`}>
                                    {day.daily_pnl && day.daily_pnl > 0 ? '+' : ''}{formatCurrency(day.daily_pnl || 0)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                    히스토리 데이터가 없습니다.
                </div>
            )}
            <div className="mt-4 flex items-center justify-end text-xs text-zinc-500 space-x-2">
                <span>Loss</span>
                <div className="w-3 h-3 rounded-sm bg-rose-700"></div>
                <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
                <div className="w-3 h-3 rounded-sm bg-zinc-800 mx-2"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                <span>Profit</span>
            </div>
        </div>
    );
}
