export interface WebSocketEnvelope<T = unknown> {
  type: string;

  payload: T;

  timestamp?: string;
}
