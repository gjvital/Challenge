import { type Locator, type Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly headerTitle: Locator;
  readonly sideMenu: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly buzzPostsWidget: Locator;
  readonly employeesOnLeaveWidget: Locator;
  readonly employeeDistributionWidget: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerTitle = page.locator('.oxd-topbar-header-breadcrumb');
    this.sideMenu = page.getByRole('navigation', { name: 'Sidepanel' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
    this.timeAtWorkWidget = page.getByText('Time at Work', { exact: true });
    this.myActionsWidget = page.getByText('My Actions', { exact: true });
    this.quickLaunchWidget = page.getByText('Quick Launch', { exact: true });
    this.buzzPostsWidget = page.getByText('Buzz Latest Posts', { exact: true });
    this.employeesOnLeaveWidget = page.getByText('Employees on Leave Today', {
      exact: true,
    });
    this.employeeDistributionWidget = page.getByText(
      'Employee Distribution by Sub Unit',
      { exact: true },
    );
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/index/);
    await expect(this.headerTitle).toContainText('Dashboard');
    await expect(this.sideMenu).toBeVisible();
  }

  async expectWidgetsVisible(): Promise<void> {
    await expect(this.timeAtWorkWidget).toBeVisible();
    await expect(this.myActionsWidget).toBeVisible();
    await expect(this.quickLaunchWidget).toBeVisible();
    await expect(this.buzzPostsWidget).toBeVisible();
    await expect(this.employeesOnLeaveWidget).toBeVisible();
    await expect(this.employeeDistributionWidget).toBeVisible();
  }

  async openSideMenuItem(name: string): Promise<void> {
    await this.sideMenu.getByRole('link', { name, exact: true }).click();
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }
}
