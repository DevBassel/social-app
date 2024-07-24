import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { ActionType } from './ActionType.enum';

export class ActionDto {
  @ApiProperty()
  @IsNumber()
  requestId: number;

  @ApiProperty({
    description: 'Status Type',
    enum: ActionType, // Add enum information
    enumName: 'ActionType', // Optional: Provide a name for your enum
    example: ActionType.accept, // Example value
  })
  @IsEnum(ActionType)
  type: ActionType;
}
