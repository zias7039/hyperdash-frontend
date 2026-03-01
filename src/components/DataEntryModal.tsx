'use client';
import React, { useState } from 'react';

interface DataEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInvested: number;
    apiUrl: string;
    onSuccess: () => void;
}

export default function DataEntryModal({ isOpen, onClose, currentInvested, apiUrl, onSuccess }: DataEntryModalProps) {
    const [activeTab, setActiveTab] = useState<'invested' | 'history'>('invested');

    // Tab 1 state
    const [investedAmount, setInvestedAmount] = useState<string>(currentInvested.toString());
    const [investedLoading, setInvestedLoading] = useState(false);

    // Tab 2 state
    const [historyDate, setHistoryDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [historyEquity, setHistoryEquity] = useState<string>('');
    const [historyLoading, setHistoryLoading] = useState(false);

    if (!isOpen) return null;

    const handleInvestedSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInvestedLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_invested: Number(investedAmount) })
            });
            if (res.ok) {
                onSuccess(); // triggers SWR revalidation parent-side
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInvestedLoading(false);
        }
    };

    const handleHistorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHistoryLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: historyDate, equity: Number(historyEquity) })
            });
            if (res.ok) {
                onSuccess();
                setHistoryEquity(''); // clear field
                alert(`${historyDate} 데이터가 반영되었습니다.`);
            } else {
                alert("적용 실패");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-white">데이터 수동 설정</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1">
                        ✕
                    </button>
                </div>

                <div className="flex border-b border-zinc-800 text-sm">
                    <button
                        className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'invested' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-zinc-800/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/10'}`}
                        onClick={() => setActiveTab('invested')}
                    >
                        총 투자 원금 설정
                    </button>
                    <button
                        className={`flex-1 py-3 font-semibold transition-colors ${activeTab === 'history' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-zinc-800/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/10'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        과거 내역 수동 추가
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'invested' ? (
                        <form onSubmit={handleInvestedSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">총 누적 투자 원금 (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={investedAmount}
                                        onChange={(e) => setInvestedAmount(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">이 금액은 누적 총 수익률(ROI) 계산의 기준점이 됩니다.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={investedLoading}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {investedLoading ? '저장 중...' : '원금 저장'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleHistorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">날짜 (YYYY-MM-DD)</label>
                                <input
                                    type="date"
                                    required
                                    value={historyDate}
                                    onChange={(e) => setHistoryDate(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">자산 총액 (Equity in USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="예: 1530.50"
                                        value={historyEquity}
                                        onChange={(e) => setHistoryEquity(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">이미 존재하는 날짜를 입력하면 자본이 수정(덮어쓰기)됩니다.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={historyLoading}
                                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {historyLoading ? '추가 중...' : '기록 추가/수정'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
