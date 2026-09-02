import React from 'react';
import { 
  PhoneCall, 
  Globe, 
  Sparkles, 
  Accessibility, 
  Info, 
  BookOpen, 
  AlertTriangle 
} from 'lucide-react';
import { SupportedLanguage, LanguageOption } from '../types';
import { SafeGuardLogo } from './SafeGuardLogo';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenSOS: () => void;
  onOpenGuides: () => void;
  onOpenHazardReport: () => void;
  onOpenAccessibility: () => void;
  onOpenAbout: () => void;
  isAiReady?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish (Hindi in Roman)' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenSOS,
  onOpenGuides,
  onOpenHazardReport,
  onOpenAccessibility,
  onOpenAbout,
  isAiReady = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <SafeGuardLogo className="w-10 h-10 drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900">SafeGuard</span>
              <span className="font-black text-lg tracking-tight text-rose-600">AI</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ml-1">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Gemini 3.7
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 hidden sm:block tracking-wide">Act Fast. Stay Safe.</p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Guides Nav */}
          <button
            onClick={onOpenGuides}
            className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Browse Offline First-Aid Guides"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            First-Aid Cards
          </button>

          {/* Report Hazard Nav */}
          <button
            onClick={onOpenHazardReport}
            className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            title="Report Physical Hazard"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Report Hazard
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-selector" className="sr-only">Select Language</label>
            <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
              <select
                id="language-selector"
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
                aria-label="Application Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                    {lang.label} ({lang.nativeLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Accessibility & High Contrast"
            aria-label="Accessibility Options"
          >
            <Accessibility className="w-4 h-4" />
          </button>

          {/* About / Info */}
          <button
            onClick={onOpenAbout}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="About SafeGuard AI & Medical Disclaimer"
            aria-label="About and Safety Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Large SOS Button */}
          <button
            id="btn-navbar-sos"
            onClick={onOpenSOS}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/30 transition-all border border-rose-500"
            aria-label="Emergency SOS"
          >
            <PhoneCall className="w-4 h-4 animate-pulse text-white" />
            <span>SOS</span>
          </button>

        </div>
      </div>
    </header>
  );
};
