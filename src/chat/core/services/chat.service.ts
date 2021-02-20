import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message: message,
      sender: this.clients.find((c) => c.id === senderId),
      timestamp: new Date(),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  newClient(id: string, name: string): ChatClient {
    let chatClient = this.clients.find((c) => c.name === name && c.id === id);
    if (chatClient) {
      return chatClient;
    }
    if (this.clients.find((c) => c.name === name)) {
      throw new Error('Name already used!');
    }
    chatClient = { id: id, name: name, typing: false };
    this.clients.push(chatClient);
    return chatClient;
  }

  getClients(): ChatClient[] {
    return this.clients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  deleteClient(id: string): void {
    this.clients = this.clients.filter((c) => c.id !== id);
  }

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
