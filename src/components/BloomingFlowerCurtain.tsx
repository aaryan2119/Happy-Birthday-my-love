import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fireBloomingExplosion, fireFlowerPetals } from '../utils/confetti';
import { ASSETS } from '../assets';

interface BloomingFlowerCurtainProps {
  onComplete: () => void;
}

interface FlowerNode {
  id: number;
  type: 'peony' | 'hydrangea' | 'rose';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // pixel width
  rotation: number;
  delay: number; // stagger in seconds
  zIndex: number;
  swayDuration: number;
}

// Organic botanical blossom cluster positions
const FLOWER_NODES: FlowerNode[] = [
  // Tier 1: Outer Corners & Edges (sprout first 0.04s - 0.25s)
  { id: 1, type: 'peony', x: -4, y: -4, size: 230, rotation: 15, delay: 0.05, zIndex: 12, swayDuration: 3.2 },
  { id: 2, type: 'rose', x: 82, y: -6, size: 220, rotation: -20, delay: 0.08, zIndex: 12, swayDuration: 3.8 },
  { id: 3, type: 'hydrangea', x: -6, y: 78, size: 240, rotation: 25, delay: 0.12, zIndex: 12, swayDuration: 3.5 },
  { id: 4, type: 'peony', x: 78, y: 76, size: 250, rotation: -12, delay: 0.16, zIndex: 12, swayDuration: 4.0 },

  // Tier 2: Perimeter Walls (0.2s - 0.45s)
  { id: 5, type: 'hydrangea', x: 38, y: -8, size: 215, rotation: 8, delay: 0.22, zIndex: 14, swayDuration: 3.6 },
  { id: 6, type: 'peony', x: -8, y: 36, size: 225, rotation: -14, delay: 0.26, zIndex: 14, swayDuration: 3.4 },
  { id: 7, type: 'rose', x: 86, y: 35, size: 210, rotation: 18, delay: 0.3, zIndex: 14, swayDuration: 3.9 },
  { id: 8, type: 'rose', x: 42, y: 82, size: 225, rotation: -10, delay: 0.35, zIndex: 14, swayDuration: 3.7 },

  // Tier 3: Intermediate Ring (0.4s - 0.65s)
  { id: 9, type: 'rose', x: 14, y: 14, size: 200, rotation: -15, delay: 0.42, zIndex: 16, swayDuration: 3.3 },
  { id: 10, type: 'peony', x: 64, y: 12, size: 210, rotation: 12, delay: 0.48, zIndex: 16, swayDuration: 3.6 },
  { id: 11, type: 'hydrangea', x: 12, y: 56, size: 220, rotation: 20, delay: 0.52, zIndex: 16, swayDuration: 4.1 },
  { id: 12, type: 'rose', x: 66, y: 54, size: 215, rotation: -16, delay: 0.58, zIndex: 16, swayDuration: 3.5 },

  // Tier 4: Center Core (0.6s - 0.9s, completing lush coverage)
  { id: 13, type: 'peony', x: 38, y: 24, size: 240, rotation: -6, delay: 0.65, zIndex: 18, swayDuration: 3.4 },
  { id: 14, type: 'hydrangea', x: 26, y: 38, size: 225, rotation: 14, delay: 0.72, zIndex: 19, swayDuration: 3.8 },
  { id: 15, type: 'peony', x: 54, y: 38, size: 235, rotation: -12, delay: 0.8, zIndex: 20, swayDuration: 3.6 },
  { id: 16, type: 'rose', x: 40, y: 52, size: 230, rotation: 10, delay: 0.88, zIndex: 21, swayDuration: 3.7 },

  // Tier 5: Depth fillers for seamless botanical density
  { id: 17, type: 'hydrangea', x: 8, y: -2, size: 175, rotation: 32, delay: 0.32, zIndex: 10, swayDuration: 4.2 },
  { id: 18, type: 'rose', x: 72, y: 2, size: 180, rotation: -28, delay: 0.36, zIndex: 10, swayDuration: 3.9 },
  { id: 19, type: 'peony', x: 84, y: 62, size: 185, rotation: 15, delay: 0.44, zIndex: 11, swayDuration: 3.5 },
  { id: 20, type: 'hydrangea', x: 2, y: 70, size: 180, rotation: -18, delay: 0.5, zIndex: 11, swayDuration: 3.8 },
  { id: 21, type: 'rose', x: 26, y: 72, size: 190, rotation: 6, delay: 0.62, zIndex: 15, swayDuration: 3.4 },
  { id: 22, type: 'peony', x: 52, y: 70, size: 195, rotation: -14, delay: 0.7, zIndex: 15, swayDuration: 3.7 },
];

export const BloomingFlowerCurtain: React.FC<BloomingFlowerCurtainProps> = ({ onComplete }) => {
  const [curtainsParting, setCurtainsParting] = useState<boolean>(false);

  useEffect(() => {
    // Fire festive flower petal confetti
    fireBloomingExplosion();
    fireFlowerPetals();

    // After flowers have fully blossomed and swayed, part curtains
    const partTimer = setTimeout(() => {
      setCurtainsParting(true);
    }, 2200);

    const doneTimer = setTimeout(() => {
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(partTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const getFlowerImage = (type: FlowerNode['type']) => {
    switch (type) {
      case 'peony':
        return ASSETS.whitePeony;
      case 'hydrangea':
        return ASSETS.pinkHydrangea;
      case 'rose':
        return ASSETS.blushRose;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Background Soft Blush Underlay */}
      <div className="absolute inset-0 bg-[#fde2e4]" />

      {/* TWO SPLIT BOTANICAL CURTAINS OF LIVING BLOOMING FLOWERS */}
      <div className="absolute inset-0 flex w-full h-full overflow-hidden">
        {/* Left Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={curtainsParting ? { x: '-105%' } : { x: 0 }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          className="relative w-1/2 h-full overflow-hidden shadow-[14px_0_45px_rgba(0,0,0,0.38)] z-20 bg-[#fde2e4]"
        >
          {/* Base Floral Tapestry Wallpaper */}
          <div
            className="absolute inset-0 w-[200%] h-full bg-cover bg-left opacity-95"
            style={{ backgroundImage: `url(${ASSETS.flowerWall})` }}
          />

          {/* Left Side Organic Flowers Blooming and Swaying */}
          {FLOWER_NODES.filter((f) => f.x < 55).map((f) => (
            <motion.div
              key={f.id}
              initial={{ scale: 0.05, opacity: 0, filter: 'blur(3px)' }}
              animate={{
                scale: [0.05, 1.15, 1],
                opacity: [0, 1, 1],
                filter: ['blur(3px)', 'blur(0px)', 'blur(0px)'],
              }}
              transition={{
                duration: 1.2,
                delay: f.delay,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                left: `${f.x * 2}%`,
                top: `${f.y}%`,
                width: f.size,
                height: f.size,
                zIndex: f.zIndex,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              {/* Natural Organic Sway */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotate: [f.rotation - 2.5, f.rotation + 2.5, f.rotation - 2.5],
                }}
                transition={{
                  duration: f.swayDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-full rounded-full overflow-hidden [mask-image:radial-gradient(circle_at_center,black_64%,transparent_96%)] drop-shadow-[0_10px_22px_rgba(0,0,0,0.22)]"
              >
                <img
                  src={getFlowerImage(f.type)}
                  alt="Blooming botanical flower"
                  className="w-full h-full object-contain filter contrast-[1.04]"
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Center Seam Drop Shadow */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/35 via-black/10 to-transparent pointer-events-none z-30" />
        </motion.div>

        {/* Right Curtain */}
        <motion.div
          initial={{ x: 0 }}
          animate={curtainsParting ? { x: '105%' } : { x: 0 }}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          className="relative w-1/2 h-full overflow-hidden shadow-[-14px_0_45px_rgba(0,0,0,0.38)] z-20 bg-[#fde2e4]"
        >
          {/* Base Floral Tapestry Wallpaper */}
          <div
            className="absolute inset-0 right-0 w-[200%] h-full bg-cover bg-right opacity-95"
            style={{ backgroundImage: `url(${ASSETS.flowerWall})` }}
          />

          {/* Right Side Organic Flowers Blooming and Swaying */}
          {FLOWER_NODES.filter((f) => f.x >= 45).map((f) => (
            <motion.div
              key={f.id}
              initial={{ scale: 0.05, opacity: 0, filter: 'blur(3px)' }}
              animate={{
                scale: [0.05, 1.15, 1],
                opacity: [0, 1, 1],
                filter: ['blur(3px)', 'blur(0px)', 'blur(0px)'],
              }}
              transition={{
                duration: 1.2,
                delay: f.delay,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                left: `${(f.x - 50) * 2}%`,
                top: `${f.y}%`,
                width: f.size,
                height: f.size,
                zIndex: f.zIndex,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              {/* Natural Organic Sway */}
              <motion.div
                animate={{
                  y: [5, -5, 5],
                  rotate: [f.rotation + 2.5, f.rotation - 2.5, f.rotation + 2.5],
                }}
                transition={{
                  duration: f.swayDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-full rounded-full overflow-hidden [mask-image:radial-gradient(circle_at_center,black_64%,transparent_96%)] drop-shadow-[0_10px_22px_rgba(0,0,0,0.22)]"
              >
                <img
                  src={getFlowerImage(f.type)}
                  alt="Blooming botanical flower"
                  className="w-full h-full object-contain filter contrast-[1.04]"
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Center Seam Drop Shadow */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none z-30" />
        </motion.div>
      </div>

      {/* Center Blooming Emblem before curtains part */}
      <AnimatePresence>
        {!curtainsParting && (
          <motion.div
            key="center-badge"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.08, 1], opacity: 1 }}
            exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative z-40 bg-white/92 backdrop-blur-md px-8 py-3.5 rounded-full border border-rose-200 shadow-2xl flex items-center gap-2.5"
          >
            <span className="text-xl animate-spin-slow">🌸</span>
            <span className="font-serif-luxury text-2xl sm:text-3xl text-rose-950 font-semibold tracking-wide">
              Flowers Are Blooming
            </span>
            <span className="text-xl animate-spin-slow">🌸</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Drifting Rose Petals in Camera Foreground */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: 26 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -40,
              x: `${(i * 3.9) + (Math.random() * 4)}vw`,
              rotate: Math.random() * 360,
              opacity: 0,
            }}
            animate={{
              y: '105vh',
              x: `${(i * 3.9) + (Math.sin(i) * 10)}vw`,
              rotate: Math.random() * 720,
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: 2.8 + (i % 4) * 0.6,
              delay: (i % 8) * 0.15,
              ease: 'easeInOut',
            }}
            className="absolute text-2xl select-none filter drop-shadow-md"
          >
            {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌹' : '🌺'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
