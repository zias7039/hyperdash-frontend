import React from 'react';

interface HistoryRecord {
    date: string;
    equity: number;
}

interface MonthlyReturnProps {
    history: HistoryRecord[];
}

export default function MonthlyReturn({ history }: MonthlyReturnProps) {
    // Calculate monthly returns
    const calculateMonthlyReturns = () => {
        if (!history || history.length === 0) return [];

        const grouped: { [month: string]: HistoryRecord[] } = {};

        history.forEach(record => {
            const month = record.date.substring(0, 7); // "YYYY-MM"
            if (!grouped[month]) grouped[month] = [];
            grouped[month].push(record);
        });

        const returns = Object.keys(grouped).map(month => {
            const monthData = grouped[month];

            // Sort by date just in case
            monthData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            const firstDay = monthData[0].equity;
            const lastDay = monthData[monthData.length - 1].equity;

            let returnPct = 0;
            if (firstDay > 0) {
                returnPct = ((lastDay - firstDay) / firstDay) * 100;
            }

            return {
                month,
                returnPct,
                startEq: firstDay,
                endEq: lastDay
            };
        });

        // Sort descending by month
        return returns.sort((a, b) => b.month.localeCompare(a.month)).slice(0, 5); // Show last 5 months
    };

    const monthlyData = calculateMonthlyReturns();

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">월별 수익률</h3>
            {monthlyData.length > 0 ? (
                <div className="flex-1 flex flex-col gap-3 justify-center">
                    {monthlyData.map((item, idx) => {
                        const isPositive = item.returnPct >= 0;
                        const [year, month] = item.month.split('-');
                        return (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-8 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{year}년 {month}월</div>
                                        <div className="text-xs text-zinc-500">
                                            ${item.startEq?.toLocaleString(undefined, { maximumFractionDigits: 0 })} → ${item.endEq?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-black text-lg ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isPositive ? '+' : ''}{item.returnPct.toFixed(2)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                    데이터가 충분하지 않습니다.
                </div>
            )}
        </div>
    );
}
