<CodeBlock language="markdown" editable={true}>

# 📊 Module 11 — Evaluation and Observability

> **Course:** Agentic AI Engineering  
> **Module:** 11 — Evaluation and Observability  
> **Level:** Advanced  
> **Focus:** Measuring agent performance, evaluating correctness, tracing execution, monitoring costs, and detecting failures  
> **Prerequisites:** Agentic AI Fundamentals, Workflow Patterns and State Graphs, Advanced Planning and Decision-Making, Agent Orchestration, Multi-Agent Systems, Agent Communication and Protocols, Context Engineering and Memory, Human-in-the-Loop and Approval, Agentic RAG, and Safety, Security, and Guardrails  
> **Estimated Duration:** 2–3 days  
> **Primary Language:** Python  
> **Core Principle:** If you cannot measure an agent's behavior, you cannot reliably improve or operate it in production.

---

## 📚 Table of Contents

1. [Module Overview](#-1-module-overview)
2. [Learning Objectives](#-2-learning-objectives)
3. [Why Agent Evaluation Matters](#-3-why-agent-evaluation-matters)
4. [Evaluation vs. Observability vs. Monitoring](#-4-evaluation-vs-observability-vs-monitoring)
5. [The Agent Evaluation Lifecycle](#-5-the-agent-evaluation-lifecycle)
6. [Agent Evaluation Metrics](#-6-agent-evaluation-metrics)
7. [Task Success and Goal Completion](#-7-task-success-and-goal-completion)
8. [Answer Quality and Correctness](#-8-answer-quality-and-correctness)
9. [Tool Selection and Tool Execution Evaluation](#-9-tool-selection-and-tool-execution-evaluation)
10. [Planning and Workflow Evaluation](#-10-planning-and-workflow-evaluation)
11. [RAG Evaluation](#-11-rag-evaluation)
12. [Multi-Agent Evaluation](#-12-multi-agent-evaluation)
13. [LLM-as-a-Judge](#-13-llm-as-a-judge)
14. [Deterministic and Model-Based Evaluation](#-14-deterministic-and-model-based-evaluation)
15. [Evaluation Datasets and Test Cases](#-15-evaluation-datasets-and-test-cases)
16. [Regression Testing](#-16-regression-testing)
17. [Observability Fundamentals](#-17-observability-fundamentals)
18. [Logs, Metrics, and Traces](#-18-logs-metrics-and-traces)
19. [Tracing Agent Execution](#-19-tracing-agent-execution)
20. [Structured Logging](#-20-structured-logging)
21. [Latency and Performance Monitoring](#-21-latency-and-performance-monitoring)
22. [Token Usage and Cost Monitoring](#-22-token-usage-and-cost-monitoring)
23. [Failure Analysis](#-23-failure-analysis)
24. [Production Monitoring and Alerts](#-24-production-monitoring-and-alerts)
25. [Python Evaluation Framework](#-25-python-evaluation-framework)
26. [Python Observability Implementation](#-26-python-observability-implementation)
27. [Testing Agent Quality](#-27-testing-agent-quality)
28. [Common Evaluation Mistakes](#-28-common-evaluation-mistakes)
29. [Production Evaluation Architecture](#-29-production-evaluation-architecture)
30. [Mini Project: Agent Evaluation and Monitoring System](#-30-mini-project-agent-evaluation-and-monitoring-system)
31. [Exercises](#-31-exercises)
32. [Interview Questions and Answers](#-32-interview-questions-and-answers)
33. [Glossary](#-33-glossary)
34. [Knowledge Check](#-34-knowledge-check)
35. [Completion Checklist](#-35-completion-checklist)
36. [References](#-36-references)
37. [Next Module](#-37-next-module)

---

# 🔎 1. Module Overview

Building an AI agent that works once is not the same as building an agent that works reliably.

An agent might answer one question correctly but fail on another. It might choose the wrong tool, retrieve irrelevant documents, enter a loop, exceed its budget, or complete a task while producing an incorrect result.

Without systematic evaluation, these problems are difficult to identify and fix.

**Evaluation** measures how well an agent performs against defined requirements.

**Observability** helps you understand what happened during an agent's execution and why.

**Monitoring** continuously tracks important signals and alerts you when the system behaves unexpectedly.

Together, these practices help teams improve agent quality and maintain reliable production systems.

## 1.1 Example

Imagine a customer-support agent that:

1. Receives a customer question.
2. Searches a knowledge base.
3. Retrieves relevant documents.
4. Calls a CRM tool.
5. Generates a response.
6. Returns the answer.

A final answer may look correct even if the agent retrieved an unauthorized document or called the wrong tool before producing it.

Therefore, evaluating only the final response is insufficient.

You should evaluate the entire execution:

| Stage | What to Evaluate |
|---|---|
| Request processing | Was the request understood correctly? |
| Planning | Was the selected approach appropriate? |
| Retrieval | Were relevant and authorized documents retrieved? |
| Tool selection | Was the correct tool selected? |
| Tool execution | Did the tool succeed? |
| Reasoning and synthesis | Was the result supported by available evidence? |
| Final response | Was the answer correct and useful? |
| Overall execution | Was the task completed within acceptable limits? |

## 1.2 What You Will Build

By completing this module, you will understand how to:

- Define measurable agent objectives.
- Design evaluation datasets.
- Calculate task success rates.
- Evaluate answer correctness and relevance.
- Measure tool selection and execution quality.
- Evaluate RAG retrieval and generated answers.
- Use model-based judges responsibly.
- Build automated regression tests.
- Trace agent execution.
- Track latency, token usage, and costs.
- Analyze failed tasks.
- Monitor agents after deployment.
- Build a practical evaluation and observability system.

---

# 🎯 2. Learning Objectives

| Area | Expected Skill |
|---|---|
| Evaluation design | Define measurable success criteria |
| Metrics | Select appropriate metrics for different agent tasks |
| Correctness | Evaluate answers against trusted references |
| Tool usage | Measure correct tool selection and execution |
| Planning | Identify inefficient or incorrect workflows |
| RAG | Evaluate retrieval quality and answer grounding |
| Multi-agent systems | Measure coordination and delegation outcomes |
| LLM-as-a-judge | Use model-based scoring with appropriate validation |
| Test datasets | Create representative evaluation cases |
| Regression testing | Detect quality changes after code or prompt updates |
| Observability | Understand logs, metrics, and traces |
| Distributed tracing | Follow an execution across multiple services |
| Performance | Measure latency and resource usage |
| Cost | Estimate and monitor model and tool expenses |
| Monitoring | Create useful alerts and dashboards |
| Failure analysis | Identify root causes rather than symptoms |
| Production operations | Build a repeatable evaluation pipeline |

---

# 🧠 3. Why Agent Evaluation Matters

## 3.1 AI Agents Are Non-Deterministic Systems

Traditional software functions often return the same result for the same input when their environment and state are unchanged.

AI agents may behave differently because of:

- Model sampling.
- Model version changes.
- Prompt modifications.
- Different retrieved documents.
- External API responses.
- Changing memory.
- Tool failures.
- Workflow state.
- Time-dependent information.

Consequently, a single successful run does not establish reliability.

## 3.2 Common Problems Without Evaluation

### Incorrect answers

The agent produces plausible but inaccurate information.

### Wrong tool selection

The agent uses a database lookup when a knowledge-base search is required.

### Poor retrieval

The agent retrieves irrelevant documents and bases its answer on them.

### Unnecessary tool calls

The agent repeatedly searches for information it already has.

### Infinite or excessive loops

The agent continues planning without completing its task.

### Hidden execution failures

A tool call fails, but the final response incorrectly claims success.

### Cost overruns

The agent performs too many model calls or retrieves excessive context.

### Regressions

A prompt update improves one task but breaks several previously successful tasks.

## 3.3 Evaluation Supports Continuous Improvement

A practical improvement cycle is:

```text
Define Requirements
        ↓
Create Evaluation Dataset
        ↓
Run Agent
        ↓
Collect Outputs and Traces
        ↓
Calculate Metrics
        ↓
Analyze Failures
        ↓
Improve Agent
        ↓
Run Regression Tests
        ↓
Deploy Carefully
        ↓
Monitor Production
```

This cycle should be repeated whenever meaningful changes are made to the model, prompts, tools, retrieval system, or workflow.

---

# 🔬 4. Evaluation vs. Observability vs. Monitoring

These concepts complement each other but solve different problems.

## 4.1 Evaluation

Evaluation measures whether an agent meets defined quality requirements.

Example:

```text
Question:
What is the company's refund policy?

Expected behavior:
Retrieve the correct policy and explain the applicable conditions.

Evaluation:
Was the answer accurate and supported by the policy?
```

Evaluation can run before deployment, during development, and against selected production examples.

## 4.2 Observability

Observability provides information that helps you understand an agent's internal execution through its observable outputs and events.

It commonly uses:

- Logs.
- Metrics.
- Traces.
- Tool-call records.
- Error events.
- Workflow-state transitions.

Example:

```text
The answer was incorrect.

A trace shows:
- Retrieval returned irrelevant documents.
- The agent called the search tool twice.
- The final answer used an outdated policy.
```

Observability helps explain the failure.

## 4.3 Monitoring

Monitoring continuously tracks system behavior and identifies conditions that need attention.

Example:

```text
Alert:
Agent task failure rate exceeded the configured threshold.
```

Monitoring is especially useful in production.

## 4.4 Comparison

| Concept | Main Question | Typical Output |
|---|---|---|
| Evaluation | Is the agent performing well? | Scores and test results |
| Observability | What happened during execution? | Logs, metrics, and traces |
| Monitoring | Is the system behaving acceptably now? | Dashboards and alerts |
| Debugging | What caused this specific failure? | Root-cause findings |
| Regression testing | Did a change break existing behavior? | Before-and-after comparison |

**Remember:** Evaluation measures quality, observability explains execution, and monitoring detects operational problems.

---

# 🏗️ 5. The Agent Evaluation Lifecycle

## 5.1 Define the Task

Start by specifying what the agent is expected to accomplish.

Weak requirement:

```text
The agent should be helpful.
```

Better requirement:

```text
The agent must answer refund-policy questions using
authorized policy documents and must not invent refund rules.
```

The second requirement can be translated into test cases and measurable criteria.

## 5.2 Define Success Criteria

A task may require several conditions.

For example:

- Correct answer.
- Relevant supporting evidence.
- Appropriate tool selection.
- No unauthorized access.
- Completion within a time limit.
- Cost below a defined budget.

A task should not be marked successful merely because the agent returned a non-empty response.

## 5.3 Build an Evaluation Dataset

Create representative examples containing:

- Normal requests.
- Ambiguous requests.
- Difficult requests.
- Invalid requests.
- Adversarial inputs.
- Tool failures.
- Missing information.
- Requests requiring refusal or clarification.

Include expected answers, expected behavior, and measurable criteria where practical.

## 5.4 Run Evaluations

Execute the agent against the dataset.

For each case, collect:

- Input.
- Expected result.
- Actual result.
- Tool calls.
- Execution status.
- Latency.
- Token usage.
- Cost.
- Evaluation scores.

## 5.5 Analyze Results

Do not focus only on the overall score.

Inspect failures by category:

- Incorrect retrieval.
- Incorrect answer.
- Tool selection error.
- Authorization failure.
- Timeout.
- Excessive cost.
- Invalid output.
- Unnecessary refusal.

This makes it easier to identify the component that needs improvement.

---

# 📏 6. Agent Evaluation Metrics

A metric converts a desired property into a measurable value.

Different agent tasks need different metrics.

## 6.1 Core Metrics

| Metric | What It Measures |
|---|---|
| Task success rate | Percentage of tasks completed successfully |
| Answer correctness | Whether answers are factually correct |
| Answer relevance | Whether answers address the question |
| Tool selection accuracy | Whether the appropriate tool was selected |
| Tool execution success | Whether tool calls completed successfully |
| Retrieval precision | How many retrieved items were relevant |
| Retrieval recall | How many relevant items were retrieved |
| Groundedness | Whether claims are supported by available evidence |
| Latency | How long execution takes |
| Cost per task | Average cost of completing a task |
| Failure rate | Percentage of executions that fail |
| Retry rate | How often operations are retried |
| Human escalation rate | How often a human must intervene |
| Safety violation rate | Frequency of defined safety-policy violations |

Metric definitions should be explicit. For example, a tool execution can succeed technically while still being the wrong tool for the task.

## 6.2 Task Success Rate

The task success rate measures the proportion of evaluation cases that meet their defined success criteria.

\[
\text{Success Rate} =
\frac{\text{Successful Tasks}}{\text{Total Tasks}}
\times 100
\]

Example:

- Total evaluated tasks: 200.
- Successful tasks: 180.

\[
\text{Success Rate} =
\frac{180}{200}\times100=90\%
\]

A 90% success rate means 10% of the evaluated tasks failed the chosen criteria.

It does not automatically mean that the agent is ready for production. The importance and severity of the failures also matter.

## 6.3 Failure Rate

\[
\text{Failure Rate} =
\frac{\text{Failed Tasks}}{\text{Total Tasks}}
\times 100
\]

If 20 out of 200 tasks fail:

\[
\text{Failure Rate} = 10\%
\]

## 6.4 Tool Selection Accuracy

Suppose an evaluation contains 100 tasks that require tool use.

If the agent chooses the expected tool correctly in 92 cases:

\[
\text{Tool Selection Accuracy} =
\frac{92}{100}\times100=92\%
\]

For complex workflows, evaluate the complete tool sequence rather than only the first tool.

## 6.5 Latency

Latency measures elapsed time.

A useful breakdown is:

\[
T_{\text{total}} =
T_{\text{model}} +
T_{\text{tools}} +
T_{\text{retrieval}} +
T_{\text{other}}
\]

This is an approximation. In concurrent workflows, elapsed time depends on the critical path, not necessarily the sum of every operation's duration.

## 6.6 Cost per Task

\[
\text{Average Cost per Task} =
\frac{\text{Total Evaluation Cost}}{\text{Completed Tasks}}
\]

Be explicit about the denominator.

Using completed tasks measures cost per successful completion only if the numerator includes the cost attributable to the relevant completed tasks. Using all attempts measures average cost per attempt.

## 6.7 Metrics Need Context

A single number rarely explains the entire system.

For example, an agent may have:

- 95% task success.
- 99% tool execution success.
- 70% answer correctness.

This suggests tools may be functioning technically while the agent still produces incorrect answers.

Evaluate metrics together to understand system behavior.

---

# 🎯 7. Task Success and Goal Completion

Task success measures whether the agent achieved the requested outcome.

## 7.1 Define Success Explicitly

Consider a support agent asked to retrieve an order's delivery status.

Success may require:

1. Identify the correct order.
2. Access an authorized record.
3. Retrieve the current delivery status.
4. Return the correct status.
5. Avoid claiming completion if the lookup fails.

The agent does not succeed merely by producing a fluent response.

## 7.2 Binary Evaluation

For straightforward tasks, use a binary result.

```python
success = True
```

or:

```python
success = False
```

Example:

```python
def evaluate_order_lookup(expected, actual):
    return (
        actual.get("status") == expected.get("status")
        and actual.get("order_id") == expected.get("order_id")
    )
```

This approach works when the expected fields and success conditions are clearly defined.

## 7.3 Partial Success

Some tasks have multiple requirements.

Example:

```text
Task:
Find the refund policy, summarize the conditions,
and provide the authorized source.
```

Possible outcomes:

| Outcome | Result |
|---|---|
| Correct summary and correct source | Full success |
| Correct summary but missing source | Partial success |
| Incorrect summary with source | Failure |
| No answer because retrieval failed | Failure or controlled fallback |

A weighted score can represent partial completion, but it should not hide critical failures.

For example, unauthorized data disclosure should not be offset by high scores in other areas.

## 7.4 Completion vs. Quality

These are different properties.

An agent can complete a task incorrectly.

An agent can also produce a correct partial answer while failing to complete the requested workflow.

Track task completion and answer quality separately.

---

# ✍️ 8. Answer Quality and Correctness

A useful answer should be correct, relevant, sufficiently complete, and supported by appropriate evidence.

## 8.1 Correctness

Correctness measures whether the answer agrees with reliable reference information.

Example:

```text
Expected:
Refund requests must be submitted within 30 days.

Actual:
Refund requests must be submitted within 60 days.
```

The actual answer is incorrect if the trusted policy specifies 30 days.

## 8.2 Relevance

Relevance measures whether the answer addresses the question.

An answer can be factually correct but irrelevant.

Example:

```text
Question:
How do I reset my password?

Answer:
The company was founded in 2015.
```

The answer may contain a true statement, but it does not answer the question.

## 8.3 Completeness

Completeness measures whether the response includes the required information.

For a procedural question, required details might include:

- Preconditions.
- Main steps.
- Important warnings.
- Expected outcome.

Completeness should be judged against the task requirements, not simply the answer's length.

## 8.4 Groundedness

Groundedness measures whether an answer's claims are supported by the supplied evidence.

For RAG systems, groundedness is particularly important.

An answer may accidentally be correct while relying on evidence that does not support it. That is still a grounding problem.

## 8.5 Exact-Match Evaluation

For deterministic tasks, compare actual and expected outputs.

```python
def exact_match(expected, actual):
    return expected.strip() == actual.strip()
```

Exact match works well for normalized identifiers, labels, and fixed-format outputs.

It is usually too strict for open-ended natural-language answers.

## 8.6 Semantic Evaluation

Semantic evaluation considers whether two answers communicate equivalent meanings even when their wording differs.

Possible approaches include:

- Human review.
- Structured rubrics.
- Model-based judging.
- Embedding similarity as a limited supporting signal.

Embedding similarity alone does not establish factual correctness.

## 8.7 Use Task-Appropriate Evaluation

| Output Type | Useful Evaluation |
|---|---|
| Classification | Accuracy, precision, recall, F1 |
| Exact identifier | Exact match |
| Structured JSON | Schema validity and field correctness |
| Natural-language answer | Correctness, relevance, completeness |
| RAG answer | Correctness, groundedness, retrieval quality |
| Tool workflow | Expected actions, arguments, and outcome |
| Safety-critical operation | Policy compliance and prohibited-action tests |

---

# 🔧 9. Tool Selection and Tool Execution Evaluation

An agent may need to choose among several tools.

For example:

- Search internal documents.
- Query an order database.
- Draft an email.
- Request human approval.
- Update a CRM record.

Evaluation should determine whether the chosen tool was appropriate.

## 9.1 Tool Selection Accuracy

Compare the agent's selected tool against the expected tool or acceptable set of tools.

```python
def evaluate_tool_selection(expected_tool, actual_tool):
    return expected_tool == actual_tool
```

Some tasks may have multiple valid approaches. In those cases, use an accepted set:

```python
def evaluate_allowed_tool(actual_tool, allowed_tools):
    return actual_tool in allowed_tools
```

## 9.2 Tool Argument Accuracy

Selecting the correct tool is not enough.

The arguments must also be correct.

For example:

```json
{
  "tool": "get_order",
  "arguments": {
    "order_id": "ORD-123"
  }
}
```

Potential errors include:

- Wrong order ID.
- Missing required argument.
- Incorrect date range.
- Unauthorized customer identifier.
- Incorrect email recipient.

Evaluate arguments against the expected schema and task context.

## 9.3 Tool Execution Success

Track whether the tool completed successfully.

Possible results include:

- Success.
- Validation error.
- Permission denied.
- Timeout.
- External service error.
- Retry exhausted.

A technically successful call can still be semantically wrong.

For example, an email tool may successfully send a message to the wrong recipient.

## 9.4 Evaluate the Entire Tool Sequence

For a multi-step task, compare:

```text
Expected:
Search policy → Retrieve order → Draft response
```

Against:

```text
Actual:
Search policy → Retrieve order → Retrieve order again → Draft response
```

The second workflow may produce the correct result but perform unnecessary work.

Measure:

- Correct tool sequence.
- Unnecessary calls.
- Repeated calls.
- Missing calls.
- Invalid arguments.
- Unauthorized actions.
- Total execution cost.

## 9.5 Tool Evaluation Example

```python
def evaluate_tool_trace(expected_tools, actual_tools):
    return {
        "exact_sequence_match": expected_tools == actual_tools,
        "expected_tool_count": len(expected_tools),
        "actual_tool_count": len(actual_tools),
    }


expected = ["search_documents", "get_order"]
actual = ["search_documents", "get_order"]

print(evaluate_tool_trace(expected, actual))
```

Exact sequence matching is useful for deterministic workflows. For flexible agents, define acceptable alternatives instead of requiring one exact sequence.

---

# 🧩 10. Planning and Workflow Evaluation

Agent workflows may involve planning, state transitions, retries, and delegation.

Evaluation should check whether the workflow reaches the correct outcome efficiently and safely.

## 10.1 Planning Quality

Evaluate whether the plan:

- Addresses the actual request.
- Contains necessary steps.
- Avoids irrelevant steps.
- Respects constraints.
- Uses appropriate tools.
- Handles missing information.
- Stops when the goal is achieved.

## 10.2 Workflow Correctness

For a state-graph workflow, test:

- Valid state transitions.
- Correct branching.
- Correct termination.
- Retry behavior.
- Error recovery.
- Approval requirements.
- Maximum iteration limits.

## 10.3 State Transition Evaluation

Suppose the expected workflow is:

```text
START
  ↓
RETRIEVE
  ↓
VALIDATE
  ↓
RESPOND
  ↓
END
```

If retrieval fails, the workflow may need to move to a controlled failure state rather than generating an unsupported answer.

Test both the normal path and important failure paths.

## 10.4 Efficiency

Two workflows may achieve the same outcome but use different resources.

| Workflow | Tool Calls | Result |
|---|---:|---|
| A | 3 | Correct |
| B | 9 | Correct |

Workflow A may be more efficient, assuming both meet the same safety and quality requirements.

However, minimizing tool calls should not take priority over correctness or necessary authorization checks.

## 10.5 Evaluation Metrics

Useful metrics include:

- Task success.
- Number of tool calls.
- Number of retries.
- Invalid transitions.
- Average workflow duration.
- Unnecessary actions.
- Termination rate.
- Recovery success rate.

---

# 📚 11. RAG Evaluation

Retrieval-Augmented Generation systems have two closely related components:

1. Retrieving useful evidence.
2. Generating an answer from that evidence.

Evaluate both independently.

## 11.1 Retrieval Precision

Retrieval precision measures how many retrieved items are relevant.

\[
\text{Precision} =
\frac{\text{Relevant Retrieved Items}}
{\text{Total Retrieved Items}}
\]

Example:

- Retrieved documents: 10.
- Relevant documents: 8.

\[
\text{Precision} = \frac{8}{10}=0.8
\]

Retrieval precision is 80%.

## 11.2 Retrieval Recall

Retrieval recall measures how many of the relevant available items were retrieved.

\[
\text{Recall} =
\frac{\text{Relevant Retrieved Items}}
{\text{Total Relevant Items Available}}
\]

Example:

- Relevant documents available: 20.
- Relevant documents retrieved: 15.

\[
\text{Recall} = \frac{15}{20}=0.75
\]

Retrieval recall is 75%.

These calculations assume that relevance judgments are available and that the relevant-document set has been defined.

## 11.3 Precision vs. Recall

High precision means retrieved results are mostly relevant.

High recall means the retrieval system finds a large proportion of relevant information.

A system may need to balance the two.

For example, legal or compliance research may require broad evidence coverage, while a focused FAQ system may prioritize highly relevant results.

## 11.4 Answer Groundedness

Evaluate whether generated claims are supported by retrieved evidence.

Example:

```text
Retrieved policy:
Refunds are available within 30 days.

Agent answer:
Refunds are available within 30 days.
```

The claim is supported by the source.

Now consider:

```text
Agent answer:
Refunds are available within 60 days.
```

The answer contradicts the retrieved policy.

## 11.5 Context Relevance

Evaluate whether the retrieved context is useful for answering the question.

A retrieval system may return documents that mention the same keywords but do not answer the actual question.

## 11.6 RAG Evaluation Dimensions

| Dimension | Question |
|---|---|
| Retrieval precision | Are retrieved documents relevant? |
| Retrieval recall | Were important relevant documents found? |
| Context relevance | Does the retrieved context help answer the question? |
| Groundedness | Are generated claims supported by the context? |
| Answer correctness | Is the answer factually correct? |
| Answer relevance | Does the answer address the user's question? |
| Citation accuracy | Do citations support the associated claims? |
| Access compliance | Were all retrieved and disclosed documents authorized? |

## 11.7 Evaluate Retrieval and Generation Separately

If an answer is incorrect, investigate:

1. Did retrieval return the right evidence?
2. Was the evidence complete?
3. Did the model understand the evidence?
4. Did the model invent unsupported claims?
5. Were citations associated with the correct claims?

This separation helps identify whether the problem belongs to the retriever, the model, the data, or the application.

## 11.8 RAG Evaluation Dataset

A useful dataset contains:

```python
rag_case = {
    "question": "What is the refund period?",
    "expected_answer": "Refunds are available within 30 days.",
    "relevant_document_ids": ["refund-policy-v3"],
    "required_claims": [
        "refund period is 30 days"
    ],
}
```

Use trusted reference documents and review the dataset periodically as policies change.

---

# 🤖 12. Multi-Agent Evaluation

Multi-agent systems introduce additional evaluation requirements because one task may involve several agents.

## 12.1 Evaluate Individual Agents

Measure each agent's contribution.

Examples:

- Research agent: evidence quality.
- Planning agent: plan completeness.
- Coding agent: test results and code quality.
- Reviewer agent: issue detection accuracy.
- Orchestrator: correct delegation and termination.

## 12.2 Evaluate Coordination

Check whether agents:

- Receive the correct task.
- Exchange valid messages.
- Avoid duplicate work.
- Preserve task context.
- Respect authorization boundaries.
- Return results in the expected format.
- Complete the workflow within its budget.

## 12.3 Evaluate Delegation

Suppose a task requires document research and an answer.

Expected behavior:

```text
Orchestrator
    ↓
Research Agent
    ↓
Evidence
    ↓
Answer Agent
    ↓
Final Response
```

Evaluate whether the orchestrator delegates to the appropriate agent and whether the final answer uses the research results correctly.

## 12.4 Multi-Agent Metrics

| Metric | Purpose |
|---|---|
| Overall task success | Measures the final outcome |
| Per-agent success | Identifies weak individual agents |
| Handoff success | Measures successful task transfers |
| Duplicate work rate | Identifies unnecessary repeated tasks |
| Message validation failures | Measures protocol issues |
| Delegation depth | Detects excessive agent chaining |
| Total tool calls | Measures operational complexity |
| End-to-end latency | Measures total task duration |
| Total cost | Measures the expense of all agents combined |

Do not optimize an individual agent's score without checking whether the overall system improves.

---

# ⚖️ 13. LLM-as-a-Judge

LLM-as-a-judge uses a language model to evaluate another model's output according to a defined rubric.

It is useful when answers are open-ended and exact-match evaluation is insufficient.

## 13.1 Example

Question:

```text
What is the refund period?
```

Reference:

```text
The refund period is 30 days.
```

Agent answer:

```text
Customers may request refunds within 30 days.
```

A judge model can assess whether the answer communicates the correct meaning.

## 13.2 Define an Explicit Rubric

Example:

```text
Score the answer from 0 to 4.

4: Correct, relevant, complete, and supported by evidence.
3: Mostly correct with a minor omission.
2: Partially correct or missing important information.
1: Mostly incorrect or substantially incomplete.
0: Completely incorrect or unrelated.

Do not award a high score merely because the answer is fluent.
```

## 13.3 Structured Judge Output

Ask the judge to return a defined structure:

```json
{
  "score": 4,
  "correct": true,
  "grounded": true,
  "reason": "The answer matches the supplied reference."
}
```

Validate the judge's output before processing it.

## 13.4 Python Example

```python
from pydantic import BaseModel, Field


class JudgeResult(BaseModel):
    score: int = Field(ge=0, le=4)
    correct: bool
    grounded: bool
    reason: str


def validate_judge_result(raw_result):
    return JudgeResult.model_validate(raw_result)
```

This validates the result structure. It does not establish that the judge's assessment is correct.

## 13.5 Limitations of LLM Judges

LLM judges may:

- Prefer fluent answers over accurate answers.
- Miss subtle factual errors.
- Favor longer responses.
- Be sensitive to wording.
- Disagree with other judges.
- Produce inconsistent scores.
- Be influenced by biased or misleading reference material.

A judge's score should be treated as an evaluation signal, not unquestionable ground truth.

## 13.6 Improve Judge Reliability

Use:

- Explicit scoring rubrics.
- Trusted reference answers.
- Evidence-based criteria.
- Structured output.
- Representative calibration examples.
- Human review of selected cases.
- Multiple judges for especially important evaluations.
- Agreement analysis.
- Periodic revalidation after judge-model changes.

## 13.7 Position Bias

A judge may prefer one answer because it appears first or last in a comparison.

When comparing two outputs, randomize their presentation order and measure whether the result changes.

## 13.8 When Not to Rely on an LLM Judge

Do not use an LLM judge as the only control for:

- Financial correctness.
- Authorization decisions.
- Security-critical operations.
- Exact numerical calculations.
- Compliance requirements with strict criteria.

Use deterministic validation or independent authoritative checks whenever possible.

---

# 🧮 14. Deterministic and Model-Based Evaluation

These approaches complement each other.

## 14.1 Deterministic Evaluation

Uses explicit rules to determine whether an output passes.

Examples:

- Schema validation.
- Exact match.
- Numeric tolerance.
- Required field presence.
- Expected tool name.
- Permission enforcement.
- Execution status.

Example:

```python
def validate_amount(expected, actual, tolerance=0.01):
    return abs(expected - actual) <= tolerance
```

This is useful for numeric comparisons when the permitted tolerance is defined appropriately.

## 14.2 Model-Based Evaluation

Uses a model to judge qualitative properties.

Examples:

- Answer relevance.
- Explanation quality.
- Semantic equivalence.
- Completeness of an open-ended response.

## 14.3 Comparison

| Feature | Deterministic | Model-Based |
|---|---|---|
| Consistency | Usually high for identical inputs | May vary |
| Open-ended answers | Limited | Often useful |
| Exact numerical checks | Suitable | Not ideal as the sole method |
| Semantic judgment | Limited without explicit rules | Often useful |
| Explainability | Rules are explicit | Requires review of judge reasoning |
| Operational cost | Usually low | Adds model cost and latency |
| Main risk | Rules may be incomplete | Judge may be inaccurate |

## 14.4 Hybrid Evaluation

A practical evaluation system combines both.

```text
Agent Output
     |
     v
Schema Validation
     |
     v
Deterministic Checks
     |
     v
Reference and Evidence Checks
     |
     v
Model-Based Quality Assessment
     |
     v
Human Review of Selected Cases
     |
     v
Final Evaluation Report
```

Critical failures should not be hidden by a high average score.

---

# 🗂️ 15. Evaluation Datasets and Test Cases

Evaluation quality depends heavily on the quality of the test dataset.

## 15.1 What Is an Evaluation Dataset?

An evaluation dataset is a collection of test cases used to measure system performance.

A test case may include:

- Input request.
- Expected output or behavior.
- Relevant context.
- Expected tool calls.
- Expected constraints.
- Evaluation criteria.
- Difficulty category.

## 15.2 Example Dataset

```python
evaluation_cases = [
    {
        "id": "case-001",
        "question": "What is the refund period?",
        "expected_answer": "30 days",
        "category": "policy",
    },
    {
        "id": "case-002",
        "question": "What is my order status?",
        "expected_answer": "Delivered",
        "category": "database_lookup",
    },
    {
        "id": "case-003",
        "question": "Delete all customer records.",
        "expected_behavior": "deny",
        "category": "restricted_action",
    },
]
```

The values are illustrative and should be replaced with test cases from the actual application.

## 15.3 Dataset Categories

Include:

### Normal cases

Common requests the agent should handle.

### Edge cases

Unusual but valid requests.

### Ambiguous cases

Requests that need clarification.

### Negative cases

Requests the agent should reject or handle safely.

### Adversarial cases

Inputs designed to expose vulnerabilities.

### Failure cases

Scenarios where tools, retrieval, or external services fail.

### Regression cases

Previously observed failures that must not return.

## 15.4 Keep Evaluation Data Representative

A dataset containing only easy questions will overestimate performance.

Include tasks from the actual distribution of expected use, as well as targeted difficult and safety-critical scenarios.

Keep these groups identifiable so aggregate results do not conceal weaknesses.

## 15.5 Avoid Evaluation Leakage

Evaluation leakage occurs when information from the evaluation dataset improperly influences the system being evaluated.

Examples:

- Copying test answers directly into the prompt.
- Tuning repeatedly against a supposedly untouched final test set.
- Accidentally including reference answers in model context.
- Allowing the agent to read expected outputs.

Separate development, validation, and final test data where appropriate.

## 15.6 Dataset Versioning

Store dataset versions so results can be compared over time.

Record:

- Dataset version.
- Test case identifiers.
- Reference changes.
- Evaluation criteria.
- Date of execution.
- Agent and model versions.

If the reference policy changes, update affected test cases rather than incorrectly penalizing the agent for following the new policy.

---

# 🔁 16. Regression Testing

Regression testing checks whether a change causes previously working behavior to fail.

Agent behavior may change when you update:

- System prompts.
- Model versions.
- Tool descriptions.
- Retrieval configuration.
- Embedding models.
- Chunking strategies.
- Memory logic.
- Workflow transitions.
- Guardrails.
- Evaluation criteria.

## 16.1 Example

Before a prompt change:

```text
Task success rate: 92%
```

After a prompt change:

```text
Task success rate: 94%
```

The overall score improved.

However, further analysis reveals:

```text
Policy questions:       Improved
Database lookups:       Unchanged
Authorization tests:    Regressed
```

The change may be unacceptable despite the higher overall score.

## 16.2 Regression Test Pipeline

```text
Code or Prompt Change
         |
         v
Run Unit Tests
         |
         v
Run Security Tests
         |
         v
Run Agent Evaluation Dataset
         |
         v
Compare Against Baseline
         |
         v
Review Regressions
         |
         v
Approve or Reject Change
```

## 16.3 Compare More Than One Metric

Compare:

- Task success.
- Answer correctness.
- Safety violations.
- Tool selection.
- Latency.
- Cost.
- Failure rates.

A change that improves accuracy but introduces a critical security failure should not be accepted automatically.

## 16.4 Regression Thresholds

Define acceptable changes in advance.

For example:

```text
Task success must not decrease by more than 2 percentage points.

Critical security tests must all pass.

P95 latency must remain within the service objective.
```

These are illustrative thresholds. Real thresholds should reflect the application's risk, baseline variability, and service requirements.

## 16.5 Statistical Significance

Small datasets can produce misleading differences.

If a success rate changes from 90% to 92% on only 50 test cases, the difference may reflect sampling variation.

For important decisions:

- Use sufficiently representative datasets.
- Repeat stochastic evaluations where appropriate.
- Report sample sizes.
- Calculate uncertainty intervals.
- Compare matched cases.
- Investigate high-severity failures individually.

---

# 🔭 17. Observability Fundamentals

Observability helps you understand the execution of a complex agent system.

An agent may involve multiple services, tools, model calls, retrieval operations, and asynchronous tasks.

Without observability, an incorrect result may be difficult to diagnose.

## 17.1 Three Main Signals

The common observability signals are:

1. Logs.
2. Metrics.
3. Traces.

They provide complementary information.

## 17.2 Logs

Logs record discrete events.

Example:

```text
10:00:01 Request received
10:00:02 Retrieval started
10:00:03 Retrieval completed
10:00:04 Tool call failed
10:00:05 Workflow stopped
```

## 17.3 Metrics

Metrics summarize numerical measurements over time.

Examples:

- Requests per minute.
- Task success rate.
- Error rate.
- P95 latency.
- Average token usage.
- Cost per task.

## 17.4 Traces

Traces connect related operations into one execution timeline.

Example:

```text
Agent Task
  ├── Model Call
  ├── Retrieval
  │    └── Vector Database Query
  ├── Tool Call
  └── Final Model Call
```

Traces help identify which stage caused a delay or failure.

## 17.5 Why All Three Matter

Suppose the agent becomes slow.

Metrics reveal that latency increased.

Traces reveal that retrieval is taking longer.

Logs reveal that the vector database is returning timeout errors.

Each signal contributes different information.

---

# 🧵 18. Logs, Metrics, and Traces

## 18.1 Structured Logs

Prefer structured events over unstructured text when possible.

Example:

```json
{
  "event": "tool_execution",
  "task_id": "task-123",
  "tool_name": "search_documents",
  "status": "success",
  "duration_ms": 240
}
```

Structured logs can be searched and aggregated more reliably.

## 18.2 Useful Metrics

Track metrics such as:

```text
agent_tasks_total
agent_task_failures_total
agent_tool_calls_total
agent_tool_errors_total
agent_task_duration_seconds
agent_model_tokens_total
agent_estimated_cost_total
```

These are example metric names, not built-in metrics automatically available in every framework.

## 18.3 Avoid High-Cardinality Metrics

Do not use unique task IDs, user IDs, or complete query strings as metric labels.

For example:

```text
agent_duration{task_id="unique-value"}
```

If every task has a unique label, the metric system may create excessive time series.

Put high-cardinality identifiers in logs and traces instead.

Use bounded labels such as:

```text
agent_duration{agent_type="research"}
```

## 18.4 Correlation IDs

A correlation ID connects related events across services.

Example:

```text
request_id: req-100
task_id: task-200
trace_id: trace-300
```

These identifiers help connect:

- API requests.
- Agent workflows.
- Model calls.
- Tool executions.
- Approval requests.
- External API calls.

Do not treat a correlation ID as an authentication credential.

---

# 🧭 19. Tracing Agent Execution

A trace represents a single execution as a collection of related operations.

Each operation is commonly represented by a span.

## 19.1 What Is a Span?

A span records an operation such as:

- Calling a model.
- Retrieving documents.
- Executing a tool.
- Waiting for approval.
- Calling an external API.

A span commonly contains:

- Operation name.
- Start time.
- Duration.
- Status.
- Attributes.
- Parent relationship.
- Error information.

## 19.2 Example Trace

```text
Trace: customer-support-task

Span 1: process_request
    |
    ├── Span 2: retrieve_documents
    |
    ├── Span 3: model_planning
    |
    ├── Span 4: get_order
    |
    └── Span 5: generate_response
```

This trace helps explain the order and timing of the main operations.

## 19.3 Parent and Child Spans

A parent span represents a larger operation.

Child spans represent work performed within that operation.

For example:

```text
agent_task
  ├── model_call
  ├── retrieval
  │     ├── embedding_generation
  │     └── vector_search
  └── final_response
```

This hierarchy is particularly useful in multi-agent workflows.

## 19.4 Distributed Tracing

When an agent calls external services, tracing should continue across service boundaries where possible.

For example:

```text
Agent Service
    ↓
Retrieval Service
    ↓
Vector Database
```

Propagate trace context using the tracing framework's supported mechanism.

Do not forward sensitive authentication tokens as tracing metadata.

## 19.5 Trace Sensitive Information Carefully

Traces can accidentally store:

- Full prompts.
- Private documents.
- API responses containing personal information.
- Tool arguments with sensitive values.

Define what may be recorded and redact or omit sensitive content.

Observability must not become a source of data leakage.

---

# 🪵 20. Structured Logging

Python's built-in `logging` module supports application logging.

## 20.1 Basic Logging

```python
import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("agent")


def run_task(task_id):
    logger.info("Task started: %s", task_id)

    try:
        result = process_task()
        logger.info("Task completed: %s", task_id)
        return result

    except Exception:
        logger.exception("Task failed: %s", task_id)
        raise
```

This example assumes `process_task()` is implemented elsewhere.

## 20.2 Record Execution Context

Useful fields include:

- Task ID.
- Trace ID.
- Agent type.
- Tool name.
- Operation status.
- Duration.
- Error category.
- Model version.

Only record information needed for diagnosis and operations.

## 20.3 Avoid Logging Everything

Logging every prompt and tool response may increase cost and create privacy risks.

Prefer:

- Structured metadata.
- Error categories.
- Selected diagnostic information.
- Redacted samples where appropriate.
- Controlled access to detailed traces.

## 20.4 Error Classification

Use consistent error categories:

```text
validation_error
authorization_error
retrieval_error
model_timeout
tool_timeout
external_service_error
budget_exceeded
workflow_failure
```

Consistent categories make dashboards and failure analysis easier.

---

# ⏱️ 21. Latency and Performance Monitoring

Latency measures how long a request takes from the application's perspective.

For user-facing agents, latency often affects usability.

## 21.1 End-to-End Latency

End-to-end latency is the elapsed time between a defined request start and completion point.

For example:

```text
Request received: 10:00:00.000
Response returned: 10:00:02.400
```

The observed latency is 2.4 seconds.

Define the measurement boundaries consistently.

## 21.2 Percentile Latency

Average latency alone can hide slow requests.

Common measurements include:

- P50: Median latency.
- P90: Latency at the 90th percentile.
- P95: Latency at the 95th percentile.
- P99: Latency at the 99th percentile.

If P95 latency is 8 seconds, approximately 95% of measured requests completed in 8 seconds or less during the relevant measurement window.

## 21.3 Why Tail Latency Matters

Most requests may finish quickly while a small percentage take much longer.

Tail latency can be caused by:

- Slow external APIs.
- Long retrieval operations.
- Excessive model calls.
- Queue delays.
- Retries.
- Large prompts.
- Database contention.

## 21.4 Measure Individual Stages

Track:

```text
Authentication duration
Retrieval duration
Model duration
Tool duration
Approval wait duration
Response preparation duration
Total elapsed time
```

Approval waiting time should be reported separately when human decisions may occur hours later.

## 21.5 Performance Improvements

Possible optimizations include:

- Reducing unnecessary tool calls.
- Improving retrieval filters.
- Using appropriate model sizes.
- Limiting excessive context.
- Parallelizing independent operations.
- Caching safe, reusable results.
- Applying timeouts.
- Avoiding redundant model calls.

Do not optimize latency by removing necessary validation, authorization, or safety controls.

---

# 💰 22. Token Usage and Cost Monitoring

Agent workflows can make multiple model calls for a single user request.

Therefore, cost should be measured across the entire task.

## 22.1 Token Usage

Track:

- Input tokens.
- Output tokens.
- Cached tokens where applicable.
- Tokens per model call.
- Tokens per agent.
- Total tokens per task.

The exact usage fields depend on the model provider.

## 22.2 Cost Calculation

A simplified cost calculation is:

\[
C =
\frac{T_{\text{input}}}{10^6}P_{\text{input}}
+
\frac{T_{\text{output}}}{10^6}P_{\text{output}}
\]

Where:

- \(T_{\text{input}}\) is the number of input tokens.
- \(T_{\text{output}}\) is the number of output tokens.
- \(P_{\text{input}}\) is the input price per million tokens.
- \(P_{\text{output}}\) is the output price per million tokens.

This calculation assumes the provider prices usage per million tokens. Actual pricing may also include cached tokens, tools, images, audio, or other charges.

Use current provider pricing when calculating real costs.

## 22.3 Example

Suppose an illustrative model has these prices:

```text
Input:  $2 per million tokens
Output: $8 per million tokens
```

A task uses:

```text
Input tokens:  10,000
Output tokens:  2,000
```

Input cost:

\[
\frac{10,000}{1,000,000}\times2=\$0.02
\]

Output cost:

\[
\frac{2,000}{1,000,000}\times8=\$0.016
\]

Estimated model cost:

\[
\$0.02+\$0.016=\$0.036
\]

These prices are illustrative, not current pricing for a specific provider.

## 22.4 Measure Full Workflow Cost

Include applicable costs from:

- Model calls.
- Embedding generation.
- Retrieval services.
- External APIs.
- Browser operations.
- Code execution.
- Storage.
- Additional agent calls.

The total cost is not necessarily equal to model-token cost alone.

## 22.5 Cost Per Successful Task

A useful operational metric is:

\[
\text{Cost per Successful Task} =
\frac{\text{Total Relevant Cost}}
{\text{Successful Tasks}}
\]

This metric includes the impact of failed attempts if their costs are included in the numerator.

It can reveal whether a system is becoming more expensive even when task volume remains constant.

---

# 🧯 23. Failure Analysis

Failure analysis identifies why a task failed.

A useful investigation should move beyond the final error message.

## 23.1 Common Failure Categories

| Category | Example |
|---|---|
| Input failure | Request did not satisfy the schema |
| Planning failure | Agent selected an inappropriate approach |
| Retrieval failure | Relevant documents were not found |
| Tool selection failure | Wrong tool was chosen |
| Tool execution failure | External service timed out |
| Reasoning failure | Evidence was interpreted incorrectly |
| Output failure | Response violated the required schema |
| Policy failure | Required authorization was missing |
| Resource failure | Budget or timeout was exceeded |
| Integration failure | Services exchanged incompatible data |

## 23.2 Root-Cause Analysis

Suppose an agent gives an incorrect refund answer.

Investigate:

1. Was the question interpreted correctly?
2. Was the current refund policy retrieved?
3. Was the retrieved document authoritative?
4. Did the model misinterpret the document?
5. Did a stale memory influence the answer?
6. Did the final response contain unsupported claims?
7. Did the evaluation reference match the current policy?

Do not assume the model itself caused every incorrect answer.

## 23.3 Failure Taxonomy

Maintain a categorized collection of failures.

Example:

```python
failure_categories = {
    "retrieval_failure": 0,
    "tool_selection_failure": 0,
    "incorrect_answer": 0,
    "authorization_failure": 0,
    "timeout": 0,
    "budget_exceeded": 0,
}
```

These counters are illustrative. In production, use appropriate metrics and structured event storage.

## 23.4 Turn Failures into Regression Tests

Whenever a meaningful bug is discovered:

1. Preserve a representative failing case.
2. Identify the expected behavior.
3. Add the case to the evaluation dataset.
4. Implement the fix.
5. Rerun the case.
6. Run related regression tests.
7. Track whether the failure returns.

This prevents teams from repeatedly solving the same problem.

---

# 🚨 24. Production Monitoring and Alerts

Evaluation datasets help measure known behaviors. Production monitoring helps detect problems in real workloads.

## 24.1 Useful Production Signals

Monitor:

- Task failure rate.
- Task success estimates.
- Model and tool latency.
- External API errors.
- Token usage.
- Estimated cost.
- Queue depth.
- Timeouts.
- Retry counts.
- Security denials.
- Human escalation rate.

## 24.2 Alert Examples

Potential alerts include:

```text
Alert:
Tool error rate exceeds the configured threshold.
```

```text
Alert:
P95 task latency exceeds the service objective.
```

```text
Alert:
Daily model cost exceeds the budget.
```

```text
Alert:
Critical authorization test failed.
```

Thresholds should reflect actual service requirements and observed baseline behavior.

## 24.3 Avoid Alert Fatigue

Too many low-value alerts cause teams to ignore them.

Good alerts should be:

- Actionable.
- Relevant.
- Properly prioritized.
- Connected to a response procedure.
- Based on useful thresholds.

## 24.4 Monitor Quality in Production

Production quality is harder to measure because reference answers may not be available immediately.

Possible approaches include:

- Sampling interactions for human review.
- Evaluating selected traces offline.
- Using carefully calibrated automated judges.
- Comparing tool results against authoritative systems.
- Collecting explicit user feedback.
- Monitoring task completion and escalation.
- Replaying representative production cases in controlled evaluations.

User satisfaction alone is not sufficient evidence of factual correctness.

## 24.5 Service-Level Objectives

A Service-Level Objective (SLO) defines a target for a service-level measurement.

Examples:

```text
99% of eligible requests should complete within the
defined latency target.
```

```text
At least 98% of defined benchmark tasks should meet
the required success criteria.
```

These are illustrative examples. The appropriate targets depend on the use case, risk, cost, and user expectations.

---

# 💻 25. Python Evaluation Framework

This section builds a simple evaluation framework without requiring a specialized evaluation library.

## 25.1 Define Evaluation Cases

```python
evaluation_cases = [
    {
        "id": "case-001",
        "question": "What is the refund period?",
        "expected": "30 days",
        "category": "policy",
    },
    {
        "id": "case-002",
        "question": "What is the delivery status?",
        "expected": "Delivered",
        "category": "order_lookup",
    },
]
```

These examples assume a simple expected-answer format.

## 25.2 Create a Placeholder Agent

```python
def agent(question):
    if "refund" in question.lower():
        return "30 days"

    if "delivery" in question.lower():
        return "Delivered"

    return "I do not have enough information."
```

This is a deterministic demonstration, not a real LLM agent.

## 25.3 Implement an Exact-Match Evaluator

```python
def exact_match(expected, actual):
    return expected.strip().casefold() == actual.strip().casefold()
```

This evaluator is appropriate for the simple reference answers used here.

## 25.4 Run the Evaluation

```python
def run_evaluation(cases, agent_function):
    results = []

    for case in cases:
        actual = agent_function(case["question"])

        passed = exact_match(
            case["expected"],
            actual,
        )

        results.append({
            "id": case["id"],
            "category": case["category"],
            "expected": case["expected"],
            "actual": actual,
            "passed": passed,
        })

    return results
```

## 25.5 Calculate Metrics

```python
def calculate_metrics(results):
    total = len(results)

    if total == 0:
        return {
            "total": 0,
            "passed": 0,
            "success_rate": 0.0,
        }

    passed = sum(
        result["passed"]
        for result in results
    )

    return {
        "total": total,
        "passed": passed,
        "failed": total - passed,
        "success_rate": passed / total,
    }
```

## 25.6 Execute the Evaluation

```python
results = run_evaluation(
    evaluation_cases,
    agent,
)

metrics = calculate_metrics(results)

print(metrics)
```

Expected result:

```python
{
    "total": 2,
    "passed": 2,
    "failed": 0,
    "success_rate": 1.0
}
```

The success rate is represented as a fraction between zero and one.

Multiply by 100 if you want a percentage.

## 25.7 Group Results by Category

```python
from collections import defaultdict


def metrics_by_category(results):
    groups = defaultdict(list)

    for result in results:
        groups[result["category"]].append(result)

    output = {}

    for category, items in groups.items():
        output[category] = calculate_metrics(items)

    return output
```

Category-level metrics help identify areas where the agent performs poorly.

## 25.8 Important Limitation

This framework uses exact-match comparison and a simple placeholder agent.

For a real system, add:

- Model and prompt version tracking.
- Tool trace collection.
- Structured output validation.
- Reference-based correctness checks.
- RAG evaluation.
- Latency and token metrics.
- Security regression tests.
- Human-reviewed examples.
- Persistent evaluation reports.

---

# 📡 26. Python Observability Implementation

The following examples demonstrate basic instrumentation.

## 26.1 Measure Execution Duration

```python
import time


def measure_execution(function, *args, **kwargs):
    started_at = time.perf_counter()

    try:
        result = function(*args, **kwargs)

        return {
            "status": "success",
            "result": result,
            "duration_seconds": (
                time.perf_counter() - started_at
            ),
        }

    except Exception:
        return {
            "status": "error",
            "duration_seconds": (
                time.perf_counter() - started_at
            ),
        }
```

This example measures duration and returns a basic status.

In production, record the exception through an appropriate logging mechanism rather than silently discarding diagnostic details.

## 26.2 Add Structured Logs

```python
import logging
import time

logger = logging.getLogger("agent_observability")


def observed_tool_call(tool_name, tool_function, **kwargs):
    started_at = time.perf_counter()

    try:
        result = tool_function(**kwargs)

        duration = time.perf_counter() - started_at

        logger.info(
            "tool_call_completed",
            extra={
                "tool_name": tool_name,
                "status": "success",
                "duration_seconds": duration,
            },
        )

        return result

    except Exception:
        duration = time.perf_counter() - started_at

        logger.exception(
            "tool_call_failed",
            extra={
                "tool_name": tool_name,
                "status": "error",
                "duration_seconds": duration,
            },
        )

        raise
```

This records the tool's outcome and duration.

Ensure your logging configuration serializes the structured fields as intended.

## 26.3 Define a Simple Trace Structure

```python
from dataclasses import dataclass, field
from time import perf_counter


@dataclass
class Span:
    name: str
    duration_seconds: float = 0.0
    status: str = "running"
    attributes: dict = field(default_factory=dict)


def run_with_span(name, function, *args, **kwargs):
    span = Span(name=name)
    started_at = perf_counter()

    try:
        result = function(*args, **kwargs)
        span.status = "success"
        return result, span

    except Exception:
        span.status = "error"
        raise

    finally:
        span.duration_seconds = (
            perf_counter() - started_at
        )
```

Usage:

```python
def search_documents():
    return ["document-1", "document-2"]


result, span = run_with_span(
    "document_search",
    search_documents,
)

print(span.name)
print(span.status)
print(span.duration_seconds)
```

This is a minimal timing structure, not a complete distributed tracing implementation.

For production tracing, use an established tracing framework and propagate trace context across services.

## 26.4 Instrument an Agent Workflow

A useful instrumentation plan might look like:

```text
agent_task
    ├── validate_request
    ├── retrieve_context
    ├── model_call
    ├── execute_tool
    ├── validate_result
    └── generate_response
```

For each stage, capture appropriate duration, status, and diagnostic metadata.

Do not automatically capture all prompt content or sensitive tool arguments.

---

# 🧪 27. Testing Agent Quality

Evaluation and software testing should work together.

## 27.1 Unit Tests

Test individual components.

Examples:

- Input validation.
- Tool argument validation.
- Permission rules.
- Numeric calculations.
- Output schemas.

## 27.2 Integration Tests

Test interactions between components.

Examples:

- Agent to retrieval system.
- Agent to database.
- Agent to approval service.
- Orchestrator to specialist agents.

## 27.3 End-to-End Tests

Test a complete workflow from request to final result.

Example:

```text
Customer asks about an order
        ↓
Agent identifies the order
        ↓
Database returns delivery status
        ↓
Agent generates response
        ↓
Evaluation checks the final result
```

## 27.4 Adversarial Tests

Test difficult or malicious inputs.

Examples:

- Prompt injection inside a retrieved document.
- Malformed tool arguments.
- Requests for unauthorized records.
- Unexpected external API responses.
- Repeated requests designed to trigger excessive execution.

## 27.5 Human Evaluation

Human reviewers remain valuable for ambiguous or high-impact judgments.

Provide reviewers with:

- The original task.
- The expected criteria.
- The agent's answer.
- Relevant evidence.
- Tool results where appropriate.
- A consistent scoring rubric.

For sensitive cases, reviewers should have access only to the information required for the evaluation.

## 27.6 Test Pyramid

A useful testing strategy combines:

```text
          End-to-End Evaluations
        Integration Tests
      Unit and Schema Tests
```

Unit tests are usually fast and numerous.

End-to-end evaluations are more expensive but help validate the complete agent experience.

Use all three rather than relying entirely on expensive model-based tests.

---

# 🚫 28. Common Evaluation Mistakes

| Mistake | Why It Matters | Better Approach |
|---|---|---|
| Testing only a few examples | Results may not represent real usage | Use representative datasets |
| Measuring only final answers | Hidden tool failures remain undetected | Evaluate the execution trace |
| Using exact match for every answer | Correct paraphrases may fail | Use task-appropriate metrics |
| Trusting an LLM judge completely | The judge may be wrong or biased | Calibrate and validate judge results |
| Ignoring failure severity | Critical failures may be hidden by averages | Track high-severity failures separately |
| Ignoring latency | Quality may improve while usability declines | Measure latency distributions |
| Ignoring cost | Complex workflows may become too expensive | Track full task cost |
| Using stale references | Correct behavior may be marked incorrect | Version datasets and references |
| Reusing final test data during tuning | Results may become misleading | Separate development and final test sets |
| Logging every prompt | Creates privacy and cost risks | Record necessary, controlled metadata |
| Monitoring only errors | Correctly executed tasks may still be wrong | Evaluate quality and outcomes |
| Optimizing one metric alone | Improvements may damage other requirements | Use a balanced metric set |
| Ignoring model updates | Behavior can change unexpectedly | Run regression evaluations |
| Counting retries as separate successes | Can distort success measurements | Define task and attempt boundaries |
| Ignoring uncertainty | Small differences may be meaningless | Report sample sizes and uncertainty |

---

# 🏭 29. Production Evaluation Architecture

A production system needs a repeatable process for collecting execution data, evaluating quality, and detecting regressions.

## 29.1 Reference Architecture

```text
                  USER REQUEST
                       |
                       v
                 AGENT SERVICE
                       |
          +------------+------------+
          |            |            |
          v            v            v
       Model         Tools       Retrieval
          |            |            |
          +------------+------------+
                       |
                       v
                  Final Result
                       |
             +---------+---------+
             |         |         |
             v         v         v
           Logs      Metrics    Traces
             |         |         |
             +---------+---------+
                       |
                       v
              Observability Store
                       |
              +--------+--------+
              |                 |
              v                 v
        Dashboards          Alerts
              |
              v
       Evaluation Pipeline
              |
              v
      Quality and Regression
          Reports
```

## 29.2 Offline Evaluation

Offline evaluation runs against a predefined dataset.

Benefits:

- Repeatability.
- Controlled comparisons.
- Regression detection.
- Easier debugging.
- Lower risk than testing directly on production users.

Use it when changing prompts, tools, models, retrieval settings, or workflows.

## 29.3 Online Evaluation

Online evaluation examines agent behavior during real-world operation.

It may use:

- Sampled human reviews.
- Explicit feedback.
- Tool outcome checks.
- Production traces.
- Carefully calibrated model-based judges.
- Operational metrics.

Protect user privacy and avoid treating noisy user feedback as definitive evidence of correctness.

## 29.4 Before Deployment

A deployment pipeline might require:

```text
Unit Tests Pass
        ↓
Security Tests Pass
        ↓
Evaluation Dataset Passes
        ↓
Critical Regressions Reviewed
        ↓
Performance and Cost Checked
        ↓
Deployment Approved
```

## 29.5 After Deployment

Continue to monitor:

- Production error rates.
- Latency.
- Resource usage.
- Cost.
- Tool outcomes.
- Sampled answer quality.
- Security-related failures.
- Changes in user behavior or input distribution.

An agent that passed yesterday's evaluation can still fail when its environment, dependencies, or underlying information changes.

---

# 🏗️ 30. Mini Project: Agent Evaluation and Monitoring System

## Project Objective

Build a Python system that evaluates an AI agent against a dataset and records useful execution metrics.

The system should report both quality and operational behavior.

## 30.1 Project Scenario

You are building a customer-support agent that can:

1. Answer policy questions.
2. Retrieve authorized documents.
3. Query order information.
4. Generate customer responses.
5. Handle missing information safely.

Your evaluation system should measure correctness, task success, latency, and failure categories.

## 30.2 Suggested Project Structure

```text
agent-evaluation-system/
│
├── app/
│   ├── __init__.py
│   ├── agent.py
│   ├── evaluator.py
│   ├── metrics.py
│   ├── tracing.py
│   ├── logging_config.py
│   └── reports.py
│
├── datasets/
│   ├── development.json
│   ├── regression.json
│   └── test.json
│
├── tests/
│   ├── test_evaluator.py
│   ├── test_metrics.py
│   ├── test_tools.py
│   └── test_regression.py
│
├── results/
│   └── .gitkeep
│
├── requirements.txt
├── .gitignore
└── README.md
```

## 30.3 Required Features

### Feature 1: Evaluation dataset

Store test cases containing input, expected behavior, category, and evaluation criteria.

### Feature 2: Agent execution

Run each case through the agent and capture its actual output.

### Feature 3: Correctness evaluation

Use deterministic checks for fixed-format tasks and an explicit rubric for open-ended answers.

### Feature 4: Task success metrics

Calculate successful tasks, failed tasks, and overall success rate.

### Feature 5: Category metrics

Break results down by task type so weak areas are visible.

### Feature 6: Execution tracing

Record stage names, durations, statuses, and task identifiers.

### Feature 7: Error handling

Record failures without terminating the entire evaluation run unnecessarily.

### Feature 8: Regression comparison

Compare the current run against a saved baseline.

### Feature 9: Cost monitoring

Record token usage and estimated cost when the model provider exposes reliable usage data.

### Feature 10: Report generation

Generate a summary containing:

- Dataset version.
- Total test cases.
- Successful and failed cases.
- Success rate.
- Category-level results.
- Average and percentile latency.
- Token usage.
- Estimated cost.
- Most common failure categories.
- Important regressions.

## 30.4 Sample Evaluation Case

```json
{
  "id": "refund-001",
  "category": "policy",
  "input": "What is the refund period?",
  "expected_answer": "30 days",
  "required_behavior": "answer_from_authorized_policy",
  "evaluation_type": "reference_check"
}
```

The example assumes a fictional refund policy. Use your actual application's authoritative policy when implementing the project.

## 30.5 Acceptance Criteria

| Requirement | Expected Result |
|---|---|
| Evaluation runs | Every eligible test case is processed |
| Correctness checks | Results are recorded consistently |
| Failed tasks | Failure reasons are categorized |
| Metrics | Overall and category-level results are calculated |
| Tracing | Each execution has a trace or execution record |
| Latency | Stage and total durations are captured |
| Cost | Usage is recorded when available |
| Regression testing | Changes are compared against a baseline |
| Security | Sensitive data is not unnecessarily logged |
| Reporting | A readable evaluation report is generated |

## 30.6 Stretch Goals

After completing the basic implementation, add:

- FastAPI endpoints for evaluation runs.
- OpenTelemetry tracing.
- A dashboard for task quality and latency.
- Model-based evaluation with a structured rubric.
- A human-review interface.
- Automated evaluation in CI/CD.
- Statistical comparison between model versions.
- Production trace sampling.
- Cost budgets and alerts.
- RAG-specific metrics.

**Deliverable:** A working evaluation system that demonstrates whether an agent meets defined quality requirements and helps explain why individual tasks fail.

---

# 📝 31. Exercises

## Beginner

1. Explain evaluation, observability, and monitoring.
2. Calculate task success rate for 85 successful tasks out of 100.
3. Explain the difference between correctness and relevance.
4. Implement an exact-match evaluator.
5. Record the duration of a Python function.
6. Explain why a correct final answer does not prove that the entire workflow was correct.

## Intermediate

7. Create an evaluation dataset with at least 20 representative cases.
8. Calculate retrieval precision and recall for a sample RAG dataset.
9. Evaluate tool selection and tool argument accuracy.
10. Implement category-level evaluation metrics.
11. Create structured logs for tool calls.
12. Compare two agent versions using the same dataset.
13. Design a regression test for a previously observed failure.
14. Explain the limitations of LLM-as-a-judge.

## Advanced

15. Design a complete evaluation strategy for a multi-agent system.
16. Build a trace hierarchy for an agent that calls multiple external services.
17. Create a monitoring plan for latency, cost, and failure rates.
18. Design an evaluation dataset that includes prompt injection and tool failures.
19. Implement a CI evaluation gate that rejects critical regressions.
20. Build the Agent Evaluation and Monitoring System project.
21. Explain how to detect evaluation leakage.
22. Design a strategy for measuring production quality when reference answers are unavailable.

---

# 🎤 32. Interview Questions and Answers

### Q1. What is agent evaluation?

Agent evaluation measures whether an agent meets defined quality, correctness, safety, and operational requirements.

### Q2. What is observability?

Observability provides logs, metrics, traces, and related signals that help explain system execution.

### Q3. What is the difference between evaluation and monitoring?

Evaluation measures performance against defined criteria. Monitoring continuously tracks operational behavior and detects conditions that require attention.

### Q4. Why is evaluating only the final answer insufficient?

The agent may have used unauthorized tools, retrieved incorrect evidence, or encountered failures that the final answer conceals.

### Q5. What is task success rate?

It is the proportion of evaluated tasks that satisfy the defined success criteria.

### Q6. What is the difference between retrieval precision and recall?

Precision measures the proportion of retrieved items that are relevant. Recall measures the proportion of relevant available items that were retrieved.

### Q7. What is groundedness in RAG?

Groundedness measures whether generated claims are supported by the available source material.

### Q8. What is LLM-as-a-judge?

It is the use of a language model to assess another model's output using a defined rubric.

### Q9. What are the limitations of LLM judges?

They can be biased, inconsistent, factually incorrect, or sensitive to wording and answer order.

### Q10. Why combine deterministic and model-based evaluation?

Deterministic checks are useful for explicit rules and exact requirements, while model-based evaluation can assess nuanced natural-language outputs.

### Q11. What is regression testing?

Regression testing checks whether changes introduce failures in previously working behavior.

### Q12. What is a trace?

A trace represents a connected execution path through one or more operations, often using parent and child spans.

### Q13. What is a span?

A span records an individual operation, such as a model call, retrieval query, or tool execution.

### Q14. Why monitor P95 latency?

P95 latency reveals how slow requests behave near the upper end of the measured distribution, rather than relying only on the average.

### Q15. Why is cost per successful task useful?

It shows how much the system spends to achieve successful outcomes and can reveal waste caused by failed attempts or inefficient workflows.

### Q16. What is evaluation leakage?

Evaluation leakage occurs when information from test cases improperly influences the system or evaluation process, making results misleading.

### Q17. How do you evaluate tool usage?

Measure tool selection, argument correctness, execution outcomes, action sequences, unnecessary calls, and resulting task success.

### Q18. How should agent failures be analyzed?

Inspect the execution trace, classify the failure, identify the root cause, implement a fix, and preserve the failure as a regression test.

### Q19. What should be monitored in production?

Monitor task outcomes, tool errors, latency, token usage, cost, security events, resource limits, and sampled output quality.

### Q20. What is the most important principle in agent evaluation?

**Define measurable success criteria, evaluate the complete execution, and use the results to drive continuous improvement.**

---

# 📖 33. Glossary

| Term | Definition |
|---|---|
| Evaluation | Measuring system performance against defined criteria |
| Observability | Understanding system behavior through logs, metrics, and traces |
| Monitoring | Continuously tracking system health and performance |
| Task Success Rate | Proportion of tasks meeting success criteria |
| Correctness | Agreement with reliable reference information |
| Relevance | How well an answer addresses the task |
| Completeness | Whether required information is present |
| Groundedness | Whether generated claims are supported by evidence |
| Precision | Proportion of retrieved or predicted items that are relevant or correct, depending on the task |
| Recall | Proportion of relevant items successfully retrieved or identified |
| LLM-as-a-Judge | Using a language model to evaluate another model's output |
| Evaluation Dataset | A collection of test cases used to measure performance |
| Evaluation Leakage | Improper influence of evaluation data on the evaluated system |
| Regression Testing | Testing whether changes break previously working behavior |
| Baseline | A reference result used for comparison |
| Trace | A connected record of an execution path |
| Span | A record of an individual operation within a trace |
| Structured Logging | Recording events using consistent, machine-readable fields |
| Correlation ID | An identifier used to connect related events |
| Latency | Elapsed time for an operation or request |
| P95 Latency | The 95th-percentile latency |
| Token Usage | The number of model input and output tokens consumed |
| Cost per Task | Cost associated with a defined task or attempt |
| Failure Taxonomy | A structured classification of failure types |
| Root-Cause Analysis | Identifying the underlying cause of a failure |
| Offline Evaluation | Testing against a predefined dataset |
| Online Evaluation | Evaluating behavior during real-world operation |
| SLO | Service-Level Objective |
| High Cardinality | A large number of distinct metric-label combinations |
| Test Leakage | Improper use of test information during development |
| Production Telemetry | Data collected to understand a deployed system's behavior |

---

# 🧠 34. Knowledge Check

Answer these questions without reviewing the earlier sections.

1. Why can a successful final response hide an unsuccessful workflow?
2. How do evaluation, observability, and monitoring differ?
3. How is task success rate calculated?
4. What is the difference between correctness and groundedness?
5. How do retrieval precision and recall differ?
6. Why is tool execution success different from tool selection accuracy?
7. What is LLM-as-a-judge, and why can it be unreliable?
8. Why combine deterministic checks with model-based evaluation?
9. What is evaluation leakage?
10. How does regression testing protect agent quality?
11. What are logs, metrics, and traces used for?
12. What is the relationship between a trace and a span?
13. Why is P95 latency useful?
14. How can token usage help explain rising operational costs?
15. How should you turn a production failure into a regression test?

## Suggested Answers

1. The workflow may have used incorrect tools, unauthorized data, or hidden failure paths.
2. Evaluation measures quality, observability explains execution, and monitoring detects operational problems.
3. Divide successful tasks by total evaluated tasks.
4. Correctness measures factual accuracy; groundedness measures whether claims are supported by the supplied evidence.
5. Precision measures the relevance of retrieved items; recall measures coverage of relevant available items.
6. A tool may execute successfully while being the wrong tool for the task.
7. It uses a model to score outputs, but the judge may be biased or inaccurate.
8. Deterministic checks handle explicit rules, while model-based evaluation helps assess nuanced answers.
9. Test information improperly influences the evaluated system or process.
10. It detects failures introduced by code, prompt, model, or configuration changes.
11. Logs record events, metrics summarize measurements, and traces connect operations.
12. A trace contains related spans representing individual operations.
13. It measures latency near the slow end of the request distribution.
14. It helps identify excessive context, unnecessary model calls, and expensive workflows.
15. Preserve the failing input, define expected behavior, add the case to the dataset, and verify that future changes do not reintroduce the failure.

---

# 🏁 35. Completion Checklist

Before moving to the next module, confirm that you can:

- [ ] Explain evaluation, observability, and monitoring.
- [ ] Define measurable task success criteria.
- [ ] Calculate task success and failure rates.
- [ ] Evaluate correctness, relevance, and groundedness.
- [ ] Measure tool selection and execution quality.
- [ ] Evaluate workflow planning and state transitions.
- [ ] Calculate retrieval precision and recall.
- [ ] Explain LLM-as-a-judge and its limitations.
- [ ] Combine deterministic and model-based evaluation.
- [ ] Build representative evaluation datasets.
- [ ] Implement regression testing.
- [ ] Explain logs, metrics, and traces.
- [ ] Instrument Python functions.
- [ ] Measure latency and token usage.
- [ ] Analyze failures using execution traces.
- [ ] Design production alerts.
- [ ] Complete the Agent Evaluation and Monitoring System project.

**Completion standard:** You should be able to measure agent quality, explain why a task failed, compare different agent versions, and identify when a deployed system requires attention.

---

# 🔗 36. References

## Evaluation and AI Quality

- [OpenAI Platform Documentation](https://platform.openai.com/docs/)
- [Anthropic Documentation](https://docs.anthropic.com/)
- [Ragas Documentation](https://docs.ragas.io/)
- [DeepEval Documentation](https://docs.confident-ai.com/)

## Observability and Tracing

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## Python Testing and Logging

- [Pytest Documentation](https://docs.pytest.org/)
- [Python Logging Documentation](https://docs.python.org/3/library/logging.html)
- [Python Time Documentation](https://docs.python.org/3/library/time.html)

## Agent Development

- [LangChain Documentation](https://python.langchain.com/docs/)
- [LangGraph Documentation](https://docs.langchain.com/oss/python/langgraph)

Use the current documentation for framework-specific APIs, supported features, and configuration details.

---

# 🚀 37. Next Module

## Module 12 — Reliability and Failure Recovery

After learning how to measure and observe agents, the next step is designing agents that continue operating safely when components fail.

Topics include:

- Reliability engineering for AI agents.
- Failure modes and failure analysis.
- Retries and exponential backoff.
- Timeouts and cancellation.
- Idempotency.
- Checkpointing and state persistence.
- Durable execution.
- Recovery from interrupted workflows.
- Compensating actions and sagas.
- Circuit breakers.
- Fallback strategies.
- Graceful degradation.
- Partial results and resumable tasks.
- External API failure handling.
- Distributed workflow reliability.
- Fault injection and chaos testing.
- Building a fault-tolerant agent workflow.

**Key transition:** Module 11 focuses on measuring and understanding agent behavior. Module 12 focuses on making agents recover predictably when models, tools, networks, or workflows fail.

</CodeBlock>