import { SurpriseConfig } from '../types/surprise';
import { DEFAULT_CONFIG } from '../data/defaultConfig';
import { idbGet, idbSet, idbDelete } from './indexedDb';

// Check both v1 and v2 so user customizations are NEVER lost
const LEGACY_KEY = 'forever_surprise_config_v1';
const CURRENT_KEY = 'forever_surprise_config_v2';
const IDB_KEY = 'forever_surprise_config_idb';

export function loadSavedConfig(): SurpriseConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  // 1. Check if URL hash or search params contains encoded config
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
      const decoded = decodeURIComponent(escape(atob(dataParam)));
      const parsed = JSON.parse(decoded);
      return { ...DEFAULT_CONFIG, ...parsed };
    }

    if (window.location.hash.startsWith('#data=')) {
      const hashData = window.location.hash.replace('#data=', '');
      const decoded = decodeURIComponent(escape(atob(hashData)));
      const parsed = JSON.parse(decoded);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to parse URL config:', err);
  }

  // 2. Check localStorage: Prioritize user's v1 saved data first so previous work is restored!
  try {
    const v1Saved = localStorage.getItem(LEGACY_KEY);
    if (v1Saved) {
      const parsed = JSON.parse(v1Saved);
      if (!parsed.audioUrl) parsed.audioUrl = DEFAULT_CONFIG.audioUrl;
      if (!parsed.voiceNoteUrl) parsed.voiceNoteUrl = DEFAULT_CONFIG.voiceNoteUrl;
      return { ...DEFAULT_CONFIG, ...parsed };
    }

    const v2Saved = localStorage.getItem(CURRENT_KEY);
    if (v2Saved) {
      const parsed = JSON.parse(v2Saved);
      if (!parsed.audioUrl) parsed.audioUrl = DEFAULT_CONFIG.audioUrl;
      if (!parsed.voiceNoteUrl) parsed.voiceNoteUrl = DEFAULT_CONFIG.voiceNoteUrl;
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to read localStorage:', err);
  }

  return DEFAULT_CONFIG;
}

// Asynchronous load from IndexedDB (preserves full multi-megabyte audio files & photos)
export async function loadConfigFromIndexedDb(): Promise<SurpriseConfig | null> {
  try {
    const stored = await idbGet<SurpriseConfig>(IDB_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...stored };
    }
    // Check fallback key
    const fallbackStored = await idbGet<SurpriseConfig>(CURRENT_KEY);
    if (fallbackStored) {
      return { ...DEFAULT_CONFIG, ...fallbackStored };
    }
  } catch (err) {
    console.warn('Failed to read from IndexedDB:', err);
  }
  return null;
}

export function saveConfig(config: SurpriseConfig): void {
  // 1. Save to IndexedDB (virtually unlimited quota for large audio files & photos)
  idbSet(IDB_KEY, config).catch((err) => {
    console.warn('IndexedDB save failed:', err);
  });

  // 2. Save to BOTH localStorage keys (v1 and v2) so user never loses their changes
  const jsonStr = JSON.stringify(config);
  try {
    localStorage.setItem(LEGACY_KEY, jsonStr);
    localStorage.setItem(CURRENT_KEY, jsonStr);
  } catch {
    // If quota exceeded due to huge base64 audio/images, preserve all text, titles, pin, reasons, and URLs
    try {
      const sanitized = { ...config };
      if (sanitized.audioUrl && sanitized.audioUrl.startsWith('data:')) {
        sanitized.audioUrl = DEFAULT_CONFIG.audioUrl;
      }
      if (sanitized.voiceNoteUrl && sanitized.voiceNoteUrl.startsWith('data:')) {
        sanitized.voiceNoteUrl = DEFAULT_CONFIG.voiceNoteUrl;
      }
      const sanitizedStr = JSON.stringify(sanitized);
      localStorage.setItem(LEGACY_KEY, sanitizedStr);
      localStorage.setItem(CURRENT_KEY, sanitizedStr);
    } catch (fallbackErr) {
      console.warn('localStorage fallback error:', fallbackErr);
    }
  }
}

export function resetConfig(): SurpriseConfig {
  try {
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(CURRENT_KEY);
  } catch (err) {
    console.warn('Failed to remove localStorage:', err);
  }

  idbDelete(IDB_KEY).catch((err) => {
    console.warn('IndexedDB delete failed:', err);
  });
  idbDelete(CURRENT_KEY).catch(() => {});

  return DEFAULT_CONFIG;
}

export function generateShareUrl(config: SurpriseConfig): string {
  try {
    const cleanConfig = { ...config };
    if (cleanConfig.audioUrl?.startsWith('data:')) {
      cleanConfig.audioUrl = DEFAULT_CONFIG.audioUrl;
    }
    if (cleanConfig.voiceNoteUrl?.startsWith('data:')) {
      cleanConfig.voiceNoteUrl = DEFAULT_CONFIG.voiceNoteUrl;
    }

    const jsonStr = JSON.stringify(cleanConfig);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('mode', 'surprise');
    url.hash = `data=${encoded}`;
    return url.toString();
  } catch {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('mode', 'surprise');
    return url.toString();
  }
}
