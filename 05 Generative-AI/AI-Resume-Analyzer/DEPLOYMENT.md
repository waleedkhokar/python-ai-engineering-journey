# Deployment

## Backend (Render)

1. Push the repository to GitHub.
2. In Render, create a **Web Service** from the repository and set the root directory to `backend`.
3. Runtime: Docker (uses `backend/Dockerfile`), or set:
   - Build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment variables:
   - `CORS_ORIGINS` = your frontend URL, for example `https://your-app.vercel.app`
   - `USE_EMBEDDINGS` = `true` (or `false` on small instances)
5. Free instances sleep when idle and have limited memory. Sentence-transformers needs roughly 1 GB of RAM. Use `USE_EMBEDDINGS=false` if the service runs out of memory.

## Frontend (Vercel)

1. Import the repository in Vercel and set the root directory to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output: `dist`.
3. Environment variable: `VITE_API_URL` = your backend URL, for example `https://resume-analyzer-api.onrender.com`.
4. Redeploy after changing `VITE_API_URL`, because Vite bakes it in at build time.

## Checklist before going public

- [ ] Replace `[Your Name]` in `LICENSE`
- [ ] Add a real screenshot to the README
- [ ] Confirm `CORS_ORIGINS` lists only your real frontend URL
- [ ] Do not commit `.env` files (the `.gitignore` already excludes them)
- [ ] Check the analysis works on your own resume before sharing the link
