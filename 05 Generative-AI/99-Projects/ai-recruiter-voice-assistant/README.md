# AI Recruiter Voice Assistant

An end-to-end prototype for conducting first-round candidate screening through an AI-powered voice conversation. A candidate starts an interview in the browser, a Vapi voice assistant verifies their identity, records structured screening answers, evaluates their eligibility, and offers an interview slot when they qualify.

The repository contains:

- A **FastAPI** REST API for candidates, calls, screening, eligibility, and scheduling.
- A **SQLAlchemy** persistence layer for candidates, calls, answers, results, and interviews.
- A deterministic, rule-based **eligibility engine**.
- A small **Vite/JavaScript frontend** that starts and stops Vapi web calls.
- A **Vapi webhook receiver** that stores the final transcript, recording URL, and call metadata.

> [!NOTE]
> This project is currently an MVP/prototype. The core workflow is implemented, but the Vapi squad configuration lives outside this repository, automated tests have not yet been added, and the known limitations near the end of this document should be reviewed before production use.

## Table of contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [System architecture](#system-architecture)
- [How the complete workflow works](#how-the-complete-workflow-works)
- [Project structure](#project-structure)
- [Backend implementation](#backend-implementation)
- [Frontend implementation](#frontend-implementation)
- [Vapi integration](#vapi-integration)
- [Eligibility rules](#eligibility-rules)
- [Database model](#database-model)
- [API reference](#api-reference)
- [Configuration](#configuration)
- [Local setup](#local-setup)
- [Running the application](#running-the-application)
- [Preparing Vapi](#preparing-vapi)
- [Example end-to-end test](#example-end-to-end-test)
- [Call statuses](#call-statuses)
- [Development notes](#development-notes)
- [Known limitations](#known-limitations)
- [Suggested next steps](#suggested-next-steps)

## Features

- Create and retrieve candidate records.
- Start a browser-based voice screening session for an existing candidate.
- Connect the browser to a Vapi squad and pass candidate/session identifiers into the assistant.
- Verify a candidate's date of birth against the database.
- Collect 11 screening answers in a fixed sequence.
- Normalize common spoken answers such as `yeah`, `nope`, and phrases containing years of experience.
- Evaluate candidates using transparent, deterministic eligibility rules.
- Return up to five future interview slots.
- Book a selected slot and mark it unavailable.
- Track local calls and associate them with Vapi call IDs.
- Receive end-of-call reports from Vapi.
- Persist transcripts, recordings, end reasons, timestamps, and final call status.
- Expose interactive OpenAPI documentation through FastAPI.

## Technology stack

### Backend

| Component | Purpose |
| --- | --- |
| Python 3.13+ | Backend runtime |
| FastAPI | HTTP API, validation, routing, and OpenAPI documentation |
| Pydantic / pydantic-settings | Request/response schemas and environment configuration |
| SQLAlchemy 2 | ORM and database access |
| PostgreSQL + psycopg | Intended relational database stack |
| Uvicorn | ASGI development server |
| Vapi server SDK | Vapi server-side dependency; direct SDK use is not yet implemented |
| httpx | HTTP client dependency; not currently used by the application code |

### Frontend

| Component | Purpose |
| --- | --- |
| Vite | Development server and frontend bundling |
| Vanilla JavaScript | Browser UI and application logic |
| `@vapi-ai/web` | Browser voice-call connection to Vapi |

## System architecture

```mermaid
flowchart LR
    C[Candidate browser] -->|Create local session| API[FastAPI backend]
    C -->|Web voice call| V[Vapi squad]
    API --> DB[(SQL database)]
    V -->|Tool requests| API
    V -->|Status and end-of-call webhooks| API
    API -->|Answers, eligibility, slots| V
    API -->|Session metadata| C
```

The browser and Vapi use two different identifiers for the same conversation:

- `local_call_id`: the primary key created by this backend.
- `vapi_call_id`: the ID created by Vapi after the browser call connects.

The frontend links the two immediately after Vapi returns its call ID. Webhooks can then locate the correct local call by `vapi_call_id`.

## How the complete workflow works

### 1. Candidate creation

A recruiter or another upstream system creates a candidate with `POST /candidates`. The candidate's name, date of birth, email, and applied role are stored in the `candidates` table.

There is currently no recruiter dashboard or candidate-import integration, so candidate creation is performed through the API.

### 2. Voice session creation

The candidate enters their numeric candidate ID in the frontend and selects **Start Voice Interview**.

The frontend:

1. Requests microphone permission.
2. Calls `POST /voice-sessions/start`.
3. Receives a local call ID, the candidate's name, and the configured Vapi squad ID.
4. Passes the following dynamic values to Vapi:
   - `candidate_id`
   - `call_id`
   - `candidate_name`
5. Starts the web call with `@vapi-ai/web`.
6. Links the Vapi call ID to the local session with `PATCH /voice-sessions/{call_id}/vapi-call`.

### 3. Identity verification

The externally configured Vapi assistant can call `POST /tools/verify-dob`. The backend compares the supplied date directly with the candidate's stored date of birth and returns a verified/not-verified result.

### 4. Ordered screening

The assistant asks each question listed in `app/eligibility/questions.py` and saves the response through `POST /tools/save-screening-answer`.

The backend enforces the question order. If the assistant sends an answer for a later question before the expected question, the API returns HTTP `409` with both the expected and received question keys.

Answers are normalized before storage:

- Common affirmative terms become `yes`.
- Common negative terms become `no`.
- The first number found in an experience response is stored as the number of years.
- Education phrases containing bachelor, master, doctorate, or PhD are converted to a canonical value.

After every saved answer, the response tells the assistant whether screening is complete and which question key comes next.

### 5. Eligibility evaluation

After all required answers exist, the assistant calls `POST /tools/check-eligibility`.

The eligibility engine:

1. Calculates the candidate's current age from their date of birth.
2. Applies every rule documented in [Eligibility rules](#eligibility-rules).
3. Collects all failed rules instead of stopping after the first failure.
4. Returns `eligible: true` only when no rules failed.
5. Updates the call status to `Eligible` or `NotEligible`.

This evaluation is rule-based; no generative model is used for the final decision.

### 6. Interview scheduling

For an eligible candidate, the assistant can:

1. Call `POST /tools/available-slots` to retrieve up to five available future slots.
2. Ask the candidate to choose a slot.
3. Call `POST /tools/book-interview` with the selected slot ID.

Booking creates an `interviews` row, marks the slot unavailable, and changes the call status to `Booked`.

### 7. Call completion and result storage

Vapi sends events to `POST /vapi/webhook`.

The `end-of-call-report` handler extracts and stores:

- Transcript
- Recording URL
- End reason
- Start time
- End time
- Final local call status

Only one `call_results` record is kept per call. If Vapi sends the report again, the existing result is updated, making result storage effectively idempotent for a linked call.

## Project structure

```text
AI Recruiter Voice Assistant/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app, CORS, router registration, table creation
│   ├── config.py                     # Environment settings
│   ├── database.py                   # SQLAlchemy engine, session factory, Base
│   ├── api/
│   │   ├── __init__.py
│   │   ├── candidates.py             # Candidate creation and lookup routes
│   │   ├── calls.py                  # Start/link voice-session routes
│   │   ├── verification.py           # DOB verification tool route
│   │   ├── screening.py              # Answer storage and eligibility routes
│   │   ├── scheduling.py             # Slot listing and booking routes
│   │   └── webhooks.py               # Vapi status/end-of-call webhook handling
│   ├── eligibility/
│   │   ├── engine.py                 # Deterministic eligibility rules
│   │   └── questions.py              # Screening questions and required order
│   ├── models/
│   │   ├── __init__.py               # Imports all ORM models for metadata discovery
│   │   ├── candidate.py              # Candidate table
│   │   ├── call.py                   # Call table and CallStatus enum
│   │   ├── screening.py              # ScreeningAnswer table
│   │   ├── interview.py              # InterviewSlot and Interview tables
│   │   └── call_result.py            # Final transcript/recording table
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── candidate.py              # Candidate request/response schemas
│   │   ├── call.py                   # Voice-session schemas
│   │   ├── verification.py           # DOB tool schemas
│   │   ├── screening.py              # Screening and eligibility schemas
│   │   ├── scheduling.py             # Scheduling schemas
│   │   └── webhook.py                # Generic Vapi webhook envelope
│   └── services/
│       ├── __init__.py
│       ├── candidate_service.py       # Candidate persistence operations
│       ├── call_service.py            # Call creation, lookup, linking, status updates
│       ├── verification_service.py    # Date-of-birth comparison
│       ├── screening_service.py       # Answer normalization, ordering, and persistence
│       ├── scheduling_service.py      # Available-slot query and booking
│       ├── call_result_service.py     # Upsert-like call result persistence
│       ├── call.py                    # Reserved/empty placeholder
│       └── vapi_service.py            # Reserved/empty placeholder
├── frontend/
│   ├── index.html                     # Candidate ID and call-control UI
│   ├── package.json                   # Frontend scripts and dependencies
│   ├── package-lock.json
│   ├── vite.config.js                 # Dev server, allowed host, and API proxies
│   ├── public/                        # Static icons/favicon
│   └── src/
│       ├── main.js                    # API calls, microphone check, Vapi lifecycle
│       ├── style.css                  # Frontend styles
│       ├── counter.js                 # Unused Vite starter file
│       └── assets/                    # Starter/static image assets
├── tests/
│   └── __init__.py                    # Test package placeholder; no tests yet
├── .env                               # Local backend secrets; ignored by Git
├── .python-version                    # Project Python version
├── .gitignore
├── pyproject.toml                     # Python package metadata and dependencies
├── pyrightconfig.json                 # Python type-checker configuration
├── uv.lock                            # Reproducible Python dependency lockfile
└── README.md
```

## Backend implementation

### Application startup

`app/main.py` imports every ORM model, calls `Base.metadata.create_all(bind=engine)`, configures CORS for the local Vite server, and registers all routers.

Because the project uses `create_all`, missing tables are created automatically at startup. It does **not** perform schema migrations for existing tables. A production deployment should use a migration tool such as Alembic.

### Layering

The backend is separated into four primary layers:

| Layer | Responsibility |
| --- | --- |
| `api/` | HTTP routing, dependency injection, status codes, and response construction |
| `schemas/` | Pydantic validation and serialized API contracts |
| `services/` | Business operations and database queries |
| `models/` | SQLAlchemy table mappings |

The `eligibility/` package contains domain rules separately from persistence and routing.

### Database sessions

`app/database.py` creates one SQLAlchemy engine and a `SessionLocal` factory. The FastAPI `get_db()` dependency opens a session for each request and closes it afterward.

Service methods currently call `commit()` directly after writes.

### Screening-answer normalization

`ScreeningService.normalize_answer()` accepts modest variations in spoken responses:

- Yes: `yes`, `yeah`, `yep`, `true`, `1`, `sure`, `affirmative`
- No: `no`, `nope`, `false`, `0`, `negative`
- Experience: extracts a number such as `2` or `3.5`
- Education: recognizes bachelor, master, PhD, and doctor-related phrases

Unrecognized text is stored in lowercase after surrounding whitespace is removed. The rules engine subsequently treats unrecognized yes/no text as false.

## Frontend implementation

The frontend is deliberately small and has one screen. It contains:

- A candidate ID input
- A **Start Voice Interview** button
- An **End Interview** button
- A text status indicator

`frontend/src/main.js` performs the following work:

1. Initializes the Vapi web client with `VITE_VAPI_PUBLIC_KEY`.
2. Validates that a numeric candidate ID was entered.
3. Requests microphone access with `navigator.mediaDevices.getUserMedia()`.
4. Creates a local backend call.
5. Starts the configured Vapi squad with dynamic assistant variables.
6. Links the returned Vapi call ID to the backend call.
7. Updates the UI in response to `call-start`, `call-end`, and `error` events.
8. Calls `vapi.stop()` when the candidate ends the interview.

The browser never receives the private Vapi API key. It uses only the Vapi public key, while the backend configuration contains the server-side key.

## Vapi integration

The repository supplies the runtime endpoints Vapi needs, but it does not contain the Vapi dashboard/squad definition. The configured squad should contain an assistant that knows the conversation flow and has tools mapped to the backend routes.

### Dynamic variables passed to Vapi

```json
{
  "candidate_id": "42",
  "call_id": "108",
  "candidate_name": "Ayesha Khan"
}
```

These values are strings in the assistant override and should be used when constructing tool request bodies.

### Suggested Vapi tool mapping

| Assistant action | Backend endpoint |
| --- | --- |
| Verify identity | `POST /tools/verify-dob` |
| Save each answer | `POST /tools/save-screening-answer` |
| Evaluate completed screening | `POST /tools/check-eligibility` |
| Retrieve interview times | `POST /tools/available-slots` |
| Confirm a booking | `POST /tools/book-interview` |

### Webhook mapping

Set the Vapi server/webhook URL to:

```text
https://<public-backend-host>/vapi/webhook
```

The backend recognizes:

- `status_update`
- `end-of-call-report`

Other webhook message types are acknowledged but otherwise ignored.

For local development, Vapi must be able to reach the backend through a public HTTPS tunnel or deployed URL. The Vite configuration currently includes one project-specific ngrok hostname in `allowedHosts`; update it if a different tunnel hostname is used to expose the frontend.

## Eligibility rules

Every required answer must exist before evaluation. Eligibility passes only if **all** rules below pass.

| Rule | Passing requirement |
| --- | --- |
| Age | Candidate is between 21 and 55 years old, inclusive |
| Experience | At least 2 years of relevant experience |
| Work authorization | Candidate answers yes |
| Start availability | Candidate can start within 30 days |
| Employment type | Candidate accepts full-time work |
| Job abandonment | Candidate has not abandoned a job without notice in the last 12 months |
| Education | Bachelor, master's, or PhD |
| Salary | Candidate accepts the offered salary range |
| Language | Candidate is fluent in the required working language |
| Location | Candidate can meet the onsite/approved remote requirement |
| Working hours | Candidate accepts the required schedule or shifts |
| Interview consent | Candidate wants to proceed to an interview |

### Required question order

| Position | Key | Question |
| ---: | --- | --- |
| 1 | `experience_years` | How many years of relevant work experience do you have? |
| 2 | `work_authorized` | Are you legally authorized to work in the country for this position? |
| 3 | `start_within_30_days` | Would you be available to start within the next 30 days? |
| 4 | `full_time` | Are you willing to work full-time? |
| 5 | `job_abandonment` | Have you abandoned a job without notice during the last 12 months? |
| 6 | `education` | What is your highest completed educational qualification? |
| 7 | `salary_acceptance` | Are you comfortable with the salary range offered for this position? |
| 8 | `language_fluent` | Are you fluent in the required working language? |
| 9 | `location_suitable` | Are you able to work from the required location or approved remote arrangement? |
| 10 | `working_hours` | Are you comfortable with the required working hours or shifts? |
| 11 | `interview_consent` | Would you like to proceed to the interview stage if you qualify? |

## Database model

```mermaid
erDiagram
    CANDIDATES ||--o{ CALLS : has
    CANDIDATES ||--o{ SCREENING_ANSWERS : provides
    CALLS ||--o{ SCREENING_ANSWERS : contains
    CANDIDATES ||--o{ INTERVIEWS : books
    CALLS ||--o{ INTERVIEWS : produces
    INTERVIEW_SLOTS ||--o| INTERVIEWS : assigned_to
    CANDIDATES ||--o{ CALL_RESULTS : owns
    CALLS ||--o| CALL_RESULTS : has

    CANDIDATES {
        int id PK
        string first_name
        string last_name
        date dob
        string email
        string job_applied
        datetime created_at
    }
    CALLS {
        int id PK
        int candidate_id FK
        string vapi_call_id UK
        string call_type
        string status
        datetime started_at
        datetime ended_at
        datetime created_at
    }
    SCREENING_ANSWERS {
        int id PK
        int candidate_id FK
        int call_id FK
        string question_key
        text answer
        datetime created_at
    }
    INTERVIEW_SLOTS {
        int id PK
        datetime start_time
        datetime end_time
        string recruiter_name
        boolean is_available
    }
    INTERVIEWS {
        int id PK
        int candidate_id FK
        int call_id FK
        int slot_id FK_UK
        string status
        datetime booked_at
    }
    CALL_RESULTS {
        int id PK
        int call_id FK_UK
        int candidate_id FK
        string final_status
        text transcript
        text recording_url
        string ended_reason
        datetime started_at
        datetime ended_at
        datetime created_at
    }
```

Important constraints implemented in the models:

- `calls.vapi_call_id` is unique.
- `interviews.slot_id` is unique, so one slot can belong to only one interview.
- `call_results.call_id` is unique, so a call has at most one final result.
- Candidate, call, slot, and result relationships use foreign keys.

There is no database-level unique constraint on `(call_id, question_key)` even though the service layer treats that pair as unique.

## API reference

When the backend is running, the live interactive reference is available at:

- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

### System endpoints

#### `GET /`

Returns a message confirming that the backend is running.

#### `GET /health`

```json
{
  "status": "healthy"
}
```

The health route currently checks only that FastAPI can serve the request; it does not query the database or Vapi.

### Candidate endpoints

#### `POST /candidates`

Creates a candidate.

```json
{
  "first_name": "Ayesha",
  "last_name": "Khan",
  "dob": "1996-04-18",
  "email": "ayesha@example.com",
  "job_applied": "Backend Engineer"
}
```

Returns HTTP `201` with the new candidate, including `id` and `created_at`.

#### `GET /candidates/{candidate_id}`

Returns the candidate or HTTP `404` when the ID does not exist.

### Voice-session endpoints

#### `POST /voice-sessions/start`

```json
{
  "candidate_id": 1
}
```

Creates a call with status `Initiated`. The response includes `local_call_id`, candidate details needed by the browser, and the configured `squad_id`.

#### `PATCH /voice-sessions/{call_id}/vapi-call`

```json
{
  "vapi_call_id": "vapi-generated-call-id"
}
```

Links the local session to the Vapi session so later webhooks can find it.

### Vapi tool endpoints

#### `POST /tools/verify-dob`

```json
{
  "candidate_id": 1,
  "dob": "1996-04-18"
}
```

Returns a boolean `verified` result and a conversational message.

#### `POST /tools/save-screening-answer`

```json
{
  "candidate_id": 1,
  "call_id": 1,
  "question_key": "experience_years",
  "answer": "I have three years of experience"
}
```

Example response:

```json
{
  "saved": true,
  "message": "Screening answer saved successfully.",
  "screening_complete": false,
  "next_question_key": "work_authorized"
}
```

Possible errors include:

- `404`: candidate or call does not exist.
- `409`: screening is complete or the question arrived out of sequence.

#### `POST /tools/check-eligibility`

```json
{
  "candidate_id": 1,
  "call_id": 1
}
```

Example failed response body:

```json
{
  "eligible": false,
  "failed_rules": [
    {
      "rule": "minimum_experience",
      "reason": "Candidate requires at least 2 years of relevant experience."
    }
  ]
}
```

Returns HTTP `409` if any required question has not been answered, including a sorted list of missing question keys.

#### `POST /tools/available-slots`

```json
{
  "candidate_id": 1,
  "call_id": 1
}
```

Returns at most five available slots whose start time is in the future, ordered by start time.

#### `POST /tools/book-interview`

```json
{
  "candidate_id": 1,
  "call_id": 1,
  "slot_id": 7
}
```

On success, returns the new interview ID and changes the call status to `Booked`.

> [!IMPORTANT]
> The current routes verify that candidate and call IDs exist, but they do not verify that the call belongs to the supplied candidate or that the candidate is eligible before exposing/booking slots. The expected Vapi conversation flow provides those guarantees only at the application level.

### Webhook endpoint

#### `POST /vapi/webhook`

Accepts the Vapi envelope:

```json
{
  "message": {
    "type": "end-of-call-report",
    "call": {
      "id": "vapi-generated-call-id"
    },
    "artifact": {
      "transcript": "...",
      "recording": {
        "mono": {
          "combinedUrl": "https://example.com/recording.wav"
        }
      }
    },
    "endedReason": "customer-ended-call",
    "startedAt": "2026-09-28T10:00:00Z",
    "endedAt": "2026-09-28T10:06:00Z"
  }
}
```

Unknown event types and unknown call IDs are acknowledged without modifying data.

## Configuration

### Backend environment

Create `.env` in the repository root:

```dotenv
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ai_recruiter
VAPI_API_KEY=your_private_vapi_api_key
VAPI_SQUAD_ID=your_vapi_squad_id
```

| Variable | Required | Used for |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLAlchemy database connection |
| `VAPI_API_KEY` | Yes | Required by the settings model; direct server-side use is not implemented yet |
| `VAPI_SQUAD_ID` | Yes | Returned to the frontend when a call starts |

Pydantic loads the root `.env` when `app.config` is imported. The application will fail during startup if any required setting is missing.

### Frontend environment

Create `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key
```

| Variable | Required | Used for |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL prepended to backend API requests |
| `VITE_VAPI_PUBLIC_KEY` | Yes | Initializes the Vapi browser SDK |

Values prefixed with `VITE_` are bundled into browser code and must not contain private secrets.

## Local setup

### Prerequisites

- Python 3.13 or newer
- [uv](https://docs.astral.sh/uv/) for the locked Python environment, or another Python package manager
- Node.js and npm compatible with Vite 8
- PostgreSQL
- A Vapi account, public key, and configured squad
- A public HTTPS URL for Vapi tool/webhook calls during local development

### 1. Clone and enter the repository

```powershell
git clone <repository-url>
Set-Location "AI Recruiter Voice Assistant"
```

### 2. Create the PostgreSQL database

Create an empty database named `ai_recruiter`, or choose another name and update `DATABASE_URL`. The application creates its tables on first startup.

### 3. Configure the backend

Create the root `.env` using the example in [Backend environment](#backend-environment).

### 4. Install backend dependencies

Using the committed lockfile:

```powershell
uv sync
```

Alternative with pip:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e .
```

### 5. Configure and install the frontend

Create `frontend/.env` using the example in [Frontend environment](#frontend-environment), then run:

```powershell
Set-Location frontend
npm install
```

## Running the application

Use two terminals.

### Terminal 1: backend

From the repository root:

```powershell
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Useful URLs:

- API: `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`
- Swagger UI: `http://127.0.0.1:8000/docs`

### Terminal 2: frontend

From `frontend/`:

```powershell
npm run dev
```

Open `http://127.0.0.1:5173`.

The backend CORS configuration currently allows only:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Update `app/main.py` for other frontend origins.

## Preparing Vapi

Exact Vapi dashboard steps can change, but the project expects the following integration contract:

1. Create a Vapi squad/assistant for recruiter screening.
2. Put its ID in `VAPI_SQUAD_ID`.
3. Configure the assistant's prompt to verify DOB, ask questions in the documented order, evaluate eligibility, and schedule only eligible candidates.
4. Define server tools matching the request bodies in [Vapi tool endpoints](#vapi-tool-endpoints).
5. Expose the backend through HTTPS and use that public base URL for every tool.
6. Configure Vapi to send status and end-of-call events to `/vapi/webhook`.
7. Put the Vapi public browser key in `frontend/.env`.
8. Ensure the assistant uses the dynamic `candidate_id` and `call_id` variables supplied by the frontend.

The assistant should not invent question keys. It must submit the exact keys in the required order.

## Example end-to-end test

### 1. Create a candidate

```powershell
$candidate = Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8000/candidates" `
  -ContentType "application/json" `
  -Body '{"first_name":"Ayesha","last_name":"Khan","dob":"1996-04-18","email":"ayesha@example.com","job_applied":"Backend Engineer"}'

$candidate
```

### 2. Seed an interview slot

No slot-administration API exists yet. Insert at least one future row with SQL:

```sql
INSERT INTO interview_slots (start_time, end_time, recruiter_name, is_available)
VALUES (
    '2026-10-05 10:00:00',
    '2026-10-05 10:30:00',
    'Recruiter Name',
    TRUE
);
```

Use dates that are in the future relative to the server clock.

### 3. Start the browser interview

1. Open `http://127.0.0.1:5173`.
2. Enter the `id` returned in step 1.
3. Select **Start Voice Interview**.
4. Allow microphone access.
5. Complete the assistant's questions.

### 4. Inspect results

The API does not yet expose read endpoints for screening answers, interviews, or call results. Inspect the database directly or add administrative routes for those resources.

## Call statuses

The `CallStatus` enum defines these values:

| Status | Meaning / current usage |
| --- | --- |
| `Initiated` | Assigned when a local voice session starts |
| `HungUp` | Defined for future lifecycle handling |
| `NotEligible` | Assigned after failed eligibility evaluation |
| `Eligible` | Assigned after successful eligibility evaluation |
| `PreBooked` | Defined for future booking flows |
| `Booked` | Assigned after successful interview booking |
| `Transferred` | Defined for future live-transfer flows |
| `RCB` | Defined for a return-call/request-callback flow |
| `NotInterested` | Defined for candidate-decline handling |
| `Failed` | Defined for failures |

Only `Initiated`, `Eligible`, `NotEligible`, and `Booked` are actively assigned by the current implementation.

## Development notes

### Tests

Pytest and pytest-asyncio are included as development dependencies, but the `tests/` package is currently empty. Run future tests with:

```powershell
uv run pytest
```

### Type checking

Pyright configuration is stored in `pyrightconfig.json`. If Pyright is installed, run it from the repository root:

```powershell
pyright
```

### Frontend build

```powershell
Set-Location frontend
npm run build
```

The production bundle is written to `frontend/dist/`. The FastAPI app does not currently serve this directory; deploy it separately or add static-file hosting.

## Known limitations

The following reflect the current code, not just future feature ideas:

1. **Webhook status bug:** `handle_status_update()` in `app/api/webhooks.py` references `status` without assigning it from the Vapi message. A linked `status_update` event will raise an error.
2. **Unavailable-slot response bug:** the unsuccessful branch of `/tools/book-interview` omits `interview_id`, but `BookInterviewResponse.interview_id` is currently required. FastAPI can therefore raise response-validation errors when a slot is already unavailable.
3. **No automated tests:** routing, rules, normalization, booking, and webhooks have no regression coverage.
4. **No migrations:** `create_all()` creates missing tables but cannot safely evolve a deployed schema.
5. **No authentication or authorization:** all endpoints are publicly callable if exposed.
6. **No webhook signature verification:** webhook requests are trusted without proving they came from Vapi.
7. **Vapi configuration is external:** prompts, tools, and squad definitions cannot be reproduced from this repository alone.
8. **No slot administration:** interview slots must be inserted directly into the database.
9. **Limited read APIs:** there are no routes for listing candidates, calls, answers, interviews, or final results.
10. **Weak cross-resource validation:** tool routes do not confirm that a supplied call belongs to the supplied candidate.
11. **Eligibility is not enforced by scheduling routes:** callers can request or book slots without first achieving `Eligible` status.
12. **Booking is not concurrency-safe:** simultaneous requests can select the same available slot before either transaction commits.
13. **Answer uniqueness is application-only:** duplicate answers are prevented by a query/update pattern, not a database constraint.
14. **CORS and tunnel hostnames are development-specific:** production origins and hostnames require configuration changes.
15. **Sensitive screening data:** DOBs, transcripts, recordings, and eligibility decisions require appropriate encryption, retention, access control, consent, and legal review before real-world use.

## Suggested next steps

1. Fix the webhook and booking response defects.
2. Add API and service tests for the complete happy path and major failure paths.
3. Add Alembic migrations and initial slot-seeding/admin functionality.
4. Add authentication, roles, webhook verification, rate limiting, and audit logs.
5. Enforce call ownership and eligible status in scheduling endpoints.
6. Make slot booking atomic with a database lock or conditional update.
7. Add recruiter-facing APIs and a dashboard for candidates, results, transcripts, and bookings.
8. Store the Vapi assistant/squad configuration as reproducible infrastructure or documented export files.
9. Add structured logging and production health checks for the database and external services.
10. Review hiring-law, privacy, accessibility, and bias requirements for every deployment jurisdiction.
