import type { Project } from "../../types/project";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "project-1",
    name: "Front-UI",

    description:
      "Main AI workspace frontend project",

    rootPath:
      "/workspaces/Front-UI",

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  },

  {
    id: "project-2",
    name: "Agent-Core",

    description:
      "AI agent runtime and services",

    rootPath:
      "/workspaces/Agent-Core",

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  },
];
