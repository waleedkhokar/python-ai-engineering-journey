import React from 'react';
import { Bell, Pill, Check, X, Sparkles, Volume2 } from 'lucide-react';
import { ToastAlert } from '../lib/notificationService';

interface NotificationToastBannerProps {
  toast: ToastAlert | null;
  onDismiss: () => void;
  onMarkTaken: (medicationId?: string) => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({
  toast,
  onDismiss,
  onMarkTaken
}) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-bounce-in shadow-2xl">
      <div className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-5 text-white space-y-3 shadow-blue-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/30 animate-pulse">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30">
                  Browser Push Alert
                </span>
                {toast.timeLabel && (
                  <span className="text-[10px] font-mono text-slate-300 font-bold">
                    {toast.timeLabel}
                  </span>
                )}
              </div>
              <h4 className="font-black text-sm text-white mt-0.5">{toast.title}</h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-relaxed relative z-10">
          {toast.body}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 relative z-10">
          <div className="flex items-center space-x-1.5 text-[10px] text-teal-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>Chime Alert Dispatched</span>
          </div>

          <div className="flex items-center space-x-2">
            {toast.medicationId && (
              <button
                onClick={() => onMarkTaken(toast.medicationId)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 uppercase tracking-wider"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Dose Taken</span>
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
