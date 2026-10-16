import React, { useState } from 'react';
import { Settings, Lock, Volume2, VolumeX, Share2, Check, Sparkles, Eye, EyeOff } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { generateShareUrl } from '../utils/storage';
import { SurpriseConfig } from '../types/surprise';

interface FloatingControlsProps {
  isUnlocked: boolean;
  onLock: () => void;
  onOpenCustomizer: () => void;
  config: SurpriseConfig;
  isSurpriseMode: boolean;
  onToggleSurpriseMode: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isUnlocked,
  onLock,
  onOpenCustomizer,
  config,
  isSurpriseMode,
  onToggleSurpriseMode,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [copied, setCopied] = useState<boolean>(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  const handleShare = () => {
    const link = generateShareUrl(config);
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
    });
  };

  return (
    <>
      {/* If Surprise Mode is active, show only a tiny subtle button in the corner to exit if needed */}
      {isSurpriseMode ? (
        <div className="fixed bottom-3 right-3 z-40">
          <button
            type="button"
            onClick={onToggleSurpriseMode}
            className="p-2 rounded-full bg-white/40 hover:bg-white/80 backdrop-blur-md border border-rose-100 text-stone-400 hover:text-stone-700 transition shadow-xs cursor-pointer opacity-40 hover:opacity-100"
            title="Exit Surprise Mode (Show Edit Controls)"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Regular Edit & Control Bar */
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
          {/* Share Link Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-100 text-rose-700 text-xs font-medium shadow-sm transition hover:shadow cursor-pointer"
            title="Copy romantic link for your girlfriend"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link for Her'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-100 text-stone-600 hover:text-stone-900 shadow-sm transition cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
          </button>

          {/* Lock / Relock to test PIN */}
          {isUnlocked && (
            <button
              type="button"
              onClick={onLock}
              className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-100 text-stone-600 hover:text-stone-900 shadow-sm transition cursor-pointer"
              title="Test Lock Screen"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Customize Button */}
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition hover:shadow-lg cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize for Her</span>
          </button>
        </div>
      )}
    </>
  );
};
