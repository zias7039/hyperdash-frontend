import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MarginItem {
    name: string;
    value: number;
}

interface MarginPieChartProps {
    data: MarginItem[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa', '#f472b6', '#3fddfc'];

export default function MarginPieChart({ data }: MarginPieChartProps) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">자산 분산 비율 (증거금)</h3>
            {data && data.length > 0 ? (
                <div className="flex-1 w-full min-h-[300px]">
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
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#fff' }}
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
