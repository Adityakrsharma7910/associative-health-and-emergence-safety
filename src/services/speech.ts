import { SupportedLanguage } from '../types';

// Web Speech API Types
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.speechSynthesis);
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    langCode: string = 'en-US'
  ) {
    if (!this.recognition) {
      onError('Voice input is not supported on this browser.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }

    this.recognition.lang = langCode;

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Speech recognition encountered an issue.');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Unable to start microphone.');
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isListening = false;
  }
}

// Text-to-Speech Engine
export class TextToSpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  isSupported(): boolean {
    return isSpeechSynthesisSupported();
  }

  speak(
    text: string,
    language: SupportedLanguage = 'en',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (!isSpeechSynthesisSupported()) {
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.utterance = utterance;

    // Set voice language code
    if (language === 'hi' || language === 'hinglish') {
      utterance.lang = 'hi-IN';
    } else if (language === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (language === 'te') {
      utterance.lang = 'te-IN';
    } else if (language === 'es') {
      utterance.lang = 'es-ES';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95; // Slightly slower for clear emergency comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.utterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.utterance = null;
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.utterance = null;
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
