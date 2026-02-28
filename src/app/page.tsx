'use client';

import React from 'react';
import useSWR from 'swr';
import TopBar from '@/components/TopBar';
import LeftSummary from '@/components/LeftSummary';
import PositionsTable from '@/components/PositionsTable';
import NavChart from '@/components/NavChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  // Fetch data every 10 seconds using environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/dashboard`, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-rose-500/50">
          <h2 className="text-2xl font-bold text-rose-500 mb-2">연결 오류</h2>
          <p className="text-zinc-400">백엔드 서버 연결에 실패했습니다.</p>
          <p className="text-xs text-zinc-500 mt-4">FastAPI 서버가 8000 포트에서 실행 중인지 확인하세요.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400 font-medium tracking-wider animate-pulse">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data.metrics || !data.positions) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-yellow-500/50">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">백엔드 API 오류</h2>
          <p className="text-zinc-400 mb-4">백엔드에서 예상치 못한 응답 포맷을 반환했습니다.</p>
          <pre className="text-xs text-red-400 p-4 bg-black rounded overflow-auto max-w-lg text-left">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  const { metrics, positions, history } = data;

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <span className="text-xl font-black text-white">⚡</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              HYPERDASH
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span>실시간 동기화 중</span>
          </div>
        </header>

        {/* Top Metrics Row */}
        <TopBar
          equity={metrics.equity}
          available={metrics.available}
          leverage={metrics.leverage}
          usdt_rate={metrics.usdt_rate}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

          {/* Left Column - Summary */}
          <div className="lg:col-span-1 h-full">
            <LeftSummary
              equity={metrics.equity}
              usage_pct={metrics.usage_pct}
              upl_pnl={metrics.upl_pnl}
              roe={metrics.roe}
              pos_data={positions}
              usdt_rate={metrics.usdt_rate}
            />
          </div>

          {/* Right Column - Chart */}
          <div className="lg:col-span-3 h-full">
            <NavChart history={history} />
          </div>
        </div>

        {/* Bottom Section - Positions */}
        <PositionsTable positions={positions} />

      </div>
    </div>
  );
}
