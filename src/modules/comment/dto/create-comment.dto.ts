import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @Type(() => Number)
  postId: number;

  @IsString()
  content: string;
}
