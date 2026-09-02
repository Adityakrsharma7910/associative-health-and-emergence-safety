import React, { useState, useRef } from 'react';
import { 
  X, 
  AlertTriangle, 
  Camera, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw,
  Send,
  Zap,
  Flame,
  AlertCircle
} from 'lucide-react';
import { UserLocation } from '../types';

interface HazardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitHazard: (text: string, imageData?: string, imageMimeType?: string) => void;
  userLocation: UserLocation | null;
  onRequestLocation: () => void;
  isLoading: boolean;
}

const COMMON_HAZARDS = [
  { label: 'Exposed Electrical Wire', icon: Zap },
  { label: 'Slippery / Wet Floor', icon: AlertCircle },
  { label: 'Broken Glass on Walkway', icon: AlertTriangle },
  { label: 'Fire / Heavy Smoke', icon: Flame },
  { label: 'Chemical / Acid Spill in Lab', icon: AlertTriangle },
  { label: 'Damaged Stairs / Loose Railing', icon: AlertCircle },
];

export const HazardReportModal: React.FC<HazardReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitHazard,
  userLocation,
  onRequestLocation,
  isLoading,
}) => {
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setError(null);
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: string) => {
    setDescription((prev) => (prev ? `${prev}. ${preset}` : preset));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !selectedImage) {
      setError('Please describe the hazard or take a photo.');
      return;
    }

    let fullText = `[CAMPUS HAZARD REPORT] ${description.trim()}`;
    if (locationName.trim()) {
      fullText += ` | Location: ${locationName.trim()}`;
    }
    if (userLocation) {
      fullText += ` (GPS: ${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)})`;
    }

    setError(null);
    onSubmitHazard(fullText, selectedImage || undefined, imageMimeType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hazard-modal-title"
      >
        {/* Header */}
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="hazard-modal-title" className="text-lg sm:text-xl font-black">Report Physical Campus Hazard</h2>
              <p className="text-xs text-amber-100 font-medium">Classify risk & notify facilities/security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Common Hazard Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_HAZARDS.map((h, i) => {
                const Icon = h.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePresetSelect(h.label)}
                    className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-800 transition-all flex items-center space-x-2"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{h.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location details */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Hazard Campus Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Science Block 2nd Floor, Hallway near Lab 204"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Hazard Details & Visible Danger
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what you see: sparks, water, smoke, sharp edges, anyone trapped..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-amber-600 focus:outline-none resize-none"
            />
          </div>

          {/* Image upload preview */}
          {selectedImage ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={selectedImage} alt="Hazard Preview" className="w-14 h-14 object-cover rounded-xl border border-slate-200" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Hazard Photo Attached</p>
                  <p className="text-[11px] text-slate-500">Gemini will evaluate physical hazard level</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 rounded-2xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Take Photo of Hazard / Upload</span>
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {/* Location button */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 font-medium truncate">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">
                {userLocation
                  ? `GPS: ${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                  : 'GPS Coordinates not shared'}
              </span>
            </div>
            {!userLocation && (
              <button
                type="button"
                onClick={onRequestLocation}
                className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px] shrink-0"
              >
                Add GPS
              </button>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Hazard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Generate Safety Actions</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
