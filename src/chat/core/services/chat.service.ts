import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatClientEntity } from '../../infrastructure/data-source/entities/client.entity';
import { Repository } from 'typeorm';
import { of } from 'rxjs';

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  constructor(
    @InjectRepository(ChatClientEntity)
    private clientRepository: Repository<ChatClientEntity>,
  ) {}

  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message: message,
      sender: this.clients.find((c) => c.id === senderId),
      timestamp: new Date(),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  async newClient(id: string, name: string): Promise<ChatClient> {
    let chatClient = this.clients.find((c) => c.name === name && c.id === id);
    if (chatClient) {
      return of(chatClient).toPromise();
    }
    if (this.clients.find((c) => c.name === name)) {
      throw new Error('Name already used!');
    }
    /*chatClient = { id: id, name: name, typing: false };
    this.clients.push(chatClient);
    return chatClient;*/
    const client = this.clientRepository.create();
    client.name = name;
    await this.clientRepository.save(client);
    chatClient = { name: name, id: '' + client.id, typing: false };
    return of(chatClient).toPromise();
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
