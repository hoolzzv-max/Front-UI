import type { AgentInstruction } from "../core/types";
import type { NormalizedRequest } from "./types";

/** Convert a feature-level AgentInstruction to the normalized protocol shape */
export function normalizeRequest(instruction: AgentInstruction): NormalizedRequest {
  return {
    prompt: instruction.prompt.trim(),
    files: instruction.files?.length ? instruction.files : undefined,
    context: instruction.context ?? undefined,
    taskId: instruction.taskId ?? undefined,
  };
}
