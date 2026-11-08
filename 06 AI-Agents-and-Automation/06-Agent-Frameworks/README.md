
# 🧰 Module 06 — Agent Frameworks

Learn how agent frameworks simplify the development of AI agents, manage tool execution, coordinate workflows, and help developers build maintainable applications.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 06 — Agent Frameworks |
| Planned Date | Sep 8, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–05: Setup, Agent Fundamentals, Architecture, Tool Calling, Memory, and Planning |
| Primary Language | Python |
| Tools | LangGraph, CrewAI, Microsoft Agent Framework, Python, LLM APIs |
| Main Focus | Framework architecture, tool integration, orchestration, state, and framework selection |
| Next Module | 07 — APIs and External Integrations |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain why agent frameworks exist.
- Understand the difference between building an agent manually and using a framework.
- Compare LangGraph, CrewAI, and Microsoft Agent Framework.
- Understand agents, tools, workflows, state, and orchestration.
- Build a practical tool-using agent with LangGraph.
- Recognize when a framework adds unnecessary complexity.
- Choose a framework based on project requirements.
- Understand the importance of testing, security, and observability.

---

## 1. What Is an Agent Framework?

An **agent framework** is a software library that provides reusable components for building and managing AI agents.

Without a framework, you may need to implement the following yourself:

- Sending requests to an LLM.
- Defining and registering tools.
- Validating tool arguments.
- Executing tools.
- Managing conversation state.
- Controlling agent loops.
- Handling errors and retries.
- Saving workflow progress.
- Implementing human approval.
- Recording execution traces.

A framework can provide some of these capabilities, allowing you to focus on the application's requirements.

However, a framework does not automatically make an agent reliable, secure, or intelligent. You remain responsible for designing the system, validating inputs, testing behavior, and controlling permissions.

## 2. Manual Implementation vs. Framework

| Feature | Manual Implementation | Agent Framework |
|---|---|---|
| Tool registration | Implement yourself | Often built in |
| Agent loop | Implement yourself | Often provided or configurable |
| State management | Design your own | May provide state abstractions |
| Workflow orchestration | Custom code | May provide graphs, flows, or workflow primitives |
| Persistence | Integrate your own storage | May provide persistence integrations |
| Human approval | Build the approval mechanism | Some frameworks provide workflow support |
| Flexibility | Full control over your implementation | Depends on the framework's abstractions |
| Learning value | Excellent for understanding internals | Excellent for building larger systems |
| Complexity | Can grow as features increase | Framework concepts and dependencies must be learned |

**Practical rule:** learn the underlying concepts before depending on abstractions. Your knowledge of tool calling, state, and planning will help you debug framework behavior.

---

## 3. Three Frameworks to Understand

<text>Frameworks evolve quickly. The descriptions below reflect their documented roles; check the official documentation for current APIs and supported features before starting a new project.</text>

### 3.1 LangGraph

<text color="secondary" size="sm">Official documentation: https://docs.langchain.com/oss/python/langgraph/overview</text>

LangGraph is a framework for building stateful, multi-step agent workflows using graph-based orchestration. It is useful when you need control over execution paths, state transitions, persistence, or human approval. <Cite refs={["turn977650search6","turn977650search18"]} />

Key concepts:

- **State:** data shared across workflow steps.
- **Nodes:** functions or components that perform work.
- **Edges:** connections that determine execution flow.
- **Conditional routing:** choosing the next step based on the current state.
- **Persistence:** saving checkpoints to support continuity and recovery.

Example architecture:

```text
START
  |
  v
Call Model
  |
  v
Tool Requested?
  |          |
 Yes         No
  |          |
  v          v
Execute     END
Tool
  |
  v
Call Model
```

Best suited for workflows where you want explicit control over how the agent progresses.

### 3.2 CrewAI

<text color="secondary" size="sm">Official documentation: https://docs.crewai.com/</text>

CrewAI provides abstractions for organizing specialized agents and coordinating their work. Its documented concepts include **Crews**, which organize collaborating agents, and **Flows**, which support structured, event-driven orchestration. <Cite refs={["turn977650search3","turn977650search10"]} />

Key concepts:

- **Agent:** a worker with a role, goal, and relevant capabilities.
- **Task:** a defined unit of work.
- **Crew:** a group of agents working together.
- **Flow:** a structured process controlling execution and state.

Example:

```text
Research Flow
     |
     v
Researcher Agent
     |
     v
Fact Checking
     |
     v
Writer Agent
     |
     v
Final Report
```

Best suited for projects that benefit from role-based collaboration or a combination of structured workflows and collaborative agent tasks.

Multiple agents are not always better. They can introduce extra latency, cost, coordination failures, and duplicated work.

### 3.3 Microsoft Agent Framework

<text color="secondary" size="sm">Official documentation: https://learn.microsoft.com/en-us/agent-framework/</text>

Microsoft Agent Framework is an open framework for building agents and workflows, with Python and .NET support. Its documented capabilities include tools, multi-turn conversations, persistence, middleware, human-in-the-loop workflows, and hosting options. <Cite refs={["turn977650search0","turn977650search16"]} />

Key concepts:

- Agents and conversations.
- Functional tools.
- Workflow orchestration.
- Persistence and resumable execution.
- Middleware and security-related controls.
- Integration with supported model providers and services.

It is worth evaluating when you work in a Microsoft-oriented environment or need its specific integration and hosting capabilities.

**Maintenance note:** Microsoft AutoGen is in maintenance mode, and its maintainers direct new projects toward Microsoft Agent Framework. Learn AutoGen's concepts if you need to maintain existing projects, but do not make it the default framework for new development. <Cite refs={["turn977650search2","turn977650search16"]} />

---

## 4. Framework Comparison

| Requirement | LangGraph | CrewAI | Microsoft Agent Framework |
|---|---|---|---|
| Explicit stateful workflows | Strong fit | Supported through Flows | Supported through workflows |
| Graph-based orchestration | Core approach | Not its primary abstraction | Different workflow abstractions |
| Role-based agent collaboration | Possible | Core use case | Supported |
| Human-in-the-loop workflows | Supported | Depends on workflow design and features used | Supported |
| Python development | Yes | Yes | Yes |
| .NET development | Not its primary focus | Not its primary focus | Yes |
| Microsoft ecosystem integration | Depends on integrations | Depends on integrations | Particularly relevant |
| Main reason to choose it | Fine-grained workflow control | Agent teams and role-based collaboration | Microsoft ecosystem and integrated agent/workflow capabilities |

No framework wins every category. Evaluate documentation, supported models, deployment needs, observability, licensing, and maintenance activity against your actual use case.

Useful official resources:

- [LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/overview)
- [CrewAI documentation](https://docs.crewai.com/)
- [Microsoft Agent Framework documentation](https://learn.microsoft.com/en-us/agent-framework/)
- [Microsoft AutoGen repository and maintenance notice](https://github.com/microsoft/autogen)

---

## 5. Build Your First LangGraph Agent

For this practical example, use LangGraph to create a small workflow with two possible paths: call a deterministic calculator tool or finish the conversation.

This example intentionally uses a fixed routing rule. It teaches the graph structure before adding an LLM.

### Step 1 — Install dependencies

Use your course's Python virtual environment:

```bash
pip install -U langgraph
```

### Step 2 — Create `basic_graph.py`

```python
from typing import TypedDict

from langgraph.graph import END, START, StateGraph


class AgentState(TypedDict):
    question: str
    answer: str


def calculate_node(state: AgentState) -> dict:
    """Perform a deterministic calculation."""
    return {
        "answer": "250 multiplied by 12 equals 3000."
    }


def finish_node(state: AgentState) -> dict:
    """Return a response when no calculation is needed."""
    return {
        "answer": f"You asked: {state['question']}"
    }


def route_request(state: AgentState) -> str:
    question = state["question"].lower()

    if "250" in question and "12" in question:
        return "calculate"

    return "finish"


builder = StateGraph(AgentState)

builder.add_node("calculate", calculate_node)
builder.add_node("finish", finish_node)

builder.add_conditional_edges(
    START,
    route_request,
    {
        "calculate": "calculate",
        "finish": "finish",
    },
)

builder.add_edge("calculate", END)
builder.add_edge("finish", END)

graph = builder.compile()


if __name__ == "__main__":
    result = graph.invoke({
        "question": "What is 250 multiplied by 12?",
        "answer": "",
    })

    print(result["answer"])
```

### Step 3 — Run the example

```bash
python basic_graph.py
```

Expected output:

```text
250 multiplied by 12 equals 3000.
```

### Step 4 — Understand the code

| Code | Purpose |
|---|---|
| `AgentState` | Defines the data passed through the graph |
| `calculate_node()` | Performs the calculation response step |
| `finish_node()` | Handles the alternative path |
| `route_request()` | Chooses a path based on the input |
| `StateGraph()` | Creates the graph builder |
| `add_node()` | Registers workflow steps |
| `add_conditional_edges()` | Defines conditional routing |
| `compile()` | Builds the executable graph |
| `invoke()` | Executes the workflow |

**Important limitation:** this is a graph-based workflow, not a fully autonomous LLM agent. The routing rule is hard-coded, and the calculation result is predefined. It does not yet demonstrate model reasoning, real tool execution, or model-driven tool selection.

The purpose is to understand how framework nodes, state, and routing work together.

---

## 6. Build a Real LLM-Powered Agent Next

After understanding the graph, extend it with:

1. An LLM client.
2. A registered calculator tool.
3. Model-driven tool selection.
4. A node that executes approved tool calls.
5. A way to return tool results to the model.
6. A termination condition.
7. Tests for success and failure.

LangGraph's APIs and prebuilt agent interfaces evolve. Follow the current official quickstart instead of mixing older examples with newer APIs.

Start here: [LangGraph documentation and quickstarts](https://docs.langchain.com/oss/python/langgraph/overview).

A useful learning progression is:

```text
Manual Python Tool Executor
           |
           v
Simple StateGraph
           |
           v
LLM + Tool Calling
           |
           v
Conditional Tool Loop
           |
           v
State Persistence
           |
           v
Human Approval + Evaluation
```

This progression builds on your previous modules rather than hiding the fundamentals behind a single high-level function.

---

## 7. Choosing the Right Abstraction

Use a decision process rather than choosing the most popular framework.

| Situation | Starting Point |
|---|---|
| One fixed API call | Normal Python function |
| One LLM request with structured output | Direct model SDK |
| Simple model-driven tool use | Provider SDK or a high-level agent API |
| Multi-step workflow with conditional branches | LangGraph or another workflow-oriented framework |
| Collaborative agents with different roles | Evaluate CrewAI or another multi-agent framework |
| Microsoft-focused enterprise application | Evaluate Microsoft Agent Framework |
| Existing application with no framework | Add one only when it solves a real complexity problem |

Avoid using a multi-agent system simply because the project is described as an AI agent. A single agent or deterministic workflow may be easier to test, cheaper to run, and more reliable.

---

## 8. Common Framework Mistakes

| Mistake | Better Approach |
|---|---|
| Learning several frameworks at once | Learn one framework deeply, then compare alternatives |
| Choosing based on hype | Match the framework to the workflow and deployment requirements |
| Hiding all logic behind abstractions | Understand the underlying model, tools, state, and control flow |
| Creating unnecessary agents | Start with the smallest working architecture |
| Assuming the framework guarantees safety | Implement permissions, validation, and approval controls |
| Ignoring framework version changes | Pin dependencies and follow current documentation |
| Testing only successful runs | Test invalid input, failures, timeouts, and termination |
| Skipping observability | Record useful traces, tool results, errors, and latency |

---

## 9. Hands-On Exercises

### Beginner

- [ ] Install LangGraph in a virtual environment.
- [ ] Run `basic_graph.py`.
- [ ] Add a node that returns a greeting.
- [ ] Add another route based on a keyword.
- [ ] Draw the graph before implementing it.

### Intermediate

- [ ] Replace the predefined answer with a real calculator function.
- [ ] Add validation for tool inputs.
- [ ] Add a structured error path.
- [ ] Write tests for each route.
- [ ] Record which nodes ran during execution.

### Advanced

- [ ] Build a model-driven tool-using agent.
- [ ] Add a bounded tool-call loop.
- [ ] Persist task state using a supported checkpoint mechanism.
- [ ] Add an approval step before a simulated external action.
- [ ] Compare the same task implemented manually and with a framework.
- [ ] Record latency, execution count, failure rate, and cost where available.

---

## 10. Interview Questions and Answers

**Q1. What is an agent framework?**

A software library that provides reusable components for creating agents, connecting tools, managing state, and orchestrating execution.

**Q2. Why use an agent framework?**

It can reduce repeated implementation work and provide abstractions for workflows, persistence, and tool execution.

**Q3. What is LangGraph?**

A framework for defining stateful, multi-step workflows and agent execution using graph-based orchestration.

**Q4. What is the difference between a node and an edge in LangGraph?**

A node performs work. An edge determines where execution proceeds next.

**Q5. What is CrewAI?**

A framework for organizing specialized agents and coordinating their tasks through concepts such as Crews and Flows.

**Q6. What is Microsoft Agent Framework?**

A framework for building agents and workflows with support for Python, .NET, tools, conversations, and orchestration.

**Q7. Should every AI agent use a framework?**

No. A direct SDK call or ordinary Python code can be sufficient for simple tasks.

**Q8. What is the difference between a workflow and an agent?**

A workflow usually follows a defined execution path. An agent can dynamically choose actions based on its goal and observations. Systems can combine both approaches.

**Q9. Why is state important in agent frameworks?**

State carries information between workflow steps and supports conditional routing, progress tracking, and recovery.

**Q10. How do you choose an agent framework?**

Evaluate workflow complexity, provider support, state management, persistence, integrations, testing, observability, licensing, and maintenance.

---

## 11. Completion Checklist

- [ ] I understand what agent frameworks provide.
- [ ] I can explain the difference between manual implementation and a framework.
- [ ] I understand the main roles of LangGraph, CrewAI, and Microsoft Agent Framework.
- [ ] I built and ran a basic LangGraph workflow.
- [ ] I understand nodes, edges, state, and conditional routing.
- [ ] I know when a framework is unnecessary.
- [ ] I understand why frameworks do not replace security and testing.
- [ ] I completed at least three exercises.

---

## 🔑 Key Takeaways

- Agent frameworks provide reusable building blocks for agent applications.
- LangGraph emphasizes stateful graph-based orchestration.
- CrewAI provides abstractions for collaborative agents and structured flows.
- Microsoft Agent Framework supports agents and workflows across Python and .NET.
- Frameworks differ in architecture, abstractions, and ecosystem.
- Start with the simplest solution that meets your requirements.
- Understand the fundamentals before relying on high-level APIs.
- Test, secure, and monitor the application regardless of framework choice.

## 🚀 Next Module — APIs and External Integrations

In Module 07, you will learn how agents interact with REST APIs, authenticate with external services, handle HTTP errors, manage rate limits, and connect tools to real applications.

**Suggested commit message:**

```text
Sep 8, 2026 — Day 7: Agent frameworks — LangGraph, CrewAI, and Microsoft Agent Framework
```
