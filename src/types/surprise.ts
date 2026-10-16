export interface PolaroidItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  rotation?: number;
}

export interface DiaryPage {
  id: string;
  chapter: string;
  title: string;
  photoUrl: string;
  caption: string;
}

export interface ReasonItem {
  id: string;
  number: string;
  text: string;
  color: 'yellow' | 'pink' | 'rose' | 'cream' | 'mint' | 'lavender';
  rotation?: number;
}

export interface SurpriseConfig {
  // Couple Info
  recipientName: string;
  senderName: string;
  nickname: string;
  
  // Lock Screen
  pin: string;
  pinHint: string;
  lockPhotoUrl: string;
  lockTagline: string;
  lockScreenStyle?: 'cloudy-padlock' | 'photo-polaroid';
  
  // Theme & Atmosphere
  theme: 'burgundy-rose' | 'crimson-rose' | 'blush-pink';
  enableFallingPetals: boolean;
  
  // Greeting
  headline: string;
  subheadline: string;
  
  // Heart Constellation & Wish
  constellationTitle: string;
  constellationSubtitle: string;
  constellationWish: string;
  starCount?: number;
  
  // Polaroid Stack
  polaroidTitle: string;
  polaroidSubtitle: string;
  polaroids: PolaroidItem[];
  
  // Music Player
  songTitle: string;
  artistName: string;
  audioUrl: string;
  audioSourceType: 'preset' | 'custom' | 'synth';
  presetSongId: string;
  autoPlaySongOnUnlock: boolean;

  // Personal Voice Note (Singing Happy Birthday)
  voiceNoteUrl: string;
  voiceNoteTitle: string;
  voiceNoteSubtitle: string;
  
  // Diary Album
  albumTitle: string;
  albumSubtitle: string;
  diaryPages: DiaryPage[];
  
  // Love Letter
  letterTitle: string;
  letterSubtitle: string;
  letterGreeting: string;
  letterBody: string;
  letterSignoff: string;
  
  // Reasons Why I Love You
  reasonsTitle: string;
  reasonsSubtitle: string;
  reasons: ReasonItem[];
  
  // Final Surprise
  finalTitle: string;
  finalMessage: string;
  finalSignoff: string;
}
