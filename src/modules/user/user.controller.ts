import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@Req() req: Request & { user: JwtPayload }) {
    return this.userService.getMe(req.user);
  }

  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findOne(userId);
  }
  @Delete()
  removeUser(@Req() req: Request & { user: JwtPayload }) {
    return this.userService.removeUser(req.user);
  }
}
