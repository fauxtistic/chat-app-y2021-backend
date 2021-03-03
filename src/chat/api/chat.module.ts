import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from '../core/services/chat.service';
import { IChatServiceProvider } from '../core/primary-ports/chat.service.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatClientEntity } from '../infrastructure/data-source/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatClientEntity])
  ],
  providers: [
    ChatGateway,
    {
      provide: IChatServiceProvider,
      useClass: ChatService,
    },
  ],
})
export class ChatModule {}
