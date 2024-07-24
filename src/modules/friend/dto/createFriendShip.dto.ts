import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFriendShip {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
