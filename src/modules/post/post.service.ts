import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLove } from './entities/postLove.entity';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { pagination } from 'src/utils/pagination';
import { MediaService } from '../media/media.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLove)
    private readonly postLoveRepo: Repository<PostLove>,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const media = file ? await this.mediaService.create(file) : null;
    return this.postRepo.save({ ...createPostDto, userId: user.id, media });
  }

  async findAll(page: number, limit: number) {
    const Q = this.postRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.media', 'm')
      .select(['p', 'm']);

    return pagination(Q, page, limit);
  }

  async findOne(id: number) {
    return this.postRepo.findOne({ where: { id }, relations: { media: true } });
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const post = await this.postRepo.findOne({
      where: { id, userId: user.id },
      relations: { media: true },
    });

    if (!post) throw new NotFoundException('post not found');

    if (post.mediaId && file) await this.mediaService.delete(post.mediaId);

    const media = file ? await this.mediaService.create(file) : null;

    return this.postRepo.save({
      ...post,
      ...updatePostDto,
      media: file ? media : post.media,
    });
  }

  async lovePost(id: number, user: JwtPayload) {
    const post = await this.postRepo.findOneBy({ id });
    if (!post) throw new NotFoundException('post not found');

    const checkLovePost = await this.postLoveRepo.findOneBy({
      postId: id,
      userId: user.id,
    });

    if (checkLovePost) {
      await this.postRepo.save({ ...post, totalLoves: post.totalLoves - 1 });
      await this.postLoveRepo.delete({ id, userId: user.id });
      return { msg: 'post love is removed' };
    } else {
      await this.postRepo.save({ ...post, totalLoves: post.totalLoves + 1 });
      await this.postLoveRepo.save({ postId: id, userId: user.id });
      return { msg: 'post love is add' };
    }
  }

  async remove(id: number, user: JwtPayload) {
    return this.postRepo.delete({ id, userId: user.id });
  }
}
