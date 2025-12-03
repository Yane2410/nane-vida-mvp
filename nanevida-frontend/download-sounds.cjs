#!/usr/bin/env node

/**
 * Sound Asset Downloader
 * Downloads free/royalty-free sounds for Nane Vida wellness tools
 * 
 * Sources: Freesound.org (Creative Commons 0)
 * Alternative: Use YouTube Audio Library or generate synthetic tones
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '..', 'public', 'sounds');

// Ensure sounds directory exists
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

console.log('🎵 Nane Vida Sound Downloader\n');
console.log('Downloading free audio assets...\n');

/**
 * Alternative 1: Use Freesound.org API (requires free API key)
 * Alternative 2: Use pre-generated Web Audio API tones
 * Alternative 3: Manual download links
 */

// Manual download instructions (free sources)
const soundSources = {
  'wind.mp3': {
    name: 'Gentle Wind',
    source: 'Freesound',
    url: 'https://freesound.org/people/InspectorJ/sounds/339326/',
    description: 'Soft wind ambience for breathing',
    license: 'CC BY 4.0'
  },
  'bell.mp3': {
    name: 'Singing Bowl',
    source: 'Freesound',
    url: 'https://freesound.org/people/martian/sounds/19312/',
    description: 'Tibetan singing bowl for transitions',
    license: 'CC0 1.0'
  },
  'water.mp3': {
    name: 'Gentle Stream',
    source: 'Freesound',
    url: 'https://freesound.org/people/InspectorJ/sounds/365916/',
    description: 'Peaceful water flow for reflection',
    license: 'CC BY 4.0'
  },
  'breath-tone.mp3': {
    name: 'Soft Breath Tone',
    source: 'Generated',
    url: 'N/A - Will be generated synthetically',
    description: 'Gentle breathing guide tone',
    license: 'Public Domain'
  }
};

console.log('📋 Required Sound Files:\n');
Object.entries(soundSources).forEach(([filename, info]) => {
  console.log(`✨ ${filename}`);
  console.log(`   Name: ${info.name}`);
  console.log(`   Source: ${info.source}`);
  console.log(`   Description: ${info.description}`);
  console.log(`   License: ${info.license}`);
  if (info.url !== 'N/A - Will be generated synthetically') {
    console.log(`   URL: ${info.url}`);
  }
  console.log('');
});

console.log('\n⚠️  MANUAL DOWNLOAD REQUIRED:');
console.log('\nDue to licensing and API requirements, please download sounds manually:\n');
console.log('1. Visit the URLs listed above');
console.log('2. Download the MP3 files');
console.log('3. Save them to: nanevida-frontend/public/sounds/');
console.log('4. Rename files to match: wind.mp3, bell.mp3, water.mp3, breath-tone.mp3\n');

console.log('🎹 ALTERNATIVE: Generate synthetic tones with Web Audio API\n');
console.log('Run: node download-sounds.js --generate\n');

// Check if --generate flag is present
if (process.argv.includes('--generate')) {
  console.log('🎼 Generating synthetic audio files...\n');
  generateSyntheticSounds();
} else {
  console.log('💡 TIP: You can also use placeholder silent files for testing:');
  console.log('Run: node download-sounds.js --placeholder\n');
  
  if (process.argv.includes('--placeholder')) {
    createPlaceholderFiles();
  }
}

/**
 * Generate synthetic audio using Web Audio API (Node.js version)
 * This creates simple tones that can be used as placeholders
 */
function generateSyntheticSounds() {
  console.log('❌ Synthetic generation requires additional dependencies.');
  console.log('Install: npm install web-audio-api wav-encoder\n');
  console.log('For now, using placeholder files instead...\n');
  createPlaceholderFiles();
}

/**
 * Create empty placeholder audio files for testing
 */
function createPlaceholderFiles() {
  console.log('📝 Creating placeholder audio files...\n');
  
  // Create a minimal valid MP3 file (silent)
  // This is a 1-second silent MP3 frame
  const silentMP3 = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);

  const files = ['wind.mp3', 'bell.mp3', 'water.mp3', 'breath-tone.mp3'];
  
  files.forEach(filename => {
    const filepath = path.join(SOUNDS_DIR, filename);
    fs.writeFileSync(filepath, silentMP3);
    console.log(`✅ Created: ${filename} (placeholder)`);
  });
  
  console.log('\n⚠️  These are PLACEHOLDER files (silent)');
  console.log('Replace them with real audio for production!\n');
  
  // Update README
  const readmePath = path.join(SOUNDS_DIR, 'README.md');
  const readmeContent = `# Sound Assets

⚠️ **PLACEHOLDER FILES** - Replace with real audio!

## Current Status:
All sound files are silent placeholders for development.

## Download Real Sounds:

### Free Sources (Creative Commons):
1. **Freesound.org** - https://freesound.org
   - Search: "wind ambience", "singing bowl", "water stream"
   - Filter: Creative Commons licenses

2. **YouTube Audio Library** - https://studio.youtube.com/channel/UC.../music
   - 100% free to use
   - No attribution required

3. **Free Music Archive** - https://freemusicarchive.org
   - Various licenses available

### Recommended Downloads:

**wind.mp3** (Ambient wind loop):
- Search: "gentle wind" or "soft breeze"
- Duration: 30+ seconds
- Seamless loop preferred

**bell.mp3** (Transition chime):
- Search: "singing bowl" or "zen bell"
- Duration: 2-3 seconds
- Clear, resonant tone

**water.mp3** (Water ambience):
- Search: "stream" or "gentle water"
- Duration: 30+ seconds
- Peaceful, not too loud

**breath-tone.mp3** (Breathing guide):
- Search: "breathing tone" or "meditation drone"
- Duration: 4-8 seconds
- Soft, calming frequency

## Usage in App:
- Breath tool: wind (loop) + bell (transitions)
- Calm tool: wind (soft loop)
- Reflection: water (loop) + bell (new prompt)
- Grounding: water (loop) + bell (steps)

## File Requirements:
- Format: MP3
- Bitrate: 128-320kbps
- Size: < 1MB each (preferably < 500KB)
- Seamless loops for ambient sounds

## Testing:
The app will work without sounds (silent fallback).
Audio is optional but enhances the experience.
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('📄 Updated README.md with download instructions\n');
}

// Run placeholder creation if no arguments
if (process.argv.length === 2) {
  console.log('💡 Creating placeholder files for development...\n');
  createPlaceholderFiles();
}
