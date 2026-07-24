type StatusBarProps = {
  status: string;
  model: string;
  workspace: string;
  branch: string;
  encoding: string;
  language: string;
};

export function StatusBar({
  status,
  model,
  workspace,
  branch,
  encoding,
  language,
}: StatusBarProps) {
  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-500">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {status}
        </span>

        <span className="hidden sm:inline">Model: {model}</span>
        <span className="hidden md:inline">Workspace: {workspace}</span>
      </div>

      <div className="flex min-w-0 items-center gap-4">
        <span className="hidden sm:inline">Branch: {branch}</span>
        <span>{encoding}</span>
        <span>{language}</span>
      </div>
    </footer>
  );
}
