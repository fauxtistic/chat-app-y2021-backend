import { ChatMessage } from '../models/chat-message.model';
import { ChatClient } from '../models/chat-client.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(message: string, senderId: string): Promise<ChatMessage>;

  newClient(id: string, name: string): Promise<ChatClient>;

  getClients(): Promise<ChatClient[]>;

  getMessages(): Promise<ChatMessage[]>;

  deleteClient(id: string): Promise<void>;

  updateTyping(typing: boolean, id: string): Promise<ChatClient>;
}
