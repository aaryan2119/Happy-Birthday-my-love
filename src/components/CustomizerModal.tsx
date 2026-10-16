import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  Share2,
  Heart,
  Music,
  BookOpen,
  Image as ImageIcon,
  KeyRound,
  FileText,
  Sparkles,
  Check,
  Mic,
} from 'lucide-react';
import { SurpriseConfig, PolaroidItem, DiaryPage, ReasonItem } from '../types/surprise';
import { PRESET_SONGS } from '../data/defaultConfig';
import { generateShareUrl } from '../utils/storage';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SurpriseConfig;
  onSave: (newConfig: SurpriseConfig) => void;
  onReset: () => void;
  onToggleSurpriseMode: () => void;
  initialTab?: TabType;
}

type TabType = 'general' | 'lock' | 'polaroids' | 'diary' | 'music' | 'letter' | 'reasons' | 'final';

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSave,
  onReset,
  onToggleSurpriseMode,
  initialTab = 'general',
}) => {
  const [formData, setFormData] = useState<SurpriseConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');

  // Sync initial tab when opened
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Handle local audio file upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setUploadedAudioName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({
          ...prev,
          audioUrl: result,
          audioSourceType: 'custom',
          songTitle: fileName,
          artistName: 'Our Special Song',
          presetSongId: 'custom',
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  // Handle generic text change
  const handleChange = (field: keyof SurpriseConfig, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper for image upload to base64
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        callback(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Polaroid handlers
  const handleUpdatePolaroid = (id: string, field: keyof PolaroidItem, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      polaroids: prev.polaroids.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleAddPolaroid = () => {
    const newId = `p_${Date.now()}`;
    const newPolaroid: PolaroidItem = {
      id: newId,
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
      caption: 'My favorite smile 💕',
      date: 'Moments with you',
      rotation: Math.random() * 4 - 2,
    };
    setFormData((prev) => ({
      ...prev,
      polaroids: [...prev.polaroids, newPolaroid],
    }));
  };

  const handleDeletePolaroid = (id: string) => {
    if (formData.polaroids.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      polaroids: prev.polaroids.filter((p) => p.id !== id),
    }));
  };

  // Diary pages handlers (up to 6 pages)
  const handleUpdateDiaryPage = (id: string, field: keyof DiaryPage, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      diaryPages: prev.diaryPages.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  };

  // Reasons handlers
  const handleUpdateReason = (id: string, field: keyof ReasonItem, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      reasons: prev.reasons.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const handleAddReason = () => {
    const count = formData.reasons.length + 1;
    const colors: ReasonItem['color'][] = ['yellow', 'pink', 'rose', 'cream', 'mint', 'lavender'];
    const newReason: ReasonItem = {
      id: `r_${Date.now()}`,
      number: `N° 0${count}`,
      text: 'the way you look at me when you are happy',
      color: colors[count % colors.length],
      rotation: Math.random() * 4 - 2,
    };
    setFormData((prev) => ({
      ...prev,
      reasons: [...prev.reasons, newReason],
    }));
  };

  const handleDeleteReason = (id: string) => {
    if (formData.reasons.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((r) => r.id !== id),
    }));
  };

  // Preset song picker
  const handleSelectSong = (presetId: string) => {
    const selected = PRESET_SONGS.find((s) => s.id === presetId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        presetSongId: selected.id,
        songTitle: selected.title,
        artistName: selected.artist,
        audioUrl: selected.url,
      }));
    }
  };

  // Save changes
  const handleSave = () => {
    onSave(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  // Copy share URL
  const handleCopyLink = () => {
    onSave(formData);
    const link = generateShareUrl(formData);
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      setCopiedLink(true);
    });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'Names & Theme', icon: <Heart className="w-4 h-4" /> },
    { id: 'lock', label: 'Lock & PIN', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'polaroids', label: 'Photo Stack', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'diary', label: 'Diary (6 Photos)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'music', label: 'Our Song', icon: <Music className="w-4 h-4" /> },
    { id: 'letter', label: 'Love Letter', icon: <FileText className="w-4 h-4" /> },
    { id: 'reasons', label: 'Reasons Wall', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'final', label: 'Final Wish', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-rose-100"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-rose-950">
                Surprise Customizer Studio
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Personalize every photo, note, music, and passcode for {formData.recipientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-medium transition cursor-pointer"
              title="Copy shareable link with all customizations"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link for Her'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-none bg-stone-50 px-4 py-1.5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-rose-600 shadow-xs border border-rose-150'
                  : 'text-stone-600 hover:text-rose-500 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#faf9f6]">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="max-w-xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Girlfriend's Name (Recipient)
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleChange('recipientName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Your Name (Sender)
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleChange('senderName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Sweet Subtitle under Happy Birthday
                </label>
                <input
                  type="text"
                  value={formData.subheadline}
                  onChange={(e) => handleChange('subheadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Heart Constellation Subtitle
                </label>
                <input
                  type="text"
                  value={formData.constellationSubtitle || 'A Constellation of Us ✨'}
                  onChange={(e) => handleChange('constellationSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Constellation Wish Prompt / Message
                </label>
                <input
                  type="text"
                  value={formData.constellationWish || 'Tap each star to trace our heart constellation and make a wish 💫'}
                  onChange={(e) => handleChange('constellationWish', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOCK SCREEN & PIN */}
          {activeTab === 'lock' && (
            <div className="max-w-xl space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Lock Screen Aesthetic
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('lockScreenStyle', 'cloudy-padlock')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      (formData.lockScreenStyle || 'cloudy-padlock') === 'cloudy-padlock'
                        ? 'border-rose-500 bg-rose-50 shadow-xs ring-1 ring-rose-300'
                        : 'border-stone-200 bg-white hover:border-rose-200'
                    }`}
                  >
                    <span className="text-sm font-semibold text-stone-900">☁️ Cloudy Moon & Padlock</span>
                    <span className="text-xs text-stone-500 mt-1">From Screen Recording 1 (Heart Padlock & Botanical Flowers)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('lockScreenStyle', 'photo-polaroid')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.lockScreenStyle === 'photo-polaroid'
                        ? 'border-rose-500 bg-rose-50 shadow-xs ring-1 ring-rose-300'
                        : 'border-stone-200 bg-white hover:border-rose-200'
                    }`}
                  >
                    <span className="text-sm font-semibold text-stone-900">🧸 Polaroid & Teddy Bear</span>
                    <span className="text-xs text-stone-500 mt-1">From Screen Recording 2 (Framed Photo & Keypad)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    4-Digit Secret Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono text-lg tracking-widest text-center focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">Must be 4 digits (e.g. 1402)</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Passcode Hint Text
                  </label>
                  <input
                    type="text"
                    value={formData.pinHint}
                    onChange={(e) => handleChange('pinHint', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none text-sm bg-white"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">e.g. Hint: our birthdays combined 💕</p>
                </div>
              </div>

              {/* Lock Screen Photo Upload */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Lock Screen Framed Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-28 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 flex-shrink-0">
                    <img
                      src={formData.lockPhotoUrl}
                      alt="Lock photo preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium cursor-pointer transition">
                      <Upload className="w-4 h-4" />
                      <span>Upload Her Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, (url) => handleChange('lockPhotoUrl', url))}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={formData.lockPhotoUrl}
                      onChange={(e) => handleChange('lockPhotoUrl', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POLAROID STACK */}
          {activeTab === 'polaroids' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">Moments With You (Polaroid Deck)</h3>
                  <p className="text-xs text-stone-500">Add or edit her photos with custom captions and dates</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPolaroid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.polaroids.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex gap-3.5 items-start"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 relative group">
                      <img
                        src={item.url}
                        alt="Polaroid thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, (url) => handleUpdatePolaroid(item.id, 'url', url))
                          }
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-semibold text-rose-500">
                          Photo #{idx + 1}
                        </span>
                        {formData.polaroids.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeletePolaroid(item.id)}
                            className="text-stone-400 hover:text-red-500 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Caption (e.g. Ufff The Jawline 🔥🔥)"
                        value={item.caption}
                        onChange={(e) => handleUpdatePolaroid(item.id, 'caption', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                      />

                      <input
                        type="text"
                        placeholder="Date or note (e.g. Forever my favorite glance)"
                        value={item.date || ''}
                        onChange={(e) => handleUpdatePolaroid(item.id, 'date', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white text-stone-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DIARY ALBUM (6 PHOTOS) */}
          {activeTab === 'diary' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-stone-800">
                  Our Little Album (6 Diary Photos & Chapters)
                </h3>
                <p className="text-xs text-stone-500">
                  Customize the 6 book pages with your favorite memories, chapter titles, and captions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.diaryPages.map((page, idx) => (
                  <div
                    key={page.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="text-xs font-mono font-semibold text-rose-600">
                        Page {idx + 1} / 6
                      </span>
                      <input
                        type="text"
                        value={page.chapter}
                        onChange={(e) => handleUpdateDiaryPage(page.id, 'chapter', e.target.value)}
                        placeholder="Chapter name"
                        className="text-xs font-mono text-stone-600 px-2 py-0.5 rounded border border-stone-200 bg-stone-50 w-44"
                      />
                    </div>

                    <div className="flex gap-3">
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 relative group">
                        <img
                          src={page.photoUrl}
                          alt="Diary page"
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs">
                          <Upload className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) =>
                                handleUpdateDiaryPage(page.id, 'photoUrl', url)
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Page title (e.g. My cutest memory)"
                          value={page.title}
                          onChange={(e) => handleUpdateDiaryPage(page.id, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium bg-white"
                        />
                        <textarea
                          rows={2}
                          placeholder="Handwritten caption"
                          value={page.caption}
                          onChange={(e) => handleUpdateDiaryPage(page.id, 'caption', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MUSIC */}
          {activeTab === 'music' && (
            <div className="max-w-xl space-y-6">
              {/* How to add a song help card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-1">
                  <Music className="w-4 h-4 text-rose-600" />
                  <span>How to Add Your Special Song:</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  You can choose your song using any of the 3 easy methods below: <strong>upload your own audio file</strong>, <strong>pick a famous romantic love song</strong>, or <strong>paste a custom MP3 link</strong>!
                </p>
              </div>

              {/* METHOD 1: UPLOAD LOCAL AUDIO FILE */}
              <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-bold">
                      Method 1 (Recommended)
                    </span>
                    <h5 className="text-sm font-semibold text-stone-900">
                      Upload Audio from your Phone or Computer
                    </h5>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full uppercase">
                    Offline Ready
                  </span>
                </div>

                <p className="text-xs text-stone-500">
                  Select any audio file (.mp3, .m4a, .wav) from your files or voice recordings.
                </p>

                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-semibold cursor-pointer transition shadow-sm hover:shadow active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Choose Audio File (MP3 / M4A / WAV)</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav"
                      className="hidden"
                      onChange={handleAudioUpload}
                    />
                  </label>
                  {uploadedAudioName && (
                    <span className="block mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded: {uploadedAudioName}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* METHOD 2: SELECT POPULAR ROMANTIC LOVE SONG */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    Method 2
                  </span>
                  <h5 className="text-sm font-semibold text-stone-900">
                    Pick a Popular Romantic Hit
                  </h5>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Instant 1-click curated romantic tracks
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_SONGS.map((song) => (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => handleSelectSong(song.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        formData.presetSongId === song.id
                          ? 'border-rose-500 bg-rose-50 shadow-xs ring-1 ring-rose-400'
                          : 'border-stone-200 bg-white hover:border-rose-200'
                      }`}
                    >
                      <p className="text-xs font-semibold text-stone-900">{song.title}</p>
                      <p className="text-[11px] text-stone-500">{song.artist}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* METHOD 3: PASTE CUSTOM URL */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold">
                    Method 3
                  </span>
                  <h5 className="text-sm font-semibold text-stone-900">
                    Paste Direct Audio URL (Optional)
                  </h5>
                </div>

                <input
                  type="text"
                  placeholder="https://.../romantic-track.mp3"
                  value={formData.audioUrl}
                  onChange={(e) => handleChange('audioUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-200 outline-none"
                />
              </div>

              {/* SONG TITLE & ARTIST DISPLAY LABELS */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  How Song Appears on Music Card
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 mb-0.5 block">Song Title</span>
                    <input
                      type="text"
                      placeholder="e.g. Perfect / Our Song"
                      value={formData.songTitle}
                      onChange={(e) => handleChange('songTitle', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 mb-0.5 block">Artist / Dedication</span>
                    <input
                      type="text"
                      placeholder="e.g. Ed Sheeran / For My Girl"
                      value={formData.artistName}
                      onChange={(e) => handleChange('artistName', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* PERSONAL VOICE NOTE SECTION */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-rose-50 border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-rose-600" />
                    <h5 className="text-sm font-bold text-stone-900">
                      Your Singing Voice Note
                    </h5>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full uppercase">
                    Personalized 🎙️
                  </span>
                </div>

                <p className="text-xs text-stone-600">
                  Upload your voice recording singing "Happy Birthday" to her. When she presses play, the background music will automatically stop, and will resume once your note finishes!
                </p>

                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-rose-700 hover:from-amber-800 hover:to-rose-800 text-white text-xs font-semibold cursor-pointer transition shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Voice Note (MP3, M4A, Voice Memo)</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          if (result) {
                            handleChange('voiceNoteUrl', result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-stone-500 mb-0.5 block">Card Title</span>
                    <input
                      type="text"
                      value={formData.voiceNoteTitle || ''}
                      onChange={(e) => handleChange('voiceNoteTitle', e.target.value)}
                      placeholder="I recorded a little song for you..."
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 mb-0.5 block">Card Subtitle / Prompt</span>
                    <input
                      type="text"
                      value={formData.voiceNoteSubtitle || ''}
                      onChange={(e) => handleChange('voiceNoteSubtitle', e.target.value)}
                      placeholder="Press play to hear me sing Happy Birthday 💕"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* AUTO-PLAY TOGGLE */}
              <div className="p-3.5 rounded-xl bg-stone-100 flex items-center justify-between border border-stone-200">
                <div>
                  <p className="text-xs font-semibold text-stone-800">
                    Auto-play background music on secret PIN unlock
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Starts playing your selected song automatically right as she enters the PIN!
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoPlaySongOnUnlock !== false}
                  onChange={(e) => handleChange('autoPlaySongOnUnlock', e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded cursor-pointer accent-rose-600"
                />
              </div>
            </div>
          )}

          {/* TAB 6: LOVE LETTER */}
          {activeTab === 'letter' && (
            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Salutation / Greeting
                </label>
                <input
                  type="text"
                  value={formData.letterGreeting}
                  onChange={(e) => handleChange('letterGreeting', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Letter Body (Handwritten Parchment)
                </label>
                <textarea
                  rows={8}
                  value={formData.letterBody}
                  onChange={(e) => handleChange('letterBody', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white resize-y leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Letter Signoff
                </label>
                <input
                  type="text"
                  value={formData.letterSignoff}
                  onChange={(e) => handleChange('letterSignoff', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 7: REASONS WALL */}
          {activeTab === 'reasons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">Reasons Why I Love You</h3>
                  <p className="text-xs text-stone-500">Edit the sticky notes pinned to the wall</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddReason}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Reason</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {formData.reasons.map((reason) => (
                  <div
                    key={reason.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={reason.number}
                        onChange={(e) => handleUpdateReason(reason.id, 'number', e.target.value)}
                        className="w-20 text-xs font-mono font-semibold text-rose-500 px-1 py-0.5 rounded border border-stone-200"
                      />
                      {formData.reasons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReason(reason.id)}
                          className="text-stone-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={reason.text}
                      onChange={(e) => handleUpdateReason(reason.id, 'text', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-stone-200 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: FINAL WISH */}
          {activeTab === 'final' && (
            <div className="max-w-xl space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Card Title
                </label>
                <input
                  type="text"
                  value={formData.finalTitle}
                  onChange={(e) => handleChange('finalTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Final Romantic Message
                </label>
                <textarea
                  rows={5}
                  value={formData.finalMessage}
                  onChange={(e) => handleChange('finalMessage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Final Signoff
                </label>
                <input
                  type="text"
                  value={formData.finalSignoff}
                  onChange={(e) => handleChange('finalSignoff', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave();
                onToggleSurpriseMode();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview as Girlfriend (Hide UI)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex sm:hidden items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100 text-rose-800 text-xs font-medium cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shadow-md hover:shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedAlert ? 'Changes Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
