# 🚀  Enterprise AI Business Assistant

* **🤖 Autonomous AI Support Agent:** Built using custom system prompts and LangChain to handle enterprise customer inquiries, product specifications, and stock validation with clean Markdown outputs.
* **📊 Natural Language Analytics Agent (Text-to-SQL):** Translates plain English business questions into secure SQL queries, executes them against PostgreSQL, and formats raw data into executive reports without exposing internal database IDs.
* **🛡️ Built-in Rate-Limit & Quota Management:** Robust error-handling and fallback mechanics ensuring smooth UX even under API throttling.
* **🐳 Fully Containerized Workflow:** Single-command deployment using Docker and Docker Compose orchestrating both frontend and backend services seamlessly.
---

## 🚀 Project Overview

The AI-Ops Enterprise Platform is a smart 2-in-1 business assistant designed to help both business owners and customers handle everything through a single chat screen.

Instead of dealing with complicated menus or writing technical code, the platform works like a conversation for everyone:

For Clients & Customers: You can easily track your order history, check your payment details, ask questions about products, and get instant updates on your shipments at any time.

For Business Owners & Admins: You can instantly check your total sales, monitor company growth, view customer stats, and pull up deep business reports just by typing a normal question.

Everything happens instantly in one place, saving time and keeping your business operations running smoothly without manual hassle.

---

## ✨ Core Features

* **🤖 Autonomous AI Support Agent:** Built using custom system prompts and LangChain to handle enterprise customer inquiries, product specifications, and stock validation with clean Markdown outputs.
* **📊 Natural Language Analytics Agent (Text-to-SQL):** Translates plain English business questions into secure SQL queries, executes them against PostgreSQL, and formats raw data into executive reports without exposing internal database IDs.
* **🛡️ Built-in Rate-Limit & Quota Management:** Robust error-handling and fallback mechanics ensuring smooth UX even under API throttling.
* **🐳 Fully Containerized Workflow:** Single-command deployment using Docker and Docker Compose orchestrating both frontend and backend services seamlessly.
* **🎨 Modern Responsive UI:** Clean dark-mode friendly admin dashboard and chat interfaces built with Tailwind CSS and TypeScript.


## 📸 Screenshots

| Dashboard of Chat Bots | Analytics & SQL Interface |
| :---: | :---: |
| ![Preview 1](frontend/public/1.png) | ![Preview 2](frontend/public/2.png) |

| VS Code Overiew  | AI Chat Support Agent |
| :---: | :---: |
| ![Preview 3](frontend/public/3.png) | ![Preview 4](frontend/public/4.png) |

---

## 🛠 Tech Stack & Engineering Skills Applied

### Frontend Engineering
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)

* **Frameworks & UI:** Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit for state management.
* **Styling & Design:** Fully responsive component architecture with dark/light mode themes and custom animations.

### Backend, Database & AI Engineering
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white) ![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

* **Backend & DevOps:** Python, FastAPI, asynchronous RESTful APIs, PostgreSQL, relational database schemas, Docker, Docker Compose, AWS infrastructure.
* **AI Engineering & LLMs:** LangChain, Google Gemini (`gemini-3.6-flash`), RAG pipelines, Text-to-SQL generation, Agentic AI workflows, prompt engineering, and resilient fallback/rate-limit exception handling.

---

## 📁 Project Structure

```text
ai-ops-assistant/
├── backend/                    # FastAPI & AI Agents Service
│   ├── app/
│   │   ├── agents/             # Autonomous AI Support & Text-to-SQL Analytics Agents
│   │   │   ├── __init__.py
│   │   │   ├── support_agent.py    # Customer inquiry & product specification logic
│   │   │   └── analytics_agent.py  # Natural language to SQL translation & fallback logic
│   │   ├── core/               # Configuration, security, and environment setup
│   │   │   ├── __init__.py
│   │   │   └── config.py           # Application settings & environment variables
│   │   ├── services/           # Business logic and external API integrations
│   │   │   ├── __init__.py
│   │   │   └── database.py         # PostgreSQL connection & SQLDatabase session management
│   │   ├── utils/              # Helper utilities and rate-limit handlers
│   │   │   ├── __init__.py
│   │   │   └── rate_limiter.py     # Fallback and quota exception error handlers
│   │   └── main.py             # FastAPI application entry point and middleware setup
│   ├── requirements.txt        # Python backend dependencies & package listings
│   └── Dockerfile              # Backend container build configuration for Python/FastAPI
│
├── frontend/                   # Next.js User Interface
│   ├── public/                 # Static assets & UI screenshots (1.png, 2.png, 3.png, 4.png)
│   ├── src/                    # App source files, components, state management, and pages
│   ├── package.json            # Node.js dependencies & scripts
│   └── Dockerfile              # Frontend container build configuration for Next.js production
│
├── docker-compose.yml          # Multi-container orchestration setup for local and deployment run
└── README.md                   # Project documentation

```

---

## 🚀 Quick Start & Installation

Follow these steps to run the application locally or via Docker.

### Prerequisites

* **Docker & Docker Compose** (Recommended for instant containerized deployment)
* **Node.js** (v18.x or higher — if running frontend locally)
* **Python** (v3.10 or higher — if running backend locally)
* **PostgreSQL** database instance

---

### 🐳 Option 1: Run with Docker Compose (Recommended)

1. Clone the repository and navigate to the root directory:
```bash
git clone https://github.com/waleedkhokar/enterprise-ai-business-assistant.git
cd enterprise-ai-business-assistant

```


2. Create a `.env` file inside your `backend/` directory or root configuration with your credentials:
```env
GEMINI_API_KEY=your_google_ai_studio_key_here
DATABASE_URL=postgresql://username:password@host:5432/database_name

```


3. Build and spin up all containers with a single command:
```bash
docker compose up --build

```



The frontend will be live at `http://localhost:3000` and the FastAPI backend at `http://localhost:8000`.

---

### 💻 Option 2: Manual Local Setup

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

---
but devolepr add like this ok liek full stack Ai enger having more than 1 year of expoeing in buliding Web Application and mobiel ( Andirod& Ios ) with ai powerred featuered  spelizeign in makeign ai products using and intelligent AI solutions using generativeAI LLM RAG Agentic AI, LLM, RAG, LangChain).


## 👨‍💻 Developer

**Waleed Khokhar**

## *Full-Stack AI Engineer*

Full-Stack Developer with 1+ year of experience building scalable Web Applications and mobile apps (Android & iOS) with AI-powered features. Specializing in making intelligent AI solutions and products using Generative AI, LLMs, Agentic AI, RAG, and LangChain automation, alongside expert proficiency in Next.js, MERN stack, and Python/FastAPI backends.

🌐 **Portfolio:** [waledkhokar.vercel.app](https://waledkhokar.vercel.app/)

💼 **LinkedIn:** [linkedin.com/in/waleedkhokhar](https://www.google.com/search?q=linkedin.com/in/waleedkhokhar)

💻 **GitHub:** [github.com/waleedkhokar](https://www.google.com/search?q=github.com/waleedkhokar)


---

## 📄 License

Currently a personal/private portfolio and development project.

---

⭐ **If this project helped demonstrate advanced AI agent workflows and SQL orchestration, consider starring the repository!**