import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifyRepo: Repository<Notification>,
  ) {}

  findAll(user: JwtPayload, page: number, limit: number) {
    const Q = this.notifyRepo
      .createQueryBuilder('n')
      .where('n.toId = :userId', { userId: user.id });

    return pagination(Q, page, limit);
  }

  create({ content, toId }: CreateNotificationDto) {
    return this.notifyRepo.save({
      content,
      toId,
    });
  }

  delete(id: number, user: JwtPayload) {
    return this.notifyRepo.delete({ id, toId: user.id });
  }
}
