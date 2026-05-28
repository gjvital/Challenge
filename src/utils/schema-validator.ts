import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function compileSchema<T>(schema: object): ValidateFunction<T> {
  return ajv.compile<T>(schema);
}

export function assertValidSchema<T>(
  validator: ValidateFunction<T>,
  data: unknown,
  context: string,
): asserts data is T {
  const valid = validator(data);
  if (!valid) {
    const details = (validator.errors ?? [])
      .map((e: ErrorObject) => `${e.instancePath} ${e.message}`)
      .join('; ');
    throw new Error(`Schema validation failed for ${context}: ${details}`);
  }
}
