import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  CheckCircle2, 
  Building2, 
  Pill, 
  AlertTriangle, 
  Send, 
  Phone, 
  FileText,
  Clock
} from 'lucide-react';
import { MedicationItem } from '../types';

interface RefillRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: MedicationItem | null;
  patientName: string;
  onMarkRefillRequested: (medId: string) => void;
  onUpdatePharmacyEmail?: (medId: string, email: string) => void;
}

export const RefillRequestModal: React.FC<RefillRequestModalProps> = ({
  isOpen,
  onClose,
  medication,
  patientName,
  onMarkRefillRequested,
  onUpdatePharmacyEmail
}) => {
  if (!isOpen || !medication) return null;

  const [pharmacyEmail, setPharmacyEmail] = useState<string>(
    medication.pharmacyEmail || 'refills@hospitalpharmacy.org'
  );
  const [rxNumber, setRxNumber] = useState<string>(
    medication.rxNumber || 'RX-884201'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [emailSentStatus, setEmailSentStatus] = useState<boolean>(
    medication.refillRequested || false
  );

  useEffect(() => {
    if (medication) {
      setPharmacyEmail(medication.pharmacyEmail || 'refills@hospitalpharmacy.org');
      setRxNumber(medication.rxNumber || 'RX-884201');
      setEmailSentStatus(medication.refillRequested || false);
      setCopied(false);
    }
  }, [medication]);

  const subjectText = `REFILL REQUEST: ${patientName} - Rx #${rxNumber} (${medication.name} ${medication.dosage})`;
  
  const bodyText = `Dear Pharmacy Team,

Please accept this refill request for my prescription medication:

• Patient Name: ${patientName}
• Medication: ${medication.name} ${medication.genericName ? `(${medication.genericName})` : ''} ${medication.dosage}
• Rx Number: ${rxNumber}
• Dosage / Schedule: ${medication.frequency} (${medication.timeLabel})
• Current Remaining Supply: ${medication.remainingQuantity ?? 'Low'} dose(s) left
• Purpose: ${medication.purpose}

Please contact me if you need additional authorization or confirmation from my physician.

Thank you,
${patientName}
(Refill requested via DischargeCare AI)`.trim();

  const handleOpenMailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(pharmacyEmail)}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    window.open(mailtoUrl, '_blank');
    onMarkRefillRequested(medication.id);
    setEmailSentStatus(true);
    if (onUpdatePharmacyEmail) {
      onUpdatePharmacyEmail(medication.id, pharmacyEmail);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subjectText}\n\n${bodyText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleConfirmRequested = () => {
    onMarkRefillRequested(medication.id);
    setEmailSentStatus(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="heavy-type text-xl uppercase tracking-wider text-white">Pharmacy Refill Request</h2>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Send official prescription refill details directly to your pharmacy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Low Supply Alert Tag */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black uppercase tracking-wider text-amber-900 block text-xs">
                Low Prescription Quantity Warning
              </span>
              <p className="text-xs font-bold text-amber-800 mt-0.5">
                Only <strong className="text-amber-950 underline">{medication.remainingQuantity ?? 'Few'} dose(s)</strong> remaining for {medication.name}. Submit your refill request 48 hours in advance.
              </p>
            </div>
          </div>

          {/* Rx Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <span className="font-black uppercase text-slate-900 text-sm">{medication.name}</span>
                {medication.genericName && (
                  <span className="text-slate-500 font-bold">({medication.genericName})</span>
                )}
              </div>
              <span className="mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                {medication.dosage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-semibold text-slate-700 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Frequency:</span>
                <span>{medication.frequency}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Purpose:</span>
                <span className="text-slate-800">{medication.purpose}</span>
              </div>
            </div>
          </div>

          {/* Editable Pharmacy Details Form */}
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Pharmacy Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={pharmacyEmail}
                    onChange={(e) => setPharmacyEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="pharmacy@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                  Prescription Rx Number:
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={rxNumber}
                    onChange={(e) => setRxNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 text-xs"
                    placeholder="RX-123456"
                  />
                </div>
              </div>
            </div>

            {/* Formatted Email Content Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Formatted Email Message Preview:
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Body'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed border border-slate-800 space-y-2 select-all">
                <div className="text-blue-400 font-bold border-b border-slate-800 pb-1.5">
                  Subject: {subjectText}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 pt-1">
                  {bodyText}
                </pre>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {emailSentStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-bold flex items-center space-x-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Refill status updated to <strong>"Refill Requested"</strong>. Your pharmacy has been notified!</span>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleConfirmRequested}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-black uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mark as Requested Only</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleOpenMailClient}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Email to Pharmacy</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
