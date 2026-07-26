import { create } from "zustand";
import type { Diagnostic, DiagnosticSeverity, DiagnosticSource } from "../types";

type DiagnosticsState = {
  diagnostics: Diagnostic[];
  addDiagnostic: (input: { source: DiagnosticSource; severity: DiagnosticSeverity; message: string; filePath?: string; line?: number; column?: number }) => Diagnostic;
  removeDiagnostic: (id: string) => void;
  clearDiagnostics: () => void;
  getCounts: () => { total: number; info: number; warning: number; error: number };
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() { return new Date().toISOString(); }

function createDiagnostic(input: { source: DiagnosticSource; severity: DiagnosticSeverity; message: string; filePath?: string; line?: number; column?: number }): Diagnostic {
  return { id: createId(), source: input.source, severity: input.severity, message: input.message, filePath: input.filePath, line: input.line, column: input.column, createdAt: now() };
}

export const useDiagnosticsStore = create<DiagnosticsState>((set, get) => ({
  diagnostics: [
    createDiagnostic({ source: "workspace", severity: "info", message: "Diagnostics system initialized." }),
    createDiagnostic({ source: "backend", severity: "warning", message: "Backend is not connected yet." }),
  ],

  addDiagnostic: (input) => {
    const diagnostic = createDiagnostic(input);
    set((state) => ({ diagnostics: [...state.diagnostics, diagnostic] }));
    return diagnostic;
  },

  removeDiagnostic: (id) => { set((state) => ({ diagnostics: state.diagnostics.filter((item) => item.id !== id) })); },
  clearDiagnostics: () => { set({ diagnostics: [] }); },

  getCounts: () => {
    const diagnostics = get().diagnostics;
    return {
      total: diagnostics.length,
      info: diagnostics.filter((item) => item.severity === "info").length,
      warning: diagnostics.filter((item) => item.severity === "warning").length,
      error: diagnostics.filter((item) => item.severity === "error").length,
    };
  },
}));
