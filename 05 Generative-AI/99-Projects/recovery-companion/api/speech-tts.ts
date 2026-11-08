import { getGeminiClient } from "./_gemini";
import { getRequestBody, jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    try {
      const body = await getRequestBody(request);
      const { text, voiceName } = body;

      if (!text) {
        return jsonResponse({ error: "Text is required." }, 400);
      }

      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: `Say calmly and clearly: ${text.slice(0, 400)}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return jsonResponse({ success: true, audioBase64: base64Audio });
      } else {
        return jsonResponse({ error: "No audio generated" }, 500);
      }
    } catch (error: any) {
      console.error("TTS generation error:", error);
      return jsonResponse({ error: "TTS failed", details: error?.message }, 500);
    }
  },
};
