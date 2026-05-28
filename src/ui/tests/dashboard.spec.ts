import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../../utils/login-helper';
import { DashboardPage } from '../pages/dashboard.page';
import { PimPage } from '../pages/pim.page';

test.describe('B3 — Dashboard Validation', () => {
  test('dashboard widgets are visible after login', async ({ page }) => {
    const dashboard = await loginAsAdmin(page);
    await dashboard.expectWidgetsVisible();
  });

  test('sidebar navigation opens expected modules', async ({ page }) => {
    const dashboard = await loginAsAdmin(page);

    const navigationCases = [
      { menu: 'Admin', urlPattern: /admin\/view/ },
      { menu: 'PIM', urlPattern: /pim\/view/ },
      { menu: 'Leave', urlPattern: /leave\/view/ },
      { menu: 'Buzz', urlPattern: /buzz\/view/ },
    ];

    for (const { menu, urlPattern } of navigationCases) {
      await dashboard.openSideMenuItem(menu);
      await expect(page).toHaveURL(urlPattern);

      await dashboard.openSideMenuItem('Dashboard');
      await dashboard.expectLoaded();
    }
  });
});
