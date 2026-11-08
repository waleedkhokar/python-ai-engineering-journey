
# 🧪 Module 10 — Agent Evaluation and Testing

Learn how to test AI agents systematically, measure task success, evaluate tool selection, identify failure patterns, and improve reliability through repeatable experiments.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 10 — Agent Evaluation and Testing |
| Planned Date | Sep 16, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–09 |
| Primary Language | Python |
| Tools | pytest, Pydantic, Mocking, JSON, Logging, AI Evaluation Datasets |
| Main Focus | Unit testing, integration testing, task success, tool accuracy, regression testing, and reliability |
| Next Module | 11 — Security and Human Approval |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain why AI agents require systematic evaluation.
- Distinguish unit, integration, end-to-end, and regression testing.
- Measure task completion and tool-call accuracy.
- Build repeatable evaluation datasets.
- Test successful execution and failure scenarios.
- Mock external APIs and model responses.
- Evaluate agent outputs against expected results.
- Understand the limitations of LLM-as-a-judge evaluation.
- Track latency, cost, and reliability.
- Build a simple agent evaluation pipeline.

---

## 1. Why Do AI Agents Need Evaluation?

Traditional software often follows predefined logic. An AI agent may select different tools, interpret instructions differently, or produce variable outputs for similar requests.

An agent can appear to work while still making serious mistakes:

- Selecting the wrong tool.
- Supplying invalid tool arguments.
- Misinterpreting an API response.
- Stopping before completing the task.
- Producing an unsupported answer.
- Repeating an operation unnecessarily.
- Exceeding its execution budget.

Testing only one successful example is not enough.

**Agent evaluation** is the systematic process of measuring whether an agent completes its intended tasks accurately, safely, consistently, and efficiently.

### Example

Suppose you build a database assistant.

| User Request | Expected Behavior |
|---|---|
| Count active employees | Run the approved count query |
| Find employee by ID | Validate the ID and retrieve the permitted record |
| Delete all employees | Refuse or require an authorized approval process |
| Ask an unrelated question | Explain that the request is outside its supported scope |
| Database unavailable | Report a controlled failure |

A good evaluation checks not only the final answer, but also the actions the agent took to produce it.

---

## 2. Types of Agent Testing

| Test Type | Purpose | Example |
|---|---|---|
| Unit testing | Test one function in isolation | Validate tool arguments |
| Integration testing | Test multiple components together | Tool plus API client |
| End-to-end testing | Test the complete workflow | User request to final result |
| Regression testing | Detect previously fixed problems | Ensure a known task still works |
| Safety testing | Check prohibited or risky behavior | Prevent unauthorized deletion |
| Performance testing | Measure speed and resource use | Measure latency and token usage |

Use different test levels because a failure may originate in the tool, integration, model, workflow controller, or external service.

---

## 3. Define What Success Means

Before testing an agent, define its expected behavior.

For each evaluation case, specify:

- Input request.
- Required output or outcome.
- Allowed tools.
- Expected tool arguments.
- Forbidden actions.
- Success criteria.
- Relevant safety constraints.

Example test case:

```json
{
  "id": "calculator-001",
  "input": "Calculate 25 multiplied by 4",
  "expected_tool": "calculator",
  "expected_result": 100,
  "success_criteria": [
    "calculator_tool_called",
    "correct_arguments",
    "correct_final_answer"
  ]
}
```

This is a simple illustrative evaluation record. Real evaluation datasets may contain additional fields for expected actions, permissions, grading rules, and execution limits.

Avoid vague criteria such as “the answer looks good.” Define observable outcomes wherever possible.

---

## 4. Core Evaluation Metrics

### Task success rate

Measures the proportion of evaluated tasks completed successfully.

\[
\text{Task Success Rate} =
\frac{\text{Successful Tasks}}{\text{Total Tasks}}
\times 100
\]

If an agent succeeds on 90 out of 100 tasks:

\[
\frac{90}{100}\times100=90\%
\]

### Tool selection accuracy

Measures how often the agent selects the appropriate tool when a reference tool choice is defined.

\[
\text{Tool Accuracy} =
\frac{\text{Correct Tool Selections}}{\text{Evaluated Selections}}
\times 100
\]

### Additional useful metrics

| Metric | What It Measures |
|---|---|
| Argument accuracy | Whether tool inputs match the required values |
| Completion rate | Whether the workflow reaches its required end state |
| Error rate | How often executions fail |
| Latency | How long a task takes |
| Cost per task | Average model and infrastructure cost |
| Retry rate | How often operations need retries |
| Safety violation rate | Frequency of defined safety failures |
| Human intervention rate | How often a person must take over |

Not every metric applies to every agent. Choose metrics that reflect the actual use case.

A high task success rate does not automatically mean an agent is safe. Track safety failures separately, and treat serious violations as release blockers.

---

## 5. Create a Simple Agent to Test

Create `agent.py`:

```python
def calculator(operation: str, a: float, b: float) -> float:
    if operation == "add":
        return a + b

    if operation == "multiply":
        return a * b

    raise ValueError("Unsupported operation")


def run_agent(request: dict) -> dict:
    operation = request["operation"]
    a = request["a"]
    b = request["b"]

    result = calculator(operation, a, b)

    return {
        "tool": "calculator",
        "result": result,
    }
```

This is a deterministic demonstration of a tool-using workflow. It does not call an LLM, but it lets you establish testing fundamentals before introducing model variability.

---

## 6. Write Unit Tests with pytest

Install pytest:

```bash
pip install pytest
```

Create `tests/test_agent.py`:

```python
import pytest

from agent import calculator, run_agent


def test_addition():
    assert calculator("add", 2, 3) == 5


def test_multiplication():
    assert calculator("multiply", 4, 5) == 20


def test_unsupported_operation():
    with pytest.raises(ValueError):
        calculator("divide", 10, 2)


def test_agent_result():
    response = run_agent(
        {
            "operation": "multiply",
            "a": 6,
            "b": 7,
        }
    )

    assert response["tool"] == "calculator"
    assert response["result"] == 42
```

Run the tests from the project directory:

```bash
pytest -v
```

### What are we testing?

- Correct arithmetic results.
- Correct handling of unsupported operations.
- Correct tool identity.
- Correct final result structure.

These tests are deterministic: they should return the same outcome for the same inputs.

### Important limitation

The example does not validate input types or restrict extremely large numbers. Add input validation and execution limits before using a tool in a production agent.

---

## 7. Test Invalid Inputs and Failure Paths

A robust agent must handle invalid data deliberately.

For example, the calculator should not silently accept an unknown operation.

Add tests for:

- Missing fields.
- Unsupported operations.
- Invalid data types.
- Malformed model-generated arguments.
- Tool timeouts.
- External API failures.
- Unexpected response formats.

Example:

```python
import pytest

from agent import calculator


def test_invalid_operation_fails():
    with pytest.raises(ValueError):
        calculator("unknown", 2, 3)


def test_missing_request_field_fails():
    from agent import run_agent

    with pytest.raises(KeyError):
        run_agent(
            {
                "operation": "add",
                "a": 2,
            }
        )
```

These tests document current behavior. In a production system, explicit validation with clear error messages is generally preferable to relying on incidental exceptions such as `KeyError`.

---

## 8. Build an Evaluation Dataset

An evaluation dataset contains representative tasks with expected outcomes.

Create `eval_cases.json`:

```json
[
  {
    "id": "add-001",
    "input": {
      "operation": "add",
      "a": 2,
      "b": 3
    },
    "expected_tool": "calculator",
    "expected_result": 5
  },
  {
    "id": "multiply-001",
    "input": {
      "operation": "multiply",
      "a": 4,
      "b": 5
    },
    "expected_tool": "calculator",
    "expected_result": 20
  }
]
```

Create `evaluate.py`:

```python
import json

from agent import run_agent


def evaluate_dataset(path: str) -> dict:
    with open(path, encoding="utf-8") as file:
        cases = json.load(file)

    passed = 0
    results = []

    for case in cases:
        try:
            actual = run_agent(case["input"])

            success = (
                actual["tool"] == case["expected_tool"]
                and actual["result"] == case["expected_result"]
            )

            if success:
                passed += 1

            results.append(
                {
                    "id": case["id"],
                    "passed": success,
                    "actual": actual,
                }
            )

        except Exception as error:
            results.append(
                {
                    "id": case["id"],
                    "passed": False,
                    "error": type(error).__name__,
                }
            )

    total = len(cases)

    return {
        "total": total,
        "passed": passed,
        "failed": total - passed,
        "success_rate": passed / total if total else 0.0,
        "results": results,
    }


if __name__ == "__main__":
    report = evaluate_dataset("eval_cases.json")
    print(json.dumps(report, indent=2))
```

Run:

```bash
python evaluate.py
```

This evaluator compares structured results with exact expected values. It is intentionally simple; real agent evaluations should also examine tool arguments, safety behavior, completion conditions, and failure handling.

For larger datasets, add stable identifiers, dataset versions, and reproducible configuration.

---

## 9. Evaluating LLM-Based Agents

LLM-based agents introduce additional variables:

- Model version.
- System instructions.
- User prompt.
- Available tools.
- Tool descriptions and schemas.
- Temperature and sampling settings.
- Retrieved context.
- External service responses.

When an evaluation fails, record enough configuration to understand what changed.

### Example evaluation workflow

```text
Evaluation Dataset
        |
        v
Run Agent on Each Case
        |
        v
Record Tool Calls
        |
        v
Capture Final Result
        |
        v
Apply Evaluation Rules
        |
        v
Calculate Metrics
        |
        v
Compare with Previous Run
        |
        v
Review Failures
```

### What should you inspect?

1. Did the agent understand the task?
2. Did it choose the appropriate tool?
3. Were the arguments valid?
4. Did the tool return the expected result?
5. Did the agent interpret that result correctly?
6. Did it complete the task?
7. Did it respect permissions and safety constraints?
8. Did it stay within time and cost limits?

Keep a record of intermediate actions where possible. A correct final answer may still hide unsafe or unnecessary tool calls.

---

## 10. LLM-as-a-Judge

An LLM-as-a-judge uses another model to assess an agent's output against a rubric.

It can help evaluate open-ended qualities such as relevance, clarity, or whether a response addresses a question.

Example rubric:

| Criterion | Evaluation Question |
|---|---|
| Relevance | Does the response address the request? |
| Correctness | Is the response supported by available evidence? |
| Completeness | Are required parts included? |
| Instruction following | Were the task constraints respected? |
| Safety | Did the agent avoid prohibited actions? |

### Limitations

An LLM judge may:

- Prefer a polished but incorrect answer.
- Miss subtle factual errors.
- Be influenced by the order or wording of candidate answers.
- Apply a rubric inconsistently.
- Fail to detect unsafe intermediate actions.

Use deterministic checks for facts that can be verified directly, such as exact values, schema compliance, permissions, and whether an action occurred.

For high-impact use cases, combine automated evaluation with human review and independently verified ground truth.

---

## 11. Mock External APIs During Testing

Unit tests should not depend on a live external API whenever a deterministic mock can test the behavior.

Benefits include:

- Faster tests.
- Lower cost.
- Repeatable results.
- No dependency on network availability.
- No need to expose production credentials.

For an API integration, test at least these scenarios:

| Scenario | Expected Behavior |
|---|---|
| Valid response | Parse and return the expected fields |
| HTTP 401 | Report an authentication failure |
| HTTP 429 | Apply the defined rate-limit policy |
| Timeout | Return a controlled timeout error |
| Invalid JSON | Report a response-format error |
| Missing required field | Reject or safely handle the response |

Use integration tests against a real test service separately when you need to verify actual network behavior.

---

## 12. Regression Testing

A regression occurs when a previously working behavior breaks after a code, prompt, model, tool, or configuration change.

Maintain a collection of known evaluation cases and run them whenever relevant components change.

For example:

```text
Version A
  Task Success: 92%
  Tool Accuracy: 96%
  Safety Failures: 0

Version B
  Task Success: 95%
  Tool Accuracy: 97%
  Safety Failures: 1
```

These numbers are illustrative.

Version B has better task success, but the new safety failure may make it unsuitable for release. Metrics must be interpreted together rather than optimized independently.

### Regression testing checklist

- Keep a fixed baseline dataset.
- Track changes to prompts and tool schemas.
- Record model and configuration versions.
- Compare failures by category.
- Add previously discovered bugs as new tests.
- Review serious safety failures before release.

---

## 13. Latency, Cost, and Reliability

An agent should be evaluated for operational performance, not just correctness.

### Latency

Measure how long a task takes from the defined start point to the defined completion point.

### Cost

Track relevant model usage, external API charges, and infrastructure costs where measurable.

### Reliability

Track how consistently the agent completes the same types of tasks under the specified conditions.

### Useful operational metrics

| Metric | Example Measurement |
|---|---|
| Task success rate | Successful tasks / total tasks |
| Median latency | Typical completion time |
| p95 latency | Time within which 95% of tasks finish |
| Average cost | Total measured cost / completed tasks |
| Tool error rate | Failed tool calls / total tool calls |
| Retry rate | Executions requiring retries / total executions |
| Safety violation rate | Evaluations containing defined safety violations / total evaluations |

Report the sample size and evaluation conditions. Small datasets can produce misleading percentages.

---

## 14. Hands-On Exercises

### Beginner

- [ ] Write unit tests for a tool.
- [ ] Test invalid input and unsupported operations.
- [ ] Create an evaluation dataset in JSON.
- [ ] Calculate task success rate.

### Intermediate

- [ ] Test tool argument validation.
- [ ] Mock an external API.
- [ ] Add timeout and malformed-response tests.
- [ ] Generate a machine-readable evaluation report.
- [ ] Compare two versions using the same dataset.

### Advanced

- [ ] Evaluate an LLM-based agent with a fixed set of tasks.
- [ ] Measure tool selection and argument accuracy.
- [ ] Add a rubric-based evaluation for open-ended responses.
- [ ] Track latency and estimated cost.
- [ ] Introduce a regression test for every important bug.
- [ ] Define release-blocking safety conditions.

---

## 15. Project — Agent Evaluation Harness

Build a reusable evaluation harness for one of your earlier projects, such as the Web Research Agent or Database Agent.

### Requirements

1. Store test cases in a version-controlled dataset.
2. Execute each case against the agent.
3. Record tool calls and final results.
4. Evaluate task completion.
5. Validate tool arguments.
6. Capture exceptions and failed operations.
7. Calculate success and failure rates.
8. Track latency where practical.
9. Compare results across agent versions.
10. Flag serious safety failures separately.

### Suggested project structure

```text
10-Agent-Evaluation-and-Testing/
├── README.md
├── agent/
│   └── agent.py
├── datasets/
│   └── eval_cases.json
├── tests/
│   ├── test_agent.py
│   └── test_tools.py
├── evaluation/
│   ├── evaluate.py
│   └── metrics.py
└── reports/
    └── .gitkeep
```

Avoid committing API keys, private user data, or confidential evaluation examples.

**Success criteria:** the evaluation harness can run repeatably, identify failed cases, report measurable metrics, and detect at least one deliberately introduced regression.

---

## 16. Interview Questions and Answers

**Q1. Why is testing an AI agent different from testing ordinary software?**

Agents can make variable decisions, select tools dynamically, and generate non-deterministic outputs. Evaluation must examine both final results and intermediate actions.

**Q2. What is task success rate?**

It is the proportion of evaluated tasks that meet their defined success criteria.

**Q3. What is regression testing?**

Regression testing checks that previously working behavior remains correct after changes.

**Q4. What is the difference between unit and integration testing?**

Unit tests check individual components in isolation. Integration tests verify that connected components work together.

**Q5. Why mock APIs?**

Mocks make tests faster, cheaper, and more repeatable without depending on live services.

**Q6. What is LLM-as-a-judge?**

It uses a language model to grade outputs against a defined rubric. Its judgments should be validated because the evaluator can also make mistakes.

**Q7. Why track tool calls?**

Tool-call records help identify incorrect tool selection, invalid arguments, unnecessary actions, and unsafe intermediate behavior.

**Q8. What is a golden evaluation dataset?**

It is a version-controlled collection of representative cases with established expected outcomes or grading criteria.

**Q9. Can an agent have a high success rate and still be unsafe?**

Yes. Aggregate success can hide rare but serious failures. Safety metrics and release gates should be evaluated separately.

**Q10. What is an evaluation harness?**

It is a reusable system that executes evaluation cases, collects results, applies grading rules, and produces metrics or reports.

---

## 17. Completion Checklist

- [ ] I understand the main types of software testing.
- [ ] I defined observable success criteria.
- [ ] I wrote unit tests with pytest.
- [ ] I tested invalid inputs and error handling.
- [ ] I built a version-controlled evaluation dataset.
- [ ] I calculated task success rate.
- [ ] I understand LLM-as-a-judge limitations.
- [ ] I know how to mock external APIs.
- [ ] I understand regression testing.
- [ ] I measured or planned to measure latency and cost.
- [ ] I created a reusable evaluation harness.

---

## 🔑 Key Takeaways

- Agent evaluation should be systematic and repeatable.
- Define success criteria before running evaluations.
- Test final results and intermediate tool behavior.
- Use deterministic checks whenever possible.
- Mocks help make integration tests predictable.
- LLM judges are useful but can make grading mistakes.
- Track accuracy, safety, latency, and cost together.
- Turn important failures into regression tests.

## 🚀 Next Module — Security and Human Approval

In Module 11, you will learn how to secure agent tools, enforce permissions, handle untrusted inputs, add human approval checkpoints, and prevent unsafe or unauthorized actions.

**Suggested commit message:**

```text
Sep 16, 2026 — Day 11: Agent evaluation — testing, metrics, and reliability
```

---

## 📚 Further Learning

- [pytest Documentation](https://docs.pytest.org/)
- [Python unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [LangSmith Evaluation Concepts](https://docs.langchain.com/langsmith/evaluation)
