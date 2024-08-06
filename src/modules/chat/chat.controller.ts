import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthRequest } from 'src/utils/authRequest';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() data: CreateChatDto) {
    // console.log({ us: req.user });
    return this.chatService.create(data, req.user);
  }

  @Get()
  findAll(
    @Req() req: AuthRequest,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return this.chatService.findAll(req.user, +page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.chatService.findOne(+id, req.user);
  }
}
