import { getGeminiClient } from "./_gemini";
import { jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    const startTime = Date.now();

    try {
      const ai = getGeminiClient();
      
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Respond in 5 words confirming Gemini 3.6 Flash is active and ready.",
      });

      const latency = Date.now() - startTime;
      const text = response.text || "Gemini 3.6 Flash operational.";

      return jsonResponse({
        success: true,
        active: true,
        model: "gemini-3.6-flash",
        status: "Operational",
        latencyMs: latency,
        response: text.trim(),
        capabilities: [
          "Discharge Document OCR & Parsing",
          "Grounded Discharge Q&A Assistant",
          "Urdu Prescription Translation & Explanation",
          "Multilingual Recovery Plan Translation",
          "High-Quality Speech Synthesis (TTS)",
        ],
      });
    } catch (error: any) {
      console.error("[GEMINI_STATUS] Health check error:", error);
      return jsonResponse(
        {
          success: false,
          active: false,
          model: "gemini-3.6-flash",
          status: "Error",
          details: error?.message || String(error),
        },
        500
      );
    }
  },
};
