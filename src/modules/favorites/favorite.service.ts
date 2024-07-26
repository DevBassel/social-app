import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './enteities/favorite.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { PostService } from '../post/post.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly favRepo: Repository<Favorite>,
    private readonly postService: PostService,
  ) {}
  async addToFav(postId: number, user: JwtPayload) {
    const checkPost = await this.postService.findOne(postId);
    if (!checkPost) throw new NotFoundException('post not found');

    const check = await this.favRepo.findOneBy({ postId, userId: user.id });
    if (check) {
      // remove from fav
      this.favRepo.delete({
        postId,
        userId: user.id,
      });

      return { status: false };
    } else {
      // add to fav
      this.favRepo.save({
        postId,
        userId: user.id,
      });

      return { status: true };
    }
  }

  async getFavoriets(user: JwtPayload) {
    const favs = await this.favRepo
      .createQueryBuilder('fav')
      .where('fav.userId = :id', { id: user.id })
      .leftJoinAndSelect('fav.post', 'post')
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'fav.id',
        'post.id',
        'post.content',
        'post.createdAt',
        'user.id',
        'user.name',
        'user.picture',
      ])
      .getMany();

    return favs;
  }
}
