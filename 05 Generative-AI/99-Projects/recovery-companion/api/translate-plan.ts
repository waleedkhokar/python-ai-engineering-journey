import { getGeminiClient } from "./_gemini";
import { getRequestBody, jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    try {
      const body = await getRequestBody(request);
      const { plan, targetLanguage } = body;

      if (!plan || !targetLanguage) {
        return jsonResponse({ error: "Missing plan or target language." }, 400);
      }

      if (targetLanguage === "en") {
        return jsonResponse({ success: true, translatedPlan: plan });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are a certified medical translator. Translate the provided recovery plan into target language code: '${targetLanguage}' (for 'ur', translate into clear, natural, fluent Urdu - اردو).
CRITICAL: Keep all drug names (e.g., Oxycodone, Apixaban) and numerical dosages (e.g. 5 mg, 8:00 AM) intact or with clear transliteration. Translate summaries, instructions, tasks, and explanations clearly for patient and family understanding.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: JSON.stringify({
          plainLanguageSummary: plan.plainLanguageSummary,
          keyRecoveryMilestones: plan.keyRecoveryMilestones,
          medicalTermsGlossary: plan.medicalTermsGlossary,
          medicationInstructions: (plan.medications || []).map((m: any) => ({ name: m.name, specialInstructions: m.specialInstructions, purpose: m.purpose })),
          dailyTasks: (plan.dailyTasks || []).map((t: any) => ({ title: t.title, description: t.description })),
          warningSigns: (plan.warningSigns || []).map((w: any) => ({ symptom: w.symptom, actionRequired: w.actionRequired })),
        }),
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const translatedData = JSON.parse(response.text || "{}");

      const translatedPlan = {
        ...plan,
        plainLanguageSummary: translatedData.plainLanguageSummary || plan.plainLanguageSummary,
        keyRecoveryMilestones: translatedData.keyRecoveryMilestones || plan.keyRecoveryMilestones,
        medicalTermsGlossary: translatedData.medicalTermsGlossary || plan.medicalTermsGlossary,
        medications: (plan.medications || []).map((m: any, idx: number) => ({
          ...m,
          purpose: translatedData.medicationInstructions?.[idx]?.purpose || m.purpose,
          specialInstructions: translatedData.medicationInstructions?.[idx]?.specialInstructions || m.specialInstructions,
        })),
        dailyTasks: (plan.dailyTasks || []).map((t: any, idx: number) => ({
          ...t,
          title: translatedData.dailyTasks?.[idx]?.title || t.title,
          description: translatedData.dailyTasks?.[idx]?.description || t.description,
        })),
        warningSigns: (plan.warningSigns || []).map((w: any, idx: number) => ({
          ...w,
          symptom: translatedData.warningSigns?.[idx]?.symptom || w.symptom,
          actionRequired: translatedData.warningSigns?.[idx]?.actionRequired || w.actionRequired,
        })),
      };

      return jsonResponse({ success: true, translatedPlan });
    } catch (error: any) {
      console.error("Error translating plan:", error);
      return jsonResponse({ error: "Translation failed.", details: error?.message }, 500);
    }
  },
};
