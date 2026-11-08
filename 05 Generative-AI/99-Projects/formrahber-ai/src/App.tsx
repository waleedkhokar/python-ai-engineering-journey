import React, { useState, useEffect } from 'react';
import {
  AppLanguage,
  FormAnalysisResult,
  RequiredDocument,
  ScreenState,
  UserAnswer,
  SampleFormTemplate,
} from './types';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { UploadModal } from './components/UploadModal';
import { AnalysisLoading } from './components/AnalysisLoading';
import { FormOverview } from './components/FormOverview';
import { GuidedFilling } from './components/GuidedFilling';
import { SummaryReview } from './components/SummaryReview';
import { FormExportPreview } from './components/FormExportPreview';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');
  const [screenState, setScreenStateState] = useState<ScreenState>('landing');

  // Helper to change screen state and push to browser history for step-by-step mobile back button support
  const navigateToScreen = (newScreen: ScreenState, replace = false) => {
    setScreenStateState(newScreen);
    try {
      if (replace) {
        window.history.replaceState({ screen: newScreen }, '');
      } else {
        window.history.pushState({ screen: newScreen }, '');
      }
    } catch {
      // Ignore if history API restricted in sandboxed iframe
    }
  };

  const setScreenState = (newScreen: ScreenState | ((prev: ScreenState) => ScreenState)) => {
    if (typeof newScreen === 'function') {
      setScreenStateState((prev) => {
        const next = newScreen(prev);
        try {
          window.history.pushState({ screen: next }, '');
        } catch {}
        return next;
      });
    } else {
      navigateToScreen(newScreen);
    }
  };

  // Sync with browser popstate (mobile hardware/gesture back button & browser back button)
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.screen) {
        window.history.replaceState({ screen: 'landing' }, '');
      }
    } catch {}

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setScreenStateState(e.state.screen);
      } else {
        // Step-by-step fallback
        setScreenStateState((prev) => {
          switch (prev) {
            case 'export': return 'summary';
            case 'summary': return 'guided';
            case 'guided': return 'overview';
            case 'overview': return 'landing';
            case 'analysis': return 'upload';
            case 'upload': return 'landing';
            case 'about': return 'landing';
            default: return 'landing';
          }
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [analysisResult, setAnalysisResult] = useState<FormAnalysisResult | null>(null);
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUploadedImage, setLastUploadedImage] = useState<string | null>(null);

  // Automatically scroll to top whenever screen view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screenState]);

  // Navigation Handlers
  const handleNavigateHome = () => {
    setScreenState('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDemoForms = () => {
    setScreenState('landing');
    setTimeout(() => {
      const el = document.getElementById('sample-forms-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateHowItWorks = () => {
    setScreenState('landing');
    setTimeout(() => {
      const el = document.getElementById('how-it-works-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateUpload = () => {
    setScreenState('upload');
  };

  const handleNavigateAbout = () => {
    setScreenState('about');
  };

  // Analyze Image via Server Route
  const analyzeFormImage = async (base64Image: string) => {
    setScreenState('analysis');
    setErrorMsg(null);
    setLastUploadedImage(base64Image);

    try {
      const res = await fetch('/api/analyze-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          targetLanguage: currentLang,
        }),
      });

      const contentType = res.headers.get('content-type');
      let responseData: any = null;

      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        const text = await res.text();
        console.error('Server non-JSON error response:', text);
        throw new Error(
          res.status === 413
            ? 'The uploaded form image is too large. Please upload a smaller photo or snapshot.'
            : 'Server returned a non-JSON response. Please verify GEMINI_API_KEY is configured in Settings or try a Demo Form.'
        );
      }

      if (res.ok && responseData && responseData.success && responseData.data) {
        setAnalysisResult(responseData.data);
        setDocuments(responseData.data.documents || []);
        setUserAnswers({});
        setScreenState('guided');
      } else if (responseData && (responseData.isNotForm || responseData.error === 'Unsupported Image Detected')) {
        setErrorMsg('Unsupported Image Detected');
        setScreenState('upload');
      } else {
        throw new Error(
          (responseData && responseData.error) ||
            'Could not parse form image. Please ensure image has good lighting and text is visible.'
        );
      }
    } catch (err: any) {
      if (err.message === 'Unsupported Image Detected' || err.message?.includes('Unsupported Image')) {
        setErrorMsg('Unsupported Image Detected');
      } else {
        console.warn('Analysis error:', err);
        setErrorMsg(
          err.message ||
            'Failed to analyze form image. Please ensure image has good lighting and text is visible.'
        );
      }
      setScreenState('upload');
    }
  };

  // Select Sample Form Template
  const handleSelectSample = (sample: SampleFormTemplate) => {
    setErrorMsg(null);
    setAnalysisResult(sample.data);
    setDocuments(sample.data.documents || []);
    setUserAnswers({});
    setScreenState('guided');
  };

  // Toggle Document Ready Checkbox
  const handleToggleDocumentReady = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isReady: !d.isReady } : d))
    );
  };

  // Save/Update Field Answer
  const handleSaveAnswer = (fieldId: string, answer: UserAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [fieldId]: answer,
    }));
  };

  const handleUpdateSingleAnswer = (fieldId: string, newValue: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [fieldId]: {
        fieldId,
        value: newValue,
        isConfirmed: true,
      },
    }));
  };

  // Reset to Landing
  const handleReset = () => {
    setScreenState('landing');
    setAnalysisResult(null);
    setDocuments([]);
    setUserAnswers({});
    setErrorMsg(null);
    setLastUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBFF] via-white to-[#F8FBFF] font-sans text-[#1F2937] flex flex-col selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden w-full">
      
      {/* Sticky Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={(lang) => setCurrentLang(lang)}
        screenState={screenState}
        onNavigate={(screen) => setScreenState(screen)}
        onNavigateHome={handleNavigateHome}
        onNavigateDemoForms={handleNavigateDemoForms}
        onNavigateHowItWorks={handleNavigateHowItWorks}
        onNavigateAbout={handleNavigateAbout}
        onStartUpload={handleNavigateUpload}
        onReset={handleReset}
      />

      {/* Global Error Banner if any */}
      {errorMsg && screenState === 'upload' && (
        <div className="max-w-4xl mx-auto px-4 pt-4 w-full">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {lastUploadedImage && (
              <button
                onClick={() => analyzeFormImage(lastUploadedImage)}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry AI</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {screenState === 'landing' && (
          <LandingHero
            currentLang={currentLang}
            onStartUpload={handleNavigateUpload}
            onSelectSample={handleSelectSample}
          />
        )}

        {screenState === 'about' && (
          <AboutPage
            currentLang={currentLang}
            onStartUpload={handleNavigateUpload}
            onBackToHome={handleNavigateHome}
          />
        )}

        {screenState === 'upload' && (
          <UploadModal
            currentLang={currentLang}
            onImageSelected={analyzeFormImage}
            onSelectSample={handleSelectSample}
            onCancel={handleNavigateHome}
            errorMsg={errorMsg}
            onClearError={() => setErrorMsg(null)}
          />
        )}

        {screenState === 'analysis' && (
          <AnalysisLoading currentLang={currentLang} />
        )}

        {screenState === 'overview' && analysisResult && (
          <FormOverview
            currentLang={currentLang}
            analysis={analysisResult}
            documents={documents}
            onToggleDocumentReady={handleToggleDocumentReady}
            onStartGuidedFilling={() => setScreenState('guided')}
            onBack={handleNavigateHome}
          />
        )}

        {screenState === 'guided' && analysisResult && (
          <GuidedFilling
            currentLang={currentLang}
            analysis={analysisResult}
            userAnswers={userAnswers}
            documents={documents}
            onSaveAnswer={handleSaveAnswer}
            onFinishGuidedFilling={() => setScreenState('summary')}
            onBackToOverview={() => setScreenState('overview')}
          />
        )}

        {screenState === 'summary' && analysisResult && (
          <SummaryReview
            currentLang={currentLang}
            analysis={analysisResult}
            userAnswers={userAnswers}
            documents={documents}
            onUpdateAnswer={handleUpdateSingleAnswer}
            onReset={handleReset}
            onBackToGuided={() => setScreenState('guided')}
            onOpenExportPreview={() => setScreenState('export')}
          />
        )}

        {screenState === 'export' && analysisResult && (
          <FormExportPreview
            currentLang={currentLang}
            analysis={analysisResult}
            userAnswers={userAnswers}
            formImageUrl={lastUploadedImage || analysisResult.imagePreviewUrl}
            onUpdateAnswer={handleUpdateSingleAnswer}
            onBackToSummary={() => setScreenState('summary')}
            onStartNewForm={handleReset}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        currentLang={currentLang}
        onNavigateHome={handleNavigateHome}
        onNavigateDemoForms={handleNavigateDemoForms}
        onNavigateHowItWorks={handleNavigateHowItWorks}
        onNavigateUpload={handleNavigateUpload}
        onNavigateAbout={handleNavigateAbout}
      />

    </div>
  );
}
