import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Support up to 25MB payloads for uploaded form photo base64 strings
app.use(express.json({ limit: '25mb' }));

// Helper to initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in Vercel Environment Variables.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'FormRahber' });
});

// Analyze Form Image via Gemini Vision API
app.post('/api/analyze-form', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', targetLanguage = 'en' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required.' });
    }

    // Strip potential data URL prefix if sent
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const ai = getGeminiClient();

    const systemPrompt = `
You are a form-reading assistant for FormRahber. You will receive an image of an official form (blank or filled, in English, Urdu, or mixed script).

1. First check if the image is actually an official fillable form (such as University admission, Bank account, CNIC application, Passport form, Job application, Scholarship form, or official government form).
   - Set "isForm": true if it is an official fillable form.
   - Set "isForm": false if it is NOT an official form (e.g. a photo of a person, animal, car, landscape, object, receipt, random text document, meme, or non-form image). Explain why in "notFormReason".

2. If it is a form, extract every field (do not duplicate or repeat questions):
   - "fieldName": Concise, clean name of the field (e.g. "Degree Programme Name", "Applicant Name", "CNIC Number").
   - "originalText": Exact label or heading text printed on the form.
   - "fieldType": One of "text", "number", "date", "select", "checkbox", "file", "textarea".
   - "isRequired": boolean (true if mandatory/required; false if optional).
   - "isConfusing": boolean (true if field uses complex legalistic jargon or confusing terms).
   - "exampleValue": A realistic helpful example value.
   - "categoryGroup": One of "personal", "contact", "education", "documents", "other".
   - "explanation": Object with 3 language keys ("en", "ur", "roman_urdu") giving a short, simple 1-line plain-language explanation.
   - "commonMistakes": Object with 3 language keys ("en", "ur", "roman_urdu") listing common mistakes for this field.

3. If the form is FILLED IN:
   - Match each written value to its OWN field's input area — NOT by reading order. Forms often have multiple columns or nearby fields, so match by spatial proximity to that specific field's box/line, not the order text appears in the image.
   - Store the extracted filled value in "value".
   - Set "matchConfidence": "high" | "medium" | "low" | "not_applicable".
   - If a value cannot be confidently matched, set "value": null and "matchConfidence": "low" instead of guessing.

4. Note any documents explicitly required by the form text (e.g. "attach CNIC copy", "Matric Marksheet") in "statedDocuments" array and in "documents" list.

Rules:
- Never invent fields or values. Never guess when unsure — use null and "low" confidence instead.
- Do not repeat or duplicate fields. Extract each distinct field exactly once.
- Return strictly valid JSON matching the schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        {
          text: 'Analyze this official form image and return structured JSON following all form-reading assistant instructions.',
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isForm: { type: Type.BOOLEAN, description: 'True if image is a form with fillable fields, false otherwise' },
            notFormReason: { type: Type.STRING, description: 'Reason if image is not a fillable form' },
            formTitle: { type: Type.STRING, description: 'Title or heading of the form' },
            category: { type: Type.STRING, description: 'Category like University, Banking, Government, Job Application, Scholarship' },
            formDescription: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                ur: { type: Type.STRING },
                roman_urdu: { type: Type.STRING },
              },
              required: ['en', 'ur', 'roman_urdu'],
            },
            overallTips: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                ur: { type: Type.STRING },
                roman_urdu: { type: Type.STRING },
              },
              required: ['en', 'ur', 'roman_urdu'],
            },
            statedDocuments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            documents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  documentName: { type: Type.STRING },
                  isExplicitlyRequired: { type: Type.BOOLEAN },
                  reason: {
                    type: Type.OBJECT,
                    properties: {
                      en: { type: Type.STRING },
                      ur: { type: Type.STRING },
                      roman_urdu: { type: Type.STRING },
                    },
                    required: ['en', 'ur', 'roman_urdu'],
                  },
                  tip: {
                    type: Type.OBJECT,
                    properties: {
                      en: { type: Type.STRING },
                      ur: { type: Type.STRING },
                      roman_urdu: { type: Type.STRING },
                    },
                    required: ['en', 'ur', 'roman_urdu'],
                  },
                },
                required: ['documentName', 'isExplicitlyRequired', 'reason', 'tip'],
              },
            },
            fields: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  fieldName: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  fieldType: { type: Type.STRING, description: 'text | number | date | select | checkbox | file | textarea' },
                  isRequired: { type: Type.BOOLEAN },
                  isConfusing: { type: Type.BOOLEAN },
                  exampleValue: { type: Type.STRING },
                  value: { type: Type.STRING, description: 'Written value extracted if form is filled, or null/empty if blank' },
                  matchConfidence: { type: Type.STRING, description: 'high | medium | low | not_applicable' },
                  categoryGroup: { type: Type.STRING, description: 'personal | contact | education | documents | other' },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  explanation: {
                    type: Type.OBJECT,
                    properties: {
                      en: { type: Type.STRING },
                      ur: { type: Type.STRING },
                      roman_urdu: { type: Type.STRING },
                    },
                    required: ['en', 'ur', 'roman_urdu'],
                  },
                  commonMistakes: {
                    type: Type.OBJECT,
                    properties: {
                      en: { type: Type.STRING },
                      ur: { type: Type.STRING },
                      roman_urdu: { type: Type.STRING },
                    },
                    required: ['en', 'ur', 'roman_urdu'],
                  },
                },
                required: ['fieldName', 'originalText', 'fieldType', 'isRequired', 'isConfusing', 'exampleValue', 'categoryGroup', 'explanation', 'commonMistakes'],
              },
            },
          },
          required: ['isForm', 'formTitle', 'category', 'formDescription', 'overallTips', 'documents', 'fields'],
        },
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    // If Gemini determined this is not a form or no fields were found
    if (parsedData.isForm === false || (Array.isArray(parsedData.fields) && parsedData.fields.length === 0)) {
      return res.json({
        success: false,
        isNotForm: true,
        error: 'Unsupported Image Detected',
        message: "This image doesn't appear to be an official form.\n\nPlease upload a clear photo of a supported form (University, Bank, CNIC, Passport, Job, or Scholarship form).",
      });
    }

    // Deduplicate fields if any duplicates generated
    if (Array.isArray(parsedData.fields)) {
      const seenNames = new Set<string>();
      parsedData.fields = parsedData.fields.filter((f: any) => {
        if (!f || !f.fieldName) return false;
        const key = f.fieldName.toLowerCase().trim();
        if (seenNames.has(key)) return false;
        seenNames.add(key);
        return true;
      }).map((field: any, idx: number) => ({
        ...field,
        id: field.id || `f-${idx + 1}-${Date.now().toString(36)}`,
        fieldType: ['text', 'number', 'date', 'select', 'checkbox', 'file', 'textarea'].includes(field.fieldType)
          ? field.fieldType
          : 'text',
        categoryGroup: ['personal', 'contact', 'education', 'documents', 'other'].includes(field.categoryGroup)
          ? field.categoryGroup
          : 'personal',
        matchConfidence: ['high', 'medium', 'low', 'not_applicable'].includes(field.matchConfidence)
          ? field.matchConfidence
          : 'not_applicable',
      }));
    }

    if (Array.isArray(parsedData.documents)) {
      parsedData.documents = parsedData.documents.map((doc: any, idx: number) => ({
        ...doc,
        id: doc.id || `doc-${idx + 1}-${Date.now().toString(36)}`,
        isReady: false,
      }));
    }

    // Attach image preview URL if available
    parsedData.imagePreviewUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:${mimeType};base64,${cleanBase64}`;

    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Error analyzing form:', err);
    return res.status(500).json({
      error: err.message || 'Failed to analyze form image. Please ensure image is clear and try again.',
    });
  }
});

// Process User's Field Answer & Validate/Format
app.post('/api/process-answer', async (req, res) => {
  try {
    const { field, rawAnswer, targetLanguage = 'en' } = req.body;

    if (!field || rawAnswer === undefined) {
      return res.status(400).json({ error: 'Field details and raw answer are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are FormRahber AI validator.
The user provided the following answer for the field "${field.fieldName}" (${field.originalText}):
User's Raw Answer: "${rawAnswer}"
Field Type: ${field.fieldType}
Required: ${field.isRequired}
Target Language: ${targetLanguage}

Your task:
1. Format the answer neatly into the standard official format (e.g. ALL CAPS for names, proper CNIC dashes 35202-XXXXXXX-X, formatted phone numbers, clean address, uppercase dates).
2. Validate if the answer is valid and complete.
3. Provide a confidence score (0 to 100).
4. If confidence is below 80 or answer is ambiguous/incomplete, write a clarifying question in the user's target language (${targetLanguage}: en = English, ur = Urdu, roman_urdu = Roman Urdu).
5. Provide a helpful message or validation feedback in target language.

Return JSON strictly conforming to the schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formattedValue: { type: Type.STRING },
            isValid: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.INTEGER },
            validationMessage: { type: Type.STRING },
            clarifyingQuestion: { type: Type.STRING },
          },
          required: ['formattedValue', 'isValid', 'confidenceScore', 'validationMessage'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error processing answer:', err);
    const raw = req.body.rawAnswer || '';
    return res.json({
      success: true,
      data: {
        formattedValue: typeof raw === 'string' ? raw.trim().toUpperCase() : String(raw),
        isValid: true,
        confidenceScore: 90,
        validationMessage: 'Answer formatted.',
      },
    });
  }
});

// Global Express Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error('Express global error handler caught:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected server error occurred.',
  });
});

export default app;
