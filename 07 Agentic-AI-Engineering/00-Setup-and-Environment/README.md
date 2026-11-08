# 🚀 Module 00: Setup and Environment — Agentic AI Engineering

> **📅 Date:** October 1, 2026  
> **🎯 Level:** Beginner to Advanced  
> **🐍 Language:** Python  
> **📚 Course:** Agentic AI Engineering  
> **🎯 Goal:** Prepare a clean, secure, and reproducible environment for building advanced Agentic AI systems.

---

## 🎯 What I Will Learn

- What an Agentic AI engineering environment is.
- Required tools and Python versions.
- Creating and managing virtual environments.
- Installing and managing dependencies.
- Configuring VS Code, Git, and GitHub.
- Managing API keys and environment variables.
- Organizing configuration files.
- Installing and verifying LangGraph.
- Testing the development environment.
- Fixing common setup problems.
- Following professional environment management practices.

---

## 📖 1. What Is an Agentic AI Engineering Environment?

An **Agentic AI engineering environment** is the collection of tools, libraries, configuration, and credentials required to develop and test AI applications.

For this course, the environment supports applications that use:

- Python for application logic.
- LLM providers for model access.
- LangGraph for stateful workflows.
- APIs for external integrations.
- Git and GitHub for version control.
- Pytest for automated testing.

**In simple words:**

> A properly configured environment gives us the tools needed to build, test, and maintain Agentic AI applications.

This module focuses on environment preparation, not the complete implementation of agents or workflows. Those subjects are covered in later modules.

---

## 🎯 2. Prerequisites

Before starting, you should understand:

- Basic Python syntax.
- Functions and classes.
- Installing Python packages.
- Basic API usage.
- Fundamental AI agent concepts from Course 06 — AI Agents and Automation.

### Required Tools

| Tool | Purpose |
|---|---|
| Python | Application development |
| pip | Package installation |
| venv | Virtual environments |
| VS Code | Code editing and debugging |
| Git | Version control |
| GitHub | Repository hosting |
| Pytest | Automated testing |
| LangGraph | Stateful workflow development |

Jupyter Notebook and other agent frameworks are optional.

**Python version:** Python 3.12 is a reasonable starting point, provided the selected frameworks support it. Always verify the current requirements of your dependencies.

---

## 🐍 3. Check Python Installation

### macOS and Linux

Check the installed version:

```bash
python3 --version
```

Check the executable location:

```bash
which python3
```

Display detailed interpreter information:

```bash
python3 -c "import sys; print(sys.executable); print(sys.version)"
```

### Windows

```powershell
py --version
```

Check the executable:

```powershell
where python
```

**Important:** Different projects may require different Python versions. Choose a version compatible with your frameworks and dependencies rather than automatically installing the newest release.

---

## 🛠️ 4. Create a Virtual Environment

A **virtual environment** provides an isolated Python package installation for a project.

It helps prevent dependency conflicts between projects.

### Step 1: Navigate to the Module

```bash
cd "/path/to/python-ai-engineering-journey/07-Agentic-AI-Engineering/00-Setup-and-Environment"
```

Replace the example path with your actual repository path.

### Step 2: Create the Environment

On macOS or Linux:

```bash
python3 -m venv .venv
```

On Windows:

```powershell
py -m venv .venv
```

This creates a `.venv` directory.

### Step 3: Activate the Environment

**macOS and Linux:**

```bash
source .venv/bin/activate
```

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**

```cmd
.venv\Scripts\activate.bat
```

### Step 4: Verify Activation

```bash
python --version
python -c "import sys; print(sys.executable)"
```

The executable should point to the `.venv` directory.

### Step 5: Upgrade pip

```bash
python -m pip install --upgrade pip
```

### Step 6: Deactivate When Finished

```bash
deactivate
```

Reactivate the environment when you return to the project.

**Best practice:** Use a dedicated virtual environment for each project with different dependency requirements.

---

## 📦 5. Install and Manage Dependencies

A **dependency** is a package required by an application.

Examples include:

- `python-dotenv` for environment-variable configuration.
- `pytest` for testing.
- `langgraph` for graph-based workflows.

### Create `requirements-base.txt`

```text
python-dotenv>=1.0,<2.0
pytest>=8.0,<10.0
```

These are example version ranges, not a fully locked dependency set.

Install the packages:

```bash
python -m pip install -r requirements-base.txt
```

### Install LangGraph When Needed

```bash
python -m pip install langgraph
```

Check the official documentation for supported Python versions and current installation requirements.

### Inspect Installed Packages

```bash
python -m pip list
```

Check dependency compatibility:

```bash
python -m pip check
```

Record installed package versions:

```bash
python -m pip freeze > requirements-lock.txt
```

`pip freeze` records installed versions, but it is not a complete replacement for a dedicated dependency lockfile workflow.

### Dependency Management Rules

- Declare required dependencies.
- Avoid unnecessary packages.
- Check compatibility before upgrading frameworks.
- Keep optional frameworks separate when their dependencies differ.
- Test the application after changing dependencies.
- Recreate the environment periodically to verify installation instructions.

---

## 🖥️ 6. Configure VS Code

VS Code provides an integrated development environment for Python.

### Setup Steps

1. Open the repository in VS Code.
2. Install the Python extension.
3. Open the Command Palette.
4. Select `Python: Select Interpreter`.
5. Choose the interpreter inside `.venv`.
6. Open a terminal.
7. Verify the selected interpreter.

Run:

```bash
python -c "import sys; print(sys.executable)"
```

The output should point to your project environment.

### Optional Extensions

| Extension | Purpose |
|---|---|
| Python | Python language support |
| Pylance | Code analysis and IntelliSense |
| Jupyter | Notebook development |

Install extensions only when needed and review their publishers before installation.

---

## 🔐 7. Configure API Keys Securely

Agentic AI applications may require credentials for LLM providers and external services.

**Never hardcode real API keys in Python files.**

### Incorrect Approach

```python
API_KEY = "your-real-secret-key"
```

This risks exposing credentials through Git commits and shared files.

### Correct Approach

Read credentials from environment variables:

```python
import os

api_key = os.getenv("LLM_API_KEY")

if not api_key:
    raise RuntimeError("LLM_API_KEY is required.")
```

### Create a `.env` File

```dotenv
LLM_API_KEY=replace_with_your_real_key
LLM_MODEL=replace_with_a_supported_model_name
```

These values are placeholders.

### Create `.env.example`

```dotenv
LLM_API_KEY=
LLM_MODEL=
```

This file documents the required configuration without exposing real credentials.

Create your local `.env` file from the example.

**macOS and Linux:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Install `python-dotenv` if necessary:

```bash
python -m pip install python-dotenv
```

### Load the Configuration

```python
import os

from dotenv import load_dotenv


def load_api_key() -> str:
    load_dotenv()

    api_key = os.getenv("LLM_API_KEY")

    if not api_key:
        raise RuntimeError(
            "LLM_API_KEY is missing from the environment."
        )

    return api_key


if __name__ == "__main__":
    load_api_key()
    print("API configuration is available.")
```

This example validates that the key exists. It does not verify that the key is valid with the provider.

### Security Rules

- Never commit `.env`.
- Never print API keys.
- Use separate development and production credentials.
- Rotate exposed credentials immediately.
- Restrict access to production secrets.
- Use a secret manager when appropriate for production systems.

---

## ⚙️ 8. Create a Basic Configuration Module

As projects grow, configuration should be separated from application logic.

Create `config.py`:

```python
import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    api_key: str
    model: str


def load_settings() -> Settings:
    load_dotenv()

    api_key = os.getenv("LLM_API_KEY")
    model = os.getenv("LLM_MODEL")

    if not api_key:
        raise RuntimeError("LLM_API_KEY is required.")

    if not model:
        raise RuntimeError("LLM_MODEL is required.")

    return Settings(
        api_key=api_key,
        model=model,
    )


if __name__ == "__main__":
    settings = load_settings()

    print("Configuration loaded successfully.")
    print(f"Configured model: {settings.model}")
```

### Explanation

- `Settings` groups related configuration values.
- `frozen=True` prevents normal reassignment of its fields.
- `load_settings()` reads and validates configuration.
- Missing required variables produce clear errors.
- The main guard prevents the example from running automatically when imported.

Do not assume that a configured model name is supported by your provider. Verify provider-specific settings when integrating the API.

---

## 🚫 9. Configure `.gitignore`

Create a `.gitignore` file:

```gitignore
# Virtual environments
.venv/
venv/

# Environment variables and secrets
.env
.env.*
!.env.example

# Python cache
__pycache__/
*.py[cod]

# Testing
.pytest_cache/
.coverage
htmlcov/

# Jupyter
.ipynb_checkpoints/

# Logs
*.log

# Build artifacts
build/
dist/
*.egg-info/
```

This excludes common generated files and local secrets from Git's untracked-file workflow.

**Important:** `.gitignore` does not automatically stop tracking files already committed.

Check whether `.env` is tracked:

```bash
git ls-files .env
```

If necessary, remove it from Git tracking while keeping the local file:

```bash
git rm --cached .env
```

If a real API key was committed, rotate it even after removing the file from tracking.

---

## 🧪 10. Verify the Development Environment

Create `check_environment.py`:

```python
import sys


def main() -> None:
    print("Agentic AI environment check")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")


if __name__ == "__main__":
    main()
```

Run:

```bash
python check_environment.py
```

This verifies that the Python program runs with the selected interpreter.

### Verify Dependencies

```bash
python -m pip check
```

### Verify Pytest

```bash
python -c "import pytest; print('Pytest is available')"
```

### What These Checks Prove

They help verify that:

- Python is available.
- The intended interpreter is being used.
- Required packages are installed.
- Declared dependencies do not have detected conflicts.

They do not prove that an external model API works or that a complete agent is reliable.

---

## 🔗 11. Verify LangGraph

LangGraph will be explored in depth in Module 02.

For now, install the package and run a minimal graph to confirm that the environment supports basic graph execution.

### Install

```bash
python -m pip install langgraph
```

### Create `check_langgraph.py`

```python
from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class WorkflowState(TypedDict):
    message: str


def prepare_message(state: WorkflowState) -> WorkflowState:
    return {
        "message": f"Environment check: {state['message']}"
    }


def main() -> None:
    builder = StateGraph(WorkflowState)

    builder.add_node("prepare_message", prepare_message)

    builder.add_edge(START, "prepare_message")
    builder.add_edge("prepare_message", END)

    graph = builder.compile()

    result = graph.invoke(
        {"message": "Agentic AI is ready."}
    )

    print(result)


if __name__ == "__main__":
    main()
```

Run:

```bash
python check_langgraph.py
```

Expected output:

```text
{'message': 'Environment check: Agentic AI is ready.'}
```

### What Is Happening?

- `TypedDict` defines the expected state structure.
- `StateGraph` creates a graph builder.
- `add_node()` registers a Python function.
- `add_edge()` defines the execution path.
- `START` marks the graph entry point.
- `END` marks the graph termination point.
- `compile()` prepares the graph for execution.
- `invoke()` runs the workflow using the initial state.

This is an environment verification example, not a production agent.

---

## 🧪 12. Test Configuration with Pytest

Configuration should be tested without making real LLM API calls.

Create `tests/test_config.py`:

```python
import pytest

from config import load_settings


def test_load_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("LLM_API_KEY", "test-key")
    monkeypatch.setenv("LLM_MODEL", "test-model")

    settings = load_settings()

    assert settings.api_key == "test-key"
    assert settings.model == "test-model"


def test_missing_api_key(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("LLM_API_KEY", raising=False)
    monkeypatch.setenv("LLM_MODEL", "test-model")

    with pytest.raises(RuntimeError, match="LLM_API_KEY"):
        load_settings()
```

Run:

```bash
python -m pytest -q
```

These tests use fake credentials and do not require an external provider.

The example assumes that `config.py` is importable from the test environment.

The expected result is two passing tests when the files and dependencies are configured correctly. The tests have not been executed as part of writing this README.

---

## ⚠️ 13. Common Setup Problems

| Problem | Likely Cause | Solution |
|---|---|---|
| `python` not found | Python unavailable or PATH issue | Check `python3 --version` |
| `No module named ...` | Package missing | Install it in the active environment |
| Wrong pip location | Interpreter mismatch | Use `python -m pip` |
| Activation fails | Incorrect shell command | Use the command for your operating system |
| Dependency conflict | Incompatible packages | Inspect `pip check` output |
| API key missing | Variable not configured | Check `.env` and configuration loading |
| VS Code uses wrong Python | Incorrect interpreter selection | Select `.venv` |
| Git tracks `.env` | File already tracked | Remove it from tracking and rotate exposed secrets |
| LangGraph import fails | Missing package or wrong environment | Verify interpreter and install dependencies |

### Useful Debugging Commands

```bash
python --version
python -c "import sys; print(sys.executable)"
python -m pip --version
python -m pip list
python -m pip check
git status
```

Run these commands before randomly reinstalling packages or changing Python versions.

---

## 📊 14. Development vs Production Environments

| Area | Development | Production |
|---|---|---|
| Credentials | Development keys | Restricted production keys |
| Data | Synthetic or authorized test data | Approved operational data |
| Debugging | Developer-focused | Must avoid exposing sensitive details |
| Dependencies | Iterative changes | Tested and deliberately resolved |
| Access | Developer permissions | Least-privilege permissions |
| Testing | Rapid local tests | Automated release checks |
| Monitoring | Basic diagnostics | Operational monitoring and alerts |

A properly configured local environment is only the first step toward production readiness.

Reliability, security, evaluation, observability, and deployment are covered in their dedicated modules.

---

## 🎯 15. Practical Exercises

### 🟢 Beginner

1. Check your Python version and executable path.
2. Create and activate `.venv`.
3. Install Pytest.
4. Run `python -m pip check`.
5. Create and execute `check_environment.py`.

**Goal:** Learn to create and verify a Python environment.

### 🟡 Intermediate

6. Create `requirements-base.txt`.
7. Create `.env.example` and a local `.env`.
8. Write a configuration function that validates required variables.
9. Configure `.gitignore`.
10. Write tests for valid and missing configuration.

**Goal:** Manage dependencies, configuration, and basic testing.

### 🔴 Advanced

11. Install LangGraph in your environment.
12. Run the minimal graph example.
13. Recreate the environment from the declared dependencies.
14. Verify that the tests work in the recreated environment.
15. Document the setup instructions for another developer.

**Goal:** Build a reproducible development setup.

---

## 🎓 16. Interview Questions

### Q1. What is a virtual environment?

A virtual environment isolates a project's Python packages from other projects' package installations.

### Q2. Why use `python -m pip`?

It invokes pip through the selected Python interpreter, reducing ambiguity when multiple Python installations exist.

### Q3. What is the purpose of a requirements file?

It declares dependencies that can be installed together. Exact reproducibility depends on how versions are specified and resolved.

### Q4. Why should API keys not be committed to GitHub?

Exposed credentials can enable unauthorized service access and unexpected charges. Rotate a key if it is exposed.

### Q5. What is the difference between `.env` and `.env.example`?

`.env` contains local configuration and may contain secrets. `.env.example` documents the required variables without real credentials.

### Q6. Does `.gitignore` remove previously tracked files?

No. Previously tracked files must be removed from Git tracking separately.

### Q7. What does `pip check` verify?

It checks for broken declared dependencies. It does not verify the complete behavior of an application.

### Q8. Is `pip freeze` a complete lockfile strategy?

Not necessarily. It records installed package versions, but full reproducibility also depends on the Python version, operating system, dependency resolution, and installation process.

### Q9. How can you test an agent framework without calling an LLM?

Use deterministic functions and local inputs to test package imports and basic workflow execution.

### Q10. Does a working development environment mean an application is production-ready?

No. Production readiness additionally requires suitable testing, security, failure handling, monitoring, deployment procedures, and operational validation.

---

## 🧾 17. Revision Cheat Sheet

| Task | Command |
|---|---|
| Check Python | `python3 --version` |
| Create environment | `python3 -m venv .venv` |
| Activate on macOS/Linux | `source .venv/bin/activate` |
| Activate on Windows | `.\.venv\Scripts\Activate.ps1` |
| Deactivate | `deactivate` |
| Upgrade pip | `python -m pip install --upgrade pip` |
| Install dependencies | `python -m pip install -r requirements-base.txt` |
| List packages | `python -m pip list` |
| Check dependencies | `python -m pip check` |
| Run tests | `python -m pytest -q` |
| Check Git status | `git status` |

---

## 📚 18. Official Documentation

- [Python Virtual Environments](https://docs.python.org/3/library/venv.html)
- [Python Packaging User Guide](https://packaging.python.org/en/latest/)
- [pip Documentation](https://pip.pypa.io/en/stable/)
- [Pytest Documentation](https://docs.pytest.org/en/stable/)
- [VS Code Python Documentation](https://code.visualstudio.com/docs/languages/python)
- [Git Documentation](https://git-scm.com/doc)
- [LangGraph Documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [python-dotenv Repository](https://github.com/theskumar/python-dotenv)

Always check the official documentation for current compatibility requirements.

---

## 🎯 Key Takeaways

- Use a dedicated virtual environment for your project.
- Select a Python version compatible with your dependencies.
- Declare dependencies and verify their compatibility.
- Keep API credentials outside source code.
- Never commit real secrets to GitHub.
- Configure VS Code to use the correct interpreter.
- Test configuration without making unnecessary API calls.
- Verify framework installation with a minimal example.
- Remember that environment setup is not the same as production readiness.

---

## ➡️ Next Module

**Module 01 — Agentic AI Fundamentals**

Next, we will examine the engineering foundations of advanced Agentic AI systems and how they differ from basic agents and automation workflows.

---

## ✅ Module Completion Checklist

- [ ] Python version verified.
- [ ] Virtual environment created and activated.
- [ ] Dependencies installed and checked.
- [ ] VS Code configured.
- [ ] API configuration validated without exposing secrets.
- [ ] `.gitignore` configured.
- [ ] Python smoke test completed.
- [ ] LangGraph example understood and tested.
- [ ] Configuration tests completed.
- [ ] Setup instructions documented.

> **💡 Pro Tip:** Install only the dependencies you need, protect your credentials, and verify your environment before building more complex Agentic AI workflows.
