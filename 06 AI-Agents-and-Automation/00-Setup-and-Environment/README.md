
# 00 — Setup and Environment

> Set up your development environment for building AI agents, Python automation, and intelligent workflows.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 00 — Setup and Environment |
| Planned Date | Sep 1, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Basic programming knowledge recommended |
| Primary Language | Python |
| Tools | Python, VS Code, Git, GitHub, Jupyter, API providers, n8n |
| Main Focus | Environment setup, dependencies, API configuration, and project organization |
| Next Module | 01 — What Are AI Agents? |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Understand the tools required to develop AI agents.
- Set up Python and a virtual environment.
- Organize a professional Python project.
- Install and manage dependencies.
- Configure API keys securely using environment variables.
- Make your first API request to an LLM provider.
- Understand when to use Python scripts, Jupyter notebooks, and visual automation tools.
- Set up Git and GitHub for version control.
- Understand the development tools needed for future agent frameworks and automation projects.

---

## 1. What Are We Building in This Course?

AI agents are software systems that use AI models to interpret tasks, select actions, use tools, and work toward a goal.

Throughout this course, we will progress from simple agents to practical automation systems.

Our learning journey will include:

- AI agent fundamentals and architecture
- Tool calling and external API integrations
- Agent memory, context, and state
- Reasoning and planning
- Agent frameworks
- Python-based workflow automation
- n8n visual automation
- Browser and computer-use agents
- Evaluation, testing, and debugging
- Security, human approval, and production basics
- Practical projects from beginner to advanced

You do not need to master every tool before starting. We will introduce each technology when it becomes relevant.

---

## 2. Understand the Development Tools

| Tool | Purpose |
|---|---|
| Python | Build agent logic, tools, integrations, and automation scripts |
| VS Code | Write and manage source code |
| Jupyter Notebook | Experiment with concepts and run code step by step |
| Git | Track changes in your code |
| GitHub | Store projects and collaborate with others |
| Virtual environment | Isolate dependencies for each project |
| LLM API provider | Access a language model through an API |
| n8n | Build visual workflows using triggers, integrations, and AI nodes |
| Terminal | Install dependencies and run applications |
| pytest | Test Python functions and application behavior |

### Python vs. Jupyter vs. n8n

**Python files (`.py`)**

Use Python files for reusable functions, application logic, APIs, agents, and production-oriented projects.

**Jupyter notebooks (`.ipynb`)**

Use notebooks for experimentation, step-by-step explanations, demonstrations, and exercises.

**n8n workflows**

Use n8n for visual automation involving schedules, webhooks, API integrations, conditional steps, and connected services.

These tools complement one another. You do not need to choose only one.

---

## 3. Install the Required Software

Install the following tools before continuing.

| Software | Purpose | Official Resource |
|---|---|---|
| Python | Main programming language | [python.org](https://www.python.org/downloads/) |
| VS Code | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| Git | Version control | [git-scm.com](https://git-scm.com/downloads) |
| Jupyter | Interactive notebooks | [jupyter.org](https://jupyter.org/install) |
| n8n | Visual workflow automation | [docs.n8n.io](https://docs.n8n.io/) |

Use a supported Python version compatible with the packages and frameworks used in each lesson. Check the relevant package documentation before choosing a version for a new project.

Verify your installation:

```bash
python --version
git --version
```

On systems where Python is available through `python3`, use:

```bash
python3 --version
```

If a command is not recognized, check that the software is installed and available on your system's PATH.

---

## 4. Create the Project Environment

Create a dedicated project directory.

```bash
mkdir ai-agents-and-automation
cd ai-agents-and-automation
```

Create a virtual environment:

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows PowerShell**

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

A virtual environment keeps project dependencies separate from packages installed for other projects.

When the environment is active, your terminal will usually show `(.venv)`.

---

## 5. Install the Initial Dependencies

Create a file named `requirements.txt`:

```text
openai
python-dotenv
pydantic
httpx
pytest
jupyter
```

Install the packages:

```bash
python -m pip install -r requirements.txt
```

### Why are these packages useful?

| Package | Purpose |
|---|---|
| `openai` | Example LLM API client; other providers may use different SDKs |
| `python-dotenv` | Load local configuration from a `.env` file |
| `pydantic` | Validate structured data and application state |
| `httpx` | Make HTTP requests to external services |
| `pytest` | Write and run tests |
| `jupyter` | Work with interactive notebooks |

This is a starter environment, not the complete dependency list for the course. Install framework-specific packages in the modules where they are needed.

For reproducible projects, record and test compatible dependency versions before publishing a release.

---

## 6. Create a Professional Project Structure

Start with the following structure:

```text
ai-agents-and-automation/
├── .venv/
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
├── README.md
├── notebooks/
├── src/
│   └── main.py
├── tests/
│   └── test_main.py
└── workflows/
```

### Folder responsibilities

- `notebooks/` — Interactive lessons and experiments.
- `src/` — Reusable Python modules and application logic.
- `tests/` — Automated tests.
- `workflows/` — Exported workflow files, including n8n JSON exports.
- `.env` — Local secrets and configuration.
- `.env.example` — A safe template showing required environment variables.
- `.gitignore` — Files Git should not track.
- `requirements.txt` — Python dependencies.

The `.venv/` directory is generated locally. Do not commit it to GitHub.

---

## 7. Configure Environment Variables Securely

Many AI applications use API keys to authenticate with external services.

Create a `.env` file:

```dotenv
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your_supported_model_id
```

Replace the example values with credentials and a model identifier supported by your chosen provider.

Create `.env.example`:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=
```

Create `.gitignore`:

```gitignore
.venv/
__pycache__/
*.py[cod]
.env
.ipynb_checkpoints/
.pytest_cache/
.coverage
dist/
build/
```

**Important security rules:**

- Never commit API keys or passwords to GitHub.
- Never paste real credentials into public notebooks.
- Do not place secrets in `.env.example`.
- Rotate a key immediately if it is accidentally exposed.
- Use managed secrets and access controls when deploying applications.

Environment variables help separate configuration from code, but production applications should use an appropriate secrets-management solution.

---

## 8. Make Your First LLM API Request

Before building an agent, verify that your environment can communicate with an LLM.

Create `src/main.py`:

```python
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
model = os.getenv("OPENAI_MODEL")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY is missing from your environment.")

if not model:
    raise RuntimeError("OPENAI_MODEL is missing from your environment.")

client = OpenAI(api_key=api_key)

response = client.responses.create(
    model=model,
    input="Explain an AI agent in two simple sentences.",
)

print(response.output_text)
```

Run the application from the project root:

```bash
python src/main.py
```

If the configuration and credentials are valid, the program should print a response from the model.

### What did we learn?

1. `load_dotenv()` loads local environment variables from `.env`.
2. `os.getenv()` reads configuration without hardcoding credentials.
3. `OpenAI()` creates an API client.
4. `responses.create()` sends a request to the model.
5. `response.output_text` retrieves the generated text.

This example verifies basic model access. It is not an AI agent yet: it does not select tools, maintain task state, or execute a multi-step loop.

**Troubleshooting:** If the request fails, check the API key, model availability, account access, network connectivity, and provider error message. API access may involve usage charges.

---

## 9. Set Up Jupyter Notebooks

Install Jupyter through the requirements file, then start it:

```bash
jupyter notebook
```

Create a notebook inside `notebooks/` named:

```text
00-environment-setup.ipynb
```

Use the notebook to:

1. Verify the Python environment.
2. Load configuration without displaying secrets.
3. Test basic Python functions.
4. Run a simple model request if credentials are available.
5. Record observations and troubleshooting notes.

Example notebook cell:

```python
import sys

print("Python executable:", sys.executable)
print("Python version:", sys.version)
```

Make sure the notebook uses the project's virtual environment as its kernel. Never print the contents of `.env` or expose credentials in saved notebook outputs.

---

## 10. Understand n8n Before Building Workflows

n8n is a visual workflow automation platform. It connects services and executes defined workflows using nodes.

A typical workflow may look like:

```text
Schedule Trigger
       |
       v
Fetch Data from API
       |
       v
Transform and Validate Data
       |
       v
AI Processing
       |
       v
Send Notification
```

You will learn the practical details in Module 08.

For now, understand these concepts:

- **Trigger:** Starts a workflow.
- **Node:** Performs an operation.
- **Connection:** Passes data between nodes.
- **Expression:** Uses workflow data dynamically.
- **Credential:** Authenticates with a connected service.
- **Execution:** A run of the workflow.
- **Webhook:** Starts or communicates with a workflow through an HTTP endpoint.

You can explore n8n using its hosted service or a local installation. For local installation, follow the official documentation and choose a supported deployment method. Avoid exposing an unsecured n8n instance publicly.

---

## 11. Version Control with Git

Initialize Git in the project directory:

```bash
git init
git add .
git status
```

Review the files before committing. Confirm that `.env`, `.venv/`, and any sensitive notebook outputs are excluded.

Create the first commit:

```bash
git commit -m "chore: set up AI agents development environment"
```

When ready, connect the repository to GitHub and push your code.

Use meaningful commits so that you can track improvements throughout the course.

---

## 12. Common Problems and Solutions

| Problem | What to check |
|---|---|
| Python command not found | Installation and PATH configuration |
| Package import error | Active virtual environment and package installation |
| API authentication error | API key, account access, and environment configuration |
| Model not found | Provider-supported model identifier and permissions |
| Rate limit error | Provider limits, request frequency, and retry policy |
| Notebook uses wrong Python | Selected Jupyter kernel |
| Secrets appear in Git | Stop the commit, remove exposed secrets, and rotate credentials |
| n8n node fails | Credentials, input data, endpoint, and execution logs |

Do not automatically retry every error. Authentication failures, invalid requests, and permission errors usually require correction rather than repeated requests.

---

## 13. Practical Exercises

Complete these exercises before moving to the next module.

### Exercise 1 — Environment Setup

- [ ] Install Python, Git, and VS Code.
- [ ] Create and activate a virtual environment.
- [ ] Install the starter dependencies.
- [ ] Verify Python and pip versions.

### Exercise 2 — Project Configuration

- [ ] Create the project folders.
- [ ] Add `.gitignore` and `.env.example`.
- [ ] Configure your local environment.
- [ ] Confirm that secrets are excluded from version control.

### Exercise 3 — First Model Request

- [ ] Configure a supported model and valid API key.
- [ ] Run `src/main.py`.
- [ ] Explain what each major line does.
- [ ] Identify one likely cause of an authentication failure.

### Exercise 4 — Git and Jupyter

- [ ] Run a notebook using the correct Python kernel.
- [ ] Initialize Git and inspect the files to be committed.
- [ ] Create your first commit.
- [ ] Verify that no credentials are included.

### Exercise 5 — n8n Exploration

- [ ] Open an n8n instance.
- [ ] Explore a trigger and two connected nodes.
- [ ] Identify where credentials are configured.
- [ ] Save a small test workflow without including secrets.

---

## 14. Completion Checklist

You are ready for Module 01 when you can:

- [ ] Explain the role of each development tool.
- [ ] Create and activate a Python virtual environment.
- [ ] Install project dependencies.
- [ ] Organize a basic Python application.
- [ ] Configure environment variables safely.
- [ ] Make a basic LLM API request.
- [ ] Run a Jupyter notebook using the correct environment.
- [ ] Explain the difference between Python scripts, notebooks, and n8n workflows.
- [ ] Use Git to track your work.
- [ ] Troubleshoot common environment and API problems.

---

## 15. Key Takeaways

- A clean development environment makes AI projects easier to build and maintain.
- Python is the main implementation language for this course.
- Jupyter notebooks are useful for learning and experimentation.
- n8n is useful for connecting services and building visual automations.
- Environment variables separate configuration from source code.
- API access is the starting point for many LLM-powered applications.
- Git and GitHub help track progress and publish reproducible projects.
- Security and testing should be considered from the beginning.

---

## ➡️ What's Next?

### Module 01 — What Are AI Agents?

In the next module, we will explore:

- What an AI agent is
- The difference between an agent, chatbot, LLM application, and workflow
- Core agent components
- How agents observe, decide, act, and evaluate results
- When an agent is useful and when ordinary automation is better
- Your first simple agent concept and practical implementation

**Next folder:** `01-What-Are-AI-Agents/`

**Goal:** Finish this setup, test the examples, and build a reliable foundation for the rest of the course.
