import { test, expect } from '@playwright/test';
import { ReqResClient } from '../clients/reqres-client';
import { requireApiKey, config } from '../../utils/config';
import {
  compileSchema,
  assertValidSchema,
} from '../../utils/schema-validator';
import {
  userListResponseSchema,
  type UserListResponse,
} from '../schemas/user-list.schema';

test.beforeAll(() => {
  requireApiKey();
});

const userListValidator = compileSchema<UserListResponse>(
  userListResponseSchema,
);

test.describe('A3 — Advanced Scenarios', () => {
  test('GET /api/users/{id} with non-existent ID returns 404 and empty body', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.getUserById(9999);

    expect(response.status()).toBe(404);
    const text = await response.text();
    expect(['', '{}'].includes(text.trim())).toBeTruthy();
  });

  test('GET /api/users?delay=3 responds within timeout with valid data', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const start = Date.now();
    const response = await client.getUsers({ delay: 3 });
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(config.api.delayTimeoutMs);
    expect(elapsed).toBeGreaterThanOrEqual(2500);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/users response matches JSON schema', async ({ request }) => {
    const client = new ReqResClient(request);
    const response = await client.getUsers({ page: 1 });

    expect(response.status()).toBe(200);
    const body = await response.json();
    assertValidSchema(userListValidator, body, 'GET /api/users');
    expect(body.page).toBe(1);
  });
});

test.describe('Data-driven user lookup', () => {
  const validUserIds = [1, 2, 3, 4, 5, 6];

  for (const userId of validUserIds) {
    test(`GET /api/users/${userId} returns matching user id`, async ({
      request,
    }) => {
      const client = new ReqResClient(request);
      const response = await client.getUserById(userId);

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(userId);
      expect(body.data.email).toMatch(/@reqres\.in|@/);
    });
  }
});
