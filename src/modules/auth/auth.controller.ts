import { Controller, Post, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  GoogleLogin() {
    return this.authService.googleLogin();
  }

  @Get('google/callback')
  googleCallBack(@Query('code') code: string, @Res() res: Response) {
    return this.authService.GoogleCallBack(code, res);
  }
}
