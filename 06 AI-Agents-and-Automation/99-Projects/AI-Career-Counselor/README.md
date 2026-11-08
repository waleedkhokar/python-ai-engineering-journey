# AI Career Counselor

**Discover Your Career. Understand Your Skills. Build Your Path.**

## Problem

Students often ask, “What career should I choose?” A career decision requires more than a personality quiz or a list of popular jobs. Students need to understand how their interests, skills, academic background, preferences, and goals connect to realistic career options.

## Solution

AI Career Counselor combines a transparent Python career-matching engine with Groq-powered personalized explanations. It connects:

**Who You Are → What You Could Explore → What You Need to Learn → What You Can Build → What You Can Do Next**

### Core Workflow

`Profile → Assess → Match → Analyze → Learn → Build → Act`

## Main Features

- Student profile and academic background
- 20-interest assessment using 1–5 ratings
- Skills assessment using Beginner / Intermediate / Advanced
- Deterministic career matching from an extensible career database
- Top 5 career recommendations with 0–100 compatibility scores
- Personalized “Why This Career?” explanation
- Skill-gap analysis
- AI learning roadmap
- Education-path guidance
- Portfolio project generator
- Career Reality Check
- Career comparison for up to 3 careers
- Personalized AI Career Counselor chat
- Streamlit session-state MVP with no database
- Groq API key stored in Streamlit Secrets
- Friendly error handling

## Technology

- Python
- Streamlit
- Groq Python SDK
- Groq production model: `openai/gpt-oss-120b` by default

The model is configurable through `GROQ_MODEL` in Streamlit Secrets, so the app does not require editing source code when changing models.

## Architecture

```text
Streamlit UI
   │
   ├── Student Profile
   ├── Interest Assessment
   ├── Skills Assessment
   │
   ▼
Deterministic Career Matching Engine
   │
   ├── Interests
   ├── Skills
   ├── Subjects
   ├── Work Preferences
   ├── Activities
   └── Priorities
   │
   ▼
Top Career Matches
   │
   ├── Skill Gap Engine
   └── Selected Career
          │
          ▼
      Groq AI Layer
          ├── Career Explanation
          ├── Skill Gap Explanation
          ├── Learning Roadmap
          ├── Portfolio Projects
          ├── Career Reality Check
          └── Counselor Chat
```

## Career Matching Algorithm

The function `calculate_career_match()` is deterministic. The LLM does **not** choose the initial career matches.

It compares the student's inputs against each career profile using weighted signals:

1. Interest alignment
2. Current skill vs required skill
3. Favorite / strongest subject alignment
4. Work-style alignment
5. Environment alignment
6. Enjoyed-activity alignment
7. A small tie-breaker for selected career priorities

The result is normalized to **0–100**.

The score is an **estimated compatibility indicator**, not a scientific aptitude test or prediction of future success.

Career profiles are stored in `CAREER_DB` so new careers can be added without changing the matching architecture.

## Groq Integration

The app uses the current Groq Python SDK pattern:

```python
from groq import Groq

client = Groq(api_key=api_key)

response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ],
)
```

The API key is read from:

```python
st.secrets["GROQ_API_KEY"]
```

The application also supports:

```toml
GROQ_MODEL = "openai/gpt-oss-120b"
```

No API key is stored in the source code.

## Installation

### 1. Create a virtual environment (recommended)

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure the API key locally

Create:

```text
.streamlit/secrets.toml
```

Add:

```toml
GROQ_API_KEY = "YOUR_REAL_GROQ_API_KEY"
GROQ_MODEL = "openai/gpt-oss-120b"
```

**Never commit this file to GitHub.**

### 4. Run locally

```bash
streamlit run app.py
```

## GitHub Web UI Setup

Repository name:

```text
ai-career-counselor
```

1. Sign in to GitHub.
2. Create a new repository.
3. Choose Public or Private.
4. Click **Add file**.
5. Choose **Upload files**.
6. Upload:
   - `app.py`
   - `requirements.txt`
   - `README.md`
   - `secrets.toml.example`
7. Click **Commit changes**.
8. Verify the four files are visible.

### Important Security Rule

Do **not** upload:

```text
.streamlit/secrets.toml
```

if it contains your real API key.

If you accidentally expose an API key, revoke/rotate it in Groq immediately.

## Streamlit Community Cloud Deployment

1. Open Streamlit Community Cloud.
2. Sign in with GitHub.
3. Choose **Create app**.
4. Select repository:
   `ai-career-counselor`
5. Select the correct branch, normally `main`.
6. Set the main file to:
   `app.py`
7. Deploy the app.
8. After the app opens, open the app's **Settings / Secrets** area.
9. Add:

```toml
GROQ_API_KEY = "YOUR_REAL_GROQ_API_KEY"
GROQ_MODEL = "openai/gpt-oss-120b"
```

10. Save the secrets.
11. Reboot/redeploy if requested.
12. Test:
    - Profile
    - Interest Assessment
    - Skills Assessment
    - Career Matches
    - AI explanation
    - Roadmap
    - Portfolio
    - Reality Check
    - Counselor chat

## Demo Scenario

Example:

- Education: BS English
- Interests: Writing + Technology + Education
- Strengths: Communication + Creativity
- Writing: Advanced
- Programming: Beginner
- Communication: Advanced
- Work preference: Remote + creative
- Priorities: Flexibility + Creativity + Income

Possible exploration results can include:

- Technical Writer
- UX Writer
- Instructional Designer

The important demo is the **path**, not only the job title:

```text
Technical Writer
      ↓
Skill Gap
      ↓
Technical documentation
Markdown
Basic technology knowledge
Git/GitHub
      ↓
Learning Roadmap
      ↓
Portfolio Projects
      ↓
Career Reality Check
```

The actual score is calculated from the student's entered information by the deterministic matching engine.

## Privacy

The application does not require:

- National ID
- Passwords
- Financial information
- Medical information

Do not enter sensitive personal information. The MVP keeps the student's current session in Streamlit session state and does not use a database.

## Hackathon Positioning

### Problem

Students often ask:

> “What career should I choose?”

But career decisions require more than a personality quiz.

### Solution

AI Career Counselor connects:

**Who You Are**

with:

**What You Could Become**

and:

**How You Can Get There**

### USP

> **Don't just recommend a career. Show students the path to reach it.**

## Future Improvements

- Persistent database
- User accounts
- Career-market data
- University and course recommendations
- Job-market analysis
- Resume analysis
- Interview preparation
- Mentor matching
- Multilingual support
- Personalized career tracking
- Current labor-market information with citations

## Disclaimer

AI Career Counselor provides educational career exploration and personalized guidance based on the information you provide. Career match scores are estimates, not scientific predictions or guarantees. Students should consider discussions with teachers, career counselors, professionals, and current information about education and employment before making major career decisions.
