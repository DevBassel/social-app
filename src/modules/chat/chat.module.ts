import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Msgs } from './entities/msg.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Msgs, User])],
  controllers: [ChatController],
  providers: [ChatService, UserService],
})
export class ChatModule {}
