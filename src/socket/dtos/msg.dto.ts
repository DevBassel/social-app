import { IsString } from 'class-validator';

export class MsgDto {
  @IsString()
  msg: string;
}
