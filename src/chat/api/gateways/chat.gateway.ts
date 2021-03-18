import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from '../../core/services/chat.service';
import { WelcomeDto } from '../dtos/welcome.dto';
import {
  IChatService,
  IChatServiceProvider,
} from '../../core/primary-ports/chat.service.interface';
import { Inject } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IChatServiceProvider) private chatService: IChatService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  async handleChatEvent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chatMessage = await this.chatService.newMessage(message, client.id);
    this.server.emit('newMessage', chatMessage);
  }

  @SubscribeMessage('typing')
  async handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chatClient = await this.chatService.updateTyping(typing, client.id);
    if (chatClient) {
      this.server.emit('clientTyping', chatClient);
    }
  }

  @SubscribeMessage('name')
  async handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const chatClient = await this.chatService.newClient(client.id, name);
      const chatClients = await this.chatService.getClients();
      const messages = await this.chatService.getMessages();
      const welcome: WelcomeDto = {
        client: chatClient,
        clients: chatClients,
        messages: messages,
      };
      // emit that individual client
      client.emit('welcome', welcome);
      // emit all so everyone listening will get message
      this.server.emit('clients', chatClients);
    } catch (e) {
      client.error(e.message);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    client.emit('AllMessages', this.chatService.getMessages());
    this.server.emit('clients', await this.chatService.getClients());
  }

  async handleDisconnect(client: Socket): Promise<any> {
    //fix below
    const chatClient = await this.chatService.updateTyping(false, client.id);
    this.server.emit('clientTyping', chatClient);
    //fix above
    await this.chatService.deleteClient(client.id);
    this.server.emit('clients', await this.chatService.getClients());
  }
}
