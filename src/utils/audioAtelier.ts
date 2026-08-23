// Celestia Atelier Web Audio API Ambient Sound Synthesizer & State Machine

export type AudioState = 'AUDIO_DISABLED' | 'REQUEST_AUDIO_PERMISSION' | 'AUDIO_ENABLED' | 'AUDIO_BLOCKED';

class AtelierSoundEngine {
  private ctx: AudioContext | null = null;
  private state: AudioState = 'AUDIO_DISABLED';
  private masterGain: GainNode | null = null;
  private intervalId: any = null;
  private listeners: ((state: AudioState) => void)[] = [];
  private volume: number = 0.40; // Rich, clearly audible luxury volume

  // Warm luxury pentatonic chords (C major 9 / Fmaj7 voicing in Hz)
  // Low ambient drone + warm mid chords + bell sparkles
  private droneFreqs = [130.81, 196.00, 261.63]; // C3, G3, C4
  private midChordFreqs = [329.63, 392.00, 493.88, 523.25, 587.33, 659.25]; // E4, G4, B4, C5, D5, E5
  private chimeFreqs = [783.99, 880.00, 1046.50, 1174.66, 1318.51]; // G5, A5, C6, D6, E6

  constructor() {
    try {
      const saved = localStorage.getItem('celestia_sound_pref');
      if (saved === 'enabled') {
        // Preference ready
      }
    } catch {}
  }

  public subscribe(fn: (state: AudioState) => void) {
    this.listeners.push(fn);
    fn(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  private initContext(): boolean {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        this.state = 'AUDIO_BLOCKED';
        this.notify();
        return false;
      }
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return true;
  }

  public async toggle(): Promise<boolean> {
    if (this.state === 'AUDIO_ENABLED') {
      this.stop();
      return false;
    } else {
      return await this.start();
    }
  }

  public async start(): Promise<boolean> {
    this.state = 'REQUEST_AUDIO_PERMISSION';
    this.notify();

    if (!this.initContext() || !this.ctx) {
      this.state = 'AUDIO_BLOCKED';
      this.notify();
      return false;
    }

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.state = 'AUDIO_ENABLED';
      this.notify();
      try {
        localStorage.setItem('celestia_sound_pref', 'enabled');
      } catch {}

      // Play warm, grand opening atelier chord sequence
      this.playWarmChord([261.63, 329.63, 392.00, 493.88], 0.35);
      
      setTimeout(() => {
        if (this.state === 'AUDIO_ENABLED') {
          this.playHarmonicChime(880.00, 0.28);
          this.playHarmonicChime(1046.50, 0.24);
        }
      }, 700);

      // Continuous rhythmic atelier ambience loop
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        if (this.state !== 'AUDIO_ENABLED' || !this.ctx) return;
        
        // Randomly alternate between warm chord pads and bell chimes
        const roll = Math.random();
        if (roll > 0.45) {
          const root = this.midChordFreqs[Math.floor(Math.random() * this.midChordFreqs.length)];
          const third = root * 1.25;
          const fifth = root * 1.5;
          this.playWarmChord([root, third, fifth], 0.22);
        } else {
          const chime = this.chimeFreqs[Math.floor(Math.random() * this.chimeFreqs.length)];
          this.playHarmonicChime(chime, 0.25);
        }
      }, 3600);

      return true;
    } catch (err) {
      console.warn("Audio initialization note:", err);
      this.state = 'AUDIO_BLOCKED';
      this.notify();
      return false;
    }
  }

  public stop() {
    this.state = 'AUDIO_DISABLED';
    this.notify();
    try {
      localStorage.setItem('celestia_sound_pref', 'disabled');
    } catch {}

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch {}
    }
  }

  // Plays a lush, warm chord pad with soft attack and decay
  public playWarmChord(freqs: number[], gainLevel: number = 0.25) {
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        // Warm low-pass filter for analog silkiness
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gainLevel / freqs.length, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 5.1);
      });
    } catch {}
  }

  public playHarmonicChime(freq: number, gainLevel: number = 0.25) {
    if (!this.ctx || !this.masterGain || this.ctx.state !== 'running') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.9);
    } catch {}
  }

  // Micro-interaction sound: Click / Hover Chime
  public playMicroClick() {
    if (this.state !== 'AUDIO_ENABLED' || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Micro-interaction sound: Bag Addition Sparkle
  public playBagSparkle() {
    if (this.state !== 'AUDIO_ENABLED' || !this.ctx || !this.masterGain) return;
    try {
      [659.25, 880.0, 1046.5, 1318.5].forEach((f, idx) => {
        setTimeout(() => {
          this.playHarmonicChime(f, 0.22);
        }, idx * 110);
      });
    } catch {}
  }

  public getState(): AudioState {
    return this.state;
  }
}

export const atelierSound = new AtelierSoundEngine();
