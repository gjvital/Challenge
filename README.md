# Challenge

QA automation take-home for Constellation Automotive Group.

**Stack:** TypeScript, Playwright Test, Ajv (schema validation)

End-to-end test automation suite covering **ReqRes API** (Part A) and **OrangeHRM Demo** UI (Part B), aligned with the take-home challenge requirements.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 recommended)
- npm 9+

## Quick start

```bash
# 1. Install dependencies
npm install
# Windows/corporate proxy SSL issue? Use:
# npm install --strict-ssl=false

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Configure environment
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

# 4. Add your free ReqRes API key to .env (required for Part A — see below)

# 5. Run all tests
npm test
```

## Before you submit (checklist)

1. Set `REQRES_API_KEY` in `.env` (free at [app.reqres.in](https://app.reqres.in)).
2. Run `npm test` — expect **27 passed** (18 API + 9 UI).
3. Confirm `playwright-report/` is generated (`npm run report` to view).
4. Do **not** commit `.env` or `node_modules/`.
5. Push as a Git repo with incremental commits.

### ReqRes API key (required for Part A)

As of 2026, [ReqRes](https://reqres.in/) requires an `x-api-key` header on all `/api/*` requests. The challenge PDF predates this change.

1. Sign up free at [https://app.reqres.in](https://app.reqres.in)
2. Copy your API key into `.env`:

```env
REQRES_API_KEY=your_actual_key_here
```

Without a valid key, API tests fail fast with a clear message in `beforeAll`.

## Running tests

| Command | Description |
|---------|-------------|
| `npm test` | Run API + UI suites |
| `npm run test:api` | Part A only |
| `npm run test:ui` | Part B only (headless) |
| `npm run test:headed` | UI tests with browser visible |
| `npm run report` | Open HTML report after a run |

Reports are generated under `playwright-report/` (HTML) and `reports/test-results.json` (JSON).

## Project structure

```
├── src/
│   ├── api/
│   │   ├── clients/reqres-client.ts   # Reusable HTTP client
│   │   ├── schemas/                   # Ajv JSON schemas
│   │   └── tests/                     # A1–A3 scenarios
│   ├── ui/
│   │   ├── pages/                     # POM: Login, Dashboard, PIM
│   │   ├── tests/                     # B1–B3 scenarios
│   │   └── fixtures/                  # Test data
│   └── utils/                         # Config, schema helper, login helper, data generator
├── playwright.config.ts
├── .env.example
└── .github/workflows/ci.yml
```

## Design decisions

### API layer

- **ReqResClient** centralizes endpoints; base URL and API key come from `src/utils/config.ts` (loaded via `dotenv`), not hardcoded in tests.
- **Schema validation** (Ajv + `ajv-formats`) on `GET /api/users` list responses.
- **Data-driven tests** iterate user IDs 1–6 with the same assertion logic.
- Tests are **order-independent**; no shared mutable state between specs.

### UI layer

- **Page Object Model** with three page classes: `LoginPage`, `DashboardPage`, `PimPage`.
- **Explicit waits** via Playwright `expect` auto-retrying assertions — no `sleep()` or fixed delays.
- **`loginAsAdmin`** helper reuses login flow across PIM and dashboard tests.
- **`data-generator`** utility produces unique employee IDs and names for the add-employee scenario.
- **Screenshots on failure** enabled globally in `playwright.config.ts` (`screenshot: 'only-on-failure'`).
- Runs **headless** by default; UI project uses Desktop Chrome.

### CI

GitHub Actions workflow runs API and UI projects separately. Add `REQRES_API_KEY` as a repository secret for API jobs in CI.

## Test coverage map

### Part A — API (ReqRes)

| # | Scenario | File |
|---|----------|------|
| A1 | User CRUD (GET list, GET by id, POST, PUT, DELETE 204) | `user-crud.spec.ts` |
| A2 | Register/login success + negative cases | `auth-negative.spec.ts` |
| A3 | 404 user, delay=3, schema validation, data-driven IDs | `advanced.spec.ts` |

### Part B — UI (OrangeHRM)

| # | Scenario | File |
|---|----------|------|
| B1 | Login success/failure/logout | `login.spec.ts` |
| B2 | PIM navigation, search, add employee | `pim.spec.ts` |
| B3 | Dashboard widgets, sidebar navigation | `dashboard.spec.ts` |

## Assumptions & known issues

- **ReqRes authentication:** Demo register/login use fixture credentials documented by ReqRes (`eve.holt@reqres.in` / `pistol` or `cityslicka`).
- **OrangeHRM demo:** Shared environment; occasional slowness may require CI retries (configured with `retries: 2` in CI).
- **POST/PUT/DELETE on `/api/users`:** ReqRes echoes payloads; persistence is simulated (acceptable for contract testing).
- If OrangeHRM URL is unavailable, update `UI_BASE_URL` in `.env` and document the substitute in this README.

## Optional enhancements included

- GitHub Actions CI workflow
- HTML + JSON Playwright reporters
- CI retry configuration for flaky UI runs

## License

MIT — submission for Constellation Automotive Group technical evaluation.
