import { describe, it, expect } from 'vitest';
import {
  validateAndSanitizeText,
  validateImageUpload,
  validateGeminiOutput,
  MAX_TEXT_LENGTH,
  MAX_IMAGE_SIZE_BYTES,
} from '../../server/security.js';

describe('Security & Input Validation', () => {
  describe('Text Input Validation & Sanitization', () => {
    it('accepts valid emergency description', () => {
      const result = validateAndSanitizeText('Student fell from bicycle and has a deep scrape on knee.');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Student fell from bicycle and has a deep scrape on knee.');
      expect(result.error).toBeUndefined();
    });

    it('sanitizes and strips non-printable control characters', () => {
      const maliciousInput = 'Student fainted\x00\x07\x1F near the lab.';
      const result = validateAndSanitizeText(maliciousInput);
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Student fainted near the lab.');
      expect(result.sanitized).not.toContain('\x00');
    });

    it('rejects text exceeding MAX_TEXT_LENGTH (2000 chars)', () => {
      const longText = 'A'.repeat(MAX_TEXT_LENGTH + 50);
      const result = validateAndSanitizeText(longText);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('rejects non-string text types safely', () => {
      const result = validateAndSanitizeText(12345 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a valid string');
    });

    it('handles undefined or null gracefully', () => {
      const resultNull = validateAndSanitizeText(null);
      expect(resultNull.isValid).toBe(true);
      expect(resultNull.sanitized).toBe('');

      const resultUndef = validateAndSanitizeText(undefined);
      expect(resultUndef.isValid).toBe(true);
      expect(resultUndef.sanitized).toBe('');
    });
  });

  describe('Image Upload Validation', () => {
    it('accepts valid JPEG base64 payload', () => {
      // Minimal valid JPEG header (FF D8 FF E0 ...)
      const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
      const base64 = jpegHeader.toString('base64');
      const result = validateImageUpload(`data:image/jpeg;base64,${base64}`, 'image/jpeg');

      expect(result.isValid).toBe(true);
      expect(result.mimeType).toBe('image/jpeg');
      expect(result.cleanBase64).toBe(base64);
    });

    it('accepts valid PNG base64 payload', () => {
      // Minimal valid PNG header (89 50 4E 47 0D 0A 1A 0A)
      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const base64 = pngHeader.toString('base64');
      const result = validateImageUpload(`data:image/png;base64,${base64}`, 'image/png');

      expect(result.isValid).toBe(true);
      expect(result.mimeType).toBe('image/png');
    });

    it('rejects unsupported MIME types (e.g. image/gif, text/plain, application/pdf)', () => {
      const result = validateImageUpload('somebase64', 'image/gif');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unsupported image type');
    });

    it('rejects PDF file even if disguised as image MIME', () => {
      // PDF header: %PDF-1.5
      const pdfHeader = Buffer.from('%PDF-1.5 fake pdf content', 'utf8');
      const base64 = pdfHeader.toString('base64');
      const result = validateImageUpload(base64, 'image/jpeg');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('PDF documents are not supported');
    });

    it('rejects Windows executable signature (MZ header)', () => {
      const exeHeader = Buffer.from([0x4d, 0x5a, 0x90, 0x00]);
      const base64 = exeHeader.toString('base64');
      const result = validateImageUpload(base64, 'image/png');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Executable files are strictly rejected');
    });

    it('rejects HTML/Script tags in image payload', () => {
      const scriptHeader = Buffer.from('<script>alert(1)</script>', 'utf8');
      const base64 = scriptHeader.toString('base64');
      const result = validateImageUpload(base64, 'image/png');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('rejected');
    });
  });

  describe('Gemini Output Schema Validation', () => {
    it('validates a complete, structured emergency response', () => {
      const sampleAiOutput = {
        incident: 'Second-Degree Thermal Burn',
        category: 'injury',
        urgency: 'moderate',
        summary: 'A minor boiling water burn on forearm with redness and blister formation.',
        steps: [
          'Cool burn under gentle cool running water for 15 minutes.',
          'Remove tight jewelry or wristbands immediately.',
          'Cover loosely with a clean, non-stick dressing.',
        ],
        avoid: ['Do not apply ice, butter, or toothpaste.', 'Do not pop or drain blisters.'],
        redFlags: ['Blistering larger than 3 inches', 'Severe numbness or white charred skin'],
        callEmergencyServices: false,
        recommendedContact: 'Campus Medical Room',
        disclaimer: 'SafeGuard AI provides first-response guidelines.',
      };

      const result = validateGeminiOutput(sampleAiOutput, 'hot water burn', 'en');
      expect(result.incident).toBe('Second-Degree Thermal Burn');
      expect(result.urgency).toBe('moderate');
      expect(result.steps.length).toBe(3);
      expect(result.avoid.length).toBe(2);
      expect(result.redFlags.length).toBe(2);
      expect(result.source).toBe('ai');
    });

    it('normalizes invalid urgency values to moderate or escalates on critical keywords', () => {
      const malformedOutput = {
        incident: 'Unconscious Student in Hallway',
        category: 'medical_illness',
        urgency: 'EXTREME_DANGER_CUSTOM_INVALID',
        summary: 'Student collapsed and is unresponsive.',
        steps: ['Call emergency help immediately.', 'Check breathing.'],
      };

      const result = validateGeminiOutput(malformedOutput, 'student is unconscious and not responding');
      expect(result.urgency).toBe('high'); // Critical keyword escalation to high
      expect(result.callEmergencyServices).toBe(true);
    });

    it('provides safe fallback when AI output is completely empty or null', () => {
      const result = validateGeminiOutput(null, 'bleeding wound', 'en');
      expect(result).toBeDefined();
      expect(result.incident).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.avoid.length).toBeGreaterThan(0);
      expect(result.redFlags.length).toBeGreaterThan(0);
    });
  });
});
