/**
 * Sound Downloader - Downloads audio files with retry logic
 * Web-optimized version using fetch + IndexedDB for caching
 */

export interface DownloadConfig {
  url: string;
  filename: string;
  maxRetries?: number;
}

export class SoundDownloader {
  private readonly DB_NAME = 'NaneVidaSounds';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'audio_files';
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB for audio caching
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'filename' });
        }
      };
    });
  }

  /**
   * Check if a sound file exists in cache
   */
  async exists(filename: string): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(filename);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  }

  /**
   * Get cached audio blob
   */
  async get(filename: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(filename);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => resolve(null);
    });
  }

  /**
   * Save audio blob to cache
   */
  private async save(filename: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({ filename, blob, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Download a sound file with retry logic
   */
  async download(config: DownloadConfig): Promise<string> {
    const { url, filename, maxRetries = 2 } = config;

    // Check if already cached
    const cached = await this.get(filename);
    if (cached) {
      return URL.createObjectURL(cached);
    }

    // Attempt download with retries
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[SoundDownloader] Downloading ${filename} (attempt ${attempt + 1}/${maxRetries + 1})`);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Validate it's audio
        if (!blob.type.startsWith('audio/')) {
          throw new Error(`Invalid content type: ${blob.type}`);
        }

        // Save to cache
        await this.save(filename, blob);

        // Return object URL
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`[SoundDownloader] Attempt ${attempt + 1} failed for ${filename}:`, error);

        if (attempt === maxRetries) {
          // Final failure - return silent fallback
          console.warn(`[SoundDownloader] All retries failed for ${filename}, using fallback`);
          return this.generateSilentFallback();
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }

    return this.generateSilentFallback();
  }

  /**
   * Download multiple files in parallel
   */
  async downloadAll(configs: DownloadConfig[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    await Promise.all(
      configs.map(async (config) => {
        const url = await this.download(config);
        results.set(config.filename, url);
      })
    );

    return results;
  }

  /**
   * Generate a silent audio fallback using Web Audio API
   */
  private generateSilentFallback(): string {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const duration = 1; // 1 second of silence
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);

      // Create offline context to render
      const offlineContext = new OfflineAudioContext(1, sampleRate * duration, sampleRate);
      const source = offlineContext.createBufferSource();
      source.buffer = buffer;
      source.connect(offlineContext.destination);
      source.start();

      // Return data URL (simplified - just return empty audio)
      return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    } catch (error) {
      console.error('[SoundDownloader] Failed to generate fallback:', error);
      return '';
    }
  }

  /**
   * Clear all cached sounds
   */
  async clearCache(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const downloader = new SoundDownloader();
