# 🔎 AI Research Agent

A simple, single-agent AI research assistant. Give it a topic, it searches
the web for free with DuckDuckGo, then uses a Groq-hosted LLM
(`openai/gpt-oss-120b`) to write a structured, cited report.

Built with:
- **Streamlit** – the web app UI
- **Groq** – free/fast LLM inference (model: `openai/gpt-oss-120b`)
- **ddgs** – free DuckDuckGo search, no API key required

---

## 1. Project structure

```
ai-research-agent/
├── app.py                          # Main Streamlit app (all the logic)
├── requirements.txt                # Python libraries needed
├── .gitignore                      # Tells git which files to ignore
├── README.md                       # This file
└── .streamlit/
    └── secrets.toml.example        # Template for your API key (copy, don't commit)
```

---

## 2. Get a free Groq API key

1. Go to https://console.groq.com/keys
2. Sign up / log in (it's free).
3. Click **Create API Key**, copy it somewhere safe. It looks like `gsk_...`.

This app **only** reads the key from Streamlit secrets — there is no
box in the app to type it into. You'll paste it into Streamlit Cloud's
Secrets settings in step 4 below.

---

## 3. Push the project to GitHub

**Step 1 — Create a new repository**
Go to https://github.com/new, name it (e.g. `ai-research-agent`), and
create it (keep it empty — no README, no .gitignore, since we already have those).

**Step 2 — Push your local project**
In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit: AI research agent"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-research-agent.git
git push -u origin main
```

> ⚠️ Because `.streamlit/secrets.toml` is in `.gitignore`, your real API key
> will **never** be uploaded. Only `secrets.toml.example` (a harmless
> template) goes to GitHub. This is intentional and important — never
> commit real API keys to a public repo.

---

## 4. Deploy on Streamlit Community Cloud (free)

**Step 1** — Go to https://share.streamlit.io and sign in with your GitHub account.

**Step 2** — Click **Create app** → **From an existing repo**.

**Step 3** — Choose:
- Repository: `YOUR-USERNAME/ai-research-agent`
- Branch: `main`
- Main file path: `app.py`

**Step 4 — Add your API key as a secret (required — the app has no other way to get it):**
- Click **Advanced settings** before deploying (or, after deploying, go to
  your app → **Settings → Secrets**).
- Paste this in, using your real key:
  ```toml
  GROQ_API_KEY = "gsk_your_real_key_here"
  ```
- Save.

**Step 5** — Click **Deploy**. After a minute or two, your app will be live
at a public URL like `https://your-app-name.streamlit.app`.

Because `app.py` reads the key with `st.secrets.get("GROQ_API_KEY", "")`,
the app will show a clear on-screen error telling you to add the secret
if it's ever missing or misspelled — instead of crashing.

---

## 5. How the agent works (plain-English walkthrough)

1. **You type a topic** into the text box, e.g. *"the future of solar
   energy"*.
2. **Search step** — `app.py` calls `ddgs.DDGS().text(topic)`, which asks
   DuckDuckGo for the top results (title, link, short snippet) — completely
   free, no key needed.
3. **Formatting step** — those results are numbered and turned into plain
   text like:
   ```
   [Source 1] Title...
   URL: ...
   Snippet: ...
   ```
4. **LLM step** — that text, plus your topic, is sent to Groq's
   `openai/gpt-oss-120b` model with instructions to write a structured
   report and cite sources as `[Source 1]`, `[Source 2]`, etc.
5. **Display step** — the report is shown in the app, with a button to
   download it as a Markdown (`.md`) file.

This is a **single agent**: one loop of "search → think → write", no
multi-agent frameworks needed. That keeps it simple to read, debug, and
extend.

---

## 6. Common beginner issues

| Problem | Likely cause | Fix |
|---|---|---|
| "No Groq API key found" | `GROQ_API_KEY` secret missing or misspelled | Go to App → Settings → Secrets and add it exactly as `GROQ_API_KEY = "..."` |
| "No search results were found" | Topic too narrow/unusual, or DuckDuckGo is rate-limiting the app | Try a broader topic, or wait a bit and try again |
| App fails to build/deploy | A typo in `requirements.txt`, or wrong main file path | Confirm main file path is `app.py` and `requirements.txt` matches the versions in this repo |
| Report generation is slow | Free-tier rate limits on Groq, or too many search results | Lower the "How many web results" slider in the sidebar |
| Secret changes don't seem to apply | App needs a reboot after secrets are edited | Go to your app → **Manage app → Reboot** |

---

## 7. Ideas to extend this later (optional)

- Add a "depth" option that runs multiple searches (one per sub-question).
- Cache search results with `st.cache_data` to avoid repeat searches.
- Add PDF export using a library like `fpdf2`.
- Add a chat-style follow-up box so you can ask questions about the report.

Keep the first version simple — get it deployed and working, then improve
it step by step.
