import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
    progress: number;
    max: number;
    round: 1 | 2;
}

export const Gauge: React.FC<GaugeProps> = ({ progress, max, round }) => {
    // 1ラウンド目と2ラウンド目でゲージの色を変えて進行状況を視覚化
    const progressColor = round === 1 ? 'bg-blue-500' : 'bg-green-500';
    const percentage = Math.min((progress / max) * 100, 100);

    return (
        <div className="w-full max-w-md mx-auto my-6 px-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2 px-1 font-bold">
                <span>Round {round}/2</span>
                <span>Lv 1</span> {/* TODO: レベル連動 */}
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner border border-slate-700/50">
                <motion.div
                    className={`h-full ${progressColor} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                />
            </div>
        </div>
    );
};
