import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import type { StimulusDefinition } from '../types/game';

interface StimulusProps {
    stimulus: StimulusDefinition | null;
    isVisible: boolean;
    feedback?: 'success' | 'miss' | 'falseAlarm' | null;
}

export const Stimulus: React.FC<StimulusProps> = ({ stimulus, isVisible, feedback }) => {
    // Generate a stable key for each new stimulus object instance
    const cycleKey = useMemo(() => Date.now().toString(), [stimulus]);
    const getColorClass = (color: string) => {
        if (feedback === 'miss') {
            return 'text-slate-600 drop-shadow-none transition-colors duration-500 opacity-0';
        }
        switch (color) {
            case 'red':
                return 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
            case 'blue':
                return 'text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]';
            case 'black':
            default:
                return 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]';
        }
    };

    return (
        <div className="relative w-80 h-80 mx-auto flex items-center justify-center rounded-[3rem] bg-slate-800/80 shadow-2xl border border-slate-700/60 backdrop-blur-sm">
            <AnimatePresence mode="wait">
                {isVisible && stimulus && (
                    <motion.div
                        key={`${stimulus.shape}-${cycleKey}`}
                        initial={{ scale: 0.1, opacity: 0 }}
                        animate={{ scale: feedback === 'miss' ? 0.8 : 1, opacity: feedback === 'miss' ? 0 : 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                        className={`text-[12rem] leading-none font-bold select-none transition-colors duration-300 ${getColorClass(
                            stimulus.color
                        )}`}
                    >
                        {stimulus.shape === 'circle' ? '○' : '×'}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Burst effect for falseAlarm */}
            {feedback === 'falseAlarm' && isVisible && stimulus && (
                <motion.div
                    key={`burst-${cycleKey}`}
                    className={`text-[12rem] leading-none font-bold select-none absolute text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]`}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {stimulus.shape === 'circle' ? '○' : '×'}
                </motion.div>
            )}
        </div>
    );
};
