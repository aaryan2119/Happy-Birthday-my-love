import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SurpriseConfig } from './types/surprise';
import { loadSavedConfig, saveConfig, resetConfig, loadConfigFromIndexedDb } from './utils/storage';
import { LockScreen } from './components/LockScreen';
import { BloomingFlowerCurtain } from './components/BloomingFlowerCurtain';
import { HeaderSection } from './components/HeaderSection';
import { ConstellationSection } from './components/ConstellationSection';
import { PolaroidStack } from './components/PolaroidStack';
import { VoiceNoteSection } from './components/VoiceNoteSection';
import { MusicPlayer } from './components/MusicPlayer';
import { DiaryAlbum } from './components/DiaryAlbum';
import { SealedLetter } from './components/SealedLetter';
import { ReasonsWall } from './components/ReasonsWall';
import { FinalSurprise } from './components/FinalSurprise';
import { CustomizerModal } from './components/CustomizerModal';
import { FloatingControls } from './components/FloatingControls';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { Volume2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SurpriseConfig>(() => loadSavedConfig());

  // Hydrate full config with uploaded audio and photos from IndexedDB without overwriting user edits
  useEffect(() => {
    loadConfigFromIndexedDb().then((dbConfig) => {
      if (dbConfig) {
        setConfig((prev) => ({
          ...dbConfig,
          ...prev,
          audioUrl: dbConfig.audioUrl || prev.audioUrl,
          voiceNoteUrl: dbConfig.voiceNoteUrl || prev.voiceNoteUrl,
        }));
      }
    });
  }, []);

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isBlooming, setIsBlooming] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [customizerTab, setCustomizerTab] = useState<
    'general' | 'lock' | 'polaroids' | 'diary' | 'music' | 'letter' | 'reasons' | 'final'
  >('general');
  const [isSurpriseMode, setIsSurpriseMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'surprise';
    }
    return false;
  });

  // Master Background Audio Engine
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState<boolean>(false);
  const [isAudioRestricted, setIsAudioRestricted] = useState<boolean>(false);

  // Sync audio source
  useEffect(() => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.src = config.audioUrl;
      bgmAudioRef.current.load();
      if (isBgmPlaying) {
        bgmAudioRef.current.play().catch(() => {});
      }
    }
  }, [config.audioUrl]);

  // Synchronous audio start on PIN tap (satisfies strict browser user-activation policy)
  const handleStartAudio = () => {
    if (bgmAudioRef.current && config.autoPlaySongOnUnlock !== false) {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
        setIsAudioRestricted(false);
      }).catch((err) => {
        console.warn('Audio auto-play restricted by browser:', err);
        setIsAudioRestricted(true);
      });
    }
  };

  // Handle unlock event: trigger blooming transition
  const handleUnlocked = () => {
    setIsBlooming(true);
    // If not already started via synchronous tap, attempt to start
    if (bgmAudioRef.current && !isBgmPlaying && config.autoPlaySongOnUnlock !== false) {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
        setIsAudioRestricted(false);
      }).catch(() => {
        setIsAudioRestricted(true);
      });
    }
  };

  const handleBloomComplete = () => {
    setIsBlooming(false);
    setIsUnlocked(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Audio coordination: When voice note starts, pause background song
  const handlePlayVoice = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }
    setIsBgmPlaying(false);
    setIsVoicePlaying(true);
  };

  // When voice note pauses, resume background song
  const handlePauseVoice = () => {
    setIsVoicePlaying(false);
    if (bgmAudioRef.current && config.autoPlaySongOnUnlock !== false) {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
      }).catch(() => {});
    }
  };

  // When voice note ends, automatically resume background song
  const handleVoiceEnded = () => {
    setIsVoicePlaying(false);
    if (bgmAudioRef.current && config.autoPlaySongOnUnlock !== false) {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
      }).catch(() => {});
    }
  };

  // When BGM is played directly
  const handlePlayBgm = () => {
    setIsVoicePlaying(false);
    if (bgmAudioRef.current) {
      bgmAudioRef.current.play().then(() => {
        setIsBgmPlaying(true);
        setIsAudioRestricted(false);
      }).catch((err) => {
        console.warn('BGM play restricted:', err);
        setIsAudioRestricted(true);
      });
    }
  };

  const handlePauseBgm = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
    }
    setIsBgmPlaying(false);
  };

  const handleToggleMute = () => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSaveConfig = (newConfig: SurpriseConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleResetConfig = () => {
    const res = resetConfig();
    setConfig(res);
  };

  const handleReplay = () => {
    setIsUnlocked(false);
    setIsBlooming(false);
    if (bgmAudioRef.current) {
      bgmAudioRef.current.pause();
      bgmAudioRef.current.currentTime = 0;
    }
    setIsBgmPlaying(false);
    setIsVoicePlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={() => {
        // If audio was ever restricted by browser policy, any tap on the page unlocks it
        if (isAudioRestricted && isUnlocked && !isVoicePlaying) {
          handlePlayBgm();
        }
      }}
      className="min-h-screen bg-[#faf0f2] text-stone-800 relative selection:bg-[#9f1239] selection:text-white overflow-x-hidden"
    >
      {/* Master Background Audio Element */}
      {Boolean(config.audioUrl) && (
        <audio
          ref={bgmAudioRef}
          src={config.audioUrl || undefined}
          loop
          preload="auto"
        />
      )}

      {/* Floating Audio Unlock prompt if browser ever restricted auto-play */}
      {isAudioRestricted && isUnlocked && !isVoicePlaying && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayBgm();
          }}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-rose-700 to-rose-600 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wide cursor-pointer animate-bounce hover:scale-105 transition-all"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>Tap to Play Our Song 🎵</span>
        </motion.button>
      )}

      {/* Pink Heart Emoji Cursor Particle Trail */}
      <HeartCursorTrail />

      {/* Floating Controls for Boyfriend */}
      <FloatingControls
        isUnlocked={isUnlocked}
        onLock={handleReplay}
        onOpenCustomizer={() => {
          setCustomizerTab('general');
          setIsCustomizerOpen(true);
        }}
        config={config}
        isSurpriseMode={isSurpriseMode}
        onToggleSurpriseMode={() => setIsSurpriseMode(!isSurpriseMode)}
      />

      {/* Blooming Flower Curtain Transition */}
      <AnimatePresence>
        {isBlooming && (
          <BloomingFlowerCurtain onComplete={handleBloomComplete} />
        )}
      </AnimatePresence>

      {/* Main Experience: Either Lock Screen or Unlocked Romantic Wonderland */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LockScreen
              config={config}
              onUnlocked={handleUnlocked}
              onStartAudio={handleStartAudio}
            />
          </motion.div>
        ) : (
          <motion.main
            key="celebration-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl mx-auto px-4 divide-y divide-rose-200/50"
          >
            {/* 1. Header & Birthday Announcement */}
            <HeaderSection config={config} />

            {/* 2. Interactive Heart Constellation & Birthday Wish */}
            <ConstellationSection config={config} />

            {/* 3. Moments With You Polaroid Stack ("my whole world" / "💗💗💗") */}
            <PolaroidStack config={config} />

            {/* 4. Personal Voice Note (Singing Happy Birthday) */}
            <VoiceNoteSection
              config={config}
              isVoicePlaying={isVoicePlaying}
              onPlayVoice={handlePlayVoice}
              onPauseVoice={handlePauseVoice}
              onVoiceEnded={handleVoiceEnded}
              onUploadVoiceNote={(dataUrl) =>
                handleSaveConfig({ ...config, voiceNoteUrl: dataUrl })
              }
            />

            {/* 5. Our Song Music Player (Coordinated with Voice Note) */}
            <MusicPlayer
              config={config}
              isPlaying={isBgmPlaying}
              onPlay={handlePlayBgm}
              onPause={handlePauseBgm}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onOpenMusicCustomizer={() => {
                setCustomizerTab('music');
                setIsCustomizerOpen(true);
              }}
            />

            {/* 6. Album of love (6 Diary Photos) */}
            <DiaryAlbum config={config} />

            {/* 7. A Letter, Sealed in vintage envelope */}
            <SealedLetter config={config} />

            {/* 8. Wall of Reasons Why I Love You */}
            <ReasonsWall config={config} />

            {/* 9. One Last Thing & Pulsing 3D Heart */}
            <FinalSurprise
              config={config}
              onReplay={handleReplay}
              onOpenShare={() => {
                setCustomizerTab('general');
                setIsCustomizerOpen(true);
              }}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Customizer Studio Drawer / Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialTab={customizerTab}
        config={config}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
        onToggleSurpriseMode={() => {
          setIsSurpriseMode(true);
          setIsCustomizerOpen(false);
        }}
      />
    </div>
  );
}
