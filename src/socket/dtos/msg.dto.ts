import { IsNumber, IsObject } from 'class-validator';

export class MsgDto {
  @IsObject()
  msg: {
    content: string;
  };

  @IsNumber()
  userId: number;
}
