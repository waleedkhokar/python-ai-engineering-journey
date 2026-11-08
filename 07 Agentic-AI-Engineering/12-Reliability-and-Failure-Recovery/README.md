<CodeBlock language="markdown" editable={true}>

# 12 — Reliability and Failure Recovery 🔄

> **Module:** 12 — Reliability and Failure Recovery  
> **Level:** Advanced  
> **Track:** Agentic AI Engineering  
> **Previous Module:** 11 — Evaluation and Observability  
> **Next Module:** 13 — Scaling and Production Deployment  
> **Focus:** Retries, timeouts, error handling, checkpoints, recovery strategies, idempotency, fault tolerance, and durable execution.

---

## 📚 Table of Contents

1. [Learning Objectives](#1-learning-objectives)
2. [What Is Reliability?](#2-what-is-reliability)
3. [Why Agents Fail](#3-why-agents-fail)
4. [Reliability Principles](#4-reliability-principles)
5. [Error Handling](#5-error-handling)
6. [Retries and Backoff](#6-retries-and-backoff)
7. [Timeouts and Cancellation](#7-timeouts-and-cancellation)
8. [Idempotency and Duplicate Prevention](#8-idempotency-and-duplicate-prevention)
9. [Circuit Breakers](#9-circuit-breakers)
10. [Fallbacks and Graceful Degradation](#10-fallbacks-and-graceful-degradation)
11. [Checkpoints and State Recovery](#11-checkpoints-and-state-recovery)
12. [Durable Execution](#12-durable-execution)
13. [Transactions and Compensation](#13-transactions-and-compensation)
14. [Handling Partial Failures](#14-handling-partial-failures)
15. [Reliable Agent Architecture](#15-reliable-agent-architecture)
16. [Python Implementation](#16-python-implementation)
17. [Testing Reliability](#17-testing-reliability)
18. [Mini Project](#18-mini-project)
19. [Best Practices](#19-best-practices)
20. [Common Mistakes](#20-common-mistakes)
21. [Exercises](#21-exercises)
22. [Interview Questions](#22-interview-questions)
23. [Glossary](#23-glossary)
24. [Final Checklist](#24-final-checklist)
25. [References](#25-references)

---

# 1. Learning Objectives 🎯

By the end of this module, you will understand how to:

- Design agents that recover from temporary failures.
- Distinguish retryable errors from permanent errors.
- Implement retries, exponential backoff, and jitter.
- Apply timeouts to model calls and external tools.
- Prevent duplicate operations with idempotency.
- Use circuit breakers to protect failing services.
- Build fallbacks and graceful degradation.
- Save and restore agent state using checkpoints.
- Understand durable execution and resumable workflows.
- Recover from partial failures in multi-step operations.
- Design compensation strategies for distributed workflows.
- Test reliability using failure injection.
- Build a recovery layer around an agent workflow.

**Core principle:** A reliable agent is not one that never fails. It is one that detects failures, limits their impact, and recovers safely whenever possible.

---

# 2. What Is Reliability? 🛡️

Reliability is the ability of a system to perform its intended work correctly and consistently over time, including when dependencies fail.

An agentic system may depend on:

- An LLM provider.
- A database.
- A vector database.
- External APIs.
- Tools and integrations.
- Multiple agents.
- Background workers.
- Human approvals.
- Persistent storage.

Any dependency can fail independently.

## 2.1 Example

Imagine an AI travel agent that:

1. Receives a travel request.
2. Searches for flights.
3. Checks hotel availability.
4. Calculates a budget.
5. Requests user approval.
6. Books the selected services.
7. Sends a confirmation.

Suppose the hotel API fails after the flight search succeeds.

An unreliable agent might restart everything, lose its previous results, or produce an incomplete answer.

A reliable agent should:

1. Detect the hotel API failure.
2. Determine whether the error is temporary.
3. Retry safely if appropriate.
4. Preserve the successful flight result.
5. Use an alternative provider if available.
6. Report the limitation if recovery fails.

## 2.2 Reliability vs. Related Concepts

| Concept | Meaning |
|---|---|
| Reliability | The system performs correctly and consistently. |
| Availability | The system is accessible when needed. |
| Fault tolerance | The system continues operating despite certain failures. |
| Resilience | The system absorbs failures and recovers. |
| Recoverability | The system can restore useful operation after failure. |
| Observability | The system exposes enough information to understand its behavior. |
| Scalability | The system handles increasing workloads. |

These concepts overlap but are not interchangeable.

A service can be available while producing incorrect answers. A reliable system must consider both operational behavior and the correctness of its results.

---

# 3. Why Agents Fail ⚠️

Agentic systems have additional failure modes because their behavior may involve repeated decisions, tool calls, changing state, and dynamically generated plans.

## 3.1 Infrastructure Failures

Examples:

- Network connection drops.
- API server becomes unavailable.
- Database connection fails.
- Worker process crashes.
- Storage becomes temporarily inaccessible.

**Typical response:** Retry transient failures, use a fallback, or resume from a checkpoint.

## 3.2 Model Failures

Examples:

- LLM provider returns an error.
- Rate limit is exceeded.
- Response exceeds the expected length.
- Model returns malformed JSON.
- Model produces an answer that does not satisfy the required schema.

**Typical response:** Retry eligible errors, validate outputs, repair structured output when appropriate, or use a controlled fallback.

## 3.3 Tool Failures

Examples:

- Search API times out.
- Tool returns an unexpected response.
- External service rejects a request.
- Tool arguments are invalid.
- A payment request returns an ambiguous result.

**Typical response:** Validate arguments, classify errors, and determine whether the operation is safe to retry.

## 3.4 Workflow Failures

Examples:

- Agent enters an infinite loop.
- A required step is skipped.
- State becomes inconsistent.
- A later step depends on missing information.
- A worker crashes after completing a step but before recording completion.

**Typical response:** Enforce state invariants, limit execution, persist progress, and recover from durable state.

## 3.5 Business Logic Failures

Examples:

- Agent attempts to book an unavailable flight.
- A payment exceeds an approved amount.
- An agent sends an email to the wrong recipient.
- A workflow proceeds without required authorization.

These are not necessarily infrastructure errors.

**Typical response:** Validate business rules and enforce authorization outside the model's free-form reasoning.

---

# 4. Reliability Principles 🧠

## 4.1 Fail Safely

When the system cannot complete an operation safely, it should stop or move to a safe alternative.

For example, if a payment result is unknown, do not immediately submit another payment.

## 4.2 Bound Every Operation

Set reasonable limits for:

- Request duration.
- Retry attempts.
- Agent steps.
- Tool calls.
- Total execution time.
- Token usage.
- Financial spending.
- Parallel tasks.

Without limits, an agent may consume resources indefinitely.

## 4.3 Preserve Successful Work

If step four fails after steps one through three succeed, avoid repeating successful operations unnecessarily.

Persist completed results and resume from the appropriate point.

## 4.4 Make Recovery Explicit

Define recovery behavior for each important failure:

| Failure | Recovery |
|---|---|
| Temporary network error | Retry with backoff |
| Invalid arguments | Correct or reject the request |
| Rate limit | Wait and retry within limits |
| Tool unavailable | Use a permitted fallback |
| Invalid model output | Validate and attempt controlled repair |
| Unknown payment status | Reconcile before retrying |
| Worker crash | Resume from a checkpoint |
| Safety violation | Stop or escalate |
| Retry limit reached | Fail clearly and record the reason |

## 4.5 Never Confuse Recovery With Success

A retry completing successfully does not automatically mean the final task succeeded.

The final result must still pass validation.

For example, a search tool can return a successful HTTP response containing irrelevant results. Technical success and task success are different.

---

# 5. Error Handling 🧰

Error handling means detecting, classifying, and responding to failures deliberately.

## 5.1 Use Specific Exceptions

Avoid catching every error and silently continuing.

Bad:

```python
try:
    result = perform_operation()
except Exception:
    pass
```

This hides failures and may allow invalid state to propagate.

Better:

```python
class RetryableError(Exception):
    """An operation may succeed if attempted again."""


class PermanentError(Exception):
    """Repeating the operation without changing something will not help."""


class OperationStatusUnknown(Exception):
    """The operation may have succeeded, but its result is unknown."""
```

These custom exceptions help separate recovery strategies.

## 5.2 Classify Errors Before Retrying

| Error | Usually Retryable? | Consideration |
|---|---|---|
| Temporary network interruption | Yes | Use bounded backoff |
| HTTP 429 rate limit | Often | Respect provider retry guidance |
| HTTP 500 or 503 | Often | Apply limits and backoff |
| HTTP 400 invalid request | No | Fix the request first |
| Authentication failure | No | Repair credentials or permissions |
| Invalid tool arguments | No | Validate or correct arguments |
| Payment timeout | Not blindly | Check the transaction status |
| Permission denied | No | Require appropriate authorization |

Classification depends on the service and operation. A particular HTTP status alone does not always determine whether a retry is safe.

## 5.3 Separate Error Types

A useful design distinguishes:

- **Transient errors:** May disappear without changing the request.
- **Permanent errors:** Require a changed request, configuration, or permission.
- **Ambiguous outcomes:** The operation may already have succeeded.
- **Business rule violations:** The operation is not allowed.
- **Validation failures:** The result does not satisfy required constraints.

This classification prevents dangerous automatic retries.

---

# 6. Retries and Backoff 🔁

A retry repeats an operation after a failure.

Retries help when failures are temporary, but they can increase load and create duplicate side effects if used incorrectly.

## 6.1 Basic Retry

```python
import time


def fetch_data():
    return {"status": "success", "items": [1, 2, 3]}


def retry_operation(operation, max_attempts=3):
    for attempt in range(max_attempts):
        try:
            return operation()
        except RetryableError:
            if attempt == max_attempts - 1:
                raise

            time.sleep(1)
```

This example illustrates the concept. It uses a fixed delay and should not be used as a complete production retry policy.

## 6.2 Exponential Backoff

Exponential backoff increases the delay between failed attempts.

A common formula is:

`delay = min(max_delay, base_delay × 2^attempt)`

For example, with a one-second base delay:

| Retry | Approximate Delay |
|---|---:|
| First | 1 second |
| Second | 2 seconds |
| Third | 4 seconds |
| Fourth | 8 seconds |

The maximum delay prevents the waiting period from growing indefinitely.

## 6.3 Add Jitter

If many workers fail at the same time, they may all retry simultaneously.

**Jitter** introduces randomness into retry delays to spread requests over time.

One common strategy is full jitter:

`delay = random(0, min(max_delay, base_delay × 2^attempt)`

This helps reduce synchronized retry spikes.

## 6.4 Production-Oriented Retry Helper

```python
import random
import time


class RetryableError(Exception):
    pass


class PermanentError(Exception):
    pass


def retry_with_backoff(
    operation,
    max_attempts=4,
    base_delay=0.5,
    max_delay=8.0,
):
    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1")

    for attempt in range(max_attempts):
        try:
            return operation()

        except PermanentError:
            raise

        except RetryableError:
            if attempt == max_attempts - 1:
                raise

            upper_bound = min(
                max_delay,
                base_delay * (2 ** attempt),
            )

            delay = random.uniform(0, upper_bound)
            time.sleep(delay)

    raise RuntimeError("Unexpected retry termination")
```

Usage:

```python
def call_service():
    # Replace with a real operation.
    return {"status": "success"}


result = retry_with_backoff(call_service)
print(result)
```

The example runs without external dependencies.

A real client should classify its provider's exceptions into retryable and permanent categories.

## 6.5 Respect Retry Limits

A retry policy should specify:

- Maximum attempts.
- Maximum delay.
- Overall deadline.
- Retryable error types.
- Whether the operation is safe to repeat.
- Provider-specific rate limits.
- Whether a failed attempt may have produced side effects.

## 6.6 Avoid Retry Multiplication

Imagine three layers each retry an operation three times:

- Agent retries three times.
- Tool wrapper retries three times.
- HTTP client retries three times.

The downstream service might receive up to 27 attempts.

Coordinate retry policies across layers. Prefer one clearly defined retry owner for each operation, with lower-level retries configured deliberately.

**Rule:** Retry transient failures, not every failure.

---

# 7. Timeouts and Cancellation ⏱️

A timeout limits how long an operation may take.

Without timeouts, an agent can wait indefinitely for a model, API, or worker.

## 7.1 Types of Timeouts

| Timeout | Purpose |
|---|---|
| Connection timeout | Limits time spent establishing a connection |
| Read timeout | Limits waiting for response data |
| Tool timeout | Limits an individual tool execution |
| Model timeout | Limits an LLM request |
| Step timeout | Limits a workflow step |
| Workflow deadline | Limits the overall operation |

A production system may need several of these simultaneously.

## 7.2 Example With a Thread

```python
from concurrent.futures import (
    ThreadPoolExecutor,
    TimeoutError,
)


def slow_operation():
    import time
    time.sleep(5)
    return "completed"


with ThreadPoolExecutor(max_workers=1) as executor:
    future = executor.submit(slow_operation)

    try:
        result = future.result(timeout=2)
        print(result)

    except TimeoutError:
        print("Operation exceeded its waiting deadline")
```

**Important:** This example limits how long the caller waits. A thread that is already running may continue executing. A timeout does not automatically cancel external side effects.

Use native request timeouts, cancellation-aware async operations, or isolated workers when stronger cancellation guarantees are needed.

## 7.3 Use an Overall Deadline

Suppose an agent has five steps. Giving every step a 30-second timeout can produce a total runtime much longer than 30 seconds.

An overall deadline provides a single execution budget.

Conceptually:

```python
deadline = start_time + total_budget

for step in workflow:
    remaining = deadline - current_time()

    if remaining <= 0:
        raise TimeoutError("Workflow deadline exceeded")

    run_step(step, timeout=remaining)
```

Real implementations should use a monotonic clock and propagate deadlines into supported clients.

## 7.4 Cancellation Must Be Safe

When a workflow is cancelled:

- Stop launching unnecessary work.
- Cancel pending operations when supported.
- Preserve completed results.
- Record the cancellation reason.
- Avoid assuming an external side effect was undone.
- Release resources.
- Reconcile operations whose outcomes are unknown.

---

# 8. Idempotency and Duplicate Prevention 🔐

**Idempotency** means repeating the same operation does not create additional unintended effects.

For example, setting an order's status to `confirmed` repeatedly can be idempotent.

Creating a new order every time a request arrives is generally not idempotent.

## 8.1 Why Agents Need Idempotency

Consider this sequence:

1. An agent submits a payment.
2. The payment provider processes it.
3. The response is lost.
4. The agent interprets the timeout as failure.
5. The agent submits the payment again.

Without duplicate protection, the customer may be charged twice.

## 8.2 Idempotency Keys

A client can provide a stable key for a logical operation.

```python
import uuid


operation_id = str(uuid.uuid4())

request = {
    "operation_id": operation_id,
    "amount": 100,
    "currency": "USD",
}
```

The key must remain the same when retrying the same logical operation.

Generating a new key for every retry defeats the purpose.

The receiving service must support idempotency or implement equivalent duplicate detection.

## 8.3 A Simple In-Memory Example

```python
class IdempotentExecutor:
    def __init__(self):
        self.results = {}

    def execute(self, key, operation):
        if key in self.results:
            return self.results[key]

        result = operation()
        self.results[key] = result

        return result
```

Usage:

```python
executor = IdempotentExecutor()

def create_report():
    return {"report_id": "report-123"}


first = executor.execute("job-001", create_report)
second = executor.execute("job-001", create_report)

assert first == second
```

This example demonstrates the idea but is not production-safe.

Problems include:

- State disappears when the process restarts.
- Concurrent requests may execute twice.
- Failed operations may leave ambiguous outcomes.
- Memory is not shared across workers.

A production implementation typically needs persistent storage, atomic uniqueness constraints, concurrency control, and a defined policy for in-progress operations.

## 8.4 Idempotency in Agent Workflows

Use stable operation identifiers for important side effects:

- Payment requests.
- Order creation.
- Ticket creation.
- Email delivery requests.
- Document generation.
- Booking requests.

Where supported, use the external provider's idempotency mechanism.

For operations without provider support, use durable operation records and reconciliation. Do not assume that a local database record alone guarantees exactly-once external execution.

---

# 9. Circuit Breakers ⚡

A circuit breaker temporarily stops requests to a dependency that is repeatedly failing.

It prevents a failing service from consuming unlimited resources or overwhelming downstream infrastructure.

## 9.1 Circuit Breaker States

| State | Behavior |
|---|---|
| Closed | Requests are allowed; failures are counted |
| Open | Requests are blocked temporarily |
| Half-open | A limited number of test requests are allowed |

Typical behavior:

1. The service begins in the **closed** state.
2. Failures exceed a configured threshold.
3. The circuit opens.
4. Requests fail quickly or use a fallback.
5. After a cooldown, the circuit becomes half-open.
6. Successful test requests close the circuit.
7. Continued failures reopen it.

## 9.2 Example Scenario

An agent depends on a weather API.

The API begins returning repeated server errors.

Without a circuit breaker, every agent execution may continue calling the failing service.

With a circuit breaker:

- Repeated failures open the circuit.
- Further requests are temporarily rejected.
- The agent uses a permitted cached result or reports that live weather data is unavailable.
- A later test request checks whether the API has recovered.

## 9.3 Simplified Implementation

```python
import time


class CircuitBreaker:
    def __init__(self, threshold=3, recovery_timeout=10):
        self.threshold = threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.opened_at = None

    def call(self, operation):
        if self.opened_at is not None:
            elapsed = time.monotonic() - self.opened_at

            if elapsed < self.recovery_timeout:
                raise RuntimeError("Circuit is open")

            # Allow a recovery attempt.
            self.opened_at = None

        try:
            result = operation()
            self.failures = 0
            return result

        except Exception:
            self.failures += 1

            if self.failures >= self.threshold:
                self.opened_at = time.monotonic()

            raise
```

This simplified implementation illustrates the basic concept. A production circuit breaker needs careful handling of concurrent requests, half-open probes, failure classification, metrics, and state management.

Do not count every error as a dependency failure. For example, an invalid user request should not necessarily open a circuit.

---

# 10. Fallbacks and Graceful Degradation 🪂

A fallback provides an alternative when the preferred operation fails.

Graceful degradation means the system provides reduced functionality instead of failing completely.

## 10.1 Common Fallbacks

| Primary Operation | Possible Fallback |
|---|---|
| Live API request | Recent cached result, if acceptable |
| Preferred LLM provider | Approved secondary provider |
| Advanced model | Smaller model for supported tasks |
| Vector retrieval | Keyword search |
| Automated decision | Human review |
| Tool unavailable | Explain the limitation |
| Optional enrichment | Return the core result without enrichment |

A fallback must preserve correctness and safety.

For example, an agent must not invent live stock prices because its market-data provider is unavailable.

## 10.2 Example

```python
def get_weather(primary_provider, fallback_provider):
    try:
        return primary_provider()
    except RetryableError:
        return fallback_provider()
```

In a real application, ensure that the fallback:

- Is permitted for the task.
- Uses compatible data.
- Has its own timeout.
- Does not repeat dangerous side effects.
- Clearly indicates stale or incomplete information.

## 10.3 Degradation Levels

A system can define multiple levels:

1. **Full service:** All features work.
2. **Reduced service:** Optional enrichment is unavailable.
3. **Read-only mode:** Information can be retrieved, but changes are disabled.
4. **Human-assisted mode:** Risky operations require review.
5. **Safe shutdown:** The task cannot continue safely.

This is especially useful for agents that interact with payments, customer accounts, infrastructure, or other consequential systems.

---

# 11. Checkpoints and State Recovery 💾

A checkpoint is a durable record of workflow progress.

It allows a workflow to resume without necessarily repeating every completed step.

## 11.1 Example Workflow

Suppose an agent performs:

1. Search documents.
2. Extract relevant information.
3. Generate a draft.
4. Validate the draft.
5. Publish the result.

If the process crashes after step three, a checkpoint can preserve the search results, extracted information, and draft.

After recovery, the system can continue from the appropriate point.

## 11.2 What Should a Checkpoint Contain?

A checkpoint may contain:

- Workflow or run ID.
- Current step.
- Workflow state.
- Completed step results.
- Pending operations.
- Retry counts.
- Approval status.
- Version information.
- Creation timestamp.
- Relevant idempotency keys.

Do not blindly store everything.

Avoid persisting unnecessary secrets, raw credentials, sensitive personal information, or unrestricted conversation histories.

## 11.3 Simple Checkpoint Example

```python
import json
from pathlib import Path


CHECKPOINT_FILE = Path("checkpoint.json")


def save_checkpoint(state):
    CHECKPOINT_FILE.write_text(
        json.dumps(state, indent=2),
        encoding="utf-8",
    )


def load_checkpoint():
    if not CHECKPOINT_FILE.exists():
        return None

    return json.loads(
        CHECKPOINT_FILE.read_text(encoding="utf-8")
    )


state = {
    "run_id": "run-001",
    "current_step": "validate",
    "completed": {
        "search": True,
        "draft": True,
    },
    "draft": "Example report",
}

save_checkpoint(state)

restored = load_checkpoint()
print(restored["current_step"])
```

This example is suitable for learning but not sufficient for concurrent production workflows.

A production checkpoint store should address atomic writes, concurrent updates, access control, schema versions, corruption, and recovery semantics.

## 11.4 State Must Be Consistent

Suppose the system records that a payment succeeded before the provider actually confirms it.

The checkpoint now contains false information.

Persist state transitions only when their meaning is clear.

For uncertain external operations, store a status such as `pending_reconciliation` rather than incorrectly marking the operation as completed or failed.

---

# 12. Durable Execution 🏗️

Durable execution allows a long-running workflow to survive process restarts and continue from recorded progress.

It is especially valuable when workflows include:

- Long-running model tasks.
- Human approval.
- External API calls.
- Delayed events.
- Multiple agents.
- Scheduled actions.
- Expensive computation.

## 12.1 Ordinary Execution vs. Durable Execution

| Ordinary Execution | Durable Execution |
|---|---|
| State may exist only in memory | Important state is persisted |
| Process crash may lose progress | Workflow can recover from stored state |
| Delays may block a worker | Workflow can suspend and resume |
| Recovery often restarts the task | Recovery can continue from durable progress |
| Side effects require extra care | Side effects still require extra care |

**Important:** Durable execution does not automatically make external side effects exactly-once.

The workflow engine may resume a step whose external effect already occurred. Idempotency and reconciliation remain essential.

## 12.2 Durable Workflow Lifecycle

A typical lifecycle is:

1. Create a workflow instance.
2. Persist its initial state.
3. Execute a step.
4. Record the step outcome.
5. Persist the updated state.
6. Suspend or continue.
7. Recover after a crash if necessary.
8. Resume eligible work.
9. Complete, fail, or request intervention.

## 12.3 Choosing an Implementation

Depending on your requirements, durable workflows can be implemented using:

- A database-backed state machine.
- A workflow orchestration framework.
- A queue and worker system.
- A graph-based agent framework with persistent checkpoints.
- A dedicated durable execution platform.

Choose based on workflow duration, consistency needs, operational complexity, and recovery guarantees.

---

# 13. Transactions and Compensation 🔄

Distributed agent workflows often interact with systems that cannot participate in a single database transaction.

For example:

1. Reserve a flight.
2. Reserve a hotel.
3. Charge a payment method.
4. Send a confirmation.

If the hotel reservation fails after the flight is reserved, the workflow may need to release the flight reservation.

## 13.1 Database Transactions

A database transaction groups supported database operations into a unit with defined atomicity and consistency guarantees.

Example:

```python
def create_order(connection, order):
    try:
        connection.execute("BEGIN")

        connection.execute(
            "INSERT INTO orders (id, status) VALUES (?, ?)",
            (order["id"], "created"),
        )

        connection.execute(
            "INSERT INTO order_items (order_id, item) VALUES (?, ?)",
            (order["id"], order["item"]),
        )

        connection.commit()

    except Exception:
        connection.rollback()
        raise
```

This illustrates the transaction pattern. Actual SQL syntax and transaction behavior depend on the database driver.

Transactions do not automatically cover unrelated external services.

## 13.2 Saga Pattern

A **saga** coordinates a sequence of distributed operations. Each operation may have a corresponding compensating action.

Example:

| Forward Action | Possible Compensation |
|---|---|
| Reserve flight | Cancel reservation |
| Reserve hotel | Cancel hotel reservation |
| Create order | Mark order cancelled |
| Allocate resource | Release resource |

Compensation is not always a perfect reversal.

For example, a sent email cannot be unsent, and a completed payment refund may take time.

## 13.3 Saga Example

```python
def execute_booking():
    completed = []

    try:
        flight = reserve_flight()
        completed.append(("flight", flight))

        hotel = reserve_hotel()
        completed.append(("hotel", hotel))

        payment = charge_payment()
        completed.append(("payment", payment))

        return {
            "status": "completed",
            "flight": flight,
            "hotel": hotel,
            "payment": payment,
        }

    except Exception:
        compensate(completed)
        raise
```

The `compensate()` function must implement explicit, operation-specific recovery logic.

It should not blindly reverse operations. For example, refunding a payment may require checking whether the charge actually succeeded.

A robust saga records each forward action and compensation durably so that recovery can continue if the worker crashes during compensation.

---

# 14. Handling Partial Failures 🧩

A partial failure occurs when some operations succeed while others fail.

This is common in multi-agent and distributed workflows.

## 14.1 Example

A research agent launches three tasks:

- Task A retrieves documentation.
- Task B searches academic papers.
- Task C retrieves company information.

Task B fails while A and C succeed.

The workflow must decide whether to:

- Retry B.
- Use an alternative source.
- Continue with incomplete results.
- Ask a human for help.
- Stop because B is mandatory.

## 14.2 Define Required and Optional Steps

```python
required_steps = [
    "identity_verification",
    "permission_check",
]

optional_steps = [
    "additional_enrichment",
    "related_recommendations",
]
```

A required step must succeed before the workflow proceeds.

An optional step may be skipped when its failure does not compromise correctness or safety.

## 14.3 Use Explicit Workflow Statuses

Useful statuses include:

- `pending`
- `running`
- `waiting_for_approval`
- `retrying`
- `completed`
- `partially_completed`
- `failed`
- `cancelled`
- `pending_reconciliation`

Avoid representing every state using only a Boolean such as `success`.

## 14.4 Recovery Decision Table

| Situation | Action |
|---|---|
| Optional enrichment fails | Continue with a clear limitation |
| Required validation fails | Stop |
| Read-only tool times out | Retry within limits |
| Side effect has an unknown result | Reconcile |
| Human approval is pending | Suspend and wait |
| Retry budget is exhausted | Fail or escalate |
| Checkpoint is incompatible | Migrate or stop safely |

---

# 15. Reliable Agent Architecture 🏛️

A production-oriented agent should separate decision-making from execution and recovery.

## 15.1 Recommended Architecture

```text
User Request
     |
     v
Input Validation
     |
     v
Agent Orchestrator
     |
     v
State Machine / Workflow
     |
     +----------------------+
     |                      |
     v                      v
Model Adapter          Tool Adapter
     |                      |
     v                      v
Output Validation      Timeout + Retry
     |                      |
     +----------+-----------+
                |
                v
       Business Rule Checks
                |
                v
       Authorization / Approval
                |
                v
        External Side Effect
                |
                v
       Result Reconciliation
                |
                v
      Checkpoint + Audit Event
                |
                v
        Final Result / Error
```

## 15.2 Responsibilities

| Component | Responsibility |
|---|---|
| Model adapter | Communicate with the model provider |
| Tool adapter | Validate and execute tool calls |
| Retry layer | Retry eligible transient failures |
| Timeout layer | Bound waiting and execution |
| Circuit breaker | Protect failing dependencies |
| State manager | Persist workflow progress |
| Idempotency layer | Prevent duplicate logical operations |
| Policy layer | Enforce business rules and permissions |
| Recovery manager | Resume, compensate, or escalate |
| Observability layer | Record metrics, logs, and traces |

These responsibilities may be implemented in separate modules or combined within a framework.

The important point is that they remain explicit and testable.

## 15.3 Do Not Let the LLM Control Reliability Guarantees

The model may suggest a tool call, but deterministic application code should enforce:

- Retry limits.
- Timeouts.
- Authorization.
- Idempotency.
- Financial limits.
- State transitions.
- Required approvals.
- Cancellation rules.

An LLM's statement that an operation is safe does not make the operation safe.

---

# 16. Python Implementation 🐍

This section builds a small recovery layer using standard Python.

The example demonstrates:

- Retryable and permanent errors.
- Bounded retries.
- Backoff.
- Structured results.
- A simple recovery workflow.

It does not require an API key or an external service.

## 16.1 Project Structure

```text
reliable-agent/
├── main.py
├── reliability.py
├── workflow.py
└── tests/
    └── test_reliability.py
```

## 16.2 Create `reliability.py`

```python
import random
import time


class RetryableError(Exception):
    pass


class PermanentError(Exception):
    pass


class RetryExhaustedError(Exception):
    pass


def execute_with_retry(
    operation,
    max_attempts=3,
    base_delay=0.1,
    max_delay=2.0,
    sleep=time.sleep,
    random_value=random.random,
):
    if max_attempts < 1:
        raise ValueError("max_attempts must be at least 1")

    for attempt in range(max_attempts):
        try:
            return operation()

        except PermanentError:
            raise

        except RetryableError as exc:
            final_attempt = attempt == max_attempts - 1

            if final_attempt:
                raise RetryExhaustedError(
                    "Retry limit reached"
                ) from exc

            upper_bound = min(
                max_delay,
                base_delay * (2 ** attempt),
            )

            delay = random_value() * upper_bound
            sleep(delay)

    raise RuntimeError("Unexpected execution state")
```

The injected `sleep` and random-number function make the behavior easier to test.

For production use, add an overall deadline and coordinate this retry policy with HTTP client retries.

## 16.3 Create `workflow.py`

```python
from reliability import execute_with_retry


def run_workflow(search_tool, analysis_tool):
    state = {
        "status": "running",
        "completed_steps": [],
        "results": {},
    }

    try:
        search_result = execute_with_retry(search_tool)

        state["results"]["search"] = search_result
        state["completed_steps"].append("search")

        analysis_result = execute_with_retry(
            lambda: analysis_tool(search_result)
        )

        state["results"]["analysis"] = analysis_result
        state["completed_steps"].append("analysis")

        state["status"] = "completed"

    except Exception as exc:
        state["status"] = "failed"
        state["error"] = {
            "type": type(exc).__name__,
            "message": str(exc),
        }

    return state
```

The workflow preserves successful step results in its returned state.

For a real application, persist that state durably and avoid storing sensitive exception messages without appropriate redaction.

## 16.4 Create `main.py`

```python
from reliability import RetryableError
from workflow import run_workflow


attempts = {"count": 0}


def search_tool():
    attempts["count"] += 1

    if attempts["count"] < 3:
        raise RetryableError("Temporary search failure")

    return ["document A", "document B"]


def analysis_tool(documents):
    return {
        "document_count": len(documents),
        "summary": "Two documents were retrieved.",
    }


result = run_workflow(
    search_tool=search_tool,
    analysis_tool=analysis_tool,
)

print(result)
```

Expected behavior:

1. The search tool fails temporarily.
2. The retry layer waits briefly and retries.
3. The search eventually succeeds.
4. The analysis step processes the retrieved documents.
5. The workflow returns a completed state.

Run:

```bash
python main.py
```

## 16.5 Important Limitations

This implementation is intentionally small.

It does not yet provide:

- Durable checkpoints.
- Distributed locking.
- Persistent idempotency keys.
- Circuit breaker integration.
- Native cancellation.
- Distributed tracing.
- Recovery after process crashes.
- Compensation for external side effects.

These should be added according to the application's requirements rather than assumed to exist.

---

# 17. Testing Reliability 🧪

A workflow that succeeds under normal conditions is not necessarily reliable.

Reliability testing deliberately introduces failures and verifies recovery behavior.

## 17.1 Test Important Scenarios

| Test | Expected Behavior |
|---|---|
| First attempt fails, second succeeds | Retry succeeds |
| Every attempt fails | Retry limit is enforced |
| Permanent error occurs | No unnecessary retries |
| Tool times out | Execution is bounded |
| Process restarts | Workflow resumes from durable state |
| Same idempotency key is reused | Duplicate effect is prevented |
| Dependency repeatedly fails | Circuit breaker opens |
| Optional step fails | Core workflow continues |
| Required validation fails | Workflow stops |
| External result is ambiguous | Operation is reconciled |
| Compensation fails | Failure is recorded and recovery continues safely |

## 17.2 Unit Test Example

Create `tests/test_reliability.py`:

```python
import pytest

from reliability import (
    PermanentError,
    RetryableError,
    RetryExhaustedError,
    execute_with_retry,
)


def test_retry_succeeds():
    attempts = {"count": 0}

    def operation():
        attempts["count"] += 1

        if attempts["count"] < 3:
            raise RetryableError("Temporary failure")

        return "success"

    result = execute_with_retry(
        operation,
        max_attempts=3,
        sleep=lambda _: None,
        random_value=lambda: 0,
    )

    assert result == "success"
    assert attempts["count"] == 3


def test_permanent_error_is_not_retried():
    attempts = {"count": 0}

    def operation():
        attempts["count"] += 1
        raise PermanentError("Invalid request")

    with pytest.raises(PermanentError):
        execute_with_retry(
            operation,
            max_attempts=3,
            sleep=lambda _: None,
        )

    assert attempts["count"] == 1


def test_retry_exhaustion():
    attempts = {"count": 0}

    def operation():
        attempts["count"] += 1
        raise RetryableError("Temporary failure")

    with pytest.raises(RetryExhaustedError):
        execute_with_retry(
            operation,
            max_attempts=2,
            sleep=lambda _: None,
            random_value=lambda: 0,
        )

    assert attempts["count"] == 2
```

Install the testing dependency:

```bash
pip install pytest
```

Run the tests:

```bash
pytest -q
```

## 17.3 Failure Injection

Failure injection deliberately creates controlled failures.

Examples:

- Simulate an API timeout.
- Return malformed model output.
- Fail a database connection.
- Kill a worker during a workflow.
- Make a tool fail after completing its external side effect.
- Interrupt a process between an operation and checkpoint persistence.

The last two scenarios are especially important because they expose duplicate-operation and inconsistent-state bugs.

## 17.4 Recovery Testing

Do not test only whether the exception is caught.

Verify that:

1. The correct operation is retried.
2. The retry limit is respected.
3. Successful previous steps are preserved.
4. Duplicate side effects do not occur.
5. State remains valid.
6. Recovery is observable.
7. The final status accurately reflects what happened.

---

# 18. Mini Project 🚀

## Build a Reliable Agent Execution Engine

**Goal:** Build a small agent workflow that can handle temporary failures, preserve progress, and produce clear recovery results.

### Requirements

Your system must:

1. Accept a task.
2. Validate the task.
3. Call a simulated search tool.
4. Retry temporary search failures.
5. Apply a maximum attempt count.
6. Save workflow progress.
7. Avoid repeating completed steps unnecessarily.
8. Handle permanent failures.
9. Return explicit workflow statuses.
10. Record recovery events.

### Suggested Structure

```text
reliable-agent/
├── main.py
├── reliability.py
├── workflow.py
├── checkpoint.py
├── events.py
├── tests/
│   ├── test_retry.py
│   ├── test_checkpoint.py
│   └── test_recovery.py
└── README.md
```

### Implementation Plan

**Step 1 — Define the state**

```python
state = {
    "run_id": "run-001",
    "status": "pending",
    "current_step": None,
    "completed_steps": [],
    "results": {},
    "attempts": {},
}
```

**Step 2 — Implement error classification**

Create separate exceptions for retryable failures, permanent failures, and ambiguous operation outcomes.

**Step 3 — Add retries**

Implement bounded exponential backoff with jitter.

**Step 4 — Add checkpoints**

Persist progress after important completed steps.

**Step 5 — Add recovery**

Load the saved state and resume eligible work.

**Step 6 — Add idempotency**

Use stable operation identifiers for side effects.

**Step 7 — Add structured events**

Record events such as:

```json
{
  "run_id": "run-001",
  "event": "retry_scheduled",
  "step": "search",
  "attempt": 2,
  "error_type": "RetryableError"
}
```

**Step 8 — Test failures**

Simulate temporary errors, permanent errors, and process interruption.

### Acceptance Criteria

- Temporary failures can recover.
- Permanent failures are not blindly retried.
- Retry limits are enforced.
- Completed steps are preserved.
- Recovery state is validated.
- Duplicate side effects are prevented where supported.
- Ambiguous outcomes are reconciled.
- Workflow status is explicit.
- Tests verify recovery behavior.

### Stretch Goals

- Add a circuit breaker.
- Add an overall workflow deadline.
- Add a fallback provider.
- Add durable compensation for a multi-step operation.
- Expose reliability metrics.
- Run the workflow through a persistent queue.

---

# 19. Best Practices ✅

1. **Use bounded retries.** Never retry indefinitely.
2. **Classify errors.** Permanent failures need a different response from temporary failures.
3. **Add backoff and jitter.** Avoid synchronized retry storms.
4. **Set deadlines.** Bound individual operations and total workflow duration.
5. **Protect side effects.** Use idempotency keys and reconciliation.
6. **Persist important state.** Do not rely exclusively on process memory.
7. **Validate restored state.** A checkpoint may be outdated or incompatible.
8. **Use circuit breakers selectively.** Protect dependencies that repeatedly fail.
9. **Design safe fallbacks.** Never replace missing facts with invented information.
10. **Distinguish unknown from failed.** A timeout does not prove that an external operation failed.
11. **Make compensation explicit.** Not every side effect can be reversed.
12. **Test process crashes.** Recovery should work beyond ordinary exception handling.
13. **Coordinate retries.** Avoid multiplying retries across layers.
14. **Enforce limits outside the LLM.** Models should not control their own reliability guarantees.
15. **Record recovery events.** Use the observability practices from Module 11.
16. **Escalate when necessary.** Some failures require human intervention.
17. **Keep state transitions explicit.** Avoid ambiguous Boolean-only workflow status.
18. **Measure recovery quality.** Track retry rates, recovery rates, duplicate operations, and failure categories.

---

# 20. Common Mistakes ❌

| Mistake | Why It Is Dangerous | Better Approach |
|---|---|---|
| Retrying every exception | Repeats permanent failures | Classify errors |
| Infinite retries | Wastes resources | Enforce limits |
| Fixed aggressive retry intervals | Can overload a service | Use backoff and jitter |
| Retrying payments blindly | Can duplicate charges | Use idempotency and reconciliation |
| Treating timeouts as cancellation | Work may continue in the background | Use supported cancellation mechanisms |
| Saving checkpoints only at startup | Completed work can be lost | Persist meaningful progress |
| Assuming checkpoints guarantee exactly-once execution | External side effects may repeat | Combine durable state with idempotency |
| Ignoring partial failures | Produces incomplete or inconsistent results | Track step-level outcomes |
| Catching errors and returning success | Hides failures | Return truthful workflow statuses |
| Allowing an LLM to bypass policies | Creates unsafe execution paths | Enforce policies in application code |
| Compensating without checking outcomes | Can cause additional damage | Reconcile before compensating |
| Testing only successful runs | Misses recovery bugs | Use failure injection |

---

# 21. Exercises 📝

## Beginner

1. Explain reliability in your own words.
2. What is the difference between a transient and permanent error?
3. Why should retry attempts be limited?
4. What is exponential backoff?
5. Why are timeouts important?
6. What does idempotency mean?

## Intermediate

7. Implement a retry helper that retries only `RetryableError`.
8. Add exponential backoff and jitter.
9. Write a test verifying that permanent errors are not retried.
10. Design a checkpoint structure for a three-step research agent.
11. Explain why a timeout does not prove that an external operation failed.
12. Design a fallback for an unavailable document search service.

## Advanced

13. Design a circuit breaker for an unreliable model provider.
14. Explain how idempotency prevents duplicate payment operations.
15. Design recovery for a workflow that crashes after an external operation succeeds but before its checkpoint is saved.
16. Implement a saga with two forward operations and corresponding compensations.
17. Design a recovery strategy for a multi-agent workflow where one worker fails.
18. Explain how durable execution differs from ordinary in-memory execution.
19. Create a failure-injection test suite for an agent that modifies customer records.
20. Design a workflow that safely resumes after human approval.

---

# 22. Interview Questions 🎤

### Q1. What is reliability in agentic AI?

Reliability is the ability of an agentic system to execute tasks consistently, handle failures, preserve valid state, and recover safely when possible.

### Q2. What is the difference between retries and fallbacks?

Retries repeat the same operation after an eligible failure. Fallbacks use an alternative method, provider, or reduced-functionality path.

### Q3. Why use exponential backoff?

It increases delays between retries, reducing unnecessary pressure on an overloaded or failing service.

### Q4. What is jitter?

Jitter adds randomness to retry delays so many workers do not retry simultaneously.

### Q5. Why should permanent errors not be retried?

Repeating an unchanged invalid request usually cannot fix it and wastes resources.

### Q6. What is idempotency?

Idempotency ensures that repeating the same logical operation does not create additional unintended effects.

### Q7. Why is idempotency important for payments?

A payment may succeed even if its response is lost. Retrying without duplicate protection can cause multiple charges.

### Q8. What is a circuit breaker?

A pattern that temporarily blocks requests to a repeatedly failing dependency and later allows controlled recovery checks.

### Q9. What is a checkpoint?

A persisted snapshot of relevant workflow state that supports recovery or resumption.

### Q10. What is durable execution?

An execution model in which workflow progress is persisted so long-running work can survive process failures and resume.

### Q11. Does durable execution guarantee exactly-once external side effects?

No. External operations may succeed before the workflow records their results. Idempotency and reconciliation are still necessary.

### Q12. What is graceful degradation?

Continuing to provide safe, reduced functionality when optional dependencies or features are unavailable.

### Q13. What is the saga pattern?

A method for coordinating distributed operations through a sequence of steps and compensating actions.

### Q14. Why can a timeout create an ambiguous result?

The remote service may complete the operation even though the caller does not receive its response.

### Q15. How should an agent handle a partial failure?

Track each step's status, preserve successful work, retry eligible failures, use permitted fallbacks, and stop or escalate when required.

### Q16. Why should reliability policies be implemented outside the LLM?

Application code can enforce deterministic limits, permissions, state transitions, and side-effect protections independently of model-generated decisions.

### Q17. How do you test a reliable agent?

Use unit and integration tests, simulate transient failures, inject process crashes, verify idempotency, and test restoration from checkpoints.

### Q18. What is the difference between availability and reliability?

Availability concerns whether a system is accessible. Reliability also concerns whether it performs its intended work correctly and consistently.

---

# 23. Glossary 📖

| Term | Definition |
|---|---|
| Reliability | Consistent and correct system behavior |
| Resilience | Ability to withstand and recover from failures |
| Fault tolerance | Ability to continue operating despite certain faults |
| Transient error | A failure that may disappear without changing the request |
| Permanent error | A failure that requires a change before retrying can help |
| Retry | Repeating an operation after a failure |
| Exponential backoff | Increasing retry delays exponentially |
| Jitter | Random variation in retry delays |
| Timeout | A limit on waiting or execution duration |
| Cancellation | Request to stop work when supported |
| Idempotency | Protection against repeated logical operations causing duplicate effects |
| Idempotency key | Identifier used to recognize repeated requests for the same logical operation |
| Circuit breaker | Mechanism that blocks calls to a repeatedly failing dependency |
| Fallback | Alternative execution path |
| Graceful degradation | Safe operation with reduced functionality |
| Checkpoint | Persisted workflow progress |
| Durable execution | Execution that can resume using persisted workflow state |
| Reconciliation | Determining the actual outcome of an uncertain operation |
| Compensation | An action that mitigates or counteracts an earlier operation |
| Saga | Distributed workflow coordinated through steps and compensations |
| Partial failure | A workflow in which some operations succeed and others fail |
| Failure injection | Deliberately introducing failures to test recovery |
| Recovery budget | Defined limits on resources or time spent attempting recovery |

---

# 24. Final Checklist ☑️

Before considering an agent workflow reliable, verify the following:

### Error Handling
- [ ] Errors are classified.
- [ ] Permanent failures are not blindly retried.
- [ ] Failures produce accurate workflow statuses.
- [ ] Sensitive information is not exposed in error messages.

### Retries and Timeouts
- [ ] Retry attempts are bounded.
- [ ] Backoff and jitter are configured where appropriate.
- [ ] Retry policies are coordinated across layers.
- [ ] Individual operations have suitable timeouts.
- [ ] The workflow has an overall deadline.

### State and Side Effects
- [ ] Important progress is persisted.
- [ ] Restored state is validated.
- [ ] Idempotency protects supported operations.
- [ ] Ambiguous outcomes are reconciled.
- [ ] Compensation actions are explicitly defined.

### Recovery
- [ ] Fallbacks preserve correctness.
- [ ] Required and optional steps are distinguished.
- [ ] Circuit breakers protect critical dependencies where appropriate.
- [ ] Process crashes have been tested.
- [ ] Human escalation is available for unresolved failures.

### Observability and Testing
- [ ] Retries and recovery actions are recorded.
- [ ] Failure categories can be measured.
- [ ] Recovery behavior has automated tests.
- [ ] Failure injection covers important edge cases.
- [ ] The system never reports success without sufficient evidence.

---

# 25. References 🔗

Use official documentation to explore implementation details.

- **Python Exceptions:** https://docs.python.org/3/tutorial/errors.html
- **Python `time` Module:** https://docs.python.org/3/library/time.html
- **Python `concurrent.futures`:** https://docs.python.org/3/library/concurrent.futures.html
- **Tenacity — Python Retry Library:** https://tenacity.readthedocs.io/
- **AWS Builders' Library — Timeouts, Retries, and Backoff:** https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
- **AWS Prescriptive Guidance — Saga Pattern:** https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga.html
- **Temporal Documentation — Durable Execution:** https://docs.temporal.io/
- **LangGraph Documentation — Persistence:** https://docs.langchain.com/oss/python/langgraph/persistence
- **OpenTelemetry Documentation:** https://opentelemetry.io/docs/

---

## ➡️ Next Module

**Module 13 — Scaling and Production Deployment**

You will learn about:

- Scaling agent workloads.
- Asynchronous execution and concurrency.
- Queues and background workers.
- Stateless services and shared state.
- Horizontal scaling.
- Resource and token budgets.
- Production deployment architecture.
- Configuration and secrets management.
- Deployment strategies and health checks.
- Capacity planning and production readiness.

**Goal:** Move from a reliable individual workflow to an agentic system that can operate efficiently at production scale.

</CodeBlock>