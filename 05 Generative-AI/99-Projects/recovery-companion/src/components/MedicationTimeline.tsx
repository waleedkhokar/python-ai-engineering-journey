import React from 'react';
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Clock, 
  Pill, 
  Check, 
  Plus, 
  FileText, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MedicationItem } from '../types';

interface MedicationTimelineProps {
  medications: MedicationItem[];
  onToggleTaken?: (id: string) => void;
  onOpenSourceModal?: (quote: string, title: string) => void;
}

export const MedicationTimeline: React.FC<MedicationTimelineProps> = ({
  medications,
  onToggleTaken,
  onOpenSourceModal
}) => {
  const sections = [
    {
      id: 'morning',
      title: 'Morning',
      timeSlot: '8:00 AM',
      description: 'Breakfast & early morning doses',
      icon: Sunrise,
      accentBg: 'bg-amber-500/10',
      accentText: 'text-amber-700',
      accentBorder: 'border-amber-300',
      nodeBg: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      matchKeys: ['morning', 'am', 'breakfast']
    },
    {
      id: 'afternoon',
      title: 'Afternoon',
      timeSlot: '1:00 PM',
      description: 'Midday & post-lunch doses',
      icon: Sun,
      accentBg: 'bg-sky-500/10',
      accentText: 'text-sky-700',
      accentBorder: 'border-sky-300',
      nodeBg: 'bg-sky-500',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
      matchKeys: ['afternoon', 'noon', 'midday', 'lunch']
    },
    {
      id: 'evening',
      title: 'Evening',
      timeSlot: '6:00 PM - 8:00 PM',
      description: 'Dinner & early evening doses',
      icon: Sunset,
      accentBg: 'bg-indigo-500/10',
      accentText: 'text-indigo-700',
      accentBorder: 'border-indigo-300',
      nodeBg: 'bg-indigo-500',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      matchKeys: ['evening', 'dinner', 'pm']
    },
    {
      id: 'night',
      title: 'Night',
      timeSlot: '10:00 PM / Bedtime',
      description: 'Bedtime & overnight doses',
      icon: Moon,
      accentBg: 'bg-slate-900/10',
      accentText: 'text-slate-800',
      accentBorder: 'border-slate-400',
      nodeBg: 'bg-slate-900',
      badgeBg: 'bg-slate-900 text-white border-slate-800',
      matchKeys: ['bedtime', 'night', 'sleep']
    }
  ];

  // Helper to place medication into the best matching section
  const getMedsForSection = (sectionId: string, matchKeys: string[]) => {
    return medications.filter((m) => {
      const sched = (m.scheduleTime || '').toLowerCase();
      const timeLabel = (m.timeLabel || '').toLowerCase();
      const inst = (m.specialInstructions || m.purpose || '').toLowerCase();

      if (sched === sectionId) return true;
      if (sectionId === 'night' && (sched === 'bedtime' || sched === 'night')) return true;

      return matchKeys.some(k => sched.includes(k) || timeLabel.includes(k) || inst.includes(k));
    });
  };

  // Any unmatched meds (or 'as_needed' / 'all') if needed, can default to morning or show in PRN
  const asNeededMeds = medications.filter(
    m => (m.scheduleTime || '').toLowerCase() === 'as_needed' || (m.scheduleTime || '').toLowerCase() === 'prn'
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-1 bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-xs flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Visual Timeline</span>
            </span>
            <span className="mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              4 Time Slots
            </span>
          </div>
          <h2 className="heavy-type text-2xl sm:text-3xl text-slate-950 uppercase">
            Medication Schedule Timeline
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{medications.filter(m => m.takenToday).length}/{medications.length} Doses Logged Today</span>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-7 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-amber-400 before:via-sky-400 before:via-indigo-400 before:to-slate-900 before:rounded-full">
        {sections.map((sec) => {
          const IconComponent = sec.icon;
          const sectionMeds = getMedsForSection(sec.id, sec.matchKeys);
          const completedCount = sectionMeds.filter(m => m.takenToday).length;

          return (
            <div key={sec.id} className="relative group">
              {/* Timeline Connector Dot */}
              <div className={`absolute -left-4 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${sec.nodeBg} text-white flex items-center justify-center shadow-md ring-4 ring-white z-10 transition-transform group-hover:scale-110`}>
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>

              {/* Section Box Container */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 ml-3 sm:ml-4">
                
                {/* Section Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${sec.accentBg} ${sec.accentText}`}>
                      <IconComponent className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black uppercase text-base sm:text-lg text-slate-950 tracking-wide">
                          {sec.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${sec.badgeBg}`}>
                          {sec.timeSlot}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {sec.description}
                      </p>
                    </div>
                  </div>

                  {sectionMeds.length > 0 && (
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                      <span className={completedCount === sectionMeds.length ? 'text-emerald-600 font-extrabold' : 'text-slate-800'}>
                        {completedCount}/{sectionMeds.length} Completed
                      </span>
                    </div>
                  )}
                </div>

                {/* Cards Container inside Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionMeds.length === 0 ? (
                    <div className="col-span-full p-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium">
                      No scheduled prescriptions for {sec.title}.
                    </div>
                  ) : (
                    sectionMeds.map((med) => (
                      <div
                        key={med.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                          med.takenToday 
                            ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="font-black text-sm text-slate-950 uppercase tracking-tight block">
                                {med.name}
                              </span>
                              {med.genericName && med.genericName !== med.name && (
                                <span className="text-[11px] text-slate-500 font-medium block">
                                  ({med.genericName})
                                </span>
                              )}
                            </div>

                            {med.dosage && (
                              <span className="mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg shrink-0">
                                {med.dosage}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                            <p><strong>Instructions:</strong> {med.specialInstructions || med.purpose || 'Take as directed.'}</p>
                            {med.frequency && (
                              <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Frequency: {med.frequency}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Action Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                          {med.remainingQuantity !== undefined && (
                            <span className={`text-[10px] font-bold ${
                              med.remainingQuantity <= (med.refillThreshold || 5)
                                ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200'
                                : 'text-slate-500'
                            }`}>
                              Qty: {med.remainingQuantity} doses
                            </span>
                          )}

                          {onToggleTaken && (
                            <button
                              onClick={() => onToggleTaken(med.id)}
                              className={`ml-auto px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                                med.takenToday
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-900 hover:bg-teal-600 text-white shadow-xs'
                              }`}
                            >
                              {med.takenToday ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Logged</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Log Dose</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* As Needed (PRN) Extra Section if present */}
        {asNeededMeds.length > 0 && (
          <div className="relative group">
            <div className="absolute -left-4 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md ring-4 ring-white z-10">
              <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 ml-3 sm:ml-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                    <Pill className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-base sm:text-lg text-slate-950 tracking-wide">
                      As Needed (PRN Medications)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Take only when specific symptoms occur as prescribed
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {asNeededMeds.map((med) => (
                  <div key={med.id} className="p-4 bg-teal-50/40 rounded-2xl border border-teal-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-950 uppercase">{med.name}</span>
                      <span className="mono text-xs font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {med.specialInstructions || med.purpose || 'Take as needed for symptom relief.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
