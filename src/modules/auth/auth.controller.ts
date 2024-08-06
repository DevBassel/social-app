import {
  Controller,
  Post,
  Get,
  Query,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from './strategys/guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  GoogleLogin() {
    return this.authService.googleLogin();
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
  googleCallBack(@Query('code') code: string, @Res() res: Response) {
    return this.authService.GoogleCallBack(code, res);
  }

  // ---------------------------------
  @Post('register')
  register(@Body() data: RegisterUserDto) {
    return this.authService.createUserWithEmailAndPassword(data);
  }

  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.authService.loginUserWithEmailAndPassword(data);
  }

  @UseGuards(JwtGuard)
  @Post('check-auth')
  checkAuth() {
    return this.authService.checkAuthStatus();
  }
}
