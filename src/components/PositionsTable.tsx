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
    btc_benchmark?: {
        price: number;
        change24h: number;
    };
}

export default function PositionsTable({ positions, btc_benchmark }: PositionsTableProps) {
    const formatNum = (val: string | number) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    const formatCurrency = (val: string | number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val));

    const calculateRiskPct = (open: string, mark: string, liq: string, isLong: boolean) => {
        const o = Number(open);
        const m = Number(mark);
        const l = Number(liq);
        if (!l || l === 0) return 0;
        const totalDist = isLong ? o - l : l - o;
        const currentDist = isLong ? m - l : l - m;
        if (totalDist <= 0) return 0;
        let risk = 100 - ((currentDist / totalDist) * 100);
        return Math.max(0, Math.min(100, risk));
    };

    return (
        <div className="glass-panel mt-6 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow duration-300">
            <div className="p-5 border-b border-white/10 bg-zinc-900/40 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-xl font-bold text-white tracking-wide">현재 포지션</h3>
                {btc_benchmark && (
                    <div className="flex items-center space-x-2 text-sm bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-700/50">
                        <span className="text-zinc-400">BTC 벤치마크:</span>
                        <span className="font-bold text-white max-w-[120px] truncate" title={formatCurrency(btc_benchmark.price)}>
                            {formatCurrency(btc_benchmark.price)}
                        </span>
                        <span className={`font-bold ${btc_benchmark.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ({btc_benchmark.change24h > 0 ? '+' : ''}{btc_benchmark.change24h.toFixed(2)}%)
                        </span>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-300">
                    <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/60 backdrop-blur border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">심볼</th>
                            <th className="px-6 py-4">포지션/레버리지</th>
                            <th className="px-6 py-4 text-right">증거금</th>
                            <th className="px-6 py-4 text-right">진입가</th>
                            <th className="px-6 py-4 text-right">시장가</th>
                            <th className="px-6 py-4 text-right">미실현 손익</th>
                            <th className="px-6 py-4 text-right">청산가 & 위험도</th>
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-orange-400 mb-1">{formatNum(pos.liquidationPrice)}</div>
                                            {Number(pos.liquidationPrice) > 0 && (
                                                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden flex items-center justify-end">
                                                    <div
                                                        className={`h-1.5 rounded-full ${calculateRiskPct(pos.openPriceAvg, pos.markPrice, pos.liquidationPrice, isLong) > 80 ? 'bg-rose-500' :
                                                            calculateRiskPct(pos.openPriceAvg, pos.markPrice, pos.liquidationPrice, isLong) > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${calculateRiskPct(pos.openPriceAvg, pos.markPrice, pos.liquidationPrice, isLong)}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </td>
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
