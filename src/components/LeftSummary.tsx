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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-400" />
                Summary
            </h3>

            <div className="space-y-6">
                <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <span className="text-zinc-400 text-sm font-medium uppercase flex items-center mb-1">
                        <Percent className="w-4 h-4 mr-1" /> ROE
                    </span>
                    <span className={`text-2xl font-bold ${roe >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {roe > 0 ? '+' : ''}{roe.toFixed(2)}%
                    </span>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <span className="text-zinc-400 text-sm font-medium uppercase flex items-center mb-1">
                        <TrendingUp className="w-4 h-4 mr-1" /> UPL (PNL)
                    </span>
                    <span className={`text-2xl font-bold ${upl_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(upl_pnl)}
                    </span>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <span className="text-zinc-400 text-sm font-medium uppercase mb-1 block">Margin Usage</span>
                        <span className="text-xl font-semibold text-white">{usage_pct.toFixed(2)}%</span>
                    </div>
                    <div className="w-24 bg-zinc-700 rounded-full h-2.5">
                        <div
                            className={`bg-indigo-500 h-2.5 rounded-full`}
                            style={{ width: `${Math.min(usage_pct, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <span className="text-zinc-400 text-sm font-medium uppercase mb-1 block">Open Positions</span>
                    <span className="text-xl font-semibold text-white">{pos_data.length}</span>
                </div>
            </div>
        </div>
    );
}
