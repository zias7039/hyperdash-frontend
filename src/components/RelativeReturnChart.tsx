// src/components/RelativeReturnChart.tsx
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoryRecord {
    date: string;
    equity: number;
    btc_nav?: number;
    btc_price?: number;
}

interface RelativeReturnChartProps {
    history: HistoryRecord[];
}

export default function RelativeReturnChart({ history }: RelativeReturnChartProps) {
    const chartData = useMemo(() => {
        if (!history || history.length === 0) return [];

        const firstEquity = history[0].equity;
        const firstBtcPrice = history.find(h => h.btc_price && h.btc_price > 0)?.btc_price;

        if (!firstEquity || firstEquity <= 0) return [];

        return history.map(record => {
            const myReturn = ((record.equity - firstEquity) / firstEquity) * 100;
            let btcReturn: number | null = null;

            if (firstBtcPrice && record.btc_price && record.btc_price > 0) {
                btcReturn = ((record.btc_price - firstBtcPrice) / firstBtcPrice) * 100;
            }

            return {
                date: record.date,
                myReturn: parseFloat(myReturn.toFixed(2)),
                btcReturn: btcReturn !== null ? parseFloat(btcReturn.toFixed(2)) : null,
                alpha: btcReturn !== null ? parseFloat((myReturn - btcReturn).toFixed(2)) : null
            };
        });
    }, [history]);

    const latestData = chartData.length > 0 ? chartData[chartData.length - 1] : null;

    return (
        <div className="glass-panel p-4 h-full min-h-[260px] flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">BTC 대비 수익률</h3>
                {latestData && latestData.alpha !== null && (
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-400 font-bold">● 내 수익률 <span className={latestData.myReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{latestData.myReturn > 0 ? '+' : ''}{latestData.myReturn}%</span></span>
                        <span className="text-indigo-400 font-bold">● BTC <span className={latestData.btcReturn !== null && latestData.btcReturn >= 0 ? 'text-indigo-400' : 'text-rose-400'}>{latestData.btcReturn !== null && latestData.btcReturn > 0 ? '+' : ''}{latestData.btcReturn}%</span></span>
                        <span className={`font-black px-2 py-0.5 rounded ${latestData.alpha >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            α {latestData.alpha > 0 ? '+' : ''}{latestData.alpha}%
                        </span>
                    </div>
                )}
            </div>
            {chartData.length > 0 ? (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMyReturn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBtcReturn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#a1a1aa"
                                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => {
                                    try {
                                        const d = new Date(val);
                                        return `${d.getMonth() + 1}/${d.getDate()}`;
                                    } catch {
                                        return val;
                                    }
                                }}
                            />
                            <YAxis
                                stroke="#a1a1aa"
                                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => `${val}%`}
                            />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(20,20,22,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                formatter={(value: any, name: string | undefined) => {
                                    const v = Number(value);
                                    const formatted = `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
                                    if (name === 'myReturn') return [formatted, '내 수익률'];
                                    if (name === 'btcReturn') return [formatted, 'BTC 수익률'];
                                    if (name === 'alpha') return [formatted, '초과 수익 (α)'];
                                    return [formatted, name || ''];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="btcReturn"
                                stroke="#6366f1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorBtcReturn)"
                                animationDuration={1000}
                                connectNulls={true}
                            />
                            <Area
                                type="monotone"
                                dataKey="myReturn"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMyReturn)"
                                animationDuration={1000}
                                connectNulls={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                    히스토리 데이터가 없습니다.
                </div>
            )}
        </div>
    );
}
