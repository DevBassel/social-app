import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Notification } from '../notification/entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, Notification, User])],
  controllers: [FriendController],
  providers: [FriendService, NotificationService, UserService],
})
export class FriendModule {}
