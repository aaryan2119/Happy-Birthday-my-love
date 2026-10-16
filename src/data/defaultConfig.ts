import { SurpriseConfig } from '../types/surprise';

export const DEFAULT_CONFIG: SurpriseConfig = {
  // Couple Info
  recipientName: 'Harshita',
  senderName: 'Aaryan',
  nickname: 'My Love',

  // Lock Screen
  pin: '1402',
  pinHint: 'Hint: our birthdays combined 💕',
  lockPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  lockTagline: 'something special is waiting',
  lockScreenStyle: 'cloudy-padlock',

  // Theme & Atmosphere
  theme: 'burgundy-rose',
  enableFallingPetals: true,

  // Greeting
  headline: 'Happy Birthday',
  subheadline: 'Another year of you — and somehow you keep getting more wonderful ✨',

  // Heart Constellation & Wish
  constellationTitle: 'First things first...',
  constellationSubtitle: 'A Constellation of Us ✨',
  constellationWish: 'Tap each star to trace our heart constellation and make a wish 💫',
  starCount: 8,

  // Polaroid Stack
  polaroidTitle: 'my whole world',
  polaroidSubtitle: '💗💗💗',
  polaroids: [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
      caption: 'Ufff The Jawline 🔥🔥',
      date: 'Forever my favorite glance',
      rotation: -3,
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
      caption: 'My cute sulky baby 💕🥺',
      date: 'Even when you are mad at me',
      rotation: 2.5,
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
      caption: 'Poetry lies within these eyes ✨',
      date: 'I could get lost here forever',
      rotation: -2,
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
      caption: 'The prettiest smile in this whole universe 🌸',
      date: 'Light of my world',
      rotation: 3,
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      caption: 'You make every ordinary moment feel magic 💫',
      date: 'Just us together',
      rotation: -1.5,
    },
  ],

  // Music Player
  songTitle: 'Perfect',
  artistName: 'Ed Sheeran',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112191.mp3',
  audioSourceType: 'preset',
  presetSongId: 'perfect',
  autoPlaySongOnUnlock: true,

  // Personal Voice Note (Singing Happy Birthday)
  voiceNoteUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-uplifting-10174.mp3',
  voiceNoteTitle: 'I recorded a little song for you...',
  voiceNoteSubtitle: 'Press play to hear me sing Happy Birthday to you 💕',

  // Diary Album (6 Photos)
  albumTitle: 'Album of love',
  albumSubtitle: 'Turn the pages of us',
  diaryPages: [
    {
      id: 'd1',
      chapter: 'chapter one — YOU 💕',
      title: 'The day my world changed',
      photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      caption: 'The moment you walked into my life, everything turned into poetry.',
    },
    {
      id: 'd2',
      chapter: 'chapter two — LAUGHTER 🌸',
      title: 'My cutest memory',
      photoUrl: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=800&q=80',
      caption: 'Your silly giggles that can turn any bad day into pure sunshine.',
    },
    {
      id: 'd3',
      chapter: 'chapter three — GRACE 💖',
      title: 'Effortlessly you',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      caption: 'You do not even have to try. You are simply breathtaking.',
    },
    {
      id: 'd4',
      chapter: 'chapter four — COMFORT ☕',
      title: 'Our quiet afternoons',
      photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
      caption: 'Just holding your hand in silence is my favorite place on Earth.',
    },
    {
      id: 'd5',
      chapter: 'chapter five — ADVENTURES ✈️',
      title: 'Every road with you',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      caption: 'Any destination is heaven as long as you are by my side.',
    },
    {
      id: 'd6',
      chapter: 'chapter six — FOREVER 🌹',
      title: 'Always and beyond',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
      caption: 'Six pages could never hold what I feel. A lifetime still won\'t be enough.',
    },
  ],

  // Love Letter
  letterTitle: 'I wrote you something',
  letterSubtitle: 'A Letter, Sealed',
  letterGreeting: 'To my Ardhagini,',
  letterBody: `Happy Birthday, my love. I've been trying to find the right words for weeks and the truth is simple: you make everything softer, brighter, and easier to believe in.

I mean how can words simply define you? Something so angelic and poetic. ❤️❤️❤️

Thank you my love, for making everything in life easier. I am sure you must have read the main letter and honestly I still can't get enough of saying I love you so much my love so much! You are the best girl. The BEST.`,
  letterSignoff: 'With all my heart and soul,\nYours forever ❤️',

  // Reasons Why I Love You
  reasonsTitle: 'I could go on forever',
  reasonsSubtitle: 'Reasons I Love You',
  reasons: [
    {
      id: 'r1',
      number: 'N° 01',
      text: 'the way you make me the happiest man in this whole world',
      color: 'yellow',
      rotation: -2,
    },
    {
      id: 'r2',
      number: 'N° 02',
      text: 'the way you try to remember the tiny things everyone forgets',
      color: 'pink',
      rotation: 3,
    },
    {
      id: 'r3',
      number: 'N° 03',
      text: 'the way you make even silence feel like a sweet song',
      color: 'cream',
      rotation: -1,
    },
    {
      id: 'r4',
      number: 'N° 04',
      text: 'how brave you are, even when you don\'t feel it inside',
      color: 'rose',
      rotation: 2,
    },
    {
      id: 'r5',
      number: 'N° 05',
      text: 'you make strangers feel like old friends in minutes',
      color: 'mint',
      rotation: -3,
    },
    {
      id: 'r6',
      number: 'N° 06',
      text: 'the cute way you say my name when you are happy',
      color: 'lavender',
      rotation: 1.5,
    },
    {
      id: 'r7',
      number: 'N° 07',
      text: 'the way you just make everything silent and calm',
      color: 'pink',
      rotation: -2.5,
    },
    {
      id: 'r8',
      number: 'N° 08',
      text: 'just the way you are — completely, unapologetically you 💖',
      color: 'yellow',
      rotation: 2,
    },
  ],

  // Final Surprise
  finalTitle: 'one last thing',
  finalMessage: `Happy Birthday, my love.
You are my favourite hello and my hardest goodbye.
Here's to your year — I'll be cheering the loudest.
Cheers to you my love 🥂🥂🥂💖`,
  finalSignoff: 'forever yours, Aaryan 💕',
};

export const PRESET_SONGS = [
  {
    id: 'perfect',
    title: 'Perfect',
    artist: 'Ed Sheeran (Romantic Acoustic)',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112191.mp3',
  },
  {
    id: 'lover',
    title: 'Lover',
    artist: 'Taylor Swift (Acoustic Guitar)',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-uplifting-10174.mp3',
  },
  {
    id: 'cant-help-falling',
    title: "Can't Help Falling in Love",
    artist: 'Elvis Presley (Romantic Violin & Piano)',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2441995116.mp3?filename=reflected-light-147724.mp3',
  },
  {
    id: 'you-are-the-reason',
    title: 'You Are The Reason',
    artist: 'Calum Scott (Soft Piano Instrumental)',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_34b39b3602.mp3?filename=soft-piano-10777.mp3',
  },
  {
    id: 'just-the-way-you-are',
    title: 'Just The Way You Are',
    artist: 'Bruno Mars (Romantic Melody)',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c62c3b64.mp3?filename=romantic-10825.mp3',
  },
];
