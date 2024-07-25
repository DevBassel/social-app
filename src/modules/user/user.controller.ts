import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthRequest } from 'src/utils/authRequest';

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

  @Patch('me/pic')
  @UseInterceptors(FileInterceptor('pic'))
  updateUserPic(
    @Req() req: AuthRequest,
    @UploadedFile() pic: Express.Multer.File,
  ) {
    return this.userService.updatePic(pic, req.user);
  }

  @Get(':userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findOne({ id: userId });
  }
  @Delete()
  removeUser(@Req() req: Request & { user: JwtPayload }) {
    return this.userService.removeUser(req.user);
  }
}
