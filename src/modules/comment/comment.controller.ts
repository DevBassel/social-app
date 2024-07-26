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
  UseInterceptors,
  UploadedFile,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.create(createCommentDto, file, req.user);
  }

  @Get()
  findAll(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.commentService.findAll(page, limit, postId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('media'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.update(+id, updateCommentDto, file, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.commentService.remove(+id, req.user);
  }
}
