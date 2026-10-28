
import { expect, type Page } from '@playwright/test';

export type Scenario = {
  id: string;
  project: string;
  task: string;
  column: 'To Do' | 'In Progress' | 'Done';
  tags: string[];
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class AsanaBoardPage {
  constructor(private readonly page: Page) {}

  async logIn(): Promise<void> {
    await this.page.goto('/', {
      waitUntil: 'domcontentloaded',
    });

    await this.page
      .getByRole('textbox', { name: 'Username' })
      .fill(process.env.DEMO_USERNAME ?? 'admin');

    await this.page
      .getByLabel('Password', { exact: true })
      .fill(process.env.DEMO_PASSWORD ?? 'password123');

    await this.page
      .getByRole('button', { name: 'Sign in' })
      .click();

    await expect(
      this.page
        .getByRole('navigation')
        .getByRole('button', {
          name: /^Web Application(?:\s|$)/,
        }),
    ).toBeVisible();
  }

  async openProject(project: string): Promise<void> {
    const projectButton = this.page
      .getByRole('navigation')
      .getByRole('button', {
        name: new RegExp(
          `^${escapeRegExp(project)}(?:\\s|$)`,
        ),
      });

    await expect(projectButton).toBeVisible();
    await projectButton.click();

    await expect(
      this.page
        .getByRole('banner')
        .getByRole('heading', {
          name: project,
          exact: true,
          level: 1,
        }),
    ).toBeVisible();

    await expect(
      this.page.locator('main').getByRole('heading', {
        name: /^To Do\s*\(\d+\)$/,
        level: 2,
      }),
    ).toBeVisible();
  }

  async expectTask(scenario: Scenario): Promise<void> {
    const board = this.page.locator('main');

    // Match column headings with dynamic task counts.
    // Example: "To Do (2)", "In Progress (1)".
    const columnHeading = board.getByRole('heading', {
      name: new RegExp(
        `^${escapeRegExp(scenario.column)}\\s*\\(\\d+\\)$`,
      ),
      level: 2,
    });

    await expect(
      columnHeading,
      `Column "${scenario.column}" should exist`,
    ).toHaveCount(1);

    // Scope the task search to its expected column.
    const column = columnHeading.locator('xpath=..');

    const taskHeading = column.getByRole('heading', {
      name: scenario.task,
      exact: true,
      level: 3,
    });

    await expect(
      taskHeading,
      `"${scenario.task}" must be in "${scenario.column}"`,
    ).toHaveCount(1);

    await expect(taskHeading).toBeVisible();

    // Check tags within the matching task card only.
    const card = taskHeading.locator('xpath=..');

    for (const tag of scenario.tags) {
      await expect(
        card.getByText(tag, { exact: true }),
        `"${scenario.task}" should have tag "${tag}"`,
      ).toBeVisible();
    }
  }
}
