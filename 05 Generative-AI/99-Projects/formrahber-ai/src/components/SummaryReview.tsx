import React, { useState } from 'react';
import { AppLanguage, FormAnalysisResult, RequiredDocument, UserAnswer } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  CheckCircle2,
  Copy,
  Check,
  Edit2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  GraduationCap,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';

interface SummaryReviewProps {
  currentLang: AppLanguage;
  analysis: FormAnalysisResult;
  userAnswers: Record<string, UserAnswer>;
  documents: RequiredDocument[];
  onUpdateAnswer: (fieldId: string, newValue: string) => void;
  onReset: () => void;
  onBackToGuided: () => void;
  onOpenExportPreview?: () => void;
}

export const SummaryReview: React.FC<SummaryReviewProps> = ({
  currentLang,
  analysis,
  userAnswers,
  documents,
  onUpdateAnswer,
  onReset,
  onBackToGuided,
  onOpenExportPreview,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [copied, setCopied] = useState(false);

  // Edit modal state
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Section collapse state (all open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    contact: true,
    education: true,
    other: true,
    documents: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fields = analysis.fields;
  const answeredCount = fields.filter((f) => userAnswers[f.id]?.value?.trim()).length;
  const completionPercent = Math.round((answeredCount / Math.max(1, fields.length)) * 100);

  // Group fields by category
  const personalFields = fields.filter((f) => f.categoryGroup === 'personal' || !f.categoryGroup);
  const contactFields = fields.filter((f) => f.categoryGroup === 'contact');
  const educationFields = fields.filter((f) => f.categoryGroup === 'education');
  const otherFields = fields.filter((f) => f.categoryGroup === 'documents' || f.categoryGroup === 'other');

  // Copy plain text summary
  const handleCopySummary = () => {
    let output = `=====================================\n`;
    output += ` FORMRAHBER - COMPLETED FORM SUMMARY\n`;
    output += ` Form: ${analysis.formTitle}\n`;
    output += `=====================================\n\n`;

    output += `--- PERSONAL INFORMATION ---\n`;
    personalFields.forEach((f) => {
      output += `${f.fieldName}: ${userAnswers[f.id]?.value || '(Not Provided)'}\n`;
    });

    if (contactFields.length > 0) {
      output += `\n--- CONTACT INFORMATION ---\n`;
      contactFields.forEach((f) => {
        output += `${f.fieldName}: ${userAnswers[f.id]?.value || '(Not Provided)'}\n`;
      });
    }

    if (educationFields.length > 0) {
      output += `\n--- EDUCATION ---\n`;
      educationFields.forEach((f) => {
        output += `${f.fieldName}: ${userAnswers[f.id]?.value || '(Not Provided)'}\n`;
      });
    }

    if (otherFields.length > 0) {
      output += `\n--- ADDITIONAL DETAILS ---\n`;
      otherFields.forEach((f) => {
        output += `${f.fieldName}: ${userAnswers[f.id]?.value || '(Not Provided)'}\n`;
      });
    }

    if (documents.length > 0) {
      output += `\n--- REQUIRED DOCUMENTS ---\n`;
      documents.forEach((d) => {
        output += `[${d.isReady ? 'READY' : 'PENDING'}] ${d.documentName}\n`;
      });
    }

    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenEdit = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setEditValue(userAnswers[fieldId]?.value || '');
  };

  const handleSaveEdit = () => {
    if (editingFieldId) {
      onUpdateAnswer(editingFieldId, editValue.trim());
      setEditingFieldId(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-8 px-4 flex flex-col space-y-6 animate-fade-in">

      {/* Navigation & Header */}
      <div className="flex items-center justify-between text-xs">
        <button
          id="summary-back-guided-btn"
          onClick={onBackToGuided}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Back to Guided View</span>
        </button>
      </div>

      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Form Summary & Review
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            {analysis.formTitle} — {completionPercent}% Completed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onOpenExportPreview && (
            <button
              id="summary-open-export-btn"
              onClick={onOpenExportPreview}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Export & Print Filled Form</span>
            </button>
          )}

          <button
            id="summary-copy-btn"
            onClick={handleCopySummary}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-800 font-bold text-sm bg-white hover:bg-slate-50 transition-all shadow-2xs flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Summary Copied!' : 'Copy Form Text'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Section 1: Personal Information */}
      {personalFields.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
          <button
            id="toggle-sec-personal"
            onClick={() => toggleSection('personal')}
            className="w-full px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="text-base font-extrabold text-slate-900">
                Personal Information
              </h2>
            </div>
            {openSections.personal ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSections.personal && (
            <div className="p-6 divide-y divide-slate-100 space-y-3">
              {personalFields.map((f) => (
                <div key={f.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.fieldName}</p>
                    <p className="font-semibold text-slate-900 text-base">
                      {userAnswers[f.id]?.value || <span className="text-slate-400 italic">Not Filled</span>}
                    </p>
                  </div>
                  <button
                    id={`edit-btn-${f.id}`}
                    onClick={() => handleOpenEdit(f.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Edit Field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Section 2: Contact Information */}
      {contactFields.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
          <button
            id="toggle-sec-contact"
            onClick={() => toggleSection('contact')}
            className="w-full px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="text-base font-extrabold text-slate-900">
                Contact Information
              </h2>
            </div>
            {openSections.contact ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSections.contact && (
            <div className="p-6 divide-y divide-slate-100 space-y-3">
              {contactFields.map((f) => (
                <div key={f.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.fieldName}</p>
                    <p className="font-semibold text-slate-900 text-base">
                      {userAnswers[f.id]?.value || <span className="text-slate-400 italic">Not Filled</span>}
                    </p>
                  </div>
                  <button
                    id={`edit-btn-${f.id}`}
                    onClick={() => handleOpenEdit(f.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Edit Field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Section 3: Education */}
      {educationFields.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
          <button
            id="toggle-sec-education"
            onClick={() => toggleSection('education')}
            className="w-full px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="text-base font-extrabold text-slate-900">
                Education
              </h2>
            </div>
            {openSections.education ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSections.education && (
            <div className="p-6 divide-y divide-slate-100 space-y-3">
              {educationFields.map((f) => (
                <div key={f.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.fieldName}</p>
                    <p className="font-semibold text-slate-900 text-base">
                      {userAnswers[f.id]?.value || <span className="text-slate-400 italic">Not Filled</span>}
                    </p>
                  </div>
                  <button
                    id={`edit-btn-${f.id}`}
                    onClick={() => handleOpenEdit(f.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Edit Field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Section 4: Additional Details */}
      {otherFields.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
          <button
            id="toggle-sec-other"
            onClick={() => toggleSection('other')}
            className="w-full px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="text-base font-extrabold text-slate-900">
                Additional Details
              </h2>
            </div>
            {openSections.other ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSections.other && (
            <div className="p-6 divide-y divide-slate-100 space-y-3">
              {otherFields.map((f) => (
                <div key={f.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.fieldName}</p>
                    <p className="font-semibold text-slate-900 text-base">
                      {userAnswers[f.id]?.value || <span className="text-slate-400 italic">Not Filled</span>}
                    </p>
                  </div>
                  <button
                    id={`edit-btn-${f.id}`}
                    onClick={() => handleOpenEdit(f.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Edit Field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Section 5: Required Documents */}
      {documents.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
          <button
            id="toggle-sec-documents"
            onClick={() => toggleSection('documents')}
            className="w-full px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors border-b border-slate-100"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2 className="text-base font-extrabold text-slate-900">
                Required Documents
              </h2>
            </div>
            {openSections.documents ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {openSections.documents && (
            <div className="p-6 space-y-2.5">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center font-bold text-xs ${doc.isReady ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'}`}>
                      {doc.isReady ? '✓' : ''}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{doc.documentName}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${doc.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {doc.isReady ? 'Prepared' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingFieldId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Value
              </h3>
              <button
                id="close-edit-modal-btn"
                onClick={() => setEditingFieldId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              id="edit-field-input"
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-base font-semibold"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                id="cancel-edit-modal-btn"
                onClick={() => setEditingFieldId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                id="save-edit-modal-btn"
                onClick={handleSaveEdit}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
