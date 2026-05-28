import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidCredentialsAlert: Locator;
  readonly requiredFieldMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.invalidCredentialsAlert = page.locator('.oxd-alert-content-text');
    this.requiredFieldMessages = page.locator('.oxd-input-field-error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
    await expect(this.loginButton).toBeVisible();
  }
}
