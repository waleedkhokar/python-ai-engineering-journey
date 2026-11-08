// Browser Push Notification & Medication Alarm System Service

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export interface TimeSlotConfig {
  morning: string;    // HH:MM 24hr format, e.g. "08:00"
  afternoon: string;  // HH:MM e.g. "13:00"
  evening: string;    // HH:MM e.g. "18:00"
  bedtime: string;    // HH:MM e.g. "22:00"
}

export interface NotificationLogItem {
  id: string;
  medicationName: string;
  dosage: string;
  timeSlot: string;
  timestamp: string; // ISO String
  type: 'scheduled' | 'test' | 'manual';
}

export interface ToastAlert {
  id: string;
  medicationId?: string;
  title: string;
  body: string;
  dosage?: string;
  timeLabel?: string;
  timestamp: Date;
}

const DEFAULT_TIME_SLOTS: TimeSlotConfig = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '18:00',
  bedtime: '22:00'
};

const STORAGE_KEY_SLOTS = 'dischargecare_time_slots_v1';
const STORAGE_KEY_SOUND = 'dischargecare_notification_sound_v1';
const STORAGE_KEY_LOGS = 'dischargecare_notification_logs_v1';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermissionState = (): NotificationPermissionState => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
};

export const requestNotificationPermission = async (): Promise<NotificationPermissionState> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const res = await Notification.requestPermission();
    return res as NotificationPermissionState;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return Notification.permission as NotificationPermissionState;
  }
};

export const getSavedTimeSlots = (): TimeSlotConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to parse saved time slots:', err);
  }
  return DEFAULT_TIME_SLOTS;
};

export const saveTimeSlots = (slots: TimeSlotConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
  } catch (err) {
    console.error('Failed to save time slots:', err);
  }
};

export const getSavedSoundPreference = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    if (saved !== null) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to read sound preference:', err);
  }
  return true; // default enabled
};

export const saveSoundPreference = (enabled: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(enabled));
  } catch (err) {
    console.error('Failed to save sound preference:', err);
  }
};

export const getSavedLogs = (): NotificationLogItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to read notification logs:', err);
  }
  return [];
};

export const addLogItem = (item: NotificationLogItem) => {
  try {
    const logs = getSavedLogs();
    const updated = [item, ...logs].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save log item:', err);
    return [];
  }
};

export const clearSavedLogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_LOGS);
  } catch (err) {
    console.error('Failed to clear logs:', err);
  }
};

// Gentle synthesized medical double-chime audio alert using Web Audio API
export const playMedicationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: High crisp D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Tone 2: Warm harmonic A5 (880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.2);
    gain2.gain.setValueAtTime(0.25, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.7);
  } catch (err) {
    console.error('Error playing web audio chime:', err);
  }
};

// Helper to convert timeLabel string like "8:00 AM" or scheduleTime to 24H "HH:MM"
export const convertToTarget24H = (
  timeLabel?: string, 
  scheduleTime?: string, 
  slots: TimeSlotConfig = DEFAULT_TIME_SLOTS
): string[] => {
  const times: string[] = [];

  // Parse timeLabel if it contains explicit AM/PM times
  if (timeLabel) {
    const timeMatch = timeLabel.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : null;

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      times.push(formatted);
    }
  }

  // Fallback to slot mapping if no explicit match
  if (times.length === 0 && scheduleTime) {
    const key = scheduleTime.toLowerCase();
    if (key === 'morning') times.push(slots.morning);
    else if (key === 'afternoon') times.push(slots.afternoon);
    else if (key === 'evening') times.push(slots.evening);
    else if (key === 'bedtime') times.push(slots.bedtime);
  }

  if (times.length === 0) {
    times.push(slots.morning); // Default fallback 8:00 AM
  }

  return times;
};

// Dispatch a native browser push notification
export const triggerBrowserPushNotification = (
  title: string, 
  body: string, 
  tag?: string,
  playSound = true
) => {
  if (playSound) {
    playMedicationChime();
  }

  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      const options: NotificationOptions & { renotify?: boolean; requireInteraction?: boolean } = {
        body,
        icon: '/favicon.ico',
        tag: tag || 'medication-reminder',
        renotify: true,
        requireInteraction: true // Keep on screen until acknowledged
      };
      new Notification(title, options);
    } catch (err) {
      console.error('Failed to instantiate browser Notification:', err);
    }
  }
};
