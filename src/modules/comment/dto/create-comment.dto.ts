import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @ApiProperty()
  postId: number;

  @IsString()
  @ApiProperty()
  content: string;

  @IsString()
  @IsOptional()
  media: string;
}
