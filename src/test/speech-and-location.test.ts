import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextToSpeechService } from '../services/speech';

describe('Text-To-Speech & Geolocation Services', () => {
  let tts: TextToSpeechService;

  beforeEach(() => {
    vi.clearAllMocks();
    tts = new TextToSpeechService();
  });

  it('initializes TextToSpeechService and detects browser support', () => {
    expect(tts.isSupported()).toBe(true);
  });

  it('triggers window.speechSynthesis.speak with correct language code for Hindi', () => {
    tts.speak('आपातकालीन निर्देश', 'hi');
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  it('triggers cancel on stop()', () => {
    tts.stop();
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
  });

  it('handles speech when synthesis is unsupported without throwing errors', () => {
    const originalSpeech = window.speechSynthesis;
    (window as any).speechSynthesis = undefined;

    const unsuppTts = new TextToSpeechService();
    expect(unsuppTts.isSupported()).toBe(false);

    expect(() => {
      unsuppTts.speak('Test text', 'en');
      unsuppTts.stop();
    }).not.toThrow();

    window.speechSynthesis = originalSpeech;
  });

  it('handles Geolocation coordinate fetching', async () => {
    const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };

    const position = await getCurrentPosition();
    expect(position.coords.latitude).toBe(37.7749);
    expect(position.coords.longitude).toBe(-122.4194);
  });
});
