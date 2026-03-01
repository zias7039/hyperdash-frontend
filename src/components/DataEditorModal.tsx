'use client';
import React, { useState, useEffect } from 'react';

interface HistoryRecord {
    date: string;
    equity: number;
}

interface DataEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInvested: number;
    initialHistory: HistoryRecord[];
    apiUrl: string;
    onSuccess: () => void;
}

export default function DataEditorModal({ isOpen, onClose, currentInvested, initialHistory, apiUrl, onSuccess }: DataEditorModalProps) {
    const [investedAmount, setInvestedAmount] = useState<string>(currentInvested.toString());
    const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setInvestedAmount(currentInvested.toString());
            // Make a copy of the history
            setHistoryData([...initialHistory]);
        }
    }, [isOpen, currentInvested, initialHistory]);

    if (!isOpen) return null;

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
        setLoading(true);
        try {
            // 1. Save Settings (Invested Amount)
            await fetch(`${apiUrl}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ total_invested: Number(investedAmount) })
            });

            // 2. Save Bulk History
            // Filter out empty dates
            const validHistory = historyData.filter(h => h.date.trim() !== '');
            const res = await fetch(`${apiUrl}/api/history/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validHistory)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-full flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-zinc-800 bg-zinc-900/80">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-emerald-400">📊</span> 포트폴리오 데이터 편집기
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1">엑셀 형식으로 전체 데이터를 한 번에 조회하고 수정할 수 있습니다.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 w-8 h-8 rounded-full flex items-center justify-center">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    {/* Invested Section */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                        <label className="block text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wide">누적 총 투자 원금 (USD)</label>
                        <div className="flex items-center gap-3 max-w-sm">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={investedAmount}
                                    onChange={(e) => setInvestedAmount(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded py-2.5 pl-8 pr-3 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* History Grid Section */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                            <label className="text-sm font-medium text-indigo-400 uppercase tracking-wide">일자별 자산 기록 (History)</label>
                            <button
                                onClick={handleAddRow}
                                className="text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded transition-colors font-medium flex items-center gap-1"
                            >
                                <span>+</span> 새로운 행 추가
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="px-4 py-3 font-medium border-b border-zinc-800 w-16 text-center">No.</th>
                                        <th className="px-4 py-3 font-medium border-b border-zinc-800">날짜 (YYYY-MM-DD)</th>
                                        <th className="px-4 py-3 font-medium border-b border-zinc-800">자산 총액 (Equity)</th>
                                        <th className="px-4 py-3 font-medium border-b border-zinc-800 w-24 text-center">삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((row, idx) => (
                                        <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-4 py-2 text-center text-zinc-600 font-mono text-sm">{idx + 1}</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="date"
                                                    value={row.date}
                                                    onChange={(e) => handleCellChange(idx, 'date', e.target.value)}
                                                    className="w-full bg-transparent border border-transparent group-hover:border-zinc-700 focus:border-indigo-500 focus:bg-zinc-950 rounded px-2 py-1 text-zinc-200 focus:outline-none transition-colors [color-scheme:dark]"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600">$</span>
                                                    <input
                                                        type="number"
                                                        value={row.equity}
                                                        onChange={(e) => handleCellChange(idx, 'equity', e.target.value)}
                                                        className="w-full bg-transparent border border-transparent group-hover:border-zinc-700 focus:border-indigo-500 focus:bg-zinc-950 rounded py-1 pl-6 pr-2 text-zinc-200 font-mono focus:outline-none transition-colors"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleRemoveRow(idx)}
                                                    className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                                                    title="행 삭제"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {historyData.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
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
                <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={loading}
                        className="px-6 py-2.5 rounded text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {loading ? '저장 중...' : '💾 전체 저장 적용'}
                    </button>
                </div>
            </div>
        </div>
    );
}
