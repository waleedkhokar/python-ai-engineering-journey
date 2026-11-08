
# 🚀 Module 12 — Production AI Agents

Learn how to transform a development-stage AI agent into a reliable, secure, observable, and maintainable production system.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 12 — Production AI Agents |
| Planned Date | Sep 18, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–11 |
| Primary Language | Python |
| Tools | FastAPI, Pydantic, pytest, HTTPX, Docker, Logging, Environment Variables |
| Main Focus | Deployment, API serving, configuration, observability, reliability, and production operations |
| Next Module | 99 — Projects and Capstone |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain the difference between a prototype and a production agent.
- Design a production-ready agent architecture.
- Serve an agent through a REST API using FastAPI.
- Validate requests and responses with Pydantic.
- Manage configuration and secrets safely.
- Implement timeouts, execution limits, and controlled errors.
- Add logging, health checks, and monitoring.
- Understand concurrency, queues, and background jobs.
- Containerize an agent with Docker.
- Deploy an agent using an appropriate hosting platform.
- Monitor latency, cost, task success, and failures.
- Prepare a production-readiness checklist.

---

## 1. From Prototype to Production

A prototype proves that an idea can work. A production system must continue working under realistic conditions.

For example, a local agent might successfully answer five test questions. A production agent must also handle invalid requests, unavailable APIs, concurrent users, unexpected model outputs, authentication, monitoring, and deployment failures.

| Prototype | Production System |
|---|---|
| Runs locally | Runs in a managed environment |
| Uses manual testing | Has automated tests and evaluations |
| May contain hardcoded settings | Uses validated configuration |
| Prints debugging information | Uses structured, controlled logging |
| Assumes tools succeed | Handles failures and timeouts |
| May have unrestricted tool access | Enforces permissions and policies |
| Has no operational monitoring | Tracks health, latency, and errors |
| Uses manual restarts | Has an operational recovery strategy |

**Production readiness is not just deployment.** It includes security, reliability, testing, observability, cost control, and ongoing maintenance.

---

## 2. Production Agent Architecture

A practical production agent separates the public API, orchestration logic, tools, and external dependencies.

```text
                  Client Application
                         |
                         v
                 API Gateway / HTTPS
                         |
                         v
                  FastAPI Application
                         |
             Authentication / Validation
                         |
                         v
                    Agent Service
                         |
               Policy and Tool Registry
                         |
              +----------+----------+
              |          |          |
              v          v          v
           LLM API    Business API  Database
              |          |          |
              +----------+----------+
                         |
                         v
                 Validate Final Result
                         |
                         v
                  Return Response

       Logs / Metrics / Traces / Evaluations
                    Across Components
```

### Responsibilities

- **API layer:** receives requests and returns responses.
- **Authentication:** establishes the identity of the caller.
- **Authorization:** checks which actions and data the caller may access.
- **Agent service:** coordinates model calls, tools, state, and task execution.
- **Tool layer:** exposes controlled operations.
- **External services:** provide models, APIs, databases, and other capabilities.
- **Observability:** records execution outcomes and operational metrics.

Keep business logic separate from HTTP route handlers so it can be tested and reused independently.

---

## 3. Create a Production-Oriented Project Structure

A maintainable starting structure is:

```text
12-Production-AI-Agents/
├── README.md
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   ├── agent_service.py
│   └── tools.py
├── tests/
│   ├── test_api.py
│   └── test_agent_service.py
├── evaluations/
│   └── cases.json
├── Dockerfile
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

The root and module README files serve different purposes. In an actual repository, keep the course module README at the module root and avoid creating duplicate README files unless they document different scopes.

---

## 4. Build an Agent API with FastAPI

FastAPI provides a way to expose Python functionality through HTTP endpoints.

Install the dependencies:

```bash
pip install fastapi "uvicorn[standard]" pydantic
```

Create `app/schemas.py`:

```python
from pydantic import BaseModel, ConfigDict, Field


class AgentRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str = Field(
        min_length=1,
        max_length=2000,
    )


class AgentResponse(BaseModel):
    answer: str
    status: str
```

Create `app/agent_service.py`:

```python
def run_agent(question: str) -> str:
    """
    Demonstration placeholder.

    Replace this function with your actual agent
    orchestration, model calls, and controlled tools.
    """
    return f"Received your question: {question}"
```

Create `app/main.py`:

```python
from fastapi import FastAPI, HTTPException

from app.agent_service import run_agent
from app.schemas import AgentRequest, AgentResponse


app = FastAPI(
    title="Production Agent API",
    version="1.0.0",
)


@app.get("/health")
def health_check() -> dict:
    return {"status": "healthy"}


@app.post("/agent", response_model=AgentResponse)
def execute_agent(
    request: AgentRequest,
) -> AgentResponse:
    try:
        answer = run_agent(request.question)

        return AgentResponse(
            answer=answer,
            status="completed",
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="The request could not be processed",
        ) from error

    except Exception as error:
        # Do not expose internal exception details to clients.
        # Production code should log the exception securely.
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred",
        ) from error
```

Run the application from the project root:

```bash
uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

FastAPI provides an interactive API documentation page during development.

### Test the endpoint

Send a POST request to `/agent`:

```json
{
  "question": "Explain AI agents in simple English"
}
```

The placeholder service returns a response containing the submitted question.

**Important:** this example is an API-serving skeleton, not a complete production agent. It does not include authentication, authorization, rate limiting, a real model integration, or durable task execution. Add these before exposing sensitive operations or deploying it publicly.

---

## 5. Configuration and Secret Management

Production applications need configurable model names, service URLs, timeouts, and credentials.

Create `.env.example`:

```text
APP_ENV=development
MODEL_NAME=replace_with_supported_model
MODEL_API_KEY=
AGENT_TIMEOUT_SECONDS=30
```

Create `.gitignore`:

```gitignore
.env
.venv/
__pycache__/
.pytest_cache/
*.py[cod]
```

### Configuration principles

- Keep real secrets outside source code.
- Use `.env.example` to document required variables without real credentials.
- Validate required configuration when the application starts.
- Use a secret manager or protected environment configuration in production.
- Rotate exposed credentials.
- Separate development, testing, and production environments.

Environment variables are a configuration mechanism, not a complete security boundary. Restrict who can view and modify the deployment configuration.

---

## 6. Reliability: Timeouts, Retries, and Execution Limits

Agent execution may involve multiple model calls, API requests, database operations, and tool executions. Every external dependency can fail.

### Common failure scenarios

| Failure | Recommended Response |
|---|---|
| Model provider unavailable | Return a controlled error or apply a bounded retry |
| API timeout | Stop waiting and report the failure |
| Invalid tool arguments | Reject the call and record a safe diagnostic |
| Rate limit | Respect provider guidance and apply backoff |
| Database unavailable | Fail safely and alert the appropriate operator |
| Agent loops repeatedly | Enforce an iteration or tool-call limit |
| Output fails validation | Reject or safely repair the result within defined limits |

### Set explicit limits

Production agents should have limits for:

- Total execution time.
- Number of model calls.
- Number of tool calls.
- Maximum input and output sizes.
- Retry attempts.
- Parallel operations.
- Estimated or actual cost where measurable.

Retries should be limited to appropriate transient failures. Avoid blindly repeating non-idempotent operations such as sending emails or creating financial transactions.

### Prevent runaway agents

A useful execution policy might specify:

```python
MAX_AGENT_STEPS = 10
MAX_TOOL_CALLS = 12
MAX_RETRIES = 2
```

These values are illustrative starting points, not universal production defaults.

The orchestrator must enforce the limits. Merely declaring constants does not constrain execution.

---

## 7. Logging, Metrics, and Tracing

Observability helps operators understand what an agent did, where it failed, and how it performed.

### Logging

Logs record important events, such as:

- Request accepted.
- Agent execution started.
- Tool call completed.
- External dependency failed.
- Execution finished.

Example:

```python
import logging


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

logger = logging.getLogger(__name__)


def record_execution(
    execution_id: str,
    status: str,
) -> None:
    logger.info(
        "execution_id=%s status=%s",
        execution_id,
        status,
    )
```

Use structured logs in production where possible. Avoid recording raw prompts, complete model responses, access tokens, or personal data unless there is a justified, protected logging policy.

### Metrics

Track operational measures such as:

| Metric | Why It Matters |
|---|---|
| Request count | Shows application usage |
| Success rate | Measures task completion |
| Error rate | Reveals failures |
| Median and p95 latency | Shows response-time behavior |
| Tool failure rate | Identifies unreliable integrations |
| Model usage | Helps estimate cost |
| Token usage | Helps control model consumption |
| Approval rate | Helps understand human-review requirements |

### Tracing

A trace connects related operations within one request.

For example:

```text
Execution ID
    |
    +-- Model call
    |
    +-- Search tool
    |
    +-- Database query
    |
    +-- Final model call
    |
    +-- Final response
```

Tracing is particularly useful when a single agent execution spans several external services.

---

## 8. Health Checks and Monitoring

A health endpoint helps an orchestrator or monitoring service determine whether the application can respond.

The example `/health` endpoint confirms that the API process is responding. It does not prove that the model provider, database, or other dependencies are healthy.

Production systems may separate:

- **Liveness:** whether the process is running.
- **Readiness:** whether the service is ready to accept work.
- **Dependency health:** whether required external services are reachable.

Avoid making health checks perform expensive model calls on every request. Monitor external dependencies using suitable, bounded checks.

Configure alerts for important conditions, such as sustained errors, unusually high latency, unavailable dependencies, or cost thresholds being exceeded.

---

## 9. Concurrency and Background Jobs

Some agent tasks finish quickly. Others may take minutes because they involve research, file processing, or many external calls.

For long-running work, consider an asynchronous job architecture.

```text
Client Request
      |
      v
Create Job
      |
      v
Return Job ID
      |
      v
Background Worker
      |
      v
Execute Agent
      |
      v
Persist Status and Result
      |
      v
Client Retrieves Result
```

A client might receive:

```json
{
  "job_id": "job_123",
  "status": "queued"
}
```

The client can then query a job-status endpoint.

### When to use a queue

A task queue may be appropriate when:

- Tasks are long-running.
- Work must survive application restarts.
- Jobs need retries.
- Several workers process tasks.
- Workload needs controlled concurrency.

Use a suitable queue and durable storage when required. An in-memory Python background task is not equivalent to a durable distributed job system.

Also consider duplicate job delivery, idempotency, cancellation, job expiry, and worker shutdown behavior.

---

## 10. Containerize the Application with Docker

Docker packages an application and its runtime dependencies into an image.

Create `requirements.txt`:

```text
fastapi
uvicorn[standard]
pydantic
```

For reproducible production builds, pin and regularly update dependencies using a tested dependency-management process.

Create a `Dockerfile`:

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build the image:

```bash
docker build -t production-agent .
```

Run it locally:

```bash
docker run --rm -p 8000:8000 production-agent
```

Open `http://127.0.0.1:8000/health`.

### Docker security considerations

- Do not copy `.env` files or credentials into the image.
- Use protected runtime configuration for secrets.
- Run as a non-root user where practical.
- Keep the base image and dependencies updated.
- Scan images and dependencies for known vulnerabilities.
- Use resource limits in the deployment environment.
- Review filesystem permissions and network access.

This image demonstrates the basic packaging workflow. Production deployment should also configure authentication, resource limits, dependency pinning, and appropriate network restrictions.

---

## 11. Testing a Production Agent API

Install test dependencies:

```bash
pip install pytest httpx
```

Create `tests/test_api.py`:

```python
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_agent_endpoint():
    response = client.post(
        "/agent",
        json={
            "question": "What is an AI agent?",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "completed"
    assert "AI agent" in data["answer"]


def test_empty_question_is_rejected():
    response = client.post(
        "/agent",
        json={"question": ""},
    )

    assert response.status_code == 422
```

Run:

```bash
pytest -v
```

These tests exercise the placeholder service included earlier.

When replacing it with a real LLM integration, mock external dependencies in unit tests and maintain separate integration tests and agent evaluations. Do not rely only on a successful health check.

### Essential production tests

- Valid requests.
- Invalid request bodies.
- Unauthorized and forbidden requests.
- Tool failures and timeouts.
- Malformed model outputs.
- Rate-limit handling.
- Concurrent execution.
- Budget and iteration limits.
- Sensitive-action approval.
- Regression cases from previous incidents.

---

## 12. Deployment and CI/CD

A typical deployment process looks like this:

```text
Developer Pushes Code
        |
        v
Automated Tests
        |
        v
Security and Dependency Checks
        |
        v
Build Container Image
        |
        v
Deploy to Staging
        |
        v
Smoke Tests and Evaluation
        |
        v
Production Approval
        |
        v
Deploy and Monitor
```

### Recommended practices

- Run tests automatically on pull requests.
- Keep secrets in protected deployment settings.
- Deploy to staging before production.
- Run smoke tests after deployment.
- Use versioned container images.
- Track model and prompt changes.
- Roll back a deployment if important health or quality checks fail.
- Evaluate behavior after model, tool, or prompt updates.

The exact workflow depends on your hosting platform and CI/CD system.

---

## 13. Production Cost and Performance

Agent costs can increase quickly when a workflow repeatedly calls a model or executes many tools.

Track:

- Model calls per task.
- Input and output token usage.
- External API charges.
- Average and high-percentile latency.
- Retry frequency.
- Cache hit rate where caching is appropriate.
- Human intervention frequency.

### Practical optimization strategies

1. Use smaller or cheaper models for suitable tasks.
2. Limit unnecessary model calls.
3. Use deterministic code for predictable decisions.
4. Cache safe, reusable results.
5. Bound tool execution and retries.
6. Set request and concurrency limits.
7. Use asynchronous processing for appropriate long-running tasks.
8. Measure before optimizing.

Caching must respect user permissions, data freshness, and privacy boundaries. Do not share cached results across users or tenants when access rules prohibit it.

---

## 14. Project — Production-Ready Research Agent

Extend the Website Research Assistant from Module 09 into a deployable service.

### Functional requirements

1. Accept a research question through an API.
2. Validate the request.
3. Restrict browser access to approved destinations.
4. Retrieve relevant public information.
5. Summarize results using an LLM if configured.
6. Validate the final response.
7. Return a structured result.
8. Report controlled errors.

### Operational requirements

- Health and readiness checks.
- Authentication and authorization appropriate to the deployment.
- Execution and tool-call limits.
- Timeouts and bounded retries.
- Structured logs and execution identifiers.
- Unit tests, integration tests, and evaluation cases.
- Docker packaging.
- Protected secrets.
- A documented deployment and rollback process.

### Suggested project structure

```text
12-Production-AI-Agents/
├── README.md
├── app/
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   ├── agent_service.py
│   └── tools.py
├── tests/
│   ├── test_api.py
│   └── test_agent_service.py
├── evaluations/
│   └── cases.json
├── Dockerfile
├── requirements.txt
├── .env.example
└── .gitignore
```

### Definition of done

- The application starts successfully.
- The API validates input.
- Unauthorized operations are rejected.
- The agent uses only permitted tools.
- Failures are handled without leaking internal details.
- Automated tests pass.
- Evaluation results are recorded.
- Logs and health checks support troubleshooting.
- Secrets are not committed to the repository.
- Deployment and rollback steps are documented.

---

## 15. Interview Questions and Answers

**Q1. What makes an AI agent production-ready?**

It has appropriate security, reliability, evaluation, monitoring, cost controls, deployment procedures, and failure recovery.

**Q2. Why use FastAPI?**

FastAPI provides Python-based HTTP endpoints, request validation, response schemas, and generated API documentation.

**Q3. What is the difference between liveness and readiness?**

Liveness indicates whether the process is running. Readiness indicates whether it is prepared to accept work.

**Q4. Why should long-running agent tasks use a queue?**

A queue can support durable jobs, controlled concurrency, retries, and independent worker execution.

**Q5. Why are timeouts important?**

They prevent network operations or agent executions from waiting indefinitely and consuming unbounded resources.

**Q6. What is observability?**

Observability is the ability to understand system behavior using logs, metrics, traces, and other diagnostic information.

**Q7. Why containerize an agent?**

Containers package an application and its dependencies in a consistent runtime environment.

**Q8. How do you control agent costs?**

Measure usage, limit execution, avoid unnecessary calls, select suitable models, and monitor external service charges.

**Q9. Why is a health endpoint insufficient for production monitoring?**

It may confirm that the API responds without verifying its dependencies or the quality and success of agent tasks.

**Q10. What should happen when a production agent fails?**

The system should stop safely, return an appropriate error or job status, record useful diagnostics, and support recovery without duplicating side effects.

---

## 16. Production Readiness Checklist

### Architecture and configuration

- [ ] Agent logic is separated from API routes.
- [ ] Configuration is validated.
- [ ] Secrets are protected.
- [ ] External dependencies have explicit timeouts.

### Security

- [ ] Authentication and authorization are implemented where required.
- [ ] Tools follow least-privilege rules.
- [ ] Sensitive actions require appropriate approval.
- [ ] Input and output data are validated.
- [ ] Logs do not expose secrets.

### Reliability and testing

- [ ] Unit and integration tests pass.
- [ ] Agent evaluation cases are maintained.
- [ ] Tool calls and total execution are bounded.
- [ ] Retries are limited and safe.
- [ ] Duplicate side effects are controlled.

### Operations

- [ ] Health checks are available.
- [ ] Logs and metrics support troubleshooting.
- [ ] Cost and latency are monitored.
- [ ] Deployment and rollback procedures are documented.
- [ ] Dependency and security updates are planned.

---

## 🔑 Key Takeaways

- Production AI agents require more than a working model call.
- Separate API handling, orchestration, tools, and business logic.
- Validate requests and enforce authorization outside the model.
- Use timeouts, execution limits, and bounded retries.
- Monitor quality, latency, failures, and cost.
- Use durable background jobs for workloads that need them.
- Containerization improves deployment consistency but does not automatically make an application secure.
- Test and evaluate agent behavior continuously.
- Plan for failure recovery and safe rollback.

## 🚀 Next Module — Projects and Capstone

Module 99 brings together the concepts from the course through practical projects, from a first tool-using agent to an end-to-end production capstone.

**Suggested commit message:**

```text
Sep 18, 2026 — Day 13: Production AI agents — deploying real agent systems
```

---

## 📚 Further Learning

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [pytest Documentation](https://docs.pytest.org/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
