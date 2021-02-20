import { ChatMessage } from '../models/chat-message.model';
import { ChatClient } from '../models/chat-client.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(message: string, senderId: string): ChatMessage;

  newClient(id: string, name: string): ChatClient;

  getClients(): ChatClient[];

  getMessages(): ChatMessage[];

  deleteClient(id: string): void;

  updateTyping(typing: boolean, id: string): ChatClient;
}
