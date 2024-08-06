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
    // console.log({ chat });
    if (chat) throw new ConflictException('chat is alreadt exist!!');

    return this.chatRepo.save({
      senderId: user.id,
      recevierId: data.recevierId,
    });
  }

  async findAll(user: JwtPayload, page: number, limit: number) {
    const Q = this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.recevier', 'recevier')
      .where('chat.senderId = :id OR chat.recevierId = :id', { id: user.id })
      .select([
        'chat',

        'sender.id',
        'sender.name',
        'sender.picture',

        'recevier.id',
        'recevier.name',
        'recevier.picture',
      ]);

    const chats = await pagination(Q, page, limit);

    chats.data = chats.data.map((item) => {
      if (item.senderId === user.id) item['user'] = item.recevier;

      if (item.recevierId === user.id) item['user'] = item.sender;

      // console.log(item);
      delete item.recevier;
      delete item.sender;

      return item;
    });

    return chats;
  }

  async findOne(id: number, user: JwtPayload) {
    const chat = await this.chatRepo
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .leftJoinAndSelect('c.sender', 'sender')
      .leftJoinAndSelect('c.recevier', 'recevier')
      .select([
        'c',
        'sender.id',
        'sender.name',
        'sender.picture',

        'recevier.id',
        'recevier.name',
        'recevier.picture',
      ])
      .getOne();

    if (chat) {
      if (chat.senderId === user.id) chat['user'] = chat.recevier;

      if (chat.recevierId === user.id) chat['user'] = chat.sender;
      delete chat.recevier;
      delete chat.sender;
    }

    return chat;
  }

  getChat(user: JwtPayload, recevierId: number) {
    return this.chatRepo.findOneBy([
      {
        senderId: user.id,
        recevierId: recevierId,
      },
      {
        senderId: recevierId,
        recevierId: user.id,
      },
    ]);
  }
}
