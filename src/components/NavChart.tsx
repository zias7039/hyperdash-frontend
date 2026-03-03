// src/components/NavChart.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoryRecord {
    date: string;
    equity: number;
    btc_nav?: number;
    btc_price?: number;
    return_pct?: number;
    invested_capital?: number;
}

interface NavChartProps {
    history: HistoryRecord[];
}

type ChartMode = 'asset' | 'return';

export default function NavChart({ history }: NavChartProps) {
    const [mode, setMode] = useState<ChartMode>('asset');

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Build return data from backend's return_pct + BTC return
    const returnData = useMemo(() => {
        if (!history || history.length === 0) return [];
        const firstBtcPrice = history.find(h => h.btc_price && h.btc_price > 0)?.btc_price;

        return history.map(record => {
            let btcReturn: number | null = null;
            if (firstBtcPrice && record.btc_price && record.btc_price > 0) {
                btcReturn = parseFloat((((record.btc_price - firstBtcPrice) / firstBtcPrice) * 100).toFixed(2));
            }
            const myReturn = record.return_pct ?? 0;
            return {
                date: record.date,
                myReturn,
                btcReturn,
                alpha: btcReturn !== null ? parseFloat((myReturn - btcReturn).toFixed(2)) : null,
            };
        });
    }, [history]);

    const latestReturn = returnData.length > 0 ? returnData[returnData.length - 1] : null;

    return (
        <div className="glass-panel p-4 h-full min-h-[300px] flex flex-col hover:-translate-y-1 transition-transform duration-300">
            {/* Header with Tabs */}
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setMode('asset')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${mode === 'asset' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        자산 히스토리
                    </button>
                    <button
                        onClick={() => setMode('return')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${mode === 'return' ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        수익률 (입출금 반영)
                    </button>
                </div>
                {/* Alpha badge (only in return mode) */}
                {mode === 'return' && latestReturn && latestReturn.alpha !== null && (
                    <div className="flex items-center gap-3 text-xs">
                        <span className={`font-bold ${latestReturn.myReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>● 내 수익률 {latestReturn.myReturn > 0 ? '+' : ''}{latestReturn.myReturn}%</span>
                        <span className="text-indigo-400 font-bold">● BTC {latestReturn.btcReturn !== null && latestReturn.btcReturn > 0 ? '+' : ''}{latestReturn.btcReturn}%</span>
                        <span className={`font-black px-2 py-0.5 rounded ${latestReturn.alpha >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            α {latestReturn.alpha > 0 ? '+' : ''}{latestReturn.alpha}%
                        </span>
                    </div>
                )}
            </div>

            {history.length > 0 ? (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        {mode === 'asset' ? (
                            /* ===== ASSET MODE ===== */
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
                                <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false}
                                    tickFormatter={(val) => { try { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; } catch { return val; } }}
                                />
                                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(20,20,22,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    formatter={(value: any, name: string | undefined) => {
                                        if (name === 'equity') return [formatCurrency(Number(value) || 0), '내 자산'];
                                        if (name === 'btc_nav') return [formatCurrency(Number(value) || 0), 'BTC 벤치마크'];
                                        return [value, name || ''];
                                    }}
                                />
                                <Area type="monotone" dataKey="btc_nav" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBtc)" animationDuration={1000} connectNulls={true} />
                                <Area type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" animationDuration={1000} connectNulls={true} />
                            </AreaChart>
                        ) : (
                            /* ===== RETURN MODE (Deposit-Aware) ===== */
                            <AreaChart data={returnData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                                <XAxis dataKey="date" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false}
                                    tickFormatter={(val) => { try { const d = new Date(val); return `${d.getMonth() + 1}/${d.getDate()}`; } catch { return val; } }}
                                />
                                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `${val}%`} />
                                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(20,20,22,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                    formatter={(value: any, name: string | undefined) => {
                                        const v = Number(value);
                                        const formatted = `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
                                        if (name === 'myReturn') return [formatted, '내 수익률'];
                                        if (name === 'btcReturn') return [formatted, 'BTC 수익률'];
                                        return [formatted, name || ''];
                                    }}
                                />
                                <Area type="monotone" dataKey="btcReturn" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorBtcReturn)" animationDuration={1000} connectNulls={true} />
                                <Area type="monotone" dataKey="myReturn" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMyReturn)" animationDuration={1000} connectNulls={true} />
                            </AreaChart>
                        )}
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
