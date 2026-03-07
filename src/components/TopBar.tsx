// src/components/TopBar.tsx
import React from 'react';
import Link from 'next/link';

interface TopBarProps {
    equity: number;
    available: number;
    leverage: number;
    usdt_rate: number;
    total_invested: number;
}

export default function TopBar({ equity, available, leverage, usdt_rate, total_invested }: TopBarProps) {

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    const formatKRW = (usd: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(usd * usdt_rate);

    const calcROI = () => {
        if (!total_invested || total_invested <= 0) return 0;
        return ((equity - total_invested) / total_invested) * 100;
    };
    const roi = calcROI();

    return (
        <div className="glass-panel p-4 mb-4 relative hover:-translate-y-1 transition-transform duration-300 flex flex-wrap items-center justify-between">
            <Link
                href="/editor"
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-2 text-xl"
                title="데이터 수정 페이지로 이동"
            >
                ⚙️
            </Link>
            <div className="flex flex-col">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">총 자산</span>
                <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] tracking-tight">{formatCurrency(equity)}</span>
                    <span className="text-xs font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">/{formatKRW(equity)}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">누적 수익률 (ROI)</span>
                <span className={`text-xl font-black drop-shadow-md ${roi >= 0 ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.4)]'}`}>
                    {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">원금: {formatCurrency(total_invested)} <span className="text-zinc-600">({formatKRW(total_invested)})</span></span>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">사용 가능 증거금</span>
                <span className="text-xl font-bold text-white tracking-tight">
                    {formatCurrency(available)} <span className="text-xs text-zinc-500 font-normal">({formatKRW(available)})</span>
                </span>
            </div>

            <div className="flex flex-col items-end pr-4 text-right">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">총 레버리지</span>
                <span className={`text-lg font-bold ${leverage > 10 ? 'text-rose-500' : 'text-indigo-400'}`}>
                    {leverage.toFixed(2)}x
                </span>
            </div>

            <div className="flex flex-col items-end pr-10 text-right">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">USDT/KRW</span>
                <span className="text-lg font-bold text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
                    ₩{usdt_rate.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}
