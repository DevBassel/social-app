import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly notifyServices: NotificationService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: JwtPayload) {}

  async findAll(page, postId: number) {}

  findOne(id: number) {
    return this.commentRepo.findOneBy({ id });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: JwtPayload,
  ) {}

  async remove(id: number, user: JwtPayload) {}
}
