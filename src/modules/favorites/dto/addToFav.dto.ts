import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToFav {
  @ApiProperty()
  @IsNumber()
  postId: number;
}
