import confetti from 'canvas-confetti';

/**
 * Fires romantic flower petals and soft rose-tinted confetti
 */
export function fireFlowerPetals() {
  const count = 70;
  const defaults = {
    origin: { y: 0.6 },
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffe4e6', '#fbcfe8', '#f472b6', '#fbbf24'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 30,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.4,
  });
  fire(0.1, {
    spread: 140,
    startVelocity: 45,
  });
}

/**
 * Massive blooming flower explosion for PIN unlock
 */
export function fireBloomingExplosion() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);

    // Left and right blossoms
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#fda4af', '#fff1f2', '#fbcfe8', '#ffd1dc'],
      scalar: 1.2,
    });
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#e11d48', '#fb7185', '#fda4af', '#fff1f2', '#fbcfe8', '#ffd1dc'],
      scalar: 1.2,
    });
  }, 220);
}

/**
 * Candle blow-out wish celebration
 */
export function fireCandleCelebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#fda4af', '#f43f5e', '#fff'],
  });
}

/**
 * Heart shapes burst
 */
export function fireHeartCelebration() {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.7 },
    colors: ['#e11d48', '#fb7185', '#fda4af', '#ffd700'],
    scalar: 1.3,
  });
}
