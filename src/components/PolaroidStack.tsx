import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Heart } from 'lucide-react';
import { SurpriseConfig, PolaroidItem } from '../types/surprise';
import { soundManager } from '../utils/audio';

interface PolaroidStackProps {
  config: SurpriseConfig;
}

export const PolaroidStack: React.FC<PolaroidStackProps> = ({ config }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const polaroids = config.polaroids;

  const handleNext = () => {
    soundManager.playPaperRustle();
    setCurrentIndex((prev) => (prev + 1) % polaroids.length);
  };

  const handlePrev = () => {
    soundManager.playPaperRustle();
    setCurrentIndex((prev) => (prev - 1 + polaroids.length) % polaroids.length);
  };

  const currentItem = polaroids[currentIndex];

  return (
    <section className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floral decorative corner */}
      <div className="absolute top-8 right-1/4 select-none opacity-40 text-4xl pointer-events-none hidden sm:block">
        🌸
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="font-script text-2xl sm:text-3xl text-[#9f1239]">
          {config.polaroidTitle === 'a pocketful of memories' ? 'my whole world' : (config.polaroidTitle || 'my whole world')}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.polaroidSubtitle === 'Moments With You' ? '💗💗💗' : (config.polaroidSubtitle || '💗💗💗')}
        </h2>
      </motion.div>

      {/* Polaroid Deck Stack */}
      <div className="relative w-72 sm:w-80 h-96 sm:h-[420px] flex items-center justify-center select-none">
        {/* Background polaroids peeking through to give depth */}
        {polaroids.map((item, idx) => {
          if (idx === currentIndex) return null;
          // Determine relative offset
          const diff = (idx - currentIndex + polaroids.length) % polaroids.length;
          if (diff > 3) return null; // show only up to 3 cards behind

          const rot = (item.rotation || 0) * (diff % 2 === 0 ? 1.5 : -1.5);
          const scale = 1 - diff * 0.05;
          const translateY = diff * 7;

          return (
            <div
              key={item.id}
              style={{
                transform: `translateY(${translateY}px) scale(${scale}) rotate(${rot}deg)`,
                zIndex: 10 - diff,
              }}
              className="absolute inset-0 bg-white p-3.5 pb-8 rounded-2xl shadow-md border border-stone-150 transition-all duration-300 opacity-80 pointer-events-none"
            >
              <div className="w-full h-64 sm:h-72 rounded-xl bg-stone-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>
            </div>
          );
        })}

        {/* Top active draggable / swipable card */}
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ scale: 0.92, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: currentItem.rotation || -2 }}
              exit={{
                x: 260,
                rotate: 18,
                opacity: 0,
                transition: { duration: 0.35, ease: 'easeIn' },
              }}
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 70 || info.offset.x < -70) {
                  handleNext();
                }
              }}
              onClick={handleNext}
              className="absolute inset-0 z-20 bg-white p-3.5 pb-9 rounded-2xl polaroid-shadow border border-rose-150/60 cursor-grab active:cursor-grabbing hover:shadow-2xl transition-shadow"
            >
              {/* Cute Washi tape at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/60 backdrop-blur-xs border-y border-rose-300/40 rotate-[1deg] shadow-xs select-none pointer-events-none" />

              {/* Photo */}
              <div className="w-full h-64 sm:h-72 rounded-xl bg-rose-50 overflow-hidden relative">
                <img
                  src={currentItem.url}
                  alt={currentItem.caption}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {currentIndex + 1} / {polaroids.length}
                </div>
              </div>

              {/* Caption */}
              <div className="mt-4 px-1 text-center">
                <p className="font-handwriting text-2xl sm:text-[26px] text-stone-800 tracking-wide font-medium leading-tight">
                  {currentItem.caption}
                </p>
                {currentItem.date && (
                  <p className="text-[11px] text-rose-400 font-sans tracking-widest uppercase mt-1">
                    {currentItem.date}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation controls & hints */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {polaroids.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundManager.playPaperRustle();
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-rose-500'
                  : 'w-2 bg-rose-200 hover:bg-rose-300'
              }`}
            />
          ))}
        </div>

        {/* Buttons / Tip */}
        <div className="flex items-center gap-4 text-xs text-stone-500 font-sans mt-1">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-white border border-rose-150 hover:bg-rose-50 transition text-stone-600 cursor-pointer"
            title="Previous photo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-serif-luxury italic text-stone-500 text-sm">
            Toss the photo aside to see the next one 💫
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-full bg-white border border-rose-150 hover:bg-rose-50 transition text-stone-600 cursor-pointer"
            title="Next photo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
