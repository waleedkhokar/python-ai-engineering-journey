# ChemLab AI — Chemistry Lab Assistant

## About the App
ChemLab AI is an AI-powered Chemistry Lab Assistant built for undergraduate Chemistry students. It helps students prepare for and understand laboratory experiments before practical classes and exams.

## The Problem
Chemistry students often struggle to understand laboratory experiments, remember procedures, prepare for viva questions, and revise important concepts before lab sessions and exams.

## The Solution
ChemLab AI provides structured experiment information (aim, chemicals, apparatus, procedure, observations, safety precautions) alongside an AI Chemistry Assistant that answers questions, generates viva questions, and creates revision summaries — all tailored to the specific experiment a student is studying.

## Live Demo
🔗 https://chemlab-ai.ai.studio

## Features
- Experiment Library with search
- Detailed experiment pages (aim, chemicals, apparatus, procedure, observations, safety, common mistakes)
- AI Chemistry Assistant — answers student questions with experiment context
- Chemistry-only guardrail — politely declines unrelated questions
- AI Viva Question Generator — produces experiment-specific viva questions with answers
- AI Revision Summary Generator — produces experiment-specific revision summaries
- Lab Preparation Checklist — students track their readiness per experiment

## The AI Feature
The AI Chemistry Assistant is powered by the Gemini API. It answers student questions, generates viva questions, and creates revision summaries, always grounded in the specific experiment's context. It follows a system prompt I wrote to keep it accurate, safety-focused, and strictly on-topic:

**System Instruction:**
> You are ChemLab AI, a Chemistry Laboratory Assistant designed to help undergraduate Chemistry students understand laboratory experiments. Your responsibilities: explain Chemistry concepts accurately and clearly; help students understand laboratory experiments including aims, chemicals, apparatus, procedures, observations, and safety precautions; generate educational viva questions and clear answers; create concise revision summaries; use simple language suitable for undergraduate students; ask for clarification if a question is unclear; never invent experimental results or claim an experiment was actually performed; always encourage appropriate laboratory safety; never provide unsafe instructions for handling hazardous chemicals beyond appropriate educational guidance; use the experiment information provided by the app as context when answering; keep all answers educational, accurate, and relevant.

## Tools, Services, and AI Models Used
- Google AI Studio (Build mode) — app generation and hosting
- Gemini API (Gemini 3.6 Flash) — AI-powered features
- React — frontend framework
- GitHub — public source code repository
- GitHub Desktop — version control

## Screenshots
<img width="1166" height="616" alt="screenshot5 ai answer" src="https://github.com/user-attachments/assets/2a33657e-227a-486f-9151-fb5ddf21d218" />
<img width="1162" height="593" alt="screenshot 4 experiment" src="https://github.com/user-attachments/assets/05d19885-1ad5-4f41-8e00-6e740fdf8eac" />
<img width="1162" height="593" alt="screenshot3 review" src="https://github.com/user-attachments/assets/e4103612-db95-4949-856d-ec7b00bf390e" />
<img width="1162" height="593" alt="screenshot2 viva" src="https://github.com/user-attachments/assets/47c11a89-8be9-4315-b741-ac84382f55e0" />
<img width="1162" height="593" alt="screenshot2-experiment" src="https://github.com/user-attachments/assets/dc84d35d-ef73-464b-a926-d14eac83dcd8" />

## How to Run Locally
1. Clone the repository: `git clone https://github.com/ayeshaafzal5/chemlab-ai.git`
2. Install dependencies: `bun install` (or `npm install`)
3. Add a `.env` file with your own `GEMINI_API_KEY`
4. Run the dev server: `bun run dev` (or `npm run dev`)
