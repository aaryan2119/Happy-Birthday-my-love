import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Pin } from 'lucide-react';
import { SurpriseConfig, ReasonItem } from '../types/surprise';
import { soundManager } from '../utils/audio';

interface ReasonsWallProps {
  config: SurpriseConfig;
}

export const ReasonsWall: React.FC<ReasonsWallProps> = ({ config }) => {
  const [selectedReason, setSelectedReason] = useState<ReasonItem | null>(null);

  const colorStyles: Record<string, { bg: string; border: string; text: string; pin: string }> = {
    yellow: {
      bg: 'bg-[#fffbeb]',
      border: 'border-amber-200',
      text: 'text-amber-950',
      pin: 'text-amber-500',
    },
    pink: {
      bg: 'bg-[#fff1f2]',
      border: 'border-rose-200',
      text: 'text-rose-950',
      pin: 'text-rose-500',
    },
    rose: {
      bg: 'bg-[#ffe4e6]',
      border: 'border-pink-200',
      text: 'text-rose-900',
      pin: 'text-red-500',
    },
    cream: {
      bg: 'bg-[#fefce8]',
      border: 'border-stone-200',
      text: 'text-stone-850',
      pin: 'text-amber-600',
    },
    mint: {
      bg: 'bg-[#f0fdf4]',
      border: 'border-emerald-200',
      text: 'text-emerald-950',
      pin: 'text-emerald-500',
    },
    lavender: {
      bg: 'bg-[#faf5ff]',
      border: 'border-purple-200',
      text: 'text-purple-950',
      pin: 'text-purple-500',
    },
  };

  const handleCardClick = (reason: ReasonItem) => {
    soundManager.playPaperRustle();
    setSelectedReason(reason);
  };

  return (
    <section className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="font-script text-2xl sm:text-3xl text-rose-500">
          {config.reasonsTitle}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.reasonsSubtitle}
        </h2>
      </motion.div>

      {/* Sticky Notes Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 px-2">
        {config.reasons.map((reason, idx) => {
          const style = colorStyles[reason.color] || colorStyles.yellow;
          const rotation = reason.rotation || (idx % 2 === 0 ? -2 : 2.5);

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(reason)}
              style={{ transform: `rotate(${rotation}deg)` }}
              className={`relative ${style.bg} ${style.border} border rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group`}
            >
              {/* Push Pin on Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80 shadow-md border border-white" />
              </div>

              {/* Note Header / Number */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <span className="font-mono text-xs font-semibold tracking-wider text-rose-500/90">
                  {reason.number}
                </span>
                <Heart className="w-3 h-3 text-rose-400 group-hover:scale-125 transition-transform" />
              </div>

              {/* Note Text */}
              <div className="my-auto py-2">
                <p className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-snug">
                  {reason.text}
                </p>
              </div>

              {/* Subtle sticker or dot in corner */}
              <div className="text-[10px] text-stone-400 text-right font-sans">
                tap to view
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Subtitle / Footer of Wall */}
      <div className="mt-12 text-center">
        <p className="font-serif-luxury italic text-base sm:text-lg text-stone-500 tracking-wide">
          ...and about a million more I'm saving for later 💕
        </p>
      </div>

      {/* Detail Pop-up Modal when a sticky note is clicked */}
      <AnimatePresence>
        {selectedReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl border border-rose-100 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-rose-500 font-bold mb-2">
                Reason {selectedReason.number}
              </span>
              <p className="font-handwriting text-3xl text-stone-900 my-4 leading-relaxed">
                "{selectedReason.text}"
              </p>
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="mt-4 px-6 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
