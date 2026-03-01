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
        <div className="glass-panel p-6 h-full min-h-[400px] flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-bold text-white mb-4">자산 & NAV 히스토리</h3>
            {history.length > 0 ? (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
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
                                contentStyle={{ backgroundColor: 'rgba(20,20,22,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                formatter={(value: any, name: string | undefined) => {
                                    if (name === 'equity') return [formatCurrency(Number(value) || 0), '내 자산'];
                                    if (name === 'btc_nav') return [formatCurrency(Number(value) || 0), 'BTC 벤치마크'];
                                    return [value, name || ''];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="btc_nav"
                                stroke="#6366f1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorBtc)"
                                animationDuration={1000}
                                connectNulls={true}
                            />
                            <Area
                                type="monotone"
                                dataKey="equity"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEquity)"
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
