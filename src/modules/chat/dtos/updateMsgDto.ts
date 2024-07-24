import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateMsgDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  content: string;
}
