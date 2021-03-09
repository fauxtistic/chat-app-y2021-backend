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
    const clientDb = await this.clientRepository.findOne({ name: name });
    if (!clientDb) {
      let client = this.clientRepository.create();
      client.id = id;
      client.name = name;
      client = await this.clientRepository.save(client);
      return { id: client.id, name: client.name, typing: false };
    }
    if (clientDb.id === id) {
      // mapping chatcliententity to chatclient
      return { id: clientDb.id, name: clientDb.name, typing: false };
    } else {
      throw new Error('Name already used!');
    }
  }

  async getClients(): Promise<ChatClient[]> {
    const clients = await this.clientRepository.find();
    const chatClients: ChatClient[] = JSON.parse(JSON.stringify(clients));
    return chatClients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete({ id: id });
  }

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
