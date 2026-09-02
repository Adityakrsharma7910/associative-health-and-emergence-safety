import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Send, 
  Flame, 
  Droplet, 
  Activity, 
  UserX, 
  AlertTriangle, 
  Zap, 
  FlaskConical, 
  AlertCircle, 
  ShieldAlert, 
  MapPin, 
  Compass, 
  PlayCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  OfflineGuide, 
  DemoScenario, 
  UserLocation, 
  IncidentReportLog 
} from '../types';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { FALLBACK_GUIDES } from '../data/fallbackGuides';
import { SpeechRecognitionService, isSpeechRecognitionSupported } from '../services/speech';
import { SafeGuardLogo } from './SafeGuardLogo';

interface DashboardProps {
  onAnalyze: (text: string, imageData?: string, imageMimeType?: string, isHazardMode?: boolean) => void;
  onSelectDemo: (demo: DemoScenario) => void;
  onSelectGuide: (guide: OfflineGuide) => void;
  onOpenHazardReport: () => void;
  isLoading: boolean;
  loadingStepText: string;
  userLocation: UserLocation | null;
  onRequestLocation: () => void;
  recentReports: IncidentReportLog[];
  onOpenSOS: () => void;
}

const speechService = new SpeechRecognitionService();

export const Dashboard: React.FC<DashboardProps> = ({
  onAnalyze,
  onSelectDemo,
  onSelectGuide,
  onOpenHazardReport,
  isLoading,
  loadingStepText,
  userLocation,
  onRequestLocation,
  recentReports,
  onOpenSOS,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [guideSearchQuery, setGuideSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording toggle
  const handleToggleVoice = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Voice input is not supported on this browser.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setIsRecording(true);
      speechService.start(
        (transcript) => {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (errorMsg) => {
          setIsRecording(false);
          setSpeechError(errorMsg);
          setTimeout(() => setSpeechError(null), 4000);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  // Image upload handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setValidationError('Please upload a valid image file (JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Image size must be under 10MB.');
      return;
    }

    setValidationError(null);
    setImageFileName(file.name);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) {
      setValidationError('Please describe the emergency in text or upload a photo.');
      return;
    }

    setValidationError(null);
    onAnalyze(inputText.trim(), selectedImage || undefined, imageMimeType);
  };

  // Filtered guides
  const filteredGuides = FALLBACK_GUIDES.filter((g) => {
    if (!guideSearchQuery.trim()) return true;
    const q = guideSearchQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.shortSummary.toLowerCase().includes(q) ||
      g.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const getGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return Droplet;
      case 'Flame': return Flame;
      case 'Activity': return Activity;
      case 'UserX': return UserX;
      case 'AlertTriangle': return AlertTriangle;
      case 'Zap': return Zap;
      case 'FlaskConical': return FlaskConical;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero & Quick Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-rose-200 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Emergency Assistance Companion</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Act Fast. Stay Safe.
              </h1>
            </div>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              AI-powered first-response guidance for campus accidents, injuries, and physical safety hazards. Describe what happened or upload a photo for instant, step-by-step actions.
            </p>

            {/* Quick Demo Selector Chips */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                <PlayCircle className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                Try Instant Demo Scenarios:
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_SCENARIOS.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => onSelectDemo(demo)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-semibold text-slate-100 transition-all flex items-center space-x-1.5"
                  >
                    <span className={`w-2 h-2 rounded-full ${demo.urgency === 'high' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    <span>{demo.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Logo Showcase Widget */}
          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shrink-0 w-52 shadow-2xl">
            <SafeGuardLogo className="w-24 h-24 drop-shadow-xl" />
            <div className="text-center mt-2.5">
              <div className="flex items-center justify-center space-x-1">
                <span className="font-extrabold text-sm text-white tracking-tight">SafeGuard</span>
                <span className="font-extrabold text-sm text-rose-400 tracking-tight">AI</span>
                <span className="text-sky-400 text-xs">✦</span>
              </div>
              <p className="text-[10px] text-slate-300 font-bold mt-0.5 tracking-wider">Act Fast. Stay Safe.</p>
            </div>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Emergency Input Form */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-7 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Describe the Emergency or Hazard
              </h2>
              <p className="text-xs text-slate-500 font-medium">Text, Photo, or Voice input supported</p>
            </div>
          </div>
          
          {/* Audio recording badge */}
          {isRecording && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5 animate-ping" />
              Listening...
            </span>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Main Textarea */}
          <div className="relative">
            <textarea
              id="emergency-description-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. My friend fell down the stairs near the library, his ankle is swelling rapidly and he cannot stand..."
              rows={3}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all resize-none"
              disabled={isLoading}
            />

            {/* Voice Mic inside Textarea */}
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                    : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                }`}
                title={isRecording ? 'Stop voice recording' : 'Speak your emergency'}
                aria-label="Voice input"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Speech Error Warning */}
          {speechError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-800 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Validation Error Warning */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Image Upload Preview & Attachment Bar */}
          {selectedImage && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={selectedImage}
                  alt="Emergency Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{imageFileName || 'Uploaded Photo'}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Ready for multimodal analysis</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            {/* Photo / Camera Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all border border-slate-200"
            >
              <Camera className="w-4 h-4 text-slate-600" />
              <span>{selectedImage ? 'Change Photo' : 'Attach Photo / Camera'}</span>
            </button>

            {/* Analyze Button */}
            <button
              id="btn-analyze-emergency"
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white shadow-lg transition-all ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-600/30'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{loadingStepText || 'Analyzing Situation...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Emergency Now</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Quick Location & Campus SOS Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Geolocation Card */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Campus GPS Location</h3>
                <p className="text-xs text-slate-500">Attach coordinates to emergency alerts</p>
              </div>
            </div>

            <button
              onClick={onRequestLocation}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
            >
              {userLocation ? 'Update GPS' : 'Share Location'}
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-700">
            {userLocation ? (
              <>
                <div className="truncate">
                  <span className="font-bold text-slate-900">Coordinates: </span>
                  {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
                </div>
                <a
                  href={`https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 rounded-lg text-indigo-600 font-bold border border-slate-200 shrink-0 ml-2"
                >
                  Open Maps
                </a>
              </>
            ) : (
              <span className="text-slate-500 italic">
                Location permission not granted. Tap "Share Location" to enable instant GPS dispatch.
              </span>
            )}
          </div>
        </div>

        {/* SOS Quick Trigger Card */}
        <div className="bg-rose-50 rounded-3xl border border-rose-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 text-rose-800">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-extrabold">Instant Campus SOS</h3>
          </div>
          <p className="text-xs text-rose-900/80 font-medium">
            Direct access to Campus Security, Medical Dispatch, and ICE Contacts.
          </p>
          <button
            onClick={onOpenSOS}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Open Emergency Dial</span>
          </button>
        </div>

      </div>

      {/* Quick Action Emergency Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Quick First-Aid Action Cards
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verified offline protocols for common incidents</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={guideSearchQuery}
              onChange={(e) => setGuideSearchQuery(e.target.value)}
              placeholder="Search guides (burn, cut, shock)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredGuides.map((guide) => {
            const Icon = getGuideIcon(guide.icon);
            return (
              <div
                key={guide.id}
                onClick={() => onSelectGuide(guide)}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    guide.urgency === 'high'
                      ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
                      : guide.urgency === 'moderate'
                      ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    guide.urgency === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : guide.urgency === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {guide.urgency}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {guide.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-1">
                    {guide.shortSummary}
                  </p>
                </div>

                <div className="flex items-center text-[11px] font-bold text-indigo-600 pt-1 group-hover:translate-x-1 transition-transform">
                  <span>View Steps</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campus Hazard Mode Feature Callout */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Campus Physical Safety Hazard
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Encountered Exposed Wire, Chemical Spill, or Broken Glass?
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Use the Hazard Camera to categorize the danger level and dispatch campus maintenance or security immediately.
          </p>
        </div>

        <button
          onClick={onOpenHazardReport}
          className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-600/20 shrink-0 transition-all flex items-center space-x-1.5"
        >
          <Camera className="w-4 h-4" />
          <span>Report Safety Hazard</span>
        </button>
      </div>

      {/* Demo Reports History (Local Storage) */}
      {recentReports.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-extrabold text-slate-900">Recent Incident History</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Saved Locally</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentReports.slice(0, 4).map((rep) => (
              <div key={rep.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5 truncate pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{rep.incident}</span>
                    <span className={`px-2 py-0.2 rounded-md text-[9px] font-extrabold uppercase ${
                      rep.urgency === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : rep.urgency === 'moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {rep.urgency}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{rep.summary}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">{rep.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
