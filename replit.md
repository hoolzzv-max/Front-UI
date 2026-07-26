# Front-UI

**Generic Agent Frontend** — a React/TypeScript/Vite workspace UI that connects to any AI coding agent backend via a unified adapter contract, with zero agent-specific coupling in the feature layer.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Zustand** for state management
- **Monaco Editor** for code editing
- **TailwindCSS** for styling
- **Lucide React** for icons

## Architecture

The codebase follows a strict 9-layer architecture where no feature knows which specific agent it talks to:

```
UI → Features → AgentService → AgentRegistry → IAgentAdapter → Protocol → Transport → Network
```

Key directories:

| Path | Purpose |
|------|---------|
| `src/agents/core/` | Generic types, service, adapter interface, registry |
| `src/agents/transport/` | HTTP / WebSocket transports |
| `src/agents/protocol/` | Request/response normalization |
| `src/agents/adapters/current/` | Active backend adapter |
| `src/agents/adapters/mock/` | Development/test adapter |
| `src/agents/adapters/template/` | Copy to add a new agent |
| `src/bootstrap/` | App initialization (registerAgents) |
| `src/features/` | Chat, Editor, Explorer, Git, Tasks, Logs, Diagnostics, Settings |
| `src/core/` | EventBus, ConnectionManager, storage, errors |

## Development

```bash
npm install
npm run dev        # start dev server on :5173
npm run build      # production build
npm run typecheck  # type-check without emit
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_AGENT_API_URL=http://localhost:8000   # required for real agent
VITE_AGENT_WS_URL=ws://localhost:8000/ws  # optional streaming
VITE_AGENT_API_TOKEN=                      # optional auth token
VITE_AGENT_TRANSPORT=http                  # http | websocket | sse
```

Without `VITE_AGENT_API_URL` in dev, the **mock adapter** is used automatically.

## Adding a New Agent Backend

1. Copy `src/agents/adapters/template/` → `src/agents/adapters/my-agent/`
2. Implement the 6 methods of `IAgentAdapter`
3. Register in `src/bootstrap/registerAgents.ts`
4. No feature files need to change

## User Preferences

- Keep agent names out of the feature layer — adapters only
- Use `agentService` (from `src/agents`) everywhere in features, never call transports directly
- All connection config lives in Settings → saved to localStorage → applied on boot
