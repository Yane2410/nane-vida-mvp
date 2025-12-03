# Sound Assets

This folder contains audio files for the wellness tools.

## Required files:

1. **wind.mp3** - Ambient wind sound for breathing exercises and calm
2. **bell.mp3** - Bell chime for phase transitions
3. **water.mp3** - Gentle water sound for reflection
4. **breath-tone.mp3** - Soft breathing tone (optional)

## Usage:

These files are loaded by the `soundController.ts` utility and played in:
- Breath tool: wind (loop) + bell (phase changes)
- Calm tool: wind (soft loop)
- Reflection tool: water (loop) + bell (new question)
- Grounding tool: bell (step changes)

## Notes:

- Files should be MP3 format
- Recommended: 320kbps or 128kbps
- Keep file sizes reasonable (< 1MB each)
- Loop-friendly audio (seamless loops for wind/water)
