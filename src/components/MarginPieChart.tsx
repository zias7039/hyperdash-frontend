import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MarginItem {
    name: string;
    value: number;
}

interface MarginPieChartProps {
    data: MarginItem[];
}

// Hyper-premium neon palette
const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#8b5cf6', '#0ea5e9', '#f59e0b', '#ec4899', '#14b8a6'];

export default function MarginPieChart({ data }: MarginPieChartProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="glass-panel p-4 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-lg font-bold text-white mb-2">자산 분산 비율 (증거금)</h3>
            {data && data.length > 0 ? (
                <div className="flex-1 w-full min-h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                                contentStyle={{ backgroundColor: 'rgba(20,20,22,0.8)', borderColor: 'rgba(255,255,255,0.1)', color: '#f4f4f5', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#a1a1aa', fontSize: '13px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                    활성화된 포지션이 없습니다.
                </div>
            )}
        </div>
    );
}
