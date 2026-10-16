import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Heart } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';

interface HeaderSectionProps {
  config: SurpriseConfig;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ config }) => {
  return (
    <header className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Ambient background rose glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Floating ribbon bow */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="text-5xl sm:text-6xl mb-4 select-none drop-shadow-md"
      >
        🎀
      </motion.div>

      {/* Tagline */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xs uppercase tracking-[0.25em] text-[#9f1239] font-bold mb-3 font-sans"
      >
        The Best Day of the Year
      </motion.span>

      {/* Main Happy Birthday Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
        className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury text-stone-900 tracking-wide font-normal max-w-2xl leading-tight"
      >
        <span>{config.headline}</span>
        <br />
        <span className="font-serif-luxury italic font-semibold text-[#881337] inline-flex items-center gap-2">
          <span>{config.recipientName}</span>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 fill-amber-400 inline animate-pulse" />
        </span>
      </motion.h1>

      {/* Emotional Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-5 text-base sm:text-xl text-stone-600 max-w-md font-serif-luxury italic leading-relaxed"
      >
        "{config.subheadline}"
      </motion.p>

      {/* Scroll indicator prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex flex-col items-center gap-1.5 text-xs text-rose-400 font-sans tracking-widest uppercase"
      >
        <span>your surprises await</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-rose-400" />
        </motion.div>
      </motion.div>
    </header>
  );
};
