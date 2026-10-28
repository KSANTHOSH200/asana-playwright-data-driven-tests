
import { test } from '@playwright/test';
import scenariosJson from '../data/scenarios.json';
import {
  AsanaBoardPage,
  type Scenario,
} from '../pages/AsanaBoardPage';

const scenarios: Scenario[] = scenariosJson as Scenario[];

for (const scenario of scenarios) {
  test(
    `${scenario.id}: ${scenario.project} | ${scenario.task} | ${scenario.column}`,
    async ({ page }) => {
      const app = new AsanaBoardPage(page);

      await test.step('Log in to the demo application', async () => {
        await app.logIn();
      });

      await test.step(
        `Navigate to ${scenario.project}`,
        async () => {
          await app.openProject(scenario.project);
        },
      );

      await test.step(
        `Verify task column and tags: ${scenario.tags.join(', ')}`,
        async () => {
          await app.expectTask(scenario);
        },
      );
    },
  );
}
