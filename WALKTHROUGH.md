# Suggested 2-3 minute evaluation video script

Aim for about 2 minutes 30 seconds. Share your screen and show the editor, then the test run. Use your real test results rather than claiming a pass that you haven't seen.

**0:00-0:20 | Goal and structure**

"Hi, this is my Playwright evaluation for the Asana-like demo application. The goal was to automate all six acceptance cases in JavaScript or TypeScript while keeping the implementation data-driven. I chose TypeScript for type safety, and I separated test data, UI interaction logic, and test orchestration."

**0:20-0:55 | JSON data**

[Open `data/scenarios.json`.]

"Here are the six acceptance cases. Each JSON entry has a test ID, project, task title, expected column, and tags. For example, user authentication belongs in To Do and must have Feature and High Priority. Offline mode belongs in In Progress on the mobile project. If a new case is added, I just add a JSON object. I don't need to copy-paste a new test."

**0:55-1:25 | Test orchestration**

[Open `tests/tasks.spec.ts`.]

"The test file loops through the JSON objects and generates a separate named Playwright test for each. Every test follows the same three steps: log in, navigate to the project, and check the task. I kept these tests independent, instead of requiring an earlier test to succeed."

**1:25-2:05 | Assertions and maintainability**

[Open `pages/AsanaBoardPage.ts`.]

"The page object handles login and navigation. The key test design decision is scope. I don't merely check whether a task title appears somewhere on the page. I identify the expected column and verify that the task belongs to that column. Then I scope tag checks to the task card, so a Feature or High Priority badge on a neighboring card won't incorrectly satisfy the test. I also use exact-text assertions to avoid substring false positives."

**2:05-2:30 | Execution and QA**

[Run `npm test` and display your real result, or show the HTML report.]

"Here I'm running the suite in Chromium. Playwright reports each scenario separately. If something fails, the HTML report and retained screenshots, traces and video help troubleshoot it. I also included a GitHub Actions workflow so the suite runs on future changes."

**2:30-2:40 | Closing**

"Overall, the suite is data-driven, easy to extend, and designed to verify the task's actual column and tags, not just whether text appears on the page. Thanks for reviewing."

## Recording tips

- Use VS Code or another code editor and show the JSON file, test file, page object and CLI/report.
- Keep the entire screen focused on the relevant content. Increase text zoom if necessary.
- Remove your editor's personal information, access tokens and unrelated tabs from the recording.
- If one or more tests fail, fix and rerun them before recording your submission result.
- The script is a template. Adjust the final execution sentence to match what you actually see.
