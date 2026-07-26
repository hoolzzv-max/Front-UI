export type DiagnosticSeverity = "info" | "warning" | "error";
export type DiagnosticSource = "typescript" | "runtime" | "backend" | "agent" | "workspace";

export interface Diagnostic {
  id: string;
  source: DiagnosticSource;
  severity: DiagnosticSeverity;
  message: string;
  filePath?: string;
  line?: number;
  column?: number;
  createdAt: string;
}
