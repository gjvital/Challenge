import { test, expect } from '@playwright/test';
import { ReqResClient } from '../clients/reqres-client';
import { requireApiKey } from '../../utils/config';

test.beforeAll(() => {
  requireApiKey();
});

test.describe('A2 — Authentication & Negative Testing', () => {
  test('POST /api/register succeeds with valid payload and returns token', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.register({
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(10);
  });

  test('POST /api/register fails when password is missing', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.register({
      email: 'eve.holt@reqres.in',
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(String(body.error).toLowerCase()).toMatch(/password|missing/);
  });

  test('POST /api/login succeeds and returns token', async ({ request }) => {
    const client = new ReqResClient(request);
    const response = await client.login({
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe('string');
  });

  test('POST /api/login fails with missing credentials', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.login({});

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });
});
