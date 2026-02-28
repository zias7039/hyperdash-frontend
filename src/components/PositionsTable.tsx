// src/components/PositionsTable.tsx
import React from 'react';

interface Position {
    symbol: string;
    marginCoin: string;
    posMode: string;
    holdSide: string;
    leverage: number;
    marginSize: string;
    openPriceAvg: string;
    markPrice: string;
    unrealizedPL: string;
    liquidationPrice: string;
}

interface PositionsTableProps {
    positions: Position[];
}

export default function PositionsTable({ positions }: PositionsTableProps) {
    const formatNum = (val: string | number) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    const formatCurrency = (val: string | number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg mt-6 overflow-hidden">
            <div className="p-5 border-b border-zinc-800">
                <h3 className="text-xl font-bold text-white">현재 포지션</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-300">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4">심볼</th>
                            <th className="px-6 py-4">포지션/레버리지</th>
                            <th className="px-6 py-4 text-right">증거금</th>
                            <th className="px-6 py-4 text-right">진입가</th>
                            <th className="px-6 py-4 text-right">시장가</th>
                            <th className="px-6 py-4 text-right">미실현 손익</th>
                            <th className="px-6 py-4 text-right">청산가</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                                    보유 중인 포지션이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            positions.map((pos, idx) => {
                                const isLong = pos.holdSide === 'long';
                                const pnl = Number(pos.unrealizedPL);
                                const pnlClass = pnl >= 0 ? 'text-emerald-400' : 'text-rose-400';

                                return (
                                    <tr key={idx} className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{pos.symbol}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold mr-2 ${isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {pos.holdSide.toUpperCase()}
                                            </span>
                                            <span className="text-zinc-400">{pos.leverage}x</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">{formatCurrency(pos.marginSize)}</td>
                                        <td className="px-6 py-4 text-right">{formatNum(pos.openPriceAvg)}</td>
                                        <td className="px-6 py-4 text-right">{formatNum(pos.markPrice)}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${pnlClass}`}>
                                            {pnl > 0 ? '+' : ''}{formatCurrency(pnl)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-orange-400">{formatNum(pos.liquidationPrice)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
