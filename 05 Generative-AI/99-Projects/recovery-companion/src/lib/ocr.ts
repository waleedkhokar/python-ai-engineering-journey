import { recognize } from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
  base64?: string;
  mimeType?: string;
}

/**
 * Detects and normalizes the MIME type of an uploaded file.
 */
export function detectMimeType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    let type = file.type.toLowerCase();
    if (type === 'image/jpg') return 'image/jpeg';
    return type;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'application/pdf';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Resizes and compresses image files using HTML5 Canvas to prevent payload oversized errors
 */
function compressImageFile(
  file: File,
  maxDimension: number = 1800,
  quality: number = 0.85
): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      resolve({ base64: base64.trim(), mimeType: 'image/jpeg' });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to read this scan. Please upload a clearer image.'));
    };
    img.src = url;
  });
}

/**
 * Converts a File object to a clean base64 string.
 * Automatically compresses large image scans to ensure fast AI processing.
 */
export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  const mimeType = detectMimeType(file);

  // If PDF, convert directly to Base64 without image canvas compression
  if (mimeType === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve({ base64: base64.trim(), mimeType: 'application/pdf' });
      };
      reader.onerror = () => reject(new Error('File upload failed. Please try again.'));
      reader.readAsDataURL(file);
    });
  }

  // For high-res images (> 1.5MB), compress using HTML5 canvas
  if (file.size > 1.5 * 1024 * 1024 && mimeType.startsWith('image/')) {
    try {
      return await compressImageFile(file, 1800, 0.85);
    } catch (e) {
      console.warn('Canvas image compression notice, continuing with raw image:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve({ base64: base64.trim(), mimeType });
    };
    reader.onerror = () => reject(new Error('File upload failed. Please try again.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts text from an image or document using Tesseract.js OCR.
 * Supports JPG, JPEG, PNG, WEBP, and handles PDF files gracefully.
 */
export async function extractTextWithTesseract(
  file: File,
  onProgress?: (status: string, progressPct: number) => void
): Promise<OcrResult> {
  const mimeType = detectMimeType(file);

  // PDF documents are sent directly to Gemini AI (which has native multi-page PDF vision capabilities)
  if (mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    if (onProgress) {
      onProgress('PDF attached — forwarding document directly to Gemini AI vision...', 100);
    }
    return {
      text: `[PDF Document Attached: ${file.name}]`,
      confidence: 100,
      mimeType: 'application/pdf'
    };
  }

  try {
    if (onProgress) {
      onProgress('Initializing OCR scan engine...', 5);
    }

    const res = await recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          if (onProgress) {
            onProgress(`OCR: Extracting Text (${pct}%)...`, pct);
          }
        } else if (m.status) {
          const friendlyStatus = m.status.replace(/_/g, ' ');
          if (onProgress) {
            onProgress(`OCR: ${friendlyStatus}...`, 25);
          }
        }
      }
    });

    const text = res.data.text ? res.data.text.trim() : '';
    const confidence = res.data.confidence || 0;
    return { text, confidence, mimeType };
  } catch (error) {
    console.warn('Tesseract OCR engine notice (continuing to Gemini AI vision):', error);
    return {
      text: `[Scan attached: ${file.name}]`,
      confidence: 50,
      mimeType
    };
  }
}
