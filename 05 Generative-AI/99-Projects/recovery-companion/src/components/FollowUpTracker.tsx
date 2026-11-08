import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PhoneCall, 
  FileText, 
  Bell, 
  Download, 
  CheckCircle2, 
  UserCheck,
  Building
} from 'lucide-react';
import { FollowUpAppointment } from '../types';

interface FollowUpTrackerProps {
  appointments: FollowUpAppointment[];
  onToggleReminder: (id: string) => void;
  onOpenSourceModal: (quote: string, title: string) => void;
}

export const FollowUpTracker: React.FC<FollowUpTrackerProps> = ({
  appointments,
  onToggleReminder,
  onOpenSourceModal
}) => {
  const downloadIcsFile = (app: FollowUpAppointment) => {
    const cleanDate = app.date.replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DischargeCare AI//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:Follow-Up Appointment: ${app.providerName} (${app.specialty})
DESCRIPTION:${app.instructions} - Phone: ${app.phone}
LOCATION:${app.location}, ${app.address}
DTSTART:${cleanDate}T103000Z
DTEND:${cleanDate}T113000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FollowUp_${app.providerName.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-black">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black uppercase text-base tracking-widest text-slate-950">
              Follow-Up Visits & Clinic Appointments
            </h2>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Extracted schedule dates, clinic locations, and prep instructions
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 gap-5">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="glass-card rounded-3xl p-6 accent-border border-slate-200/80 shadow-sm transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex flex-col items-center justify-center font-black shrink-0 shadow-2xs">
                  <Calendar className="w-4 h-4 text-blue-600 mb-0.5" />
                  <span className="mono text-[11px] uppercase tracking-wider">{app.date}</span>
                </div>

                <div>
                  <h3 className="text-lg font-black uppercase tracking-wide text-slate-950">{app.providerName}</h3>
                  <p className="text-xs font-black uppercase tracking-wider text-blue-600 mt-0.5">{app.specialty}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="mono text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{app.time}</span>
                </span>
              </div>
            </div>

            {/* Location & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-black uppercase tracking-wider text-slate-900">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Clinic Location</span>
                </div>
                <p className="text-slate-800 font-bold">{app.location}</p>
                <p className="text-slate-500 font-medium">{app.address}</p>
                {app.phone && (
                  <p className="text-blue-600 font-black tracking-wider mt-1.5">Phone: {app.phone}</p>
                )}
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-black uppercase tracking-wider text-blue-950">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Preparation Instructions</span>
                </div>
                <p className="text-blue-900 leading-relaxed font-bold">
                  {app.instructions}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => onOpenSourceModal(app.sourceQuote, app.providerName)}
                className="text-slate-500 hover:text-slate-900 font-black uppercase tracking-wider text-[11px] flex items-center space-x-1 hover:underline"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Citation</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleReminder(app.id)}
                  className={`px-3.5 py-2 rounded-xl font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 text-xs ${
                    app.reminderSet
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{app.reminderSet ? 'Reminder Active' : 'Set Reminder'}</span>
                </button>

                <button
                  onClick={() => downloadIcsFile(app)}
                  className="px-4 py-2 bg-slate-900 text-white font-black uppercase tracking-wider text-xs rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export (.ics)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
