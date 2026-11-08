
# 🧠 Advanced Planning and Decision-Making

> **🚀 Course:** Agentic AI Engineering Journey  
> **📚 Step 3:** Advanced Agentic AI  
> **📦 Module 03:** Advanced Planning and Decision-Making  
> **📅 Study Duration:** 2 Days  
> **🎯 Level:** Intermediate to Advanced  
> **🛠️ Main Tools:** Python, LLMs, LangGraph, Planning Patterns  
> **🏁 Goal:** Build agents that break down goals, choose actions, evaluate results, and adjust plans.

---

## 🎯 **1. What You Will Learn**

Advanced planning and decision-making help an AI agent move beyond responding to individual instructions.

An agent must be able to understand a goal, identify the work required, choose an appropriate sequence of actions, monitor progress, and change its plan when circumstances change.

In this module, you will learn how to design these capabilities using practical Python examples and structured agent workflows.

By the end, you should be able to:

- Explain planning in agentic AI.
- Distinguish a goal, task, subtask, action, and plan.
- Break a complex goal into smaller tasks.
- Create a task dependency structure.
- Choose between fixed plans and dynamic plans.
- Understand task ordering and prerequisites.
- Use rule-based action selection.
- Understand utility-based decision-making.
- Compare candidate actions.
- Use scoring and prioritization.
- Apply simple cost-benefit reasoning.
- Understand uncertainty and incomplete information.
- Decide when an agent should gather more information.
- Use feedback to revise a plan.
- Recognize when replanning is necessary.
- Control planning loops.
- Prevent repeated or unproductive decisions.
- Understand tool selection and action constraints.
- Evaluate whether a plan is feasible.
- Add stopping conditions and execution limits.
- Separate planning from execution.
- Integrate a planner with a state graph.
- Test planning logic using pytest.
- Build a practical goal-planning agent.

**Practical outcome:** Build a task-planning workflow that converts a goal into subtasks, orders them by dependency, selects the next eligible task, tracks progress, and replans when a task fails.

---

## 📚 **2. Table of Contents**

1. 🎯 What You Will Learn
2. 🧭 Module Overview
3. 🧠 What Is Planning in Agentic AI?
4. 🎯 Goals, Tasks, Actions, and Plans
5. 🧩 Task Decomposition
6. 🗂️ Task Dependencies and Ordering
7. 🛤️ Fixed Planning vs Dynamic Planning
8. 🔍 Planning Before Acting
9. 🧠 Reasoning and Decision-Making
10. ⚖️ Rule-Based Decisions
11. 📊 Scoring Candidate Actions
12. 💰 Cost-Benefit Analysis
13. 🎯 Utility and Preferences
14. 🌫️ Decisions Under Uncertainty
15. 🔎 Information Gathering
16. 🧭 Tool Selection and Action Feasibility
17. 🔄 Feedback and Replanning
18. 🛑 Planning Limits and Stop Conditions
19. 🧠 Planning Strategies
20. 🌳 Search Trees and Candidate Plans
21. 🗺️ Planning with State Graphs
22. 🧱 Planning State Design
23. 🛠️ Python Planning Components
24. 🧪 Building a Rule-Based Planner
25. 🔀 Dependency-Aware Task Scheduling
26. 🔄 Handling Failed Tasks
27. 🧩 Adding an LLM Planner
28. 🛡️ Constrained Planning and Safety
29. 🧪 Testing Planning Systems
30. 🔍 Debugging Decision Logic
31. 📊 Evaluating Plan Quality
32. 🚀 Production Planning Principles
33. 🏗️ Complete Practical Project
34. 🧪 Hands-On Exercises
35. 🎤 Interview Questions and Answers
36. 📝 Cheat Sheet
37. 🔗 Official Resources
38. ✅ Completion Checklist
39. ➡️ What Comes Next?

---

## 🧭 **3. Module Overview**

### **3.1 Where Planning Fits in Agentic AI**

An agentic system may contain:

- A goal or task description.
- Instructions and constraints.
- An LLM or another decision mechanism.
- Tools that perform actions.
- State that tracks progress.
- A planner that selects and organizes tasks.
- An executor that performs approved operations.
- An evaluator that checks the results.

These components work together, but they do not have to be implemented as separate services.

For a small project, several components may be ordinary Python functions.

For a larger project, planning, execution, validation, and monitoring may be separate nodes in a state graph.

### **3.2 The Basic Planning Cycle**

```text
        Receive Goal
             |
             v
      Understand Goal
             |
             v
      Create a Plan
             |
             v
      Check Feasibility
             |
             v
      Select Next Action
             |
             v
      Execute Action
             |
             v
      Evaluate Result
             |
        +----+----+
        |         |
     Progress   Problem
        |         |
        v         v
   Continue    Replan
        |         |
        +----+----+
             |
             v
        Check Goal
             |
             v
        Finish or Continue
```

This cycle is a useful design pattern, not a requirement that every agent must follow identically.

A simple task may need no replanning. A complex task may require repeated planning and evaluation.

### **3.3 What Makes Planning Advanced?**

Basic automation follows predefined steps.

Advanced planning introduces decisions about:

- Which tasks are necessary.
- Which tasks depend on others.
- Which action should happen next.
- Whether the current plan is still useful.
- Whether a tool is available.
- Whether the expected benefit justifies the cost.
- Whether enough information is available.
- Whether the agent should continue or stop.

The aim is not to make every decision complicated. It is to make important decisions explicit, testable, and appropriate to the task.

---

## 🧠 **4. What Is Planning in Agentic AI?**

### **4.1 Definition**

**Planning** is the process of identifying actions and organizing them into a sequence or structure that can achieve a goal under defined conditions.

A plan may specify:

- Actions to perform.
- Required inputs.
- Task dependencies.
- Expected outcomes.
- Constraints.
- Alternative routes.
- Completion conditions.

For example, consider the goal:

> Create a technical report from three research documents.

A plan might be:

1. Inspect the documents.
2. Extract relevant information.
3. Summarize each document.
4. Compare the summaries.
5. Identify contradictions.
6. Draft the report.
7. Validate the report.
8. Return the final result.

Planning makes the work explicit before execution.

### **4.2 Planning Is Not Just Generating a List**

A list of tasks is useful, but a plan must also address their relationships.

Consider these tasks:

- Extract document content.
- Summarize document content.
- Compare summaries.
- Write a report.

The report cannot be written reliably before the required research is available.

Therefore, the plan must represent task dependencies, not merely task names.

### **4.3 Why Agents Need Planning**

Planning is useful when:

- A goal requires multiple operations.
- Some actions depend on earlier results.
- Tools must be selected.
- Resources are limited.
- Several approaches are possible.
- Failures require alternative actions.
- The goal cannot be completed in one operation.

Without planning, an agent may select actions that are individually reasonable but collectively ineffective.

### **4.4 Planning Example: Website Research**

Goal:

> Research a topic and prepare a concise report.

Possible plan:

```text
Goal: Produce a research report

Task 1: Clarify the research question
Task 2: Identify suitable sources
Task 3: Retrieve information
Task 4: Check source relevance
Task 5: Compare findings
Task 6: Draft the report
Task 7: Verify important claims
Task 8: Return the report
```

If an important source is unavailable, the planner may select another source.

If the research question is ambiguous, the planner may ask for clarification before continuing.

### **4.5 Planning vs Execution**

These are separate responsibilities.

**Planning** determines what should happen.

**Execution** performs the selected operations.

**Evaluation** checks whether the operations produced the expected results.

| Component | Main Question | Example |
|---|---|---|
| Planner | What should happen next? | Retrieve the missing document |
| Executor | How do I perform the operation? | Call the retrieval tool |
| Evaluator | Did it work? | Check whether the document was retrieved |
| State manager | What information must be preserved? | Record retrieval status |
| Router | Which path should execute? | Continue or use a fallback |

Keeping these responsibilities separate makes the system easier to test.

### **4.6 Planning Is Not Guaranteed to Be Correct**

A plan may be invalid because:

- It assumes a tool exists when it does not.
- It omits a necessary prerequisite.
- It misunderstands the goal.
- It exceeds available resources.
- It depends on unavailable information.
- Its assumptions become outdated.

Planning therefore requires validation and feedback.

---

## 🎯 **5. Goals, Tasks, Actions, and Plans**

These terms are related, but they represent different levels of work.

### **5.1 Goal**

A goal describes the desired outcome.

Example:

> Produce a validated summary of a document.

A useful goal should make the expected outcome clear.

### **5.2 Task**

A task is a unit of work that contributes to a goal.

Examples:

- Read the document.
- Extract the text.
- Summarize the main points.
- Validate the summary.

### **5.3 Subtask**

A subtask is a smaller part of a larger task.

For example:

**Parent task:** Research a topic.

Subtasks:

1. Identify key questions.
2. Search for relevant sources.
3. Read the sources.
4. Extract evidence.
5. Compare findings.

Not every task needs further decomposition.

### **5.4 Action**

An action is an operation that can be performed.

Examples:

- Call a Python function.
- Search a document collection.
- Query a database.
- Request an LLM completion.
- Save a validated result.

Actions should have clear inputs and expected outcomes.

### **5.5 Plan**

A plan organizes tasks and actions to achieve the goal.

A plan may be represented as a list, dependency graph, state graph, or structured object.

### **5.6 Example**

```python
goal = "Prepare a validated report"

tasks = [
    "collect_information",
    "summarize_information",
    "draft_report",
    "validate_report",
]

plan = {
    "goal": goal,
    "tasks": tasks,
}
```

This is a basic representation. It does not yet express dependencies, task status, or failure recovery.

### **5.7 Goals Should Be Testable**

A vague goal such as:

> Make the report good.

is difficult to evaluate.

A clearer goal is:

> Produce a report containing an executive summary, key findings, source references, and a conclusion.

The second goal provides more concrete criteria.

### **5.8 Goal Validation Checklist**

Before planning, ask:

- What outcome is required?
- What information is available?
- What information is missing?
- What constraints apply?
- What does successful completion mean?
- What outputs must be produced?
- Which actions are not permitted?

A planner should not silently invent requirements that materially change the task.

---

## 🧩 **6. Task Decomposition**

### **6.1 What Is Task Decomposition?**

Task decomposition breaks a large goal into smaller, manageable tasks.

For example:

```text
Goal: Build a small API

    1. Define requirements
    2. Design endpoints
    3. Implement endpoints
    4. Validate inputs
    5. Add error handling
    6. Write tests
    7. Run tests
    8. Document the API
```

Each task can be understood, implemented, and evaluated separately.

### **6.2 Why Decompose Tasks?**

Decomposition helps because it:

- Reduces the complexity of individual steps.
- Reveals missing requirements.
- Identifies task dependencies.
- Supports progress tracking.
- Makes failures easier to isolate.
- Allows suitable tasks to run independently.
- Provides clearer completion criteria.

### **6.3 Top-Down Decomposition**

Top-down decomposition starts with the final goal and repeatedly breaks it into smaller tasks.

Example:

```text
Create a Report
      |
      +-- Research
      |     |
      |     +-- Find Sources
      |     +-- Extract Evidence
      |
      +-- Analyze
      |     |
      |     +-- Compare Findings
      |     +-- Identify Gaps
      |
      +-- Write
      |     |
      |     +-- Draft Sections
      |     +-- Validate Output
      |
      +-- Deliver
```

This is useful when the desired outcome is clear but the implementation requires multiple stages.

### **6.4 Bottom-Up Planning**

Bottom-up planning starts from available actions or known tasks and organizes them into a larger solution.

For example, if the available operations are:

- Read file.
- Extract text.
- Summarize text.
- Validate summary.
- Save output.

The planner can assemble these operations into a document-processing workflow.

Bottom-up planning is useful when the available tools and capabilities strongly influence what is feasible.

### **6.5 How Small Should a Task Be?**

A task should be small enough to understand and evaluate, but not so small that planning becomes unnecessarily complicated.

A task is a good candidate for further decomposition when:

- It contains several independent responsibilities.
- Its completion criteria are unclear.
- It has multiple failure points.
- It requires several unrelated tools.
- Its execution is difficult to test.
- It needs different permissions for different actions.

### **6.6 Avoid Excessive Decomposition**

Consider the task:

> Convert a string to lowercase.

Breaking it into ten planning steps would be unnecessary.

A direct function is sufficient.

Use decomposition where it reduces complexity, not merely to increase the number of steps.

### **6.7 Decomposition with Python**

```python
def decompose_report_goal() -> list[str]:
    return [
        "collect_sources",
        "extract_information",
        "analyze_findings",
        "draft_report",
        "validate_report",
    ]


tasks = decompose_report_goal()

for index, task in enumerate(tasks, start=1):
    print(f"{index}. {task}")
```

This creates a task list.

It does not prove that the tasks are feasible or correctly ordered. Those checks are separate planning responsibilities.

### **6.8 Decomposition with an LLM**

An LLM can help turn a natural-language goal into structured subtasks.

For example, the model may transform:

> Prepare a report comparing two software libraries.

into:

```json
{
  "goal": "Compare two software libraries",
  "tasks": [
    "identify comparison criteria",
    "collect documentation for library A",
    "collect documentation for library B",
    "compare features",
    "summarize trade-offs",
    "validate the report"
  ]
}
```

The generated plan should be checked before execution.

An LLM can omit steps, invent unavailable capabilities, or produce tasks that do not contribute to the goal.

### **6.9 Decomposition Quality Checks**

Check whether:

- Every task contributes to the goal.
- Required tasks are included.
- Tasks are not unnecessarily duplicated.
- Dependencies are identified.
- Each task has a clear output.
- The plan respects available capabilities.
- Completion can be evaluated.

### **6.10 When to Re-Decompose**

Revisit the task structure when:

- A task turns out to be too large.
- A required capability is unavailable.
- New requirements appear.
- A task fails repeatedly.
- A dependency was overlooked.
- The original goal changes.

Do not rebuild the entire plan automatically after every minor event. Change only what is necessary.

---

## 🗂️ **7. Task Dependencies and Ordering**

### **7.1 What Is a Dependency?**

A dependency exists when one task requires the result of another task.

Example:

```text
Extract Text
     |
     v
Summarize Text
     |
     v
Validate Summary
```

The summary depends on extracted text.

The validation step depends on the summary.

### **7.2 Dependency Graphs**

A dependency graph represents the relationships between tasks.

```text
             Collect Sources
                    |
                    v
             Extract Evidence
                    |
          +---------+---------+
          |                   |
          v                   v
      Analyze A           Analyze B
          |                   |
          +---------+---------+
                    |
                    v
              Compare Results
                    |
                    v
                Write Report
```

The two analysis tasks may be independent after evidence has been collected.

### **7.3 Prerequisites**

A prerequisite is a condition that must be satisfied before a task can run.

Examples:

- Authentication before an authorized database query.
- Data extraction before summarization.
- Input validation before an external write.
- Human approval before a restricted action.

A planner should distinguish required prerequisites from optional enhancements.

### **7.4 Task Ordering**

A valid task order must respect the dependency relationships.

For example:

```python
tasks = [
    "extract_text",
    "summarize_text",
    "validate_summary",
]
```

This ordering makes sense when the summarization operation needs the extracted text.

The reverse order would be invalid.

### **7.5 Detecting Dependency Problems**

Common problems include:

- A task depends on an output that is never produced.
- Two tasks depend on each other.
- A prerequisite is missing.
- A task runs before its required information is available.
- A dependency points to an unknown task.

These issues should be detected before execution where practical.

### **7.6 Cyclic Dependencies**

Consider:

```text
Task A requires Task B
Task B requires Task A
```

Neither task can begin if both requirements are strict.

This is a cyclic dependency.

A planner must either:

- Redesign the task structure.
- Remove an unnecessary dependency.
- Introduce an initial value.
- Use an iterative process with explicit stopping rules.

### **7.7 Dependency-Aware Planning**

A task should be eligible to run only when its required prerequisites are complete.

For example:

```python
def task_is_ready(
    task_id: str,
    dependencies: dict[str, list[str]],
    completed: set[str],
) -> bool:
    required = dependencies.get(task_id, [])

    return all(
        dependency in completed
        for dependency in required
    )
```

This function checks whether the prerequisites of a task have been completed.

It does not execute the task.

### **7.8 Example**

```python
dependencies = {
    "collect_sources": [],
    "extract_evidence": ["collect_sources"],
    "analyze_findings": ["extract_evidence"],
    "write_report": ["analyze_findings"],
}

completed = {"collect_sources"}

assert task_is_ready(
    "extract_evidence",
    dependencies,
    completed,
)

assert not task_is_ready(
    "write_report",
    dependencies,
    completed,
)
```

The extraction task is ready because its prerequisite is complete.

The report task is not ready because analysis has not finished.

### **7.9 Dependency Best Practices**

- Give every task a unique identifier.
- Document prerequisites explicitly.
- Validate that referenced tasks exist.
- Detect dependency cycles.
- Distinguish task completion from task success.
- Handle failed prerequisites.
- Recompute task readiness after state changes.

---

## 🛤️ **8. Fixed Planning vs Dynamic Planning**

### **8.1 Fixed Planning**

A fixed plan defines the sequence of operations in advance.

Example:

```text
Validate
   |
   v
Extract
   |
   v
Summarize
   |
   v
Validate Result
```

The sequence does not change based on intermediate results, except where explicitly configured.

### **8.2 Advantages of Fixed Planning**

- Predictable execution.
- Easy testing.
- Clear dependencies.
- Simple debugging.
- Lower planning overhead.
- Suitable for repeatable business processes.

### **8.3 Limitations of Fixed Planning**

A fixed plan may not adapt well when:

- A required resource is unavailable.
- New information changes the task.
- A tool fails.
- The input differs substantially from expectations.
- A different approach becomes necessary.

### **8.4 Dynamic Planning**

Dynamic planning allows the next steps to change based on current state, new information, or execution results.

Example:

```text
Collect Information
        |
        v
Evaluate Information
        |
   +----+----+
   |         |
Enough     Missing
   |         |
   v         v
Draft     Retrieve More
   |         |
   v         v
Validate  Evaluate Again
```

Dynamic planning is useful when the correct next action depends on what has happened so far.

### **8.5 Dynamic Planning Does Not Mean Unlimited Freedom**

A dynamic planner should still operate within:

- Allowed actions.
- Available tools.
- Resource budgets.
- Required prerequisites.
- Security policies.
- Maximum attempts.
- Completion criteria.

The planner can choose among permitted options without being allowed to do anything whatsoever.

### **8.6 Hybrid Planning**

A hybrid design combines a stable workflow with dynamic decisions inside selected steps.

For example:

- Fixed input validation.
- Dynamic task decomposition.
- Fixed authorization checks.
- Dynamic selection among approved tools.
- Fixed output validation.
- Explicit termination rules.

This is often a practical design for production systems.

### **8.7 Choosing the Right Approach**

| Situation | Suitable Approach |
|---|---|
| Repeated, predictable process | Fixed plan |
| Variable research requirements | Dynamic planning |
| Strict business rules with flexible analysis | Hybrid planning |
| High-risk operation | Constrained plan with explicit authorization |
| Small one-step task | Direct execution |
| Complex tasks with dependencies | Dependency-aware planning |

### **8.8 Important Principle**

Use dynamic planning when adaptation adds value.

Do not make a workflow dynamically plan every step if a fixed sequence is already correct, safe, and efficient.

---

## 🔍 **9. Planning Before Acting**

### **9.1 Why Plan Before Acting?**

Immediate action can be inefficient when a goal requires several dependent operations.

For example, a research agent might begin writing before collecting enough evidence.

A planning stage helps identify what must happen first.

### **9.2 A Practical Planning Procedure**

Before execution:

1. Understand the requested outcome.
2. Identify the required information.
3. List the available actions.
4. Identify constraints.
5. Decompose the goal.
6. Establish task dependencies.
7. Check feasibility.
8. Define success criteria.
9. Define failure handling.
10. Select the initial action.

### **9.3 Example: Document Processing**

Goal:

> Produce a summary of an uploaded document.

The planner should determine:

- Is a document available?
- Can its contents be read?
- Does it contain usable text?
- Is the summary length specified?
- Does the user require citations?
- Is validation necessary?

A plan may need to branch when the file cannot be read.

### **9.4 Plan Feasibility**

A plan is feasible when its required operations can reasonably be performed under the available constraints.

Check:

- Tool availability.
- Input availability.
- Required permissions.
- Task dependencies.
- Time and resource limits.
- Expected output formats.

A plan that requires a nonexistent tool is not executable merely because it looks reasonable.

### **9.5 Plans Should Be Proportionate**

A one-step request may need no explicit planning stage.

A multi-stage research or coding task may benefit from a detailed plan.

The planner should match the complexity of the task rather than always producing a long list.

---

## 🧠 **10. Reasoning and Decision-Making**

### **10.1 What Is Decision-Making?**

Decision-making selects an action from the available options.

For example, a document agent may choose to:

- Read another source.
- Draft a response.
- Ask a clarifying question.
- Retry a failed retrieval.
- Stop and report an error.

### **10.2 Inputs to a Decision**

A decision may depend on:

- The goal.
- Current state.
- Available actions.
- Tool results.
- Constraints.
- Expected benefits.
- Costs.
- Uncertainty.
- Previous failures.

### **10.3 Reasoning Should Lead to an Action**

An explanation alone does not complete a task.

The system must translate its assessment into a valid next step.

For example:

```text
Observation:
Required evidence is missing.

Decision:
Retrieve the missing evidence.

Action:
Call the permitted retrieval tool.

Evaluation:
Check whether the evidence was found.
```

### **10.4 Separate Decision Logic from Side Effects**

A useful design separates choosing an action from performing it.

```python
def choose_action(state: dict) -> str:
    if not state["has_required_data"]:
        return "retrieve_data"

    if not state["validated"]:
        return "validate_result"

    return "finish"
```

The function selects a decision.

Another component should execute the selected action after validating that it is permitted.

### **10.5 Avoid Uncontrolled Decision Loops**

A planner may repeatedly choose an action that does not improve the state.

To prevent this, track:

- Previous actions.
- Action outcomes.
- Repeated failures.
- Remaining alternatives.
- Progress toward the goal.

A repeated action should have a clear justification.

### **10.6 Good Decision-Making Is Not Always More Reasoning**

More planning can consume time and resources without improving the result.

For straightforward operations, a direct rule may be better than a model call.

The goal is to make appropriate decisions, not maximize the amount of reasoning performed.

---

## ⚖️ **11. Rule-Based Decisions**

### **11.1 Definition**

Rule-based decision-making uses explicit conditions to select actions.

Example:

```python
def choose_priority(task: dict) -> str:
    if task["deadline_hours"] <= 2:
        return "high"

    if task["importance"] == "high":
        return "high"

    return "normal"
```

The behavior follows predefined rules.

### **11.2 Advantages**

- Predictable outcomes.
- Easy testing.
- Clear business logic.
- No model inference required.
- Simple debugging.
- Suitable for strict constraints.

### **11.3 Limitations**

Rules can become difficult to maintain when:

- Conditions overlap.
- Inputs are ambiguous.
- Many exceptions exist.
- The environment changes frequently.
- Language interpretation is required.

### **11.4 Rule Ordering Matters**

Consider:

```python
if task["importance"] == "high":
    return "high"

if task["deadline_hours"] <= 2:
    return "urgent"
```

A high-importance task with a deadline of one hour would be classified as high, not urgent.

If urgency must take precedence, reverse the conditions or define an explicit priority policy.

### **11.5 Use Rules for Hard Constraints**

Rules are especially useful for:

- Required fields.
- Authorization checks.
- Allowed action lists.
- Maximum attempts.
- Input limits.
- Mandatory approval.
- Explicit stopping conditions.

Do not ask an LLM to decide whether a strict, deterministic requirement should be ignored.

---

## 📊 **12. Scoring Candidate Actions**

### **12.1 What Is Action Scoring?**

Action scoring assigns a score to candidate actions so the system can compare them.

Suppose an agent can:

- Retrieve another source.
- Draft a response.
- Ask a clarifying question.

The planner may evaluate which action is most likely to advance the goal.

### **12.2 A Simple Scoring Model**

A conceptual score might combine:

- Expected benefit.
- Estimated cost.
- Risk.
- Time required.
- Confidence in the expected outcome.

For example:

\[
\text{Score}(a)
=
w_b B(a)
-
w_c C(a)
-
w_r R(a)
-
w_t T(a)
\]

Where:

- \(B(a)\) is expected benefit.
- \(C(a)\) is estimated cost.
- \(R(a)\) is estimated risk.
- \(T(a)\) is estimated time.
- The \(w\) values are weights that express their relative importance.

This is a simplified model, not a universal formula.

### **12.3 Example**

Suppose two actions are available.

| Action | Benefit | Cost | Risk |
|---|---:|---:|---:|
| Retrieve another source | 8 | 3 | 1 |
| Draft immediately | 5 | 1 | 2 |

Using the illustrative formula:

\[
S = B - C - R
\]

The retrieval action receives:

\[
8 - 3 - 1 = 4
\]

The drafting action receives:

\[
5 - 1 - 2 = 2
\]

Under these assumed values, retrieval scores higher.

The numbers are illustrative and do not establish real-world effectiveness.

### **12.4 Python Implementation**

```python
def score_action(
    benefit: float,
    cost: float,
    risk: float,
) -> float:
    return benefit - cost - risk


actions = {
    "retrieve_source": {
        "benefit": 8,
        "cost": 3,
        "risk": 1,
    },
    "draft_now": {
        "benefit": 5,
        "cost": 1,
        "risk": 2,
    },
}

scores = {
    name: score_action(**values)
    for name, values in actions.items()
}

best_action = max(scores, key=scores.get)

print(scores)
print(best_action)
```

### **12.5 Limitations of Scoring**

A score is only as useful as the assumptions behind it.

Problems include:

- Inaccurate estimates.
- Inconsistent scales.
- Poorly chosen weights.
- Unmeasured costs.
- Missing safety constraints.
- False precision.

A high score must not override a hard authorization or safety requirement.

### **12.6 Use Scoring for Trade-Offs**

Scoring is useful when several permitted actions have different benefits and costs.

It is not a replacement for mandatory constraints.

A restricted action should remain unavailable even if a scoring formula gives it a high value.

---

## 💰 **13. Cost-Benefit Analysis**

### **13.1 Definition**

Cost-benefit analysis compares the expected benefit of an action with the resources required to perform it.

Costs may include:

- API usage.
- Compute time.
- Human review.
- Latency.
- Tool calls.
- Operational complexity.

Benefits may include:

- Better information.
- Improved output quality.
- Reduced uncertainty.
- Fewer errors.
- Faster completion.
- Higher task success probability.

### **13.2 Example: Retrieve More Information or Stop**

A research agent has already collected three useful sources.

It can either:

- Retrieve another source.
- Begin drafting.

The planner should consider whether another retrieval is likely to improve the final result enough to justify its cost.

### **13.3 Marginal Benefit**

Marginal benefit is the additional value expected from one more action.

If the first source provides substantial new information but the fifth source adds almost nothing, further retrieval may not be worthwhile.

A planner can use a rule such as:

```python
def should_retrieve_more(
    expected_benefit: float,
    estimated_cost: float,
    minimum_gain: float,
) -> bool:
    net_gain = expected_benefit - estimated_cost

    return net_gain >= minimum_gain
```

### **13.4 Do Not Confuse Cost with Money Alone**

A tool call may be inexpensive but slow.

Another operation may be fast but unreliable.

Cost-benefit analysis can include multiple resource dimensions.

### **13.5 Cost-Aware Planning**

A practical planner should consider:

- Whether the action is necessary.
- Whether a cheaper valid alternative exists.
- Whether the expected benefit is meaningful.
- Whether a budget limit applies.
- Whether the action could create additional risk.

### **13.6 Avoid False Precision**

Do not assume that an LLM can accurately predict the exact quality gain of every action.

When estimates are uncertain, use broad categories, measured historical performance, or conservative limits.

---

## 🎯 **14. Utility and Preferences**

### **14.1 What Is Utility?**

Utility is a way of representing how desirable an outcome is according to defined preferences or objectives.

For example, a user may prefer a report that is:

- Accurate.
- Concise.
- Completed quickly.
- Supported by reliable sources.

These preferences may conflict.

### **14.2 Trade-Offs**

A very short report may be fast to produce but omit useful detail.

A very long report may include more information but be harder to read.

The planner needs a policy for balancing these requirements.

### **14.3 Weighted Utility**

A simplified model is:

\[
U(a) = w_q Q(a) + w_s S(a) - w_c C(a)
\]

Where:

- \(Q(a)\) is expected quality.
- \(S(a)\) is suitability for the user's requirements.
- \(C(a)\) is cost.
- The weights express the importance of each dimension.

This formula is useful for explaining the idea, not for claiming that subjective preferences are objectively measurable.

### **14.4 Hard Constraints Versus Preferences**

A preference can often be traded against another preference.

A hard constraint cannot be violated simply to improve a score.

For example:

- Preference: Return the report quickly.
- Hard constraint: Do not disclose confidential data.

Speed must not override confidentiality.

### **14.5 Practical Design**

Use hard rules for requirements that must always be satisfied.

Use utility or scoring to compare acceptable options within those boundaries.

---

## 🌫️ **15. Decisions Under Uncertainty**

### **15.1 What Is Uncertainty?**

Uncertainty exists when the system lacks complete or reliable information about the current situation or the likely outcome of an action.

Examples:

- A retrieved document may be outdated.
- A tool may return incomplete information.
- A request may be ambiguous.
- A model may misclassify an input.
- An external service may fail.

### **15.2 Uncertainty Changes Planning**

When information is incomplete, the planner may need to:

- Gather additional information.
- Ask a clarifying question.
- Choose a reversible action.
- Select a conservative option.
- Delay a consequential action.
- Escalate to a human.

### **15.3 Example**

A user asks:

> Update my account details.

The request does not specify which details should change.

A safe planner should not invent the missing values.

It should ask for clarification before making the update.

### **15.4 Confidence Is Not Certainty**

A model may report high confidence and still be wrong.

Confidence values should be evaluated against real outcomes before they are used as decision thresholds.

For important actions, combine confidence with validation, authorization, and independent evidence where appropriate.

### **15.5 Uncertainty-Aware Rules**

A simple decision policy could be:

```python
def choose_next_step(
    information_complete: bool,
    action_is_high_risk: bool,
) -> str:
    if not information_complete:
        return "gather_information"

    if action_is_high_risk:
        return "request_approval"

    return "execute"
```

This illustrates how uncertainty and risk can influence the next step.

### **15.6 Reversible Actions**

A reversible action can be undone more easily than an irreversible action.

When uncertainty is high, a planner should prefer a safe, reversible step where practical.

For example, generating a draft is generally easier to reverse than sending the draft to hundreds of recipients.

### **15.7 When to Ask for Clarification**

Ask for clarification when:

- A required value is missing.
- Several interpretations lead to different outcomes.
- The wrong interpretation could cause harm.
- A consequential action lacks clear authorization.
- The workflow cannot proceed reliably.

Do not ask unnecessary questions when the input already contains enough information.

---

## 🔎 **16. Information Gathering**

### **16.1 What Is Information Gathering?**

Information gathering is an action taken to reduce uncertainty or obtain data needed for a decision.

Examples:

- Search a knowledge base.
- Read a document.
- Query a permitted database.
- Inspect a tool result.
- Ask the user a question.
- Retrieve additional evidence.

### **16.2 Information Has a Cost**

Gathering more information can improve a decision, but it can also increase:

- Time.
- API usage.
- Complexity.
- Exposure to irrelevant or unreliable sources.

The planner should gather information that is relevant to the goal.

### **16.3 Value of Information**

The value of information is the expected improvement in decision quality that comes from obtaining additional information.

A simplified approach compares:

- The expected benefit of additional information.
- The cost of obtaining it.
- The risks of acting without it.

### **16.4 Example**

A document agent cannot identify the date of a report.

It has two options:

1. Guess the date.
2. Inspect the document metadata.

Inspecting the metadata is preferable because it can provide the missing information directly.

### **16.5 Information-Gathering Policy**

```python
def choose_information_action(state: dict) -> str:
    if not state["has_required_evidence"]:
        return "retrieve_evidence"

    if state["has_unresolved_question"]:
        return "ask_clarifying_question"

    return "continue_planning"
```

This is a simple rule-based policy.

A more advanced planner may compare multiple information sources, but it should still use explicit limits and validation.

### **16.6 When to Stop Gathering Information**

Stop when:

- Required information is available.
- Additional information is unlikely to change the decision.
- A defined source or time limit has been reached.
- The user has provided sufficient information.
- The remaining uncertainty can be communicated clearly.

The stopping rule should reflect the task's importance and accuracy requirements.

---

## 🧭 **17. Tool Selection and Action Feasibility**

### **17.1 Why Tool Selection Matters**

An agent can only perform actions supported by its available capabilities and permissions.

A plan that requires an unavailable tool cannot be executed as written.

### **17.2 Tool Registry**

A simple tool registry can describe permitted operations.

```python
TOOLS = {
    "read_document": {
        "description": "Read an available document",
        "available": True,
    },
    "search_documents": {
        "description": "Search permitted documents",
        "available": True,
    },
    "send_email": {
        "description": "Send an email",
        "available": False,
    },
}
```

This example records tool availability. A real implementation should use the actual registered functions and permission checks.

### **17.3 Check Feasibility Before Planning Execution**

For each proposed action, verify:

- Does the tool exist?
- Is it available?
- Are required arguments present?
- Is the action permitted?
- Are prerequisites complete?
- Is the action safe to repeat?
- Does the action fit the budget?

### **17.4 Select from an Allowlist**

A planner should select from a defined set of valid actions.

```python
ALLOWED_ACTIONS = {
    "read_document",
    "search_documents",
    "summarize_document",
}


def validate_action(action: str) -> str:
    if action not in ALLOWED_ACTIONS:
        raise ValueError("Unsupported action.")

    return action
```

This prevents arbitrary action names from being treated as executable functions.

### **17.5 LLM Tool Selection**

An LLM may recommend a tool based on the task.

The application should still verify that:

- The tool is registered.
- Its arguments are valid.
- The caller is authorized.
- The operation meets applicable policy.
- Any required approval has been obtained.

A model recommendation is not permission to perform an action.

### **17.6 Avoid Unnecessary Tool Calls**

A tool call should contribute to the task.

Avoid:

- Searching for information already available.
- Repeating successful retrievals without reason.
- Calling unrelated tools.
- Performing external actions before validation.
- Calling expensive tools when a simpler method is sufficient.

---

## 🔄 **18. Feedback and Replanning**

### **18.1 What Is Replanning?**

Replanning means revising a plan when new information or execution results show that the current plan is unsuitable.

For example, a retrieval operation may fail because the requested document does not exist.

The planner may then choose another source or report that the required information is unavailable.

### **18.2 Replanning Cycle**

```text
Execute Planned Action
          |
          v
     Inspect Result
          |
          v
     Compare with Goal
          |
     +----+----+
     |         |
  On Track   Off Track
     |         |
     v         v
 Continue    Replan
     |         |
     +----+----+
          |
          v
     Check Completion
```

### **18.3 Common Replanning Triggers**

- A tool fails.
- A prerequisite is unavailable.
- The result fails validation.
- New information changes the task.
- The goal changes.
- A resource limit is reached.
- The current approach repeatedly fails.

### **18.4 Do Not Replan Without a Reason**

Replanning has costs.

It may consume more model calls, increase execution time, or introduce unnecessary complexity.

Replan when the current plan cannot reasonably achieve the goal or when a meaningful improvement is justified.

### **18.5 Preserve Useful Progress**

A revised plan should retain valid completed work when possible.

For example, if three documents were summarized successfully and the fourth failed, there may be no reason to repeat the first three summaries.

State should record completed work so the planner can continue from the appropriate point.

### **18.6 Track Attempts**

```python
state = {
    "current_task": "retrieve_document",
    "attempts": 1,
    "completed_tasks": ["validate_request"],
    "failed_tasks": [],
}
```

This provides information that can help prevent repeated actions.

### **18.7 Replanning Policy**

A useful policy can define:

- Which failures trigger replanning.
- Which failures allow retries.
- How many attempts are permitted.
- What completed work can be reused.
- Which alternatives are available.
- When human intervention is required.

---

## 🛑 **19. Planning Limits and Stop Conditions**

### **19.1 Why Planning Needs Limits**

An agent may continue generating plans without executing useful actions.

It may also repeatedly attempt a task that cannot succeed.

Limits help control resource use and prevent unproductive execution.

### **19.2 Useful Limits**

Depending on the task, define:

- Maximum planning iterations.
- Maximum task count.
- Maximum tool calls.
- Maximum retries per task.
- Maximum execution time.
- Maximum model-call budget.
- A clear completion condition.

### **19.3 Planning Completion**

Planning may finish when:

- A feasible plan has been created.
- All required tasks are identified.
- Dependencies are valid.
- Constraints are satisfied.
- The plan can be executed using available capabilities.

### **19.4 Task Completion**

Task completion is different from plan creation.

A plan can be valid while execution remains incomplete.

Track planning and execution separately.

### **19.5 Stop When the Goal Is Achieved**

Do not continue performing optional operations after the goal has been satisfied unless there is a specific reason.

For example, once a report passes all required validation checks, repeatedly regenerating it may reduce quality rather than improve it.

### **19.6 Stop Safely on Exhaustion**

If the planner cannot find a feasible alternative within its limits, it should return an explicit failure or request human assistance.

It should not claim success merely because it has stopped.

---

## 🧠 **20. Planning Strategies**

### **20.1 Hierarchical Planning**

Hierarchical planning organizes work at different levels.

Example:

```text
High-Level Goal
      |
      v
Research
      |
      +-- Collect Sources
      +-- Extract Evidence
      +-- Compare Findings
      |
      v
Write Report
      |
      +-- Draft Sections
      +-- Validate Claims
      |
      v
Deliver Report
```

This helps separate high-level objectives from implementation details.

### **20.2 Reactive Planning**

Reactive planning chooses an action based on the current situation.

Example:

- If input is invalid, request correction.
- If a tool times out, apply a permitted retry.
- If evidence is missing, retrieve more evidence.

Reactive decisions are useful when the next step depends on immediate conditions.

### **20.3 Goal-Directed Planning**

Goal-directed planning selects actions according to whether they advance a specified goal.

For example, an agent preparing a report should prioritize actions that improve the report or satisfy its requirements.

### **20.4 Constraint-Based Planning**

Constraint-based planning identifies actions that satisfy mandatory requirements.

Examples:

- A task must be completed before another task.
- A tool must be authorized.
- A response must contain required fields.
- A maximum attempt count must not be exceeded.

### **20.5 Search-Based Planning**

Search-based planning explores possible action sequences or states to find a suitable plan.

This can be useful when there are several possible routes to a goal.

However, the number of possible plans can grow rapidly, so search often needs limits or heuristics.

### **20.6 Combining Strategies**

A practical system may combine:

- Hierarchical task decomposition.
- Rule-based constraint checks.
- Goal-directed task selection.
- Reactive recovery.
- Search or scoring for choosing between alternatives.

The combination should be driven by the task rather than by a desire to use every technique.

---

## 🌳 **21. Search Trees and Candidate Plans**

### **21.1 What Is a Search Tree?**

A search tree represents alternative choices and their possible future states.

For example:

```text
               Start
              /     \
             v       v
         Plan A     Plan B
          /  \        |
         v    v       v
       A1     A2      B1
```

Each branch represents a possible continuation.

### **21.2 Why Explore Alternatives?**

A single plan may not be the only valid route to a goal.

Exploring alternatives can help identify:

- Lower-cost approaches.
- Faster routes.
- More reliable tools.
- Fallback strategies.
- Plans that satisfy different constraints.

### **21.3 Candidate Plan Evaluation**

A candidate plan may be evaluated using:

- Feasibility.
- Expected task success.
- Resource requirements.
- Number of operations.
- Dependency constraints.
- Risk.
- Expected output quality.

### **21.4 Avoid Exhaustive Search for Every Task**

The number of possible plans can grow rapidly.

For a straightforward task, generating and evaluating many alternatives is unnecessary.

Use bounded search or simple heuristics when the task requires only a small number of choices.

### **21.5 Simple Candidate Selection**

```python
def choose_best_plan(plans: list[dict]) -> dict:
    feasible_plans = [
        plan
        for plan in plans
        if plan["feasible"]
    ]

    if not feasible_plans:
        raise ValueError("No feasible plan is available.")

    return min(
        feasible_plans,
        key=lambda plan: plan["estimated_cost"],
    )
```

This example chooses the lowest-cost feasible plan.

A real system may need to consider quality, time, risk, and other requirements as well.

### **21.6 Search Limitations**

Search quality depends on:

- The available candidate actions.
- The accuracy of state transitions.
- The evaluation function.
- The search limit.
- The completeness of the model.

A planner cannot discover a good plan if its action set omits the necessary capability.

---

## 🗺️ **22. Planning with State Graphs**

### **22.1 Why Connect Planning to Graphs?**

The previous module introduced workflow patterns and state graphs.

This module applies those concepts to planning.

A graph can coordinate:

- Task decomposition.
- Task selection.
- Action execution.
- Result evaluation.
- Replanning.
- Completion.

### **22.2 Planning Graph**

```text
          START
            |
            v
      Understand Goal
            |
            v
       Build Plan
            |
            v
      Validate Plan
            |
            v
      Select Task
            |
            v
      Execute Task
            |
            v
     Evaluate Result
            |
       +----+----+
       |         |
   Continue    Replan
       |         |
       +----+----+
            |
            v
      Check Goal
            |
       +----+----+
       |         |
     Done     Continue
       |         |
       v         v
      END    Select Task
```

### **22.3 Planning Nodes**

A planning graph might contain:

- `understand_goal`
- `create_plan`
- `validate_plan`
- `select_task`
- `execute_task`
- `evaluate_result`
- `replan`
- `finalize`

Each node should have a clear responsibility.

### **22.4 Planning State**

A possible state schema is:

```python
state = {
    "goal": "Prepare a research report",
    "tasks": [],
    "completed_tasks": [],
    "failed_tasks": [],
    "current_task": None,
    "attempts": 0,
    "status": "planning",
}
```

The planner updates this state as work progresses.

### **22.5 Planning and Routing**

The graph can route based on the current state.

For example:

- If no plan exists, create one.
- If the plan is invalid, revise it.
- If a task is ready, execute it.
- If a task fails, evaluate recovery.
- If all required tasks are complete, finalize.

### **22.6 Keep Planning Separate from Execution**

The planning node should propose or select the next task.

The execution node should perform the task.

This separation allows the system to validate an action before it runs and to test planning behavior without executing external side effects.

### **22.7 Graphs Do Not Guarantee Good Plans**

A state graph controls execution structure.

It does not automatically ensure that a plan is useful, feasible, or optimal.

Those properties require appropriate planning logic, validation, and evaluation.

---

## 🧱 **23. Planning State Design**

### **23.1 Why Planning State Matters**

The planner needs to know what has happened, what remains, and what can happen next.

A useful state representation may contain:

- The goal.
- The plan.
- Task dependencies.
- Task statuses.
- Current task.
- Attempt counts.
- Failed tasks.
- Available actions.
- Completion status.

### **23.2 Example Schema**

```python
from typing import TypedDict


class PlanningState(TypedDict):
    goal: str
    tasks: list[dict]
    completed_tasks: list[str]
    failed_tasks: list[str]
    current_task: str
    status: str
```

This is an illustrative type definition.

For a real project, adjust optional fields and required values to match the workflow.

### **23.3 Task Statuses**

A task may use statuses such as:

- `pending`
- `ready`
- `running`
- `completed`
- `failed`
- `blocked`
- `cancelled`

Define the meaning of each status.

For example, `blocked` may mean that a prerequisite is incomplete, while `failed` means an attempted execution did not succeed.

### **23.4 Track Attempts Per Task**

A global attempt counter may not be enough.

If several tasks can fail independently, track attempts by task identifier.

```python
task_attempts = {
    "collect_sources": 1,
    "extract_evidence": 0,
    "write_report": 0,
}
```

This allows the planner to apply a separate retry policy to each task.

### **23.5 State Update Rules**

Define how the planner updates state when:

- A task starts.
- A task succeeds.
- A task fails.
- A plan changes.
- A task becomes blocked.
- The goal is completed.

Avoid inconsistent updates such as marking a task complete while its required validation is still pending.

### **23.6 State Consistency**

A planning system should maintain consistent relationships.

For example:

- A completed task should not remain pending.
- A task should not run before required dependencies finish.
- A failed task should not be silently counted as successful.
- A plan should not reference unknown task identifiers.

These rules can be enforced with validation functions and tests.

---

## 🛠️ **24. Python Planning Components**

### **24.1 Separate the Components**

A simple planning system can use functions for:

1. Goal validation.
2. Task decomposition.
3. Dependency validation.
4. Task selection.
5. Action execution.
6. Result evaluation.
7. Replanning.
8. Finalization.

These functions do not require a separate AI model.

### **24.2 Validate the Goal**

```python
def validate_goal(goal: str) -> str:
    if not isinstance(goal, str):
        raise TypeError("Goal must be a string.")

    normalized = goal.strip()

    if not normalized:
        raise ValueError("Goal cannot be empty.")

    return normalized
```

### **24.3 Represent a Task**

```python
task = {
    "id": "collect_sources",
    "description": "Collect relevant sources",
    "dependencies": [],
    "status": "pending",
    "attempts": 0,
}
```

Each task has an identifier, description, dependencies, status, and attempt count.

### **24.4 Check Task Readiness**

```python
def is_task_ready(
    task: dict,
    completed: set[str],
) -> bool:
    if task["status"] not in {"pending", "ready"}:
        return False

    return all(
        dependency in completed
        for dependency in task["dependencies"]
    )
```

### **24.5 Select a Ready Task**

```python
def select_next_task(
    tasks: list[dict],
    completed: set[str],
) -> dict | None:
    for task in tasks:
        if is_task_ready(task, completed):
            return task

    return None
```

This selects the first ready task in the supplied order.

It is a simple scheduling policy, not a guarantee of the optimal task order.

### **24.6 Record Completion**

```python
def mark_completed(
    task: dict,
    completed: set[str],
) -> set[str]:
    task["status"] = "completed"
    completed.add(task["id"])

    return completed
```

### **24.7 Validate Task Dependencies**

```python
def validate_dependencies(tasks: list[dict]) -> None:
    task_ids = {
        task["id"]
        for task in tasks
    }

    for task in tasks:
        for dependency in task["dependencies"]:
            if dependency not in task_ids:
                raise ValueError(
                    f"Unknown dependency: {dependency}"
                )
```

This catches references to tasks that do not exist.

It does not detect cycles; cycle detection requires an additional check.

### **24.8 Why Keep Functions Small?**

Small functions make it easier to:

- Test task selection independently.
- Validate dependency logic.
- Change prioritization rules.
- Replace a deterministic planner with an LLM-assisted planner.
- Integrate the components into LangGraph.

---

## 🧪 **25. Building a Rule-Based Planner**

### **25.1 Project Goal**

Create a planner that takes a predefined task plan, checks task dependencies, and selects the next ready task.

This is a deterministic foundation for more advanced planning.

### **25.2 Define the Tasks**

```python
tasks = [
    {
        "id": "collect_sources",
        "description": "Collect relevant sources",
        "dependencies": [],
        "status": "pending",
        "attempts": 0,
    },
    {
        "id": "extract_evidence",
        "description": "Extract useful evidence",
        "dependencies": ["collect_sources"],
        "status": "pending",
        "attempts": 0,
    },
    {
        "id": "analyze_findings",
        "description": "Analyze collected evidence",
        "dependencies": ["extract_evidence"],
        "status": "pending",
        "attempts": 0,
    },
    {
        "id": "write_report",
        "description": "Write the report",
        "dependencies": ["analyze_findings"],
        "status": "pending",
        "attempts": 0,
    },
]
```

### **25.3 Implement Task Selection**

```python
def select_ready_task(
    tasks: list[dict],
    completed: set[str],
) -> dict | None:
    for task in tasks:
        if task["status"] != "pending":
            continue

        prerequisites_complete = all(
            dependency in completed
            for dependency in task["dependencies"]
        )

        if prerequisites_complete:
            return task

    return None
```

### **25.4 Simulate Completion**

```python
completed = set()

while True:
    task = select_ready_task(tasks, completed)

    if task is None:
        break

    print(f"Selected: {task['id']}")

    task["status"] = "completed"
    completed.add(task["id"])
```

This simulation marks each selected task as complete.

In a real planner, the task would be executed and evaluated before being marked complete.

### **25.5 Add a Maximum Step Count**

Even simple planning loops should have an explicit limit when they are part of an application.

```python
max_steps = len(tasks)
steps = 0

while steps < max_steps:
    task = select_ready_task(tasks, completed)

    if task is None:
        break

    task["status"] = "completed"
    completed.add(task["id"])
    steps += 1
```

This prevents the loop from running indefinitely if task-selection behavior is later modified incorrectly.

### **25.6 Detect Incomplete Plans**

If no task is ready but some tasks remain pending, the planner may be blocked.

Possible causes include:

- A failed prerequisite.
- A dependency cycle.
- A missing task.
- Incorrect status updates.

Do not automatically declare success when no ready task remains.

### **25.7 Limitations of the Rule-Based Planner**

This planner assumes:

- Tasks are already defined.
- Dependencies are accurate.
- The task list is valid.
- Completion is recorded correctly.
- The first ready task is an acceptable choice.

It does not create tasks dynamically or reason about arbitrary natural-language goals.

Those capabilities can be added in later iterations.

---

## 🔀 **26. Dependency-Aware Task Scheduling**

### **26.1 What Is Task Scheduling?**

Task scheduling determines when eligible tasks should run.

A planner may have several ready tasks but limited resources.

It must decide which task to execute first.

### **26.2 Scheduling Criteria**

Possible criteria include:

- Task priority.
- Deadline.
- Estimated duration.
- Resource requirements.
- Dependencies.
- Risk.
- Expected contribution to the goal.

### **26.3 Priority-Based Selection**

```python
def select_highest_priority(
    ready_tasks: list[dict],
) -> dict | None:
    if not ready_tasks:
        return None

    return max(
        ready_tasks,
        key=lambda task: task["priority"],
    )
```

This selects the task with the highest priority.

The task list must already contain only eligible tasks.

### **26.4 Combine Readiness and Priority**

The correct process is:

1. Identify pending tasks.
2. Check their prerequisites.
3. Filter to ready tasks.
4. Apply the scheduling policy.
5. Select a task.
6. Execute it.
7. Update state.
8. Recompute readiness.

A high-priority task should not run before a mandatory prerequisite is complete.

### **26.5 Example**

Suppose:

| Task | Dependency | Priority |
|---|---|---:|
| Collect sources | None | 2 |
| Extract evidence | Collect sources | 5 |
| Validate source quality | Collect sources | 4 |
| Write report | Extract evidence and validate source quality | 10 |

Initially, only `Collect sources` is ready.

Even though `Write report` has the highest priority, it must wait until its dependencies are complete.

### **26.6 Scheduling and Parallelism**

When multiple tasks are ready and independent, they may be eligible for parallel execution.

However, parallelism also depends on:

- Resource limits.
- Tool limits.
- Rate limits.
- State-update rules.
- Failure-handling requirements.

A dependency graph identifies logical eligibility; the execution system determines whether concurrency is appropriate.

---

## 🔄 **27. Handling Failed Tasks**

### **27.1 Failure Is a Planning Event**

A failed task should update the planning state.

The planner can then determine whether to:

- Retry the task.
- Select an alternative action.
- Mark dependent tasks as blocked.
- Replan.
- Request human intervention.
- Stop with a failure result.

### **27.2 Example Failure State**

```python
task = {
    "id": "collect_sources",
    "status": "failed",
    "attempts": 2,
    "error": "Source service unavailable",
}
```

This records that the task failed after two attempts.

Do not treat this task as completed.

### **27.3 Retry Policy**

```python
def can_retry(
    attempts: int,
    max_attempts: int,
) -> bool:
    return attempts < max_attempts
```

A retry policy should also consider the type of failure and whether repeating the operation is safe.

### **27.4 Alternative Actions**

If a source is unavailable, the planner may try another permitted source.

The alternative should satisfy the same relevant requirements.

Do not choose an unrelated action simply to keep the workflow moving.

### **27.5 Blocked Dependencies**

If a task fails, its dependent tasks may become blocked.

For example:

```text
Collect Sources (Failed)
         |
         v
Extract Evidence (Blocked)
         |
         v
Write Report (Blocked)
```

The planner should either recover the prerequisite or report that the downstream work cannot continue.

### **27.6 Avoid Infinite Recovery**

Define:

- Maximum retries.
- Eligible failure types.
- Alternative actions.
- Replanning limits.
- Human escalation conditions.

Repeatedly retrying a permanently invalid request will not solve the problem.

### **27.7 Preserve Successful Work**

If independent tasks succeeded, preserve their results where possible.

Replanning should not automatically erase useful progress.

---

## 🧩 **28. Adding an LLM Planner**

### **28.1 Why Use an LLM Planner?**

An LLM can help interpret a natural-language goal and propose a sequence of tasks.

For example:

> Compare two libraries and recommend one for a small API project.

The model may identify tasks such as:

- Define comparison criteria.
- Retrieve documentation for both libraries.
- Compare compatibility.
- Evaluate performance considerations.
- Compare ecosystem support.
- Produce a recommendation.

### **28.2 What the LLM Should Produce**

Prefer structured output containing:

- Goal summary.
- Task identifiers.
- Task descriptions.
- Dependencies.
- Required tools.
- Expected outputs.
- Completion criteria.

### **28.3 Example Plan Schema**

```python
plan = {
    "goal": "Compare two libraries",
    "tasks": [
        {
            "id": "define_criteria",
            "description": "Define comparison criteria",
            "dependencies": [],
        },
        {
            "id": "collect_docs_a",
            "description": "Collect documentation for library A",
            "dependencies": ["define_criteria"],
        },
        {
            "id": "collect_docs_b",
            "description": "Collect documentation for library B",
            "dependencies": ["define_criteria"],
        },
        {
            "id": "compare",
            "description": "Compare both libraries",
            "dependencies": [
                "collect_docs_a",
                "collect_docs_b",
            ],
        },
    ],
}
```

This is a structured example of the desired output, not a claim that a model has already generated or validated it.

### **28.4 Validate the Plan**

Before executing an LLM-generated plan, check:

- The goal is preserved.
- Task identifiers are unique.
- Dependencies reference existing tasks.
- No invalid dependency cycles exist.
- Required tools are available.
- The task count is within limits.
- Actions are permitted.
- Success criteria are clear.

### **28.5 LLM Planner Architecture**

```text
User Goal
    |
    v
LLM Planner
    |
    v
Structured Plan
    |
    v
Plan Validator
    |
    +---- Invalid ----> Revise or Reject
    |
    v
Task Scheduler
    |
    v
Action Executor
    |
    v
Result Evaluator
    |
    v
Continue or Replan
```

### **28.6 Do Not Let the LLM Control Everything**

An LLM may propose tasks, but deterministic application logic should enforce hard constraints.

For example:

- The LLM proposes a database update.
- The application validates the target.
- Authorization is checked.
- Required approval is obtained.
- Only then is the operation executed.

The model should not bypass those controls.

### **28.7 When an LLM Planner Is Worthwhile**

Use an LLM planner when the task requires flexible interpretation or decomposition.

A fixed sequence or rule-based planner is often preferable when the task is predictable and the requirements are explicit.

---

## 🛡️ **29. Constrained Planning and Safety**

### **29.1 Planning Must Respect Boundaries**

A plan should be evaluated not only for usefulness but also for whether its actions are permitted.

A plan that achieves the goal through an unauthorized action is not a valid plan.

### **29.2 Separate Hard Constraints from Preferences**

Hard constraints may include:

- No access without authorization.
- No external write before validation.
- No sensitive action without required approval.
- No tool call outside an allowlist.
- No execution beyond the configured budget.

Preferences may include:

- Prefer fewer tool calls.
- Prefer faster completion.
- Prefer lower cost.
- Prefer concise outputs.

Preferences can help rank valid plans. They must not override mandatory constraints.

### **29.3 Validate Every Proposed Action**

A plan validator can reject an action when:

- Its tool is not registered.
- Its arguments are malformed.
- Its permissions are insufficient.
- Its prerequisites are incomplete.
- It exceeds the resource budget.
- It violates the workflow's policy.

### **29.4 Human Approval**

Some actions should require human approval.

Examples may include:

- Sending an external communication.
- Changing a production configuration.
- Deleting important records.
- Making a consequential financial decision.

The required approval level depends on the operation and its risk.

### **29.5 Safe Fallbacks**

When a plan cannot safely continue, the agent may:

- Ask for clarification.
- Return a draft rather than submit it.
- Request approval.
- Report an unavailable capability.
- Stop and provide a clear failure result.

### **29.6 Security Is Not a Scoring Option**

An unsafe action should not become acceptable merely because it has a high expected benefit.

Apply authorization and safety constraints before ranking candidate actions.

---

## 🧪 **30. Testing Planning Systems**

### **30.1 Why Planning Needs Tests**

Planning logic can fail even when individual functions work.

Examples:

- A task is selected before its prerequisite.
- A dependency refers to an unknown task.
- A failed task is marked completed.
- The planner retries indefinitely.
- An invalid plan reaches execution.
- The planner chooses a nonexistent tool.

### **30.2 Test Goal Validation**

```python
import pytest


def test_empty_goal_is_rejected():
    with pytest.raises(ValueError):
        validate_goal("   ")
```

### **30.3 Test Task Readiness**

```python
def test_task_ready_when_dependencies_complete():
    task = {
        "id": "write_report",
        "dependencies": ["analyze"],
        "status": "pending",
    }

    assert is_task_ready(
        task,
        {"analyze"},
    )
```

### **30.4 Test Blocked Tasks**

```python
def test_task_blocked_when_dependency_missing():
    task = {
        "id": "write_report",
        "dependencies": ["analyze"],
        "status": "pending",
    }

    assert not is_task_ready(
        task,
        set(),
    )
```

### **30.5 Test Invalid Dependencies**

```python
def test_unknown_dependency_is_rejected():
    tasks = [
        {
            "id": "write_report",
            "dependencies": ["missing_task"],
        }
    ]

    with pytest.raises(ValueError):
        validate_dependencies(tasks)
```

### **30.6 Test Retry Limits**

```python
def test_retry_limit():
    assert can_retry(0, 3)
    assert can_retry(1, 3)
    assert can_retry(2, 3)
    assert not can_retry(3, 3)
```

### **30.7 Test Plan Validation**

A plan-validation test suite should include:

- Duplicate task identifiers.
- Unknown dependencies.
- Cyclic dependencies.
- Unsupported tools.
- Too many tasks.
- Missing success criteria.
- Invalid action parameters.

### **30.8 Test Replanning**

Test whether:

- A failed task remains failed until a recovery decision is made.
- A valid retry can proceed.
- Successful tasks remain complete.
- Dependent tasks remain blocked when required.
- The planner stops after its configured limit.

### **30.9 Run Tests**

```bash
python -m pytest -q
```

A passing test suite provides evidence that the implemented rules behave as expected for the tested cases. It does not prove that every possible plan is correct.

---

## 🔍 **31. Debugging Decision Logic**

### **31.1 Start with the Decision**

When an agent chooses the wrong action, inspect:

- The current goal.
- The state used for the decision.
- The available candidate actions.
- The constraints.
- The scoring or routing rule.
- The chosen action.
- The result of that action.

### **31.2 Common Problems**

| Problem | Likely Cause | Improvement |
|---|---|---|
| Wrong task selected | Incorrect priority or readiness rule | Test selection logic |
| Repeated task | Progress state not updated | Track attempts and outcomes |
| Missing prerequisite | Incomplete dependency graph | Validate dependencies |
| Impossible plan | Unavailable tool | Validate capabilities |
| Excessive replanning | No stopping policy | Add replanning limits |
| Poor action ranking | Inaccurate scoring assumptions | Evaluate against real outcomes |
| Invalid model plan | Unvalidated structured output | Validate before execution |
| Premature completion | Incorrect success criteria | Define measurable completion conditions |

### **31.3 Inspect State Changes**

For every planning iteration, record safe diagnostic information such as:

- Current task.
- Task status.
- Number of attempts.
- Selected action.
- Decision outcome.
- Remaining eligible tasks.

Avoid logging unnecessary confidential content.

### **31.4 Reproduce with a Small Case**

If a complex plan fails, simplify it.

Start with two tasks and one dependency.

Verify the selection logic before testing a larger task graph.

### **31.5 Add Regression Tests**

Once a decision bug is fixed, add a test that reproduces the original failure.

This helps prevent the same problem from returning.

---

## 📊 **32. Evaluating Plan Quality**

### **32.1 Why Evaluate Plans?**

A plan may be executable but still be inefficient or unsuitable.

Evaluation helps determine whether the plan:

- Achieves the goal.
- Respects constraints.
- Uses available tools.
- Avoids unnecessary tasks.
- Handles dependencies.
- Uses reasonable resources.
- Has clear completion criteria.

### **32.2 Feasibility**

A feasible plan can be executed under the available conditions.

Check tool availability, task prerequisites, permissions, and resource limits.

### **32.3 Completeness**

A plan is complete when it contains the required tasks and conditions needed to achieve the goal.

Completeness depends on the task's requirements.

### **32.4 Efficiency**

An efficient plan avoids unnecessary operations while still meeting the required quality and safety standards.

Fewer steps do not always mean a better plan. An extra validation step may prevent a costly error.

### **32.5 Robustness**

A robust plan has reasonable behavior when an expected failure occurs.

For example, it may provide an alternative retrieval source or a human-review path.

### **32.6 Measurable Evaluation**

For a practical planner, track:

- Task completion rate.
- Number of failed tasks.
- Average retries.
- Tool calls per task.
- Execution time.
- Cost per completed goal.
- Rate of invalid plans.
- Rate of successful recovery.

### **32.7 Evaluate Against Real Requirements**

A planning system should be judged against the intended goal, not merely by whether it generated a plausible-looking list of steps.

---

## 🚀 **33. Production Planning Principles**

### **33.1 Make the Goal Explicit**

Avoid executing a plan whose intended outcome is unclear.

Clarify requirements when missing information materially affects the result.

### **33.2 Keep the Plan Bounded**

Define suitable limits for:

- Task count.
- Planning iterations.
- Tool calls.
- Retries.
- Execution time.
- Resource consumption.

### **33.3 Separate Proposal from Execution**

A planner proposes actions.

A validator checks those actions.

An executor performs permitted operations.

An evaluator checks the results.

This separation supports testing and control.

### **33.4 Track Progress**

Store task identifiers, statuses, dependencies, and outcomes.

This helps the system continue from the correct point and avoid repeating completed work unnecessarily.

### **33.5 Validate Dynamic Plans**

Plans generated by models should be checked before execution.

Validation should cover task structure, dependencies, tool availability, permissions, and resource limits.

### **33.6 Design Recovery Paths**

For important tasks, define what happens when:

- A tool fails.
- A prerequisite fails.
- The plan becomes infeasible.
- The resource budget is exhausted.
- Human approval is denied.
- The task cannot be completed.

### **33.7 Keep Decisions Observable**

Record why an action was selected in terms of safe, useful decision metadata.

For example:

```python
decision_record = {
    "selected_action": "retrieve_source",
    "reason_code": "required_evidence_missing",
    "attempt": 1,
}
```

This makes decisions easier to debug without requiring excessive or sensitive logging.

### **33.8 Avoid Overengineering**

Not every application needs a search algorithm, a utility model, an LLM planner, and a state graph.

Use the simplest design that satisfies the real requirements.

---

## 🏗️ **34. Complete Practical Project: Goal-Planning Agent**

### **34.1 Project Objective**

Build a Python planning system that accepts a predefined goal, manages a dependency-aware task list, selects ready tasks, simulates execution, records progress, and handles task failures within a bounded retry policy.

The project focuses on the planning architecture rather than on calling a real LLM.

### **34.2 Project Requirements**

The system should:

- Define a goal.
- Store a list of tasks.
- Validate task identifiers.
- Validate dependencies.
- Select eligible tasks.
- Track task status.
- Track attempts.
- Simulate task execution.
- Handle a failed task.
- Enforce retry limits.
- Detect incomplete execution.
- Return a final status.

### **34.3 Project Structure**

```text
goal-planner/
├── README.md
├── requirements.txt
├── src/
│   ├── __init__.py
│   └── planner.py
└── tests/
    └── test_planner.py
```

### **34.4 Create the Environment**

Activate the virtual environment created in Module 00.

Install pytest if it is not already installed:

```bash
python -m pip install pytest
```

Create `requirements.txt`:

```text
pytest
```

### **34.5 Implement the Planner**

Create `src/planner.py`:

```python
from collections import defaultdict, deque


def validate_goal(goal: str) -> str:
    if not isinstance(goal, str):
        raise TypeError("Goal must be a string.")

    goal = goal.strip()

    if not goal:
        raise ValueError("Goal cannot be empty.")

    return goal


def validate_tasks(tasks: list[dict]) -> None:
    identifiers = [
        task["id"]
        for task in tasks
    ]

    if len(identifiers) != len(set(identifiers)):
        raise ValueError("Task identifiers must be unique.")

    known_ids = set(identifiers)

    for task in tasks:
        if not task.get("id"):
            raise ValueError("Every task needs an identifier.")

        if not isinstance(task.get("dependencies"), list):
            raise TypeError("Dependencies must be a list.")

        for dependency in task["dependencies"]:
            if dependency not in known_ids:
                raise ValueError(
                    f"Unknown dependency: {dependency}"
                )

            if dependency == task["id"]:
                raise ValueError(
                    "A task cannot depend on itself."
                )

    validate_acyclic(tasks)


def validate_acyclic(tasks: list[dict]) -> None:
    graph = defaultdict(list)
    in_degree = {
        task["id"]: 0
        for task in tasks
    }

    for task in tasks:
        for dependency in task["dependencies"]:
            graph[dependency].append(task["id"])
            in_degree[task["id"]] += 1

    queue = deque(
        task_id
        for task_id, degree in in_degree.items()
        if degree == 0
    )

    visited = 0

    while queue:
        current = queue.popleft()
        visited += 1

        for dependent in graph[current]:
            in_degree[dependent] -= 1

            if in_degree[dependent] == 0:
                queue.append(dependent)

    if visited != len(tasks):
        raise ValueError("Task dependencies contain a cycle.")


def select_ready_task(
    tasks: list[dict],
    completed: set[str],
) -> dict | None:
    for task in tasks:
        if task["status"] != "pending":
            continue

        if all(
            dependency in completed
            for dependency in task["dependencies"]
        ):
            return task

    return None


def simulate_execution(task: dict) -> bool:
    """
    Simulate task execution.

    The task may define `fail_first` to demonstrate recovery.
    """
    attempts = task["attempts"]

    if task.get("fail_first") and attempts == 1:
        return False

    return True


def run_plan(
    goal: str,
    tasks: list[dict],
    max_attempts: int = 3,
) -> dict:
    goal = validate_goal(goal)

    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1.")

    validate_tasks(tasks)

    completed = set()
    failed = set()

    for task in tasks:
        task.setdefault("status", "pending")
        task.setdefault("attempts", 0)

    max_steps = len(tasks) * max_attempts
    steps = 0

    while steps < max_steps:
        if len(completed) == len(tasks):
            return {
                "goal": goal,
                "status": "completed",
                "completed_tasks": sorted(completed),
                "failed_tasks": sorted(failed),
            }

        task = select_ready_task(tasks, completed)

        if task is None:
            pending = [
                item["id"]
                for item in tasks
                if item["status"] == "pending"
            ]

            if pending:
                return {
                    "goal": goal,
                    "status": "blocked",
                    "completed_tasks": sorted(completed),
                    "failed_tasks": sorted(failed),
                    "pending_tasks": pending,
                }

            break

        task["status"] = "running"
        task["attempts"] += 1
        steps += 1

        success = simulate_execution(task)

        if success:
            task["status"] = "completed"
            completed.add(task["id"])
            failed.discard(task["id"])
            continue

        task["status"] = "failed"
        failed.add(task["id"])

        if task["attempts"] < max_attempts:
            task["status"] = "pending"
            continue

        return {
            "goal": goal,
            "status": "failed",
            "completed_tasks": sorted(completed),
            "failed_tasks": sorted(failed),
            "failed_task": task["id"],
        }

    return {
        "goal": goal,
        "status": "failed",
        "completed_tasks": sorted(completed),
        "failed_tasks": sorted(failed),
    }


if __name__ == "__main__":
    plan = [
        {
            "id": "collect_sources",
            "dependencies": [],
        },
        {
            "id": "extract_evidence",
            "dependencies": ["collect_sources"],
        },
        {
            "id": "write_report",
            "dependencies": ["extract_evidence"],
            "fail_first": True,
        },
    ]

    result = run_plan(
        "Prepare a research report",
        plan,
        max_attempts=3,
    )

    print(result)
```

### **34.6 Understand the Project**

The implementation:

1. Validates the goal.
2. Checks for duplicate task identifiers.
3. Verifies that dependencies exist.
4. Detects dependency cycles.
5. Selects a task whose prerequisites are complete.
6. Simulates task execution.
7. Records success or failure.
8. Retries a failed task within the configured limit.
9. Returns a final status.

The simulated executor is intentionally simple. Replace it with actual operations only after defining the correct tool interfaces, validation, and side-effect safeguards.

### **34.7 Add Tests**

Create `tests/test_planner.py`:

```python
import pytest

from src.planner import (
    run_plan,
    validate_goal,
    validate_tasks,
)


def test_empty_goal_is_rejected():
    with pytest.raises(ValueError):
        validate_goal(" ")


def test_duplicate_task_ids_are_rejected():
    tasks = [
        {
            "id": "collect",
            "dependencies": [],
        },
        {
            "id": "collect",
            "dependencies": [],
        },
    ]

    with pytest.raises(ValueError):
        validate_tasks(tasks)


def test_unknown_dependency_is_rejected():
    tasks = [
        {
            "id": "write",
            "dependencies": ["missing"],
        },
    ]

    with pytest.raises(ValueError):
        validate_tasks(tasks)


def test_dependency_cycle_is_rejected():
    tasks = [
        {
            "id": "task_a",
            "dependencies": ["task_b"],
        },
        {
            "id": "task_b",
            "dependencies": ["task_a"],
        },
    ]

    with pytest.raises(ValueError):
        validate_tasks(tasks)


def test_plan_completes():
    tasks = [
        {
            "id": "collect",
            "dependencies": [],
        },
        {
            "id": "write",
            "dependencies": ["collect"],
        },
    ]

    result = run_plan(
        "Create a report",
        tasks,
    )

    assert result["status"] == "completed"
    assert set(result["completed_tasks"]) == {
        "collect",
        "write",
    }


def test_failed_task_can_be_retried():
    tasks = [
        {
            "id": "collect",
            "dependencies": [],
            "fail_first": True,
        },
    ]

    result = run_plan(
        "Collect sources",
        tasks,
        max_attempts=3,
    )

    assert result["status"] == "completed"
    assert "collect" in result["completed_tasks"]


def test_failed_task_stops_after_limit():
    tasks = [
        {
            "id": "collect",
            "dependencies": [],
            "always_fail": True,
        },
    ]

    # The basic demonstration executor does not use always_fail.
    # Replace or extend the executor before relying on this scenario.
```

The final test illustrates an important testing lesson: a test must match the actual behavior of the implementation. In the current example, `always_fail` is not implemented, so this test is not yet a valid assertion of retry exhaustion.

Before running the suite, either remove that unfinished test or implement a deterministic failure rule and add assertions for the final failure status.

### **34.8 Run the Project**

From the project root:

```bash
python -m pytest -q
python -m src.planner
```

### **34.9 Expected Behavior**

The example plan should:

- Complete `collect_sources`.
- Complete `extract_evidence`.
- Fail the first attempt at `write_report`.
- Retry `write_report`.
- Finish with a completed status if the retry succeeds.

### **34.10 Project Limitations**

This is a learning implementation.

It does not include:

- Real LLM-based task decomposition.
- Actual document retrieval.
- Persistent execution state.
- Parallel task scheduling.
- Production monitoring.
- Real tool permissions.
- Human approval.
- A sophisticated plan-quality evaluator.

These are optional extensions, not prerequisites for understanding the planning fundamentals.

### **34.11 Suggested Improvements**

After the base project works:

- Add a priority field.
- Implement an alternative action after failure.
- Add a task timeout.
- Add structured logging.
- Add a plan-quality validator.
- Integrate the planner into a LangGraph workflow.
- Add an LLM planner that produces structured tasks.
- Validate all LLM-generated plans before execution.
- Add human review for consequential actions.

Implement one improvement at a time and test it.

---

## 🧪 **35. Hands-On Exercises**

### **Exercise 1: Goal Definition**

Write three goals for an agentic application.

For each goal, define:

- Expected output.
- Required information.
- Completion criteria.
- Relevant constraints.

**Outcome:** Clear, testable goal descriptions.

### **Exercise 2: Task Decomposition**

Break a goal into five to eight subtasks.

Ensure every task contributes to the final result.

**Outcome:** A structured task list.

### **Exercise 3: Dependency Mapping**

Create a dependency graph for your subtasks.

Identify which tasks can begin immediately and which must wait.

**Outcome:** A valid dependency structure.

### **Exercise 4: Fixed Versus Dynamic Planning**

Design two plans for the same task:

- A fixed plan.
- A dynamic plan that adapts to a failed retrieval.

Explain when each approach is suitable.

**Outcome:** An understanding of adaptive planning.

### **Exercise 5: Rule-Based Decisions**

Write a function that chooses between:

- Retrieve information.
- Execute a task.
- Request clarification.
- Stop.

**Outcome:** Explicit decision logic.

### **Exercise 6: Action Scoring**

Define three candidate actions.

Assign illustrative benefit, cost, and risk values.

Calculate their scores and explain the limitations of the result.

**Outcome:** A basic action-ranking system.

### **Exercise 7: Feasibility Validation**

Create a tool registry with available and unavailable tools.

Reject a plan that requires an unavailable tool.

**Outcome:** Capability-aware planning.

### **Exercise 8: Retry and Replanning**

Simulate a task that fails on the first attempt.

Implement a retry limit and a clear final status.

**Outcome:** Controlled failure recovery.

### **Exercise 9: State Management**

Design a state object that tracks:

- Goal.
- Current task.
- Completed tasks.
- Failed tasks.
- Attempt counts.
- Final status.

**Outcome:** Structured planning state.

### **Exercise 10: Dependency Validation**

Create a plan with an unknown dependency and a separate plan with a cycle.

Ensure both are rejected.

**Outcome:** A basic plan validator.

### **Exercise 11: LLM Plan Validation**

Write a validator for a structured plan.

Check:

- Unique task identifiers.
- Valid dependencies.
- Allowed tools.
- Maximum task count.

**Outcome:** A safer boundary between model output and execution.

### **Exercise 12: Planning with LangGraph**

Build a graph with nodes for:

- Create plan.
- Validate plan.
- Select task.
- Execute task.
- Evaluate result.

Include a conditional transition for failure recovery.

**Outcome:** A graph-based planning workflow.

### **Exercise 13: Plan Quality**

Define criteria for evaluating a plan.

Include feasibility, completeness, cost, and failure handling.

**Outcome:** A documented plan-quality checklist.

### **Exercise 14: Final Challenge**

Extend the goal-planning project with at least three features:

- Task prioritization.
- Alternative actions.
- An LLM planner.
- LangGraph integration.
- Persistent state.
- Structured logs.
- Human approval.
- More comprehensive tests.

**Outcome:** A tested planning system with explicit constraints and recovery behavior.

---

## 🎤 **36. Interview Questions and Answers**

### **Q1. What is planning in agentic AI?**

Planning is the process of identifying and organizing actions to achieve a goal while considering dependencies, constraints, and expected outcomes.

### **Q2. Why do AI agents need planning?**

Planning helps agents organize complex tasks, respect prerequisites, choose useful actions, and adapt when execution does not proceed as expected.

### **Q3. What is task decomposition?**

Task decomposition breaks a large goal into smaller tasks that are easier to understand, execute, and evaluate.

### **Q4. What is the difference between a goal and a task?**

A goal describes the desired outcome. A task is a unit of work that contributes to achieving that outcome.

### **Q5. What is the difference between planning and execution?**

Planning decides what should happen. Execution performs the selected operations.

### **Q6. What is dynamic planning?**

Dynamic planning changes the plan according to new information, current state, or execution results.

### **Q7. What is fixed planning?**

Fixed planning follows a predefined sequence of tasks and transitions.

### **Q8. When should an agent replan?**

Replanning is useful when a task fails, the plan becomes infeasible, new information changes the best approach, or the current strategy no longer advances the goal.

### **Q9. What is a task dependency?**

A task dependency means that one task requires another task to complete or produce information before it can proceed.

### **Q10. Why must dependencies be validated?**

Invalid dependencies can cause tasks to run too early, remain blocked, or create cycles that prevent execution.

### **Q11. What is a cyclic dependency?**

A cyclic dependency occurs when tasks depend on one another in a cycle, preventing a valid execution order under strict prerequisite rules.

### **Q12. What is action scoring?**

Action scoring assigns values to candidate actions so that the planner can compare their expected benefits, costs, or other relevant characteristics.

### **Q13. What is utility-based decision-making?**

Utility-based decision-making compares possible actions according to how desirable their expected outcomes are under defined preferences.

### **Q14. Why are hard constraints different from preferences?**

Preferences can often be traded against other preferences. Hard constraints must be satisfied and cannot be overridden by a high score.

### **Q15. What is uncertainty-aware planning?**

It is planning that considers missing or unreliable information and chooses actions such as retrieval, clarification, conservative execution, or escalation.

### **Q16. What is the value of information?**

The value of information is the expected improvement in decision quality obtained by collecting additional information.

### **Q17. How should an agent select tools?**

It should choose from available, permitted tools whose capabilities and inputs match the task, then validate the action before execution.

### **Q18. Why should LLM-generated plans be validated?**

An LLM may produce missing dependencies, invalid tool names, infeasible tasks, or unsafe actions. Validation checks the plan before it can affect the application.

### **Q19. What is hierarchical planning?**

Hierarchical planning organizes work into levels, breaking a high-level goal into subtasks and smaller operations.

### **Q20. What is reactive planning?**

Reactive planning chooses actions based on the current situation, such as retrying a recoverable failure or requesting missing information.

### **Q21. What is a search tree in planning?**

A search tree represents alternative action sequences and possible future states that can be evaluated to find a suitable plan.

### **Q22. Why not always use exhaustive search?**

The number of possible plans can grow rapidly, increasing computational cost. Many tasks are better handled with rules, heuristics, or bounded search.

### **Q23. What is replanning feedback?**

Replanning feedback is information from execution or evaluation that indicates whether the current plan should continue or change.

### **Q24. How can an agent avoid repeated failed actions?**

Track attempts and outcomes, apply retry limits, evaluate alternative actions, and stop or escalate when recovery is no longer reasonable.

### **Q25. What is a feasible plan?**

A feasible plan can be executed with the available tools, information, permissions, and resources while respecting the task's constraints.

### **Q26. What is plan quality?**

Plan quality describes how well a plan achieves the goal while meeting requirements and managing cost, time, risk, and failure conditions.

### **Q27. How do state graphs help planning?**

State graphs provide explicit nodes and transitions for coordinating planning, task execution, evaluation, and recovery.

### **Q28. Why separate the planner from the executor?**

The separation allows proposed actions to be validated before execution and makes planning and execution easier to test independently.

### **Q29. What is the difference between task failure and task completion?**

A failed task did not achieve its required outcome. A completed task satisfied its defined completion condition.

### **Q30. How should a planner handle an unavailable tool?**

It should reject or revise the infeasible plan, select an appropriate permitted alternative if available, or report that the goal cannot currently be completed.

### **Q31. Why should planning loops have limits?**

Limits prevent excessive planning, repeated failed actions, and unbounded resource consumption.

### **Q32. What is a practical use of LLM planning?**

An LLM can interpret a natural-language goal and propose structured subtasks, while application logic validates and controls their execution.

### **Q33. Should an LLM decide whether an action is authorized?**

No. The application should enforce permissions and required approval independently of the model's recommendation.

### **Q34. How do you test a planning system?**

Test goal validation, task decomposition, dependency rules, task selection, failure handling, retry limits, plan validation, and final status.

### **Q35. What is the most important principle in advanced planning?**

Create plans that are feasible, bounded, aligned with the goal, and capable of responding safely to execution results.

---

## 📝 **37. Cheat Sheet**

### **Planning Concepts**

| Concept | Meaning |
|---|---|
| Goal | Desired outcome |
| Task | Unit of work |
| Subtask | Smaller part of a task |
| Action | Operation that can be performed |
| Plan | Organized set of tasks and actions |
| Dependency | Required relationship between tasks |
| Planner | Selects and organizes actions |
| Executor | Performs selected actions |
| Evaluator | Checks results |
| Replanning | Revises the plan |
| Utility | Representation of outcome desirability |
| Feasibility | Whether a plan can be executed |
| Constraint | Requirement that limits valid actions |

### **Planning Strategies**

| Strategy | Suitable Use |
|---|---|
| Fixed planning | Predictable sequence |
| Dynamic planning | Adaptation to changing results |
| Hierarchical planning | Large goals with subtasks |
| Reactive planning | Decisions based on current conditions |
| Rule-based planning | Explicit deterministic requirements |
| Search-based planning | Comparing alternative action sequences |
| Constraint-based planning | Enforcing prerequisites and restrictions |

### **Useful Python Patterns**

```python
# Validate a goal
goal = validate_goal(goal)


# Check whether prerequisites are complete
ready = all(
    dependency in completed
    for dependency in task["dependencies"]
)


# Enforce a retry limit
if attempts >= max_attempts:
    status = "failed"


# Select the highest-priority ready task
next_task = max(
    ready_tasks,
    key=lambda task: task["priority"],
)


# Validate a proposed action
if action not in ALLOWED_ACTIONS:
    raise ValueError("Unsupported action.")
```

### **Planning Checklist**

Before executing a plan, verify:

- [ ] The goal is clear.
- [ ] Tasks contribute to the goal.
- [ ] Dependencies are valid.
- [ ] Required tools are available.
- [ ] Actions are permitted.
- [ ] Resource limits are defined.
- [ ] Completion criteria are explicit.
- [ ] Failure handling is defined.
- [ ] Retry behavior is bounded.
- [ ] The plan can be tested.

### **Common Mistakes**

| Mistake | Better Approach |
|---|---|
| Decomposing every tiny task | Match decomposition to complexity |
| Executing before checking dependencies | Validate task readiness |
| Trusting every generated plan | Validate structure and feasibility |
| Replanning after every minor event | Replan when there is a meaningful reason |
| Retrying permanent failures | Classify errors before retrying |
| Choosing actions only by score | Enforce hard constraints first |
| Ignoring completed work | Preserve valid progress |
| Planning without a stopping condition | Define completion and failure limits |
| Using a model for every decision | Use deterministic logic where suitable |

---

## 🔗 **38. Official Resources**

Use official documentation to verify framework behavior and current APIs.

### **LangGraph**

- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [LangGraph Quickstart](https://docs.langchain.com/oss/python/langgraph/quickstart)
- [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph)

### **Python**

- [Python Documentation](https://docs.python.org/3/)
- [Python Typing](https://docs.python.org/3/library/typing.html)
- [Python Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Python Collections](https://docs.python.org/3/library/collections.html)

### **Testing**

- [pytest Documentation](https://docs.pytest.org/en/stable/)
- [pytest Getting Started](https://docs.pytest.org/en/stable/getting-started.html)

### **How to Study These Resources**

1. Understand the planning concepts in this README.
2. Build the deterministic Python planner.
3. Test task selection and dependency validation.
4. Study LangGraph's current graph API.
5. Integrate planning into a graph only after the basic implementation works.
6. Add model-based planning when you can validate its output reliably.

---

## ✅ **39. Completion Checklist**

### **Planning Fundamentals**

- [ ] I can explain planning in agentic AI.
- [ ] I understand goals, tasks, subtasks, actions, and plans.
- [ ] I can decompose a complex goal.
- [ ] I can identify task dependencies.
- [ ] I understand fixed and dynamic planning.
- [ ] I can explain when replanning is useful.

### **Decision-Making**

- [ ] I can implement rule-based decisions.
- [ ] I understand action scoring.
- [ ] I can explain cost-benefit analysis.
- [ ] I understand utility and preferences.
- [ ] I can explain decisions under uncertainty.
- [ ] I know when an agent should gather information.
- [ ] I can validate whether an action is feasible.

### **Implementation**

- [ ] I can represent a plan using Python data structures.
- [ ] I can validate task identifiers.
- [ ] I can validate dependencies.
- [ ] I can detect dependency cycles.
- [ ] I can select an eligible task.
- [ ] I can track task status.
- [ ] I can implement a bounded retry policy.
- [ ] I can distinguish planning from execution.
- [ ] I can explain how a planner fits into a state graph.

### **Reliability and Safety**

- [ ] I can validate a proposed plan.
- [ ] I understand hard constraints.
- [ ] I know why model-generated actions require validation.
- [ ] I can prevent unbounded planning loops.
- [ ] I can handle failed prerequisites.
- [ ] I can preserve valid completed work.
- [ ] I can test recovery behavior.

### **Practical Project**

- [ ] I built the goal-planning project.
- [ ] I tested valid goals.
- [ ] I tested invalid dependencies.
- [ ] I tested dependency cycles.
- [ ] I tested task completion.
- [ ] I tested a recoverable failure.
- [ ] I tested retry limits.
- [ ] I documented the project's limitations.
- [ ] I can explain the planner's execution flow.
- [ ] I committed the working project to my repository.

---

## ➡️ **40. What Comes Next?**

You have now studied how an agent can organize complex work, choose actions, evaluate alternatives, and adjust a plan when execution results change.

The central lesson is:

**A useful planner does not merely produce tasks. It produces a feasible plan, respects dependencies and constraints, tracks progress, and knows when to continue, replan, or stop.**

You have learned how to:

- Decompose goals.
- Organize task dependencies.
- Choose between fixed and dynamic planning.
- Compare candidate actions.
- Reason about cost and uncertainty.
- Select permitted tools.
- Replan after failures.
- Integrate planning with state graphs.
- Test task selection and recovery.
- Build a deterministic planning system.

### **Next Module**

**`04-Agent-Orchestration`**

In the next module, you will learn how to coordinate agents, tools, and workflows as a larger system. You will focus on orchestration patterns, component responsibilities, control flow, and how separate parts of an agentic application work together.

### **Before Moving Forward**

Make sure you can build and explain the practical planner without copying the code blindly.

You should be able to answer:

- Why was this task selected?
- Which dependencies must finish first?
- What happens when the task fails?
- When should the planner retry?
- When should it replan?
- How does the system know that the goal is complete?

**Understand the plan. Control the actions. Verify the result. Then move forward.** 🚀
