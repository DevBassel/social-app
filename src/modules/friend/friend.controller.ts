import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFriendShip } from './dto/createFriendShip.dto';
import { ActionDto } from './dto/action.dto';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiTags('friends')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  create(
    @Body() payload: CreateFriendShip,
    @Req() req: Request & { user: JwtPayload },
  ) {
    console.log(payload);
    return this.friendService.create(payload.userId, req.user);
  }

  @Get('requests')
  getMyRequsets(@Req() req: Request & { user: JwtPayload }) {
    return this.friendService.getMyRequsets(req.user);
  }
  @Get()
  getMyFriends(@Req() req: Request & { user: JwtPayload }) {
    return this.friendService.getMyFriends(req.user);
  }

  @Post('action')
  accept(
    @Body() payload: ActionDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.friendService.action(payload.requestId, payload.type, req.user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.friendService.remove(id, req.user);
  }
}
