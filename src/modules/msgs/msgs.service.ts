import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMsgDto } from './dto/create-msg.dto';
import { UpdateMsgDto } from './dto/update-msg.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Msg } from './entities/msg.entity';
import { Repository } from 'typeorm';
import { ChatService } from '../chat/chat.service';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { MediaService } from '../media/media.service';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class MsgsService {
  constructor(
    @InjectRepository(Msg) private readonly msgRepo: Repository<Msg>,
    private readonly chatService: ChatService,
    private readonly mediaService: MediaService,
  ) {}
  async create(
    createMsgDto: CreateMsgDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const chat = await this.chatService.findOne(createMsgDto.chatId, user);

    // console.log({ chat });
    if (!chat) throw new NotFoundException('chat not found');

    const media = file ? await this.mediaService.create(file) : null;

    return this.msgRepo.save({
      senderId: user.id,
      content: createMsgDto.content,
      chatId: chat.id,
      media,
    });
  }

  findAll(id: number, page: number, limit: number) {
    const Q = this.msgRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.media', 'm')
      .where('msg.chatId = :id', { id })
      .orderBy('msg.sentAt', 'DESC') // order by newest
      .select(['msg', 'm']);

    return pagination(Q, page, limit);
  }

  findOne(id: number) {
    return this.msgRepo.findOneBy({ id });
  }

  async update(
    id: number,
    updateMsgDto: UpdateMsgDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const msg = await this.msgRepo.findOne({
      where: { senderId: user.id, id },
      relations: { media: true },
    });

    if (!msg) throw new NotFoundException('msg not found');

    await this.mediaService.delete(msg.mediaId);
    const media = file ? await this.mediaService.create(file) : msg.media;

    return this.msgRepo.save({
      ...msg,
      ...updateMsgDto,
      media,
    });
  }

  remove(id: number, user: JwtPayload) {
    return this.msgRepo.delete({ senderId: user.id, id });
  }
}
