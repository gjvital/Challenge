import { type Page } from '@playwright/test';
import { LoginPage } from '../ui/pages/login.page';
import { DashboardPage } from '../ui/pages/dashboard.page';
import { config } from './config';

/**
 * Reusable helper: performs login and waits for the dashboard to load.
 */
export async function loginAsAdmin(page: Page): Promise<DashboardPage> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.ui.username, config.ui.password);

  const dashboard = new DashboardPage(page);
  await dashboard.expectLoaded();
  return dashboard;
}
