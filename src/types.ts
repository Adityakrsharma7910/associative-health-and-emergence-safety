export type UrgencyLevel = 'low' | 'moderate' | 'high';

export type IncidentCategory = 
  | 'injury' 
  | 'medical_illness' 
  | 'hazard' 
  | 'environmental' 
  | 'general';

export type SupportedLanguage = 
  | 'en' 
  | 'hi' 
  | 'hinglish' 
  | 'ta' 
  | 'te' 
  | 'bn' 
  | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export interface StructuredEmergencyResponse {
  incident: string;
  category: IncidentCategory | string;
  urgency: UrgencyLevel;
  summary: string;
  steps: string[];
  avoid: string[];
  redFlags: string[];
  callEmergencyServices: boolean;
  recommendedContact: string;
  disclaimer: string;
  criticalQuestions?: string[];
  hazardDetails?: {
    hazardType: string;
    riskLevel: string;
    notifyDepartment: string;
    immediateAction: string;
  };
  language?: SupportedLanguage | string;
  timestamp?: string;
  source?: 'ai' | 'fallback' | 'demo';
}

export interface EmergencyContact {
  id: string;
  title: string;
  subtitle: string;
  phone: string;
  type: 'security' | 'medical' | 'personal' | 'emergency';
  iconName: string;
  isPrimary?: boolean;
}

export interface OfflineGuide {
  id: string;
  title: string;
  category: string;
  urgency: UrgencyLevel;
  icon: string;
  shortSummary: string;
  steps: string[];
  avoid: string[];
  redFlags: string[];
  recommendedContact: string;
  keywords: string[];
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  urgency: UrgencyLevel;
  promptText: string;
  imagePlaceholder?: string;
  mockResponse: StructuredEmergencyResponse;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  timestamp: number;
}

export interface IncidentReportLog {
  id: string;
  timestamp: string;
  incident: string;
  urgency: UrgencyLevel;
  category: string;
  summary: string;
  location?: string;
  source: string;
}
