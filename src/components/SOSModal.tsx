import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  HeartPulse, 
  UserCheck, 
  PhoneCall, 
  MapPin, 
  Copy, 
  Check, 
  AlertOctagon,
  MessageSquare
} from 'lucide-react';
import { EmergencyContact, UserLocation } from '../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  userLocation: UserLocation | null;
  onRequestLocation: () => void;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  {
    id: 'campus-security',
    title: 'Campus Security & Safety',
    subtitle: '24/7 Emergency Dispatch',
    phone: '+1-800-555-0199',
    type: 'security',
    iconName: 'ShieldAlert',
    isPrimary: true,
  },
  {
    id: 'campus-medical',
    title: 'Campus Medical Room',
    subtitle: 'Nurse Station & Urgent Care',
    phone: '+1-800-555-0144',
    type: 'medical',
    iconName: 'HeartPulse',
    isPrimary: true,
  },
  {
    id: 'personal-contact',
    title: 'Personal ICE Contact',
    subtitle: 'Parent / Guardian',
    phone: '+1-800-555-0100',
    type: 'personal',
    iconName: 'UserCheck',
  },
];

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  contacts = [],
  userLocation,
  onRequestLocation,
}) => {
  const [copied, setCopied] = useState(false);
  const [alertSentStatus, setAlertSentStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayContacts = contacts && contacts.length > 0 ? contacts : DEFAULT_CONTACTS;

  const locationStr = userLocation
    ? `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`
    : 'Location not shared';

  const emergencyMessage = `🚨 EMERGENCY ALERT FROM SAFEGUARD AI 🚨
Need urgent assistance on campus!
Location: ${locationStr}
Time: ${new Date().toLocaleTimeString()}
Please respond immediately.`;

  const handleCopyAlert = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateAlert = (contactTitle: string) => {
    setAlertSentStatus(`Emergency alert prepared for ${contactTitle}. Opening communications...`);
    setTimeout(() => {
      setAlertSentStatus(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-rose-500/30 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sos-modal-title"
      >
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="sos-modal-title" className="text-xl font-extrabold tracking-tight">Emergency Assistance</h2>
              <p className="text-xs text-rose-100 font-medium">Confirm contact & dispatch help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Warning Banner */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              If someone is in immediate life-threatening danger, unconscious, or unresponsive, call national emergency services (911 / 112) or campus security directly without delay.
            </p>
          </div>

          {/* Location status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-slate-700 font-medium truncate">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">
                {userLocation ? (
                  <>GPS: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</>
                ) : (
                  'Location not attached'
                )}
              </span>
            </div>
            {!userLocation && (
              <button
                onClick={onRequestLocation}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold shrink-0 transition-colors"
              >
                Attach GPS
              </button>
            )}
          </div>

          {/* Contact Buttons */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Direct Call Options</p>
            
            {displayContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    contact.type === 'security' 
                      ? 'bg-rose-100 text-rose-700'
                      : contact.type === 'medical'
                      ? 'bg-blue-100 text-blue-700'
                      : contact.type === 'emergency'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {contact.type === 'security' && <ShieldAlert className="w-5 h-5" />}
                    {contact.type === 'medical' && <HeartPulse className="w-5 h-5" />}
                    {contact.type === 'personal' && <UserCheck className="w-5 h-5" />}
                    {contact.type === 'emergency' && <PhoneCall className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{contact.title}</h3>
                    <p className="text-xs text-slate-500">{contact.subtitle}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {/* SMS Link */}
                  <a
                    href={`sms:${contact.phone}?body=${encodeURIComponent(emergencyMessage)}`}
                    onClick={() => handleSimulateAlert(contact.title)}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    title={`Send SMS Alert to ${contact.title}`}
                    aria-label={`Send SMS to ${contact.title}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  {/* Phone Call Link */}
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center space-x-1 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
                    title={`Call ${contact.title}`}
                    aria-label={`Call ${contact.title}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Prepared Message Box */}
          <div className="p-3.5 bg-slate-100 rounded-2xl space-y-2 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Prepared Emergency Message</span>
              <button
                onClick={handleCopyAlert}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Message'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 select-all whitespace-pre-line">
              {emergencyMessage}
            </p>
          </div>

          {alertSentStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium text-center animate-fade-in">
              {alertSentStatus}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
