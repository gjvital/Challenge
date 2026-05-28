import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  api: {
    baseUrl: process.env.API_BASE_URL ?? 'https://reqres.in',
    apiKey: process.env.REQRES_API_KEY ?? '',
    env: process.env.REQRES_ENV ?? 'prod',
    timeoutMs: Number(process.env.API_TIMEOUT_MS ?? 15000),
    delayTimeoutMs: Number(process.env.API_DELAY_TIMEOUT_MS ?? 10000),
  },
  ui: {
    baseUrl:
      process.env.UI_BASE_URL ??
      'https://opensource-demo.orangehrmlive.com',
    username: process.env.UI_USERNAME ?? 'Admin',
    password: process.env.UI_PASSWORD ?? 'admin123',
  },
} as const;

export function requireApiKey(): string {
  const key = config.api.apiKey.trim();
  if (!key || key === 'your_api_key_here') {
    throw new Error(
      'REQRES_API_KEY is missing. Copy .env.example to .env and add a free key from https://app.reqres.in',
    );
  }
  return key;
}
