import { useGitStore } from "../store/gitStore";

export function useGit() {
  return useGitStore();
}
