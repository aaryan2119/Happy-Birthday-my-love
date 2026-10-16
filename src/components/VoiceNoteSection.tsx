import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Mic, Volume2, VolumeX, Upload, Sparkles, Heart } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';

interface VoiceNoteSectionProps {
  config: SurpriseConfig;
  isVoicePlaying: boolean;
  onPlayVoice: () => void;
  onPauseVoice: () => void;
  onVoiceEnded: () => void;
  onUploadVoiceNote?: (dataUrl: string) => void;
}

export const VoiceNoteSection: React.FC<VoiceNoteSectionProps> = ({
  config,
  isVoicePlaying,
  onPlayVoice,
  onPauseVoice,
  onVoiceEnded,
  onUploadVoiceNote,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio source
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = config.voiceNoteUrl;
      audioRef.current.load();
    }
  }, [config.voiceNoteUrl]);

  // Sync external play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isVoicePlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Voice note play failed:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isVoicePlaying]);

  const togglePlay = () => {
    if (isVoicePlaying) {
      onPauseVoice();
    } else {
      onPlayVoice();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekTo = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadVoiceNote) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUploadVoiceNote(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate 24 dynamic waveform bars
  const waveformHeights = [
    30, 45, 75, 60, 90, 40, 80, 100, 65, 85, 45, 95,
    70, 85, 40, 60, 90, 75, 100, 55, 80, 40, 65, 35
  ];

  return (
    <section className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Hidden Audio Element */}
      {Boolean(config.voiceNoteUrl) && (
        <audio
          ref={audioRef}
          src={config.voiceNoteUrl || undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onVoiceEnded}
          preload="metadata"
        />
      )}

      {/* Warm Ambient Burgundy Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[450px] bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <p className="font-script text-2xl sm:text-3xl text-[#9f1239]">
          from my heart to your ears
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.voiceNoteTitle || 'I recorded a little song for you...'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 font-sans">
          {config.voiceNoteSubtitle || 'Press play to hear me sing Happy Birthday to you 💕'}
        </p>
      </motion.div>

      {/* Voice Note Audio Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-lg bg-gradient-to-b from-[#2a0410] via-[#20030c] to-[#140107] border-2 border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(76,5,25,0.35)] text-white select-none overflow-hidden"
      >
        {/* Subtle Rosy Glow in Card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isVoicePlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Voice Note for {config.recipientName}
              </p>
              <p className="text-[11px] text-stone-400">
                Singing Happy Birthday 🎂
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full text-stone-400 hover:text-white transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
          </button>
        </div>

        {/* Dynamic Dancing Voice Waveform Bars */}
        <div className="py-6 flex items-center justify-center gap-1 sm:gap-1.5 h-24 relative z-10">
          {waveformHeights.map((maxH, idx) => {
            const isPassed = duration > 0 && (currentTime / duration) >= (idx / waveformHeights.length);
            return (
              <motion.div
                key={idx}
                animate={
                  isVoicePlaying
                    ? {
                        height: [
                          `${Math.max(15, maxH * 0.3)}%`,
                          `${maxH}%`,
                          `${Math.max(20, maxH * 0.5)}%`,
                          `${Math.max(10, maxH * 0.2)}%`,
                        ],
                      }
                    : { height: `${Math.max(15, maxH * 0.35)}%` }
                }
                transition={
                  isVoicePlaying
                    ? {
                        repeat: Infinity,
                        duration: 0.6 + (idx % 5) * 0.12,
                        ease: 'easeInOut',
                        repeatType: 'mirror',
                      }
                    : { duration: 0.3 }
                }
                className={`w-1.5 sm:w-2 rounded-full transition-colors duration-200 ${
                  isPassed
                    ? 'bg-gradient-to-t from-rose-500 to-amber-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'bg-rose-950/80 border border-rose-900/40'
                }`}
              />
            );
          })}
        </div>

        {/* Scrubber & Timestamps */}
        <div className="space-y-1.5 relative z-10">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
          />
          <div className="flex justify-between text-[11px] font-mono text-stone-400">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '0:35'}</span>
          </div>
        </div>

        {/* Play / Pause Big Button & Notice */}
        <div className="mt-5 flex flex-col items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isVoicePlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </button>

          <p className="text-xs text-rose-300/80 font-serif-luxury italic text-center">
            {isVoicePlaying
              ? 'Singing to you... (background music paused) 🎵'
              : 'Tap to listen to me sing to you 💕'}
          </p>

          {/* Quick Upload Button for Boyfriend */}
          {onUploadVoiceNote && (
            <label className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-medium transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Replace / Upload Your Voice Note (MP3/M4A)</span>
              <input
                type="file"
                accept="audio/*,.mp3,.m4a,.wav"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </motion.div>
    </section>
  );
};
