import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  ParseEnumPipe,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { AuthRequest } from 'src/utils/authRequest';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';
import { FriendReqStatus } from './enums/friend-req-status.enum';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendDto, @Req() req: AuthRequest) {
    return this.friendsService.create(createFriendDto, req.user);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.friendsService.getFriends(req.user);
  }

  @Get('requests')
  findRequests(@Req() req: AuthRequest) {
    return this.friendsService.findRequests(req.user);
  }

  @Post(':type')
  acceptOrCancel(
    @Param('type', new ParseEnumPipe(FriendReqStatus)) type: FriendReqStatus,
    @Req() req: AuthRequest,
    @Body('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.friendsService.acceptOrCanele(type, req.user, requestId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    return this.friendsService.removeFriend(id, req.user);
  }
}
