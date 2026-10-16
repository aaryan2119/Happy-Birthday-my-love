import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MailOpen, Mail } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';
import { soundManager } from '../utils/audio';

interface SealedLetterProps {
  config: SurpriseConfig;
}

export const SealedLetter: React.FC<SealedLetterProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    soundManager.playPaperRustle();
    setIsOpen(!isOpen);
  };

  return (
    <section className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative rose */}
      <div className="absolute top-12 right-1/4 select-none opacity-40 text-4xl pointer-events-none hidden sm:block">
        🌹
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <p className="font-script text-2xl sm:text-3xl text-rose-500">
          {config.letterTitle}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.letterSubtitle}
        </h2>
      </motion.div>

      {/* Envelope & Letter Container */}
      <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Sealed Envelope */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={toggleOpen}
              className="relative w-full aspect-[16/11] max-w-sm sm:max-w-md bg-[#faeedd] rounded-2xl shadow-xl border border-[#ebd8bf] p-6 flex flex-col items-center justify-center cursor-pointer group hover:shadow-2xl transition-all"
            >
              {/* Envelope Flap triangular styling */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute -top-1 left-0 right-0 h-1/2 bg-gradient-to-b from-[#f3e2cc] to-transparent border-b border-[#dec7ab]/60 [clip-path:polygon(0_0,50%_100%,100%_0)]" />
              </div>

              {/* Heart Wax Seal in Center */}
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#be123c] via-[#9f1239] to-[#881337] shadow-[0_8px_20px_rgba(159,18,57,0.45)] border-2 border-rose-900/60 flex items-center justify-center cursor-pointer select-none"
              >
                <div className="absolute inset-1 rounded-full border border-amber-300/40 pointer-events-none" />
                <Heart className="w-8 h-8 sm:w-9 sm:h-9 fill-rose-100 text-rose-100 drop-shadow-md animate-pulse" />
              </motion.div>

              <span className="relative z-10 mt-6 font-serif-luxury italic text-sm sm:text-base text-stone-600 group-hover:text-rose-700 transition-colors">
                tap the seal to open 💌
              </span>
            </motion.div>
          ) : (
            /* Unfolded Vintage Parchment Letter */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.92 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full bg-[#fdfbf7] border border-[#ecdac3] rounded-3xl p-6 sm:p-9 shadow-2xl vintage-paper"
            >
              {/* Stamp / Floral accent in top right */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-rose-400 select-none">
                <Sparkles className="w-4 h-4" />
                <span className="text-xl">🌸</span>
              </div>

              {/* Letter Greeting */}
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-rose-950 font-semibold mb-4 border-b border-rose-100 pb-2">
                {config.letterGreeting}
              </h3>

              {/* Letter Body with handwritten styling */}
              <div className="font-serif-luxury text-lg sm:text-xl text-stone-700 leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide">
                {config.letterBody}
              </div>

              {/* Letter Signoff */}
              <div className="mt-8 pt-4 border-t border-rose-100 flex flex-col items-end">
                <p className="font-handwriting text-2xl sm:text-3xl text-rose-900 whitespace-pre-line text-right">
                  {config.letterSignoff}
                </p>
              </div>

              {/* Re-fold Button */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={toggleOpen}
                  className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Fold back into envelope</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
