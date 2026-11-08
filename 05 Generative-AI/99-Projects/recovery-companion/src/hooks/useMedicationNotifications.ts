import { useState, useEffect, useCallback, useRef } from 'react';
import { DischargePlan, MedicationItem } from '../types';
import { 
  NotificationPermissionState, 
  TimeSlotConfig, 
  NotificationLogItem, 
  ToastAlert,
  getNotificationPermissionState,
  requestNotificationPermission,
  getSavedTimeSlots,
  saveTimeSlots,
  getSavedSoundPreference,
  saveSoundPreference,
  getSavedLogs,
  addLogItem,
  clearSavedLogs,
  convertToTarget24H,
  triggerBrowserPushNotification
} from '../lib/notificationService';

export function useMedicationNotifications(
  plan: DischargePlan,
  onToggleMedicationTaken?: (medicationId: string) => void
) {
  const [permission, setPermission] = useState<NotificationPermissionState>('default');
  const [timeSlots, setTimeSlots] = useState<TimeSlotConfig>(getSavedTimeSlots());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(getSavedSoundPreference());
  const [logs, setLogs] = useState<NotificationLogItem[]>(getSavedLogs());
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);

  // Set of keys triggered today to prevent duplicate alerts
  const triggeredKeysRef = useRef<Set<string>>(new Set());

  // Initialize permission state on mount
  useEffect(() => {
    setPermission(getNotificationPermissionState());
  }, []);

  // Sync saved logs
  const reloadLogs = useCallback(() => {
    setLogs(getSavedLogs());
  }, []);

  // Request browser push notification permission
  const handleRequestPermission = async () => {
    const newState = await requestNotificationPermission();
    setPermission(newState);
    if (newState === 'granted') {
      // Send welcoming confirmation notification
      triggerBrowserPushNotification(
        'DischargeCare AI Notifications Active!',
        'You will receive browser alerts at your scheduled medication times.',
        'welcome-push',
        soundEnabled
      );
    }
    return newState;
  };

  // Toggle audio chime sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveSoundPreference(next);
  };

  // Update morning/afternoon/evening/bedtime slot target times
  const handleUpdateSlotTimes = (newSlots: TimeSlotConfig) => {
    setTimeSlots(newSlots);
    saveTimeSlots(newSlots);
  };

  // Send a immediate test push alert
  const sendTestAlert = (customName?: string, customDosage?: string) => {
    const medName = customName || 'Ticagrelor (Brilinta)';
    const dosage = customDosage || '90mg';

    triggerBrowserPushNotification(
      `🔔 Test Medication Alarm: ${medName}`,
      `Scheduled Dose: ${dosage}. Take 1 tablet with food as prescribed.`,
      `test-alert-${Date.now()}`,
      soundEnabled
    );

    const logItem: NotificationLogItem = {
      id: `log-${Date.now()}`,
      medicationName: medName,
      dosage,
      timeSlot: 'Instant Test Alert',
      timestamp: new Date().toISOString(),
      type: 'test'
    };
    const updated = addLogItem(logItem);
    setLogs(updated);

    setActiveToast({
      id: `toast-${Date.now()}`,
      title: `Medication Alert Test: ${medName}`,
      body: `Dose: ${dosage}. Browser push notification dispatched successfully!`,
      dosage,
      timeLabel: 'Test Mode',
      timestamp: new Date()
    });
  };

  // Trigger manual alarm for a specific medication item
  const triggerManualMedicationAlarm = (med: MedicationItem) => {
    triggerBrowserPushNotification(
      `💊 Medication Due Now: ${med.name}`,
      `Dosage: ${med.dosage} (${med.frequency}). Purpose: ${med.purpose || 'Take as instructed'}.`,
      `manual-alert-${med.id}`,
      soundEnabled
    );

    const logItem: NotificationLogItem = {
      id: `log-${Date.now()}`,
      medicationName: med.name,
      dosage: med.dosage,
      timeSlot: med.timeLabel || 'Manual Trigger',
      timestamp: new Date().toISOString(),
      type: 'manual'
    };
    const updated = addLogItem(logItem);
    setLogs(updated);

    setActiveToast({
      id: `toast-${Date.now()}`,
      medicationId: med.id,
      title: `Medication Alarm: ${med.name}`,
      body: `Take ${med.dosage} (${med.frequency}). ${med.specialInstructions || med.purpose}`,
      dosage: med.dosage,
      timeLabel: med.timeLabel || 'Immediate',
      timestamp: new Date()
    });
  };

  // Background ticker loop checking every 10 seconds
  useEffect(() => {
    const checkSchedule = () => {
      if (!plan || !plan.medications || plan.medications.length === 0) return;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hours}:${minutes}`;

      plan.medications.forEach((med) => {
        const targetTimes = convertToTarget24H(med.timeLabel, med.scheduleTime, timeSlots);

        targetTimes.forEach((targetHHMM) => {
          if (targetHHMM === currentHHMM) {
            const triggerKey = `${dateStr}_${med.id}_${targetHHMM}`;

            if (!triggeredKeysRef.current.has(triggerKey)) {
              triggeredKeysRef.current.add(triggerKey);

              // Trigger push notification
              triggerBrowserPushNotification(
                `💊 Time for Medication: ${med.name}`,
                `Dosage: ${med.dosage} • ${med.frequency}. Purpose: ${med.purpose || 'Take as prescribed.'}`,
                `scheduled-${triggerKey}`,
                soundEnabled
              );

              // Log item
              const logItem: NotificationLogItem = {
                id: `log-${Date.now()}`,
                medicationName: med.name,
                dosage: med.dosage,
                timeSlot: med.timeLabel || targetHHMM,
                timestamp: now.toISOString(),
                type: 'scheduled'
              };
              const updated = addLogItem(logItem);
              setLogs(updated);

              // Display in-app toast
              setActiveToast({
                id: `toast-${triggerKey}`,
                medicationId: med.id,
                title: `Scheduled Medication Alert: ${med.name}`,
                body: `Dose: ${med.dosage} (${med.timeLabel || targetHHMM}). ${med.specialInstructions || med.purpose}`,
                dosage: med.dosage,
                timeLabel: med.timeLabel || targetHHMM,
                timestamp: now
              });
            }
          }
        });
      });
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [plan, timeSlots, soundEnabled]);

  const dismissToast = () => setActiveToast(null);

  const handleMarkTakenFromToast = (medicationId?: string) => {
    if (medicationId && onToggleMedicationTaken) {
      onToggleMedicationTaken(medicationId);
    }
    setActiveToast(null);
  };

  const clearLogs = () => {
    clearSavedLogs();
    setLogs([]);
  };

  return {
    permission,
    timeSlots,
    soundEnabled,
    logs,
    activeToast,
    requestPermission: handleRequestPermission,
    toggleSound: handleToggleSound,
    updateSlotTimes: handleUpdateSlotTimes,
    sendTestAlert,
    triggerManualMedicationAlarm,
    dismissToast,
    markTakenFromToast: handleMarkTakenFromToast,
    clearLogs,
    reloadLogs
  };
}
