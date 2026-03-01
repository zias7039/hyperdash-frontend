'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface HistoryRecord {
    date: string;
    equity: number;
}

export default function EditorPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const { data: dashboardData, isLoading: dashLoading } = useSWR(`${apiUrl}/api/dashboard`, fetcher);
    const { data: settingsData, isLoading: setLoading } = useSWR(`${apiUrl}/api/settings`, fetcher);

    const [investedAmount, setInvestedAmount] = useState<string>('0');
    const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
    const [loading, setLoadingState] = useState(false);

    useEffect(() => {
        if (settingsData) {
            setInvestedAmount(settingsData.total_invested.toString());
        }
        if (dashboardData && dashboardData.history) {
            setHistoryData([...dashboardData.history]);
        }
    }, [dashboardData, settingsData]);

    const handleCellChange = (index: number, field: keyof HistoryRecord, value: string) => {
        const newData = [...historyData];
        if (field === 'date') {
            newData[index].date = value;
        } else {
            newData[index].equity = Number(value);
        }
        setHistoryData(newData);
    };

    const handleAddRow = () => {
        const today = new Date().toISOString().split('T')[0];
        setHistoryData([...historyData, { date: today, equity: 0 }]);
    };

    const handleRemoveRow = (index: number) => {
        const newData = [...historyData];
        newData.splice(index, 1);
        setHistoryData(newData);
    };

    const handleSaveAll = async () => {
        setLoadingState(true);
        try {
            await fetch(`${apiUrl}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_invested: Number(investedAmount) })
            });

            const validHistory = historyData.filter(h => h.date.trim() !== '');
            const res = await fetch(`${apiUrl}/api/history/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validHistory)
            });

            if (res.ok) {
                alert("성공적으로 저장되었습니다.");
                // Redirect user back to dashboard or let them stay
                window.location.href = '/';
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setLoadingState(false);
        }
    };

    if (dashLoading || setLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-400 font-medium tracking-wider animate-pulse">에디터 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden mt-8">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-900/40">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                            <span className="text-emerald-400">📊</span> 포트폴리오 데이터 편집기
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">엑셀 형식으로 전체 데이터를 한 번에 조회하고 수정할 수 있습니다.</p>
                    </div>
                    <Link href="/" className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-md">
                        <span className="text-xl leading-none">←</span> 메인 대시보드로 돌아가기
                    </Link>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    {/* Invested Section */}
                    <div className="bg-zinc-800/30 border border-white/5 rounded-xl p-6">
                        <label className="block text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wide drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                            누적 총 투자 원금 (USD)
                        </label>
                        <div className="flex items-center gap-3 max-w-sm">
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={investedAmount}
                                    onChange={(e) => setInvestedAmount(e.target.value)}
                                    className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-lg py-3 pl-9 pr-4 text-white text-xl font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Grid Section */}
                    <div className="bg-zinc-800/30 border border-white/5 rounded-xl flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-white/5 bg-zinc-900/50 flex justify-between items-center">
                            <label className="text-sm font-medium text-indigo-400 uppercase tracking-wide drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                                일자별 자산 기록 (History)
                            </label>
                            <button
                                onClick={handleAddRow}
                                className="text-sm bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-1 border border-indigo-500/20 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            >
                                <span>+</span> 새로운 행 추가
                            </button>
                        </div>

                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-zinc-900/90 backdrop-blur-md text-zinc-400 text-xs uppercase tracking-wider shadow-md">
                                        <th className="px-6 py-4 font-medium border-b border-zinc-800 w-20 text-center">No.</th>
                                        <th className="px-6 py-4 font-medium border-b border-zinc-800">날짜 (YYYY-MM-DD 기입)</th>
                                        <th className="px-6 py-4 font-medium border-b border-zinc-800">자산 총액 (Equity)</th>
                                        <th className="px-6 py-4 font-medium border-b border-zinc-800 w-28 text-center">삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-zinc-800/30 hover:bg-zinc-800/50 transition-colors group">
                                            <td className="px-6 py-3 text-center text-zinc-600 font-mono text-sm">{idx + 1}</td>
                                            <td className="px-6 py-3">
                                                <input
                                                    type="text"
                                                    placeholder="2024-01-01"
                                                    value={row.date}
                                                    onChange={(e) => handleCellChange(idx, 'date', e.target.value)}
                                                    className="w-full bg-transparent border border-transparent group-hover:border-zinc-700/50 focus:border-indigo-500 focus:bg-zinc-950/80 rounded-md px-3 py-2 text-zinc-200 font-mono focus:outline-none transition-colors"
                                                />
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">$</span>
                                                    <input
                                                        type="number"
                                                        value={row.equity}
                                                        onChange={(e) => handleCellChange(idx, 'equity', e.target.value)}
                                                        className="w-full bg-transparent border border-transparent group-hover:border-zinc-700/50 focus:border-indigo-500 focus:bg-zinc-950/80 rounded-md py-2 pl-7 pr-3 text-zinc-200 font-mono focus:outline-none transition-colors"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    onClick={() => handleRemoveRow(idx)}
                                                    className="text-zinc-600 hover:text-white hover:bg-rose-500 rounded-md p-1.5 transition-colors"
                                                    title="행 삭제"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {historyData.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-medium">
                                                데이터가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/40 flex justify-end gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                    <button
                        onClick={handleSaveAll}
                        disabled={loading}
                        className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5"
                    >
                        {loading ? '데이터 저장 중...' : '💾 서버에 전체 저장 적용'}
                    </button>
                </div>
            </div>
        </div>
    );
}
