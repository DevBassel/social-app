import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRes } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { CreateUserWithGoogleDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ProviderType } from './enums/ProviderType.enum';
import { MediaService } from '../media/media.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  async createGoogle(data: CreateUserWithGoogleDto) {
    return this.userRepo.save(data);
  }

  createUser(data: RegisterUserDto) {
    return this.userRepo.save({
      ...data,
      name: `${data.first_name} ${data.last_name}`,
      provider: ProviderType.EMAIL,
    });
  }

  async getMe(user: JwtPayload) {
    return new UserRes(
      await this.userRepo.findOne({
        where: {
          id: user.id,
        },
      }),
    );
  }

  async updatePic(img: Express.Multer.File, user: JwtPayload) {
    const uploadedFile = await this.mediaService.create(img);
    const findUser = await this.findOne({ id: user.id });

    if (findUser.mediaId) {
      await this.mediaService.delete(findUser.mediaId);
    }

    await this.userRepo.save({
      ...findUser,
      picture: uploadedFile.url,
      media: uploadedFile,
    });

    return { msg: 'profile image has been updated' };
  }

  async findOne({
    id,
    email,
  }: {
    id?: number;
    email?: string;
    provider?: ProviderType;
  }) {
    const user = await this.userRepo.findOne({
      where: [{ id }, { email }],
    });

    return user;
  }

  findOneWithProvider(email: string, provider: ProviderType) {
    return this.userRepo.findOneBy({ email, provider });
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
