import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';

interface MusicPlayerProps {
  config: SurpriseConfig;
  onOpenMusicCustomizer?: () => void;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  config,
  onOpenMusicCustomizer,
  isPlaying = false,
  onPlay,
  onPause,
  isMuted = false,
  onToggleMute,
}) => {
  const [fakeProgress, setFakeProgress] = useState<number>(0);

  // Smooth visual progress bar simulation while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFakeProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 relative z-10"
      >
        <p className="font-script text-2xl sm:text-3xl text-[#9f1239]">
          press play, close your eyes
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          Our Song
        </h2>
      </motion.div>

      {/* Music Card Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-800"
      >
        {/* Vinyl Record and Artwork */}
        <div className="relative flex items-center justify-center my-4">
          {/* Animated Spinning Vinyl */}
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-stone-950 via-stone-800 to-stone-950 shadow-2xl p-1.5 flex items-center justify-center relative border border-stone-700/60 transition-transform ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            {/* Vinyl Grooves Texture */}
            <div className="absolute inset-2 rounded-full border border-stone-700/30" />
            <div className="absolute inset-5 rounded-full border border-stone-700/30" />
            <div className="absolute inset-9 rounded-full border border-stone-700/30" />
            <div className="absolute inset-14 rounded-full border border-stone-700/30" />

            {/* Center Label with Girlfriend Photo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-stone-300 relative z-10 shadow-md">
              <img
                src={config.lockPhotoUrl}
                alt="Record Center"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-rose-900/20" />
              {/* Center hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-950 border border-stone-600 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Track Details */}
        <div className="text-center mt-6">
          <h3 className="font-serif-luxury text-2xl font-medium text-white tracking-wide">
            {config.songTitle}
          </h3>
          <p className="text-xs uppercase tracking-widest text-rose-400 mt-1 font-sans font-medium">
            {config.artistName}
          </p>
        </div>

        {/* Animated Equalizer Waves */}
        <div className="flex items-center justify-center gap-1.5 h-8 my-4">
          {[40, 70, 95, 60, 85, 45, 100, 75, 50, 90, 65, 30].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? {
                      height: [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`],
                    }
                  : { height: '15%' }
              }
              transition={
                isPlaying
                  ? {
                      repeat: Infinity,
                      duration: 0.8 + (i % 4) * 0.15,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full transition-colors ${
                isPlaying ? 'bg-rose-500' : 'bg-stone-700'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden my-4">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-400 h-full rounded-full transition-all duration-200"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between mt-6 px-4">
          {/* Mute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 text-stone-400 hover:text-stone-200 transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Music icon decoration */}
          <div className="p-2 text-rose-400/80">
            <Music className="w-5 h-5" />
          </div>
        </div>

        {/* Subtitle bottom note */}
        <div className="mt-6 text-center border-t border-stone-800/80 pt-4">
          <p className="font-handwriting text-lg text-rose-300/90 tracking-wide">
            every lyric, I meant it about you ✨
          </p>

          {/* Quick Change Song / Upload button */}
          {onOpenMusicCustomizer && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onOpenMusicCustomizer}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-700 border border-stone-700/80 text-stone-300 hover:text-white text-xs font-medium transition cursor-pointer"
              >
                <Music className="w-3.5 h-3.5 text-rose-400" />
                <span>Change Song / Upload MP3</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
