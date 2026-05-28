import { test } from '@playwright/test';
import { PimPage } from '../pages/pim.page';
import { loginAsAdmin } from '../../utils/login-helper';
import {
  randomFirstName,
  randomLastName,
  uniqueEmployeeId,
} from '../../utils/data-generator';
import employeeData from '../fixtures/employees.json';

test.describe('B2 — Employee Directory (PIM Module)', () => {
  test('navigate to PIM displays employee list', async ({ page }) => {
    const dashboard = await loginAsAdmin(page);
    await dashboard.openSideMenuItem('PIM');

    const pim = new PimPage(page);
    await pim.expectEmployeeListVisible();
  });

  test('search for employee by name shows results or no records message', async ({
    page,
  }) => {
    const dashboard = await loginAsAdmin(page);
    await dashboard.openSideMenuItem('PIM');

    const pim = new PimPage(page);
    await pim.expectEmployeeListVisible();
    await pim.searchEmployeeByName(employeeData.searchByName);
    await pim.expectSearchResultsOrNoRecords(employeeData.searchByName);
  });

  test('add new employee saves successfully', async ({ page }) => {
    const dashboard = await loginAsAdmin(page);
    await dashboard.openSideMenuItem('PIM');

    const pim = new PimPage(page);
    const firstName = randomFirstName();
    const lastName = randomLastName();
    const employeeId = uniqueEmployeeId();

    await pim.addEmployee(firstName, lastName, employeeId);
    await pim.expectEmployeeCreated(firstName, lastName);
  });
});
