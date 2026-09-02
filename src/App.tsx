import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { EmergencyResult } from './components/EmergencyResult';
import { SOSModal } from './components/SOSModal';
import { HazardReportModal } from './components/HazardReportModal';
import { OfflineGuidesModal } from './components/OfflineGuidesModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { AboutModal } from './components/AboutModal';
import { 
  StructuredEmergencyResponse, 
  SupportedLanguage, 
  EmergencyContact, 
  UserLocation, 
  OfflineGuide, 
  DemoScenario, 
  IncidentReportLog 
} from './types';
import { 
  analyzeEmergency, 
  translateResponse, 
  fetchEmergencyContacts, 
  checkServerHealth 
} from './services/api';
import { 
  getStoredReports, 
  saveIncidentReport, 
  getAccessibilitySettings, 
  saveAccessibilitySettings,
  AccessibilitySettings 
} from './services/storage';
import { TextToSpeechService } from './services/speech';

const ttsService = new TextToSpeechService();

export function App() {
  const [activeResponse, setActiveResponse] = useState<StructuredEmergencyResponse | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Analyzing Situation...');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Modals
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isHazardOpen, setIsHazardOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Data
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [recentReports, setRecentReports] = useState<IncidentReportLog[]>([]);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(getAccessibilitySettings());
  const [isAiReady, setIsAiReady] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    setRecentReports(getStoredReports());
    
    // Fetch contacts
    fetchEmergencyContacts().then(setContacts);

    // Check health
    checkServerHealth().then((health) => {
      setIsAiReady(health.status === 'ok');
    });

    // Check saved settings
    setAccessibilitySettings(getAccessibilitySettings());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Request browser geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setUserLocation(loc);
        showToast('Campus GPS coordinates attached successfully.');
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        showToast('Location access denied. Continuing without GPS coordinates.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Main Emergency Analysis Flow
  const handleAnalyze = async (
    text: string, 
    imageData?: string, 
    imageMimeType?: string,
    isHazardMode: boolean = false
  ) => {
    setIsLoading(true);
    setLoadingStepText('Identifying incident & hazard type...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStepText('Evaluating immediate risks & urgency...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingStepText('Formulating structured first-response actions...');
    }, 2400);

    try {
      const result = await analyzeEmergency({
        text,
        imageData,
        imageMimeType,
        language: currentLanguage,
        isHazardMode,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);

      if (result.warning) {
        showToast(result.warning);
      }

      const responseData = result.data;
      setActiveResponse(responseData);

      // Save report
      const locationText = userLocation 
        ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
        : undefined;
      const updatedLog = saveIncidentReport(responseData, locationText);
      setRecentReports(getStoredReports());

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Auto read aloud if enabled in accessibility
      if (accessibilitySettings.autoReadAloud) {
        const speechText = `${responseData.incident}. Urgency: ${responseData.urgency}. ${responseData.summary}. Steps: ${responseData.steps.join('. ')}`;
        ttsService.speak(speechText, currentLanguage);
      }

    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      showToast('Emergency analysis encountered an error. Loading offline safety card.');
    }
  };

  // Demo Scenario Selector
  const handleSelectDemo = (demo: DemoScenario) => {
    setActiveResponse({ ...demo.mockResponse, language: currentLanguage });
    saveIncidentReport(demo.mockResponse, 'Campus Demo Ground');
    setRecentReports(getStoredReports());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded Demo Scenario: ${demo.title}`);
  };

  // Offline Guide Selector
  const handleSelectGuide = (guide: OfflineGuide) => {
    const response: StructuredEmergencyResponse = {
      incident: guide.title,
      category: guide.category,
      urgency: guide.urgency,
      summary: guide.shortSummary,
      steps: guide.steps,
      avoid: guide.avoid,
      redFlags: guide.redFlags,
      callEmergencyServices: guide.urgency === 'high',
      recommendedContact: guide.recommendedContact,
      disclaimer: 'SafeGuard AI provides general first-response guidance and does not replace trained medical professionals.',
      source: 'fallback',
      timestamp: new Date().toISOString(),
      language: currentLanguage,
    };
    setActiveResponse(response);
    saveIncidentReport(response, 'Campus First Aid Center');
    setRecentReports(getStoredReports());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language Change Flow
  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    setCurrentLanguage(newLang);
    if (!activeResponse) return;

    setIsTranslating(true);
    try {
      const translated = await translateResponse(activeResponse, newLang);
      setActiveResponse(translated);
    } catch {
      console.warn('Could not translate existing card.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUpdateAccessibility = (newSettings: AccessibilitySettings) => {
    setAccessibilitySettings(newSettings);
    saveAccessibilitySettings(newSettings);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      accessibilitySettings.highContrast 
        ? 'bg-slate-100 text-slate-950 font-semibold' 
        : 'bg-slate-50 text-slate-900'
    } ${accessibilitySettings.largeText ? 'text-lg' : 'text-base'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 bg-slate-900 text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 animate-slide-up flex items-center justify-between space-x-3">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        onOpenHazardReport={() => setIsHazardOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isAiReady={isAiReady}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {activeResponse ? (
          <EmergencyResult
            data={activeResponse}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onBack={() => {
              setActiveResponse(null);
              ttsService.stop();
            }}
            onOpenSOS={() => setIsSOSOpen(true)}
            isTranslating={isTranslating}
            userLocation={userLocation}
          />
        ) : (
          <Dashboard
            onAnalyze={handleAnalyze}
            onSelectDemo={handleSelectDemo}
            onSelectGuide={handleSelectGuide}
            onOpenHazardReport={() => setIsHazardOpen(true)}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            userLocation={userLocation}
            onRequestLocation={handleRequestLocation}
            recentReports={recentReports}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        contacts={contacts}
        userLocation={userLocation}
        onRequestLocation={handleRequestLocation}
      />

      <HazardReportModal
        isOpen={isHazardOpen}
        onClose={() => setIsHazardOpen(false)}
        onSubmitHazard={(text, img, mime) => handleAnalyze(text, img, mime, true)}
        userLocation={userLocation}
        onRequestLocation={handleRequestLocation}
        isLoading={isLoading}
      />

      <OfflineGuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
        onSelectGuide={handleSelectGuide}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        settings={accessibilitySettings}
        onUpdateSettings={handleUpdateAccessibility}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">SafeGuard AI</span>
            <span>— Multimodal Campus Emergency Safety Companion</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsAboutOpen(true)} className="hover:text-indigo-600 font-medium">
              Medical Disclaimer
            </button>
            <button onClick={() => setIsGuidesOpen(true)} className="hover:text-indigo-600 font-medium">
              Offline First-Aid
            </button>
            <button onClick={() => setIsSOSOpen(true)} className="text-rose-600 font-bold hover:underline">
              Campus SOS
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
