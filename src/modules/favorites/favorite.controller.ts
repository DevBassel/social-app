import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddToFav } from './dto/addToFav.dto';
import { JwtPayload } from '../auth/dto/jwtPayload';
import { JwtGuard } from '../auth/strategys/guards/jwt.guard';

@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Favoriets')
@ApiBearerAuth()
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favSarvice: FavoriteService) {}
  @Post()
  addToFav(
    @Body() payload: AddToFav,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.favSarvice.addToFav(payload.postId, req.user);
  }

  @Get()
  getFavorites(@Req() req: Request & { user: JwtPayload }) {
    return this.favSarvice.getFavoriets(req.user);
  }
}
