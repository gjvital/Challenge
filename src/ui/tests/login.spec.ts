import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { config } from '../../utils/config';
import { loginAsAdmin } from '../../utils/login-helper';

test.describe('B1 — Login Functionality', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.ui.username, config.ui.password);

    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
    await dashboard.expectWidgetsVisible();
  });

  test('failed login with invalid password shows error message', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(config.ui.username, 'wrong-password-123');

    await expect(loginPage.invalidCredentialsAlert).toBeVisible();
    await expect(loginPage.invalidCredentialsAlert).toContainText('Invalid');
    await loginPage.expectOnLoginPage();
  });

  test('failed login with empty fields shows required validation', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(loginPage.requiredFieldMessages).toHaveCount(2);
    await expect(loginPage.requiredFieldMessages.first()).toContainText(
      'Required',
    );
    await loginPage.expectOnLoginPage();
  });

  test('logout returns user to login page', async ({ page }) => {
    const dashboard = await loginAsAdmin(page);
    await dashboard.logout();

    const loginPage = new LoginPage(page);
    await loginPage.expectOnLoginPage();
  });
});
