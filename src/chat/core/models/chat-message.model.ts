import { ChatClient } from './chat-client.model';

export interface ChatMessage {
  message: string;
  sender: string;
  timestamp: Date;
}
