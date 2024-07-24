import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifyRepo: Repository<Notification>,
  ) {}

  findAll(user: JwtPayload) {
    return this.notifyRepo.find({
      where: { toId: user.id },
      relations: { from: true },
    });
  }

  create({
    content,
    fromId,
    toId,
  }: {
    content: string;
    fromId: number;
    toId: number;
  }) {
    return this.notifyRepo.save({
      content,
      fromId,
      toId,
    });
  }
}
