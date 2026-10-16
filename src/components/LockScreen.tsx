import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Delete, Sparkles, Key, Lock, Unlock } from 'lucide-react';
import { SurpriseConfig } from '../types/surprise';
import { soundManager } from '../utils/audio';
import { ASSETS } from '../assets';

interface LockScreenProps {
  config: SurpriseConfig;
  onUnlocked: () => void;
  onStartAudio?: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ config, onUnlocked, onStartAudio }) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [lockStyle, setLockStyle] = useState<'cloudy-padlock' | 'photo-polaroid'>(
    config.lockScreenStyle || 'cloudy-padlock'
  );

  const handleDigitPress = (digit: string) => {
    if (isSuccess || pinInput.length >= 4) return;

    soundManager.playKeypadTap(parseInt(digit, 10));
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setIsError(false);

    if (nextPin.length === 4) {
      if (nextPin === config.pin) {
        setIsSuccess(true);
        soundManager.playUnlockChime();
        if (onStartAudio) {
          onStartAudio();
        }
        setTimeout(() => {
          onUnlocked();
        }, 600);
      } else {
        setIsError(true);
        setTimeout(() => {
          setPinInput('');
          setIsError(false);
        }, 700);
      }
    }
  };

  const handleDelete = () => {
    if (pinInput.length > 0) {
      soundManager.playKeypadTap(1);
      setPinInput((prev) => prev.slice(0, -1));
      setIsError(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-700 ${
      lockStyle === 'photo-polaroid' ? 'bg-[#4c0519]' : 'bg-[#fff0f3]'
    }`}>
      {/* Background Ambience */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
        lockStyle === 'photo-polaroid'
          ? 'bg-gradient-to-br from-[#700d2b] via-[#4c0519] to-[#25020c] opacity-95'
          : 'bg-gradient-to-br from-[#ffeef2] via-[#ffe4e9] to-[#fae8ff] opacity-80'
      }`} />

      {/* Lock Screen Style Switcher Toggle */}
      <div className="relative z-30 mb-4 bg-white/70 backdrop-blur-md p-1 rounded-full border border-rose-200/80 shadow-xs flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setLockStyle('cloudy-padlock')}
          className={`px-3 py-1 rounded-full transition cursor-pointer font-medium ${
            lockStyle === 'cloudy-padlock'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 hover:text-rose-600'
          }`}
        >
          ☁️ Cloudy Padlock (Video 1)
        </button>
        <button
          type="button"
          onClick={() => setLockStyle('photo-polaroid')}
          className={`px-3 py-1 rounded-full transition cursor-pointer font-medium ${
            lockStyle === 'photo-polaroid'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 hover:text-rose-600'
          }`}
        >
          🧸 Polaroid & Teddy (Video 2)
        </button>
      </div>

      {/* STYLE 1: EXACT VIDEO 1 "CLOUDY MOON & HEART PADLOCK" CARD */}
      {lockStyle === 'cloudy-padlock' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] h-[640px] rounded-[38px] shadow-[0_25px_70px_rgba(244,63,94,0.22)] border-[5px] border-white overflow-hidden flex flex-col justify-between p-6 select-none bg-cover bg-center"
          style={{ backgroundImage: `url(${ASSETS.cloudyMoonBg})` }}
        >
          {/* Subtle frosted glass overlay for high readability */}
          <div className="absolute inset-0 bg-white/15 backdrop-blur-[2px] pointer-events-none" />

          {/* Top Heart Padlock & Antique Key */}
          <div className="relative z-10 pt-6 flex flex-col items-center">
            {/* Heart Padlock */}
            <motion.div
              animate={
                isSuccess
                  ? { scale: [1, 1.25, 1.1], rotate: [0, -10, 10, 0] }
                  : isError
                  ? { x: [-6, 6, -4, 4, 0] }
                  : { y: [0, -3, 0] }
              }
              transition={
                isSuccess
                  ? { duration: 0.5 }
                  : isError
                  ? { duration: 0.4 }
                  : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
              }
              className="relative cursor-pointer"
            >
              {/* Padlock Shackle */}
              <div className="w-12 h-10 border-4 border-[#e18b99] rounded-t-full mx-auto -mb-2 transition-transform duration-300 relative z-0">
                {isSuccess && (
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -7, rotate: -25 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full"
                  />
                )}
              </div>

              {/* Heart Lock Body */}
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#fca5a5] via-[#f43f5e] to-[#be123c] rounded-2xl rotate-45 shadow-[0_8px_25px_rgba(244,63,94,0.45)] border-2 border-white/60 flex items-center justify-center">
                {/* Keyhole */}
                <div className="-rotate-45 flex flex-col items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-[#4c0519] rounded-full shadow-inner" />
                  <div className="w-2 h-3 bg-[#4c0519] -mt-0.5 rounded-b-sm shadow-inner" />
                </div>
              </div>

              {/* Little Antique Key on Ribbon */}
              <motion.div
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="absolute -bottom-3 -right-3 text-2xl select-none drop-shadow-md z-20"
              >
                🗝️
              </motion.div>
            </motion.div>

            {/* Label */}
            <p className="mt-6 text-xs uppercase tracking-widest text-rose-800 font-semibold font-sans drop-shadow-xs">
              {config.lockTagline}
            </p>
            <p className="text-[11px] text-stone-600 mt-0.5 font-sans">
              {config.pinHint}
            </p>

            {/* 4 PIN Dots */}
            <motion.div
              animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3.5 mt-4"
            >
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border ${
                      isSuccess
                        ? 'bg-rose-600 border-rose-600 scale-125 shadow-[0_0_10px_rgba(244,63,94,0.9)]'
                        : isError
                        ? 'bg-red-500 border-red-500 scale-95'
                        : isFilled
                        ? 'bg-rose-500 border-rose-500 scale-110 shadow-xs'
                        : 'bg-white/60 border-rose-200'
                    }`}
                  />
                );
              })}
            </motion.div>
          </div>

          {/* Frosted Glass Keypad */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3 px-2 pb-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/70 hover:bg-white/90 active:bg-rose-100/90 backdrop-blur-md border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-xl font-normal text-stone-800 transition active:scale-95 cursor-pointer select-none"
              >
                {digit}
              </button>
            ))}

            {/* Heart symbol button */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 fill-rose-300 text-rose-400" />
            </div>

            {/* 0 */}
            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/70 hover:bg-white/90 active:bg-rose-100/90 backdrop-blur-md border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center text-xl font-normal text-stone-800 transition active:scale-95 cursor-pointer select-none"
            >
              0
            </button>

            {/* Delete button */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/50 hover:bg-white/75 active:bg-rose-100/80 backdrop-blur-md border border-white/60 flex items-center justify-center text-rose-500 transition active:scale-95 cursor-pointer select-none"
              title="Delete"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Small Corner Flower Accents matching Video 1 */}
          <div className="absolute bottom-2 left-3 select-none pointer-events-none opacity-85 text-xl">
            🌸
          </div>
          <div className="absolute bottom-2 right-3 select-none pointer-events-none opacity-85 text-xl">
            🌺
          </div>
        </motion.div>
      ) : (
        /* STYLE 2: VIDEO 2 "FRAMED POLAROID PHOTO & TEDDY BEAR" */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-rose-100/80 rounded-3xl shadow-[0_20px_60px_-15px_rgba(244,63,94,0.18)] p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          {/* Left Side: Girlfriend's framed polaroid with ribbon bow & teddy bear badge */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {/* Ribbon Bow on top */}
              <motion.div
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 drop-shadow-md select-none text-4xl"
              >
                🎀
              </motion.div>

              {/* Polaroid frame */}
              <div className="relative bg-white p-3.5 pb-9 rounded-2xl shadow-xl border border-rose-100 rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
                <div className="w-52 h-64 sm:w-60 sm:h-72 overflow-hidden rounded-xl bg-rose-50 relative">
                  <img
                    src={config.lockPhotoUrl}
                    alt={config.recipientName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Polaroid signature label */}
                <div className="mt-3 text-center">
                  <p className="font-handwriting text-2xl text-rose-900 tracking-wider">
                    {config.recipientName}
                  </p>
                </div>

                {/* Cute Teddy bear sticker in bottom left corner */}
                <div className="absolute -bottom-4 -left-4 text-3xl select-none drop-shadow-md">
                  🧸
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl select-none drop-shadow-sm">
                  ✨
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-rose-500/80 tracking-wide uppercase">
              <span>made with all my love for {config.recipientName}</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline animate-pulse" />
            </div>
          </div>

          {/* Right Side: Lock keypad and passcode */}
          <div className="w-full max-w-sm flex flex-col items-center">
            <div className="text-center mb-5">
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-1 block">
                {config.lockTagline}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury text-rose-950 font-medium">
                Enter our secret code
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
                {config.pinHint}
              </p>
            </div>

            {/* 4 Pin Indicator Dots */}
            <motion.div
              animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 mb-6"
            >
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pinInput.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                      isSuccess
                        ? 'bg-rose-500 border-rose-500 scale-110 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                        : isError
                        ? 'bg-red-400 border-red-500 scale-95'
                        : isFilled
                        ? 'bg-rose-400 border-rose-400 scale-105 shadow-sm'
                        : 'bg-rose-100/60 border-rose-200'
                    }`}
                  />
                );
              })}
            </motion.div>

            {/* Keypad Buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full max-w-[270px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitPress(digit)}
                  className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white/80 hover:bg-rose-50 active:bg-rose-100 border border-rose-100 shadow-sm flex items-center justify-center text-xl sm:text-2xl font-light text-rose-950 transition-all active:scale-95 hover:shadow-md cursor-pointer select-none"
                >
                  {digit}
                </button>
              ))}

              <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto flex items-center justify-center text-rose-300">
                <Heart className="w-5 h-5 fill-rose-200/50" />
              </div>

              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white/80 hover:bg-rose-50 active:bg-rose-100 border border-rose-100 shadow-sm flex items-center justify-center text-xl sm:text-2xl font-light text-rose-950 transition-all active:scale-95 hover:shadow-md cursor-pointer select-none"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-white/50 hover:bg-rose-100/60 active:bg-rose-200/60 border border-rose-100/60 flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all active:scale-95 cursor-pointer select-none"
                title="Delete"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
