'use client';

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import LeftSummary from '@/components/LeftSummary';
import PositionsTable from '@/components/PositionsTable';
import NavChart from '@/components/NavChart';
import MarginPieChart from '@/components/MarginPieChart';
import Heatmap from '@/components/Heatmap';
import MonthlyReturn from '@/components/MonthlyReturn';
import { ErrorBoundary } from 'react-error-boundary';
import { TopBarSkeleton, LeftSummarySkeleton, NavChartSkeleton, PositionsTableSkeleton } from '@/components/Skeletons';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  // Fetch data every 10 seconds using environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { data, error, isLoading, mutate: mutateDashboard } = useSWR(`${apiUrl}/api/dashboard`, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const { data: settings, mutate: mutateSettings } = useSWR(`${apiUrl}/api/settings`, fetcher);

  // --- Live WebSocket Data ---
  const [liveData, setLiveData] = useState<{ equity?: number, available?: number, upl_pnl?: number } | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;
    const wsUrl = apiUrl.replace("http://", "ws://").replace("https://", "wss://");

    const connect = () => {
      ws = new WebSocket(`${wsUrl}/ws/live`);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.equity !== undefined) {
            setLiveData(msg);
          }
        } catch (e) { }
      };
      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [apiUrl]);

  const handleDataUpdated = () => {
    mutateSettings();
    mutateDashboard();
  };

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
      <div className="min-h-screen bg-black text-white p-6 font-sans">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <header className="flex items-center justify-between mb-8 opacity-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-8 w-40 bg-zinc-800 rounded-lg animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-zinc-800 rounded-lg animate-pulse" />
          </header>

          <TopBarSkeleton />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch lg:min-h-[400px]">
              <div className="lg:col-span-1 h-full"><LeftSummarySkeleton /></div>
              <div className="lg:col-span-3 h-full"><NavChartSkeleton /></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch lg:min-h-[400px]">
              <div className="lg:col-span-1 h-full"><div className="glass-panel p-4 h-full animate-pulse bg-zinc-900/40"></div></div>
              <div className="lg:col-span-2 h-full"><PositionsTableSkeleton /></div>
              <div className="lg:col-span-1 h-full"><div className="glass-panel p-4 h-full animate-pulse bg-zinc-900/40"></div></div>
            </div>
          </div>
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

  const { metrics, positions, history, btc_benchmark, margin_distribution } = data;

  // Use live metrics if available, otherwise fallback to SWR data
  const currentEquity = liveData?.equity ?? metrics.equity;
  const currentAvailable = liveData?.available ?? metrics.available;
  const currentUplPnl = liveData?.upl_pnl ?? metrics.upl_pnl;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans selection:bg-indigo-500/30">
      <motion.div
        className="max-w-[1600px] mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <span className="text-xl font-black text-white">⚡</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              HYPERDASH
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            <Link
              href="/editor"
              className="mr-6 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] font-bold tracking-wide"
            >
              <span>⚙️</span> 데이터 에디터
            </Link>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span>실시간 동기화 중</span>
          </div>
        </motion.header>

        <ErrorBoundary fallback={
          <div className="p-8 text-center glass-panel border border-rose-500/30 bg-rose-500/5">
            <h2 className="text-xl font-bold text-rose-500 mb-2">무언가 잘못되었습니다</h2>
            <p className="text-zinc-400 text-sm">페이지를 새로고침 하거나 데이터를 다시 확인해주세요.</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold shadow-md hover:bg-rose-500/30 transition-colors">새로고침</button>
          </div>
        }>

          {/* Top Metrics Row */}
          <motion.div variants={itemVariants}>
            <TopBar
              equity={metrics.equity}
              available={metrics.available}
              leverage={metrics.leverage}
              usdt_rate={metrics.usdt_rate}
              total_invested={settings?.total_invested || 0}
              btc_return={history && history.length > 0 ? history[history.length - 1].btc_return_pct : null}
            />
          </motion.div>

          {/* Main Content Grid - V6 Perfectly Aligned Layout */}
          <div className="flex flex-col gap-4">

            {/* Row 1: LeftSummary (25%) + NavChart (75%) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch lg:min-h-[400px]">
              <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
                <LeftSummary
                  equity={metrics.equity}
                  usage_pct={metrics.usage_pct}
                  upl_pnl={metrics.upl_pnl}
                  roe={metrics.roe}
                  pos_data={positions}
                  usdt_rate={metrics.usdt_rate}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="lg:col-span-3 h-full">
                <NavChart history={history} />
              </motion.div>
            </div>

            {/* Row 2: MarginPieChart (25%) + Heatmap (50%) + MonthlyReturn (25%) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch lg:min-h-[260px]">
              <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
                <MarginPieChart data={margin_distribution} />
              </motion.div>
              <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
                <Heatmap history={history} usdt_rate={metrics.usdt_rate} />
              </motion.div>
              <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
                <MonthlyReturn history={history} />
              </motion.div>
            </div>
          </div>

          {/* Bottom Section - Positions */}
          <motion.div variants={itemVariants}>
            <PositionsTable positions={positions} btc_benchmark={btc_benchmark} usdt_rate={metrics.usdt_rate} />
          </motion.div>

        </ErrorBoundary>
      </motion.div>
    </div>
  );
}
