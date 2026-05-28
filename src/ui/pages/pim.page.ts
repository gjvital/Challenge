import { type Locator, type Page, expect } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly employeeTable: Locator;
  readonly employeeNameFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly addEmployeeButton: Locator;
  readonly noRecordsMessage: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb');
    this.employeeTable = page.locator('.oxd-table-body');
    this.employeeNameFilter = page
      .getByPlaceholder('Type for hints...')
      .first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.addEmployeeButton = page.getByRole('button', { name: 'Add' });
    this.noRecordsMessage = page
      .locator('.oxd-table-card')
      .getByText('No Records Found');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page
      .locator('.oxd-form-row')
      .filter({ hasText: 'Employee Id' })
      .locator('input:not([name])');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successToast = page.locator('.oxd-toast');
  }

  async goToEmployeeList(): Promise<void> {
    await this.page
      .getByRole('navigation', { name: 'Topbar Menu' })
      .getByRole('link', { name: 'Employee List' })
      .click();
  }

  async expectEmployeeListVisible(): Promise<void> {
    await this.goToEmployeeList();
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
    await expect(
      this.page.getByRole('heading', { name: 'Employee Information' }),
    ).toBeVisible();
    await expect(this.employeeTable).toBeVisible();
  }

  async searchEmployeeByName(name: string): Promise<void> {
    await this.employeeNameFilter.fill(name);
    const suggestion = this.page.locator('.oxd-autocomplete-option').filter({
      hasText: name,
    });
    if (await suggestion.first().isVisible()) {
      await suggestion.first().click();
    }
    await this.searchButton.click();
  }

  async expectSearchResultsOrNoRecords(name: string): Promise<void> {
    const recordsLabel = this.page.getByText(/\(\d+\) Records? Found/);
    await expect(recordsLabel).toBeVisible({ timeout: 15000 });

    const labelText = (await recordsLabel.textContent()) ?? '';
    if (labelText.includes('(0)')) {
      await expect(this.noRecordsMessage).toBeVisible();
      return;
    }

    await expect(
      this.employeeTable.getByText(name, { exact: false }).first(),
    ).toBeVisible();
  }

  async addEmployee(
    firstName: string,
    lastName: string,
    employeeId: string,
  ): Promise<void> {
    await this.page
      .getByRole('navigation', { name: 'Topbar Menu' })
      .getByRole('link', { name: 'Add Employee' })
      .click();
    await expect(this.page).toHaveURL(/pim\/addEmployee/);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (await this.employeeIdInput.isVisible()) {
      await this.employeeIdInput.clear();
      await this.employeeIdInput.fill(employeeId);
    }
    await this.saveButton.click();
  }

  async expectEmployeeCreated(firstName: string, lastName: string): Promise<void> {
    await expect(this.successToast).toContainText('Success', { timeout: 15000 });
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/);
    await expect(
      this.page.getByRole('heading', { name: `${firstName} ${lastName}` }),
    ).toBeVisible();
  }
}
