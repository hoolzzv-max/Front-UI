import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

export const KEYBOARD_EVENTS = {
  OPEN_COMMAND_PALETTE: "workspace:open-command-palette",
  TOGGLE_BOTTOM_DRAWER: "workspace:toggle-bottom-drawer",
  TOGGLE_RIGHT_PANEL: "workspace:toggle-right-panel",
  FOCUS_PROMPT: "workspace:focus-prompt",
} as const;

export type KeyboardEventName =
  (typeof KEYBOARD_EVENTS)[keyof typeof KEYBOARD_EVENTS];

export type ShortcutKey =
  | "mod"
  | "ctrl"
  | "meta"
  | "shift"
  | "alt"
  | "enter"
  | "escape"
  | "tab"
  | "space"
  | "backspace"
  | "delete"
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"
  | "`"
  | string;

export type ShortcutDescriptor = {
  id: string;
  label: string;
  keys: ShortcutKey[];
  handler: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInputs?: boolean;
};

type KeyboardContextValue = {
  isMac: boolean;
  registerShortcut: (shortcut: ShortcutDescriptor) => () => void;
  emitKeyboardEvent: (eventName: KeyboardEventName) => void;
  formatShortcut: (keys: ShortcutKey[]) => string;
};

type KeyboardProviderProps = {
  children: ReactNode;
};

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

function isBrowser() {
  return typeof window !== "undefined";
}

function detectMac() {
  if (typeof navigator === "undefined") return false;

  return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

function normalizeKey(key: string) {
  const lowerKey = key.toLowerCase();

  if (lowerKey === " ") return "space";
  if (lowerKey === "esc") return "escape";
  if (lowerKey === "up") return "arrowup";
  if (lowerKey === "down") return "arrowdown";
  if (lowerKey === "left") return "arrowleft";
  if (lowerKey === "right") return "arrowright";

  return lowerKey;
}

function matchesShortcut(event: KeyboardEvent, keys: ShortcutKey[]) {
  const normalizedEventKey = normalizeKey(event.key);

  return keys.every((key) => {
    const normalizedKey = normalizeKey(key);

    if (normalizedKey === "mod") return event.metaKey || event.ctrlKey;
    if (normalizedKey === "ctrl") return event.ctrlKey;
    if (normalizedKey === "meta") return event.metaKey;
    if (normalizedKey === "shift") return event.shiftKey;
    if (normalizedKey === "alt") return event.altKey;

    return normalizedEventKey === normalizedKey;
  });
}

function createWorkspaceKeyboardEvent(eventName: KeyboardEventName) {
  return new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
  });
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const shortcutsRef = useRef<Map<string, ShortcutDescriptor>>(new Map());
  const isMac = useMemo(() => detectMac(), []);

  const emitKeyboardEvent = useCallback((eventName: KeyboardEventName) => {
    if (!isBrowser()) return;

    window.dispatchEvent(createWorkspaceKeyboardEvent(eventName));
  }, []);

  const registerShortcut = useCallback((shortcut: ShortcutDescriptor) => {
    shortcutsRef.current.set(shortcut.id, {
      enabled: true,
      preventDefault: true,
      stopPropagation: false,
      allowInInputs: false,
      ...shortcut,
    });

    return () => {
      shortcutsRef.current.delete(shortcut.id);
    };
  }, []);

  const formatShortcut = useCallback(
    (keys: ShortcutKey[]) => {
      return keys
        .map((key) => {
          const normalizedKey = normalizeKey(key);

          if (normalizedKey === "mod") return isMac ? "⌘" : "Ctrl";
          if (normalizedKey === "ctrl") return "Ctrl";
          if (normalizedKey === "meta") return "⌘";
          if (normalizedKey === "shift") return "Shift";
          if (normalizedKey === "alt") return isMac ? "Option" : "Alt";
          if (normalizedKey === "enter") return "Enter";
          if (normalizedKey === "escape") return "Esc";
          if (normalizedKey === "space") return "Space";
          if (normalizedKey === "arrowup") return "↑";
          if (normalizedKey === "arrowdown") return "↓";
          if (normalizedKey === "arrowleft") return "←";
          if (normalizedKey === "arrowright") return "→";

          return key.length === 1 ? key.toUpperCase() : key;
        })
        .join(" + ");
    },
    [isMac],
  );

  useEffect(() => {
    const unregisterOpenCommandPalette = registerShortcut({
      id: "global.open-command-palette",
      label: "Open Command Palette",
      keys: ["mod", "shift", "p"],
      allowInInputs: true,
      handler: () => emitKeyboardEvent(KEYBOARD_EVENTS.OPEN_COMMAND_PALETTE),
    });

    const unregisterToggleBottomDrawer = registerShortcut({
      id: "global.toggle-bottom-drawer",
      label: "Toggle Bottom Drawer",
      keys: ["mod", "j"],
      handler: () => emitKeyboardEvent(KEYBOARD_EVENTS.TOGGLE_BOTTOM_DRAWER),
    });

    const unregisterToggleRightPanel = registerShortcut({
      id: "global.toggle-right-panel",
      label: "Toggle Right Panel",
      keys: ["mod", "shift", "r"],
      handler: () => emitKeyboardEvent(KEYBOARD_EVENTS.TOGGLE_RIGHT_PANEL),
    });

    const unregisterFocusPrompt = registerShortcut({
      id: "global.focus-prompt",
      label: "Focus Prompt Composer",
      keys: ["mod", "k"],
      allowInInputs: true,
      handler: () => emitKeyboardEvent(KEYBOARD_EVENTS.FOCUS_PROMPT),
    });

    return () => {
      unregisterOpenCommandPalette();
      unregisterToggleBottomDrawer();
      unregisterToggleRightPanel();
      unregisterFocusPrompt();
    };
  }, [emitKeyboardEvent, registerShortcut]);

  useEffect(() => {
    if (!isBrowser()) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcuts = Array.from(shortcutsRef.current.values());

      for (const shortcut of shortcuts) {
        const isEnabled = shortcut.enabled !== false;
        const shouldSkipEditableTarget =
          isEditableTarget(event.target) && !shortcut.allowInInputs;

        if (!isEnabled || shouldSkipEditableTarget) continue;

        if (!matchesShortcut(event, shortcut.keys)) continue;

        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }

        if (shortcut.stopPropagation) {
          event.stopPropagation();
        }

        shortcut.handler(event);
        break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const value = useMemo<KeyboardContextValue>(
    () => ({
      isMac,
      registerShortcut,
      emitKeyboardEvent,
      formatShortcut,
    }),
    [isMac, registerShortcut, emitKeyboardEvent, formatShortcut],
  );

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);

  if (!context) {
    throw new Error("useKeyboard must be used inside KeyboardProvider.");
  }

  return context;
}

export function useShortcut(shortcut: ShortcutDescriptor) {
  const { registerShortcut } = useKeyboard();

  useEffect(() => {
    return registerShortcut(shortcut);
  }, [registerShortcut, shortcut]);
}

export function stopKeyboardPropagation(
  event: ReactKeyboardEvent<HTMLElement>,
) {
  event.stopPropagation();
}
