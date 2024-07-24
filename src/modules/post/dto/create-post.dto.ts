import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  content: string;

  @IsOptional()
  media?: string;

  @IsString()
  lang: string;
}
