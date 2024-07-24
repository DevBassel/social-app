import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.create(createCommentDto, req.user);
  }

  @Get()
  findAll(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.commentService.findAll(page, postId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.update(+id, updateCommentDto, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.remove(+id, req.user);
  }
}
