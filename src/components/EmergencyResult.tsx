import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Globe, 
  PhoneCall, 
  Share2, 
  Copy, 
  Check, 
  ShieldAlert, 
  ArrowLeft, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { StructuredEmergencyResponse, SupportedLanguage, UserLocation } from '../types';
import { TextToSpeechService } from '../services/speech';

interface EmergencyResultProps {
  data: StructuredEmergencyResponse;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onBack: () => void;
  onOpenSOS: () => void;
  isTranslating?: boolean;
  userLocation: UserLocation | null;
}

const ttsService = new TextToSpeechService();

export const EmergencyResult: React.FC<EmergencyResultProps> = ({
  data,
  currentLanguage,
  onLanguageChange,
  onBack,
  onOpenSOS,
  isTranslating = false,
  userLocation,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  const urgencyColorMap = {
    low: {
      bg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      label: 'LOW URGENCY — BASIC FIRST AID',
      sublabel: 'Standard first response. Monitor closely for changes.',
      icon: CheckCircle2,
    },
    moderate: {
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      label: 'MODERATE URGENCY — ATTENTION NEEDED',
      sublabel: 'Follow first-aid steps and seek evaluation from campus medical room.',
      icon: AlertTriangle,
    },
    high: {
      bg: 'bg-rose-600',
      lightBg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-900',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      label: 'HIGH URGENCY — IMMEDIATE ESCALATION',
      sublabel: 'Potential critical emergency. Contact emergency services or campus security now!',
      icon: AlertOctagon,
    },
  };

  const currentUrgency = urgencyColorMap[data.urgency] || urgencyColorMap.moderate;
  const UrgencyIcon = currentUrgency.icon;

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      setActiveStepIndex(null);
    } else {
      // Build speech text
      const speechParts = [
        `${data.incident}.`,
        `Urgency level: ${data.urgency}.`,
        data.summary,
        `Follow these steps:`,
        ...data.steps.map((step, idx) => `Step ${idx + 1}: ${step}`),
        `Important things to avoid:`,
        ...data.avoid,
        `Watch out for critical danger signs:`,
        ...data.redFlags,
      ];

      const fullText = speechParts.join(' ');
      setIsPlayingAudio(true);

      ttsService.speak(
        fullText,
        currentLanguage,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          setActiveStepIndex(null);
        },
        () => {
          setIsPlayingAudio(false);
          setActiveStepIndex(null);
        }
      );
    }
  };

  const locationCoords = userLocation
    ? `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`
    : 'Not attached';

  const preparedReportText = `[SafeGuard AI Incident Report]
Incident: ${data.incident}
Urgency: ${data.urgency.toUpperCase()}
Summary: ${data.summary}
Recommended Contact: ${data.recommendedContact}
Location: ${locationCoords}
Generated at: ${new Date().toLocaleTimeString()}
Source: SafeGuard AI Campus Companion`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(preparedReportText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Top Navigation & Status bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Audio Read Aloud Button */}
          <button
            onClick={handleToggleSpeech}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              isPlayingAudio
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
            title="Read instructions aloud via text-to-speech"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 Read Aloud</span>
              </>
            )}
          </button>

          {/* Language Toggle Pills */}
          <div className="inline-flex rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs">
            {(['en', 'hi', 'hinglish'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                disabled={isTranslating}
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLanguage === lang
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'Hinglish'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isTranslating && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center space-x-2 text-indigo-800 text-xs font-bold animate-pulse">
          <Globe className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Translating emergency instructions into {currentLanguage.toUpperCase()}...</span>
        </div>
      )}

      {/* Main Emergency Banner */}
      <div className={`rounded-3xl border-2 p-5 sm:p-6 shadow-md transition-all ${currentUrgency.lightBg} ${currentUrgency.border}`}>
        
        {/* Urgency Badge */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${currentUrgency.badge}`}>
                <UrgencyIcon className="w-3.5 h-3.5 mr-1.5" />
                {currentUrgency.label}
              </span>
              {data.source === 'fallback' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Offline Protocol
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 pt-1">
              {data.incident}
            </h1>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Emergency Escalation Button */}
          <button
            onClick={onOpenSOS}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-md transition-all flex items-center space-x-2 shrink-0 ${
              data.urgency === 'high'
                ? 'bg-rose-600 hover:bg-rose-700 animate-bounce'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Contacts</span>
          </button>
        </div>

        {/* High Severity Escalation Banner */}
        {data.urgency === 'high' && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-600 text-white flex items-start space-x-3 shadow-inner">
            <AlertOctagon className="w-6 h-6 text-white shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black uppercase tracking-wide">
                Seek professional emergency assistance immediately
              </p>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                Do not rely solely on basic first aid. Notify campus security or dial national emergency services right away.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Instructions (Primary focus) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">
              1-2-3
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              Immediate Action Steps
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {data.steps.length} Steps
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {data.steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                activeStepIndex === idx
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                {idx + 1}
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid & Red Flags (2 Column Layout on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Things to Avoid */}
        <div className="bg-white rounded-3xl border border-rose-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-rose-700">
            <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center font-black text-xs">
              ✕
            </div>
            <h3 className="text-sm font-bold tracking-tight uppercase">
              What NOT To Do (Avoid)
            </h3>
          </div>
          <ul className="space-y-2.5 pt-1">
            {data.avoid.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs font-semibold text-slate-700 leading-relaxed">
                <span className="text-rose-500 font-black text-sm shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Watch Out / Red Flags */}
        <div className="bg-white rounded-3xl border border-amber-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-sm font-bold tracking-tight uppercase">
              Watch For Danger Signs (Red Flags)
            </h3>
          </div>
          <ul className="space-y-2.5 pt-1">
            {data.redFlags.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs font-semibold text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Critical Questions / Smart Follow-up if any */}
      {data.criticalQuestions && data.criticalQuestions.length > 0 && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-md space-y-3">
          <div className="flex items-center space-x-2 text-indigo-300">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              Vital Victim Status Check
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {data.criticalQuestions.map((q, idx) => (
              <div key={idx} className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs font-medium text-slate-200 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Contact & Actions Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended Campus Contact</span>
          <p className="text-base font-extrabold text-slate-900">{data.recommendedContact}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMessage ? 'Report Copied' : 'Copy Emergency Summary'}</span>
          </button>
          
          <button
            onClick={onOpenSOS}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Contact</span>
          </button>
        </div>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-[11px] leading-relaxed text-center font-medium">
        <p>
          <span className="font-bold text-slate-700">Medical Disclaimer: </span>
          {data.disclaimer}
        </p>
      </div>

    </div>
  );
};
