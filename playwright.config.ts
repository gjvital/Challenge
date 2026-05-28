import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiBaseURL = process.env.API_BASE_URL ?? 'https://reqres.in';
const uiBaseURL =
  process.env.UI_BASE_URL ?? 'https://opensource-demo.orangehrmlive.com';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: 'src/api/tests',
      use: {
        baseURL: apiBaseURL,
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: {
          'x-api-key': process.env.REQRES_API_KEY ?? '',
          'X-Reqres-Env': process.env.REQRES_ENV ?? 'prod',
          'User-Agent': 'Constellation-QA-Challenge/1.0',
        },
      },
      timeout: Number(process.env.API_TIMEOUT_MS ?? 15000),
    },
    {
      name: 'ui',
      testDir: 'src/ui/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBaseURL,
        headless: true,
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
      timeout: 60000,
    },
  ],
});
