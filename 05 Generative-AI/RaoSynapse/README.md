# RaoSynapse

**Think with AI. Build on it together.**

RaoSynapse is a working full-stack AI collaboration workspace with persistent accounts, AI conversations, private messaging, collaborative rooms, snapshots and forks, research organization, and scoped developer API tokens.

## What is included

- Responsive React + TypeScript frontend with mobile navigation and reduced-motion support
- Real `Ctrl+K` / `Cmd+K` quick search and command palette
- Express backend with authenticated REST endpoints and WebSocket events
- SQLite persistence through `better-sqlite3`
- Username-only preview identities, persistent revocable sessions, privacy settings, and account deletion
- Synapse AI with server-side Groq streaming integration and a clearly labelled preview responder when no key is configured
- Direct messages with durable history, delivery/read state, and idempotent retries
- Rooms with invitations, owner/editor/viewer roles, shared AI, and backend authorization
- Immutable snapshots, authenticated share links, revocation, and independent forks
- Research projects, user-supplied source provenance, notes, and Markdown export
- Scoped, hashed, revocable developer API tokens and versioned API endpoints
- Production caching rules, browser security headers, and an interface error boundary

## 1. Requirements

Install these first:

- **Node.js 20 LTS or newer** — recommended: Node 20 or 22
- **npm 10 or newer**
- **VS Code**

Check them in a terminal:

```bash
node --version
npm --version
```

## 2. Open the ZIP in VS Code

1. Extract `RaoSynapse-Final.zip`.
2. Open VS Code.
3. Select **File → Open Folder…**.
4. Select the extracted `raosynapse` folder—the folder containing `package.json`.
5. Open the VS Code terminal with **Terminal → New Terminal** or ``Ctrl+` ``.

Confirm the terminal is in the project folder:

```bash
ls
```

On Windows PowerShell, `ls` also works. You should see `package.json`, `src`, `server`, and the other project files.

## 3. Install dependencies

```bash
npm install
```

Do not skip this step. The ZIP intentionally does not include `node_modules`.

## 4. Create your local configuration

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Windows Command Prompt

```bat
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Open `.env` in VS Code.

### Optional: enable real Groq AI

Add your server-side Groq key:

```env
GROQ_API_KEY=your_real_groq_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

If `GROQ_API_KEY` is empty, the application still works, but AI responses use the clearly labelled **Preview responder**. It does not pretend to be Groq.

Never commit `.env` or share your real key.

## 5. Run in development mode

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The Vite frontend runs on port `5173`, and the API runs on port `3001`. Vite proxies API and WebSocket traffic automatically.

### Demo accounts

When `SEED_DEMO=true` and the database is created for the first time, these accounts are available:

| Username | Display name |
|---|---|
| `alex` | Alex Rao |
| `sam` | Sam Chen |

Select a demo identity or enter its username—no password is required. Use two browsers or a normal window plus an incognito window to test private messaging and room collaboration. A new unique username also needs a display name. Username-only entry is intended for non-sensitive preview use.

Stop the development servers with **Ctrl+C** in the terminal.

## 6. Run the production build locally

The ZIP includes a prebuilt `dist` folder, but after changing source code always rebuild:

```bash
npm run check
npm run build
npm start
```

Open:

```text
http://localhost:3000
```

The production server serves the frontend, API, database operations, and WebSockets from one origin. If you set `PORT` in `.env`, use that port instead.

Stop it with **Ctrl+C**.

## 7. Useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run frontend and backend with development reloading |
| `npm run check` | Run strict TypeScript checks |
| `npm run build` | Type-check and generate the optimized production frontend |
| `npm start` | Serve the production build from the Node server |
| `npm audit --omit=dev` | Check runtime dependencies for known advisories |

## 8. Configuration reference

| Variable | Default | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Empty | Enables real Groq inference when provided |
| `GROQ_MODEL` | `openai/gpt-oss-20b` | Server-side Groq model identifier; change if your account uses another active model |
| `SEED_DEMO` | `true` in `.env.example` | Seeds demo identities only when creating an empty database |
| `SESSION_DAYS` | `30` | Session cookie/session-record lifetime |
| `COOKIE_SECURE` | `false` | Set to `true` only behind HTTPS |
| `DATABASE_PATH` | `raosynapse.db` | Optional alternate SQLite database path |
| `PORT` | `3000` production, `3001` development | Optional production server port |

For a real deployment, use at least:

```env
SEED_DEMO=false
COOKIE_SECURE=true
```

Use HTTPS, protect the database, configure backups, and do not expose demo credentials.

## 9. Persistent data and reset

The application creates `raosynapse.db` automatically. Conversations, messages, accounts, rooms, research, and tokens survive restarts.

The database is intentionally **not included in the ZIP**, so your handoff contains no sessions or personal runtime data.

To reset local demo data:

1. Stop the server.
2. Delete `raosynapse.db`, `raosynapse.db-shm`, and `raosynapse.db-wal` if present.
3. Ensure `SEED_DEMO=true` for demo accounts.
4. Run `npm run dev` again.

These files are excluded by `.gitignore` and should not be committed.

## 10. Project structure

```text
raosynapse/
├── public/                 # Favicon and app manifest
├── server/                 # Express, SQLite, authentication, realtime, Groq
│   ├── ai.ts
│   ├── auth.ts
│   ├── db.ts
│   ├── index.ts
│   └── realtime.ts
├── src/                    # React product interface
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   ├── polish.css
│   └── styles.css
├── dist/                   # Prebuilt frontend; regenerate with npm run build
├── .env.example            # Safe configuration template
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 11. Troubleshooting

### `tsc: not found` or `vite: not found`

Dependencies are not installed. Run:

```bash
npm install
```

### `better-sqlite3` installation or rebuild error

Use Node 20 or 22, then run:

```bash
npm rebuild better-sqlite3
```

On Windows, install current Visual Studio Build Tools only if npm reports that a native build is required.

### Port already in use

Stop the other RaoSynapse/Node process using the port. Development expects ports `5173` and `3001`. For production, you can set another `PORT` in `.env`.

### AI says “Preview responder”

This is expected without a Groq key. Add `GROQ_API_KEY` to `.env` and restart the server.

### Changes are not appearing in production

Run `npm run build` again and restart `npm start`. Development mode does not require a production build.

### Open an existing demo identity

Enter `alex` or `sam` on the workspace identity screen, or select its demo button. No password is used in this preview edition.

## 12. Deployment scope

This handoff is the **Node.js + SQLite edition** designed to run directly in VS Code or on a Node host. It is not preconfigured as a Cloudflare D1/Durable Objects deployment. A Cloudflare deployment would require adapting the persistence and realtime bindings.

Before a public production launch, add a managed backup strategy, review provider quotas and terms, configure HTTPS and secure cookies, disable demo seeding, and perform a deployment-specific security review.

## 13. Deploy a public preview on Render

The repository includes [`render.yaml`](./render.yaml) for a one-service Render deployment.

1. Open [Render](https://render.com) and sign in with the GitHub account that owns `rao-aq-1080/RaoSynapse`.
2. Choose **New → Blueprint**.
3. Select the `RaoSynapse` repository and the `main` branch.
4. Review the service named `raosynapse` and create the deployment.
5. When Render asks for `GROQ_API_KEY`, enter a newly created or rotated Groq key. Never paste the key into GitHub.
6. Wait for the health check at `/api/v1/health` to turn green, then open the generated `.onrender.com` URL.

The free Render service may sleep when idle and its local SQLite filesystem is ephemeral. It is suitable for seeing the product working publicly, but accounts and conversations can be lost after a redeploy or instance replacement. For durable production data, migrate SQLite to a managed PostgreSQL database and add a persistent storage/backup strategy before inviting real users.
