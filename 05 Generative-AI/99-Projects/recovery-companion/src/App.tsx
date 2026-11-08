import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, WifiOff, Wifi, CheckCircle2, AlertTriangle, RefreshCw, AlertCircle, X, Activity } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MedicalDisclaimerBanner } from './components/MedicalDisclaimerBanner';
import { DemoPlanBanner } from './components/DemoPlanBanner';
import { EmptyPlanState } from './components/EmptyPlanState';
import { LegalModal } from './components/LegalModal';
import { PlanOverview } from './components/PlanOverview';
import { MedicationTracker } from './components/MedicationTracker';
import { DailyRecoveryChecklist } from './components/DailyRecoveryChecklist';
import { EmergencyWarningSigns } from './components/EmergencyWarningSigns';
import { FollowUpTracker } from './components/FollowUpTracker';
import { AIChatAssistant } from './components/AIChatAssistant';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { SourceDocumentModal } from './components/SourceDocumentModal';
import { CaregiverShareModal } from './components/CaregiverShareModal';
import { PrintableRecoveryCard } from './components/PrintableRecoveryCard';
import { SidebarNavigation, NavigationTab } from './components/SidebarNavigation';
import { LandingHeroSection } from './components/LandingHeroSection';
import { UploadCenterView } from './components/UploadCenterView';
import { PatientProfileView } from './components/PatientProfileView';
import { PrescriptionAnalysisView } from './components/PrescriptionAnalysisView';
import { RemindersCalendarView } from './components/RemindersCalendarView';
import { ReportsView } from './components/ReportsView';
import { AuthScreenView } from './components/AuthScreenView';
import { NotificationToastBanner } from './components/NotificationToastBanner';
import { UrduPrescriptionModal } from './components/UrduPrescriptionModal';
import { GeminiStatusModal } from './components/GeminiStatusModal';
import { useMedicationNotifications } from './hooks/useMedicationNotifications';
import { INITIAL_DISCHARGE_PLAN, SAMPLE_REPORTS } from './data/sampleReports';
import { DischargePlan, LanguageCode, SampleReport, MedicationItem } from './types';
import { fetchUserPlan, saveUserPlan, saveUserProfile, LocalUser, subscribeToAuthChanges, logoutUser } from './lib/firestoreService';
import { safeFetchJson } from './lib/apiUtils';

export default function App() {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => {
    try {
      const raw = localStorage.getItem('discharge_care_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Subscribe to central Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const [isGuestDemo, setIsGuestDemo] = useState<boolean>(false);
  const [plan, setPlan] = useState<DischargePlan | null>(null);
  const [isDemoPlan, setIsDemoPlan] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCaregiverMode, setIsCaregiverMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Legal Modal
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [viteConnectionError, setViteConnectionError] = useState<string | null>(null);

  // Monitor Vite development connection status & unhandled rejections
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (msg.includes('[vite]') || msg.toLowerCase().includes('websocket') || msg.toLowerCase().includes('failed to connect')) {
        setViteConnectionError('Development server connection interrupted. Attempting background reconnection every 5s...');
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason || '');
      if (reason.includes('[vite]') || reason.toLowerCase().includes('websocket') || reason.toLowerCase().includes('failed to connect')) {
        setViteConnectionError('Development server connection interrupted. Attempting background reconnection every 5s...');
      }
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Listen to Vite HMR disconnect event if present
    if (import.meta && (import.meta as any).hot) {
      (import.meta as any).hot.on('vite:ws:disconnect', () => {
        setViteConnectionError('Development server connection disconnected. Attempting background reconnection every 5s...');
      });
    }

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Background reconnection check every 5 seconds when connection error state is active
  useEffect(() => {
    if (!viteConnectionError) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (res.ok) {
          setSyncStatusMessage('Development server connection restored successfully.');
          setViteConnectionError(null);
          setTimeout(() => setSyncStatusMessage(null), 4000);
        }
      } catch {
        // Server unreachable yet, next attempt in 5s
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [Boolean(viteConnectionError)]);

  // Online / Offline listener & auto status banner
  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      setSyncStatusMessage('Connection restored.');

      if (currentUser) {
        try {
          await saveUserProfile(currentUser.uid, currentUser.email, currentUser.displayName);

          if (plan && !isDemoPlan) {
            await saveUserPlan(currentUser.uid, plan);
          } else if (!isDemoPlan) {
            const userPlan = await fetchUserPlan(currentUser.uid);
            if (userPlan) {
              setPlan(userPlan);
            }
          }
        } catch (err) {
          console.warn('Re-sync failed:', err);
        }
      }

      setTimeout(() => {
        setSyncStatusMessage(null);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setSyncStatusMessage(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [plan, isDemoPlan, currentUser]);

  useEffect(() => {
    const isRTL = currentLanguage === 'ur' || currentLanguage === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Handle local user session changes
  useEffect(() => {
    if (currentUser) {
      setIsGuestDemo(false);
      saveUserProfile(currentUser.uid, currentUser.email, currentUser.displayName);

      fetchUserPlan(currentUser.uid).then((userPlan) => {
        if (userPlan) {
          setPlan(userPlan);
          setIsDemoPlan(false);
          setActiveTab('overview');
        } else {
          setPlan(prevPlan => {
            if (prevPlan) {
              saveUserPlan(currentUser.uid, prevPlan);
              setIsDemoPlan(false);
              return prevPlan;
            }
            setIsDemoPlan(false);
            setActiveTab('uploads');
            return null;
          });
        }
      }).catch(err => {
        console.warn('Error fetching plan:', err);
        setPlan(null);
        setIsDemoPlan(false);
        setActiveTab('uploads');
      });
    } else if (!isGuestDemo) {
      setPlan(null);
      setIsDemoPlan(false);
      setActiveTab('uploads');
    }
    setIsAuthLoading(false);
  }, [currentUser?.uid]);

  const handleSignOut = useCallback(() => {
    logoutUser().finally(() => {
      setCurrentUser(null);
      setPlan(null);
      setIsDemoPlan(false);
      setIsGuestDemo(false);
      setActiveTab('uploads');
    });
  }, []);

  const handleLoginSuccess = useCallback((user: LocalUser) => {
    setCurrentUser(user);
    localStorage.setItem('discharge_care_current_user', JSON.stringify(user));
  }, []);

  const [savedPlans, setSavedPlans] = useState<DischargePlan[]>(() => {
    try {
      const storageKey = `discharge_saved_plans_${currentUser?.uid || 'local'}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Helper to update plan in local state AND persist to local storage for current signed in user account
  const updateAndSavePlan = useCallback((updater: (prev: DischargePlan | null) => DischargePlan | null) => {
    setPlan(prev => {
      const nextPlan = updater(prev);
      if (nextPlan) {
        setIsDemoPlan(false);
        if (currentUser) {
          saveUserPlan(currentUser.uid, nextPlan).catch(err => {
            console.warn('Auto-save to localStorage failed:', err);
          });
        }
        setSavedPlans(prevSaved => {
          const idx = prevSaved.findIndex(p => p.id === nextPlan.id);
          let nextList: DischargePlan[];
          if (idx >= 0) {
            nextList = [...prevSaved];
            nextList[idx] = nextPlan;
          } else {
            nextList = [nextPlan, ...prevSaved];
          }
          try {
            const storageKey = `discharge_saved_plans_${currentUser?.uid || 'local'}`;
            localStorage.setItem(storageKey, JSON.stringify(nextList));
          } catch (e) {
            console.warn('Failed to save plans locally:', e);
          }
          return nextList;
        });
      }
      return nextPlan;
    });
  }, [currentUser]);

  const handleDeleteSavedPlan = useCallback((planId: string) => {
    setSavedPlans(prev => {
      const updated = prev.filter(p => p.id !== planId);
      try {
        const storageKey = `discharge_saved_plans_${currentUser?.uid || 'local'}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving to localStorage:', err);
      }
      return updated;
    });

    setPlan(currentPlan => {
      if (currentPlan?.id === planId) {
        return null;
      }
      return currentPlan;
    });
  }, [currentUser]);

  // Tab Selection Guard to enforce order: Login -> Upload -> Rest of App
  const handleSelectTab = useCallback((tab: NavigationTab) => {
    if (currentUser && !isGuestDemo && !plan && tab !== 'uploads' && tab !== 'auth' && tab !== 'profile') {
      setActiveTab('uploads');
    } else {
      setActiveTab(tab);
    }
  }, [currentUser, isGuestDemo, plan]);

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isUrduModalOpen, setIsUrduModalOpen] = useState(false);
  const [isGeminiStatusOpen, setIsGeminiStatusOpen] = useState(false);
  const [urduModalMeds, setUrduModalMeds] = useState<MedicationItem[] | undefined>(undefined);
  const [urduModalText, setUrduModalText] = useState<string | undefined>(undefined);

  const [activeCitationQuote, setActiveCitationQuote] = useState<string | null>(null);
  const [activeCitationTitle, setActiveCitationTitle] = useState<string | null>(null);

  const handleOpenUrduModal = (meds?: MedicationItem[], text?: string) => {
    setUrduModalMeds(meds || (plan?.medications || []));
    setUrduModalText(text);
    setIsUrduModalOpen(true);
  };

  // TTS State
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);

  // Toggle Medication Taken
  const handleToggleMedicationTaken = (id: string) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.map(m => {
          if (m.id !== id) return m;
          const nowTaken = !m.takenToday;
          const currentQty = m.remainingQuantity;
          let newQty = currentQty;
          if (currentQty !== undefined) {
            if (nowTaken && currentQty > 0) {
              newQty = currentQty - 1;
            } else if (!nowTaken) {
              newQty = currentQty + 1;
            }
          }
          return {
            ...m,
            takenToday: nowTaken,
            remainingQuantity: newQty
          };
        })
      };
    });
  };

  // Browser Push Notification Engine
  const notificationState = useMedicationNotifications(plan || INITIAL_DISCHARGE_PLAN, handleToggleMedicationTaken);

  // Update Medication Remaining Quantity
  const handleUpdateMedicationQuantity = (id: string, newQuantity: number) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.map(m =>
          m.id === id ? { ...m, remainingQuantity: Math.max(0, newQuantity) } : m
        )
      };
    });
  };

  // Mark Medication Refill Requested
  const handleMarkRefillRequested = (id: string) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.map(m =>
          m.id === id ? { ...m, refillRequested: true } : m
        )
      };
    });
  };

  // Update Pharmacy Email
  const handleUpdatePharmacyEmail = (id: string, email: string) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        medications: prev.medications.map(m =>
          m.id === id ? { ...m, pharmacyEmail: email } : m
        )
      };
    });
  };

  // Toggle Checklist Task
  const handleToggleTaskCompleted = (id: string) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        dailyTasks: prev.dailyTasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      };
    });
  };

  // Toggle Appointment Reminder
  const handleToggleAppointmentReminder = (id: string) => {
    updateAndSavePlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        followUps: prev.followUps.map(f => 
          f.id === id ? { ...f, reminderSet: !f.reminderSet } : f
        )
      };
    });
  };

  // Open Source Citation Inspection Modal
  const handleOpenSourceModal = (quote?: string, title?: string) => {
    setActiveCitationQuote(quote || null);
    setActiveCitationTitle(title || null);
    setIsSourceModalOpen(true);
  };

  // Language Change Handler with API Translation
  const handleLanguageChange = async (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    if (newLang === 'en' || !plan) return;

    setIsTranslating(true);
    try {
      const data = await safeFetchJson('/api/translate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          targetLanguage: newLang
        })
      });

      if (data.success && data.translatedPlan) {
        updateAndSavePlan(() => data.translatedPlan);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Select Pre-configured Sample Discharge Report
  const handleSelectSampleReport = (sample: SampleReport) => {
    setIsDemoPlan(true);
    if (sample.id === 'report-cardiac-stent') {
      setPlan({
        id: 'plan-cardiac-stent',
        reportId: sample.id,
        createdAt: new Date().toISOString(),
        patientName: 'Eleanor Vance',
        hospitalName: 'Mercy Heart & Vascular Institute',
        dischargeDate: '2026-07-21',
        attendingPhysician: 'Dr. Marcus Vance, MD (Cardiology)',
        primaryDiagnosis: 'Non-ST Elevation Myocardial Infarction (NSTEMI) / Post Drug-Eluting Stent',
        secondaryDiagnoses: ['Coronary Artery Disease', 'Hyperlipidemia'],
        proceduresPerformed: ['Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent to LAD Artery'],
        plainLanguageSummary: 'You had a heart catheterization with a stent placed in your coronary artery. It is critical to take your Ticagrelor (Brilinta) and Aspirin every day without missing doses to prevent stent blood clots.',
        keyRecoveryMilestones: [
          'Days 1-3: Strict rest, no driving, and daily right groin access site inspection.',
          'Day 7: May resume light household walking (<10 lbs lifting).',
          'Day 8: Follow-up visit at Mercy Cardiology Clinic.'
        ],
        medicalTermsGlossary: [
          { term: 'PCI (Stent)', explanation: 'A tiny wire mesh tube inserted into a narrowed heart artery to keep blood flowing.' },
          { term: 'Dual Antiplatelet Therapy', explanation: 'Taking two blood-thinning medicines together (Aspirin + Brilinta) to stop blood clots from forming inside your new stent.' }
        ],
        medications: [
          {
            id: 'med-c1',
            name: 'Ticagrelor',
            genericName: 'Brilinta',
            dosage: '90 mg',
            route: 'Oral',
            frequency: 'Twice daily',
            scheduleTime: 'morning',
            timeLabel: '8:00 AM & 8:00 PM',
            duration: '12 months',
            purpose: 'CRITICAL: Prevents heart stent blood clots',
            specialInstructions: 'NEVER stop abruptly without cardiologist approval.',
            sourceQuote: 'Ticagrelor (Brilinta) 90 mg PO TWICE DAILY for 12 months. CRITICAL: Never miss a dose.',
            confidence: 99,
            takenToday: false,
            remainingQuantity: 3,
            totalQuantity: 60,
            rxNumber: 'RX-991204',
            pharmacyEmail: 'refills@mercypharmacy.org',
            refillThreshold: 5,
            refillRequested: false
          },
          {
            id: 'med-c2',
            name: 'Aspirin',
            dosage: '81 mg',
            route: 'Oral',
            frequency: 'Once daily',
            scheduleTime: 'morning',
            timeLabel: '8:00 AM',
            duration: 'Indefinitely',
            purpose: 'Blood thinner to protect heart stent',
            specialInstructions: 'Take in the morning with breakfast.',
            sourceQuote: 'Aspirin 81 mg PO ONCE DAILY indefinitely.',
            confidence: 99,
            takenToday: true,
            remainingQuantity: 18,
            totalQuantity: 30,
            rxNumber: 'RX-110293',
            pharmacyEmail: 'refills@mercypharmacy.org',
            refillThreshold: 5,
            refillRequested: false
          },
          {
            id: 'med-c3',
            name: 'Nitroglycerin',
            dosage: '0.4 mg',
            route: 'Sublingual (under tongue)',
            frequency: 'As needed for chest pain',
            scheduleTime: 'as_needed',
            timeLabel: 'As needed for chest pain',
            duration: 'As needed',
            purpose: 'Emergency chest pain reliever',
            specialInstructions: 'Dissolve 1 tablet under tongue for chest pain. If pain persists after 5 mins, CALL 911 immediately.',
            sourceQuote: 'Nitroglycerin 0.4 mg Sublingual Tablet AS NEEDED for chest pain... If pain persists after 5 minutes, CALL 911.',
            confidence: 98,
            takenToday: false,
            remainingQuantity: 2,
            totalQuantity: 25,
            rxNumber: 'RX-334102',
            pharmacyEmail: 'refills@mercypharmacy.org',
            refillThreshold: 5,
            refillRequested: false
          }
        ],
        followUps: [
          {
            id: 'fup-c1',
            providerName: 'Mercy Cardiology Clinic',
            specialty: 'Cardiology',
            location: 'Mercy Heart Institute Suite 200',
            address: '500 Vascular Way',
            phone: '(555) 891-3000',
            date: '2026-07-29',
            time: '9:00 AM',
            instructions: 'Groin access site check, blood pressure review, and EKG.',
            sourceQuote: 'Mercy Cardiology Clinic (Dr. Marcus Vance): July 29, 2026 at 9:00 AM.',
            reminderSet: true
          }
        ],
        dailyTasks: [
          {
            id: 'task-c1',
            category: 'wound_care',
            categoryLabel: 'Groin Access Site',
            title: 'Inspect Right Groin Insertion Site',
            description: 'Check groin for lump formation, swelling, or active bleeding.',
            dayOffset: 'Daily (Days 1-7)',
            completed: true,
            sourceQuote: 'Inspect groin daily for swelling, lump formation, or active bleeding.'
          }
        ],
        warningSigns: [
          {
            id: 'warn-c1',
            level: 'emergency',
            symptom: 'Sudden Chest Tightness or Pain Radiating to Arm/Jaw',
            actionRequired: 'CALL 911 IMMEDIATELY. Take 1 Nitroglycerin sublingual tablet.',
            sourceQuote: 'Sudden chest tightness, pain radiating to left arm or jaw: CALL 911 IMMEDIATELY.',
            contactNumber: '911'
          }
        ],
        confidence: {
          overallScore: 99,
          medications: 99,
          followUps: 98,
          checklist: 98,
          warningSigns: 100,
          hasLowConfidenceFlag: false
        },
        sourceDocumentText: sample.rawText,
        medicalDisclaimerAcknowledged: true,
        caregiverShareCode: 'CARE-4402-EV'
      });
    } else {
      setPlan(INITIAL_DISCHARGE_PLAN);
    }
    setActiveTab('overview');
  };

  // Switch back to signed-in user's plan from Firestore
  const handleSwitchToRealPlan = async () => {
    if (!currentUser) return;
    try {
      const realPlan = await fetchUserPlan(currentUser.uid);
      if (realPlan) {
        setPlan(realPlan);
        setIsDemoPlan(false);
      } else {
        setPlan(null);
        setIsDemoPlan(false);
      }
    } catch (err) {
      console.warn('Switch to real plan error:', err);
    }
  };

  // TTS Audio Guide Reader
  const handlePlayTTS = async () => {
    if (!plan) return;
    if (isTTSPlaying) {
      window.speechSynthesis.cancel();
      setIsTTSPlaying(false);
      return;
    }

    setIsTTSPlaying(true);
    const summaryText = `DischargeCare AI Summary for ${plan.patientName}. Primary diagnosis: ${plan.primaryDiagnosis}. ${plan.plainLanguageSummary}`;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsTTSPlaying(false);
      utterance.onerror = () => setIsTTSPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsTTSPlaying(false);
    }
  };

  // Displayed Patient Name
  const displayedPatientName = plan 
    ? plan.patientName 
    : (currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Patient');

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 animate-pulse mb-4">
          <Activity className="w-8 h-8 stroke-[3]" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          Authenticating Enterprise Care Session...
        </p>
      </div>
    );
  }

  if (!currentUser && !isGuestDemo) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <AuthScreenView
          currentUser={currentUser}
          onLoginSuccess={(u) => {
            handleLoginSuccess(u);
            setActiveTab('overview');
          }}
          onSignOut={handleSignOut}
          onTryDemo={() => {
            setIsGuestDemo(true);
            setPlan(INITIAL_DISCHARGE_PLAN);
            setIsDemoPlan(true);
            setActiveTab('overview');
          }}
          onOpenLegal={() => setIsLegalOpen(true)}
        />
        <LegalModal
          isOpen={isLegalOpen}
          onClose={() => setIsLegalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#020617] font-sans antialiased flex">
      {/* Desktop Left Sidebar Navigation */}
      <SidebarNavigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        patientName={displayedPatientName}
        hospitalName={plan?.hospitalName || 'Health Center'}
        medicationCount={plan?.medications.length || 0}
        warningCount={plan?.warningSigns.length || 0}
        followupCount={plan?.followUps.length || 0}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Container Area - Offset for fixed sidebar on large screens */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        
        {/* Vite Connection Error Banner / Toast */}
        {viteConnectionError && (
          <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between z-40 shadow-sm border-b border-amber-500">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-100 shrink-0" />
              <span>{viteConnectionError}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-amber-950 font-bold px-2.5 py-1 rounded hover:bg-amber-50 transition text-xs flex items-center space-x-1 shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Application</span>
              </button>
              <button
                onClick={() => setViteConnectionError(null)}
                className="text-amber-100 hover:text-white p-1 rounded transition"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Offline Warning Banner */}
        {isOffline && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 z-40">
            <WifiOff className="w-4 h-4" />
            <span>You are currently offline. Connect to internet to sync new records.</span>
          </div>
        )}

        {/* Online Sync Restoration Banner */}
        {!isOffline && syncStatusMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 z-40 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{syncStatusMessage}</span>
          </div>
        )}

        {/* Demo Plan Banner */}
        {isDemoPlan && (
          <DemoPlanBanner
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenUpload={() => setIsUploadOpen(true)}
            onSwitchToRealPlan={handleSwitchToRealPlan}
            hasRealPlan={Boolean(currentUser)}
          />
        )}

        {/* Top Header Navbar */}
        <Navbar
          patientName={displayedPatientName}
          hospitalName={plan?.hospitalName || 'Recovery Companion'}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenPrint={() => setIsPrintOpen(true)}
          onOpenReminders={() => handleSelectTab('reminders')}
          onOpenUrduModal={() => handleOpenUrduModal()}
          onOpenGeminiStatus={() => setIsGeminiStatusOpen(true)}
          notificationPermission={notificationState.permission}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          isCaregiverMode={isCaregiverMode}
          onToggleCaregiverMode={() => setIsCaregiverMode(!isCaregiverMode)}
          onPlayTTSOverview={handlePlayTTS}
          isTTSPlaying={isTTSPlaying}
        />

        {/* Global Medication Push Alert Toast Banner */}
        <NotificationToastBanner
          toast={notificationState.activeToast}
          onDismiss={notificationState.dismissToast}
          onMarkTaken={notificationState.markTakenFromToast}
        />

        {/* Persistent Non-Diagnostic Disclaimer */}
        <MedicalDisclaimerBanner />

        {/* Main Content View Switcher */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-12 space-y-6">
          {activeTab === 'landing' && (
            <LandingHeroSection
              onStartFree={() => handleSelectTab('uploads')}
              onOpenDemoReport={() => {
                handleSelectSampleReport(SAMPLE_REPORTS[0]);
                setActiveTab('overview');
              }}
            />
          )}

          {activeTab === 'overview' && (
            plan ? (
              <PlanOverview 
                plan={plan} 
                onOpenSourceModal={handleOpenSourceModal} 
                onUpdateQuantity={handleUpdateMedicationQuantity}
                onMarkRefillRequested={handleMarkRefillRequested}
                onUpdatePharmacyEmail={handleUpdatePharmacyEmail}
                onNavigateToMedications={() => handleSelectTab('medications')}
                onToggleTaken={handleToggleMedicationTaken}
                onToggleTask={handleToggleTaskCompleted}
                onToggleReminder={handleToggleAppointmentReminder}
                onNavigateToTab={(tab) => handleSelectTab(tab as NavigationTab)}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'uploads' && (
            <UploadCenterView
              currentUser={currentUser}
              onPlanGenerated={(newPlan) => {
                setIsDemoPlan(false);
                updateAndSavePlan(() => newPlan);
                setActiveTab('overview');
              }}
              onSelectSampleReport={handleSelectSampleReport}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              currentUser={currentUser}
              savedPlans={savedPlans}
              activePlanId={plan?.id}
              onSelectPlan={(selectedPlan) => {
                setPlan(selectedPlan);
                setIsDemoPlan(false);
                setActiveTab('overview');
              }}
              onDeletePlan={(planId) => {
                handleDeleteSavedPlan(planId);
              }}
              onCreateNewPlan={() => {
                setPlan(null);
                setActiveTab('uploads');
              }}
              onOpenPrintModal={(selectedPlan) => {
                setPlan(selectedPlan);
                setIsPrintOpen(true);
              }}
            />
          )}

          {activeTab === 'prescription_analysis' && (
            plan ? (
              <PrescriptionAnalysisView
                plan={plan}
                onOpenSourceModal={handleOpenSourceModal}
                onUpdatePlan={(updated) => updateAndSavePlan(() => updated)}
                onNavigateToTab={(tab) => handleSelectTab(tab as NavigationTab)}
                onOpenUrduModal={handleOpenUrduModal}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'reminders' && (
            plan ? (
              <RemindersCalendarView
                plan={plan}
                onOpenSourceModal={handleOpenSourceModal}
                notificationState={notificationState}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'medications' && (
            plan ? (
              <MedicationTracker
                medications={plan.medications}
                patientName={plan.patientName}
                onToggleTaken={handleToggleMedicationTaken}
                onOpenSourceModal={handleOpenSourceModal}
                onUpdateQuantity={handleUpdateMedicationQuantity}
                onMarkRefillRequested={handleMarkRefillRequested}
                onUpdatePharmacyEmail={handleUpdatePharmacyEmail}
                onOpenUrduModal={handleOpenUrduModal}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'checklist' && (
            plan ? (
              <DailyRecoveryChecklist
                tasks={plan.dailyTasks}
                onToggleTask={handleToggleTaskCompleted}
                onOpenSourceModal={handleOpenSourceModal}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'warning_signs' && (
            plan ? (
              <EmergencyWarningSigns
                warningSigns={plan.warningSigns}
                onOpenSourceModal={handleOpenSourceModal}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'followups' && (
            plan ? (
              <FollowUpTracker
                appointments={plan.followUps}
                onToggleReminder={handleToggleAppointmentReminder}
                onOpenSourceModal={handleOpenSourceModal}
              />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'chat' && (
            plan ? (
              <AIChatAssistant plan={plan} onOpenSourceModal={handleOpenSourceModal} />
            ) : (
              <UploadCenterView
                onPlanGenerated={(newPlan) => {
                  setIsDemoPlan(false);
                  updateAndSavePlan(() => newPlan);
                  setActiveTab('overview');
                }}
                onSelectSampleReport={handleSelectSampleReport}
              />
            )
          )}

          {activeTab === 'profile' && (
            <PatientProfileView
              plan={plan || INITIAL_DISCHARGE_PLAN}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              isCaregiverMode={isCaregiverMode}
              onToggleCaregiverMode={() => setIsCaregiverMode(!isCaregiverMode)}
              onOpenShare={() => setIsShareOpen(true)}
              onOpenPrint={() => setIsPrintOpen(true)}
              onOpenLegal={() => setIsLegalOpen(true)}
              currentUser={currentUser}
              onSignOut={handleSignOut}
            />
          )}

          {activeTab === 'auth' && (
            <AuthScreenView
              currentUser={currentUser}
              onLoginSuccess={(u) => {
                handleLoginSuccess(u);
                setActiveTab('overview');
              }}
              onSignOut={handleSignOut}
              onOpenLegal={() => setIsLegalOpen(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">Recovery Companion</span>
              <span>• AI Discharge Care & Medication Assistant</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-500 text-[11px]">
              <button
                onClick={() => setIsLegalOpen(true)}
                className="hover:text-slate-300 underline"
              >
                Privacy Policy & Terms
              </button>
              <span>•</span>
              <span>Powered by Gemini 3.6 Flash</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentUser={currentUser}
        onPlanGenerated={(newPlan) => {
          setIsDemoPlan(false);
          updateAndSavePlan(() => newPlan);
          setActiveTab('overview');
        }}
        onSelectSampleReport={handleSelectSampleReport}
      />

      <SourceDocumentModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sourceText={plan?.sourceDocumentText || ''}
        activeQuote={activeCitationQuote}
        itemTitle={activeCitationTitle}
      />

      <CaregiverShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareCode={plan?.caregiverShareCode || 'CARE-8921-DC'}
        patientName={displayedPatientName}
      />

      {plan && (
        <PrintableRecoveryCard
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          plan={plan}
        />
      )}

      <UrduPrescriptionModal
        isOpen={isUrduModalOpen}
        onClose={() => setIsUrduModalOpen(false)}
        medications={urduModalMeds}
        prescriptionText={urduModalText}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

      <GeminiStatusModal
        isOpen={isGeminiStatusOpen}
        onClose={() => setIsGeminiStatusOpen(false)}
      />

      {/* Language Translation Loading Modal */}
      {isTranslating && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 flex flex-col items-center space-y-3 max-w-sm text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">
              Translating Plan
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Gemini 3.6 Flash is translating your recovery plan into{' '}
              <strong className="text-blue-600 font-bold">
                {currentLanguage === 'ur' ? 'Urdu (اردو)' : currentLanguage === 'es' ? 'Spanish (Español)' : currentLanguage === 'ar' ? 'Arabic (العربية)' : currentLanguage.toUpperCase()}
              </strong>
              ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
