import React, { useState } from 'react';
import { AppLanguage, FormAnalysisResult, FormField, RequiredDocument } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  Filter,
  ShieldCheck,
  Info,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface FormOverviewProps {
  currentLang: AppLanguage;
  analysis: FormAnalysisResult;
  documents: RequiredDocument[];
  onToggleDocumentReady: (docId: string) => void;
  onStartGuidedFilling: () => void;
  onBack?: () => void;
}

export const FormOverview: React.FC<FormOverviewProps> = ({
  currentLang,
  analysis,
  documents,
  onToggleDocumentReady,
  onStartGuidedFilling,
  onBack,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [filterType, setFilterType] = useState<'all' | 'confusing' | 'required'>('all');
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  // Deduplicate and filter fields
  const uniqueFields = React.useMemo(() => {
    const seen = new Set<string>();
    return (analysis.fields || []).filter((f) => {
      const key = f.fieldName.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [analysis.fields]);

  const filteredFields = uniqueFields.filter((f) => {
    if (filterType === 'confusing') return f.isConfusing;
    if (filterType === 'required') return f.isRequired;
    return true;
  });

  const readyDocsCount = documents.filter((d) => d.isReady).length;
  const totalDocsCount = documents.length;

  // Localized helper
  const getLocalized = (obj: any, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.en || fallback;
  };

  const formDesc = getLocalized(analysis.formDescription);
  const overallTips = getLocalized(analysis.overallTips);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Back Button */}
      {onBack && (
        <button
          id="overview-back-to-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-all hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
          <span>Back</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E40AF] via-[#2563EB] to-[#1F2937] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 backdrop-blur-xs">
            {analysis.category || 'Official Form'}
          </span>
          <span className="text-xs font-medium text-slate-300">
            {analysis.fields.length} Fields Detected
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {analysis.formTitle}
          </h1>
          {formDesc && (
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {formDesc}
            </p>
          )}
        </div>

        {/* Overall Tips Box */}
        {overallTips && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-200">Pro Tip: </span>
              <span>{overallTips}</span>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <div className="pt-2">
          <button
            id="start-guided-top-btn"
            onClick={onStartGuidedFilling}
            className="px-8 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-[#2563EB] font-extrabold text-sm sm:text-base shadow-lg shadow-blue-900/30 transition-all transform hover:scale-[1.02] flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-[#2563EB]" />
            <span>{t.startFillingButton}</span>
          </button>
        </div>
      </div>

      {/* Document Checklist Section */}
      {documents.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">
                  {t.documentChecklist}
                </h2>
                <p className="text-xs text-slate-500">
                  Required supporting documents & certificates detected by AI.
                </p>
              </div>
            </div>

            <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              {t.documentsReadyCount
                .replace('{ready}', String(readyDocsCount))
                .replace('{total}', String(totalDocsCount))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const reasonText = getLocalized(doc.reason);
              const tipText = getLocalized(doc.tip);

              return (
                <div
                  key={doc.id}
                  onClick={() => onToggleDocumentReady(doc.id)}
                  className={`p-4 rounded-[18px] border transition-all cursor-pointer flex items-start gap-3.5 ${
                    doc.isReady
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={doc.isReady || false}
                    onChange={() => {}} // handled by div onClick
                    className="w-5 h-5 mt-0.5 rounded-md text-[#2563EB] focus:ring-[#2563EB] border-slate-300 cursor-pointer shrink-0"
                  />
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {doc.documentName}
                      </span>
                      {doc.isExplicitlyRequired ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-800 shrink-0">
                          Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 shrink-0">
                          AI Suggestion
                        </span>
                      )}
                    </div>

                    {reasonText && (
                      <p className="text-xs text-slate-600">{reasonText}</p>
                    )}
                    {tipText && (
                      <p className="text-[11px] text-amber-700 font-medium">
                        💡 {tipText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fields Detected & Explanations - Compact List */}
      <div className="space-y-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2563EB]" />
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900">
              📋 {t.detectedFields} ({filteredFields.length})
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              id="filter-all-btn"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'all'
                  ? 'bg-white text-[#2563EB] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              id="filter-confusing-btn"
              onClick={() => setFilterType('confusing')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'confusing'
                  ? 'bg-white text-[#2563EB] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterConfusing}
            </button>
            <button
              id="filter-required-btn"
              onClick={() => setFilterType('required')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === 'required'
                  ? 'bg-white text-[#2563EB] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filterRequired}
            </button>
          </div>
        </div>

        {/* Compact List */}
        <div className="divide-y divide-slate-100 rounded-[18px] border border-slate-200 overflow-hidden bg-slate-50/30">
          {filteredFields.map((field) => {
            const isExpanded = expandedFieldId === field.id;
            const explanationText = getLocalized(field.explanation);
            const commonMistakesText = getLocalized(field.commonMistakes);

            return (
              <div key={field.id} className="transition-all bg-white hover:bg-slate-50/80">
                {/* Row Header */}
                <button
                  onClick={() => setExpandedFieldId(isExpanded ? null : field.id)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {field.isRequired ? (
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 font-extrabold text-xs">
                        ✓
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 font-bold text-xs">
                        ○
                      </div>
                    )}

                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-sm block truncate">
                        {field.fieldName}
                      </span>
                      {field.originalText && field.originalText !== field.fieldName && (
                        <span className="text-[11px] text-slate-400 font-mono truncate block">
                          "{field.originalText}"
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {field.isConfusing && (
                      <span className="hidden sm:inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600 mr-1 inline" />
                        {t.confusingBadge}
                      </span>
                    )}

                    {field.isRequired ? (
                      <span className="text-xs font-bold text-[#2563EB] bg-[#DBEAFE] px-2.5 py-0.5 rounded-md border border-blue-200">
                        {t.requiredBadge}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {t.optionalBadge}
                      </span>
                    )}

                    <div className={`p-1 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Detail View */}
                {isExpanded && (
                  <div className="px-5 py-4 bg-blue-50/50 border-t border-slate-100 space-y-3 animate-fade-in">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{field.fieldName}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">
                        {explanationText}
                      </p>
                    </div>

                    {field.exampleValue && (
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 inline-block">
                        <span className="font-bold text-slate-800">{t.exampleLabel}: </span>
                        <span className="font-mono text-[#2563EB] font-bold">{field.exampleValue}</span>
                      </div>
                    )}

                    {commonMistakesText && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.commonMistakesLabel}</span>
                        </div>
                        <p className="text-amber-800">{commonMistakesText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Fill CTA */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-center">
        <button
          id="start-guided-bottom-btn"
          onClick={onStartGuidedFilling}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-base shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{t.startFillingButton}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
