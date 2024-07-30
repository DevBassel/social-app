import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsExceptionsFilter } from './filters/ws-exceptions.filter';
import { MsgDto } from './dtos/msg.dto';
import { WsValidationFilter } from './filters/ws-validation.filter';
import { AuthSocket } from 'src/utils/authSocket';
import { ChatService } from './services/chat.service';
import { OnlineUser } from './interfaces/onlieUser.interface';

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(WsExceptionsFilter, WsValidationFilter)
export class EventsGateWay {
  private onlineUsers = new Map<string, OnlineUser>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: AuthSocket) {
    console.log();
    this.onlineUsers.set(`user-${client.user.id}`, {
      socketId: client.id,
      userId: client.user.id,
    });
    console.log(this.onlineUsers);
  }

  @SubscribeMessage('send')
  sendMsg(@ConnectedSocket() client: AuthSocket, @MessageBody() data: MsgDto) {
    return this.chatService.sendMsg(client, data);
  }

  @SubscribeMessage('onlin-user')
  getOnlineUsers(@ConnectedSocket() client: AuthSocket) {
    console.log(this.onlineUsers.values());
    return client.emit('onineUsers', Array.from(this.onlineUsers.values()));
  }
}
