import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Droplet, 
  Flame, 
  Activity, 
  UserX, 
  AlertTriangle, 
  Zap, 
  FlaskConical, 
  AlertCircle,
  Shield,
  ChevronRight
} from 'lucide-react';
import { FALLBACK_GUIDES } from '../data/fallbackGuides';
import { OfflineGuide } from '../types';

interface OfflineGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuide: (guide: OfflineGuide) => void;
}

export const OfflineGuidesModal: React.FC<OfflineGuidesModalProps> = ({
  isOpen,
  onClose,
  onSelectGuide,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'injury', label: 'Physical Injuries' },
    { id: 'medical_illness', label: 'Medical Emergencies' },
    { id: 'hazard', label: 'Campus Hazards' },
  ];

  const filtered = FALLBACK_GUIDES.filter((g) => {
    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.shortSummary.toLowerCase().includes(q) ||
      g.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
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
      case 'Shield': return Shield;
      default: return AlertCircle;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guides-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="guides-modal-title" className="text-lg sm:text-xl font-black">Offline First-Aid & Safety Cards</h2>
              <p className="text-xs text-slate-400 font-medium">Verified protocols accessible anytime without internet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by symptom or hazard (bleeding, sprain, burn, shock)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  categoryFilter === c.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guides List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-medium">
              No matching first-aid guides found. Try searching for "burn", "cut", "faint", or "wire".
            </div>
          ) : (
            filtered.map((guide) => {
              const Icon = getGuideIcon(guide.icon);
              return (
                <div
                  key={guide.id}
                  onClick={() => {
                    onSelectGuide(guide);
                    onClose();
                  }}
                  className="pt-2.5 pb-2.5 first:pt-0 flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3 truncate pr-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      guide.urgency === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : guide.urgency === 'moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {guide.title}
                        </h3>
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                          guide.urgency === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : guide.urgency === 'moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {guide.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {guide.shortSummary}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} protocols available offline</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
