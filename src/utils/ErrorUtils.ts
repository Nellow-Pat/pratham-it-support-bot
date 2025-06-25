export class AppError extends Error {
  public readonly cause?: Error;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    if (cause instanceof Error) {
      this.cause = cause;
      this.stack = cause.stack;
    }
  }
}

export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  let message: string;
  if (value != null && typeof value === 'object' && 'message' in value) {
    message = String((value as { message: unknown }).message);
  } else {
    message = String(value);
  }

  return new Error(message);
}