
# 🛠️ Module 03 — Tool Calling and Function Calling

Learn how AI models request external tools, how applications validate and execute those requests, and how tool results are returned to the model.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 03 — Tool Calling and Function Calling |
| Planned Date | Sep 4, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Module 00 — Setup and Environment; Module 01 — What Are AI Agents?; Module 02 — Agent Architecture |
| Primary Language | Python |
| Tools | Python, LLM APIs, JSON, Pydantic, pytest |
| Main Focus | Tool schemas, function calling, argument validation, execution, and tool-result handling |
| Next Module | 04 — Agent Memory and State |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain tool calling and function calling.
- Understand how an LLM requests a tool call.
- Define tools with names, descriptions, and parameter schemas.
- Validate arguments before executing a tool.
- Execute a requested function safely.
- Return tool results to an LLM-powered application.
- Handle invalid arguments and tool errors.
- Build a basic tool-calling workflow in Python.
- Understand parallel tool calls, permissions, and execution limits.

---

## 1. What Is Tool Calling?

**Tool calling** is a capability that allows an AI model to request that an application execute a particular tool.

A tool might be a Python function, an API integration, a database query, or another operation that the application makes available.

For example, a user asks:

> What is 250 multiplied by 12?

The model may determine that a calculator tool is appropriate and request a call with these arguments:

```json
{
  "name": "multiply",
  "arguments": {
    "a": 250,
    "b": 12
  }
}
```

The application then:

1. Receives the tool-call request.
2. Identifies the requested tool.
3. Validates its arguments.
4. Executes the function.
5. Collects the result.
6. Supplies the result back to the model if another model response is needed.

The application, not the model itself, executes the Python function.

## 2. Tool Calling vs. Function Calling

The terms are often used interchangeably. In many LLM APIs, *function calling* is the terminology used for a particular form of tool calling.

| Term | Meaning |
|---|---|
| Tool | An operation available to the model through the application |
| Function | A callable unit of code, often implemented in Python |
| Tool calling | The broader process of requesting and executing tools |
| Function calling | A common API feature for requesting function execution |
| Tool schema | A description of the tool's name, purpose, and accepted arguments |
| Tool executor | Application code responsible for validation and execution |
| Tool result | The output produced by executing the tool |

A tool does not have to be a Python function. It could be an HTTP API, a database operation, or a service accessed through a wrapper function.

---

## 3. How Tool Calling Works

```text
User Request
     |
     v
Application Sends Request to LLM
     |
     v
LLM Selects a Tool (or Answers Directly)
     |
     v
Application Receives Tool Call
     |
     v
Validate Tool Name and Arguments
     |
     v
Execute Approved Tool
     |
     v
Collect Tool Result
     |
     v
Return Result to LLM (if needed)
     |
     v
Final Response
```

The model may request one tool, several tool calls, or no tool at all.

A tool call is a request, not proof that the operation succeeded. The application must execute the tool and inspect its result.

## 4. Anatomy of a Tool Definition

A tool definition commonly contains:

| Field | Purpose |
|---|---|
| Name | Identifies the tool |
| Description | Explains what the tool does and when it should be used |
| Parameters | Defines the expected inputs |
| Parameter types | Specify strings, numbers, booleans, arrays, or objects |
| Required fields | Identify inputs that must be supplied |
| Constraints | Limit acceptable values where supported |

Example schema:

```json
{
  "type": "function",
  "name": "multiply",
  "description": "Multiply two numbers.",
  "parameters": {
    "type": "object",
    "properties": {
      "a": {
        "type": "number",
        "description": "First number"
      },
      "b": {
        "type": "number",
        "description": "Second number"
      }
    },
    "required": ["a", "b"],
    "additionalProperties": false
  },
  "strict": true
}
```

This is an illustrative function-tool schema. Exact fields and supported schema features depend on the API provider and endpoint.

### Why descriptions matter

A vague description such as `Does calculations` gives the model little guidance.

A better description is:

`Multiply two numbers and return the numeric result. Use this tool when the user requests multiplication.`

Clear descriptions help the model choose the appropriate tool and supply relevant arguments.

---

## 5. Build a Tool Executor in Python

Before connecting an LLM, understand the most important part: receiving a tool request and safely executing the corresponding function.

Create `tool_executor.py`:

```python
import json
from typing import Any

from pydantic import BaseModel, ConfigDict, ValidationError


class MultiplyArguments(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        strict=True,
    )

    a: float
    b: float


def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


# Only explicitly registered tools can be executed.
TOOLS = {
    "multiply": {
        "arguments_model": MultiplyArguments,
        "function": multiply,
    }
}


def execute_tool(
    tool_name: str,
    raw_arguments: str,
) -> dict[str, Any]:
    """Validate and execute an approved tool request."""

    tool = TOOLS.get(tool_name)

    if tool is None:
        return {
            "ok": False,
            "error": "Unknown tool",
        }

    try:
        arguments = json.loads(raw_arguments)

        validated = tool["arguments_model"].model_validate(
            arguments
        )

        result = tool["function"](**validated.model_dump())

        return {
            "ok": True,
            "tool": tool_name,
            "result": result,
        }

    except json.JSONDecodeError:
        return {
            "ok": False,
            "error": "Arguments must contain valid JSON",
        }

    except ValidationError:
        return {
            "ok": False,
            "error": "Invalid tool arguments",
        }


if __name__ == "__main__":
    response = execute_tool(
        "multiply",
        '{"a": 250, "b": 12}',
    )

    print(response)
```

Install the dependencies:

```bash
pip install pydantic
```

Run the script:

```bash
python tool_executor.py
```

Expected output:

```text
{'ok': True, 'tool': 'multiply', 'result': 3000.0}
```

### What makes this implementation safer?

- The tool name must exist in the registry.
- Arguments must be valid JSON.
- Pydantic checks the input structure and types.
- Extra fields are rejected.
- The application calls only explicitly registered functions.
- Errors are returned in a predictable structure.

**Important:** validation does not replace authorization. A real tool that reads private records, sends emails, modifies databases, or spends money also needs permission checks and, where appropriate, human approval.

---

## 6. Connect Tool Calling to an LLM

The previous example executes a tool request directly. A real LLM-powered application adds a model interaction before and after execution.

The following example uses the OpenAI Python SDK and the Responses API. It exposes a calculator tool to the model, executes requested calls, and returns the result to the model.

Install dependencies:

```bash
pip install openai
```

Set the environment variables in your local environment or `.env` file:

```text
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=your_supported_model
```

Do not commit `.env` or real API keys to GitHub. Add `.env` to `.gitignore`. Choose a model that supports tool calling in the API endpoint you use.

Create `llm_tool_calling.py`:

```python
import json
import os

from openai import OpenAI
from pydantic import BaseModel, ConfigDict


class MultiplyArguments(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        strict=True,
    )

    a: float
    b: float


def multiply(a: float, b: float) -> float:
    return a * b


TOOLS = {
    "multiply": {
        "arguments_model": MultiplyArguments,
        "function": multiply,
    }
}

client = OpenAI()
MODEL = os.environ["OPENAI_MODEL"]

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "name": "multiply",
        "description": "Multiply two numbers.",
        "parameters": {
            "type": "object",
            "properties": {
                "a": {"type": "number"},
                "b": {"type": "number"},
            },
            "required": ["a", "b"],
            "additionalProperties": False,
        },
        "strict": True,
    }
]


def execute_tool(name: str, raw_arguments: str) -> dict:
    tool = TOOLS.get(name)

    if tool is None:
        return {"ok": False, "error": "Unknown tool"}

    try:
        parsed = json.loads(raw_arguments)
        validated = tool["arguments_model"].model_validate(
            parsed
        )
        result = tool["function"](**validated.model_dump())

        return {"ok": True, "result": result}

    except (json.JSONDecodeError, ValueError, TypeError):
        return {"ok": False, "error": "Invalid tool arguments"}

    except Exception:
        # Log technical details securely in production.
        return {"ok": False, "error": "Tool execution failed"}


def ask_agent(question: str) -> str:
    response = client.responses.create(
        model=MODEL,
        input=question,
        tools=TOOL_DEFINITIONS,
    )

    # Limit tool-execution rounds.
    for _ in range(5):
        calls = [
            item
            for item in response.output
            if item.type == "function_call"
        ]

        if not calls:
            return response.output_text

        outputs = []

        for call in calls:
            result = execute_tool(
                call.name,
                call.arguments,
            )

            outputs.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result),
            })

        response = client.responses.create(
            model=MODEL,
            previous_response_id=response.id,
            input=outputs,
            tools=TOOL_DEFINITIONS,
        )

    raise RuntimeError("Tool-call limit reached")


if __name__ == "__main__":
    print(ask_agent("What is 250 multiplied by 12?"))
```

Run:

```bash
python llm_tool_calling.py
```

The model should be able to request the multiplication tool and use the returned result to formulate an answer.

This example illustrates the core workflow. SDKs, API schemas, and model capabilities can change, so check the current documentation for your chosen provider before relying on exact fields or behavior.

**Production note:** add request timeouts, structured logging, cost limits, retry policies for transient failures, authorization, and tests. Do not expose raw internal errors or secrets to the model or end user.

---

## 7. Sequential and Parallel Tool Calls

### Sequential calls

One tool's result is needed before the next tool can run.

Example:

1. Search for a product.
2. Read its current price.
3. Calculate the total with tax.

### Parallel calls

Multiple independent operations can run at the same time.

Example:

- Fetch weather for Islamabad.
- Fetch weather for Lahore.
- Fetch weather for Karachi.

The application must determine which calls are independent and whether parallel execution is supported and safe. Never assume every tool call returned by a model can run concurrently.

## 8. Error Handling and Reliability

| Problem | Recommended handling |
|---|---|
| Unknown tool name | Reject the request |
| Invalid JSON | Return a structured validation error |
| Missing parameter | Reject the request and report the required input |
| Wrong data type | Validate before execution |
| API timeout | Apply a timeout and retry only when appropriate |
| Permission denied | Stop execution and preserve access controls |
| Tool returns no data | Return a clear empty-result response |
| Repeated tool calls | Apply step and cost limits |
| Duplicate external action | Use idempotency controls where supported |

Be careful when retrying operations such as payments, email sending, or record creation. A timeout does not always mean the external operation failed; retrying blindly could perform it twice.

## 9. Security Rules for Tool Calling

1. **Use an allowlist:** execute only registered tools.
2. **Validate every argument:** model-generated JSON is untrusted input.
3. **Enforce authorization:** verify what the current user is allowed to do.
4. **Use least privilege:** give each tool only the access it needs.
5. **Require approval for risky actions:** especially irreversible or external actions.
6. **Limit execution:** set timeouts, tool-call limits, and budget limits.
7. **Protect secrets:** never put API keys in prompts or repository files.
8. **Treat tool output as untrusted:** external content can contain misleading instructions.
9. **Log safely:** record useful execution metadata without leaking sensitive information.
10. **Test failure paths:** invalid inputs and denied operations are part of the design.

---

## 10. Hands-On Exercises

### Beginner

- [ ] Build a `subtract` function and register it.
- [ ] Build a `divide` function that rejects division by zero.
- [ ] Reject requests that contain an unknown tool name.
- [ ] Test missing parameters and invalid JSON.

### Intermediate

- [ ] Define argument schemas using Pydantic.
- [ ] Add unit tests for successful and failed tool calls.
- [ ] Create a tool that retrieves data from a public API.
- [ ] Return structured error results rather than unhandled exceptions.
- [ ] Add a maximum tool-execution count.

### Advanced

- [ ] Connect a model to at least two registered tools.
- [ ] Implement the complete model → tool → result → model cycle.
- [ ] Add permission checks to a mock database tool.
- [ ] Measure tool latency and execution success rate.
- [ ] Implement human approval before a simulated email is sent.
- [ ] Test duplicate requests and retry behavior.

---

## 11. Interview Questions and Answers

**Q1. What is tool calling in an LLM application?**

It allows a model to request an operation exposed by the application. The application validates and executes the operation and can return the result to the model.

**Q2. Does the LLM execute Python functions directly?**

Not normally. It generates a structured tool-call request. The application runs the corresponding function.

**Q3. Why do tools need schemas?**

Schemas describe accepted arguments and help the model construct structured requests. The application must still validate inputs.

**Q4. What is the difference between a tool schema and a tool executor?**

The schema describes the tool and its inputs. The executor performs validation, authorization, and execution.

**Q5. Why is a tool allowlist important?**

It restricts execution to explicitly approved operations instead of allowing arbitrary model-generated function names or code.

**Q6. Can an LLM call multiple tools?**

Yes, if the API and application support it. Calls can be sequential or parallel, depending on their dependencies and safety requirements.

**Q7. What happens after a tool call?**

The application executes the tool and returns its result. The model may then use that result to answer the user or request another tool.

**Q8. How should a tool-calling system handle errors?**

Validate inputs, catch expected failures, return structured errors, log safely, and apply retries only when appropriate.

**Q9. Is function calling the same as an agent?**

No. Function calling is a capability. An agent may use function calling as one part of a larger decision-and-execution loop.

**Q10. What makes tool calling production-ready?**

Validation, authorization, least privilege, error handling, timeouts, execution limits, monitoring, tests, and human approval for high-impact actions.

---

## 12. Completion Checklist

- [ ] I understand tool calling and function calling.
- [ ] I can define a tool schema.
- [ ] I can validate arguments using Pydantic.
- [ ] I can register and execute approved tools.
- [ ] I understand the model → tool → result → model cycle.
- [ ] I can handle malformed inputs and tool errors.
- [ ] I understand sequential and parallel tool calls.
- [ ] I know why permissions and execution limits matter.
- [ ] I completed at least one LLM-backed tool-calling exercise.

---

## 🔑 Key Takeaways

- Tool calling connects an LLM to operations provided by an application.
- A model requests a tool; the application executes it.
- Schemas describe the expected arguments but do not replace validation.
- Tool registries and allowlists limit which operations can run.
- Tool results can be returned to the model for further reasoning.
- Error handling, authorization, and execution limits are essential.
- Function calling is a capability, not a complete agent architecture.

## 🚀 Next Module — Agent Memory and State

In Module 04, you will learn how agents maintain task context, manage short-term and long-term memory, preserve useful information across interactions, and work with stateful conversations.

**Suggested commit message:**

```text
Sep 4, 2026 — Day 4: Tool calling — schemas, validation, and execution
```
