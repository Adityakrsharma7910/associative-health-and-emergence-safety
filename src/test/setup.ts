import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech API (speechSynthesis)
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    speaking: false,
    paused: false,
    pending: false,
    onvoiceschanged: null,
  },
  writable: true,
});

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(text: string = '') {
    this.text = text;
    this.lang = 'en-US';
    this.rate = 1;
    this.pitch = 1;
  }
}
(window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

// Mock Clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

// Mock Geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn((success) =>
    success({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    })
  ),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

// Mock @google/genai SDK for fast deterministic testing
vi.mock('@google/genai', () => {
  return {
    Type: {
      OBJECT: 'OBJECT',
      STRING: 'STRING',
      ARRAY: 'ARRAY',
      BOOLEAN: 'BOOLEAN',
      INTEGER: 'INTEGER',
      NUMBER: 'NUMBER',
    },
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            incident: 'Ankle Sprain on Basketball Court',
            category: 'injury',
            urgency: 'moderate',
            summary: 'Joint injury with swelling and localized discomfort.',
            steps: [
              'Rest the joint in an elevated position.',
              'Apply a cold ice pack wrapped in cloth for 15-20 minutes.',
              'Provide gentle support without wrapping too tightly.',
            ],
            avoid: ['Do not bear weight or perform vigorous massage.'],
            redFlags: ['Visible bone deformity', 'Inability to bear any weight'],
            callEmergencyServices: false,
            recommendedContact: 'Campus Medical Room',
            disclaimer: 'General emergency guidance.',
          }),
        }),
      };
    },
  };
});

