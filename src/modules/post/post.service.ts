import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLove } from './entities/postLove.entity';
import { JwtPayload } from '../auth/dto/jwtPayload';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLove) private readonly postLove: Repository<PostLove>,
  ) {}

  create(createPostDto: CreatePostDto, user: JwtPayload) {
    const post = this.postRepo.create({ ...createPostDto, userId: user.id });
    return this.postRepo.save(post);
  }

  async lovePost(postId: number, user: JwtPayload) {}

  async findAll(page: number, user: JwtPayload) {}

  async findOne(id: number, user: JwtPayload) {}

  async update(id: number, updatePostDto: UpdatePostDto, user: JwtPayload) {}

  async remove(id: number, user: JwtPayload) {}
}
