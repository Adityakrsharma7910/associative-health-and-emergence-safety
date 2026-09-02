import React from 'react';
import { 
  X, 
  Sparkles, 
  AlertOctagon, 
  Globe, 
  WifiOff, 
  PhoneCall 
} from 'lucide-react';
import { SafeGuardLogo } from './SafeGuardLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <SafeGuardLogo className="w-11 h-11 drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg text-white">SafeGuard</span>
                <span className="font-black text-lg text-rose-500">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Multimodal Campus Health & Emergency Safety Companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
              The Challenge & Vision
            </h3>
            <p className="text-slate-600">
              During minor medical incidents or physical safety hazards on a college campus, students often panic, struggle to remember first-aid steps, or face language barriers. SafeGuard AI provides rapid, structured, multimodal first-response guidance powered by Google's Gemini 3.7 AI.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Multimodal Gemini AI</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Analyzes text descriptions, camera snapshots, or voice input to identify injuries and hazards accurately.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                <Globe className="w-4 h-4" />
                <span>Multilingual & Voice</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Switch instructions between English, Hindi, and Hinglish with one tap, plus speech synthesis read-aloud.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
                <PhoneCall className="w-4 h-4" />
                <span>Campus SOS Dispatch</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Direct one-touch contact with Campus Security, Medical Center, and ICE with live GPS coordinates.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs">
                <WifiOff className="w-4 h-4" />
                <span>Fail-Safe Offline Protocols</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Pre-stored verified first-aid cards operate seamlessly even during network outages or API downtime.
              </p>
            </div>

          </div>

          {/* Responsible AI & Safety Rules */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
            <h4 className="font-extrabold text-xs text-rose-900 uppercase tracking-wider flex items-center">
              <AlertOctagon className="w-4 h-4 mr-1 text-rose-600" />
              Responsible AI & Medical Disclaimer
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              SafeGuard AI is designed as a first-response companion and does NOT provide formal medical diagnoses, clinical treatments, or prescription drug advice. In serious emergencies, it strictly prioritizes human escalation to trained campus medical responders or emergency services (911 / 112).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
