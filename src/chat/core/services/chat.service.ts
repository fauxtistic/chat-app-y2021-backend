import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatClientEntity } from '../../infrastructure/data-source/entities/client.entity';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../infrastructure/data-source/entities/message.entity';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectRepository(ChatClientEntity)
    private clientRepository: Repository<ChatClientEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async newMessage(message: string, senderId: string): Promise<ChatMessage> {
    let msg = this.messageRepository.create();
    msg.message = message;
    const client = await this.clientRepository.findOne({ id: senderId });
    msg.sender = client.name;
    msg.timeStamp = new Date();
    msg = await this.messageRepository.save(msg);
    return {
      message: msg.message,
      sender: msg.sender,
      timestamp: msg.timeStamp,
    };
  }

  async newClient(id: string, name: string): Promise<ChatClient> {
    const clientDb = await this.clientRepository.findOne({ name: name });
    if (!clientDb) {
      let client = this.clientRepository.create();
      client.id = id;
      client.name = name;
      client.typing = false;
      client = await this.clientRepository.save(client);
      return { id: client.id, name: client.name, typing: client.typing };
    }
    if (clientDb.id === id) {
      // mapping chatcliententity to chatclient
      return { id: clientDb.id, name: clientDb.name, typing: clientDb.typing };
    } else {
      throw new Error('Name already used!');
    }
  }

  async getClients(): Promise<ChatClient[]> {
    const clients = await this.clientRepository.find();
    const chatClients: ChatClient[] = JSON.parse(JSON.stringify(clients));
    return chatClients;
  }

  async getMessages(): Promise<ChatMessage[]> {
    const messages = await this.messageRepository.find();
    const allMessages: ChatMessage[] = JSON.parse(JSON.stringify(messages));
    return allMessages;
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete({ id: id });
  }

  async updateTyping(typing: boolean, id: string): Promise<ChatClient> {
    let chatClient = await this.clientRepository.findOne({ id: id });
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      await this.clientRepository.update({ id: id }, { typing });
      chatClient = await this.clientRepository.findOne({ id: id });
      return {
        id: chatClient.id,
        name: chatClient.name,
        typing: chatClient.typing,
      };
    }
  }
}
