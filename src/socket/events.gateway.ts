import {
  BadRequestException,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsExceptionsFilter } from './filters/ws-exceptions.filter';
import { WsValidationFilter } from './filters/ws-validation.filter';
import { AuthSocket } from 'src/utils/authSocket';
import { OnlineUser } from './interfaces/onlieUser.interface';
import { RoomEvents } from './enums/room-events.enum';
import { JoinRoomDto } from './dtos/room.dto';
import { Server } from 'socket.io';
import { ChatEvents } from './enums/chat-events.enum';
import { MsgDto } from './dtos/msg.dto';

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(WsExceptionsFilter, WsValidationFilter)
export class EventsGateWay {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, OnlineUser>();
  private rooms: Map<string, Set<string>> = new Map();

  handleConnection(client: AuthSocket) {
    this.onlineUsers.set(`user-${client.user.id}`, {
      socketId: client.id,
      userId: client.user.id,
    });
    console.log(this.onlineUsers);
  }

  @SubscribeMessage(RoomEvents.CREATE_ROOM)
  createRoom(@ConnectedSocket() client: AuthSocket) {
    const roomId = `room-${client.id}`;
    const roomUsers = new Set<string>();
    roomUsers.add(client.id);

    this.rooms.set(roomId, roomUsers);
    console.log(this.rooms);

    client.join(roomId);
    return client.emit(RoomEvents.CREATE_ROOM, { roomId });
  }

  @SubscribeMessage(RoomEvents.JOIN_ROOM)
  joinRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: JoinRoomDto,
  ) {
    const room = this.rooms.get(data.roomId);
    if (!room) throw new BadRequestException('room not exist');

    room.add(client.id);
    client.join(data.roomId);
    console.log({ Iorooms: this.server.sockets.adapter.rooms });
    return client.emit(RoomEvents.JOIN_ROOM, { status: true });
  }

  @SubscribeMessage(RoomEvents.LEFT_ROOM)
  leftRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: JoinRoomDto,
  ) {
    const room = this.rooms.get(data.roomId);
    if (!room) throw new BadRequestException('room not exist');
    room.delete(client.id);
    client.leave(data.roomId);
  }

  @SubscribeMessage(ChatEvents.SEND_MSG)
  sendMsg(@ConnectedSocket() client: AuthSocket, @MessageBody() data: MsgDto) {
    const checkUserInRoom = this.checkUserInRoom({
      roomId: data.roomId,
      id: client.id,
    });

    if (!checkUserInRoom) throw new UnauthorizedException();

    return client
      .to(data.roomId)
      .emit(ChatEvents.REPLAY_MSG, { msg: data.msg, from: client.user.id });
  }

  checkUserInRoom({ roomId, id }: { roomId: string; id: any }) {
    return this.server.sockets.adapter.rooms.get(roomId).has(id);
  }
}
