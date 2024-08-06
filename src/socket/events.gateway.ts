import {
  BadRequestException,
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
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { CallEvents } from './enums/call-events.enum';
import { CallDto } from './dtos/call.dto';

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true }))
@UseFilters(WsExceptionsFilter, WsValidationFilter)
export class EventsGateWay implements NestGateway {
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

  handleDisconnect(client: AuthSocket) {
    this.onlineUsers.delete(`user-${client.user.id}`);
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
  sendMsg(@ConnectedSocket() client: AuthSocket, @MessageBody() data: any) {
    console.log(data);
    const user = this.getUser(data.toId);
    return client
      .to(user.socketId)
      .emit(ChatEvents.SEND_MSG, { ...data, from: data.from });
  }

  @SubscribeMessage(ChatEvents.START_TYPING)
  startTyping(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { userId: number },
  ) {
    const user = this.getUser(data.userId);
    return (
      user &&
      client
        .to(user.socketId)
        .emit(ChatEvents.START_TYPING, { userId: client.user.id })
    );
  }

  @SubscribeMessage(ChatEvents.STOP_TYPING)
  stopTyping(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: { userId: number },
  ) {
    const user = this.getUser(data.userId);
    console.log('stope typing', user);
    return (
      user &&
      client
        .to(user.socketId)
        .emit(ChatEvents.STOP_TYPING, { userId: client.user.id })
    );
  }

  @SubscribeMessage(CallEvents.CALL_OFFER)
  callOffer(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() payload: CallDto,
  ) {
    const user = this.getUser(payload.toId);
    console.log('call to ', { payload, user });

    return (
      user &&
      client.to(user.socketId).emit(CallEvents.CALL_OFFER, {
        payload,
      })
    );
  }

  @SubscribeMessage(CallEvents.CALL_ACCEPT)
  callAccept(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() { userId, peerId }: { peerId: any; userId: number },
  ) {
    const user = this.getUser(userId);
    console.log('video call to ', { peerId, user });

    return (
      user &&
      client.to(user.socketId).emit(CallEvents.CALL_ACCEPT, {
        peerId,
      })
    );
  }

  checkUserInRoom({ roomId, id }: { roomId: string; id: string }) {
    return this.server.sockets.adapter.rooms.get(roomId).has(id);
  }
  getUser(id: number) {
    return this.onlineUsers.get(`user-${id}`);
  }
}
