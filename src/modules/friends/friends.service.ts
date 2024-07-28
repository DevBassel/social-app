import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { UserService } from '../user/user.service';
import { FriendReqStatus } from './enums/friend-req-status.enum';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend) private readonly friendRepo: Repository<Friend>,
    private readonly userService: UserService,
  ) {}

  async create({ friendId }: CreateFriendDto, user: JwtPayload) {
    const checkUser = await this.userService.findOne({ id: friendId });

    if (!checkUser) throw new NotFoundException('user not found');

    const checkFriendShip = await this.friendRepo.findOneBy([
      {
        senderId: friendId,
        recevierId: user.id,
      },
      {
        senderId: user.id,
        recevierId: friendId,
      },
    ]);

    if (checkFriendShip)
      throw new ConflictException('friend ship already exist!!');

    return this.friendRepo.save({
      recevierId: friendId,
      senderId: user.id,
    });
  }

  async getFriends(user: JwtPayload) {
    const Q = this.friendRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.sender', 'sender')
      .leftJoinAndSelect('f.recevier', 'recevier')
      .andWhere('(sender.id = :id OR recevier.id = :id)', {
        id: user.id,
      })
      .andWhere('f.status = :status', { status: FriendReqStatus.ACCEPT })
      .select([
        'f.id',
        'f.status',
        'f.createdAt',

        'sender.id',
        'sender.name',
        'sender.picture',

        'recevier.id',
        'recevier.name',
        'recevier.picture',
      ]);

    const r = await pagination(Q, 1, 10);

    r.data = r.data.map((item) => {
      if (item.sender.id === user.id) item['friend'] = item.recevier;

      if (item.recevier.id === user.id) item['friend'] = item.sender;

      delete item.recevier;
      delete item.sender;

      return item;
    });

    return r;
  }

  findRequests(user: JwtPayload) {
    const Q = this.friendRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.recevier', 'recevier')
      .leftJoinAndSelect('f.sender', 'sender')
      .andWhere('recevier.id = :id', { id: user.id })
      .andWhere('f.status = :status', { status: FriendReqStatus.PENDING })
      .select([
        'f.id',
        'f.status',
        'f.createdAt',

        'sender.id',
        'sender.name',
        'sender.picture',
      ]);

    return pagination(Q, 1, 10);
  }

  async acceptOrCanele(
    type: FriendReqStatus,
    user: JwtPayload,
    requestId: number,
  ) {
    const frindShip = await this.friendRepo.findOneBy({
      id: requestId,
      recevierId: user.id,
      status: FriendReqStatus.PENDING,
    });

    if (!frindShip) throw new NotFoundException('friend ship not found');

    if (type === FriendReqStatus.CANCEL) {
      await this.friendRepo.delete({ id: requestId });
      return { msg: 'reject request success' };
    } else {
      await this.friendRepo.save({ ...frindShip, status: type });
      return { msg: 'accept request success' };
    }
  }
}
