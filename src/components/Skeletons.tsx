// src/components/Skeletons.tsx
import React from 'react';
import { Activity, Percent, TrendingUp, PieChart, Layers } from 'lucide-react';

export function TopBarSkeleton() {
    return (
        <div className="glass-panel p-4 mb-4 flex flex-wrap items-center justify-between animate-pulse bg-zinc-900/40">
            <div className="flex flex-col space-y-2">
                <div className="h-3 w-16 bg-zinc-700/50 rounded"></div>
                <div className="flex items-baseline space-x-2">
                    <div className="h-8 w-40 bg-zinc-700/50 rounded"></div>
                    <div className="h-4 w-24 bg-zinc-700/50 rounded"></div>
                </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
                <div className="h-3 w-24 bg-zinc-700/50 rounded"></div>
                <div className="h-6 w-20 bg-zinc-700/50 rounded"></div>
                <div className="h-3 w-32 bg-zinc-700/50 rounded mt-1"></div>
            </div>

            <div className="flex flex-col items-end space-y-2">
                <div className="h-3 w-28 bg-zinc-700/50 rounded"></div>
                <div className="h-6 w-32 bg-zinc-700/50 rounded"></div>
            </div>

            <div className="flex flex-col items-end pr-4 text-right space-y-2">
                <div className="h-3 w-20 bg-zinc-700/50 rounded"></div>
                <div className="h-6 w-12 bg-zinc-700/50 rounded"></div>
            </div>

            <div className="flex flex-col items-end pr-10 text-right space-y-2">
                <div className="h-3 w-16 bg-zinc-700/50 rounded"></div>
                <div className="h-6 w-24 bg-zinc-700/50 rounded"></div>
            </div>
        </div>
    );
}

export function LeftSummarySkeleton() {
    return (
        <div className="glass-panel p-4 h-full animate-pulse bg-zinc-900/40">
            <h3 className="text-lg font-bold text-transparent bg-zinc-700/50 rounded w-24 mb-4 h-6"></h3>

            <div className="space-y-3">
                {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="bg-zinc-800/20 border border-white/5 p-3 rounded-xl">
                        <div className="h-3 w-20 bg-zinc-700/50 rounded mb-2"></div>
                        <div className="h-6 w-32 bg-zinc-700/50 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function NavChartSkeleton() {
    return (
        <div className="glass-panel p-4 h-full min-h-[300px] flex flex-col animate-pulse bg-zinc-900/40">
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-24 bg-zinc-700/50 rounded-lg"></div>
                <div className="h-6 w-32 bg-zinc-700/50 rounded-lg"></div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
                <div className="h-[200px] w-full bg-zinc-800/30 rounded-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-zinc-600 animate-spin" />
                </div>
            </div>
        </div>
    );
}

export function PositionsTableSkeleton() {
    return (
        <div className="glass-panel mt-4 overflow-hidden animate-pulse bg-zinc-900/40">
            <div className="p-4 border-b border-white/5 bg-zinc-900/40">
                <div className="h-6 w-32 bg-zinc-700/50 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
                {[1, 2, 3].map(row => (
                    <div key={row} className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
                        <div className="h-4 w-16 bg-zinc-700/50 rounded"></div>
                        <div className="h-4 w-12 bg-zinc-700/50 rounded-full"></div>
                        <div className="h-4 w-24 bg-zinc-700/50 rounded"></div>
                        <div className="h-4 w-20 bg-zinc-700/50 rounded"></div>
                        <div className="h-4 w-20 bg-zinc-700/50 rounded"></div>
                        <div className="h-4 w-24 bg-zinc-700/50 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
