import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateMsgDto {
  @IsNumber()
  @Type(() => Number)
  chatId: number;

  @IsString()
  content: string;
}
