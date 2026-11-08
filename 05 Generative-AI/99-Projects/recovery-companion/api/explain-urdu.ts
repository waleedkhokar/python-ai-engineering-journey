import { Type } from "@google/genai";
import { getGeminiClient } from "./_gemini";
import { getRequestBody, jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    try {
      const body = await getRequestBody(request);
      const { medications, prescriptionText } = body || {};

      const ai = getGeminiClient();

      const systemInstruction = `You are a clinical pharmacist and medical communicator explaining prescription medicines in simple, easy-to-understand Urdu (اردو) for patients and caregivers.

YOUR MANDATE:
1. Translate and explain every prescription medication into clear Nastaliq/Urdu.
2. For each medicine provided, explain:
   - medicineName (original English name + Urdu transliteration, e.g., Ticagrelor / ٹیکاگریلور)
   - dosageUrdu (خوراک: e.g. 90 ملی گرام - دن میں دو بار)
   - timeUrdu (وقت اور طریقہ: e.g. صبح اور شام پانی کے ساتھ، کھانے کے بعد)
   - purposeUrdu (استعمال کا مقصد: e.g. دل کو صحت مند رکھنے اور خون جمنے سے بچاؤ کے لیے)
   - precautionsUrdu (احتیاطی تدابیر: e.g. باقاعدگی سے لیں، ڈاکٹر کی ہدایت کے بغیر بند نہ کریں)
3. Provide an overall summary in Urdu (مجموعی خلاصہ) summarizing the patient's daily routine.
4. Provide emergency warning signs in Urdu (ہنگامی علامات) when to contact a doctor or seek immediate emergency care.
5. Provide an audio script in Urdu for text-to-speech.

CRITICAL MEDICAL SAFETY BOUNDARIES:
- Keep exact English brand and generic medicine names clearly visible in parentheses.
- Do NOT alter prescribed doses, frequencies, or duration.
- Only explain the provided prescription information without giving new unverified medical advice.`;

      const inputDetails = medications && Array.isArray(medications) && medications.length > 0
        ? JSON.stringify(medications, null, 2)
        : (prescriptionText || "No detailed medications provided.");

      const prompt = `Please explain the following prescription in clear, respectful, plain-language Urdu:
${inputDetails}`;

      let resultObj: any = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  overallSummaryUrdu: { type: Type.STRING },
                  audioScriptUrdu: { type: Type.STRING },
                  medicationsUrdu: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        medicineName: { type: Type.STRING },
                        dosageUrdu: { type: Type.STRING },
                        timeUrdu: { type: Type.STRING },
                        purposeUrdu: { type: Type.STRING },
                        precautionsUrdu: { type: Type.STRING },
                      },
                      required: ["medicineName", "dosageUrdu", "timeUrdu", "purposeUrdu", "precautionsUrdu"],
                    },
                  },
                  emergencyWarningUrdu: { type: Type.STRING },
                },
                required: ["overallSummaryUrdu", "audioScriptUrdu", "medicationsUrdu", "emergencyWarningUrdu"],
              },
            },
          });

          if (response.text) {
            resultObj = JSON.parse(response.text);
            if (resultObj && Array.isArray(resultObj.medicationsUrdu)) {
              break;
            }
          }
        } catch (err) {
          console.warn(`[EXPLAIN_URDU] Attempt ${attempts} failed:`, err);
          if (attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, 800 * attempts));
          }
        }
      }

      // Fallback generator if AI model parsing failed
      if (!resultObj || !Array.isArray(resultObj.medicationsUrdu)) {
        const fallbackMeds = Array.isArray(medications) && medications.length > 0
          ? medications.map((m: any) => ({
              medicineName: `${m.name || 'Medicine'} (${m.name || 'میڈیسن'})`,
              dosageUrdu: `خوراک: ${m.dosage || 'طبی ہدایت کے مطابق'} (${m.frequency || 'روزانہ'})`,
              timeUrdu: `وقت: ${m.scheduleTime || 'باقاعدگی سے'} - ${m.specialInstructions || 'پانی کے ساتھ لیں'}`,
              purposeUrdu: `مقصد: ${m.purpose || 'صحت کی بہتری کے لیے'}`,
              precautionsUrdu: m.specialInstructions || 'ڈاکٹر کے مشورے کے مطابق استعمال کریں اور وقت پر لیں۔',
            }))
          : [
              {
                medicineName: "تجویز کردہ ادویات (Prescribed Medicines)",
                dosageUrdu: "خوراک: ڈاکٹر کی ہدایت کے مطابق",
                timeUrdu: "وقت: روزانہ مقررہ وقت پر",
                purposeUrdu: "مقصد: صحت کی مکمل بحالی کے لیے",
                precautionsUrdu: "نسخے پر عمل کریں اور کوئی بھی دوا خود سے بند نہ کریں۔",
              }
            ];

        resultObj = {
          overallSummaryUrdu: "برائے مہربانی اپنی تمام ادویات ڈاکٹر کی ہدایت کے مطابق باقاعدگی سے استعمال کریں۔ ہر دوا کا وقت اور خوراک کا خیال رکھیں۔",
          audioScriptUrdu: "یہ آپ کی تجویز کردہ ادویات کی آسان اردو تفصیل ہے۔ براہ کرم اپنی تمام ادویات ڈاکٹر کی بتائی گئی خوراک اور وقت کے مطابق لیں۔",
          medicationsUrdu: fallbackMeds,
          emergencyWarningUrdu: "اگر آپ کو شدید سانس کی تکلیف، سینے میں درد، تیز بخار یا الرجی محسوس ہو تو فوری طور پر ڈاکٹر یا قریبی ہسپتال سے رابطہ کریں۔",
        };
      }

      return jsonResponse({ success: true, explanation: resultObj });
    } catch (error: any) {
      console.error("Error explaining prescription in Urdu:", error);
      // Return fallback user-friendly response rather than technical failure
      return jsonResponse({
        success: true,
        explanation: {
          overallSummaryUrdu: "اپنی تمام ادویات ڈاکٹر کے بتائے گئے وقت پر باقاعدگی سے لیں اور ہر دوا کی صحیح خوراک کا خیال رکھیں۔",
          audioScriptUrdu: "برائے مہربانی اپنی تمام ادویات وقت پر اور ڈاکٹر کی ہدایت کے مطابق استعمال کریں۔",
          medicationsUrdu: [
            {
              medicineName: "تجویز کردہ ادویات (Prescribed Medicines)",
              dosageUrdu: "خوراک: ڈاکٹر کی ہدایت کے مطابق",
              timeUrdu: "وقت: روزانہ باقاعدگی سے",
              purposeUrdu: "مقصد: صحت کی بحالی کے لیے",
              precautionsUrdu: "دوا کی صحیح مقدار لیں اور خود سے تبدیلی نہ کریں۔",
            }
          ],
          emergencyWarningUrdu: "شدید تکلیف یا ایمرجنسی کی صورت میں فوری اپنے ڈاکٹر یا 911 سے رابطہ کریں۔",
        }
      });
    }
  },
};

