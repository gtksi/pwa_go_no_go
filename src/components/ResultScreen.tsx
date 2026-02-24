import React from 'react';
import type { GameStats } from '../types/game';

interface ResultScreenProps {
    stats: GameStats;
    onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
    // 中央値（Median）の計算
    const sortedRT = [...stats.reactionTimes].sort((a, b) => a - b);
    const medianReactionTime = sortedRT.length > 0
        ? sortedRT.length % 2 !== 0
            ? sortedRT[Math.floor(sortedRT.length / 2)]
            : Math.round((sortedRT[sortedRT.length / 2 - 1] + sortedRT[sortedRT.length / 2]) / 2)
        : 0;

    const inhibitionRate = stats.nogoCount > 0
        ? Math.round((stats.nogoSuccess / stats.nogoCount) * 100)
        : 0;

    const totalErrors = stats.missCount + stats.falseAlarmCount;
    let errorTendency = "パーフェクト！";
    if (totalErrors > 0) {
        if (stats.falseAlarmCount > stats.missCount) {
            errorTendency = "お手つき（衝動性）が多めです";
        } else if (stats.missCount > stats.falseAlarmCount) {
            errorTendency = "遅延（注意散漫）が多めです";
        } else {
            errorTendency = "見逃しとお手つきが同程度です";
        }
    }

    return (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-slate-100">
            <h2 className="text-4xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-tight drop-shadow-md">
                TRAINING COMPLETE
            </h2>

            <div className="bg-slate-800/80 p-6 flex flex-col gap-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-700 backdrop-blur-sm">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-400">反応速度 (中央値)</span>
                    <span className="text-2xl font-bold font-mono">{medianReactionTime} <span className="text-sm">ms</span></span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="text-slate-400">抑制成功率</span>
                    <span className="text-2xl font-bold font-mono text-green-400">{inhibitionRate} <span className="text-sm">%</span></span>
                </div>

                <div className="flex flex-col border-b border-slate-700 pb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400">エラー回数</span>
                        <span className="text-xl font-bold text-red-400">
                            {totalErrors} <span className="text-sm text-slate-500">回</span>
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-slate-500">遅延 (Omission)</span>
                        <span className="text-slate-300 font-mono">{stats.missCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-slate-500">誤タップ (Commission)</span>
                        <span className="text-slate-300 font-mono">{stats.falseAlarmCount}</span>
                    </div>
                </div>

                <div className="pt-2 text-center text-slate-300">
                    <p className="font-bold text-blue-300">{errorTendency}</p>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRestart();
                }}
                className="mt-12 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full font-bold shadow-lg transition-transform active:scale-95 text-xl tracking-wider ring-4 ring-blue-500/20"
            >
                PLAY AGAIN
            </button>
        </div>
    );
};
