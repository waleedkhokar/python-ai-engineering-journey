
# 🌐 Module 09 — Browser and Computer Use

Learn how to build automation systems that interact with websites, inspect web pages, fill forms, click buttons, capture screenshots, and use browser tools safely.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 09 — Browser and Computer Use |
| Planned Date | Sep 14, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–08 |
| Primary Language | Python |
| Tools | Playwright, Python, pytest, Browser DevTools |
| Main Focus | Browser automation, DOM interaction, screenshots, navigation, and safe computer use |
| Next Module | 10 — Agent Evaluation and Testing |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain browser automation and computer-use agents.
- Understand the DOM and how browser elements are located.
- Automate navigation, clicks, text input, and form submission.
- Use Playwright with Python.
- Capture screenshots and extract page content.
- Handle dynamic pages, timeouts, and browser errors.
- Distinguish browser automation from direct API integration.
- Understand browser sessions, cookies, and authentication risks.
- Add browser automation as a controlled agent tool.
- Apply safety checks before consequential browser actions.

---

## 1. What Is Browser Automation?

Browser automation means controlling a web browser through code instead of performing every interaction manually.

For example, an automation program might:

1. Open a website.
2. Navigate to a specific page.
3. Locate a search field.
4. Enter a query.
5. Submit the search.
6. Extract relevant information.
7. Save the results.

Browser automation is commonly used for testing, repetitive business processes, data collection where permitted, and website interaction.

### Example architecture

```text
User Goal
   |
   v
AI Agent
   |
   v
Browser Tool
   |
   v
Automation Controller
   |
   v
Browser / Website
   |
   v
Page Content and Observations
   |
   v
Validate Result
   |
   v
Agent Response
```

The agent may decide which action to request, but the automation controller should enforce allowed actions, validate inputs, and handle execution.

## 2. Browser Automation vs. Computer Use

These concepts overlap, but they are not identical.

| Concept | Description | Example |
|---|---|---|
| Browser automation | Controls browser elements through automation APIs | Fill a web form using Playwright |
| Computer use | Interacts with a graphical desktop or application | Click a visible desktop button |
| DOM interaction | Locates elements in the page structure | Find a button by its accessible name |
| Visual interaction | Uses screenshots and screen coordinates | Click a button based on its position |
| API integration | Communicates directly with a service | Retrieve records through a REST endpoint |

**Prefer an API when a suitable, authorized API exists.** Browser automation is useful when the task genuinely requires interacting with a website interface.

Visual computer use can handle interfaces without convenient DOM access, but screen coordinates and visual interpretation can be less reliable.

---

## 3. Understand the DOM

The Document Object Model (DOM) represents a webpage as a structured collection of elements.

Consider this HTML:

```html
<form>
  <label for="search">Search products</label>
  <input id="search" name="query" />
  <button type="submit">Search</button>
</form>
```

A browser automation tool can locate the input and button using their roles, labels, or attributes.

For example:

```python
page.get_by_label("Search products").fill("laptop")
page.get_by_role("button", name="Search").click()
```

This is generally more maintainable than relying on screen coordinates.

### Common locator strategies

| Locator | Example | Best Use |
|---|---|---|
| Role | `get_by_role("button", name="Save")` | Accessible interactive elements |
| Label | `get_by_label("Email")` | Form fields with associated labels |
| Text | `get_by_text("Welcome")` | Visible text |
| Placeholder | `get_by_placeholder("Search")` | Fields with placeholder text |
| Test ID | `get_by_test_id("submit-button")` | Explicit test identifiers |
| CSS selector | `locator("#search")` | Specific DOM attributes |

Prefer accessible roles and labels where possible. Fragile selectors based on deeply nested DOM structure can break when the website changes.

---

## 4. Install Playwright

Playwright is a browser automation library that supports Chromium, Firefox, and WebKit.

Create and activate a virtual environment:

```bash
python -m venv .venv
```

Install the dependency:

```bash
pip install playwright
```

Install Chromium:

```bash
playwright install chromium
```

For operating-system dependencies on Linux, follow the official installation instructions.

Documentation: [Playwright for Python](https://playwright.dev/python/docs/intro)

---

## 5. Your First Browser Automation Script

Create `first_browser.py`:

```python
from playwright.sync_api import sync_playwright


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        try:
            page = browser.new_page()
            page.set_default_timeout(10_000)

            page.goto(
                "https://example.com",
                wait_until="domcontentloaded",
            )

            heading = page.locator("h1").inner_text()

            print("Page title:", page.title())
            print("Heading:", heading)

            page.screenshot(
                path="example-page.png",
                full_page=True,
            )

        finally:
            browser.close()


if __name__ == "__main__":
    main()
```

Run it:

```bash
python first_browser.py
```

### What happens?

1. Playwright starts Chromium.
2. The script opens a new page.
3. It navigates to a public demonstration website.
4. It extracts the page title and heading.
5. It saves a screenshot.
6. It closes the browser.

The `finally` block helps ensure the browser closes even if an error occurs.

The screenshot is written to the current working directory.

---

## 6. Interact with Forms and Buttons

Create `form_automation.py`:

```python
from playwright.sync_api import sync_playwright


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        try:
            page = browser.new_page()
            page.goto("https://example.com")

            # Demonstration only: locate a visible page heading.
            heading = page.get_by_role("heading", level=1)

            print(heading.inner_text())

        finally:
            browser.close()


if __name__ == "__main__":
    main()
```

This example uses a public demonstration page that does not contain a form. It demonstrates how to locate a semantic page element.

For a real form, use the same locator approach:

```python
page.get_by_label("Full name").fill("Test User")
page.get_by_label("Email").fill("test@example.com")
page.get_by_role("button", name="Continue").click()
```

The form fields must exist on the target page and match the supplied labels.

### Common interactions

```python
# Fill a text field
page.get_by_label("Username").fill("demo_user")

# Click a button
page.get_by_role("button", name="Continue").click()

# Select a dropdown option
page.get_by_label("Country").select_option("PK")

# Check a checkbox
page.get_by_role("checkbox", name="Accept terms").check()

# Read visible text
message = page.get_by_role("alert").inner_text()
```

Use these operations only on interfaces you are authorized to access. Before submitting a form, verify that the data and intended action are correct.

---

## 7. Waiting for Dynamic Content

Modern websites often render content after the initial HTML loads.

A common beginner mistake is to assume that a fixed sleep will always be enough:

```python
import time

time.sleep(5)
```

A fixed delay can make scripts slower and still fail when a website takes longer than expected.

Instead, use locators and explicit conditions.

```python
from playwright.sync_api import expect

page.goto("https://example.com")

heading = page.get_by_role(
    "heading",
    name="Example Domain",
)

expect(heading).to_be_visible()
```

Playwright automatically waits for relevant actionability conditions before many interactions. Its assertions can also wait for a condition to become true.

Reference: [Playwright auto-waiting](https://playwright.dev/python/docs/actionability)

### Useful waiting strategies

- Wait for a specific element to appear.
- Wait for a result message to become visible.
- Wait for navigation when an action triggers it.
- Set reasonable timeouts.
- Capture diagnostic information when a wait fails.

Do not disable actionability checks just to make a failing click succeed. Investigate why the target element is not ready.

---

## 8. Browser Sessions, Cookies, and Authentication

A browser session may contain cookies, local storage, and other authentication state.

Playwright supports isolated browser contexts, allowing separate sessions to use independent browser state.

```python
from playwright.sync_api import sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch()

    try:
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://example.com")

        print(page.title())

        context.close()

    finally:
        browser.close()
```

### Security considerations

- Do not save authentication state in a public repository.
- Do not expose session cookies or access tokens in logs.
- Use a dedicated test account for learning.
- Keep browser sessions isolated when appropriate.
- Do not attempt to bypass access controls or multi-factor authentication.
- Obtain explicit authorization before automating private or sensitive accounts.

For production applications, follow the service's approved authentication process.

---

## 9. Add Browser Automation as an Agent Tool

An agent can request a browser operation through a controlled tool interface.

However, **do not give an LLM unrestricted access to arbitrary URLs, browser scripts, or desktop actions.**

Start with a small set of approved operations.

Create `browser_tool.py`:

```python
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


ALLOWED_HOSTS = {"example.com"}


def read_page_title(url: str) -> dict:
    parsed = urlparse(url)

    if parsed.scheme != "https":
        raise ValueError("Only HTTPS URLs are allowed")

    if parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("This domain is not allowed")

    if parsed.username or parsed.password:
        raise ValueError("URLs containing credentials are not allowed")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        try:
            page = browser.new_page()
            page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=10_000,
            )

            return {
                "url": page.url,
                "title": page.title(),
            }

        finally:
            browser.close()


if __name__ == "__main__":
    print(read_page_title("https://example.com"))
```

### What does this tool demonstrate?

- An explicit allowlist.
- HTTPS-only navigation.
- A navigation timeout.
- A small, predefined browser capability.
- Structured output that an agent can interpret.

**Important production limitation:** checking a hostname alone does not fully prevent server-side request forgery (SSRF). Redirects, DNS resolution, alternate IP representations, and access to private network addresses require additional controls. A production system should enforce destination restrictions at the network layer and validate every redirect destination.

Register this function with your chosen agent framework only after applying the appropriate validation and execution policies.

---

## 10. Browser Agents Need More Than Clicks

A reliable browser agent follows an observe–act–verify loop.

```text
Receive Goal
     |
     v
Inspect Current Page
     |
     v
Select an Allowed Action
     |
     v
Validate Action
     |
     v
Execute Browser Action
     |
     v
Inspect Result
     |
     v
Did It Succeed?
   /       \
 Yes        No
  |          |
  v          v
Continue   Recover or Stop
```

For example, an agent asked to find a product should not assume that clicking a search button succeeded. It should inspect the resulting page and verify that relevant results appeared.

For consequential operations, the agent should also verify that the action is authorized and request human approval when required.

---

## 11. Browser Automation vs. Visual Computer Use

| Feature | DOM-Based Browser Automation | Visual Computer Use |
|---|---|---|
| Interaction | DOM elements and browser APIs | Screenshots, coordinates, or desktop controls |
| Element identification | Roles, labels, text, selectors | Visual appearance and screen position |
| Reliability | Often more stable with good locators | Can be affected by layout and display changes |
| Best use | Websites with accessible DOM elements | Interfaces where DOM access is unavailable |
| Verification | DOM assertions and page state | Screenshots and visual state checks |
| Typical risks | Wrong locator or unintended action | Misidentified controls or coordinate errors |

Visual interaction can be useful for desktop applications, remote desktops, and interfaces without suitable automation APIs.

It requires careful verification because a coordinate that was correct a moment ago may point somewhere else after the interface changes.

---

## 12. Testing and Troubleshooting

### Common problems

| Problem | Possible Cause | What to Try |
|---|---|---|
| Browser does not launch | Browser binaries are missing | Run `playwright install chromium` |
| Locator times out | Wrong locator or missing element | Inspect the page and verify the accessible name |
| Click has no effect | Wrong target or application state | Verify the result and inspect page behavior |
| Script is flaky | Dynamic content or unstable selectors | Use locators, assertions, and explicit conditions |
| Navigation fails | Network, certificate, or website error | Check the URL and browser error |
| Screenshot is missing | Wrong output directory or failed execution | Check the current working directory and logs |
| Authentication fails | Expired session or missing permissions | Use the approved authentication process |

### Capture a screenshot when debugging

```python
page.screenshot(
    path="debug-page.png",
    full_page=True,
)
```

Screenshots help diagnose unexpected page states. Be careful: screenshots can contain private data, so do not publish them without reviewing their contents.

Reference: [Playwright screenshots](https://playwright.dev/python/docs/screenshots)

---

## 13. Hands-On Exercises

### Beginner

- [ ] Launch Chromium with Playwright.
- [ ] Open a public demonstration website.
- [ ] Extract its title and heading.
- [ ] Save a screenshot.
- [ ] Practice locating elements by role and text.

### Intermediate

- [ ] Automate a form on a local test website.
- [ ] Add explicit assertions.
- [ ] Handle timeouts and missing elements.
- [ ] Save screenshots when tests fail.
- [ ] Create isolated browser contexts.

### Advanced

- [ ] Create a browser tool with a strict domain allowlist.
- [ ] Add the tool to a simple AI agent.
- [ ] Make the agent verify the result of each action.
- [ ] Add a human-approval checkpoint before a sensitive action.
- [ ] Test unexpected redirects and blocked destinations.
- [ ] Record structured execution logs without exposing secrets.

---

## 14. Project — Website Research Assistant

Build a small agent that gathers information from approved public websites.

### Requirements

1. Accept a research question.
2. Use a fixed allowlist of permitted websites.
3. Open an approved page.
4. Extract relevant page text.
5. Return the page title, URL, and extracted content.
6. Summarize the information with an LLM if configured.
7. Treat website content as untrusted input.
8. Verify that the gathered information addresses the question.
9. Save structured results.
10. Record failures and timeouts.

### Suggested project structure

```text
09-Browser-and-Computer-Use/
├── README.md
├── browser/
│   ├── browser_tool.py
│   └── page_reader.py
├── agent/
│   └── research_agent.py
├── tests/
│   └── test_browser_tool.py
└── outputs/
    └── .gitkeep
```

Do not commit browser profiles, cookies, private screenshots, or API credentials.

**Success criteria:** the project accesses only approved destinations, handles missing content, reports failures clearly, and verifies its outputs.

---

## 15. Interview Questions and Answers

**Q1. What is browser automation?**

Browser automation uses software to navigate websites and interact with page elements programmatically.

**Q2. What is the DOM?**

The Document Object Model represents a webpage as structured elements that programs can inspect and interact with.

**Q3. What is Playwright?**

Playwright is a browser automation framework that supports Chromium, Firefox, and WebKit.

**Q4. Why are semantic locators useful?**

Locators based on roles and labels often reflect how users perceive the page and are more maintainable than fragile selectors.

**Q5. Why is explicit waiting important?**

Web applications can load and update asynchronously. Waiting for a specific condition reduces timing-related failures.

**Q6. What is a browser context?**

A browser context provides an isolated browser session with its own page and session state.

**Q7. When should you use an API instead of browser automation?**

Use a suitable, authorized API when it provides the required functionality more directly and reliably.

**Q8. What is visual computer use?**

Visual computer use interacts with an interface using screenshots, visual interpretation, and screen or desktop controls.

**Q9. How can browser agents be made safer?**

Restrict destinations and actions, validate inputs, use isolated sessions, verify outcomes, protect credentials, and require approval for consequential operations.

**Q10. Why should a browser agent verify its actions?**

A successful click does not guarantee that the intended operation succeeded. Verification helps detect unexpected results and recover safely.

---

## 16. Completion Checklist

- [ ] I understand browser automation and computer use.
- [ ] I understand the DOM and locator strategies.
- [ ] I installed Playwright and launched Chromium.
- [ ] I extracted page information and captured a screenshot.
- [ ] I understand dynamic content and waiting strategies.
- [ ] I understand browser contexts and authentication risks.
- [ ] I created a controlled browser tool.
- [ ] I understand destination restrictions and SSRF risks.
- [ ] I tested error handling and verified outcomes.
- [ ] I completed the Website Research Assistant or an equivalent exercise.

---

## 🔑 Key Takeaways

- Browser automation allows programs to interact with websites.
- Playwright provides APIs for navigation, element interaction, assertions, and screenshots.
- Reliable automation uses semantic locators and explicit verification.
- Browser sessions and credentials must be protected.
- Agents should have limited, approved browser capabilities.
- External webpage content is untrusted and may contain malicious instructions.
- Human approval is important before consequential actions.

## 🚀 Next Module — Agent Evaluation and Testing

In Module 10, you will learn how to test agent behavior, evaluate tool selection, measure task success, identify failure patterns, and improve reliability through repeatable evaluations.

**Suggested commit message:**

```text
Sep 14, 2026 — Day 10: Browser and computer use — agents that interact with the web
```

---

## 📚 Official References

- [Playwright for Python — Installation](https://playwright.dev/python/docs/intro)
- [Playwright — Locators](https://playwright.dev/python/docs/locators)
- [Playwright — Auto-waiting](https://playwright.dev/python/docs/actionability)
- [Playwright — Screenshots](https://playwright.dev/python/docs/screenshots)
