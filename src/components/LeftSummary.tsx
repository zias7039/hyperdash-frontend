// src/components/LeftSummary.tsx
import React from 'react';
import { TrendingUp, Percent, DollarSign, Activity } from 'lucide-react';

interface Position {
    symbol: string;
    marginSize: string;
    unrealizedPL: string;
    leverage: number;
}

interface LeftSummaryProps {
    equity: number;
    usage_pct: number;
    upl_pnl: number;
    roe: number;
    pos_data: Position[];
    usdt_rate: number;
}

export default function LeftSummary({ equity, usage_pct, upl_pnl, roe, pos_data, usdt_rate }: LeftSummaryProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="glass-panel p-4 h-full hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-400" />
                요약
            </h3>

            <div className="space-y-3">
                <div className="bg-zinc-800/30 border border-white/5 p-3 rounded-xl">
                    <span className="text-zinc-400 text-xs font-medium uppercase flex items-center mb-1">
                        <Percent className="w-3 h-3 mr-1 text-indigo-400" /> ROE
                    </span>
                    <span className={`text-xl font-black drop-shadow-md ${roe >= 0 ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.4)]'}`}>
                        {roe > 0 ? '+' : ''}{roe.toFixed(2)}%
                    </span>
                </div>

                <div className="bg-zinc-800/30 border border-white/5 p-3 rounded-xl">
                    <span className="text-zinc-400 text-xs font-medium uppercase flex items-center mb-1">
                        <TrendingUp className="w-3 h-3 mr-1 text-indigo-400" /> UPL (PNL)
                    </span>
                    <span className={`text-xl font-black drop-shadow-md flex items-end justify-between ${upl_pnl >= 0 ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.4)]'}`}>
                        <span>{formatCurrency(upl_pnl)}</span>
                        <span className="text-[11px] text-zinc-500 font-medium ml-2 pb-1 bg-transparent">
                            ({new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(upl_pnl * usdt_rate)})
                        </span>
                    </span>
                </div>

                <div className="bg-zinc-800/30 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                    <div>
                        <span className="text-zinc-400 text-xs font-medium uppercase mb-1 block">증거금 사용률</span>
                        <span className="text-lg font-bold text-white drop-shadow-sm">{usage_pct.toFixed(2)}%</span>
                    </div>
                    <div className="w-20 bg-zinc-950/50 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                            className={`bg-indigo-500 h-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                            style={{ width: `${Math.min(usage_pct, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-zinc-800/30 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-zinc-400 text-xs font-medium uppercase">보유 포지션</span>
                    <span className="text-lg font-bold text-white drop-shadow-sm">{pos_data.length}</span>
                </div>
            </div>
        </div>
    );
}
