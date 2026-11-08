import React, { useState, useEffect } from 'react';
import { safeFetchJson } from '../lib/apiUtils';
import { Languages, X, Volume2, Loader2, Sparkles, AlertTriangle, Printer, Copy, Check, Pill, ShieldAlert } from 'lucide-react';
import { MedicationItem } from '../types';

interface UrduMedicationItem {
  medicineName: string;
  dosageUrdu: string;
  timeUrdu: string;
  purposeUrdu: string;
  precautionsUrdu: string;
}

interface UrduExplanationData {
  overallSummaryUrdu: string;
  audioScriptUrdu: string;
  medicationsUrdu: UrduMedicationItem[];
  emergencyWarningUrdu: string;
}

interface UrduPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications?: MedicationItem[];
  prescriptionText?: string;
}

export const UrduPrescriptionModal: React.FC<UrduPrescriptionModalProps> = ({
  isOpen,
  onClose,
  medications,
  prescriptionText
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UrduExplanationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && (medications?.length || prescriptionText)) {
      fetchUrduExplanation();
    }
  }, [isOpen, medications, prescriptionText]);

  const fetchUrduExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const resData = await safeFetchJson('/api/explain-urdu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications, prescriptionText }),
        retries: 2,
        timeoutMs: 30000
      });
      if (resData && resData.explanation) {
        setData(resData.explanation);
      } else {
        throw new Error('کیفیت حاصل نہیں ہو سکی');
      }
    } catch (err: any) {
      console.error('Urdu explanation error:', err);
      setError('نیٹ ورک یا کنکشن کے مسئلے کی وجہ سے فوری وضاحت لوڈ نہیں ہو سکی۔ براہ کرم نیچے "دوبارہ کوشش کریں" پر کلک کریں۔');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTTS = () => {
    if (!data?.audioScriptUrdu && !data?.overallSummaryUrdu) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${data.overallSummaryUrdu}. ${data.medicationsUrdu.map(m => `${m.medicineName}: ${m.dosageUrdu}, ${m.timeUrdu}. ${m.purposeUrdu}`).join('. ')}`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ur-PK';
    utterance.rate = 0.9; // Slightly slower for clarity

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!data) return;
    const text = `نسخہ کی آسان اردو وضاحت:\n\n${data.overallSummaryUrdu}\n\nادوایات:\n` +
      data.medicationsUrdu.map(m => `• ${m.medicineName}\n  خوراک: ${m.dosageUrdu}\n  وقت: ${m.timeUrdu}\n  مقصد: ${m.purposeUrdu}\n  ہدایات: ${m.precautionsUrdu}\n`).join('\n') +
      `\nہنگامی علامات:\n${data.emergencyWarningUrdu}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-200 shrink-0">
              <Languages className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                  Explain Prescription in Urdu
                </h2>
                <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded">
                  اردو میں نسخہ
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium" dir="rtl">
                ڈاکٹر کے نسخے اور ادویات کی آسان اور واضح اردو ترجمانی
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsPlayingAudio(false);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  Gemini AI Analyzing Prescription in Urdu...
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1" dir="rtl">
                  نسخے کا آسان اردو میں تجزیہ کیا جا رہا ہے، براہ کرم انتظار فرمائیں۔
                </p>
              </div>
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mx-auto mt-2" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs font-bold space-y-2">
              <div className="flex items-center space-x-2 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span className="font-black uppercase">خطا (Error)</span>
              </div>
              <p>{error}</p>
              <button
                onClick={fetchUrduExplanation}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                دوبارہ کوشش کریں (Retry)
              </button>
            </div>
          )}

          {!loading && data && (
            <div className="space-y-6">
              
              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <button
                  onClick={handlePlayTTS}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all border ${
                    isPlayingAudio
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md animate-pulse'
                      : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>{isPlayingAudio ? 'آڈیو بند کریں (Stop Audio)' : 'اردو آڈیو سنیں (Listen Urdu Audio)'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center space-x-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? 'کاپی ہو گیا' : 'کاپی کریں'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>پرنٹ (Print)</span>
                  </button>
                </div>
              </div>

              {/* Summary Card in Urdu */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl space-y-2" dir="rtl">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-950 font-black text-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>مجموعی خلاصہ اور ہدایات (Prescription Overview):</span>
                </div>
                <p className="text-slate-800 font-semibold text-sm leading-relaxed pt-1">
                  {data.overallSummaryUrdu}
                </p>
              </div>

              {/* Medication Cards List in Urdu */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>ادویات کی تفصیل (Prescribed Medicines List)</span>
                  <span className="text-emerald-700 font-bold">{data.medicationsUrdu.length} ادویات</span>
                </h3>

                <div className="space-y-3">
                  {data.medicationsUrdu.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-white border border-slate-200 hover:border-emerald-400 rounded-3xl shadow-xs transition-all space-y-3"
                      dir="rtl"
                    >
                      {/* Medicine Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                            <Pill className="w-4 h-4" />
                          </div>
                          <h4 className="text-base font-black text-slate-950">
                            {item.medicineName}
                          </h4>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-xs rounded-full">
                          {item.dosageUrdu}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">
                            وقت (Timing & Frequency):
                          </span>
                          <p className="font-bold text-slate-900 text-xs">
                            {item.timeUrdu}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">
                            استعمال کا مقصد (Purpose):
                          </span>
                          <p className="font-bold text-emerald-900 text-xs">
                            {item.purposeUrdu}
                          </p>
                        </div>
                      </div>

                      {/* Precautions */}
                      {item.precautionsUrdu && (
                        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium">
                          <strong className="font-black text-amber-900 block mb-0.5">
                            خاص ہدایت / احتیاط (Instructions & Warnings):
                          </strong>
                          <span>{item.precautionsUrdu}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Warning Signs in Urdu */}
              {data.emergencyWarningUrdu && (
                <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-3xl space-y-2" dir="rtl">
                  <div className="flex items-center space-x-2 space-x-reverse text-rose-950 font-black text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>ہنگامی علامات (Emergency Red Flags):</span>
                  </div>
                  <p className="text-rose-900 font-bold text-xs leading-relaxed">
                    {data.emergencyWarningUrdu}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-slate-500">
            Note: This Urdu translation is generated by Gemini 3.6 Flash for patient comprehension. Always verify dosages with your doctor.
          </p>
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsPlayingAudio(false);
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors"
          >
            بند کریں (Close Window)
          </button>
        </div>

      </div>
    </div>
  );
};
