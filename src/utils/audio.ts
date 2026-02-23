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

    public playSound(type: 'success' | 'failure') {
        this.initContext();
        if (!this.audioCtx) return;

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
        } else {
            // 不快なブッという音
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.audioCtx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, this.audioCtx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + 0.3);
        }
    }
}

export const audioController = new AudioController();
