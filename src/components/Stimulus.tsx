import { motion, AnimatePresence } from 'framer-motion';
import type { StimulusDefinition } from '../types/game';

interface StimulusProps {
    stimulus: StimulusDefinition | null;
    isVisible: boolean;
}

export const Stimulus: React.FC<StimulusProps> = ({ stimulus, isVisible }) => {
    const getColorClass = (color: string) => {
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
                        key={`${stimulus.shape}-${Date.now()}`}
                        initial={{ scale: 0.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                        className={`text-[12rem] leading-none font-bold select-none ${getColorClass(
                            stimulus.color
                        )}`}
                    >
                        {stimulus.shape === 'circle' ? '○' : '×'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
