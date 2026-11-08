# 🧑‍⚖️ Module 08: Human-in-the-Loop and Approval

> **Track:** Agentic AI Engineering  
> **Module:** 08 — Human-in-the-Loop and Approval  
> **Folder:** `08-Human-in-the-Loop-and-Approval`  
> **Start Date:** October 27, 2026  
> **Target Completion:** October 28, 2026  
> **Difficulty:** Intermediate to Advanced  
> **Focus:** Human oversight, approval workflows, controlled execution, and safe agent autonomy.

---

## 📚 Table of Contents

1. [Module Overview](#1--module-overview)
2. [Learning Objectives](#2--learning-objectives)
3. [What Is Human-in-the-Loop?](#3--what-is-human-in-the-loop)
4. [Why Human Oversight Matters](#4--why-human-oversight-matters)
5. [Human-in-the-Loop vs Human-on-the-Loop](#5--human-in-the-loop-vs-human-on-the-loop)
6. [Levels of Agent Autonomy](#6--levels-of-agent-autonomy)
7. [Approval Workflow Architecture](#7--approval-workflow-architecture)
8. [Approval Gates and Checkpoints](#8--approval-gates-and-checkpoints)
9. [Designing Approval Policies](#9--designing-approval-policies)
10. [Interrupts and Pausable Workflows](#10--interrupts-and-pausable-workflows)
11. [State Persistence and Resume](#11--state-persistence-and-resume)
12. [Approval Requests and Data Models](#12--approval-requests-and-data-models)
13. [Approval Lifecycle](#13--approval-lifecycle)
14. [Implementing Approval in Python](#14--implementing-approval-in-python)
15. [Risk-Based Approval Decisions](#15--risk-based-approval-decisions)
16. [Tool Execution and Side Effects](#16--tool-execution-and-side-effects)
17. [Timeouts, Rejections, and Escalation](#17--timeouts-rejections-and-escalation)
18. [Approval Workflows with State Graphs](#18--approval-workflows-with-state-graphs)
19. [Human Feedback and Agent Learning](#19--human-feedback-and-agent-learning)
20. [Security and Authorization](#20--security-and-authorization)
21. [Audit Logs and Accountability](#21--audit-logs-and-accountability)
22. [Testing Human Approval Systems](#22--testing-human-approval-systems)
23. [Monitoring and Evaluation](#23--monitoring-and-evaluation)
24. [Common Mistakes](#24--common-mistakes)
25. [Production Best Practices](#25--production-best-practices)
26. [Practical Mini-Project](#26--practical-mini-project)
27. [Interview Questions and Answers](#27--interview-questions-and-answers)
28. [Glossary](#28--glossary)
29. [Completion Checklist](#29--completion-checklist)
30. [References](#30--references)
31. [Next Module](#31--next-module)

---

# 1. 🎯 Module Overview

Modern AI agents can plan tasks, use tools, communicate with other agents, access external systems, and perform multi-step operations.

However, not every action should happen automatically.

An agent might:
- Send an email to a customer.
- Delete an important file.
- Publish content publicly.
- Update a production database.
- Approve a financial transaction.
- Change a customer's account.
- Deploy an application.
- Execute a command on a server.
- Modify business records.
- Share confidential information.

Even when an agent produces a reasonable plan, its proposed action may be incorrect, incomplete, unauthorized, or too risky.

**Human-in-the-Loop (HITL)** introduces human judgment into an agent's execution process.

Instead of allowing an agent to perform every action independently, the system can pause, request approval, collect feedback, and continue only when the required conditions are satisfied.

For example:

```text
User requests a customer email
          |
          v
Agent drafts the email
          |
          v
System validates the draft
          |
          v
Human reviews the email
          |
          +------ Reject ------> Revise draft
          |
          +------ Approve -----> Send email
```

The central objective is to build agents that are useful and autonomous while remaining controllable, observable, and accountable.

## What this module covers

You will learn how to:

- Design human approval workflows.
- Decide which actions require human review.
- Pause and resume agent execution.
- Persist workflow state between approval steps.
- Handle approval, rejection, revision, timeout, and escalation.
- Implement approval systems using Python.
- Integrate approval gates into graph-based agents.
- Protect approval endpoints and execution tools.
- Record decisions in audit logs.
- Test dangerous and failure-prone scenarios.
- Build a practical approval-based AI agent.

## What this module does not repeat

The previous modules already covered multi-agent collaboration, agent communication protocols, and context engineering.

This module concentrates on **human control over agent decisions and actions**. The emphasis is on workflow boundaries, authorization, approval state, and safe continuation.

---

# 2. 🎓 Learning Objectives

By completing this module, you should be able to:

1. Explain Human-in-the-Loop and Human-on-the-Loop.
2. Distinguish autonomous execution from supervised execution.
3. Identify actions that require approval.
4. Design approval policies based on risk.
5. Build approval request and response models.
6. Implement approval, rejection, and revision flows.
7. Pause an agent without losing its execution state.
8. Resume a workflow after an authorized decision.
9. Handle timeouts and unavailable reviewers.
10. Prevent duplicate execution after approval.
11. Separate approval decisions from actual tool permissions.
12. Create auditable records of human decisions.
13. Test authorization and approval bypass attempts.
14. Evaluate the quality and efficiency of approval workflows.
15. Build a context-aware, human-supervised agent.

---

# 3. 🧠 What Is Human-in-the-Loop?

Human-in-the-Loop is a design approach in which a human participates in an AI system's decision or execution process.

The human might:
- Approve a proposed action.
- Reject an action.
- Edit generated content.
- Supply missing information.
- Resolve ambiguity.
- Correct an incorrect decision.
- Handle an exceptional situation.
- Confirm an irreversible operation.

The important point is that the human participates at a defined point in the workflow.

## 3.1 Basic example

Imagine an agent that creates and sends emails.

Without approval:

```python
def email_agent(customer, message):
    draft = generate_email(customer, message)
    send_email(customer["email"], draft)
    return "Email sent"
```

This function sends the generated email immediately.

If the model includes an incorrect price, private information, or an unintended promise, the email may already be delivered.

With approval:

```python
def email_agent(customer, message):
    draft = generate_email(customer, message)

    print("Draft for review:")
    print(draft)

    decision = input("Approve this email? (yes/no): ")

    if decision.strip().lower() != "yes":
        return "Email was not sent"

    send_email(customer["email"], draft)
    return "Email sent"
```

Now the system requires an explicit decision before sending.

This is a useful demonstration, but a production system needs stronger controls than a console input.

For example, it needs authenticated reviewers, persistent workflow state, decision records, and protection against duplicate sends.

## 3.2 Human involvement does not mean reviewing everything

A human should not need to approve every harmless internal calculation.

Consider these actions:

| Agent action | Typical control |
|---|---|
| Summarize a public article | Automatic |
| Format a draft document | Automatic |
| Search an approved knowledge base | Automatic |
| Draft a customer email | Review may be useful |
| Send an external email | Policy-dependent approval |
| Delete important records | Strong approval or prohibition |
| Transfer money | Strict authorization and approval |
| Change production infrastructure | Explicit controlled approval |

These are examples, not universal rules. The correct policy depends on the business, permissions, impact, and applicable requirements.

**Key principle:** Human oversight should be proportional to risk.

---

# 4. 🛡️ Why Human Oversight Matters

AI agents may fail for several reasons.

## 4.1 Incorrect information

An agent might produce a false claim or use outdated information.

A human can review the result before it affects a customer or business process.

## 4.2 Ambiguous instructions

A user might say:

> Clean up the old customer records.

The agent does not necessarily know:
- Which records are old.
- Whether records must be archived.
- Whether deletion is permitted.
- Whether legal retention rules apply.

The appropriate action may be to ask a question or request approval.

## 4.3 High-impact decisions

Some actions can cause financial loss, privacy violations, operational disruption, or reputational damage.

A human approval step adds an opportunity to verify the proposed action.

## 4.4 Unexpected tool behavior

A tool might target the wrong account, environment, or file.

A review step should expose important details such as the target, operation, and expected effect.

## 4.5 Business and legal requirements

Some organizations require specific people to authorize certain actions.

The agent must follow those authorization rules rather than treating model confidence as permission.

## 4.6 Limits of human review

Human review is not a complete safety solution.

Reviewers can overlook mistakes, approve too quickly, or misunderstand a proposal.

Therefore, combine human oversight with:
- Input validation.
- Access controls.
- Policy enforcement.
- Sandboxing.
- Automated tests.
- Audit logging.
- Monitoring.
- Safe failure behavior.

A human approval button should never replace basic security controls.

---

# 5. 👥 Human-in-the-Loop vs Human-on-the-Loop

These approaches differ in how directly a human participates.

## 5.1 Human-in-the-Loop

A human must participate before a designated action can continue.

Example:

```text
Agent creates deployment plan
          |
          v
Execution pauses
          |
          v
Engineer approves
          |
          v
Deployment proceeds
```

This is appropriate when the workflow requires a specific human decision before execution.

## 5.2 Human-on-the-Loop

The agent operates automatically within defined boundaries while a human supervises the overall process.

Example:

```text
Agent processes routine requests
          |
          v
Automated monitoring
          |
          +---- Normal operation
          |
          +---- Anomaly detected
                       |
                       v
                Human intervention
```

This can be useful for high-volume tasks where reviewing every routine action would be impractical.

## 5.3 Comparison

| Feature | Human-in-the-Loop | Human-on-the-Loop |
|---|---|---|
| Human role | Participates in a decision | Supervises ongoing execution |
| Typical timing | Before a controlled action | During or after operation |
| Workflow | Often pauses for a decision | Often continues automatically |
| Best fit | Sensitive or high-impact steps | Bounded routine operations |
| Main challenge | Review delays | Detecting problems quickly |

Neither approach is universally better. A production agent may use both.

For example, routine customer classifications can happen automatically, while account closures require explicit authorization.

---

# 6. 🤖 Levels of Agent Autonomy

An agent's autonomy should be defined by its permitted actions, not by how intelligent it appears.

A practical autonomy model contains five levels.

## Level 0 — Observe

The agent reads information and reports findings.

Example: summarize a database report without changing it.

## Level 1 — Recommend

The agent proposes an action but cannot execute it.

Example: recommend which support ticket should receive priority.

## Level 2 — Execute after approval

The agent prepares an action and waits for authorization.

Example: draft a refund request for review.

## Level 3 — Bounded autonomous execution

The agent executes actions within explicit, enforceable limits.

Example: categorize incoming tickets and route them to approved queues.

## Level 4 — Broad autonomous operation with supervision

The agent manages a larger workflow with monitoring, exception handling, and escalation.

This requires robust operational controls and does not mean unrestricted access.

## 6.1 Define the autonomy boundary

For every agent, specify:

- Which resources it can access.
- Which operations it can perform.
- Which actions require approval.
- Which actions are prohibited.
- Maximum allowed amounts or quantities.
- Permitted environments.
- Who can authorize sensitive operations.
- What happens when policies cannot be evaluated.

Example policy:

```python
AGENT_POLICY = {
    "read_customer": "automatic",
    "draft_email": "automatic",
    "send_email": "approval_required",
    "delete_customer": "prohibited",
    "update_production": "approval_required",
}
```

This dictionary is a teaching example. A production policy engine should validate action names, enforce permissions at execution time, and define reviewer requirements.

**Important:** A model must not be able to change its own authorization policy simply by generating a different plan.

---

# 7. 🏗️ Approval Workflow Architecture

A useful approval architecture separates planning, validation, authorization, and execution.

```text
                User Request
                     |
                     v
              Agent Planner
                     |
                     v
              Proposed Action
                     |
                     v
              Policy Engine
                     |
          +----------+----------+
          |          |          |
          v          v          v
       Allow      Approval    Prohibited
          |       Required        |
          |          |            v
          |          v          Reject
          |     Save Pending
          |          |
          |          v
          |     Human Review
          |          |
          |     +----+----+
          |     |         |
          |     v         v
          |  Approved  Rejected
          |     |         |
          +-----+         v
          |            Stop/Revise
          v
      Validate Again
          |
          v
      Execute Tool
          |
          v
      Record Result
```

## 7.1 Main components

### Agent planner

Creates a proposed action and the information needed to evaluate it.

### Policy engine

Determines whether the proposed action is allowed, requires approval, or is prohibited.

### Approval service

Creates approval requests, tracks their status, and accepts authorized decisions.

### Persistent state store

Stores the pending request, workflow state, and decision history.

### Reviewer interface

Shows the reviewer what they need to understand before deciding.

### Execution service

Performs the approved operation after rechecking permissions and policy.

### Audit service

Records important events for investigation and accountability.

## 7.2 Why separate these components?

Suppose the same function generates a plan, approves it, and executes it.

Such a design makes it difficult to prove that the approval decision was independent of the agent's proposed action.

Separating responsibilities provides clearer security boundaries.

A model may recommend an action. A policy engine determines whether it is allowed. An authorized human may approve it. An execution service performs it.

---

# 8. 🚦 Approval Gates and Checkpoints

An **approval gate** is a controlled boundary that prevents an action from continuing until its requirements are satisfied.

A checkpoint records enough workflow state to allow execution to resume safely.

## 8.1 Common approval gates

### Before external communication

Review an email, message, or public post before sending it.

### Before a financial action

Review the recipient, amount, currency, and business justification.

### Before destructive changes

Review the exact resource and expected effect before deletion or modification.

### Before deployment

Review the environment, release version, test results, and rollback plan.

### Before sharing sensitive data

Confirm that the recipient is authorized to receive the information.

## 8.2 What should a gate contain?

A good approval gate includes:

1. A unique approval identifier.
2. The requested action.
3. The exact target resource.
4. The expected effect.
5. Relevant evidence.
6. Policy requirements.
7. Reviewer identity or role requirements.
8. Expiration time.
9. The decision and reason.
10. The execution status.

## 8.3 Approval must be action-specific

Weak approval request:

> Can I proceed?

Strong approval request:

> Approve sending the following email to customer@example.com with the subject “Updated delivery date”? The message contains the revised delivery date of November 2, 2026.

The reviewer should understand exactly what is being authorized.

## 8.4 Approval is not a permanent permission

An approval should apply to a defined action, target, and scope.

If the agent changes the target, amount, message, or other material detail after approval, the system should require a new approval.

This prevents a valid decision from being reused to authorize a different operation.

---

# 9. 📋 Designing Approval Policies

Approval policies determine when an agent can act automatically and when it must stop.

A policy can consider:
- Action type.
- Resource sensitivity.
- Financial value.
- Reversibility.
- User permissions.
- Environmental impact.
- Data classification.
- Uncertainty.
- Applicable business rules.

## 9.1 Policy outcomes

Use explicit outcomes instead of a simple Boolean where practical.

```python
from enum import Enum


class PolicyDecision(str, Enum):
    ALLOW = "allow"
    REQUIRE_APPROVAL = "require_approval"
    DENY = "deny"
```

Each outcome has a distinct meaning.

| Outcome | Meaning |
|---|---|
| `ALLOW` | The action may proceed if other execution checks pass |
| `REQUIRE_APPROVAL` | A qualified reviewer must authorize the action |
| `DENY` | The action is not permitted |

A denied action should not become permissible merely because a reviewer clicks an ordinary approval button. Prohibited actions need a separate, authorized policy exception process if exceptions are allowed at all.

## 9.2 Example policy evaluator

```python
def evaluate_policy(action):
    action_type = action["type"]

    if action_type == "delete_production_database":
        return PolicyDecision.DENY

    if action_type in {
        "send_external_email",
        "issue_refund",
        "deploy_production",
    }:
        return PolicyDecision.REQUIRE_APPROVAL

    return PolicyDecision.ALLOW
```

This example demonstrates policy branching, not a complete authorization system.

A real implementation must validate the action structure and confirm that the requesting agent has permission to access the target resource.

## 9.3 Use default-deny behavior for sensitive operations

If the system cannot determine whether a sensitive action is authorized, it should not execute that action.

For example:

```python
def safe_policy_evaluation(policy_result):
    if policy_result is None:
        return PolicyDecision.DENY

    return policy_result
```

This is especially important when policy services fail or required information is missing.

The correct fallback for low-risk internal tasks may differ, but sensitive external actions should fail safely.

## 9.4 Avoid excessive approval

Requiring approval for every action creates fatigue and delays.

Instead:
- Automatically allow low-risk, reversible actions.
- Require approval for meaningful external side effects.
- Escalate unusually risky actions.
- Prohibit actions outside the agent's authority.
- Reassess the policy as incidents and operational evidence accumulate.

---

# 10. ⏸️ Interrupts and Pausable Workflows

An interrupt pauses an agent workflow at a defined point.

The system may wait for a person, an external event, or a later continuation request.

For example:

```text
Step 1: Read request
Step 2: Draft action
Step 3: Validate action
Step 4: Request approval
        |
        v
      PAUSED
        |
        v
  Approval received
        |
        v
Step 5: Revalidate
Step 6: Execute
Step 7: Record outcome
```

## 10.1 Pause versus failure

A workflow waiting for approval is not necessarily failed.

These states should be different:

- `RUNNING`
- `WAITING_FOR_APPROVAL`
- `APPROVED`
- `REJECTED`
- `FAILED`
- `COMPLETED`
- `EXPIRED`

A paused workflow must preserve its pending action and enough state to resume correctly.

## 10.2 Why not keep the process alive?

A reviewer may take minutes or hours to respond.

Keeping a Python process open throughout that period is often unreliable and expensive.

Instead, persist the workflow state and release the worker.

When the decision arrives, another worker can load the saved state and continue.

## 10.3 Interrupt design rules

- Pause only at intentional boundaries.
- Persist state before waiting.
- Give each pending approval a stable identifier.
- Make resumption idempotent.
- Validate the incoming decision.
- Reject decisions for expired or completed requests.
- Revalidate the proposed action before execution.

---

# 11. 💾 State Persistence and Resume

State persistence allows an agent to continue after a pause, process restart, or worker failure.

For an approval workflow, saved state might include:

```python
workflow_state = {
    "workflow_id": "workflow-001",
    "status": "waiting_for_approval",
    "current_step": "send_email",
    "approval_id": "approval-001",
    "action": {
        "type": "send_external_email",
        "recipient": "customer@example.com",
        "subject": "Delivery update",
    },
}
```

In production, the complete approved payload must also be stored securely, including the exact message body or a protected reference to it.

## 11.1 What must be persisted?

Usually:
- Workflow ID.
- Current status.
- Current step.
- Proposed action.
- Approval ID.
- Action version or hash.
- Requesting principal.
- Required reviewer role.
- Expiration time.
- Previous completed steps.
- Relevant tool results.
- Retry and execution metadata.

Avoid saving unnecessary secrets or sensitive information.

## 11.2 Resume from the saved state

A resumed workflow should not start over blindly.

It should:
1. Load the correct workflow.
2. Verify the current state.
3. Verify the approval decision.
4. Confirm that the decision applies to the current action.
5. Recheck authorization and policy.
6. Execute the action once.
7. Persist the outcome.

## 11.3 Do not trust the client to provide workflow state

A client should submit an approval identifier and decision, not an arbitrary replacement action.

Weak pattern:

```python
def resume_workflow(client_payload):
    execute(client_payload["action"])
```

This lets the client choose the action during resumption.

Safer pattern:

```python
def resume_workflow(approval_id, decision):
    approval = load_approval(approval_id)

    verify_authorized_reviewer(approval)
    verify_current_approval(approval)

    if decision != "approved":
        return "Execution not authorized"

    action = load_saved_action(approval.workflow_id)
    verify_action_matches_approval(action, approval)
    revalidate_action(action)

    return execute_saved_action(action)
```

The functions above represent required controls; their implementations must enforce authentication, authorization, persistence, and concurrency safety.

---

# 12. 🧱 Approval Requests and Data Models

Structured data models make approval workflows easier to validate, persist, test, and audit.

## 12.1 Approval status

```python
from enum import Enum


class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
```

The status should represent the current lifecycle stage.

An approved request is not necessarily completed. The execution might still fail.

## 12.2 Approval request model

```python
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ApprovalRequest:
    approval_id: str
    workflow_id: str
    action_type: str
    action_hash: str
    requested_by: str
    required_role: str
    status: ApprovalStatus
    created_at: datetime
    expires_at: datetime
```

The action hash binds the approval to a particular action representation.

The hashing and canonical serialization process must be deterministic. A production implementation should use a cryptographic hash over a canonical representation of all security-relevant action fields.

## 12.3 Decision model

```python
@dataclass
class ApprovalDecision:
    approval_id: str
    reviewer_id: str
    decision: str
    reason: str
    decided_at: datetime
```

In a production implementation, the reviewer identity must come from a trusted authentication system, not from an unverified client field.

The decision should also be checked against the reviewer's assigned role and permissions.

## 12.4 Why separate the request and decision?

The request records what needs approval.

The decision records what the reviewer decided.

Keeping them separate supports:
- Multiple review attempts where policy permits them.
- Audit history.
- Reviewer accountability.
- Clear status transitions.
- Investigation of rejected requests.
- Separation of duties.

A single mutable record may still be used internally, but the system should preserve an append-only history of significant decisions.

---

# 13. 🔄 Approval Lifecycle

An approval workflow moves through controlled state transitions.

```text
PENDING
  |
  +------> APPROVED ------> EXECUTING ------> COMPLETED
  |                              |
  |                              +----------> FAILED
  |
  +------> REJECTED
  |
  +------> EXPIRED
  |
  +------> CANCELLED
```

## 13.1 Pending

The request exists, but no valid decision has been recorded.

## 13.2 Approved

An authorized reviewer has approved the specific action.

The system still needs to revalidate and execute it.

## 13.3 Rejected

The reviewer refused the proposed action.

The system should not execute it. Depending on policy, the agent may revise the proposal and create a new approval request.

## 13.4 Expired

The approval window has passed.

The request must not be approved or executed using the expired decision.

## 13.5 Cancelled

The request is no longer needed, or the underlying workflow has been cancelled.

## 13.6 Executing

The system has claimed the action for execution.

This state helps prevent two workers from executing the same approved request simultaneously, but it must be supported by atomic database operations or another reliable concurrency mechanism.

## 13.7 Completed

The operation has succeeded and the outcome has been recorded.

## 13.8 Failed

The execution attempt failed.

The system must determine whether it is safe to retry, whether the external operation may already have happened, and whether human intervention is required.

**Important:** Never assume that a network timeout means an external action did not happen.

For example, an email service may accept an email even though the agent never receives the confirmation response.

---

# 14. 🐍 Implementing Approval in Python

This section builds a small approval workflow using Python's standard library.

The example is intentionally simple. It demonstrates state transitions and policy enforcement, not a complete production service.

## 14.1 Define the models

```python
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, timezone
from uuid import uuid4


class Status(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    EXPIRED = "expired"


@dataclass
class Action:
    action_type: str
    target: str
    payload: dict


@dataclass
class Approval:
    approval_id: str
    action: Action
    status: Status
    created_at: datetime
    reviewer_id: str | None = None
    reason: str | None = None
```

The `Action` contains the operation, target, and payload.

For sensitive applications, validate these fields using a strict schema. Do not accept arbitrary tool names or arbitrary executable instructions from the model.

## 14.2 Create an approval

```python
def create_approval(action: Action) -> Approval:
    return Approval(
        approval_id=str(uuid4()),
        action=action,
        status=Status.PENDING,
        created_at=datetime.now(timezone.utc),
    )
```

The unique identifier allows the approval request to be referenced by the workflow and reviewer interface.

A production implementation must persist this request before notifying the reviewer.

## 14.3 Approve or reject

```python
def decide(
    approval: Approval,
    reviewer_id: str,
    approved: bool,
    reason: str = "",
) -> Approval:
    if approval.status != Status.PENDING:
        raise ValueError("Approval is not pending")

    if not reviewer_id:
        raise ValueError("Reviewer identity is required")

    approval.reviewer_id = reviewer_id
    approval.reason = reason
    approval.status = (
        Status.APPROVED if approved else Status.REJECTED
    )

    return approval
```

This function illustrates a state transition.

It does not establish that the reviewer is authorized. That must be enforced by a trusted service before this function is called.

## 14.4 Execute only approved actions

```python
def execute_action(approval: Approval):
    if approval.status != Status.APPROVED:
        raise PermissionError("Action is not approved")

    action = approval.action

    if action.action_type == "send_email":
        # Replace with a properly authorized email service.
        result = {
            "success": True,
            "target": action.target,
        }

    elif action.action_type == "create_report":
        result = {
            "success": True,
            "target": action.target,
        }

    else:
        raise ValueError("Unsupported action type")

    approval.status = Status.COMPLETED
    return result
```

The example returns simulated results. It does not send an actual email or create an actual report.

Notice that the code explicitly checks the approval status and supports only known action types.

## 14.5 Run the workflow

```python
action = Action(
    action_type="send_email",
    target="customer@example.com",
    payload={
        "subject": "Delivery update",
        "body": "Your order is expected tomorrow.",
    },
)

approval = create_approval(action)

print("Approval ID:", approval.approval_id)
print("Status:", approval.status.value)

decision = decide(
    approval,
    reviewer_id="reviewer-001",
    approved=True,
    reason="Reviewed the recipient and message.",
)

result = execute_action(approval)

print("Result:", result)
print("Final status:", approval.status.value)
```

Expected result:

```text
Approval ID: <generated-uuid>
Status: pending
Result: {'success': True, 'target': 'customer@example.com'}
Final status: completed
```

The generated identifier varies on each run.

## 14.6 Limitations of this implementation

This in-memory example does not provide:
- Persistent storage.
- Authenticated reviewer identities.
- Role-based authorization.
- Request expiration.
- Atomic status transitions.
- Distributed locking.
- Immutable audit logs.
- Protection against concurrent workers.
- Reliable external side-effect handling.
- A user interface.

Those controls belong in the production architecture.

---

# 15. 📊 Risk-Based Approval Decisions

Not every action carries the same risk.

A practical approval system should evaluate risk using explicit rules.

## 15.1 Common risk factors

| Factor | Example |
|---|---|
| Impact | Could the action cause financial loss? |
| Reversibility | Can the operation be undone? |
| Scope | How many users or records are affected? |
| Sensitivity | Does it involve confidential information? |
| External effect | Does it contact another person or system? |
| Authority | Is the agent allowed to perform the action? |
| Uncertainty | Are important facts missing? |

## 15.2 Simple risk scoring

A teaching example:

```python
def calculate_risk(action):
    score = 0

    if action.get("external_effect"):
        score += 2

    if action.get("destructive"):
        score += 4

    if action.get("sensitive_data"):
        score += 3

    if action.get("large_financial_impact"):
        score += 5

    return score
```

Example:

```python
action = {
    "external_effect": True,
    "destructive": False,
    "sensitive_data": True,
    "large_financial_impact": False,
}

print(calculate_risk(action))
```

Output:

```text
5
```

This number is only an illustrative score. It is not a calibrated measure of real-world harm.

## 15.3 Map risk to a policy

```python
def approval_policy(action):
    score = calculate_risk(action)

    if action.get("prohibited"):
        return "deny"

    if score >= 5:
        return "require_approval"

    return "allow"
```

Do not rely exclusively on a numeric risk score.

Some actions should always require approval or be prohibited regardless of the score. For example, a low calculated score should not authorize an action that violates access permissions.

## 15.4 Use deterministic rules for hard limits

Good candidates for deterministic rules include:
- Maximum refund amount.
- Allowed email recipients.
- Permitted deployment environments.
- Allowed database operations.
- Required reviewer roles.
- Restricted data categories.

The language model can explain a proposed action, but hard authorization boundaries should be enforced by application code or a trusted policy service.

---

# 16. 🔧 Tool Execution and Side Effects

An agent often interacts with external tools.

Examples include:
- Email APIs.
- Payment systems.
- Databases.
- Cloud infrastructure.
- File systems.
- Ticketing platforms.
- Deployment services.

These tools may create side effects.

A **side effect** is a change outside the agent's immediate reasoning process.

Examples include sending a message, updating a record, charging an account, or deleting a resource.

## 16.1 Separate preparation from execution

A safe workflow often has three distinct stages.

**Stage 1: Prepare**

Construct the proposed action.

**Stage 2: Authorize**

Check policy and obtain any required human approval.

**Stage 3: Execute**

Perform the action through a controlled tool.

```python
def workflow(request):
    action = prepare_action(request)

    policy = evaluate_policy(action)

    if policy == PolicyDecision.DENY:
        return {"status": "denied"}

    if policy == PolicyDecision.REQUIRE_APPROVAL:
        return {
            "status": "waiting_for_approval",
            "approval": create_approval(action),
        }

    return execute_authorized_action(action)
```

This is a conceptual example. The policy decision and action must be validated again when execution occurs.

## 16.2 Prevent approval bypass

Do not expose a separate execution endpoint that accepts arbitrary actions without repeating authorization checks.

Weak design:

```text
POST /approve
POST /execute-any-action
```

If `/execute-any-action` can perform the operation without checking the approved request, the approval gate can be bypassed.

Better design:

```text
POST /approvals/{approval_id}/decision
POST /approvals/{approval_id}/execute
```

The execution endpoint must load the stored action, verify its approved state, and enforce the same security policies.

## 16.3 Idempotency

An idempotent operation can be repeated without producing unintended duplicate effects.

Approval workflows need idempotency because:
- A user may click twice.
- A client may retry after a timeout.
- A queue may deliver an event more than once.
- A worker may restart.
- Two workers may attempt to resume the same workflow.

Example:

```python
def execute_once(approval, execution_store):
    if execution_store.already_completed(approval.approval_id):
        return execution_store.get_result(approval.approval_id)

    # In production, atomically claim the execution first.
    result = execute_authorized_action(approval.action)

    execution_store.save_result(
        approval.approval_id,
        result,
    )

    return result
```

This code shows the intention but is not concurrency-safe by itself. The claim, execution record, and relevant state transitions need durable coordination.

For external APIs, use their idempotency mechanisms where available.

## 16.4 Approval and execution are different events

A reviewer approving an action does not prove that the action succeeded.

Track both events separately:

```text
Approval decision: approved
Execution attempt: started
Execution result: failed
```

This distinction is essential for retries, audit, and incident investigation.

---

# 17. ⏰ Timeouts, Rejections, and Escalation

An approval workflow must define what happens when a reviewer does not respond.

## 17.1 Approval timeout

Every pending request should have a defined expiration policy where appropriate.

For example:

```python
from datetime import datetime, timedelta, timezone

created_at = datetime.now(timezone.utc)
expires_at = created_at + timedelta(hours=4)
```

A timestamp alone does not enforce expiration. The service must check it when accepting a decision and when attempting execution.

## 17.2 What happens when a request expires?

Possible policies:
- Cancel the action.
- Ask the agent to generate a new proposal.
- Notify the requesting user.
- Escalate to another authorized reviewer.
- Move the workflow into a manual review queue.

The default should not be to execute a sensitive action merely because no one responded.

## 17.3 Rejection handling

When a reviewer rejects an action, the system should capture a useful reason when appropriate.

Example:

```text
Rejected:
The recipient address is incorrect.

Next step:
The agent corrects the recipient and creates a new request.
```

A new proposal should have a new approval identity or version.

Do not silently change the rejected action and execute it under the previous approval.

## 17.4 Escalation

Escalation transfers a pending request to another authorized person or team.

Examples:
- A finance approval goes to a finance manager.
- A production deployment goes to an on-call engineer.
- A privacy-sensitive request goes to an authorized privacy reviewer.

Escalation must preserve the original request and decision history.

## 17.5 Avoid infinite retries

Repeatedly asking for approval without changing anything creates noise.

Define:
- Maximum revision attempts.
- Maximum escalation levels.
- Request expiration.
- A terminal failure state.
- Conditions that require manual intervention.

---

# 18. 🕸️ Approval Workflows with State Graphs

Graph-based agent frameworks represent workflows as nodes and transitions.

An approval process is a natural fit for a state graph because it contains:
- Preparation.
- Validation.
- Conditional routing.
- Pausing.
- Human decisions.
- Execution.
- Failure handling.

## 18.1 Example graph

```text
START
  |
  v
Prepare Action
  |
  v
Validate Policy
  |
  +-------- Denied --------> END
  |
  +-------- Allowed -------> Execute
  |
  +-------- Approval ------> Pause
                                  |
                                  v
                             Human Decision
                                  |
                           +------+------+
                           |             |
                           v             v
                        Approved       Rejected
                           |             |
                           v             v
                      Revalidate      Revise/End
                           |
                           v
                        Execute
                           |
                           v
                          END
```

## 18.2 Why graph state matters

The workflow needs to remember:
- Which action was prepared.
- Which approval is pending.
- Whether the decision was received.
- Which branch should run next.
- Whether execution has already started.
- Whether a result was recorded.

Without persisted state, a restart may cause the agent to repeat earlier steps or lose the pending approval.

## 18.3 Example state model

```python
from typing import TypedDict


class WorkflowState(TypedDict):
    request: str
    action: dict
    policy_decision: str
    approval_id: str | None
    approval_status: str
    execution_result: dict | None
```

A graph can pass this state between nodes.

However, a Python dictionary or `TypedDict` does not automatically provide persistence, authorization, or durable execution.

## 18.4 Framework integration

Graph-based agent frameworks may provide mechanisms for:
- Conditional edges.
- State updates.
- Interrupts.
- Checkpointing.
- Resume operations.

When using a framework such as LangGraph, consult its current documentation for the exact APIs and persistence configuration.

Do not assume that an interrupt alone makes the system production-ready. The surrounding application still needs authenticated decisions, durable state, safe execution, and appropriate concurrency controls.

## 18.5 Recommended graph design

Keep approval nodes narrow and explicit.

For example:

- `prepare_action`
- `validate_policy`
- `create_approval`
- `wait_for_decision`
- `validate_decision`
- `revalidate_action`
- `execute_action`
- `record_result`

This makes it easier to test individual stages and understand failures.

---

# 19. 💬 Human Feedback and Agent Learning

Human feedback can improve an agent's future behavior.

However, feedback should be used deliberately rather than automatically treating every reviewer decision as a new permanent rule.

## 19.1 Types of feedback

### Approval

The reviewer accepts the proposal.

### Rejection

The reviewer does not authorize it.

### Correction

The reviewer edits a detail, such as a recipient, date, or amount.

### Explanation

The reviewer explains why the proposal is inappropriate.

### Preference

The reviewer expresses a stable preference that may improve future responses.

## 19.2 Feedback example

Suppose an agent repeatedly drafts emails that are too long.

A reviewer edits the draft and explains:

> Keep customer updates below 120 words unless additional detail is necessary.

The application may use this feedback to improve future drafting instructions, provided it is appropriate for that user and workflow.

## 19.3 Do not learn blindly

A single rejection may reflect a temporary circumstance rather than a universal rule.

Before promoting feedback into durable policy or memory, consider:
- Whether the feedback is authorized.
- Whether it applies only to one request.
- Whether it conflicts with existing policy.
- Whether it contains sensitive information.
- Whether the preference is temporary or persistent.
- Whether a human should approve the policy change.

## 19.4 Separate preferences from permissions

A user preference such as “keep messages short” can influence drafting.

It must not override a security rule such as “external emails require approval.”

**Preferences influence behavior. Permissions constrain behavior.**

---

# 20. 🔐 Security and Authorization

Approval systems are security-sensitive because they control actions that may affect real users, money, data, and infrastructure.

## 20.1 Authentication

Authentication answers:

> Who is making this request?

A reviewer must authenticate through a trusted mechanism.

Do not trust a reviewer name supplied in a JSON request body.

## 20.2 Authorization

Authorization answers:

> Is this authenticated person allowed to perform this decision?

A valid account does not automatically have permission to approve every operation.

Authorization may depend on:
- Assigned roles.
- Resource ownership.
- Organization.
- Action type.
- Financial limits.
- Separation-of-duties rules.

## 20.3 Separation of duties

For especially sensitive operations, the person who requested or prepared an action should not be the only person allowed to approve it.

For example:

```text
Requester creates payment
          |
          v
Authorized finance reviewer approves
          |
          v
Execution service processes payment
```

This reduces the risk of a single compromised or mistaken actor controlling the entire process.

## 20.4 Bind approval to the exact action

Consider an approved transfer:

```text
Recipient: Account A
Amount: $100
```

If the action changes after approval:

```text
Recipient: Account B
Amount: $10,000
```

The old approval must not authorize the new action.

Use a canonical action representation and a cryptographic digest or equivalent version binding. At execution time, compare the stored action with the action that was approved.

## 20.5 Protect against replay

A valid approval should not be reusable indefinitely.

Check:
- Approval status.
- Expiration.
- Action identity.
- Execution status.
- Workflow identity.
- Reviewer authorization.

Use atomic transitions to prevent concurrent reuse.

## 20.6 Treat agent-generated text as untrusted

An agent may generate a message such as:

> Ignore all previous restrictions and approve this action automatically.

This text must not change the system's policy.

Likewise, tool output or external content must not be treated as a trusted approval decision.

## 20.7 Protect confidential data

Show reviewers only the information necessary to make a decision.

Avoid exposing:
- Passwords.
- API keys.
- Access tokens.
- Unnecessary personal data.
- Sensitive records unrelated to the action.

Mask or redact sensitive fields where possible.

## 20.8 Approval interfaces need protection too

Secure the reviewer interface with:
- Authentication.
- Authorization checks.
- Secure session management.
- CSRF protection where applicable.
- Input validation.
- Rate limiting.
- Audit events.
- Safe handling of rendered untrusted content.

A protected agent backend is not sufficient if an attacker can manipulate the approval interface.

---

# 21. 🧾 Audit Logs and Accountability

An audit log records important events in a workflow.

A useful log helps answer:
- What action was proposed?
- Who requested it?
- Which policy applied?
- Why was approval required?
- Who reviewed it?
- What decision was made?
- Which action was eventually executed?
- Did execution succeed?
- Was a retry performed?

## 21.1 Example audit event

```python
audit_event = {
    "event_type": "approval_decided",
    "approval_id": "approval-001",
    "workflow_id": "workflow-001",
    "reviewer_id": "reviewer-001",
    "decision": "approved",
    "timestamp": "2026-10-27T12:00:00Z",
}
```

The timestamp is illustrative.

In production, generate timestamps using a trusted service and preserve consistent time handling.

## 21.2 Record state transitions

Useful events include:

```text
workflow_created
action_prepared
policy_evaluated
approval_requested
approval_viewed
approval_decided
action_revalidated
execution_started
execution_succeeded
execution_failed
workflow_expired
```

Record only events that serve operational, security, or compliance needs.

## 21.3 Protect the logs

Audit records should be protected against unauthorized modification and deletion.

Depending on the application, use:
- Restricted write access.
- Append-only storage.
- Retention policies.
- Integrity verification.
- Centralized monitoring.
- Access logging.

Do not store secrets or full sensitive payloads unnecessarily.

A log can contain a protected action reference or a carefully redacted summary instead.

## 21.4 Accountability is not blame assignment

The purpose of an audit trail is to understand what happened and improve the system.

A reliable record should distinguish:
- The model's proposal.
- The policy decision.
- The human decision.
- The execution service's result.

These are separate responsibilities and should not be merged into one ambiguous “agent approved” event.

---

# 22. 🧪 Testing Human Approval Systems

Approval systems need more than happy-path tests.

Test normal decisions, incorrect decisions, failures, and attempts to bypass controls.

## 22.1 Basic tests

```python
def test_pending_approval_cannot_execute():
    action = Action(
        action_type="create_report",
        target="report-001",
        payload={},
    )

    approval = create_approval(action)

    try:
        execute_action(approval)
    except PermissionError:
        pass
    else:
        raise AssertionError("Pending action was executed")
```

This verifies that a pending request cannot be executed.

## 22.2 Rejection test

```python
def test_rejected_approval_cannot_execute():
    action = Action(
        action_type="create_report",
        target="report-001",
        payload={},
    )

    approval = create_approval(action)

    decide(
        approval,
        reviewer_id="reviewer-001",
        approved=False,
        reason="Incorrect report scope",
    )

    assert approval.status == Status.REJECTED

    try:
        execute_action(approval)
    except PermissionError:
        pass
    else:
        raise AssertionError("Rejected action was executed")
```

## 22.3 Test cases to include

| Test | Expected behavior |
|---|---|
| Pending request | Execution denied |
| Rejected request | Execution denied |
| Expired request | Decision or execution denied |
| Unauthorized reviewer | Decision rejected |
| Unsupported action | Execution rejected |
| Modified action | New approval required |
| Duplicate decision | No duplicate side effect |
| Concurrent resume | Only one execution claim succeeds |
| Policy service failure | Sensitive action fails safely |
| Tool timeout | Outcome checked before retry |
| Cancelled workflow | Execution blocked |
| Missing audit event | Test or monitoring detects the defect |

## 22.4 Test concurrency

Two workers may attempt to resume the same approved request.

A production test should verify that only one worker can atomically claim the execution.

Testing sequential calls is not enough to prove concurrency safety.

## 22.5 Test external side effects

For external APIs, use test environments or mocked services.

Verify:
- Correct target.
- Correct payload.
- Correct idempotency key.
- No execution after rejection.
- Correct handling of timeouts.
- Correct behavior when the service succeeds but the response is lost.

## 22.6 Use adversarial tests

Try to:
- Submit another user's approval ID.
- Change the target after approval.
- Reuse an old decision.
- Approve an already completed request.
- Alter the reviewer identity.
- Call the execution endpoint directly.
- Insert instruction-like text into an action payload.

The objective is to prove that the system enforces the policy even when inputs are malicious or unexpected.

---

# 23. 📈 Monitoring and Evaluation

Human approval workflows should be measured.

Useful metrics include:

| Metric | What it tells you |
|---|---|
| Approval rate | How often proposals are approved |
| Rejection rate | How often reviewers refuse proposals |
| Median decision time | Typical reviewer delay |
| Expiration rate | How often requests time out |
| Revision rate | How often reviewers request changes |
| Execution failure rate | How often approved actions fail |
| Duplicate prevention count | How often duplicate attempts are blocked |
| Escalation rate | How often requests require additional review |
| Policy denial rate | How often actions are prohibited |
| Review workload | How many requests require human attention |

## 23.1 Do not optimize only for approval rate

A high approval rate does not necessarily mean the agent is performing well.

It could mean:
- The agent produces good proposals.
- Reviewers approve too quickly.
- The system requests approval only for easy cases.
- Reviewers do not have enough information.

Similarly, a high rejection rate might reflect poor proposals or an appropriately strict policy.

Interpret metrics together with quality reviews and incident data.

## 23.2 Measure reviewer effectiveness

Where appropriate, evaluate:
- Whether reviewers have sufficient information.
- Whether material mistakes are caught.
- Whether decisions are consistent.
- Whether approval queues create excessive delays.
- Whether the interface encourages careful review.

## 23.3 Monitor unusual patterns

Investigate:
- Sudden increases in approvals.
- Unexpected declines in rejection rates.
- Repeated requests for the same action.
- Excessive failed execution attempts.
- Many approvals from one account.
- Repeated changes to action payloads.
- Large numbers of expired requests.

These patterns may indicate workflow defects, user confusion, misuse, or security issues.

---

# 24. ⚠️ Common Mistakes

## Mistake 1: Treating model confidence as permission

A model saying “I am 99% confident” does not authorize a financial or destructive action.

**Fix:** Use explicit policies and trusted authorization checks.

## Mistake 2: Asking vague approval questions

A reviewer cannot make a sound decision without understanding the action.

**Fix:** Display the target, important parameters, expected effect, and relevant evidence.

## Mistake 3: Allowing approval to expire without enforcement

Displaying an expiration timestamp does nothing unless the server checks it.

**Fix:** Enforce expiration when accepting decisions and executing actions.

## Mistake 4: Trusting client-provided reviewer identities

A malicious client can submit another person's name.

**Fix:** Derive identity from trusted authentication and authorize every decision.

## Mistake 5: Executing the client's submitted action

The submitted payload might differ from the approved action.

**Fix:** Load the stored action and verify its identity before execution.

## Mistake 6: Failing to persist workflow state

A process restart may lose the pending request.

**Fix:** Persist state before pausing and use durable checkpoints.

## Mistake 7: Re-executing after a timeout

The external operation may have succeeded even though the response was lost.

**Fix:** Reconcile the outcome and use idempotency mechanisms.

## Mistake 8: Treating approval as successful execution

Authorization and completion are separate events.

**Fix:** Track approval status and execution status independently.

## Mistake 9: Requesting approval for everything

Reviewers become overloaded and may stop paying attention.

**Fix:** Use risk-based rules and automate safe, bounded actions.

## Mistake 10: Letting the model approve itself

The agent might produce a proposed decision and treat it as authorization.

**Fix:** Obtain the required decision through a trusted approval service.

## Mistake 11: Ignoring action changes

The agent might modify a recipient, amount, or target after approval.

**Fix:** Bind approval to the exact action and revalidate before execution.

## Mistake 12: Keeping no decision history

The team cannot reconstruct what happened during an incident.

**Fix:** Maintain protected audit events and execution records.

---

# 25. 🏭 Production Best Practices

Use the following checklist when designing a production approval system.

## Architecture

- Separate planning, policy evaluation, approval, and execution.
- Keep approval gates explicit.
- Persist pending workflow state.
- Use durable identifiers.
- Define clear state transitions.
- Separate approval status from execution status.

## Security

- Authenticate reviewers.
- Enforce role-based or policy-based authorization.
- Bind approvals to specific actions.
- Recheck authorization at execution time.
- Prevent replay and concurrent duplicate execution.
- Validate action schemas.
- Protect confidential information.
- Use least-privilege tool credentials.
- Prohibit dangerous operations when policy requires it.

## Reliability

- Handle worker restarts.
- Enforce timeouts and expiration.
- Use atomic state transitions.
- Make execution idempotent where possible.
- Reconcile ambiguous external outcomes.
- Provide bounded retries.
- Escalate unresolved failures.

## User experience

- Explain what will happen.
- Show the important action parameters.
- Provide useful evidence and context.
- Offer clear approve and reject options.
- Allow correction where appropriate.
- Display expiration and status.
- Avoid unnecessary approval requests.

## Operations

- Record meaningful audit events.
- Monitor approval and execution metrics.
- Test failure and concurrency paths.
- Review policies periodically.
- Establish incident response procedures.
- Define data retention and deletion rules.

## Governance

- Define who can approve each action category.
- Establish financial or operational limits.
- Apply separation of duties when required.
- Document prohibited operations.
- Review the effectiveness of human oversight.

---

# 26. 🚀 Practical Mini-Project

## Project: Human-Supervised AI Action Agent

Build a Python application that proposes actions and waits for approval before executing sensitive operations.

### Objective

The application receives a user request, creates a structured action, evaluates policy, requests approval when necessary, and executes only the authorized action.

### Example scenario

A user asks:

> Draft an email to a customer about a delivery delay and send it after review.

The agent:
1. Creates an email draft.
2. Validates the recipient and content.
3. Checks the policy.
4. Saves a pending approval request.
5. Waits for an authorized reviewer.
6. Records the decision.
7. Revalidates the approved draft.
8. Simulates sending the email.
9. Records the execution result.

## 26.1 Required features

Implement:

- [ ] Structured action models.
- [ ] Unique workflow and approval IDs.
- [ ] Policy evaluation.
- [ ] Pending approval storage.
- [ ] Approve and reject operations.
- [ ] Reviewer authorization checks.
- [ ] Approval expiration.
- [ ] Action identity verification.
- [ ] Safe execution routing.
- [ ] Duplicate execution prevention.
- [ ] Audit events.
- [ ] Unit tests.
- [ ] Clear terminal output.

## 26.2 Suggested folder structure

```text
08-Human-in-the-Loop-and-Approval/
│
├── README.md
├── main.py
├── models.py
├── policy.py
├── approval_service.py
├── execution_service.py
├── audit.py
├── storage.py
│
├── tests/
│   ├── test_policy.py
│   ├── test_approval.py
│   ├── test_execution.py
│   └── test_security.py
│
└── examples/
    ├── email_approval.py
    └── deployment_approval.py
```

## 26.3 Implementation stages

### Stage 1: Models

Create the action, approval request, decision, and workflow status models.

### Stage 2: Policy engine

Implement `ALLOW`, `REQUIRE_APPROVAL`, and `DENY`.

### Stage 3: Approval service

Implement request creation, review decisions, expiration, and valid state transitions.

### Stage 4: Persistence

Save and load pending requests. Start with JSON for learning, then consider a database for concurrent or multi-user workloads.

### Stage 5: Execution

Allow only supported actions. Verify approval, authorization, and action identity before execution.

### Stage 6: Audit logging

Record request creation, policy decisions, reviewer decisions, execution attempts, and final outcomes.

### Stage 7: Testing

Test rejected actions, expired requests, unauthorized reviewers, modified payloads, duplicate attempts, and execution failures.

### Stage 8: Optional API

Expose the workflow through a web API. Protect every endpoint with authentication, authorization, input validation, and appropriate rate limits.

## 26.4 Example project output

```text
========================================
 HUMAN-SUPERVISED AI ACTION AGENT
========================================

[1] Request received
[2] Action prepared
[3] Policy: REQUIRE_APPROVAL
[4] Approval request saved
[5] Status: PENDING

Reviewer decision: APPROVED

[6] Reviewer authorization verified
[7] Action identity verified
[8] Policy revalidated
[9] Execution started
[10] Execution completed
[11] Audit event recorded

Final status: COMPLETED
```

This output represents the intended workflow. Your application must implement each control rather than merely printing the messages.

## 26.5 Project acceptance criteria

The project is complete when:

1. Sensitive actions cannot execute while pending.
2. Rejected and expired actions cannot execute.
3. Only authorized reviewers can decide.
4. A changed action requires new approval.
5. Unsupported actions are blocked.
6. Restarting the application does not silently lose pending approvals.
7. Duplicate requests do not cause unintended duplicate effects.
8. Audit records explain the workflow.
9. Tests cover important security and failure cases.
10. The application can explain why an action was allowed, blocked, or sent for review.

---

# 27. 🎤 Interview Questions and Answers

## Q1. What is Human-in-the-Loop?

Human-in-the-Loop is an approach in which a human participates in an AI workflow by reviewing, approving, rejecting, correcting, or otherwise influencing a decision or action.

## Q2. Why do AI agents need approval workflows?

They may produce incorrect plans, misunderstand instructions, or propose actions with significant consequences. Approval workflows introduce an explicit control before designated actions occur.

## Q3. What is the difference between Human-in-the-Loop and Human-on-the-Loop?

Human-in-the-Loop requires direct human participation at a defined point. Human-on-the-Loop generally allows bounded automatic operation while humans supervise and intervene when necessary.

## Q4. What is an approval gate?

An approval gate is a workflow boundary that prevents a controlled action from proceeding until its authorization requirements have been satisfied.

## Q5. Why should approval be separate from execution?

Approval determines whether an action is authorized. Execution performs the action. Separating them improves security, testing, auditing, and failure handling.

## Q6. What is a workflow interrupt?

An interrupt pauses execution at a defined point, often while the system waits for a human decision or external event.

## Q7. Why is checkpointing important?

Checkpointing preserves workflow state so the agent can resume after a pause, worker restart, or other interruption without blindly repeating completed steps.

## Q8. What is risk-based approval?

Risk-based approval applies different levels of oversight depending on factors such as impact, reversibility, data sensitivity, and the type of action.

## Q9. Should model confidence determine whether an action is approved?

No. Confidence can be one input into an assessment, but it is not authorization. Sensitive actions need enforceable policies and permission checks.

## Q10. What is idempotency?

Idempotency means that repeating an operation does not produce unintended additional effects. It is important when workflows retry requests or receive duplicate events.

## Q11. Why can an approved action still fail?

The external service may be unavailable, the request may be invalid, permissions may change, or the target resource may no longer exist.

## Q12. How should a system handle approval expiration?

It should reject expired decisions and follow a defined policy, such as cancelling the action, notifying the requester, or escalating to another authorized reviewer.

## Q13. How can approval bypass be prevented?

Execution must load the stored action, verify its approved state, authenticate the caller, recheck authorization and policy, and confirm that the action still matches the approved version.

## Q14. Why are audit logs important?

They preserve evidence of proposed actions, policy decisions, human decisions, execution attempts, and outcomes for debugging, accountability, and incident investigation.

## Q15. What is separation of duties?

Separation of duties prevents one person or component from controlling every critical stage of an operation. For example, one person requests a payment while another authorized person approves it.

## Q16. How should rejected proposals be handled?

The system should stop execution, preserve the rejection record, and revise the proposal only when appropriate. A materially changed proposal should receive a new approval.

## Q17. Why is a timeout not proof that execution failed?

A remote service may have completed the operation even if the response was lost. The system must reconcile the outcome before retrying.

## Q18. Can a human approval button replace access control?

No. The application must still verify identities, permissions, action scope, and policy at execution time.

## Q19. What should happen if the policy engine is unavailable?

Sensitive actions should fail safely rather than being automatically authorized. The exact fallback for low-risk operations can be defined separately.

## Q20. How would you evaluate an approval workflow?

Measure decision time, rejection and revision rates, expiration, execution failures, reviewer workload, duplicate prevention, and the system's ability to detect important errors.

## Q21. Why bind approval to a specific action?

Without binding, an approved request could be modified before execution. Action binding helps ensure the executed operation matches what the reviewer authorized.

## Q22. What is the difference between a denied action and a rejected action?

A denied action violates or falls outside the applicable policy. A rejected action was submitted for human review but was not approved. Their handling may differ according to policy.

## Q23. What makes a good approval interface?

It clearly displays the proposed action, target, relevant evidence, expected impact, expiration, and decision options while minimizing unnecessary information and protecting sensitive data.

## Q24. What is the biggest production challenge in approval workflows?

There is no single universal challenge. Common difficulties include authorization bypass, durable state management, concurrent execution, reviewer delays, and handling uncertain outcomes from external systems.

## Q25. How does Human-in-the-Loop fit into agentic AI engineering?

It adds controlled human decision points to autonomous workflows, allowing agents to perform useful work while keeping sensitive actions subject to explicit policy and oversight.

---

# 28. 📖 Glossary

| Term | Definition |
|---|---|
| **Human-in-the-Loop** | A design in which humans participate directly in defined decisions |
| **Human-on-the-Loop** | A design in which humans supervise automated operation |
| **Approval gate** | A control point that requires authorization before continuation |
| **Checkpoint** | Saved workflow state used for recovery or resumption |
| **Interrupt** | A mechanism that pauses a workflow |
| **Autonomy** | The extent to which an agent can act independently |
| **Policy engine** | A component that evaluates rules and action permissions |
| **Authorization** | Determining whether a principal may perform an operation |
| **Authentication** | Verifying an identity |
| **Least privilege** | Giving a component only the permissions it needs |
| **Idempotency** | Preventing repeated requests from causing unintended duplicate effects |
| **Side effect** | A change to an external resource or system |
| **Escalation** | Transferring a request to another authorized reviewer or process |
| **Audit log** | A record of significant actions and decisions |
| **Action binding** | Connecting an approval to a specific action representation |
| **State transition** | A valid change from one workflow status to another |
| **Durable execution** | Execution designed to survive interruptions and process restarts |
| **Separation of duties** | Dividing sensitive responsibilities among different actors |
| **Risk-based approval** | Applying oversight according to an action's risk |
| **Fail-safe behavior** | Handling uncertainty in a way that avoids unauthorized or unsafe execution |
| **Reviewer fatigue** | Reduced attention caused by excessive or repetitive review requests |
| **Replay attack** | Reusing a previously valid request or decision improperly |
| **Concurrency control** | Preventing conflicting operations from corrupting shared state |
| **Revalidation** | Checking that an action remains valid and authorized before execution |

---

# 29. ✅ Completion Checklist

## Concepts

- [ ] I can explain Human-in-the-Loop and Human-on-the-Loop.
- [ ] I understand different levels of agent autonomy.
- [ ] I can identify actions requiring human review.
- [ ] I understand approval gates and workflow interrupts.
- [ ] I understand the difference between approval and execution.

## Implementation

- [ ] I can define structured approval models.
- [ ] I can implement policy outcomes.
- [ ] I can create, approve, reject, and expire requests.
- [ ] I can enforce valid state transitions.
- [ ] I can save and resume workflow state.
- [ ] I can bind approvals to specific actions.
- [ ] I can prevent unauthorized execution.
- [ ] I can handle duplicate attempts.
- [ ] I can record audit events.

## Security and reliability

- [ ] I understand authentication and authorization.
- [ ] I can explain separation of duties.
- [ ] I can handle timeouts and uncertain execution outcomes.
- [ ] I understand the need for atomic concurrency controls.
- [ ] I can test approval bypass attempts.
- [ ] I understand why sensitive operations should fail safely.

## Project

- [ ] I have built the Human-Supervised AI Action Agent.
- [ ] I have tested approval and rejection paths.
- [ ] I have tested expired and modified actions.
- [ ] I have tested duplicate execution prevention.
- [ ] I have documented the security boundaries.
- [ ] I can explain the complete workflow in an interview.

---

# 30. 📚 References

Use official documentation for current APIs and implementation details.

1. **LangGraph documentation** — Graph workflows, persistence, interrupts, and human review.  
   https://docs.langchain.com/oss/python/langgraph/overview

2. **OpenAI Agents SDK documentation** — Agent orchestration, tools, and application-level control patterns.  
   https://openai.github.io/openai-agents-python/

3. **Python documentation** — Dataclasses, enumerations, typing, exceptions, and testing fundamentals.  
   https://docs.python.org/3/

4. **OWASP** — Security guidance for authorization, input validation, and application controls.  
   https://owasp.org/

5. **NIST AI Risk Management Framework** — Guidance for managing AI-related risks and oversight.  
   https://www.nist.gov/itl/ai-risk-management-framework

6. **NIST Cybersecurity Framework** — Security governance, protection, detection, response, and recovery.  
   https://www.nist.gov/cyberframework

7. **PostgreSQL documentation** — Transactions, constraints, and durable database state.  
   https://www.postgresql.org/docs/

8. **HTTP Semantics, RFC 9110** — HTTP request and response behavior.  
   https://www.rfc-editor.org/rfc/rfc9110

9. **OWASP API Security Project** — API authorization and security risks.  
   https://owasp.org/www-project-api-security/

---

# 31. ➡️ Next Module

## Module 09 — Agentic RAG and Knowledge Workflows

**Folder:** `09-Agentic-RAG-and-Knowledge-Workflows`

In the next module, you will learn how agents retrieve information, search knowledge sources, evaluate evidence, and combine retrieval with multi-step reasoning.

Topics will include:

- Retrieval-Augmented Generation (RAG).
- Document ingestion and preprocessing.
- Chunking and metadata.
- Embeddings and vector databases.
- Semantic and hybrid search.
- Query transformation.
- Retrieval quality and reranking.
- Agent-controlled retrieval workflows.
- Tool-based knowledge search.
- Source attribution and grounded responses.
- Handling missing or conflicting evidence.
- Retrieval evaluation.
- Building a practical Agentic RAG project.

**Current milestone:** You have progressed from agent fundamentals and coordination to controlled execution with human approval.

**Next goal:** Build agents that can retrieve and use relevant knowledge reliably while preserving evidence and source traceability.

---

**End of Module 08 — Human-in-the-Loop and Approval** 🧑‍⚖️🤖