import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { AppLanguage, FormAnalysisResult, FormField, UserAnswer } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { OFFICIAL_FORM_SVG_DATA_URI } from '../utils/officialFormTemplate';
import {
  Download,
  Printer,
  FileCheck,
  Edit3,
  Move,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  X,
  Type,
  Eye,
  Sliders,
  RotateCcw,
} from 'lucide-react';

interface FormExportPreviewProps {
  currentLang: AppLanguage;
  analysis: FormAnalysisResult;
  userAnswers: Record<string, UserAnswer>;
  formImageUrl?: string;
  onUpdateAnswer: (fieldId: string, newValue: string) => void;
  onBackToSummary: () => void;
  onStartNewForm: () => void;
}

interface CustomPosition {
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  fontSize: number; // px
}

export const FormExportPreview: React.FC<FormExportPreviewProps> = ({
  currentLang,
  analysis,
  userAnswers,
  formImageUrl,
  onUpdateAnswer,
  onBackToSummary,
  onStartNewForm,
}) => {
  const t = TRANSLATIONS[currentLang];
  const fields = analysis.fields;

  // Image source fallback
  const sourceImage = formImageUrl || analysis.imagePreviewUrl || OFFICIAL_FORM_SVG_DATA_URI;

  // State for interactive field positions (initialized to default staggered grid or provided position)
  const [positions, setPositions] = useState<Record<string, CustomPosition>>({});
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(fields[0]?.id || null);
  const [inkColor, setInkColor] = useState<'blue' | 'black' | 'darkblue'>('blue');
  const [fontFamily, setFontFamily] = useState<'sans' | 'mono' | 'serif'>('sans');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'positions'>('preview');

  // Edit value modal
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize field positions
  useEffect(() => {
    const initialPos: Record<string, CustomPosition> = {};
    const seen = new Set<string>();
    const uniqueFields = fields.filter((f) => {
      const key = f.fieldName.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    uniqueFields.forEach((field, index) => {
      // Clean 2-column layout mapping across form document height
      const row = Math.floor(index / 2);
      const col = index % 2;
      const defaultY = 16 + row * 6.5;
      const defaultX = col === 0 ? 24 : 64;
      initialPos[field.id] = {
        xPercent: field.position?.xPercent ?? defaultX,
        yPercent: field.position?.yPercent ?? defaultY,
        fontSize: field.position?.fontSize ?? 15,
      };
    });
    setPositions(initialPos);
  }, [fields]);

  // Generate combined high-resolution canvas
  const renderCombinedCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = sourceImage;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1240;
        canvas.height = img.naturalHeight || 1754;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context failed');

        // Draw background original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Styling for ink text
        let hexColor = '#1e3a8a'; // Blue
        if (inkColor === 'black') hexColor = '#0f172a';
        if (inkColor === 'darkblue') hexColor = '#0f172a';

        let fontStr = 'bold sans-serif';
        if (fontFamily === 'mono') fontStr = 'bold monospace';
        if (fontFamily === 'serif') fontStr = 'bold serif';

        // Draw answer text overlays
        fields.forEach((field) => {
          const answer = userAnswers[field.id]?.value;
          if (!answer) return;

          const pos = positions[field.id] || { xPercent: 20, yPercent: 20, fontSize: 14 };
          const pixelX = (pos.xPercent / 100) * canvas.width;
          const pixelY = (pos.yPercent / 100) * canvas.height;
          const scaledFontSize = Math.max(12, Math.round((pos.fontSize / 500) * canvas.width));

          ctx.font = `${scaledFontSize}px ${fontStr}`;
          ctx.fillStyle = hexColor;

          // Draw text with crisp background pill if needed for high legibility
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 4;
          ctx.fillText(answer, pixelX, pixelY);
          ctx.shadowBlur = 0;
        });

        resolve(canvas);
      };

      img.onerror = () => {
        reject('Failed to load form image');
      };
    });
  };

  // Download filled form as PNG image
  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await renderCombinedCanvas();
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `FormRahber_Filled_${analysis.formTitle.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('PNG Export failed', err);
      alert('Could not export image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Download filled form as PDF using jsPDF
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await renderCombinedCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`FormRahber_Filled_${analysis.formTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Export failed', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Print filled form
  const handlePrintForm = async () => {
    try {
      const canvas = await renderCombinedCanvas();
      const dataUrl = canvas.toDataURL('image/png', 1.0);

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Filled Form - ${analysis.formTitle}</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
                img { max-width: 100%; height: auto; display: block; }
                @page { size: auto; margin: 0mm; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error('Print failed', err);
      alert('Could not initiate printing.');
    }
  };

  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialXPercent: number; initialYPercent: number } | null>(null);

  // Handle drag initiation for desktop cursor and mobile touch
  const handlePointerDown = (fieldId: string, clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const currentPos = positions[fieldId] || { xPercent: 20, yPercent: 20, fontSize: 14 };

    setDraggingFieldId(fieldId);
    setSelectedFieldId(fieldId);

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialXPercent: currentPos.xPercent,
      initialYPercent: currentPos.yPercent,
    };
  };

  // Global move & release listeners for dragging with cursor or touch
  useEffect(() => {
    if (!draggingFieldId) return;

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current || !dragStartRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const deltaX = clientX - dragStartRef.current.startX;
      const deltaY = clientY - dragStartRef.current.startY;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      const newX = Math.max(1, Math.min(99, dragStartRef.current.initialXPercent + deltaXPercent));
      const newY = Math.max(1, Math.min(99, dragStartRef.current.initialYPercent + deltaYPercent));

      setPositions((prev) => ({
        ...prev,
        [draggingFieldId]: {
          ...(prev[draggingFieldId] || { xPercent: 20, yPercent: 20, fontSize: 14 }),
          xPercent: Number(newX.toFixed(2)),
          yPercent: Number(newY.toFixed(2)),
        },
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerUp = () => {
      setDraggingFieldId(null);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('touchcancel', onPointerUp);
    };
  }, [draggingFieldId]);

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
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-8 px-4 flex flex-col space-y-6 animate-fade-in">

      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="export-back-to-summary-btn"
          onClick={onBackToSummary}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Summary</span>
        </button>
      </div>

      {/* Title Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Filled Form Preview & Export
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Review your validated answers overlaid onto the official form image. Download or print directly.
          </p>
        </div>

        {/* Primary Export Action Group */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="export-png-btn"
            disabled={isDownloading}
            onClick={handleDownloadPNG}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>

          <button
            id="export-pdf-btn"
            disabled={isDownloading}
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Download PDF</span>
          </button>

          <button
            id="export-print-btn"
            onClick={handlePrintForm}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Form</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Form Image Canvas + Controls Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Form Image Preview Area */}
        <div className="lg:col-span-8 bg-slate-900/95 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl overflow-hidden space-y-4">
          
          {/* Top Canvas Toolbar */}
          <div className="flex items-center justify-between text-white text-xs px-2">
            <span className="font-bold flex items-center gap-2 text-slate-300">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Official Document Canvas</span>
            </span>

            {/* Zoom controls & Ink Color selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 rounded-lg p-1 gap-1">
                <button
                  id="canvas-zoom-out-btn"
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
                  className="p-1 hover:bg-slate-700 rounded text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1">{zoomLevel}%</span>
                <button
                  id="canvas-zoom-in-btn"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                  className="p-1 hover:bg-slate-700 rounded text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ink color picker */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                <button
                  id="ink-color-blue"
                  onClick={() => setInkColor('blue')}
                  className={`w-5 h-5 rounded-full bg-blue-600 border ${inkColor === 'blue' ? 'border-white ring-2 ring-blue-400' : 'border-transparent'}`}
                  title="Blue Official Ink"
                />
                <button
                  id="ink-color-black"
                  onClick={() => setInkColor('black')}
                  className={`w-5 h-5 rounded-full bg-slate-900 border ${inkColor === 'black' ? 'border-white ring-2 ring-slate-400' : 'border-transparent'}`}
                  title="Black Ink"
                />
              </div>
            </div>
          </div>

          {/* Canvas Wrapper with Relative Text Overlays */}
          <div className="overflow-auto max-h-[70vh] min-h-[480px] rounded-2xl bg-slate-950/80 p-4 border border-slate-800/80 flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative transition-all duration-200 ease-out shadow-2xl bg-white rounded-lg overflow-hidden shrink-0 mx-auto"
              style={{
                maxHeight: `${Math.round(580 * (zoomLevel / 100))}px`,
                maxWidth: '100%',
              }}
            >
              {/* Original Form Image */}
              <img
                src={sourceImage}
                alt={analysis.formTitle}
                className="block select-none pointer-events-none w-auto h-auto mx-auto object-contain"
                style={{
                  maxHeight: `${Math.round(580 * (zoomLevel / 100))}px`,
                  maxWidth: '100%',
                }}
              />

              {/* Text Overlays for each user answer */}
              {fields.map((field) => {
                const answer = userAnswers[field.id]?.value;
                if (!answer) return null;

                const pos = positions[field.id] || { xPercent: 20, yPercent: 20, fontSize: 14 };
                const isSelected = selectedFieldId === field.id;
                const isDragging = draggingFieldId === field.id;

                let textColor = 'text-black';

                return (
                  <div
                    key={field.id}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handlePointerDown(field.id, e.clientX, e.clientY);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      if (e.touches.length > 0) {
                        handlePointerDown(field.id, e.touches[0].clientX, e.touches[0].clientY);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFieldId(field.id);
                    }}
                    style={{
                      left: `${pos.xPercent}%`,
                      top: `${pos.yPercent}%`,
                      fontSize: `${Math.max(11, Math.round((pos.fontSize * zoomLevel) / 100))}px`,
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing font-bold px-1 py-0.5 rounded transition-all select-none touch-none text-black border-none bg-transparent ${
                      isSelected || isDragging
                        ? 'ring-2 ring-blue-500/70 z-30 scale-105'
                        : 'z-10 hover:ring-1 hover:ring-slate-300'
                    }`}
                  >
                    <span className="whitespace-nowrap">{answer}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] font-medium text-slate-300 text-center flex items-center justify-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Drag any field using cursor on desktop or touch on mobile to adjust position.</span>
          </p>

        </div>

        {/* Right Drawer: Field Positions & Answers List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Field Placement & Editing</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {fields.filter((f) => userAnswers[f.id]?.value).length} Populated
            </span>
          </div>

          {/* Selected Field Drag & Edit Info Card */}
          {selectedFieldId && (
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-blue-950 uppercase tracking-wider text-[10px]">
                  Selected Field
                </span>
                <span className="font-bold text-blue-700">
                  {fields.find((f) => f.id === selectedFieldId)?.fieldName}
                </span>
              </div>

              <div className="p-2.5 bg-white/90 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-900 font-medium">
                <Move className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Move position on document using cursor or touch drag.</span>
              </div>

              {/* Edit text value */}
              <button
                id={`edit-selected-${selectedFieldId}`}
                onClick={() => handleOpenEdit(selectedFieldId)}
                className="w-full py-2 rounded-xl bg-white border border-blue-300 text-blue-900 font-bold text-xs hover:bg-blue-100/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Answer Text</span>
              </button>
            </div>
          )}

          {/* List of Populated Fields */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {fields.map((f) => {
              const val = userAnswers[f.id]?.value;
              const isSelected = selectedFieldId === f.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-400'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 overflow-hidden">
                    <p className="font-bold text-slate-800 truncate">{f.fieldName}</p>
                    <p className="text-slate-600 font-semibold truncate">
                      {val || <span className="text-slate-400 italic">Not Filled</span>}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(f.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Edit Value Modal */}
      {editingFieldId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit Value for Export
              </h3>
              <button
                id="close-export-edit-modal-btn"
                onClick={() => setEditingFieldId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              id="export-edit-field-input"
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-base font-semibold"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                id="cancel-export-edit-modal-btn"
                onClick={() => setEditingFieldId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                id="save-export-edit-modal-btn"
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
