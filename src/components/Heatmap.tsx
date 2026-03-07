import React, { useRef, useEffect } from 'react';

interface HistoryRecord {
    date: string;
    equity: number;
    btc_nav?: number;
    btc_price?: number;
    daily_pnl?: number;
}

interface HeatmapProps {
    history: HistoryRecord[];
    usdt_rate?: number;
}

export default function Heatmap({ history, usdt_rate }: HeatmapProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    const formatKrw = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(val);

    // Show up to roughly 365 days (1 year) to demonstrate scrolling
    const recentHistory = history.slice(-365);

    // Auto scroll to the right (most recent)
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [history]);

    const getColorClass = (pnl?: number) => {
        if (pnl === undefined || pnl === 0) return 'bg-zinc-800/60';
        if (pnl > 0) {
            if (pnl > 500) return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
            if (pnl > 100) return 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]';
            if (pnl > 0) return 'bg-emerald-700/80';
        } else {
            if (pnl < -500) return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]';
            if (pnl < -100) return 'bg-rose-600 shadow-[0_0_4px_rgba(225,29,72,0.5)]';
            if (pnl < 0) return 'bg-rose-800/80';
        }
        return 'bg-zinc-800/60';
    };

    // Calculate grid layout (rows = days of week 0-6, cols = weeks)
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const weeks: (typeof recentHistory)[] = [];
    if (recentHistory.length > 0) {
        let currentWeek: typeof recentHistory = [];

        // Pad the first week with nulls to align with the correct start day
        const firstDate = new Date(recentHistory[0].date);
        const firstDayOfWeek = firstDate.getDay(); // 0-6
        for (let i = 0; i < firstDayOfWeek; i++) {
            currentWeek.push({ date: '', equity: 0, daily_pnl: undefined } as any);
        }

        recentHistory.forEach((record) => {
            currentWeek.push(record);
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        // Add the remaining days of the last week
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push({ date: '', equity: 0, daily_pnl: undefined } as any);
            }
            weeks.push(currentWeek);
        }
    }

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="glass-panel p-4 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white mb-4">일일 손익 히트맵</h3>
            {recentHistory.length > 0 ? (
                <div className="flex-1 flex overflow-hidden">
                    {/* Y-axis Day Labels */}
                    <div className="flex flex-col justify-between text-[10px] text-zinc-500 pr-2 pt-[2px] pb-[2px] h-[130px]">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                    </div>

                    {/* Scrollable Heatmap Grid */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-x-auto pb-4 custom-scrollbar"
                    >
                        <div className="flex gap-1 h-[130px] min-w-max">
                            {weeks.map((week, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1 justify-between">
                                    {week.map((day, dIdx) => {
                                        if (!day.date) {
                                            return <div key={dIdx} className="w-3.5 h-3.5 rounded-sm bg-transparent"></div>;
                                        }
                                        return (
                                            <div
                                                key={dIdx}
                                                className={`w-3.5 h-3.5 rounded-sm ${getColorClass(day.daily_pnl)} transition-opacity hover:opacity-75 cursor-help group relative`}
                                            >
                                                <div className="absolute font-sans bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-zinc-900/95 backdrop-blur-md border border-white/10 text-xs text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                    <span className="text-zinc-400 mr-2">{day.date}</span>
                                                    <span className={`font-bold ${day.daily_pnl && day.daily_pnl > 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]'}`}>
                                                        {day.daily_pnl && day.daily_pnl > 0 ? '+' : ''}{formatCurrency(day.daily_pnl || 0)}
                                                    </span>
                                                    {usdt_rate && day.daily_pnl !== undefined && day.daily_pnl !== 0 && (
                                                        <span className="text-zinc-500 ml-1.5 text-[10px]">
                                                            ({day.daily_pnl > 0 ? '+' : ''}{formatKrw(day.daily_pnl * usdt_rate)})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500 min-h-[130px]">
                    히스토리 데이터가 없습니다.
                </div>
            )}
            <div className="mt-2 flex items-center justify-end text-xs text-zinc-500 space-x-2">
                <span>Loss</span>
                <div className="w-3 h-3 rounded-sm bg-rose-700"></div>
                <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
                <div className="w-3 h-3 rounded-sm bg-zinc-800 mx-2"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                <span>Profit</span>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
