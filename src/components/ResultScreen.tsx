import React from 'react';
import type { GameState } from '../types/game';
import { calculateMedianRT } from '../hooks/useGameEngine';

interface ResultScreenProps {
    gameState: GameState;
    onRestart: () => void;
    onNextLevel: () => void;
    onTitle: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ gameState, onRestart, onNextLevel, onTitle }) => {
    const { stats, level, clearStatus, progress, maxProgress } = gameState;

    const medianReactionTime = calculateMedianRT(stats.reactionTimes);

    // Omission/Commission Rates
    const omissionRate = stats.goCount > 0 ? Math.round((stats.missCount / stats.goCount) * 100) : 0;
    const commissionRate = stats.nogoCount > 0 ? Math.round((stats.falseAlarmCount / stats.nogoCount) * 100) : 0;

    const totalErrors = stats.missCount + stats.falseAlarmCount;
    let biasText = "バランス良好（Optimal）";
    let biasDesc = "安定したパフォーマンスです";

    if (totalErrors > 0) {
        if (commissionRate > omissionRate * 1.5 || (stats.falseAlarmCount > stats.missCount && omissionRate === 0)) {
            biasText = "衝動性優位（Impulsive）";
            biasDesc = "反応を抑えきれていません";
        } else if (omissionRate > commissionRate * 1.5 || (stats.missCount > stats.falseAlarmCount && commissionRate === 0)) {
            biasText = "保守性/注意散漫（Inattentive）";
            biasDesc = "集中が途切れています";
        } else {
            biasText = "バランス良好（Optimal）";
            biasDesc = "エラーの偏りはありません";
        }
    }

    const interferenceCost = (level >= 5 && stats.baselineMedianRT !== null)
        ? medianReactionTime - stats.baselineMedianRT
        : null;

    const isClear = clearStatus === 'clear';
    const isGameOver = clearStatus === 'gameOver';
    const isAbort = clearStatus === 'abort';

    let titleText = "TRAINING COMPLETE";
    let titleColor = "from-green-400 to-blue-500";
    if (isGameOver) {
        titleText = "GAME OVER";
        titleColor = "from-red-500 to-orange-500";
    } else if (isAbort) {
        titleText = "TRAINING ABORTED";
        titleColor = "from-slate-400 to-slate-600";
    }

    return (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 text-slate-100 overflow-y-auto">
            <h2 className={`text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r ${titleColor} tracking-tight drop-shadow-md text-center`}>
                {titleText}
            </h2>

            <div className="bg-slate-800/80 p-6 flex flex-col gap-5 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-700 backdrop-blur-sm">

                {/* 1. Primary Information */}
                <div className="flex flex-col border-b border-slate-700 pb-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">到達レベル</span>
                        <span className="text-xl font-bold">Lv {level}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-slate-400">達成度合い</span>
                        <span className="text-xl font-bold text-blue-400">{progress} / {maxProgress}</span>
                    </div>
                </div>

                {/* 2. Speed metrics */}
                <div className="flex flex-col border-b border-slate-700 pb-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">全体RT中央値</span>
                        <span className="text-2xl font-bold font-mono">{medianReactionTime} <span className="text-sm">ms</span></span>
                    </div>
                    {interferenceCost !== null && (
                        <div className="flex justify-between items-center mt-1 text-sm">
                            <span className="text-slate-400">干渉コスト</span>
                            <span className={`font-mono font-bold ${interferenceCost > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                                {interferenceCost > 0 ? '+' : ''}{interferenceCost} ms
                            </span>
                        </div>
                    )}
                </div>

                {/* 3. Accuracy & Bias */}
                <div className="flex flex-col pb-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400">総エラー数</span>
                        <span className="text-xl font-bold text-red-400">
                            {totalErrors} <span className="text-sm text-slate-500">回</span>
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-4 mt-1">
                        <span className="text-slate-500">遅延 (Omission)</span>
                        <span className="text-slate-300 font-mono">{stats.missCount} <span className="text-xs text-slate-500">({omissionRate}%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-4">
                        <span className="text-slate-500">誤タップ (Commission)</span>
                        <span className="text-slate-300 font-mono">{stats.falseAlarmCount} <span className="text-xs text-slate-500">({commissionRate}%)</span></span>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 text-center text-sm border border-slate-700">
                    <div className="font-bold text-blue-300 mb-1">{biasText}</div>
                    <div className="text-slate-400 text-xs">{biasDesc}</div>
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-8 w-full max-w-sm">
                {isClear && level < 9 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onNextLevel(); }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full font-bold shadow-lg transition-transform active:scale-95 text-lg tracking-wider"
                    >
                        NEXT LEVEL
                    </button>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); onRestart(); }}
                    className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-full font-bold shadow-lg transition-transform active:scale-95 text-lg tracking-wider border border-slate-600"
                >
                    RETRY LEVEL {level}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); onTitle(); }}
                    className="w-full py-3 mt-2 text-slate-400 hover:text-white transition-colors text-sm font-bold tracking-widest"
                >
                    RETURN TO TITLE
                </button>
            </div>
        </div>
    );
};
