import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, Heart, Stars } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';
import { soundManager } from '../utils/audio';
import { fireCandleCelebration } from '../utils/confetti';

interface ConstellationSectionProps {
  config: SurpriseConfig;
}

interface StarPoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

// 8 Points precisely mapping a celestial heart
const HEART_STARS: StarPoint[] = [
  { id: 0, x: 200, y: 115, label: 'Center Core' },
  { id: 1, x: 135, y: 65, label: 'Love' },
  { id: 2, x: 70, y: 120, label: 'Laughter' },
  { id: 3, x: 105, y: 210, label: 'Kindness' },
  { id: 4, x: 200, y: 310, label: 'Forever' },
  { id: 5, x: 295, y: 210, label: 'Grace' },
  { id: 6, x: 330, y: 120, label: 'Sunshine' },
  { id: 7, x: 265, y: 65, label: 'Magic' },
];

export const ConstellationSection: React.FC<ConstellationSectionProps> = ({ config }) => {
  // Activated stars index (0 to 8)
  const [activeStarCount, setActiveStarCount] = useState<number>(0);
  const isHeartCompleted = activeStarCount >= HEART_STARS.length;

  const handleStarClick = (starIndex: number) => {
    if (starIndex >= activeStarCount) {
      soundManager.playKeypadTap(starIndex + 2);
      const nextCount = starIndex + 1;
      setActiveStarCount(nextCount);

      if (nextCount === HEART_STARS.length) {
        soundManager.playUnlockChime();
        fireCandleCelebration();
      }
    }
  };

  const handleConnectNext = () => {
    if (activeStarCount < HEART_STARS.length) {
      handleStarClick(activeStarCount);
    }
  };

  const handleReset = () => {
    setActiveStarCount(0);
  };

  // Build connecting SVG polyline path based on active stars
  const connectedPoints = HEART_STARS.slice(0, activeStarCount);
  let pathD = '';
  if (connectedPoints.length > 0) {
    pathD = `M ${connectedPoints[0].x} ${connectedPoints[0].y}`;
    for (let i = 1; i < connectedPoints.length; i++) {
      pathD += ` L ${connectedPoints[i].x} ${connectedPoints[i].y}`;
    }
    // If complete, close back to start
    if (isHeartCompleted) {
      pathD += ` L ${HEART_STARS[0].x} ${HEART_STARS[0].y} Z`;
    }
  }

  return (
    <section className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Deep Burgundy & Rose Cosmic Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-900/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 relative z-10"
      >
        <p className="font-script text-2xl sm:text-3xl text-rose-400">
          {config.constellationTitle || 'First things first...'}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.constellationSubtitle || 'A Constellation of Us ✨'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 font-sans">
          {config.constellationWish ||
            'Tap each star to trace our heart constellation and make your birthday wish 💫'}
        </p>
      </motion.div>

      {/* Interactive Constellation Sky Box */}
      <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-[36px] bg-gradient-to-b from-[#2a0410] via-[#1f030c] to-[#120106] p-4 sm:p-6 shadow-[0_25px_60px_rgba(76,5,25,0.35)] border-2 border-rose-900/50 flex flex-col items-center justify-center select-none overflow-hidden">
        {/* Deep Rose Starlight Nebula backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(190,18,60,0.22),transparent_70%)] pointer-events-none" />

        {/* Ambient Tiny Background Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                top: `${(i * 19) % 95}%`,
                left: `${(i * 31) % 95}%`,
                animationDelay: `${(i % 5) * 0.7}s`,
              }}
              className="absolute w-1 h-1 bg-white/70 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* SVG Constellation Heart Canvas */}
        <svg
          viewBox="0 0 400 360"
          className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]"
        >
          {/* Faint Guide Silhouette of the Heart */}
          <path
            d="M 200 115 L 135 65 L 70 120 L 105 210 L 200 310 L 295 210 L 330 120 L 265 65 Z"
            fill="none"
            stroke="rgba(244, 63, 94, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Connected Glowing Starlight Path */}
          {pathD && (
            <motion.path
              d={pathD}
              fill={isHeartCompleted ? 'rgba(225, 29, 72, 0.18)' : 'none'}
              stroke="url(#heartGlowGrad)"
              strokeWidth={isHeartCompleted ? '3.5' : '2.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={isHeartCompleted ? 'animate-pulse' : ''}
            />
          )}

          {/* Gradients for Starlight Glow */}
          <defs>
            <linearGradient id="heartGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <radialGradient id="starHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Interactive Star Nodes */}
          {HEART_STARS.map((star, idx) => {
            const isLit = idx < activeStarCount;
            const isNext = idx === activeStarCount;

            return (
              <g
                key={star.id}
                onClick={() => handleStarClick(idx)}
                className="cursor-pointer group"
              >
                {/* Outer Pulsing Halo when active or next */}
                {(isLit || isNext) && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={isLit ? 18 : 14}
                    fill="url(#starHalo)"
                    className={isNext ? 'animate-ping opacity-60' : 'animate-pulse opacity-80'}
                  />
                )}

                {/* Star Core */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={isLit ? 7 : 5}
                  fill={isLit ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  stroke={isLit ? '#f59e0b' : 'rgba(244, 63, 94, 0.5)'}
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Star Sparkle Cross */}
                {isLit && (
                  <path
                    d={`M ${star.x - 11} ${star.y} L ${star.x + 11} ${star.y} M ${star.x} ${star.y - 11} L ${star.x} ${star.y + 11}`}
                    stroke="#fde047"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-90 animate-spin-slow origin-center"
                    style={{ transformOrigin: `${star.x}px ${star.y}px` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Glowing Heart Icon when finished */}
        <AnimatePresence>
          {isHeartCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.25, 1], opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
            >
              <div className="w-20 h-20 rounded-full bg-rose-500/20 backdrop-blur-xs flex items-center justify-center border border-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.6)]">
                <Heart className="w-10 h-10 fill-rose-400 text-rose-300 drop-shadow-lg animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress & Controls */}
      <div className="mt-8 relative z-10">
        <AnimatePresence mode="wait">
          {!isHeartCompleted ? (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <button
                type="button"
                onClick={handleConnectNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white text-xs font-semibold tracking-wider uppercase shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Stars className="w-4 h-4 text-amber-300" />
                <span>Light Next Star ({activeStarCount}/{HEART_STARS.length})</span>
              </button>

              <p className="text-xs text-stone-500 font-serif-luxury italic">
                Tap each star or click above to trace our constellation
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="wish-fulfilled"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md border border-rose-200 p-6 rounded-3xl shadow-xl max-w-sm mx-auto"
            >
              <div className="flex items-center gap-2 text-rose-900 font-serif-luxury text-2xl font-semibold">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Wish Made in the Stars! ✨</span>
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif-luxury italic">
                "In a universe of billions of stars, every star aligned the day you were born, {config.recipientName}. May all your dreams come true! 💕"
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Trace the Stars Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
