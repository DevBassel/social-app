import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLove } from './entities/postLove.entity';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLove)
    private readonly postLoveRepo: Repository<PostLove>,
  ) {}

  create(createPostDto: CreatePostDto, user: JwtPayload) {
    const post = this.postRepo.create({ ...createPostDto, userId: user.id });
    return this.postRepo.save(post);
  }

  async findAll(page: number, limit: number) {
    const Q = this.postRepo.createQueryBuilder('post');

    return pagination(Q, page, limit);
  }

  async findOne(id: number) {
    return this.postRepo.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto, user: JwtPayload) {
    const post = await this.postRepo.findOneBy({ id, userId: user.id });

    if (!post) throw new NotFoundException('post not found');

    return this.postRepo.save({ ...post, ...updatePostDto });
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
