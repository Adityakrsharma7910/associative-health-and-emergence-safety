import { IncidentReportLog, StructuredEmergencyResponse } from '../types';

const REPORTS_KEY = 'safeguard_ai_reports_history';
const ACCESSIBILITY_KEY = 'safeguard_ai_accessibility';

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  autoReadAloud: boolean;
}

export function getStoredReports(): IncidentReportLog[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveIncidentReport(
  response: StructuredEmergencyResponse,
  userLocation?: string
): IncidentReportLog {
  const newLog: IncidentReportLog = {
    id: 'rep_' + Date.now(),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    incident: response.incident,
    urgency: response.urgency,
    category: response.category,
    summary: response.summary,
    location: userLocation || 'Campus Main Ground',
    source: response.source || 'ai',
  };

  try {
    const existing = getStoredReports();
    const updated = [newLog, ...existing].slice(0, 10); // Keep latest 10
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save report to localStorage', e);
  }

  return newLog;
}

export function clearReportHistory(): void {
  try {
    localStorage.removeItem(REPORTS_KEY);
  } catch {}
}

export function getAccessibilitySettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(ACCESSIBILITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    largeText: false,
    highContrast: false,
    autoReadAloud: false,
  };
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings));
  } catch {}
}
