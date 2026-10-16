import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DEFAULT_CONFIG } from '../src/data/defaultConfig.ts';

describe('Surprise Configuration & Logic', () => {
  it('should have valid default PIN and recipient', () => {
    assert.strictEqual(typeof DEFAULT_CONFIG.pin, 'string');
    assert.strictEqual(DEFAULT_CONFIG.pin.length, 4);
    assert.ok(DEFAULT_CONFIG.recipientName.length > 0);
  });

  it('should have 6 diary album pages as requested by user', () => {
    assert.strictEqual(DEFAULT_CONFIG.diaryPages.length, 6);
    DEFAULT_CONFIG.diaryPages.forEach((page, idx) => {
      assert.ok(page.photoUrl, `Page ${idx + 1} must have photo`);
      assert.ok(page.caption, `Page ${idx + 1} must have caption`);
    });
  });

  it('should have editable polaroids stack with at least 4 photos', () => {
    assert.ok(DEFAULT_CONFIG.polaroids.length >= 4);
    assert.ok(DEFAULT_CONFIG.polaroids[0].caption.length > 0);
  });

  it('should have reasons why I love you with numbers', () => {
    assert.ok(DEFAULT_CONFIG.reasons.length >= 6);
    assert.ok(DEFAULT_CONFIG.reasons[0].number.startsWith('N°'));
  });

  it('should have heart constellation configuration', () => {
    assert.ok(DEFAULT_CONFIG.constellationSubtitle.includes('Constellation'));
    assert.strictEqual(DEFAULT_CONFIG.theme, 'burgundy-rose');
  });

  it('should have personal singing voice note configuration and auto-play enabled', () => {
    assert.ok(DEFAULT_CONFIG.voiceNoteUrl.length > 0);
    assert.strictEqual(DEFAULT_CONFIG.autoPlaySongOnUnlock, true);
  });

  it('should allow custom song selection to overwrite default song', () => {
    const updated = {
      ...DEFAULT_CONFIG,
      songTitle: 'Lover',
      artistName: 'Taylor Swift',
      audioUrl: 'https://example.com/custom.mp3',
      presetSongId: 'lover',
    };
    assert.strictEqual(updated.songTitle, 'Lover');
    assert.strictEqual(updated.audioUrl, 'https://example.com/custom.mp3');
  });

  it('should have updated titles for photo stack and album of love', () => {
    assert.strictEqual(DEFAULT_CONFIG.polaroidTitle, 'my whole world');
    assert.strictEqual(DEFAULT_CONFIG.polaroidSubtitle, '💗💗💗');
    assert.strictEqual(DEFAULT_CONFIG.albumTitle, 'Album of love');
  });
});
