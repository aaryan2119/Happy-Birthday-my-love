import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, BookOpen, Heart } from 'lucide-react';
import { SurpriseConfig, DiaryPage } from '../types/surprise';
import { soundManager } from '../utils/audio';

interface DiaryAlbumProps {
  config: SurpriseConfig;
}

export const DiaryAlbum: React.FC<DiaryAlbumProps> = ({ config }) => {
  // Page 0 is the Cover, Pages 1..6 are the 6 diary pages
  const [pageIndex, setPageIndex] = useState<number>(0);
  const totalPages = config.diaryPages.length + 1; // 1 cover + 6 pages

  const handleNext = () => {
    if (pageIndex < totalPages - 1) {
      soundManager.playPaperRustle();
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      soundManager.playPaperRustle();
      setPageIndex((prev) => prev - 1);
    }
  };

  const currentPageData: DiaryPage | undefined =
    pageIndex > 0 ? config.diaryPages[pageIndex - 1] : undefined;

  return (
    <section className="py-16 sm:py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Rose */}
      <div className="absolute top-10 left-1/4 select-none opacity-40 text-4xl pointer-events-none hidden sm:block">
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
        <p className="font-script text-2xl sm:text-3xl text-[#9f1239]">
          {config.albumSubtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury text-stone-900 tracking-wide font-normal mt-1">
          {config.albumTitle === 'Our Little Album' ? 'Album of love' : (config.albumTitle || 'Album of love')}
        </h2>
      </motion.div>

      {/* Book Container with 3D feel */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-[460px] sm:h-[490px] mx-auto select-none perspective-[1000px]">
        {/* Book spine & layered pages effect on right */}
        <div className="absolute inset-y-2 -right-3 w-5 bg-gradient-to-r from-stone-200 to-stone-100 rounded-r-xl shadow-lg border-r border-stone-300 pointer-events-none" />
        <div className="absolute inset-y-1 -right-1.5 w-4 bg-stone-100 rounded-r-lg shadow-sm border-r border-stone-200 pointer-events-none" />

        <AnimatePresence mode="wait">
          {pageIndex === 0 ? (
            /* Book Cover */
            <motion.div
              key="cover"
              initial={{ rotateY: -15, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{
                rotateY: -90,
                transformOrigin: 'left center',
                opacity: 0,
                transition: { duration: 0.45 },
              }}
              onClick={handleNext}
              className="absolute inset-0 bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#be123c] text-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl border-4 border-rose-900/60 cursor-pointer group"
            >
              {/* Gold foil embossed border */}
              <div className="absolute inset-3 border border-amber-300/40 rounded-xl pointer-events-none flex flex-col items-center justify-between p-4">
                <div className="flex justify-between w-full text-amber-200/50 text-xs">
                  <span>✦</span>
                  <span>✦</span>
                </div>
                <div className="flex justify-between w-full text-amber-200/50 text-xs">
                  <span>✦</span>
                  <span>✦</span>
                </div>
              </div>

              {/* Cover Top Rose Icon */}
              <div className="relative z-10 pt-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl drop-shadow-md mb-2">
                  <Heart className="w-6 h-6 fill-rose-300 text-rose-300" />
                </div>
                <span className="text-[11px] font-sans tracking-widest uppercase text-rose-200/80">
                  our journey in six chapters
                </span>
              </div>

              {/* Cover Title */}
              <div className="relative z-10 text-center px-2">
                <h3 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-amber-100 tracking-wider">
                  {config.albumTitle === 'Our Little Album' ? 'Album of love' : (config.albumTitle || 'Album of love')}
                </h3>
                <p className="font-script text-2xl text-rose-200 mt-2">
                  {config.senderName} & {config.recipientName}
                </p>
              </div>

              {/* Cover Bottom Prompt */}
              <div className="relative z-10 pb-2 flex flex-col items-center text-center">
                <span className="text-xs uppercase tracking-widest text-amber-200 font-sans font-semibold group-hover:scale-105 transition-transform flex items-center gap-1.5 bg-black/20 px-4 py-1.5 rounded-full border border-amber-300/30">
                  <span>Open Album</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ) : (
            /* Diary Pages 1 through 6 */
            currentPageData && (
              <motion.div
                key={`page-${pageIndex}`}
                initial={{ rotateY: 30, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{
                  rotateY: -90,
                  transformOrigin: 'left center',
                  opacity: 0,
                  transition: { duration: 0.4 },
                }}
                className="absolute inset-0 bg-[#fffdfa] text-stone-900 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl border border-stone-200"
              >
                {/* Book header page numbering */}
                <div className="flex items-center justify-between pb-2 border-b border-rose-100/80">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-500 font-medium">
                    {currentPageData.chapter}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {pageIndex} / {config.diaryPages.length}
                  </span>
                </div>

                {/* Page Photo */}
                <div className="relative my-2 w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-rose-50 shadow-inner border border-stone-200/60">
                  <img
                    src={currentPageData.photoUrl}
                    alt={currentPageData.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Title and Handwritten Caption */}
                <div className="flex-1 flex flex-col justify-center px-1 text-center">
                  <h4 className="font-serif-luxury text-lg sm:text-xl font-semibold text-stone-900 mb-1">
                    {currentPageData.title}
                  </h4>
                  <p className="font-handwriting text-xl sm:text-2xl text-rose-900 leading-snug">
                    "{currentPageData.caption}"
                  </p>
                </div>

                {/* Page Footer Navigation bar */}
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition cursor-pointer px-2 py-1 rounded"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  </div>

                  {pageIndex < totalPages - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium transition cursor-pointer px-2 py-1 rounded"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPageIndex(0)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Back to Cover
                    </button>
                  )}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Hint */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundManager.playPaperRustle();
                setPageIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === pageIndex
                  ? 'w-6 bg-rose-600'
                  : 'w-2 bg-rose-200 hover:bg-rose-300'
              }`}
              title={idx === 0 ? 'Cover' : `Page ${idx}`}
            />
          ))}
        </div>

        <p className="font-serif-luxury italic text-sm text-stone-500">
          drag the page corners, just like a real book 📖
        </p>
      </div>
    </section>
  );
};
