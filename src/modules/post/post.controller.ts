import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RoleGuard } from '../auth/strategys/guards/role.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';
import { RoleType } from 'src/decorators/enums/Roule.enum';
import { Role } from 'src/decorators/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Role(RoleType.Admin, RoleType.User)
  @UseInterceptors(FileInterceptor('media'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: JwtPayload },
  ) {
    // console.log({ createPostDto, file });
    return this.postService.create(createPostDto, file, req.user);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    // console.log(page);
    return this.postService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Post('love')
  lovePost(
    @Body('postId', ParseIntPipe) postId: number,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.postService.lovePost(postId, req.user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('media'))
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.postService.update(+id, updatePostDto, file, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.postService.remove(+id, req.user);
  }
}
