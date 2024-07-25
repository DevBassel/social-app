import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifyRepo: Repository<Notification>,
  ) {}

  findAll(user: JwtPayload) {
    return this.notifyRepo.find({
      where: { toId: user.id },
    });
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
