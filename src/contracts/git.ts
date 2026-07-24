export interface GitStatusResponse {
  branch: string;

  staged: number;

  changed: number;
}
