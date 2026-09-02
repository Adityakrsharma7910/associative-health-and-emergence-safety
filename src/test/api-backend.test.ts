import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../server/app.js';

describe('Backend Express API Security & Endpoints', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Endpoint (/api/health)', () => {
    it('returns status ok and security headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.appName).toBe('SafeGuard AI');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Emergency Contacts Endpoint (/api/emergency/contacts)', () => {
    it('returns list of verified campus emergency contacts', async () => {
      const res = await request(app).get('/api/emergency/contacts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.contacts)).toBe(true);
      expect(res.body.contacts.length).toBeGreaterThanOrEqual(3);
    });

    it('rejects POST method on /api/emergency/contacts with 405 Method Not Allowed', async () => {
      const res = await request(app).post('/api/emergency/contacts').send({});
      expect(res.status).toBe(405);
      expect(res.body.success).toBe(false);
      expect(res.headers['allow']).toContain('GET');
    });
  });

  describe('Emergency Analysis Endpoint (/api/emergency/analyze)', () => {
    it('rejects GET requests on /api/emergency/analyze with 405 Method Not Allowed', async () => {
      const res = await request(app).get('/api/emergency/analyze');
      expect(res.status).toBe(405);
      expect(res.body.success).toBe(false);
      expect(res.headers['allow']).toContain('POST');
    });

    it('rejects empty payload (no text, no image) with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/emergency/analyze')
        .send({ text: '', imageData: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Please provide a description');
    });

    it('rejects text that exceeds maximum length (2000 characters) with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/emergency/analyze')
        .send({ text: 'X'.repeat(2100) });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('too long');
    });

    it('rejects invalid image MIME types with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/emergency/analyze')
        .send({
          text: 'Check this image',
          imageData: 'dGVzdA==',
          imageMimeType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Unsupported image type');
    });

    it('successfully processes valid emergency text and returns structured response', async () => {
      const res = await request(app)
        .post('/api/emergency/analyze')
        .send({
          text: 'Student twisted ankle playing basketball on campus court',
          language: 'en',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.incident).toBeDefined();
      expect(Array.isArray(res.body.data.steps)).toBe(true);
      expect(Array.isArray(res.body.data.avoid)).toBe(true);
      expect(Array.isArray(res.body.data.redFlags)).toBe(true);
    });
  });

  describe('Translation Endpoint (/api/emergency/translate)', () => {
    it('rejects GET requests on /api/emergency/translate with 405 Method Not Allowed', async () => {
      const res = await request(app).get('/api/emergency/translate');
      expect(res.status).toBe(405);
      expect(res.body.success).toBe(false);
    });

    it('rejects missing payload with 400 Bad Request', async () => {
      const res = await request(app).post('/api/emergency/translate').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
