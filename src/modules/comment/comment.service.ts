import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { NotificationService } from '../notification/notification.service';
import { MediaService } from '../media/media.service';
import { pagination } from 'src/utils/pagination';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly notifyServices: NotificationService,
    private readonly mediaService: MediaService,
    private readonly postService: PostService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const post = await this.postService.findOne(createCommentDto.postId);
    // console.log(createCommentDto);

    if (!post) throw new NotFoundException('post not found');

    const media = file ? await this.mediaService.create(file) : null;

    return this.commentRepo.save({
      ...createCommentDto,
      media,
      userId: user.id,
    });
  }

  async findAll(page: number, limit: number, postId: number) {
    const Q = this.commentRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.media', 'm')
      .leftJoinAndSelect('c.user', 'u')
      .where('c.postId = :postId', { postId })
      .select(['c', 'm', 'u.name', 'u.picture']);
    return pagination(Q, page, limit);
  }

  findOne(id: number) {
    return this.commentRepo.findOneBy({ id });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id, userId: user.id },
      relations: { media: true },
    });

    if (!comment) throw new NotFoundException('comment is not found');

    if (comment.media && file) await this.mediaService.delete(comment.media.id);

    const media = file ? await this.mediaService.create(file) : null;

    return this.commentRepo.save({ ...comment, ...updateCommentDto, media });
  }

  async remove(id: number, user: JwtPayload) {
    return this.commentRepo.delete({ id, userId: user.id });
  }
}
