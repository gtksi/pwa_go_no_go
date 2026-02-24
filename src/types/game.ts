export type StimulusShape = 'circle' | 'cross';
export type StimulusColor = 'black' | 'red' | 'blue';
export type StimulusType = 'go' | 'nogo';

export interface StimulusDefinition {
    shape: StimulusShape;
    color: StimulusColor;
    type: StimulusType;
}

export interface GameStats {
    reactionTimes: number[];
    goCount: number;
    nogoCount: number;
    goSuccess: number;
    nogoSuccess: number;
    missCount: number;       // Goが出たのに押さなかった
    falseAlarmCount: number; // No-Goが出たのに押した
}

export interface GameState {
    level: number;
    targetLevel: number;
    isCalibration: boolean;
    progress: number;
    maxProgress: number;
    currentRound: 1 | 2;
    isPlaying: boolean;
    isGameOver: boolean;
    stimulus: StimulusDefinition | null;
    isStimulusVisible: boolean;
    feedback: 'success' | 'miss' | 'falseAlarm' | null;
    stats: GameStats;
}
