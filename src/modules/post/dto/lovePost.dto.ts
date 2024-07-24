import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LovePostDto {
  @ApiProperty()
  @IsNumber()
  postId: number;
}
