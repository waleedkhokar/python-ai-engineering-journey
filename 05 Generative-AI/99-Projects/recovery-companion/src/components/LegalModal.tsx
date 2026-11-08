import React, { useState } from 'react';
import { ShieldCheck, FileText, X, Check, Lock, Database, Trash2, Eye, AlertTriangle } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, defaultTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              {activeTab === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-black text-lg text-white tracking-tight">Recovery Companion Legal Terms</h2>
              <p className="text-xs text-slate-400 font-medium">Plain-language transparency for patients & caregivers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Scroll Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-emerald-950 mb-1">Your Personal Health Privacy First</p>
                  <p className="text-xs text-emerald-800 font-medium">
                    We collect only what is necessary to generate your post-hospital recovery plan and track your medications. We never sell your health data to third parties.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>1. What Data We Collect</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li><strong>Account Credentials:</strong> Email address and display name via Google SSO or Email Sign-in.</li>
                  <li><strong>Recovery Paperwork & Notes:</strong> Uploaded discharge papers, photos, or manual medical notes you submit.</li>
                  <li><strong>Medication & Care Log:</strong> Dosage timings, medication adherence logs, and follow-up appointment dates.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>2. Where Your Data Is Stored & Secured</span>
                </h3>
                <p className="text-slate-600">
                  Your data is stored in Google Cloud Firestore with strict user-level access security rules. Only your authenticated user account can read or modify your personal recovery records.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>3. AI Processing & Third Parties</span>
                </h3>
                <p className="text-slate-600">
                  We use secure server-side Google Gemini AI models to analyze document text and generate clear summaries. Your documents are processed solely for generating your recovery plan and are not used for advertising or public training.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>4. Your Right to Delete Data</span>
                </h3>
                <p className="text-slate-600">
                  You can delete your recovery records or account at any time from the Profile tab. Deleting your plan immediately removes it from Firestore storage.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-amber-950 mb-1">Important Medical Disclaimer</p>
                  <p className="text-xs text-amber-800 font-medium">
                    Recovery Companion is an educational explanation and organization tool. It is NOT a medical device, does not provide diagnoses, and does not replace professional medical advice.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  1. Explanation & Organization Tool
                </h3>
                <p className="text-slate-600">
                  Recovery Companion simplifies dense clinical paperwork into easy-to-read timelines and daily checklists. It is intended to assist you and your family caregiver in following instructions given by your hospital doctors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  2. Always Verify Prescriptions
                </h3>
                <p className="text-slate-600">
                  Always check your actual pill bottles and official hospital discharge paper before taking medication. If you notice any discrepancy between your pill bottle label and this application, consult your pharmacist or physician immediately.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                  3. Emergency Situations
                </h3>
                <p className="text-slate-600">
                  Do NOT rely on this application in medical emergencies. If you experience chest pain, severe bleeding, difficulty breathing, or sudden weakness, call 911 or proceed to the nearest emergency room immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>I Understand</span>
          </button>
        </div>

      </div>
    </div>
  );
};
