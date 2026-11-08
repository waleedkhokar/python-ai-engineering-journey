import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import healthHandler from "./api/health";
import analyzeDischargeHandler from "./api/analyze-discharge";
import parseDischargeHandler from "./api/parse-discharge";
import assistantChatHandler from "./api/assistant-chat";
import explainUrduHandler from "./api/explain-urdu";
import translatePlanHandler from "./api/translate-plan";
import speechTtsHandler from "./api/speech-tts";
import geminiStatusHandler from "./api/gemini-status";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

function adaptVercelHandler(handler: { fetch: (req: Request) => Promise<Response> }) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const url = `${req.protocol}://${req.get("host") || "localhost"}${req.originalUrl}`;
      const method = req.method;
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, value);
          }
        }
      }

      let body: string | undefined = undefined;
      if (method !== "GET" && method !== "HEAD") {
        body = JSON.stringify(req.body || {});
      }

      const webRequest = new Request(url, {
        method,
        headers,
        body,
      });

      const response = await handler.fetch(webRequest);
      res.status(response.status);
      response.headers.forEach((val, key) => res.setHeader(key, val));
      const text = await response.text();
      res.send(text);
    } catch (err: any) {
      console.error("Adapted handler error:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  };
}

// API routes mapped to Vercel functions
app.all("/api/health", adaptVercelHandler(healthHandler));
app.all("/api/analyze-discharge", adaptVercelHandler(analyzeDischargeHandler));
app.all("/api/parse-discharge", adaptVercelHandler(parseDischargeHandler));
app.all("/api/gemini/parse-ocr", adaptVercelHandler(parseDischargeHandler));
app.all("/api/assistant-chat", adaptVercelHandler(assistantChatHandler));
app.all("/api/explain-urdu", adaptVercelHandler(explainUrduHandler));
app.all("/api/translate-plan", adaptVercelHandler(translatePlanHandler));
app.all("/api/speech-tts", adaptVercelHandler(speechTtsHandler));
app.all("/api/gemini-status", adaptVercelHandler(geminiStatusHandler));

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DischargeCare AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
