
# 🏗️ Module 02 — Agent Architecture

Understand how the internal components of an AI agent work together to complete tasks, use tools, maintain state, and decide what to do next.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 02 — Agent Architecture |
| Planned Date | Sep 3, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Module 00 — Setup and Environment; Module 01 — What Are AI Agents? |
| Primary Language | Python |
| Tools | Python, VS Code, LLM APIs, Pydantic, Git |
| Main Focus | Agent components, control loops, tools, state, memory, and execution |
| Next Module | 03 — Tool Calling and Function Calling |

---

## 🎯 Learning Objectives

By the end of this module, you will be able to:

- Explain the architecture of an AI agent.
- Understand the role of an LLM, instructions, tools, and context.
- Distinguish state from memory.
- Explain the agent control loop.
- Build a simple agent-like system in Python.
- Handle tool results and execution errors.
- Understand termination conditions and safety controls.
- Explain agent architecture in technical interviews.

---

## 1. What Is Agent Architecture?

**Agent architecture** is the structure that defines how an AI agent receives a goal, gathers information, makes decisions, executes actions, and determines whether a task is complete.

An LLM-powered agent commonly combines a language model with instructions, tools, state, and control logic.

For example, consider an agent that answers this question:

> What is the weather in Islamabad, and should I carry an umbrella?

A possible execution process is:

1. Receive the user's request.
2. Understand the goal and available instructions.
3. Identify that current weather information is required.
4. Select and call a weather tool.
5. Observe the tool's result.
6. Decide whether additional information is needed.
7. Generate a response using the available evidence.
8. Stop execution.

The language model does not automatically have access to live weather data. The system must provide an appropriate tool or another reliable source.

## 2. Main Components of an AI Agent

| Component | Responsibility |
|---|---|
| Goal | Defines what the agent must accomplish |
| Instructions | Establish the agent's behavior, boundaries, and priorities |
| LLM or decision engine | Interprets information and helps choose the next action |
| Context | Supplies relevant instructions, messages, and task information |
| Tool registry | Defines which tools are available |
| Tool schemas | Describe tool names, parameters, and expected inputs |
| Tool executor | Validates and runs the selected tool |
| Observation | Contains the result of an action or tool execution |
| State | Tracks information about the current task and its progress |
| Memory | Retains selected information for later use |
| Control loop | Coordinates decisions, actions, and observations |
| Guardrails | Enforce safety rules, permissions, and execution limits |
| Logging and evaluation | Help developers debug and measure agent performance |

Not every agent needs every component. A small agent may have one tool and no persistent memory, while a production system may need databases, authentication, monitoring, and human approval.

## 3. Understand the Architecture

```text
                 User Goal
                     |
                     v
              Instructions
                     |
                     v
             Context + State
                     |
                     v
            LLM / Decision Engine
                     |
                     v
               Next Action
                     |
          +----------+----------+
          |                     |
          v                     v
      Call a Tool          Final Answer
          |
          v
   Validate Permissions
          |
          v
     Tool Executor
          |
          v
      Observation
          |
          v
   Update State / Context
          |
          +------> Decision Engine
                   (continue or stop)
```

The diagram represents a common architecture, not a mandatory design. Some systems use separate planning, execution, and evaluation components; others rely on a simpler loop.

## 4. How the Components Work Together

### 4.1 Goal and Instructions

The goal describes the desired outcome.

Example:

```python
goal = "Find the total price of three products."
```

Instructions define how the agent should behave.

```python
instructions = """
Calculate totals accurately.
Use available tools when necessary.
Do not invent prices.
Explain the final calculation.
"""
```

The goal tells the agent what to achieve. Instructions establish how it should attempt the task and which constraints it must follow.

### 4.2 The Language Model

An LLM can interpret natural language, summarize observations, and propose actions.

However, an LLM alone does not guarantee:

- Access to current information.
- Correct mathematical calculations.
- Permission to access private data.
- Successful execution of external actions.
- Reliable completion of every task.

Those capabilities depend on the tools, application logic, data, and controls surrounding the model.

### 4.3 Tools and Tool Execution

A tool allows an agent to interact with something outside its own language-generation process.

Examples include:

- A calculator for arithmetic.
- A search API for web research.
- A database query for retrieving records.
- An email service for sending messages.
- A Python function for a specific business operation.

A model may propose a tool call, but the application should validate the arguments and execute the operation. The next module explores tool calling and function calling in depth.

### 4.4 Observations

An observation is the information returned after an action.

For example:

```python
observation = {
    "tool": "calculate_total",
    "status": "success",
    "result": 1500
}
```

The agent can use this observation to decide what to do next or to construct its final answer.

### 4.5 State vs. Memory

These concepts are related but not interchangeable.

| Feature | State | Memory |
|---|---|---|
| Main purpose | Track the current task | Retain useful information |
| Typical lifetime | One task or workflow | Across steps, sessions, or tasks |
| Example | Current step and tool result | A saved user preference |
| Storage | Variables, objects, checkpoints | Files, databases, vector stores |
| Key question | Where are we in this task? | What information should we remember? |

A system can store memory in its state, but state does not automatically imply long-term memory.

### 4.6 Control Loop

The control loop determines how an agent progresses through its task.

A typical loop is:

1. Inspect the current state.
2. Ask the decision engine to choose an action.
3. Validate the proposed action.
4. Execute the action if allowed.
5. Record the observation.
6. Continue or stop.

The loop must have a termination condition. Without one, an agent may repeat actions indefinitely or consume unnecessary API calls.

---

## 5. Build a Simple Agent Architecture in Python

This example uses a deterministic decision function and a registered tool. It demonstrates the structure of an agent loop without requiring an API key.

It is an educational, rule-based simulation rather than a fully autonomous LLM agent.

Create `agent_architecture.py`:

```python
from dataclasses import dataclass, field
from typing import Any


@dataclass
class AgentState:
    goal: str
    messages: list[str] = field(default_factory=list)
    observations: list[dict[str, Any]] = field(
        default_factory=list
    )
    completed: bool = False


def calculate_total(
    prices: list[float],
) -> float:
    """Calculate the total price of products."""
    if not prices:
        raise ValueError("At least one price is required.")

    if any(price < 0 for price in prices):
        raise ValueError("Prices cannot be negative.")

    return sum(prices)


TOOLS = {
    "calculate_total": calculate_total,
}


def choose_action(state: AgentState) -> dict[str, Any]:
    """Select the next action using simple rules."""
    if not state.observations:
        return {
            "type": "tool",
            "name": "calculate_total",
            "arguments": {"prices": [500, 400, 600]},
        }

    return {"type": "finish"}


def run_agent(max_steps: int = 5) -> AgentState:
    state = AgentState(
        goal="Calculate the total price of three products."
    )

    for _ in range(max_steps):
        action = choose_action(state)

        if action["type"] == "finish":
            state.completed = True
            break

        tool_name = action["name"]
        tool = TOOLS.get(tool_name)

        if tool is None:
            state.observations.append({
                "status": "error",
                "message": f"Unknown tool: {tool_name}",
            })
            break

        try:
            result = tool(**action["arguments"])

            observation = {
                "tool": tool_name,
                "status": "success",
                "result": result,
            }

        except (TypeError, ValueError) as error:
            observation = {
                "tool": tool_name,
                "status": "error",
                "message": str(error),
            }
            state.observations.append(observation)
            break

        state.observations.append(observation)
        state.messages.append(
            f"{tool_name} returned {result}"
        )

    return state


if __name__ == "__main__":
    result = run_agent()

    print("Goal:", result.goal)
    print("Observations:", result.observations)
    print("Completed:", result.completed)
```

Run it:

```bash
python agent_architecture.py
```

Expected result includes:

```text
Goal: Calculate the total price of three products.
Observations: [{'tool': 'calculate_total', 'status': 'success', 'result': 1500}]
Completed: True
```

### What did you build?

- `AgentState` stores information about the current task.
- `TOOLS` acts as a simple tool registry.
- `choose_action()` selects the next action.
- `calculate_total()` performs a real operation.
- `run_agent()` coordinates execution and observations.
- `max_steps` limits the number of loop iterations.

**Important limitation:** the decision function uses predefined rules, not an LLM. A real LLM-powered agent would use a model to propose the next action, then rely on application code to validate and execute it.

The example is intentionally small. Production implementations also need stronger input validation, permissions, logging, timeouts, retries where appropriate, and tests.

---

## 6. Agent Architecture vs. a Single LLM Call

| Feature | Single LLM Call | Tool-Using Agent |
|---|---|---|
| Input | Prompt and context | Goal, context, and state |
| Decision-making | Usually one generation | May choose actions across multiple steps |
| External tools | Not inherently available | Can invoke registered tools |
| Observations | Usually no external execution result | Can incorporate tool results |
| Control logic | Simple request-response | Loop with continuation and termination |
| Complexity | Lower | Higher |
| Best suited for | Summaries, rewriting, explanations | Research, integrations, multi-step tasks |

Use the simplest architecture that reliably solves the problem. An agent loop is not automatically better than a normal function or a deterministic workflow.

## 7. Common Architecture Mistakes

| Mistake | Better Approach |
|---|---|
| Giving the agent too many tools | Register only tools relevant to the task |
| Trusting model-generated arguments | Validate arguments before execution |
| Allowing unlimited loops | Set step, time, and cost limits |
| Confusing state with long-term memory | Define their responsibilities separately |
| Treating tool output as guaranteed truth | Validate and interpret observations |
| Allowing unrestricted actions | Apply permissions and approval checks |
| Ignoring errors | Return structured errors and log failures |
| Using an agent for simple fixed tasks | Prefer a normal function or deterministic workflow |

---

## 8. Hands-On Exercises

### Beginner

1. Change the goal to calculating the total of five products.
2. Change the product prices and verify the result.
3. Add a new tool called `count_items`.
4. Print each observation on a separate line.

### Intermediate

5. Add a `step_count` field to `AgentState`.
6. Add a maximum execution-step limit and test it.
7. Handle unknown tool names with a structured error.
8. Write unit tests for `calculate_total()`.

### Advanced

9. Replace the rule-based `choose_action()` with an LLM-backed decision function.
10. Define a schema for each tool's arguments and validate inputs before execution.
11. Add a read-only database tool with restricted access.
12. Record execution duration, tool errors, and total model calls.

Do not connect an LLM to unrestricted shell commands, production databases, or other powerful tools without appropriate security controls.

---

## 9. Interview Questions and Answers

**Q1. What is agent architecture?**

It is the design of the components and control logic that enable an agent to interpret a goal, choose actions, execute tools, observe results, and determine when to stop.

**Q2. What is the role of an LLM in an AI agent?**

The LLM can interpret requests and help select actions, but the surrounding application executes tools and enforces permissions.

**Q3. What is a tool registry?**

It is a collection of available tools and their associated execution functions or handlers.

**Q4. What is the difference between state and memory?**

State tracks the current task's progress and information. Memory retains selected information for future use.

**Q5. Why does an agent need a control loop?**

The loop coordinates decisions, tool execution, observations, and continuation until the task is completed or execution must stop.

**Q6. Why are termination conditions important?**

They prevent unnecessary repeated actions and help control time, API usage, and costs.

**Q7. Should every AI application use an agent?**

No. Use an agent when dynamic decisions and multi-step tool use provide value. Prefer simpler deterministic logic when the task is fixed and predictable.

**Q8. What is the difference between a tool call and tool execution?**

A tool call describes the requested operation and arguments. Tool execution is when the application validates and actually runs that operation.

---

## 10. Completion Checklist

- [ ] I can explain the main components of an AI agent.
- [ ] I understand how instructions and context guide decisions.
- [ ] I can distinguish state from memory.
- [ ] I understand the control loop and termination conditions.
- [ ] I ran the Python example successfully.
- [ ] I understand how tool results become observations.
- [ ] I know why tools require validation and permissions.
- [ ] I completed at least three exercises.
- [ ] I can explain the architecture in an interview.

---

## 🔑 Key Takeaways

- Agent architecture defines how an agent's components work together.
- The LLM may choose actions, but the application controls their execution.
- Tools provide access to external operations and information.
- State tracks current progress; memory preserves selected information.
- The control loop coordinates decisions, actions, and observations.
- Limits, validation, permissions, and monitoring are essential for reliable execution.
- A simple deterministic workflow is often preferable to a complex agent.

## 🚀 Next Module

**Module 03 — Tool Calling and Function Calling**

You will learn how models request tool execution, how tool schemas and arguments work, how applications validate calls, and how to return tool results to the model.

**Suggested commit message:**

```text
Sep 3, 2026 — Day 3: Agent architecture — LLM + tools + memory + planning
```
