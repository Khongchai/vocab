export function assertSameInstance<T extends Object>(
  expected: T,
  actual: T
): void {
  if (expected != actual) {
    throw new AssertionError(`${expected} is not ${actual}`);
  }
  console.info(`${expected} is indeed ${actual}`);
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
  }
}
