
# 🔌 Module 07 — APIs and External Integrations

Learn how AI agents connect to external applications and services using APIs, authenticate securely, exchange data, and handle real-world integration failures.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 07 — APIs and External Integrations |
| Planned Date | Sep 10, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–06: Setup, Agent Fundamentals, Architecture, Tool Calling, Memory, Planning, and Agent Frameworks |
| Primary Language | Python |
| Tools | Python, HTTPX, REST APIs, JSON, Pydantic, pytest |
| Main Focus | HTTP, REST APIs, authentication, API tools, error handling, and integrations |
| Next Module | 08 — Workflow Automation and Triggers |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain how APIs allow applications to communicate.
- Understand HTTP methods, status codes, headers, and JSON.
- Make API requests from Python.
- Authenticate requests using API keys and bearer tokens.
- Wrap an API integration as an agent tool.
- Validate API responses and handle failures.
- Understand rate limits, timeouts, and retry policies.
- Build an integration that connects an agent to an external service.
- Apply basic security practices to API integrations.

---

## 1. What Is an API?

An **Application Programming Interface (API)** defines how one software system can interact with another.

For example, an AI assistant may need to retrieve weather information. Instead of inventing current conditions, the application can request data from a weather service through its API.

A typical interaction looks like this:

```text
User Request
     |
     v
AI Agent
     |
     v
Registered API Tool
     |
     v
External Service
     |
     v
HTTP Response
     |
     v
Validate and Process Data
     |
     v
Agent Response
```

An API does not automatically make a service available to an AI model. The developer must implement an integration and expose the appropriate operations as tools.

## 2. What Is a REST API?

A REST API commonly exposes resources through HTTP endpoints.

For example:

```text
GET    /products
GET    /products/123
POST   /products
PATCH  /products/123
DELETE /products/123
```

These are illustrative endpoints. Actual URLs and supported methods depend on the service.

### Common HTTP methods

| Method | Typical Purpose | Example |
|---|---|---|
| GET | Retrieve data | Get product details |
| POST | Create a resource or submit an operation | Create an order |
| PUT | Replace a resource | Replace a profile |
| PATCH | Partially update a resource | Update a user's display name |
| DELETE | Delete a resource | Delete a saved record |

An API may use different conventions, so always follow its documentation.

### Common HTTP status codes

| Status | Meaning | Typical Handling |
|---|---|---|
| 200 | OK | Process the response |
| 201 | Created | Record the created resource |
| 204 | No Content | Treat the operation as successful without a response body |
| 400 | Bad Request | Check the submitted input |
| 401 | Unauthorized | Check authentication |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Handle missing resources |
| 409 | Conflict | Resolve a conflicting operation |
| 429 | Too Many Requests | Respect rate limits and retry guidance |
| 500 | Internal Server Error | Handle a server-side failure |
| 503 | Service Unavailable | Consider a bounded retry if appropriate |

An HTTP response can indicate failure even when the server successfully returns a response object. Your code should check the status rather than assuming every response is successful.

---

## 3. Understand an HTTP Request

A typical API request contains:

- **URL:** the destination endpoint.
- **Method:** the operation being requested.
- **Headers:** metadata such as content type and authentication.
- **Query parameters:** filters or options in the URL.
- **Request body:** data sent to the service, often JSON.

Example:

```http
GET /products/123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The server may return:

```json
{
  "id": 123,
  "name": "Wireless Keyboard",
  "price": 49.99
}
```

The example uses a placeholder domain and illustrative data; it is not a live product API.

---

## 4. Make Your First API Request with Python

Use HTTPX, a Python HTTP client.

Install the dependency:

```bash
pip install httpx
```

Create `first_api_request.py`:

```python
import httpx


API_URL = "https://jsonplaceholder.typicode.com/posts/1"


def get_post() -> dict:
    try:
        response = httpx.get(
            API_URL,
            timeout=10.0,
        )
        response.raise_for_status()

        data = response.json()

        if not isinstance(data, dict):
            raise ValueError("Expected a JSON object")

        return data

    except httpx.TimeoutException as error:
        raise RuntimeError("The API request timed out") from error

    except httpx.HTTPStatusError as error:
        raise RuntimeError(
            f"API returned HTTP {error.response.status_code}"
        ) from error

    except httpx.RequestError as error:
        raise RuntimeError("Could not reach the API") from error


if __name__ == "__main__":
    post = get_post()

    print("Title:", post.get("title"))
    print("Body:", post.get("body"))
```

Run it:

```bash
python first_api_request.py
```

This uses the public JSONPlaceholder demonstration API. Network access is required.

### What does the code do?

1. Sends an HTTP GET request.
2. Sets a timeout so the request cannot wait indefinitely.
3. Raises an error for unsuccessful HTTP status codes.
4. Parses the JSON response.
5. Handles common network and HTTP failures.
6. Extracts the fields needed by the application.

For a production integration, also validate the response schema and handle service-specific errors.

---

## 5. Query Parameters, Headers, and Request Bodies

HTTPX supports these features directly.

### Query parameters

```python
import httpx

response = httpx.get(
    "https://jsonplaceholder.typicode.com/posts",
    params={"userId": 1},
    timeout=10.0,
)

response.raise_for_status()
posts = response.json()
```

Query parameters are useful for filtering, pagination, sorting, and searching.

### Headers

```python
headers = {
    "Accept": "application/json",
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
}
```

Only send authentication headers to the intended trusted service. Never expose real tokens in logs or public repositories.

### JSON request body

```python
payload = {
    "title": "Agent Integration",
    "body": "Testing a sample API request",
    "userId": 1,
}

response = httpx.post(
    "https://jsonplaceholder.typicode.com/posts",
    json=payload,
    timeout=10.0,
)

response.raise_for_status()
print(response.json())
```

This demonstration API simulates write operations. Do not assume that a returned sample resource was permanently stored.

---

## 6. Authentication and API Keys

External services may require authentication.

| Authentication Type | Typical Use |
|---|---|
| API key | Identifies an application or project |
| Bearer token | Grants access using a token |
| OAuth 2.0 | Authorizes access to protected resources |
| Basic authentication | Sends a username and password through HTTP authentication; requires HTTPS |

Follow the specific service's authentication instructions. These methods are not interchangeable.

### Use environment variables

Install:

```bash
pip install python-dotenv
```

Create a local `.env` file:

```text
EXTERNAL_API_KEY=your_real_key_here
```

Add this to `.gitignore`:

```gitignore
.env
```

Load the value in Python:

```python
import os

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("EXTERNAL_API_KEY")

if not api_key:
    raise RuntimeError("EXTERNAL_API_KEY is not configured")
```

Never commit real credentials to GitHub. If a key is accidentally exposed, revoke or rotate it.

For production, use the deployment environment's secret manager or equivalent secure configuration mechanism.

---

## 7. Wrap an API as an Agent Tool

An API integration becomes useful to an agent when the application exposes it through a controlled tool interface.

The following example wraps a public API request in a reusable Python function.

Create `api_tool.py`:

```python
import httpx
from pydantic import BaseModel, ConfigDict, Field


class PostLookupArguments(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        strict=True,
    )

    post_id: int = Field(ge=1, le=100)


def fetch_post(post_id: int) -> dict:
    """Fetch a sample post by its numeric ID."""

    response = httpx.get(
        f"https://jsonplaceholder.typicode.com/posts/{post_id}",
        timeout=10.0,
    )
    response.raise_for_status()

    data = response.json()

    if not isinstance(data, dict):
        raise ValueError("Expected a JSON object")

    return {
        "id": data.get("id"),
        "title": data.get("title"),
        "body": data.get("body"),
    }


def execute_post_tool(arguments: dict) -> dict:
    validated = PostLookupArguments.model_validate(arguments)

    try:
        result = fetch_post(validated.post_id)

        return {
            "ok": True,
            "result": result,
        }

    except httpx.TimeoutException:
        return {
            "ok": False,
            "error": "The external API timed out",
        }

    except httpx.HTTPStatusError as error:
        return {
            "ok": False,
            "error": f"External API returned HTTP {error.response.status_code}",
        }

    except httpx.RequestError:
        return {
            "ok": False,
            "error": "The external API could not be reached",
        }


if __name__ == "__main__":
    print(execute_post_tool({"post_id": 1}))
```

Install the dependencies:

```bash
pip install httpx pydantic
```

Run:

```bash
python api_tool.py
```

### How the integration works

1. The agent requests the `fetch_post` operation.
2. The application validates the requested post ID.
3. The API tool sends the HTTP request.
4. The response is checked and transformed into a smaller result.
5. The application returns either a result or a structured error.

This example is an API-backed tool, not a complete LLM agent. To integrate it with an agent, register the function using the tool interface supported by your chosen SDK or framework.

**Security note:** the example uses a fixed trusted API URL. Do not allow an LLM to supply arbitrary request URLs or unrestricted HTTP methods. Restrict destinations and operations to prevent server-side request forgery (SSRF) and unintended access to internal services.

---

## 8. Reliability: Timeouts, Retries, and Rate Limits

Real APIs fail for many reasons: network problems, expired credentials, rate limits, malformed requests, and temporary service outages.

### Timeouts

Always define reasonable connection and read timeouts. A request should not be allowed to block the agent indefinitely.

### Retries

Retries may help with temporary failures, but they should be:

- Bounded.
- Delayed using backoff where appropriate.
- Limited to suitable error types.
- Consistent with the API's rate-limit guidance.

Avoid blindly retrying operations that create records, send emails, or make payments. The original operation may have succeeded even if the response was lost.

### Rate limits

Some services limit the number of requests per second, minute, or account.

When an API returns HTTP 429:

1. Check the documented rate-limit policy.
2. Respect a supplied `Retry-After` value when applicable.
3. Apply bounded retries.
4. Reduce request frequency or use caching where appropriate.
5. Return a clear error if the limit persists.

### Pagination

APIs may return only a subset of records per request. Follow the documented cursor or page-token mechanism rather than assuming the first response contains every result.

---

## 9. API Integration Security Checklist

- Validate request arguments.
- Use HTTPS for sensitive traffic.
- Store secrets outside source code.
- Restrict API permissions to the minimum required.
- Use fixed or allowlisted service destinations.
- Set timeouts and execution limits.
- Avoid logging tokens or sensitive response bodies.
- Validate response schemas before using returned data.
- Apply rate limits and bounded retries.
- Require approval for consequential actions.
- Treat external API content as untrusted data.
- Add tests for successful responses and failures.

---

## 10. Hands-On Exercises

### Beginner

- [ ] Send a GET request to a public demonstration API.
- [ ] Print selected fields from a JSON response.
- [ ] Add query parameters.
- [ ] Handle a missing resource.
- [ ] Add a request timeout.

### Intermediate

- [ ] Load an API key from an environment variable.
- [ ] Create a reusable API client function.
- [ ] Validate input with Pydantic.
- [ ] Convert HTTP failures into structured error results.
- [ ] Write tests using mocked HTTP responses.

### Advanced

- [ ] Register an API integration as a tool for an LLM.
- [ ] Restrict the tool to approved endpoints and methods.
- [ ] Implement bounded retries and rate-limit handling.
- [ ] Handle pagination.
- [ ] Add structured logs without exposing credentials.
- [ ] Test timeout, authentication, and malformed-response scenarios.

---

## 11. Interview Questions and Answers

**Q1. What is an API?**

An API defines how software components communicate and exchange information or request operations.

**Q2. What is a REST API?**

A REST-style API commonly exposes resources through HTTP methods and resource URLs.

**Q3. What is the difference between GET and POST?**

GET typically retrieves information. POST typically submits data or requests creation of a resource or another operation.

**Q4. What does HTTP 401 mean?**

The request lacks valid authentication credentials or the supplied credentials were not accepted.

**Q5. What is the difference between 401 and 403?**

401 concerns authentication. 403 generally means the server refuses the operation, often because the caller lacks permission.

**Q6. Why use timeouts?**

Timeouts limit how long an application waits for a network operation and help prevent stalled workflows.

**Q7. Why are retries dangerous for some requests?**

An operation may have succeeded even when the response was lost. Retrying can create duplicate or unintended actions.

**Q8. How does an API become an agent tool?**

The application wraps the API operation in a controlled function, defines its inputs, validates requests, executes the call, and returns the result.

**Q9. What is pagination?**

Pagination divides a large result set into smaller responses, which the client retrieves through page numbers, cursors, or tokens.

**Q10. How do you protect API credentials?**

Keep credentials in environment variables or a secret manager, limit their permissions, avoid logging them, and rotate exposed keys.

---

## 12. Completion Checklist

- [ ] I understand HTTP requests and responses.
- [ ] I can explain common HTTP methods and status codes.
- [ ] I made a working API request using HTTPX.
- [ ] I can send query parameters, headers, and JSON.
- [ ] I understand API keys and bearer-token authentication.
- [ ] I wrapped an API call in a reusable Python tool.
- [ ] I handled timeouts and HTTP errors.
- [ ] I understand rate limits, retries, and pagination.
- [ ] I completed at least three exercises.

---

## 🔑 Key Takeaways

- APIs allow agents to interact with external services.
- HTTP methods and status codes describe request operations and outcomes.
- JSON is a common format for API data exchange.
- Authentication and authorization must be handled separately and securely.
- API integrations should validate both requests and responses.
- Timeouts, rate limits, and retries require deliberate policies.
- Exposing an API as a tool requires an execution boundary and appropriate permissions.

## 🚀 Next Module — Workflow Automation and Triggers

In Module 08, you will learn how to trigger workflows from schedules, webhooks, and application events, and how to combine Python-based agent tools with visual automation platforms such as n8n.

**Suggested commit message:**

```text
Sep 10, 2026 — Day 8: APIs and integrations — connecting agents to real services
```
