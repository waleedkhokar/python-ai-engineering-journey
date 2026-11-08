
# 🧩 Module 05 — Reasoning and Planning

Learn how AI agents interpret goals, break complex tasks into smaller steps, select actions, evaluate results, and adjust their plans when something goes wrong.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 05 — Reasoning and Planning |
| Planned Date | Sep 6, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–04: Setup, Agent Fundamentals, Architecture, Tool Calling, and Memory |
| Primary Language | Python |
| Tools | Python, LLM APIs, Pydantic, pytest |
| Main Focus | Task decomposition, planning strategies, ReAct, action selection, and plan evaluation |
| Next Module | 06 — Agent Frameworks |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain reasoning and planning in AI agents.
- Break a complex goal into smaller tasks.
- Distinguish a plan from an executed action.
- Understand ReAct-style workflows.
- Compare fixed plans with dynamic planning.
- Implement a simple task planner in Python.
- Handle failed actions and revise plans.
- Understand the limitations of LLM reasoning.
- Design bounded and testable agent workflows.

---

## 1. What Are Reasoning and Planning?

**Reasoning** is the process of using available information to make decisions, draw conclusions, or select an action.

**Planning** is the process of deciding which steps to take to reach a goal.

Imagine an agent receives this request:

> Research three project management tools, compare their features, and prepare a summary.

The agent may need to:

1. Identify suitable tools.
2. Find reliable sources.
3. Extract relevant features.
4. Compare the results.
5. Identify missing information.
6. Prepare the summary.
7. Check that the requested comparison is complete.

Reasoning helps the agent decide what to do at each stage. Planning organizes the work into steps.

These capabilities are related, but they are not identical. An agent can follow a fixed plan without sophisticated reasoning, and it can make a decision without creating a detailed multi-step plan.

## 2. Goal, Plan, Action, and Observation

| Concept | Meaning | Example |
|---|---|---|
| Goal | The desired outcome | Compare three products |
| Plan | An ordered or conditional set of steps | Find products, gather prices, compare |
| Action | An operation performed by the system | Call a product-search API |
| Observation | The result of an action | Search results returned |
| Evaluation | Checking progress against the goal | Confirm all three products have prices |
| Replanning | Changing the plan when necessary | Use another source if a result is missing |

A plan is not proof that the work has been completed. The agent must execute actions, inspect observations, and verify the result.

---

## 3. Common Planning Strategies

### 3.1 Fixed Planning

The steps are decided in advance.

Example:

```text
1. Read the input file.
2. Validate the data.
3. Calculate summary statistics.
4. Save the report.
```

**Best for:** predictable workflows with known steps.

**Limitation:** a fixed plan may not handle unexpected conditions well unless those conditions are explicitly covered.

### 3.2 Dynamic Planning

The agent changes its next action based on observations.

Example:

```text
Search for a product
       |
       v
Was a price found?
   /         \
 Yes          No
  |            |
Compare     Try another
prices      approved source
```

**Best for:** tasks where information is incomplete or conditions change.

**Limitation:** dynamic decisions can introduce inconsistency, extra API calls, and unpredictable execution time.

### 3.3 Task Decomposition

A large goal is divided into smaller tasks.

Example:

```text
Goal: Prepare a market research report
             |
      +------+------+
      |      |      |
   Research Data  Competitor
   sources   facts  comparison
      |      |      |
      +------+------+
             |
       Verify results
             |
       Prepare report
```

The subtasks may be performed sequentially or in parallel, depending on their dependencies.

### 3.4 Hierarchical Planning

A high-level goal is broken into subgoals, which can themselves be decomposed into smaller tasks.

For example:

- Goal: Build a web application.
  - Design the interface.
  - Implement the backend.
  - Create the database schema.
  - Write tests.
  - Deploy the application.

  The backend task might then be divided into API endpoints, validation, authentication, and error handling.

Hierarchical planning is useful for complex work, but too many levels can make plans difficult to manage and evaluate.

---

## 4. The ReAct Pattern

**ReAct** stands for *Reasoning and Acting*. It is a pattern in which an LLM alternates between deciding what to do and using observations from actions to decide what to do next.

A simplified workflow is:

```text
User Goal
    |
    v
Decide Next Action
    |
    v
Execute Action / Tool
    |
    v
Observe Result
    |
    v
Evaluate Progress
    |
    +---- Goal incomplete ----> Decide Next Action
    |
    v
Final Answer
```

### Example

User request:

> Find the current weather in Islamabad.

A ReAct-style process might be:

1. Decide that current weather data is required.
2. Call an approved weather tool.
3. Observe the returned weather data.
4. Check whether the result contains the required information.
5. Answer using the retrieved result.

If the tool returns an error, the agent may retry within defined limits or use another approved source.

**Important:** ReAct is a general workflow pattern, not a guarantee of correct reasoning. It also does not require exposing private internal reasoning to the user. Applications can record concise action summaries, tool inputs, observations, and outcomes for debugging and evaluation.

---

## 5. Other Reasoning and Planning Approaches

| Approach | Main Idea | Useful When |
|---|---|---|
| Direct prompting | Ask the model for an answer or action directly | Simple tasks |
| Task decomposition | Break a large goal into smaller tasks | Complex requests |
| ReAct-style workflow | Alternate action selection and observations | Tool-using tasks |
| Plan-and-execute | Create a plan, then execute its steps | Work with a clear overall structure |
| Conditional planning | Choose different steps based on results | Tasks with branches and failure cases |
| Search-based planning | Explore possible action sequences | Problems with explicit states and possible actions |
| Hierarchical planning | Decompose goals into subgoals | Large, multi-stage tasks |

These approaches can be combined. For example, an agent might first decompose a goal, execute the plan with tools, and use conditional replanning when a step fails.

---

## 6. Build a Simple Planner in Python

Before using an LLM, implement a small planning workflow with predictable behavior.

Create `task_planner.py`:

```python
from dataclasses import dataclass, field


@dataclass
class Task:
    name: str
    completed: bool = False


@dataclass
class Planner:
    goal: str
    tasks: list[Task] = field(default_factory=list)

    def add_task(self, name: str) -> None:
        self.tasks.append(Task(name=name))

    def next_task(self) -> Task | None:
        for task in self.tasks:
            if not task.completed:
                return task

        return None

    def complete_task(self, task_name: str) -> None:
        for task in self.tasks:
            if task.name == task_name:
                task.completed = True
                return

        raise ValueError(f"Task not found: {task_name}")

    def is_complete(self) -> bool:
        return all(task.completed for task in self.tasks)


def run_planner(planner: Planner) -> None:
    while True:
        task = planner.next_task()

        if task is None:
            break

        print(f"Working on: {task.name}")

        # Simulate successful execution.
        planner.complete_task(task.name)

    print("Goal:", planner.goal)
    print("Completed:", planner.is_complete())


if __name__ == "__main__":
    planner = Planner(
        goal="Prepare a basic research report"
    )

    planner.add_task("Collect source material")
    planner.add_task("Extract key findings")
    planner.add_task("Compare findings")
    planner.add_task("Write the report")

    run_planner(planner)
```

Run it:

```bash
python task_planner.py
```

Expected output:

```text
Working on: Collect source material
Working on: Extract key findings
Working on: Compare findings
Working on: Write the report
Goal: Prepare a basic research report
Completed: True
```

### What does this demonstrate?

- `Planner` represents the goal and its tasks.
- `next_task()` selects the next incomplete task.
- `complete_task()` records progress.
- `is_complete()` checks whether the plan has finished.

This is a deterministic planner. It does not use an LLM to generate tasks, inspect real-world results, or decide whether to replan.

Also, the example simulates successful execution. In a real application, mark a task complete only after its action succeeds and its result passes the required checks.

---

## 7. Add Dependencies and Conditional Decisions

Real plans often contain dependencies. For example, a report cannot be finalized until its research is complete.

A dependency graph might look like this:

```text
Collect Data
     |
     v
Validate Data
     |
     v
Analyze Data
     |
     v
Write Report
     |
     v
Verify Report
```

Other workflows contain branches:

```text
Fetch Data
    |
    v
Request Successful?
   / \
 Yes  No
 |     |
Parse  Retry within
Data  configured limit
```

When building an agent, define:

- Which tasks depend on other tasks.
- Which results count as success.
- Which errors are recoverable.
- When to retry.
- When to stop and ask for help.
- Which actions require approval.

For complicated state transitions, a workflow or graph-based orchestration system may be easier to maintain than a single large loop. That topic will become more relevant in the Agentic AI Engineering course.

---

## 8. Handling Failed Actions and Replanning

An agent should not assume that every action succeeds.

A useful policy might be:

1. Execute an approved action.
2. Inspect its result.
3. If successful, record the observation and continue.
4. If the failure is transient, retry within a limit.
5. If the failure is recoverable, select an alternative action.
6. If the failure is unsafe or unrecoverable, stop or request human intervention.

| Failure | Possible Response |
|---|---|
| Temporary API timeout | Retry within a configured limit |
| Missing search result | Search another approved source |
| Invalid input | Ask for clarification or correct the input |
| Conflicting sources | Gather additional evidence and report uncertainty |
| Permission denied | Stop the restricted action |
| Repeated failures | Stop and provide a clear error |
| High-impact action | Request approval before execution |

Do not retry irreversible operations blindly. A timeout may occur after an external action has already succeeded.

---

## 9. Planning with LLMs: Important Limitations

LLM-generated plans can be useful, but they are not automatically correct.

Common problems include:

- Missing steps.
- Incorrect assumptions.
- Invalid tool arguments.
- Plans that do not match the available tools.
- Repeated or unnecessary actions.
- Incorrect interpretation of tool results.
- Failure to notice that the goal has already been achieved.
- Excessive API calls and costs.

Use explicit success criteria, structured plans, validated tool arguments, bounded execution, and independent checks for important results.

For high-impact tasks, prefer deterministic rules and human approval over unconstrained model decisions.

---

## 10. Hands-On Exercises

### Beginner

- [ ] Create a plan containing five tasks.
- [ ] Display the next incomplete task.
- [ ] Mark tasks as completed.
- [ ] Detect when all tasks are complete.

### Intermediate

- [ ] Add task dependencies.
- [ ] Prevent a task from running before its dependencies are complete.
- [ ] Add a maximum number of execution attempts.
- [ ] Simulate a task failure and handle it.
- [ ] Add unit tests for successful and failed tasks.

### Advanced

- [ ] Ask an LLM to generate a structured plan for a research task.
- [ ] Validate the generated plan before execution.
- [ ] Execute approved steps using registered tools.
- [ ] Replan when a step returns an expected recoverable error.
- [ ] Log action summaries, observations, and completion status.
- [ ] Compare a fixed workflow against a dynamically planned workflow on the same test tasks.

---

## 11. Interview Questions and Answers

**Q1. What is reasoning in an AI agent?**

Reasoning is the process of interpreting available information and selecting or evaluating actions to achieve a goal.

**Q2. What is planning?**

Planning organizes the steps required to reach a goal, including their order and dependencies.

**Q3. What is task decomposition?**

It is breaking a complex goal into smaller, more manageable subtasks.

**Q4. What is the ReAct pattern?**

ReAct is a workflow pattern that alternates reasoning-oriented action selection with acting and observing results.

**Q5. What is the difference between fixed and dynamic planning?**

Fixed planning follows predetermined steps. Dynamic planning adapts subsequent actions based on observations.

**Q6. What is plan-and-execute?**

It is an approach in which a system creates a plan and then executes its steps, potentially revising the plan when necessary.

**Q7. Why does an agent need termination conditions?**

They prevent endless loops and help control execution time, API calls, and cost.

**Q8. How should an agent handle a failed tool call?**

It should inspect the error, retry only when appropriate, select a valid alternative if possible, or stop and request assistance.

**Q9. Does a detailed plan guarantee successful execution?**

No. The system must execute each step, validate its results, and verify that the final goal has been achieved.

**Q10. When should you avoid an LLM-based planner?**

When a deterministic workflow solves the task reliably with less complexity, cost, and uncertainty.

---

## 12. Completion Checklist

- [ ] I understand reasoning, planning, and task decomposition.
- [ ] I can explain fixed, dynamic, and hierarchical planning.
- [ ] I understand the ReAct pattern.
- [ ] I built a simple task planner in Python.
- [ ] I understand dependencies and conditional workflows.
- [ ] I know how to handle failed actions and retries.
- [ ] I understand why execution limits and success criteria matter.
- [ ] I completed at least three exercises.

---

## 🔑 Key Takeaways

- Reasoning helps select and evaluate actions; planning organizes steps toward a goal.
- Task decomposition makes complex work easier to manage.
- ReAct-style workflows combine action selection with observations.
- A plan must be executed and verified.
- Failed actions may require retries, alternative actions, or human intervention.
- Execution limits and explicit success criteria improve reliability.
- Use an LLM planner only when its flexibility justifies the added complexity.

## 🚀 Next Module — Agent Frameworks

In Module 06, you will explore agent frameworks, understand what they automate, compare framework architectures, and build a small tool-using agent using a practical framework.

**Suggested commit message:**

```text
Sep 6, 2026 — Day 6: Reasoning and planning — ReAct, CoT, and task decomposition
```
