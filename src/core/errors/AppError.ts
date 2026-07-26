import { ERROR_CODES, type ErrorCode } from "./ErrorCodes";

export type AppErrorOptions = { code?: ErrorCode; status?: number; details?: unknown; cause?: unknown; recoverable?: boolean };

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status?: number;
  readonly details?: unknown;
  readonly cause?: unknown;
  readonly recoverable: boolean;
  readonly createdAt: string;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? ERROR_CODES.UNKNOWN;
    this.status = options.status;
    this.details = options.details;
    this.cause = options.cause;
    this.recoverable = options.recoverable ?? true;
    this.createdAt = new Date().toISOString();
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static fromUnknown(error: unknown, fallbackMessage = "Unexpected error") {
    if (error instanceof AppError) return error;
    if (error instanceof Error) return new AppError(error.message || fallbackMessage, { code: ERROR_CODES.UNKNOWN, cause: error });
    return new AppError(fallbackMessage, { code: ERROR_CODES.UNKNOWN, details: error });
  }

  toJSON() {
    return { name: this.name, message: this.message, code: this.code, status: this.status, details: this.details, recoverable: this.recoverable, createdAt: this.createdAt };
  }
}
