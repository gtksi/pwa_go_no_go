import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState, StimulusDefinition, GameStats } from '../types/game';
import { audioController } from '../utils/audio';

const LEVEL_CONFIGS = [
    { level: 1, cycle: 1500, hasStroop: false, isJitter: false },
    { level: 2, cycle: 1400, hasStroop: false, isJitter: false },
    { level: 3, cycle: 1300, hasStroop: false, isJitter: false },
    { level: 4, cycle: 1200, hasStroop: false, isJitter: false },
    { level: 5, cycle: 1400, hasStroop: true, isJitter: false },
    { level: 6, cycle: 1300, hasStroop: true, isJitter: false },
    { level: 7, cycle: 1200, hasStroop: true, isJitter: false },
    { level: 8, cycle: 1100, hasStroop: true, isJitter: false },
    { level: 9, cycle: 1100, hasStroop: true, isJitter: true },
];

const initialStats: GameStats = {
    reactionTimes: [],
    goCount: 0,
    nogoCount: 0,
    goSuccess: 0,
    nogoSuccess: 0,
    missCount: 0,
    falseAlarmCount: 0,
};

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>({
        level: 1,
        targetLevel: 1,
        isCalibration: false,
        progress: 0,
        maxProgress: 10,
        currentRound: 1,
        isPlaying: false,
        isGameOver: false,
        stimulus: null,
        isStimulusVisible: false,
        feedback: null,
        stats: { ...initialStats },
    });

    const stateRef = useRef(gameState);
    stateRef.current = gameState;

    const bagRef = useRef<StimulusDefinition[]>([]);
    const cycleTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);
    const nextStageTimerRef = useRef<number | null>(null);
    const isInputValidRef = useRef<boolean>(false);
    const currentStimulusRef = useRef<StimulusDefinition | null>(null);
    const hasReactedRef = useRef<boolean>(false);
    const stimulusStartTimeRef = useRef<number>(0);

    // 1セット(10回)用の刺激生成
    const generateBag = (level: number) => {
        const config = LEVEL_CONFIGS[Math.min(level - 1, 8)];
        const bag: StimulusDefinition[] = [];

        // Go: 7 or 8 times
        const goCount = Math.random() > 0.5 ? 8 : 7;
        const nogoCount = 10 - goCount;

        for (let i = 0; i < goCount; i++) {
            let color: 'black' | 'red' | 'blue' = 'black';
            if (config.hasStroop) color = Math.random() > 0.5 ? 'blue' : 'red'; // Congruent & Incongruent Mix
            bag.push({ shape: 'circle', color, type: 'go' });
        }
        for (let i = 0; i < nogoCount; i++) {
            let color: 'black' | 'red' | 'blue' = 'black';
            if (config.hasStroop) color = Math.random() > 0.5 ? 'red' : 'blue'; // Congruent & Incongruent Mix
            bag.push({ shape: 'cross', color, type: 'nogo' });
        }

        // Fisher-Yates shuffle
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        return bag;
    };

    const cleanupTimers = () => {
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        if (nextStageTimerRef.current) clearTimeout(nextStageTimerRef.current);
    };

    const scheduleNextStimulus = useCallback(() => {
        if (!stateRef.current.isPlaying) return;
        cleanupTimers();

        if (bagRef.current.length === 0) {
            bagRef.current = generateBag(stateRef.current.level);
        }

        const nextStimulus = bagRef.current.shift()!;
        currentStimulusRef.current = nextStimulus;
        hasReactedRef.current = false;
        isInputValidRef.current = true;
        stimulusStartTimeRef.current = Date.now();

        const config = LEVEL_CONFIGS[Math.min(stateRef.current.level - 1, 8)];
        let cycleTime = config.cycle;
        if (config.isJitter) {
            cycleTime = 800 + Math.random() * 400; // 800 ~ 1200ms
        }

        // 表示比率：80%
        const showTime = cycleTime * 0.8;

        setGameState(prev => ({
            ...prev,
            stimulus: nextStimulus,
            isStimulusVisible: true,
            feedback: null,
            stats: {
                ...prev.stats,
                goCount: prev.stats.goCount + (nextStimulus.type === 'go' ? 1 : 0),
                nogoCount: prev.stats.nogoCount + (nextStimulus.type === 'nogo' ? 1 : 0),
            }
        }));

        // 刺激を消すタイマー
        hideTimerRef.current = window.setTimeout(() => {
            setGameState(prev => ({ ...prev, isStimulusVisible: false }));
        }, showTime);

        // 次のサイクルに移るタイマー
        cycleTimerRef.current = window.setTimeout(() => {
            isInputValidRef.current = false;
            handleCycleEnd();
        }, cycleTime);
    }, []);

    const executeFail = (reason: 'miss' | 'falseAlarm') => {
        audioController.playSound(reason as any);
        setGameState(prev => ({
            ...prev,
            progress: 0,
            feedback: reason,
            currentRound: prev.currentRound,
            stats: {
                ...prev.stats,
                missCount: prev.stats.missCount + (reason === 'miss' ? 1 : 0),
                falseAlarmCount: prev.stats.falseAlarmCount + (reason === 'falseAlarm' ? 1 : 0)
            }
        }));

        nextStageTimerRef.current = window.setTimeout(() => {
            if (stateRef.current.isPlaying) scheduleNextStimulus();
        }, 1000);
    };

    const executeSuccess = (type: 'go' | 'nogo', reactionTime?: number) => {
        audioController.playSound('success');

        setGameState(prev => {
            let nextProgress = prev.progress + 1;
            let nextRound = prev.currentRound;
            let nextLevel = prev.level;
            let nextIsPlaying = prev.isPlaying;
            let nextIsGameOver = prev.isGameOver;
            let nextIsCalibration = prev.isCalibration;

            if (nextProgress >= prev.maxProgress) {
                if (prev.isCalibration) {
                    // キャリブレーションは1ラウンドのみ
                    nextLevel = prev.targetLevel;
                    nextRound = 1;
                    nextProgress = 0;
                    nextIsPlaying = false;
                    nextIsCalibration = false;
                } else if (nextRound === 1) {
                    // Round 2へ
                    nextRound = 2;
                    nextProgress = 0;
                } else {
                    // Level Up
                    if (nextLevel < 9) {
                        nextLevel++;
                        nextRound = 1;
                        nextProgress = 0;
                        nextIsPlaying = false; // 一旦停止して手動再開
                    } else {
                        nextIsPlaying = false;
                        nextIsGameOver = true; // All levels clear
                    }
                }
            }

            return {
                ...prev,
                progress: nextProgress,
                currentRound: nextRound,
                level: nextLevel,
                isPlaying: nextIsPlaying,
                isGameOver: nextIsGameOver,
                isCalibration: nextIsCalibration,
                feedback: 'success',
                stats: {
                    ...prev.stats,
                    goSuccess: prev.stats.goSuccess + (type === 'go' ? 1 : 0),
                    nogoSuccess: prev.stats.nogoSuccess + (type === 'nogo' ? 1 : 0),
                    reactionTimes: reactionTime ? [...prev.stats.reactionTimes, reactionTime] : prev.stats.reactionTimes
                }
            };
        });
    };

    const handleCycleEnd = () => {
        if (!hasReactedRef.current && currentStimulusRef.current) {
            if (currentStimulusRef.current.type === 'go') {
                executeFail('miss');
                return;
            } else if (currentStimulusRef.current.type === 'nogo') {
                executeSuccess('nogo');
            }
        }

        if (stateRef.current.isPlaying) {
            scheduleNextStimulus();
        }
    };

    const startGame = useCallback((startLevel?: number) => {
        audioController.playSound('success'); // プレイ開始音
        setGameState(prev => {
            const isRestart = prev.isGameOver;
            let newLevel = prev.level;
            let newTargetLevel = prev.targetLevel;
            let newIsCalibration = prev.isCalibration;

            if (startLevel !== undefined) {
                if (startLevel >= 2) {
                    newLevel = 1;
                    newTargetLevel = startLevel;
                    newIsCalibration = true;
                } else {
                    newLevel = startLevel;
                    newTargetLevel = startLevel;
                    newIsCalibration = false;
                }
            } else if (isRestart) {
                newLevel = 1;
                newTargetLevel = 1;
                newIsCalibration = false;
            }

            return {
                ...prev,
                isPlaying: true,
                isGameOver: false,
                progress: 0,
                currentRound: 1,
                feedback: null,
                level: newLevel,
                targetLevel: newTargetLevel,
                isCalibration: newIsCalibration,
                stats: isRestart || (startLevel !== undefined) ? { ...initialStats } : prev.stats
            };
        });
        bagRef.current = [];
        hasReactedRef.current = false;

        cleanupTimers();

        nextStageTimerRef.current = window.setTimeout(() => {
            scheduleNextStimulus();
        }, 1000);
    }, [scheduleNextStimulus]);

    const stopGame = useCallback(() => {
        setGameState(prev => ({ ...prev, isPlaying: false, isStimulusVisible: false, isGameOver: true }));
        cleanupTimers();
        isInputValidRef.current = false;
    }, []);

    const quitToTitle = useCallback(() => {
        setGameState({
            level: 1,
            targetLevel: 1,
            isCalibration: false,
            progress: 0,
            maxProgress: 10,
            currentRound: 1,
            isPlaying: false,
            isGameOver: false,
            stimulus: null,
            isStimulusVisible: false,
            feedback: null,
            stats: { ...initialStats },
        });
        bagRef.current = [];
        hasReactedRef.current = false;
        cleanupTimers();
        isInputValidRef.current = false;
    }, []);

    const handleTap = useCallback(() => {
        if (!stateRef.current.isPlaying || !isInputValidRef.current || hasReactedRef.current) return;
        hasReactedRef.current = true;

        const stim = currentStimulusRef.current;
        if (!stim) return;

        const rt = Date.now() - stimulusStartTimeRef.current;

        if (stim.type === 'go') {
            executeSuccess('go', rt);
            setGameState(prev => ({ ...prev, isStimulusVisible: false }));
        } else {
            cleanupTimers();
            executeFail('falseAlarm');
        }
    }, []);

    useEffect(() => {
        return () => cleanupTimers();
    }, []);

    return {
        gameState,
        startGame,
        stopGame,
        quitToTitle,
        handleTap
    };
};
