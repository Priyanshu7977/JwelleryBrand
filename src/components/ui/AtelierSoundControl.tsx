import React, { useEffect, useState } from 'react';
import { atelierSound, AudioState } from '../../utils/audioAtelier';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AtelierSoundControl: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>(atelierSound.getState());

  useEffect(() => {
    const unsub = atelierSound.subscribe(setAudioState);
    return unsub;
  }, []);

  const handleToggle = async () => {
    await atelierSound.toggle();
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] transition-all select-none">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2.5 px-4 h-10 rounded-full border shadow-md backdrop-blur-md transition-all text-xs font-sans font-semibold ${
          audioState === 'AUDIO_ENABLED'
            ? 'bg-champagne-200 border-gold-dark text-obsidian shadow-sm'
            : audioState === 'AUDIO_BLOCKED'
            ? 'bg-amber-100 border-amber-300 text-amber-900'
            : audioState === 'REQUEST_AUDIO_PERMISSION'
            ? 'bg-pearl-100 border-champagne-300 text-obsidian animate-pulse'
            : 'bg-pearl-50/95 border-champagne-300/80 text-obsidian hover:bg-champagne-100/60'
        }`}
        aria-label="Toggle Atelier Atmospheric Audio"
      >
        {audioState === 'AUDIO_ENABLED' ? (
          <>
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 bg-gold-dark rounded-full h-3 animate-pulse" />
              <span className="w-1 bg-gold-dark rounded-full h-2 animate-pulse delay-75" />
              <span className="w-1 bg-gold-dark rounded-full h-3.5 animate-pulse delay-150" />
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-obsidian">
              Atelier Sound: ON
            </span>
          </>
        ) : audioState === 'AUDIO_BLOCKED' ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-amber-800" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-900 font-bold">
              Tap to Unmute
            </span>
          </>
        ) : audioState === 'REQUEST_AUDIO_PERMISSION' ? (
          <>
            <Sparkles className="w-3.5 h-3.5 text-gold-dark animate-spin" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-obsidian font-bold">
              Connecting...
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-obsidian" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-obsidian font-bold">
              Atelier Sound: OFF
            </span>
          </>
        )}
      </button>
    </div>
  );
};
