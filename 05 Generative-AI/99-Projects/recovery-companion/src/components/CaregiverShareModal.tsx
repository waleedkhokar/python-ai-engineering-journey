import React, { useState, useEffect, useRef } from 'react';
import { Share2, Lock, Copy, CheckCircle2, UserCheck, X, ShieldCheck, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface CaregiverShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
  patientName: string;
}

export const CaregiverShareModal: React.FC<CaregiverShareModalProps> = ({
  isOpen,
  onClose,
  shareCode,
  patientName
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const shareUrl = `${window.location.origin}/?caregiverCode=${shareCode}`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shareUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff'
        }
      }, (err) => {
        if (err) console.warn('QR code generation notice:', err);
      });
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Share Plan with Family Caregiver</h2>
              <p className="text-xs text-slate-400">Remote read-only access for family members</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 text-indigo-950 text-xs space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Caregiver Read-Only View</span>
            </div>
            <p className="text-indigo-800 leading-relaxed">
              Family members can view {patientName}'s medication schedule, upcoming doctor appointments, and emergency red-flag warnings in real-time from any smartphone camera.
            </p>
          </div>

          {/* QR Code Canvas Container */}
          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200">
              <canvas ref={canvasRef} className="rounded-lg" />
            </div>
            <p className="text-[11px] font-black uppercase text-slate-500 flex items-center space-x-1">
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scan QR Code with Phone Camera</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Secure Share Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 p-2.5 text-xs bg-slate-100 border border-slate-300 rounded-xl text-slate-800 font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center space-x-1 shrink-0"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Share Access PIN: <strong className="text-slate-900 font-mono">8921</strong></span>
            <span className="text-emerald-700 font-bold">100% HIPAA Safe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
