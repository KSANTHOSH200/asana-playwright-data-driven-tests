# Asana-like Demo: Data-Driven Playwright Evaluation

A TypeScript/Playwright end-to-end suite that validates task placement and tags in the [evaluation demo](https://create-asana-like-pr-39y5.bolt.host/).

The acceptance criteria are represented as **six JSON-driven test cases**. Each case logs in, opens its specified project, verifies the task is under the specified board column, and validates its exact tags.

## Prerequisites

- Node.js 20+ (22 recommended)
- npm
- Network access to the demo website

## Install and run

```bash
npm install
npx playwright install chromium
npm test
```

Other commands:

```bash
npm run test:list     # List the six generated scenarios
npm run test:headed   # Watch browser interactions
npm run test:ui       # Interactive Playwright UI
npm run test:report   # Open the generated HTML report
npm run typecheck     # TypeScript validation
```

By default the tests use the provided public demo account (`admin` / `password123`). Optional environment variables can override the defaults:

```bash
BASE_URL=https://create-asana-like-pr-39y5.bolt.host/ \
DEMO_USERNAME=admin DEMO_PASSWORD=password123 npm test
```

In PowerShell:

```powershell
$env:DEMO_USERNAME='admin'; $env:DEMO_PASSWORD='password123'; npm test
```

## Data-driven coverage

| ID | Project | Task | Expected column | Expected tags |
|---|---|---|---|---|
| TC-01 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| TC-02 | Web Application | Fix navigation bug | To Do | Bug |
| TC-03 | Web Application | Design system updates | In Progress | Design |
| TC-04 | Mobile Application | Push notification system | To Do | Feature |
| TC-05 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| TC-06 | Mobile Application | App icon design | Done | Design |

New scenarios are added as entries in [`data/scenarios.json`](data/scenarios.json), without duplicating the test workflow. The loop in [`tests/tasks.spec.ts`](tests/tasks.spec.ts) automatically generates a separate Playwright test for each JSON entry.

## Project structure

```text
.
├── .github/workflows/playwright.yml  # Runs tests in GitHub Actions
├── data/scenarios.json                # Test inputs and expected values
├── pages/AsanaBoardPage.ts            # Login, project navigation, assertions
├── tests/tasks.spec.ts                # Data-driven test generator
├── playwright.config.ts              # Browser, reporting, debugging settings
├── package.json
├── tsconfig.json
└── WALKTHROUGH.md                     # Suggested 2-3 minute video script
```

## Why these assertions?

- **Independent tests:** Playwright starts each test in an isolated browser context, so a failed scenario does not poison the next one.
- **Column scoping:** Finding the title anywhere on the page is insufficient. We locate the relevant column heading and reject ancestor containers that span other board columns.
- **Card scoping:** Tags must be inside the task's card. The search refuses to expand into a column header or another named task card.
- **Exact-text checks:** `Feature` cannot accidentally match unrelated text such as `New Feature Request`.
- **Failure diagnostics:** HTML reports, screenshots, videos and traces are retained on test failures, including in CI.

### UI locator note

This suite uses visible user-facing text and ancestor-scoped checks because the target app does not provide a documented selector contract. Prefer stable `data-testid` attributes or accessible board-column/card roles if the app's DOM is available to maintain. Before submission, run the tests against the live demo and adjust selectors **based on the inspected DOM**, if necessary. Never describe a suite as passing without executing it.

## CI

The GitHub Actions workflow installs Node and Chromium, type-checks and runs the suite on pushes to `main` and pull requests. It uploads the Playwright report and failure artifacts even if a test fails.

## Submission checklist

- [ ] Run `npm test` against the live demo and confirm six passed tests.
- [ ] Run `npm run typecheck`.
- [ ] Review screenshots / traces for failures and fix any locator differences.
- [ ] Publish this directory as a **public** GitHub repository.
- [ ] Record a 2-3 minute walkthrough showing JSON, reusable test code, results and design decisions.
- [ ] Paste the public repository URL and upload the video to the evaluation Google Form.

**Verification status:** The files were prepared and statically checked in an environment that blocks direct browser navigation to the demo. Live end-to-end execution is **not verified** here. The checklist above is required before submission.
