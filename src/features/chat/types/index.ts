import type { Message } from "../../../types/message";

export type ChatMessage = Message;

export type SendMessageInput = {
  content: string;
};

export type ChatError = {
  message: string;
  code?: string;
};
