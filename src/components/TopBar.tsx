// src/components/TopBar.tsx
import React from 'react';

interface TopBarProps {
    equity: number;
    available: number;
    leverage: number;
    usdt_rate: number;
}

export default function TopBar({ equity, available, leverage, usdt_rate }: TopBarProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    const formatKRW = (usd: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(usd * usdt_rate);

    return (
        <div className="flex flex-wrap items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg mb-6">
            <div className="flex flex-col">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">총 자산</span>
                <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-white">{formatCurrency(equity)}</span>
                    <span className="text-sm font-medium text-emerald-400">/{formatKRW(equity)}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">사용 가능 증거금</span>
                <span className="text-xl font-semibold text-white">{formatCurrency(available)}</span>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">레버리지</span>
                <span className={`text-xl font-bold ${leverage > 10 ? 'text-rose-500' : 'text-blue-400'}`}>
                    {leverage.toFixed(2)}x
                </span>
            </div>
        </div>
    );
}
