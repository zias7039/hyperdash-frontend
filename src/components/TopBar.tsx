// src/components/TopBar.tsx
import React, { useState } from 'react';
import DataEntryModal from './DataEntryModal';

interface TopBarProps {
    equity: number;
    available: number;
    leverage: number;
    usdt_rate: number;
    total_invested: number;
    apiUrl: string;
    onDataUpdated: () => void;
}

export default function TopBar({ equity, available, leverage, usdt_rate, total_invested, apiUrl, onDataUpdated }: TopBarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    const formatKRW = (usd: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(usd * usdt_rate);

    const calcROI = () => {
        if (!total_invested || total_invested <= 0) return 0;
        return ((equity - total_invested) / total_invested) * 100;
    };
    const roi = calcROI();

    return (
        <div className="flex flex-wrap items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg mb-6 relative">
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors p-2"
                title="데이터 수정"
            >
                ⚙️
            </button>
            <div className="flex flex-col">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">총 자산</span>
                <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-white">{formatCurrency(equity)}</span>
                    <span className="text-sm font-medium text-emerald-400">/{formatKRW(equity)}</span>
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">누적 수익률 (ROI)</span>
                <span className={`text-xl font-bold ${roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                </span>
                <span className="text-xs text-zinc-500">원금: {formatCurrency(total_invested)}</span>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">사용 가능 증거금</span>
                <span className="text-xl font-semibold text-white">{formatCurrency(available)}</span>
            </div>

            <div className="flex flex-col items-end pr-8">
                <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">레버리지</span>
                <span className={`text-xl font-bold ${leverage > 10 ? 'text-rose-500' : 'text-blue-400'}`}>
                    {leverage.toFixed(2)}x
                </span>
            </div>

            <DataEntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentInvested={total_invested}
                apiUrl={apiUrl}
                onSuccess={onDataUpdated}
            />
        </div>
    );
}
