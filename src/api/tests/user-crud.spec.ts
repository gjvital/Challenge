import { test, expect } from '@playwright/test';
import { ReqResClient } from '../clients/reqres-client';
import { requireApiKey } from '../../utils/config';
import { uniqueJobTitle } from '../../utils/data-generator';

test.beforeAll(() => {
  requireApiKey();
});

test.describe('A1 — User CRUD Operations', () => {
  test('GET /api/users?page=2 returns paginated non-empty user list', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.getUsers({ page: 2 });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toMatchObject({
      page: 2,
      per_page: expect.any(Number),
      total: expect.any(Number),
      total_pages: expect.any(Number),
    });
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('id');
  });

  test('GET /api/users/{id} returns user with expected fields', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const userId = 2;
    const response = await client.getUserById(userId);

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.data).toMatchObject({
      id: userId,
      email: expect.stringMatching(/@/),
      first_name: expect.any(String),
      last_name: expect.any(String),
    });
    expect(body.data.first_name.length).toBeGreaterThan(0);
    expect(body.data.last_name.length).toBeGreaterThan(0);
  });

  test('POST /api/users creates user with id and createdAt', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const payload = { name: 'Gabriel Vital', job: uniqueJobTitle() };
    const response = await client.createUser(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body).toMatchObject({
      name: payload.name,
      job: payload.job,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
    expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date');
  });

  test('PUT /api/users/{id} updates user and reflects changes', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const userId = 2;
    const payload = { name: 'Updated Name', job: 'Senior QA Engineer' };
    const response = await client.updateUser(userId, payload);

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toMatchObject({
      name: payload.name,
      job: payload.job,
      updatedAt: expect.any(String),
    });
  });

  test('DELETE /api/users/{id} returns 204 No Content', async ({
    request,
  }) => {
    const client = new ReqResClient(request);
    const response = await client.deleteUser(2);

    expect(response.status()).toBe(204);
    const text = await response.text();
    expect(text).toBe('');
  });
});
