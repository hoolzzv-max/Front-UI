import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
};

const DEFAULT_THEME: ThemeMode = "dark";
const DEFAULT_STORAGE_KEY = "ai-workspace-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isValidTheme(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (!isBrowser()) return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function getStoredTheme(storageKey: string, fallback: ThemeMode): ThemeMode {
  if (!isBrowser()) return fallback;

  const storedTheme = window.localStorage.getItem(storageKey);

  return isValidTheme(storedTheme) ? storedTheme : fallback;
}

function applyTheme(theme: ResolvedTheme) {
  if (!isBrowser()) return;

  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    getStoredTheme(storageKey, defaultTheme),
  );

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getStoredTheme(storageKey, defaultTheme)),
  );

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      setThemeState(nextTheme);

      if (isBrowser()) {
        window.localStorage.setItem(storageKey, nextTheme);
      }

      const nextResolvedTheme = resolveTheme(nextTheme);
      setResolvedTheme(nextResolvedTheme);
      applyTheme(nextResolvedTheme);
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);

    setResolvedTheme(nextResolvedTheme);
    applyTheme(nextResolvedTheme);

    if (isBrowser()) {
      window.localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey]);

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme !== "system") return;

      const nextResolvedTheme = getSystemTheme();

      setResolvedTheme(nextResolvedTheme);
      applyTheme(nextResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}
