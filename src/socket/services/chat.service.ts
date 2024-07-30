import { Injectable } from '@nestjs/common';
import { AuthSocket } from 'src/utils/authSocket';
import { ChatEvents } from '../enums/chat-events.enum';

@Injectable()
export class ChatService {
  sendMsg(client: AuthSocket, data) {
    return client.emit(ChatEvents.REPLAY_MSG, data);
  }
}
