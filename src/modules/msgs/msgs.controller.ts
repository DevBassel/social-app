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
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MsgsService } from './msgs.service';
import { CreateMsgDto } from './dto/create-msg.dto';
import { UpdateMsgDto } from './dto/update-msg.dto';
import { AuthRequest } from 'src/utils/authRequest';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('msgs')
export class MsgsController {
  constructor(private readonly msgsService: MsgsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  create(
    @Body() createMsgDto: CreateMsgDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    console.log(createMsgDto);
    return this.msgsService.create(createMsgDto, file, req.user);
  }

  @Get()
  findAll(@Query('chatId', ParseIntPipe) chatId: number) {
    return this.msgsService.findAll(chatId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.msgsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('media'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMsgDto: UpdateMsgDto,
    @Req() req: AuthRequest,
  ) {
    return this.msgsService.update(+id, updateMsgDto, file, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.msgsService.remove(+id, req.user);
  }
}
