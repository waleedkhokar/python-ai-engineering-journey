import { jsonResponse, corsOptionsResponse } from "./_lib";

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return corsOptionsResponse();
    }

    const apiKeyPresent = Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY);

    return jsonResponse({
      status: "ok",
      app: "DischargeCare AI",
      gemini: {
        active: apiKeyPresent,
        model: "gemini-3.6-flash",
        status: apiKeyPresent ? "operational" : "key_missing",
      },
      timestamp: new Date().toISOString(),
    });
  },
};

