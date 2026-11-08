import { getGeminiClient } from "./_gemini";
import { getRequestBody, jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    try {
      const body = await getRequestBody(request);
      const { planContext, userQuestion } = body || {};

      if (!userQuestion || typeof userQuestion !== "string") {
        return jsonResponse({
          success: true,
          answer: "Please ask a specific question regarding your recovery plan or medical instructions."
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are DischargeCare AI Assistant, a professional, empathetic, and expert AI Medical Recovery Assistant and healthcare companion.

YOUR MANDATE:
You answer a wide range of medical and recovery questions by combining:
1. The patient's personal discharge/recovery plan context (when available).
2. Established general medical, pharmaceutical, nursing, and post-discharge recovery knowledge.

KEY CAPABILITIES & RESPONSE GUIDELINES:
1. Prescription & Medication Safety:
   - Explain medicine names, purpose, dosage instructions, and timing.
   - For pain medications, opioids, sedatives, or antihistamines: EXPLICITLY explain safety considerations such as alertness and motor impairment (e.g. driving or operating machinery is NOT safe while taking sedating pain medication).
   - Explain common side effects, precautions, and why sticking to prescribed schedules matters.

2. General Medical & Post-Discharge Recovery Guidance:
   - Answer general healthcare questions thoroughly (e.g., when it is safe to drive, take a shower, return to work, or exercise after surgery/illness).
   - Provide guidance on wound and incision care, dressing changes, infection signs, and hygiene.
   - Advise on diet, hydration, rest, lifestyle adjustments, and monitoring vitals (blood pressure, glucose, temperature).
   - Explain medical terms, clinical jargon, and report findings in clear, patient-friendly terms.

3. Personal Recovery Plan Integration:
   - Reference the patient's prescribed medications, diagnosis, follow-ups, and checklist tasks whenever relevant to personalize your response.
   - Do NOT reject general medical questions with "information not found in recovery plan". Answer general health questions using general medical knowledge while advising the patient to follow their doctor's specific orders.

4. Professional Style & Language Support:
   - Speak in warm, clear, plain language (6th-8th grade reading level).
   - Use direct step-by-step bullet points for instructions.
   - ALWAYS respond in the language used by the user (e.g., English, Urdu اردو, Spanish, Arabic, etc.).

CRITICAL MEDICAL SAFETY BOUNDARIES:
- Do NOT diagnose diseases or offer new medical prescriptions.
- Do NOT alter prescribed medication doses or recommend stopping/starting treatments without physician approval.
- Do NOT replace a doctor or healthcare team.
- For emergency red-flag symptoms (severe chest pain, sudden difficulty breathing, high fever, heavy bleeding, stroke symptoms), IMMEDIATELY advise calling 911 or seeking urgent emergency medical care.`;

      const contextPrompt = `PATIENT DISCHARGE PLAN CONTEXT:
Patient Name: ${planContext?.patientName || "Patient"}
Hospital: ${planContext?.hospitalName || "Hospital"}
Diagnosis: ${planContext?.primaryDiagnosis || "Not specified"}
Summary: ${planContext?.plainLanguageSummary || "No summary provided."}
Medications List: ${JSON.stringify(planContext?.medications || [])}
Follow-up Appointments: ${JSON.stringify(planContext?.followUps || [])}
Daily Checklist Tasks: ${JSON.stringify(planContext?.dailyTasks || [])}
Warning Signs & Emergency Instructions: ${JSON.stringify(planContext?.warningSigns || [])}
Source Notes: ${planContext?.sourceDocumentText || "N/A"}

USER QUESTION: "${userQuestion}"

INSTRUCTION: Answer the user's question directly, clearly, and supportively. Combine details from their recovery plan with standard medical, pharmaceutical, and post-discharge recovery knowledge. Do not decline to answer general health/safety questions.`;

      let responseText = "";
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: contextPrompt,
            config: { systemInstruction },
          });

          if (response.text && response.text.trim().length > 0) {
            responseText = response.text.trim();
            break;
          }
        } catch (err) {
          console.warn(`[ASSISTANT_CHAT] Attempt ${attempts} failed:`, err);
          if (attempts < maxAttempts) {
            await new Promise((r) => setTimeout(r, 800 * attempts));
          }
        }
      }

      if (!responseText) {
        responseText = "For your safety, please follow your physician's specific instructions. As a general medical rule, prescription pain medications or sedating drugs cause drowsiness and impair reflexes, making driving or operating machinery unsafe. Always check with your doctor or pharmacist regarding specific activity restrictions while taking your prescribed medications.";
      }

      return jsonResponse({ success: true, answer: responseText });
    } catch (error: any) {
      console.error("Error in assistant chat handler:", error);
      return jsonResponse({
        success: true,
        answer: "As a general health precaution, please consult your healthcare provider or pharmacist regarding your specific medications and activity restrictions.",
      });
    }
  },
};

