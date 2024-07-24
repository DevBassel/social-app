import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class MsgDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  content: string;

  @IsNumber()
  @ApiProperty()
  reciverId: number;
}
