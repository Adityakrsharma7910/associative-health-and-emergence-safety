import { StructuredEmergencyResponse, EmergencyContact, SupportedLanguage } from '../types';
import { findMatchingFallbackGuide } from '../data/fallbackGuides';

export async function checkServerHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline', geminiConfigured: false };
  }
}

export async function fetchEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const res = await fetch('/api/emergency/contacts');
    if (!res.ok) throw new Error('Failed to fetch contacts');
    const data = await res.json();
    return data.contacts || [];
  } catch {
    // Fallback static contacts
    return [
      {
        id: 'campus-security',
        title: 'Campus Security & Safety',
        subtitle: '24/7 Rapid Response & Dispatch',
        phone: '+1-800-555-0199',
        type: 'security',
        iconName: 'ShieldAlert',
        isPrimary: true,
      },
      {
        id: 'campus-medical',
        title: 'Campus Medical Room',
        subtitle: 'Emergency First Aid & Nurse Station',
        phone: '+1-800-555-0144',
        type: 'medical',
        iconName: 'HeartPulse',
        isPrimary: true,
      },
      {
        id: 'personal-contact',
        title: 'Personal Emergency Contact',
        subtitle: 'Primary Guardian / ICE Contact',
        phone: '+1-800-555-0100',
        type: 'personal',
        iconName: 'UserCheck',
      },
      {
        id: 'national-emergency',
        title: 'National Emergency 911 / 112',
        subtitle: 'Paramedics & Fire Dept',
        phone: '911',
        type: 'emergency',
        iconName: 'PhoneCall',
      }
    ];
  }
}

export async function analyzeEmergency(params: {
  text?: string;
  imageData?: string;
  imageMimeType?: string;
  language?: SupportedLanguage | string;
  isHazardMode?: boolean;
}): Promise<{ data: StructuredEmergencyResponse; isFallback: boolean; warning?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const res = await fetch('/api/emergency/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.data) {
      return {
        data: json.data,
        isFallback: json.data.source === 'fallback',
        warning: json.warning,
      };
    }
    throw new Error('Invalid response structure');
  } catch (err: any) {
    console.warn('API call failed, using verified client fallback guide:', err.message);
    const fallback = findMatchingFallbackGuide(params.text || 'emergency');
    fallback.disclaimer = 'AI service temporarily unavailable. SafeGuard AI loaded this offline safety card.';
    return {
      data: fallback,
      isFallback: true,
      warning: 'AI assistance is temporarily unavailable. Showing offline safety protocol.',
    };
  }
}

export async function translateResponse(
  data: StructuredEmergencyResponse,
  targetLanguage: SupportedLanguage
): Promise<StructuredEmergencyResponse> {
  if (data.language === targetLanguage) return data;

  try {
    const res = await fetch('/api/emergency/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, targetLanguage }),
    });
    if (!res.ok) throw new Error('Translation failed');
    const json = await res.json();
    return json.data || data;
  } catch {
    return { ...data, language: targetLanguage };
  }
}
