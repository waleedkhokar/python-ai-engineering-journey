
# 01 — What Are AI Agents?

> Understand AI agents from first principles and learn how they differ from chatbots, AI assistants, and traditional automation.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 01 — What Are AI Agents? |
| Planned Date | Sep 2, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Module 00 — Setup and Environment |
| Primary Language | Python |
| Tools | Python, LLM APIs, VS Code, Jupyter, Git |
| Main Focus | Agent fundamentals, architecture, decision-making, and practical applications |
| Next Module | 02 — Agent Architecture |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Define an AI agent in simple, technical terms.
- Explain how an agent uses an AI model to pursue a goal.
- Understand the difference between AI agents, chatbots, assistants, and workflows.
- Identify the main components of an AI agent.
- Understand the observe, decide, act, and evaluate cycle.
- Recognize when an agent is useful and when traditional automation is better.
- Identify the limitations, risks, and costs of agent-based systems.
- Build a simple Python example that demonstrates an agent-like decision and action loop.

---

## 1. What Is an AI Agent?

An **AI agent** is a software system that uses a model or decision-making mechanism to select actions toward a defined goal, observes the results, and continues or stops according to its instructions and control rules.

Depending on its design, an agent may:

- Interpret a user's request.
- Break a task into smaller steps.
- Choose an available tool.
- Call an API or execute an approved operation.
- Inspect the result.
- Decide whether another action is needed.
- Return a final answer or request human assistance.

An agent does not need to be fully autonomous. Many useful agents operate within strict limits and require approval before sensitive actions.

### Simple example

Imagine asking an AI assistant:

> Find three recent articles about renewable energy, summarize them, and prepare a report with source links.

A basic chatbot might explain renewable energy from its existing knowledge.

An agent designed for this task might:

1. Interpret the research request.
2. Search an approved source or search API.
3. Collect relevant article details.
4. Read or retrieve the article content.
5. Summarize the findings.
6. Verify the source links.
7. Produce the report.

The important difference is that the agent performs a sequence of actions to complete the task rather than only generating an immediate response.

---

## 2. AI Agent vs. Chatbot vs. AI Assistant vs. Workflow

These terms overlap in real products, so distinguish them by their behavior rather than their names.

| System | Primary Purpose | Typical Behavior |
|---|---|---|
| Chatbot | Conversation | Responds to messages |
| LLM application | Complete a language-model task | Generates, classifies, extracts, or summarizes information |
| AI assistant | Help a user with tasks | May use tools, memory, and integrations |
| Traditional automation | Execute predefined processes | Follows explicitly configured rules and steps |
| AI agent | Pursue a goal through selected actions | Uses observations and decisions to determine what to do next |
| Agentic workflow | Coordinate a multi-step process with AI-driven decisions | Combines controlled workflow steps with one or more agentic decisions |
| Multi-agent system | Coordinate multiple agents | Distributes work among specialized agents |

**Important:** A chatbot can be part of an agent system, and an assistant can itself be an agent. These categories describe capabilities, not mutually exclusive product types.

### Example: Email handling

**Chatbot:** Explains how to write a professional email.

**LLM application:** Drafts an email from supplied information.

**Traditional automation:** Sends a predefined email when a specific event occurs.

**AI agent:** Reads an authorized request, drafts a reply, checks the context, and proposes the next action.

**Agentic workflow:** Classifies an incoming request, retrieves customer information, drafts a reply, sends it for approval, and resumes processing after approval.

---

## 3. How Does an AI Agent Work?

A simple tool-using agent can be understood through this cycle:

```text
        User Goal
            |
            v
       Observe Input
            |
            v
    Decide What to Do
            |
            v
      Select an Action
            |
            v
       Execute a Tool
            |
            v
      Observe the Result
            |
            v
   Evaluate: Done Yet?
        /         \
      No           Yes
      |             |
      v             v
   Continue      Final Answer
```

### Step 1 — Observe

The system receives a task, instructions, conversation context, or tool result.

### Step 2 — Decide

The model or application logic determines the next action based on the task, available tools, and constraints.

### Step 3 — Act

The agent requests or executes an action, such as calling a search API or retrieving a database record.

### Step 4 — Evaluate

The system checks the result to determine whether it should continue, retry, change direction, ask a question, or stop.

### Step 5 — Finish

The agent returns a result, reports a failure, or requests human intervention.

This is a conceptual model. Real agents may use more complex loops, explicit state machines, or graph-based execution.

---

## 4. The Main Components of an AI Agent

| Component | Purpose | Example |
|---|---|---|
| Goal | Defines the intended outcome | Research a company |
| Instructions | Set behavior and constraints | Use approved sources |
| AI model | Interprets requests and helps select actions | An LLM |
| Tools | Let the system interact with external services | Search API or database query |
| State | Tracks information about the current task | Current step and collected results |
| Memory | Retains useful information across interactions or steps | Relevant user preferences |
| Observation | Represents the result of an action | Search results |
| Control logic | Determines how execution continues or stops | Maximum of five tool calls |
| Guardrails | Restrict unsafe or unauthorized behavior | Require approval before sending email |

Not every agent requires every component. Start with the smallest design that solves the task reliably.

We will study architecture, tools, memory, planning, and execution limits in depth in the upcoming modules.

---

## 5. Does Every AI Agent Need an LLM?

No.

An agent can use different decision-making approaches, including:

- Rule-based logic.
- Search algorithms.
- Planning algorithms.
- Machine-learning models.
- Large language models.
- Hybrid systems combining models and deterministic rules.

In modern LLM-based agents, an LLM often interprets requests and selects tools, while ordinary Python code validates inputs and executes the actual operations.

For example, the LLM may decide that it needs a customer record. Python code should still enforce authorization before querying the database.

**Best practice:** Use an LLM for flexible interpretation and decision-making. Use deterministic code for validation, permissions, calculations, and critical business rules whenever possible.

---

## 6. When Should You Use an AI Agent?

An agent is useful when the next action depends on information discovered during the task.

| Situation | Recommended Approach | Why |
|---|---|---|
| Convert Celsius to Fahrenheit | Ordinary Python function | Deterministic and simple |
| Send the same scheduled reminder | Traditional automation | The steps are known |
| Summarize a supplied document | LLM application | Usually one model task |
| Research a topic across several sources | AI agent or controlled workflow | The next step depends on retrieved information |
| Approve a financial transaction | Deterministic authorization and human approval | High-impact actions require strict controls |
| Investigate a support request using several systems | Agentic workflow | Requires multiple steps, decisions, and integrations |

Do not add an agent simply because a task involves AI. Agents introduce additional latency, cost, complexity, and failure opportunities.

---

## 7. Your First Python Example

Before using an LLM or external tools, let's understand the basic control loop with ordinary Python.

Create `agent_demo.py`:

```python
def choose_action(task: str) -> str:
    """Choose an action using simple, deterministic rules."""
    task = task.lower()

    if "weather" in task:
        return "get_weather"

    if "calculate" in task:
        return "calculate"

    return "ask_for_clarification"


def execute_action(action: str) -> str:
    """Execute a small demonstration action."""
    if action == "get_weather":
        return "Weather tool would be called here."

    if action == "calculate":
        return "Calculator tool would be called here."

    return "Please provide more details about your task."


def run_demo(task: str) -> str:
    """Demonstrate a simple observe-decide-act-result cycle."""
    print(f"Task: {task}")

    action = choose_action(task)
    print(f"Selected action: {action}")

    result = execute_action(action)
    print(f"Result: {result}")

    return result


if __name__ == "__main__":
    run_demo("Check the weather")
```

Run it:

```bash
python agent_demo.py
```

Expected output:

```text
Task: Check the weather
Selected action: get_weather
Result: Weather tool would be called here.
```

### What does this example teach?

- `choose_action()` selects an action.
- `execute_action()` performs a corresponding operation.
- `run_demo()` coordinates the process.
- The returned result represents an observation that could inform a later step.

**This is a simplified agent-like control loop, not a complete autonomous AI agent.** Its decisions are rule-based, and the tools are placeholders. We will introduce an LLM, actual tool execution, and bounded agent loops in later modules.

### Exercise

Modify the example so that it recognizes a request to search for information.

Then answer:

1. What happens if the request does not match any rule?
2. Why should an application validate an action before executing it?
3. How could an LLM help choose an action?
4. Why should the program not execute arbitrary actions requested by a model?

---

## 8. Benefits and Limitations

### Benefits

- Can handle tasks requiring several connected actions.
- Can adapt to information discovered during execution.
- Can connect language-model capabilities to external tools.
- Can automate selected research and business processes.
- Can reduce repetitive manual work when appropriately evaluated.

### Limitations

- Models can misunderstand instructions or select unsuitable tools.
- Tool results may be incomplete, incorrect, or unavailable.
- Long-running tasks may consume significant time and API budget.
- Repeated actions can cause duplicate operations.
- Untrusted content can contain prompt-injection attempts.
- More autonomy can create more opportunities for mistakes.

An agent should have a clearly defined goal, a limited set of tools, explicit stopping conditions, and an appropriate way to report failure.

---

## 9. Security and Responsible Agent Design

Use these principles from the beginning:

1. **Least privilege:** Give each agent only the permissions it needs.
2. **Input validation:** Validate tool arguments before execution.
3. **Execution limits:** Bound the number of steps, retries, and API calls.
4. **Human approval:** Require approval before sensitive or irreversible actions.
5. **Data protection:** Avoid exposing secrets and unnecessary personal information.
6. **Observability:** Record appropriate execution events without leaking sensitive content.
7. **Failure handling:** Stop safely when a tool fails or the system cannot verify a result.

Never treat model output as inherently trusted or as authorization to perform an operation.

---

## 10. Interview Questions

### Q1. What is an AI agent?

An AI agent is a system that uses a decision-making mechanism to select actions toward a goal, observes their results, and continues or stops according to its control logic.

### Q2. What is the difference between an AI agent and a chatbot?

A chatbot primarily handles conversation. An agent may also use tools, observe results, and execute multiple actions to complete a task. A chatbot can also be built on top of an agent.

### Q3. Does every agent need an LLM?

No. Agents can use rules, planning algorithms, machine-learning models, LLMs, or combinations of these techniques.

### Q4. What is a tool in an AI agent?

A tool is a callable capability that lets the agent interact with an external system, such as a search service, database, calculator, or business API.

### Q5. What is the agent loop?

It is the repeated process of observing information, selecting an action, executing it, evaluating the result, and deciding whether to continue or stop.

### Q6. Why are execution limits important?

They prevent uncontrolled loops, excessive costs, repeated actions, and unnecessarily long execution.

### Q7. When is traditional automation better than an AI agent?

When the task has predictable steps and deterministic rules are sufficient. Traditional automation is often simpler, cheaper, and easier to test.

### Q8. What is the difference between an AI agent and an agentic workflow?

An AI agent makes decisions and performs actions toward a goal. An agentic workflow coordinates a broader process that may combine agents, deterministic steps, conditional branches, and human approval.

---

## 11. Completion Checklist

- [ ] Explain what an AI agent is.
- [ ] Distinguish agents, chatbots, LLM applications, and traditional automation.
- [ ] Identify the core components of an agent.
- [ ] Explain the observe-decide-act-evaluate cycle.
- [ ] Identify when agents are appropriate.
- [ ] Run and modify the Python demonstration.
- [ ] Explain why the demonstration is not a complete autonomous agent.
- [ ] Describe execution limits and basic safety controls.
- [ ] Complete the exercises and commit your work to GitHub.

---

## 📚 Key Takeaways

- An AI agent works toward a goal by selecting and executing actions.
- An LLM is one possible decision-making component, not the definition of an agent.
- Tools connect an agent to external capabilities.
- State and memory serve different purposes and will be studied in detail later.
- Not every AI task requires an agent.
- Reliability depends on validation, execution limits, testing, permissions, and failure handling.
- Start with a simple system and add complexity only when the task requires it.

---

## ➡️ Next Module

### 02 — Agent Architecture

In the next module, we will study how an agent's model, instructions, tools, state, memory, observations, and control logic fit together into a complete architecture.

**Next folder:** `02-Agent-Architecture/`

**Suggested commit message:**

`Sep 2, 2026 — Day 2: What are AI Agents — agents vs chatbots vs assistants`
