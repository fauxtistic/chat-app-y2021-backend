import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  allMessages: string[] = [];
  userMap: Map<string, string> = new Map<string, string>();

  newMessage(message: string): void {
    this.allMessages.push(message);
  }

  newClient(id: string, name: string): void {
    this.userMap.set(id, name);
  }

  getClients(): string[] {
    return Array.from(this.userMap.values());
  }

  getMessages(): string[] {
    return this.allMessages;
  }

  deleteClient(id: string): void {
    this.userMap.delete(id);
  }
}
