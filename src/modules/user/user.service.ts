import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRes } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getMe(user: JwtPayload) {
    return new UserRes(
      await this.userRepo.findOne({
        where: {
          id: user.id,
        },
        select: ['id', 'name', 'email', 'picture', 'role', 'createdAt'],
      }),
    );
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) throw new NotFoundException();

    return user;
  }

  async removeUser({ email, id }: JwtPayload) {
    if (!email) throw new BadRequestException();
    const deleteUser: DeleteResult = await this.userRepo.delete({
      email,
      id,
    });
    return deleteUser;
  }
}
