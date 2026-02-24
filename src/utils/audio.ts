export class AudioController {
    private audioCtx: AudioContext | null = null;

    private initContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    public playSound(type: 'success' | 'miss' | 'falseAlarm') {
        this.initContext();
        if (!this.audioCtx) return;

        if (type === 'miss') {
            // ミス（遅延）時は音を鳴らさない仕様
            return;
        }

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        if (type === 'success') {
            // 心地よいピンッという音
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioCtx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + 0.3);
        } else if (type === 'falseAlarm') {
            // 弾かれたような鈍い音 (Thud sound)
            // 低周波のサイン波・三角波を使用
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(100, this.audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.15); // 急激に下がるピッチ

            gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, this.audioCtx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + 0.15);
        }
    }
}

export const audioController = new AudioController();
