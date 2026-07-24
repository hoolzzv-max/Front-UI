import { AppError } from "../errors/AppError";
import { ERROR_CODES } from "../errors/ErrorCodes";

type StorageValue = string | number | boolean | null | object | unknown[];

type StorageDriverOptions = {
  namespace?: string;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function buildKey(namespace: string | undefined, key: string) {
  return namespace ? `${namespace}:${key}` : key;
}

export class SessionStorageDriver {
  private readonly namespace?: string;

  constructor(options: StorageDriverOptions = {}) {
    this.namespace = options.namespace;
  }

  get<T>(key: string, fallback: T): T;
  get<T>(key: string): T | null;
  get<T>(key: string, fallback?: T): T | null {
    if (!isBrowser()) return fallback ?? null;

    const storageKey = buildKey(this.namespace, key);

    try {
      const rawValue = window.sessionStorage.getItem(storageKey);

      if (rawValue === null) return fallback ?? null;

      return JSON.parse(rawValue) as T;
    } catch (error) {
      throw new AppError(`Failed to read sessionStorage key "${key}".`, {
        code: ERROR_CODES.STORAGE_READ_FAILED,
        cause: error,
        details: { key: storageKey },
      });
    }
  }

  set<T extends StorageValue>(key: string, value: T) {
    if (!isBrowser()) return;

    const storageKey = buildKey(this.namespace, key);

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      throw new AppError(`Failed to write sessionStorage key "${key}".`, {
        code: ERROR_CODES.STORAGE_WRITE_FAILED,
        cause: error,
        details: { key: storageKey },
      });
    }
  }

  update<T extends StorageValue>(
    key: string,
    updater: (currentValue: T | null) => T,
  ) {
    const currentValue = this.get<T>(key);
    const nextValue = updater(currentValue);

    this.set(key, nextValue);

    return nextValue;
  }

  remove(key: string) {
    if (!isBrowser()) return;

    const storageKey = buildKey(this.namespace, key);

    try {
      window.sessionStorage.removeItem(storageKey);
    } catch (error) {
      throw new AppError(`Failed to remove sessionStorage key "${key}".`, {
        code: ERROR_CODES.STORAGE_REMOVE_FAILED,
        cause: error,
        details: { key: storageKey },
      });
    }
  }

  has(key: string) {
    if (!isBrowser()) return false;

    return window.sessionStorage.getItem(buildKey(this.namespace, key)) !== null;
  }

  keys() {
    if (!isBrowser()) return [];

    const prefix = this.namespace ? `${this.namespace}:` : "";

    return Object.keys(window.sessionStorage)
      .filter((key) => key.startsWith(prefix))
      .map((key) => (prefix ? key.slice(prefix.length) : key));
  }

  clearNamespace() {
    if (!isBrowser()) return;

    for (const key of this.keys()) {
      this.remove(key);
    }
  }
}

export const sessionStorageDriver = new SessionStorageDriver({
  namespace: "ai-workspace",
});
