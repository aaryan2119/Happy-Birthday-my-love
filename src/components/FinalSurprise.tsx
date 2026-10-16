import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, RotateCcw, Share2 } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';
import { soundManager } from '../utils/audio';
import { fireHeartCelebration } from '../utils/confetti';

interface FinalSurpriseProps {
  config: SurpriseConfig;
  onReplay: () => void;
  onOpenShare: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({ config, onReplay, onOpenShare }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const handleTapHeart = () => {
    soundManager.playHeartPop();
    fireHeartCelebration();
    setIsRevealed(true);
  };

  return (
    <section className="py-20 sm:py-24 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md bg-gradient-to-b from-[#881337] via-[#700d2b] to-[#4c0519] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-rose-800/60 relative overflow-hidden text-center flex flex-col items-center justify-between min-h-[480px]"
      >
        {/* Decorative corner roses */}
        <div className="absolute top-4 left-4 text-rose-300/30 text-2xl select-none pointer-events-none">
          🌹
        </div>
        <div className="absolute top-4 right-4 text-rose-300/30 text-2xl select-none pointer-events-none">
          🌹
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <p className="font-serif-luxury italic text-rose-200 text-lg tracking-wider">
            {config.finalTitle}
          </p>
        </div>

        {/* Center Interactive Content */}
        <div className="my-auto py-6 relative z-10 w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              /* Pulsing 3D Heart before tap */
              <motion.div
                key="hidden-heart"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleTapHeart}
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  {/* Glowing halo */}
                  <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-xl animate-pulse" />

                  {/* 3D Heart Button */}
                  <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-400 via-rose-500 to-rose-700 rounded-3xl rotate-45 flex items-center justify-center shadow-[0_10px_30px_rgba(244,63,94,0.6)] group-hover:scale-110 active:scale-95 transition-transform duration-300">
                    <Heart className="w-12 h-12 text-white fill-white -rotate-45 drop-shadow-md" />
                  </div>
                </div>

                <p className="mt-8 font-serif-luxury italic text-rose-200 text-base sm:text-lg group-hover:text-white transition-colors">
                  tap it — go on 💕
                </p>
              </motion.div>
            ) : (
              /* Revealed Love Message Card */
              <motion.div
                key="revealed-message"
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center text-center"
              >
                {/* Heart icon header */}
                <div className="text-4xl mb-3 animate-bounce">
                  💖
                </div>

                {/* Subtitle / Big Greeting */}
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-rose-100 font-semibold mb-3">
                  Happy Birthday, my love
                </h3>

                {/* Main Message */}
                <p className="font-serif-luxury text-lg sm:text-xl text-rose-200/90 leading-relaxed max-w-sm whitespace-pre-line tracking-wide mb-6">
                  {config.finalMessage}
                </p>

                {/* Cute Ribbon Bow */}
                <div className="text-3xl mb-4 select-none drop-shadow-md">
                  🎀
                </div>

                {/* Signoff */}
                <p className="font-handwriting text-3xl sm:text-4xl text-rose-300 font-medium">
                  {config.finalSignoff}
                </p>

                {/* Action buttons */}
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onReplay}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-rose-200 tracking-wider uppercase transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay from Start</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenShare}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold tracking-wider uppercase transition shadow-md cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share / Send</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-4 border-t border-rose-900/60 w-full flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest text-rose-400/80">
          <span>MADE WITH ALL MY LOVE</span>
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
        </div>
      </motion.div>
    </section>
  );
};
