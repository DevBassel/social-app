import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Msgs } from './entities/msg.entity';
import { UserService } from '../user/user.service';
import { MsgDto } from './dtos/msg.dto';
import { UpdateMsgDto } from './dtos/updateMsgDto';
import { JwtPayload } from '../auth/dto/jwtPayload';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
    @InjectRepository(Msgs) private readonly msgsRepo: Repository<Msgs>,
    private readonly userService: UserService,
  ) {}

  getChats(user: JwtPayload) {
    return this.chatRepo.find({
      where: [{ recieverId: user.id }, { senderId: user.id }],
      relations: {
        sender: true,
        reciever: true,
      },
    });
  }
  async createChat(recieverId: number, user: JwtPayload) {
    const checkChat = await this.chatRepo.findOne({
      where: [
        { recieverId, senderId: user.id },
        { recieverId: user.id, senderId: recieverId },
      ],
    });

    if (checkChat) throw new BadRequestException();

    const checkReciver = await this.userService.findOne(recieverId);

    if (!checkReciver || recieverId === user.id)
      throw new NotFoundException('user not found');

    const chat = this.chatRepo.create({ senderId: user.id, recieverId });
    console.log(chat);

    return this.chatRepo.save(chat);
  }

  removeChat(id: number) {
    return this.chatRepo.delete({ id });
  }

  getMsgs(chatId: number) {
    return this.msgsRepo.findBy({ chatId });
  }

  async sendMsg(msgDto: MsgDto, user: JwtPayload) {
    const checkReciver = await this.userService.findOne(msgDto.reciverId);
    const checkChat = await this.chatRepo.findOne({
      where: [
        { recieverId: msgDto.reciverId, senderId: user.id },
        { recieverId: user.id, senderId: msgDto.reciverId },
      ],
    });

    let chat: Chat = checkChat;

    if (!checkChat) chat = await this.createChat(msgDto.reciverId, user);

    if (!checkReciver || msgDto.reciverId === user.id)
      throw new NotFoundException('not found reciver');

    const msg = this.msgsRepo.create({
      content: msgDto.content,
      senderId: user.id,
      reciverId: msgDto.reciverId,
      chatId: chat.id,
    });

    console.log(msg);
    return this.msgsRepo.save(msg);
  }

  async updateMsg(updatedMsg: UpdateMsgDto, user: JwtPayload) {
    const checkMsg: Msgs = await this.msgsRepo.findOneBy({ id: updatedMsg.id });

    if (!checkMsg) throw new NotFoundException();

    if (checkMsg.senderId !== user.id) throw new UnauthorizedException();

    return this.msgsRepo.save({ ...checkMsg, content: updatedMsg.content });
  }

  async removeMsg(msgId: number, user: JwtPayload) {
    const checkMsg: Msgs = await this.msgsRepo.findOneBy({ id: msgId });

    if (!checkMsg) throw new NotFoundException();

    if (checkMsg.senderId !== user.id) throw new UnauthorizedException();

    return this.msgsRepo.delete({ id: msgId });
  }
}
