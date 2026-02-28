// src/components/NavChart.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistoryRecord {
    date: string;
    equity: number;
    btc_nav?: number;
    btc_price?: number;
}

interface NavChartProps {
    history: HistoryRecord[];
}

export default function NavChart({ history }: NavChartProps) {
    // Add today's date if missing (or handle gracefully in standard usage)
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg h-full min-h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">자산 & NAV 히스토리</h3>
            {history.length > 0 ? (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#a1a1aa"
                                tick={{ fill: '#a1a1aa', fontSize: 12 }}
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
                                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#818cf8' }}
                                formatter={(value: any, name: string | undefined) => {
                                    if (name === 'equity') return [formatCurrency(Number(value) || 0), '내 자산'];
                                    if (name === 'btc_nav') return [formatCurrency(Number(value) || 0), 'BTC 벤치마크'];
                                    return [value, name || ''];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="btc_nav"
                                stroke="#fbbf24"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorBtc)"
                                animationDuration={1000}
                            />
                            <Area
                                type="monotone"
                                dataKey="equity"
                                stroke="#818cf8"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEquity)"
                                animationDuration={1000}
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
