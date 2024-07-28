import { ConflictException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
  ) {}

  async create(data: CreateChatDto, user: JwtPayload) {
    const chat = await this.getChat(user, data.recevierId);
    console.log({ chat });
    if (chat) throw new ConflictException('chat is alreadt exist!!');

    return this.chatRepo.save({
      senderId: user.id,
      receiverId: data.recevierId,
    });
  }

  findAll(user: JwtPayload) {
    const Q = this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.recevier', 'recevier')
      .where('chat.senderId = :id OR chat.recevierId = :id', { id: user.id })
      .select(['chat', 'sender.name', 'recevier.name']);
    return pagination(Q, 1, 10);
  }

  findOne(id: number) {
    return this.chatRepo.findOneBy({ id });
  }

  getChat(user: JwtPayload, recevierId: number) {
    return this.chatRepo.findOneBy([
      {
        senderId: user.id,
        receiverId: recevierId,
      },
      {
        senderId: recevierId,
        receiverId: user.id,
      },
    ]);
  }
}
