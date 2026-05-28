/**
 * Generates unique test data for UI and API scenarios.
 */
export function uniqueEmployeeId(): string {
  const suffix = Date.now().toString().slice(-6);
  return `EMP${suffix}`;
}

export function randomFirstName(): string {
  const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey'];
  return names[Math.floor(Math.random() * names.length)];
}

export function randomLastName(): string {
  const suffix = Date.now().toString().slice(-4);
  return `TestUser${suffix}`;
}

export function uniqueJobTitle(): string {
  return `QA Engineer ${Date.now()}`;
}
