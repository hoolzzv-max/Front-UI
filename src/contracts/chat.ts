export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;

  completed: boolean;
}
