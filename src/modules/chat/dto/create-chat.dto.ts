import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  recevierId: number;
}
