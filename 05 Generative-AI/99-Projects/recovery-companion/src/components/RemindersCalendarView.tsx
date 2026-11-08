import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Pill, 
  CheckSquare, 
  Plus, 
  Bell, 
  MapPin, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Stethoscope,
  Volume2,
  VolumeX,
  Send,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Settings,
  History,
  Trash2,
  Check,
  Info
} from 'lucide-react';
import { DischargePlan, MedicationItem } from '../types';
import { useMedicationNotifications } from '../hooks/useMedicationNotifications';
import { TimeSlotConfig } from '../lib/notificationService';

interface RemindersCalendarViewProps {
  plan: DischargePlan;
  onOpenSourceModal: (quote?: string, title?: string) => void;
  notificationState: ReturnType<typeof useMedicationNotifications>;
}

export const RemindersCalendarView: React.FC<RemindersCalendarViewProps> = ({
  plan,
  onOpenSourceModal,
  notificationState
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(29);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const {
    permission,
    timeSlots,
    soundEnabled,
    logs,
    requestPermission,
    toggleSound,
    updateSlotTimes,
    sendTestAlert,
    triggerManualMedicationAlarm,
    clearLogs
  } = notificationState;

  const [editableSlots, setEditableSlots] = useState<TimeSlotConfig>(timeSlots);
  const [showSlotSettings, setShowSlotSettings] = useState(false);
  const [savedSlotSuccess, setSavedSlotSuccess] = useState(false);

  const handleSaveSlots = () => {
    updateSlotTimes(editableSlots);
    setSavedSlotSuccess(true);
    setTimeout(() => setSavedSlotSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn py-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-600/30 text-blue-300 font-black text-[10px] uppercase tracking-widest rounded-full border border-blue-500/30 flex items-center space-x-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Browser Push Notification Engine</span>
            </span>
            <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 font-bold text-[10px] rounded-full border border-teal-500/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Real-Time Medication Alarms</span>
            </span>
          </div>

          <h2 className="heavy-type text-2xl sm:text-4xl uppercase tracking-tight text-white leading-tight">
            Recovery Calendar & Push Notifications
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Never miss a dose or clinic appointment. Enable browser push alerts to receive time-sensitive desktop notifications and audio chime reminders synchronized with your medical recovery schedule.
          </p>
        </div>
      </div>

      {/* PUSH NOTIFICATION CONTROL PANEL BANNER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl flex items-center justify-center ${
              permission === 'granted' 
                ? 'bg-emerald-100 text-emerald-700' 
                : permission === 'denied' 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              <Bell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">
                  Push Notification Status:
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  permission === 'granted'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : permission === 'denied'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {permission === 'granted' ? 'Active & Armed' : permission === 'denied' ? 'Permission Blocked' : 'Permission Required'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {permission === 'granted' 
                  ? 'Your browser is ready to dispatch alerts at your exact medication schedule times.'
                  : permission === 'denied'
                  ? 'Browser notification permission is blocked in your browser site settings.'
                  : 'Click "Enable Browser Push Notifications" to authorize desktop medication alerts.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span>Enable Browser Push Notifications</span>
              </button>
            )}

            {/* Instant Test Push Alert Button */}
            <button
              onClick={() => sendTestAlert()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-sm transition-all flex items-center space-x-2"
            >
              <Send className="w-4 h-4 text-teal-400" />
              <span>Send Test Push Alert</span>
            </button>

            {/* Chime Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all border ${
                soundEnabled
                  ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-teal-600" />
                  <span>Audio Chime: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Audio Chime: OFF</span>
                </>
              )}
            </button>

            {/* Slot Config Settings Toggle */}
            <button
              onClick={() => setShowSlotSettings(!showSlotSettings)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black uppercase tracking-wider text-xs rounded-2xl border border-slate-200 transition-all flex items-center space-x-1.5"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Configure Schedule Times</span>
            </button>
          </div>
        </div>

        {/* Schedule Slot Config Panel */}
        {showSlotSettings && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Customize Daily Time Slot Alarms (24-Hour Format)</span>
              </span>
              <button
                onClick={handleSaveSlots}
                className="px-3 py-1.5 bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                {savedSlotSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Slot Times</span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Morning Dose
                </label>
                <input
                  type="time"
                  value={editableSlots.morning}
                  onChange={(e) => setEditableSlots({ ...editableSlots, morning: e.target.value })}
                  className="w-full font-mono text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Afternoon Dose
                </label>
                <input
                  type="time"
                  value={editableSlots.afternoon}
                  onChange={(e) => setEditableSlots({ ...editableSlots, afternoon: e.target.value })}
                  className="w-full font-mono text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Evening Dose
                </label>
                <input
                  type="time"
                  value={editableSlots.evening}
                  onChange={(e) => setEditableSlots({ ...editableSlots, evening: e.target.value })}
                  className="w-full font-mono text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Bedtime Dose
                </label>
                <input
                  type="time"
                  value={editableSlots.bedtime}
                  onChange={(e) => setEditableSlots({ ...editableSlots, bedtime: e.target.value })}
                  className="w-full font-mono text-xs font-bold text-slate-900 border border-slate-300 rounded-lg p-1.5 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Calendar & Active Alarms Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Calendar Grid Card */}
        <div className="lg:col-span-7 saas-card p-6 bg-white space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-black uppercase tracking-wider text-sm text-slate-900">
                July 2026 Schedule
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">July</span>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day) => {
                const isSelected = selectedDay === day;
                const hasFollowup = day === 29;
                const hasMeds = day >= 21;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square p-2 rounded-2xl flex flex-col items-center justify-between transition-all relative ${
                      isSelected
                        ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    <div className="flex items-center space-x-1">
                      {hasFollowup && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500'}`} />
                      )}
                      {hasMeds && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-teal-300' : 'bg-blue-500'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-[11px] font-bold text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Follow-Up Appointment</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Pill Schedule Active</span>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda Items */}
        <div className="lg:col-span-5 bento-card p-6 bg-slate-900 text-white border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">
                Selected Day Agenda
              </span>
              <h3 className="font-black uppercase tracking-wider text-base text-white">
                July {selectedDay}, 2026
              </h3>
            </div>
            <span className="mono text-xs font-bold text-slate-400">
              {selectedDay === 29 ? '1 Appointment' : 'Daily Routine'}
            </span>
          </div>

          {/* FollowUp Highlight if July 29 */}
          {selectedDay === 29 && plan.followUps.length > 0 && (
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Doctor Visit Scheduled
                </span>
                <span className="mono text-xs text-white font-bold">
                  {plan.followUps[0].time}
                </span>
              </div>

              <div>
                <h4 className="font-black text-sm text-white">{plan.followUps[0].providerName}</h4>
                <p className="text-xs text-teal-300 font-bold">{plan.followUps[0].specialty}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{plan.followUps[0].location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{plan.followUps[0].phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Armed Medication Alarms List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Armed Push Alarms for Recovery Plan
              </span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                {plan.medications.length} Active
              </span>
            </div>

            {plan.medications.map((med) => (
              <div key={med.id} className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{med.name} {med.dosage}</span>
                      <span className="text-[10px] text-slate-400">{med.frequency}</span>
                    </div>
                  </div>

                  <span className="mono text-[10px] font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                    {med.timeLabel || 'Scheduled'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Purpose: {med.purpose || 'Prescribed treatment'}
                  </span>

                  <button
                    onClick={() => triggerManualMedicationAlarm(med)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Trigger Alarm Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* NOTIFICATION LOG HISTORY */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="font-black uppercase tracking-wider text-sm text-slate-900">
              Recent Push Notification Dispatch Log
            </h3>
          </div>

          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-200/80">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              No Push Notifications Triggered Yet
            </p>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
              Click &quot;Send Test Push Alert&quot; above or wait for scheduled dose times to log browser alerts here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.type === 'scheduled' ? 'bg-emerald-500' : log.type === 'test' ? 'bg-blue-500' : 'bg-teal-500'
                  }`} />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {log.medicationName} ({log.dosage})
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Time Slot: {log.timeSlot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="mono text-[10px] text-slate-500 font-medium">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {log.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
