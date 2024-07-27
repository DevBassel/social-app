import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
    console.log({ us: req.user });
    return this.chatService.create(data, req.user);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.chatService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }
}
