import React, { useState, useEffect } from 'react';
import { AppLanguage, FormAnalysisResult, FormField, RequiredDocument, UserAnswer } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  X,
  Send,
  ShieldCheck,
  Star,
  Check,
} from 'lucide-react';

interface GuidedFillingProps {
  currentLang: AppLanguage;
  analysis: FormAnalysisResult;
  userAnswers: Record<string, UserAnswer>;
  documents?: RequiredDocument[];
  onSaveAnswer: (fieldId: string, answer: UserAnswer) => void;
  onFinishGuidedFilling: () => void;
  onBackToOverview: () => void;
}

export const GuidedFilling: React.FC<GuidedFillingProps> = ({
  currentLang,
  analysis,
  userAnswers,
  documents = [],
  onSaveAnswer,
  onFinishGuidedFilling,
  onBackToOverview,
}) => {
  const t = TRANSLATIONS[currentLang];
  // Deduplicate fields so no question is repeated
  const fields = React.useMemo(() => {
    const seen = new Set<string>();
    return (analysis.fields || []).filter((f) => {
      const key = f.fieldName.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [analysis.fields]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentField: FormField | undefined = fields[currentIndex];

  const [inputValue, setInputValue] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // Gemini Helper Modal
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [helpQuery, setHelpQuery] = useState('');
  const [helpResponse, setHelpResponse] = useState<string | null>(null);
  const [isHelpLoading, setIsHelpLoading] = useState(false);

  // Load existing answer when changing question
  useEffect(() => {
    if (currentField) {
      const existing = userAnswers[currentField.id];
      setInputValue(existing ? existing.value : '');
      setShowNeedHelp(false);
    }
  }, [currentIndex, currentField, userAnswers]);

  if (!currentField) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-extrabold text-slate-900">All Fields Completed!</h2>
        <p className="text-sm text-slate-600">You have completed all questions for this form.</p>
        <button
          onClick={onFinishGuidedFilling}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md transition-all"
        >
          View Summary & Copy Answers
        </button>
      </div>
    );
  }

  // Helper for localized strings
  const getLocalized = (obj: any, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.en || fallback;
  };

  const fullExplanation = getLocalized(currentField.explanation);
  const commonMistakesText = getLocalized(currentField.commonMistakes);

  // Clean, single-line instruction generator
  const getShortExplanation = () => {
    const fn = currentField.fieldName.toLowerCase();
    if (fn.includes('degree') || fn.includes('programme') || fn.includes('program')) {
      return 'Enter the official name of your degree program.';
    }
    if (fn.includes('father') || fn.includes('guardian')) {
      return "Enter your father's or guardian's full name.";
    }
    if (fn.includes('cnic') || fn.includes('b-form') || fn.includes('identity')) {
      return 'Enter your 13-digit identity card or Form-B number.';
    }
    if (fn.includes('birth') || fn.includes('dob')) {
      return 'Enter your date of birth as recorded on your SSC certificate.';
    }
    if (fn.includes('address')) {
      return 'Enter your permanent home address.';
    }
    if (fn.includes('mobile') || fn.includes('phone') || fn.includes('contact')) {
      return 'Enter your active mobile phone number.';
    }
    if (fn.includes('marks') || fn.includes('obtained') || fn.includes('grade')) {
      return 'Enter your total marks or grades obtained.';
    }
    if (fn.includes('elective') || fn.includes('subject')) {
      return 'Enter your elective subject name.';
    }
    return `Enter your official ${currentField.fieldName.toLowerCase()}.`;
  };

  const shortExplanation = getShortExplanation();

  // Progress metrics
  const totalSteps = fields.length;
  const currentStepNumber = currentIndex + 1;
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100);

  // Advance to next or previous step
  const handleNext = async () => {
    if (inputValue.trim()) {
      onSaveAnswer(currentField.id, {
        fieldId: currentField.id,
        value: inputValue.trim(),
        isConfirmed: true,
      });
    }

    if (currentIndex < fields.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishGuidedFilling();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Ask Gemini Custom Question
  const handleAskHelp = async () => {
    if (!helpQuery.trim()) return;
    setIsHelpLoading(true);
    setHelpResponse(null);

    try {
      const res = await fetch('/api/process-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: currentField,
          rawAnswer: helpQuery,
          targetLanguage: currentLang,
        }),
      });
      const json = await res.json();
      setHelpResponse(
        json.data?.validationMessage ||
          `For field "${currentField.fieldName}", please enter the value exactly as recorded in your official documents.`
      );
    } catch (err) {
      setHelpResponse(`Please write your details matching your CNIC, certificate, or official record.`);
    } finally {
      setIsHelpLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-8 px-4 flex flex-col space-y-6 animate-fade-in">

      {/* Top Bar: Overview Button + Document Checklist Trigger */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <button
          id="guided-back-to-overview-btn"
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Form Overview</span>
        </button>

        {documents.length > 0 && (
          <button
            id="open-documents-modal-btn"
            onClick={() => setShowDocsModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Documents ({documents.filter((d) => d.isReady).length}/{documents.length})</span>
          </button>
        )}
      </div>

      {/* Progress Bar & Step Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-blue-600 tracking-wide uppercase font-extrabold">
            {currentField.categoryGroup ? `${currentField.categoryGroup.replace('_', ' ')}` : 'FORM STEP'}
          </span>
          <span className="text-slate-500 font-semibold">
            Step {currentStepNumber} of {totalSteps}
          </span>
        </div>

        {/* Clean Progress Bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Center Question View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">

        {/* Field Title & Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentField.fieldName}
            </h1>

            {/* Badges */}
            {currentField.isRequired ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold shrink-0">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Required</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium shrink-0">
                Optional
              </span>
            )}
          </div>

          {/* Short Explanation */}
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {shortExplanation}
          </p>
        </div>

        {/* Input Field Control */}
        <div className="space-y-3 pt-2">
          {currentField.fieldType === 'select' && currentField.options ? (
            <div className="space-y-2">
              {currentField.options.map((option, idx) => (
                <button
                  key={idx}
                  id={`select-opt-${idx}`}
                  onClick={() => setInputValue(option)}
                  className={`w-full p-4 rounded-[18px] border-2 text-left text-sm font-semibold transition-all flex items-center justify-between ${
                    inputValue === option
                      ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span>{option}</span>
                  {inputValue === option && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ) : currentField.fieldType === 'textarea' ? (
            <textarea
              id="step-input-textarea"
              rows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentField.exampleValue ? `Example: ${currentField.exampleValue}` : 'Type your details here...'}
              className="w-full px-5 py-4 bg-slate-50/70 border-2 border-slate-200 rounded-[18px] focus:bg-white focus:border-blue-600 focus:outline-none text-base text-slate-900 font-medium transition-all shadow-2xs"
            />
          ) : currentField.fieldType === 'checkbox' ? (
            <button
              id="step-input-checkbox"
              onClick={() => setInputValue(inputValue === 'Agreed' ? '' : 'Agreed')}
              className={`w-full p-4 rounded-[18px] border-2 text-left font-semibold text-sm transition-all flex items-center gap-3.5 ${
                inputValue === 'Agreed'
                  ? 'bg-blue-50 border-blue-600 text-blue-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                  inputValue === 'Agreed'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-300'
                }`}
              >
                {inputValue === 'Agreed' && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <span>I confirm that this detail is true and accurate.</span>
            </button>
          ) : (
            <input
              id="step-input-text"
              type={currentField.fieldType === 'number' ? 'number' : currentField.fieldType === 'date' ? 'date' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentField.exampleValue ? `Example: ${currentField.exampleValue}` : 'Enter value here...'}
              className="w-full px-5 py-4 bg-slate-50/70 border-2 border-slate-200 rounded-[18px] focus:bg-white focus:border-blue-600 focus:outline-none text-base text-slate-900 font-medium transition-all shadow-2xs"
            />
          )}
        </div>

        {/* Need Help Collapsible Section */}
        <div className="pt-2 border-t border-slate-100">
          <button
            id="toggle-need-help-btn"
            onClick={() => setShowNeedHelp(!showNeedHelp)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors py-1"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Need Help</span>
            {showNeedHelp ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Collapsible Content */}
          {showNeedHelp && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-fade-in text-slate-700">
              
              {/* Detailed Explanation */}
              <div>
                <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-1">
                  Explanation
                </p>
                <p className="leading-relaxed text-slate-700">
                  {fullExplanation}
                </p>
              </div>

              {/* Example */}
              {currentField.exampleValue && (
                <div className="pt-2 border-t border-slate-200/60">
                  <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-0.5">
                    Example
                  </p>
                  <p className="font-mono text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block font-medium">
                    {currentField.exampleValue}
                  </p>
                </div>
              )}

              {/* Common Mistake */}
              {commonMistakesText && (
                <div className="pt-2 border-t border-slate-200/60 text-amber-900">
                  <p className="font-bold text-amber-900 text-[11px] uppercase tracking-wider mb-0.5">
                    Common Mistake
                  </p>
                  <p className="leading-relaxed bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                    {commonMistakesText}
                  </p>
                </div>
              )}

              {/* Original Form Label */}
              {currentField.originalText && (
                <div className="pt-2 border-t border-slate-200/60 text-slate-500 text-[11px]">
                  <span>Original form label: </span>
                  <span className="font-mono text-slate-700 font-semibold">"{currentField.originalText}"</span>
                </div>
              )}

              {/* Ask Gemini Button */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  id="ask-ai-modal-btn"
                  onClick={() => {
                    setIsAskAiOpen(true);
                    setHelpQuery('');
                    setHelpResponse(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ask AI for custom help with this field</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            id="step-prev-btn"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            id="step-next-btn"
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>{currentIndex === fields.length - 1 ? 'Finish & Summary' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Supporting Documents Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-lg">Required Documents Checklist</h3>
              </div>
              <button
                id="close-docs-modal-btn"
                onClick={() => setShowDocsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Check off documents you have prepared to submit alongside this form:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    <span
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center font-bold text-xs ${
                        doc.isReady ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                      }`}
                    >
                      {doc.isReady ? '✓' : ''}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{doc.documentName}</p>
                    <p className="text-slate-500 leading-snug">{getLocalized(doc.reason)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="done-docs-modal-btn"
              onClick={() => setShowDocsModal(false)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              Back to Form
            </button>
          </div>
        </div>
      )}

      {/* Ask AI Custom Question Modal */}
      {isAskAiOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Ask AI about "{currentField.fieldName}"
                </h3>
              </div>
              <button
                id="close-ask-ai-modal-btn"
                onClick={() => setIsAskAiOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Type your question (e.g. "What if I don't have this document?", "Where can I find this roll number?"):
            </p>

            <div className="space-y-3">
              <input
                id="ask-ai-query-input"
                type="text"
                value={helpQuery}
                onChange={(e) => setHelpQuery(e.target.value)}
                placeholder="Type your question..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium outline-none focus:border-blue-600"
              />

              <button
                id="send-ask-ai-query-btn"
                disabled={isHelpLoading || !helpQuery.trim()}
                onClick={handleAskHelp}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                {isHelpLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Get AI Answer</span>
                  </>
                )}
              </button>
            </div>

            {helpResponse && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 font-medium leading-relaxed">
                {helpResponse}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
