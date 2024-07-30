import { Module } from '@nestjs/common';
import { EventsGateWay } from './events.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { ChatService } from './services/chat.service';

@Module({
  imports: [UserModule],
  providers: [EventsGateWay, ChatService],
})
export class SocketModule {}
