
# 🎼 Agent Orchestration — Building Coordinated Agent Systems

> **Course:** Agentic AI Engineering  
> **Module:** 04 — Agent Orchestration  
> **Study Duration:** 2 Days  
> **Level:** Intermediate to Advanced  
> **Prerequisites:** Python, LLM fundamentals, tool calling, state graphs, and basic agent workflows  
> **Primary Goal:** Learn how to coordinate multiple agents, tools, tasks, and workflows reliably.  
> **Learning Approach:** Concepts → Architecture → Python → Frameworks → Testing → Mini-Project 🚀

---

## 📚 Table of Contents

1. [Module Overview](#-1-module-overview)
2. [Learning Objectives](#-2-learning-objectives)
3. [What Is Agent Orchestration?](#-3-what-is-agent-orchestration)
4. [Why Orchestration Matters](#-4-why-orchestration-matters)
5. [Agent vs Workflow vs Orchestrator](#-5-agent-vs-workflow-vs-orchestrator)
6. [Core Orchestration Components](#-6-core-orchestration-components)
7. [Orchestration Patterns](#-7-orchestration-patterns)
8. [Choosing the Right Pattern](#-8-choosing-the-right-pattern)
9. [Single-Agent Orchestration](#-9-single-agent-orchestration)
10. [Multi-Agent Orchestration](#-10-multi-agent-orchestration)
11. [Centralized and Decentralized Control](#-11-centralized-and-decentralized-control)
12. [Sequential Orchestration](#-12-sequential-orchestration)
13. [Parallel Orchestration](#-13-parallel-orchestration)
14. [Conditional Orchestration](#-14-conditional-orchestration)
15. [Loop-Based Orchestration](#-15-loop-based-orchestration)
16. [Hierarchical Orchestration](#-16-hierarchical-orchestration)
17. [Handoffs and Routing](#-17-handoffs-and-routing)
18. [Shared State and Data Flow](#-18-shared-state-and-data-flow)
19. [Task Dependencies and Coordination](#-19-task-dependencies-and-coordination)
20. [Python Orchestration Fundamentals](#-20-python-orchestration-fundamentals)
21. [Build a Sequential Orchestrator](#-21-build-a-sequential-orchestrator)
22. [Build a Conditional Orchestrator](#-22-build-a-conditional-orchestrator)
23. [Build a Parallel Orchestrator](#-23-build-a-parallel-orchestrator)
24. [Build a Multi-Agent Research Workflow](#-24-build-a-multi-agent-research-workflow)
25. [Orchestration with LangGraph](#-25-orchestration-with-langgraph)
26. [Orchestration with the OpenAI Agents SDK](#-26-orchestration-with-the-openai-agents-sdk)
27. [Framework Selection](#-27-framework-selection)
28. [Retries, Timeouts, and Recovery](#-28-retries-timeouts-and-recovery)
29. [Concurrency and Resource Management](#-29-concurrency-and-resource-management)
30. [Human Approval and Permissions](#-30-human-approval-and-permissions)
31. [Observability and Debugging](#-31-observability-and-debugging)
32. [Testing Orchestrated Systems](#-32-testing-orchestrated-systems)
33. [Security and Reliability](#-33-security-and-reliability)
34. [Common Mistakes](#-34-common-mistakes)
35. [Mini-Project](#-35-mini-project)
36. [Exercises](#-36-exercises)
37. [Interview Questions and Answers](#-37-interview-questions-and-answers)
38. [Cheat Sheet](#-38-cheat-sheet)
39. [Glossary](#-39-glossary)
40. [Official Learning Resources](#-40-official-learning-resources)
41. [Completion Checklist](#-41-completion-checklist)

---

# 🎯 1. Module Overview

## 1.1 What You Will Learn

In this module, you will learn how to coordinate the parts of an agentic application.

You will learn to:

- **Organize tasks** into a predictable execution flow.
- **Route requests** to the correct agent or tool.
- **Coordinate multiple agents** without unnecessary duplication.
- **Execute independent tasks in parallel** when appropriate.
- **Share information** safely between workflow steps.
- **Control execution** using conditions, loops, and dependencies.
- **Handle failures** with retries, timeouts, and fallback strategies.
- **Track execution** through logs, traces, and structured outputs.
- **Build testable systems** that behave consistently.
- **Design production-oriented workflows** with clear limits and permissions.

## 1.2 Why This Module Exists

A basic agent can receive a request, reason about it, and call a tool.

However, a real application may require several operations.

For example, an AI research application may need to:

1. Understand the user's question.
2. Create a research plan.
3. Search several sources.
4. Summarize individual sources.
5. Compare the findings.
6. Check the answer for unsupported claims.
7. Produce a final report.
8. Save the report after approval.

A single uncontrolled loop can make this difficult to manage.

**Orchestration gives the system a structure for deciding what runs, when it runs, and how its results are used.**

## 1.3 What You Should Build

By the end of this module, you should be able to build:

- A sequential agent workflow.
- A conditional routing workflow.
- A parallel task executor.
- A workflow with shared state.
- A coordinator that delegates to specialized agents.
- A planner-executor-reviewer workflow.
- A workflow with retries and execution limits.
- A small research orchestration application.

---

# 🧭 2. Learning Objectives

## 2.1 Conceptual Objectives

You should understand:

- **Orchestration** as the coordination of tasks and agents.
- The difference between an agent and an orchestrator.
- The difference between deterministic workflows and dynamic delegation.
- Why multiple agents are not always better than one agent.
- How centralized and decentralized coordination differ.
- How sequential, parallel, conditional, and hierarchical patterns work.

## 2.2 Technical Objectives

You should be able to:

- Represent tasks as Python objects.
- Execute tasks in a defined order.
- Validate task dependencies.
- Route requests based on structured information.
- Execute independent operations concurrently.
- Combine results from multiple workers.
- Handle exceptions without losing useful state.
- Apply timeouts and bounded retries.
- Separate orchestration logic from business logic.
- Write unit tests for workflow behavior.

## 2.3 Production Objectives

You should understand how to:

- Apply least-privilege access to agents.
- Prevent uncontrolled delegation.
- Control token usage and execution cost.
- Protect shared state from conflicting updates.
- Record meaningful execution traces.
- Require human approval for sensitive actions.
- Resume or recover failed work when the architecture supports it.

## 2.4 Definition of Done

You have completed this module when you can explain your architecture, implement its main orchestration patterns, test its behavior, and describe how it handles failures.

---

# 🧩 3. What Is Agent Orchestration?

## 3.1 Simple Definition

**Agent orchestration is the process of coordinating agents, tools, tasks, data, and execution rules to complete a larger objective.**

The orchestrator manages the workflow.

It may decide:

- Which task starts first.
- Which agent handles a task.
- Which tasks can run together.
- Which result should be passed forward.
- Whether a condition requires another branch.
- Whether an operation should be retried.
- Whether execution should stop.
- Whether a human must approve the next action.

## 3.2 A Simple Analogy

Imagine a software development team.

- A project manager receives the goal.
- A researcher investigates requirements.
- A developer implements the solution.
- A tester checks the result.
- A reviewer approves the changes.

The project manager coordinates the work.

The manager does not need to perform every task personally.

Similarly, an orchestrator coordinates specialized components without necessarily doing the work itself.

## 3.3 Basic Architecture

```text
User Request
     |
     v
Orchestrator
     |
     +----> Agent A
     |
     +----> Agent B
     |
     +----> Tool C
     |
     v
Collect Results
     |
     v
Validate Results
     |
     v
Final Response
```

## 3.4 The Orchestrator's Responsibilities

An orchestrator may handle:

1. **Input validation**
2. Task creation
3. Task ordering
4. Routing and delegation
5. State management
6. Execution limits
7. Result aggregation
8. Error handling
9. Approval gates
10. Completion detection

Not every application needs every responsibility.

A small workflow may require only routing and result aggregation.

A production system may require durable state, monitoring, retries, permissions, and recovery.

## 3.5 What Orchestration Is Not

Orchestration is not simply:

- Creating several agents.
- Sending several prompts to an LLM.
- Running tools in a loop.
- Asking agents to communicate freely.
- Putting every operation inside one enormous prompt.

A useful orchestrator has **explicit control rules**, observable execution, and defined completion conditions.

---

# 🔍 4. Why Orchestration Matters

## 4.1 Complex Tasks Need Coordination

Some requests require many related operations.

Example: generating a market research report.

| Task | Responsibility |
|---|---|
| Understand request | Extract the user's research goal |
| Plan | Define research questions |
| Search | Find relevant sources |
| Analyze | Compare evidence |
| Review | Check coverage and consistency |
| Write | Produce the final report |

These operations have dependencies.

The report should not be finalized before the research is analyzed.

Orchestration makes those dependencies explicit.

## 4.2 Benefits

### Better Control

You can define the allowed execution order.

### Better Modularity

Each component can have one clear responsibility.

### Better Testing

You can test routing separately from research or writing.

### Better Recovery

A failed operation can sometimes be retried without restarting the entire workflow.

### Better Observability

You can record which component ran, what it returned, and why the workflow stopped.

### Better Resource Management

You can control concurrency, API usage, and task budgets.

## 4.3 Costs and Trade-Offs

Orchestration also introduces complexity.

Potential costs include:

- More code.
- More state management.
- Additional network requests.
- More failure points.
- Higher debugging effort.
- More complicated testing.
- Additional coordination overhead.

**Use orchestration when it solves a real coordination problem, not simply because the application uses AI.**

---

# ⚖️ 5. Agent vs Workflow vs Orchestrator

## 5.1 Agent

An **agent** is a component that uses a model, tools, instructions, or state to perform a task.

Examples:

- Research agent.
- Coding agent.
- Data analysis agent.
- Customer support agent.

An agent may be autonomous within its assigned scope.

## 5.2 Workflow

A **workflow** defines how tasks are connected and executed.

Example:

```text
Input -> Validate -> Research -> Summarize -> Return
```

A workflow can be deterministic even when some of its tasks use LLMs.

## 5.3 Orchestrator

An **orchestrator** coordinates workflow execution.

It may:

- Select a workflow.
- Assign tasks.
- Route requests.
- Track progress.
- Handle failures.
- Coordinate agents.

## 5.4 Comparison

| Feature | Agent | Workflow | Orchestrator |
|---|---|---|---|
| Main role | Perform a task | Define execution | Coordinate execution |
| Own reasoning | Often | Not necessarily | Sometimes |
| Owns task order | May decide locally | Defines it | Enforces or adapts it |
| Calls tools | Often | Through its steps | Directly or indirectly |
| Handles multiple agents | Possible | Connects components | Coordinates them |
| Needs an LLM | Often, not always | No | No |
| Can be deterministic | Sometimes | Yes | Yes |

## 5.5 Important Distinction

A workflow can contain agents without being fully autonomous.

For example:

```text
Step 1: Call research agent.
Step 2: Call analysis agent.
Step 3: Call writing agent.
```

The workflow determines the order.

The agents perform their assigned work.

The orchestrator manages execution.

This separation often makes systems easier to understand and maintain.

---

# 🏗️ 6. Core Orchestration Components

## 6.1 Task

A task is a unit of work.

A task should describe:

- What must be done.
- What input it requires.
- What output it should produce.
- Which dependencies must finish first.
- What permissions it needs.
- What constitutes success.

## 6.2 Worker

A worker executes a task.

A worker can be:

- A Python function.
- An API client.
- An LLM-powered agent.
- A database operation.
- A background job.
- A human reviewer.

A worker does not have to be an AI agent.

## 6.3 Router

A router selects a destination based on an input or state.

For example:

```text
Question
   |
   v
Classifier
   |
   +----> Research Workflow
   |
   +----> Coding Workflow
   |
   +----> Support Workflow
```

## 6.4 State Store

The state store contains information needed during execution.

Examples:

- User request.
- Current task.
- Completed task identifiers.
- Intermediate findings.
- Errors.
- Approval status.
- Final output.

State may exist in memory, a database, or a workflow engine.

## 6.5 Result Aggregator

An aggregator combines outputs.

For example, three research workers may return findings that must be merged into one report.

Aggregation should preserve source information and identify conflicts.

## 6.6 Validator

A validator checks whether a result satisfies requirements.

Validation can include:

- Schema checks.
- Required-field checks.
- Permission checks.
- Business rules.
- Evidence checks.
- Output quality checks.

## 6.7 Monitor

A monitor records execution information.

Useful fields include:

- Workflow ID.
- Task ID.
- Agent name.
- Start and finish times.
- Status.
- Retry count.
- Error category.
- Token usage, if available.
- External request identifiers.

Avoid logging secrets or unnecessary personal data.

---

# 🧠 7. Orchestration Patterns

## 7.1 What Is a Pattern?

An orchestration pattern is a reusable way to coordinate work.

Patterns help you avoid inventing a new architecture for every application.

Common patterns include:

- Sequential execution.
- Parallel execution.
- Conditional branching.
- Iterative execution.
- Hierarchical delegation.
- Router-based execution.
- Planner-executor coordination.
- Map-reduce processing.
- Event-driven execution.
- Human-in-the-loop approval.

## 7.2 No Pattern Is Always Best

Choose a pattern according to the task's dependencies and risks.

A report-writing workflow may be sequential.

Independent source searches may be parallel.

Customer support may require conditional routing.

A large research objective may need hierarchical planning.

A financial action may require an approval gate.

## 7.3 Pattern Selection Questions

Before implementing a workflow, ask:

1. Are tasks independent?
2. Must some tasks finish before others?
3. Can the next step be decided in advance?
4. Does the workflow need dynamic planning?
5. Can the system safely repeat a task?
6. Is shared state required?
7. Which actions require approval?
8. How will completion be measured?

---

# ➡️ 8. Choosing the Right Pattern

| Situation | Suitable Pattern |
|---|---|
| Fixed sequence of operations | Sequential |
| Independent research queries | Parallel |
| Different request categories | Conditional routing |
| Repeated improvement until a limit | Loop-based |
| Large objective with subtasks | Hierarchical |
| Many similar items | Map-reduce |
| A new event triggers work | Event-driven |
| A risky action needs confirmation | Human approval |
| Work needs different specialist agents | Coordinator and workers |
| Task order changes with results | Dynamic planning |

## 8.1 Start Simple

Prefer the smallest architecture that meets the requirements.

For example, do not introduce five agents if three deterministic Python functions solve the task more reliably.

A useful progression is:

1. One function.
2. A small deterministic workflow.
3. A tool-using agent.
4. An orchestrated workflow.
5. Multiple specialized agents.
6. Durable, distributed execution when necessary.

Each step should solve a real limitation.

---

# 👤 9. Single-Agent Orchestration

## 9.1 What It Means

Single-agent orchestration coordinates one agent's tools and execution steps.

The agent may:

1. Receive an objective.
2. Select a tool.
3. Execute an action.
4. Inspect the result.
5. Continue or stop.

The workflow may still include deterministic validation and approval steps.

## 9.2 Example

```text
User Question
     |
     v
Agent
     |
     v
Select Search Tool
     |
     v
Inspect Search Results
     |
     v
Prepare Answer
     |
     v
Validate Answer
```

## 9.3 Advantages

- Fewer moving parts.
- Easier state management.
- Lower coordination overhead.
- Simpler debugging.
- Less duplicated context.

## 9.4 Limitations

- One agent may have too many responsibilities.
- Long tasks can become difficult to manage.
- A single context may become overloaded.
- Specialization may be limited.

## 9.5 When to Use It

Use one agent when the task is coherent, the available tools are manageable, and multiple independent workers would add unnecessary complexity.

---

# 👥 10. Multi-Agent Orchestration

## 10.1 What It Means

Multi-agent orchestration coordinates multiple agents with different responsibilities.

Example:

```text
              Coordinator
                   |
        +----------+----------+
        |          |          |
        v          v          v
    Researcher   Analyst    Reviewer
        |          |          |
        +----------+----------+
                   |
                   v
              Final Report
```

## 10.2 Specialization

A specialized agent should have a clear purpose.

Example:

**Research agent**
- Finds relevant information.
- Returns sources and findings.
- Does not write the entire final report.

**Analysis agent**
- Compares findings.
- Identifies patterns and uncertainty.
- Does not invent missing evidence.

**Review agent**
- Checks the result against defined criteria.
- Identifies unsupported claims.
- Returns actionable corrections.

**Coordinator**
- Assigns work.
- Tracks progress.
- Resolves dependencies.
- Decides whether the workflow is complete.

## 10.3 Benefits

- Responsibilities are easier to separate.
- Independent tasks can run concurrently.
- Components can be evaluated individually.
- Different tools or instructions can be assigned to different workers.

## 10.4 Risks

- Agents may duplicate work.
- Outputs may conflict.
- Context may be lost during handoffs.
- More model calls may increase cost.
- Failures may propagate across components.
- Coordination may become harder than the original task.

## 10.5 Important Rule

**Multiple agents do not automatically produce better answers.**

Use multiple agents when specialization, parallelism, or independent verification creates measurable value.

---

# 🧭 11. Centralized and Decentralized Control

## 11.1 Centralized Orchestration

One coordinator controls the workflow.

```text
             Coordinator
             /    |    \
            v     v     v
        Worker A Worker B Worker C
```

The coordinator assigns work and collects results.

### Advantages

- Clear control.
- Easier auditability.
- Centralized policy enforcement.
- Easier to define stopping conditions.

### Disadvantages

- Coordinator can become a bottleneck.
- Central failures may stop progress.
- The coordinator needs enough information to make decisions.

## 11.2 Decentralized Orchestration

Agents coordinate more directly or react to shared events.

```text
Worker A <----> Worker B
    ^               |
    |               v
Worker C <-----------
```

### Advantages

- Components may operate independently.
- Event-driven systems can scale across services.
- Local decisions can be made close to the work.

### Disadvantages

- Global state becomes harder to understand.
- Conflicting actions may occur.
- Debugging requires stronger tracing.
- Security and permission boundaries become more important.

## 11.3 Which Should You Choose?

For most learning projects, start with a **central coordinator**.

Move toward decentralized execution only when the application needs independent services, event-based coordination, or scale that justifies the added complexity.

---

# 🔗 12. Sequential Orchestration

## 12.1 Definition

Sequential orchestration executes tasks in a defined order.

The output of one task may become the input of the next.

```text
Task A -> Task B -> Task C -> Final Result
```

## 12.2 Example

A document processing workflow:

1. Extract text.
2. Clean the text.
3. Summarize the document.
4. Validate the summary.
5. Return the result.

## 12.3 Advantages

- Predictable execution.
- Simple error handling.
- Easy debugging.
- Clear task dependencies.
- Straightforward testing.

## 12.4 Disadvantages

- Total duration increases when tasks are slow.
- A failure may block later steps.
- Independent work may be unnecessarily serialized.

## 12.5 Basic Python Example

```python
def extract_text(document: str) -> str:
    return document.strip()


def summarize_text(text: str) -> str:
    return text[:100]


def validate_summary(summary: str) -> str:
    if not summary:
        raise ValueError("Summary cannot be empty")
    return summary


def run_pipeline(document: str) -> str:
    text = extract_text(document)
    summary = summarize_text(text)
    return validate_summary(summary)


result = run_pipeline("Agent orchestration coordinates tasks.")
print(result)
```

This example uses deterministic functions.

Real applications may replace a step with an LLM or external service while preserving the same orchestration structure.

---

# ⚡ 13. Parallel Orchestration

## 13.1 Definition

Parallel orchestration runs independent tasks concurrently.

```text
              Start
                |
       +--------+--------+
       |        |        |
       v        v        v
    Task A   Task B   Task C
       |        |        |
       +--------+--------+
                |
                v
          Combine Results
```

## 13.2 When Parallelism Helps

Use parallel execution when:

- Tasks do not depend on one another.
- Each task can safely run independently.
- The external services support concurrent requests.
- Shared resources are managed safely.
- Combining the results is well-defined.

## 13.3 When It Does Not Help

Parallelism may not help when:

- Tasks depend on previous results.
- The bottleneck is a rate-limited service.
- All tasks compete for one constrained resource.
- Coordination overhead exceeds the saved time.
- Tasks mutate the same shared data without protection.

## 13.4 Python Example with `asyncio`

```python
import asyncio


async def research_topic(topic: str) -> dict:
    # Simulates an asynchronous operation.
    await asyncio.sleep(0.1)

    return {
        "topic": topic,
        "finding": f"Research completed for {topic}",
    }


async def main() -> None:
    topics = [
        "Agent orchestration",
        "Workflow reliability",
        "Multi-agent coordination",
    ]

    results = await asyncio.gather(
        *(research_topic(topic) for topic in topics)
    )

    for result in results:
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

## 13.5 What `asyncio.gather()` Does

`asyncio.gather()` schedules awaitable operations and collects their results.

In this example, the operations are simulated using `asyncio.sleep()`.

No actual research API is called.

For production use, add timeouts, bounded concurrency, cancellation handling, and error policies.

## 13.6 Parallel Execution Is Not Free

More concurrent tasks can mean:

- More API requests.
- Higher peak memory use.
- Greater cost.
- More rate-limit errors.
- More difficult failure handling.

Set concurrency limits according to the service and workload.

---

# 🔀 14. Conditional Orchestration

## 14.1 Definition

Conditional orchestration selects a path according to a condition.

```text
             Request
                |
                v
           Classify Type
                |
       +--------+--------+
       |                 |
       v                 v
   Research           Coding
   Workflow           Workflow
```

## 14.2 Example

```python
def route_request(request: str) -> str:
    normalized = request.lower()

    if any(word in normalized for word in ["bug", "code", "python"]):
        return "coding"

    if any(word in normalized for word in ["research", "sources", "compare"]):
        return "research"

    return "general"


print(route_request("Help me debug Python"))
```

This is a simple keyword-based demonstration, not a reliable natural-language classifier for all requests.

## 14.3 Production Routing

A production router may use:

- Explicit user-selected options.
- Validated rules.
- A trained classifier.
- An LLM returning a structured category.
- A combination of deterministic rules and model classification.

## 14.4 Validate the Route

Never allow an untrusted model output to select an arbitrary executable function.

Use an allowlist.

```python
ALLOWED_ROUTES = {
    "research",
    "coding",
    "general",
}


def validate_route(route: str) -> str:
    if route not in ALLOWED_ROUTES:
        raise ValueError("Unsupported route")

    return route
```

## 14.5 Unknown Categories

Define a fallback for uncertain cases.

Possible responses include:

- Use a safe general workflow.
- Ask the user to clarify.
- Return a validation error.
- Send the request for human review.

Do not silently route every unknown request into a privileged workflow.

---

# 🔁 15. Loop-Based Orchestration

## 15.1 Definition

A loop repeats a task while a condition remains true.

Examples:

- Continue research until required evidence is collected.
- Improve a draft until it meets a quality threshold.
- Retry a transient network request.
- Continue processing a bounded queue.

## 15.2 Example

```text
Start
  |
  v
Perform Task
  |
  v
Check Result
  |
  +---- Sufficient ----> Finish
  |
  +---- Insufficient --> Repeat
```

## 15.3 A Safe Loop

```python
def improve_result(initial: str, max_rounds: int = 3) -> str:
    result = initial

    for round_number in range(max_rounds):
        if result.strip():
            return result

        result = f"Improved result {round_number + 1}"

    if not result.strip():
        raise RuntimeError("No valid result after maximum rounds")

    return result
```

The example demonstrates a bound, not a real quality-improvement algorithm.

## 15.4 Required Loop Controls

Every agentic loop should have a defined stopping policy.

Use:

- A maximum number of iterations.
- A time budget.
- A cost or token budget where possible.
- A clear completion condition.
- A failure condition.
- A repeated-action detection strategy when relevant.

**Never rely entirely on an LLM deciding when it has done enough.**

---

# 🏢 16. Hierarchical Orchestration

## 16.1 Definition

Hierarchical orchestration divides a large goal into smaller goals.

A coordinator may delegate to sub-coordinators, which delegate to workers.

```text
                  Main Coordinator
                   /            \
                  v              v
           Research Lead      Build Lead
             /     \           /     \
            v       v         v       v
         Search   Review    Code    Tests
```

## 16.2 Example

Goal: Build a technical research report.

The main coordinator delegates:

- Research planning.
- Source discovery.
- Technical analysis.
- Quality review.
- Report writing.

Each subtask may have its own small workflow.

## 16.3 Benefits

- Complex objectives become manageable.
- Responsibility boundaries become clearer.
- Teams can specialize.
- Independent subtasks can be scheduled separately.

## 16.4 Risks

- Delegation can become excessively deep.
- Parent tasks may lose visibility into details.
- Results can be duplicated.
- The number of model calls can grow quickly.

## 16.5 Delegation Limits

Set explicit limits such as:

- Maximum delegation depth.
- Maximum number of child tasks.
- Maximum concurrent workers.
- Maximum total execution time.
- Maximum total budget.

These limits prevent uncontrolled expansion.

---

# 🤝 17. Handoffs and Routing

## 17.1 What Is a Handoff?

A handoff transfers responsibility for the next part of a task.

For example:

```text
Support Agent
      |
      | Request requires technical analysis
      v
Technical Agent
      |
      | Technical answer completed
      v
Support Agent
      |
      v
User Response
```

## 17.2 What a Handoff Should Include

A handoff should carry enough information for the receiving component to act correctly.

Useful fields include:

- Original request.
- Assigned objective.
- Relevant context.
- Expected output.
- Constraints.
- Available tools.
- Relevant evidence.
- Completion criteria.

Avoid passing an entire conversation when a concise structured summary is sufficient.

## 17.3 Handoff Schema

```python
handoff = {
    "task_id": "task-001",
    "from_agent": "coordinator",
    "to_agent": "researcher",
    "objective": "Find evidence for the main claim",
    "context": {
        "topic": "Workflow reliability",
    },
    "expected_output": {
        "findings": "list",
        "sources": "list",
    },
}
```

This is an illustrative Python dictionary, not a validated schema.

## 17.4 Validate Handoffs

Before execution, check that:

- The target agent exists.
- The task is permitted.
- Required input is present.
- The expected output is defined.
- The requested operation is within scope.

## 17.5 Handoff Failure

If the receiving agent fails, the orchestrator should decide whether to:

- Retry.
- Choose a fallback worker.
- Ask for clarification.
- Return a partial result.
- Stop the workflow.

Do not assume every handoff succeeds.

---

# 🗃️ 18. Shared State and Data Flow

## 18.1 What Is Shared State?

Shared state is the information that workflow components need to read or update during execution.

Example:

```python
state = {
    "request": "Compare workflow orchestration patterns",
    "tasks": [],
    "findings": [],
    "errors": [],
    "status": "pending",
}
```

## 18.2 Why State Matters

Without well-defined state, agents may:

- Repeat completed tasks.
- Lose important findings.
- Overwrite one another's results.
- Use outdated information.
- Confuse intermediate results with final output.

## 18.3 Keep State Structured

Prefer explicit fields over a single large text value.

For example:

```python
state = {
    "workflow_id": "workflow-001",
    "status": "running",
    "current_step": "research",
    "completed_steps": [],
    "results": {},
    "errors": [],
}
```

## 18.4 Separate State Categories

Useful categories include:

**Input state**
- User request.
- Input parameters.
- User-selected options.

**Execution state**
- Current task.
- Task status.
- Retry count.
- Workflow progress.

**Result state**
- Findings.
- Intermediate outputs.
- Final response.

**Control state**
- Approval status.
- Stop signal.
- Cancellation request.
- Budget remaining.

## 18.5 State Mutation

Avoid letting every worker freely change every field.

Instead, define which component can update which part of the state.

For example:

- Research workers add findings.
- The coordinator updates task status.
- The reviewer records quality findings.
- The approval service records approval decisions.

## 18.6 Conflicting Updates

If several workers update shared state concurrently, you may need:

- Separate result records.
- Locks.
- Transactions.
- Version numbers.
- Atomic database operations.
- A merge policy.

Do not assume a shared Python dictionary is a safe distributed state store.

## 18.7 Immutable Results

When practical, let workers return results instead of directly modifying global state.

The coordinator can validate and merge those results.

This reduces hidden side effects and makes tests easier to write.

---

# 🧱 19. Task Dependencies and Coordination

## 19.1 What Is a Dependency?

A dependency means one task needs another task's result before it can proceed.

Example:

```text
Collect Data
     |
     v
Clean Data
     |
     v
Analyze Data
     |
     v
Generate Report
```

## 19.2 Independent Tasks

Some tasks have no dependency on each other.

```text
             Start
           /   |   \
          v    v    v
      Search A B   C
          \    |   /
           v   v  v
          Aggregate
```

## 19.3 Directed Acyclic Graphs

A **directed acyclic graph (DAG)** represents tasks and their dependencies.

- A node represents a task.
- An edge represents a dependency.
- A directed edge indicates the execution relationship.
- A cycle indicates a circular dependency.

Example:

```text
A -> C
B -> C
C -> D
```

Task C requires both A and B.

Task D requires C.

## 19.4 Topological Ordering

A topological ordering is a task order that respects all dependency edges.

For the graph above, valid orders include:

```text
A, B, C, D
B, A, C, D
```

Both A and B must finish before C.

## 19.5 Why Dependency Validation Matters

A dependency-aware orchestrator should detect:

- Unknown task identifiers.
- Missing prerequisites.
- Circular dependencies.
- Failed prerequisites.
- Tasks that should not execute after cancellation.

These checks are easier to perform before launching expensive workers.

---

# 🐍 20. Python Orchestration Fundamentals

## 20.1 Separate the Responsibilities

A maintainable Python orchestrator separates:

1. Task definitions.
2. Task execution.
3. Routing.
4. State updates.
5. Error handling.
6. Logging.
7. Validation.
8. Result aggregation.

Avoid placing every responsibility inside one large function.

## 20.2 Use Type Hints

Type hints make interfaces easier to understand.

```python
def normalize_request(request: str) -> str:
    return request.strip()
```

For more complex workflows, use dataclasses or validated models to define structured inputs and outputs.

## 20.3 Use Small Functions

Prefer:

```python
def validate_input(...):
    ...


def select_worker(...):
    ...


def execute_task(...):
    ...


def aggregate_results(...):
    ...
```

over one function containing every stage.

## 20.4 Define Explicit Statuses

A task may have statuses such as:

- `pending`
- `running`
- `completed`
- `failed`
- `cancelled`
- `waiting_for_approval`

Use a documented set of states rather than inventing status strings throughout the application.

## 20.5 Avoid Hidden Side Effects

A worker should make its effects clear.

Examples of side effects include:

- Writing to a database.
- Sending an email.
- Updating a customer record.
- Creating a cloud resource.
- Publishing a document.

The orchestrator should know which tasks can change external systems.

---

# 🧪 21. Build a Sequential Orchestrator

This example demonstrates a small, deterministic orchestration pipeline.

It does not require an LLM or API key.

## 21.1 Create the File

```text
orchestration_demo/
└── sequential.py
```

## 21.2 Implementation

```python
from dataclasses import dataclass


@dataclass
class WorkflowResult:
    status: str
    output: str


def validate_request(request: str) -> str:
    cleaned = request.strip()

    if not cleaned:
        raise ValueError("Request cannot be empty")

    return cleaned


def research(request: str) -> dict:
    return {
        "topic": request,
        "findings": [
            "Define task responsibilities",
            "Validate task outputs",
            "Handle execution failures",
        ],
    }


def write_summary(research_result: dict) -> str:
    findings = research_result["findings"]
    return "; ".join(findings)


def run_workflow(request: str) -> WorkflowResult:
    validated = validate_request(request)
    research_result = research(validated)
    summary = write_summary(research_result)

    if not summary:
        return WorkflowResult(
            status="failed",
            output="No summary was produced",
        )

    return WorkflowResult(
        status="completed",
        output=summary,
    )


if __name__ == "__main__":
    result = run_workflow("Agent orchestration")
    print(result.status)
    print(result.output)
```

## 21.3 Understand the Flow

1. The request is validated.
2. The research function returns structured findings.
3. The summary function transforms the findings.
4. The workflow checks the output.
5. The result is returned with an explicit status.

## 21.4 Replace the Mock Worker

The `research()` function is a mock worker.

In a real application, it could call a search API or an AI agent.

Keep the orchestration interface stable when replacing the worker.

## 21.5 Test the Pipeline

```python
def test_empty_request_fails():
    try:
        run_workflow("   ")
    except ValueError:
        return

    raise AssertionError("Expected ValueError")


def test_workflow_completes():
    result = run_workflow("Agent orchestration")

    assert result.status == "completed"
    assert result.output
```

These examples use basic assertions. You can convert them into pytest tests.

---

# 🔀 22. Build a Conditional Orchestrator

## 22.1 Goal

Route requests to the appropriate worker using an explicit allowlist.

## 22.2 Implementation

```python
def research_worker(request: str) -> str:
    return f"Research workflow selected for: {request}"


def coding_worker(request: str) -> str:
    return f"Coding workflow selected for: {request}"


def general_worker(request: str) -> str:
    return f"General workflow selected for: {request}"


WORKERS = {
    "research": research_worker,
    "coding": coding_worker,
    "general": general_worker,
}


def select_route(request: str) -> str:
    text = request.lower()

    if "research" in text or "sources" in text:
        return "research"

    if "python" in text or "debug" in text:
        return "coding"

    return "general"


def orchestrate(request: str) -> str:
    if not request.strip():
        raise ValueError("Request cannot be empty")

    route = select_route(request)

    if route not in WORKERS:
        raise ValueError("Invalid route")

    worker = WORKERS[route]
    return worker(request)


print(orchestrate("Research workflow design"))
```

## 22.3 Important Lessons

- The router returns a category.
- The allowlist maps approved categories to workers.
- The orchestrator validates the request.
- The worker handles its assigned responsibility.
- The route cannot directly execute arbitrary code.

## 22.4 Limitations

Keyword matching is not enough for complex routing.

A production router should handle ambiguous inputs, explicit user choices, unsupported categories, and failures.

If an LLM selects the route, validate the returned category before executing it.

---

# ⚡ 23. Build a Parallel Orchestrator

## 23.1 Goal

Execute independent workers concurrently and combine their outputs.

## 23.2 Implementation

```python
import asyncio


async def worker_a() -> dict:
    await asyncio.sleep(0.1)
    return {"worker": "A", "status": "completed"}


async def worker_b() -> dict:
    await asyncio.sleep(0.1)
    return {"worker": "B", "status": "completed"}


async def worker_c() -> dict:
    await asyncio.sleep(0.1)
    return {"worker": "C", "status": "completed"}


async def orchestrate_parallel() -> list[dict]:
    tasks = [
        worker_a(),
        worker_b(),
        worker_c(),
    ]

    results = await asyncio.gather(*tasks)
    return results


async def main() -> None:
    results = await orchestrate_parallel()

    for result in results:
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
```

## 23.3 What This Demonstrates

- Three independent asynchronous operations.
- One coordinator.
- Concurrent waiting.
- A collection of returned results.

## 23.4 What It Does Not Demonstrate

It does not demonstrate:

- Real AI model calls.
- API rate limiting.
- Durable execution.
- Automatic recovery.
- Distributed task queues.
- Production monitoring.

Those capabilities require additional implementation or infrastructure.

## 23.5 Handling Independent Failures

If workers can fail independently, choose an explicit failure policy.

For example:

- Fail the entire workflow if any result is required.
- Collect successful results and record failures.
- Retry selected transient failures.
- Use a fallback worker.
- Return a clearly labeled partial result.

Do not silently ignore errors that affect correctness.

---

# 🔬 24. Build a Multi-Agent Research Workflow

## 24.1 Project Goal

Build a small research workflow with three logical workers:

- **Researcher:** gathers findings.
- **Analyst:** interprets the findings.
- **Reviewer:** checks the result.

The coordinator determines the execution order.

The example below uses deterministic mock workers so it can run without model credentials.

## 24.2 Architecture

```text
User Topic
    |
    v
Coordinator
    |
    v
Research Worker
    |
    v
Analysis Worker
    |
    v
Review Worker
    |
    v
Final Result
```

## 24.3 Implementation

```python
from dataclasses import dataclass


@dataclass
class ResearchResult:
    topic: str
    findings: list[str]


@dataclass
class AnalysisResult:
    topic: str
    observations: list[str]


@dataclass
class ReviewResult:
    approved: bool
    feedback: list[str]


def researcher(topic: str) -> ResearchResult:
    return ResearchResult(
        topic=topic,
        findings=[
            "Orchestration defines task execution rules",
            "Task dependencies affect execution order",
            "Retries must be bounded",
        ],
    )


def analyst(result: ResearchResult) -> AnalysisResult:
    observations = [
        f"Finding count: {len(result.findings)}",
        "Execution dependencies should be explicit",
        "Failure behavior should be tested",
    ]

    return AnalysisResult(
        topic=result.topic,
        observations=observations,
    )


def reviewer(result: AnalysisResult) -> ReviewResult:
    feedback = []

    if not result.observations:
        feedback.append("Analysis is empty")

    if not result.topic.strip():
        feedback.append("Topic is missing")

    return ReviewResult(
        approved=not feedback,
        feedback=feedback,
    )


def run_research_workflow(topic: str) -> dict:
    if not topic.strip():
        raise ValueError("Topic is required")

    research_result = researcher(topic)
    analysis_result = analyst(research_result)
    review_result = reviewer(analysis_result)

    return {
        "topic": topic,
        "research": research_result.findings,
        "analysis": analysis_result.observations,
        "review": {
            "approved": review_result.approved,
            "feedback": review_result.feedback,
        },
    }


if __name__ == "__main__":
    output = run_research_workflow("Agent orchestration")
    print(output)
```

## 24.4 Why Use Data Classes?

Data classes give each stage a clear result structure.

They help avoid vague return values and make function contracts easier to inspect.

For more complex external inputs, consider schema validation.

## 24.5 Why Keep Workers Separate?

Separate workers can be:

- Tested independently.
- Replaced with model-powered agents.
- Given different tools.
- Instrumented separately.
- Reused in another workflow.

## 24.6 Add an LLM Carefully

When replacing mock workers with LLM-powered agents:

1. Define the agent's exact responsibility.
2. Specify its input schema.
3. Specify its output schema.
4. Restrict its available tools.
5. Validate its returned data.
6. Handle model and network errors.
7. Apply cost and time limits.
8. Keep the coordinator in control of execution.

An LLM output should not be trusted merely because it is formatted as JSON.

## 24.7 Improve the Workflow

Add:

- Persistent task records.
- Structured logs.
- A retry policy.
- Timeout handling.
- Source validation.
- Human review for sensitive outputs.
- Tests for failed workers.
- A clear completion criterion.

---

# 🕸️ 25. Orchestration with LangGraph

## 25.1 What Is LangGraph?

LangGraph is a framework for building stateful, graph-based agent workflows.

It supports patterns such as:

- Nodes and edges.
- Conditional routing.
- Shared workflow state.
- Loops.
- Checkpointing.
- Human-in-the-loop workflows.
- Multi-step agent execution.

It is useful when the application needs explicit control flow and stateful execution.

Official documentation:

https://docs.langchain.com/oss/python/langgraph/overview

## 25.2 Core Concepts

**State**

The data carried through the graph.

**Node**

A function or component that performs work.

**Edge**

A connection describing where execution goes next.

**Conditional edge**

A connection selected according to state or a routing function.

**Checkpoint**

A saved execution state that can support persistence and recovery, depending on configuration.

## 25.3 Graph Example

The following example shows a small graph without an external model.

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class WorkflowState(TypedDict):
    request: str
    result: str


def prepare(state: WorkflowState) -> dict:
    request = state["request"].strip()

    if not request:
        raise ValueError("Request cannot be empty")

    return {"request": request}


def process(state: WorkflowState) -> dict:
    return {
        "result": f"Processed: {state['request']}"
    }


builder = StateGraph(WorkflowState)

builder.add_node("prepare", prepare)
builder.add_node("process", process)

builder.add_edge(START, "prepare")
builder.add_edge("prepare", "process")
builder.add_edge("process", END)

graph = builder.compile()

result = graph.invoke({
    "request": "Learn orchestration",
    "result": "",
})

print(result)
```

## 25.4 Install the Dependencies

```bash
python -m pip install langgraph typing_extensions
```

Use a supported Python version and check the current framework documentation for version-specific requirements.

## 25.5 Understand the Graph

1. The initial state contains the request.
2. The `prepare` node validates the request.
3. The `process` node creates the result.
4. The graph reaches `END`.
5. The final state is returned.

## 25.6 Add Conditional Routing

A graph can route requests to different nodes.

Conceptually:

```text
START
  |
  v
Classify
  |
  +----> Research Node ----+
  |                        |
  +----> Coding Node ------+----> END
  |                        |
  +----> General Node -----+
```

The routing function should return only supported node names.

Consult the official documentation for the current conditional-edge API.

## 25.7 Add Checkpointing

Checkpointing can persist graph state between execution steps.

It is useful for:

- Resuming interrupted work.
- Inspecting workflow progress.
- Human approval pauses.
- Stateful interactions.

Checkpointing alone does not guarantee that every external side effect is executed exactly once.

External operations still need idempotency, transaction boundaries, or deduplication where appropriate.

## 25.8 When to Use LangGraph

Consider LangGraph when you need:

- Explicit graph control flow.
- Stateful agent workflows.
- Conditional execution.
- Loops with controlled transitions.
- Checkpointing.
- Human-in-the-loop patterns.

For a three-function script, a framework may be unnecessary.

---

# 🤖 26. Orchestration with the OpenAI Agents SDK

## 26.1 Overview

The OpenAI Agents SDK provides components for building agent applications, including agents, tools, handoffs, and execution tracing.

Official documentation:

https://openai.github.io/openai-agents-python/

## 26.2 Relevant Concepts

**Agent**

Defines an agent's instructions and available capabilities.

**Tool**

Allows an agent to invoke an approved function or operation.

**Handoff**

Transfers responsibility from one agent to another.

**Runner**

Executes an agent workflow.

**Tracing**

Records execution details that help developers inspect and debug workflows.

## 26.3 Example Architecture

```text
User Request
     |
     v
Triage Agent
     |
     +----> Research Agent
     |
     +----> Support Agent
     |
     v
Final Response
```

The triage agent can route work to a specialized agent when a handoff is appropriate.

## 26.4 Minimal Illustrative Example

Check the current SDK documentation for supported versions and exact APIs before using this in a production application.

```python
import asyncio

from agents import Agent, Runner


research_agent = Agent(
    name="Research Agent",
    instructions=(
        "Help with research planning. "
        "Be clear about uncertainty and missing evidence."
    ),
)


async def main() -> None:
    result = await Runner.run(
        research_agent,
        "Explain why orchestration needs explicit task boundaries.",
    )

    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

## 26.5 Install and Configure

```bash
python -m pip install openai-agents
```

Configure the provider credentials using the current official instructions.

Never hardcode API keys in source code or commit them to version control.

## 26.6 Handoffs vs Manager-Led Coordination

Two broad approaches are common.

**Handoff-oriented coordination**

A current agent transfers responsibility to another agent.

Use this when the next specialist should take over the task.

**Manager-led coordination**

A coordinator remains responsible for the overall task and delegates work to specialized agents.

Use this when the coordinator must synthesize results, enforce a process, or maintain final responsibility.

The appropriate choice depends on the task and the SDK's current capabilities.

## 26.7 Do Not Confuse Handoffs with Security Boundaries

A handoff changes workflow responsibility.

It does not automatically establish safe authorization.

Each agent and tool must still have appropriate permissions and validation.

---

# 🧰 27. Framework Selection

## 27.1 Start with the Problem

Choose a framework according to the behavior your application needs.

Do not choose a framework only because it is popular.

## 27.2 Decision Table

| Requirement | Practical Starting Point |
|---|---|
| A few fixed Python steps | Plain Python |
| Simple asynchronous work | `asyncio` |
| Explicit state graph | LangGraph |
| Agent handoffs and tool execution | OpenAI Agents SDK |
| Durable distributed jobs | A suitable workflow or job platform |
| Event-based coordination | Messaging or event infrastructure |
| Long-running human approval | A durable workflow with persistence |

## 27.3 Questions to Ask

- Does execution need to survive a process restart?
- Are tasks short-running or long-running?
- Must humans approve certain steps?
- Are workers local or distributed?
- Is task order mostly fixed or dynamic?
- Does the application need detailed tracing?
- Are retries safe?
- Is the team familiar with the framework?

## 27.4 Avoid Framework Overload

Do not use multiple orchestration frameworks unless their roles are clearly separated.

Overlapping frameworks may introduce:

- Duplicate state management.
- Confusing error propagation.
- More dependencies.
- More operational complexity.

## 27.5 Build a Small Proof of Concept

Before adopting a framework:

1. Build a minimal workflow.
2. Test the main execution pattern.
3. Test failure behavior.
4. Measure complexity.
5. Check deployment requirements.
6. Review current documentation.
7. Decide whether the framework provides enough value.

---

# 🛡️ 28. Retries, Timeouts, and Recovery

## 28.1 Why Failures Happen

A worker may fail because of:

- Network problems.
- API rate limits.
- Invalid inputs.
- Model errors.
- Tool timeouts.
- Permission failures.
- Malformed outputs.
- External service outages.

A reliable orchestrator needs an explicit failure policy.

## 28.2 Classify Errors

**Transient errors**

May disappear after a short delay.

Examples:

- Temporary network failure.
- Temporary service unavailability.
- Rate limiting.

**Permanent errors**

Usually require a changed request or configuration.

Examples:

- Invalid credentials.
- Unsupported operation.
- Invalid schema.
- Permission denied.

Do not repeatedly retry permanent errors.

## 28.3 Bounded Retries

```python
import asyncio


async def retry_operation(operation, max_attempts: int = 3):
    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1")

    for attempt in range(max_attempts):
        try:
            return await operation()

        except TemporaryServiceError:
            if attempt == max_attempts - 1:
                raise

            await asyncio.sleep(0.2 * (2 ** attempt))
```

`TemporaryServiceError` is a placeholder for an application-specific exception that you must define or replace.

The example demonstrates bounded exponential backoff.

Production retry logic should also account for rate-limit instructions, jitter, deadlines, and cancellation.

## 28.4 Timeouts

A task should not wait forever.

```python
result = await asyncio.wait_for(
    some_async_operation(),
    timeout=10,
)
```

The timeout is expressed in seconds.

A timeout does not always mean the external operation stopped. A remote service may continue processing after the client times out.

## 28.5 Idempotency

An operation is idempotent when repeating it produces the same intended final effect.

For example, setting a record's status to `approved` can be idempotent.

Creating a new payment every time a request is repeated is not naturally idempotent.

Use idempotency keys, deduplication, or other safeguards for operations where retries could create duplicate effects.

## 28.6 Recovery Policy

For each task, define:

- Which errors are retryable.
- Maximum attempts.
- Maximum elapsed time.
- Whether a fallback is available.
- Whether partial output is acceptable.
- Whether human intervention is required.
- How state is preserved.
- How duplicate side effects are prevented.

---

# ⚙️ 29. Concurrency and Resource Management

## 29.1 Concurrency vs Parallelism

**Concurrency** means multiple operations can make progress during overlapping periods.

**Parallelism** means multiple operations execute at the same time.

Asynchronous Python is especially useful for I/O-bound operations.

CPU-bound Python workloads may require other approaches, depending on the task and runtime.

## 29.2 Control Concurrency

Do not launch thousands of model or API requests without a limit.

A semaphore can limit concurrent operations.

```python
import asyncio


async def worker(item: int, semaphore: asyncio.Semaphore) -> int:
    async with semaphore:
        await asyncio.sleep(0.05)
        return item * 2


async def main() -> None:
    semaphore = asyncio.Semaphore(5)

    results = await asyncio.gather(
        *(
            worker(item, semaphore)
            for item in range(20)
        )
    )

    print(results)


if __name__ == "__main__":
    asyncio.run(main())
```

This example limits concurrent entry into the protected section to five operations.

## 29.3 Rate Limits

An API may limit:

- Requests per minute.
- Tokens per minute.
- Concurrent requests.
- Daily usage.

A concurrency limit does not automatically enforce a requests-per-minute limit.

Use a rate limiter when the provider requires one.

## 29.4 Resource Budgets

Track relevant limits:

- Maximum task count.
- Maximum parallel workers.
- Maximum model calls.
- Maximum retries.
- Maximum elapsed time.
- Maximum tokens or cost.
- Maximum output size.

## 29.5 Backpressure

Backpressure prevents incoming work from overwhelming downstream workers.

Possible mechanisms include:

- Bounded queues.
- Request rejection.
- Queue length limits.
- Worker pools.
- Rate limiting.
- Load shedding.

## 29.6 Cancellation

When a user cancels a workflow, define what happens to active tasks.

Consider:

- Stopping new task scheduling.
- Cancelling cancellable local operations.
- Preserving useful completed results.
- Recording the cancellation.
- Avoiding unsafe partial side effects.

Cancellation behavior must be designed rather than assumed.

---

# 🧑‍⚖️ 30. Human Approval and Permissions

## 30.1 Why Approval Matters

Some actions should not happen solely because an agent proposed them.

Examples:

- Sending an external email.
- Publishing public content.
- Deleting important data.
- Modifying production infrastructure.
- Issuing a refund.
- Making a purchase.

## 30.2 Approval Workflow

```text
Agent Proposes Action
         |
         v
Validate Action
         |
         v
Request Human Approval
         |
     +---+---+
     |       |
     v       v
 Approved  Rejected
     |       |
     v       v
Execute   Stop or Revise
```

## 30.3 Approval Should Be Specific

A useful approval request identifies:

- The exact proposed action.
- The target.
- The relevant parameters.
- The expected consequence.
- The identity or role of the approver.
- The time of approval.

A vague approval such as "continue" may be insufficient for a high-impact action.

## 30.4 Separate Proposal from Execution

The agent can prepare a proposed action.

The orchestrator can validate it.

A separate permission or approval layer can authorize execution.

This separation makes the system easier to audit.

## 30.5 Revalidate After Approval

If the target or action changes after approval, request approval again when the change affects the approved operation.

Do not treat approval for one action as blanket permission for unrelated actions.

## 30.6 Least Privilege

Give each agent only the tools and permissions it needs.

For example:

- A research worker may read approved sources.
- A report writer may create draft documents.
- A publisher may require explicit approval.
- A cleanup worker may not delete production data.

---

# 📊 31. Observability and Debugging

## 31.1 What Is Observability?

Observability helps developers understand what happened inside a running application.

For orchestrated systems, useful signals include:

- Logs.
- Metrics.
- Traces.
- Task histories.
- Structured error records.

## 31.2 Logging

Use Python's logging module rather than scattered print statements in production code.

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_task(task_id: str) -> None:
    logger.info(
        "Task started",
        extra={"task_id": task_id},
    )

    try:
        # Execute the task here.
        logger.info(
            "Task completed",
            extra={"task_id": task_id},
        )

    except Exception:
        logger.exception(
            "Task failed",
            extra={"task_id": task_id},
        )
        raise
```

The standard logging formatter may not display every custom field unless configured to do so.

Use a structured logging formatter when machine-readable logs are required.

## 31.3 Metrics

Useful metrics include:

- Workflow success rate.
- Workflow failure rate.
- Average duration.
- Duration by task type.
- Retry frequency.
- Timeout frequency.
- Queue depth.
- Model usage.
- Cost per completed workflow.

## 31.4 Tracing

A trace connects related operations.

Example:

```text
Workflow ID: wf-123
  |
  +-- Task: classify
  |
  +-- Task: research
  |     |
  |     +-- Tool call: search
  |
  +-- Task: review
  |
  +-- Task: finalize
```

Tracing helps answer:

- Which step failed?
- Which tool was called?
- How long did each step take?
- Why was a route selected?
- Which retry succeeded?

## 31.5 Correlation IDs

Assign each workflow a unique identifier.

Pass that identifier through relevant tasks and service calls.

This makes it easier to connect events across services.

## 31.6 Protect Sensitive Data

Do not automatically log:

- API keys.
- Passwords.
- Authentication tokens.
- Private user data.
- Sensitive documents.
- Full model prompts containing confidential information.

Define a logging policy and redact sensitive fields.

---

# 🧪 32. Testing Orchestrated Systems

## 32.1 What Should Be Tested?

Test both the workers and the orchestration logic.

Important areas include:

- Input validation.
- Routing.
- Task ordering.
- Dependency enforcement.
- State transitions.
- Result aggregation.
- Retry behavior.
- Timeout behavior.
- Approval requirements.
- Failure propagation.

## 32.2 Unit Tests

Test individual functions independently.

Example:

```python
def test_select_route():
    assert select_route("Research workflow") == "research"


def test_empty_request_rejected():
    try:
        orchestrate(" ")
    except ValueError:
        return

    raise AssertionError("Expected ValueError")
```

## 32.3 Integration Tests

Integration tests check whether components work together.

For example:

1. Send a request to the coordinator.
2. Confirm the expected worker is selected.
3. Confirm the worker output reaches the next step.
4. Confirm the final result is valid.

## 32.4 Failure Tests

Simulate:

- A worker exception.
- A malformed response.
- A network timeout.
- A failed prerequisite.
- A rejected approval.
- A repeated task.
- A cancelled workflow.

## 32.5 Test the Negative Path

Do not test only successful execution.

A workflow is not reliable merely because its happy path works.

## 32.6 Mock External Services

Use mocks or fakes to test orchestration without making real API requests.

This makes tests:

- Faster.
- Cheaper.
- More repeatable.
- Less dependent on external availability.

## 32.7 Deterministic Assertions

Prefer checks against explicit behavior.

Examples:

- The correct route was selected.
- A worker was not called when approval was rejected.
- A failed dependency prevented downstream execution.
- Retry attempts did not exceed the configured maximum.
- The final state contains the expected fields.

---

# 🔐 33. Security and Reliability

## 33.1 Treat Model Outputs as Untrusted

An LLM may return:

- Invalid categories.
- Missing fields.
- Unsupported claims.
- Incorrect tool parameters.
- Unexpected content.

Validate model output before using it to control external actions.

## 33.2 Tool Allowlists

Define approved tools and operations.

Do not let model-generated text determine an arbitrary Python import, shell command, or executable function.

## 33.3 Prompt Injection

An agent may encounter instructions embedded in documents, websites, or other external data.

Treat retrieved content as data, not as trusted system instructions.

Keep permissions and tool authorization outside the model's unrestricted control.

## 33.4 State Validation

Validate state at workflow boundaries.

Check:

- Required fields.
- Allowed status values.
- Correct task identifiers.
- Expected data types.
- Approved actions.
- Valid dependency references.

## 33.5 Fail Closed for Sensitive Actions

If authorization cannot be verified, do not execute a sensitive action.

A system should not treat a missing approval record as approval.

## 33.6 Output Validation

Before returning or publishing a result, verify:

- Required sections exist.
- The output follows the expected schema.
- Unsupported claims are handled appropriately.
- Sensitive data is not exposed.
- The response matches the requested task.

## 33.7 Auditability

Record important decisions and state changes.

For high-impact operations, keep sufficient audit information to reconstruct what happened without storing unnecessary sensitive content.

---

# 🚫 34. Common Mistakes

## 34.1 Using Too Many Agents

**Problem:** Every small operation receives a separate agent.

**Why it fails:** Coordination costs more than the work.

**Better approach:** Use ordinary functions for deterministic operations and agents where reasoning or flexible tool use is valuable.

## 34.2 One Agent Does Everything

**Problem:** A single agent has many unrelated responsibilities.

**Why it fails:** Instructions, state, permissions, and debugging become complicated.

**Better approach:** Separate responsibilities when there is a clear benefit.

## 34.3 Unbounded Loops

**Problem:** The agent can continue indefinitely.

**Why it fails:** Cost and duration become unpredictable.

**Better approach:** Enforce iteration, time, and budget limits.

## 34.4 Unlimited Parallel Requests

**Problem:** The workflow launches too many operations at once.

**Why it fails:** Rate limits, resource exhaustion, and service errors increase.

**Better approach:** Use bounded concurrency and rate limiting.

## 34.5 Shared State Without Ownership

**Problem:** Every worker can modify every field.

**Why it fails:** Results can overwrite one another.

**Better approach:** Define field ownership and merge policies.

## 34.6 Blind Retries

**Problem:** Every exception triggers a retry.

**Why it fails:** Permanent errors repeat, and side effects may be duplicated.

**Better approach:** Classify errors and retry only when safe.

## 34.7 Trusting Model Routing

**Problem:** The model can choose any tool or destination.

**Why it fails:** Invalid or unsafe actions may execute.

**Better approach:** Validate route names and enforce permissions in code.

## 34.8 No Completion Criteria

**Problem:** The workflow stops when the model says it is finished.

**Why it fails:** Required tasks may be missing.

**Better approach:** Define measurable completion conditions.

## 34.9 No Observability

**Problem:** A failed workflow produces only a generic error.

**Why it fails:** Developers cannot identify the failing stage.

**Better approach:** Add task IDs, structured logs, traces, and meaningful errors.

## 34.10 Confusing Framework Features with Guarantees

**Problem:** The team assumes a graph or agent framework automatically solves reliability.

**Why it fails:** External side effects, authorization, retries, and recovery still need correct design.

**Better approach:** Verify each guarantee in the current documentation and test it in the application.

---

# 🚀 35. Mini-Project: Intelligent Research Orchestrator

## 35.1 Project Description

Build a research application that coordinates multiple logical workers to produce a reviewed report.

The system should be modular, testable, and designed with explicit execution limits.

## 35.2 User Story

A user enters a research topic.

The application:

1. Validates the topic.
2. Creates a research task.
3. Runs independent research workers.
4. Aggregates their findings.
5. Analyzes the combined information.
6. Reviews the draft.
7. Produces a final result.
8. Records workflow status.

## 35.3 Architecture

```text
                 User Request
                      |
                      v
                Input Validator
                      |
                      v
                  Coordinator
                      |
              +-------+-------+
              |               |
              v               v
        Research Worker A  Research Worker B
              |               |
              +-------+-------+
                      |
                      v
                Result Merger
                      |
                      v
                 Analyst
                      |
                      v
                 Reviewer
                      |
             +--------+--------+
             |                 |
             v                 v
          Approved          Needs Work
             |                 |
             v                 v
          Finalize       Bounded Revision
             |                 |
             +--------+--------+
                      |
                      v
                  Final Output
```

## 35.4 Suggested Project Structure

```text
intelligent-research-orchestrator/
│
├── README.md
├── requirements.txt
├── .env.example
├── .gitignore
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── coordinator.py
│   ├── state.py
│   ├── schemas.py
│   ├── routing.py
│   │
│   ├── workers/
│   │   ├── __init__.py
│   │   ├── researcher.py
│   │   ├── analyst.py
│   │   └── reviewer.py
│   │
│   ├── orchestration/
│   │   ├── __init__.py
│   │   ├── sequential.py
│   │   ├── parallel.py
│   │   └── recovery.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── logging_config.py
│
└── tests/
    ├── test_routing.py
    ├── test_workers.py
    ├── test_coordinator.py
    └── test_recovery.py
```

## 35.5 Phase 1: Input Validation

Implement:

- Empty-input rejection.
- Topic length limits.
- Valid workflow options.
- Explicit error messages.

## 35.6 Phase 2: Define the State

Include:

- Workflow identifier.
- Topic.
- Current status.
- Task statuses.
- Research results.
- Review feedback.
- Error records.

Avoid storing secrets in workflow state.

## 35.7 Phase 3: Implement Workers

Build deterministic mock workers first.

Each worker should:

- Accept a clearly defined input.
- Return a documented output.
- Raise meaningful exceptions.
- Avoid unnecessary side effects.

Replace mock workers with model-powered agents only after the orchestration logic is tested.

## 35.8 Phase 4: Add Parallel Research

Run independent research operations concurrently.

Add a concurrency limit.

Define what happens if one researcher fails.

## 35.9 Phase 5: Aggregate Results

Combine findings while preserving their source metadata.

Detect duplicate records when useful.

Do not merge conflicting claims into a misleading statement.

## 35.10 Phase 6: Add Review

The reviewer should check explicit criteria, such as:

- Required sections exist.
- Claims have evidence.
- Important limitations are stated.
- The output addresses the topic.
- The result meets the expected schema.

## 35.11 Phase 7: Add Recovery

Implement:

- Bounded retries.
- Timeouts.
- Error recording.
- Safe fallback behavior.
- A clear terminal failure status.

## 35.12 Phase 8: Add Tests

Test the normal workflow and failure scenarios.

Include tests for:

- Empty topics.
- Missing findings.
- Failed researchers.
- Invalid review results.
- Maximum retry limits.
- Partial results.
- Cancellation.

## 35.13 Phase 9: Add Observability

Record:

- Workflow start and completion.
- Task transitions.
- Worker errors.
- Retry counts.
- Total duration.
- Final status.

Do not expose private data in logs.

## 35.14 Phase 10: Optional Framework Integration

Once the plain Python implementation works, migrate the workflow to LangGraph or another appropriate framework if graph execution, persistence, or advanced coordination justifies it.

Do not rewrite a working application merely to use a framework.

## 35.15 Acceptance Criteria

The project is complete when:

- The request is validated.
- Tasks have explicit responsibilities.
- Dependencies are respected.
- Independent work can run concurrently.
- Results are validated before use.
- Failures produce meaningful statuses.
- Retries are bounded.
- Sensitive actions require appropriate authorization.
- Tests cover successful and failed execution.
- The architecture is documented.

---

# 📝 36. Exercises

## 🟢 Beginner Exercises

### Exercise 1: Explain Orchestration

Explain orchestration in your own words.

Include one practical example.

### Exercise 2: Identify the Components

For a customer support application, identify:

- The orchestrator.
- The workers.
- The tools.
- The shared state.
- The final output.

### Exercise 3: Build a Sequential Workflow

Create three Python functions that:

1. Validate an input.
2. Process it.
3. Return a result.

Connect them in one orchestrator.

### Exercise 4: Add Conditional Routing

Create two worker functions.

Route requests according to an explicit category.

Reject unsupported categories.

### Exercise 5: Define Completion

Write three conditions that must be true before a research workflow is complete.

---

## 🟡 Intermediate Exercises

### Exercise 6: Parallel Research

Create three asynchronous workers.

Run them concurrently and aggregate their results.

### Exercise 7: Dependency Validation

Represent tasks as a directed graph.

Reject unknown dependencies.

Detect circular dependencies.

### Exercise 8: Retry Policy

Write a retry function that:

- Allows a configurable maximum number of attempts.
- Retries only selected errors.
- Stops after success.
- Raises the final error after the retry limit.

### Exercise 9: Shared State

Design a state structure for a document processing workflow.

Separate input, execution, result, and control state.

### Exercise 10: Failure Handling

Simulate one failed worker.

Ensure the workflow records the failure and does not falsely report complete success.

---

## 🔴 Advanced Exercises

### Exercise 11: Multi-Agent Coordinator

Create a coordinator with research, analysis, and review workers.

Define the responsibility and output of each worker.

### Exercise 12: Approval Gate

Add an approval step before a simulated publishing action.

Ensure rejected approval prevents execution.

### Exercise 13: Bounded Revision

Allow a reviewer to request revisions.

Set a maximum revision count and return a clear failure or escalation status when the limit is reached.

### Exercise 14: Observability

Add structured logs containing workflow and task identifiers.

Record errors without exposing secrets.

### Exercise 15: Framework Comparison

Implement a small workflow in plain Python.

Then compare whether LangGraph provides meaningful benefits for your requirements.

Document the trade-offs.

---

# 🎤 37. Interview Questions and Answers

## Q1. What is agent orchestration?

**Answer:** Agent orchestration coordinates agents, tools, tasks, state, and execution rules to complete a larger objective.

## Q2. What is the difference between an agent and an orchestrator?

**Answer:** An agent performs a task using its capabilities. An orchestrator coordinates task execution, routing, dependencies, and results.

## Q3. What is the difference between a workflow and an orchestrator?

**Answer:** A workflow describes connected execution steps. An orchestrator manages or executes those steps and may make routing or recovery decisions.

## Q4. When should you use multiple agents?

**Answer:** When specialization, parallel execution, or independent verification provides enough value to justify the additional coordination complexity.

## Q5. What is sequential orchestration?

**Answer:** A pattern where tasks execute in a defined order, often passing outputs from one step to the next.

## Q6. What is parallel orchestration?

**Answer:** A pattern where independent tasks run concurrently and their results are collected or combined.

## Q7. When is parallel execution unsafe?

**Answer:** When tasks depend on one another, mutate shared state without protection, exceed resource limits, or create conflicting external side effects.

## Q8. What is conditional routing?

**Answer:** Selecting a workflow path according to an input, validated classification, or current state.

## Q9. What is hierarchical orchestration?

**Answer:** Dividing a large objective into smaller tasks and delegating those tasks to sub-coordinators or specialized workers.

## Q10. What is a handoff?

**Answer:** A transfer of responsibility from one agent or workflow component to another.

## Q11. What should a handoff contain?

**Answer:** The objective, relevant context, constraints, expected output, and necessary task metadata.

## Q12. Why is shared state important?

**Answer:** It preserves information and progress across workflow steps so components can coordinate and produce a consistent result.

## Q13. What is a DAG?

**Answer:** A directed acyclic graph that represents tasks and dependencies without circular paths.

## Q14. What is topological ordering?

**Answer:** An ordering of graph nodes that respects all directed dependency edges.

## Q15. What is bounded retry?

**Answer:** A retry policy with a maximum number of attempts or a deadline.

## Q16. Why are blind retries dangerous?

**Answer:** They can repeat permanent failures, waste resources, and duplicate external side effects.

## Q17. What is idempotency?

**Answer:** The property that repeating an operation produces the same intended final effect rather than duplicating it.

## Q18. Why use timeouts?

**Answer:** Timeouts prevent a workflow from waiting indefinitely for an operation.

## Q19. What is bounded concurrency?

**Answer:** Limiting the number of operations allowed to execute concurrently.

## Q20. What is the difference between concurrency and parallelism?

**Answer:** Concurrency allows operations to make progress during overlapping periods. Parallelism means operations execute at the same time.

## Q21. Why should model-selected routes be validated?

**Answer:** A model can return invalid or unsafe choices. An allowlist ensures only supported destinations can execute.

## Q22. What is human-in-the-loop orchestration?

**Answer:** A workflow that pauses for human input, review, or approval before continuing.

## Q23. Why separate approval from execution?

**Answer:** It makes authorization explicit, prevents unapproved actions, and improves auditability.

## Q24. What is observability?

**Answer:** The ability to understand system behavior using logs, metrics, traces, and execution records.

## Q25. What is a correlation ID?

**Answer:** An identifier that connects related events across tasks or services within a workflow.

## Q26. What does LangGraph provide?

**Answer:** Graph-based stateful workflow capabilities, including nodes, edges, conditional routing, and checkpointing features.

## Q27. What does the OpenAI Agents SDK provide?

**Answer:** Components for building agent applications, including agents, tools, handoffs, execution, and tracing capabilities.

## Q28. Does checkpointing guarantee exactly-once external actions?

**Answer:** No. External side effects still require appropriate idempotency, deduplication, or transaction handling.

## Q29. How do you prevent infinite agent loops?

**Answer:** Use maximum iteration counts, deadlines, budgets, explicit completion conditions, and appropriate repeated-action checks.

## Q30. How do you decide whether to use an orchestration framework?

**Answer:** Evaluate the application's state, branching, recovery, persistence, observability, and scaling needs. Use plain Python when it is sufficient.

---

# 📌 38. Cheat Sheet

## 38.1 Main Concepts

| Concept | Meaning |
|---|---|
| Orchestrator | Coordinates execution |
| Worker | Performs an assigned task |
| Router | Selects a workflow destination |
| Handoff | Transfers responsibility |
| State | Stores workflow information |
| DAG | Represents task dependencies |
| Aggregator | Combines worker results |
| Retry | Repeats a permitted operation after failure |
| Timeout | Limits waiting time |
| Checkpoint | Saves execution state |
| Trace | Connects related execution events |
| Approval gate | Requires authorization before proceeding |

## 38.2 Common Patterns

| Pattern | Use |
|---|---|
| Sequential | Fixed task order |
| Parallel | Independent operations |
| Conditional | Select among branches |
| Loop-based | Bounded repetition |
| Hierarchical | Large goal decomposition |
| Map-reduce | Process many items and aggregate |
| Event-driven | React to events |
| Human-in-the-loop | Require human input or approval |

## 38.3 Reliability Rules

- Validate inputs.
- Validate model outputs.
- Define task dependencies.
- Use bounded retries.
- Apply timeouts.
- Limit concurrency.
- Define completion criteria.
- Record failures.
- Protect external side effects.
- Enforce permissions outside model-generated text.
- Preserve useful state.
- Test negative paths.

## 38.4 Architecture Rules

- Start with the simplest viable design.
- Keep task responsibilities clear.
- Separate business logic from orchestration.
- Use structured outputs.
- Give each worker only the tools it needs.
- Avoid unrestricted shared-state mutation.
- Make routing decisions observable.
- Use frameworks when their capabilities justify their complexity.

## 38.5 Python Tools to Know

| Tool | Purpose |
|---|---|
| `dataclasses` | Define structured Python objects |
| `typing` | Express types and interfaces |
| `asyncio` | Coordinate asynchronous tasks |
| `asyncio.gather()` | Collect results from concurrent awaitables |
| `asyncio.wait_for()` | Apply a timeout to an awaitable |
| `asyncio.Semaphore` | Limit concurrent access |
| `logging` | Record application events |
| `pytest` | Test workflow behavior |

---

# 📖 39. Glossary

**Agent:** A component that uses a model, tools, or state to perform a task.

**Agent orchestration:** Coordination of agents and other components to complete a larger objective.

**Aggregation:** Combining outputs from multiple tasks.

**Approval gate:** A workflow checkpoint that requires authorization.

**Backpressure:** A mechanism that prevents incoming work from overwhelming downstream components.

**Checkpoint:** A saved representation of workflow execution state.

**Concurrency:** Overlapping progress of multiple operations.

**Coordinator:** A component responsible for assigning work and managing overall execution.

**Correlation ID:** An identifier that links related events.

**DAG:** A directed graph with no cycles.

**Dependency:** A relationship requiring one task to finish before another can proceed.

**Deterministic workflow:** A workflow whose control flow follows defined rules rather than unrestricted model decisions.

**Fallback:** An alternative behavior used when the preferred operation fails or is unavailable.

**Handoff:** Transfer of responsibility to another agent or component.

**Hierarchical orchestration:** Coordination through multiple levels of delegation.

**Idempotency:** A property that prevents repeated operations from producing unintended duplicate effects.

**Observability:** The ability to understand execution behavior through collected telemetry.

**Orchestrator:** The component that coordinates workflow execution.

**Parallelism:** Simultaneous execution of operations.

**Rate limit:** A restriction on how frequently a service can be called.

**Retry policy:** Rules governing whether and how a failed operation is attempted again.

**Router:** A component that selects a destination or execution path.

**Shared state:** Information accessible to multiple workflow components.

**Task:** A defined unit of work.

**Timeout:** A limit on how long an operation may wait.

**Trace:** A connected record of related operations in a workflow.

**Worker:** A component that executes an assigned task.

---

# 🔗 40. Official Learning Resources

Use official documentation as APIs and framework capabilities evolve.

## 40.1 Python

- **Python documentation:** https://docs.python.org/3/
- **`asyncio`:** https://docs.python.org/3/library/asyncio.html
- **`dataclasses`:** https://docs.python.org/3/library/dataclasses.html
- **`logging`:** https://docs.python.org/3/library/logging.html
- **`unittest`:** https://docs.python.org/3/library/unittest.html

## 40.2 LangGraph and LangChain

- **LangGraph overview:** https://docs.langchain.com/oss/python/langgraph/overview
- **LangChain documentation:** https://docs.langchain.com/

Focus on state, graph execution, conditional routing, persistence, and human-in-the-loop workflows.

## 40.3 OpenAI Agents SDK

- **Agents SDK for Python:** https://openai.github.io/openai-agents-python/
- **OpenAI developer platform:** https://platform.openai.com/docs

Focus on agent definitions, tools, handoffs, execution, and tracing.

## 40.4 Agent Design

- **Anthropic — Building Effective Agents:** https://www.anthropic.com/research/building-effective-agents

Study the distinction between predictable workflows and systems that require more dynamic agent behavior.

## 40.5 Testing

- **pytest documentation:** https://docs.pytest.org/

Learn fixtures, parametrized tests, exception assertions, and test isolation.

## 40.6 Suggested Study Order

1. Review the orchestration patterns in this README.
2. Implement sequential execution in plain Python.
3. Implement conditional routing.
4. Add parallel execution.
5. Add failure handling and tests.
6. Build the research orchestrator.
7. Explore LangGraph.
8. Explore the OpenAI Agents SDK.
9. Compare framework designs against your project requirements.

---

# ✅ 41. Completion Checklist

## Concepts

- [ ] I can explain agent orchestration in simple English.
- [ ] I understand the difference between an agent, workflow, and orchestrator.
- [ ] I can identify the responsibilities of a coordinator.
- [ ] I understand sequential orchestration.
- [ ] I understand parallel orchestration.
- [ ] I understand conditional routing.
- [ ] I understand hierarchical orchestration.
- [ ] I can explain task dependencies and DAGs.
- [ ] I understand handoffs and shared state.
- [ ] I know when a single agent is sufficient.

## Python Implementation

- [ ] I have implemented a sequential workflow.
- [ ] I have implemented a conditional router.
- [ ] I have used `asyncio` for concurrent tasks.
- [ ] I have created structured task results.
- [ ] I have validated task inputs and outputs.
- [ ] I have separated worker logic from orchestration logic.
- [ ] I have implemented a bounded retry policy.
- [ ] I have added timeout handling.
- [ ] I have defined explicit task statuses.

## Reliability and Security

- [ ] I can distinguish transient errors from permanent errors.
- [ ] I understand idempotency.
- [ ] I can explain why concurrency needs limits.
- [ ] I validate model-generated routing decisions.
- [ ] I understand least-privilege tool access.
- [ ] I can add a human approval gate.
- [ ] I know why checkpointing does not guarantee exactly-once side effects.
- [ ] I have tested failed tasks and invalid inputs.
- [ ] I understand the importance of logs and traces.

## Frameworks

- [ ] I understand the basic purpose of LangGraph.
- [ ] I understand the basic purpose of the OpenAI Agents SDK.
- [ ] I have reviewed the official documentation.
- [ ] I can explain when plain Python is sufficient.
- [ ] I can justify a framework choice based on requirements.

## Mini-Project

- [ ] I have built the research orchestrator.
- [ ] I have defined clear worker responsibilities.
- [ ] I have connected the workflow steps.
- [ ] I have tested result aggregation.
- [ ] I have added error handling.
- [ ] I have documented the architecture.
- [ ] I have written tests for normal and failed execution.
- [ ] I can explain the system from input to final output.

---

# 🎓 Final Summary

**Agent orchestration turns separate capabilities into a coordinated system.**

A strong orchestrator:

1. **Defines clear tasks.**
2. **Respects dependencies.**
3. **Selects the correct execution pattern.**
4. **Controls how agents and tools are used.**
5. **Validates inputs and outputs.**
6. **Handles errors and resource limits.**
7. **Tracks state and execution.**
8. **Protects sensitive actions.**
9. **Tests both success and failure paths.**
10. **Stops when explicit completion conditions are met.**

Remember these principles:

- **Start simple.**
- **Use multiple agents only when they add value.**
- **Make control flow explicit.**
- **Keep state structured.**
- **Bound retries, loops, and concurrency.**
- **Validate every important boundary.**
- **Design for failure before deploying to production.**

Your next module is **05 — Multi-Agent Systems**, where you will go deeper into agent specialization, collaboration, coordination strategies, communication, shared work, conflict resolution, and multi-agent architecture. 🚀
