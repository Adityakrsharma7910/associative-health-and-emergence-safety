import React from 'react';
import { 
  X, 
  Accessibility, 
  Eye, 
  Volume2, 
  Type, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { AccessibilitySettings } from '../services/storage';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const toggleLargeText = () => {
    onUpdateSettings({ ...settings, largeText: !settings.largeText });
  };

  const toggleHighContrast = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const toggleAutoReadAloud = () => {
    onUpdateSettings({ ...settings, autoReadAloud: !settings.autoReadAloud });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-modal-title"
      >
        <div className="bg-indigo-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Accessibility className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-lg font-black">Accessibility Modes</h2>
              <p className="text-xs text-indigo-200 font-medium">Customize display & voice assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Large Text */}
          <div 
            onClick={toggleLargeText}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Larger Display Typography</h3>
                <p className="text-xs text-slate-500">Increases font sizes across emergency cards</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              settings.largeText ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
            }`}>
              {settings.largeText && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          {/* High Contrast */}
          <div 
            onClick={toggleHighContrast}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">High Contrast Mode</h3>
                <p className="text-xs text-slate-500">Boosts border definitions & contrast under stress</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              settings.highContrast ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
            }`}>
              {settings.highContrast && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          {/* Auto Read Aloud */}
          <div 
            onClick={toggleAutoReadAloud}
            className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Automatic Audio Read-Aloud</h3>
                <p className="text-xs text-slate-500">Automatically speaks steps when analysis completes</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
              settings.autoReadAloud ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
            }`}>
              {settings.autoReadAloud && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
