
# 🤝 Multi-Agent Systems — Building Collaborative AI Teams

> **Course:** Agentic AI Engineering
> **Module:** 05 — Multi-Agent Systems
> **Study Duration:** 2 Days
> **Level:** Intermediate to Advanced
> **Prerequisites:** Agentic AI fundamentals, state graphs, planning, and agent orchestration
> **Primary Goal:** Design, implement, coordinate, and evaluate systems in which multiple AI agents collaborate to solve complex problems.
> **Learning Approach:** Fundamentals → Architectures → Communication → Python → Frameworks → Testing → Project 🚀

---

# 📚 Table of Contents

1. Module Overview
2. Learning Objectives
3. What Are Multi-Agent Systems?
4. Why Multi-Agent Systems Matter
5. Single-Agent vs Multi-Agent Architectures
6. Core Components
7. Agent Roles and Specialization
8. Multi-Agent Architecture Patterns
9. Centralized Coordination
10. Decentralized Coordination
11. Manager-Worker Architecture
12. Peer-to-Peer Collaboration
13. Pipeline-Based Collaboration
14. Debate and Independent Review
15. Blackboard Architecture
16. Agent Communication
17. Structured Messages
18. Shared Memory and Shared State
19. Task Assignment and Delegation
20. Agent Discovery and Selection
21. Collaboration Protocols
22. Conflict Resolution
23. Consensus and Voting
24. Multi-Agent Planning
25. Dependency Management
26. Parallel Agent Execution
27. Failure Handling
28. Agent Lifecycle Management
29. Agent Permissions and Trust
30. Context Isolation
31. Multi-Agent Systems with Python
32. Build a Manager-Worker System
33. Build Parallel Research Agents
34. Build an Independent Review System
35. Multi-Agent Systems with LangGraph
36. Multi-Agent Systems with the OpenAI Agents SDK
37. Framework Selection
38. Evaluation and Testing
39. Observability and Debugging
40. Security and Reliability
41. Common Mistakes
42. Mini-Project
43. Practical Exercises
44. Interview Questions and Answers
45. Cheat Sheet
46. Glossary
47. Official Learning Resources
48. Completion Checklist

---

# 🎯 1. Module Overview

## 1.1 What You Will Learn

A multi-agent system uses multiple agents to work toward a shared or coordinated objective.

In this module, you will learn how to:

- Design agents with distinct responsibilities.
- Select appropriate multi-agent architectures.
- Assign tasks to specialized agents.
- Pass structured information between agents.
- Coordinate independent and dependent tasks.
- Manage shared state and collaboration.
- Handle conflicting results.
- Combine findings from multiple workers.
- Evaluate whether collaboration improves quality.
- Build a working multi-agent application in Python.

## 1.2 Why This Module Is Important

An individual agent can perform many useful tasks.

However, some problems benefit from multiple specialized agents.

For example, a research system may use:

- A researcher to gather evidence.
- An analyst to interpret findings.
- A critic to identify weaknesses.
- A fact-checker to verify claims.
- A writer to prepare the final report.

The challenge is not merely creating these agents.

**The real challenge is coordinating their responsibilities, communication, state, tools, and results reliably.**

## 1.3 What You Will Build

By the end of this module, you should have implemented:

1. A manager-worker system.
2. A parallel research system.
3. An independent review workflow.
4. A result aggregation mechanism.
5. A conflict detection and resolution strategy.
6. A multi-agent research mini-project.

You will begin with deterministic Python workers and then explore how to replace them with LLM-powered agents.

---

# 🎯 2. Learning Objectives

## 2.1 Conceptual Objectives

Understand:

- What a multi-agent system is.
- Why agent specialization matters.
- How centralized and decentralized systems differ.
- How agents communicate.
- How agents coordinate shared tasks.
- How consensus and conflict resolution work.
- Why multi-agent systems can fail despite having capable agents.

## 2.2 Technical Objectives

Be able to:

- Define agent roles and responsibilities.
- Represent tasks and messages using structured data.
- Delegate work to specialized workers.
- Run independent workers concurrently.
- Aggregate and validate results.
- Detect conflicting findings.
- Handle unavailable or failed agents.
- Test multi-agent behavior.
- Record execution details for debugging.

## 2.3 Production Objectives

Learn to:

- Restrict agents to approved tools.
- Avoid uncontrolled delegation.
- Limit message and task growth.
- Prevent shared-state corruption.
- Validate agent-generated outputs.
- Track cost, latency, and success rates.
- Design safe approval boundaries.

## 2.4 Definition of Done

You should be able to explain why your architecture uses multiple agents, identify the responsibility of each agent, demonstrate how information flows between them, and test how the system behaves when a worker fails or returns incorrect information.

---

# 🧠 3. What Are Multi-Agent Systems?

## 3.1 Definition

A **multi-agent system (MAS)** is a system containing multiple agents that interact with one another or with a shared environment to achieve individual or collective objectives.

In an AI application, these agents may use:

- Language models.
- Tools.
- Instructions.
- Memory.
- External services.
- Specialized knowledge.
- Different execution permissions.

They can cooperate, compete, negotiate, or independently evaluate the same problem.

## 3.2 Simple Example

Imagine building a technical research report.

```text
                  Research Goal
                       |
                       v
                 Research Manager
                       |
          +------------+------------+
          |            |            |
          v            v            v
      Researcher     Analyst      Reviewer
          |            |            |
          +------------+------------+
                       |
                       v
                 Result Aggregator
                       |
                       v
                  Final Report
```

The researcher gathers information.

The analyst interprets it.

The reviewer checks the quality.

The manager coordinates the workflow.

## 3.3 What Makes It Multi-Agent?

A system is not meaningfully multi-agent simply because it makes several model calls.

A useful multi-agent design has distinguishable responsibilities or execution contexts that interact to complete a larger objective.

For example:

- Multiple independent research workers.
- A coordinator delegating to specialized agents.
- An agent transferring responsibility to another agent.
- Independent reviewers evaluating the same output.

A single agent making five tool calls is not automatically a multi-agent system.

## 3.4 Common Characteristics

Multi-agent systems often include:

- **Multiple agents:** More than one distinct execution component.
- **Responsibilities:** Each agent has a defined role.
- **Interaction:** Agents exchange information or results.
- **Coordination:** Work is organized toward an objective.
- **Environment:** Agents operate within a shared application or external system.
- **Policies:** Rules govern their behavior and permissions.

Not every system requires every agent to have its own language model.

A deterministic Python worker can participate in a multi-agent architecture.

---

# 🔍 4. Why Multi-Agent Systems Matter

## 4.1 Specialization

Different tasks may require different instructions, tools, or context.

For example:

| Agent | Responsibility |
|---|---|
| Researcher | Find relevant evidence |
| Analyst | Interpret evidence |
| Reviewer | Identify weaknesses |
| Writer | Produce the final document |
| Coordinator | Manage the overall process |

Specialization helps make responsibilities explicit.

## 4.2 Independent Work

Some tasks can be performed separately.

For example, three workers may research different aspects of a technology.

Their results can later be combined.

## 4.3 Independent Verification

A separate reviewer can evaluate an output against defined requirements.

However, reviewers may share the same model weaknesses or rely on the same incorrect evidence.

Independent review improves the opportunity to detect errors; it does not guarantee correctness.

## 4.4 Different Tools

Different agents may need different capabilities.

For example:

- A research agent may access approved search tools.
- A coding agent may access a sandboxed development environment.
- A reporting agent may format documents.
- A publishing agent may require additional approval.

## 4.5 When Multi-Agent Systems Are Not Helpful

Avoid additional agents when:

- The task is simple.
- A normal Python function is sufficient.
- Tasks cannot be meaningfully separated.
- Workers repeatedly duplicate each other's work.
- Communication overhead exceeds the benefits.
- The application cannot validate the combined result.

**The goal is better system performance, not a larger number of agents.**

---

# ⚖️ 5. Single-Agent vs Multi-Agent Architectures

## 5.1 Single-Agent Architecture

```text
User
 |
 v
Agent
 |
 +----> Tool A
 |
 +----> Tool B
 |
 v
Result
```

One agent handles the objective and its tools.

### Advantages

- Simpler control flow.
- Lower coordination overhead.
- Fewer model calls in many applications.
- Easier debugging.
- Less inter-agent communication.

### Limitations

- Responsibilities can become broad.
- Context can become overloaded.
- Independent verification may be harder to organize.
- Complex tasks may require extensive internal planning.

## 5.2 Multi-Agent Architecture

```text
User
 |
 v
Coordinator
 |
 +----> Agent A
 |
 +----> Agent B
 |
 +----> Agent C
 |
 v
Validate and Aggregate
 |
 v
Result
```

### Advantages

- Specialized responsibilities.
- Potential parallel execution.
- Explicit review boundaries.
- Modular testing.
- Different tool permissions.

### Limitations

- More complex state management.
- Additional model calls and cost.
- Conflicting outputs.
- More failure points.
- More difficult debugging.
- Potential duplication.

## 5.3 Comparison

| Dimension | Single Agent | Multi-Agent |
|---|---|---|
| Architecture | Simpler | More coordination |
| Specialization | Within one agent | Across agents |
| Parallel work | Possible through tools | Natural when tasks are independent |
| Independent review | Requires a separate review step | Can use a dedicated reviewer |
| Cost | Often lower | May be higher |
| Debugging | Usually simpler | Requires cross-agent tracing |
| Shared state | Often limited | Needs explicit coordination |
| Best use | Coherent, manageable tasks | Separable tasks with useful collaboration |

## 5.4 Practical Decision Rule

Start with a single agent or deterministic workflow.

Introduce additional agents only when you can explain the specific benefit they provide.

---

# 🧩 6. Core Components

## 6.1 Agent

An agent performs a defined task.

A useful agent definition specifies:

- Name.
- Role.
- Instructions.
- Input.
- Output.
- Tools.
- Permissions.
- Success criteria.
- Failure behavior.

## 6.2 Coordinator

The coordinator manages the overall task.

It may:

- Break down the objective.
- Assign work.
- Track completion.
- Resolve dependencies.
- Handle worker failures.
- Aggregate results.
- Decide when to stop.

## 6.3 Message

A message transfers information between components.

It should include enough information for the receiving agent to understand the task.

## 6.4 Task Registry

A task registry records the tasks in a workflow.

Useful fields include:

- Task ID.
- Assigned agent.
- Status.
- Dependencies.
- Input reference.
- Output reference.
- Error details.

## 6.5 Shared State

Shared state contains information that multiple agents need.

Examples include:

- The original objective.
- Task assignments.
- Completed findings.
- Review feedback.
- Workflow status.

## 6.6 Aggregator

The aggregator combines worker outputs.

It should preserve important source information, identify duplicates, and avoid hiding disagreements.

## 6.7 Validator

The validator checks outputs against explicit rules.

Examples:

- Required fields exist.
- Sources are included.
- The response follows a schema.
- The agent did not exceed its permissions.
- The result meets task-specific criteria.

---

# 👥 7. Agent Roles and Specialization

## 7.1 Why Define Roles?

Without clear responsibilities, agents may repeat the same tasks or disagree about who should act.

A role establishes the agent's scope.

## 7.2 Common Roles

### Coordinator Agent

Responsible for task allocation and overall completion.

### Research Agent

Finds evidence and records sources.

### Analysis Agent

Interprets evidence and identifies relationships.

### Coding Agent

Produces or reviews code within a defined scope.

### Testing Agent

Checks expected behavior and identifies failures.

### Critic Agent

Challenges assumptions and identifies weaknesses.

### Fact-Checking Agent

Verifies claims against appropriate evidence.

### Reporting Agent

Turns validated findings into a readable deliverable.

## 7.3 Write Role Instructions Carefully

Weak instruction:

```text
You are a smart AI agent. Help with the task.
```

Better instruction:

```text
You are a research worker.

Your responsibilities:
1. Investigate the assigned question.
2. Return concise findings.
3. Include source references when available.
4. Identify uncertainty and missing evidence.
5. Do not write the final report.
6. Do not invent sources.
```

The second version defines a clearer contract.

## 7.4 Avoid Overlapping Roles

If two agents have almost identical responsibilities, ask whether both are necessary.

Separate agents should differ in a meaningful way, such as:

- Data access.
- Tool permissions.
- Evaluation criteria.
- Subject specialization.
- Independent evidence sources.
- Task ownership.

## 7.5 Role Does Not Equal Authority

An agent's name does not enforce its permissions.

A worker named `Reviewer` should not automatically receive access to sensitive systems.

Implement permissions in code and infrastructure.

---

# 🏗️ 8. Multi-Agent Architecture Patterns

## 8.1 Common Patterns

Multi-agent systems can use several architectural patterns.

| Pattern | Main Idea |
|---|---|
| Manager-worker | A manager assigns work to workers |
| Peer-to-peer | Agents coordinate more directly |
| Pipeline | Outputs flow through a sequence |
| Parallel specialists | Independent workers solve different subtasks |
| Debate | Agents present and challenge positions |
| Independent review | Separate agents evaluate the same output |
| Blackboard | Agents contribute to shared workspace state |
| Hierarchical | Coordinators delegate to lower-level coordinators |
| Market-based | Agents bid or compete to perform tasks |

## 8.2 Choosing a Pattern

Consider:

- How much control is required?
- Are tasks independent?
- Is shared state necessary?
- Does the system need independent review?
- Can agents choose their own work?
- What is the cost of a coordination error?
- How difficult will debugging be?

## 8.3 Prefer Explicit Coordination

For a beginner project, a manager-worker architecture is usually easier to understand and test than unrestricted peer-to-peer communication.

Start with clear assignments and explicit outputs.

---

# 🎛️ 9. Centralized Coordination

## 9.1 Definition

A centralized system uses one coordinator to control the overall workflow.

```text
                 Coordinator
                /     |     \
               v      v      v
           Agent A  Agent B  Agent C
```

The coordinator assigns tasks and determines how results are combined.

## 9.2 Advantages

- Clear task ownership.
- Easier workflow auditing.
- Centralized permission checks.
- Explicit completion conditions.
- Easier conflict resolution.

## 9.3 Disadvantages

- The coordinator may become a bottleneck.
- A coordinator failure may stop the workflow.
- Large workflows can overload the coordinator with information.

## 9.4 Suitable Use Cases

Use centralized coordination when:

- A single objective drives the workflow.
- Task assignment needs strict control.
- Outputs must pass through a validation process.
- Sensitive actions require explicit authorization.

## 9.5 Practical Rule

Keep the coordinator responsible for the workflow, even when workers make local decisions within their assigned tasks.

---

# 🌐 10. Decentralized Coordination

## 10.1 Definition

In a decentralized architecture, agents or services coordinate without relying on one central component for every decision.

```text
Agent A <----> Agent B
   ^              |
   |              v
Agent C <------> Agent D
```

Coordination may happen through messages, shared state, events, or agreed protocols.

## 10.2 Advantages

- Components can make local decisions.
- Independent services may operate autonomously.
- Event-driven designs can support distributed execution.

## 10.3 Disadvantages

- Global state is harder to maintain.
- Conflicting actions become more likely.
- Debugging requires better tracing.
- Permission boundaries need careful design.
- Coordination protocols can become complex.

## 10.4 When to Use It

Consider decentralized coordination when independent components genuinely need to coordinate without a single central workflow controlling every action.

Do not use it merely to make an architecture appear more advanced.

---

# 🧑‍💼 11. Manager-Worker Architecture

## 11.1 Definition

A manager-worker architecture assigns an overall objective to a manager, which delegates smaller tasks to specialized workers.

```text
               Manager
              /   |   \
             v    v    v
          Worker Worker Worker
             \    |    /
              v   v   v
             Results
                |
                v
             Manager
```

## 11.2 Manager Responsibilities

- Understand the objective.
- Define subtasks.
- Select suitable workers.
- Validate assignments.
- Collect outputs.
- Resolve failures.
- Produce the final result.

## 11.3 Worker Responsibilities

- Accept an assigned task.
- Operate within its scope.
- Use approved capabilities.
- Return a structured result.
- Report failure or uncertainty.
- Avoid taking over unrelated tasks.

## 11.4 Example

A coding manager might delegate:

- Implementation to a coding worker.
- Test creation to a testing worker.
- Security review to a review worker.

The manager collects results and checks that all required conditions are met.

## 11.5 Manager-Worker Risks

The manager may:

- Create unnecessary subtasks.
- Assign work to the wrong worker.
- Accept weak results.
- Forget dependencies.
- Exceed its execution budget.

Use explicit task schemas, validation, and bounded delegation.

---

# 🔄 12. Peer-to-Peer Collaboration

## 12.1 Definition

Peer-to-peer collaboration allows agents to exchange information more directly.

No single agent necessarily controls every interaction.

## 12.2 Example

Two agents analyze different interpretations of a technical problem and exchange their findings.

A third agent may review the disagreement.

## 12.3 Benefits

- Direct exchange of specialized knowledge.
- Less dependence on a central component for every small interaction.
- Potentially useful for independent teams or services.

## 12.4 Risks

- Message volume can grow quickly.
- Agents may repeat arguments.
- Disagreements may never resolve.
- No component may own final completion.

## 12.5 Required Controls

Define:

- Allowed communication partners.
- Message schemas.
- Message limits.
- Timeouts.
- Escalation rules.
- Final decision authority.

Peer-to-peer systems still need clear rules for termination and accountability.

---

# 🔗 13. Pipeline-Based Collaboration

## 13.1 Definition

A pipeline passes outputs from one agent to the next.

```text
Researcher
    |
    v
Analyst
    |
    v
Writer
    |
    v
Reviewer
    |
    v
Final Output
```

## 13.2 When to Use It

Use a pipeline when each stage depends on the output of the previous stage.

Examples:

- Document extraction and analysis.
- Research and report writing.
- Code generation and testing.
- Data cleaning and interpretation.

## 13.3 Advantages

- Clear execution order.
- Easy-to-understand responsibilities.
- Straightforward intermediate validation.
- Simple task-level logging.

## 13.4 Disadvantages

- A slow stage delays later stages.
- A failed stage can block the pipeline.
- Errors may propagate downstream.

## 13.5 Add Validation Between Stages

Do not automatically trust every upstream result.

Before passing output to the next agent, check:

- Required fields.
- Output format.
- Completeness.
- Relevant evidence.
- Allowed content.
- Error status.

---

# ⚡ 14. Debate and Independent Review

## 14.1 Debate Pattern

Agents propose different interpretations or solutions and challenge one another's reasoning.

A coordinator then evaluates the arguments.

```text
             Problem
                |
         +------+------+
         |             |
         v             v
     Agent A         Agent B
         |             |
         +------+------+
                |
                v
          Critical Review
                |
                v
          Final Decision
```

## 14.2 When Debate Helps

It may help with:

- Exploring alternative designs.
- Identifying assumptions.
- Comparing trade-offs.
- Challenging an initial proposal.
- Generating test cases.

## 14.3 Risks of Debate

Debate can produce:

- Repeated arguments.
- Longer execution time.
- Higher cost.
- False confidence.
- Agreement without evidence.

Two agents agreeing does not prove that a claim is true.

## 14.4 Independent Review

Independent review evaluates an output against a separate set of criteria.

For example, a code generator creates a function while a test-oriented agent checks its behavior.

## 14.5 Prefer Evidence-Based Review

A useful reviewer should identify:

- The specific claim or behavior being checked.
- The relevant evidence or test.
- The observed issue.
- The required correction.
- The remaining uncertainty.

Avoid vague reviews such as "This looks good."

---

# 🗂️ 15. Blackboard Architecture

## 15.1 Definition

A blackboard architecture uses a shared workspace where agents contribute information and read relevant results.

```text
          Shared Blackboard
          /       |       \
         v        v        v
     Agent A   Agent B   Agent C
         \        |        /
          +-------+-------+
```

## 15.2 How It Works

1. The workflow initializes a shared state.
2. Agents inspect relevant information.
3. Agents contribute results.
4. Other agents use those results.
5. A coordinator or rule determines completion.

## 15.3 Advantages

- Shared findings can be reused.
- Workers can operate on different parts of the problem.
- Results can accumulate over time.
- Components may be loosely coupled.

## 15.4 Risks

- Conflicting updates.
- Unclear ownership.
- Stale information.
- Duplicate findings.
- Unexpected dependencies.

## 15.5 Safe Blackboard Design

Use:

- Structured records.
- Stable identifiers.
- Explicit ownership.
- Versioning where necessary.
- Validated updates.
- Conflict detection.
- A documented merge policy.

Do not treat a shared text document as an automatically reliable source of truth.

---

# 💬 16. Agent Communication

## 16.1 Why Communication Matters

Agents need to exchange information to coordinate work.

Communication can include:

- Task assignments.
- Requests for information.
- Results.
- Review feedback.
- Status updates.
- Failure notifications.
- Approval requests.

## 16.2 Communication Methods

### Direct Messages

One agent sends a message to another.

### Coordinator-Mediated Messages

Agents send results to the coordinator, which assigns subsequent work.

### Shared State

Agents read and write structured information in a shared store.

### Events

Components react to events such as task completion or failure.

### Message Queues

Distributed workers exchange messages through infrastructure that supports queued delivery.

## 16.3 Select the Simplest Suitable Method

A small application may only need Python function calls and returned objects.

A distributed system may need a message broker or durable queue.

Do not introduce distributed infrastructure unless the requirements justify it.

---

# 📨 17. Structured Messages

## 17.1 Why Structured Messages Matter

Free-form messages can be difficult to validate and process.

A structured message makes important fields explicit.

## 17.2 Example Message

```python
message = {
    "message_id": "msg-001",
    "task_id": "task-001",
    "sender": "coordinator",
    "recipient": "researcher",
    "message_type": "task_assignment",
    "payload": {
        "topic": "Multi-agent collaboration",
        "expected_output": "Findings with supporting sources",
    },
}
```

This is an illustrative dictionary, not a complete communication protocol.

## 17.3 Recommended Fields

| Field | Purpose |
|---|---|
| `message_id` | Identifies a message |
| `task_id` | Connects the message to a task |
| `sender` | Identifies the source |
| `recipient` | Identifies the destination |
| `message_type` | Describes the message category |
| `payload` | Contains task-specific information |
| `created_at` | Records creation time when required |
| `correlation_id` | Connects related messages |

## 17.4 Validate Messages

Check:

- Required fields.
- Allowed message types.
- Known sender and recipient.
- Valid task references.
- Payload schema.
- Message size limits.
- Permission to perform the requested operation.

## 17.5 Message Types

Examples include:

- `task_assignment`
- `task_result`
- `task_failure`
- `review_feedback`
- `status_update`
- `approval_request`
- `cancellation`

Use a documented set of message types.

## 17.6 Message Identity and Duplicate Delivery

Distributed systems may deliver the same message more than once.

Use stable identifiers and deduplication where repeated processing could create duplicate effects.

---

# 🧠 18. Shared Memory and Shared State

## 18.1 Shared State

Shared state stores information required by multiple agents during a workflow.

Example:

```python
state = {
    "workflow_id": "wf-001",
    "objective": "Prepare a research report",
    "tasks": {},
    "findings": [],
    "review_feedback": [],
    "status": "running",
}
```

## 18.2 Shared Memory Is Not the Same as Individual Memory

An agent's private memory may contain information relevant to its own work.

Shared state contains information intended for coordinated use.

These serve different purposes.

## 18.3 Use Clear Ownership

For example:

- The coordinator owns task status.
- The researcher owns its findings.
- The reviewer owns review feedback.
- The finalizer owns the final output.

Other components can read these values without necessarily having permission to overwrite them.

## 18.4 Avoid Context Overload

Do not send every agent every previous message.

Pass only the context required for its assigned task.

This can reduce:

- Token usage.
- Irrelevant information.
- Accidental leakage.
- Conflicting instructions.

## 18.5 Resolve Conflicting Updates

Possible approaches include:

- Separate records per agent.
- Append-only event histories.
- Versioned updates.
- Database transactions.
- Explicit merge functions.
- Coordinator-controlled writes.

Choose an approach based on the application's concurrency and persistence needs.

---

# 🧑‍🔧 19. Task Assignment and Delegation

## 19.1 What Is Delegation?

Delegation assigns a task to another component with suitable capabilities.

A good delegation includes the task, context, constraints, and completion criteria.

## 19.2 Delegation Example

```python
task = {
    "task_id": "research-001",
    "objective": "Investigate agent coordination patterns",
    "constraints": [
        "Use reliable sources",
        "Identify uncertainty",
        "Return concise findings",
    ],
    "expected_output": {
        "findings": "list",
        "sources": "list",
    },
}
```

## 19.3 Assignment Criteria

Choose a worker based on:

- Required expertise.
- Available tools.
- Permissions.
- Current capacity.
- Task dependencies.
- Expected output.
- Cost and latency constraints.

## 19.4 Avoid Unbounded Delegation

Set limits on:

- Total tasks.
- Delegation depth.
- Number of active workers.
- Total execution time.
- Retry count.
- Total resource budget.

## 19.5 Verify Results

The fact that a worker completed its call does not prove it completed the assigned objective.

Validate its output against the task's success criteria.

---

# 🧭 20. Agent Discovery and Selection

## 20.1 Definition

Agent selection chooses an appropriate agent for a task.

For a small system, this can be a fixed mapping.

For a larger system, it may depend on capabilities and current availability.

## 20.2 Simple Registry

```python
AGENTS = {
    "research": {
        "name": "Research Worker",
        "capabilities": ["research", "source_analysis"],
    },
    "coding": {
        "name": "Coding Worker",
        "capabilities": ["python", "debugging"],
    },
    "review": {
        "name": "Review Worker",
        "capabilities": ["validation", "critique"],
    },
}
```

## 20.3 Selection Process

1. Identify the required capabilities.
2. Find approved agents with matching capabilities.
3. Check permissions.
4. Check availability if relevant.
5. Select an appropriate agent.
6. Validate the assignment.
7. Record the decision.

## 20.4 Do Not Use Capability Labels as Authorization

An agent claiming it can perform a task does not mean it is authorized to perform that task.

Check permissions separately.

---

# 📜 21. Collaboration Protocols

## 21.1 What Is a Protocol?

A collaboration protocol defines how agents exchange messages and coordinate their actions.

It specifies expectations for communication and execution.

## 21.2 Example Protocol

A simple task protocol could require:

1. The coordinator sends a task assignment.
2. The worker validates the assignment.
3. The worker executes the task.
4. The worker returns a success or failure message.
5. The coordinator validates the result.
6. The coordinator updates task status.
7. The coordinator schedules the next step.

## 21.3 Protocol Properties

A robust protocol defines:

- Message schemas.
- Allowed transitions.
- Error responses.
- Timeouts.
- Retry behavior.
- Message identity.
- Authorization.
- Completion rules.

## 21.4 State Machine

```text
PENDING
   |
   v
ASSIGNED
   |
   v
RUNNING
   |
   +----> COMPLETED
   |
   +----> FAILED
   |
   +----> WAITING_FOR_APPROVAL
   |
   +----> CANCELLED
```

Not every state can transition to every other state.

Define allowed transitions and reject invalid ones.

---

# ⚔️ 22. Conflict Resolution

## 22.1 Why Conflicts Happen

Agents may disagree because of:

- Different evidence.
- Different assumptions.
- Incomplete context.
- Different instructions.
- Different evaluation criteria.
- Incorrect reasoning.
- Stale state.

## 22.2 Example

Two research agents return different values for the same metric.

A weak system chooses whichever result arrived first.

A better system checks:

1. Whether both agents mean the same metric.
2. Whether their sources refer to the same period.
3. Whether their units match.
4. Whether their sources are reliable.
5. Whether one result is outdated.
6. Whether uncertainty remains.

## 22.3 Resolution Strategies

### Evidence-Based Resolution

Compare the supporting evidence.

### Independent Verification

Ask a verifier to investigate the disputed claim.

### Rule-Based Resolution

Apply an explicit business rule or trusted source hierarchy.

### Human Escalation

Ask a qualified person to resolve high-impact ambiguity.

### Preserve Disagreement

If evidence remains inconclusive, report the disagreement rather than inventing certainty.

## 22.4 Avoid Arbitrary Majority Rules

A majority of agents can still be wrong.

Voting may be useful for certain decisions, but factual claims should be evaluated using evidence and task-specific criteria.

---

# 🗳️ 23. Consensus and Voting

## 23.1 What Is Consensus?

Consensus is an agreement reached through a defined decision process.

In multi-agent applications, this may involve agents proposing answers, reviewing evidence, or voting among alternatives.

## 23.2 Simple Voting

Suppose three independent evaluators choose among approved options.

A majority vote selects the option with the most votes.

However, this works only when:

- Options are clearly defined.
- Votes are comparable.
- Evaluators have suitable information.
- The consequences of an incorrect choice are acceptable.

## 23.3 Weighted Evaluation

Some systems use different weights for different evaluators.

For example, a security specialist may carry greater weight when evaluating security-specific requirements.

Weights should be justified and validated rather than chosen arbitrarily.

## 23.4 Consensus Limitations

Consensus can fail when:

- Agents share the same bias.
- All agents rely on the same incorrect source.
- The question is ambiguous.
- The voting process hides uncertainty.
- A minority holds stronger evidence.

## 23.5 Practical Recommendation

For research and factual tasks, use evidence-based validation before voting.

For subjective comparisons, voting can be one input into a broader decision process.

---

# 🗺️ 24. Multi-Agent Planning

## 24.1 Why Planning Matters

A multi-agent objective may require several dependent subtasks.

The system must decide:

- What work is necessary.
- Which agent should perform each task.
- Which tasks can run concurrently.
- Which results must be reviewed.
- What happens when a task fails.

## 24.2 Planning Process

```text
Objective
    |
    v
Decompose into Tasks
    |
    v
Identify Dependencies
    |
    v
Assign Workers
    |
    v
Execute Tasks
    |
    v
Validate Results
    |
    v
Complete or Replan
```

## 24.3 Task Assignment

Assign tasks according to capabilities, permissions, dependencies, and available resources.

Do not assign every task to every agent.

## 24.4 Dynamic Replanning

Replanning may be required when:

- A worker fails.
- New information changes the task.
- A dependency becomes unavailable.
- A result is incomplete.
- A reviewer identifies a major problem.

Replanning should remain bounded and should preserve completed work where possible.

## 24.5 Define Stop Conditions

Examples:

- Every required task is complete.
- A required source is unavailable.
- The retry limit is reached.
- The deadline expires.
- A human rejects the proposed action.
- The system cannot safely continue.

---

# 🔗 25. Dependency Management

## 25.1 Dependency Graph

Represent tasks and dependencies explicitly.

Example:

```text
Research A ----+
               |
               v
             Analysis ----> Review ----> Finalize
               ^
               |
Research B ----+
```

Research A and Research B are independent.

Analysis depends on both.

Review depends on analysis.

## 25.2 Why Explicit Dependencies Help

They prevent:

- Analysis starting before required findings exist.
- Finalization before review completes.
- Unnecessary sequential execution.
- Hidden assumptions about execution order.

## 25.3 Dependency Validation

Before starting a workflow, check:

- Every referenced task exists.
- No circular dependency exists.
- Required prerequisites are defined.
- Failed prerequisites block dependent tasks when necessary.

## 25.4 Failure Propagation

If Research A fails, the workflow should determine whether Analysis can proceed with Research B alone.

Possible policies:

- Stop because both inputs are required.
- Continue with partial evidence.
- Retry Research A.
- Assign a fallback worker.
- Ask for human intervention.

The policy should depend on the task requirements.

---

# ⚡ 26. Parallel Agent Execution

## 26.1 When to Use It

Parallel execution is appropriate when tasks can proceed independently.

Examples:

- Researching different questions.
- Analyzing separate files.
- Testing independent modules.
- Comparing different design proposals.

## 26.2 Python Example

```python
import asyncio


async def research(topic: str) -> dict:
    await asyncio.sleep(0.1)

    return {
        "topic": topic,
        "status": "completed",
    }


async def main() -> None:
    topics = [
        "Agent roles",
        "Agent communication",
        "Conflict resolution",
    ]

    results = await asyncio.gather(
        *(research(topic) for topic in topics)
    )

    print(results)


if __name__ == "__main__":
    asyncio.run(main())
```

## 26.3 What This Example Demonstrates

The example uses asynchronous functions to simulate independent research operations.

It does not call an LLM or search service.

## 26.4 Add Concurrency Limits

In a production system, do not launch unlimited workers.

Use a semaphore, bounded queue, or appropriate worker pool.

## 26.5 Handle Partial Failure

Define whether a single worker failure should:

- Fail the entire workflow.
- Trigger a retry.
- Use a fallback.
- Allow partial completion.
- Require human intervention.

Avoid treating missing results as successful results.

---

# 🛠️ 27. Failure Handling

## 27.1 Common Failures

Multi-agent systems may experience:

- Worker exceptions.
- Timeouts.
- Invalid messages.
- Missing results.
- Duplicate messages.
- Conflicting updates.
- Incorrect agent assignments.
- Unavailable services.
- Unexpected model outputs.

## 27.2 Failure Categories

**Task failure:** A worker cannot complete its assignment.

**Communication failure:** A message cannot be delivered or processed.

**Coordination failure:** The system schedules tasks incorrectly or loses track of state.

**Validation failure:** A result violates required conditions.

**Authorization failure:** An operation is not permitted.

## 27.3 Recovery Strategies

- Retry transient failures.
- Use alternative workers when appropriate.
- Record failed tasks.
- Preserve completed outputs.
- Reassign work only when safe.
- Escalate unresolved problems.
- Stop sensitive operations when authorization is unclear.

## 27.4 Avoid Blind Retries

Retries may repeat side effects.

Before retrying an operation, determine whether it is safe to repeat and whether deduplication is needed.

## 27.5 Partial Results

A system may return a partial result only when the output clearly identifies:

- Which tasks succeeded.
- Which tasks failed.
- What evidence is missing.
- What conclusions remain uncertain.

Do not present an incomplete result as fully verified.

---

# 🔄 28. Agent Lifecycle Management

## 28.1 What Is a Lifecycle?

The lifecycle describes the stages through which an agent task or execution instance moves.

A simple lifecycle is:

1. Created.
2. Assigned.
3. Running.
4. Completed or failed.
5. Recorded.
6. Cleaned up when appropriate.

## 28.2 Why Lifecycle Management Matters

Without explicit lifecycle rules, a system may:

- Leave tasks running indefinitely.
- Lose failed-task information.
- Reassign completed work.
- Forget cancellation requests.
- Hold resources unnecessarily.

## 28.3 Lifecycle Controls

Define:

- Start conditions.
- Timeout behavior.
- Cancellation behavior.
- Completion rules.
- Cleanup responsibilities.
- Resource release.
- State persistence requirements.

## 28.4 Reuse vs Recreate

A worker may be reusable when it is stateless or safely reset between tasks.

Create a fresh execution context when isolation is important.

Do not share conversation history or private state between unrelated users or tasks without a deliberate design.

---

# 🔐 29. Agent Permissions and Trust

## 29.1 Agents Are Not Automatically Trustworthy

An agent may generate incorrect parameters, misunderstand a request, or follow malicious instructions embedded in external content.

Treat its output as untrusted until validated.

## 29.2 Least Privilege

Give each agent only the capabilities needed for its assignment.

Examples:

- A researcher may read approved information sources.
- A code reviewer may inspect code but not deploy it.
- A report writer may create drafts.
- A deployment worker may require explicit authorization.

## 29.3 Separate Reasoning from Authorization

An agent may recommend an action.

A separate control layer should determine whether the action is allowed.

```text
Agent Proposal
      |
      v
Input Validation
      |
      v
Authorization Check
      |
      v
Approval if Required
      |
      v
Execute Allowed Action
```

## 29.4 External Content

Documents and websites may contain instructions intended to manipulate an agent.

Treat external content as data.

Do not allow it to override trusted system instructions or bypass permissions.

## 29.5 Audit Sensitive Actions

Record the authorized action, relevant task identifier, approval status, and execution outcome.

Avoid logging secrets or unnecessary private information.

---

# 🧠 30. Context Isolation

## 30.1 What Is Context Isolation?

Context isolation prevents unrelated or unnecessary information from leaking between agent tasks.

For example, a coding agent may need a bug report and relevant code, but not an entire unrelated conversation.

## 30.2 Benefits

- Lower token usage.
- Less irrelevant information.
- Clearer task boundaries.
- Reduced accidental data exposure.
- Easier reproducibility.

## 30.3 Build Task-Specific Context

A worker's context should include:

- The assigned objective.
- Required input.
- Relevant evidence.
- Constraints.
- Expected output.
- Necessary prior results.

## 30.4 Avoid Blind Context Sharing

Do not automatically pass every agent's full conversation to every other agent.

Instead, create concise, structured handoffs.

## 30.5 Preserve Provenance

When passing a finding between agents, preserve its source or origin when relevant.

This helps reviewers distinguish direct evidence from an earlier agent's interpretation.

---

# 🐍 31. Multi-Agent Systems with Python

## 31.1 Start with Ordinary Python

You can learn multi-agent architecture without a language model.

Use functions or classes to represent workers and a coordinator to assign tasks.

This makes it easier to test:

- Responsibilities.
- Data flow.
- Task order.
- Failure handling.
- Result aggregation.

## 31.2 Define a Worker Interface

```python
from dataclasses import dataclass


@dataclass
class AgentResult:
    agent_name: str
    status: str
    findings: list[str]
    error: str | None = None


def research_agent(topic: str) -> AgentResult:
    return AgentResult(
        agent_name="researcher",
        status="completed",
        findings=[f"Research task created for {topic}"],
    )
```

## 31.3 Why Structured Results Matter

A structured result makes it possible to distinguish:

- Successful execution.
- Failed execution.
- Empty findings.
- Error details.
- Agent identity.

A string such as `"Done"` provides much less useful information.

## 31.4 Keep the Coordinator Separate

```python
def coordinate(topic: str) -> list[AgentResult]:
    result = research_agent(topic)

    if result.status != "completed":
        raise RuntimeError("Research failed")

    return [result]
```

This is a minimal example of a coordinator delegating work to a worker.

## 31.5 Add More Workers

You can add an analyst, reviewer, or independent researcher.

Define their input and output contracts before connecting them.

## 31.6 Replace Mock Agents Later

Once the workflow is reliable, replace deterministic workers with LLM-powered agents as needed.

Keep the same validation and coordination boundaries.

---

# 🧪 32. Build a Manager-Worker System

## 32.1 Goal

Create a coordinator that assigns work to specialized Python workers.

## 32.2 Implementation

```python
from dataclasses import dataclass


@dataclass
class TaskResult:
    worker: str
    status: str
    output: str


def research_worker(topic: str) -> TaskResult:
    return TaskResult(
        worker="researcher",
        status="completed",
        output=f"Research findings for {topic}",
    )


def analysis_worker(research: TaskResult) -> TaskResult:
    if research.status != "completed":
        return TaskResult(
            worker="analyst",
            status="failed",
            output="Research input is unavailable",
        )

    return TaskResult(
        worker="analyst",
        status="completed",
        output=f"Analysis based on: {research.output}",
    )


def manager(topic: str) -> dict:
    if not topic.strip():
        raise ValueError("Topic cannot be empty")

    research = research_worker(topic)
    analysis = analysis_worker(research)

    return {
        "topic": topic,
        "research": research,
        "analysis": analysis,
        "status": (
            "completed"
            if analysis.status == "completed"
            else "failed"
        ),
    }


if __name__ == "__main__":
    print(manager("Multi-agent systems"))
```

## 32.3 What to Notice

- Each worker has a separate responsibility.
- Results use a structured type.
- The analyst checks the status of its input.
- The manager decides the final workflow status.

## 32.4 Improve the Example

Add:

- Typed input schemas.
- Error recording.
- Retry policies.
- Structured logging.
- Tests for each worker.
- A separate review stage.
- Concurrency where dependencies permit it.

---

# ⚡ 33. Build Parallel Research Agents

## 33.1 Goal

Use independent workers to investigate different aspects of a topic.

## 33.2 Implementation

```python
import asyncio


async def research_area(area: str) -> dict:
    await asyncio.sleep(0.1)

    return {
        "area": area,
        "findings": [
            f"Finding A about {area}",
            f"Finding B about {area}",
        ],
    }


async def run_research() -> dict:
    areas = [
        "agent communication",
        "task delegation",
        "conflict resolution",
    ]

    results = await asyncio.gather(
        *(research_area(area) for area in areas)
    )

    return {
        "status": "completed",
        "results": results,
    }


if __name__ == "__main__":
    output = asyncio.run(run_research())
    print(output)
```

## 33.3 Important Limitation

These workers simulate research. They do not retrieve actual evidence.

The example demonstrates coordination and aggregation only.

## 33.4 Production Improvements

When using actual search tools:

- Preserve source URLs or identifiers.
- Deduplicate results.
- Validate source metadata.
- Handle rate limits.
- Set concurrency limits.
- Distinguish missing evidence from negative evidence.
- Validate final claims against the source material.

---

# 🔎 34. Build an Independent Review System

## 34.1 Goal

Create a reviewer that checks a generated result against explicit requirements.

## 34.2 Implementation

```python
def review_report(report: dict) -> dict:
    problems = []

    if not report.get("title"):
        problems.append("Missing title")

    if not report.get("findings"):
        problems.append("Missing findings")

    if not report.get("limitations"):
        problems.append("Missing limitations")

    return {
        "approved": not problems,
        "problems": problems,
    }


report = {
    "title": "Multi-Agent Systems",
    "findings": ["Agents need clear responsibilities"],
    "limitations": ["Coordination adds complexity"],
}

print(review_report(report))
```

## 34.3 Why Explicit Criteria Matter

The reviewer does not simply judge whether the output sounds good.

It checks concrete requirements.

## 34.4 Add a Model-Based Reviewer

A model-based reviewer may evaluate:

- Completeness.
- Evidence quality.
- Internal consistency.
- Task relevance.
- Missing assumptions.

However, its output should be validated, and important claims should be checked against reliable evidence.

## 34.5 Avoid Endless Review Loops

Set a maximum number of review and revision rounds.

If the result still fails, return a clear failure or escalation status.

---

# 🕸️ 35. Multi-Agent Systems with LangGraph

## 35.1 Overview

LangGraph supports stateful, graph-based agent workflows.

It can represent multi-step processes using nodes, edges, conditional transitions, and shared state.

Official documentation:

https://docs.langchain.com/oss/python/langgraph/overview

## 35.2 When It Helps

Consider LangGraph when you need:

- Explicit workflow control.
- Shared graph state.
- Conditional routing.
- Loops.
- Checkpointing.
- Human approval.
- Coordinated execution across several nodes.

## 35.3 Simple Multi-Worker Graph

The following example uses deterministic workers rather than external LLMs.

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END


class ResearchState(TypedDict):
    topic: str
    research: str
    analysis: str


def research_node(state: ResearchState) -> dict:
    return {
        "research": f"Research prepared for {state['topic']}"
    }


def analysis_node(state: ResearchState) -> dict:
    return {
        "analysis": f"Analysis based on {state['research']}"
    }


builder = StateGraph(ResearchState)

builder.add_node("research", research_node)
builder.add_node("analysis", analysis_node)

builder.add_edge(START, "research")
builder.add_edge("research", "analysis")
builder.add_edge("analysis", END)

graph = builder.compile()

result = graph.invoke({
    "topic": "Multi-agent collaboration",
    "research": "",
    "analysis": "",
})

print(result)
```

## 35.4 Install Dependencies

```bash
python -m pip install langgraph typing_extensions
```

Check the current documentation for supported Python versions and dependency requirements.

## 35.5 What This Example Demonstrates

- A typed workflow state.
- Separate processing nodes.
- Explicit execution order.
- State passed between stages.
- A compiled graph.

It is a graph-based workflow, but it does not automatically create autonomous LLM agents.

## 35.6 Add Parallel Branches

Independent nodes can be structured to run from the same stage before results are combined.

When using parallel state updates, define how updates to shared keys should be merged.

Consult the official documentation for the current state and reducer APIs.

## 35.7 Add Checkpointing

Checkpointing can persist graph execution state and support workflows that need to resume after interruptions.

It does not automatically guarantee exactly-once external side effects.

Use idempotency and appropriate transaction or deduplication strategies.

---

# 🤖 36. Multi-Agent Systems with the OpenAI Agents SDK

## 36.1 Overview

The OpenAI Agents SDK provides tools for building agent applications with agents, tool calls, handoffs, and tracing.

Official documentation:

https://openai.github.io/openai-agents-python/

## 36.2 Useful Concepts

**Agent:** A component with defined instructions and capabilities.

**Tool:** An approved function or operation an agent can invoke.

**Handoff:** A transfer of responsibility to another agent.

**Runner:** Executes the agent workflow.

**Tracing:** Records execution information for debugging and evaluation.

## 36.3 Example Architecture

```text
               Coordinator
                   |
           +-------+-------+
           |               |
           v               v
      Research Agent   Review Agent
           |               |
           +-------+-------+
                   |
                   v
               Final Result
```

## 36.4 Handoff-Oriented Design

A triage agent can hand off a request to a specialized agent.

This is useful when the receiving agent should take responsibility for the next stage.

## 36.5 Manager-Led Design

A manager agent can remain responsible for the overall task while delegating work to specialists.

This is useful when a coordinator must synthesize outputs or maintain control over the completion process.

## 36.6 Security Considerations

- Validate tool arguments.
- Restrict tool permissions.
- Validate agent outputs.
- Apply execution limits.
- Require approval for sensitive operations.
- Trace important workflow steps.

A framework does not eliminate the need for application-level authorization.

## 36.7 Getting Started

```bash
python -m pip install openai-agents
```

Configure provider credentials according to the current official documentation.

Use the current SDK examples for version-specific agent and handoff APIs.

---

# 🧰 37. Framework Selection

## 37.1 Choose Based on Requirements

| Requirement | Possible Starting Point |
|---|---|
| Simple collaboration | Plain Python |
| Concurrent independent workers | Python `asyncio` |
| Explicit state graph | LangGraph |
| Agent handoffs and tools | OpenAI Agents SDK |
| Durable distributed execution | A suitable workflow platform |
| Event-driven coordination | Messaging infrastructure |

## 37.2 Evaluation Questions

Ask:

- How many agents are needed?
- Are tasks independent?
- Does execution need persistence?
- Are agents distributed across services?
- Is human approval required?
- Does the workflow contain loops?
- How are results validated?
- How will failures be recovered?
- What level of tracing is required?
- Can the team maintain the chosen framework?

## 37.3 Avoid Unnecessary Complexity

A simple Python coordinator may be sufficient for a small application.

Use a framework when it solves a real problem, such as complex state transitions, persistence, or advanced handoffs.

---

# 🧪 38. Evaluation and Testing

## 38.1 Why Evaluation Matters

A multi-agent system may appear successful because every worker returned a result.

But the combined output may still be incomplete or incorrect.

Evaluate both individual agents and the overall system.

## 38.2 Agent-Level Metrics

Examples:

- Task success rate.
- Output validity.
- Evidence quality.
- Tool error rate.
- Average execution time.
- Cost per task.

## 38.3 System-Level Metrics

Examples:

- End-to-end completion rate.
- Final output correctness.
- Workflow duration.
- Number of retries.
- Coordination overhead.
- Duplicate task rate.
- Unresolved conflict rate.
- Cost per successful workflow.

## 38.4 Test Different Scenarios

Test:

- Normal completion.
- Invalid inputs.
- Missing worker outputs.
- Worker failures.
- Conflicting findings.
- Malformed messages.
- Repeated messages.
- Approval rejection.
- Timeouts.
- Partial completion.

## 38.5 Compare Against a Baseline

Compare the multi-agent system with a simpler implementation.

Measure whether additional agents improve:

- Correctness.
- Coverage.
- Reliability.
- Speed.
- Cost efficiency.

Do not assume that adding agents improves performance.

## 38.6 Use Reproducible Tests

Use fixed test cases, controlled mock responses, and explicit expected results.

For LLM-powered systems, evaluate a representative dataset because model outputs may vary.

---

# 📈 39. Observability and Debugging

## 39.1 What to Record

Record useful execution details such as:

- Workflow ID.
- Agent name.
- Task ID.
- Message ID.
- Task status.
- Execution duration.
- Retry count.
- Error category.
- Result validation status.

## 39.2 Example Execution Trace

```text
Workflow: wf-001

1. Coordinator created research tasks.
2. Researcher A completed.
3. Researcher B completed.
4. Aggregator combined findings.
5. Reviewer identified a missing limitation.
6. Coordinator requested a bounded revision.
7. Final validation passed.
8. Workflow completed.
```

## 39.3 Debugging Questions

When a workflow fails, ask:

- Which agent failed?
- What task was assigned?
- Was the input valid?
- Did the agent use an approved tool?
- Was the output valid?
- Did a dependency fail?
- Was the retry policy applied correctly?
- Did the coordinator make a valid decision?

## 39.4 Protect Logs

Do not log credentials, secrets, or unnecessary sensitive content.

Redact private information and restrict access to operational records.

---

# 🔐 40. Security and Reliability

## 40.1 Validate Every Boundary

Validate information when it enters:

- The overall system.
- A worker.
- Shared state.
- A tool.
- A handoff.
- The final output.

## 40.2 Treat Inter-Agent Messages as Untrusted

A message from another agent may contain incorrect or unsafe instructions.

Validate the message and enforce permissions independently.

## 40.3 Prevent Tool Misuse

Do not let an agent choose arbitrary executable code or unrestricted tools.

Use an allowlist of approved operations.

## 40.4 Prevent Resource Exhaustion

Set limits on:

- Active agents.
- Delegation depth.
- Messages.
- Retries.
- Execution time.
- Output length.
- Model calls.
- API usage.

## 40.5 Make Sensitive Actions Explicit

For actions such as deletion, publishing, purchases, or production changes:

1. Validate the proposed action.
2. Check authorization.
3. Request approval when required.
4. Execute only the approved action.
5. Record the outcome.

## 40.6 Fail Safely

If the system cannot verify permission or required information, it should stop the sensitive action rather than assume it is safe.

---

# 🚫 41. Common Mistakes

## 41.1 Creating Too Many Agents

**Problem:** Every task receives its own agent.

**Solution:** Use agents only when specialization or independent execution adds value.

## 41.2 Giving Agents Vague Roles

**Problem:** Multiple agents have overlapping responsibilities.

**Solution:** Define precise inputs, outputs, constraints, and success criteria.

## 41.3 Trusting Every Output

**Problem:** The coordinator accepts every result without validation.

**Solution:** Validate schemas, evidence, and task completion.

## 41.4 Unbounded Agent Communication

**Problem:** Agents repeatedly send messages without a termination policy.

**Solution:** Set message limits, timeouts, and stopping conditions.

## 41.5 Confusing Agreement with Truth

**Problem:** Several agents agree, so the system assumes the result is correct.

**Solution:** Check evidence and independent validation.

## 41.6 Sharing All Context

**Problem:** Every agent receives the entire conversation.

**Solution:** Pass only the information required for the task.

## 41.7 Uncontrolled Shared State

**Problem:** Workers overwrite shared information.

**Solution:** Define ownership, versioning, and merge policies.

## 41.8 Blind Retries

**Problem:** Failed tasks are repeated without checking the error.

**Solution:** Classify failures and retry only when safe.

## 41.9 No Final Validation

**Problem:** The system returns the collected outputs without checking the overall objective.

**Solution:** Validate the final result against explicit completion criteria.

## 41.10 Ignoring Cost

**Problem:** Multiple agents make many unnecessary model calls.

**Solution:** Track usage and compare the system against a simpler baseline.

---

# 🚀 42. Mini-Project: Collaborative Research Team

## 42.1 Project Goal

Build a multi-agent research application that uses specialized workers to create a validated report.

Start with mock workers. Add real LLM-powered agents only after the control flow is tested.

## 42.2 Required Agents

**Coordinator**
- Creates the task plan.
- Assigns tasks.
- Tracks progress.
- Combines results.

**Researcher A**
- Investigates the first assigned question.

**Researcher B**
- Investigates a separate question.

**Analyst**
- Interprets the combined findings.

**Reviewer**
- Checks the final draft against explicit requirements.

## 42.3 Architecture

```text
                  User Topic
                      |
                      v
                  Coordinator
                      |
             +--------+--------+
             |                 |
             v                 v
        Researcher A       Researcher B
             |                 |
             +--------+--------+
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
          Approved          Rejected
             |                 |
             v                 v
          Finalize       Bounded Revision
             |                 |
             +--------+--------+
                      |
                      v
                  Final Report
```

## 42.4 Suggested Directory Structure

```text
collaborative-research-team/
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
│   ├── schemas.py
│   ├── state.py
│   ├── aggregation.py
│   ├── validation.py
│   │
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── researcher_a.py
│   │   ├── researcher_b.py
│   │   ├── analyst.py
│   │   └── reviewer.py
│   │
│   └── utils/
│       ├── __init__.py
│       └── logging_config.py
│
└── tests/
    ├── test_coordinator.py
    ├── test_agents.py
    ├── test_aggregation.py
    └── test_validation.py
```

## 42.5 Phase 1: Define the Objective

Accept a research topic.

Reject empty or invalid input.

Define the expected final report structure.

## 42.6 Phase 2: Define Worker Contracts

Each worker should have:

- A clear responsibility.
- A structured input.
- A structured output.
- Explicit constraints.
- A defined failure response.

## 42.7 Phase 3: Implement the Coordinator

The coordinator should:

- Create task records.
- Assign research questions.
- Track task statuses.
- Handle failures.
- Collect completed outputs.

## 42.8 Phase 4: Add Parallel Research

Run the independent researchers concurrently.

Use a concurrency limit where appropriate.

Define what happens when one researcher fails.

## 42.9 Phase 5: Aggregate Findings

Combine findings while preserving source metadata.

Detect duplicates.

Keep conflicting claims visible until they are resolved.

## 42.10 Phase 6: Analyze

The analyst should:

- Identify important patterns.
- Compare evidence.
- State uncertainty.
- Identify missing information.

## 42.11 Phase 7: Review

The reviewer should check:

- Required sections.
- Evidence coverage.
- Internal consistency.
- Relevance to the objective.
- Limitations.
- Output schema.

## 42.12 Phase 8: Add Recovery

Implement:

- Bounded retries.
- Timeouts.
- Error records.
- Fallback behavior where appropriate.
- Clear terminal states.

## 42.13 Phase 9: Add Tests

Test both successful and failed execution.

Include conflicting research results, missing fields, rejected reviews, and unavailable workers.

## 42.14 Phase 10: Add Observability

Record workflow IDs, task statuses, errors, durations, and retry counts.

Protect sensitive data in logs.

## 42.15 Acceptance Criteria

The project is complete when:

- Every agent has a clear responsibility.
- Independent tasks can run concurrently.
- Dependencies are respected.
- Outputs are structured and validated.
- Conflicts are handled explicitly.
- Failures do not become false success.
- Retries and loops are bounded.
- Sensitive actions are controlled.
- Tests cover normal and failure paths.
- The final report meets defined requirements.

---

# 📝 43. Practical Exercises

## 🟢 Beginner

### Exercise 1: Explain Multi-Agent Systems

Describe a multi-agent system using a real-world example.

### Exercise 2: Design Agent Roles

Create three agents for a technical research workflow.

Define the purpose of each agent.

### Exercise 3: Build a Worker

Write a Python function that accepts a task and returns a structured result.

### Exercise 4: Build a Coordinator

Create a function that calls two workers and combines their outputs.

### Exercise 5: Validate a Message

Reject a message that lacks a sender, recipient, or task identifier.

## 🟡 Intermediate

### Exercise 6: Parallel Research

Run three independent asynchronous workers.

Collect their outputs.

### Exercise 7: Conflict Detection

Create two findings that disagree.

Write a function that flags the conflict rather than choosing a result arbitrarily.

### Exercise 8: Failure Handling

Make one worker fail.

Ensure the coordinator records the failure and follows the defined policy.

### Exercise 9: Independent Review

Build a reviewer that checks a report against five explicit requirements.

### Exercise 10: Shared State

Design a state structure with separate task, result, error, and approval fields.

## 🔴 Advanced

### Exercise 11: Bounded Delegation

Limit the number of child tasks a coordinator can create.

### Exercise 12: Approval Gate

Require approval before a simulated publishing operation.

### Exercise 13: Agent Selection

Select a worker based on capabilities and approved permissions.

### Exercise 14: Evaluation

Compare a single-agent baseline with a multi-agent implementation using the same test cases.

### Exercise 15: Framework Comparison

Implement a small collaboration workflow in plain Python and LangGraph.

Compare complexity, state management, and failure handling.

---

# 🎤 44. Interview Questions and Answers

## Q1. What is a multi-agent system?

A system containing multiple agents that interact or coordinate to achieve individual or shared objectives.

## Q2. Why use multiple agents?

To separate responsibilities, execute independent tasks, use specialized tools, or obtain independent reviews when those benefits justify the overhead.

## Q3. Are multiple agents always better than one?

No. Multiple agents introduce coordination, cost, state, and failure complexity.

## Q4. What is agent specialization?

Giving an agent a clearly defined responsibility, capability set, and expected output.

## Q5. What is a manager-worker architecture?

A design where a manager delegates tasks to workers and coordinates their results.

## Q6. What is peer-to-peer collaboration?

A design where agents communicate more directly instead of relying on a central coordinator for every interaction.

## Q7. What is a handoff?

A transfer of responsibility from one agent or workflow component to another.

## Q8. Why use structured messages?

They make communication easier to validate, route, test, and audit.

## Q9. What is shared state?

Information available to multiple workflow components for coordination.

## Q10. What is a blackboard architecture?

A design in which multiple components contribute to and use a shared workspace.

## Q11. What is conflict resolution?

A process for investigating and handling incompatible outputs or decisions.

## Q12. Does agent consensus guarantee correctness?

No. Agents can share biases, incorrect assumptions, or unreliable evidence.

## Q13. When is parallel execution appropriate?

When tasks are independent and can safely run concurrently.

## Q14. What is context isolation?

Restricting each agent's context to the information required for its assigned task.

## Q15. Why is task ownership important?

It prevents duplicated work and uncontrolled changes to shared state.

## Q16. How should agent failures be handled?

Classify the failure, apply a bounded retry or fallback if safe, preserve useful state, and record the outcome.

## Q17. How do you prevent unbounded delegation?

Set limits on task count, delegation depth, concurrency, duration, and resource usage.

## Q18. How do you evaluate a multi-agent system?

Measure task quality, end-to-end correctness, reliability, latency, cost, and coordination overhead.

## Q19. What is the purpose of a reviewer agent?

To evaluate an output against explicit criteria and identify defects or missing requirements.

## Q20. Why should agent outputs be validated?

Agents can return incorrect, incomplete, malformed, or unsafe results.

## Q21. How do you protect tools?

Use explicit allowlists, argument validation, authorization checks, and least-privilege permissions.

## Q22. What is the difference between shared memory and shared state?

Shared state usually represents current workflow data. Agent memory may store information used by an agent across tasks or interactions. The concepts can overlap, but they have different purposes.

## Q23. What is centralized coordination?

A design where one coordinator manages overall task assignment and execution.

## Q24. What is decentralized coordination?

A design where agents or services make more local decisions and coordinate through messages, events, or shared state.

## Q25. When should you use LangGraph?

When explicit graph-based control flow, state management, conditional routing, or checkpointing provides value.

## Q26. When should you use the OpenAI Agents SDK?

When its agent, tool, handoff, and tracing capabilities match the application's requirements.

## Q27. How do you avoid endless agent debates?

Set iteration limits, explicit evaluation criteria, deadlines, and a defined escalation policy.

## Q28. How do you prevent duplicated side effects?

Use idempotency keys, deduplication, or appropriate transaction controls.

## Q29. What is the biggest multi-agent design mistake?

Adding agents without defining why they are needed, what each one owns, and how their outputs will be validated.

## Q30. What makes a multi-agent system production-ready?

Clear responsibilities, validated communication, controlled permissions, bounded execution, observable behavior, recovery strategies, and reliable tests.

---

# 📌 45. Cheat Sheet

## Architecture Patterns

| Pattern | Best Use |
|---|---|
| Manager-worker | Centralized task delegation |
| Peer-to-peer | Direct coordination |
| Pipeline | Dependent sequential stages |
| Parallel specialists | Independent subtasks |
| Debate | Exploring alternatives |
| Independent review | Checking output quality |
| Blackboard | Shared workspace |
| Hierarchical | Large objectives with subtasks |

## Core Components

| Component | Purpose |
|---|---|
| Agent | Performs a task |
| Coordinator | Manages overall execution |
| Worker | Executes an assigned task |
| Message | Transfers information |
| Shared state | Stores workflow data |
| Aggregator | Combines outputs |
| Validator | Checks results |
| Task registry | Tracks assignments and statuses |

## Reliability Rules

- Define each agent's responsibility.
- Use structured inputs and outputs.
- Validate messages.
- Keep shared state controlled.
- Limit delegation and concurrency.
- Bound retries and loops.
- Preserve source information.
- Handle disagreements explicitly.
- Enforce permissions outside model reasoning.
- Test worker failures.
- Measure end-to-end quality.
- Compare against a simpler baseline.

## Python Tools

| Tool | Purpose |
|---|---|
| `dataclasses` | Structured result objects |
| `typing` | Type annotations |
| `asyncio` | Concurrent asynchronous execution |
| `asyncio.gather()` | Collect asynchronous results |
| `asyncio.Semaphore` | Limit concurrent work |
| `logging` | Record execution events |
| `pytest` | Test workers and workflows |

---

# 📖 46. Glossary

**Agent:** A component that performs a task using its instructions, capabilities, and available information.

**Agent specialization:** Assigning an agent a focused responsibility.

**Blackboard architecture:** A shared workspace used by multiple components.

**Centralized coordination:** Workflow control managed by a central coordinator.

**Consensus:** Agreement produced through a defined decision process.

**Context isolation:** Restricting an agent's context to relevant information.

**Coordinator:** A component that manages overall task execution.

**Delegation:** Assigning work to another agent or worker.

**Decentralized coordination:** Coordination through local decisions, messages, events, or shared state.

**Handoff:** Transfer of responsibility to another agent.

**Independent review:** Evaluation of a result using separate review criteria.

**Message protocol:** Rules defining how components exchange and process messages.

**Multi-agent system:** Multiple interacting or coordinated agents working toward objectives.

**Peer-to-peer collaboration:** Direct interaction between agents.

**Shared state:** Data used by multiple components to coordinate work.

**Task dependency:** A requirement that another task must complete before a task can proceed.

**Task registry:** A record of tasks, assignments, statuses, and results.

**Worker:** A component that performs an assigned task.

---

# 🔗 47. Official Learning Resources

## Python

- **Python documentation:** https://docs.python.org/3/
- **Asyncio:** https://docs.python.org/3/library/asyncio.html
- **Dataclasses:** https://docs.python.org/3/library/dataclasses.html
- **Logging:** https://docs.python.org/3/library/logging.html

## LangGraph

- **LangGraph overview:** https://docs.langchain.com/oss/python/langgraph/overview
- **LangChain documentation:** https://docs.langchain.com/

Focus on graph state, node execution, conditional routing, parallel branches, and checkpointing.

## OpenAI Agents SDK

- **Agents SDK for Python:** https://openai.github.io/openai-agents-python/
- **OpenAI developer platform:** https://platform.openai.com/docs

Focus on agent definitions, tools, handoffs, execution, and tracing.

## Testing

- **pytest:** https://docs.pytest.org/

Learn unit testing, fixtures, parametrization, exception handling, and mocking.

## Recommended Study Order

1. Understand the architecture patterns.
2. Define worker responsibilities.
3. Build a manager-worker system.
4. Add parallel execution.
5. Implement structured messages.
6. Add result validation and conflict handling.
7. Test failures and partial results.
8. Build the collaborative research project.
9. Explore LangGraph.
10. Explore the OpenAI Agents SDK.

---

# ✅ 48. Completion Checklist

## Fundamentals

- [ ] I can define a multi-agent system.
- [ ] I understand when multiple agents are useful.
- [ ] I can compare single-agent and multi-agent designs.
- [ ] I understand manager-worker architecture.
- [ ] I understand peer-to-peer collaboration.
- [ ] I understand pipeline and blackboard patterns.
- [ ] I can explain consensus and independent review.

## Communication and State

- [ ] I can define a structured message.
- [ ] I can validate message fields.
- [ ] I understand shared state and context isolation.
- [ ] I can define task ownership.
- [ ] I understand message deduplication.
- [ ] I can describe a collaboration protocol.

## Python

- [ ] I have implemented a worker.
- [ ] I have built a coordinator.
- [ ] I have run independent workers concurrently.
- [ ] I have aggregated worker results.
- [ ] I have validated outputs.
- [ ] I have tested conflicting findings.
- [ ] I have handled a worker failure.

## Reliability and Security

- [ ] I can explain bounded delegation.
- [ ] I can apply least-privilege permissions.
- [ ] I understand safe retry behavior.
- [ ] I can define workflow stopping conditions.
- [ ] I can explain why consensus does not guarantee truth.
- [ ] I have considered context leakage.
- [ ] I have added structured logs.
- [ ] I have tested failure paths.

## Frameworks and Project

- [ ] I understand the basic role of LangGraph.
- [ ] I understand the basic role of the OpenAI Agents SDK.
- [ ] I have reviewed the official documentation.
- [ ] I have built the collaborative research mini-project.
- [ ] I can explain the architecture and its trade-offs.
- [ ] I can justify why each agent exists.

---

# 🎓 Final Summary

**A multi-agent system is a coordinated team of specialized components—not simply a collection of AI models.**

A strong design:

1. **Gives every agent a clear responsibility.**
2. **Uses an appropriate coordination pattern.**
3. **Defines structured communication.**
4. **Controls shared state.**
5. **Respects task dependencies.**
6. **Handles disagreements using evidence.**
7. **Bounds delegation, retries, and execution.**
8. **Validates outputs before trusting them.**
9. **Enforces permissions independently of model decisions.**
10. **Measures whether multiple agents improve the result.**

Remember: **Start simple, specialize deliberately, validate everything important, and add agents only when collaboration creates measurable value.**

Your next module is **06 — Agent Communication and Protocols**, where you will study message formats, agent-to-agent communication, protocol design, tool interoperability, MCP, and reliable communication between AI systems. 🚀
