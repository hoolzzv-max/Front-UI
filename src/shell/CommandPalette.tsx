import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

export type CommandPaletteItem = {
  id: string;
  title: string;
  section: string;
  shortcut?: string;
  action: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  commands: CommandPaletteItem[];
  onClose: () => void;
};

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export function CommandPalette({
  open,
  commands,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    if (!normalizedQuery) return commands;

    return commands.filter((command) => {
      const target = `${command.title} ${command.section} ${
        command.shortcut ?? ""
      }`.toLowerCase();

      return target.includes(normalizedQuery);
    });
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((currentIndex) => {
          if (filteredCommands.length === 0) return 0;

          return (currentIndex + 1) % filteredCommands.length;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((currentIndex) => {
          if (filteredCommands.length === 0) return 0;

          return (
            (currentIndex - 1 + filteredCommands.length) %
            filteredCommands.length
          );
        });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        const command = filteredCommands[activeIndex];

        if (!command) return;

        command.action();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, filteredCommands, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur-sm">
      <button
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
        aria-label="Close command palette"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex h-13 items-center border-b border-neutral-800 px-4">
          <Search size={18} className="mr-3 text-neutral-500" />

          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a command..."
            className="h-13 flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
          />

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-100"
            type="button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-auto p-2">
          {filteredCommands.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-neutral-500">
              لا توجد أوامر مطابقة.
            </div>
          )}

          {filteredCommands.map((command, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={command.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  command.action();
                  onClose();
                }}
                className={[
                  "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm transition",
                  isActive
                    ? "bg-blue-500/10 text-blue-300"
                    : "text-neutral-300 hover:bg-neutral-900",
                ].join(" ")}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{command.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    {command.section}
                  </p>
                </div>

                {command.shortcut && (
                  <span className="shrink-0 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] text-neutral-500">
                    {command.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
