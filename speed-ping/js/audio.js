// ============================================
// SPEED PING - AUDIO ENGINE
// ============================================

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.ambientOscillator = null;
        this.ambientGain = null;
        this.isAmbientPlaying = false;

        this.initAudioContext();
    }

    initAudioContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // Volume geral
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API não disponível:', e);
        }
    }

    // ============================================
    // EFEITOS SONOROS
    // ============================================

    playBeepSound() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playClickSound() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playSuccessSound() {
        if (!this.audioContext) return;
        
        const now = this.audioContext.currentTime;
        const frequencies = [800, 1000, 1200];
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.frequency.value = freq;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.2, now + index * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.05 + 0.1);

            osc.start(now + index * 0.05);
            osc.stop(now + index * 0.05 + 0.1);
        });
    }

    // ============================================
    // TRILHA AMBIENTE
    // ============================================

    startAmbientTrack() {
        if (this.isAmbientPlaying || !this.audioContext) return;

        this.isAmbientPlaying = true;

        // Criar oscilador para tom de fundo suave
        this.ambientOscillator = this.audioContext.createOscillator();
        this.ambientGain = this.audioContext.createGain();

        // Conectar ao master gain
        this.ambientOscillator.connect(this.ambientGain);
        this.ambientGain.connect(this.masterGain);

        // Configurar oscilador
        this.ambientOscillator.type = 'sine';
        this.ambientOscillator.frequency.value = 60; // Frequência baixa para ambiente

        // Configurar ganho (volume suave)
        this.ambientGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);

        // Iniciar oscilador
        this.ambientOscillator.start();

        // Adicionar variação suave na frequência
        this.modulateAmbientFrequency();
    }

    modulateAmbientFrequency() {
        if (!this.ambientOscillator || !this.isAmbientPlaying) return;

        const now = this.audioContext.currentTime;
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();

        lfo.frequency.value = 0.5; // Modulação lenta
        lfoGain.gain.value = 10; // Amplitude da modulação

        lfo.connect(lfoGain);
        lfoGain.connect(this.ambientOscillator.frequency);

        lfo.start(now);

        // Parar modulação após 30 segundos (será reiniciada se necessário)
        setTimeout(() => {
            lfo.stop();
        }, 30000);
    }

    stopAmbientTrack() {
        if (!this.isAmbientPlaying || !this.ambientOscillator) return;

        this.isAmbientPlaying = false;

        // Fade out suave
        const now = this.audioContext.currentTime;
        this.ambientGain.gain.exponentialRampToValueAtTime(0.001, now + 1);

        setTimeout(() => {
            if (this.ambientOscillator) {
                this.ambientOscillator.stop();
                this.ambientOscillator = null;
            }
        }, 1000);
    }

    // ============================================
    // CONTROLE DE VOLUME
    // ============================================

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    getMasterVolume() {
        return this.masterGain ? this.masterGain.gain.value : 0;
    }
}

// Instância global do motor de áudio
const audioEngine = new AudioEngine();
